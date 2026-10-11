import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Language from './language.js'
import { type HasMany, type BelongsTo } from '@adonisjs/lucid/types/relations'
import EthnicNameAlias from './ethnic_name_alias.js'
import EthnicGroupCountry from './ethnic_group_country.js'
import SubEthnicGroup from './sub_ethnic_group.js'
import { randomUUID } from 'node:crypto'
import Culture from './culture.js'

export default class EthnicGroup extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare canonicalName: string

  @column()
  declare languageId: string

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
  @belongsTo(() => Language)
  declare language: BelongsTo<typeof Language>

  @hasMany(() => EthnicNameAlias)
  declare ethnicNameAliases: HasMany<typeof EthnicNameAlias>

  @hasMany(() => Culture)
  declare cultures: HasMany<typeof Culture>

  @hasMany(() => EthnicGroupCountry)
  declare ethnicGroupCountries: HasMany<typeof EthnicGroupCountry>

  @hasMany(() => SubEthnicGroup)
  declare subEthnicGroups: HasMany<typeof SubEthnicGroup>

  // Methods
  @beforeCreate()
  static assignUuid(ethnicGroup: EthnicGroup) {
    ethnicGroup.id = randomUUID()
  }
}
