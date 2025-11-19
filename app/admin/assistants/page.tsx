'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authApi } from '@/lib/api/auth'
import { adminApi, AdminUser } from '@/lib/api/admin'
import AdminSidebar from '@/components/layout/AdminSidebar'

export default function AdminAssistantsPage() {
  const router = useRouter()
  const [assistants, setAssistants] = useState<AdminUser[]>([])
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

    fetchAssistants()
  }, [router, page, search])

  const fetchAssistants = async () => {
    try {
      setLoading(true)
      const response = await adminApi.getUsers({
        role: 'assistant',
        search: search || undefined,
        page,
        limit: 10,
      })

      if (response.success && response.data) {
        setAssistants(response.data.users)
        setTotalPages(response.data.pagination.totalPages)
        setTotal(response.data.pagination.total)
      } else {
        setError('Failed to load assistants')
      }
    } catch (err) {
      setError('Failed to load assistants')
      console.error('Assistants fetch error:', err)
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
              <h1 className="text-2xl font-bold text-[#111418] dark:text-white">Assistant Management</h1>
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
              placeholder="Search assistants..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-[#111418] dark:text-white"
            />
          </div>

          {/* Assistants Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-[#617589] dark:text-gray-400">Loading assistants...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <button
                onClick={fetchAssistants}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : assistants.length === 0 ? (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-6xl text-[#617589] dark:text-gray-400 mb-4">
                support_agent
              </span>
              <p className="text-[#617589] dark:text-gray-400">No assistants found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {assistants.map((assistant) => (
                  <div
                    key={assistant.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      {assistant.avatar ? (
                        <img
                          src={assistant.avatar}
                          alt={assistant.fullName}
                          className="w-16 h-16 rounded-full"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center">
                          <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-xl">
                            {assistant.fullName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-bold text-[#111418] dark:text-white">{assistant.fullName}</h3>
                        <p className="text-sm text-[#617589] dark:text-gray-400">Assistant</p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-[#617589] dark:text-gray-400">
                        <span className="material-symbols-outlined text-base align-middle mr-2">email</span>
                        {assistant.email}
                      </p>
                      <p className="text-sm text-[#617589] dark:text-gray-400">
                        <span className="material-symbols-outlined text-base align-middle mr-2">phone</span>
                        {assistant.phoneNumber}
                      </p>
                      {assistant.clinic && (
                        <p className="text-sm text-[#617589] dark:text-gray-400">
                          <span className="material-symbols-outlined text-base align-middle mr-2">
                            local_hospital
                          </span>
                          {assistant.clinic.name}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Link
                        href={`/admin/assistants/${assistant.id}`}
                        className="text-primary hover:underline text-sm font-medium"
                      >
                        View Details
                      </Link>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          assistant.isVerified
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        }`}
                      >
                        {assistant.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[#617589] dark:text-gray-400">
                    Showing {assistants.length} of {total} assistants
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

