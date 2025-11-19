/**
 * Admin API functions
 */

import { apiClient, ApiResponse } from './client'

export interface AdminDashboardStats {
  totalUsers: number
  totalDoctors: number
  totalPatients: number
  totalAssistants: number
  totalAppointments: number
  pendingAppointments: number
  completedAppointments: number
  todayAppointments: number
  totalClinics?: number
  userGrowth?: number
  appointmentGrowth?: number
  recentUsers?: Array<{
    id: string
    name: string
    email: string
    role: string
    createdAt: string
    avatar?: string
  }>
  recentAppointments?: Array<{
    id: string
    patientName: string
    doctorName: string
    date: string
    time: string
    status: string
  }>
}

export interface AdminUser {
  id: string
  fullName: string
  email: string
  phoneNumber: string
  role: string
  avatar?: string
  isVerified: boolean
  specialty?: string
  clinic?: {
    id: string
    name: string
  } | null
  createdAt: string
}

export interface AdminAppointment {
  id: string
  patientName: string
  patientId: string
  doctorName: string
  doctorId: string
  clinicName: string
  date: string
  time: string
  status: string
  type: string
  reason?: string
  createdAt: string
}

export interface AdminClinic {
  id: string
  name: string
  address: string
  phone: string
  email: string
  description?: string
  logo?: string
  operatingHours?: any
  totalDoctors: number
  createdAt: string
}

export interface AdminAnalytics {
  overview: {
    totalUsers: number
    totalDoctors: number
    totalPatients: number
    totalAssistants: number
    totalAppointments: number
  }
  appointmentsByStatus: Record<string, number>
  appointmentsByDate: Record<string, number>
  userGrowth: Array<{ month: string; count: number }>
  appointmentTrends: Array<{ week: string; count: number }>
  period: {
    start: string
    end: string
  }
}

// Admin API functions
export const adminApi = {
  // Get dashboard stats
  async getDashboardStats(): Promise<ApiResponse<AdminDashboardStats>> {
    return apiClient.get<ApiResponse<AdminDashboardStats>>('/admin/dashboard')
  },

  // Get all users
  async getUsers(params?: {
    role?: string
    search?: string
    page?: number
    limit?: number
  }): Promise<ApiResponse<{ users: AdminUser[]; pagination: any }>> {
    const queryParams = new URLSearchParams()
    if (params?.role) queryParams.append('role', params.role)
    if (params?.search) queryParams.append('search', params.search)
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())

    const query = queryParams.toString()
    return apiClient.get<ApiResponse<{ users: AdminUser[]; pagination: any }>>(
      `/admin/users${query ? `?${query}` : ''}`,
    )
  },

  // Get user by ID
  async getUserById(userId: string): Promise<ApiResponse<AdminUser>> {
    return apiClient.get<ApiResponse<AdminUser>>(`/admin/users/${userId}`)
  },

  // Create user
  async createUser(userData: any): Promise<ApiResponse<AdminUser>> {
    return apiClient.post<ApiResponse<AdminUser>>('/users', userData)
  },

  // Update user
  async updateUser(userId: string, userData: any): Promise<ApiResponse<AdminUser>> {
    return apiClient.patch<ApiResponse<AdminUser>>(`/users/${userId}`, userData)
  },

  // Delete user
  async deleteUser(userId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<ApiResponse<{ message: string }>>(`/users/${userId}`)
  },

  // Get all appointments
  async getAppointments(params?: {
    status?: string
    doctorId?: string
    patientId?: string
    startDate?: string
    endDate?: string
    page?: number
    limit?: number
  }): Promise<ApiResponse<{ appointments: AdminAppointment[]; pagination: any }>> {
    const queryParams = new URLSearchParams()
    if (params?.status) queryParams.append('status', params.status)
    if (params?.doctorId) queryParams.append('doctorId', params.doctorId)
    if (params?.patientId) queryParams.append('patientId', params.patientId)
    if (params?.startDate) queryParams.append('startDate', params.startDate)
    if (params?.endDate) queryParams.append('endDate', params.endDate)
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())

    const query = queryParams.toString()
    return apiClient.get<ApiResponse<{ appointments: AdminAppointment[]; pagination: any }>>(
      `/admin/appointments${query ? `?${query}` : ''}`,
    )
  },

  // Get all clinics
  async getClinics(params?: {
    search?: string
    page?: number
    limit?: number
  }): Promise<ApiResponse<{ clinics: AdminClinic[]; pagination: any }>> {
    const queryParams = new URLSearchParams()
    if (params?.search) queryParams.append('search', params.search)
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())

    const query = queryParams.toString()
    return apiClient.get<ApiResponse<{ clinics: AdminClinic[]; pagination: any }>>(
      `/admin/clinics${query ? `?${query}` : ''}`,
    )
  },

  // Get analytics
  async getAnalytics(params?: {
    startDate?: string
    endDate?: string
  }): Promise<ApiResponse<AdminAnalytics>> {
    const queryParams = new URLSearchParams()
    if (params?.startDate) queryParams.append('startDate', params.startDate)
    if (params?.endDate) queryParams.append('endDate', params.endDate)

    const query = queryParams.toString()
    return apiClient.get<ApiResponse<AdminAnalytics>>(`/admin/analytics${query ? `?${query}` : ''}`)
  },
}
