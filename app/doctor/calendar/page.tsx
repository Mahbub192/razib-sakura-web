'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { DoctorSidebar } from '@/components/layout/DoctorSidebar'
import { doctorApi } from '@/lib/api/doctors'

interface CalendarAppointment {
  id: string
  date: string
  time: string
  patientName: string
  patientInitial: string
  reason?: string
  status: string
}

export default function DoctorCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [appointments, setAppointments] = useState<CalendarAppointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('month')

  useEffect(() => {
    fetchAppointmentsForMonth()
  }, [currentDate])

  const fetchAppointmentsForMonth = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get first and last day of current month
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth()
      const startDate = new Date(year, month, 1)
      const endDate = new Date(year, month + 1, 0) // Last day of month

      const startDateStr = startDate.toISOString().split('T')[0]
      const endDateStr = endDate.toISOString().split('T')[0]

      // Use date range endpoint for better performance
      const response = await doctorApi.getAppointmentsByDateRange(startDateStr, endDateStr)
      
      if (response.success && response.data) {
        // Format appointments for calendar
        const formattedAppointments: CalendarAppointment[] = response.data.map((apt: any) => ({
          id: apt.id,
          date: apt.date,
          time: apt.time || apt.startTime || '',
          patientName: apt.patient?.fullName || apt.patientName || 'Unknown',
          patientInitial: (apt.patient?.fullName || apt.patientName || '?').charAt(0).toUpperCase(),
          reason: apt.reason || apt.notes || '',
          status: apt.status || 'scheduled',
        }))

        setAppointments(formattedAppointments)
      } else {
        setError(response.message || 'Failed to load appointments')
      }
    } catch (err: any) {
      setError(err.message || 'Error loading appointments')
      console.error('Calendar fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    const emptySlots = Array.from({ length: startingDayOfWeek }, (_, i) => null)
    return [...emptySlots, ...days]
  }

  const getAppointmentsForDay = (day: number) => {
    if (!day) return []
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const dayDate = new Date(year, month, day)
    const dateStr = dayDate.toISOString().split('T')[0]

    return appointments.filter((apt) => {
      const aptDate = new Date(apt.date).toISOString().split('T')[0]
      return aptDate === dateStr
    })
  }

  const isToday = (day: number) => {
    if (!day) return false
    const today = new Date()
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  const formatTime = (time: string) => {
    if (!time) return ''
    // Handle both "HH:MM" and "HH:MM AM/PM" formats
    if (time.includes('AM') || time.includes('PM')) {
      return time
    }
    // Convert 24h to 12h format
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-500 text-white'
      case 'pending':
        return 'bg-yellow-500 text-white'
      case 'cancelled':
        return 'bg-red-500 text-white'
      case 'completed':
        return 'bg-blue-500 text-white'
      default:
        return 'bg-primary text-white'
    }
  }

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <DoctorSidebar />
      
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#111418] dark:text-white mb-2">Calendar</h1>
            <p className="text-[#617589] dark:text-gray-400">Manage your appointments and schedule.</p>
          </div>
          <Link
            href="/doctor/appointment-slots"
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center gap-2"
          >
            <span className="material-symbols-outlined">add</span>
            Create Appointment Slots
          </Link>
        </div>

        {/* Calendar View */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          {/* Calendar Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={goToPreviousMonth}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <h2 className="text-xl font-bold text-[#111418] dark:text-white">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <button
                onClick={goToNextMonth}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
              <button
                onClick={goToToday}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
              >
                Today
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('day')}
                className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                  viewMode === 'day'
                    ? 'bg-primary text-white'
                    : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                Day
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                  viewMode === 'week'
                    ? 'bg-primary text-white'
                    : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                  viewMode === 'month'
                    ? 'bg-primary text-white'
                    : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                Month
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-[#617589] dark:text-gray-400">Loading calendar...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-red-600 dark:text-red-400">error</span>
                <div className="flex-1">
                  <p className="text-red-600 dark:text-red-400 font-semibold">Error</p>
                  <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
                <button
                  onClick={fetchAppointmentsForMonth}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Calendar Grid */}
          {!loading && (
            <div className="grid grid-cols-7 gap-2">
              {/* Day Headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className="text-center font-semibold text-[#617589] dark:text-gray-400 py-2"
                >
                  {day}
                </div>
              ))}

              {/* Calendar Days */}
              {getDaysInMonth().map((day, index) => {
                const dayAppointments = getAppointmentsForDay(day || 0)
                const isTodayDate = isToday(day || 0)
                const hasAppointments = dayAppointments.length > 0

                return (
                  <div
                    key={index}
                    className={`min-h-24 p-2 border rounded-lg transition-colors ${
                      isTodayDate
                        ? 'bg-primary/10 border-primary border-2'
                        : hasAppointments
                        ? 'bg-primary/5 border-primary/30 border'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {day && (
                      <>
                        <div
                          className={`text-sm font-semibold mb-1 ${
                            isTodayDate
                              ? 'text-primary'
                              : 'text-[#111418] dark:text-white'
                          }`}
                        >
                          {day}
                        </div>
                        <div className="space-y-1">
                          {dayAppointments.slice(0, 3).map((apt) => (
                            <div
                              key={apt.id}
                              className={`text-xs px-2 py-1 rounded truncate ${getStatusColor(apt.status)}`}
                              title={`${formatTime(apt.time)} - ${apt.patientName}${apt.reason ? `: ${apt.reason}` : ''}`}
                            >
                              {formatTime(apt.time)} - {apt.patientName}
                            </div>
                          ))}
                          {dayAppointments.length > 3 && (
                            <div className="text-xs text-[#617589] dark:text-gray-400 px-2">
                              +{dayAppointments.length - 3} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Legend */}
          {!loading && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-4 items-center">
                <span className="text-sm text-[#617589] dark:text-gray-400 font-semibold">Legend:</span>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm text-[#617589] dark:text-gray-400">Confirmed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="text-sm text-[#617589] dark:text-gray-400">Pending</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm text-[#617589] dark:text-gray-400">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm text-[#617589] dark:text-gray-400">Cancelled</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
