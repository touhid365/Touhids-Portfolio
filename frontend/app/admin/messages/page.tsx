'use client'

import { useState, useEffect } from 'react'
import MessageTable from '@/app/components/admin/MessageTable'

interface Message {
  id: string
  name: string
  email: string
  message: string
  status: 'PENDING' | 'READ' | 'REPLIED' | 'ARCHIVED'
  createdAt: string
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const response = await fetch(`${apiUrl}/contact`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!response.ok) throw new Error('Failed to fetch messages')

      const data = await response.json()
      setMessages(data || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
      setError('Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem('adminToken')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const response = await fetch(`${apiUrl}/contact/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      })

      if (!response.ok) throw new Error('Failed to update status')

      setMessages(messages.map(m => 
        m.id === id ? { ...m, status: status as Message['status'] } : m
      ))
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('adminToken')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const response = await fetch(`${apiUrl}/contact/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!response.ok) throw new Error('Failed to delete message')

      setMessages(messages.filter(m => m.id !== id))
    } catch (error) {
      console.error('Error deleting message:', error)
      alert('Failed to delete message')
    }
  }

  const handleBulkDelete = async (ids: string[]) => {
    try {
      // Since we don't have a bulk delete endpoint, delete one by one
      for (const id of ids) {
        await handleDelete(id)
      }
    } catch (error) {
      console.error('Error bulk deleting:', error)
      alert('Failed to delete messages')
    }
  }

  const handleBulkStatusUpdate = async (ids: string[], status: string) => {
    try {
      for (const id of ids) {
        await handleStatusUpdate(id, status)
      }
    } catch (error) {
      console.error('Error bulk updating status:', error)
      alert('Failed to update messages')
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Messages</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage contact form submissions</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <MessageTable
        messages={messages}
        onStatusUpdate={handleStatusUpdate}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        onBulkStatusUpdate={handleBulkStatusUpdate}
      />
    </div>
  )
}