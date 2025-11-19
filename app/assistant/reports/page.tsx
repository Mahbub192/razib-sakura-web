'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { assistantApi } from '@/lib/api/assistants'

export default function AssistantReportsPage() {
  const [reportsData, setReportsData] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('month')

  useEffect(() => {
    // Set default date range (last month)
    const end = new Date()
    const start = new Date()
    start.setMonth(start.getMonth() - 1)

    setStartDate(start.toISOString().split('T')[0])
    setEndDate(end.toISOString().split('T')[0])

    fetchReports(start.toISOString().split('T')[0], end.toISOString().split('T')[0])
  }, [])

  const fetchReports = async (start?: string, end?: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await assistantApi.getReports({
        startDate: start || startDate,
        endDate: end || endDate,
      })

      if (response.success && response.data) {
        setReportsData(response.data)
      } else {
        setError(response.message || 'Failed to load reports')
      }
    } catch (err: any) {
      setError(err.message || 'Error loading reports')
      console.error('Reports fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleApplyFilters = () => {
    if (startDate && endDate) {
      fetchReports(startDate, endDate)
    }
  }

  const formatDateRange = (start: string, end: string) => {
    const startDateObj = new Date(start)
    const endDateObj = new Date(end)
    return `${startDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${endDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const handleExportReports = (format: 'pdf' | 'excel') => {
    if (!reportsData) return
    
    const metrics = [
      { label: 'Total Appointments', value: reportsData.totalAppointments },
      { label: 'Completed', value: reportsData.completedAppointments },
      { label: 'Pending', value: reportsData.pendingAppointments },
      { label: 'Cancelled', value: reportsData.cancelledAppointments },
    ]

    const demographics = reportsData.patientDemographics
      ? Object.entries(reportsData.patientDemographics).map(([category, count]) => ({
          category,
          count: count as number,
          percentage: reportsData.totalPatients > 0 
            ? Math.round(((count as number) / reportsData.totalPatients) * 100) 
            : 0,
        }))
      : []

    exportUtils.exportReports(
      {
        title: 'Assistant Reports',
        metrics,
        demographics,
        dateRange: formatDateRange(startDate, endDate),
      },
      format
    )
  }

  if (loading) {
    return (
      <div className="flex h-screen w-full bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-200">
        <aside className="flex w-64 flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark p-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 px-2">
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-semibold text-lg">A</span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-gray-900 dark:text-white text-base font-semibold leading-normal">Assistant</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">Medical Assistant</p>
              </div>
            </div>
          </div>
        </aside>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading reports...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen w-full bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-200">
        <aside className="flex w-64 flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark p-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 px-2">
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-semibold text-lg">A</span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-gray-900 dark:text-white text-base font-semibold leading-normal">Assistant</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">Medical Assistant</p>
              </div>
            </div>
          </div>
        </aside>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={() => fetchReports(startDate, endDate)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    )
  }

  const metrics = reportsData?.keyMetrics || {}
  const demographics = reportsData?.patientDemographics || { '0-18': 0, '19-45': 0, '46+': 0 }

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
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <span className="material-symbols-outlined text-2xl">calendar_month</span>
              <p className="text-sm font-medium leading-normal">Calendar</p>
            </Link>
            <Link
              href="/assistant/reports"
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary"
            >
              <span className="material-symbols-outlined fill text-2xl">bar_chart</span>
              <p className="text-sm font-semibold leading-normal">Reports</p>
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
      <main className="flex-1 overflow-y-auto p-8">
        <div className="flex flex-col gap-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-gray-900 dark:text-white text-3xl font-bold leading-tight">Analytics & Reports</h1>
              <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">
                View key metrics and generate reports.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleExportReports('pdf')}
                className="flex items-center justify-center gap-2 rounded-lg h-11 px-4 bg-red-600 text-white text-sm font-bold leading-normal shadow-sm hover:bg-red-700 transition-colors"
              >
                <span className="material-symbols-outlined">picture_as_pdf</span>
                <span className="truncate">PDF</span>
              </button>
            <button
                onClick={() => handleExportReports('excel')}
                className="flex items-center justify-center gap-2 rounded-lg h-11 px-4 bg-green-600 text-white text-sm font-bold leading-normal shadow-sm hover:bg-green-700 transition-colors"
            >
                <span className="material-symbols-outlined">table_chart</span>
                <span className="truncate">Excel</span>
            </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="start-date">
                Start Date
              </label>
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-background-light dark:bg-gray-800 text-sm focus:border-primary focus:ring-primary/50 px-3 py-2 dark:text-white"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="end-date">
                End Date
              </label>
              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-background-light dark:bg-gray-800 text-sm focus:border-primary focus:ring-primary/50 px-3 py-2 dark:text-white"
              />
            </div>
            <div className="self-end">
              <button
                onClick={handleApplyFilters}
                className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-bold leading-normal hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col gap-2 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Appointments</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.totalAppointments || 0}</p>
              <p
                className={`text-sm font-medium flex items-center gap-1 ${
                  (metrics.totalChange || 0) >= 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {(metrics.totalChange || 0) >= 0 ? 'arrow_upward' : 'arrow_downward'}
                </span>
                <span>
                  {Math.abs(metrics.totalChange || 0)}% vs last month
                </span>
              </p>
            </div>
            <div className="flex flex-col gap-2 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.completed || 0}</p>
              <p className="text-sm font-medium text-green-500">
                {metrics.completionRate || 0}% Completion Rate
              </p>
            </div>
            <div className="flex flex-col gap-2 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Missed / Canceled</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.missedCancelled || 0}</p>
              <p
                className={`text-sm font-medium flex items-center gap-1 ${
                  (metrics.missedCancelledChangePercent || 0) >= 0 ? 'text-red-500' : 'text-green-500'
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {(metrics.missedCancelledChangePercent || 0) >= 0 ? 'arrow_upward' : 'arrow_downward'}
                </span>
                <span>
                  {Math.abs(metrics.missedCancelledChangePercent || 0)}% vs last month
                </span>
              </p>
            </div>
            <div className="flex flex-col gap-2 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Revenue (est.)</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(metrics.revenue || 0)}
              </p>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Avg. {formatCurrency(metrics.avgRevenuePerAppointment || 0)} / appointment
              </p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Appointment Volume Chart */}
            <div className="lg:col-span-3 flex flex-col gap-4 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Appointment Volume</h3>
                <div className="flex items-center gap-2 rounded-lg bg-gray-100 dark:bg-gray-800 p-1 text-sm">
                  <button
                    onClick={() => setTimeRange('day')}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      timeRange === 'day'
                        ? 'bg-white dark:bg-gray-700 text-primary shadow-sm font-semibold'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    Day
                  </button>
                  <button
                    onClick={() => setTimeRange('week')}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      timeRange === 'week'
                        ? 'bg-white dark:bg-gray-700 text-primary shadow-sm font-semibold'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    Week
                  </button>
                  <button
                    onClick={() => setTimeRange('month')}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      timeRange === 'month'
                        ? 'bg-white dark:bg-gray-700 text-primary shadow-sm font-semibold'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    Month
                  </button>
                </div>
              </div>
              <div className="w-full h-80 flex items-center justify-center text-gray-400 dark:text-gray-500 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                <p className="text-center">
                  Chart data for appointments per {timeRange} would be displayed here.
                  {reportsData?.appointmentVolume && (
                    <span className="block mt-2 text-xs">
                      {Object.keys(reportsData.appointmentVolume).length} days of data available
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Patient Demographics Chart */}
            <div className="lg:col-span-2 flex flex-col gap-4 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Patient Demographics</h3>
              <div className="w-full h-80 flex flex-col items-center justify-center gap-4 text-gray-400 dark:text-gray-500">
                <p className="text-center">Patient age distribution</p>
                <div className="flex flex-col items-center gap-2 w-full mt-4">
                  <div className="flex items-center justify-between w-full text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Age 0-18</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      {demographics['0-18']?.toFixed(1) || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-400 h-2 rounded-full"
                      style={{ width: `${demographics['0-18'] || 0}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between w-full text-sm mt-2">
                    <span className="text-gray-500 dark:text-gray-400">Age 19-45</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      {demographics['19-45']?.toFixed(1) || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${demographics['19-45'] || 0}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between w-full text-sm mt-2">
                    <span className="text-gray-500 dark:text-gray-400">Age 46+</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      {demographics['46+']?.toFixed(1) || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-teal-400 h-2 rounded-full"
                      style={{ width: `${demographics['46+'] || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Appointments by Status and Type */}
          {reportsData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Appointments by Status */}
              <div className="flex flex-col gap-4 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Appointments by Status</h3>
                <div className="space-y-3">
                  {Object.entries(reportsData.appointmentsByStatus || {}).map(([status, count]: [string, any]) => (
                    <div key={status} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{status}</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Appointments by Type */}
              <div className="flex flex-col gap-4 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Appointments by Type</h3>
                <div className="space-y-3">
                  {Object.entries(reportsData.appointmentsByType || {}).map(([type, count]: [string, any]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{type}</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
