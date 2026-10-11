import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: 'admin' | 'reader' | 'editor' | 'author'

  @column()
  declare icon: 'auto_stories' | 'edit' | 'verified' | 'person'

  @column()
  declare description: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
  @beforeCreate()
  static assignUuid(role: Role) {
    role.id = randomUUID()
  }
}
