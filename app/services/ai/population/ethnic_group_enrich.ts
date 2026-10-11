import vine from '@vinejs/vine'
import Country from '#models/country'
import EthnicGroup from '#models/ethnic_group'
import GenerationJob from '#models/generation_job'
import Language from '#models/language'
import SubEthnicGroup from '#models/sub_ethnic_group'
import { groupEnrichResponseSchema } from '#validators/ai'
import { deepseekChatJson, jevEvaluate } from '#services/ai/ai_clients'
import { groupEnrichPrompt } from '#services/ai/prompts'
import { PopulationSupport, AI_SOURCE } from '#services/ai/population/support'
import type { JobContext, JobOutcome } from '#services/ai/population/job_runner'

/**
 * Stage B — enrich one ethnic group: description, aliases, countries,
 * sub-groups, and a best-match language_id (via Jev choice).
 */
export class EthnicGroupEnrichService {
  /**
   * Enqueue enrich jobs for ethnic groups missing a note
   * (or all of them when force=true).
   */
  static async enqueueJobs(options: {
    groupId?: string
    limit?: number
    force?: boolean
  }): Promise<number> {
    let query = EthnicGroup.query().orderBy('canonical_name', 'asc')
    if (options.groupId) {
      query = query.where('id', options.groupId)
    } else if (!options.force) {
      query = query.where((q) => q.whereNull('note').orWhere('note', ''))
    }
    const groups = await query.limit(options.limit ?? 500)

    let enqueued = 0
    for (const group of groups) {
      const existing = await GenerationJob.query()
        .where('job', 'group-enrich')
        .where('inputRef', group.id)
        .whereIn('status', ['pending', 'running', 'done', 'flagged'])
        .first()
      if (existing && !options.force) continue

      await GenerationJob.create({ job: 'group-enrich', inputRef: group.id, status: 'pending' })
      enqueued++
    }
    return enqueued
  }

  static async run(job: GenerationJob, ctx: JobContext): Promise<JobOutcome> {
    const group = await EthnicGroup.findOrFail(job.inputRef)
    const totalUsage = { input: 0, output: 0 }

    await group.load('ethnicGroupCountries', (q) => q.preload('country'))
    await group.load('ethnicNameAliases')

    const response = await deepseekChatJson(
      groupEnrichPrompt({
        canonicalName: group.canonicalName,
        countries: group.ethnicGroupCountries.map((c) => c.country.name),
        existingAliases: group.ethnicNameAliases.map((a) => a.nameVariant),
      })
    )
    PopulationSupport.addUsage(totalUsage, response.usage)

    const parsed = await vine.validate({
      schema: groupEnrichResponseSchema,
      data: response.data,
    })

    if (ctx.dryRun) {
      ctx.log(`[dry-run] enrich ${group.canonicalName}: ${JSON.stringify(parsed).slice(0, 400)}`)
      return {
        status: 'done',
        entityType: 'ethnic_group',
        entityId: group.id,
        usage: totalUsage,
        payload: parsed,
        model: response.model,
      }
    }

    // Language: pick best match from languages table via Jev
    const language = await this.matchLanguage(parsed.primaryLanguageName, group.canonicalName)
    if (language.usage) PopulationSupport.addUsage(totalUsage, language.usage)

    // Countries
    const knownCountryIds = new Set(group.ethnicGroupCountries.map((c) => c.countryId))
    let countriesAdded = 0
    for (const c of parsed.countries ?? []) {
      const country = await Country.findBy('iso_alpha_2', c.isoAlpha2.toUpperCase())
      if (!country || knownCountryIds.has(country.id)) continue
      await group.related('ethnicGroupCountries').create({
        countryId: country.id,
        isPrimaryHome: c.isPrimaryHome ?? false,
        populationEstimate: c.populationEstimate ?? 'unknown',
        source: AI_SOURCE,
      })
      knownCountryIds.add(country.id)
      countriesAdded++
    }

    // Aliases
    const knownAliases = new Set(
      [group.canonicalName, ...group.ethnicNameAliases.map((a) => a.nameVariant)].map((n) =>
        n.toLowerCase()
      )
    )
    let aliasesAdded = 0
    for (const nameVariant of parsed.alternateNames ?? []) {
      if (knownAliases.has(nameVariant.toLowerCase())) continue
      await group.related('ethnicNameAliases').create({
        nameVariant,
        langaugeOfNameVariant: null,
        source: AI_SOURCE,
      })
      knownAliases.add(nameVariant.toLowerCase())
      aliasesAdded++
    }

    // Sub-groups
    const existingSubGroups = await group.related('subEthnicGroups').query()
    const knownSubNames = new Set(existingSubGroups.map((s) => s.canonicalName.toLowerCase()))
    let subGroupsAdded = 0
    for (const sub of parsed.subGroups ?? []) {
      if (knownSubNames.has(sub.canonicalName.toLowerCase())) continue
      const subGroup = await SubEthnicGroup.create({
        ethnicGroupId: group.id,
        canonicalName: sub.canonicalName,
        note: sub.description ?? '',
        aiGenerated: true,
      })
      for (const iso of sub.countries ?? []) {
        const country = await Country.findBy('iso_alpha_2', iso.toUpperCase())
        if (!country) continue
        await subGroup.related('subEthnicGroupCountries').create({
          countryId: country.id,
          isPrimaryHome: false,
          populationEstimate: 'unknown',
          source: AI_SOURCE,
        })
      }
      knownSubNames.add(sub.canonicalName.toLowerCase())
      subGroupsAdded++
    }

    group.note = parsed.description
    if (language.id) group.languageId = language.id
    group.aiGenerated = true
    await group.save()

    // Quality gate via Jev
    const gate = await this.jevQualityGate(group.canonicalName, parsed.description)
    PopulationSupport.addUsage(totalUsage, gate.usage)

    // Hand off to stage C: ensure a culture job exists for this group
    const hasCultureJob = await GenerationJob.query()
      .where('job', 'culture')
      .where('inputRef', group.id)
      .whereIn('status', ['pending', 'running', 'done', 'flagged'])
      .first()
    const cultureCount = await group.related('cultures').query().count('* as total')
    if (!hasCultureJob && Number(cultureCount[0].$extras.total) === 0) {
      await GenerationJob.create({ job: 'culture', inputRef: group.id, status: 'pending' })
    }

    ctx.log(
      `${group.canonicalName}: +${countriesAdded} countries, +${aliasesAdded} aliases, +${subGroupsAdded} sub-groups, lang=${language.name}${gate.flagged ? ' [FLAGGED]' : ''}`
    )

    return {
      status: gate.flagged ? 'flagged' : 'done',
      entityType: 'ethnic_group',
      entityId: group.id,
      usage: totalUsage,
      payload: parsed,
      model: response.model,
    }
  }

