import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'ethnic_groups'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()


      table.uuid('language_id').references('languages.id').onDelete('CASCADE').notNullable()

      table.string('canonical_name').notNullable()
      table.string('note').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}