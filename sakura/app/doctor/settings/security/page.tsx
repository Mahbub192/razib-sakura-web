import Link from 'next/link'
import { DoctorSidebar } from '@/components/layout/DoctorSidebar'

export default function DoctorSecuritySettings() {
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
                  className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-semibold"
                >
                  <span className="material-symbols-outlined">security</span>
                  <span>Security</span>
                </Link>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Change Password */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-2">Change Password</h2>
                <p className="text-[#617589] dark:text-gray-400 mb-6">
                  For security, choose a strong password you haven't used before.
                </p>
                <form className="space-y-4">
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
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>

              {/* Two-Factor Authentication */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-2">Two-Factor Authentication (2FA)</h2>
                <p className="text-[#617589] dark:text-gray-400 mb-6">
                  Add an extra layer of security to your account.
                </p>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-[#111418] dark:text-white mb-1">Authenticator App</p>
                        <p className="text-sm text-[#617589] dark:text-gray-400">
                          Use an app like Google Authenticator or Authy.
                        </p>
                      </div>
                      <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold">
                        Set Up
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

