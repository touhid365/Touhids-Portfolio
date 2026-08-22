import express from 'express'
import { projectController } from '../controllers/projectController'
import { authenticate } from '../middleware/auth'
import { validate } from '../middleware/validation'
import { projectSchema, updateProjectSchema } from '../utils/validation'

const router = express.Router()

// Public routes
router.get('/', projectController.getAll)
router.get('/featured', projectController.getFeatured)
router.get('/techs', projectController.getTechStacks)
router.get('/count', projectController.getCount)
router.get('/:id', projectController.getOne)

// Protected routes (admin only)
router.post('/', authenticate, validate(projectSchema), projectController.create)
router.put('/:id', authenticate, validate(updateProjectSchema), projectController.update)
router.delete('/:id', authenticate, projectController.delete)
router.post('/bulk-delete', authenticate, projectController.bulkDelete)
router.patch('/:id/toggle-featured', authenticate, projectController.toggleFeatured)

export default router