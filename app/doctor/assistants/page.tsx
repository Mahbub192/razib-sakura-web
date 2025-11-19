'use client'

import { useState, useEffect } from 'react'
import { DoctorSidebar } from '@/components/layout/DoctorSidebar'
import { doctorApi } from '@/lib/api/doctors'

interface Assistant {
  id: string
  name: string
  email: string
  phoneNumber: string
  avatar?: string
  isActive: boolean
  permissions?: string[]
  createdAt: string
}

export default function DoctorAssistants() {
  const [assistants, setAssistants] = useState<Assistant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingAssistant, setEditingAssistant] = useState<Assistant | null>(null)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  })

  useEffect(() => {
    fetchAssistants()
  }, [])

  const fetchAssistants = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await doctorApi.getAssistants()
      if (response.success && response.data) {
        setAssistants(response.data)
      } else {
        setError(response.message || 'Failed to load assistants')
      }
    } catch (err: any) {
      setError(err.message || 'Error loading assistants')
      console.error('Assistants fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    // Validation
    if (!formData.fullName || !formData.email || !formData.phoneNumber || !formData.password) {
      setError('All fields are required')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    try {
      const response = await doctorApi.createAssistant({
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        permissions: ['appointments', 'patients', 'schedule'],
      })

      if (response.success) {
        setSuccess('Assistant created successfully!')
        setShowCreateModal(false)
        setFormData({
          fullName: '',
          email: '',
          phoneNumber: '',
          password: '',
          confirmPassword: '',
        })
        fetchAssistants()
      } else {
        setError(response.message || 'Failed to create assistant')
      }
    } catch (err: any) {
      setError(err.message || 'Error creating assistant')
      console.error('Create assistant error:', err)
    }
  }

  const handleToggleStatus = async (assistantId: string) => {
    try {
      setError(null)
      const response = await doctorApi.toggleAssistantStatus(assistantId)
      if (response.success) {
        setSuccess('Assistant status updated')
        fetchAssistants()
      } else {
        setError(response.message || 'Failed to update status')
      }
    } catch (err: any) {
      setError(err.message || 'Error updating status')
      console.error('Toggle status error:', err)
    }
  }

  const handleDelete = async (assistantId: string) => {
    if (!confirm('Are you sure you want to delete this assistant?')) {
      return
    }

    try {
      setError(null)
      const response = await doctorApi.deleteAssistant(assistantId)
      if (response.success) {
        setSuccess('Assistant deleted successfully')
        fetchAssistants()
      } else {
        setError(response.message || 'Failed to delete assistant')
      }
    } catch (err: any) {
      setError(err.message || 'Error deleting assistant')
      console.error('Delete assistant error:', err)
    }
  }

  const getInitials = (name: string) => {
    if (!name) return '?'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (date: string | Date) => {
    if (!date) return 'N/A'
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        <DoctorSidebar />
        <div className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-[#111418] dark:text-white mb-2">Assistants</h1>
              <p className="text-[#617589] dark:text-gray-400">
                Manage your clinic assistants and their access
              </p>
            </div>

            {/* Messages */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-green-800 dark:text-green-200">{success}</p>
              </div>
            )}

            {/* Actions */}
            <div className="mb-6 flex justify-between items-center">
              <button
                onClick={() => {
                  setShowCreateModal(true)
                  setEditingAssistant(null)
                  setFormData({
                    fullName: '',
                    email: '',
                    phoneNumber: '',
                    password: '',
                    confirmPassword: '',
                  })
                }}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                <span>Create Assistant</span>
              </button>
            </div>

            {/* Assistants List */}
            {loading ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                <p className="text-[#617589] dark:text-gray-400">Loading assistants...</p>
              </div>
            ) : assistants.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                <p className="text-[#617589] dark:text-gray-400 mb-4">No assistants found</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  Create Your First Assistant
                </button>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#617589] dark:text-gray-300 uppercase tracking-wider">
                          Assistant
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#617589] dark:text-gray-300 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#617589] dark:text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#617589] dark:text-gray-300 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-[#617589] dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {assistants.map((assistant) => (
                        <tr key={assistant.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {assistant.avatar ? (
                                <img
                                  src={assistant.avatar}
                                  alt={assistant.name}
                                  className="w-10 h-10 rounded-full mr-3"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                                  <span className="text-primary font-semibold">
                                    {getInitials(assistant.name)}
                                  </span>
                                </div>
                              )}
                              <div>
                                <div className="text-sm font-medium text-[#111418] dark:text-white">
                                  {assistant.name}
                                </div>
                                <div className="text-xs text-[#617589] dark:text-gray-400">
                                  {assistant.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-[#111418] dark:text-white">
                              {assistant.phoneNumber}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                assistant.isActive
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {assistant.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#617589] dark:text-gray-400">
                            {formatDate(assistant.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleToggleStatus(assistant.id)}
                                className={`px-3 py-1 rounded text-xs ${
                                  assistant.isActive
                                    ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200'
                                    : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-200'
                                }`}
                                title={assistant.isActive ? 'Deactivate' : 'Activate'}
                              >
                                {assistant.isActive ? 'Deactivate' : 'Activate'}
                              </button>
                              <button
                                onClick={() => handleDelete(assistant.id)}
                                className="px-3 py-1 rounded text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 hover:bg-red-200"
                                title="Delete"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Create/Edit Modal */}
            {showCreateModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-[#111418] dark:text-white">
                      {editingAssistant ? 'Edit Assistant' : 'Create Assistant'}
                    </h2>
                    <button
                      onClick={() => {
                        setShowCreateModal(false)
                        setEditingAssistant(null)
                        setFormData({
                          fullName: '',
                          email: '',
                          phoneNumber: '',
                          password: '',
                          confirmPassword: '',
                        })
                      }}
                      className="text-[#617589] dark:text-gray-400 hover:text-[#111418] dark:hover:text-white"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>

                  <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#111418] dark:text-white mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#111418] dark:text-white mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#111418] dark:text-white mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        required
                        placeholder="+8801234567890"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#111418] dark:text-white mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        minLength={6}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#111418] dark:text-white mb-1">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        minLength={6}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        {editingAssistant ? 'Update' : 'Create'} Assistant
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCreateModal(false)
                          setEditingAssistant(null)
                          setFormData({
                            fullName: '',
                            email: '',
                            phoneNumber: '',
                            password: '',
                            confirmPassword: '',
                          })
                        }}
                        className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-[#111418] dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
