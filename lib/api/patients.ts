import { apiClient, ApiResponse } from './client'

export interface PatientDashboardData {
  patientName?: string
  upcomingAppointments: Array<{
    id: string
    date: string
    month: string
    day: number
    weekday: string
    time: string
    doctorName: string
    doctorInitial: string
    specialty: string
    clinicName: string
    reason: string
    status: string
  }>
  secureMessages: Array<{
    id: string
    name: string
    avatar: string
    lastMessage: string
    snippet: string
    time: string
    unread: boolean
    unreadCount: number
  }>
  recentLabResults: Array<{
    id: string
    testName: string
    testDate: string
    status: string
  }>
  activePrescriptions: Array<{
    id: string
    medicationName: string
    dosage: string
    frequency: string
  }>
  unreadMessagesCount: number
  hasNewLabResults: boolean
  totalAppointments: number
  totalMedicalRecords: number
}

export interface PatientAppointment {
  id: string
  doctorId?: string
  doctorName: string
  doctorInitial: string
  specialty: string
  clinicName: string
  date: string
  formattedDate: string
  time: string
  formattedDateTime: string
  status: string
  reason: string
  type: string
}

export interface MedicalRecord {
  id: string
  title: string
  category: string
  categoryDisplay: string
  description: string
  date: string
  formattedDate: string
  providerName: string
  status: string
  attachments: string[]
}

