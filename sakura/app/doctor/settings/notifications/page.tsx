import Link from 'next/link'
import { DoctorSidebar } from '@/components/layout/DoctorSidebar'

export default function DoctorNotificationSettings() {
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

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Settings Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 space-y-2">
                <Link
                  href="/doctor/settings/profile"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#617589] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="material-symbols-outlined">person</span>
                  <span>Profile</span>
                </Link>
                <Link
                  href="/doctor/settings/notifications"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-semibold"
                >
                  <span className="material-symbols-outlined">notifications</span>
                  <span>Notifications</span>
                </Link>
                <Link
                  href="/doctor/settings/clinic"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#617589] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="material-symbols-outlined">business</span>
                  <span>Clinic Info</span>
                </Link>
                <Link
                  href="/doctor/settings/security"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#617589] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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

                {/* Events */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-[#111418] dark:text-white mb-2">Events</h3>
                  <p className="text-sm text-[#617589] dark:text-gray-400 mb-4">
                    Choose which events trigger a notification.
                  </p>
                  <div className="space-y-4">
                    {[
                      { name: 'New Appointment Booking', desc: 'When a patient books a new appointment.', enabled: true },
                      { name: 'Appointment Reminder', desc: '24 hours before an appointment.', enabled: true },
                      { name: 'Appointment Cancellation', desc: 'When a patient cancels an appointment.', enabled: true },
                      { name: 'New Patient Message', desc: 'When you receive a new message.', enabled: false },
                    ].map((item) => (
                      <div key={item.name} className="flex items-start justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex-1">
                          <p className="font-semibold text-[#111418] dark:text-white mb-1">{item.name}</p>
                          <p className="text-sm text-[#617589] dark:text-gray-400">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            defaultChecked={item.enabled}
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
                      { name: 'Email', checked: true },
                      { name: 'SMS', checked: false },
                      { name: 'In-App (Push)', checked: true },
                    ].map((item) => (
                      <label key={item.name} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked={item.checked}
                          className="w-5 h-5 text-primary rounded focus:ring-primary"
                        />
                        <span className="text-[#111418] dark:text-white">{item.name}</span>
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
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">Start Time</label>
                        <input
                          type="time"
                          defaultValue="22:00"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">End Time</label>
                        <input
                          type="time"
                          defaultValue="08:00"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
                  <button className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    Cancel
                  </button>
                  <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

