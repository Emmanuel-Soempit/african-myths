import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import Culture from '#models/culture'
import Myth from '#models/myth'
import EthnicGroup from '#models/ethnic_group'
import {
  makeCountry,
  makeCulture,
  makeEthnicGroup,
  makeLanguage,
  makeMyth,
  makeUser,
  seedRoles,
} from '../helpers/users.js'

test.group('Editor content', (group) => {
  group.setup(async () => {
    await seedRoles()
  })
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('editor creating a culture with status=published gets draft', async ({ client, assert }) => {
    const editor = await makeUser('editor')
    const language = await makeLanguage()
    const group = await makeEthnicGroup(language.id)

    const response = await client
      .post('/api/v1/editor/cultures')
      .form({ name: 'Editor Culture', ethnicGroupId: group.id, status: 'published' })
      .withCsrfToken().loginAs(editor)

    response.assertRedirectsTo('/editor/cultures')
    const culture = await Culture.findByOrFail('name', 'Editor Culture')
    assert.equal(culture.status, 'draft')
    assert.equal(culture.authorId, editor.id)
  })

  test('editor updating a published culture leaves it pending', async ({ client, assert }) => {
    const editor = await makeUser('editor')
    const language = await makeLanguage()
    const group = await makeEthnicGroup(language.id)
    const culture = await makeCulture(group.id, editor.id, 'published')

    const response = await client
      .put(`/api/v1/editor/cultures/${culture.id}`)
      .form({ name: 'Renamed Culture' })
      .withCsrfToken().loginAs(editor)

    response.assertRedirectsTo('/')
    await culture.refresh()
    assert.equal(culture.name, 'Renamed Culture')
    assert.equal(culture.status, 'pending')
  })

  test('editor creating a myth with status=published gets draft', async ({ client, assert }) => {
    const editor = await makeUser('editor')
    const language = await makeLanguage()
    const group = await makeEthnicGroup(language.id)
    const culture = await makeCulture(group.id, editor.id)

    const response = await client
      .post('/api/v1/editor/myths')
      .form({ name: 'Editor Myth', cultureId: culture.id, status: 'published' })
      .withCsrfToken().loginAs(editor)

    response.assertRedirectsTo(`/editor/cultures/${culture.id}/myths`)
    const myth = await Myth.findByOrFail('name', 'Editor Myth')
    assert.equal(myth.status, 'draft')
  })

  test('editor updating a published myth leaves it pending', async ({ client, assert }) => {
    const editor = await makeUser('editor')
    const language = await makeLanguage()
    const group = await makeEthnicGroup(language.id)
    const culture = await makeCulture(group.id, editor.id)
    const myth = await makeMyth(culture.id, editor.id, 'published')

    const response = await client
      .put(`/api/v1/editor/myths/${myth.id}`)
      .form({ name: 'Renamed Myth', cultureId: culture.id })
      .withCsrfToken().loginAs(editor)

    response.assertRedirectsTo(`/editor/cultures/${culture.id}/myths`)
    await myth.refresh()
    assert.equal(myth.name, 'Renamed Myth')
    assert.equal(myth.status, 'pending')
  })

  test('editor can create an ethnic group', async ({ client, assert }) => {
    const editor = await makeUser('editor')
    const language = await makeLanguage()
    const country = await makeCountry()

    const response = await client
      .post('/api/v1/editor/ethnic-groups')
      .form({
        name: 'New Group',
        primaryLanguage: language.id,
        'countries[0][countryId]': country.id,
        'countries[0][isPrimaryHome]': 'on',
        'nameAliases[0][nameVariant]': 'Alias',
      })
      .withCsrfToken().loginAs(editor)

    response.assertRedirectsTo('/editor/ethnic-groups')
    const group = await EthnicGroup.findByOrFail('canonicalName', 'New Group')
    assert.isNotNull(group)
  })
})
