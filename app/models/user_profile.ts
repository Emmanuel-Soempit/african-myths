import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'
import User from './user.js'
import { type BelongsTo } from '@adonisjs/lucid/types/relations'

export default class UserProfile extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column()
  declare countryCode: number

  @column()
  declare phoneNumber: string

  @column()
  declare gender: 'male' | 'female' | 'other'

  @column()
  declare profilePicture: string

  @column()
  declare userId: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relationships
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @beforeCreate()
  static assignUuid(profile: UserProfile) {
    profile.id = randomUUID()
  }
}
