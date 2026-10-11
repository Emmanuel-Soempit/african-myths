import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'writings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.enum('type', ['poem', 'story', 'article']).notNullable()
      table.string('title', 255).notNullable()
      table.text('excerpt').nullable()
      table.text('content').notNullable().defaultTo('')
      table.string('thumbnail').nullable()
      table.uuid('culture_id').references('cultures.id').onDelete('CASCADE').notNullable().index()
      table.uuid('author_id').references('users.id').onDelete('CASCADE').notNullable().index()
      table.enum('status', ['draft', 'pending', 'published', 'rejected']).defaultTo('draft').index()
      table.text('review_note').nullable()
      table.uuid('reviewed_by').references('users.id').onDelete('SET NULL').nullable()
      table.timestamp('published_at').nullable()
      table.float('minutes_to_read').defaultTo(0)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
