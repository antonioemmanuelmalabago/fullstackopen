const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const blogs = require('../utils/blog_list')

describe('most blogs', () => {
  test('find author with most blogs', () => {
    const authorWithMostBlogs = {
      author: 'Robert C. Martin',
      blogs: 3,
    }

    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, authorWithMostBlogs)
  })
})
