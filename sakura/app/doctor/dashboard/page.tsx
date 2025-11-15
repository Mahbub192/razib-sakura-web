import Link from 'next/link'
import { DoctorSidebar } from '@/components/layout/DoctorSidebar'

export default function DoctorDashboard() {
  const today = new Date()
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' })
  const dateStr = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <DoctorSidebar />
      
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#111418] dark:text-white mb-2">
              Welcome, Dr. Sharma!
            </h1>
            <p className="text-[#617589] dark:text-gray-400">
              {dayName}, {dateStr}
            </p>
          </div>
          <Link
            href="/doctor/calendar"
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center gap-2"
          >
            <span className="material-symbols-outlined">add</span>
            Add New Appointment
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Today's Appointments */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-[#111418] dark:text-white mb-4">Today's Appointments</h2>
            <div className="space-y-4">
              {/* Appointment 1 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">L</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-[#111418] dark:text-white">09:00 AM - Liam Gallagher</p>
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    </div>
                    <p className="text-sm text-[#617589] dark:text-gray-400">Annual Check-up</p>
                  </div>
                </div>
              </div>

              {/* Appointment 2 - Highlighted */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 border-primary p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">O</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-[#111418] dark:text-white">10:00 AM - Olivia Chen</p>
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                    </div>
                    <p className="text-sm text-[#617589] dark:text-gray-400">Follow-up Visit</p>
                  </div>
                </div>
              </div>

              {/* Appointment 3 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">B</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-[#111418] dark:text-white">11:00 AM - Ben Carter</p>
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    </div>
                    <p className="text-sm text-[#617589] dark:text-gray-400">Consultation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Calendar Widget */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-[#111418] dark:text-white">October 2024</h3>
                <div className="flex gap-2">
                  <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                  </button>
                  <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                  <div key={day} className="py-2 text-[#617589] dark:text-gray-400 font-semibold">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <div
                    key={day}
                    className={`py-2 rounded ${
                      day === 28
                        ? 'bg-primary text-white'
                        : 'text-[#111418] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>

            {/* Patient Detail Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold">O</span>
                </div>
                <div>
                  <p className="font-semibold text-[#111418] dark:text-white">Olivia Chen</p>
                  <p className="text-xs text-[#617589] dark:text-gray-400">DOB: 05/12/1985</p>
                </div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
                <p className="text-xs font-semibold text-red-700 dark:text-red-400 mb-1">CRITICAL ALERTS</p>
                <p className="text-sm text-red-600 dark:text-red-400">Allergy: Penicillin</p>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors">
                  View History
                </button>
                <button className="flex-1 px-3 py-2 bg-primary/10 text-primary text-sm rounded-lg hover:bg-primary/20 transition-colors">
                  Add Note
                </button>
              </div>
            </div>

            {/* Tasks for Today */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="font-semibold text-[#111418] dark:text-white mb-3">Tasks for Today</h3>
              <div className="space-y-2">
                {[
                  { task: 'Follow up with Patient X', completed: false },
                  { task: 'Prepare lab reports for Jane Doe', completed: true },
                  { task: 'Review new patient applications', completed: false },
                  { task: 'Order new supplies', completed: false },
                ].map((item, index) => (
                  <label key={index} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      className="w-4 h-4 text-primary rounded focus:ring-primary"
                      readOnly
                    />
                    <span className={`text-sm ${item.completed ? 'line-through text-[#617589] dark:text-gray-400' : 'text-[#111418] dark:text-white'}`}>
                      {item.task}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Quick Add Patient */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="font-semibold text-[#111418] dark:text-white mb-3">Quick Add Patient</h3>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button className="w-full px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors">
                  Add Patient
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments This Week Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-[#111418] dark:text-white mb-4">Appointments This Week</h2>
          <div className="flex items-end gap-4 h-48">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <div key={day} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-full rounded-t transition-colors ${
                    day === 'Tue'
                      ? 'bg-primary h-32'
                      : index === 0 || index === 2 || index === 3
                      ? 'bg-primary/40 h-24'
                      : 'bg-gray-200 dark:bg-gray-700 h-8'
                  }`}
                ></div>
                <p className={`mt-2 text-sm font-semibold ${day === 'Tue' ? 'text-primary' : 'text-[#617589] dark:text-gray-400'}`}>
                  {day}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <p className="text-sm text-[#617589] dark:text-gray-400 mb-2">Total Patients</p>
            <p className="text-4xl font-bold text-[#111418] dark:text-white mb-1">850</p>
            <p className="text-sm text-green-600 dark:text-green-400">+1.5% this month</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <p className="text-sm text-[#617589] dark:text-gray-400 mb-2">Appointments Today</p>
            <p className="text-4xl font-bold text-[#111418] dark:text-white mb-1">12</p>
            <p className="text-sm text-red-600 dark:text-red-400">-5% vs yesterday</p>
          </div>
        </div>
      </main>
    </div>
  )
}

