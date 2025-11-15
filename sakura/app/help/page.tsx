'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function HelpPage() {
  const router = useRouter()

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="flex shrink-0 items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8 py-4 bg-white dark:bg-background-dark">
          <Link 
            href="/" 
            className="flex items-center gap-3 text-2xl font-bold text-[#111418] dark:text-white"
          >
            <span className="material-symbols-outlined text-primary text-4xl">
              health_and_safety
            </span>
            <span>Sakura</span>
          </Link>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            <span>Back</span>
          </button>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 items-start justify-center p-4 sm:p-8">
          <div className="flex w-full max-w-4xl flex-col gap-8">
            <div className="text-center">
              <h1 className="text-4xl font-black text-[#111418] dark:text-white mb-4">
                Help Center
              </h1>
              <p className="text-[#617589] dark:text-gray-400 text-lg">
                Find answers to common questions and get support
              </p>
            </div>

            {/* FAQ Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Getting Started */}
              <div className="rounded-xl border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6">
                <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-4">
                  Getting Started
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[#111418] dark:text-white mb-2">
                      How do I create an account?
                    </h3>
                    <p className="text-[#617589] dark:text-gray-400">
                      Click on "Register here" on the login page and fill in your information. You'll need to provide your phone number, email, and create a password.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#111418] dark:text-white mb-2">
                      How do I log in?
                    </h3>
                    <p className="text-[#617589] dark:text-gray-400">
                      Use your phone number and password to log in. If you forgot your password, click "Forgot Password?" on the login page.
                    </p>
                  </div>
                </div>
              </div>

              {/* Appointments */}
              <div className="rounded-xl border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6">
                <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-4">
                  Appointments
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[#111418] dark:text-white mb-2">
                      How do I book an appointment?
                    </h3>
                    <p className="text-[#617589] dark:text-gray-400">
                      Go to your dashboard and click "Book Appointment". Select your preferred date and time, then confirm your booking.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#111418] dark:text-white mb-2">
                      Can I cancel or reschedule?
                    </h3>
                    <p className="text-[#617589] dark:text-gray-400">
                      Yes, you can cancel or reschedule appointments from your appointments page. Please do so at least 24 hours in advance.
                    </p>
                  </div>
                </div>
              </div>

              {/* Medical Records */}
              <div className="rounded-xl border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6">
                <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-4">
                  Medical Records
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[#111418] dark:text-white mb-2">
                      How do I access my medical records?
                    </h3>
                    <p className="text-[#617589] dark:text-gray-400">
                      All your medical records are available in the "Medical Records" section of your dashboard. You can view, download, or print them.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#111418] dark:text-white mb-2">
                      Are my records secure?
                    </h3>
                    <p className="text-[#617589] dark:text-gray-400">
                      Yes, all your medical information is encrypted and stored securely. Only you and authorized healthcare providers can access your records.
                    </p>
                  </div>
                </div>
              </div>

              {/* Prescriptions */}
              <div className="rounded-xl border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6">
                <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-4">
                  Prescriptions
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[#111418] dark:text-white mb-2">
                      How do I request a refill?
                    </h3>
                    <p className="text-[#617589] dark:text-gray-400">
                      Go to your Prescriptions page, find the medication you need, and click "Request Refill". Your doctor will review and approve the request.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#111418] dark:text-white mb-2">
                      Where can I see my prescriptions?
                    </h3>
                    <p className="text-[#617589] dark:text-gray-400">
                      All your prescriptions, both active and past, are listed in the Prescriptions section of your dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="rounded-xl border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 text-center">
              <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-4">
                Still Need Help?
              </h2>
              <p className="text-[#617589] dark:text-gray-400 mb-6">
                If you can't find what you're looking for, please contact our support team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:support@sakura.com"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <span className="material-symbols-outlined">email</span>
                  <span>Email Support</span>
                </a>
                <a
                  href="tel:+8801234567890"
                  className="flex items-center justify-center gap-2 px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors"
                >
                  <span className="material-symbols-outlined">call</span>
                  <span>Call Support</span>
                </a>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="flex shrink-0 items-center justify-center p-6 sm:p-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-6 text-sm text-[#617589] dark:text-gray-400">
            <Link
              href="/privacy"
              className="hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/"
              className="hover:text-primary transition-colors"
            >
              Home
            </Link>
          </div>
        </footer>
      </div>
    </div>
  )
}

