import express from 'express'
import 'dotenv/config'
import eventsRouter from './routes/events.js'

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).send('<h1 style="text-align:center; margin-top:50px;">Listicle API</h1>')
})

app.use('/events', eventsRouter)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})



import express from 'express'
import EventsController from '../controllers/events.js'

const router = express.Router()

// GET all Events
router.get('/', EventsController.getEvents)

export default router