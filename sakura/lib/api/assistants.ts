import { apiClient, ApiResponse } from './client'
import { Assistant, AssistantShift, ScheduleFilter } from '@/types/assistants'

// API functions for assistant management
export const assistantApi = {
  // Get all assistants
  async getAssistants(): Promise<ApiResponse<Assistant[]>> {
    return apiClient.get<ApiResponse<Assistant[]>>('/assistants')
  },

  // Get assistant by ID
  async getAssistantById(id: string): Promise<ApiResponse<Assistant>> {
    return apiClient.get<ApiResponse<Assistant>>(`/assistants/${id}`)
  },

  // Create new assistant
  async createAssistant(data: Omit<Assistant, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Assistant>> {
    // Map frontend format to backend format
    const backendData = {
      email: data.email,
      phoneNumber: data.phone,
      fullName: data.name,
      password: (data as any).password || 'defaultPassword123', // Should come from form
      avatar: data.avatar,
      clinicId: (data as any).clinicId,
      permissions: (data as any).permissions || [],
    }
    return apiClient.post<ApiResponse<Assistant>>('/assistants', backendData)
  },

  // Update assistant
  async updateAssistant(id: string, data: Partial<Assistant>): Promise<ApiResponse<Assistant>> {
    // Map frontend format to backend format
    const backendData: any = {}
    if (data.name) backendData.fullName = data.name
    if (data.phone) backendData.phoneNumber = data.phone
    if (data.email) backendData.email = data.email
    if (data.avatar) backendData.avatar = data.avatar
    if ((data as any).password) backendData.password = (data as any).password
    if ((data as any).permissions) backendData.permissions = (data as any).permissions
    if ((data as any).clinicId) backendData.clinicId = (data as any).clinicId

    return apiClient.patch<ApiResponse<Assistant>>(`/assistants/${id}`, backendData)
  },

  // Delete assistant
  async deleteAssistant(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`/assistants/${id}`)
  },

  // Get assistant shifts
  async getShifts(assistantId?: string, filter?: ScheduleFilter): Promise<ApiResponse<AssistantShift[]>> {
    const queryParams: Record<string, string> = {}
    
    if (assistantId) {
      return apiClient.get<ApiResponse<AssistantShift[]>>(`/assistants/${assistantId}/shifts`, queryParams)
    }

    // Use all shifts endpoint with filters
    if (filter?.dateRange) {
      queryParams.startDate = filter.dateRange.start.toISOString()
      queryParams.endDate = filter.dateRange.end.toISOString()
    }
    if (filter?.clinicLocation) {
      queryParams.clinicLocation = filter.clinicLocation
    }
    if (filter?.assistantIds && filter.assistantIds.length > 0) {
      queryParams.assistantId = filter.assistantIds[0] // Backend supports single assistantId
    }

    return apiClient.get<ApiResponse<AssistantShift[]>>('/assistants/shifts/all/list', queryParams)
  },

  // Create shift
  async createShift(assistantId: string, data: Omit<AssistantShift, 'id' | 'assistantId'>): Promise<ApiResponse<AssistantShift>> {
    // Map frontend format to backend format
    const backendData = {
      assistantId,
      date: data.date instanceof Date ? data.date.toISOString().split('T')[0] : data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      clinicId: (data as any).clinicId || '', // Frontend uses clinicLocation, backend needs clinicId
      associatedResources: data.associatedResources || [],
      status: data.status || 'scheduled',
      notes: data.notes,
    }
    return apiClient.post<ApiResponse<AssistantShift>>(`/assistants/${assistantId}/shifts`, backendData)
  },

  // Update shift
  async updateShift(shiftId: string, data: Partial<AssistantShift>): Promise<ApiResponse<AssistantShift>> {
    // Map frontend format to backend format
    const backendData: any = {}
    if (data.date) {
      backendData.date = data.date instanceof Date ? data.date.toISOString().split('T')[0] : data.date
    }
    if (data.startTime) backendData.startTime = data.startTime
    if (data.endTime) backendData.endTime = data.endTime
    if ((data as any).clinicId) backendData.clinicId = (data as any).clinicId
    if (data.associatedResources) backendData.associatedResources = data.associatedResources
    if (data.status) backendData.status = data.status
    if (data.notes !== undefined) backendData.notes = data.notes

    return apiClient.patch<ApiResponse<AssistantShift>>(`/assistants/shifts/${shiftId}`, backendData)
  },

  // Delete shift
  async deleteShift(shiftId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`/assistants/shifts/${shiftId}`)
  },

  // Get shift by ID
  async getShiftById(shiftId: string): Promise<ApiResponse<AssistantShift>> {
    return apiClient.get<ApiResponse<AssistantShift>>(`/assistants/shifts/${shiftId}`)
  },
}


