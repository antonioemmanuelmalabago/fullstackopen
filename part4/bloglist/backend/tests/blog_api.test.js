const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const Blog = require('../models/blog')
const User = require('../models/user')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const helper = require('../utils/test_helper')

describe('when there are some blogs saved initially', () => {
  const loginToken = async (username, password) => {
    const login = await api
      .post('/api/login')
      .send({ username, password })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const token = login.body.token

    return token
  }

  beforeEach(async () => {
    await Promise.all([Blog.deleteMany({}), User.deleteMany({})])

    const user = {
      name: 'Antonio Malabago',
      username: 'antoniomalabago',
      password: 'password',
    }

    await api
      .post('/api/users')
      .send(user)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const token = await loginToken(user.username, user.password)

    for (const blog of helper.initialBlogs) {
      await api
        .post('/api/blogs')
        .send(blog)
        .set('Authorization', `Bearer ${token}`)
    }
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const contents = await response.body.map((b) => b.title)
    assert(contents.includes('React patterns'))
  })

  test('unique identifier of blog is named id instead of _id by default', async () => {
    const response = await api.get('/api/blogs')

    const blog = response.body[0]

    assert(blog.hasOwnProperty('id'))
    assert(!blog.hasOwnProperty('_id'))
  })

  describe('viewing a specific blog', () => {
    test('succeeds with a valid id', async () => {
      const blogsAtStart = await helper.blogsInDb()

      const blogToView = blogsAtStart[0]

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const result = {
        title: resultBlog.body.title,
        url: resultBlog.body.url,
        likes: resultBlog.body.likes,
      }

      const blog = {
        title: blogToView._doc.title,
        url: blogToView._doc.url,
        likes: blogToView._doc.likes,
      }

      assert.deepStrictEqual(result, blog)
    })
  })

  describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
      const user = {
        name: 'Antonio Malabago',
        username: 'antoniomalabago',
        password: 'password',
      }

      const token = await loginToken(user.username, user.password)

      const newBlog = {
        title: 'How to Train Your Dragon',
        url: 'http://google.com',
        likes: 420,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const titles = await blogsAtEnd.map((b) => b.title)
      assert(titles.includes('How to Train Your Dragon'))
    })

    test('with missing "likes" property will default to zero', async () => {
      const user = {
        name: 'Antonio Malabago',
        username: 'antoniomalabago',
        password: 'password',
      }

      const token = await loginToken(user.username, user.password)

      const newBlog = {
        title: 'How to Cook Adobong Manahk',
        url: 'http://google.com',
      }

      const uploadedBlog = await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(201)

      const response = await api
        .get(`/api/blogs/${uploadedBlog.body.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blog = response.body

      assert(blog.likes === 0)
    })

    test('fails with status code 400 if title or url is missing', async () => {
      const user = {
        name: 'Antonio Malabago',
        username: 'antoniomalabago',
        password: 'password',
      }

      const token = await loginToken(user.username, user.password)

      const newBlog = {
        title: 'How to Cook Adobong Manahk',
        // url is missing
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with valid id', async () => {
      const user = {
        name: 'Antonio Malabago',
        username: 'antoniomalabago',
        password: 'password',
      }

      const token = await loginToken(user.username, user.password)

      const blogsAtStart = await helper.blogsInDb()

      const blogToDelete = blogsAtStart[0]._id.toString()

      await api
        .delete(`/api/blogs/${blogToDelete}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
    })

    test('fails with status code 400 if id is invalid', async () => {
      const user = {
        name: 'Antonio Malabago',
        username: 'antoniomalabago',
        password: 'password',
      }

      const token = await loginToken(user.username, user.password)

      const blogsAtStart = await helper.blogsInDb()

      await api
        .delete(`/api/blogs/${9999}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
    })
  })
})

after(async () => {
  await Promise.all([Blog.deleteMany({}), User.deleteMany({})])
  await mongoose.connection.close()
})
