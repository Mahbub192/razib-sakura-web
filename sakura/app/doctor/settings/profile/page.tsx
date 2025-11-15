import Link from 'next/link'
import { DoctorSidebar } from '@/components/layout/DoctorSidebar'

export default function DoctorProfileSettings() {
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
                  className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-semibold"
                >
                  <span className="material-symbols-outlined">person</span>
                  <span>Profile</span>
                </Link>
                <Link
                  href="/doctor/settings/notifications"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#617589] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
                <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-2">Profile Information</h2>
                <p className="text-[#617589] dark:text-gray-400 mb-6">
                  Update your personal details and contact information.
                </p>

                {/* Profile Picture */}
                <div className="flex items-center gap-6 mb-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold text-3xl">A</span>
                    </div>
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold mb-2">
                      Change Picture
                    </button>
                    <button className="block text-sm text-red-600 dark:text-red-400 hover:underline">
                      Remove
                    </button>
                  </div>
                </div>

                {/* Form */}
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Dr. Anya Sharma"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        defaultValue="anya.sharma@clinic.com"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                        Specialty
                      </label>
                      <input
                        type="text"
                        defaultValue="Cardiologist"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        defaultValue="+1 (555) 123-4567"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-4">Change Password</h3>
                    <p className="text-sm text-[#617589] dark:text-gray-400 mb-4">
                      For security, choose a strong password you haven't used before.
                    </p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          placeholder="Enter new password"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          placeholder="Confirm new password"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <button
                      type="button"
                      className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                    >
                      Save Changes
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

