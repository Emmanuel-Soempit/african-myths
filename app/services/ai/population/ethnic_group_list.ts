import vine from '@vinejs/vine'
import Country from '#models/country'
import EthnicGroup from '#models/ethnic_group'
import GenerationJob from '#models/generation_job'
import { groupListResponseSchema } from '#validators/ai'
import { deepseekChatJson, jevEvaluate } from '#services/ai/ai_clients'
import { groupListPrompt } from '#services/ai/prompts'
import { PopulationSupport, AI_SOURCE } from '#services/ai/population/support'
import type { JobContext, JobOutcome } from '#services/ai/population/job_runner'

const JEV_DEDUPE_CONFIDENCE = 0.6

/**
 * Stage A — list ethnic groups per African country with DeepSeek,
 * dedupe against existing rows (exact match first, then Jev choice),
 * insert new ai_generated groups and enqueue group-enrich jobs.
 */
export class EthnicGroupListService {
  static async enqueueJobs(options: {
    country?: string
    limit?: number
    force?: boolean
  }): Promise<number> {
    let query = Country.query().orderBy('name', 'asc')
    if (options.country) {
      const term = options.country.trim()
      if (term.length <= 3) {
        // ISO codes only — a 2-letter code must not substring-match names
        // (e.g. "NG" would otherwise match Angola, Congo, ...).
        query = query
          .where('iso_alpha_2', term.toUpperCase())
          .orWhere('iso_alpha_3', term.toUpperCase())
      } else {
        query = query.where('name', 'ilike', `%${term}%`)
      }
    }
    const countries = await query.limit(options.limit ?? 54)

    let enqueued = 0
    for (const country of countries) {
      const existing = await GenerationJob.query()
        .where('job', 'group-list')
        .where('inputRef', country.id)
        .whereIn('status', ['pending', 'running', 'done', 'flagged'])
        .first()
      if (existing && !options.force) continue

      await GenerationJob.create({ job: 'group-list', inputRef: country.id, status: 'pending' })
      enqueued++
    }
    return enqueued
  }

  static async run(job: GenerationJob, ctx: JobContext): Promise<JobOutcome> {
    const country = await Country.findOrFail(job.inputRef)
    const totalUsage = { input: 0, output: 0 }

    const response = await deepseekChatJson(groupListPrompt(country.name))
    PopulationSupport.addUsage(totalUsage, response.usage)

    const parsed = await vine.validate({ schema: groupListResponseSchema, data: response.data })

    const fallbackLanguage = await PopulationSupport.ensureUnspecifiedLanguage()

    // Existing names for dedupe: canonical names + aliases (capped for Jev state size)
    const existingGroups = await EthnicGroup.query()
      .select('id', 'canonical_name')
      .preload('ethnicNameAliases', (q) => q.select('name_variant'))
      .orderBy('canonical_name', 'asc')
      .limit(400)

    const created: string[] = []
    const merged: string[] = []
    const skipped: string[] = []

    for (const candidate of parsed.groups) {
      const match = existingGroups.find(
        (g) =>
          g.canonicalName.toLowerCase() === candidate.canonicalName.toLowerCase() ||
          g.ethnicNameAliases.some(
            (a) => a.nameVariant.toLowerCase() === candidate.canonicalName.toLowerCase()
          ) ||
          (candidate.alternateNames ?? []).some(
            (alt) =>
              g.canonicalName.toLowerCase() === alt.toLowerCase() ||
              g.ethnicNameAliases.some((a) => a.nameVariant.toLowerCase() === alt.toLowerCase())
          )
      )

      if (match) {
        const added = await this.mergeAliases(match, candidate, ctx)
        merged.push(`${candidate.canonicalName} → ${match.canonicalName} (+${added} aliases)`)
        continue
      }

      // Jev dedupe: could this be the same group under a different name?
      const duplicate = await this.jevFindDuplicate(candidate, existingGroups, country.name)
      PopulationSupport.addUsage(totalUsage, duplicate.usage)

      if (duplicate.match) {
        const added = await this.mergeAliases(duplicate.match, candidate, ctx)
        merged.push(
          `${candidate.canonicalName} → ${duplicate.match.canonicalName} (+${added} aliases, jev)`
        )
        continue
      }

      if (ctx.dryRun) {
        created.push(`[dry-run] ${candidate.canonicalName}`)
        continue
      }

      const group = await EthnicGroup.create({
        canonicalName: candidate.canonicalName,
        languageId: fallbackLanguage.id,
        note: '',
        aiGenerated: true,
      })
      const added = await this.mergeAliases(group, candidate, ctx)
      existingGroups.push(group)

      await GenerationJob.create({
        job: 'group-enrich',
        inputRef: group.id,
        status: 'pending',
      })
      created.push(`${candidate.canonicalName} (+${added} aliases)`)
    }

    const prefix = ctx.dryRun ? '[dry-run] ' : ''
    ctx.log(
      `${prefix}${country.name}: ${created.length} created, ${merged.length} merged, ${skipped.length} skipped`
    )

    return {
      status: 'done',
      entityType: 'ethnic_group',
      usage: totalUsage,
      payload: { country: country.name, created, merged, skipped, raw: parsed },
      model: response.model,
    }
  }

