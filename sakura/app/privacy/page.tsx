'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function PrivacyPage() {
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
                Privacy Policy
              </h1>
              <p className="text-[#617589] dark:text-gray-400 text-lg">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>

            <div className="space-y-8">
              {/* Introduction */}
              <section className="rounded-xl border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6">
                <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-4">
                  Introduction
                </h2>
                <p className="text-[#617589] dark:text-gray-400 leading-relaxed">
                  At Sakura, we are committed to protecting your privacy and ensuring the security of your personal health information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our healthcare management platform.
                </p>
              </section>

              {/* Information We Collect */}
              <section className="rounded-xl border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6">
                <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-4">
                  Information We Collect
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[#111418] dark:text-white mb-2">
                      Personal Information
                    </h3>
                    <p className="text-[#617589] dark:text-gray-400">
                      We collect information that you provide directly to us, including your name, phone number, email address, date of birth, gender, and address.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#111418] dark:text-white mb-2">
                      Health Information
                    </h3>
                    <p className="text-[#617589] dark:text-gray-400">
                      We collect and store your medical records, appointment history, prescriptions, lab results, and other health-related information that you or your healthcare providers share with us.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#111418] dark:text-white mb-2">
                      Usage Information
                    </h3>
                    <p className="text-[#617589] dark:text-gray-400">
                      We automatically collect information about how you interact with our platform, including your IP address, browser type, device information, and usage patterns.
                    </p>
                  </div>
                </div>
              </section>

              {/* How We Use Your Information */}
              <section className="rounded-xl border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6">
                <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-4">
                  How We Use Your Information
                </h2>
                <ul className="space-y-2 text-[#617589] dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
                    <span>To provide and maintain our healthcare services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
                    <span>To process your appointments and manage your medical records</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
                    <span>To communicate with you about your healthcare and appointments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
                    <span>To improve our services and user experience</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
                    <span>To comply with legal obligations and protect our rights</span>
                  </li>
                </ul>
              </section>

              {/* Data Security */}
              <section className="rounded-xl border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6">
                <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-4">
                  Data Security
                </h2>
                <p className="text-[#617589] dark:text-gray-400 leading-relaxed">
                  We implement industry-standard security measures to protect your personal and health information. This includes encryption of data in transit and at rest, secure authentication, regular security audits, and access controls. However, no method of transmission over the internet or electronic storage is 100% secure.
                </p>
              </section>

              {/* Your Rights */}
              <section className="rounded-xl border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6">
                <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-4">
                  Your Rights
                </h2>
                <p className="text-[#617589] dark:text-gray-400 mb-4">
                  You have the right to:
                </p>
                <ul className="space-y-2 text-[#617589] dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
                    <span>Access and review your personal and health information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
                    <span>Request corrections to inaccurate information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
                    <span>Request deletion of your account and data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
                    <span>Opt-out of certain communications</span>
                  </li>
                </ul>
              </section>

              {/* Contact Us */}
              <section className="rounded-xl border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6">
                <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-4">
                  Contact Us
                </h2>
                <p className="text-[#617589] dark:text-gray-400 mb-4">
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <div className="space-y-2 text-[#617589] dark:text-gray-400">
                  <p>Email: <a href="mailto:privacy@sakura.com" className="text-primary hover:underline">privacy@sakura.com</a></p>
                  <p>Phone: <a href="tel:+8801234567890" className="text-primary hover:underline">+880 1234 567890</a></p>
                </div>
              </section>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="flex shrink-0 items-center justify-center p-6 sm:p-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-6 text-sm text-[#617589] dark:text-gray-400">
            <Link
              href="/help"
              className="hover:text-primary transition-colors"
            >
              Help Center
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

