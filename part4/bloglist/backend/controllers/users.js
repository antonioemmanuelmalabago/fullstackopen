const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const Users = await User.find({}).populate('blogs', {
    title: 1,
    url: 1,
    likes: 1,
  })

  response.json(Users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (username.length < 3 || password.length < 3) {
    return response.status(400).json({
      error: 'Username and password must be at least 3 characters long.',
    })
  }

  const user = await User.findOne({ username })
  if (user) {
    return response.status(400).json({
      error: 'Username must be unique',
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const newUser = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await newUser.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter
