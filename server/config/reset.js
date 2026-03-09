import 'dotenv/config'
import { pool } from './database.js'
import eventData from '../data/events.js'

console.log('PGHOST:', process.env.PGHOST)
console.log('PGDATABASE:', process.env.PGDATABASE)

async function createEventsTable() {
  const createTableQuery = `
    DROP TABLE IF EXISTS events;

    CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        artists TEXT[],
        dateTime TIMESTAMP NOT NULL,
        venue VARCHAR(255) NOT NULL,
        genre VARCHAR(100),
        ticketPrice INTEGER,
        imageUrl TEXT,
        description TEXT,
        submittedBy VARCHAR(255),
        submittedOn TIMESTAMP
    );
  `

  try {
    await pool.query(createTableQuery)
    console.log('🎉 events table created successfully')
  } catch (err) {
    console.error('⚠️ error creating events table', err)
    throw err
  }
}

async function seedEventsTable() {
  const insertQuery = `
    INSERT INTO events 
    (slug, name, artists, dateTime, venue, genre, ticketPrice, imageUrl, description, submittedBy, submittedOn)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11);
  `

  try {
    for (const event of eventData) {
      const values = [
        event.slug,
        event.name,
        event.artists,
        event.dateTime,
        event.venue,
        event.genre,
        event.ticketPrice,
        event.imageUrl,
        event.description,
        event.submittedBy,
        event.submittedOn
      ]

      await pool.query(insertQuery, values)
      console.log(`✅ ${event.name} added successfully`)
    }

    console.log(`✅ seeded ${eventData.length} events`)
  } catch (err) {
    console.error('⚠️ error inserting events', err)
    throw err
  }
}

async function resetDatabase() {
  try {
    await createEventsTable()
    await seedEventsTable()
  } catch (err) {
    console.error('❌ reset failed:', err)
  } finally {
    await pool.end()
  }
}

resetDatabase()