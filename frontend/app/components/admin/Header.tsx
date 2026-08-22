'use client'

import { useState, useEffect } from 'react'
import { FaUser, FaBell } from 'react-icons/fa'

export default function Header() {
  const [user, setUser] = useState<{ email: string } | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem('adminUser')
    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch {
        // Ignore
      }
    }
  }, [])

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex-shrink-0">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {/* Dynamic title can be added here */}
        </h2>
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors relative">
            <FaBell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
              <FaUser size={16} />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.email || 'Admin'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}