'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PatientSidebar } from '@/components/layout/PatientSidebar'
import { patientApi } from '@/lib/api/patients'
import { commonApi, Doctor, Clinic, AppointmentSlot } from '@/lib/api/common'

export default function BookAppointmentPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    doctorId: '',
    clinicId: '',
    selectedDate: '',
    selectedTime: '',
    reason: '',
    notes: '',
  })
  const [patientProfile, setPatientProfile] = useState<any>(null)
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [availableSlots, setAvailableSlots] = useState<AppointmentSlot[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    if (formData.doctorId && selectedDate) {
      loadAvailableSlots()
    } else {
      setAvailableSlots([])
    }
  }, [formData.doctorId, selectedDate])

  const loadInitialData = async () => {
    try {
      setLoadingData(true)
      setError(null)

      // Load patient profile
      const profileResponse = await patientApi.getProfile()
      if (profileResponse.success && profileResponse.data) {
        setPatientProfile(profileResponse.data)
      }

      // Load doctors
      const doctorsResponse = await commonApi.getDoctors()
      if (doctorsResponse.success && doctorsResponse.data) {
        setDoctors(doctorsResponse.data)
      }

      // Load clinics
      const clinicsResponse = await commonApi.getClinics()
      if (clinicsResponse.success && clinicsResponse.data) {
        setClinics(clinicsResponse.data)
      }
    } catch (err: any) {
      console.error('Error loading initial data:', err)
      setError(err.message || 'Failed to load data')
    } finally {
      setLoadingData(false)
    }
  }

  const loadAvailableSlots = async () => {
    if (!formData.doctorId || !selectedDate) return

    try {
      const dateStr = selectedDate.toISOString().split('T')[0]
      const endDateStr = dateStr // Same day for now

      const response = await commonApi.getDoctorAppointmentSlots(formData.doctorId, dateStr, endDateStr)
      if (response.success && response.data) {
        // Find slots for the selected date
        const daySlots = response.data.find((slotGroup) => slotGroup.date === dateStr)
        if (daySlots) {
          // Filter available slots (not booked)
          const available = daySlots.slots.filter(
            (slot) => slot.status === 'pending' || slot.status === 'available' || !slot.patientName
          )
          setAvailableSlots(available)
        } else {
          setAvailableSlots([])
        }
      }
    } catch (err: any) {
      console.error('Error loading available slots:', err)
      // Don't show error, just clear slots
      setAvailableSlots([])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateSelect = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    setSelectedDate(date)
    setFormData((prev) => ({
      ...prev,
      selectedDate: date.toISOString().split('T')[0],
    }))
  }

  const handleTimeSelect = (time: string) => {
    setFormData((prev) => ({ ...prev, selectedTime: time }))
  }

  const convertTimeTo24Hour = (time12h: string): string => {
    const [time, period] = time12h.split(' ')
    const [hours, minutes] = time.split(':')
    let hour24 = parseInt(hours, 10)
    if (period === 'PM' && hour24 !== 12) hour24 += 12
    if (period === 'AM' && hour24 === 12) hour24 = 0
    return `${hour24.toString().padStart(2, '0')}:${minutes}`
  }

  const handleConfirm = async () => {
    if (!formData.doctorId || !formData.clinicId || !formData.selectedDate || !formData.selectedTime) {
      setError('Please fill in all required fields')
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Convert time to 24-hour format
      const time24h = convertTimeTo24Hour(formData.selectedTime)

      const bookingData = {
        doctorId: formData.doctorId,
        clinicId: formData.clinicId,
        date: formData.selectedDate,
        time: time24h,
        duration: 30, // Default 30 minutes
        reason: formData.reason || undefined,
        notes: formData.notes || undefined,
      }

      const response = await patientApi.bookAppointment(bookingData)

      if (response.success && response.data) {
        setSuccess('Appointment booked successfully!')
        setTimeout(() => {
          router.push('/patient/appointments')
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

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    return days
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

  // Generate time slots (9 AM to 5 PM, 30-minute intervals)
  const generateTimeSlots = () => {
    const slots: string[] = []
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time12h = `${hour % 12 || 12}:${minute.toString().padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`
        slots.push(time12h)
      }
    }
    return slots
  }

  const allTimeSlots = generateTimeSlots()
  const calendarDays = getDaysInMonth(currentMonth)
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const selectedDoctor = doctors.find((d) => d.id === formData.doctorId)
  const selectedClinic = clinics.find((c) => c.id === formData.clinicId)

  if (loadingData) {
    return (
      <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
        <PatientSidebar />
        <main className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-[#617589] dark:text-gray-400">Loading appointment booking form...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <PatientSidebar />

      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#111418] dark:text-white mb-2">Book an Appointment</h1>
            <p className="text-[#617589] dark:text-gray-400">
              Fill in your details to schedule your visit in a few simple steps.
            </p>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-600 dark:text-green-400 text-sm">{success}</p>
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Breadcrumbs */}
          <div className="mb-6 flex items-center gap-2 text-sm text-[#617589] dark:text-gray-400">
            <span className="text-primary">Select Doctor & Clinic</span>
            <span>/</span>
            <span>Choose Date & Time</span>
            <span>/</span>
            <span>Confirm</span>
          </div>

          {/* Section 1: Select Doctor & Clinic */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <h2 className="text-xl font-bold text-[#111418] dark:text-white mb-4">1. Select Doctor & Clinic</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                  Select Doctor <span className="text-red-500">*</span>
                </label>
                <select
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Select a doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.fullName} {doctor.specialty ? `(${doctor.specialty})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                  Select Clinic <span className="text-red-500">*</span>
                </label>
                <select
                  name="clinicId"
                  value={formData.clinicId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Select a clinic</option>
                  {clinics.map((clinic) => (
                    <option key={clinic.id} value={clinic.id}>
                      {clinic.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Choose Date & Time */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <h2 className="text-xl font-bold text-[#111418] dark:text-white mb-4">2. Choose Date & Time</h2>

            {!formData.doctorId && (
              <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-yellow-600 dark:text-yellow-400 text-sm">
                  Please select a doctor first to view available dates and times.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Calendar */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <h3 className="text-lg font-semibold text-[#111418] dark:text-white">{monthName}</h3>
                  <button
                    onClick={() => navigateMonth('next')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                    <div key={day} className="text-center text-sm font-semibold text-[#617589] dark:text-gray-400 py-2">
                      {day}
                    </div>
                  ))}
                  {calendarDays.map((day, index) => {
                    const isPast = day
                      ? new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day) <
                        new Date(new Date().setHours(0, 0, 0, 0))
                      : false
                    return (
                      <button
                        key={index}
                        onClick={() => day && !isPast && handleDateSelect(day)}
                        disabled={!day || isPast}
                        className={`py-2 rounded-lg transition-colors ${
                          !day
                            ? ''
                            : isPast
                            ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                            : selectedDate?.getDate() === day &&
                              selectedDate?.getMonth() === currentMonth.getMonth()
                            ? 'bg-primary text-white'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-[#111418] dark:text-white'
                        }`}
                      >
                        {day || ''}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <h3 className="text-lg font-semibold text-[#111418] dark:text-white mb-4">
                  Available Time Slots
                  {selectedDate && ` for ${selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}
                </h3>
                {!selectedDate ? (
                  <p className="text-[#617589] dark:text-gray-400 text-sm">Please select a date first</p>
                ) : availableSlots.length === 0 && formData.doctorId ? (
                  <div className="grid grid-cols-3 gap-2">
                    {allTimeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => handleTimeSelect(time)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          formData.selectedTime === time
                            ? 'bg-primary text-white border-primary'
                            : 'border-gray-300 dark:border-gray-600 text-[#111418] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {allTimeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => handleTimeSelect(time)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          formData.selectedTime === time
                            ? 'bg-primary text-white border-primary'
                            : 'border-gray-300 dark:border-gray-600 text-[#111418] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Additional Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <h2 className="text-xl font-bold text-[#111418] dark:text-white mb-4">3. Additional Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                  Reason for Visit
                </label>
                <input
                  type="text"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  placeholder="e.g., General check-up, Follow-up, etc."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Any additional information you'd like to share..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Review and Confirm */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-[#111418] dark:text-white mb-4">4. Review and Confirm</h2>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 mb-4">
              <h3 className="font-semibold text-[#111418] dark:text-white mb-4">Appointment Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">person</span>
                  <span className="text-[#617589] dark:text-gray-400">Doctor:</span>
                  <span className="text-[#111418] dark:text-white font-semibold">
                    {selectedDoctor ? `${selectedDoctor.fullName} ${selectedDoctor.specialty ? `(${selectedDoctor.specialty})` : ''}` : 'Not selected'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">location_on</span>
                  <span className="text-[#617589] dark:text-gray-400">Clinic:</span>
                  <span className="text-[#111418] dark:text-white font-semibold">
                    {selectedClinic ? selectedClinic.name : 'Not selected'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">event</span>
                  <span className="text-[#617589] dark:text-gray-400">Date:</span>
                  <span className="text-[#111418] dark:text-white font-semibold">
                    {selectedDate
                      ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                      : 'Not selected'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">schedule</span>
                  <span className="text-[#617589] dark:text-gray-400">Time:</span>
                  <span className="text-[#111418] dark:text-white font-semibold">
                    {formData.selectedTime || 'Not selected'}
                  </span>
                </div>
                {formData.reason && (
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">info</span>
                    <span className="text-[#617589] dark:text-gray-400">Reason:</span>
                    <span className="text-[#111418] dark:text-white font-semibold">{formData.reason}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleConfirm}
                disabled={
                  isLoading ||
                  !formData.doctorId ||
                  !formData.clinicId ||
                  !formData.selectedDate ||
                  !formData.selectedTime
                }
                className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Booking...' : 'Confirm Appointment'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
