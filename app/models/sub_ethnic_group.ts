import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import { type BelongsTo, type HasMany } from '@adonisjs/lucid/types/relations'
import EthnicGroup from './ethnic_group.js'
import SubEthnicGroupCountry from './sub_ethnic_group_country.js'
import { randomUUID } from 'node:crypto'
import Myth from './myth.js'

export default class SubEthnicGroup extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare ethnicGroupId: string

  @column()
  declare canonicalName: string

  @column()
  declare note: string

  @column()
  declare aiGenerated: boolean

  @column.dateTime()
  declare aiReviewedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relationships
  @belongsTo(() => EthnicGroup)
  declare ethnicGroup: BelongsTo<typeof EthnicGroup>

  @hasMany(() => SubEthnicGroupCountry)
  declare subEthnicGroupCountries: HasMany<typeof SubEthnicGroupCountry>

  @hasMany(() => Myth)
  declare myths: HasMany<typeof Myth>

  // Methods
  @beforeCreate()
  static assignUuid(subEthnicGroup: SubEthnicGroup) {
    subEthnicGroup.id = randomUUID()
  }
}
