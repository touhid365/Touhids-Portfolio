'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaTrash, 
  FaCheck, 
  FaReply, 
  FaArchive, 
  FaEnvelope,
  FaEnvelopeOpen,
  FaUser,
  FaCalendar,
  FaTag,
  FaSearch,
  FaFilter,
  FaTimes,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa'

interface Message {
  id: string
  name: string
  email: string
  message: string
  status: 'PENDING' | 'READ' | 'REPLIED' | 'ARCHIVED'
  createdAt: string
}

interface MessageTableProps {
  messages: Message[]
  loading?: boolean
  onStatusUpdate: (id: string, status: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onBulkDelete: (ids: string[]) => Promise<void>
  onBulkStatusUpdate: (ids: string[], status: string) => Promise<void>
}

export default function MessageTable({
  messages,
  loading = false,
  onStatusUpdate,
  onDelete,
  onBulkDelete,
  onBulkStatusUpdate
}: MessageTableProps) {
  const [selectedMessages, setSelectedMessages] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null)
  const [sortField, setSortField] = useState<keyof Message>('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'READ':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'REPLIED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <FaEnvelope className="text-yellow-500" />
      case 'READ':
        return <FaEnvelopeOpen className="text-blue-500" />
      case 'REPLIED':
        return <FaReply className="text-green-500" />
      case 'ARCHIVED':
        return <FaArchive className="text-gray-500" />
      default:
        return <FaEnvelope />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Pending'
      case 'READ': return 'Read'
      case 'REPLIED': return 'Replied'
      case 'ARCHIVED': return 'Archived'
      default: return status
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMessages(filteredMessages.map(m => m.id))
    } else {
      setSelectedMessages([])
    }
  }

  const handleSelectMessage = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedMessages([...selectedMessages, id])
    } else {
      setSelectedMessages(selectedMessages.filter(msgId => msgId !== id))
    }
  }

  const handleBulkAction = async (action: string) => {
    if (selectedMessages.length === 0) return

    if (action === 'delete') {
      if (!confirm(`Delete ${selectedMessages.length} selected messages?`)) return
      await onBulkDelete(selectedMessages)
      setSelectedMessages([])
    } else if (action === 'read') {
      await onBulkStatusUpdate(selectedMessages, 'READ')
      setSelectedMessages([])
    } else if (action === 'archive') {
      await onBulkStatusUpdate(selectedMessages, 'ARCHIVED')
      setSelectedMessages([])
    }
  }

  const handleSort = (field: keyof Message) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const filteredMessages = messages
    .filter(message => {
      const matchesSearch = 
        message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.message.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter ? message.status === statusFilter : true
      
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      const aVal = a[sortField] || ''
      const bVal = b[sortField] || ''
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }
      
      // For dates or other types
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading messages...</span>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search messages by name, email, or content..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="READ">Read</option>
              <option value="REPLIED">Replied</option>
              <option value="ARCHIVED">Archived</option>
            </select>

            {selectedMessages.length > 0 && (
              <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-lg">
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {selectedMessages.length} selected
                </span>
                <button
                  onClick={() => setSelectedMessages([])}
                  className="p-1 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-full transition-colors"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedMessages.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => handleBulkAction('read')}
              className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <FaCheck size={14} />
              Mark as Read
            </button>
            <button
              onClick={() => handleBulkAction('archive')}
              className="px-3 py-1.5 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              <FaArchive size={14} />
              Archive
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              <FaTrash size={14} />
              Delete Selected
            </button>
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700/50 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
        Showing {filteredMessages.length} of {messages.length} messages
        {statusFilter && ` (filtered by: ${getStatusLabel(statusFilter)})`}
        {searchTerm && ` (search: "${searchTerm}")`}
      </div>

      {/* Message List */}
      {filteredMessages.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-gray-500 dark:text-gray-400">No messages found</p>
          {(searchTerm || statusFilter) && (
            <button
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('')
              }}
              className="mt-4 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <AnimatePresence>
            {filteredMessages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                  message.status === 'PENDING' ? 'bg-yellow-50/50 dark:bg-yellow-900/10' : ''
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <div className="pt-1">
                      <input
                        type="checkbox"
                        checked={selectedMessages.includes(message.id)}
                        onChange={(e) => handleSelectMessage(message.id, e.target.checked)}
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <FaUser size={18} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {message.name}
                        </h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          &lt;{message.email}&gt;
                        </span>
                        <span className={`px-2 py-0.5 text-xs rounded-full flex items-center gap-1 ${getStatusColor(message.status)}`}>
                          {getStatusIcon(message.status)}
                          {getStatusLabel(message.status)}
                        </span>
                      </div>

                      {/* Message preview or full */}
                      <div 
                        className={`text-gray-600 dark:text-gray-300 text-sm ${
                          expandedMessage === message.id ? '' : 'line-clamp-2'
                        }`}
                        style={{ whiteSpace: 'pre-wrap' }}
                      >
                        {message.message}
                      </div>

                      {/* Expand/collapse toggle */}
                      {message.message.length > 100 && (
                        <button
                          onClick={() => setExpandedMessage(
                            expandedMessage === message.id ? null : message.id
                          )}
                          className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 mt-1"
                        >
                          {expandedMessage === message.id ? 'Show less' : 'Show more'}
                        </button>
                      )}

                      {/* Meta info */}
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <FaCalendar size={12} />
                          {new Date(message.createdAt).toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaTag size={12} />
                          ID: {message.id.slice(0, 8)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0 flex items-start gap-1">
                      {message.status !== 'READ' && (
                        <button
                          onClick={() => onStatusUpdate(message.id, 'READ')}
                          className="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Mark as Read"
                        >
                          <FaCheck size={16} />
                        </button>
                      )}
                      {message.status !== 'REPLIED' && (
                        <button
                          onClick={() => {
                            window.open(
                              `mailto:${message.email}?subject=Re: ${message.name}`,
                              '_blank'
                            )
                            onStatusUpdate(message.id, 'REPLIED')
                          }}
                          className="p-2 text-green-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                          title="Reply"
                        >
                          <FaReply size={16} />
                        </button>
                      )}
                      {message.status !== 'ARCHIVED' && (
                        <button
                          onClick={() => onStatusUpdate(message.id, 'ARCHIVED')}
                          className="p-2 text-gray-500 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                          title="Archive"
                        >
                          <FaArchive size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (confirm('Delete this message?')) {
                            onDelete(message.id)
                          }
                        }}
                        className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Footer with stats */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <div>
            Total: <span className="font-medium text-gray-700 dark:text-gray-300">{messages.length}</span>
            {statusFilter && (
              <span className="ml-2">
                | Filtered: <span className="font-medium text-gray-700 dark:text-gray-300">{filteredMessages.length}</span>
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <span>
              Pending: <span className="font-medium text-yellow-600 dark:text-yellow-400">
                {messages.filter(m => m.status === 'PENDING').length}
              </span>
            </span>
            <span>
              Read: <span className="font-medium text-blue-600 dark:text-blue-400">
                {messages.filter(m => m.status === 'READ').length}
              </span>
            </span>
            <span>
              Replied: <span className="font-medium text-green-600 dark:text-green-400">
                {messages.filter(m => m.status === 'REPLIED').length}
              </span>
            </span>
            <span>
              Archived: <span className="font-medium text-gray-600 dark:text-gray-400">
                {messages.filter(m => m.status === 'ARCHIVED').length}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}