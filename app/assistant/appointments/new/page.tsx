'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AssistantLayout from '@/components/layout/AssistantLayout'
import { assistantApi } from '@/lib/api/assistants'
import { commonApi, Clinic } from '@/lib/api/common'
import { DOCTOR_NAME } from '@/lib/constants'

interface Patient {
  id: string
  name: string
  phoneNumber: string
  email?: string
}

export default function NewAppointmentPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    patientType: 'new' as 'new' | 'old',
    patientId: '',
    patientName: '',
    phoneNumber: '',
    location: '',
    age: '',
    gender: '',
    notes: '',
    selectedDate: '',
    selectedTime: '',
    clinicId: '',
  })
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loadingData, setLoadingData] = useState(true)
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [availableSlots, setAvailableSlots] = useState<any[]>([])
  const [doctorId, setDoctorId] = useState<string>('')
  const [doctorProfile, setDoctorProfile] = useState<any>(null)

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    if (formData.selectedDate && doctorId) {
      loadAvailableSlots()
    }
  }, [formData.selectedDate, doctorId])

  useEffect(() => {
    if (formData.patientType === 'old' && searchQuery) {
      searchPatients()
    }
  }, [searchQuery, formData.patientType])

  const loadInitialData = async () => {
    try {
      setLoadingData(true)
      setError(null)

      // Get assistant profile to get doctor ID
      const profileResponse = await assistantApi.getProfile()
      if (profileResponse.success && profileResponse.data) {
        setDoctorProfile(profileResponse.data)
        // Get doctor ID from assistant's doctorId or clinic
        const assistantDoctorId = profileResponse.data.doctorId || profileResponse.data.clinic?.doctorId
        if (assistantDoctorId) {
          setDoctorId(assistantDoctorId)
        } else {
          // If no doctor ID, get first available doctor
          const doctorsResponse = await commonApi.getDoctors()
          if (doctorsResponse.success && doctorsResponse.data && doctorsResponse.data.length > 0) {
            setDoctorId(doctorsResponse.data[0].id)
          }
        }
      }

      // Load clinics
      const clinicsResponse = await commonApi.getClinics()
      if (clinicsResponse.success && clinicsResponse.data) {
        setClinics(clinicsResponse.data)
        if (clinicsResponse.data && clinicsResponse.data.length > 0) {
          setFormData((prev) => ({ ...prev, clinicId: clinicsResponse.data![0].id }))
        }
      }
    } catch (err: any) {
      console.error('Error loading initial data:', err)
      setError(err.message || 'Failed to load data')
    } finally {
      setLoadingData(false)
    }
  }

  const searchPatients = async () => {
    if (!searchQuery.trim()) {
      setPatients([])
      return
    }

    try {
      const response = await assistantApi.getPatients({ search: searchQuery, page: 1, limit: 10 })
      if (response.success && response.data) {
        setPatients(
          (response.data.patients || []).map((p: any) => ({
            id: p.id,
            name: p.name,
            phoneNumber: p.phoneNumber || '',
            email: p.email,
          })),
        )
      }
    } catch (err) {
      console.error('Error searching patients:', err)
      setPatients([])
    }
  }

  const loadAvailableSlots = async () => {
    if (!doctorId || !formData.selectedDate) return

    try {
      const dateStr = formData.selectedDate
      const response = await commonApi.getDoctorAppointmentSlots(doctorId, dateStr, dateStr)
      if (response.success && response.data) {
        const daySlots = response.data.find((slotGroup: any) => slotGroup.date === dateStr)
        if (daySlots) {
          // Filter available slots (status === 'available')
          const available = daySlots.slots.filter((slot: any) => slot.status === 'available' || slot.status === 'AVAILABLE')
          setAvailableSlots(available)
        } else {
          setAvailableSlots([])
        }
      }
    } catch (err: any) {
      console.error('Error loading available slots:', err)
      setAvailableSlots([])
    }
  }

  const convertTimeTo24Hour = (time12h: string) => {
    const [time, period] = time12h.split(' ')
    const [hours, minutes] = time.split(':')
    let hour24 = parseInt(hours)
    if (period === 'PM' && hour24 !== 12) hour24 += 12
    if (period === 'AM' && hour24 === 12) hour24 = 0
    return `${hour24.toString().padStart(2, '0')}:${minutes}`
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (value: 'new' | 'old') => {
    setFormData((prev) => ({ ...prev, patientType: value, patientId: '', patientName: '', phoneNumber: '' }))
    setSearchQuery('')
    setPatients([])
  }

  const handlePatientSelect = (patient: Patient) => {
    setFormData((prev) => ({
      ...prev,
      patientId: patient.id,
      patientName: patient.name,
      phoneNumber: patient.phoneNumber || '',
    }))
    setSearchQuery(patient.name)
    setPatients([])
  }

  // Format date to YYYY-MM-DD in local timezone (helper function)
  const formatDateLocal = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const handleDateSelect = (day: number) => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const selectedDate = new Date(year, month, day)
    selectedDate.setHours(0, 0, 0, 0) // Normalize to start of day
    // Format as YYYY-MM-DD in local timezone
    const dateStr = formatDateLocal(selectedDate)
    setFormData((prev) => ({
      ...prev,
      selectedDate: dateStr,
      selectedTime: '', // Reset time when date changes
    }))
  }

  const handleTimeSelect = (time: string) => {
    setFormData((prev) => ({ ...prev, selectedTime: time }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Validate required fields
      if (!formData.patientName || !formData.phoneNumber || !formData.selectedDate || !formData.selectedTime || !formData.clinicId) {
        setError('Please fill in all required fields')
        setIsLoading(false)
        return
      }

      if (!doctorId) {
        setError('Doctor ID not found. Please contact administrator.')
        setIsLoading(false)
        return
      }

      // For new patients, we need to create patient first or use existing patient ID
      let finalPatientId = formData.patientId

      // If it's a new patient and we don't have patientId, we'll need to create one
      // For now, we'll use the phone number to find or create patient
      // In a real implementation, you'd create the patient first
      if (formData.patientType === 'new' && !finalPatientId) {
        // TODO: Create patient first, then use the ID
        // For now, we'll need patientId - this should be handled by backend
        setError('New patient registration is required. Please ensure patient is registered first.')
        setIsLoading(false)
        return
      }

      // Convert time to 24-hour format
      const time24h = convertTimeTo24Hour(formData.selectedTime)

      const bookingData = {
        patientId: finalPatientId,
        doctorId: doctorId,
        clinicId: formData.clinicId,
        date: formData.selectedDate,
        time: time24h,
        duration: 30, // Default 30 minutes
        reason: formData.notes || undefined,
        notes: formData.notes || undefined,
        type: 'CONSULTATION',
      }

      const response = await assistantApi.bookAppointment(bookingData)

      if (response.success && response.data) {
        setSuccess('Appointment booked successfully!')
        setTimeout(() => {
          router.push('/assistant/appointments')
        }, 2000)
      } else {
        setError(response.message || 'Failed to book appointment')
      }
    } catch (err: any) {
      console.error('Book appointment error:', err)
      setError(err.message || 'An error occurred while booking appointment')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  // Calendar generation
  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    // Previous month's days
    const prevMonth = new Date(year, month - 1, 0)
    const prevMonthDays = prevMonth.getDate()
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, isCurrentMonth: false })
    }
    // Current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true })
    }
    // Next month's days to fill the grid
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ day: i, isCurrentMonth: false })
    }
    return days
  }

  const monthNames = [
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
  ]
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  const today = new Date()
  today.setHours(0, 0, 0, 0) // Normalize to start of day
  const todayDate = today.getDate()
  const currentMonthNum = currentMonth.getMonth()
  const currentYear = currentMonth.getFullYear()
  const isCurrentMonth = currentMonthNum === today.getMonth() && currentYear === today.getFullYear()

  const days = getDaysInMonth()
  const todayStr = formatDateLocal(today)
  
  // Get selected date string for comparison
  const selectedDateStr = formData.selectedDate || null
  const selectedDay = selectedDateStr ? new Date(selectedDateStr + 'T00:00:00').getDate() : null
  const selectedMonth = selectedDateStr ? new Date(selectedDateStr + 'T00:00:00').getMonth() : null
  const selectedYear = selectedDateStr ? new Date(selectedDateStr + 'T00:00:00').getFullYear() : null
  
  // Check if a day is selected (must match exact date)
  const isDaySelected = (day: number) => {
    if (!selectedDateStr) return false
    const dayDate = new Date(currentYear, currentMonthNum, day)
    const dayDateStr = formatDateLocal(dayDate)
    return dayDateStr === selectedDateStr
  }
  
  // Check if a day is in the past (allow today's date)
  const isPastDate = (day: number) => {
    const dayDate = new Date(currentYear, currentMonthNum, day)
    dayDate.setHours(0, 0, 0, 0)
    return dayDate < today
  }

  // Format available slots for display
  const formatTimeSlot = (time24h: string) => {
    const [hours, minutes] = time24h.split(':')
    const hour = parseInt(hours)
    const period = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${period}`
  }

  if (loadingData) {
    return (
      <AssistantLayout activePage="/assistant/appointments/new">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </AssistantLayout>
    )
  }

  return (
    <AssistantLayout activePage="/assistant/appointments/new">
      <div className="p-3 sm:p-4 md:p-4 lg:p-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:gap-4 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col gap-0.5">
            <h1 className="text-gray-900 dark:text-white text-xl sm:text-2xl md:text-2xl font-bold leading-tight">New Appointment</h1>
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-normal leading-normal">
              Schedule an appointment for a patient with {DOCTOR_NAME}
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="p-2 md:p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-xs sm:text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div className="p-2 md:p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-600 dark:text-green-400 text-xs sm:text-sm">{success}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {/* Left Column - Patient Info */}
            <div className="md:col-span-1 flex flex-col gap-3 md:gap-4">
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3 md:p-4">
                <div className="flex flex-col gap-3 md:gap-4">
                  {/* Patient Type */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Patient Type</label>
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                        <input
                          checked={formData.patientType === 'new'}
                          onChange={() => handleRadioChange('new')}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:checked:bg-primary"
                          name="patient-type"
                          type="radio"
                        />
                        <span className="ml-2">New patient</span>
                      </label>
                      <label className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                        <input
                          checked={formData.patientType === 'old'}
                          onChange={() => handleRadioChange('old')}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:checked:bg-primary"
                          name="patient-type"
                          type="radio"
                        />
                        <span className="ml-2">Existing patient</span>
                      </label>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-800"></div>

                  {/* Patient Information */}
                  <div>
                    <h3 className="text-sm md:text-base font-semibold text-gray-900 dark:text-white mb-2 md:mb-3">Patient Information</h3>
                    {formData.patientType === 'old' ? (
                      <div className="mb-2 md:mb-3">
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Search Patient
                        </label>
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search by name or phone number..."
                          className="w-full text-sm border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-primary focus:border-primary dark:text-white px-3 py-2"
                        />
                        {patients.length > 0 && (
                          <div className="mt-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 max-h-48 overflow-y-auto">
                            {patients.map((patient) => (
                              <button
                                key={patient.id}
                                type="button"
                                onClick={() => handlePatientSelect(patient)}
                                className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                              >
                                <p className="font-medium text-gray-900 dark:text-white">{patient.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{patient.phoneNumber}</p>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : null}
                    <div className="flex flex-col gap-2 md:gap-3">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="patient-name">
                          Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="patient-name"
                          name="patientName"
                          value={formData.patientName}
                          onChange={handleInputChange}
                          placeholder="Enter patient's full name"
                          type="text"
                          required
                          disabled={formData.patientType === 'old' && !!formData.patientId}
                          className="w-full text-xs sm:text-sm border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-primary focus:border-primary dark:text-white px-2.5 py-1.5 md:px-3 md:py-2 disabled:opacity-50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="patient-phone">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="patient-phone"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          placeholder="Enter phone number"
                          type="tel"
                          required
                          disabled={formData.patientType === 'old' && !!formData.patientId}
                          className="w-full text-xs sm:text-sm border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-primary focus:border-primary dark:text-white px-2.5 py-1.5 md:px-3 md:py-2 disabled:opacity-50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="clinic">
                          Clinic <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="clinic"
                          name="clinicId"
                          value={formData.clinicId}
                          onChange={handleInputChange}
                          required
                          className="w-full text-xs sm:text-sm border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-primary focus:border-primary dark:text-white px-2.5 py-1.5 md:px-3 md:py-2"
                        >
                          <option value="">Select Clinic</option>
                          {clinics.map((clinic) => (
                            <option key={clinic.id} value={clinic.id}>
                              {clinic.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="patient-location">
                          Location
                        </label>
                        <input
                          id="patient-location"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          placeholder="Enter city or area"
                          type="text"
                          className="w-full text-xs sm:text-sm border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-primary focus:border-primary dark:text-white px-2.5 py-1.5 md:px-3 md:py-2"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2 md:gap-3">
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="patient-age">
                            Age
                          </label>
                          <input
                            id="patient-age"
                            name="age"
                            value={formData.age}
                            onChange={handleInputChange}
                            placeholder="e.g. 35"
                            type="number"
                            className="w-full text-xs sm:text-sm border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-primary focus:border-primary dark:text-white px-2.5 py-1.5 md:px-3 md:py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="patient-gender">
                            Gender
                          </label>
                          <select
                            id="patient-gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            className="w-full text-xs sm:text-sm border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-primary focus:border-primary dark:text-white px-2.5 py-1.5 md:px-3 md:py-2"
                          >
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="notes">
                      Notes / Reason for Visit
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Add any relevant notes for the appointment..."
                      rows={2}
                      className="w-full text-xs sm:text-sm border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-primary focus:border-primary dark:text-white px-2.5 py-1.5 md:px-3 md:py-2 resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Date & Time (Wider for slots) */}
            <div className="md:col-span-2 flex flex-col gap-3 md:gap-4">
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-2.5 md:p-3">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-1.5">Date & Time</h3>
                <div className="flex flex-col">
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-1">
                    <button
                      type="button"
                      onClick={() => navigateMonth('prev')}
                      className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">chevron_left</span>
                    </button>
                    <span className="font-semibold text-xs sm:text-sm">
                      {monthNames[currentMonthNum]} {currentYear}
                    </span>
                    <button
                      type="button"
                      onClick={() => navigateMonth('next')}
                      className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">chevron_right</span>
                    </button>
                  </div>

                  {/* Week Days */}
                  <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-1 py-0.5">
                    {weekDays.map((day) => (
                      <span key={day}>{day}</span>
                    ))}
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-0.5 text-[10px] sm:text-xs">
                    {days.map((dayObj, index) => {
                      const isToday = dayObj.isCurrentMonth && dayObj.day === todayDate && isCurrentMonth
                      const isSelected = dayObj.isCurrentMonth && isDaySelected(dayObj.day)
                      const isPast = dayObj.isCurrentMonth && isPastDate(dayObj.day)
                      const isDisabled = !dayObj.isCurrentMonth || isPast
                      
                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => !isDisabled && handleDateSelect(dayObj.day)}
                          disabled={isDisabled}
                          className={`h-7 sm:h-8 flex items-center justify-center rounded-full transition-colors text-[10px] sm:text-xs ${
                            isDisabled
                              ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50'
                              : isSelected
                              ? 'font-semibold bg-primary text-white cursor-pointer'
                              : isToday
                              ? 'font-semibold bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary cursor-pointer'
                              : 'text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer'
                          }`}
                        >
                          {dayObj.day}
                        </button>
                      )
                    })}
                  </div>

                  {/* Time Slots */}
                  {formData.selectedDate && (
                    <div className="mt-1.5 pt-1.5 border-t border-gray-200 dark:border-gray-800">
                      <label className="block text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Available Slots for {(() => {
                          const selectedDateObj = new Date(formData.selectedDate + 'T00:00:00')
                          return selectedDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                        })()}
                      </label>
                      {availableSlots.length > 0 ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-1 md:gap-1.5 max-h-56 md:max-h-56 overflow-y-auto">
                          {availableSlots.map((slot) => {
                            const time12h = formatTimeSlot(slot.time)
                            const isSelected = formData.selectedTime === time12h
                            return (
                              <button
                                key={slot.id}
                                type="button"
                                onClick={() => handleTimeSelect(time12h)}
                                className={`px-1.5 py-1 md:px-2 md:py-1.5 text-[10px] sm:text-xs rounded border transition-colors font-medium ${
                                  isSelected
                                    ? 'border-primary bg-primary text-white dark:bg-primary dark:text-white shadow-sm'
                                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary/10 dark:hover:bg-primary/20 hover:border-primary'
                                }`}
                              >
                                {time12h}
                              </button>
                            )
                          })}
                        </div>
                      ) : (
                        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 text-center py-1.5">
                          No available slots for this date. Please select another date.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end items-center gap-2 md:gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg h-9 md:h-10 px-4 md:px-5 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs sm:text-sm font-bold leading-normal hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="truncate">Cancel</span>
            </button>
            <button
              type="submit"
              disabled={
                isLoading ||
                !formData.patientName ||
                !formData.phoneNumber ||
                !formData.selectedDate ||
                !formData.selectedTime ||
                !formData.clinicId ||
                (formData.patientType === 'old' && !formData.patientId)
              }
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg h-9 md:h-10 px-4 md:px-5 bg-primary text-white text-xs sm:text-sm font-bold leading-normal shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-base md:text-lg">event_available</span>
              <span className="truncate">{isLoading ? 'Scheduling...' : 'Schedule Appointment'}</span>
            </button>
          </div>
        </form>
      </div>
    </AssistantLayout>
  )
}
