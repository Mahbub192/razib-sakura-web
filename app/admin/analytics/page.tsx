'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api/auth'
import { adminApi, AdminAnalytics } from '@/lib/api/admin'
import AdminSidebar from '@/components/layout/AdminSidebar'

export default function AdminAnalyticsPage() {
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    const currentUser = authApi.getCurrentUser()
    if (!currentUser || currentUser.role !== 'admin') {
      router.push('/auth/login')
      return
    }

    fetchAnalytics()
  }, [router, startDate, endDate])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await adminApi.getAnalytics({
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      })

      if (response.success && response.data) {
        setAnalytics(response.data)
      } else {
        setError('Failed to load analytics')
      }
    } catch (err) {
      setError('Failed to load analytics')
      console.error('Analytics fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <AdminSidebar />
      <div className="ml-64">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <h1 className="text-2xl font-bold text-[#111418] dark:text-white">Analytics & Reports</h1>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Date Range Filter */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#111418] dark:text-white mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-[#111418] dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#111418] dark:text-white mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-[#111418] dark:text-white"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={fetchAnalytics}
                  className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Apply Filter
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-[#617589] dark:text-gray-400">Loading analytics...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <button
                onClick={fetchAnalytics}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : analytics ? (
            <>
              {/* Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <p className="text-sm text-[#617589] dark:text-gray-400 mb-1">Total Users</p>
                  <p className="text-3xl font-bold text-[#111418] dark:text-white">
                    {analytics.overview.totalUsers}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <p className="text-sm text-[#617589] dark:text-gray-400 mb-1">Doctors</p>
                  <p className="text-3xl font-bold text-[#111418] dark:text-white">
                    {analytics.overview.totalDoctors}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <p className="text-sm text-[#617589] dark:text-gray-400 mb-1">Patients</p>
                  <p className="text-3xl font-bold text-[#111418] dark:text-white">
                    {analytics.overview.totalPatients}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <p className="text-sm text-[#617589] dark:text-gray-400 mb-1">Assistants</p>
                  <p className="text-3xl font-bold text-[#111418] dark:text-white">
                    {analytics.overview.totalAssistants}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <p className="text-sm text-[#617589] dark:text-gray-400 mb-1">Appointments</p>
                  <p className="text-3xl font-bold text-[#111418] dark:text-white">
                    {analytics.overview.totalAppointments}
                  </p>
                </div>
              </div>

              {/* Appointments by Status */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
                <h2 className="text-lg font-bold text-[#111418] dark:text-white mb-4">
                  Appointments by Status
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(analytics.appointmentsByStatus).map(([status, count]) => (
                    <div key={status} className="text-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                      <p className="text-2xl font-bold text-[#111418] dark:text-white">{count}</p>
                      <p className="text-sm text-[#617589] dark:text-gray-400 capitalize">{status}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* User Growth */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
                <h2 className="text-lg font-bold text-[#111418] dark:text-white mb-4">User Growth</h2>
                <div className="space-y-2">
                  {analytics.userGrowth.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-[#617589] dark:text-gray-400">{item.month}</span>
                      <div className="flex-1 mx-4">
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{
                              width: `${
                                (item.count /
                                  Math.max(...analytics.userGrowth.map((i) => i.count), 1)) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-[#111418] dark:text-white">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Appointment Trends */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-bold text-[#111418] dark:text-white mb-4">
                  Appointment Trends
                </h2>
                <div className="space-y-2">
                  {analytics.appointmentTrends.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-[#617589] dark:text-gray-400">{item.week}</span>
                      <div className="flex-1 mx-4">
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{
                              width: `${
                                (item.count /
                                  Math.max(...analytics.appointmentTrends.map((i) => i.count), 1)) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-[#111418] dark:text-white">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </main>
      </div>
    </div>
  )
}