export interface MedicalRecordsResponse {
  records: MedicalRecord[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface LabResult {
  id: string
  testName: string
  testDate: string
  result: string
  value?: string | number
  unit?: string
  referenceRange: string
  status: string
  statusDisplay: string
  labResultId: string
  doctorNotes?: string
  doctorName: string
}

export interface LabResultsResponse {
  results: LabResult[]
  doctorNotes?: {
    date: string
    formattedDate: string
    doctorName: string
    content: string
  }
}

export interface Prescription {
  id: string
  medicationName: string
  dosage: string
  frequency: string
  duration: string
  instructions?: string
  status: string
  statusDisplay: string
  formattedDate: string
  refillsRemaining: number
  hasRefills: boolean
  doctorName: string
  doctorSpecialty: string
}

export interface Conversation {
  id: string
  name: string
  avatar: string
  lastMessage: string
  snippet: string
  time: string
  unread: boolean
  unreadCount: number
  online?: boolean
}

export interface Message {
  id: string
  senderId: string
  senderName: string
  senderInitial: string
  receiverId: string
  content: string
  read: boolean
  createdAt: string
  formattedTime: string
  formattedDate: string
  isPatient: boolean
}

export interface MessagesResponse {
  conversations: Conversation[]
  currentConversation?: {
    id: string
    participants: any[]
    messages: Message[]
  }
}

// Patient API functions
export const patientApi = {
  // Get dashboard data
  async getDashboard(): Promise<ApiResponse<PatientDashboardData>> {
    return apiClient.get<ApiResponse<PatientDashboardData>>('/patients/dashboard')
  },

  // Get profile
  async getProfile(): Promise<ApiResponse<any>> {
    return apiClient.get<ApiResponse<any>>('/patients/profile')
  },

  // Update profile
  async updateProfile(data: any): Promise<ApiResponse<any>> {
    return apiClient.patch<ApiResponse<any>>('/patients/profile', data)
  },

  // Get appointments (using current user from token)
  async getAppointments(params?: {
    status?: string
  }): Promise<ApiResponse<PatientAppointment[]>> {
    // First get patient ID from profile, then fetch appointments
    const profileResponse = await apiClient.get<ApiResponse<any>>('/patients/profile')
    if (!profileResponse.success || !profileResponse.data) {
      throw new Error('Failed to get patient profile')
    }
    const patientId = profileResponse.data.id

    const queryParams: Record<string, string> = {}
    if (params?.status) queryParams.status = params.status

    return apiClient.get<ApiResponse<PatientAppointment[]>>(`/patients/${patientId}/appointments`, queryParams)
  },

  // Get upcoming appointments
  async getUpcomingAppointments(): Promise<ApiResponse<PatientAppointment[]>> {
    const profileResponse = await apiClient.get<ApiResponse<any>>('/patients/profile')
    if (!profileResponse.success || !profileResponse.data) {
      throw new Error('Failed to get patient profile')
    }
    const patientId = profileResponse.data.id

    return apiClient.get<ApiResponse<PatientAppointment[]>>(`/patients/${patientId}/appointments/upcoming`)
  },

  // Book appointment
  async bookAppointment(data: any): Promise<ApiResponse<any>> {
    const profileResponse = await apiClient.get<ApiResponse<any>>('/patients/profile')
    if (!profileResponse.success || !profileResponse.data) {
      throw new Error('Failed to get patient profile')
    }
    const patientId = profileResponse.data.id

    return apiClient.post<ApiResponse<any>>(`/patients/${patientId}/appointments`, data)
  },

  // Cancel appointment
  async cancelAppointment(appointmentId: string): Promise<ApiResponse<any>> {
    const profileResponse = await apiClient.get<ApiResponse<any>>('/patients/profile')
    if (!profileResponse.success || !profileResponse.data) {
      throw new Error('Failed to get patient profile')
    }
    const patientId = profileResponse.data.id

    return apiClient.post<ApiResponse<any>>(`/patients/${patientId}/appointments/${appointmentId}/cancel`)
  },

  // Reschedule appointment
  async rescheduleAppointment(appointmentId: string, date: string, time: string): Promise<ApiResponse<any>> {
    const profileResponse = await apiClient.get<ApiResponse<any>>('/patients/profile')
    if (!profileResponse.success || !profileResponse.data) {
      throw new Error('Failed to get patient profile')
    }
    const patientId = profileResponse.data.id

    return apiClient.post<ApiResponse<any>>(`/patients/${patientId}/appointments/${appointmentId}/reschedule`, {
      date,
      time,
    })
  },

  // Get medical records
  async getMedicalRecords(params?: {
    category?: string
    page?: number
    limit?: number
  }): Promise<ApiResponse<MedicalRecordsResponse>> {
    const profileResponse = await apiClient.get<ApiResponse<any>>('/patients/profile')
    if (!profileResponse.success || !profileResponse.data) {
      throw new Error('Failed to get patient profile')
    }
    const patientId = profileResponse.data.id

    const queryParams: Record<string, string> = {}
    if (params?.category) queryParams.category = params.category
    if (params?.page) queryParams.page = params.page.toString()
    if (params?.limit) queryParams.limit = params.limit.toString()

    return apiClient.get<ApiResponse<MedicalRecordsResponse>>(`/patients/${patientId}/medical-records`, queryParams)
  },

  // Get lab results
  async getLabResults(params?: {
    testType?: string
    startDate?: string
    endDate?: string
  }): Promise<ApiResponse<LabResultsResponse>> {
    const profileResponse = await apiClient.get<ApiResponse<any>>('/patients/profile')
    if (!profileResponse.success || !profileResponse.data) {
      throw new Error('Failed to get patient profile')
    }
    const patientId = profileResponse.data.id

    const queryParams: Record<string, string> = {}
    if (params?.testType) queryParams.testType = params.testType
    if (params?.startDate) queryParams.startDate = params.startDate
    if (params?.endDate) queryParams.endDate = params.endDate

    return apiClient.get<ApiResponse<LabResultsResponse>>(`/patients/${patientId}/lab-results`, queryParams)
  },

  // Get prescriptions
  async getPrescriptions(params?: {
    status?: string
  }): Promise<ApiResponse<Prescription[]>> {
    const profileResponse = await apiClient.get<ApiResponse<any>>('/patients/profile')
    if (!profileResponse.success || !profileResponse.data) {
      throw new Error('Failed to get patient profile')
    }
    const patientId = profileResponse.data.id

    const queryParams: Record<string, string> = {}
    if (params?.status) queryParams.status = params.status

    return apiClient.get<ApiResponse<Prescription[]>>(`/patients/${patientId}/prescriptions`, queryParams)
  },

  // Get active prescriptions
  async getActivePrescriptions(): Promise<ApiResponse<Prescription[]>> {
    const profileResponse = await apiClient.get<ApiResponse<any>>('/patients/profile')
    if (!profileResponse.success || !profileResponse.data) {
      throw new Error('Failed to get patient profile')
    }
    const patientId = profileResponse.data.id

    return apiClient.get<ApiResponse<Prescription[]>>(`/patients/${patientId}/prescriptions/active`)
  },

  // Request prescription refill
  async requestPrescriptionRefill(prescriptionId: string): Promise<ApiResponse<any>> {
    const profileResponse = await apiClient.get<ApiResponse<any>>('/patients/profile')
    if (!profileResponse.success || !profileResponse.data) {
      throw new Error('Failed to get patient profile')
    }
    const patientId = profileResponse.data.id

    return apiClient.post<ApiResponse<any>>(`/patients/${patientId}/prescriptions/${prescriptionId}/refill`)
  },

  // Get messages
  async getMessages(params?: {
    conversationId?: string
  }): Promise<ApiResponse<MessagesResponse>> {
    const profileResponse = await apiClient.get<ApiResponse<any>>('/patients/profile')
    if (!profileResponse.success || !profileResponse.data) {
      throw new Error('Failed to get patient profile')
    }
    const patientId = profileResponse.data.id

    const queryParams: Record<string, string> = {}
    if (params?.conversationId) queryParams.conversationId = params.conversationId

    return apiClient.get<ApiResponse<MessagesResponse>>(`/patients/${patientId}/messages`, queryParams)
  },
}

