'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { authApi } from '@/lib/api/auth'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    
    try {
      const response = await authApi.login({ phoneNumber, password })
      
      if (response.success && response.data) {
        // Get redirect URL from query params or default based on role
        const redirect = searchParams.get('redirect')
        const userRole = response.data.user.role.toLowerCase()
        
        if (redirect) {
          router.push(redirect)
        } else {
          // Redirect based on user role
          switch (userRole) {
            case 'patient':
              router.push('/patient/dashboard')
              break
            case 'doctor':
              router.push('/doctor/dashboard')
              break
            case 'assistant':
              router.push('/assistant/dashboard')
              break
            case 'admin':
              router.push('/admin/dashboard')
              break
            default:
              router.push('/patient/dashboard')
          }
        }
      } else {
        setError(response.message || 'Login failed. Please try again.')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.')
      console.error('Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="flex shrink-0 items-center justify-center p-6 sm:p-8">
          <Link 
            href="/" 
            className="flex items-center gap-3 text-2xl font-bold text-[#111418] dark:text-white"
          >
            <span className="material-symbols-outlined text-primary text-4xl">
              health_and_safety
            </span>
            <span>VitalCare Portal</span>
          </Link>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 items-center justify-center p-4">
          <div className="flex w-full max-w-md flex-col items-center justify-center gap-6 rounded-xl border border-[#dbe0e6] bg-white dark:border-gray-700 dark:bg-gray-800/50 p-6 sm:p-10">
            {/* Welcome Section */}
            <div className="flex w-full flex-col gap-3 text-center">
              <p className="text-[#111418] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                Welcome Back
              </p>
              <p className="text-[#617589] dark:text-gray-400 text-base font-normal leading-normal">
                Securely access your appointments and health records.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="w-full rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-600 dark:text-red-400">
                    error
                  </span>
                  <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
              {/* Phone Number Field */}
              <label className="flex flex-col flex-1">
                <p className="text-[#111418] dark:text-white text-base font-medium leading-normal pb-2">
                  Phone Number
                </p>
                <div className="flex w-full flex-1 items-stretch rounded-lg">
                  <div className="text-[#617589] dark:text-gray-400 flex border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-900 items-center justify-center pl-[15px] rounded-l-lg border-r-0">
                    <span className="material-symbols-outlined">call</span>
                  </div>
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] dark:text-white focus:outline-0 focus:ring-0 border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-900 focus:border-primary h-14 placeholder:text-[#617589] dark:placeholder:text-gray-500 p-[15px] rounded-l-none border-l-0 text-base font-normal leading-normal"
                  />
                </div>
              </label>

              {/* Password Field */}
              <div className="w-full">
                <label className="flex flex-col flex-1">
                  <p className="text-[#111418] dark:text-white text-base font-medium leading-normal pb-2">
                    Password
                  </p>
                  <div className="flex w-full flex-1 items-stretch rounded-lg">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] dark:text-white focus:outline-0 focus:ring-0 border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-900 focus:border-primary h-14 placeholder:text-[#617589] dark:placeholder:text-gray-500 p-[15px] rounded-r-none border-r-0 pr-2 text-base font-normal leading-normal"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                      className="text-[#617589] dark:text-gray-400 flex border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-900 items-center justify-center pr-[15px] rounded-r-lg border-l-0 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <span className="material-symbols-outlined">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </label>
                <div className="w-full flex justify-end pt-2">
                  <Link
                    href="/auth/forgot-password"
                    className="text-primary text-sm font-medium leading-normal underline hover:text-primary/80"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <div className="w-full flex flex-col items-center gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="truncate">
                    {isLoading ? 'Logging in...' : 'Log In'}
                  </span>
                </button>
                <p className="text-center text-sm text-[#617589] dark:text-gray-400">
                  Don't have an account?{' '}
                  <Link
                    href="/auth/register"
                    className="font-bold text-primary underline hover:text-primary/80"
                  >
                    Register here
                  </Link>
                </p>
              </div>
            </form>

            {/* Security Message */}
            <div className="flex items-center gap-2 text-[#617589] dark:text-gray-400 text-xs">
              <span className="material-symbols-outlined text-base">lock</span>
              <span>Your information is safe and secure.</span>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="flex shrink-0 items-center justify-center p-6 sm:p-8">
          <div className="flex items-center gap-6 text-sm text-[#617589] dark:text-gray-400">
            <Link
              href="/help"
              className="hover:text-primary transition-colors"
            >
              Help Center
            </Link>
            <Link
              href="/privacy"
              className="hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </footer>
      </div>
    </div>
  )
}

