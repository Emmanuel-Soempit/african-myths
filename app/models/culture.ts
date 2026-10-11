import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import EthnicGroup from './ethnic_group.js'
import { type HasMany, type BelongsTo } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'
import User from './user.js'
import Myth from './myth.js'
import Writing from './writing.js'
import type { ContentStatus } from '../util/content_status.js'

export default class Culture extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare thumbnail: string

  @column()
  declare history: string

  @column()
  declare language: string

  @column()
  declare status: ContentStatus

  @column()
  declare ethnicGroupId: string

  @column()
  declare authorId: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Myth)
  declare myths: HasMany<typeof Myth>

  @hasMany(() => Writing)
  declare writings: HasMany<typeof Writing>

  @belongsTo(() => EthnicGroup)
  declare ethnicGroup: BelongsTo<typeof EthnicGroup>

  @belongsTo(() => User, {
    foreignKey: 'authorId',
  })
  declare author: BelongsTo<typeof User>

  @beforeCreate()
  static assignUuid(culture: Culture) {
    culture.id = randomUUID()
  }
}
