import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'

import projectRoutes from './routes/projectRoutes'
import contactRoutes from './routes/contactRoutes'
import authRoutes from './routes/authRoutes'
import prisma from './utils/prisma'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
)

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
  })
)

// Body parsers
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Logger
app.use(
  (req: express.Request, _res: express.Response, next: express.NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
    next()
  }
)

// Routes
app.use('/api/projects', projectRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/auth', authRoutes)

// Health check
app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$connect()
    res.json({
      status: 'ok',
      message: 'Server running'
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed'
    })
  }
})

// Error handler
app.use(
  (err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err)

    if (err.code === 'P2002') {
      return res.status(409).json({ message: 'Duplicate record' })
    }

    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Record not found' })
    }

    res.status(err.status || 500).json({
      message: err.message || 'Something went wrong'
    })
  }
)

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
