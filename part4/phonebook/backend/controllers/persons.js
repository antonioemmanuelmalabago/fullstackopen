const personRouter = require('express').Router()
const Person = require('../models/person')

personRouter.get('/', (request, response) => {
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

personRouter.get('/:id', (request, response, next) => {
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

personRouter.delete('/:id', (request, response, next) => {
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

personRouter.post('/', (request, response, next) => {
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

personRouter.put('/:id', (request, response, next) => {
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

module.exports = personRouter
