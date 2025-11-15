/**
 * Appointment form validation utilities
 */

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

/**
 * Validate appointment date
 */
export function validateAppointmentDate(date: Date | string | null): ValidationResult {
  const errors: string[] = []

  if (!date) {
    errors.push('Please select an appointment date')
  } else {
    const appointmentDate = typeof date === 'string' ? new Date(date) : date
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (isNaN(appointmentDate.getTime())) {
      errors.push('Please enter a valid date')
    } else if (appointmentDate < today) {
      errors.push('Appointment date cannot be in the past')
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validate appointment time
 */
export function validateAppointmentTime(time: string): ValidationResult {
  const errors: string[] = []

  if (!time || time.trim().length === 0) {
    errors.push('Please select an appointment time')
  } else {
    // Validate time format (HH:MM AM/PM)
    const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i
    if (!timeRegex.test(time)) {
      errors.push('Please enter a valid time format (e.g., 10:30 AM)')
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validate clinic selection
 */
export function validateClinic(clinic: string): ValidationResult {
  const errors: string[] = []

  if (!clinic || clinic.trim().length === 0) {
    errors.push('Please select a clinic location')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validate patient information for appointment
 */
export function validatePatientInfo(data: {
  patientName?: string
  phoneNumber?: string
  email?: string
}): ValidationResult {
  const errors: string[] = []

  if (!data.patientName || data.patientName.trim().length === 0) {
    errors.push('Patient name is required')
  }

  if (!data.phoneNumber || data.phoneNumber.trim().length === 0) {
    errors.push('Phone number is required')
  } else {
    const cleaned = data.phoneNumber.replace(/[\s\-\(\)\+]/g, '')
    if (!/^\d{10,15}$/.test(cleaned)) {
      errors.push('Please enter a valid phone number')
    }
  }

  if (data.email && data.email.trim().length > 0) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      errors.push('Please enter a valid email address')
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

