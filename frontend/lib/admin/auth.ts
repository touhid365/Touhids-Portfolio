export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false
  const token = localStorage.getItem('adminToken')
  return !!token
}

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('adminToken')
}

export const getUser = () => {
  if (typeof window === 'undefined') return null
  const userData = localStorage.getItem('adminUser')
  if (!userData) return null
  try {
    return JSON.parse(userData)
  } catch {
    return null
  }
}

export const logout = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem('adminToken')
  localStorage.removeItem('adminUser')
  window.location.href = '/admin/login'
}

export const getAuthHeaders = (): HeadersInit => {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  }
}