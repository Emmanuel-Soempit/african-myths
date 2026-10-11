import { test } from '@japa/runner'
import { canDelete, canPublish, resolveStatus } from '../../app/util/content_status.js'

test.group('resolveStatus | admin', () => {
  test('admin gets any valid requested status', ({ assert }) => {
    assert.equal(resolveStatus('published', 'admin'), 'published')
    assert.equal(resolveStatus('rejected', 'admin'), 'rejected')
    assert.equal(resolveStatus('pending', 'admin'), 'pending')
    assert.equal(resolveStatus('draft', 'admin'), 'draft')
  })

  test('admin keeps current status when request is missing or invalid', ({ assert }) => {
    assert.equal(resolveStatus(undefined, 'admin', 'published'), 'published')
    assert.equal(resolveStatus('bogus', 'admin', 'pending'), 'pending')
  })

  test('admin defaults to draft on create when request is missing or invalid', ({ assert }) => {
    assert.equal(resolveStatus(undefined, 'admin'), 'draft')
    assert.equal(resolveStatus('bogus', 'admin'), 'draft')
  })
})

test.group('resolveStatus | editor and author', () => {
  const roles = ['editor', 'author'] as const

  for (const role of roles) {
    test(`${role}: pending request always wins`, ({ assert }) => {
      assert.equal(resolveStatus('pending', role), 'pending')
      assert.equal(resolveStatus('pending', role, 'published'), 'pending')
      assert.equal(resolveStatus('pending', role, 'draft'), 'pending')
    })

    test(`${role}: draft request works on everything but published`, ({ assert }) => {
      assert.equal(resolveStatus('draft', role), 'draft')
      assert.equal(resolveStatus('draft', role, 'pending'), 'draft')
      assert.equal(resolveStatus('draft', role, 'rejected'), 'draft')
      assert.equal(resolveStatus('draft', role, 'published'), 'pending')
    })

    test(`${role}: unprivileged statuses on create become draft`, ({ assert }) => {
      assert.equal(resolveStatus('published', role), 'draft')
      assert.equal(resolveStatus('rejected', role), 'draft')
      assert.equal(resolveStatus('bogus', role), 'draft')
      assert.equal(resolveStatus(undefined, role), 'draft')
    })

    test(`${role}: unprivileged statuses over draft/rejected become draft`, ({ assert }) => {
      assert.equal(resolveStatus('published', role, 'draft'), 'draft')
      assert.equal(resolveStatus('published', role, 'rejected'), 'draft')
      assert.equal(resolveStatus(undefined, role, 'draft'), 'draft')
      assert.equal(resolveStatus(undefined, role, 'rejected'), 'draft')
    })

    test(`${role}: any request over published becomes pending`, ({ assert }) => {
      assert.equal(resolveStatus('published', role, 'published'), 'pending')
      assert.equal(resolveStatus('rejected', role, 'published'), 'pending')
      assert.equal(resolveStatus('bogus', role, 'published'), 'pending')
      assert.equal(resolveStatus(undefined, role, 'published'), 'pending')
    })

    test(`${role}: unprivileged statuses over pending stay pending`, ({ assert }) => {
      assert.equal(resolveStatus('published', role, 'pending'), 'pending')
      assert.equal(resolveStatus('rejected', role, 'pending'), 'pending')
      assert.equal(resolveStatus('bogus', role, 'pending'), 'pending')
      assert.equal(resolveStatus(undefined, role, 'pending'), 'pending')
    })
  }
})

test.group('resolveStatus | reader', () => {
  test('reader cannot set status', ({ assert }) => {
    assert.throws(() => resolveStatus('draft', 'reader'))
    assert.throws(() => resolveStatus('pending', 'reader', 'draft'))
  })
})

test.group('canPublish / canDelete', () => {
  test('only admin can publish', ({ assert }) => {
    assert.isTrue(canPublish('admin'))
    assert.isFalse(canPublish('editor'))
    assert.isFalse(canPublish('author'))
    assert.isFalse(canPublish('reader'))
  })

  test('only admin can delete', ({ assert }) => {
    assert.isTrue(canDelete('admin'))
    assert.isFalse(canDelete('editor'))
    assert.isFalse(canDelete('author'))
    assert.isFalse(canDelete('reader'))
  })
})
