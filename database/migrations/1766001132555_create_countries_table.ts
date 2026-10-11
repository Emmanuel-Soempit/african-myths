import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'countries'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()

      table.string('name').notNullable()

      table.string('formal_name').notNullable()


      table.string('flag').notNullable()


      table.string('iso_alpha_2').notNullable()
      table.string('iso_alpha_3').notNullable()

      
      table.string('wiki_data_id').notNullable()
      
      table.string('capital').notNullable()
      
      table.string('sub_region_name').notNullable()
      
      table.string('currency_name').notNullable()
      table.string('currency_code').notNullable()

      table.string('languages').notNullable()

      table.string('dial').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}