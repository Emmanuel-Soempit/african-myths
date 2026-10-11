import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'ethnic_name_aliases'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()

      table.uuid('ethnic_group_id').references('ethnic_groups.id').onDelete('CASCADE').notNullable()
      table.string('name_variant').notNullable()
      table.string('langauge_of_name_variant')
      table.string('source')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}