import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import db from '@adonisjs/lucid/services/db'

export default class PopulateStatus extends BaseCommand {
  static commandName = 'populate:status'
  static description = 'Show generation job counts, token usage and failures'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    const rows = await db
      .from('generation_jobs')
      .select('job', 'status')
      .count('* as count')
      .sum('tokens_in as tokens_in')
      .sum('tokens_out as tokens_out')
      .groupBy('job', 'status')
      .orderBy('job')
      .orderBy('status')

    if (rows.length === 0) {
      this.logger.info('No generation jobs yet')
      return
    }

    const table = this.ui.table().head(['Job', 'Status', 'Count', 'Tokens in', 'Tokens out'])
    for (const r of rows) {
      table.row([
        r.job,
        r.status,
        String(r.count),
        String(r.tokens_in ?? 0),
        String(r.tokens_out ?? 0),
      ])
    }
    table.render()

    const failures = await db
      .from('generation_jobs')
      .where('status', 'failed')
      .orderBy('updated_at', 'desc')
      .limit(10)
      .select('id', 'job', 'input_ref', 'error', 'attempts')

    if (failures.length > 0) {
      this.logger.warning('Recent failures:')
      for (const f of failures) {
        this.logger.warning(`  ${f.job} ${f.id} (${f.attempts} attempts): ${f.error}`)
      }
    }
  }
}
