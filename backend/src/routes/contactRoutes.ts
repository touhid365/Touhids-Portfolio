import express from 'express'
import { contactController } from '../controllers/contactController'
import { authenticate } from '../middleware/auth'
import { validate } from '../middleware/validation'
import { contactSchema } from '../utils/validation'

const router = express.Router()

// Public routes
router.post('/', validate(contactSchema), contactController.submit)

// Protected routes (admin only)
router.get('/', authenticate, contactController.getAll)
router.get('/:id', authenticate, contactController.getOne)
router.put('/:id/status', authenticate, contactController.updateStatus)
router.delete('/:id', authenticate, contactController.delete)

export default router