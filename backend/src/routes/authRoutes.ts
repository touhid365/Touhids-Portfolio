import express from 'express'
import { authController } from '../controllers/authController'
import { validate } from '../middleware/validation'
import { loginSchema } from '../utils/validation'

const router = express.Router()

router.post('/login', validate(loginSchema), authController.login)
router.get('/verify', authController.verify)

export default router