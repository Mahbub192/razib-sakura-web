'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { DoctorSidebar } from '@/components/layout/DoctorSidebar'
import { doctorApi, DoctorPatientsResponse } from '@/lib/api/doctors'

export default function DoctorPatients() {
  const [patients, setPatients] = useState<DoctorPatientsResponse['patients']>([])
  const [pagination, setPagination] = useState<DoctorPatientsResponse['pagination']>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetchPatients()
  }, [currentPage])

  // Debounce search
  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    const timer = setTimeout(() => {
      setCurrentPage(1) // Reset to first page on search
      fetchPatients()
    }, 500) // 500ms debounce

    setDebounceTimer(timer)

    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }
    }
  }, [searchQuery])

  const fetchPatients = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await doctorApi.getPatients({
        search: searchQuery || undefined,
        page: currentPage,
        limit: 10,
      })

      if (response.success && response.data) {
        setPatients(response.data.patients)
        setPagination(response.data.pagination)
      } else {
        setError(response.message || 'Failed to load patients')
      }
    } catch (err: any) {
      setError(err.message || 'Error loading patients')
      console.error('Patients fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const getInitials = (name: string) => {
    if (!name) return '?'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (date: string | Date) => {
    if (!date) return 'N/A'
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatDOB = (dob: string | Date) => {
    if (!dob) return 'N/A'
    const dateObj = typeof dob === 'string' ? new Date(dob) : dob
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <DoctorSidebar />
      
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#111418] dark:text-white mb-2">Find a Patient</h1>
            <p className="text-[#617589] dark:text-gray-400">Search and manage patient records.</p>
          </div>
          <Link
            href="/doctor/patients/new"
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center gap-2"
          >
            <span className="material-symbols-outlined">add</span>
            Add New Patient
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#617589] dark:text-gray-400">
              search
            </span>
            <input
              type="text"
              placeholder="Search by Patient Name, ID, Phone, Email..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#617589] dark:text-gray-400 hover:text-[#111418] dark:hover:text-white"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-[#617589] dark:text-gray-400">Loading patients...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-red-600 dark:text-red-400">error</span>
              <div>
                <p className="text-red-600 dark:text-red-400 font-semibold">Error</p>
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
              <button
                onClick={fetchPatients}
                className="ml-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Results Summary */}
        {!loading && !error && (
          <div className="mb-4 text-sm text-[#617589] dark:text-gray-400">
            Showing {patients.length > 0 ? (currentPage - 1) * pagination.limit + 1 : 0} to{' '}
            {Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total} results
            {searchQuery && (
              <span className="ml-2">
                for "<span className="font-semibold text-[#111418] dark:text-white">{searchQuery}</span>"
              </span>
            )}
          </div>
        )}

        {/* Patients Table */}
        {!loading && !error && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {patients.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[#111418] dark:text-white">
                        PATIENT NAME
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[#111418] dark:text-white">
                        PATIENT ID
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[#111418] dark:text-white">
                        DOB
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[#111418] dark:text-white">
                        PHONE NUMBER
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[#111418] dark:text-white">
                        LAST VISIT
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[#111418] dark:text-white">
                        ACTIONS
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {patients.map((patient) => (
                      <tr
                        key={patient.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                              <span className="text-primary font-semibold text-sm">
                                {getInitials(patient.name || '')}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium text-[#111418] dark:text-white block">
                                {patient.name || 'N/A'}
                              </span>
                              {patient.email && (
                                <span className="text-xs text-[#617589] dark:text-gray-400">
                                  {patient.email}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#617589] dark:text-gray-400">
                          {patient.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#617589] dark:text-gray-400">
                          {formatDOB(patient.dob)}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#617589] dark:text-gray-400">
                          {patient.phone || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#617589] dark:text-gray-400">
                          {patient.lastVisit || formatDate(patient.lastAppointment)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Link
                              href={`/doctor/patients/${patient.id}`}
                              className="text-primary hover:underline text-sm font-medium"
                            >
                              View
                            </Link>
                            <span className="text-[#617589] dark:text-gray-400">/</span>
                            <Link
                              href={`/doctor/patients/${patient.id}/history`}
                              className="text-primary hover:underline text-sm font-medium"
                            >
                              History
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <span className="material-symbols-outlined text-6xl text-[#617589] dark:text-gray-400 mb-4">
                  person_off
                </span>
                <p className="text-lg font-semibold text-[#111418] dark:text-white mb-2">
                  No patients found
                </p>
                <p className="text-sm text-[#617589] dark:text-gray-400">
                  {searchQuery
                    ? 'Try adjusting your search criteria'
                    : 'No patients have been assigned to you yet'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && pagination.totalPages > 1 && (
          <div className="mt-6 flex justify-between items-center">
            <p className="text-sm text-[#617589] dark:text-gray-400">
              Page {pagination.page} of {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum: number
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      currentPage === pageNum
                        ? 'bg-primary text-white'
                        : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
