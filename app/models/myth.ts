import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import { randomUUID } from 'crypto'
import { type BelongsTo } from '@adonisjs/lucid/types/relations'
import Culture from './culture.js'
import User from './user.js'
import SubEthnicGroup from './sub_ethnic_group.js'

export default class Myth extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'title' })
  declare name: string

  @column()
  declare thumbnail: string

  @column()
  declare content: string

  @column()
  declare authorId: string

  @column()
  declare cultureId: string

  @column()
  declare subEthnicGroupId: string

  @column()
  declare status: "draft" | "published" | "pending" | "rejected"


  @column()
  declare source: string

  @column()
  declare minutesToRead: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime


  @belongsTo(() => User, {
    foreignKey: 'authorId',
  })
  declare author: BelongsTo<typeof User>

  @belongsTo(() => Culture)
  declare culture: BelongsTo<typeof Culture>

  @belongsTo(() => SubEthnicGroup)
  declare sunEthnicGroup: BelongsTo<typeof SubEthnicGroup>

  @beforeCreate()
  static assignUuid(myth: Myth) {
    myth.id = randomUUID()
  }
}