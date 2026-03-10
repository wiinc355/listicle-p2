import express from 'express'
import 'dotenv/config'
import path from 'path'
import session from 'express-session'
import { fileURLToPath } from 'url'
import eventsRouter from './routes/events.js'

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fallbacksecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60
    }
  })
)

app.use(express.static(path.join(__dirname, '../client')))

app.post('/login', (req, res) => {
  const { username, password } = req.body

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    req.session.isAdmin = true
    return res.json({ success: true })
  }

  res.status(401).json({ success: false, message: 'Invalid credentials' })
})

app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true })
  })
})

app.get('/me', (req, res) => {
  res.json({ isAdmin: !!req.session.isAdmin })
})

app.use('/events', eventsRouter)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'))
})

const PORT = process.env.PORT || 3008

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})