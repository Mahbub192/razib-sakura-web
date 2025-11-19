'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api/auth'
import { apiClient } from '@/lib/api/client'
import AdminSidebar from '@/components/layout/AdminSidebar'

interface DashboardStats {
  totalUsers: number
  totalDoctors: number
  totalPatients: number
  totalAssistants: number
  totalAppointments: number
  pendingAppointments: number
  completedAppointments: number
  todayAppointments: number
  recentUsers: Array<{
    id: string
    name: string
    email: string
    role: string
    createdAt: string
  }>
  recentAppointments: Array<{
    id: string
    patientName: string
    doctorName: string
    date: string
    time: string
    status: string
  }>
}

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const currentUser = authApi.getCurrentUser()
    setUser(currentUser)
    
    if (!currentUser) {
      router.push('/auth/login')
      return
    }

    fetchDashboardData()
  }, [router])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const { adminApi } = await import('@/lib/api/admin')
      const response = await adminApi.getDashboardStats()
      if (response.success && response.data) {
        setStats({
          ...response.data,
          recentUsers: response.data.recentUsers || [],
          recentAppointments: response.data.recentAppointments || [],
        })
      } else {
        setError('Failed to load dashboard data')
      }
    } catch (err) {
      setError('Failed to load dashboard data')
      console.error('Dashboard fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    authApi.logout()
    router.push('/auth/login')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background-light dark:bg-background-dark items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-[#617589] dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="flex min-h-screen bg-background-light dark:bg-background-dark items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Failed to load dashboard'}</p>
          <button
            onClick={fetchDashboardData}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <AdminSidebar />
      <div className="ml-64">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-4xl">
                health_and_safety
              </span>
              <div>
                <h1 className="text-xl font-bold text-[#111418] dark:text-white">Sakura Admin</h1>
                <p className="text-xs text-[#617589] dark:text-gray-400">Healthcare Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-[#111418] dark:text-white">
                  {user?.fullName || 'Admin User'}
                </p>
                <p className="text-xs text-[#617589] dark:text-gray-400">Administrator</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#111418] dark:text-white mb-2">
            Welcome back, {user?.fullName || 'Admin'}! 👋
          </h2>
          <p className="text-[#617589] dark:text-gray-400">
            Here's what's happening with your healthcare system today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-2xl">
                  people
                </span>
              </div>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                +12%
              </span>
            </div>
            <div>
              <p className="text-[#617589] dark:text-gray-400 text-sm font-medium mb-1">
                Total Users
              </p>
              <p className="text-3xl font-bold text-[#111418] dark:text-white">{stats.totalUsers}</p>
              <p className="text-xs text-[#617589] dark:text-gray-400 mt-1">
                All system users
              </p>
            </div>
          </div>

          {/* Total Doctors */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-2xl">
                  medical_services
                </span>
              </div>
              <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                Active
              </span>
            </div>
            <div>
              <p className="text-[#617589] dark:text-gray-400 text-sm font-medium mb-1">
                Doctors
              </p>
              <p className="text-3xl font-bold text-[#111418] dark:text-white">{stats.totalDoctors}</p>
              <p className="text-xs text-[#617589] dark:text-gray-400 mt-1">
                Healthcare providers
              </p>
            </div>
          </div>

          {/* Total Patients */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-purple-600 dark:text-purple-400 text-2xl">
                  person
                </span>
              </div>
              <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded">
                +8%
              </span>
            </div>
            <div>
              <p className="text-[#617589] dark:text-gray-400 text-sm font-medium mb-1">
                Patients
              </p>
              <p className="text-3xl font-bold text-[#111418] dark:text-white">{stats.totalPatients}</p>
              <p className="text-xs text-[#617589] dark:text-gray-400 mt-1">
                Registered patients
              </p>
            </div>
          </div>

          {/* Total Appointments */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-orange-600 dark:text-orange-400 text-2xl">
                  event
                </span>
              </div>
              <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded">
                Today: {stats.todayAppointments}
              </span>
            </div>
            <div>
              <p className="text-[#617589] dark:text-gray-400 text-sm font-medium mb-1">
                Appointments
              </p>
              <p className="text-3xl font-bold text-[#111418] dark:text-white">{stats.totalAppointments}</p>
              <p className="text-xs text-[#617589] dark:text-gray-400 mt-1">
                {stats.pendingAppointments} pending
              </p>
            </div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Assistants */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400 text-2xl">
                  support_agent
                </span>
              </div>
              <div>
                <p className="text-[#617589] dark:text-gray-400 text-sm font-medium">Assistants</p>
                <p className="text-2xl font-bold text-[#111418] dark:text-white">{stats.totalAssistants}</p>
              </div>
            </div>
          </div>

          {/* Completed Appointments */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-2xl">
                  check_circle
                </span>
              </div>
              <div>
                <p className="text-[#617589] dark:text-gray-400 text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold text-[#111418] dark:text-white">{stats.completedAppointments}</p>
              </div>
            </div>
          </div>

          {/* Pending Appointments */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400 text-2xl">
                  pending
                </span>
              </div>
              <div>
                <p className="text-[#617589] dark:text-gray-400 text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold text-[#111418] dark:text-white">{stats.pendingAppointments}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/doctor/dashboard"
                className="flex flex-col items-center gap-3 p-4 bg-primary/5 dark:bg-primary/10 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors border border-primary/20"
              >
                <span className="material-symbols-outlined text-primary text-3xl">
                  medical_services
                </span>
                <span className="text-sm font-semibold text-[#111418] dark:text-white text-center">
                  Doctor Portal
                </span>
              </Link>

              <Link
                href="/patient/dashboard"
                className="flex flex-col items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors border border-purple-200 dark:border-purple-800"
              >
                <span className="material-symbols-outlined text-purple-600 dark:text-purple-400 text-3xl">
                  person
                </span>
                <span className="text-sm font-semibold text-[#111418] dark:text-white text-center">
                  Patient Portal
                </span>
              </Link>

              <Link
                href="/doctor/assistants"
                className="flex flex-col items-center gap-3 p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/20 transition-colors border border-indigo-200 dark:border-indigo-800"
              >
                <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400 text-3xl">
                  support_agent
                </span>
                <span className="text-sm font-semibold text-[#111418] dark:text-white text-center">
                  Assistants
                </span>
              </Link>

              <Link
                href="/doctor/appointment-slots"
                className="flex flex-col items-center gap-3 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/20 transition-colors border border-orange-200 dark:border-orange-800"
              >
                <span className="material-symbols-outlined text-orange-600 dark:text-orange-400 text-3xl">
                  schedule
                </span>
                <span className="text-sm font-semibold text-[#111418] dark:text-white text-center">
                  Appointments
                </span>
              </Link>
            </div>
          </div>

          {/* System Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-4">
              System Overview
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-green-600 dark:text-green-400">
                    check_circle
                  </span>
                  <span className="text-sm font-medium text-[#111418] dark:text-white">System Status</span>
                </div>
                <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                  Operational
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">
                    database
                  </span>
                  <span className="text-sm font-medium text-[#111418] dark:text-white">Database</span>
                </div>
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                  Connected
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-purple-600 dark:text-purple-400">
                    security
                  </span>
                  <span className="text-sm font-medium text-[#111418] dark:text-white">Security</span>
                </div>
                <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded">
                  Active
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-orange-600 dark:text-orange-400">
                    sync
                  </span>
                  <span className="text-sm font-medium text-[#111418] dark:text-white">Last Sync</span>
                </div>
                <span className="text-xs text-[#617589] dark:text-gray-400">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#111418] dark:text-white">
                Recent Users
              </h3>
              <Link
                href="#"
                className="text-sm text-primary hover:underline"
              >
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {stats.recentUsers.length > 0 ? (
                stats.recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#111418] dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-[#617589] dark:text-gray-400">
                        {user.email} • {user.role}
                      </p>
                    </div>
                    <span className="text-xs text-[#617589] dark:text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-[#617589] dark:text-gray-400">
                  <span className="material-symbols-outlined text-4xl mb-2">people</span>
                  <p className="text-sm">No recent users</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Appointments */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#111418] dark:text-white">
                Recent Appointments
              </h3>
              <Link
                href="#"
                className="text-sm text-primary hover:underline"
              >
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {stats.recentAppointments.length > 0 ? (
                stats.recentAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-lg">
                        event
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#111418] dark:text-white">
                        {appointment.patientName}
                      </p>
                      <p className="text-xs text-[#617589] dark:text-gray-400">
                        {appointment.doctorName} • {appointment.date} at {appointment.time}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        appointment.status === 'confirmed'
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                          : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-[#617589] dark:text-gray-400">
                  <span className="material-symbols-outlined text-4xl mb-2">event</span>
                  <p className="text-sm">No recent appointments</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      </div>
    </div>
  )
}
