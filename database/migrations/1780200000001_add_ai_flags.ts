import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  private tables = ['ethnic_groups', 'sub_ethnic_groups', 'cultures']

  async up() {
    for (const tableName of this.tables) {
      this.schema.alterTable(tableName, (table) => {
        table.boolean('ai_generated').defaultTo(false)
        table.timestamp('ai_reviewed_at').nullable()
      })
    }
  }

  async down() {
    for (const tableName of this.tables) {
      this.schema.alterTable(tableName, (table) => {
        table.dropColumn('ai_generated')
        table.dropColumn('ai_reviewed_at')
      })
    }
  }
}
