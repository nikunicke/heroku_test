const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Note = require('../models/note')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

describe('when there is initially saved data', async () => {
    beforeEach(async () => {
        await Note.deleteMany({})

        const noteObject = helper.initialNotes
            .map(note => new Note(note))

        const promiseArray = noteObject.map(note => note.save())
        await Promise.all(promiseArray)
    })

    test('ntoes are returned as json', async () => {
        await api
            .get('/api/notes')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all notes are returned', async () => {
        const res = await api.get('/api/notes')
        expect(res.body.length).toBe(helper.initialNotes.length)
    })

    test('a specific note is withoin the returned notes', async () => {
        const res = await api.get('/api/notes')
        const contents = res.body.map(r => r.content)
        expect(contents).toContain(
            'HTTP-protokollan tärkeimmät metodit ovat GET ja POST'
        )
    })

    describe('viweing a specific note', async () => {
        test('succeeds with a valid id', async () => {
            const notesAtStart = await helper.notesInDB()
            const noteToView = notesAtStart[0]
            const resultNote = await api
                .get(`/api/notes/${noteToView.id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            expect(resultNote.body).toEqual(noteToView)
        })

        test('fails with status code 400 if id is invalid', async() => {
            const invalidId = '5a3d5da59070081a82a3445'

            await api
                .get(`/api/notes/${invalidId}`)
                .expect(400)
        })
    })

    describe('addition of a new note', async () => {
        test('succeeds with valid data', async () => {
            const newNote = {
                content: 'async/await yksinkertaistaa asynkronisten funktioiden kutsua',
                important: true
            }

            await api
                .post('/api/notes')
                .send(newNote)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            const notesAtEnd = await helper.notesInDB()
            expect(notesAtEnd.length).toBe(helper.initialNotes.length + 1)

            const contents = notesAtEnd.map(note => note.content)
            expect(contents).toContain(
                'async/await yksinkertaistaa asynkronisten funktioiden kutsua'
            )
        })

        test('fails with status code 400 if data invalid', async () => {
            const newNote = {
                important: true
            }

            await api
                .post('/api/notes')
                .send(newNote)
                .expect(400)

            const notesAtEnd = await helper.notesInDB()
            expect(notesAtEnd.length).toBe(helper.initialNotes.length)
        })
    })

    describe('deletion of note', async () => {
        test('succeeds with status code 200 if id is valid', async () => {
            const notesAtStart = await helper.notesInDB()
            const noteToDelete = notesAtStart[0]

            await api
                .delete(`/api/notes/${noteToDelete.id}`)
                .expect(204)

            const notesAtEnd = await helper.notesInDB()
            expect(notesAtEnd.length).toBe(helper.initialNotes.length - 1)

            const contents = notesAtEnd.map(note => note.content)
            expect(contents).not.toContain(noteToDelete.content)
        })
    })
})

describe('when there is initially one user at db', async () => {
    beforeEach(async () => {
        await User.deleteMany({})
        const user = new User({ username: 'root', name: 'Superuser', password: 'sekret' })
        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDB()

        const newUser = {
            username: 'nikunicke',
            name: 'Nikolassos Martyren',
            password: 'password'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDB()
        expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(user => user.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper status code and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDB()
        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('`username` to be unique')

        const usersAtEnd = await helper.usersInDB()
        expect(usersAtEnd.length).toBe(usersAtStart.length)
    })
})

afterAll(() => {
    mongoose.connection.close()
})