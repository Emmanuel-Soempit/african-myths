import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'ethnic_group_countries'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()

      table.uuid('ethnic_group_id').references('ethnic_groups.id').onDelete('CASCADE').notNullable()
      table.uuid('country_id').references('countries.id').onDelete('CASCADE').notNullable()

      table.boolean('is_primary_home').defaultTo(false)
      table.string('population_estimate')
      table.string('source')


      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}