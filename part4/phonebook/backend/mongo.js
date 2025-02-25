const mongoose = require('mongoose')
const Person = require('./models/person')
const logger = require('./utils/logger')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

mongoose
  .connect(url)
  .then(() => {
    logger.info('Connected to MongoDB')
  })
  .catch((error) => {
    logger.info('Error connecting to MongoDB', error.message)
  })