  private static async matchLanguage(
    languageName: string | undefined,
    groupName: string
  ): Promise<{ id: string | null; name: string; usage?: { input: number; output: number } }> {
    const fallback = await PopulationSupport.ensureUnspecifiedLanguage()
    if (!languageName) return { id: fallback.id, name: fallback.name }

    const candidates = await Language.query()
      .where('name', 'ilike', `%${languageName}%`)
      .orderBy('name', 'asc')
      .limit(10)

    if (candidates.length === 0) return { id: fallback.id, name: fallback.name }
    if (candidates.length === 1) return { id: candidates[0].id, name: candidates[0].name }

    try {
      const criteria: Record<string, string> = { none: 'None of these languages match' }
      candidates.forEach((c, i) => {
        criteria[`lang_${i}`] = c.name
      })
      const { answers, usage } = await jevEvaluate(
        `The ethnic group "${groupName}" reportedly speaks "${languageName}".`,
        {
          match: {
            type: 'choice',
            instructions: 'Which language is the best match for the one the group speaks?',
            criteria,
          },
        }
      )
      const answer = answers.match
      if (answer?.choice && answer.choice !== 'none' && (answer.confidence ?? 0) >= 0.5) {
        const idx = Number.parseInt(answer.choice.replace('lang_', ''), 10)
        const chosen = candidates[idx]
        if (chosen) return { id: chosen.id, name: chosen.name, usage }
      }
      return { id: candidates[0].id, name: candidates[0].name, usage }
    } catch (error) {
      console.warn('Jev language match failed, using first candidate:', error)
      return { id: candidates[0].id, name: candidates[0].name }
    }
  }

  private static async jevQualityGate(
    groupName: string,
    description: string
  ): Promise<{ flagged: boolean; usage: { input: number; output: number } }> {
    try {
      const { answers, usage } = await jevEvaluate(
        `Generated description of the ${groupName} ethnic group:\n\n${description}`,
        {
          quality: {
            type: 'score',
            instructions:
              'How plausible and on-topic is this description as an encyclopedia entry about the named ethnic group?',
            criteria: [
              'Clearly wrong, off-topic, or fabricated',
              'Mostly plausible but vague or partly questionable',
              'Accurate and appropriately detailed',
            ],
          },
          about_group: {
            type: 'noul',
            instructions: 'Does the text actually describe the named ethnic group?',
          },
        }
      )
      const score = answers.quality?.score ?? 2
      const about = answers.about_group?.noul ?? 1
      return { flagged: score < 1 || about < 0.5, usage }
    } catch (error) {
      console.warn('Jev quality gate failed, marking flagged for review:', error)
      return { flagged: true, usage: { input: 0, output: 0 } }
    }
  }
}
