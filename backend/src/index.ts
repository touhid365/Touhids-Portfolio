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

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}))
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  next()
})

// Routes
app.use('/api/projects', projectRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/auth', authRoutes)

// Health check
app.get('/api/health', async (_req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`
    res.json({ 
      status: 'ok', 
      message: 'Server is running',
      database: 'connected',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Database connection error:', error)
    res.status(500).json({ 
      status: 'error', 
      message: 'Database connection failed',
      timestamp: new Date().toISOString()
    })
  }
})

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err.stack)
  
  // Handle Prisma errors
  if (err.code === 'P2002') {
    return res.status(409).json({
      message: 'A record with this data already exists',
      field: err.meta?.target
    })
  }
  
  if (err.code === 'P2025') {
    return res.status(404).json({
      message: 'Record not found'
    })
  }

  // Ensure we always return a response
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('SIGINT received. Closing HTTP server...')
  await prisma.$disconnect()
  console.log('Database disconnected')
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Closing HTTP server...')
  await prisma.$disconnect()
  console.log('Database disconnected')
  process.exit(0)
})

// IMPORTANT: Bind to 0.0.0.0 for Render
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📍 API URL: http://localhost:${PORT}/api`)
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
})
