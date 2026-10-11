import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, hasMany } from '@adonisjs/lucid/orm'
import EthnicGroup from './ethnic_group.js'
import { type HasMany } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'crypto'

export default class Language extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare familyId: string

  @column()
  declare parentId: string

  @column()
  declare level: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // relationships
  @hasMany(() => EthnicGroup)
  declare ethnicGroups: HasMany<typeof EthnicGroup>

  // Methods
  @beforeCreate()
  static assignUuid(language: Language) {
    language.id = randomUUID()
  }
}