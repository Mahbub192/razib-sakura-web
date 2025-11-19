'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PatientSidebar } from '@/components/layout/PatientSidebar'
import { patientApi, PatientDashboardData } from '@/lib/api/patients'

export default function PatientDashboard() {
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<PatientDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const response = await patientApi.getDashboard()
        if (response.success && response.data) {
          setDashboardData(response.data)
        } else {
          setError(response.message || 'Failed to load dashboard data')
        }
      } catch (err) {
        setError('Error loading dashboard data')
        console.error('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
        <PatientSidebar />
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
        <PatientSidebar />
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
      <PatientSidebar />
      
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#111418] dark:text-white mb-2">
            {(() => {
              const hour = new Date().getHours()
              const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
              return `${greeting}, ${dashboardData.patientName || 'Patient'}!`
            })()}
          </h1>
          <p className="text-[#617589] dark:text-gray-400">
            Here's a summary of your patient dashboard.
          </p>
          <div className="mt-4 flex justify-end">
            <Link
              href="/patient/appointments"
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            >
              Book New Appointment
            </Link>
          </div>
        </div>

        {/* Important Notification */}
        {dashboardData.hasNewLabResults && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400">notifications</span>
              <p className="text-yellow-800 dark:text-yellow-200">
                <strong>Important Notification:</strong> Your new lab results are available for review. Please check the Lab Results section.
              </p>
            </div>
            <button className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Upcoming Appointments */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#111418] dark:text-white">Upcoming Appointments</h2>
              <Link href="/patient/appointments" className="text-primary text-sm font-medium hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {dashboardData.upcomingAppointments.length > 0 ? (
                dashboardData.upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-xs font-semibold text-primary">{appointment.month}</p>
                        <p className="text-xl font-bold text-primary">{appointment.day}</p>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#111418] dark:text-white mb-1">
                        {appointment.reason} with {appointment.doctorName}
                      </h3>
                      <p className="text-sm text-[#617589] dark:text-gray-400 mb-3">
                        {appointment.weekday}, {appointment.time}
                      </p>
                      <div className="flex gap-2">
                        <Link
                          href="/patient/appointments"
                          className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => router.push(`/patient/appointments?reschedule=${appointment.id}`)}
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          Reschedule
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-[#617589] dark:text-gray-400">
                  No upcoming appointments
                </div>
              )}
            </div>
          </div>

          {/* Secure Messages */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#111418] dark:text-white">Secure Messages</h2>
              <Link href="/patient/messages" className="text-primary text-sm font-medium hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {dashboardData.secureMessages.length > 0 ? (
                dashboardData.secureMessages.map((message) => (
                  <Link
                    key={message.id}
                    href="/patient/messages"
                    className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold">{message.avatar}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-[#111418] dark:text-white text-sm">{message.name}</p>
                        {message.unread && (
                          <span className="w-2 h-2 bg-primary rounded-full"></span>
                        )}
                      </div>
                      <p className="text-xs text-[#617589] dark:text-gray-400 truncate">{message.snippet}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-4 text-center text-[#617589] dark:text-gray-400 text-sm">
                  No messages
                </div>
              )}
            </div>
            <Link
              href="/patient/messages"
              className="mt-4 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center block"
            >
              New Message
            </Link>
          </div>
        </div>

        {/* Bottom Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Medical Records */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-2xl">folder</span>
              </div>
              <h3 className="text-lg font-bold text-[#111418] dark:text-white">Medical Records</h3>
            </div>
            <p className="text-[#617589] dark:text-gray-400 text-sm mb-4">
              Access your complete medical history, including past diagnoses and treatment plans.
            </p>
            <Link
              href="/patient/medical-records"
              className="flex items-center gap-2 text-primary font-semibold text-sm hover:underline"
            >
              View History
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          {/* Lab Results */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-2xl">science</span>
              </div>
              <h3 className="text-lg font-bold text-[#111418] dark:text-white">Lab Results</h3>
            </div>
            <p className="text-[#617589] dark:text-gray-400 text-sm mb-4">
              Check your latest lab results as soon as they are available from the clinic.
            </p>
            <Link
              href="/patient/lab-results"
              className="flex items-center gap-2 text-primary font-semibold text-sm hover:underline"
            >
              View Results
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          {/* Prescription Refills */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-2xl">medication</span>
              </div>
              <h3 className="text-lg font-bold text-[#111418] dark:text-white">Prescription Refills</h3>
            </div>
            <p className="text-[#617589] dark:text-gray-400 text-sm mb-4">
              Request refills for your current prescriptions quickly and easily.
            </p>
            <Link
              href="/patient/prescriptions"
              className="flex items-center gap-2 text-primary font-semibold text-sm hover:underline"
            >
              Request a Refill
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

