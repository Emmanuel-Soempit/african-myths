import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'

export type GenerationJobKind = 'group-list' | 'group-enrich' | 'culture'
export type GenerationJobStatus = 'pending' | 'running' | 'done' | 'flagged' | 'failed' | 'skipped'
export type GenerationEntityType = 'ethnic_group' | 'sub_ethnic_group' | 'culture'

export default class GenerationJob extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare job: GenerationJobKind

  @column()
  declare inputRef: string

  @column()
  declare entityType: GenerationEntityType | null

  @column()
  declare entityId: string | null

  @column()
  declare status: GenerationJobStatus

  @column()
  declare attempts: number

  @column()
  declare model: string | null

  @column()
  declare promptVersion: string | null

  @column()
  declare tokensIn: number

  @column()
  declare tokensOut: number

  @column()
  declare error: string | null

  @column()
  declare payload: Record<string, any> | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static assignUuid(job: GenerationJob) {
    job.id = randomUUID()
  }
}
