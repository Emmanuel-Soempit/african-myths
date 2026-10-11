import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import {
  makeCulture,
  makeEthnicGroup,
  makeLanguage,
  makeMyth,
  makeUser,
  makeWriting,
  seedRoles,
} from '../helpers/users.js'

test.group('Reader visibility', (group) => {
  group.setup(async () => {
    await seedRoles()
  })
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('/writings/:id hides unpublished writings and shows published ones', async ({
    client,
    assert,
  }) => {
    const author = await makeUser('author')
    const language = await makeLanguage()
    const group = await makeEthnicGroup(language.id)
    const culture = await makeCulture(group.id, author.id, 'published')

    for (const status of ['draft', 'pending', 'rejected'] as const) {
      const writing = await makeWriting(author.id, culture.id, { status })
      const response = await client.get(`/writings/${writing.id}`)
      response.assertStatus(200)
      response.assertTextIncludes('errors/not_found')
    }

    const published = await makeWriting(author.id, culture.id, { status: 'published' })
    const response = await client.get(`/writings/${published.id}`)
    response.assertStatus(200)
    response.assertTextIncludes('writings/detail')
    assert.notInclude(response.text() || '', author.email)
  })

  test('/myths/:id returns not-found for draft myths and 200 for published', async ({ client }) => {
    const author = await makeUser('author')
    const language = await makeLanguage()
    const group = await makeEthnicGroup(language.id)
    const culture = await makeCulture(group.id, author.id, 'published')

    const draft = await makeMyth(culture.id, author.id, 'draft')
    const draftResponse = await client.get(`/myths/${draft.id}`)
    draftResponse.assertStatus(200)
    draftResponse.assertTextIncludes('errors/not_found')

    const published = await makeMyth(culture.id, author.id, 'published')
    const publishedResponse = await client.get(`/myths/${published.id}`)
    publishedResponse.assertStatus(200)
    publishedResponse.assertTextIncludes('myths/detail')
  })

  test('/cultures/:id returns not-found for unpublished cultures', async ({ client }) => {
    const author = await makeUser('author')
    const language = await makeLanguage()
    const group = await makeEthnicGroup(language.id)
    const culture = await makeCulture(group.id, author.id, 'draft')

    const response = await client.get(`/cultures/${culture.id}`)
    response.assertStatus(200)
    response.assertTextIncludes('errors/not_found')
  })
})
