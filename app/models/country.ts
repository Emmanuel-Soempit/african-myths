import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, hasMany } from '@adonisjs/lucid/orm'
import EthnicGroupCountry from './ethnic_group_country.js'
import {type HasMany } from '@adonisjs/lucid/types/relations'
import SubEthnicGroupCountry from './sub_ethnic_group_country.js'
import { randomUUID } from 'crypto'

export default class Country extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare formal_name: string

  @column()
  declare flag: string

  @column()
  declare iso_alpha_2: string

  @column()
  declare iso_alpha_3: string

  @column()
  declare currency_name: string

  @column()
  declare currency_code: string

  @column()
  declare languages: string

  @column()
  declare dial: string

  @column()
  declare wiki_data_id: string

  @column()
  declare capital: string

  @column()
  declare sub_region_name: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relationships
  @hasMany(() => EthnicGroupCountry)
  declare ethnicGroupCountries: HasMany<typeof EthnicGroupCountry>

  @hasMany(() => SubEthnicGroupCountry)
  declare subEthnicGroupCountries: HasMany<typeof SubEthnicGroupCountry>

  // Methods
  @beforeCreate()
    static assignUuid(country: Country) {
      country.id = randomUUID()
    }
}