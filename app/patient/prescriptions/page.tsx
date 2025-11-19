'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PatientSidebar } from '@/components/layout/PatientSidebar'
import { patientApi, Prescription } from '@/lib/api/patients'

const statusColors: Record<string, { bg: string; text: string }> = {
  active: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-400',
  },
  completed: {
    bg: 'bg-gray-100 dark:bg-gray-700',
    text: 'text-[#617589] dark:text-gray-400',
  },
  cancelled: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-400',
  },
  refill_requested: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    text: 'text-yellow-700 dark:text-yellow-400',
  },
}

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refilling, setRefilling] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    fetchPrescriptions()
  }, [])

  const fetchPrescriptions = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await patientApi.getPrescriptions()
      if (response.success && response.data) {
        setPrescriptions(response.data)
      } else {
        setError(response.message || 'Failed to load prescriptions')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load prescriptions')
      console.error('Prescriptions fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRequestRefill = async (prescriptionId: string) => {
    if (!confirm('Are you sure you want to request a refill for this prescription?')) {
      return
    }

    try {
      setRefilling(prescriptionId)
      setError(null)
      setSuccess(null)
      const response = await patientApi.requestPrescriptionRefill(prescriptionId)
      if (response.success) {
        setSuccess('Refill request submitted successfully!')
        setTimeout(() => setSuccess(null), 3000)
        // Refresh prescriptions
        await fetchPrescriptions()
      } else {
        setError(response.message || 'Failed to request refill')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to request refill')
    } finally {
      setRefilling(null)
    }
  }

  const activePrescriptions = prescriptions.filter((p) => p.status === 'active')
  const pastPrescriptions = prescriptions.filter((p) => p.status !== 'active')

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
        <PatientSidebar />
        <main className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-[#617589] dark:text-gray-400">Loading prescriptions...</p>
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#111418] dark:text-white mb-2">Your Prescriptions</h1>
          <p className="text-[#617589] dark:text-gray-400">View and manage your current and past medications.</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-green-600 dark:text-green-400 text-sm">{success}</p>
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Active Prescriptions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-[#111418] dark:text-white mb-4">
            Active Prescriptions ({activePrescriptions.length})
          </h2>
          {activePrescriptions.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
              <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-600 mb-4">
                medication
              </span>
              <p className="text-[#617589] dark:text-gray-400 text-lg mb-2">No active prescriptions</p>
              <p className="text-[#617589] dark:text-gray-400 text-sm">
                You don't have any active prescriptions at the moment.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activePrescriptions.map((prescription) => {
                const statusKey = prescription.status?.toLowerCase() || 'active'
                const colors = statusColors[statusKey] || statusColors.active

                return (
                  <div
                    key={prescription.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-2">
                          {prescription.medicationName}
                        </h3>
                        <p className="text-[#617589] dark:text-gray-400 mb-1">
                          {prescription.dosage}
                          {prescription.frequency && `, ${prescription.frequency}`}
                          {prescription.duration && ` for ${prescription.duration}`}
                        </p>
                        {prescription.instructions && (
                          <p className="text-sm text-[#617589] dark:text-gray-400 mb-2">
                            Instructions: {prescription.instructions}
                          </p>
                        )}
                        <p className="text-sm text-[#617589] dark:text-gray-400 mb-3">
                          Prescribed by: {prescription.doctorName}
                          {prescription.doctorSpecialty && ` (${prescription.doctorSpecialty})`}
                        </p>
                        <p className="text-sm text-[#617589] dark:text-gray-400 mb-3">
                          Prescribed on: {prescription.formattedDate}
                        </p>
                        <div className="flex items-center gap-4">
                          {prescription.hasRefills ? (
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-sm">
                                check_circle
                              </span>
                              <span className="text-sm text-[#617589] dark:text-gray-400">
                                {prescription.refillsRemaining} refill{prescription.refillsRemaining !== 1 ? 's' : ''}{' '}
                                available
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-sm">
                                cancel
                              </span>
                              <span className="text-sm text-[#617589] dark:text-gray-400">No refills remaining</span>
                            </div>
                          )}
                          {prescription.status === 'refill_requested' && (
                            <span
                              className={`px-3 py-1 ${colors.bg} ${colors.text} text-xs font-semibold rounded-full`}
                            >
                              Refill Requested
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <button className="text-[#617589] dark:text-gray-400 hover:text-primary transition-colors">
                          <span className="material-symbols-outlined">info</span>
                        </button>
                        {prescription.hasRefills && prescription.status !== 'refill_requested' && (
                          <button
                            onClick={() => handleRequestRefill(prescription.id)}
                            disabled={refilling === prescription.id}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {refilling === prescription.id ? 'Requesting...' : 'Request Refill'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Past Prescriptions */}
        <div>
          <h2 className="text-xl font-bold text-[#111418] dark:text-white mb-4">
            Past Prescriptions ({pastPrescriptions.length})
          </h2>
          {pastPrescriptions.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
              <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-600 mb-4">
                history
              </span>
              <p className="text-[#617589] dark:text-gray-400 text-lg mb-2">No past prescriptions</p>
              <p className="text-[#617589] dark:text-gray-400 text-sm">
                Your completed or cancelled prescriptions will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pastPrescriptions.map((prescription) => {
                const statusKey = prescription.status?.toLowerCase() || 'completed'
                const colors = statusColors[statusKey] || statusColors.completed

                return (
                  <div
                    key={prescription.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-2">
                          {prescription.medicationName}
                        </h3>
                        <p className="text-[#617589] dark:text-gray-400 mb-1">
                          {prescription.dosage}
                          {prescription.frequency && `, ${prescription.frequency}`}
                          {prescription.duration && ` for ${prescription.duration}`}
                        </p>
                        {prescription.instructions && (
                          <p className="text-sm text-[#617589] dark:text-gray-400 mb-2">
                            Instructions: {prescription.instructions}
                          </p>
                        )}
                        <p className="text-sm text-[#617589] dark:text-gray-400 mb-3">
                          Prescribed by: {prescription.doctorName}
                          {prescription.doctorSpecialty && ` (${prescription.doctorSpecialty})`}
                        </p>
                        <p className="text-sm text-[#617589] dark:text-gray-400 mb-3">
                          Prescribed on: {prescription.formattedDate}
                        </p>
                        <span className={`inline-block px-3 py-1 ${colors.bg} ${colors.text} text-xs font-semibold rounded-full`}>
                          {prescription.statusDisplay || 'Inactive'}
                        </span>
                      </div>
                      <button className="text-[#617589] dark:text-gray-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">info</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
