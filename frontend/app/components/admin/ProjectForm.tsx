'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaPlus, FaTimes, FaTrash, FaUpload } from 'react-icons/fa'
import { BsListCheck } from 'react-icons/bs'
import { HiOutlineCode } from 'react-icons/hi'

interface ProjectFormData {
  title: string
  description: string
  features: string[]
  techStack: string[]
  imageUrl: string
  screenshots: string[]
  liveUrl: string
  githubUrl: string
  featured: boolean
}

interface ProjectFormProps {
  initialData?: ProjectFormData & { id?: string }
  isEdit?: boolean
}

export default function ProjectForm({ initialData, isEdit = false }: ProjectFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [techInput, setTechInput] = useState('')
  const [screenshotInput, setScreenshotInput] = useState('')
  const [featureInput, setFeatureInput] = useState('')
  
  const [formData, setFormData] = useState<ProjectFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    features: initialData?.features || [],
    techStack: initialData?.techStack || [],
    imageUrl: initialData?.imageUrl || '',
    screenshots: initialData?.screenshots || [],
    liveUrl: initialData?.liveUrl || '',
    githubUrl: initialData?.githubUrl || '',
    featured: initialData?.featured || false,
  })

  // Tech Stack handlers
  const handleTechAdd = () => {
    if (techInput.trim() && !formData.techStack.includes(techInput.trim())) {
      setFormData({
        ...formData,
        techStack: [...formData.techStack, techInput.trim()]
      })
      setTechInput('')
    }
  }

  const handleTechRemove = (tech: string) => {
    setFormData({
      ...formData,
      techStack: formData.techStack.filter(t => t !== tech)
    })
  }

  const handleTechKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleTechAdd()
    }
  }

  // Features handlers
  const handleFeatureAdd = () => {
    if (featureInput.trim() && !formData.features.includes(featureInput.trim())) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput.trim()]
      })
      setFeatureInput('')
    }
  }

  const handleFeatureRemove = (feature: string) => {
    setFormData({
      ...formData,
      features: formData.features.filter(f => f !== feature)
    })
  }

  const handleFeatureKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleFeatureAdd()
    }
  }

  // Screenshot handlers
  const handleScreenshotAdd = () => {
    if (screenshotInput.trim() && !formData.screenshots.includes(screenshotInput.trim())) {
      setFormData({
        ...formData,
        screenshots: [...formData.screenshots, screenshotInput.trim()]
      })
      setScreenshotInput('')
    }
  }

  const handleScreenshotKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleScreenshotAdd()
    }
  }

  const handleScreenshotRemove = (screenshot: string) => {
    setFormData({
      ...formData,
      screenshots: formData.screenshots.filter(s => s !== screenshot)
    })
  }

  const handleScreenshotReorder = (index: number, direction: 'up' | 'down') => {
    const newScreenshots = [...formData.screenshots]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= newScreenshots.length) return
    
    const [removed] = newScreenshots.splice(index, 1)
    newScreenshots.splice(newIndex, 0, removed)
    
    setFormData({
      ...formData,
      screenshots: newScreenshots
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('adminToken')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      
      const url = isEdit 
        ? `${apiUrl}/projects/${initialData?.id}`
        : `${apiUrl}/projects`
      
      const method = isEdit ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save project')
      }

      router.push('/admin/projects')
    } catch (error) {
      console.error('Error saving project:', error)
      setError(error instanceof Error ? error.message : 'Failed to save project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-3xl mx-auto"
    >
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {isEdit ? 'Edit Project' : 'Create New Project'}
      </h1>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Project title"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
            placeholder="Project description"
          />
        </div>

        {/* Features */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <span className="flex items-center gap-2">
              <BsListCheck className="text-purple-500" size={20} />
              Key Features
            </span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyPress={handleFeatureKeyPress}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Add feature (e.g., User authentication)"
            />
            <button
              type="button"
              onClick={handleFeatureAdd}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
            >
              <FaPlus className="w-4 h-4" />
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.features.map((feature) => (
              <span
                key={feature}
                className="flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full text-sm"
              >
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                {feature}
                <button
                  type="button"
                  onClick={() => handleFeatureRemove(feature)}
                  className="hover:text-red-500 transition-colors"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </span>
            ))}
            {formData.features.length === 0 && (
              <span className="text-sm text-gray-500 dark:text-gray-400">No features added</span>
            )}
          </div>
        </div>

        {/* Tech Stack */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <span className="flex items-center gap-2">
              <HiOutlineCode className="text-blue-500" size={20} />
              Technologies *
            </span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyPress={handleTechKeyPress}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Add technology (e.g., React)"
            />
            <button
              type="button"
              onClick={handleTechAdd}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <FaPlus className="w-4 h-4" />
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.techStack.map((tech) => (
              <span
                key={tech}
                className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-sm"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => handleTechRemove(tech)}
                  className="hover:text-red-500 transition-colors"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </span>
            ))}
            {formData.techStack.length === 0 && (
              <span className="text-sm text-gray-500 dark:text-gray-400">No technologies added</span>
            )}
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Main Image URL *
          </label>
          <input
            type="url"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="https://example.com/image.jpg"
          />
          {formData.imageUrl && (
            <div className="mt-2">
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="h-32 w-full object-cover rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            </div>
          )}
        </div>

        {/* Screenshots */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Screenshots
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={screenshotInput}
              onChange={(e) => setScreenshotInput(e.target.value)}
              onKeyPress={handleScreenshotKeyPress}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Add screenshot URL"
            />
            <button
              type="button"
              onClick={handleScreenshotAdd}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <FaUpload className="w-4 h-4" />
              Add
            </button>
          </div>
          
          {/* Screenshots Gallery */}
          {formData.screenshots.length > 0 && (
            <div className="mt-3">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {formData.screenshots.map((screenshot, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={screenshot}
                      alt={`Screenshot ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/placeholder.svg'
                      }}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleScreenshotReorder(index, 'up')}
                        disabled={index === 0}
                        className="p-1 bg-white/20 hover:bg-white/40 rounded text-white disabled:opacity-30"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => handleScreenshotReorder(index, 'down')}
                        disabled={index === formData.screenshots.length - 1}
                        className="p-1 bg-white/20 hover:bg-white/40 rounded text-white disabled:opacity-30"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => handleScreenshotRemove(screenshot)}
                        className="p-1 bg-red-500/80 hover:bg-red-600 rounded text-white"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                      #{index + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {formData.screenshots.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              No screenshots added. Add URLs for project screenshots.
            </p>
          )}
        </div>

        {/* Live URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Live Demo URL
          </label>
          <input
            type="url"
            value={formData.liveUrl}
            onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="https://example.com"
          />
        </div>

        {/* GitHub URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            GitHub URL
          </label>
          <input
            type="url"
            value={formData.githubUrl}
            onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="https://github.com/username/repo"
          />
        </div>

        {/* Featured */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="featured"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="w-4 h-4 text-blue-500 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500"
          />
          <label htmlFor="featured" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            ⭐ Feature this project
          </label>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : isEdit ? 'Update Project' : 'Create Project'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/projects')}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  )
}
