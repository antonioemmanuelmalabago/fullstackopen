const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const blogs = require('../utils/blog_list')

describe('favorite blog', () => {
  test('find blog with highest number of likes', () => {
    const blogWithHighestLikes = {
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0,
    }

    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, blogWithHighestLikes)
  })
})
