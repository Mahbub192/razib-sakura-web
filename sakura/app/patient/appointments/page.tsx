'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PatientSidebar } from '@/components/layout/PatientSidebar'
import { patientApi, PatientAppointment } from '@/lib/api/patients'

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState<PatientAppointment[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming')

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true)
        const status = activeTab === 'upcoming' ? 'confirmed' : 'completed'
        const response = await patientApi.getAppointments({ status })
        if (response.success && response.data) {
          setAppointments(response.data)
        }
      } catch (err) {
        console.error('Appointments fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [activeTab])

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

  const handleReschedule = async (appointmentId: string) => {
    // This would open a modal or navigate to reschedule page
    alert('Reschedule functionality coming soon')
  }

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
                        {activeTab === 'upcoming' && (
                          <>
                            <button
                              onClick={() => handleReschedule(appointment.id)}
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
    </div>
  )
}

