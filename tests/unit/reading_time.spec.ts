import { test } from '@japa/runner'
import { calculateReadingTime } from '../../app/util/reading_time.js'

test.group('calculateReadingTime', () => {
  test('empty or null input gives 1', ({ assert }) => {
    assert.equal(calculateReadingTime(null), 1)
    assert.equal(calculateReadingTime(undefined), 1)
    assert.equal(calculateReadingTime(''), 1)
    assert.equal(calculateReadingTime('<p></p>'), 1)
  })

  test('199 words gives 1', ({ assert }) => {
    assert.equal(calculateReadingTime('word '.repeat(199)), 1)
  })

  test('201 words gives 2', ({ assert }) => {
    assert.equal(calculateReadingTime('word '.repeat(201)), 2)
  })

  test('HTML tags are not counted', ({ assert }) => {
    const html = `<p>${'<b>word</b> '.repeat(199)}</p>`
    assert.equal(calculateReadingTime(html), 1)

    const longHtml = `<p>${'<b>word</b> '.repeat(201)}</p>`
    assert.equal(calculateReadingTime(longHtml), 2)
  })
})
