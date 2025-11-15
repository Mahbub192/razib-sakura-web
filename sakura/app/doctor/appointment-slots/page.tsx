'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DoctorSidebar } from '@/components/layout/DoctorSidebar'

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
  const [isLoading, setIsLoading] = useState(false)

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
    
    try {
      const { doctorApi } = await import('@/lib/api/doctors')
      
      // Map form data to API format
      const slotData = {
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        duration: parseInt(formData.slotDuration),
        clinicId: formData.clinicLocation || undefined,
        recurrence: formData.recurrence !== 'none' ? formData.recurrence : undefined,
        associatedResources: formData.associatedResources ? formData.associatedResources.split(',').map(r => r.trim()) : [],
      }
      
      const response = await doctorApi.createAppointmentSlot(slotData)
      
      if (response.success) {
        // Redirect to calendar after successful creation
        router.push('/doctor/calendar')
      } else {
        alert(response.message || 'Failed to create appointment slots')
        setIsLoading(false)
      }
    } catch (err: any) {
      console.error('Create slot error:', err)
      alert(err.message || 'An error occurred while creating appointment slots')
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <DoctorSidebar />
      
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#111418] dark:text-white mb-2">Create Appointment Slots</h1>
            <p className="text-[#617589] dark:text-gray-400">
              Define and manage available time slots for patient appointments.
            </p>
          </div>

          {/* Form */}
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
                  Slot Duration
                </label>
                <select
                  name="slotDuration"
                  value={formData.slotDuration}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
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
                  Clinic Location
                </label>
                <select
                  name="clinicLocation"
                  value={formData.clinicLocation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Choose Clinic Name</option>
                  <option value="main">Main Street Clinic</option>
                  <option value="downtown">Downtown Branch</option>
                  <option value="northside">Northside Center</option>
                  <option value="southside">Southside Medical Center</option>
                </select>
              </div>

              {/* Associated Resources */}
              <div>
                <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                  Associated Resources
                </label>
                <select
                  name="associatedResources"
                  value={formData.associatedResources}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Resource</option>
                  <option value="room1">Consultation Room 1</option>
                  <option value="room2">Consultation Room 2</option>
                  <option value="room3">Consultation Room 3</option>
                  <option value="exam1">Examination Room 1</option>
                  <option value="exam2">Examination Room 2</option>
                </select>
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

          {/* Info Section */}
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
        </div>
      </main>
    </div>
  )
}

