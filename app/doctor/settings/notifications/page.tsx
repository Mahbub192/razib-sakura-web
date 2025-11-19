'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { DoctorSidebar } from '@/components/layout/DoctorSidebar'
import { doctorApi } from '@/lib/api/doctors'

export default function DoctorNotificationSettings() {
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [preferences, setPreferences] = useState({
    events: {
      newAppointment: true,
      appointmentReminder: true,
      appointmentCancellation: true,
      newMessage: false,
    },
    deliveryMethods: {
      email: true,
      sms: false,
      push: true,
    },
    quietHours: {
      enabled: false,
      startTime: '22:00',
      endTime: '08:00',
    },
  })

  useEffect(() => {
    fetchPreferences()
  }, [])

  const fetchPreferences = async () => {
    try {
      setLoading(true)
      const response = await doctorApi.getNotificationPreferences()
      if (response.success && response.data) {
        setPreferences(response.data)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load notification preferences')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await doctorApi.updateNotificationPreferences(preferences)
      if (response.success) {
        setSuccess('Notification preferences updated successfully!')
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(response.message || 'Failed to update notification preferences')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update notification preferences')
    } finally {
      setSaving(false)
    }
  }

  const toggleEvent = (eventName: keyof typeof preferences.events) => {
    setPreferences((prev) => ({
      ...prev,
      events: {
        ...prev.events,
        [eventName]: !prev.events[eventName],
      },
    }))
  }

  const toggleDeliveryMethod = (method: keyof typeof preferences.deliveryMethods) => {
    setPreferences((prev) => ({
      ...prev,
      deliveryMethods: {
        ...prev.deliveryMethods,
        [method]: !prev.deliveryMethods[method],
      },
    }))
  }

  const toggleQuietHours = () => {
    setPreferences((prev) => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        enabled: !prev.quietHours.enabled,
      },
    }))
  }

  const updateQuietHoursTime = (field: 'startTime' | 'endTime', value: string) => {
    setPreferences((prev) => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        [field]: value,
      },
    }))
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
        <DoctorSidebar />
        <main className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-[#617589] dark:text-gray-400">Loading preferences...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <DoctorSidebar />
      
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#111418] dark:text-white mb-2">Settings</h1>
            <p className="text-[#617589] dark:text-gray-400">
              Manage your account, clinic, and application settings.
            </p>
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

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Settings Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 space-y-2">
                <Link
                  href="/doctor/settings/profile"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    pathname === '/doctor/settings/profile'
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-[#617589] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="material-symbols-outlined">person</span>
                  <span>Profile</span>
                </Link>
                <Link
                  href="/doctor/settings/notifications"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    pathname === '/doctor/settings/notifications'
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-[#617589] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="material-symbols-outlined">notifications</span>
                  <span>Notifications</span>
                </Link>
                <Link
                  href="/doctor/settings/clinic"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    pathname === '/doctor/settings/clinic'
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-[#617589] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="material-symbols-outlined">business</span>
                  <span>Clinic Info</span>
                </Link>
                <Link
                  href="/doctor/settings/security"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    pathname === '/doctor/settings/security'
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-[#617589] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="material-symbols-outlined">security</span>
                  <span>Security</span>
                </Link>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-2">Notification Preferences</h2>
                <p className="text-[#617589] dark:text-gray-400 mb-6">
                  Select how and when you receive notifications.
                </p>

                <form onSubmit={handleSubmit}>
                  {/* Events */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-[#111418] dark:text-white mb-2">Events</h3>
                    <p className="text-sm text-[#617589] dark:text-gray-400 mb-4">
                      Choose which events trigger a notification.
                    </p>
                    <div className="space-y-4">
                      {[
                        { name: 'newAppointment', label: 'New Appointment Booking', desc: 'When a patient books a new appointment.' },
                        { name: 'appointmentReminder', label: 'Appointment Reminder', desc: '24 hours before an appointment.' },
                        { name: 'appointmentCancellation', label: 'Appointment Cancellation', desc: 'When a patient cancels an appointment.' },
                        { name: 'newMessage', label: 'New Patient Message', desc: 'When you receive a new message.' },
                      ].map((item) => (
                        <div key={item.name} className="flex items-start justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <div className="flex-1">
                            <p className="font-semibold text-[#111418] dark:text-white mb-1">{item.label}</p>
                            <p className="text-sm text-[#617589] dark:text-gray-400">{item.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={preferences.events[item.name as keyof typeof preferences.events]}
                              onChange={() => toggleEvent(item.name as keyof typeof preferences.events)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Method */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-[#111418] dark:text-white mb-2">Delivery Method</h3>
                    <p className="text-sm text-[#617589] dark:text-gray-400 mb-4">
                      Select your preferred channels.
                    </p>
                    <div className="space-y-3">
                      {[
                        { name: 'email', label: 'Email' },
                        { name: 'sms', label: 'SMS' },
                        { name: 'push', label: 'In-App (Push)' },
                      ].map((item) => (
                        <label key={item.name} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences.deliveryMethods[item.name as keyof typeof preferences.deliveryMethods]}
                            onChange={() => toggleDeliveryMethod(item.name as keyof typeof preferences.deliveryMethods)}
                            className="w-5 h-5 text-primary rounded focus:ring-primary"
                          />
                          <span className="text-[#111418] dark:text-white">{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Quiet Hours */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#111418] dark:text-white mb-2">Quiet Hours</h3>
                    <p className="text-sm text-[#617589] dark:text-gray-400 mb-4">
                      Mute notifications during specific times.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <span className="font-semibold text-[#111418] dark:text-white">Enable Quiet Hours</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences.quietHours.enabled}
                            onChange={toggleQuietHours}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                        </label>
                      </div>
                      {preferences.quietHours.enabled && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">Start Time</label>
                            <input
                              type="time"
                              value={preferences.quietHours.startTime}
                              onChange={(e) => updateQuietHoursTime('startTime', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">End Time</label>
                            <input
                              type="time"
                              value={preferences.quietHours.endTime}
                              onChange={(e) => updateQuietHoursTime('endTime', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
                    <button
                      type="button"
                      onClick={fetchPreferences}
                      className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
