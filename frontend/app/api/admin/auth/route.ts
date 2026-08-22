import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      )
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
    console.log('Calling backend auth:', `${apiUrl}/auth/login`)
    
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()
    console.log('Backend response:', data)

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Authentication failed' },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { message: 'Authentication failed' },
      { status: 500 }
    )
  }
}