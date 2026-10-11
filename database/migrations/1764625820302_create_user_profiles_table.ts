import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_profiles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()

      table.string('first_name', 254).notNullable()
      table.string('last_name', 254).notNullable()
      table.integer('country_code', 4)
      table.string('phone_number', 254)
      table.enum('gender', ['male', 'female', 'other'])
      table.string('profile_picture')

      table.uuid('user_id').notNullable().unique().references('users.id').onDelete('cascade')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
