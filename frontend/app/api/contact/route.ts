import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received contact request:', body)

    const { name, email, message } = body

    // Simple validation
    const errors: { field: string; message: string }[] = []

    if (!name || name.trim().length < 2) {
      errors.push({ field: 'name', message: 'Name must be at least 2 characters' })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      errors.push({ field: 'email', message: 'Invalid email address' })
    }

    if (!message || message.trim().length < 1) {
      errors.push({ field: 'message', message: 'Message cannot be empty' })
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation failed',
          errors 
        },
        { status: 400 }
      )
    }

    // Trim the data
    const trimmedData = {
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    }

    // Send to backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
    const response = await fetch(`${backendUrl}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trimmedData),
    })

    let data
    try {
      data = await response.json()
    } catch (parseError) {
      console.error('Failed to parse backend response:', parseError)
      return NextResponse.json(
        { 
          success: false, 
          message: 'Backend server returned an invalid response' 
        },
        { status: 500 }
      )
    }

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || 'Failed to send message',
          errors: data.errors || []
        },
        { status: response.status }
      )
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Message sent successfully!',
        data: data 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error in contact API route:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to send message' 
      },
      { status: 500 }
    )
  }
}