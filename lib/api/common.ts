/**
 * Common API functions for getting doctors, clinics, etc.
 */

import { apiClient, ApiResponse } from './client'

export interface Doctor {
  id: string
  fullName: string
  email: string
  phoneNumber: string
  specialty?: string
  avatar?: string
}

export interface Clinic {
  id: string
  name: string
  address?: string
  phone?: string
  email?: string
  description?: string
}

export interface AppointmentSlot {
  id: string
  time: string
  duration: number
  status: string
  patientName?: string
  clinicId: string
}

export interface AppointmentSlotsResponse {
  date: string
  slots: AppointmentSlot[]
  totalSlots: number
  availableSlots: number
}

// Common API functions
export const commonApi = {
  // Get all doctors
  async getDoctors(): Promise<ApiResponse<Doctor[]>> {
    const response = await apiClient.get<ApiResponse<any[]>>('/users')
    if (response.success && response.data) {
      // Filter for doctors only
      const doctors = response.data.filter((user: any) => user.role?.toLowerCase() === 'doctor')
      return {
        ...response,
        data: doctors.map((doctor: any) => ({
          id: doctor.id,
          fullName: doctor.fullName,
          email: doctor.email,
          phoneNumber: doctor.phoneNumber,
          specialty: doctor.specialty,
          avatar: doctor.avatar,
        })),
      }
    }
    return response as ApiResponse<Doctor[]>
  },

  // Get all clinics
  async getClinics(): Promise<ApiResponse<Clinic[]>> {
    return apiClient.get<ApiResponse<Clinic[]>>('/clinics')
  },

  // Get appointment slots for a doctor
  async getDoctorAppointmentSlots(
    doctorId: string,
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<AppointmentSlotsResponse[]>> {
    const queryParams: Record<string, string> = {}
    if (startDate) queryParams.startDate = startDate
    if (endDate) queryParams.endDate = endDate

    return apiClient.get<ApiResponse<AppointmentSlotsResponse[]>>(
      `/doctors/${doctorId}/appointment-slots`,
      queryParams
    )
  },

  // Create a new patient (for assistants to create patients on the fly)
  async createPatient(data: {
    fullName: string
    phoneNumber: string
    email?: string
    gender?: string
    dateOfBirth?: string
    address?: string
  }): Promise<ApiResponse<any>> {
    // Ensure email is valid - remove non-alphanumeric from phone for email
    const cleanPhone = data.phoneNumber.replace(/\D/g, '')
    const validEmail = data.email || `patient.${cleanPhone}@temp.sakura.com`
    
    // Ensure phone number has proper format (add + if not present and it's a number)
    let formattedPhone = data.phoneNumber
    if (!formattedPhone.startsWith('+') && /^\d/.test(formattedPhone)) {
      // If it starts with a digit and doesn't have +, assume it needs country code
      // For Bangladesh, add +880 if it starts with 0
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '+880' + formattedPhone.substring(1)
      } else if (formattedPhone.length >= 10) {
        formattedPhone = '+880' + formattedPhone
      }
    }

    return apiClient.post<ApiResponse<any>>('/auth/register', {
      fullName: data.fullName,
      phoneNumber: formattedPhone,
      email: validEmail,
      password: 'TempPass123!', // Temporary password, patient can change later
      role: 'patient',
      gender: data.gender,
      dateOfBirth: data.dateOfBirth,
    })
  },
}

