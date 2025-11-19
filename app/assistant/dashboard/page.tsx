'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { assistantApi, AssistantDashboardData } from '@/lib/api/assistants'

export default function AssistantDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dashboardData, setDashboardData] = useState<AssistantDashboardData | null>(null)
  const [tasks, setTasks] = useState<Array<{ id: number; text: string; completed: boolean }>>([])

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await assistantApi.getDashboard()
      if (response.success && response.data) {
        setDashboardData(response.data)
        setTasks(response.data.tasks || [])
      } else {
        setError(response.message || 'Failed to load dashboard data')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleTaskToggle = (id: number) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
    // TODO: Update task in backend
  }

  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement add patient logic
    console.log('Adding patient:', { name: '', email: '' })
  }

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  if (loading) {
    return (
      <div className="flex h-screen w-full bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-200">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen w-full bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-200">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchDashboard}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  const profile = dashboardData?.profile
  const stats = dashboardData?.statistics
  const todayAppointments = dashboardData?.todayAppointments || []
  const weeklyChart = dashboardData?.weeklyChart || []

  // Calculate max count for chart scaling
  const maxCount = Math.max(...weeklyChart.map((item) => item.count), 1)

  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-200">
      {/* Left Sidebar */}
      <aside className="flex w-64 flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark p-4">
        <div className="flex flex-col gap-4">
          {/* Profile Section */}
          <div className="flex items-center gap-3 px-2">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{
                backgroundImage: profile?.avatar
                  ? `url("${profile.avatar}")`
                  : undefined,
                backgroundColor: profile?.avatar ? undefined : '#e0e7ff',
              }}
            >
              {!profile?.avatar && (
                <span className="flex items-center justify-center h-full w-full text-primary font-semibold text-lg">
                  {profile?.fullName?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <h1 className="text-gray-900 dark:text-white text-base font-semibold leading-normal">
                {profile?.fullName || 'Assistant'}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">Medical Assistant</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2 mt-4">
            <Link
              href="/assistant/dashboard"
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary"
            >
              <span className="material-symbols-outlined fill text-2xl">dashboard</span>
              <p className="text-sm font-semibold leading-normal">Dashboard</p>
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
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <span className="material-symbols-outlined text-2xl">calendar_month</span>
              <p className="text-sm font-medium leading-normal">Calendar</p>
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

        {/* Stats Cards */}
        <div className="mt-auto flex flex-col gap-4">
          <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-4 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-normal">Appointments Today</p>
            <p className="text-gray-900 dark:text-white tracking-light text-3xl font-bold leading-tight">
              {stats?.appointmentsToday || 0}
            </p>
            <p
              className={`text-sm font-medium leading-normal ${
                (stats?.appointmentsChange || 0) >= 0
                  ? 'text-green-600 dark:text-green-500'
                  : 'text-red-600 dark:text-red-500'
              }`}
            >
              {stats?.appointmentsChange ? (
                <>
                  {stats.appointmentsChange >= 0 ? '+' : ''}
                  {stats.appointmentsChange.toFixed(1)}% from yesterday
                </>
              ) : (
                'No change'
              )}
            </p>
          </div>
          <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-4 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-normal">Tasks Completed</p>
            <p className="text-gray-900 dark:text-white tracking-light text-3xl font-bold leading-tight">
              {stats?.tasksCompleted || 0}/{stats?.tasksTotal || 0}
            </p>
            <p className="text-blue-600 dark:text-blue-500 text-sm font-medium leading-normal">
              {stats?.tasksPercentage || 0}% done
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-6 sm:gap-8">
          {/* Header */}
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-gray-900 dark:text-white text-2xl sm:text-3xl font-bold leading-tight">
                Welcome, {profile?.fullName?.split(' ')[0] || 'Assistant'}!
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base font-normal leading-normal">
                {currentDate}
              </p>
            </div>
            <button className="flex items-center justify-center gap-2 rounded-lg h-10 sm:h-11 px-4 sm:px-5 bg-primary text-white text-sm font-bold leading-normal shadow-sm hover:bg-primary/90 transition-colors w-full sm:w-auto">
              <span className="material-symbols-outlined text-lg sm:text-xl">add</span>
              <span className="truncate">Add New Task</span>
            </button>
          </div>

          {/* Today's Appointments */}
          <div className="flex flex-col gap-4">
            <h2 className="text-gray-900 dark:text-white text-lg sm:text-xl font-bold leading-tight">
              Today's Appointments
            </h2>
            {todayAppointments.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {todayAppointments.slice(0, 6).map((apt) => {
                  const statusColor =
                    apt.status === 'completed'
                      ? 'bg-green-500'
                      : apt.status === 'confirmed'
                        ? 'bg-blue-500'
                        : apt.status === 'pending'
                          ? 'bg-teal-500'
                          : 'bg-gray-500'
                  const statusPulse = apt.status === 'confirmed' ? 'animate-pulse' : ''

                  return (
                    <div
                      key={apt.id}
                      className="flex items-center gap-4 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow"
                    >
                      <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12 flex items-center justify-center"
                        style={{
                          backgroundImage: apt.patient?.avatar ? `url("${apt.patient.avatar}")` : undefined,
                          backgroundColor: apt.patient?.avatar ? undefined : '#e0e7ff',
                        }}
                      >
                        {!apt.patient?.avatar && (
                          <span className="text-primary font-semibold text-lg">
                            {apt.patientInitial || apt.patientName?.charAt(0) || 'P'}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col justify-center flex-1">
                        <p className="text-gray-900 dark:text-white text-base font-semibold leading-normal">
                          {apt.time} - {apt.patientName}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">
                          {apt.reason}
                        </p>
                      </div>
                      <div className="shrink-0">
                        <div className="flex size-7 items-center justify-center">
                          <div className={`size-3 rounded-full ${statusColor} ${statusPulse}`} title={apt.status}></div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-900 p-8 rounded-xl border border-gray-200 dark:border-gray-800 text-center">
                <p className="text-gray-500 dark:text-gray-400">No appointments scheduled for today</p>
              </div>
            )}
          </div>

          {/* Charts and Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Data Visualization */}
            <div className="lg:col-span-2 flex flex-col gap-4 bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-800">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                Appointments This Week
              </h3>
              <div className="w-full h-48 sm:h-64 flex items-end gap-2 sm:gap-3 md:gap-4 lg:gap-6 px-2 overflow-x-auto">
                {weeklyChart.map((item, index) => {
                  const height = maxCount > 0 ? `${(item.count / maxCount) * 100}%` : '10%'
                  const isToday = index === new Date().getDay() - 1
                  return (
                    <div key={item.day} className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
                      <div
                        className={`w-full rounded-lg ${
                          isToday ? 'bg-primary' : item.count > 0 ? 'bg-primary/20 dark:bg-primary/30' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                        style={{ height }}
                      ></div>
                      <p className={`text-xs ${isToday ? 'font-bold text-primary' : 'text-gray-500 dark:text-gray-400'}`}>
                        {item.day}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Tasks */}
            <div className="flex flex-col gap-4 bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-800">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Tasks for Today</h3>
              <div className="flex flex-col gap-3">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleTaskToggle(task.id)}
                      className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary/50 dark:bg-gray-700 dark:border-gray-600"
                      id={`task${task.id}`}
                    />
                    <label
                      htmlFor={`task${task.id}`}
                      className={`text-sm text-gray-700 dark:text-gray-300 ${task.completed ? 'line-through' : ''}`}
                    >
                      {task.text}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="w-80 flex-col border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 hidden xl:flex">
        <div className="flex flex-col gap-6">
          {/* Mini Calendar */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <div className="flex items-center gap-2">
                <button className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">
                  <span className="material-symbols-outlined text-xl">chevron_left</span>
                </button>
                <button className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">
                  <span className="material-symbols-outlined text-xl">chevron_right</span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 text-center text-xs text-gray-500 dark:text-gray-400">
              <span className="py-2">Su</span>
              <span className="py-2">Mo</span>
              <span className="py-2">Tu</span>
              <span className="py-2">We</span>
              <span className="py-2">Th</span>
              <span className="py-2">Fr</span>
              <span className="py-2">Sa</span>
            </div>
            <div className="grid grid-cols-7 text-center text-sm">
              {Array.from({ length: 35 }, (_, i) => {
                const date = new Date()
                date.setDate(1)
                const firstDay = date.getDay()
                const day = i - firstDay + 1
                const isToday = day === new Date().getDate()
                const isValid = day > 0 && day <= new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()

                return (
                  <span
                    key={i}
                    className={`py-2 ${isValid ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'} ${
                      isToday ? 'relative' : ''
                    }`}
                  >
                    {isValid ? (
                      isToday ? (
                        <span className="absolute inset-0 flex items-center justify-center size-8 mx-auto bg-primary text-white rounded-full">
                          {day}
                        </span>
                      ) : (
                        day
                      )
                    ) : (
                      ''
                    )}
                  </span>
                )
              })}
            </div>
          </div>

          {/* Selected Patient Profile */}
          {todayAppointments.length > 0 && todayAppointments[0]?.patient && (
            <div className="flex flex-col gap-4 p-4 rounded-xl bg-background-light dark:bg-background-dark">
              <div className="flex items-center gap-4">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-16 flex items-center justify-center"
                  style={{
                    backgroundImage: todayAppointments[0].patient?.avatar
                      ? `url("${todayAppointments[0].patient.avatar}")`
                      : undefined,
                    backgroundColor: todayAppointments[0].patient?.avatar ? undefined : '#e0e7ff',
                  }}
                >
                  {!todayAppointments[0].patient?.avatar && (
                    <span className="text-primary font-semibold text-xl">
                      {todayAppointments[0].patientName?.charAt(0) || 'P'}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                    {todayAppointments[0].patientName}
                  </h4>
                  {todayAppointments[0].patient?.dateOfBirth && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      DOB: {new Date(todayAppointments[0].patient.dateOfBirth).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-bold hover:bg-gray-300 dark:hover:bg-gray-600">
                  View History
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary/20 dark:bg-primary/30 text-primary dark:text-primary text-sm font-bold hover:bg-primary/30 dark:hover:bg-primary/40">
                  Add Note
                </button>
              </div>
            </div>
          )}

          {/* Quick Add Patient */}
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Quick Add Patient</h3>
            <form onSubmit={handleQuickAddSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:border-primary focus:ring-primary/50 px-3 py-2"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:border-primary focus:ring-primary/50 px-3 py-2"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold shadow-sm hover:bg-primary/90"
              >
                Add Patient
              </button>
            </form>
          </div>
        </div>
      </aside>
    </div>
  )
}
