import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_invitations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()

      // Invitee information
      table.string('email', 255).notNullable().unique()
      table.string('first_name', 100).nullable()
      table.string('last_name', 100).nullable()

      // Invitation details
      table.string('invite_token', 64).notNullable().unique()
      table.uuid('role_id').notNullable().references('roles.id').onDelete('cascade')

      // Who sent the invitation
      table.uuid('invited_by').notNullable().references('users.id').onDelete('cascade')

      // Tracking
      table.enum('status', ['pending', 'accepted', 'expired', 'revoked']).defaultTo('pending')
      table.uuid('accepted_by_user_id').nullable().references('users.id').onDelete('set null')
      table.timestamp('accepted_at').nullable()
      table.timestamp('expires_at').notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
