'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PatientSidebar } from '@/components/layout/PatientSidebar'

export default function BookAppointmentPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    patientName: 'Amelia Reyes',
    phoneNumber: '+1 (555) 123-4567',
    email: 'amelia.reyes@example.com',
    gender: 'Female',
    age: '34',
    location: '123 Health St, Wellness City, 12345',
    patientType: 'old',
    clinic: '',
    selectedDate: '',
    selectedTime: '',
  })
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, patientType: value }))
  }

  const handleDateSelect = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    setSelectedDate(date)
    setFormData((prev) => ({
      ...prev,
      selectedDate: date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    }))
  }

  const handleTimeSelect = (time: string) => {
    setFormData((prev) => ({ ...prev, selectedTime: time }))
  }

  const handleConfirm = async () => {
    setIsLoading(true)
    
    try {
      const { patientApi } = await import('@/lib/api/patients')
      
      // Parse date and time from form data
      const [dateStr, timeStr] = formData.selectedDate?.split(', ') || []
      const appointmentDate = new Date()
      // You'll need to properly parse the date and time here
      // For now, using current date + selected time
      
      // For now, we'll need to get doctorId from somewhere else
      // This is a placeholder - you should get it from doctor selection in the form
      const bookingData = {
        doctorId: '', // TODO: Get from doctor selection
        date: appointmentDate.toISOString().split('T')[0],
        time: formData.selectedTime || '',
        reason: 'General consultation', // TODO: Add reason field to form
        clinicId: formData.clinic || undefined,
        notes: '', // TODO: Add notes field to form
      }
      
      const response = await patientApi.bookAppointment(bookingData)
      
      if (response.success && response.data) {
        const appointment = response.data
        const params = new URLSearchParams({
          appointmentId: appointment.id,
          date: appointment.date || formData.selectedDate || '',
          time: appointment.time || formData.selectedTime || '',
        })
        router.push(`/appointments/confirmed?${params.toString()}`)
      } else {
        alert(response.message || 'Failed to book appointment')
        setIsLoading(false)
      }
    } catch (err: any) {
      console.error('Book appointment error:', err)
      alert(err.message || 'An error occurred while booking appointment')
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

  const availableTimeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '01:00 PM', '01:30 PM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  ]

  const calendarDays = getDaysInMonth(currentMonth)
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

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

          {/* Breadcrumbs */}
          <div className="mb-6 flex items-center gap-2 text-sm text-[#617589] dark:text-gray-400">
            <span className="text-primary">Patient Info</span>
            <span>/</span>
            <span>Choose Time</span>
            <span>/</span>
            <span>Confirm</span>
          </div>

          {/* Section 1: Patient Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <h2 className="text-xl font-bold text-[#111418] dark:text-white mb-4">1. Patient Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">Patient Name</label>
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option>Female</option>
                  <option>Male</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-3">Patient Type</label>
              <div className="flex gap-6">
                {['new', 'old', 'ot'].map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="patientType"
                      value={type}
                      checked={formData.patientType === type}
                      onChange={() => handleRadioChange(type)}
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <span className="text-[#111418] dark:text-white capitalize">
                      {type === 'ot' ? 'OT patient' : `${type} patient`}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Choose Date & Time */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <h2 className="text-xl font-bold text-[#111418] dark:text-white mb-4">2. Choose Date & Time</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">Choose Clinic Name</label>
              <select
                name="clinic"
                value={formData.clinic}
                onChange={handleInputChange}
                className="w-full md:w-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Clinic</option>
                <option value="main">Main Clinic</option>
                <option value="downtown">Downtown Branch</option>
                <option value="northside">Northside Center</option>
              </select>
            </div>

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
                  {calendarDays.map((day, index) => (
                    <button
                      key={index}
                      onClick={() => day && handleDateSelect(day)}
                      disabled={!day}
                      className={`py-2 rounded-lg transition-colors ${
                        !day
                          ? ''
                          : selectedDate?.getDate() === day && selectedDate?.getMonth() === currentMonth.getMonth()
                          ? 'bg-primary text-white'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-[#111418] dark:text-white'
                      }`}
                    >
                      {day || ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <h3 className="text-lg font-semibold text-[#111418] dark:text-white mb-4">
                  Available Slots for {formData.selectedDate || 'Selected Date'}
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {availableTimeSlots.map((time) => (
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
              </div>
            </div>
          </div>

          {/* Section 3: Review and Confirm */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-[#111418] dark:text-white mb-4">3. Review and Confirm</h2>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 mb-4">
              <h3 className="font-semibold text-[#111418] dark:text-white mb-4">Appointment Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">person</span>
                  <span className="text-[#617589] dark:text-gray-400">Doctor:</span>
                  <span className="text-[#111418] dark:text-white font-semibold">Dr. Emily Carter (Cardiologist)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">event</span>
                  <span className="text-[#617589] dark:text-gray-400">Date:</span>
                  <span className="text-[#111418] dark:text-white font-semibold">
                    {formData.selectedDate || 'Select a date'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">schedule</span>
                  <span className="text-[#617589] dark:text-gray-400">Time:</span>
                  <span className="text-[#111418] dark:text-white font-semibold">
                    {formData.selectedTime || 'Select a time'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">location_on</span>
                  <span className="text-[#617589] dark:text-gray-400">Location:</span>
                  <span className="text-[#111418] dark:text-white font-semibold">
                    {formData.clinic ? `${formData.clinic} Clinic` : 'Select clinic'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleConfirm}
                disabled={isLoading || !formData.selectedDate || !formData.selectedTime || !formData.clinic}
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

