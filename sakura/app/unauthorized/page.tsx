'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background-light dark:bg-background-dark p-4">
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center size-20 rounded-full bg-red-100 dark:bg-red-900/20 mb-6 mx-auto">
          <span className="material-symbols-outlined text-5xl text-red-600 dark:text-red-400">
            block
          </span>
        </div>
        
        <h1 className="text-3xl font-bold text-[#111418] dark:text-white mb-4">
          Access Denied
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-semibold"
          >
            Go Back
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold text-center"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

