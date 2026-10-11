import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('ethnic_groups', (table) => {
      table.text('note').alter()
    })
    this.schema.alterTable('sub_ethnic_groups', (table) => {
      table.text('note').alter()
    })
    this.schema.alterTable('cultures', (table) => {
      table.text('history').alter()
    })
  }

  async down() {
    // NOTE: reverting to varchar(255) can truncate existing data
    this.schema.alterTable('ethnic_groups', (table) => {
      table.string('note').alter()
    })
    this.schema.alterTable('sub_ethnic_groups', (table) => {
      table.string('note').alter()
    })
    this.schema.alterTable('cultures', (table) => {
      table.string('history').alter()
    })
  }
}
