import Link from 'next/link'
import { PatientSidebar } from '@/components/layout/PatientSidebar'

export default function LabResults() {
  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <PatientSidebar />
      
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#111418] dark:text-white mb-2">Lab Results</h1>
            <p className="text-[#617589] dark:text-gray-400">View your latest and historical lab results.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">download</span>
              Download
            </button>
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">print</span>
              Print
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-4">
          <select className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-[#111418] dark:text-white">
            <option>All Test Types</option>
            <option>Blood Test</option>
            <option>Urine Test</option>
            <option>Other</option>
          </select>
          <input
            type="date"
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-[#111418] dark:text-white"
          />
        </div>

        {/* Lab Results Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#111418] dark:text-white">Test Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#111418] dark:text-white">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#111418] dark:text-white">Result</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#111418] dark:text-white">Reference Range</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#111418] dark:text-white">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-6 py-4 text-sm text-[#111418] dark:text-white">Complete Blood Count (CBC)</td>
                <td className="px-6 py-4 text-sm text-[#617589] dark:text-gray-400">Nov 10, 2023</td>
                <td className="px-6 py-4 text-sm">
                  <Link href="#" className="text-primary hover:underline">See Details</Link>
                </td>
                <td className="px-6 py-4 text-sm text-[#617589] dark:text-gray-400">Varies by component</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                    Normal
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-[#111418] dark:text-white">Lipid Panel</td>
                <td className="px-6 py-4 text-sm text-[#617589] dark:text-gray-400">Nov 10, 2023</td>
                <td className="px-6 py-4 text-sm text-[#111418] dark:text-white">190 mg/dL</td>
                <td className="px-6 py-4 text-sm text-[#617589] dark:text-gray-400">&lt; 200 mg/dL</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                    Normal
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-[#111418] dark:text-white">Glucose (Fasting)</td>
                <td className="px-6 py-4 text-sm text-[#617589] dark:text-gray-400">Nov 10, 2023</td>
                <td className="px-6 py-4 text-sm text-orange-600 dark:text-orange-400 font-semibold">115 mg/dL</td>
                <td className="px-6 py-4 text-sm text-[#617589] dark:text-gray-400">70-99 mg/dL</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-semibold rounded-full">
                    Borderline High
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-[#111418] dark:text-white">Vitamin D, 25-Hydroxy</td>
                <td className="px-6 py-4 text-sm text-[#617589] dark:text-gray-400">Sep 05, 2023</td>
                <td className="px-6 py-4 text-sm text-red-600 dark:text-red-400 font-semibold">18 ng/mL</td>
                <td className="px-6 py-4 text-sm text-[#617589] dark:text-gray-400">30-100 ng/mL</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-semibold rounded-full">
                    Low
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-[#111418] dark:text-white">Thyroid-Stimulating Hormone (TSH)</td>
                <td className="px-6 py-4 text-sm text-[#617589] dark:text-gray-400">Sep 05, 2023</td>
                <td className="px-6 py-4 text-sm text-[#111418] dark:text-white">2.5 mIU/L</td>
                <td className="px-6 py-4 text-sm text-[#617589] dark:text-gray-400">0.4-4.0 mIU/L</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                    Normal
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Doctor's Notes */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="flex gap-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <div className="text-center">
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">NOV</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">11</p>
              </div>
            </div>
            <div className="flex-1">
              <p className="font-bold text-[#111418] dark:text-white mb-2">Note from Dr. Anya Sharma</p>
              <p className="text-[#617589] dark:text-gray-400 leading-relaxed">
                Hi Amelia, your recent lab results are in. Overall, things look good. Your Lipid Panel is within the normal range, which is great news. However, your fasting glucose is slightly elevated. Let's discuss some minor dietary adjustments at your next appointment. I've also sent a prescription for a Vitamin D supplement to address the low level we found. If you have any questions, please send me a message.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

