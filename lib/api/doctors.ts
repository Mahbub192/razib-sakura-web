import { apiClient, ApiResponse } from './client'

export interface DoctorDashboardData {
  todayAppointments: Array<{
    id: string
    time: string
    patientName: string
    patientInitial: string
    reason: string
    status: string
    patient?: any
  }>
  upcomingAppointments: any[]
  weeklyChartData: Array<{
    day: string
    count: number
  }>
  statistics: {
    totalPatients: number
    totalAppointments: number
    pendingAppointments: number
    completedAppointments: number
    unreadMessages: number
    appointmentsToday: number
    patientGrowth: number
    appointmentChangePercent: number
  }
}

export interface DoctorPatient {
  id: string
  name: string
  avatar: string
  phone: string
  email: string
  dob?: string
  lastVisit: string
  totalAppointments: number
}

export interface DoctorPatientsResponse {
  patients: DoctorPatient[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface DoctorReportsData {
  period: {
    start: string
    end: string
  }
  keyMetrics: {
    totalAppointments: number
    completed: number
    missedCancelled: number
    revenue: number
    completionRate: number
    avgRevenuePerAppointment: number
    appointmentChangePercent: number
  }
  appointmentsByStatus: Record<string, number>
  appointmentsByType: Record<string, number>
  appointmentsByDate: Record<string, number>
  patientDemographics: {
    '0-18': number
    '19-45': number
    '46+': number
  }
}

// Doctor API functions
export const doctorApi = {
  // Get dashboard data
  async getDashboard(): Promise<ApiResponse<DoctorDashboardData>> {
    return apiClient.get<ApiResponse<DoctorDashboardData>>('/doctors/dashboard')
  },

  // Get profile
  async getProfile(): Promise<ApiResponse<any>> {
    return apiClient.get<ApiResponse<any>>('/doctors/profile')
  },

  // Update profile
  async updateProfile(data: any): Promise<ApiResponse<any>> {
    return apiClient.patch<ApiResponse<any>>('/doctors/profile', data)
  },

  // Get patients
  async getPatients(params?: {
    search?: string
    page?: number
    limit?: number
  }): Promise<ApiResponse<DoctorPatientsResponse>> {
    const profileResponse = await apiClient.get<ApiResponse<any>>('/doctors/profile')
    if (!profileResponse.success || !profileResponse.data) {
      throw new Error('Failed to get doctor profile')
    }
    const doctorId = profileResponse.data.id

    const queryParams: Record<string, string> = {}
    if (params?.search) queryParams.search = params.search
    if (params?.page) queryParams.page = params.page.toString()
    if (params?.limit) queryParams.limit = params.limit.toString()

    return apiClient.get<ApiResponse<DoctorPatientsResponse>>(`/doctors/${doctorId}/patients`, queryParams)
  },

  // Get patient details
  async getPatientDetails(patientId: string): Promise<ApiResponse<any>> {
    const profileResponse = await apiClient.get<ApiResponse<any>>('/doctors/profile')
    if (!profileResponse.success || !profileResponse.data) {
      throw new Error('Failed to get doctor profile')
    }
    const doctorId = profileResponse.data.id

    return apiClient.get<ApiResponse<any>>(`/doctors/${doctorId}/patients/${patientId}`)
  },

  // Get appointments
  async getAppointments(params?: {
    status?: string
    date?: string
  }): Promise<ApiResponse<any[]>> {
    const profileResponse = await apiClient.get<ApiResponse<any>>('/doctors/profile')
    if (!profileResponse.success || !profileResponse.data) {
      throw new Error('Failed to get doctor profile')
    }
    const doctorId = profileResponse.data.id

    const queryParams: Record<string, string> = {}
    if (params?.status) queryParams.status = params.status
    if (params?.date) queryParams.date = params.date

    return apiClient.get<ApiResponse<any[]>>(`/doctors/${doctorId}/appointments`, queryParams)
  },

  // Get today's appointments
  async getTodayAppointments(): Promise<ApiResponse<any[]>> {
    const profileResponse = await apiClient.get<ApiResponse<any>>('/doctors/profile')
    if (!profileResponse.success || !profileResponse.data) {
      throw new Error('Failed to get doctor profile')
    }
    const doctorId = profileResponse.data.id

    return apiClient.get<ApiResponse<any[]>>(`/doctors/${doctorId}/appointments/today`)
  },

  // Get appointments by date range
  async getAppointmentsByDateRange(startDate: string, endDate: string): Promise<ApiResponse<any[]>> {
    const profileResponse = await apiClient.get<ApiResponse<any>>('/doctors/profile')
    if (!profileResponse.success || !profileResponse.data) {
      throw new Error('Failed to get doctor profile')
    }
    const doctorId = profileResponse.data.id

    return apiClient.get<ApiResponse<any[]>>(
      `/doctors/${doctorId}/appointments/range`,
      { startDate, endDate }
    )
  },

  // Get reports
  async getReports(params?: {
    startDate?: string
    endDate?: string
  }): Promise<ApiResponse<DoctorReportsData>> {
    const profileResponse = await apiClient.get<ApiResponse<any>>('/doctors/profile')
    if (!profileResponse.success || !profileResponse.data) {
      throw new Error('Failed to get doctor profile')
    }
    const doctorId = profileResponse.data.id

    const queryParams: Record<string, string> = {}
    if (params?.startDate) queryParams.startDate = params.startDate
    if (params?.endDate) queryParams.endDate = params.endDate

    return apiClient.get<ApiResponse<DoctorReportsData>>(`/doctors/${doctorId}/reports`, queryParams)
  },

  // Get messages
  async getMessages(): Promise<ApiResponse<any[]>> {
    const profileResponse = await apiClient.get<ApiResponse<any>>('/doctors/profile')
    if (!profileResponse.success || !profileResponse.data) {
      throw new Error('Failed to get doctor profile')
    }
    const doctorId = profileResponse.data.id

    return apiClient.get<ApiResponse<any[]>>(`/doctors/${doctorId}/messages`)
  },

  // Create appointment slot
  async createAppointmentSlot(data: any): Promise<ApiResponse<any>> {
    const profileResponse = await apiClient.get<ApiResponse<any>>('/doctors/profile')
    if (!profileResponse.success || !profileResponse.data) {
      throw new Error('Failed to get doctor profile')
    }
    const doctorId = profileResponse.data.id

    return apiClient.post<ApiResponse<any>>(`/doctors/${doctorId}/appointment-slots`, data)
  },

  // Get appointment slots
  async getAppointmentSlots(params?: {
    startDate?: string
    endDate?: string
  }): Promise<ApiResponse<any[]>> {
    const profileResponse = await apiClient.get<ApiResponse<any>>('/doctors/profile')
    if (!profileResponse.success || !profileResponse.data) {
      throw new Error('Failed to get doctor profile')
    }
    const doctorId = profileResponse.data.id

    const queryParams: Record<string, string> = {}
    if (params?.startDate) queryParams.startDate = params.startDate
    if (params?.endDate) queryParams.endDate = params.endDate

    return apiClient.get<ApiResponse<any[]>>(`/doctors/${doctorId}/appointment-slots`, queryParams)
  },

  // Get notification preferences
  async getNotificationPreferences(): Promise<ApiResponse<any>> {
    return apiClient.get<ApiResponse<any>>('/doctors/profile/notifications')
  },

  // Update notification preferences
  async updateNotificationPreferences(preferences: any): Promise<ApiResponse<any>> {
    return apiClient.patch<ApiResponse<any>>('/doctors/profile/notifications', preferences)
  },

  // Get clinic info
  async getClinicInfo(): Promise<ApiResponse<any>> {
    return apiClient.get<ApiResponse<any>>('/doctors/profile/clinic')
  },

  // Update clinic info
  async updateClinicInfo(clinicData: any): Promise<ApiResponse<any>> {
    return apiClient.patch<ApiResponse<any>>('/doctors/profile/clinic', clinicData)
  },

  // Assistant Management
  async getAssistants(): Promise<ApiResponse<any[]>> {
    const profileResponse = await apiClient.get<ApiResponse<any>>('/doctors/profile')
    if (!profileResponse.success || !profileResponse.data) {
      throw new Error('Failed to get doctor profile')
    }
    const doctorId = profileResponse.data.id

    return apiClient.get<ApiResponse<any[]>>(`/doctors/${doctorId}/assistants`)
  },

  async createAssistant(data: {
    fullName: string
    email: string
    phoneNumber: string
    password: string
    permissions?: string[]
  }): Promise<ApiResponse<any>> {
    const profileResponse = await apiClient.get<ApiResponse<any>>('/doctors/profile')
    if (!profileResponse.success || !profileResponse.data) {
      throw new Error('Failed to get doctor profile')
    }
    const doctorId = profileResponse.data.id

    return apiClient.post<ApiResponse<any>>(`/doctors/${doctorId}/assistants`, data)
  },

  async updateAssistant(assistantId: string, data: {
    fullName?: string
    email?: string
    phoneNumber?: string
    password?: string
    permissions?: string[]
  }): Promise<ApiResponse<any>> {
    const profileResponse = await apiClient.get<ApiResponse<any>>('/doctors/profile')
    if (!profileResponse.success || !profileResponse.data) {
      throw new Error('Failed to get doctor profile')
    }
    const doctorId = profileResponse.data.id

    return apiClient.patch<ApiResponse<any>>(`/doctors/${doctorId}/assistants/${assistantId}`, data)
  },

  async toggleAssistantStatus(assistantId: string): Promise<ApiResponse<any>> {
    const profileResponse = await apiClient.get<ApiResponse<any>>('/doctors/profile')
    if (!profileResponse.success || !profileResponse.data) {
      throw new Error('Failed to get doctor profile')
    }
    const doctorId = profileResponse.data.id

    return apiClient.patch<ApiResponse<any>>(`/doctors/${doctorId}/assistants/${assistantId}/toggle-status`)
  },

  async deleteAssistant(assistantId: string): Promise<ApiResponse<any>> {
    const profileResponse = await apiClient.get<ApiResponse<any>>('/doctors/profile')
    if (!profileResponse.success || !profileResponse.data) {
      throw new Error('Failed to get doctor profile')
    }
    const doctorId = profileResponse.data.id

    return apiClient.delete<ApiResponse<any>>(`/doctors/${doctorId}/assistants/${assistantId}`)
  },
}

