import env from '#start/env'
import GenerationJob, {
  type GenerationJobKind,
  type GenerationJobStatus,
  type GenerationEntityType,
} from '#models/generation_job'
import { PROMPT_VERSION } from '#services/ai/prompts'
import type { TokenUsage } from '#services/ai/ai_clients'

export interface JobContext {
  dryRun: boolean
  log: (message: string) => void
}

export interface JobOutcome {
  status: Extract<GenerationJobStatus, 'done' | 'flagged' | 'skipped'>
  entityType?: GenerationEntityType
  entityId?: string
  usage?: TokenUsage
  payload?: unknown
  model?: string
}

interface ProcessOptions {
  batch?: number
  budget?: number
  dryRun?: boolean
  log?: (message: string) => void
}

/**
 * Claims pending generation_jobs rows of one kind and runs a handler on each.
 * The queue lives in the DB, so interrupted runs resume where they stopped.
 */
export class JobRunner {
  static async process(
    kind: GenerationJobKind,
    options: ProcessOptions,
    handler: (job: GenerationJob, ctx: JobContext) => Promise<JobOutcome>
  ) {
    const batch = options.batch ?? 25
    const budget = options.budget ?? env.get('AI_TOKEN_BUDGET') ?? Number.MAX_SAFE_INTEGER
    const log = options.log ?? (() => {})

    const jobs = await GenerationJob.query()
      .where('job', kind)
      .where('status', 'pending')
      .orderBy('createdAt', 'asc')
      .limit(batch)

    if (jobs.length === 0) {
      log(`No pending ${kind} jobs`)
      return { processed: 0, done: 0, flagged: 0, skipped: 0, failed: 0, tokensUsed: 0 }
    }

    const ctx: JobContext = { dryRun: options.dryRun ?? false, log }
    const result = { processed: 0, done: 0, flagged: 0, skipped: 0, failed: 0, tokensUsed: 0 }

    for (const job of jobs) {
      if (result.tokensUsed >= budget) {
        log(`Token budget reached (${result.tokensUsed}/${budget}) — stopping`)
        break
      }

      result.processed++
      job.status = 'running'
      job.attempts += 1
      if (!ctx.dryRun) await job.save()

      try {
        const outcome = await handler(job, ctx)

        job.status = outcome.status
        job.entityType = outcome.entityType ?? job.entityType
        job.entityId = outcome.entityId ?? job.entityId
        job.payload = (outcome.payload as Record<string, any>) ?? job.payload
        job.model = outcome.model ?? job.model
        job.promptVersion = PROMPT_VERSION
        if (outcome.usage) {
          job.tokensIn += outcome.usage.input
          job.tokensOut += outcome.usage.output
          result.tokensUsed += outcome.usage.input + outcome.usage.output
        }
        result[outcome.status]++
      } catch (error) {
        job.status = 'failed'
        job.error = error instanceof Error ? error.message.slice(0, 4000) : String(error)
        result.failed++
        log(`Job ${job.id} failed: ${job.error}`)
      }

      if (!ctx.dryRun) {
        await job.save()
      } else {
        job.status = 'pending'
      }
    }

    return result
  }
}
