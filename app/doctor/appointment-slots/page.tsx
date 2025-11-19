'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DoctorSidebar } from '@/components/layout/DoctorSidebar'
import { doctorApi } from '@/lib/api/doctors'
import { commonApi, Clinic } from '@/lib/api/common'

interface AppointmentSlot {
  id: string
  date: string
  time: string
  duration: number
  clinicId: string
  associatedResources: string[]
  status: string
}

interface SlotGroup {
  date: string
  slots: any[]
  totalSlots: number
  availableSlots: number
}

export default function SetAppointmentSlots() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    slotDuration: '20',
    startTime: '09:00',
    endTime: '17:00',
    recurrence: 'none' as 'none' | 'daily' | 'weekly',
    clinicLocation: '',
    associatedResources: '',
  })
  const [existingSlots, setExistingSlots] = useState<SlotGroup[]>([])
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingSlots, setIsLoadingSlots] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'create' | 'view'>('create')

  useEffect(() => {
    fetchExistingSlots()
    fetchClinics()
  }, [])

  const fetchClinics = async () => {
    try {
      const response = await commonApi.getClinics()
      if (response.success && response.data) {
        setClinics(response.data)
      }
    } catch (err) {
      console.error('Failed to fetch clinics:', err)
    }
  }

  const fetchExistingSlots = async () => {
    try {
      setIsLoadingSlots(true)
      const today = new Date()
      const startDate = new Date(today.getFullYear(), today.getMonth(), 1)
      const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0)

      const response = await doctorApi.getAppointmentSlots({
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      })

      if (response.success && response.data) {
        setExistingSlots(response.data)
      }
    } catch (err: any) {
      console.error('Fetch slots error:', err)
    } finally {
      setIsLoadingSlots(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (value: 'none' | 'daily' | 'weekly') => {
    setFormData((prev) => ({ ...prev, recurrence: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Validate clinicId - must be a valid UUID or null
      const isValidUUID = (str: string) => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        return uuidRegex.test(str)
      }

      // Map form data to API format
      const slotData = {
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        slotDuration: parseInt(formData.slotDuration),
        clinicId: formData.clinicLocation && isValidUUID(formData.clinicLocation) 
          ? formData.clinicLocation 
          : undefined,
        recurrence: formData.recurrence !== 'none' ? formData.recurrence : undefined,
        associatedResources: formData.associatedResources
          ? formData.associatedResources.split(',').map((r) => r.trim()).filter(r => r)
          : [],
      }

      const response = await doctorApi.createAppointmentSlot(slotData)

      if (response.success) {
        setSuccess(
          response.data?.message || `Successfully created ${response.data?.totalSlots || 0} appointment slots`,
        )
        // Refresh slots list
        await fetchExistingSlots()
        // Reset form
        setFormData({
          date: new Date().toISOString().split('T')[0],
          slotDuration: '20',
          startTime: '09:00',
          endTime: '17:00',
          recurrence: 'none',
          clinicLocation: '',
          associatedResources: '',
        })
        // Switch to view tab after 2 seconds
        setTimeout(() => {
          setActiveTab('view')
          setSuccess(null)
        }, 2000)
      } else {
        setError(response.message || 'Failed to create appointment slots')
      }
    } catch (err: any) {
      console.error('Create slot error:', err)
      setError(err.message || 'An error occurred while creating appointment slots')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }

  const formatTime = (time: string) => {
    if (!time) return ''
    if (time.includes('AM') || time.includes('PM')) return time
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
      case 'completed':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
    }
  }

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <DoctorSidebar />

      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#111418] dark:text-white mb-2">Appointment Slots</h1>
            <p className="text-[#617589] dark:text-gray-400">
              Define and manage available time slots for patient appointments.
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex gap-2 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'create'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-[#617589] dark:text-gray-400 hover:text-[#111418] dark:hover:text-white'
              }`}
            >
              Create Slots
            </button>
            <button
              onClick={() => setActiveTab('view')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'view'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-[#617589] dark:text-gray-400 hover:text-[#111418] dark:hover:text-white'
              }`}
            >
              View Existing Slots
            </button>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-600 dark:text-green-400">{success}</p>
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Create Slots Tab */}
          {activeTab === 'create' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date */}
                <div>
                  <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                    Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                      required
                    />
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#617589] dark:text-gray-400 pointer-events-none">
                      event
                    </span>
                  </div>
                </div>

                {/* Slot Duration */}
                <div>
                  <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                    Slot Duration (minutes)
                  </label>
                  <select
                    name="slotDuration"
                    value={formData.slotDuration}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="15">15 minutes</option>
                    <option value="20">20 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                  </select>
                </div>

                {/* Start Time & End Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                      Start Time
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                        required
                      />
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#617589] dark:text-gray-400 pointer-events-none">
                        schedule
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                      End Time
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                        required
                      />
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#617589] dark:text-gray-400 pointer-events-none">
                        schedule
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recurrence */}
                <div>
                  <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-3">
                    Recurrence
                  </label>
                  <div className="flex flex-wrap gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="recurrence"
                        value="none"
                        checked={formData.recurrence === 'none'}
                        onChange={() => handleRadioChange('none')}
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <span className="text-[#111418] dark:text-white">Does not repeat</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="recurrence"
                        value="daily"
                        checked={formData.recurrence === 'daily'}
                        onChange={() => handleRadioChange('daily')}
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <span className="text-[#111418] dark:text-white">Daily</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="recurrence"
                        value="weekly"
                        checked={formData.recurrence === 'weekly'}
                        onChange={() => handleRadioChange('weekly')}
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <span className="text-[#111418] dark:text-white">Weekly</span>
                    </label>
                  </div>
                </div>

                {/* Clinic Location */}
                <div>
                  <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                    Clinic Location <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                  </label>
                  <select
                    name="clinicLocation"
                    value={formData.clinicLocation}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">No Clinic Selected</option>
                    {clinics.map((clinic) => (
                      <option key={clinic.id} value={clinic.id}>
                        {clinic.name} {clinic.address ? `- ${clinic.address}` : ''}
                      </option>
                    ))}
                  </select>
                  {clinics.length === 0 && (
                    <p className="text-xs text-[#617589] dark:text-gray-400 mt-1">
                      No clinics available. You can create slots without a clinic.
                    </p>
                  )}
                </div>

                {/* Associated Resources */}
                <div>
                  <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                    Associated Resources (Comma-separated, Optional)
                  </label>
                  <input
                    type="text"
                    name="associatedResources"
                    value={formData.associatedResources}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Room 101, X-Ray Machine"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Creating...' : 'Create Slots'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* View Slots Tab */}
          {activeTab === 'view' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              {isLoadingSlots ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-[#617589] dark:text-gray-400">Loading slots...</p>
                </div>
              ) : existingSlots.length > 0 ? (
                <div className="space-y-6">
                  {existingSlots.map((group) => (
                    <div
                      key={group.date}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-[#111418] dark:text-white">
                            {formatDate(group.date)}
                          </h3>
                          <p className="text-sm text-[#617589] dark:text-gray-400">
                            {group.totalSlots} total slots • {group.availableSlots} available
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {group.slots.map((slot, index) => (
                          <div
                            key={slot.id || index}
                            className={`p-3 rounded-lg border ${
                              slot.status === 'pending' || slot.status === 'confirmed'
                                ? 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800'
                                : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-[#111418] dark:text-white text-sm">
                                {formatTime(slot.time)}
                              </span>
                              <span
                                className={`text-xs px-2 py-1 rounded ${getStatusColor(slot.status)}`}
                              >
                                {slot.status || 'available'}
                              </span>
                            </div>
                            {slot.patientName && slot.patientName !== 'Available' && (
                              <p className="text-xs text-[#617589] dark:text-gray-400 truncate">
                                {slot.patientName}
                              </p>
                            )}
                            <p className="text-xs text-[#617589] dark:text-gray-400 mt-1">
                              {slot.duration} min
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <span className="material-symbols-outlined text-6xl text-[#617589] dark:text-gray-400 mb-4">
                    event_busy
                  </span>
                  <p className="text-lg font-semibold text-[#111418] dark:text-white mb-2">
                    No appointment slots found
                  </p>
                  <p className="text-sm text-[#617589] dark:text-gray-400 mb-4">
                    Create your first appointment slots to get started
                  </p>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                  >
                    Create Slots
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Info Section */}
          {activeTab === 'create' && (
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">info</span>
                <div>
                  <p className="font-semibold text-blue-900 dark:text-blue-200 mb-1">How it works</p>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    Appointment slots will be automatically created based on your selected time range and duration.
                    For example, if you select 9:00 AM to 5:00 PM with 20-minute slots, 24 slots will be created.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
