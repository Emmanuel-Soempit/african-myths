import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_metadata'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()

      table.enum('sign_up_method', ['email', 'google']).notNullable()
      table.enum('sign_up_type', ['invite', 'organic']).notNullable()
      table.uuid('user_id').notNullable().unique().references('users.id').onDelete('cascade')
      table.timestamp('email_verified_at')
      table.uuid('active_role_id').references('roles.id').onDelete('cascade')
      table.enum('status', ['active', 'inactive', 'suspended']).defaultTo('active')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
