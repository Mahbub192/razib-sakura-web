import Link from 'next/link'
import { DoctorSidebar } from '@/components/layout/DoctorSidebar'

export default function DoctorReports() {
  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <DoctorSidebar />
      
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#111418] dark:text-white mb-2">Analytics & Reports</h1>
            <p className="text-[#617589] dark:text-gray-400">View key metrics and generate reports.</p>
          </div>
          <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined">download</span>
            Export All Reports
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">Date Range</label>
            <input
              type="text"
              defaultValue="Oct 1, 2024 - Oct 31, 2024"
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">Doctor</label>
            <select className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary">
              <option>Dr. Anya Sharma</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">Assistant</label>
            <select className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary">
              <option>All Assistants</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold">
              Apply Filters
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <p className="text-sm text-[#617589] dark:text-gray-400 mb-2">Total Appointments</p>
            <p className="text-3xl font-bold text-[#111418] dark:text-white mb-1">245</p>
            <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              10% vs last month
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <p className="text-sm text-[#617589] dark:text-gray-400 mb-2">Completed</p>
            <p className="text-3xl font-bold text-[#111418] dark:text-white mb-1">210</p>
            <p className="text-sm text-green-600 dark:text-green-400">85.7% Completion Rate</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <p className="text-sm text-[#617589] dark:text-gray-400 mb-2">Missed / Canceled</p>
            <p className="text-3xl font-bold text-[#111418] dark:text-white mb-1">35</p>
            <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">trending_down</span>
              -5% vs last month
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <p className="text-sm text-[#617589] dark:text-gray-400 mb-2">Revenue (est.)</p>
            <p className="text-3xl font-bold text-[#111418] dark:text-white mb-1">$31,500</p>
            <p className="text-sm text-[#617589] dark:text-gray-400">Avg. $150 / appointment</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Appointment Volume */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#111418] dark:text-white">Appointment Volume</h2>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                  Day
                </button>
                <button className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                  Week
                </button>
                <button className="px-3 py-1 text-sm bg-primary text-white rounded">Month</button>
              </div>
            </div>
            <div className="h-64 flex items-center justify-center text-[#617589] dark:text-gray-400">
              Chart data for appointments per month would be displayed here.
            </div>
          </div>

          {/* Patient Demographics */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-[#111418] dark:text-white mb-4">Patient Demographics</h2>
            <div className="h-48 flex items-center justify-center text-[#617589] dark:text-gray-400 mb-4">
              Patient age/gender chart would be displayed here.
            </div>
            <div className="space-y-3">
              {[
                { age: 'Age 0-18', percentage: 15, color: 'bg-primary' },
                { age: 'Age 19-45', percentage: 45, color: 'bg-primary' },
                { age: 'Age 46+', percentage: 40, color: 'bg-green-500' },
              ].map((item) => (
                <div key={item.age}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#111418] dark:text-white">{item.age}</span>
                    <span className="text-[#617589] dark:text-gray-400">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`${item.color} h-2 rounded-full`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

