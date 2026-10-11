import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'generation_jobs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()

      // Which stage produced/owns this job
      table.enum('job', ['group-list', 'group-enrich', 'culture']).notNullable()

      // What the stage consumes: country id (group-list) or ethnic group id (group-enrich, culture)
      table.string('input_ref').notNullable()

      // What the stage produced, once finished
      table.enum('entity_type', ['ethnic_group', 'sub_ethnic_group', 'culture']).nullable()
      table.uuid('entity_id').nullable()

      table
        .enum('status', ['pending', 'running', 'done', 'flagged', 'failed', 'skipped'])
        .defaultTo('pending')
      table.integer('attempts').defaultTo(0)

      table.string('model')
      table.string('prompt_version')
      table.integer('tokens_in').defaultTo(0)
      table.integer('tokens_out').defaultTo(0)

      table.text('error')
      table.jsonb('payload')

      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.index(['job', 'status'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
