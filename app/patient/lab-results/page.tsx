'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PatientSidebar } from '@/components/layout/PatientSidebar'
import { patientApi, LabResult, LabResultsResponse } from '@/lib/api/patients'

const statusColors: Record<string, { bg: string; text: string }> = {
  normal: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-400',
  },
  borderline_high: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    text: 'text-yellow-700 dark:text-yellow-400',
  },
  borderline_low: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    text: 'text-yellow-700 dark:text-yellow-400',
  },
  high: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-400',
  },
  low: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-400',
  },
}

const resultValueColors: Record<string, string> = {
  normal: 'text-[#111418] dark:text-white',
  borderline_high: 'text-orange-600 dark:text-orange-400',
  borderline_low: 'text-orange-600 dark:text-orange-400',
  high: 'text-red-600 dark:text-red-400',
  low: 'text-red-600 dark:text-red-400',
}

export default function LabResults() {
  const [labData, setLabData] = useState<LabResultsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [testTypeFilter, setTestTypeFilter] = useState('All Test Types')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    fetchLabResults()
  }, [testTypeFilter, startDate, endDate])

  const fetchLabResults = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await patientApi.getLabResults({
        testType: testTypeFilter !== 'All Test Types' ? testTypeFilter : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      })

      if (response.success && response.data) {
        setLabData(response.data)
      } else {
        setError(response.message || 'Failed to load lab results')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load lab results')
      console.error('Lab results fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Get unique test types for filter dropdown
  const uniqueTestTypes = labData?.results
    ? Array.from(new Set(labData.results.map((r) => r.testName).filter(Boolean)))
    : []

  if (loading && !labData) {
    return (
      <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
        <PatientSidebar />
        <main className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-[#617589] dark:text-gray-400">Loading lab results...</p>
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
            <h1 className="text-3xl font-bold text-[#111418] dark:text-white mb-2">Lab Results</h1>
            <p className="text-[#617589] dark:text-gray-400">View your latest and historical lab results.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">download</span>
              Download
            </button>
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">print</span>
              Print
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex gap-4">
          <select
            value={testTypeFilter}
            onChange={(e) => setTestTypeFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option>All Test Types</option>
            {uniqueTestTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date"
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {(startDate || endDate || testTypeFilter !== 'All Test Types') && (
            <button
              onClick={() => {
                setTestTypeFilter('All Test Types')
                setStartDate('')
                setEndDate('')
              }}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Lab Results Table */}
        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        ) : !labData || labData.results.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center mb-6">
            <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-600 mb-4">science</span>
            <p className="text-[#617589] dark:text-gray-400 text-lg mb-2">No lab results found</p>
            <p className="text-[#617589] dark:text-gray-400 text-sm">
              {testTypeFilter !== 'All Test Types' || startDate || endDate
                ? 'No results match your filters. Try adjusting your search criteria.'
                : 'You don\'t have any lab results yet.'}
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-[#111418] dark:text-white">
                      Test Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-[#111418] dark:text-white">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-[#111418] dark:text-white">Result</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-[#111418] dark:text-white">
                      Reference Range
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-[#111418] dark:text-white">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {labData.results.map((result, index) => {
                    const statusKey = result.status?.toLowerCase() || 'normal'
                    const colors = statusColors[statusKey] || statusColors.normal
                    const valueColor = resultValueColors[statusKey] || resultValueColors.normal
                    const isFirstRow = index === 0 || labData.results[index - 1]?.testName !== result.testName

                    return (
                      <tr key={result.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4 text-sm text-[#111418] dark:text-white">
                          {result.testName || (isFirstRow ? '' : '')}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#617589] dark:text-gray-400">{result.testDate}</td>
                        <td className={`px-6 py-4 text-sm font-semibold ${valueColor}`}>
                          {result.result || 'See Details'}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#617589] dark:text-gray-400">
                          {result.referenceRange || 'Varies by component'}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 ${colors.bg} ${colors.text} text-xs font-semibold rounded-full`}
                          >
                            {result.statusDisplay || 'Normal'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Doctor's Notes */}
        {labData?.doctorNotes && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <div className="flex gap-4">
              {labData.doctorNotes.date && (
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <div className="text-center">
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                      {new Date(labData.doctorNotes.date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                    </p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {new Date(labData.doctorNotes.date).getDate()}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex-1">
                <p className="font-bold text-[#111418] dark:text-white mb-2">
                  Note from {labData.doctorNotes.doctorName || 'Doctor'}
                </p>
                <p className="text-[#617589] dark:text-gray-400 leading-relaxed">{labData.doctorNotes.content}</p>
                {labData.doctorNotes.formattedDate && (
                  <p className="text-sm text-[#617589] dark:text-gray-400 mt-2">
                    {labData.doctorNotes.formattedDate}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
