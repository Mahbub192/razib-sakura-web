'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { assistantApi } from '@/lib/api/assistants'

interface Patient {
  id: string
  name: string
  image?: string
  lastVisit: string
  diagnosis: string
  status: 'stable' | 'monitoring' | 'discharged' | 'at-risk'
  dob?: string
  email?: string
  phoneNumber?: string
}

interface TimelineItem {
  type: 'appointment' | 'note'
  date: Date
  title: string
  description: string
  diagnosis?: string
  prescription?: string
  doctor: string
}

export default function AssistantPatientsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [patients, setPatients] = useState<Patient[]>([])
  const [statistics, setStatistics] = useState({
    totalPatients: 0,
    appointmentsToday: 0,
    monthChange: 0,
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFilter, setDateFilter] = useState('all')
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null)
  const [patientDetails, setPatientDetails] = useState<any | null>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'appointments' | 'notes'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  })

  useEffect(() => {
    fetchPatients()
    fetchStatistics()
  }, [currentPage, searchQuery])

  const fetchPatients = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await assistantApi.getPatients({
        search: searchQuery || undefined,
        page: currentPage,
        limit: 10,
      })
      if (response.success && response.data) {
        setPatients(response.data.patients || [])
        setPagination(response.data.pagination || pagination)
      } else {
        setError(response.message || 'Failed to load patients')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load patients')
    } finally {
      setLoading(false)
    }
  }

  const fetchStatistics = async () => {
    try {
      const response = await assistantApi.getPatientStatistics()
      if (response.success && response.data) {
        setStatistics(response.data)
      }
    } catch (err) {
      console.error('Failed to load statistics:', err)
    }
  }

  const fetchPatientDetails = async (patientId: string) => {
    try {
      setLoadingDetails(true)
      const response = await assistantApi.getPatientDetails(patientId)
      if (response.success && response.data) {
        setPatientDetails(response.data)
      }
    } catch (err: any) {
      console.error('Failed to load patient details:', err)
    } finally {
      setLoadingDetails(false)
    }
  }

  const handlePatientClick = async (patient: Patient) => {
    setSelectedPatient(patient)
    await fetchPatientDetails(patient.id)
  }

  const getStatusBadge = (status: Patient['status']) => {
    const styles = {
      stable: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      monitoring: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      discharged: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'at-risk': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    }
    const labels = {
      stable: 'Stable',
      monitoring: 'Monitoring',
      discharged: 'Discharged',
      'at-risk': 'At Risk',
    }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        fetchPatients()
      } else {
        setCurrentPage(1)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const getFilteredTimeline = () => {
    if (!patientDetails?.timeline) return []
    if (activeTab === 'appointments') {
      return patientDetails.timeline.filter((item: TimelineItem) => item.type === 'appointment')
    }
    if (activeTab === 'notes') {
      return patientDetails.timeline.filter((item: TimelineItem) => item.type === 'note')
    }
    return patientDetails.timeline
  }

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
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary"
            >
              <span className="material-symbols-outlined fill text-2xl">group</span>
              <p className="text-sm font-semibold leading-normal">Patients</p>
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
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <span className="material-symbols-outlined text-2xl">bar_chart</span>
              <p className="text-sm font-medium leading-normal">Reports</p>
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

        {/* Stats Cards */}
        <div className="mt-auto flex flex-col gap-4">
          <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-4 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-normal">Total Patients</p>
            <p className="text-gray-900 dark:text-white tracking-light text-3xl font-bold leading-tight">
              {statistics.totalPatients}
            </p>
            <p
              className={`text-sm font-medium leading-normal ${
                statistics.monthChange >= 0
                  ? 'text-green-600 dark:text-green-500'
                  : 'text-red-600 dark:text-red-500'
              }`}
            >
              {statistics.monthChange >= 0 ? '+' : ''}
              {statistics.monthChange.toFixed(1)}% this month
            </p>
          </div>
          <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-4 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-normal">Appointments Today</p>
            <p className="text-gray-900 dark:text-white tracking-light text-3xl font-bold leading-tight">
              {statistics.appointmentsToday}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal">Scheduled</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-900">
        <div className="flex flex-col gap-4 sm:gap-6">
          {/* Header */}
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-gray-900 dark:text-white text-2xl sm:text-3xl font-bold leading-tight">
                Patient History
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base font-normal leading-normal">
                Search and manage patient records.
              </p>
            </div>
            <button className="flex items-center justify-center gap-2 rounded-lg h-10 sm:h-11 px-4 sm:px-5 bg-primary text-white text-sm font-bold leading-normal shadow-sm hover:bg-primary/90 transition-colors w-full sm:w-auto">
              <span className="material-symbols-outlined text-lg sm:text-xl">person_add</span>
              <span className="truncate">Add New Patient</span>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
              <input
                type="text"
                placeholder="Search by patient name, ID, or diagnosis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 rounded-lg border-gray-200 dark:border-gray-700 bg-background-light dark:bg-background-dark text-sm pl-10 focus:border-primary focus:ring-primary/50 dark:text-white"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="rounded-lg border-gray-200 dark:border-gray-700 bg-background-light dark:bg-background-dark text-sm focus:border-primary focus:ring-primary/50 h-11 px-3"
              >
                <option value="all">All Dates</option>
                <option value="30">Last 30 Days</option>
                <option value="180">Last 6 Months</option>
                <option value="365">Last Year</option>
              </select>
              <button className="flex items-center justify-center gap-2 rounded-lg h-11 px-4 bg-background-light dark:bg-background-dark border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                <span className="material-symbols-outlined text-lg">filter_list</span>
                <span>Filter</span>
              </button>
            </div>
          </div>

          {/* Patient Table */}
          <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">Loading patients...</p>
              </div>
            ) : filteredPatients.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">No patients found</p>
              </div>
            ) : (
              <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-background-light dark:bg-background-dark dark:text-gray-300">
                  <tr>
                    <th className="px-6 py-3" scope="col">
                      Patient
                    </th>
                    <th className="px-6 py-3" scope="col">
                      Last Visit
                    </th>
                    <th className="px-6 py-3" scope="col">
                      Diagnosis
                    </th>
                    <th className="px-6 py-3" scope="col">
                      Status
                    </th>
                    <th className="px-6 py-3" scope="col">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((patient, index) => (
                    <tr
                      key={patient.id}
                      className={`bg-white dark:bg-gray-900 border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer ${
                        index === filteredPatients.length - 1 ? '' : 'border-b'
                      }`}
                      onClick={() => handlePatientClick(patient)}
                    >
                      <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white" scope="row">
                        <div className="flex items-center gap-3">
                          <div
                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 flex items-center justify-center"
                                style={{
                                  backgroundImage: patient.image ? `url("${patient.image}")` : undefined,
                                  backgroundColor: patient.image ? undefined : '#e0e7ff',
                                }}
                              >
                                {!patient.image && (
                                  <span className="text-primary font-semibold text-lg">
                                    {patient.name?.charAt(0)?.toUpperCase() || 'P'}
                                  </span>
                                )}
                              </div>
                          <div>
                            <p className="font-semibold">{patient.name}</p>
                            <p className="font-normal text-gray-500 dark:text-gray-400 text-xs">ID: {patient.id}</p>
                          </div>
                        </div>
                      </th>
                      <td className="px-6 py-4">{patient.lastVisit}</td>
                      <td className="px-6 py-4">{patient.diagnosis}</td>
                      <td className="px-6 py-4">{getStatusBadge(patient.status)}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePatientClick(patient)
                          }}
                          className="font-medium text-primary dark:text-primary hover:underline"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <nav aria-label="Table navigation" className="flex items-center justify-between p-4">
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    Showing <span className="font-semibold text-gray-900 dark:text-white">
                      {(currentPage - 1) * pagination.limit + 1}
                    </span>{' '}
                    to{' '}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {Math.min(currentPage * pagination.limit, pagination.total)}
                    </span>{' '}
                    of <span className="font-semibold text-gray-900 dark:text-white">{pagination.total}</span>
              </span>
              <ul className="inline-flex items-center -space-x-px">
                <li>
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                </li>
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      const pageNum = i + 1
                      return (
                        <li key={pageNum}>
                  <button
                            onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 h-8 leading-tight border ${
                              currentPage === pageNum
                        ? 'z-10 text-primary border-primary bg-primary/10 hover:bg-primary/20 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
                        : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                    }`}
                  >
                            {pageNum}
                  </button>
                </li>
                      )
                    })}
                <li>
                  <button
                        onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                        disabled={currentPage === pagination.totalPages}
                    className="px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Right Sidebar - Patient Details */}
      {selectedPatient && (
        <aside className="w-96 flex-col border-l border-gray-200 dark:border-gray-800 bg-background-light dark:bg-background-dark p-6 hidden xl:flex overflow-y-auto">
          {loadingDetails ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">Loading details...</p>
              </div>
            </div>
          ) : patientDetails ? (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Patient Details</h3>
              <button
                  onClick={() => {
                    setSelectedPatient(null)
                    setPatientDetails(null)
                  }}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Patient Info Card */}
            <div className="flex flex-col gap-4 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-4">
                <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-16 flex items-center justify-center"
                    style={{
                      backgroundImage: patientDetails.patient?.avatar ? `url("${patientDetails.patient.avatar}")` : undefined,
                      backgroundColor: patientDetails.patient?.avatar ? undefined : '#e0e7ff',
                    }}
                  >
                    {!patientDetails.patient?.avatar && (
                      <span className="text-primary font-semibold text-xl">
                        {patientDetails.patient?.name?.charAt(0)?.toUpperCase() || 'P'}
                      </span>
                    )}
                  </div>
                <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                      {patientDetails.patient?.name || selectedPatient.name}
                    </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                      DOB:{' '}
                      {patientDetails.patient?.dateOfBirth
                        ? new Date(patientDetails.patient.dateOfBirth).toLocaleDateString()
                        : selectedPatient.dob || 'N/A'}{' '}
                      {patientDetails.patient?.dateOfBirth
                        ? `(${Math.floor((new Date().getTime() - new Date(patientDetails.patient.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))} yrs)`
                        : ''}
                  </p>
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h5 className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 tracking-wider mb-2">
                    Contact Information
                </h5>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Email: {patientDetails.patient?.email || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Phone: {patientDetails.patient?.phoneNumber || 'N/A'}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors">
                  <span className="material-symbols-outlined text-base">edit</span>
                  <span>Edit Profile</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary/20 dark:bg-primary/30 text-primary dark:text-primary text-sm font-bold hover:bg-primary/30 dark:hover:bg-primary/40 transition-colors">
                  <span className="material-symbols-outlined text-base">note_add</span>
                  <span>Add Note</span>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div>
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav aria-label="Tabs" className="-mb-px flex space-x-6">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`whitespace-nowrap py-3 px-1 border-b-2 text-sm ${
                      activeTab === 'all'
                        ? 'border-primary text-primary font-semibold'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500 font-medium'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setActiveTab('appointments')}
                    className={`whitespace-nowrap py-3 px-1 border-b-2 text-sm ${
                      activeTab === 'appointments'
                        ? 'border-primary text-primary font-semibold'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500 font-medium'
                    }`}
                  >
                    Appointments
                  </button>
                  <button
                    onClick={() => setActiveTab('notes')}
                    className={`whitespace-nowrap py-3 px-1 border-b-2 text-sm ${
                      activeTab === 'notes'
                        ? 'border-primary text-primary font-semibold'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500 font-medium'
                    }`}
                  >
                    Notes
                  </button>
                </nav>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-6">
                {getFilteredTimeline().length > 0 ? (
                  getFilteredTimeline().map((item: TimelineItem, index: number) => (
                    <div key={index} className="relative flex gap-4">
                      {index < getFilteredTimeline().length - 1 && (
                <div className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                      )}
                <div className="flex-shrink-0 z-10">
                        <div
                          className={`flex size-10 items-center justify-center rounded-full ${
                            item.type === 'appointment'
                              ? 'bg-primary/10 dark:bg-primary/20 text-primary'
                              : 'bg-blue-500/10 text-blue-500'
                          }`}
                        >
                          <span className="material-symbols-outlined">
                            {item.type === 'appointment' ? 'calendar_month' : 'edit_note'}
                          </span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {item.title}{' '}
                          <span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-1">
                            {new Date(item.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                  </p>
                  <div className="mt-2 p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                          {item.diagnosis && (
                            <>
                              <p className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 tracking-wider mb-1">
                                Diagnosis
                              </p>
                              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{item.diagnosis}</p>
                            </>
                          )}
                          {item.prescription && (
                            <>
                              <p className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 tracking-wider mb-1">
                                Prescription
                              </p>
                              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{item.prescription}</p>
                            </>
                          )}
                          {!item.diagnosis && !item.prescription && (
                            <p className="text-sm text-gray-700 dark:text-gray-300">{item.description}</p>
                          )}
                  </div>
                </div>
              </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">No {activeTab === 'all' ? 'history' : activeTab} found</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No patient details available</p>
          </div>
          )}
        </aside>
      )}
    </div>
  )
}
