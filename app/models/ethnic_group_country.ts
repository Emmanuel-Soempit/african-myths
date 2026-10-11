import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import EthnicGroup from './ethnic_group.js'
import { type BelongsTo } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'crypto'
import Country from './country.js'

export default class EthnicGroupCountry extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare ethnicGroupId: string

  @column()
  declare countryId: string

  @column()
  declare isPrimaryHome: boolean

  @column()
  declare populationEstimate: string

  @column()
  declare source: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relationships
  @belongsTo(() => EthnicGroup)
  declare ethnicGroup: BelongsTo<typeof EthnicGroup>

  @belongsTo(() => Country)
  declare country: BelongsTo<typeof Country>

  // Methods
  @beforeCreate()
  static assignUuid(ethnicGroupCountry: EthnicGroupCountry) {
    ethnicGroupCountry.id = randomUUID()
  }
}