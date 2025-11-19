'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authApi } from '@/lib/api/auth'
import { adminApi, AdminClinic } from '@/lib/api/admin'
import AdminSidebar from '@/components/layout/AdminSidebar'

export default function AdminClinicsPage() {
  const router = useRouter()
  const [clinics, setClinics] = useState<AdminClinic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const currentUser = authApi.getCurrentUser()
    if (!currentUser || currentUser.role !== 'admin') {
      router.push('/auth/login')
      return
    }

    fetchClinics()
  }, [router, page, search])

  const fetchClinics = async () => {
    try {
      setLoading(true)
      const response = await adminApi.getClinics({
        search: search || undefined,
        page,
        limit: 10,
      })

      if (response.success && response.data) {
        setClinics(response.data.clinics)
        setTotalPages(response.data.pagination.totalPages)
        setTotal(response.data.pagination.total)
      } else {
        setError('Failed to load clinics')
      }
    } catch (err) {
      setError('Failed to load clinics')
      console.error('Clinics fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <AdminSidebar />
      <div className="ml-64">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <h1 className="text-2xl font-bold text-[#111418] dark:text-white">Clinic Management</h1>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Search clinics..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-[#111418] dark:text-white"
            />
          </div>

          {/* Clinics Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-[#617589] dark:text-gray-400">Loading clinics...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <button
                onClick={fetchClinics}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : clinics.length === 0 ? (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-6xl text-[#617589] dark:text-gray-400 mb-4">
                local_hospital
              </span>
              <p className="text-[#617589] dark:text-gray-400">No clinics found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {clinics.map((clinic) => (
                  <div
                    key={clinic.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      {clinic.logo ? (
                        <img src={clinic.logo} alt={clinic.name} className="w-16 h-16 rounded-lg" />
                      ) : (
                        <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary text-2xl">
                            local_hospital
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-bold text-[#111418] dark:text-white">{clinic.name}</h3>
                        <p className="text-sm text-[#617589] dark:text-gray-400">
                          {clinic.totalDoctors} doctors
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-[#617589] dark:text-gray-400">
                        <span className="material-symbols-outlined text-base align-middle mr-2">place</span>
                        {clinic.address}
                      </p>
                      <p className="text-sm text-[#617589] dark:text-gray-400">
                        <span className="material-symbols-outlined text-base align-middle mr-2">phone</span>
                        {clinic.phone}
                      </p>
                      <p className="text-sm text-[#617589] dark:text-gray-400">
                        <span className="material-symbols-outlined text-base align-middle mr-2">email</span>
                        {clinic.email}
                      </p>
                    </div>
                    {clinic.description && (
                      <p className="text-sm text-[#617589] dark:text-gray-400 mb-4 line-clamp-2">
                        {clinic.description}
                      </p>
                    )}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Link
                        href={`/admin/clinics/${clinic.id}`}
                        className="text-primary hover:underline text-sm font-medium"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[#617589] dark:text-gray-400">
                    Showing {clinics.length} of {total} clinics
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-[#111418] dark:text-white"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-sm text-[#111418] dark:text-white">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={page === totalPages}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-[#111418] dark:text-white"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

