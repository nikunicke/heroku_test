const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Note = require('../models/note')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
    await Note.remove({})

    const noteObjects = helper.initialNotes
        .map(note => new Note(note))

    const promiseArray = noteObjects.map(note => note.save())
    await Promise.all(promiseArray)
})

test('All notes are returned', async () => {
    const response = await api.get('/api/notes')
    expect(response.body.length).toBe(helper.initialNotes.length)
})

test('A specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes')
    const contents = response.body.map(r => r.content)
    expect(contents).toContain(
        'HTTP-protokollan tärkeimmät metodit ovat GET ja POST'
    )
})

test('The first note is about HTTP methods', async() => {
    const response = await api.get('/api/notes')
    expect(response.body[0].content).toBe('HTML on helppoa')
})

test.only('A valid note can be added', async () => {
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

    const contents = notesAtEnd.map(n => n.content)
    expect(contents).toContain(
        'async/await yksinkertaistaa asynkronisten funktioiden kutsua'
    )
})

test('Note without content is not added', async () => {
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

test('A specific note can be viewed', async () => {
    const notesAtStart = await helper.notesInDB()
    const noteToView = notesAtStart[0]
    const resultNote = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    expect(resultNote.body).toEqual(noteToView)
})

test('A note can be deleted', async () => {
    const notesAtStart = await helper.notesInDB()
    const noteToDelete = notesAtStart[0]

    await api
        .delete(`/api/notes/${noteToDelete.id}`)
        .expect(204)

    const notesAtEnd = await helper.notesInDB()
    expect(notesAtEnd.length).toBe(
        helper.initialNotes.length - 1
    )

    const contents = notesAtEnd.map(r => r.content)
    expect(contents).not.toContain(noteToDelete.content)
})

afterAll(() => {
    mongoose.connection.close()
})