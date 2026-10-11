import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'roles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()

      table.enum('name', ['admin', 'reader', 'editor', 'author']).notNullable()
      table.enum('icon', ['auto_stories', 'edit', 'verified', 'person']).notNullable()
      table.string('description').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
