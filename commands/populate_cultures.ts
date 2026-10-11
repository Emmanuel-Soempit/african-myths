import { BaseCommand, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class PopulateCultures extends BaseCommand {
  static commandName = 'populate:cultures'
  static description =
    'Stage C: generate a culture (name, history, language) for each ethnic group that lacks one'

  static options: CommandOptions = {
    startApp: true,
  }

  @flags.string({ description: 'Generate a culture for a single ethnic group id' })
  declare group: string

  @flags.number({ description: 'Max groups to enqueue', default: 500 })
  declare limit: number

  @flags.number({ description: 'Max pending jobs to process this run', default: 25 })
  declare batch: number

  @flags.number({ description: 'Max total tokens this run (overrides AI_TOKEN_BUDGET)' })
  declare budget: number

  @flags.boolean({ description: 'Call the APIs but write nothing to the database', default: false })
  declare dryRun: boolean

  @flags.boolean({
    description: 'Generate even for groups that already have a culture',
    default: false,
  })
  declare force: boolean

  async run() {
    const { CultureGeneratorService } = await import('#services/ai/population/culture_generator')
    const { JobRunner } = await import('#services/ai/population/job_runner')

    const enqueued = await CultureGeneratorService.enqueueJobs({
      groupId: this.group,
      limit: this.limit,
      force: this.force,
    })
    this.logger.info(`Enqueued ${enqueued} culture job(s)`)

    const result = await JobRunner.process(
      'culture',
      {
        batch: this.batch,
        budget: this.budget,
        dryRun: this.dryRun,
        log: (m) => this.logger.info(m),
      },
      (job, ctx) => CultureGeneratorService.run(job, ctx)
    )

    this.logger.info(
      `Done: ${result.processed} processed, ${result.done} done, ${result.skipped} skipped, ${result.failed} failed, ${result.tokensUsed} tokens`
    )
  }
}
