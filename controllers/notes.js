const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({})
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

  if(!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const newNote = new Note ({
    content: body.content,
    important: body.important || false,
    date: body.date || new Date(),
  })

  const savedNote = await newNote.save()
  response.json(savedNote)
})

notesRouter.put('/:id', (request, response, next) => {
  const { content, important } = request.body
  const id = request.params.id

  const note = {
    content: content,
    important: important,
  }

  Note
    .findByIdAndUpdate(id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

notesRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  await Note.findByIdAndRemove(id)
  response.status(204).end()
})

module.exports = notesRouter