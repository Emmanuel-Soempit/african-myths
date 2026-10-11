import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import SubEthnicGroup from './sub_ethnic_group.js'
import { type BelongsTo } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'crypto'
import Country from './country.js'

export default class SubEthnicGroupCountry extends BaseModel {
  @column({ isPrimary: true })
  declare id: string


  @column()
  declare subEthnicGroupId: string

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
  @belongsTo(() => SubEthnicGroup)
  declare subEthnicGroup: BelongsTo<typeof SubEthnicGroup>

  @belongsTo(() => Country)
  declare country: BelongsTo<typeof Country>

  // Methods
  @beforeCreate()
  static assignUuid(subEthnicGroupCountry: SubEthnicGroupCountry) {
    subEthnicGroupCountry.id = randomUUID()
  }
}