  /** Add any alternate names not already recorded on the group. */
  private static async mergeAliases(
    group: EthnicGroup,
    candidate: { alternateNames?: string[] },
    ctx: JobContext
  ): Promise<number> {
    if (ctx.dryRun) return 0
    const candidateNames = [
      ...(candidate.alternateNames ?? []),
      (candidate as { canonicalName?: string }).canonicalName,
    ].filter(Boolean) as string[]

    await group.load('ethnicNameAliases')
    const known = new Set(
      [group.canonicalName, ...group.ethnicNameAliases.map((a) => a.nameVariant)].map((n) =>
        n.toLowerCase()
      )
    )

    const newAliases = candidateNames.filter((n) => !known.has(n.toLowerCase()))
    if (newAliases.length > 0) {
      await group.related('ethnicNameAliases').createMany(
        newAliases.map((nameVariant) => ({
          nameVariant,
          langaugeOfNameVariant: null,
          source: AI_SOURCE,
        }))
      )
    }
    return newAliases.length
  }

  private static async jevFindDuplicate(
    candidate: { canonicalName: string; alternateNames?: string[] },
    existingGroups: EthnicGroup[],
    countryName: string
  ): Promise<{ match: EthnicGroup | null; usage: { input: number; output: number } }> {
    if (existingGroups.length === 0) {
      return { match: null, usage: { input: 0, output: 0 } }
    }

    const criteria: Record<string, string> = { none: 'It is a distinct new ethnic group' }
    for (const g of existingGroups) {
      criteria[g.canonicalName] = `The existing group known as ${g.canonicalName}`
    }

    const state =
      `Candidate ethnic group for ${countryName}: "${candidate.canonicalName}"` +
      (candidate.alternateNames?.length
        ? `, also known as: ${candidate.alternateNames.join(', ')}`
        : '')

    try {
      const { answers, usage } = await jevEvaluate(state, {
        same: {
          type: 'choice',
          instructions:
            'Is the candidate the same ethnic group as one of the existing groups below, under a different name or spelling? Choose "none" if it is distinct.',
          criteria,
        },
      })

      const answer = answers.same
      if (
        answer?.type === 'choice' &&
        answer.choice &&
        answer.choice !== 'none' &&
        (answer.confidence ?? 0) >= JEV_DEDUPE_CONFIDENCE
      ) {
        const match = existingGroups.find(
          (g) => g.canonicalName.toLowerCase() === answer.choice!.toLowerCase()
        )
        return { match: match ?? null, usage }
      }
      return { match: null, usage }
    } catch (error) {
      // Jev unavailable — fail open (treat as new group) but surface the error
      console.warn('Jev dedupe failed, treating candidate as new:', error)
      return { match: null, usage: { input: 0, output: 0 } }
    }
  }
}
