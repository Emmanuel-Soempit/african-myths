import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'
import { type BelongsTo } from '@adonisjs/lucid/types/relations'
import Culture from './culture.js'
import User from './user.js'
import type { ContentStatus } from '../util/content_status.js'

export type WritingType = 'poem' | 'story' | 'article'
export type { ContentStatus }

export default class Writing extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare type: WritingType

  @column()
  declare title: string

  @column()
  declare excerpt: string | null

  @column()
  declare content: string

  @column()
  declare thumbnail: string | null

  @column()
  declare cultureId: string

  @column()
  declare authorId: string

  @column()
  declare status: ContentStatus

  @column()
  declare reviewNote: string | null

  @column()
  declare reviewedBy: string | null

  @column.dateTime()
  declare publishedAt: DateTime | null

  @column()
  declare minutesToRead: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Culture)
  declare culture: BelongsTo<typeof Culture>

  @belongsTo(() => User, {
    foreignKey: 'authorId',
  })
  declare author: BelongsTo<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'reviewedBy',
  })
  declare reviewer: BelongsTo<typeof User>

  @beforeCreate()
  static assignUuid(writing: Writing) {
    writing.id = randomUUID()
  }
}
