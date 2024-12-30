require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/note')

const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

morgan.token('body', (request) => {
  return JSON.stringify(request.body)
})

app.get('/info', (request, response) => {
  const currentDate = new Date()

  Person.countDocuments({}).then((length) => {
    response.send(`<p>Phonebook has info for ${length} people</p>
                   <p>${currentDate.toString()}</p>`)
  })
})

app.get('/api/persons', (request, response) => {
  Person.find({})
    .then((persons) => {
      response.json(persons)
    })
    .catch((error) =>
      response.status(404).json({
        error: error.message,
      })
    )
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(400).end()
      }
    })
    .catch((error) => {
      next(error)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      if (result) {
        response.status(204).end()
      } else {
        response.status(400).end()
      }
    })
    .catch((error) => next(error))
})

const generateId = () => {
  return Math.floor(Math.random() * 1000).toString()
}

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number is missing',
    })
  }

  Person.find({ name: body.name }).then((person) => {
    if (person.length > 0) {
      console.log(person)
      return response.status(400).json({
        error: 'name must be unique',
      })
    }

    const newPerson = new Person({
      id: generateId(),
      name: body.name,
      number: body.number,
    })

    newPerson
      .save()
      .then((savedPerson) => {
        response.json(savedPerson)
      })
      .catch((error) => next(error))
  })
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedPerson) => response.json(updatedPerson))
    .catch((error) => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({
    error: 'unknown endpoint',
  })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({
      error: 'malformated id',
    })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({
      error: error.message,
    })
  }

  next(error)
}

app.use(errorHandler)
