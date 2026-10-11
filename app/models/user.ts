import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, beforeCreate, column, hasMany, hasOne, manyToMany } from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import UserMetadatum from './user_metadatum.js'
import UserProfile from './user_profile.js'
import { type ManyToMany, type HasOne, type HasMany } from '@adonisjs/lucid/types/relations'
import Role from './role.js'
import Culture from './culture.js'
import Myth from './myth.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Relationships
  @hasOne(() => UserMetadatum)
  declare metadata: HasOne<typeof UserMetadatum>

  @hasOne(() => UserProfile)
  declare profile: HasOne<typeof UserProfile>

  @hasMany(() => Culture)
  declare cultures: HasMany<typeof Culture>

  @hasMany(() => Myth)
  declare myths: HasMany<typeof Myth>

  @manyToMany(() => Role)
  declare roles: ManyToMany<typeof Role>

  @beforeCreate()
  static assignUuid(user: User) {
    user.id = randomUUID()
  }
}
