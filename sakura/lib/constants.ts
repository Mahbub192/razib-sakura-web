/**
 * Application-wide constants
 */

// App Information
export const APP_NAME = 'Sakura'
export const APP_DESCRIPTION = 'Healthcare Management System'

// User Roles
export const USER_ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  ASSISTANT: 'assistant',
  ADMIN: 'admin',
} as const

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES]

// Appointment Status
export const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
  RESCHEDULED: 'rescheduled',
} as const

export type AppointmentStatus =
  typeof APPOINTMENT_STATUS[keyof typeof APPOINTMENT_STATUS]

// Appointment Status Colors
export const APPOINTMENT_STATUS_COLORS: Record<AppointmentStatus, string> = {
  [APPOINTMENT_STATUS.PENDING]: 'bg-yellow-500',
  [APPOINTMENT_STATUS.CONFIRMED]: 'bg-green-500',
  [APPOINTMENT_STATUS.CANCELLED]: 'bg-red-500',
  [APPOINTMENT_STATUS.COMPLETED]: 'bg-blue-500',
  [APPOINTMENT_STATUS.RESCHEDULED]: 'bg-purple-500',
}

// Medical Record Categories
export const MEDICAL_RECORD_CATEGORIES = {
  ALL: 'all',
  DIAGNOSES: 'diagnoses',
  MEDICATIONS: 'medications',
  ALLERGIES: 'allergies',
  VACCINATIONS: 'vaccinations',
  LAB_RESULTS: 'lab_results',
} as const

// Lab Result Status
export const LAB_RESULT_STATUS = {
  NORMAL: 'normal',
  BORDERLINE_HIGH: 'borderline_high',
  BORDERLINE_LOW: 'borderline_low',
  HIGH: 'high',
  LOW: 'low',
} as const

export type LabResultStatus =
  typeof LAB_RESULT_STATUS[keyof typeof LAB_RESULT_STATUS]

// Lab Result Status Colors
export const LAB_RESULT_STATUS_COLORS: Record<LabResultStatus, string> = {
  [LAB_RESULT_STATUS.NORMAL]: 'text-green-600',
  [LAB_RESULT_STATUS.BORDERLINE_HIGH]: 'text-yellow-600',
  [LAB_RESULT_STATUS.BORDERLINE_LOW]: 'text-yellow-600',
  [LAB_RESULT_STATUS.HIGH]: 'text-red-600',
  [LAB_RESULT_STATUS.LOW]: 'text-red-600',
}

// Prescription Status
export const PRESCRIPTION_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REFILL_REQUESTED: 'refill_requested',
} as const

// Time Slots (in minutes)
export const TIME_SLOT_DURATIONS = [15, 30, 45, 60] as const

// Days of Week
export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const

// Months
export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const

// Pagination
export const ITEMS_PER_PAGE = 10
export const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100] as const

// File Upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
] as const

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    VERIFY: '/auth/verify',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  PATIENT: {
    PROFILE: '/patient/profile',
    APPOINTMENTS: '/patient/appointments',
    MEDICAL_RECORDS: '/patient/medical-records',
    LAB_RESULTS: '/patient/lab-results',
    PRESCRIPTIONS: '/patient/prescriptions',
    MESSAGES: '/patient/messages',
  },
  DOCTOR: {
    DASHBOARD: '/doctor/dashboard',
    PATIENTS: '/doctor/patients',
    APPOINTMENTS: '/doctor/appointments',
    ASSISTANTS: '/doctor/assistants',
    REPORTS: '/doctor/reports',
  },
} as const

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PATIENT_DASHBOARD: '/patient/dashboard',
  DOCTOR_DASHBOARD: '/doctor/dashboard',
  ASSISTANT_DASHBOARD: '/assistant/dashboard',
} as const

