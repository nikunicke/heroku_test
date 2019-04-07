if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const Note = require('./models/note')


const app = express()


app.use(express.static('build'))
app.use(bodyParser.json())


morgan.token('data', (req, res) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    }
    return
})
app.use(morgan(':method :url :res[content-length] - :response-time ms :data'))


app.get('/api/notes', (req, res) => {
    Note.find({}).then(notes => {
        res.json(notes.map(note => note.toJSON()))
    })
})

app.get('/api/notes/:id', (req, res, next) => {
    Note.findById(req.params.id).then(note => {
        if (note) {
            res.json(note.toJSON())
        } else {
            res.status(404).end()
        }
    })
    .catch(err => next(err))
})

app.post('/api/notes', (req, res, next) => {
    const body = req.body

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date()
    })

    note.save()
        .then(savedNote => savedNote.toJSON())
        .then(savedAndFormattedNote => {
            res.json(savedAndFormattedNote)
        })
        .catch(err => next(err))
})

app.put('/api/notes/:id', (req, res, next) => {
    const body = req.body

    const note = {
        content: body.content,
        important: body.important,
    }

    Note.findByIdAndUpdate(req.params.id, note, { new: true })
        .then(updatedNote => {
            res.json(updatedNote.toJSON())
        })
        .catch(err => next(err))
})

app.delete('/api/notes/:id', (req, res, next) => {
    Note.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(err => next(err))
})



const unknownEndpoint = (req, res) => {
    res.status(404).send({error: 'Unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.log(error.message)
    if (error.name === 'CastError' && error.kind == 'ObjectId') {
        return res.status(400).send({ error: 'Malformatted id' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    }
    next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
