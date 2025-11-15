import Link from 'next/link'
import { PatientSidebar } from '@/components/layout/PatientSidebar'

export default function PatientAppointments() {
  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <PatientSidebar />
      
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#111418] dark:text-white mb-2">My Appointments</h1>
          </div>
          <Link
            href="/patient/appointments/book"
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
          >
            Book New Appointment
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
          <button className="px-4 py-2 border-b-2 border-primary text-primary font-semibold">
            Upcoming
          </button>
          <button className="px-4 py-2 text-[#617589] dark:text-gray-400 hover:text-primary transition-colors">
            Past
          </button>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {/* Appointment 1 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex gap-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-semibold text-xl">E</span>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-[#111418] dark:text-white">Dr. Evelyn Reed</h3>
                    <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full mt-1">
                      Confirmed
                    </span>
                  </div>
                </div>
                <p className="text-[#617589] dark:text-gray-400 mb-2">Cardiology - City Health Clinic</p>
                <p className="text-[#617589] dark:text-gray-400 mb-4">Mon, 23 Oct 2024 at 10:30 AM</p>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-primary/10 text-primary text-sm font-semibold rounded-lg hover:bg-primary/20 transition-colors">
                    Reschedule
                  </button>
                  <button className="px-4 py-2 text-[#617589] dark:text-gray-400 text-sm hover:text-red-600 dark:hover:text-red-400 transition-colors">
                    Cancel
                  </button>
                  <Link
                    href="/patient/appointments/1"
                    className="ml-auto text-primary text-sm font-semibold hover:underline"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment 2 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex gap-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-semibold text-xl">B</span>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-[#111418] dark:text-white">Dr. Ben Carter</h3>
                    <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full mt-1">
                      Confirmed
                    </span>
                  </div>
                </div>
                <p className="text-[#617589] dark:text-gray-400 mb-2">Dermatology - Skin Wellness Center</p>
                <p className="text-[#617589] dark:text-gray-400 mb-4">Fri, 15 Nov 2024 at 2:00 PM</p>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-primary/10 text-primary text-sm font-semibold rounded-lg hover:bg-primary/20 transition-colors">
                    Reschedule
                  </button>
                  <button className="px-4 py-2 text-[#617589] dark:text-gray-400 text-sm hover:text-red-600 dark:hover:text-red-400 transition-colors">
                    Cancel
                  </button>
                  <Link
                    href="/patient/appointments/2"
                    className="ml-auto text-primary text-sm font-semibold hover:underline"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

