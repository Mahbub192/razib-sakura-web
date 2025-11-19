'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { PatientSidebar } from '@/components/layout/PatientSidebar'
import { patientApi, PatientAppointment } from '@/lib/api/patients'
import { commonApi } from '@/lib/api/common'

export default function PatientAppointments() {
  const searchParams = useSearchParams()
  const [appointments, setAppointments] = useState<PatientAppointment[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming')
  const [rescheduleModal, setRescheduleModal] = useState<{
    open: boolean
    appointment: PatientAppointment | null
  }>({ open: false, appointment: null })
  const [rescheduleData, setRescheduleData] = useState({
    selectedDate: '',
    selectedTime: '',
  })
  const [rescheduleLoading, setRescheduleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [availableSlots, setAvailableSlots] = useState<string[]>([])

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true)
        const status = activeTab === 'upcoming' ? 'confirmed' : 'completed'
        const response = await patientApi.getAppointments({ status })
        if (response.success && response.data) {
          setAppointments(response.data)
          
          // Check if reschedule query parameter exists
          const rescheduleId = searchParams.get('reschedule')
          if (rescheduleId) {
            const appointmentToReschedule = response.data.find((apt) => apt.id === rescheduleId)
            if (appointmentToReschedule) {
              setRescheduleModal({ open: true, appointment: appointmentToReschedule })
              // Clear the query parameter from URL
              window.history.replaceState({}, '', '/patient/appointments')
            }
          }
        }
      } catch (err) {
        console.error('Appointments fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [activeTab, searchParams])

  useEffect(() => {
    if (rescheduleModal.appointment && selectedDate) {
      loadAvailableSlots()
    }
  }, [rescheduleModal.appointment, selectedDate])

  const loadAvailableSlots = async () => {
    if (!rescheduleModal.appointment?.doctorId || !selectedDate) return

    try {
      const dateStr = selectedDate.toISOString().split('T')[0]
      const response = await commonApi.getDoctorAppointmentSlots(
        rescheduleModal.appointment.doctorId,
        dateStr,
        dateStr
      )
      if (response.success && response.data) {
        const daySlots = response.data.find((slotGroup) => slotGroup.date === dateStr)
        if (daySlots) {
          // Generate time slots (9 AM to 5 PM, 30-minute intervals)
          const slots: string[] = []
          for (let hour = 9; hour < 17; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
              const time12h = `${hour % 12 || 12}:${minute.toString().padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`
              slots.push(time12h)
            }
          }
          setAvailableSlots(slots)
        } else {
          setAvailableSlots([])
        }
      }
    } catch (err) {
      console.error('Error loading slots:', err)
      setAvailableSlots([])
    }
  }

  const handleCancel = async (appointmentId: string) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await patientApi.cancelAppointment(appointmentId)
        // Refresh appointments
        const response = await patientApi.getAppointments({ status: activeTab === 'upcoming' ? 'confirmed' : 'completed' })
        if (response.success && response.data) {
          setAppointments(response.data)
        }
      } catch (err) {
        console.error('Cancel appointment error:', err)
        alert('Failed to cancel appointment')
      }
    }
  }

  const handleReschedule = (appointment: PatientAppointment) => {
    setRescheduleModal({ open: true, appointment })
    setSelectedDate(null)
    setRescheduleData({ selectedDate: '', selectedTime: '' })
    setError(null)
    setSuccess(null)
  }

  const handleRescheduleConfirm = async () => {
    if (!rescheduleModal.appointment || !rescheduleData.selectedDate || !rescheduleData.selectedTime) {
      setError('Please select both date and time')
      return
    }

    setRescheduleLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Convert time to 24-hour format
      const [time, period] = rescheduleData.selectedTime.split(' ')
      const [hours, minutes] = time.split(':')
      let hour24 = parseInt(hours, 10)
      if (period === 'PM' && hour24 !== 12) hour24 += 12
      if (period === 'AM' && hour24 === 12) hour24 = 0
      const time24h = `${hour24.toString().padStart(2, '0')}:${minutes}`

      const response = await patientApi.rescheduleAppointment(
        rescheduleModal.appointment.id,
        rescheduleData.selectedDate,
        time24h
      )

      if (response.success) {
        setSuccess('Appointment rescheduled successfully!')
        setTimeout(() => {
          setRescheduleModal({ open: false, appointment: null })
          // Refresh appointments
          const status = activeTab === 'upcoming' ? 'confirmed' : 'completed'
          patientApi.getAppointments({ status }).then((res) => {
            if (res.success && res.data) {
              setAppointments(res.data)
            }
          })
        }, 1500)
      } else {
        setError(response.message || 'Failed to reschedule appointment')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to reschedule appointment')
    } finally {
      setRescheduleLoading(false)
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

  const handleDateSelect = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    setSelectedDate(date)
    setRescheduleData((prev) => ({
      ...prev,
      selectedDate: date.toISOString().split('T')[0],
    }))
  }

  const handleTimeSelect = (time: string) => {
    setRescheduleData((prev) => ({ ...prev, selectedTime: time }))
  }

  const calendarDays = getDaysInMonth(currentMonth)
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <PatientSidebar />

      <main className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#111418] dark:text-white mb-2">My Appointments</h1>
          </div>
          <Link
            href="/patient/appointments/book"
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
          >
            Book New Appointment
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'upcoming'
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-[#617589] dark:text-gray-400 hover:text-primary'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'past'
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-[#617589] dark:text-gray-400 hover:text-primary'
            }`}
          >
            Past
          </button>
        </div>

        {/* Appointments List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((appointment) => {
              const statusColors: Record<string, string> = {
                confirmed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
                pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
                cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
                completed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
                rescheduled: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
              }

              return (
                <div
                  key={appointment.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                >
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-semibold text-xl">{appointment.doctorInitial}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-[#111418] dark:text-white">{appointment.doctorName}</h3>
                          <span
                            className={`inline-block px-3 py-1 ${
                              statusColors[appointment.status] || statusColors.pending
                            } text-xs font-semibold rounded-full mt-1 capitalize`}
                          >
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-[#617589] dark:text-gray-400 mb-2">
                        {appointment.specialty} - {appointment.clinicName}
                      </p>
                      <p className="text-[#617589] dark:text-gray-400 mb-4">{appointment.formattedDateTime}</p>
                      <div className="flex gap-3">
                        {activeTab === 'upcoming' && appointment.status !== 'cancelled' && (
                          <>
                            <button
                              onClick={() => handleReschedule(appointment)}
                              className="px-4 py-2 bg-primary/10 text-primary text-sm font-semibold rounded-lg hover:bg-primary/20 transition-colors"
                            >
                              Reschedule
                            </button>
                            <button
                              onClick={() => handleCancel(appointment.id)}
                              className="px-4 py-2 text-[#617589] dark:text-gray-400 text-sm hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        <Link
                          href={`/patient/appointments/${appointment.id}`}
                          className="ml-auto text-primary text-sm font-semibold hover:underline"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <p className="text-[#617589] dark:text-gray-400">
              {activeTab === 'upcoming' ? 'No upcoming appointments' : 'No past appointments'}
            </p>
          </div>
        )}
      </main>

      {/* Reschedule Modal */}
      {rescheduleModal.open && rescheduleModal.appointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#111418] dark:text-white">Reschedule Appointment</h2>
                <button
                  onClick={() => setRescheduleModal({ open: false, appointment: null })}
                  className="text-[#617589] dark:text-gray-400 hover:text-[#111418] dark:hover:text-white"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Current Appointment Info */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
                <p className="text-sm text-[#617589] dark:text-gray-400 mb-2">Current Appointment:</p>
                <p className="font-semibold text-[#111418] dark:text-white">
                  {rescheduleModal.appointment.doctorName} - {rescheduleModal.appointment.formattedDateTime}
                </p>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
              )}
              {success && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-green-600 dark:text-green-400 text-sm">{success}</p>
                </div>
              )}

              {/* Date Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#111418] dark:text-white mb-4">Select New Date</h3>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <button
                      onClick={() => navigateMonth('prev')}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <h4 className="text-lg font-semibold text-[#111418] dark:text-white">{monthName}</h4>
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
                      const isSelected =
                        day &&
                        selectedDate?.getDate() === day &&
                        selectedDate?.getMonth() === currentMonth.getMonth()
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
                              : isSelected
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
              </div>

              {/* Time Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#111418] dark:text-white mb-4">
                  Select New Time
                  {selectedDate && ` for ${selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}
                </h3>
                {!selectedDate ? (
                  <p className="text-[#617589] dark:text-gray-400 text-sm">Please select a date first</p>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {availableSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => handleTimeSelect(time)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          rescheduleData.selectedTime === time
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

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setRescheduleModal({ open: false, appointment: null })}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-[#111418] dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRescheduleConfirm}
                  disabled={rescheduleLoading || !rescheduleData.selectedDate || !rescheduleData.selectedTime}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {rescheduleLoading ? 'Rescheduling...' : 'Confirm Reschedule'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
