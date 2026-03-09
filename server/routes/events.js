import express from 'express'
import { pool } from '../config/database.js'

const router = express.Router()

// GET ALL EVENTS
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events ORDER BY id ASC')

    const events = result.rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      artists: row.artists,
      dateTime: row.datetime,
      venue: row.venue,
      genre: row.genre,
      ticketPrice: row.ticketprice,
      imageUrl: row.imageurl,
      description: row.description,
      submittedBy: row.submittedby,
      submittedOn: row.submittedon
    }))

    res.json(events)
  } catch (error) {
    console.error('Error fetching events:', error)
    res.status(500).json({ error: 'Failed to fetch events' })
  }
})

// GET SINGLE EVENT
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query('SELECT * FROM events WHERE id = $1', [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' })
    }

    const row = result.rows[0]

    const event = {
      id: row.id,
      slug: row.slug,
      name: row.name,
      artists: row.artists,
      dateTime: row.datetime,
      venue: row.venue,
      genre: row.genre,
      ticketPrice: row.ticketprice,
      imageUrl: row.imageurl,
      description: row.description,
      submittedBy: row.submittedby,
      submittedOn: row.submittedon
    }

    res.json(event)
  } catch (error) {
    console.error('Error fetching event:', error)
    res.status(500).json({ error: 'Failed to fetch event' })
  }
})


// UPDATE EVENT (EDIT DATABASE)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, artists, dateTime, venue, genre, ticketPrice, imageUrl, description } = req.body

    const result = await pool.query(
      `
      UPDATE events
      SET
        name = $1,
        artists = $2,
        datetime = $3,
        venue = $4,
        genre = $5,
        ticketprice = $6,
        imageurl = $7,
        description = $8
      WHERE id = $9
      RETURNING *
      `,
      [name, artists, dateTime, venue, genre, ticketPrice, imageUrl, description, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' })
    }

    const row = result.rows[0]

    const updatedEvent = {
      id: row.id,
      slug: row.slug,
      name: row.name,
      artists: row.artists,
      dateTime: row.datetime,
      venue: row.venue,
      genre: row.genre,
      ticketPrice: row.ticketprice,
      imageUrl: row.imageurl,
      description: row.description,
      submittedBy: row.submittedby,
      submittedOn: row.submittedon
    }

    res.json(updatedEvent)

  } catch (error) {
    console.error('Error updating event:', error)
    res.status(500).json({ error: 'Failed to update event' })
  }
})

export default router