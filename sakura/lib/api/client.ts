/**
 * Centralized API Client
 * Handles all HTTP requests to the backend API
 */

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface RequestOptions {
  method?: RequestMethod
  headers?: Record<string, string>
  body?: any
  params?: Record<string, string>
}

class ApiClient {
  private baseURL: string

  constructor() {
    // Use full URL if provided, otherwise default to relative /api
    // In browser, process.env might not be available, so check window location
    if (typeof window !== 'undefined') {
      this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
    } else {
      this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
    }
    
    // Ensure baseURL always ends with /api
    if (this.baseURL && !this.baseURL.includes('/api')) {
      this.baseURL = this.baseURL.endsWith('/') 
        ? `${this.baseURL}api` 
        : `${this.baseURL}/api`
    }
    
    // Debug log
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('[API Client] Initialized with baseURL:', this.baseURL)
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { method = 'GET', headers = {}, body, params } = options

    // Build URL - handle both absolute and relative URLs
    let url: URL
    
    // Ensure baseURL is set
    if (!this.baseURL) {
      this.baseURL = 'http://localhost:3001/api'
      console.warn('[API Client] baseURL was empty, using default:', this.baseURL)
    }
    
    if (this.baseURL.startsWith('http')) {
      // Absolute URL - baseURL already includes /api
      // Remove leading / from endpoint to append to baseURL path
      const normalizedEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
      const baseUrlWithSlash = this.baseURL.endsWith('/') ? this.baseURL : `${this.baseURL}/`
      url = new URL(normalizedEndpoint, baseUrlWithSlash)
      
      // Debug log (always show in development)
      if (typeof window !== 'undefined') {
        console.log('[API Client] Making request:', {
          method: options.method || 'GET',
          baseURL: this.baseURL,
          endpoint,
          normalizedEndpoint,
          finalURL: url.toString()
        })
      }
    } else {
      // Relative URL
      const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
      url = new URL(`${this.baseURL}${normalizedEndpoint}`, window.location.origin)
    }
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })
    }

    // Get auth token from cookies or localStorage
    const token = this.getAuthToken()

    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...headers,
      },
    }

    if (body && method !== 'GET') {
      config.body = JSON.stringify(body)
    }

    try {
      const response = await fetch(url.toString(), config)

      const data = await response.json()

      if (!response.ok) {
        // Handle backend error response format
        const errorMessage = data.message || data.error || response.statusText
        throw new Error(errorMessage || `HTTP error! status: ${response.status}`)
      }

      // Backend returns {success, data, message} format
      // Return as-is for ApiResponse type
      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null

    // Try to get from localStorage
    const token = localStorage.getItem('auth-token')
    if (token) return token

    // Try to get from cookies
    const cookies = document.cookie.split(';')
    const authCookie = cookies.find((cookie) =>
      cookie.trim().startsWith('auth-token=')
    )
    if (authCookie) {
      return authCookie.split('=')[1]
    }

    return null
  }

  // HTTP Methods
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params })
  }

  async post<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body })
  }

  async put<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body })
  }

  async patch<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, { method: 'PATCH', body })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  // Auth helpers
  setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth-token', token)
      document.cookie = `auth-token=${token}; path=/; max-age=604800` // 7 days
    }
  }

  clearAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token')
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Export type for API responses
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

