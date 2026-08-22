// src/controllers/projectController.ts
import { Request, Response } from 'express'
import { projectSchema, updateProjectSchema } from '../utils/validation'
import prisma from '../utils/prisma'

export const projectController = {
  // Get all projects with pagination, search, and filter
  async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 6
      const skip = (page - 1) * limit
      const search = req.query.search as string || ''
      const tech = req.query.tech as string || ''
      const featured = req.query.featured as string
      
      // Build where clause
      const where: any = {}
      
      // Search filter
      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ]
      }
      
      // Tech filter
      if (tech) {
        where.techStack = { has: tech }
      }
      
      // Featured filter
      if (featured === 'true') {
        where.featured = true
      } else if (featured === 'false') {
        where.featured = false
      }
      
      // Get total count for pagination
      const total = await prisma.project.count({ where })
      
      // Get projects
      const projects = await prisma.project.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      })
      
      // Get all unique tech stacks for filter dropdown
      const allProjects = await prisma.project.findMany({
        select: { techStack: true }
      })
      const allTechs = [...new Set(allProjects.flatMap(p => p.techStack))].sort()
      
      res.json({
        data: projects,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
        filters: {
          techs: allTechs,
        }
      })
    } catch (error) {
      console.error('Error fetching projects:', error)
      res.status(500).json({ 
        message: 'Failed to fetch projects',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  },

  // Get single project with detailed info
  async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params
      
      const project = await prisma.project.findUnique({
        where: { id },
      })
      
      if (!project) {
        return res.status(404).json({ message: 'Project not found' })
      }
      
      // Get related projects (same tech stack)
      const relatedProjects = await prisma.project.findMany({
        where: {
          id: { not: id },
          techStack: { hasSome: project.techStack },
        },
        take: 3,
        orderBy: { createdAt: 'desc' },
      })
      
      res.json({
        ...project,
        related: relatedProjects,
      })
    } catch (error) {
      console.error('Error fetching project:', error)
      res.status(500).json({ 
        message: 'Failed to fetch project',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  },

  // Get all unique tech stacks (for filter)
  async getTechStacks(req: Request, res: Response) {
    try {
      const projects = await prisma.project.findMany({
        select: { techStack: true }
      })
      const techs = [...new Set(projects.flatMap(p => p.techStack))].sort()
      res.json(techs)
    } catch (error) {
      console.error('Error fetching tech stacks:', error)
      res.status(500).json({ 
        message: 'Failed to fetch tech stacks',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  },

  // Create new project (admin only)
  async create(req: Request, res: Response) {
    try {
      console.log('Creating project with data:', req.body)
      
      const validatedData = projectSchema.parse(req.body)
      
      // Sanitize data
      validatedData.title = validatedData.title.trim()
      validatedData.description = validatedData.description.trim()
      if (validatedData.imageUrl) validatedData.imageUrl = validatedData.imageUrl.trim()
      if (validatedData.liveUrl) validatedData.liveUrl = validatedData.liveUrl?.trim()
      if (validatedData.githubUrl) validatedData.githubUrl = validatedData.githubUrl?.trim()
      
      // Ensure arrays are present
      validatedData.features = validatedData.features || []
      validatedData.screenshots = validatedData.screenshots || []
      validatedData.techStack = validatedData.techStack || []
      
      const project = await prisma.project.create({
        data: validatedData,
      })
      
      console.log('Project created:', project)
      
      res.status(201).json({
        message: 'Project created successfully!',
        data: project
      })
    } catch (error) {
      console.error('Error creating project:', error)
      
      if (error instanceof Error) {
        if (error.name === 'ZodError') {
          return res.status(400).json({
            message: 'Validation failed',
            errors: error.message
          })
        }
      }
      
      res.status(500).json({ 
        message: 'Failed to create project',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  },

  // Update project (admin only)
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params
      console.log(`Updating project ${id} with data:`, req.body)
      
      const validatedData = updateProjectSchema.parse(req.body)
      
      // Check if project exists
      const existing = await prisma.project.findUnique({
        where: { id },
      })
      
      if (!existing) {
        return res.status(404).json({ message: 'Project not found' })
      }
      
      // Sanitize data if present
      if (validatedData.title) validatedData.title = validatedData.title.trim()
      if (validatedData.description) validatedData.description = validatedData.description.trim()
      if (validatedData.imageUrl) validatedData.imageUrl = validatedData.imageUrl.trim()
      if (validatedData.liveUrl) validatedData.liveUrl = validatedData.liveUrl?.trim()
      if (validatedData.githubUrl) validatedData.githubUrl = validatedData.githubUrl?.trim()
      
      const project = await prisma.project.update({
        where: { id },
        data: validatedData,
      })
      
      console.log('Project updated:', project)
      
      res.json({
        message: 'Project updated successfully!',
        data: project
      })
    } catch (error) {
      console.error('Error updating project:', error)
      
      if (error instanceof Error) {
        if (error.name === 'ZodError') {
          return res.status(400).json({
            message: 'Validation failed',
            errors: error.message
          })
        }
      }
      
      res.status(500).json({ 
        message: 'Failed to update project',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  },

  // Delete project (admin only)
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params
      console.log(`Deleting project ${id}`)
      
      const existing = await prisma.project.findUnique({
        where: { id },
      })
      
      if (!existing) {
        return res.status(404).json({ message: 'Project not found' })
      }
      
      await prisma.project.delete({
        where: { id },
      })
      
      console.log('Project deleted:', id)
      
      res.status(204).send()
    } catch (error) {
      console.error('Error deleting project:', error)
      res.status(500).json({ 
        message: 'Failed to delete project',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  },

  // Bulk delete projects (admin only)
  async bulkDelete(req: Request, res: Response) {
    try {
      const { ids } = req.body
      
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'Invalid ids array' })
      }
      
      console.log(`Bulk deleting ${ids.length} projects`)
      
      const result = await prisma.project.deleteMany({
        where: {
          id: { in: ids },
        },
      })
      
      res.json({
        message: 'Projects deleted successfully',
        deletedCount: result.count
      })
    } catch (error) {
      console.error('Error bulk deleting projects:', error)
      res.status(500).json({ 
        message: 'Failed to delete projects',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  },

  // Get featured projects
  async getFeatured(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 3
      
      const projects = await prisma.project.findMany({
        where: { featured: true },
        orderBy: { createdAt: 'desc' },
        take: limit,
      })
      
      res.json(projects)
    } catch (error) {
      console.error('Error fetching featured projects:', error)
      res.status(500).json({ 
        message: 'Failed to fetch featured projects',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  },

  // Get project count
  async getCount(req: Request, res: Response) {
    try {
      const { featured } = req.query
      const where = featured ? { featured: featured === 'true' } : {}
      
      const count = await prisma.project.count({ where })
      
      res.json({ count })
    } catch (error) {
      console.error('Error counting projects:', error)
      res.status(500).json({ 
        message: 'Failed to count projects',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  },

  // Toggle featured status (admin only)
  async toggleFeatured(req: Request, res: Response) {
    try {
      const { id } = req.params
      
      const existing = await prisma.project.findUnique({
        where: { id },
      })
      
      if (!existing) {
        return res.status(404).json({ message: 'Project not found' })
      }
      
      const project = await prisma.project.update({
        where: { id },
        data: { featured: !existing.featured },
      })
      
      res.json({
        message: `Project ${project.featured ? 'featured' : 'unfeatured'} successfully`,
        data: project
      })
    } catch (error) {
      console.error('Error toggling featured status:', error)
      res.status(500).json({ 
        message: 'Failed to toggle featured status',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
}