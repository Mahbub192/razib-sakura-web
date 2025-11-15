import Link from 'next/link'
import { DoctorSidebar } from '@/components/layout/DoctorSidebar'

export default function DoctorPatients() {
  const patients = [
    {
      id: 'P001',
      name: 'Liam Johnson',
      avatar: 'L',
      phone: '(123) 456-7890',
      email: 'liam.j@example.com',
      lastAppointment: 'Oct 26, 2023',
      prescriptions: 2,
    },
    {
      id: 'P002',
      name: 'Olivia Chen',
      avatar: 'O',
      phone: '(234) 567-8901',
      email: 'olivia.c@example.com',
      lastAppointment: 'Oct 26, 2023',
      prescriptions: 0,
    },
    {
      id: 'P003',
      name: 'Noah Taylor',
      avatar: 'N',
      phone: '(345) 678-9012',
      email: 'noah.t@example.com',
      lastAppointment: 'Oct 25, 2023',
      prescriptions: 1,
    },
    {
      id: 'P004',
      name: 'Emma Wilson',
      avatar: 'E',
      phone: '(456) 789-0123',
      email: 'emma.w@example.com',
      lastAppointment: 'Oct 24, 2023',
      prescriptions: 3,
    },
    {
      id: 'P005',
      name: 'Jane Smith',
      avatar: 'JS',
      phone: '(567) 890-1234',
      email: 'jane.s@example.com',
      lastAppointment: 'Oct 23, 2023',
      prescriptions: 0,
    },
    {
      id: 'P006',
      name: 'John Doe',
      avatar: 'JD',
      phone: '(678) 901-2345',
      email: 'john.d@example.com',
      lastAppointment: 'Oct 22, 2023',
      prescriptions: 1,
    },
  ]

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <DoctorSidebar />
      
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#111418] dark:text-white mb-2">Find a Patient</h1>
            <p className="text-[#617589] dark:text-gray-400">Search and manage patient records.</p>
          </div>
          <Link
            href="/doctor/patients/new"
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center gap-2"
          >
            <span className="material-symbols-outlined">add</span>
            Add New Patient
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#617589] dark:text-gray-400">
              search
            </span>
            <input
              type="text"
              placeholder="Search by Patient Name, ID, Phone..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-[#111418] dark:text-white">
            <option>All Dates</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
          <button className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">tune</span>
            Filter
          </button>
        </div>

        {/* Results Summary */}
        <div className="mb-4 text-sm text-[#617589] dark:text-gray-400">
          Showing 5 of 150 results
        </div>

        {/* Patients Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#111418] dark:text-white">
                  PATIENT NAME
                  <span className="material-symbols-outlined text-xs ml-1">unfold_more</span>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#111418] dark:text-white">
                  PATIENT ID
                  <span className="material-symbols-outlined text-xs ml-1">unfold_more</span>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#111418] dark:text-white">
                  DOB
                  <span className="material-symbols-outlined text-xs ml-1">unfold_more</span>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#111418] dark:text-white">
                  PHONE NUMBER
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#111418] dark:text-white">
                  LAST VISIT
                  <span className="material-symbols-outlined text-xs ml-1">unfold_more</span>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#111418] dark:text-white">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {patients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-primary font-semibold text-sm">{patient.avatar}</span>
                      </div>
                      <span className="font-medium text-[#111418] dark:text-white">{patient.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#617589] dark:text-gray-400">{patient.id}</td>
                  <td className="px-6 py-4 text-sm text-[#617589] dark:text-gray-400">1985-06-15</td>
                  <td className="px-6 py-4 text-sm text-[#617589] dark:text-gray-400">{patient.phone}</td>
                  <td className="px-6 py-4 text-sm text-[#617589] dark:text-gray-400">{patient.lastAppointment}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/doctor/patients/${patient.id}`}
                        className="text-primary hover:underline text-sm"
                      >
                        View
                      </Link>
                      <span className="text-[#617589] dark:text-gray-400">/</span>
                      <Link
                        href={`/doctor/patients/${patient.id}/edit`}
                        className="text-primary hover:underline text-sm"
                      >
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-between items-center">
          <p className="text-sm text-[#617589] dark:text-gray-400">Showing 1 to 6 of 100 Entries</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
              Previous
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm">1</button>
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
              2
            </button>
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
              3
            </button>
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

