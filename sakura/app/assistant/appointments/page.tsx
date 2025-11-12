'use client'

import Link from 'next/link'
import { useState } from 'react'

interface Appointment {
  id: string
  patientName: string
  date: string
  time: string
  assignedTo: string
  type: string
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'no-show'
}

export default function AssistantAppointmentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'upcoming' | 'past' | 'all'>('upcoming')
  const [currentPage, setCurrentPage] = useState(1)

  const appointments: Appointment[] = [
    {
      id: '1',
      patientName: 'Olivia Chen',
      date: 'Oct 28, 2024',
      time: '10:00 AM',
      assignedTo: 'Dr. Anya Sharma',
      type: 'Follow-up',
      status: 'confirmed',
    },
    {
      id: '2',
      patientName: 'Liam Gallagher',
      date: 'Oct 28, 2024',
      time: '02:30 PM',
      assignedTo: 'Assistant Chloe',
      type: 'Check-up',
      status: 'confirmed',
    },
    {
      id: '3',
      patientName: 'Sarah Connor',
      date: 'Oct 28, 2024',
      time: '04:00 PM',
      assignedTo: 'Dr. Anya Sharma',
      type: 'Video Consult',
      status: 'pending',
    },
    {
      id: '4',
      patientName: 'Ben Carter',
      date: 'Oct 25, 2024',
      time: '02:00 PM',
      assignedTo: 'Dr. Anya Sharma',
      type: 'New Patient',
      status: 'completed',
    },
    {
      id: '5',
      patientName: 'Sofia Reyes',
      date: 'Oct 21, 2024',
      time: '10:30 AM',
      assignedTo: 'Assistant Mark',
      type: 'Check-up',
      status: 'completed',
    },
    {
      id: '6',
      patientName: 'David Kim',
      date: 'Oct 21, 2024',
      time: '09:00 AM',
      assignedTo: 'Dr. Anya Sharma',
      type: 'Follow-up',
      status: 'cancelled',
    },
    {
      id: '7',
      patientName: 'Ethan Hunt',
      date: 'Oct 20, 2024',
      time: '03:15 PM',
      assignedTo: 'Assistant Chloe',
      type: 'Routine Follow-up',
      status: 'no-show',
    },
  ]

  const getStatusBadge = (status: Appointment['status']) => {
    const styles = {
      confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
      'no-show': 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    }
    const labels = {
      confirmed: 'Confirmed',
      pending: 'Pending',
      completed: 'Completed',
      cancelled: 'Cancelled',
      'no-show': 'No Show',
    }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  const filteredAppointments = appointments.filter((appt) => {
    const matchesSearch = appt.patientName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'upcoming' && (appt.status === 'confirmed' || appt.status === 'pending')) ||
      (filterType === 'past' && (appt.status === 'completed' || appt.status === 'cancelled' || appt.status === 'no-show'))
    return matchesSearch && matchesFilter
  })

  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-200">
      {/* Left Sidebar */}
      <aside className="flex w-64 flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark p-4">
        <div className="flex flex-col gap-4">
          {/* Profile Section */}
          <div className="flex items-center gap-3 px-2">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDaxM0wNFKrDU8Mv8BAOJspA5Z6u2Y55brKTpqS4ROf6q8xEbWBzaPg4yjolSXminz0fSpTGjvgY9W9y59Lw3KPW4__KGKK6yaax2B48p2d5vcW_707PRwZUcPPOrVhmqwVQqZAWo2sF-sff_tYDTm91aBuuzAYMzxJtzBsWOt5p-0MSLu8fM-EprRrkaE9_7SvNJb68IICeo4-ThCJOAkqilKQKYUF-ILNjtSs40ohwSn0CYsB4hBg_2hUwiDDlGp94z_6uV7pUvY")',
              }}
            />
            <div className="flex flex-col">
              <h1 className="text-gray-900 dark:text-white text-base font-semibold leading-normal">Sarah Johnson</h1>
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
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary"
            >
              <span className="material-symbols-outlined fill text-2xl">list_alt</span>
              <p className="text-sm font-semibold leading-normal">Appointments</p>
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
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-normal">Upcoming Appointments</p>
            <p className="text-gray-900 dark:text-white tracking-light text-3xl font-bold leading-tight">32</p>
            <p className="text-green-600 dark:text-green-500 text-sm font-medium leading-normal">+5 this week</p>
          </div>
          <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-4 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-normal">Completed Today</p>
            <p className="text-gray-900 dark:text-white tracking-light text-3xl font-bold leading-tight">8</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal">out of 12</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark">
        <div className="flex flex-col gap-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-gray-900 dark:text-white text-3xl font-bold leading-tight">Appointments</h1>
              <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">View and manage all patient appointments.</p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/assistant/appointments/new"
                className="flex items-center justify-center gap-2 rounded-lg h-11 px-5 bg-primary text-white text-sm font-bold leading-normal shadow-sm hover:bg-primary/90 transition-colors"
              >
                <span className="material-symbols-outlined">add</span>
                <span className="truncate">New Appointment</span>
              </Link>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
            <div className="flex flex-wrap justify-between items-center gap-4 p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="relative w-full sm:max-w-xs">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                <input
                  type="text"
                  placeholder="Search by patient name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-primary focus:border-primary dark:text-white"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button className="flex items-center justify-center gap-2 rounded-lg h-9 px-4 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <span className="material-symbols-outlined text-lg">filter_list</span>
                  <span>Filters</span>
                </button>
                <div className="flex items-center gap-2 rounded-lg p-1 bg-background-light dark:bg-background-dark border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setFilterType('upcoming')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      filterType === 'upcoming'
                        ? 'bg-white dark:bg-gray-800 text-primary dark:text-primary shadow-sm font-semibold'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50 font-medium'
                    }`}
                  >
                    Upcoming
                  </button>
                  <button
                    onClick={() => setFilterType('past')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      filterType === 'past'
                        ? 'bg-white dark:bg-gray-800 text-primary dark:text-primary shadow-sm font-semibold'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50 font-medium'
                    }`}
                  >
                    Past
                  </button>
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      filterType === 'all'
                        ? 'bg-white dark:bg-gray-800 text-primary dark:text-primary shadow-sm font-semibold'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50 font-medium'
                    }`}
                  >
                    All
                  </button>
                </div>
              </div>
            </div>

            {/* Appointments Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-500 dark:text-gray-400 uppercase">
                  <tr>
                    <th className="px-6 py-3" scope="col">
                      <div className="flex items-center gap-1">
                        Patient Name <span className="material-symbols-outlined text-base">swap_vert</span>
                      </div>
                    </th>
                    <th className="px-6 py-3" scope="col">
                      <div className="flex items-center gap-1">
                        Date & Time <span className="material-symbols-outlined text-base">swap_vert</span>
                      </div>
                    </th>
                    <th className="px-6 py-3" scope="col">
                      <div className="flex items-center gap-1">
                        Assigned To <span className="material-symbols-outlined text-base">swap_vert</span>
                      </div>
                    </th>
                    <th className="px-6 py-3" scope="col">
                      <div className="flex items-center gap-1">
                        Type <span className="material-symbols-outlined text-base">swap_vert</span>
                      </div>
                    </th>
                    <th className="px-6 py-3" scope="col">
                      <div className="flex items-center gap-1">
                        Status <span className="material-symbols-outlined text-base">swap_vert</span>
                      </div>
                    </th>
                    <th className="px-6 py-3" scope="col">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((appt, index) => (
                    <tr
                      key={appt.id}
                      className={`border-b dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                        index === filteredAppointments.length - 1 ? '' : 'border-b'
                      }`}
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{appt.patientName}</td>
                      <td className="px-6 py-4">
                        {appt.date} - {appt.time}
                      </td>
                      <td className="px-6 py-4">{appt.assignedTo}</td>
                      <td className="px-6 py-4">{appt.type}</td>
                      <td className="px-6 py-4">{getStatusBadge(appt.status)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            title="View Details"
                          >
                            <span className="material-symbols-outlined text-xl">visibility</span>
                          </button>
                          {(appt.status === 'confirmed' || appt.status === 'pending') && (
                            <>
                              <button
                                className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                title="Edit Appointment"
                              >
                                <span className="material-symbols-outlined text-xl">edit_calendar</span>
                              </button>
                              <button
                                className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-red-500 transition-colors"
                                title="Cancel Appointment"
                              >
                                <span className="material-symbols-outlined text-xl">cancel</span>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-wrap justify-between items-center gap-4 p-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Showing 1 to {filteredAppointments.length} of 52 appointments
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center justify-center gap-1 rounded-lg h-9 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">chevron_left</span>
                  <span>Previous</span>
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="flex items-center justify-center gap-1 rounded-lg h-9 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <span>Next</span>
                  <span className="material-symbols-outlined text-lg">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

