const morgan = require('morgan')
morgan.token('body', (request) => JSON.stringify(request.body))

const logger = require('./logger')

const requestLogger = (request, response, next) => {
  morgan(':method :url :status :res[content-length] - :response-time ms :body')

  next()
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({
      error: 'malformated id',
    })
  } else if (error.name === 'ValidationError') {
    logger.info('===')
    return response.status(400).json({
      error: error.message,
    })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({
    error: 'unknown endpoint',
  })
}

module.exports = { requestLogger, unknownEndpoint, errorHandler }
