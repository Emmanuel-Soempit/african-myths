import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import {
  makeCulture,
  makeEthnicGroup,
  makeLanguage,
  makeUser,
  makeWriting,
  seedRoles,
} from '../helpers/users.js'

test.group('Admin review', (group) => {
  group.setup(async () => {
    await seedRoles()
  })
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('approving sets published, published_at and reviewed_by', async ({ client, assert }) => {
    const admin = await makeUser('admin')
    const author = await makeUser('author')
    const language = await makeLanguage()
    const group = await makeEthnicGroup(language.id)
    const culture = await makeCulture(group.id, author.id, 'published')
    const writing = await makeWriting(author.id, culture.id, { status: 'pending' })

    const response = await client
      .put(`/api/v1/admin/writings/${writing.id}/review`)
      .form({ decision: 'approve' })
      .withCsrfToken().loginAs(admin)

    response.assertRedirectsTo('/admin/writings')
    await writing.refresh()
    assert.equal(writing.status, 'published')
    assert.isNotNull(writing.publishedAt)
    assert.equal(writing.reviewedBy, admin.id)
  })

  test('rejecting without a note fails', async ({ client, assert }) => {
    const admin = await makeUser('admin')
    const author = await makeUser('author')
    const language = await makeLanguage()
    const group = await makeEthnicGroup(language.id)
    const culture = await makeCulture(group.id, author.id, 'published')
    const writing = await makeWriting(author.id, culture.id, { status: 'pending' })

    await client
      .put(`/api/v1/admin/writings/${writing.id}/review`)
      .form({ decision: 'reject' })
      .withCsrfToken().loginAs(admin)

    await writing.refresh()
    assert.equal(writing.status, 'pending')
  })

  test('rejecting with a note sets rejected and review_note', async ({ client, assert }) => {
    const admin = await makeUser('admin')
    const author = await makeUser('author')
    const language = await makeLanguage()
    const group = await makeEthnicGroup(language.id)
    const culture = await makeCulture(group.id, author.id, 'published')
    const writing = await makeWriting(author.id, culture.id, { status: 'pending' })

    await client
      .put(`/api/v1/admin/writings/${writing.id}/review`)
      .form({ decision: 'reject', note: 'Needs more sources' })
      .withCsrfToken().loginAs(admin)

    await writing.refresh()
    assert.equal(writing.status, 'rejected')
    assert.equal(writing.reviewNote, 'Needs more sources')
    assert.equal(writing.reviewedBy, admin.id)
  })

  test('reviewing a writing that is not pending fails', async ({ client, assert }) => {
    const admin = await makeUser('admin')
    const author = await makeUser('author')
    const language = await makeLanguage()
    const group = await makeEthnicGroup(language.id)
    const culture = await makeCulture(group.id, author.id, 'published')
    const writing = await makeWriting(author.id, culture.id, { status: 'draft' })

    await client
      .put(`/api/v1/admin/writings/${writing.id}/review`)
      .form({ decision: 'approve' })
      .withCsrfToken().loginAs(admin)

    await writing.refresh()
    assert.equal(writing.status, 'draft')
    assert.isNull(writing.publishedAt)
  })

  test('non-admins get redirected from the review endpoint', async ({ client, assert }) => {
    const author = await makeUser('author')
    const language = await makeLanguage()
    const group = await makeEthnicGroup(language.id)
    const culture = await makeCulture(group.id, author.id, 'published')
    const writing = await makeWriting(author.id, culture.id, { status: 'pending' })

    const response = await client
      .put(`/api/v1/admin/writings/${writing.id}/review`)
      .form({ decision: 'approve' })
      .withCsrfToken().loginAs(author)

    response.assertRedirectsTo('/auth/sign-in')
    await writing.refresh()
    assert.equal(writing.status, 'pending')
  })
})
