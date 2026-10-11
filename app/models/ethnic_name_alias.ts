import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import EthnicGroup from './ethnic_group.js'
import { type BelongsTo } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'

export default class EthnicNameAlias extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare ethnicGroupId: string

  @column()
  declare nameVariant: string

  @column()
  declare langaugeOfNameVariant: string | null

  @column()
  declare source: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relationships
  @belongsTo(() => EthnicGroup)
  declare ethnicGroup: BelongsTo<typeof EthnicGroup>

  // Methods
  @beforeCreate()
  static assignUuid(ethnicNameAlias: EthnicNameAlias) {
    ethnicNameAlias.id = randomUUID()
  }
}
