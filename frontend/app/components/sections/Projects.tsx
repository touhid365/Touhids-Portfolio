'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Project {
  id: string
  title: string
  description: string
  features: string[]
  techStack: string[]
  imageUrl: string
  screenshots: string[]
  liveUrl: string
  githubUrl: string
  featured?: boolean
}

interface PaginationData {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

interface FilterData {
  techs: string[]
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationData | null>(null)
  const [filters, setFilters] = useState<FilterData>({ techs: [] })
  
  // Search and filter state
  const [searchInput, setSearchInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTech, setSelectedTech] = useState('')
  const [selectedFeatured, setSelectedFeatured] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  
  // Ref for projects section
  const projectsRef = useRef<HTMLDivElement>(null)

  const fetchProjects = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams()
      params.append('page', currentPage.toString())
      params.append('limit', '6')
      if (searchTerm) params.append('search', searchTerm)
      if (selectedTech) params.append('tech', selectedTech)
      if (selectedFeatured) params.append('featured', selectedFeatured)
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const response = await fetch(`${apiUrl}/projects?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects')
      }
      
      const data = await response.json()
      setProjects(data.data)
      setPagination(data.pagination)
      setFilters(data.filters)
    } catch (error) {
      console.error('Error fetching projects:', error)
      setError(error instanceof Error ? error.message : 'Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  // Initial load and when filters change
  useEffect(() => {
    fetchProjects()
  }, [currentPage, searchTerm, selectedTech, selectedFeatured])

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchTerm(searchInput.trim())
    setCurrentPage(1)
  }

  // Handle Enter key press in search input
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch(e)
    }
  }

  // Handle filter changes
  const handleTechChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTech(e.target.value)
    setCurrentPage(1)
  }

  const handleFeaturedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFeatured(e.target.value)
    setCurrentPage(1)
  }

  // Handle page change without scrolling to top
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    if (projectsRef.current) {
      const offset = 80
      const top = projectsRef.current.getBoundingClientRect().top + window.pageYOffset - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  const clearFilters = () => {
    setSearchInput('')
    setSearchTerm('')
    setSelectedTech('')
    setSelectedFeatured('')
    setCurrentPage(1)
  }

  // Strip HTML tags for description preview
  const stripHtml = (html: string) => {
    const tmp = document.createElement('div')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
  }

  // Truncate text with limit
  const truncateText = (text: string, limit: number = 100) => {
    if (text.length <= limit) return text
    return text.substring(0, limit) + '...'
  }

  if (loading && projects.length === 0) {
    return (
      <section className="py-20 bg-white dark:bg-gray-900" id="projects">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading projects...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20 bg-white dark:bg-gray-900" id="projects">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Failed to Load Projects
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
            <button
              onClick={fetchProjects}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-white dark:bg-gray-900" id="projects" ref={projectsRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            My Projects
          </h2>
          <div className="w-20 h-1 bg-blue-500 mx-auto mt-4"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Here are some of the projects I've worked on.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search projects by title or description..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={selectedTech}
                onChange={handleTechChange}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="">All Technologies</option>
                {filters?.techs?.map((tech) => (
                  <option key={tech} value={tech}>{tech}</option>
                ))}
              </select>
              <select
                value={selectedFeatured}
                onChange={handleFeaturedChange}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="">All Projects</option>
                <option value="true">⭐ Featured Only</option>
                <option value="false">📋 Non-Featured</option>
              </select>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </button>
              {(searchInput || selectedTech || selectedFeatured) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
          </form>
          
          {/* Results count */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            {pagination && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing {projects.length} of {pagination.total} projects
                {searchTerm && ` (search: "${searchTerm}")`}
                {selectedTech && ` (tech: ${selectedTech})`}
                {selectedFeatured === 'true' && ' (⭐ Featured)'}
                {selectedFeatured === 'false' && ' (📋 Non-Featured)'}
              </p>
            )}
            {loading && (
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                Updating...
              </div>
            )}
          </div>
        </div>

        {/* Loading overlay */}
        {loading && projects.length > 0 && (
          <div className="relative">
            <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
              <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg">
                <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
                <span className="text-gray-700 dark:text-gray-300">Updating projects...</span>
              </div>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-600 dark:text-gray-400">No projects found</p>
            {(searchTerm || selectedTech || selectedFeatured) && (
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
            {projects.map((project, index) => {
              const plainDescription = stripHtml(project.description)
              const truncatedDesc = truncateText(plainDescription, 100)
              
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col"
                >
                  <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
                    {project.imageUrl ? (
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                        📱
                      </div>
                    )}
                    {project.featured && (
                      <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        ⭐ Featured
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                      {project.title}
                    </h3>
                    
                    {/* Description with HTML stripped for preview */}
                    <div className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-1">
                      {truncatedDesc}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.techStack.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                          +{project.techStack.length - 3}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <Link
                        href={`/projects/${project.id}`}
                        className="inline-flex items-center text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors text-sm"
                      >
                        Read More
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                      <div className="flex space-x-3">
                        {project.liveUrl && project.liveUrl !== '#' && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400 transition-colors"
                            title="Live Demo"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                        {project.githubUrl && project.githubUrl !== '#' && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                            title="GitHub"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.62.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-12 flex flex-wrap justify-center items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.hasPrev}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              ← Previous
            </button>
            
            <div className="flex flex-wrap gap-1">
              {pagination.totalPages > 5 && pagination.page > 3 && (
                <>
                  <button
                    onClick={() => handlePageChange(1)}
                    className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 transition-colors"
                  >
                    1
                  </button>
                  {pagination.page > 4 && <span className="px-2 flex items-center">...</span>}
                </>
              )}
              
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter(page => {
                  if (pagination.totalPages <= 5) return true
                  return Math.abs(page - pagination.page) <= 1 || page === 1 || page === pagination.totalPages
                })
                .map((page, index, array) => {
                  if (index > 0 && page - array[index - 1] > 1) {
                    return (
                      <span key={`ellipsis-${page}`} className="px-2 flex items-center text-gray-500">
                        ...
                      </span>
                    )
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        page === pagination.page
                          ? 'bg-blue-500 text-white'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}
            </div>

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.hasNext}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </section>
  )
}