'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Sidebar from '@/app/components/admin/Sidebar'
import Header from '@/app/components/admin/Header'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Check if we're on the login page
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    // If on login page, don't check authentication
    if (isLoginPage) {
      setLoading(false)
      return
    }

    const token = localStorage.getItem('adminToken')
    
    if (!token) {
      router.push('/admin/login')
      setLoading(false)
      return
    }

    // Verify token
    const verifyToken = async () => {
      try {
        const response = await fetch('/api/admin/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        
        if (response.ok) {
          setIsAuthenticated(true)
        } else {
          localStorage.removeItem('adminToken')
          localStorage.removeItem('adminUser')
          router.push('/admin/login')
        }
      } catch (error) {
        console.error('Auth verification failed:', error)
        router.push('/admin/login')
      } finally {
        setLoading(false)
      }
    }

    verifyToken()
  }, [router, pathname, isLoginPage])

  // Show loading - Admin loading state (no navbar, just spinner)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">Loading Admin Panel...</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Please wait</p>
        </div>
      </div>
    )
  }

  // If on login page, render without sidebar
  if (isLoginPage) {
    return <>{children}</>
  }

  // If not authenticated and not on login page, don't render
  if (!isAuthenticated) {
    return null
  }

  // Main admin layout with sidebar
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}