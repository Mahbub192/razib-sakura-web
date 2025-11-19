/**
 * Authentication API functions
 * Handles login, register, and other auth operations
 */

import { apiClient, ApiResponse } from './client'

export interface LoginRequest {
  phoneNumber: string
  password: string
}

export interface RegisterRequest {
  email: string
  phoneNumber: string
  password: string
  fullName: string
  role?: 'patient' | 'doctor' | 'assistant'
}

export interface AuthResponse {
  accessToken: string
  user: {
    id: string
    email: string
    phoneNumber: string
    fullName: string
    role: string
    avatar?: string | null
  }
}

export interface ForgotPasswordRequest {
  phoneNumber: string
}

export interface ResetPasswordRequest {
  phoneNumber: string
  newPassword: string
  otp: string
}

export interface VerifyOTPRequest {
  phoneNumber: string
  otp: string
}

// Auth API functions
export const authApi = {
  // Login
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      credentials
    )
    
    // If login successful, store token
    if (response.success && response.data?.accessToken) {
      apiClient.setAuthToken(response.data.accessToken)
      
      // Store user info in localStorage and cookies
      if (typeof window !== 'undefined' && response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user))
        localStorage.setItem('user-role', response.data.user.role)
        // Also set in cookies for middleware
        document.cookie = `user-role=${response.data.user.role}; path=/; max-age=604800` // 7 days
      }
    }
    
    return response
  },

  // Register
  async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/register',
      data
    )
    
    // If registration successful, store token
    if (response.success && response.data?.accessToken) {
      apiClient.setAuthToken(response.data.accessToken)
      
      // Store user info in localStorage and cookies
      if (typeof window !== 'undefined' && response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user))
        localStorage.setItem('user-role', response.data.user.role)
        // Also set in cookies for middleware
        document.cookie = `user-role=${response.data.user.role}; path=/; max-age=604800` // 7 days
      }
    }
    
    return response
  },

  // Forgot Password
  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<ApiResponse<{ message: string }>>(
      '/auth/forgot-password',
      data
    )
  },

  // Reset Password
  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<ApiResponse<{ message: string }>>(
      '/auth/reset-password',
      data
    )
  },

  // Verify OTP
  async verifyOTP(data: VerifyOTPRequest): Promise<ApiResponse<{ verified: boolean }>> {
    return apiClient.post<ApiResponse<{ verified: boolean }>>(
      '/auth/verify-otp',
      data
    )
  },

  // Logout
  logout(): void {
    apiClient.clearAuthToken()
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user')
      localStorage.removeItem('user-role')
      // Clear cookies
      document.cookie = 'user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    }
  },

  // Get current user from localStorage
  getCurrentUser(): AuthResponse['user'] | null {
    if (typeof window === 'undefined') return null
    
    const userStr = localStorage.getItem('user')
    if (!userStr) return null
    
    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false
    return !!localStorage.getItem('auth-token')
  },

  // Change Password
  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<ApiResponse<{ message: string }>>(
      '/auth/change-password',
      data
    )
  },
}

