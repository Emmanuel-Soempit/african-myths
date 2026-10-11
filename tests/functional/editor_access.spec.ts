import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import Culture from '#models/culture'
import { makeCulture, makeEthnicGroup, makeLanguage, makeUser, seedRoles } from '../helpers/users.js'

test.group('Editor access', (group) => {
  group.setup(async () => {
    await seedRoles()
  })
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('logged-out user is redirected from /editor/dashboard', async ({ client }) => {
    const response = await client.get('/editor/dashboard')
    response.assertRedirectsTo('/auth/sign-in')
  })

  test('reader is redirected from /editor/dashboard', async ({ client }) => {
    const reader = await makeUser('reader')
    const response = await client.get('/editor/dashboard').withCsrfToken().loginAs(reader)
    response.assertRedirectsTo('/auth/sign-in')
  })

  test('author is redirected from /editor/dashboard', async ({ client }) => {
    const author = await makeUser('author')
    const response = await client.get('/editor/dashboard').withCsrfToken().loginAs(author)
    response.assertRedirectsTo('/auth/sign-in')
  })

  test('editor gets 200 on /editor/dashboard', async ({ client }) => {
    const editor = await makeUser('editor')
    const response = await client.get('/editor/dashboard').withCsrfToken().loginAs(editor)
    response.assertStatus(200)
  })

  test('editor is redirected from /admin/dashboard', async ({ client }) => {
    const editor = await makeUser('editor')
    const response = await client.get('/admin/dashboard').withCsrfToken().loginAs(editor)
    response.assertRedirectsTo('/auth/sign-in')
  })

  test('DELETE /api/v1/admin/cultures/:id as editor is rejected and the row survives', async ({
    client,
    assert,
  }) => {
    const editor = await makeUser('editor')
    const language = await makeLanguage()
    const group = await makeEthnicGroup(language.id)
    const culture = await makeCulture(group.id, editor.id)

    const response = await client
      .delete(`/api/v1/admin/cultures/${culture.id}`)
      .withCsrfToken().loginAs(editor)

    response.assertRedirectsTo('/auth/sign-in')
    assert.isNotNull(await Culture.find(culture.id))
  })

  test('DELETE /api/v1/editor/cultures/:id returns 404', async ({ client }) => {
    const editor = await makeUser('editor')
    const language = await makeLanguage()
    const group = await makeEthnicGroup(language.id)
    const culture = await makeCulture(group.id, editor.id)

    const response = await client
      .delete(`/api/v1/editor/cultures/${culture.id}`)
      .withCsrfToken().loginAs(editor)

    response.assertStatus(404)
  })
})
