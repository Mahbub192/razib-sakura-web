import Link from 'next/link'
import { PatientSidebar } from '@/components/layout/PatientSidebar'

export default function Prescriptions() {
  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <PatientSidebar />
      
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#111418] dark:text-white mb-2">Your Prescriptions</h1>
          <p className="text-[#617589] dark:text-gray-400">View and manage your current and past medications.</p>
        </div>

        {/* Active Prescriptions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-[#111418] dark:text-white mb-4">Active Prescriptions</h2>
          <div className="space-y-4">
            {/* Prescription 1 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-2">Lisinopril</h3>
                  <p className="text-[#617589] dark:text-gray-400 mb-1">10mg, once daily</p>
                  <p className="text-sm text-[#617589] dark:text-gray-400 mb-3">Prescribed by: Dr. Anya Sharma</p>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-sm">check_circle</span>
                    <span className="text-sm text-[#617589] dark:text-gray-400">3 available</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button className="text-[#617589] dark:text-gray-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">info</span>
                  </button>
                  <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold">
                    Request Refill
                  </button>
                </div>
              </div>
            </div>

            {/* Prescription 2 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-2">Metformin</h3>
                  <p className="text-[#617589] dark:text-gray-400 mb-1">500mg, twice daily</p>
                  <p className="text-sm text-[#617589] dark:text-gray-400 mb-3">Prescribed by: Dr. Anya Sharma</p>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-sm">cancel</span>
                    <span className="text-sm text-[#617589] dark:text-gray-400">No refills</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button className="text-[#617589] dark:text-gray-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">info</span>
                  </button>
                  <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold">
                    Request Refill
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Past Prescriptions */}
        <div>
          <h2 className="text-xl font-bold text-[#111418] dark:text-white mb-4">Past Prescriptions</h2>
          <div className="space-y-4">
            {/* Prescription 1 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-2">Amoxicillin</h3>
                  <p className="text-[#617589] dark:text-gray-400 mb-1">500mg, three times daily for 7 days</p>
                  <p className="text-sm text-[#617589] dark:text-gray-400 mb-3">Prescribed by: Dr. Anya Sharma</p>
                  <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-[#617589] dark:text-gray-400 text-xs font-semibold rounded-full">
                    Inactive
                  </span>
                </div>
                <button className="text-[#617589] dark:text-gray-400 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">info</span>
                </button>
              </div>
            </div>

            {/* Prescription 2 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-2">Ibuprofen</h3>
                  <p className="text-[#617589] dark:text-gray-400 mb-1">200mg, as needed for pain</p>
                  <p className="text-sm text-[#617589] dark:text-gray-400 mb-3">Prescribed by: Dr. Anya Sharma</p>
                  <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-[#617589] dark:text-gray-400 text-xs font-semibold rounded-full">
                    Inactive
                  </span>
                </div>
                <button className="text-[#617589] dark:text-gray-400 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">info</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

