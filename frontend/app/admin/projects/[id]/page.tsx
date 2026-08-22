'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import ProjectForm from '@/app/components/admin/ProjectForm'

type ProjectFormData = Parameters<typeof ProjectForm>[0]['initialData']

export default function EditProject() {
  const params = useParams()
  const [projectData, setProjectData] = useState<ProjectFormData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem('adminToken')
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
        const response = await fetch(`${apiUrl}/projects/${params.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })

        if (!response.ok) throw new Error('Failed to fetch project')

        const data = await response.json()
        setProjectData(data)
      } catch (error) {
        console.error('Error fetching project:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProject()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    )
  }

  return <ProjectForm initialData={projectData ?? undefined} isEdit={true} />
}
