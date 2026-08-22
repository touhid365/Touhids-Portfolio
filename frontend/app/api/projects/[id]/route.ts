import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Project ID is required' },
        { status: 400 }
      )
    }

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
    const response = await fetch(`${backendUrl}/projects/${id}`)
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { success: false, message: 'Project not found' },
          { status: 404 }
        )
      }
      throw new Error('Failed to fetch project')
    }
    
    const data = await response.json()
    
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to fetch project' 
      },
      { status: 500 }
    )
  }
}