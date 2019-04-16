const config = require('./utils/config')
const express = require('express')
const bodyParser = require('bodyparser')
const app = express()
const notesRouter = require('./controllers/notes')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')

console.log('Connecting to ', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })
        .then(() => {
            console.log('Connected to MongoDB')
        })
        .catch(err => {
            console.log('Error connecting to MongoDB: ', err.message)
        })

app.use(express.static('build'))
app.use(bodyParser.json())
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app