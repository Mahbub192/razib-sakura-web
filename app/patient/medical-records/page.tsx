'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PatientSidebar } from '@/components/layout/PatientSidebar'
import { patientApi, MedicalRecord } from '@/lib/api/patients'

const categoryTabs = ['All Records', 'Diagnoses', 'Medications', 'Allergies', 'Vaccinations', 'Lab Results']

const categoryMap: Record<string, string> = {
  'All Records': '',
  'Diagnoses': 'diagnosis',
  'Medications': 'medication',
  'Allergies': 'allergy',
  'Vaccinations': 'vaccination',
  'Lab Results': 'lab_result',
}

const categoryIcons: Record<string, string> = {
  diagnosis: 'favorite',
  medication: 'medication',
  allergy: 'warning',
  vaccination: 'vaccines',
  lab_result: 'science',
  other: 'folder',
}

const categoryColors: Record<string, { bg: string; text: string; icon: string }> = {
  diagnosis: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    text: 'text-yellow-700 dark:text-yellow-400',
    icon: 'text-yellow-600 dark:text-yellow-400',
  },
  medication: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-400',
    icon: 'text-green-600 dark:text-green-400',
  },
  allergy: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-400',
    icon: 'text-red-600 dark:text-red-400',
  },
  vaccination: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-400',
    icon: 'text-blue-600 dark:text-blue-400',
  },
  lab_result: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-400',
    icon: 'text-blue-600 dark:text-blue-400',
  },
  other: {
    bg: 'bg-gray-100 dark:bg-gray-900/30',
    text: 'text-gray-700 dark:text-gray-400',
    icon: 'text-gray-600 dark:text-gray-400',
  },
}

export default function MedicalRecords() {
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('All Records')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const limit = 10

  useEffect(() => {
    fetchMedicalRecords()
  }, [activeTab, currentPage])

  const fetchMedicalRecords = async () => {
    try {
      setLoading(true)
      setError(null)
      const category = categoryMap[activeTab] || ''
      const response = await patientApi.getMedicalRecords({
        category: category || undefined,
        page: currentPage,
        limit,
      })

      if (response.success && response.data) {
        setRecords(response.data.records || [])
        setTotalPages(response.data.pagination?.totalPages || 1)
        setTotalRecords(response.data.pagination?.total || 0)
      } else {
        setError(response.message || 'Failed to load medical records')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load medical records')
      console.error('Medical records fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredRecords = records.filter((record) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      record.title?.toLowerCase().includes(query) ||
      record.description?.toLowerCase().includes(query) ||
      record.providerName?.toLowerCase().includes(query) ||
      record.categoryDisplay?.toLowerCase().includes(query)
    )
  })

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setCurrentPage(1) // Reset to first page when changing tabs
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading && records.length === 0) {
    return (
      <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
        <PatientSidebar />
        <main className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-[#617589] dark:text-gray-400">Loading medical records...</p>
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
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#111418] dark:text-white mb-2">My Medical Records</h1>
            <p className="text-[#617589] dark:text-gray-400">
              A complete history of your diagnoses, treatments, and medications.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">print</span>
              Print Records
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">download</span>
              Download Records
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Search and Filters */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#617589] dark:text-gray-400">
              search
            </span>
            <input
              type="text"
              placeholder="Search records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mb-6 flex gap-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          {categoryTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'border-primary text-primary font-semibold'
                  : 'border-transparent text-[#617589] dark:text-gray-400 hover:text-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Records Count */}
        {!loading && (
          <div className="mb-4 text-sm text-[#617589] dark:text-gray-400">
            Showing {filteredRecords.length} of {totalRecords} records
          </div>
        )}

        {/* Records List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse"
              >
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-600 mb-4">folder</span>
            <p className="text-[#617589] dark:text-gray-400 text-lg mb-2">No medical records found</p>
            <p className="text-[#617589] dark:text-gray-400 text-sm">
              {activeTab !== 'All Records' ? `No ${activeTab.toLowerCase()} found.` : 'You don\'t have any medical records yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRecords.map((record) => {
              const categoryKey = record.category || 'other'
              const colors = categoryColors[categoryKey] || categoryColors.other
              const icon = categoryIcons[categoryKey] || 'folder'

              return (
                <div
                  key={record.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4">
                    <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <span className={`material-symbols-outlined ${colors.icon}`}>{icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-[#111418] dark:text-white">{record.title}</h3>
                          <span className={`inline-block px-2 py-1 ${colors.bg} ${colors.text} text-xs rounded mt-1`}>
                            {record.categoryDisplay} {record.status ? `- ${record.status}` : ''}
                          </span>
                        </div>
                        <span className="text-sm text-[#617589] dark:text-gray-400">{record.formattedDate}</span>
                      </div>
                      <p className="text-[#617589] dark:text-gray-400 mb-2">{record.description}</p>
                      <p className="text-sm text-[#617589] dark:text-gray-400 mb-3">
                        Provider: {record.providerName || 'Unknown'}
                      </p>
                      {record.attachments && record.attachments.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {record.attachments.map((attachment, idx) => (
                            <Link
                              key={idx}
                              href={attachment}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary text-sm font-semibold hover:underline flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-sm">description</span>
                              View Attachment {idx + 1}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-primary text-white'
                        : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                )
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <span key={page} className="px-2 text-[#617589] dark:text-gray-400">
                    ...
                  </span>
                )
              }
              return null
            })}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
