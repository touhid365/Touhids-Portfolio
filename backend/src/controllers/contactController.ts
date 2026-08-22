import { Request, Response } from 'express'
import { contactSchema } from '../utils/validation'
import prisma from '../utils/prisma'

export const contactController = {
  // Submit contact form
  async submit(req: Request, res: Response) {
    try {
      console.log('Received contact data:', req.body)
      
      // Validate with better error handling
      const result = contactSchema.safeParse(req.body)
      
      if (!result.success) {
        // Return detailed validation errors
        return res.status(400).json({ 
          message: 'Validation failed',
          errors: result.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        })
      }

      const validatedData = result.data
      
      // Sanitize input (trim whitespace)
      validatedData.name = validatedData.name.trim()
      validatedData.email = validatedData.email.trim()
      validatedData.message = validatedData.message.trim()
      
      const contact = await prisma.contact.create({
        data: validatedData,
      })
      
      console.log('Contact created:', contact)
      
      res.status(201).json({ 
        message: 'Message sent successfully!',
        id: contact.id 
      })
    } catch (error) {
      console.error('Error submitting contact:', error)
      res.status(500).json({ 
        message: 'Failed to send message',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  },

  // Get all messages (admin only)
  async getAll(req: Request, res: Response) {
    try {
      const { status } = req.query
      const where = status ? { status: status as string } : {}
      
      const messages = await prisma.contact.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      })
      
      res.json(messages)
    } catch (error) {
      console.error('Error fetching messages:', error)
      res.status(500).json({ 
        message: 'Failed to fetch messages',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  },

  // Get single message (admin only)
  async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params
      
      const message = await prisma.contact.findUnique({
        where: { id },
      })
      
      if (!message) {
        return res.status(404).json({ message: 'Message not found' })
      }
      
      res.json(message)
    } catch (error) {
      console.error('Error fetching message:', error)
      res.status(500).json({ 
        message: 'Failed to fetch message',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  },

  // Update message status (admin only)
  async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { status } = req.body
      
      // Validate status
      const validStatuses = ['PENDING', 'READ', 'REPLIED', 'ARCHIVED']
      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({ 
          message: 'Invalid status',
          validStatuses 
        })
      }
      
      // Check if message exists
      const existing = await prisma.contact.findUnique({
        where: { id },
      })
      
      if (!existing) {
        return res.status(404).json({ message: 'Message not found' })
      }
      
      const message = await prisma.contact.update({
        where: { id },
        data: { status },
      })
      
      res.json(message)
    } catch (error) {
      console.error('Error updating message:', error)
      res.status(500).json({ 
        message: 'Failed to update message',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  },

  // Delete message (admin only)
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params
      
      // Check if message exists
      const existing = await prisma.contact.findUnique({
        where: { id },
      })
      
      if (!existing) {
        return res.status(404).json({ message: 'Message not found' })
      }
      
      await prisma.contact.delete({
        where: { id },
      })
      
      res.status(204).send()
    } catch (error) {
      console.error('Error deleting message:', error)
      res.status(500).json({ 
        message: 'Failed to delete message',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  },

  // Get messages count (admin only)
  async getCount(req: Request, res: Response) {
    try {
      const { status } = req.query
      const where = status ? { status: status as string } : {}
      
      const count = await prisma.contact.count({
        where,
      })
      
      res.json({ count })
    } catch (error) {
      console.error('Error counting messages:', error)
      res.status(500).json({ 
        message: 'Failed to count messages',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  },

  // Bulk update status (admin only)
  async bulkUpdateStatus(req: Request, res: Response) {
    try {
      const { ids, status } = req.body
      
      // Validate inputs
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'Invalid ids array' })
      }
      
      const validStatuses = ['PENDING', 'READ', 'REPLIED', 'ARCHIVED']
      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({ 
          message: 'Invalid status',
          validStatuses 
        })
      }
      
      const result = await prisma.contact.updateMany({
        where: {
          id: { in: ids },
        },
        data: { status },
      })
      
      res.json({ 
        message: 'Messages updated successfully',
        updatedCount: result.count 
      })
    } catch (error) {
      console.error('Error bulk updating messages:', error)
      res.status(500).json({ 
        message: 'Failed to update messages',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  },

  // Bulk delete messages (admin only)
  async bulkDelete(req: Request, res: Response) {
    try {
      const { ids } = req.body
      
      // Validate inputs
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'Invalid ids array' })
      }
      
      const result = await prisma.contact.deleteMany({
        where: {
          id: { in: ids },
        },
      })
      
      res.json({ 
        message: 'Messages deleted successfully',
        deletedCount: result.count 
      })
    } catch (error) {
      console.error('Error bulk deleting messages:', error)
      res.status(500).json({ 
        message: 'Failed to delete messages',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  },

  // Search messages (admin only)
  async search(req: Request, res: Response) {
    try {
      const { query } = req.query
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: 'Search query is required' })
      }
      
      const messages = await prisma.contact.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
            { message: { contains: query, mode: 'insensitive' } },
          ],
        },
        orderBy: { createdAt: 'desc' },
      })
      
      res.json(messages)
    } catch (error) {
      console.error('Error searching messages:', error)
      res.status(500).json({ 
        message: 'Failed to search messages',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
}