import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import Writing from '#models/writing'
import {
  makeCulture,
  makeEthnicGroup,
  makeLanguage,
  makeUser,
  makeWriting,
  seedRoles,
} from '../helpers/users.js'

test.group('Author writings', (group) => {
  group.setup(async () => {
    await seedRoles()
  })
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('full lifecycle: create → update → submit → blocked update → withdraw → delete', async ({
    client,
    assert,
  }) => {
    const author = await makeUser('author')
    const language = await makeLanguage()
    const group = await makeEthnicGroup(language.id)
    const culture = await makeCulture(group.id, author.id, 'published')

    // create as draft
    let response = await client
      .post('/api/v1/author/writings')
      .form({ type: 'story', title: 'My Story', cultureId: culture.id, content: '<p>once upon a time</p>' })
      .withCsrfToken().loginAs(author)

    const writing = await Writing.findByOrFail('title', 'My Story')
    assert.equal(writing.status, 'draft')
    response.assertRedirectsTo(`/author/writings/${writing.id}/edit`)

    // update works while draft
    response = await client
      .put(`/api/v1/author/writings/${writing.id}`)
      .form({ title: 'My Story (edited)' })
      .withCsrfToken().loginAs(author)
    await writing.refresh()
    assert.equal(writing.title, 'My Story (edited)')

    // submit → pending
    response = await client
      .post(`/api/v1/author/writings/${writing.id}/submit`)
      .withCsrfToken().loginAs(author)
    await writing.refresh()
    assert.equal(writing.status, 'pending')

    // update blocked while pending
    await client
      .put(`/api/v1/author/writings/${writing.id}`)
      .form({ title: 'Should not stick' })
      .withCsrfToken().loginAs(author)
    await writing.refresh()
    assert.notEqual(writing.title, 'Should not stick')
    assert.equal(writing.status, 'pending')

    // withdraw → draft
    await client.post(`/api/v1/author/writings/${writing.id}/withdraw`).withCsrfToken().loginAs(author)
    await writing.refresh()
    assert.equal(writing.status, 'draft')

    // delete draft
    await client.delete(`/api/v1/author/writings/${writing.id}`).withCsrfToken().loginAs(author)
    assert.isNull(await Writing.find(writing.id))
  })

  test("another author cannot touch someone else's writing", async ({ client, assert }) => {
    const author = await makeUser('author')
    const other = await makeUser('author')
    const language = await makeLanguage()
    const group = await makeEthnicGroup(language.id)
    const culture = await makeCulture(group.id, author.id, 'published')
    const writing = await makeWriting(author.id, culture.id)

    for (const request of [
      client.put(`/api/v1/author/writings/${writing.id}`).form({ title: 'hijack' }),
      client.post(`/api/v1/author/writings/${writing.id}/submit`),
      client.delete(`/api/v1/author/writings/${writing.id}`),
    ]) {
      await request.withCsrfToken().loginAs(other)
    }

    await writing.refresh()
    assert.equal(writing.status, 'draft')
    assert.notEqual(writing.title, 'hijack')

    // and the edit page shows not-found
    const page = await client.get(`/author/writings/${writing.id}/edit`).withCsrfToken().loginAs(other)
    page.assertStatus(200)
    page.assertTextIncludes('errors/not_found')
  })

  test('creating against an unpublished culture is rejected', async ({ client, assert }) => {
    const author = await makeUser('author')
    const language = await makeLanguage()
    const group = await makeEthnicGroup(language.id)
    const culture = await makeCulture(group.id, author.id, 'draft')

    await client
      .post('/api/v1/author/writings')
      .form({ type: 'poem', title: 'Nope', cultureId: culture.id })
      .withCsrfToken().loginAs(author)

    assert.isNull(await Writing.findBy('title', 'Nope'))
  })

  test('author is redirected from /editor and /admin routes', async ({ client }) => {
    const author = await makeUser('author')

    const editor = await client.get('/editor/dashboard').withCsrfToken().loginAs(author)
    editor.assertRedirectsTo('/auth/sign-in')

    const admin = await client.get('/admin/dashboard').withCsrfToken().loginAs(author)
    admin.assertRedirectsTo('/auth/sign-in')
  })

  test('author gets 200 on /author/dashboard', async ({ client }) => {
    const author = await makeUser('author')
    const response = await client.get('/author/dashboard').withCsrfToken().loginAs(author)
    response.assertStatus(200)
  })
})
