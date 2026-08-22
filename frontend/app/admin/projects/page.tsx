'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaEdit, FaTrash, FaStar, FaRegStar, FaPlus } from 'react-icons/fa'

interface Project {
  id: string
  title: string
  description: string
  techStack: string[]
  imageUrl: string
  liveUrl: string
  githubUrl: string
  featured: boolean
  createdAt: string
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const response = await fetch(`${apiUrl}/projects`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!response.ok) throw new Error('Failed to fetch projects')

      const data = await response.json()
      setProjects(data.data || data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
      setError('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      const token = localStorage.getItem('adminToken')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const response = await fetch(`${apiUrl}/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!response.ok) throw new Error('Failed to delete project')

      setProjects(projects.filter(p => p.id !== id))
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Failed to delete project')
    }
  }

  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('adminToken')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const response = await fetch(`${apiUrl}/projects/${id}/toggle-featured`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!response.ok) throw new Error('Failed to toggle featured status')

      setProjects(projects.map(p => 
        p.id === id ? { ...p, featured: !currentStatus } : p
      ))
    } catch (error) {
      console.error('Error toggling featured:', error)
      alert('Failed to toggle featured status')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedProjects.length === 0) return
    if (!confirm(`Delete ${selectedProjects.length} selected projects?`)) return

    try {
      const token = localStorage.getItem('adminToken')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const response = await fetch(`${apiUrl}/projects/bulk-delete`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ ids: selectedProjects })
      })

      if (!response.ok) throw new Error('Failed to delete projects')

      setProjects(projects.filter(p => !selectedProjects.includes(p.id)))
      setSelectedProjects([])
    } catch (error) {
      console.error('Error deleting projects:', error)
      alert('Failed to delete projects')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your portfolio projects</p>
        </div>
        <div className="flex gap-3">
          {selectedProjects.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Delete Selected ({selectedProjects.length})
            </button>
          )}
          <Link
            href="/admin/projects/new"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <FaPlus size={16} />
            Add Project
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {projects.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <p className="text-gray-500 dark:text-gray-400">No projects yet</p>
          <Link
            href="/admin/projects/new"
            className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Create your first project
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedProjects.length === projects.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProjects(projects.map(p => p.id))
                        } else {
                          setSelectedProjects([])
                        }
                      }}
                      className="rounded border-gray-300 dark:border-gray-600"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Technologies
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Featured
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {projects.map((project) => (
                  <motion.tr
                    key={project.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProjects.includes(project.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProjects([...selectedProjects, project.id])
                          } else {
                            setSelectedProjects(selectedProjects.filter(id => id !== project.id))
                          }
                        }}
                        className="rounded border-gray-300 dark:border-gray-600"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {project.imageUrl && (
                          <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {project.title}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                            {project.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {project.techStack.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.techStack.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-full">
                            +{project.techStack.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleFeatured(project.id, project.featured)}
                        className="text-yellow-500 hover:text-yellow-600 transition-colors"
                      >
                        {project.featured ? <FaStar size={20} /> : <FaRegStar size={20} />}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/projects/${project.id}`}
                          className="p-2 text-blue-500 hover:text-blue-600 transition-colors"
                        >
                          <FaEdit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="p-2 text-red-500 hover:text-red-600 transition-colors"
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}