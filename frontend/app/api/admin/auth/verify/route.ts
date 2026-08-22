import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.split(' ')[1]
    
    console.log('Verifying token:', token ? 'Token present' : 'No token')
    
    if (!token) {
      return NextResponse.json(
        { valid: false, message: 'No token provided' },
        { status: 401 }
      )
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
    console.log('Calling backend verify:', `${apiUrl}/auth/verify`)
    
    const response = await fetch(`${apiUrl}/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })

    const data = await response.json()
    console.log('Verify response:', data)

    if (!response.ok) {
      return NextResponse.json(
        { valid: false, message: data.message || 'Invalid token' },
        { status: response.status }
      )
    }

    return NextResponse.json({ 
      valid: true, 
      user: data.user 
    }, { status: 200 })
  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json(
      { valid: false, message: 'Verification failed' },
      { status: 500 }
    )
  }
}