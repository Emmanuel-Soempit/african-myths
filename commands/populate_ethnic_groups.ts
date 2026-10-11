import { BaseCommand, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class PopulateEthnicGroups extends BaseCommand {
  static commandName = 'populate:ethnic-groups'
  static description =
    'Stage A: generate the African ethnic group list per country (DeepSeek + Jev dedupe)'

  static options: CommandOptions = {
    startApp: true,
  }

  @flags.string({ description: 'Limit to one country (ISO alpha-2 code or name fragment)' })
  declare country: string

  @flags.number({ description: 'Max countries to enqueue', default: 54 })
  declare limit: number

  @flags.number({ description: 'Max pending jobs to process this run' })
  declare batch: number

  @flags.number({ description: 'Max total tokens this run (overrides AI_TOKEN_BUDGET)' })
  declare budget: number

  @flags.boolean({ description: 'Call the APIs but write nothing to the database', default: false })
  declare dryRun: boolean

  @flags.boolean({
    description: 'Re-run countries that already have a group-list job',
    default: false,
  })
  declare force: boolean

  async run() {
    const { EthnicGroupListService } = await import('#services/ai/population/ethnic_group_list')
    const { JobRunner } = await import('#services/ai/population/job_runner')

    const enqueued = await EthnicGroupListService.enqueueJobs({
      country: this.country,
      limit: this.limit,
      force: this.force,
    })
    this.logger.info(`Enqueued ${enqueued} group-list job(s)`)

    const result = await JobRunner.process(
      'group-list',
      {
        batch: this.batch,
        budget: this.budget,
        dryRun: this.dryRun,
        log: (m) => this.logger.info(m),
      },
      (job, ctx) => EthnicGroupListService.run(job, ctx)
    )

    this.logger.info(
      `Done: ${result.processed} processed, ${result.done} done, ${result.skipped} skipped, ${result.failed} failed, ${result.tokensUsed} tokens`
    )
  }
}
