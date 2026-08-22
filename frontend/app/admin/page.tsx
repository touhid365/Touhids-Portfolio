'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  FaProjectDiagram, 
  FaEnvelope, 
  FaStar, 
  FaArrowRight
} from 'react-icons/fa'

interface DashboardStats {
  totalProjects: number
  featuredProjects: number
  totalMessages: number
  unreadMessages: number
  recentProjects: any[]
  recentMessages: any[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        throw new Error('No token found')
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      
      // Fetch projects
      const projectsRes = await fetch(`${apiUrl}/projects`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (!projectsRes.ok) {
        throw new Error('Failed to fetch projects')
      }
      
      const projectsData = await projectsRes.json()
      const projects = projectsData.data || projectsData || []
      
      // Fetch messages
      const messagesRes = await fetch(`${apiUrl}/contact`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (!messagesRes.ok) {
        throw new Error('Failed to fetch messages')
      }
      
      const messages = await messagesRes.json()

      setStats({
        totalProjects: projects.length,
        featuredProjects: projects.filter((p: any) => p.featured).length,
        totalMessages: messages.length,
        unreadMessages: messages.filter((m: any) => m.status === 'PENDING').length,
        recentProjects: projects.slice(0, 5),
        recentMessages: messages.slice(0, 5),
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  // Dashboard loading state (shown inside admin layout)
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <p className="text-red-500">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Projects',
      value: stats?.totalProjects || 0,
      icon: FaProjectDiagram,
      color: 'bg-blue-500',
      link: '/admin/projects'
    },
    {
      title: 'Featured Projects',
      value: stats?.featuredProjects || 0,
      icon: FaStar,
      color: 'bg-yellow-500',
      link: '/admin/projects'
    },
    {
      title: 'Total Messages',
      value: stats?.totalMessages || 0,
      icon: FaEnvelope,
      color: 'bg-green-500',
      link: '/admin/messages'
    },
    {
      title: 'Unread Messages',
      value: stats?.unreadMessages || 0,
      icon: FaEnvelope,
      color: 'bg-red-500',
      link: '/admin/messages'
    },
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back! Here's what's happening with your portfolio.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <Link href={stat.link} className="block">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full text-white`}>
                  <stat.icon size={24} />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Projects</h2>
            <Link href="/admin/projects" className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1">
              View All <FaArrowRight size={12} />
            </Link>
          </div>
          {stats?.recentProjects?.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No projects yet</p>
          ) : (
            <div className="space-y-3">
              {stats?.recentProjects?.map((project: any) => (
                <Link
                  key={project.id}
                  href={`/admin/projects/${project.id}`}
                  className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{project.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {project.techStack?.slice(0, 3).join(', ')}
                      </p>
                    </div>
                    {project.featured && (
                      <span className="text-yellow-500">⭐</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Messages */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Messages</h2>
            <Link href="/admin/messages" className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1">
              View All <FaArrowRight size={12} />
            </Link>
          </div>
          {stats?.recentMessages?.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No messages yet</p>
          ) : (
            <div className="space-y-3">
              {stats?.recentMessages?.map((message: any) => (
                <div key={message.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{message.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{message.email}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      message.status === 'PENDING' 
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                        : message.status === 'READ'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    }`}>
                      {message.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-1">
                    {message.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/projects/new"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            + Add New Project
          </Link>
          <Link
            href="/admin/messages"
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            View Messages
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem('adminToken')
              localStorage.removeItem('adminUser')
              window.location.href = '/admin/login'
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </motion.div>
    </div>
  )
}