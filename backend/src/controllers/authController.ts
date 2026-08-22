import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { loginSchema } from '../utils/validation'
import prisma from '../utils/prisma'

export const authController = {
  // Admin login
  async login(req: Request, res: Response) {
    try {
      const { email, password } = loginSchema.parse(req.body)
      
      // Find admin
      const admin = await prisma.admin.findUnique({
        where: { email },
      })
      
      if (!admin) {
        return res.status(401).json({ 
          message: 'Invalid credentials',
          error: 'INVALID_CREDENTIALS'
        })
      }
      
      // Verify password
      const isValidPassword = await bcrypt.compare(password, admin.password)
      
      if (!isValidPassword) {
        return res.status(401).json({ 
          message: 'Invalid credentials',
          error: 'INVALID_CREDENTIALS'
        })
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { id: admin.id, email: admin.email },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      )
      
      res.json({
        token,
        user: {
          id: admin.id,
          email: admin.email,
        }
      })
    } catch (error) {
      console.error('Error logging in:', error)
      res.status(500).json({ 
        message: 'Login failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  },

  // Verify token
  async verify(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(' ')[1]
      
      if (!token) {
        return res.status(401).json({ 
          message: 'No token provided',
          error: 'NO_TOKEN'
        })
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET!)
      res.json({ valid: true, user: decoded })
    } catch (error) {
      res.status(401).json({ 
        valid: false,
        message: 'Invalid token',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  },

  // Change password (admin only)
  async changePassword(req: Request, res: Response) {
    try {
      const { currentPassword, newPassword } = req.body
      const userId = (req as any).user?.id
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Current password and new password are required' })
      }
      
      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'New password must be at least 6 characters' })
      }
      
      // Find admin
      const admin = await prisma.admin.findUnique({
        where: { id: userId },
      })
      
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' })
      }
      
      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, admin.password)
      
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Current password is incorrect' })
      }
      
      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      
      // Update password
      await prisma.admin.update({
        where: { id: userId },
        data: { password: hashedPassword },
      })
      
      res.json({ message: 'Password changed successfully' })
    } catch (error) {
      console.error('Error changing password:', error)
      res.status(500).json({ 
        message: 'Failed to change password',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  },

  // Get admin profile
  async getProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id
      
      const admin = await prisma.admin.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          createdAt: true,
        }
      })
      
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' })
      }
      
      res.json(admin)
    } catch (error) {
      console.error('Error getting profile:', error)
      res.status(500).json({ 
        message: 'Failed to get profile',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
}