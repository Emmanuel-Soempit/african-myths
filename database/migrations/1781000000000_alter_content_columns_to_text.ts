import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('myths', (table) => {
      table.text('content').alter()
    })
    this.schema.alterTable('cultures', (table) => {
      table.text('history').alter()
    })
  }

  async down() {
    // NOTE: reverting to varchar(255) can truncate existing data
    this.schema.alterTable('myths', (table) => {
      table.string('content').alter()
    })
    this.schema.alterTable('cultures', (table) => {
      table.string('history').alter()
    })
  }
}
