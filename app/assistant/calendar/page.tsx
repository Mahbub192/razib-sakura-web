'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { assistantApi } from '@/lib/api/assistants'

interface Appointment {
  id: string
  time: string
  patientName: string
  type: string
  color: 'blue' | 'green' | 'yellow' | 'red'
  duration: string
  status?: string
}

interface CalendarAppointment {
  id: string
  date: string
  time: string
  patientName: string
  patientInitial: string
  type: string
  reason?: string
  status: string
}

export default function AssistantCalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')
  const [appointments, setAppointments] = useState<CalendarAppointment[]>([])
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  useEffect(() => {
    fetchAppointmentsForMonth()
    fetchTodayAppointments()
  }, [currentMonth])

  const fetchAppointmentsForMonth = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get first and last day of current month
      const year = currentMonth.getFullYear()
      const month = currentMonth.getMonth()
      const startDate = new Date(year, month, 1)
      const endDate = new Date(year, month + 1, 0) // Last day of month

      const startDateStr = startDate.toISOString().split('T')[0]
      const endDateStr = endDate.toISOString().split('T')[0]

      const response = await assistantApi.getAppointmentsByDateRange(startDateStr, endDateStr)

      if (response.success && response.data) {
        // Format appointments for calendar
        const formattedAppointments: CalendarAppointment[] = response.data.map((apt: any) => ({
          id: apt.id,
          date: apt.date,
          time: apt.time || '',
          patientName: apt.patientName || 'Unknown',
          patientInitial: (apt.patientName || '?').charAt(0).toUpperCase(),
          type: apt.type || 'Consultation',
          reason: apt.reason || '',
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

  const fetchTodayAppointments = async () => {
    try {
      const response = await assistantApi.getTodayAppointments()
      if (response.success && response.data) {
        const formatted = response.data.map((apt: any) => ({
          id: apt.id,
          time: apt.time,
          patientName: apt.patientName || 'Unknown',
          type: apt.type || 'Consultation',
          duration: apt.duration || '30 min',
          color: getStatusColor(apt.status),
          status: apt.status,
        }))
        setTodayAppointments(formatted)
      }
    } catch (err) {
      console.error('Failed to load today appointments:', err)
    }
  }

  const getStatusColor = (status?: string): 'blue' | 'green' | 'yellow' | 'red' => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'green'
      case 'pending':
        return 'yellow'
      case 'cancelled':
        return 'red'
      default:
        return 'blue'
    }
  }

  const today = new Date()
  const todayDate = today.getDate()
  const currentMonthNum = currentMonth.getMonth()
  const currentYear = currentMonth.getFullYear()

  // Get days in month
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
      days.push({ day: prevMonthDays - i, isCurrentMonth: false, date: new Date(year, month - 1, prevMonthDays - i) })
    }
    // Current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true, date: new Date(year, month, i) })
    }
    // Next month's days to fill the grid
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ day: i, isCurrentMonth: false, date: new Date(year, month + 1, i) })
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

  const getAppointmentsForDay = (day: number) => {
    if (!day) return []
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const dayDate = new Date(year, month, day)
    const dateStr = dayDate.toISOString().split('T')[0]

    return appointments.filter((apt) => {
      const aptDate = new Date(apt.date).toISOString().split('T')[0]
      return aptDate === dateStr
    })
  }

  const getAppointmentColorClass = (color: Appointment['color']) => {
    const colors = {
      blue: 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300',
      green: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300',
      yellow: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300',
      red: 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300',
    }
    return colors[color]
  }

  const getBorderColorClass = (color: Appointment['color']) => {
    const colors = {
      blue: 'border-primary',
      green: 'border-green-500',
      yellow: 'border-yellow-500',
      red: 'border-red-500',
    }
    return colors[color]
  }

  const days = getDaysInMonth()

  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-200">
      {/* Left Sidebar */}
      <aside className="flex w-64 flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark p-4">
        <div className="flex flex-col gap-4">
          {/* Profile Section */}
          <div className="flex items-center gap-3 px-2">
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-semibold text-lg">A</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-gray-900 dark:text-white text-base font-semibold leading-normal">Assistant</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">Medical Assistant</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2 mt-4">
            <Link
              href="/assistant/dashboard"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <span className="material-symbols-outlined text-2xl">dashboard</span>
              <p className="text-sm font-medium leading-normal">Dashboard</p>
            </Link>
            <Link
              href="/assistant/appointments"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <span className="material-symbols-outlined text-2xl">list_alt</span>
              <p className="text-sm font-medium leading-normal">Appointments</p>
            </Link>
            <Link
              href="/assistant/patients"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <span className="material-symbols-outlined text-2xl">group</span>
              <p className="text-sm font-medium leading-normal">Patients</p>
            </Link>
            <Link
              href="/assistant/calendar"
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary"
            >
              <span className="material-symbols-outlined fill text-2xl">calendar_month</span>
              <p className="text-sm font-semibold leading-normal">Calendar</p>
            </Link>
            <Link
              href="/assistant/reports"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <span className="material-symbols-outlined text-2xl">bar_chart</span>
              <p className="text-sm font-medium leading-normal">Reports</p>
            </Link>
            <Link
              href="/assistant/communications"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <span className="material-symbols-outlined text-2xl">chat</span>
              <p className="text-sm font-medium leading-normal">Communications</p>
            </Link>
            <Link
              href="/assistant/settings"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <span className="material-symbols-outlined text-2xl">settings</span>
              <p className="text-sm font-medium leading-normal">Settings</p>
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 bg-white dark:bg-gray-900">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-gray-900 dark:text-white text-3xl font-bold leading-tight">Calendar</h1>
              <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">
                Manage your appointments and schedule.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center justify-center gap-2 rounded-lg h-11 px-5 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary text-sm font-bold leading-normal hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors">
                <span className="material-symbols-outlined">block</span>
                <span className="truncate">Block Time</span>
              </button>
              <Link
                href="/assistant/appointments/new"
                className="flex items-center justify-center gap-2 rounded-lg h-11 px-5 bg-primary text-white text-sm font-bold leading-normal shadow-sm hover:bg-primary/90 transition-colors"
              >
                <span className="material-symbols-outlined">add</span>
                <span className="truncate">New Appointment</span>
              </Link>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Calendar Controls */}
          <div className="flex flex-wrap justify-between items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {monthNames[currentMonthNum]} {currentYear}
              </h2>
              <button
                onClick={() => setCurrentMonth(new Date())}
                className="px-3 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Today
              </button>
            </div>
            <div className="flex items-center gap-2 rounded-lg p-1 bg-background-light dark:bg-background-dark border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  viewMode === 'month'
                    ? 'bg-white dark:bg-gray-800 text-primary dark:text-primary shadow-sm font-semibold'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50 font-medium'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  viewMode === 'week'
                    ? 'bg-white dark:bg-gray-800 text-primary dark:text-primary shadow-sm font-semibold'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50 font-medium'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode('day')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  viewMode === 'day'
                    ? 'bg-white dark:bg-gray-800 text-primary dark:text-primary shadow-sm font-semibold'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50 font-medium'
                }`}
              >
                Day
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center h-[calc(100vh-270px)]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">Loading calendar...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 text-center text-sm font-semibold text-gray-500 dark:text-gray-400">
                {weekDays.map((day) => (
                  <div key={day}>{day}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 grid-rows-5 gap-2 h-[calc(100vh-270px)]">
                {days.map((dayObj, index) => {
                  const isToday =
                    dayObj.isCurrentMonth &&
                    dayObj.day === todayDate &&
                    currentMonthNum === today.getMonth() &&
                    currentYear === today.getFullYear()
                  const dayAppointments = dayObj.isCurrentMonth ? getAppointmentsForDay(dayObj.day) : []
                  const hasMoreAppointments = dayAppointments.length > 2

                  return (
                    <div
                      key={index}
                      className={`rounded-lg p-2 text-right ${
                        dayObj.isCurrentMonth
                          ? isToday
                            ? 'bg-primary/10 dark:bg-primary/20 border-2 border-primary'
                            : 'bg-background-light dark:bg-background-dark'
                          : 'text-gray-400 dark:text-gray-600'
                      }`}
                    >
                      {isToday ? (
                        <span className="inline-block px-2 py-0.5 rounded-full bg-primary text-white text-xs font-bold mb-1">
                          Today
                        </span>
                      ) : (
                        <span className={`font-semibold ${dayObj.isCurrentMonth ? 'text-gray-800 dark:text-gray-200' : ''}`}>
                          {dayObj.day}
                        </span>
                      )}
                      {dayAppointments.length > 0 && (
                        <div className="mt-1 space-y-1 text-left">
                          {dayAppointments.slice(0, 2).map((appt) => {
                            const color = getStatusColor(appt.status)
                            return (
                              <div
                                key={appt.id}
                                className={`${getAppointmentColorClass(color)} p-1.5 rounded-md text-xs leading-tight`}
                              >
                                <p className="font-semibold">{appt.time}</p>
                                <p className="truncate">{appt.patientName}</p>
                              </div>
                            )
                          })}
                          {hasMoreAppointments && (
                            <div className="text-primary dark:text-primary text-xs font-medium text-center hover:underline cursor-pointer">
                              +{dayAppointments.length - 2} more
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Right Sidebar - Today's Schedule */}
      <aside className="w-96 flex-col border-l border-gray-200 dark:border-gray-800 bg-background-light dark:bg-background-dark p-6 hidden xl:flex overflow-y-auto">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Today's Schedule</h3>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {monthNames[today.getMonth()]} {todayDate}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400">Loading...</p>
            </div>
          ) : todayAppointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No appointments scheduled for today</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todayAppointments.map((appt) => (
                <div key={appt.id} className="flex gap-4">
                  <div className="w-16 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                    <p>{appt.time}</p>
                    <p className="text-xs">{appt.duration}</p>
                  </div>
                  <div
                    className={`flex-1 p-3 rounded-lg bg-white dark:bg-gray-900 border-l-4 ${getBorderColorClass(appt.color)}`}
                  >
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{appt.patientName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{appt.type}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}

