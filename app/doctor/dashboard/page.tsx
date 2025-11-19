'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { DoctorSidebar } from '@/components/layout/DoctorSidebar'
import { doctorApi, DoctorDashboardData } from '@/lib/api/doctors'

export default function DoctorDashboard() {
  const [dashboardData, setDashboardData] = useState<DoctorDashboardData | null>(null)
  const [doctorProfile, setDoctorProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        
        // Fetch dashboard data and profile in parallel
        const [dashboardResponse, profileResponse] = await Promise.all([
          doctorApi.getDashboard(),
          doctorApi.getProfile(),
        ])
        
        if (dashboardResponse.success && dashboardResponse.data) {
          setDashboardData(dashboardResponse.data)
        } else {
          setError(dashboardResponse.message || 'Failed to load dashboard data')
        }
        
        if (profileResponse.success && profileResponse.data) {
          setDoctorProfile(profileResponse.data)
        }
      } catch (err: any) {
        setError(err.message || 'Error loading dashboard data')
        console.error('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const today = new Date()
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' })
  const dateStr = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
        <DoctorSidebar />
        <main className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-[#617589] dark:text-gray-400">Loading dashboard...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error || !dashboardData) {
    return (
      <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
        <DoctorSidebar />
        <main className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Failed to load dashboard'}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <DoctorSidebar />
      
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#111418] dark:text-white mb-2">
              Welcome, {doctorProfile?.fullName ? `Dr. ${doctorProfile.fullName.split(' ')[0]}` : 'Doctor'}!
            </h1>
            <p className="text-[#617589] dark:text-gray-400">
              {dayName}, {dateStr}
            </p>
          </div>
          <Link
            href="/doctor/appointment-slots"
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center gap-2"
          >
            <span className="material-symbols-outlined">add</span>
            Set Appointment Slots
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Today's Appointments */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-[#111418] dark:text-white mb-4">Today's Appointments</h2>
            <div className="space-y-4">
              {dashboardData.todayAppointments.length > 0 ? (
                dashboardData.todayAppointments.map((appointment, index) => {
                  const isHighlighted = index === 1 // Highlight second appointment
                  const statusColor = appointment.status === 'confirmed' ? 'bg-green-500' : 'bg-primary'

                  return (
                    <div
                      key={appointment.id}
                      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm ${
                        isHighlighted
                          ? 'border-2 border-primary'
                          : 'border border-gray-200 dark:border-gray-700'
                      } p-4`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                          <span className="text-primary font-semibold">{appointment.patientInitial}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-[#111418] dark:text-white">
                              {appointment.time} - {appointment.patientName}
                            </p>
                            <span className={`w-2 h-2 ${statusColor} rounded-full`}></span>
                          </div>
                          <p className="text-sm text-[#617589] dark:text-gray-400">{appointment.reason}</p>
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
                  <p className="text-[#617589] dark:text-gray-400">No appointments scheduled for today</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Calendar Widget */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-[#111418] dark:text-white">
                  {today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                <Link
                  href="/doctor/calendar"
                  className="text-xs text-primary hover:underline"
                >
                  View Full
                </Link>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                  <div key={day} className="py-2 text-[#617589] dark:text-gray-400 font-semibold">
                    {day}
                  </div>
                ))}
                {(() => {
                  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay()
                  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
                  const todayDate = today.getDate()
                  
                  // Highlight today's date (since we're showing today's appointments)
                  const hasAppointmentsToday = dashboardData.todayAppointments.length > 0
                  
                  const emptyDays = Array.from({ length: firstDay }, (_, i) => null)
                  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1)
                  
                  return [...emptyDays, ...monthDays].map((day, index) => {
                    if (day === null) {
                      return <div key={`empty-${index}`} className="py-2"></div>
                    }
                    const isToday = day === todayDate
                    
                    return (
                      <div
                        key={day}
                        className={`py-2 rounded ${
                          isToday
                            ? 'bg-primary text-white font-semibold'
                            : 'text-[#111418] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {day}
                      </div>
                    )
                  })
                })()}
              </div>
            </div>

            {/* Patient Detail Card - Show first appointment if available */}
            {dashboardData.todayAppointments.length > 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">
                      {dashboardData.todayAppointments[0].patientInitial}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#111418] dark:text-white">
                      {dashboardData.todayAppointments[0].patientName}
                    </p>
                    <p className="text-xs text-[#617589] dark:text-gray-400">
                      Next: {dashboardData.todayAppointments[0].time}
                    </p>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-xs text-[#617589] dark:text-gray-400 mb-1">Reason</p>
                  <p className="text-sm text-[#111418] dark:text-white">
                    {dashboardData.todayAppointments[0].reason || 'General consultation'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/doctor/patients?patientId=${dashboardData.todayAppointments[0].patient?.id || ''}`}
                    className="flex-1 px-3 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors text-center"
                  >
                    View History
                  </Link>
                  <button className="flex-1 px-3 py-2 bg-primary/10 text-primary text-sm rounded-lg hover:bg-primary/20 transition-colors">
                    Add Note
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <div className="text-center py-4">
                  <span className="material-symbols-outlined text-4xl text-[#617589] dark:text-gray-400 mb-2">
                    person
                  </span>
                  <p className="text-sm text-[#617589] dark:text-gray-400">
                    No appointments today
                  </p>
                </div>
              </div>
            )}

            {/* Tasks for Today */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="font-semibold text-[#111418] dark:text-white mb-3">Tasks for Today</h3>
              <div className="space-y-2">
                {[
                  { task: 'Follow up with Patient X', completed: false },
                  { task: 'Prepare lab reports for Jane Doe', completed: true },
                  { task: 'Review new patient applications', completed: false },
                  { task: 'Order new supplies', completed: false },
                ].map((item, index) => (
                  <label key={index} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      className="w-4 h-4 text-primary rounded focus:ring-primary"
                      readOnly
                    />
                    <span className={`text-sm ${item.completed ? 'line-through text-[#617589] dark:text-gray-400' : 'text-[#111418] dark:text-white'}`}>
                      {item.task}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Quick Add Patient */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="font-semibold text-[#111418] dark:text-white mb-3">Quick Add Patient</h3>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button className="w-full px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors">
                  Add Patient
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments This Week Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-[#111418] dark:text-white mb-4">Appointments This Week</h2>
          <div className="flex items-end gap-4 h-48">
            {dashboardData.weeklyChartData.map((dayData, index) => {
              const maxCount = Math.max(...dashboardData.weeklyChartData.map((d) => d.count), 1)
              const heightPercent = (dayData.count / maxCount) * 100
              const height = Math.max(heightPercent, 5) // Minimum 5% height
              const isMax = dayData.count === maxCount && dayData.count > 0

              return (
                <div key={dayData.day} className="flex-1 flex flex-col items-center">
                  <div
                    className={`w-full rounded-t transition-colors ${
                      isMax
                        ? 'bg-primary'
                        : dayData.count > 0
                        ? 'bg-primary/40'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                    style={{ height: `${height}%` }}
                  ></div>
                  <p
                    className={`mt-2 text-sm font-semibold ${
                      isMax ? 'text-primary' : 'text-[#617589] dark:text-gray-400'
                    }`}
                  >
                    {dayData.day}
                  </p>
                  {dayData.count > 0 && (
                    <p className="text-xs text-[#617589] dark:text-gray-400 mt-1">{dayData.count}</p>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-[#617589] dark:text-gray-400">Total Patients</p>
              <span className="material-symbols-outlined text-primary">people</span>
            </div>
            <p className="text-4xl font-bold text-[#111418] dark:text-white mb-1">
              {dashboardData.statistics.totalPatients.toLocaleString()}
            </p>
            <p className="text-sm text-green-600 dark:text-green-400">
              +{dashboardData.statistics.patientGrowth}% this month
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-[#617589] dark:text-gray-400">Appointments Today</p>
              <span className="material-symbols-outlined text-orange-600 dark:text-orange-400">event</span>
            </div>
            <p className="text-4xl font-bold text-[#111418] dark:text-white mb-1">
              {dashboardData.statistics.appointmentsToday}
            </p>
            <p
              className={`text-sm ${
                dashboardData.statistics.appointmentChangePercent >= 0
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-green-600 dark:text-green-400'
              }`}
            >
              {dashboardData.statistics.appointmentChangePercent >= 0 ? '+' : ''}
              {dashboardData.statistics.appointmentChangePercent}% vs yesterday
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-[#617589] dark:text-gray-400">Total Appointments</p>
              <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">calendar_month</span>
            </div>
            <p className="text-4xl font-bold text-[#111418] dark:text-white mb-1">
              {dashboardData.statistics.totalAppointments.toLocaleString()}
            </p>
            <p className="text-sm text-[#617589] dark:text-gray-400">
              {dashboardData.statistics.completedAppointments} completed
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-[#617589] dark:text-gray-400">Unread Messages</p>
              <span className="material-symbols-outlined text-purple-600 dark:text-purple-400">mail</span>
            </div>
            <p className="text-4xl font-bold text-[#111418] dark:text-white mb-1">
              {dashboardData.statistics.unreadMessages || 0}
            </p>
            <Link
              href="/doctor/communications"
              className="text-sm text-primary hover:underline"
            >
              View messages →
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

