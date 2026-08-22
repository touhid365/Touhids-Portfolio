// src/utils/validation.ts
import { z } from 'zod'

export const projectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  features: z.array(z.string()).optional().default([]),
  techStack: z.array(z.string()).min(1, 'At least one technology is required'),
  imageUrl: z.string().url('Invalid image URL'),
  screenshots: z.array(z.string()).optional().default([]),
  liveUrl: z.string().url('Invalid URL').optional().nullable(),
  githubUrl: z.string().url('Invalid URL').optional().nullable(),
  featured: z.boolean().optional().default(false),
})

export const updateProjectSchema = projectSchema.partial()

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string()
    .min(1, 'Message cannot be empty')
    .max(1000, 'Message must be less than 1000 characters'),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type ProjectInput = z.infer<typeof projectSchema>
export type ContactInput = z.infer<typeof contactSchema>
export type LoginInput = z.infer<typeof loginSchema>