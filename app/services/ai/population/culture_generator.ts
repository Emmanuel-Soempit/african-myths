import vine from '@vinejs/vine'
import Culture from '#models/culture'
import EthnicGroup from '#models/ethnic_group'
import GenerationJob from '#models/generation_job'
import { cultureResponseSchema } from '#validators/ai'
import { deepseekChatJson } from '#services/ai/ai_clients'
import { culturePrompt } from '#services/ai/prompts'
import { PopulationSupport } from '#services/ai/population/support'
import type { JobContext, JobOutcome } from '#services/ai/population/job_runner'

/**
 * Stage C — generate one culture per ethnic group that doesn't have one.
 * Cultures are created as status='pending' for admin review, authored by
 * the AI Curator system user.
 */
export class CultureGeneratorService {
  static async enqueueJobs(options: {
    groupId?: string
    limit?: number
    force?: boolean
  }): Promise<number> {
    let query = EthnicGroup.query().orderBy('canonical_name', 'asc')
    if (options.groupId) {
      query = query.where('id', options.groupId)
    }
    const groups = await query.limit(options.limit ?? 500)

    let enqueued = 0
    for (const group of groups) {
      const hasCulture = await group.related('cultures').query().first()
      if (hasCulture && !options.force) continue

      const existing = await GenerationJob.query()
        .where('job', 'culture')
        .where('inputRef', group.id)
        .whereIn('status', ['pending', 'running', 'done', 'flagged'])
        .first()
      if (existing && !options.force) continue

      await GenerationJob.create({ job: 'culture', inputRef: group.id, status: 'pending' })
      enqueued++
    }
    return enqueued
  }

  static async run(job: GenerationJob, ctx: JobContext): Promise<JobOutcome> {
    const group = await EthnicGroup.findOrFail(job.inputRef)

    const existingCulture = await group.related('cultures').query().first()
    if (existingCulture) {
      return {
        status: 'skipped',
        entityType: 'culture',
        entityId: existingCulture.id,
      }
    }

    await group.load('ethnicGroupCountries', (q) => q.preload('country'))

    const response = await deepseekChatJson(
      culturePrompt({
        canonicalName: group.canonicalName,
        description: group.note || 'No description available.',
        countries: group.ethnicGroupCountries.map((c) => c.country.name),
      })
    )

    const parsed = await vine.validate({ schema: cultureResponseSchema, data: response.data })

    if (ctx.dryRun) {
      ctx.log(`[dry-run] culture for ${group.canonicalName}: ${parsed.name}`)
      return {
        status: 'done',
        entityType: 'culture',
        usage: response.usage,
        payload: parsed,
        model: response.model,
      }
    }

    const curator = await PopulationSupport.ensureAiCurator()

    const culture = await Culture.create({
      name: parsed.name,
      thumbnail: '',
      history: parsed.history,
      language: parsed.language ?? '',
      status: 'pending',
      ethnicGroupId: group.id,
      authorId: curator.id,
      aiGenerated: true,
    })

    ctx.log(`Culture '${culture.name}' created for ${group.canonicalName} (pending review)`)

    return {
      status: 'done',
      entityType: 'culture',
      entityId: culture.id,
      usage: response.usage,
      payload: parsed,
      model: response.model,
    }
  }
}
