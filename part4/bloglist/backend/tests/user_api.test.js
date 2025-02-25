const { describe, beforeEach, test, after } = require('node:test')
const assert = require('node:assert')
const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const User = require('../models/user')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const helper = require('../utils/test_helper')

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('secret', 10)

    const user = new User({
      username: 'root',
      name: 'root',
      passwordHash,
    })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = new User({
      username: 'aemalabago',
      name: 'Antonio Malabago',
      password: 'admin123',
    })

    await newUser.save()

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map((a) => a.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation failed with proper status code and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'admin123',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected "username" to be unique'))

    assert(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
