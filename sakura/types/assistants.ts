export interface Assistant {
  id: string
  name: string
  email: string
  phone: string
  role: string
  avatar?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AssistantShift {
  id: string
  assistantId: string
  assistant?: Assistant
  date: Date
  startTime: string
  endTime: string
  clinicLocation: string
  associatedResources?: string[]
  status: 'scheduled' | 'completed' | 'cancelled'
  notes?: string
}

export interface ScheduleFilter {
  dateRange: {
    start: Date
    end: Date
  }
  assistantIds?: string[]
  clinicLocation?: string
}


