const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const morgan = require('morgan')
morgan.token('body', (request) => JSON.stringify(request.body))

const logger = require('./logger')

const { ObjectId } = require('mongoose').Types

const requestLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms :body'
)

const errorHandler = (error, request, response, next) => {
  if (
    error.name === 'MongoServerError' &&
    error.message.includes('E11000 duplicate key error')
  ) {
    return response
      .status(400)
      .json({ error: 'expected "username" to be unique' })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  }
  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({
    error: 'unknown endpoint',
  })
}

const idValidator = (id) => {
  return ObjectId.isValid(id)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  } else {
    request.token = null
  }

  next()
}

const userExtractor = (request, response, next) => {
  if (!request.token) {
    return response.status(401).json({ error: 'Missing token' })
  }

  const decodedToken = jwt.verify(request.token, config.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'Token invalid' })
  }

  request.user = decodedToken.id

  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  idValidator,
  tokenExtractor,
  userExtractor,
}
