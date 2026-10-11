import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cultures'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string("name")
      table.string('thumbnail')
      table.string("history")
      table.string("language")

      table.uuid("ethnic_group_id").references("ethnic_groups.id").onDelete("CASCADE").notNullable()
      table.enum('status', ['draft', 'published', 'pending', 'rejected']).defaultTo('draft')

      table.uuid("author_id").references('users.id').onDelete('cascade').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}