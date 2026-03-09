import express from 'express'
import 'dotenv/config'
import path from 'path'
import { fileURLToPath } from 'url'
import eventsRouter from './routes/events.js'

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.json())
app.use(express.static(path.join(__dirname, '../client')))

app.use('/events', eventsRouter)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'))
})

const PORT = process.env.PORT || 3008
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})