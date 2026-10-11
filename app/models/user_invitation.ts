import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'
import User from './user.js'
import Role from './role.js'
import { type BelongsTo } from '@adonisjs/lucid/types/relations'

export default class UserInvitation extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  // Invitee information
  @column()
  declare email: string

  @column()
  declare firstName: string | null

  @column()
  declare lastName: string | null

  // Invitation detailssi
  @column()
  declare inviteToken: string

  @column()
  declare roleId: string

  // Who sent the invitation
  @column()
  declare invitedBy: string

  // Tracking
  @column()
  declare status: 'pending' | 'accepted' | 'expired' | 'revoked'

  @column()
  declare acceptedByUserId: string | null

  @column.dateTime()
  declare acceptedAt: DateTime | null

  @column.dateTime()
  declare expiresAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relationships
  @belongsTo(() => User, {
    foreignKey: 'invitedBy',
  })
  declare inviter: BelongsTo<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'acceptedByUserId',
  })
  declare acceptedUser: BelongsTo<typeof User>

  @belongsTo(() => Role)
  declare role: BelongsTo<typeof Role>

  @beforeCreate()
  static assignUuid(invitation: UserInvitation) {
    invitation.id = randomUUID()
  }
}
