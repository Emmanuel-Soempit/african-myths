import { randomUUID } from 'node:crypto'
import User from '#models/user'
import Role from '#models/role'
import Language from '#models/language'
import Country from '#models/country'
import EthnicGroup from '#models/ethnic_group'
import Culture from '#models/culture'
import Myth from '#models/myth'
import Writing from '#models/writing'
import type { ContentStatus, RoleName } from '../../app/util/content_status.js'
import type { WritingType } from '#models/writing'

const ROLE_SEED = [
  { name: 'admin', description: 'Admin role', icon: 'auto_stories' },
  { name: 'editor', description: 'Editor role', icon: 'verified' },
  { name: 'author', description: 'Author role', icon: 'person' },
  { name: 'reader', description: 'Reader role', icon: 'edit' },
] as const

export async function seedRoles() {
  for (const role of ROLE_SEED) {
    await Role.updateOrCreate({ name: role.name }, { ...role })
  }
}

export async function makeUser(roleName: RoleName) {
  const role = await Role.findByOrFail('name', roleName)
  const user = await User.create({
    email: `${roleName}-${randomUUID()}@example.test`,
    password: 'password',
  })
  await user.related('profile').create({
    firstName: 'Test',
    lastName: roleName,
  })
  await user.related('roles').attach([role.id])
  await user.related('metadata').create({
    signUpMethod: 'email',
    signUpType: 'organic',
    activeRoleId: role.id,
  })
  return user
}

export async function makeLanguage() {
  return Language.create({
    name: `Lang-${randomUUID().slice(0, 8)}`,
    familyId: 'test-family',
    parentId: 'test-parent',
    level: 'language',
  })
}

export async function makeCountry() {
  return Country.create({
    name: `Country-${randomUUID().slice(0, 8)}`,
    formal_name: 'Test Country',
    flag: 'flag.png',
    iso_alpha_2: 'TC',
    iso_alpha_3: 'TST',
    wiki_data_id: 'Q1',
    capital: 'Capital',
    sub_region_name: 'Test region',
    currency_name: 'Naira',
    currency_code: 'TST',
    languages: 'en',
    dial: '+000',
  })
}

export async function makeEthnicGroup(languageId: string) {
  return EthnicGroup.create({
    canonicalName: `Group-${randomUUID().slice(0, 8)}`,
    languageId,
    note: 'test',
  })
}

export async function makeCulture(
  ethnicGroupId: string,
  authorId: string,
  status: ContentStatus = 'published'
) {
  return Culture.create({
    name: `Culture-${randomUUID().slice(0, 8)}`,
    ethnicGroupId,
    authorId,
    status,
    thumbnail: '',
    history: '',
    language: '',
  })
}

export async function makeMyth(
  cultureId: string,
  authorId: string,
  status: ContentStatus = 'draft'
) {
  return Myth.create({
    name: `Myth-${randomUUID().slice(0, 8)}`,
    cultureId,
    authorId,
    status,
    thumbnail: '',
    content: '',
    source: '',
    minutesToRead: 1,
  })
}

export async function makeWriting(
  authorId: string,
  cultureId: string,
  overrides: Partial<{
    type: WritingType
    status: ContentStatus
    title: string
  }> = {}
) {
  return Writing.create({
    type: overrides.type ?? 'story',
    title: overrides.title ?? `Writing-${randomUUID().slice(0, 8)}`,
    cultureId,
    authorId,
    status: overrides.status ?? 'draft',
    content: '<p>Hello world</p>',
    minutesToRead: 1,
  })
}
