const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const { idValidator, userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
  })

  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(400).end()
  }

  response.json(blog)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const blog = request.body

  const user = await User.findById(request.user)

  if (!blog.title || !blog.url) {
    return response.status(400).end()
  }

  const blogObject = new Blog({
    title: blog.title,
    url: blog.url,
    user: user._id,
  })
  const savedBlog = await blogObject.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const blog = request.params.id

  if (!idValidator(blog)) {
    return response.status(400).json({ error: 'Cannot find blog' })
  }

  if (!request.token) {
    return response.status(400).json({ error: 'Missing token' })
  }

  const blogObject = await Blog.findById(blog)
  console.log(blogObject)
  if (!blogObject || blogObject.user.toString() !== request.user) {
    return response
      .status(401)
      .json({ error: 'You can only delete your own blog' })
  }

  await Blog.findByIdAndDelete(request.params.id)

  response.status(204).end()
})

module.exports = blogsRouter
