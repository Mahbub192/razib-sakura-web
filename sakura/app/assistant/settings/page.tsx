'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function AssistantSettingsPage() {
  const [activeSection, setActiveSection] = useState<'profile' | 'notifications' | 'clinic' | 'billing' | 'security'>('profile')
  const [profileData, setProfileData] = useState({
    fullName: 'Sarah Johnson',
    role: 'Medical Assistant',
    email: 'sarah.johnson@clinic.com',
    phone: '+1 (555) 987-6543',
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [notificationPreferences, setNotificationPreferences] = useState({
    events: {
      newAppointmentBooking: true,
      appointmentReminder: true,
      appointmentCancellation: true,
      newPatientMessage: false,
    },
    deliveryMethod: {
      email: true,
      sms: false,
      inApp: true,
    },
    quietHours: {
      enabled: false,
      startTime: '22:00',
      endTime: '08:00',
    },
  })
  const [isSavingNotifications, setIsSavingNotifications] = useState(false)
  const [clinicData, setClinicData] = useState({
    clinicName: 'HealWell Cardiology Center',
    address: '123 Health St, Suite 400, Medville, MD 12345',
    phone: '+1 (555) 987-6543',
    email: 'contact@healwell.com',
    description: 'HealWell Cardiology Center is dedicated to providing top-tier cardiac care, led by Dr. Anya Sharma. We specialize in the diagnosis and treatment of heart conditions.',
  })
  const [operatingHours, setOperatingHours] = useState({
    monday: { start: '09:00', end: '17:00', closed: false },
    tuesday: { start: '09:00', end: '17:00', closed: false },
    wednesday: { start: '09:00', end: '17:00', closed: false },
    thursday: { start: '09:00', end: '17:00', closed: false },
    friday: { start: '09:00', end: '17:00', closed: false },
    saturday: { start: '09:00', end: '17:00', closed: true },
    sunday: { start: '09:00', end: '17:00', closed: true },
  })
  const [isSavingClinic, setIsSavingClinic] = useState(false)

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    // TODO: Implement save profile logic
    setTimeout(() => {
      setIsSaving(false)
      alert('Profile updated successfully!')
    }, 1000)
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!')
      return
    }
    setIsUpdatingPassword(true)
    // TODO: Implement password update logic
    setTimeout(() => {
      setIsUpdatingPassword(false)
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      alert('Password updated successfully!')
    }, 1000)
  }

  const handleChangePicture = () => {
    // TODO: Implement picture change logic
    alert('Picture change functionality would be implemented here')
  }

  const handleRemovePicture = () => {
    // TODO: Implement remove picture logic
    if (confirm('Are you sure you want to remove your profile picture?')) {
      alert('Picture removed')
    }
  }

  const handleNotificationToggle = (category: 'events' | 'deliveryMethod' | 'quietHours', key: string) => {
    setNotificationPreferences((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key as keyof typeof prev[typeof category]],
      },
    }))
  }

  const handleNotificationTimeChange = (key: 'startTime' | 'endTime', value: string) => {
    setNotificationPreferences((prev) => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        [key]: value,
      },
    }))
  }

  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingNotifications(true)
    // TODO: Implement save notifications logic
    setTimeout(() => {
      setIsSavingNotifications(false)
      alert('Notification preferences saved successfully!')
    }, 1000)
  }

  const handleClinicChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setClinicData((prev) => ({ ...prev, [name]: value }))
  }

  const handleOperatingHoursChange = (day: string, field: 'start' | 'end' | 'closed', value: string | boolean) => {
    setOperatingHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        [field]: value,
      },
    }))
  }

  const handleUploadLogo = () => {
    // TODO: Implement logo upload logic
    alert('Logo upload functionality would be implemented here')
  }

  const handleSaveClinic = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingClinic(true)
    // TODO: Implement save clinic logic
    setTimeout(() => {
      setIsSavingClinic(false)
      alert('Clinic information saved successfully!')
    }, 1000)
  }

  const settingsSections = [
    { id: 'profile' as const, label: 'Profile', icon: 'person' },
    { id: 'notifications' as const, label: 'Notifications', icon: 'notifications' },
    { id: 'clinic' as const, label: 'Clinic Info', icon: 'medical_services' },
    { id: 'billing' as const, label: 'Billing', icon: 'receipt_long' },
    { id: 'security' as const, label: 'Security', icon: 'security' },
  ]

  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-200">
      {/* Left Sidebar */}
      <aside className="flex w-64 flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark p-4">
        <div className="flex flex-col gap-4">
          {/* Profile Section */}
          <div className="flex items-center gap-3 px-2">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDaxM0wNFKrDU8Mv8BAOJspA5Z6u2Y55brKTpqS4ROf6q8xEbWBzaPg4yjolSXminz0fSpTGjvgY9W9y59Lw3KPW4__KGKK6yaax2B48p2d5vcW_707PRwZUcPPOrVhmqwVQqZAWo2sF-sff_tYDTm91aBuuzAYMzxJtzBsWOt5p-0MSLu8fM-EprRrkaE9_7SvNJb68IICeo4-ThCJOAkqilKQKYUF-ILNjtSs40ohwSn0CYsB4hBg_2hUwiDDlGp94z_6uV7pUvY")',
              }}
            />
            <div className="flex flex-col">
              <h1 className="text-gray-900 dark:text-white text-base font-semibold leading-normal">Sarah Johnson</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">Medical Assistant</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2 mt-4">
            <Link
              href="/assistant/dashboard"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <span className="material-symbols-outlined text-2xl">dashboard</span>
              <p className="text-sm font-medium leading-normal">Dashboard</p>
            </Link>
            <Link
              href="/assistant/appointments"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <span className="material-symbols-outlined text-2xl">list_alt</span>
              <p className="text-sm font-medium leading-normal">Appointments</p>
            </Link>
            <Link
              href="/assistant/patients"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <span className="material-symbols-outlined text-2xl">group</span>
              <p className="text-sm font-medium leading-normal">Patients</p>
            </Link>
            <Link
              href="/assistant/calendar"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <span className="material-symbols-outlined text-2xl">calendar_month</span>
              <p className="text-sm font-medium leading-normal">Calendar</p>
            </Link>
            <Link
              href="/assistant/reports"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <span className="material-symbols-outlined text-2xl">bar_chart</span>
              <p className="text-sm font-medium leading-normal">Reports</p>
            </Link>
            <Link
              href="/assistant/communications"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <span className="material-symbols-outlined text-2xl">chat</span>
              <p className="text-sm font-medium leading-normal">Communications</p>
            </Link>
            <Link
              href="/assistant/settings"
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary"
            >
              <span className="material-symbols-outlined fill text-2xl">settings</span>
              <p className="text-sm font-semibold leading-normal">Settings</p>
            </Link>
          </nav>
        </div>

        {/* Stats Cards */}
        <div className="mt-auto flex flex-col gap-4">
          <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-4 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-normal">Total Patients</p>
            <p className="text-gray-900 dark:text-white tracking-light text-3xl font-bold leading-tight">850</p>
            <p className="text-green-600 dark:text-green-500 text-sm font-medium leading-normal">+1.5% this month</p>
          </div>
          <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-4 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-normal">Appointments Today</p>
            <p className="text-gray-900 dark:text-white tracking-light text-3xl font-bold leading-tight">12</p>
            <p className="text-red-600 dark:text-red-500 text-sm font-medium leading-normal">-5% vs yesterday</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="flex flex-col gap-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col gap-1">
            <h1 className="text-gray-900 dark:text-white text-3xl font-bold leading-tight">Settings</h1>
            <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">
              Manage your account, clinic, and application settings.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Settings Navigation Sidebar */}
            <aside className="lg:col-span-1">
              <nav className="flex flex-col gap-1 sticky top-8">
                {settingsSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'hover:bg-gray-200/50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-300 font-medium'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-xl ${activeSection === section.id ? 'fill' : ''}`}>
                      {section.icon}
                    </span>
                    <span className="text-sm">{section.label}</span>
                  </button>
                ))}
              </nav>
            </aside>

            {/* Settings Content */}
            <div className="lg:col-span-3 flex flex-col gap-8">
              {/* Profile Information Section */}
              {activeSection === 'profile' && (
                <>
                  <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">Profile Information</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Update your personal details and contact information.
                      </p>
                    </div>
                    <form onSubmit={handleSaveProfile}>
                      <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {/* Profile Picture */}
                          <div className="sm:col-span-2 flex items-center gap-4">
                            <div
                              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-20"
                              style={{
                                backgroundImage:
                                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDaxM0wNFKrDU8Mv8BAOJspA5Z6u2Y55brKTpqS4ROf6q8xEbWBzaPg4yjolSXminz0fSpTGjvgY9W9y59Lw3KPW4__KGKK6yaax2B48p2d5vcW_707PRwZUcPPOrVhmqwVQqZAWo2sF-sff_tYDTm91aBuuzAYMzxJtzBsWOt5p-0MSLu8fM-EprRrkaE9_7SvNJb68IICeo4-ThCJOAkqilKQKYUF-ILNjtSs40ohwSn0CYsB4hBg_2hUwiDDlGp94z_6uV7pUvY")',
                              }}
                            />
                            <div>
                              <button
                                type="button"
                                onClick={handleChangePicture}
                                className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal shadow-sm hover:bg-primary/90 transition-colors"
                              >
                                Change Picture
                              </button>
                              <button
                                type="button"
                                onClick={handleRemovePicture}
                                className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-transparent text-gray-600 dark:text-gray-300 text-sm font-bold leading-normal hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mt-2"
                              >
                                Remove
                              </button>
                            </div>
                          </div>

                          {/* Full Name */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="full-name">
                              Full Name
                            </label>
                            <input
                              id="full-name"
                              name="fullName"
                              type="text"
                              value={profileData.fullName}
                              onChange={handleProfileChange}
                              className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-background-light dark:bg-gray-800 text-sm focus:border-primary focus:ring-primary/50 px-3 py-2"
                            />
                          </div>

                          {/* Role */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="role">
                              Role
                            </label>
                            <input
                              id="role"
                              name="role"
                              type="text"
                              value={profileData.role}
                              onChange={handleProfileChange}
                              className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-background-light dark:bg-gray-800 text-sm focus:border-primary focus:ring-primary/50 px-3 py-2"
                            />
                          </div>

                          {/* Email */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="email">
                              Email Address
                            </label>
                            <input
                              id="email"
                              name="email"
                              type="email"
                              value={profileData.email}
                              onChange={handleProfileChange}
                              className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-background-light dark:bg-gray-800 text-sm focus:border-primary focus:ring-primary/50 px-3 py-2"
                            />
                          </div>

                          {/* Phone */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="phone">
                              Phone Number
                            </label>
                            <input
                              id="phone"
                              name="phone"
                              type="tel"
                              value={profileData.phone}
                              onChange={handleProfileChange}
                              className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-background-light dark:bg-gray-800 text-sm focus:border-primary focus:ring-primary/50 px-3 py-2"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setProfileData({ fullName: 'Sarah Johnson', role: 'Medical Assistant', email: 'sarah.johnson@clinic.com', phone: '+1 (555) 987-6543' })}
                          className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-bold leading-normal hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold leading-normal shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Change Password Section */}
                  <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">Change Password</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        For security, choose a strong password you haven't used before.
                      </p>
                    </div>
                    <form onSubmit={handleUpdatePassword}>
                      <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {/* Current Password */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="current-password">
                              Current Password
                            </label>
                            <input
                              id="current-password"
                              name="currentPassword"
                              type="password"
                              value={passwordData.currentPassword}
                              onChange={handlePasswordChange}
                              placeholder="••••••••"
                              className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-background-light dark:bg-gray-800 text-sm focus:border-primary focus:ring-primary/50 px-3 py-2"
                            />
                          </div>
                          <div></div>

                          {/* New Password */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="new-password">
                              New Password
                            </label>
                            <input
                              id="new-password"
                              name="newPassword"
                              type="password"
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                              placeholder="Enter new password"
                              className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-background-light dark:bg-gray-800 text-sm focus:border-primary focus:ring-primary/50 px-3 py-2"
                            />
                          </div>

                          {/* Confirm Password */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="confirm-password">
                              Confirm New Password
                            </label>
                            <input
                              id="confirm-password"
                              name="confirmPassword"
                              type="password"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
                              placeholder="Confirm new password"
                              className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-background-light dark:bg-gray-800 text-sm focus:border-primary focus:ring-primary/50 px-3 py-2"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3">
                        <button
                          type="submit"
                          disabled={isUpdatingPassword || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                          className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold leading-normal shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                        </button>
                      </div>
                    </form>
                  </div>
                </>
              )}

              {/* Notifications Section */}
              {activeSection === 'notifications' && (
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Notification Preferences</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Select how and when you receive notifications.</p>
                  </div>
                  <form onSubmit={handleSaveNotifications}>
                    <div className="divide-y divide-gray-200 dark:divide-gray-800">
                      {/* Events Section */}
                      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">Events</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Choose which events trigger a notification.</p>
                        </div>
                        <div className="md:col-span-2">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-800 dark:text-gray-200">New Appointment Booking</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">When a patient books a new appointment.</p>
                              </div>
                              <label className="relative inline-block w-[38px] h-[22px]">
                                <input
                                  type="checkbox"
                                  checked={notificationPreferences.events.newAppointmentBooking}
                                  onChange={() => handleNotificationToggle('events', 'newAppointmentBooking')}
                                  className="opacity-0 w-0 h-0"
                                />
                                <span
                                  className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-[22px] transition-all duration-400 ${
                                    notificationPreferences.events.newAppointmentBooking
                                      ? 'bg-primary'
                                      : 'bg-gray-300 dark:bg-gray-600'
                                  }`}
                                >
                                  <span
                                    className={`absolute h-[18px] w-[18px] left-[2px] bottom-[2px] bg-white rounded-full transition-all duration-400 ${
                                      notificationPreferences.events.newAppointmentBooking ? 'translate-x-[16px]' : ''
                                    }`}
                                  ></span>
                                </span>
                              </label>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-800 dark:text-gray-200">Appointment Reminder</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">24 hours before an appointment.</p>
                              </div>
                              <label className="relative inline-block w-[38px] h-[22px]">
                                <input
                                  type="checkbox"
                                  checked={notificationPreferences.events.appointmentReminder}
                                  onChange={() => handleNotificationToggle('events', 'appointmentReminder')}
                                  className="opacity-0 w-0 h-0"
                                />
                                <span
                                  className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-[22px] transition-all duration-400 ${
                                    notificationPreferences.events.appointmentReminder
                                      ? 'bg-primary'
                                      : 'bg-gray-300 dark:bg-gray-600'
                                  }`}
                                >
                                  <span
                                    className={`absolute h-[18px] w-[18px] left-[2px] bottom-[2px] bg-white rounded-full transition-all duration-400 ${
                                      notificationPreferences.events.appointmentReminder ? 'translate-x-[16px]' : ''
                                    }`}
                                  ></span>
                                </span>
                              </label>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-800 dark:text-gray-200">Appointment Cancellation</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">When a patient cancels an appointment.</p>
                              </div>
                              <label className="relative inline-block w-[38px] h-[22px]">
                                <input
                                  type="checkbox"
                                  checked={notificationPreferences.events.appointmentCancellation}
                                  onChange={() => handleNotificationToggle('events', 'appointmentCancellation')}
                                  className="opacity-0 w-0 h-0"
                                />
                                <span
                                  className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-[22px] transition-all duration-400 ${
                                    notificationPreferences.events.appointmentCancellation
                                      ? 'bg-primary'
                                      : 'bg-gray-300 dark:bg-gray-600'
                                  }`}
                                >
                                  <span
                                    className={`absolute h-[18px] w-[18px] left-[2px] bottom-[2px] bg-white rounded-full transition-all duration-400 ${
                                      notificationPreferences.events.appointmentCancellation ? 'translate-x-[16px]' : ''
                                    }`}
                                  ></span>
                                </span>
                              </label>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-800 dark:text-gray-200">New Patient Message</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">When you receive a new message.</p>
                              </div>
                              <label className="relative inline-block w-[38px] h-[22px]">
                                <input
                                  type="checkbox"
                                  checked={notificationPreferences.events.newPatientMessage}
                                  onChange={() => handleNotificationToggle('events', 'newPatientMessage')}
                                  className="opacity-0 w-0 h-0"
                                />
                                <span
                                  className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-[22px] transition-all duration-400 ${
                                    notificationPreferences.events.newPatientMessage
                                      ? 'bg-primary'
                                      : 'bg-gray-300 dark:bg-gray-600'
                                  }`}
                                >
                                  <span
                                    className={`absolute h-[18px] w-[18px] left-[2px] bottom-[2px] bg-white rounded-full transition-all duration-400 ${
                                      notificationPreferences.events.newPatientMessage ? 'translate-x-[16px]' : ''
                                    }`}
                                  ></span>
                                </span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Delivery Method Section */}
                      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">Delivery Method</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Select your preferred channels.</p>
                        </div>
                        <div className="md:col-span-2">
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <input
                                checked={notificationPreferences.deliveryMethod.email}
                                onChange={() => handleNotificationToggle('deliveryMethod', 'email')}
                                className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-primary focus:ring-2 focus:ring-primary"
                                id="email-notif"
                                type="checkbox"
                              />
                              <label className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="email-notif">
                                Email
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                checked={notificationPreferences.deliveryMethod.sms}
                                onChange={() => handleNotificationToggle('deliveryMethod', 'sms')}
                                className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-primary focus:ring-2 focus:ring-primary"
                                id="sms-notif"
                                type="checkbox"
                              />
                              <label className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="sms-notif">
                                SMS
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                checked={notificationPreferences.deliveryMethod.inApp}
                                onChange={() => handleNotificationToggle('deliveryMethod', 'inApp')}
                                className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-primary focus:ring-2 focus:ring-primary"
                                id="in-app-notif"
                                type="checkbox"
                              />
                              <label className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="in-app-notif">
                                In-App (Push)
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quiet Hours Section */}
                      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">Quiet Hours</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Mute notifications during specific times.</p>
                        </div>
                        <div className="md:col-span-2">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-800 dark:text-gray-200">Enable Quiet Hours</p>
                            <label className="relative inline-block w-[38px] h-[22px]">
                              <input
                                type="checkbox"
                                checked={notificationPreferences.quietHours.enabled}
                                onChange={() => handleNotificationToggle('quietHours', 'enabled')}
                                className="opacity-0 w-0 h-0"
                              />
                              <span
                                className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-[22px] transition-all duration-400 ${
                                  notificationPreferences.quietHours.enabled
                                    ? 'bg-primary'
                                    : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                              >
                                <span
                                  className={`absolute h-[18px] w-[18px] left-[2px] bottom-[2px] bg-white rounded-full transition-all duration-400 ${
                                    notificationPreferences.quietHours.enabled ? 'translate-x-[16px]' : ''
                                  }`}
                                ></span>
                              </span>
                            </label>
                          </div>
                          {notificationPreferences.quietHours.enabled && (
                            <div className="mt-4 grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="start-time">
                                  Start Time
                                </label>
                                <input
                                  id="start-time"
                                  type="time"
                                  value={notificationPreferences.quietHours.startTime}
                                  onChange={(e) => handleNotificationTimeChange('startTime', e.target.value)}
                                  className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-background-light dark:bg-gray-800 text-sm focus:border-primary focus:ring-primary/50 px-3 py-2"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="end-time">
                                  End Time
                                </label>
                                <input
                                  id="end-time"
                                  type="time"
                                  value={notificationPreferences.quietHours.endTime}
                                  onChange={(e) => handleNotificationTimeChange('endTime', e.target.value)}
                                  className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-background-light dark:bg-gray-800 text-sm focus:border-primary focus:ring-primary/50 px-3 py-2"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setNotificationPreferences({
                            events: {
                              newAppointmentBooking: true,
                              appointmentReminder: true,
                              appointmentCancellation: true,
                              newPatientMessage: false,
                            },
                            deliveryMethod: {
                              email: true,
                              sms: false,
                              inApp: true,
                            },
                            quietHours: {
                              enabled: false,
                              startTime: '22:00',
                              endTime: '08:00',
                            },
                          })
                        }
                        className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-bold leading-normal hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSavingNotifications}
                        className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold leading-normal shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSavingNotifications ? 'Saving...' : 'Save Preferences'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Clinic Info Section */}
              {activeSection === 'clinic' && (
                <form onSubmit={handleSaveClinic}>
                  {/* Clinic Information */}
                  <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">Clinic Information</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Update your clinic's details, branding, and operating hours.
                      </p>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {/* Clinic Logo */}
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Clinic Logo
                            </label>
                            <div className="flex items-center gap-4">
                              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 h-20 w-20 flex items-center justify-center">
                                <img
                                  alt="Clinic Logo"
                                  className="h-16 w-16 object-contain"
                                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDu2PSbCo_GSv8kTQ79HnVYe1BgCHw7qz4Prb12yM0SHk7tbtzGqBwPrBPfQSeRmfB-acJm1nzq3sX-_S3ymlpk134UZVNSidDD_zmtENJXMj7AYB9st4wNIsxVhiejlb2qxMTV_smbRh_bmw4zsZIR7hn_Gv72x-gp91tQwEnVFqLg_nfjcRLmGSVy0eeWl7XyuFN5X7AT0rLMUgjrCPYmIHVs4w_whmU0FyPzIANw8qkOTvzBjkE5tr7s36toCBi3E96UkmSr_Wo"
                                />
                              </div>
                              <div>
                                <button
                                  type="button"
                                  onClick={handleUploadLogo}
                                  className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal shadow-sm hover:bg-primary/90 transition-colors"
                                >
                                  Upload Logo
                                </button>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">PNG, JPG, or SVG. Max 2MB.</p>
                              </div>
                            </div>
                          </div>

                          {/* Clinic Name */}
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="clinic-name">
                              Clinic Name
                            </label>
                            <input
                              id="clinic-name"
                              name="clinicName"
                              type="text"
                              value={clinicData.clinicName}
                              onChange={handleClinicChange}
                              className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-background-light dark:bg-gray-800 text-sm focus:border-primary focus:ring-primary/50 px-3 py-2"
                            />
                          </div>

                          {/* Address */}
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="clinic-address">
                              Address
                            </label>
                            <input
                              id="clinic-address"
                              name="address"
                              type="text"
                              value={clinicData.address}
                              onChange={handleClinicChange}
                              className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-background-light dark:bg-gray-800 text-sm focus:border-primary focus:ring-primary/50 px-3 py-2"
                            />
                          </div>

                          {/* Phone */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="clinic-phone">
                              Phone Number
                            </label>
                            <input
                              id="clinic-phone"
                              name="phone"
                              type="tel"
                              value={clinicData.phone}
                              onChange={handleClinicChange}
                              className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-background-light dark:bg-gray-800 text-sm focus:border-primary focus:ring-primary/50 px-3 py-2"
                            />
                          </div>

                          {/* Email */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="clinic-email">
                              Email Address
                            </label>
                            <input
                              id="clinic-email"
                              name="email"
                              type="email"
                              value={clinicData.email}
                              onChange={handleClinicChange}
                              className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-background-light dark:bg-gray-800 text-sm focus:border-primary focus:ring-primary/50 px-3 py-2"
                            />
                          </div>

                          {/* Description */}
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="clinic-description">
                              Clinic Description
                            </label>
                            <textarea
                              id="clinic-description"
                              name="description"
                              rows={4}
                              value={clinicData.description}
                              onChange={handleClinicChange}
                              className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-background-light dark:bg-gray-800 text-sm focus:border-primary focus:ring-primary/50 px-3 py-2"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                  {/* Operating Hours */}
                  <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">Operating Hours</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Set the weekly schedule for the clinic.</p>
                    </div>
                      <div className="p-6">
                        <div className="space-y-4">
                          {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const).map((day) => {
                            const dayData = operatingHours[day]
                            const dayLabel = day.charAt(0).toUpperCase() + day.slice(1)
                            return (
                              <div key={day} className="grid grid-cols-4 items-center gap-4">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{dayLabel}</label>
                                <input
                                  type="time"
                                  value={dayData.closed ? '' : dayData.start}
                                  onChange={(e) => handleOperatingHoursChange(day, 'start', e.target.value)}
                                  disabled={dayData.closed}
                                  placeholder={dayData.closed ? '--:--' : ''}
                                  className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-background-light dark:bg-gray-800 text-sm focus:border-primary focus:ring-primary/50 px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                <input
                                  type="time"
                                  value={dayData.closed ? '' : dayData.end}
                                  onChange={(e) => handleOperatingHoursChange(day, 'end', e.target.value)}
                                  disabled={dayData.closed}
                                  placeholder={dayData.closed ? '--:--' : ''}
                                  className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-background-light dark:bg-gray-800 text-sm focus:border-primary focus:ring-primary/50 px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                  <input
                                    type="checkbox"
                                    checked={dayData.closed}
                                    onChange={(e) => handleOperatingHoursChange(day, 'closed', e.target.checked)}
                                    className="rounded border-gray-300 text-primary shadow-sm focus:ring-primary/50 dark:bg-gray-800 dark:border-gray-700"
                                  />
                                  <span>Closed</span>
                                </label>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                      <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setClinicData({
                              clinicName: 'HealWell Cardiology Center',
                              address: '123 Health St, Suite 400, Medville, MD 12345',
                              phone: '+1 (555) 987-6543',
                              email: 'contact@healwell.com',
                              description:
                                'HealWell Cardiology Center is dedicated to providing top-tier cardiac care, led by Dr. Anya Sharma. We specialize in the diagnosis and treatment of heart conditions.',
                            })
                            setOperatingHours({
                              monday: { start: '09:00', end: '17:00', closed: false },
                              tuesday: { start: '09:00', end: '17:00', closed: false },
                              wednesday: { start: '09:00', end: '17:00', closed: false },
                              thursday: { start: '09:00', end: '17:00', closed: false },
                              friday: { start: '09:00', end: '17:00', closed: false },
                              saturday: { start: '09:00', end: '17:00', closed: true },
                              sunday: { start: '09:00', end: '17:00', closed: true },
                            })
                          }}
                          className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-bold leading-normal hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSavingClinic}
                          className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold leading-normal shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSavingClinic ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </div>
                </form>
              )}

              {/* Other Sections Placeholder */}
              {activeSection !== 'profile' && activeSection !== 'notifications' && activeSection !== 'clinic' && (
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {settingsSections.find((s) => s.id === activeSection)?.label}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {activeSection === 'billing' && 'Billing settings will be available here.'}
                    {activeSection === 'security' && 'Security settings will be available here.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

