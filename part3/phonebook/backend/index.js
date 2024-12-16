require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/note')

const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

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

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then((note) => {
    response.json(note)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id).then((person) => {
    response.status(204).end()
  })
})

const generateId = () => {
  return Math.floor(Math.random() * 1000).toString()
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number is missing',
    })
  }

  Person.find({ name: body.name }).then((person) => {
    if (person) {
      return response.status(400).json({
        error: 'name must be unique',
      })
    }

    const newPerson = new Person({
      id: generateId(),
      name: body.name,
      number: body.number,
    })

    newPerson.save().then((savedPerson) => {
      response.json(savedPerson)
    })
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
