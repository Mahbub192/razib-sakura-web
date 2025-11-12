'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function AssistantDashboardPage() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Prepare patient files for Dr. Sharma', completed: false },
    { id: 2, text: 'Update appointment schedule', completed: true },
    { id: 3, text: 'Check inventory for medical supplies', completed: false },
    { id: 4, text: 'Follow up on pending lab results', completed: false },
  ])

  const [quickAddPatient, setQuickAddPatient] = useState({
    name: '',
    email: '',
  })

  const handleTaskToggle = (id: number) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement add patient logic
    console.log('Adding patient:', quickAddPatient)
    setQuickAddPatient({ name: '', email: '' })
  }

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

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
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary"
            >
              <span className="material-symbols-outlined fill text-2xl">dashboard</span>
              <p className="text-sm font-semibold leading-normal">Dashboard</p>
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
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-normal">Appointments Today</p>
            <p className="text-gray-900 dark:text-white tracking-light text-3xl font-bold leading-tight">12</p>
            <p className="text-green-600 dark:text-green-500 text-sm font-medium leading-normal">+2 from yesterday</p>
          </div>
          <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-4 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-normal">Tasks Completed</p>
            <p className="text-gray-900 dark:text-white tracking-light text-3xl font-bold leading-tight">8/12</p>
            <p className="text-blue-600 dark:text-blue-500 text-sm font-medium leading-normal">67% done</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-6 sm:gap-8">
          {/* Header */}
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-gray-900 dark:text-white text-2xl sm:text-3xl font-bold leading-tight">
                Welcome, Sarah!
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base font-normal leading-normal">
                {currentDate}
              </p>
            </div>
            <button className="flex items-center justify-center gap-2 rounded-lg h-10 sm:h-11 px-4 sm:px-5 bg-primary text-white text-sm font-bold leading-normal shadow-sm hover:bg-primary/90 transition-colors w-full sm:w-auto">
              <span className="material-symbols-outlined text-lg sm:text-xl">add</span>
              <span className="truncate">Add New Task</span>
            </button>
          </div>

          {/* Today's Appointments */}
          <div className="flex flex-col gap-4">
            <h2 className="text-gray-900 dark:text-white text-lg sm:text-xl font-bold leading-tight">
              Today's Appointments
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Appointment Card 1 */}
              <div className="flex items-center gap-4 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD6LKvMY5NoTGvX9fFysQ8wdiAzn6P60tgdXsFxWw1V0NdDAabqJfia7FrGm1CNyUFyyLp2Pna_3GQV65JnubDnOT96zLrgW0erK16tZYQU4HkkYadiM0QRbHstW5jjxXXcSIgI3HlqlSH4FxKVfIfDyQ2gT0tAwK7cemlVJO8QB4fNXvPaOJ87c5yM3GwLYdqht7ytK0VVa8lJ7HgmZ6yA7prhl8q9h_9c6xDUg4iTPHmt4rE0jGHKw_VTZ0fKDeXQVVs_TBOuDN8")',
                  }}
                />
                <div className="flex flex-col justify-center flex-1">
                  <p className="text-gray-900 dark:text-white text-base font-semibold leading-normal">09:00 AM - Liam Gallagher</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">Annual Check-up</p>
                </div>
                <div className="shrink-0">
                  <div className="flex size-7 items-center justify-center">
                    <div className="size-3 rounded-full bg-green-500" title="Completed"></div>
                  </div>
                </div>
              </div>

              {/* Appointment Card 2 - Active */}
              <div className="flex items-center gap-4 bg-white dark:bg-gray-900 p-4 rounded-xl border-2 border-primary dark:border-primary shadow-lg">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDNnw-1wr2XEFp0Z4W80zkaiwhp0r9jN5VcT_QpQLWj3_Qd7XP3E7jsMDLzZc-T1I3Jw6lDaVlom1h_lxThxNwlxGBA9Hhs346UJOFkQkd29aoIV-FIffCeVHnOZnDg2lAC0IfBQ5nsuarLdt2JrM6dDLEaXIBGBxjrYNnjouccBYCGP33sVm7ZCJXUJQVPr335RTbGmEpdXrxAHe-3QsDPah2KJMUwrcMdCIubuZ_9h8E4C57eLznfLw-649hFjpbGaFW4VhTZQlY")',
                  }}
                />
                <div className="flex flex-col justify-center flex-1">
                  <p className="text-gray-900 dark:text-white text-base font-semibold leading-normal">10:00 AM - Olivia Chen</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">Follow-up Visit</p>
                </div>
                <div className="shrink-0">
                  <div className="flex size-7 items-center justify-center">
                    <div className="size-3 rounded-full bg-blue-500 animate-pulse" title="Checked-in"></div>
                  </div>
                </div>
              </div>

              {/* Appointment Card 3 */}
              <div className="flex items-center gap-4 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC_CcNDG9AWCMBn5blhXGIpm13s_FztWb2BsWnUyyBWnYZpS43fGvS8X_JdQ7vfZRhrdFZ6oRFrnMICzh65RUpGuHJs4rVv9EHaDKr65goK6lPslHDYpPCxkgQPZt0iNomzZ-fWYJF-VaEwtD4fBESUTaLpCMiAyamGCNxkzUtKnkRM0iArmDqAk1z4T1TskQZMTDgVqZwgnhaMWy8_iS-tdyEAsMA9GkUpxJN7MaI3liOWpzKuQnaU5cK5AuF2yv5qsnk3OL4RtCQ")',
                  }}
                />
                <div className="flex flex-col justify-center flex-1">
                  <p className="text-gray-900 dark:text-white text-base font-semibold leading-normal">11:00 AM - Ben Carter</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">Consultation</p>
                </div>
                <div className="shrink-0">
                  <div className="flex size-7 items-center justify-center">
                    <div className="size-3 rounded-full bg-teal-500" title="Confirmed"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts and Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Data Visualization */}
            <div className="lg:col-span-2 flex flex-col gap-4 bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-800">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                Appointments This Week
              </h3>
              <div className="w-full h-48 sm:h-64 flex items-end gap-2 sm:gap-3 md:gap-4 lg:gap-6 px-2 overflow-x-auto">
                <div className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
                  <div className="bg-primary/20 dark:bg-primary/30 w-full rounded-lg" style={{ height: '60%' }}></div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Mon</p>
                </div>
                <div className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
                  <div className="bg-primary w-full rounded-lg" style={{ height: '80%' }}></div>
                  <p className="text-xs font-bold text-primary">Tue</p>
                </div>
                <div className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
                  <div className="bg-primary/20 dark:bg-primary/30 w-full rounded-lg" style={{ height: '45%' }}></div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Wed</p>
                </div>
                <div className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
                  <div className="bg-primary/20 dark:bg-primary/30 w-full rounded-lg" style={{ height: '70%' }}></div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Thu</p>
                </div>
                <div className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
                  <div className="bg-primary/20 dark:bg-primary/30 w-full rounded-lg" style={{ height: '55%' }}></div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Fri</p>
                </div>
                <div className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
                  <div className="bg-gray-200 dark:bg-gray-700 w-full rounded-lg" style={{ height: '20%' }}></div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Sat</p>
                </div>
                <div className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
                  <div className="bg-gray-200 dark:bg-gray-700 w-full rounded-lg" style={{ height: '10%' }}></div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Sun</p>
                </div>
              </div>
            </div>

            {/* Tasks */}
            <div className="flex flex-col gap-4 bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-800">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Tasks for Today</h3>
              <div className="flex flex-col gap-3">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleTaskToggle(task.id)}
                      className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary/50 dark:bg-gray-700 dark:border-gray-600"
                      id={`task${task.id}`}
                    />
                    <label
                      htmlFor={`task${task.id}`}
                      className={`text-sm text-gray-700 dark:text-gray-300 ${task.completed ? 'line-through' : ''}`}
                    >
                      {task.text}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="w-80 flex-col border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 hidden xl:flex">
        <div className="flex flex-col gap-6">
          {/* Mini Calendar */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">October 2024</h3>
              <div className="flex items-center gap-2">
                <button className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">
                  <span className="material-symbols-outlined text-xl">chevron_left</span>
                </button>
                <button className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">
                  <span className="material-symbols-outlined text-xl">chevron_right</span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 text-center text-xs text-gray-500 dark:text-gray-400">
              <span className="py-2">Su</span>
              <span className="py-2">Mo</span>
              <span className="py-2">Tu</span>
              <span className="py-2">We</span>
              <span className="py-2">Th</span>
              <span className="py-2">Fr</span>
              <span className="py-2">Sa</span>
            </div>
            <div className="grid grid-cols-7 text-center text-sm">
              <span className="py-2 text-gray-400 dark:text-gray-600">29</span>
              <span className="py-2 text-gray-400 dark:text-gray-600">30</span>
              <span className="py-2">1</span>
              <span className="py-2">2</span>
              <span className="py-2">3</span>
              <span className="py-2">4</span>
              <span className="py-2">5</span>
              <span className="py-2">6</span>
              <span className="py-2">7</span>
              <span className="py-2">8</span>
              <span className="py-2">9</span>
              <span className="py-2">10</span>
              <span className="py-2">11</span>
              <span className="py-2">12</span>
              <span className="py-2">13</span>
              <span className="py-2">14</span>
              <span className="py-2">15</span>
              <span className="py-2">16</span>
              <span className="py-2">17</span>
              <span className="py-2">18</span>
              <span className="py-2">19</span>
              <span className="py-2">20</span>
              <span className="py-2">21</span>
              <span className="py-2">22</span>
              <span className="py-2">23</span>
              <span className="py-2">24</span>
              <span className="py-2">25</span>
              <span className="py-2">26</span>
              <span className="py-2">27</span>
              <span className="py-2 relative">
                <span className="absolute inset-0 flex items-center justify-center size-8 mx-auto bg-primary text-white rounded-full">28</span>
              </span>
              <span className="py-2">29</span>
              <span className="py-2">30</span>
              <span className="py-2">31</span>
              <span className="py-2 text-gray-400 dark:text-gray-600">1</span>
              <span className="py-2 text-gray-400 dark:text-gray-600">2</span>
            </div>
          </div>

          {/* Selected Patient Profile */}
          <div className="flex flex-col gap-4 p-4 rounded-xl bg-background-light dark:bg-background-dark">
            <div className="flex items-center gap-4">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-16"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDbZTssH7T60lZtqKOqkw7A6jUvx2SiUSke4aW4Ss7MPiFvPdm38OXBH70w3cq4XBluI5WbWwID0mh4iP_yVhVFh5UzedD1g1lW3XxfhiyLJYwI84AagT_KmsdbMsROYuTmK1mRlSJRtQh6bhAYWWTcq9C2Vn5Cla8LC9aW33eenNmCJ2qgsSu_T1KeWViThCDoDNQdAARNRQgyEvXyIxtbVO3x5Q0Mbm3cuu7Iq_6bFC5TJ_0lgxutxkUxQN943ZbjCWSUqILuZBo")',
                }}
              />
              <div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">Olivia Chen</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">DOB: 05/12/1985</p>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h5 className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 tracking-wider mb-2">
                Critical Alerts
              </h5>
              <p className="text-sm text-red-600 dark:text-red-500 bg-red-500/10 p-2 rounded-lg">Allergy: Penicillin</p>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-bold hover:bg-gray-300 dark:hover:bg-gray-600">
                View History
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary/20 dark:bg-primary/30 text-primary dark:text-primary text-sm font-bold hover:bg-primary/30 dark:hover:bg-primary/40">
                Add Note
              </button>
            </div>
          </div>

          {/* Quick Add Patient */}
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Quick Add Patient</h3>
            <form onSubmit={handleQuickAddSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Full Name"
                value={quickAddPatient.name}
                onChange={(e) => setQuickAddPatient((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:border-primary focus:ring-primary/50 px-3 py-2"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={quickAddPatient.email}
                onChange={(e) => setQuickAddPatient((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:border-primary focus:ring-primary/50 px-3 py-2"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold shadow-sm hover:bg-primary/90"
              >
                Add Patient
              </button>
            </form>
          </div>
        </div>
      </aside>
    </div>
  )
}

