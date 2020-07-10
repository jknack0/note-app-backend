const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({}).populate('user', { username: 1, name: 1 })
  response.json(notes)
})

notesRouter.get('/:id', async (request, response) => {
  const id = request.params.id
  const note = await Note.findById(id)
  if(note)
    response.json(note)
  else
    response.status(404).end()
})

notesRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findById(body.userId)

  if(!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const newNote = new Note ({
    content: body.content,
    important: body.important || false,
    date: body.date || new Date(),
    user: user._id,
  })

  const savedNote = await newNote.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  response.json(savedNote)
})

notesRouter.put('/:id', async (request, response) => {
  const { content, important } = request.body
  const id = request.params.id

  const note = {
    content: content,
    important: important,
  }

  const updatedNote = await Note.findByIdAndUpdate(id, note, { new: true })
  response.json(updatedNote)
})

notesRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  await Note.findByIdAndRemove(id)
  response.status(204).end()
})

module.exports = notesRouter