import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'myths'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid("id").primary()
      table.string("title")
      table.string("thumbnail")
      table.string("content")

      table.uuid("author_id").references('users.id').onDelete('cascade').notNullable()
      table.uuid("culture_id").references('cultures.id').onDelete('cascade').notNullable()

      table.uuid("sub_ethnic_group_id").references("sub_ethnic_groups.id").onDelete("CASCADE").nullable()

      table.enum('status', ['draft', 'published', 'pending', 'rejected']).defaultTo('draft')
      table.string("source")
      table.float("minutes_to_read").defaultTo(0)


      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}