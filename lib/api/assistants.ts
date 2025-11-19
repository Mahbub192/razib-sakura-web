import { apiClient, ApiResponse } from './client'

export interface AssistantDashboardData {
  profile: {
    id: string
    fullName: string
    email: string
    phoneNumber: string
    avatar?: string
    clinic?: any
  }
  statistics: {
    appointmentsToday: number
    appointmentsChange: number
    tasksCompleted: number
    tasksTotal: number
    tasksPercentage: number
  }
  todayAppointments: Array<{
    id: string
    time: string
    patientName: string
    patientInitial: string
    reason: string
    status: string
    patient?: {
      id: string
      name: string
      avatar?: string
      dateOfBirth?: Date
    }
  }>
  weeklyChart: Array<{
    day: string
    count: number
  }>
  tasks: Array<{
    id: number
    text: string
    completed: boolean
  }>
}

// Assistant API functions
export const assistantApi = {
  // Get assistant profile
  async getProfile(): Promise<ApiResponse<any>> {
    return apiClient.get<ApiResponse<any>>('/assistants/profile')
  },

  // Get assistant dashboard data
  async getDashboard(): Promise<ApiResponse<AssistantDashboardData>> {
    return apiClient.get<ApiResponse<AssistantDashboardData>>('/assistants/dashboard')
  },

  // Get assistant appointments
  async getAppointments(params?: {
    status?: string
    filterType?: 'upcoming' | 'past' | 'all'
  }): Promise<ApiResponse<any[]>> {
    const queryParams: Record<string, string> = {}
    if (params?.status) queryParams.status = params.status
    if (params?.filterType) queryParams.filterType = params.filterType
    return apiClient.get<ApiResponse<any[]>>('/assistants/appointments', queryParams)
  },

  // Get appointment statistics
  async getAppointmentStatistics(): Promise<ApiResponse<any>> {
    return apiClient.get<ApiResponse<any>>('/assistants/appointments/statistics')
  },

  // Get assistant patients
  async getPatients(params?: {
    search?: string
    page?: number
    limit?: number
  }): Promise<ApiResponse<any>> {
    const queryParams: Record<string, string> = {}
    if (params?.search) queryParams.search = params.search
    if (params?.page) queryParams.page = params.page.toString()
    if (params?.limit) queryParams.limit = params.limit.toString()
    return apiClient.get<ApiResponse<any>>('/assistants/patients', queryParams)
  },

  // Get patient statistics
  async getPatientStatistics(): Promise<ApiResponse<any>> {
    return apiClient.get<ApiResponse<any>>('/assistants/patients/statistics')
  },

  // Get patient details
  async getPatientDetails(patientId: string): Promise<ApiResponse<any>> {
    return apiClient.get<ApiResponse<any>>(`/assistants/patients/${patientId}`)
  },

  // Get appointments by date range for calendar
  async getAppointmentsByDateRange(startDate: string, endDate: string): Promise<ApiResponse<any[]>> {
    return apiClient.get<ApiResponse<any[]>>('/assistants/appointments/range', {
      startDate,
      endDate,
    })
  },

  // Get today's appointments for calendar sidebar
  async getTodayAppointments(): Promise<ApiResponse<any[]>> {
    return apiClient.get<ApiResponse<any[]>>('/assistants/appointments/today')
  },

  // Get assistant reports and analytics
  async getReports(params?: {
    startDate?: string
    endDate?: string
  }): Promise<ApiResponse<any>> {
    const queryParams: Record<string, string> = {}
    if (params?.startDate) queryParams.startDate = params.startDate
    if (params?.endDate) queryParams.endDate = params.endDate
    return apiClient.get<ApiResponse<any>>('/assistants/reports', queryParams)
  },

  // Get assistant conversations
  async getConversations(): Promise<ApiResponse<any[]>> {
    return apiClient.get<ApiResponse<any[]>>('/assistants/messages')
  },

  // Get messages for a conversation
  async getConversationMessages(conversationId: string): Promise<ApiResponse<any[]>> {
    return apiClient.get<ApiResponse<any[]>>(`/assistants/messages/${conversationId}`)
  },

  // Send a message
  async sendMessage(data: {
    receiverId: string
    content: string
    attachments?: string[]
  }): Promise<ApiResponse<any>> {
    // Get current user ID from profile
    const profile = await this.getProfile()
    if (!profile.success || !profile.data) {
      throw new Error('Failed to get user profile')
    }
    
    return apiClient.post<ApiResponse<any>>('/messages', {
      senderId: profile.data.id,
      receiverId: data.receiverId,
      content: data.content,
      attachments: data.attachments,
    })
  },

  // Update assistant profile
  async updateProfile(data: {
    fullName?: string
    email?: string
    phoneNumber?: string
    avatar?: string
  }): Promise<ApiResponse<any>> {
    return apiClient.patch<ApiResponse<any>>('/assistants/profile', data)
  },

  // Get notification preferences
  async getNotificationPreferences(): Promise<ApiResponse<any>> {
    return apiClient.get<ApiResponse<any>>('/assistants/profile/notifications')
  },

  // Update notification preferences
  async updateNotificationPreferences(preferences: any): Promise<ApiResponse<any>> {
    return apiClient.patch<ApiResponse<any>>('/assistants/profile/notifications', preferences)
  },

  // Get clinic info
  async getClinicInfo(): Promise<ApiResponse<any>> {
    return apiClient.get<ApiResponse<any>>('/assistants/profile/clinic')
  },
}
