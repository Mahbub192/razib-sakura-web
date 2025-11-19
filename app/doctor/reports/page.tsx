'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { DoctorSidebar } from '@/components/layout/DoctorSidebar'
import { doctorApi, DoctorReportsData } from '@/lib/api/doctors'
import { exportUtils } from '@/lib/utils/export'

export default function DoctorReports() {
  const [reportsData, setReportsData] = useState<DoctorReportsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')

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
      
      const response = await doctorApi.getReports({
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
    const startDate = new Date(start)
    const endDate = new Date(end)
    return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const handleExport = (format: 'pdf' | 'excel') => {
    if (!reportsData) return

    // Calculate demographics for export
    const totalPatients = Object.values(reportsData.patientDemographics || {}).reduce((sum: number, count: any) => sum + count, 0)
    const demographicsData = Object.entries(reportsData.patientDemographics || {}).map(([category, count]) => ({
      category,
      count: count as number,
      percentage: totalPatients > 0 ? Math.round(((count as number) / totalPatients) * 100) : 0,
    }))

    const metrics = [
      { label: 'Total Appointments', value: reportsData.totalAppointments },
      { label: 'Completed', value: reportsData.completedAppointments },
      { label: 'Pending', value: reportsData.pendingAppointments },
      { label: 'Cancelled', value: reportsData.cancelledAppointments },
      { label: 'Total Revenue', value: formatCurrency(reportsData.totalRevenue || 0) },
      { label: 'Average Appointment Duration', value: `${reportsData.averageDuration || 0} minutes` },
    ]

    const appointments = reportsData.appointmentsByStatus?.flatMap((statusGroup) =>
      statusGroup.appointments?.map((apt: any) => ({
        date: apt.date || '',
        patient: apt.patientName || 'Unknown',
        type: apt.type || 'Consultation',
        status: apt.status || 'Pending',
      })) || []
    ) || []

    exportUtils.exportReports(
      {
        title: 'Doctor Reports',
        metrics,
        appointments: appointments.slice(0, 50), // Limit to 50 for export
        demographics: demographicsData,
        dateRange: formatDateRange(startDate, endDate),
      },
      format
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
        <DoctorSidebar />
        <main className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-[#617589] dark:text-gray-400">Loading reports...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
        <DoctorSidebar />
        <main className="flex-1 p-6 flex items-center justify-center">
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

  if (!reportsData) {
    return null
  }

  // Calculate patient demographics percentages
  const totalPatients = Object.values(reportsData.patientDemographics).reduce((sum, count) => sum + count, 0)
  const demographics = [
    {
      age: 'Age 0-18',
      count: reportsData.patientDemographics['0-18'] || 0,
      percentage: totalPatients > 0 ? Math.round(((reportsData.patientDemographics['0-18'] || 0) / totalPatients) * 100) : 0,
      color: 'bg-primary',
    },
    {
      age: 'Age 19-45',
      count: reportsData.patientDemographics['19-45'] || 0,
      percentage: totalPatients > 0 ? Math.round(((reportsData.patientDemographics['19-45'] || 0) / totalPatients) * 100) : 0,
      color: 'bg-primary',
    },
    {
      age: 'Age 46+',
      count: reportsData.patientDemographics['46+'] || 0,
      percentage: totalPatients > 0 ? Math.round(((reportsData.patientDemographics['46+'] || 0) / totalPatients) * 100) : 0,
      color: 'bg-green-500',
    },
  ]

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <DoctorSidebar />
      
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#111418] dark:text-white mb-2">Analytics & Reports</h1>
            <p className="text-[#617589] dark:text-gray-400">View key metrics and generate reports.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleExport('pdf')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center gap-2 text-sm"
            >
              <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
              Export PDF
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center gap-2 text-sm"
            >
              <span className="material-symbols-outlined text-lg">table_chart</span>
              Export Excel
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleApplyFilters}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Date Range Display */}
        {reportsData.period && (
          <div className="mb-6 text-sm text-[#617589] dark:text-gray-400">
            Showing data for: {formatDateRange(reportsData.period.start, reportsData.period.end)}
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <p className="text-sm text-[#617589] dark:text-gray-400 mb-2">Total Appointments</p>
            <p className="text-3xl font-bold text-[#111418] dark:text-white mb-1">
              {reportsData.keyMetrics.totalAppointments.toLocaleString()}
            </p>
            <p
              className={`text-sm flex items-center gap-1 ${
                reportsData.keyMetrics.appointmentChangePercent >= 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              <span className="material-symbols-outlined text-sm">
                {reportsData.keyMetrics.appointmentChangePercent >= 0 ? 'trending_up' : 'trending_down'}
              </span>
              {Math.abs(reportsData.keyMetrics.appointmentChangePercent)}% vs last period
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <p className="text-sm text-[#617589] dark:text-gray-400 mb-2">Completed</p>
            <p className="text-3xl font-bold text-[#111418] dark:text-white mb-1">
              {reportsData.keyMetrics.completed.toLocaleString()}
            </p>
            <p className="text-sm text-green-600 dark:text-green-400">
              {reportsData.keyMetrics.completionRate.toFixed(1)}% Completion Rate
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <p className="text-sm text-[#617589] dark:text-gray-400 mb-2">Missed / Canceled</p>
            <p className="text-3xl font-bold text-[#111418] dark:text-white mb-1">
              {reportsData.keyMetrics.missedCancelled.toLocaleString()}
            </p>
            <p className="text-sm text-red-600 dark:text-red-400">
              {reportsData.keyMetrics.totalAppointments > 0
                ? (
                    ((reportsData.keyMetrics.missedCancelled / reportsData.keyMetrics.totalAppointments) * 100).toFixed(1)
                  ) + '% of total'
                : '0%'}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <p className="text-sm text-[#617589] dark:text-gray-400 mb-2">Revenue (est.)</p>
            <p className="text-3xl font-bold text-[#111418] dark:text-white mb-1">
              {formatCurrency(reportsData.keyMetrics.revenue)}
            </p>
            <p className="text-sm text-[#617589] dark:text-gray-400">
              Avg. {formatCurrency(reportsData.keyMetrics.avgRevenuePerAppointment)} / appointment
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Appointment Volume */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#111418] dark:text-white">Appointment Volume</h2>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                  Day
                </button>
                <button className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                  Week
                </button>
                <button className="px-3 py-1 text-sm bg-primary text-white rounded">Month</button>
              </div>
            </div>
            <div className="h-64 flex items-center justify-center text-[#617589] dark:text-gray-400">
              {Object.keys(reportsData.appointmentsByDate).length > 0 ? (
                <div className="w-full">
                  <p className="text-center mb-4">Appointments by Date</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {Object.entries(reportsData.appointmentsByDate)
                      .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
                      .map(([date, count]) => (
                        <div key={date} className="flex items-center justify-between text-sm">
                          <span className="text-[#111418] dark:text-white">
                            {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          <span className="text-[#617589] dark:text-gray-400">{count} appointments</span>
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <p>No appointment data available for this period.</p>
              )}
            </div>
          </div>

          {/* Patient Demographics */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-[#111418] dark:text-white mb-4">Patient Demographics</h2>
            {totalPatients > 0 ? (
              <div className="space-y-3">
                {demographics.map((demo) => (
                  <div key={demo.age}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[#111418] dark:text-white">{demo.age}</span>
                      <span className="text-[#617589] dark:text-gray-400">
                        {demo.count} patients ({demo.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`${demo.color} h-2 rounded-full transition-all`}
                        style={{ width: `${demo.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-[#617589] dark:text-gray-400">
                <p>No patient demographic data available.</p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Appointments by Status */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-[#111418] dark:text-white mb-4">Appointments by Status</h2>
            <div className="space-y-3">
              {Object.entries(reportsData.appointmentsByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-[#111418] dark:text-white capitalize">{status}</span>
                  <span className="text-[#617589] dark:text-gray-400 font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Appointments by Type */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-[#111418] dark:text-white mb-4">Appointments by Type</h2>
            <div className="space-y-3">
              {Object.entries(reportsData.appointmentsByType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-[#111418] dark:text-white capitalize">{type || 'Not specified'}</span>
                  <span className="text-[#617589] dark:text-gray-400 font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
