'use client'

import Link from 'next/link'
import { useState } from 'react'

interface Patient {
  id: string
  name: string
  image: string
  lastVisit: string
  diagnosis: string
  status: 'stable' | 'monitoring' | 'discharged' | 'at-risk'
  dob?: string
}

export default function AssistantPatientsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFilter, setDateFilter] = useState('all')
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'appointments' | 'notes'>('all')
  const [currentPage, setCurrentPage] = useState(1)

  const patients: Patient[] = [
    {
      id: 'P001',
      name: 'Liam Gallagher',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6LKvMY5NoTGvX9fFysQ8wdiAzn6P60tgdXsFxWw1V0NdDAabqJfia7FrGm1CNyUFyyLp2Pna_3GQV65JnubDnOT96zLrgW0erK16tZYQU4HkkYadiM0QRbHstW5jjxXXcSIgI3HlqlSH4FxKVfIfDyQ2gT0tAwK7cemlVJO8QB4fNXvPaOJ87c5yM3GwLYdqht7ytK0VVa8lJ7HgmZ6yA7prhl8q9h_9c6xDUg4iTPHmt4rE0jGHKw_VTZ0fKDeXQVVs_TBOuDN8',
      lastVisit: 'Oct 28, 2024',
      diagnosis: 'Hypertension',
      status: 'stable',
    },
    {
      id: 'P002',
      name: 'Olivia Chen',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNnw-1wr2XEFp0Z4W80zkaiwhp0r9jN5VcT_QpQLWj3_Qd7XP3E7jsMDLzZc-T1I3Jw6lDaVlom1h_lxThxNwlxGBA9Hhs346UJOFkQkd29aoIV-FIffCeVHnOZnDg2lAC0IfBQ5nsuarLdt2JrM6dDLEaXIBGBxjrYNnjouccBYCGP33sVm7ZCJXUJQVPr335RTbGmEpdXrxAHe-3QsDPah2KJMUwrcMdCIubuZ_9h8E4C57eLznfLw-649hFjpbGaFW4VhTZQlY',
      lastVisit: 'Oct 28, 2024',
      diagnosis: 'Post-Op Follow-up',
      status: 'monitoring',
      dob: '05/12/1985',
    },
    {
      id: 'P003',
      name: 'Ben Carter',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_CcNDG9AWCMBn5blhXGIpm13s_FztWb2BsWnUyyBWnYZpS43fGvS8X_JdQ7vfZRhrdFZ6oRFrnMICzh65RUpGuHJs4rVv9EHaDKr65goK6lPslHDYpPCxkgQPZt0iNomzZ-fWYJF-VaEwtD4fBESUTaLpCMiAyamGCNxkzUtKnkRM0iArmDqAk1z4T1TskQZMTDgVqZwgnhaMWy8_iS-tdyEAsMA9GkUpxJN7MaI3liOWpzKuQnaU5cK5AuF2yv5qsnk3OL4RtCQ',
      lastVisit: 'Oct 27, 2024',
      diagnosis: 'Arrhythmia',
      status: 'stable',
    },
    {
      id: 'P004',
      name: 'Sofia Reyes',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbZTssH7T60lZtqKOqkw7A6jUvx2SiUSke4aW4Ss7MPiFvPdm38OXBH70w3cq4XBluI5WbWwID0mh4iP_yVhVFh5UzedD1g1lW3XxfhiyLJYwI84AagT_KmsdbMsROYuTmK1mRlSJRtQh6bhAYWWTcq9C2Vn5Cla8LC9aW33eenNmCJ2qgsSu_T1KeWViThCDoDNQdAARNRQgyEvXyIxtbVO3x5Q0Mbm3cuu7Iq_6bFC5TJ_0lgxutxkUxQN943ZbjCWSUqILuZBo',
      lastVisit: 'Oct 25, 2024',
      diagnosis: 'Routine Checkup',
      status: 'discharged',
    },
    {
      id: 'P005',
      name: 'David Kim',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrlZpwWZ2Z546lBhgtLKXGmjdi6tDZbLhTl3aa0MHwRFye6KD2r4I3gdbbMzo-V8EtI-5niZIFFkhwtx9QkLjHImnrvIINBhUwRANHUEQZi6JBY1eqVqC4wAtARNprEXGRmRGT6VSsxhuh8Lkd0k33kTYjFSoenpC2TibNBB8GiUeCQF4Mee0WSB3G8qNat2FvB60H9FKD7dFVolHbTWWZLcAmE43co9UKKpcWuw6LR2_CBPPVo6Ax-UmZNk9vTPaWj0NzMrEQj_s',
      lastVisit: 'Oct 22, 2024',
      diagnosis: 'Atrial Fibrillation',
      status: 'at-risk',
    },
  ]

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

  const handlePatientClick = (patient: Patient) => {
    setSelectedPatient(patient)
  }

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) || patient.id.toLowerCase().includes(searchQuery.toLowerCase()) || patient.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
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
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <span className="material-symbols-outlined text-2xl">calendar_month</span>
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
              href="/assistant/communications"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <span className="material-symbols-outlined text-2xl">chat</span>
              <p className="text-sm font-medium leading-normal">Communications</p>
            </Link>
            <Link
              href="/assistant/schedule"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <span className="material-symbols-outlined text-2xl">schedule</span>
              <p className="text-sm font-medium leading-normal">My Schedule</p>
            </Link>
            <Link
              href="/assistant/tasks"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <span className="material-symbols-outlined text-2xl">task_alt</span>
              <p className="text-sm font-medium leading-normal">Tasks</p>
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
            <p className="text-gray-900 dark:text-white tracking-light text-3xl font-bold leading-tight">850</p>
            <p className="text-green-600 dark:text-green-500 text-sm font-medium leading-normal">+1.5% this month</p>
          </div>
          <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-4 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-normal">Appointments Today</p>
            <p className="text-gray-900 dark:text-white tracking-light text-3xl font-bold leading-tight">12</p>
            <p className="text-red-600 dark:text-red-500 text-sm font-medium leading-normal">-5% vs yesterday</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 bg-white dark:bg-gray-900">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-gray-900 dark:text-white text-3xl font-bold leading-tight">Patient History</h1>
              <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">Search and manage patient records.</p>
            </div>
            <button className="flex items-center justify-center gap-2 rounded-lg h-11 px-5 bg-primary text-white text-sm font-bold leading-normal shadow-sm hover:bg-primary/90 transition-colors">
              <span className="material-symbols-outlined">person_add</span>
              <span className="truncate">Add New Patient</span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
              <input
                type="text"
                placeholder="Search by patient name, ID, or diagnosis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 rounded-lg border-gray-200 dark:border-gray-700 bg-background-light dark:bg-background-dark text-sm pl-10 focus:border-primary focus:ring-primary/50"
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
                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                            style={{ backgroundImage: `url("${patient.image}")` }}
                          />
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
                Showing <span className="font-semibold text-gray-900 dark:text-white">1-5</span> of{' '}
                <span className="font-semibold text-gray-900 dark:text-white">100</span>
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
                <li>
                  <button
                    onClick={() => setCurrentPage(1)}
                    className={`px-3 h-8 leading-tight border ${
                      currentPage === 1
                        ? 'z-10 text-primary border-primary bg-primary/10 hover:bg-primary/20 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
                        : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                    }`}
                  >
                    1
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentPage(2)}
                    className={`px-3 h-8 leading-tight border ${
                      currentPage === 2
                        ? 'z-10 text-primary border-primary bg-primary/10 hover:bg-primary/20 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
                        : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                    }`}
                  >
                    2
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentPage(3)}
                    className={`px-3 h-8 leading-tight border ${
                      currentPage === 3
                        ? 'z-10 text-primary border-primary bg-primary/10 hover:bg-primary/20 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
                        : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                    }`}
                  >
                    3
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === 3}
                    className="px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </main>

      {/* Right Sidebar - Patient Details */}
      {selectedPatient && (
        <aside className="w-96 flex-col border-l border-gray-200 dark:border-gray-800 bg-background-light dark:bg-background-dark p-6 hidden xl:flex overflow-y-auto">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Patient Details</h3>
              <button
                onClick={() => setSelectedPatient(null)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Patient Info Card */}
            <div className="flex flex-col gap-4 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-4">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-16"
                  style={{ backgroundImage: `url("${selectedPatient.image}")` }}
                />
                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">{selectedPatient.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    DOB: {selectedPatient.dob || 'N/A'} {selectedPatient.dob ? '(39 yrs)' : ''}
                  </p>
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h5 className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 tracking-wider mb-2">
                  Critical Alerts
                </h5>
                <p className="text-sm text-red-600 dark:text-red-500 bg-red-500/10 p-2 rounded-lg">
                  Allergy: Penicillin
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
              {/* Timeline Item 1 */}
              <div className="relative flex gap-4">
                <div className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                <div className="flex-shrink-0 z-10">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20 text-primary">
                    <span className="material-symbols-outlined">calendar_month</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Follow-up Visit <span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-1">Today, 10:00 AM</span>
                  </p>
                  <div className="mt-2 p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                    <p className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 tracking-wider mb-1">Diagnosis</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Post-Op recovery monitoring.</p>
                    <p className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 tracking-wider mb-1">Prescription</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Continue with prescribed pain medication as needed.</p>
                  </div>
                </div>
              </div>

              {/* Timeline Item 2 */}
              <div className="relative flex gap-4">
                <div className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                <div className="flex-shrink-0 z-10">
                  <div className="flex size-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                    <span className="material-symbols-outlined">edit_note</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Note Added by Dr. Sharma <span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-1">Oct 21, 2024</span>
                  </p>
                  <div className="mt-2 p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Patient reports good recovery progress. Vital signs are stable. Scheduled follow-up to check incision site.
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline Item 3 */}
              <div className="relative flex gap-4">
                <div className="flex-shrink-0 z-10">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20 text-primary">
                    <span className="material-symbols-outlined">calendar_month</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Initial Consultation <span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-1">Sep 15, 2024</span>
                  </p>
                  <div className="mt-2 p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                    <p className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 tracking-wider mb-1">Diagnosis</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Coronary Artery Disease</p>
                    <p className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 tracking-wider mb-1">Plan</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Scheduled for angioplasty.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      )}
    </div>
  )
}

