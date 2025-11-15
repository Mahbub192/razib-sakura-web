import Link from 'next/link'
import { DoctorSidebar } from '@/components/layout/DoctorSidebar'

export default function DoctorCalendar() {
  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <DoctorSidebar />
      
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#111418] dark:text-white mb-2">Calendar</h1>
            <p className="text-[#617589] dark:text-gray-400">Manage your appointments and schedule.</p>
          </div>
          <Link
            href="/doctor/calendar/new"
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center gap-2"
          >
            <span className="material-symbols-outlined">add</span>
            Create Appointment Slots
          </Link>
        </div>

        {/* Calendar View */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#111418] dark:text-white">October 2024</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
                Day
              </button>
              <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm">Week</button>
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
                Month
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-semibold text-[#617589] dark:text-gray-400 py-2">
                {day}
              </div>
            ))}
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <div
                key={day}
                className={`min-h-24 p-2 border border-gray-200 dark:border-gray-700 rounded-lg ${
                  day === 17
                    ? 'bg-primary/10 border-primary'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className={`text-sm font-semibold mb-1 ${day === 17 ? 'text-primary' : 'text-[#111418] dark:text-white'}`}>
                  {day}
                </div>
                {day === 17 && (
                  <div className="space-y-1">
                    <div className="text-xs bg-primary text-white px-2 py-1 rounded">10:00 AM</div>
                    <div className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">2:00 PM</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

