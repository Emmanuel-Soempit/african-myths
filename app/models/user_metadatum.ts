import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'
import { type BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Role from './role.js'

export default class UserMetadatum extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string

  @column()
  declare emailVerifiedAt: DateTime | null

  @column()
  declare signUpMethod: 'email' | 'google'

  @column()
  declare signUpType: 'invite' | 'organic'

  @column()
  declare status: 'active' | 'inactive' | 'suspended'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare activeRoleId: string

  // Relatiobships
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Role, {
    foreignKey: 'activeRoleId',
  })
  declare role: BelongsTo<typeof Role>

  @beforeCreate()
  static assignUuid(metadata: UserMetadatum) {
    metadata.id = randomUUID()
  }
}
