'use client'

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="relative">
          {/* Outer spinner ring */}
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-200 dark:border-blue-900"></div>
          {/* Inner spinner ring */}
          <div className="absolute top-0 left-0 inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
        </div>
        <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">Loading Admin Panel...</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Please wait</p>
      </div>
    </div>
  )
}