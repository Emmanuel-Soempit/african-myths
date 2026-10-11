import { BaseCommand, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class EnrichEthnicGroups extends BaseCommand {
  static commandName = 'populate:enrich-ethnic-groups'
  static description =
    'Stage B: fill in descriptions, aliases, countries, sub-groups and language for ethnic groups'

  static options: CommandOptions = {
    startApp: true,
  }

  @flags.string({ description: 'Enrich a single ethnic group by id' })
  declare group: string

  @flags.number({ description: 'Max groups to enqueue', default: 500 })
  declare limit: number

  @flags.number({ description: 'Max pending jobs to process this run', default: 25 })
  declare batch: number

  @flags.number({ description: 'Max total tokens this run (overrides AI_TOKEN_BUDGET)' })
  declare budget: number

  @flags.boolean({ description: 'Call the APIs but write nothing to the database', default: false })
  declare dryRun: boolean

  @flags.boolean({ description: 'Re-enrich groups that already have a note', default: false })
  declare force: boolean

  async run() {
    const { EthnicGroupEnrichService } = await import('#services/ai/population/ethnic_group_enrich')
    const { JobRunner } = await import('#services/ai/population/job_runner')

    const enqueued = await EthnicGroupEnrichService.enqueueJobs({
      groupId: this.group,
      limit: this.limit,
      force: this.force,
    })
    this.logger.info(`Enqueued ${enqueued} group-enrich job(s)`)

    const result = await JobRunner.process(
      'group-enrich',
      {
        batch: this.batch,
        budget: this.budget,
        dryRun: this.dryRun,
        log: (m) => this.logger.info(m),
      },
      (job, ctx) => EthnicGroupEnrichService.run(job, ctx)
    )

    this.logger.info(
      `Done: ${result.processed} processed, ${result.done} done, ${result.flagged} flagged, ${result.skipped} skipped, ${result.failed} failed, ${result.tokensUsed} tokens`
    )
  }
}
