import Link from 'next/link'
import { PatientSidebar } from '@/components/layout/PatientSidebar'

export default function MedicalRecords() {
  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <PatientSidebar />
      
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#111418] dark:text-white mb-2">My Medical Records</h1>
            <p className="text-[#617589] dark:text-gray-400">
              A complete history of your diagnoses, treatments, and medications.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">print</span>
              Print Records
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">download</span>
              Download Records
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#617589] dark:text-gray-400">
              search
            </span>
            <input
              type="text"
              placeholder="Search records..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-[#111418] dark:text-white">
            <option>Record Type: All</option>
            <option>Diagnoses</option>
            <option>Medications</option>
            <option>Allergies</option>
          </select>
          <select className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-[#111418] dark:text-white">
            <option>Date Range</option>
          </select>
        </div>

        {/* Category Tabs */}
        <div className="mb-6 flex gap-2 border-b border-gray-200 dark:border-gray-700">
          {['All Records', 'Diagnoses', 'Medications', 'Allergies', 'Vaccinations', 'Lab Results'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 border-b-2 transition-colors ${
                tab === 'All Records'
                  ? 'border-primary text-primary font-semibold'
                  : 'border-transparent text-[#617589] dark:text-gray-400 hover:text-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Records List */}
        <div className="space-y-4">
          {/* Record 1 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">science</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-[#111418] dark:text-white">Annual Blood Panel</h3>
                    <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded mt-1">
                      Lab Result
                    </span>
                  </div>
                  <span className="text-sm text-[#617589] dark:text-gray-400">October 28, 2023</span>
                </div>
                <p className="text-[#617589] dark:text-gray-400 mb-2">
                  Results from your annual physical are available. All markers are within normal range.
                </p>
                <p className="text-sm text-[#617589] dark:text-gray-400 mb-3">Provider: Dr. Evelyn Reed</p>
                <Link href="#" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
                  View Full Report (PDF)
                  <span className="material-symbols-outlined text-sm">description</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Record 2 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-green-600 dark:text-green-400">medication</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-[#111418] dark:text-white">Lisinopril (20mg)</h3>
                    <span className="inline-block px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded mt-1">
                      Medication - Active
                    </span>
                  </div>
                  <span className="text-sm text-[#617589] dark:text-gray-400">September 15, 2023</span>
                </div>
                <p className="text-[#617589] dark:text-gray-400 mb-2">
                  Prescription renewed for high blood pressure management. Dosage: One tablet daily.
                </p>
                <p className="text-sm text-[#617589] dark:text-gray-400">Prescribing Doctor: Dr. Evelyn Reed</p>
              </div>
            </div>
          </div>

          {/* Record 3 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400">favorite</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-[#111418] dark:text-white">Hypertension</h3>
                    <span className="inline-block px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs rounded mt-1">
                      Diagnosis - Resolved
                    </span>
                  </div>
                  <span className="text-sm text-[#617589] dark:text-gray-400">July 05, 2023</span>
                </div>
                <p className="text-[#617589] dark:text-gray-400 mb-2">
                  Initial diagnosis of high blood pressure during a routine check-up.
                </p>
                <p className="text-sm text-[#617589] dark:text-gray-400">Diagnosing Doctor: Dr. Evelyn Reed</p>
              </div>
            </div>
          </div>

          {/* Record 4 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-red-600 dark:text-red-400">warning</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-[#111418] dark:text-white">Penicillin Allergy</h3>
                    <span className="inline-block px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs rounded mt-1">
                      Allergy - Confirmed
                    </span>
                  </div>
                  <span className="text-sm text-[#617589] dark:text-gray-400">May 20, 2023</span>
                </div>
                <p className="text-[#617589] dark:text-gray-400 mb-2">
                  Patient reported rash and hives after taking Amoxicillin. Added to permanent record.
                </p>
                <p className="text-sm text-[#617589] dark:text-gray-400">Noted by: Dr. Evelyn Reed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center gap-2">
          <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg">1</button>
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            2
          </button>
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            3
          </button>
          <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </main>
    </div>
  )
}

