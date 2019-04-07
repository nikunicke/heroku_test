require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Note = require('./models/note')


const app = express()

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())


morgan.token('data', (req, res) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    }
    return
})
app.use(morgan(':method :url :res[content-length] - :response-time ms :data'))

let notes = [
    {
        id: 1,
        content: 'HTML on helppoa',
        date: '2017-12-10T17:30:31.098Z',
        important: true
    },
    {
        id: 2,
        content: 'Selain pystyy suorittamaan vain javascriptiä',
        date: '2017-12-10T18:39:34.091Z',
        important: false
    },
    {
        id: 3,
        content: 'HTTP-protokollan tärkeimmät metodit ovat GET ja POST',
        date: '2017-12-10T19:20:14.298Z',
        important: true
    }
]


const generateId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => n.id))
        : 0
    return maxId + 1
}

app.get('/', (req, res) => {
    res.send('<h1>Hello World</h1>')
})


app.get('/api/notes', (req, res) => {
    Note.find({}).then(notes => {
        res.json(notes.map(note => note.toJSON()))
    });
});

app.get('/api/notes/:id', (req, res) => {
    Note.findById(req.params.id).then(note => {
        res.json(note.toJSON())
    })
})

app.post('/api/notes', (req, res) => {
    const body = req.body

    if (!body.content) {
        return res.status(400).json({
            error: 'Content missing'
        })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date()
    })

    note.save().then(savedNote => {
        res.json(savedNote.toJSON())
    })
})

app.delete('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id)
    notes = notes.filter(note => note.id !== id)

    res.status(204).end()
})



const unknownEndpoint = (req, res) => {
    res.status(400).send({error: 'Unknown endpoint'})
}
app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
