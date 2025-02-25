const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const blogs = require('../utils/blog_list')

describe('most likes', () => {
  test('find author with most likes', () => {
    const authorWithMostLikes = {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    }

    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, authorWithMostLikes)
  })
})
