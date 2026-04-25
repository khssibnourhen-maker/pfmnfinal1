import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { env } from './config/env.js'
import authRoutes from './routes/authRoutes.js'
import usersRoutes from './routes/usersRoutes.js'
import mentorsRoutes from './routes/mentorsRoutes.js'
import mentorMatchesRoutes from './routes/mentorMatchesRoutes.js'
import messagesRoutes from './routes/messagesRoutes.js'
import schedulesRoutes from './routes/schedulesRoutes.js'
import cvsRoutes from './routes/cvsRoutes.js'
import aiRoutes from './routes/aiRoutes.js'
import commentsRoutes from './routes/commentsRoutes.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'

export function createApp() {
  const app = express()
  app.use(cors({
    origin(origin, callback) {
      if (!origin || env.clientUrls.includes(origin)) return callback(null, true)
      return callback(new Error(`CORS blocked for origin: ${origin}`))
    },
    credentials: true,
  }))
  app.use(express.json({ limit: '2mb' }))
  app.use(morgan('dev'))

  app.get('/api/health', (_req, res) => res.json({ ok: true, clientUrls: env.clientUrls }))
  app.use('/api/auth', authRoutes)
  app.use('/api/users', usersRoutes)
  app.use('/api/mentors', mentorsRoutes)
  app.use('/api/mentor-matches', mentorMatchesRoutes)
  app.use('/api/messages', messagesRoutes)
  app.use('/api/schedules', schedulesRoutes)
  app.use('/api/cvs', cvsRoutes)
  app.use('/api/ai', aiRoutes)
  app.use('/api/comments', commentsRoutes)

  app.use(notFound)
  app.use(errorHandler)
  return app
}
