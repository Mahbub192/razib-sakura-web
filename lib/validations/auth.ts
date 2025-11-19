/**
 * Authentication form validation utilities
 */

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

/**
 * Validate phone number
 */
export function validatePhoneNumber(phone: string): ValidationResult {
  const errors: string[] = []

  if (!phone || phone.trim().length === 0) {
    errors.push('Phone number is required')
  } else {
    // Remove common formatting characters
    const cleaned = phone.replace(/[\s\-\(\)\+]/g, '')
    
    // Check if it's a valid phone number (10-15 digits)
    if (!/^\d{10,15}$/.test(cleaned)) {
      errors.push('Please enter a valid phone number')
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validate email address
 */
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = []

  if (!email || email.trim().length === 0) {
    errors.push('Email is required')
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      errors.push('Please enter a valid email address')
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validate password
 */
export function validatePassword(password: string): ValidationResult {
  const errors: string[] = []

  if (!password || password.length === 0) {
    errors.push('Password is required')
  } else {
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long')
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number')
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
      errors.push('Password must contain at least one special character')
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validate password confirmation
 */
export function validatePasswordConfirmation(
  password: string,
  confirmPassword: string
): ValidationResult {
  const errors: string[] = []

  if (!confirmPassword || confirmPassword.length === 0) {
    errors.push('Please confirm your password')
  } else if (password !== confirmPassword) {
    errors.push('Passwords do not match')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validate OTP code
 */
export function validateOTP(otp: string): ValidationResult {
  const errors: string[] = []

  if (!otp || otp.trim().length === 0) {
    errors.push('OTP code is required')
  } else {
    const cleaned = otp.replace(/\s/g, '')
    if (!/^\d{4,6}$/.test(cleaned)) {
      errors.push('Please enter a valid OTP code (4-6 digits)')
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validate name
 */
export function validateName(name: string, fieldName: string = 'Name'): ValidationResult {
  const errors: string[] = []

  if (!name || name.trim().length === 0) {
    errors.push(`${fieldName} is required`)
  } else {
    if (name.trim().length < 2) {
      errors.push(`${fieldName} must be at least 2 characters long`)
    }
    if (!/^[a-zA-Z\s\-'\.]+$/.test(name)) {
      errors.push(`${fieldName} can only contain letters, spaces, hyphens, and apostrophes`)
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validate date of birth
 */
export function validateDateOfBirth(dateOfBirth: string): ValidationResult {
  const errors: string[] = []

  if (!dateOfBirth || dateOfBirth.trim().length === 0) {
    errors.push('Date of birth is required')
  } else {
    const date = new Date(dateOfBirth)
    const today = new Date()
    const age = today.getFullYear() - date.getFullYear()

    if (isNaN(date.getTime())) {
      errors.push('Please enter a valid date')
    } else if (age < 0 || age > 150) {
      errors.push('Please enter a valid date of birth')
    } else if (age < 18) {
      errors.push('You must be at least 18 years old to register')
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

