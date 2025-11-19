/**
 * Common type definitions used across the application
 */

// User Types
export interface User {
  id: string
  email: string
  phoneNumber: string
  fullName: string
  role: 'patient' | 'doctor' | 'assistant' | 'admin'
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface Patient extends User {
  role: 'patient'
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other'
  address?: string
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
}

export interface Doctor extends User {
  role: 'doctor'
  specialty: string
  licenseNumber: string
  clinic?: Clinic
  bio?: string
  yearsOfExperience?: number
}

export interface Assistant extends User {
  role: 'assistant'
  clinic?: Clinic
  permissions: string[]
}

// Clinic Types
export interface Clinic {
  id: string
  name: string
  address: string
  phone: string
  email: string
  logo?: string
  operatingHours: {
    [key: string]: {
      open: string
      close: string
      closed?: boolean
    }
  }
}

// Appointment Types
export interface Appointment {
  id: string
  patientId: string
  doctorId: string
  clinicId: string
  date: string
  time: string
  duration: number // in minutes
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rescheduled'
  type: 'consultation' | 'follow-up' | 'check-up' | 'emergency'
  reason?: string
  notes?: string
  createdAt: string
  updatedAt: string
  patient?: Patient
  doctor?: Doctor
  clinic?: Clinic
}

// Medical Record Types
export interface MedicalRecord {
  id: string
  patientId: string
  doctorId: string
  category: 'diagnosis' | 'medication' | 'allergy' | 'vaccination' | 'lab_result' | 'other'
  title: string
  description: string
  date: string
  attachments?: string[]
  createdAt: string
  updatedAt: string
}

// Lab Result Types
export interface LabResult {
  id: string
  patientId: string
  doctorId: string
  testName: string
  testDate: string
  results: {
    name: string
    value: string | number
    unit: string
    status: 'normal' | 'borderline_high' | 'borderline_low' | 'high' | 'low'
    referenceRange: string
  }[]
  doctorNotes?: string
  createdAt: string
  updatedAt: string
}

// Prescription Types
export interface Prescription {
  id: string
  patientId: string
  doctorId: string
  medications: {
    name: string
    dosage: string
    frequency: string
    duration: string
    instructions?: string
  }[]
  status: 'active' | 'completed' | 'cancelled' | 'refill_requested'
  prescribedDate: string
  expiryDate?: string
  refillsRemaining?: number
  createdAt: string
  updatedAt: string
}

// Message Types
export interface Message {
  id: string
  conversationId: string
  senderId: string
  receiverId: string
  content: string
  attachments?: string[]
  read: boolean
  createdAt: string
}

export interface Conversation {
  id: string
  participants: {
    userId: string
    user: User
    lastReadAt?: string
  }[]
  lastMessage?: Message
  unreadCount: number
  updatedAt: string
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form Types
export interface FormError {
  field: string
  message: string
}

export interface FormState<T> {
  data: T
  errors: FormError[]
  isSubmitting: boolean
  isDirty: boolean
}

