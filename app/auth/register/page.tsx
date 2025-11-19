'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api/auth'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    agreeToTerms: false,
    newsletter: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    
    if (!formData.agreeToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy')
      return
    }

    setIsLoading(true)
    
    try {
      const response = await authApi.register({
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        password: formData.password,
        role: 'patient', // Default to patient for registration
      })
      
      if (response.success && response.data) {
        // Redirect to dashboard based on role
        const userRole = response.data.user.role.toLowerCase()
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
          default:
            router.push('/patient/dashboard')
        }
      } else {
        setError(response.message || 'Registration failed. Please try again.')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.')
      console.error('Registration error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root">
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8 py-3 bg-white dark:bg-background-dark">
          <div className="flex items-center gap-4 text-gray-900 dark:text-white">
            <div className="size-6 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor" />
              </svg>
            </div>
            <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">ClinicName</h2>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
              Already have an account?
            </p>
            <Link
              href="/auth/login"
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors"
            >
              <span className="truncate">Log In</span>
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 justify-center py-8 sm:py-12 lg:py-16 px-4">
          <div className="layout-content-container flex flex-col w-full max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Registration Form */}
              <div className="flex flex-col">
                <div className="mb-8">
                  <p className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                    Create Your Patient Account
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal mt-2">
                    Join our clinic to easily manage your appointments and medical history.
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
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

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Account Information Section */}
                  <div>
                    <h3 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] pb-2 pt-4 border-b border-gray-200 dark:border-gray-700 mb-4">
                      Account Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                      {/* Full Name */}
                      <label className="flex flex-col min-w-40 flex-1 sm:col-span-1 col-span-2">
                        <p className="text-gray-900 dark:text-gray-200 text-sm font-medium leading-normal pb-2">
                          Full Name
                        </p>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          required
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 h-12 placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 text-base font-normal leading-normal"
                        />
                      </label>

                      {/* Phone Number */}
                      <label className="flex flex-col min-w-40 flex-1 sm:col-span-1 col-span-2">
                        <p className="text-gray-900 dark:text-gray-200 text-sm font-medium leading-normal pb-2">
                          Phone Number
                        </p>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          placeholder="(123) 456-7890"
                          required
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 h-12 placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 text-base font-normal leading-normal"
                        />
                      </label>

                      {/* Email Address */}
                      <label className="flex flex-col min-w-40 flex-1 col-span-2">
                        <p className="text-gray-900 dark:text-gray-200 text-sm font-medium leading-normal pb-2">
                          Email Address
                        </p>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="name@example.com"
                          required
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 h-12 placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 text-base font-normal leading-normal"
                        />
                      </label>

                      {/* Password */}
                      <div className="flex flex-col min-w-40 flex-1">
                        <p className="text-gray-900 dark:text-gray-200 text-sm font-medium leading-normal pb-2">
                          Password
                        </p>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                            minLength={8}
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 h-12 placeholder:text-gray-500 dark:placeholder:text-gray-400 pl-4 pr-10 text-base font-normal leading-normal"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            <span className="material-symbols-outlined text-xl">
                              {showPassword ? 'visibility_off' : 'visibility'}
                            </span>
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Must be at least 8 characters.
                        </p>
                      </div>

                      {/* Confirm Password */}
                      <label className="flex flex-col min-w-40 flex-1">
                        <p className="text-gray-900 dark:text-gray-200 text-sm font-medium leading-normal pb-2">
                          Confirm Password
                        </p>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            required
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 h-12 placeholder:text-gray-500 dark:placeholder:text-gray-400 pl-4 pr-10 text-base font-normal leading-normal"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            <span className="material-symbols-outlined text-xl">
                              {showConfirmPassword ? 'visibility_off' : 'visibility'}
                            </span>
                          </button>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Personal Details Section */}
                  <div>
                    <h3 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] pb-2 pt-4 border-b border-gray-200 dark:border-gray-700 mb-4">
                      Personal Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                      {/* Date of Birth */}
                      <div className="flex flex-col min-w-40 flex-1">
                        <p className="text-gray-900 dark:text-gray-200 text-sm font-medium leading-normal pb-2">
                          Date of Birth
                        </p>
                        <div className="relative">
                          <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 h-12 placeholder:text-gray-500 dark:placeholder:text-gray-400 pl-4 pr-10 text-base font-normal leading-normal"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400 pointer-events-none">
                            <span className="material-symbols-outlined text-xl">calendar_today</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-4 pt-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="terms"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleChange}
                        required
                        className="form-checkbox mt-1 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary/50 dark:bg-gray-800 dark:border-gray-600"
                      />
                      <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
                        I agree to the{' '}
                        <Link href="/terms" className="font-medium text-primary hover:underline">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="font-medium text-primary hover:underline">
                          Privacy Policy
                        </Link>
                        .
                      </label>
                    </div>
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="newsletter"
                        name="newsletter"
                        checked={formData.newsletter}
                        onChange={handleChange}
                        className="form-checkbox mt-1 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary/50 dark:bg-gray-800 dark:border-gray-600"
                      />
                      <label htmlFor="newsletter" className="text-sm text-gray-600 dark:text-gray-400">
                        Sign me up for clinic newsletters and updates.
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors duration-200 disabled:bg-primary/40 disabled:cursor-not-allowed"
                  >
                    <span className="truncate">
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </span>
                  </button>
                </form>
              </div>

              {/* Benefits Section (Desktop Only) */}
              <div className="hidden lg:flex items-center justify-center">
                <div className="bg-white dark:bg-gray-800/50 rounded-xl p-8 lg:p-12 border border-gray-200 dark:border-gray-700 h-full w-full flex flex-col justify-center">
                  <img
                    className="w-full h-64 object-cover rounded-lg mb-8"
                    alt="A doctor with a stethoscope smiling kindly at the camera."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCKI9AoVNOBA0JttSKXR1RoPZ6fid7rHK45QO3ZKKKMFNYLDtU5ID7ob9qUU3FvrM0YB-rAA5BRRvkn0KMUw6l3P4IoGr2BPVFlKfm5-_v3600uHMIHTb5Ved5WmXiF9eWNE6CHHK2jFr5PLNibDgC-hyehgCw7YN_DA3fHoVpw4Jou-xgTSlr5d3nQRnxsUNPkWcWIwvQnIfgGY2JNUsh1qMp9YNaKc7oNCUgox_AZJpgjw0dX7kFe1u3yfr2qDCZbRcEXvnLlvE"
                  />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Your Health, Simplified.
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Creating an account gives you immediate access to manage your healthcare journey with us.
                  </p>
                  <ul className="space-y-4 text-gray-700 dark:text-gray-300">
                    <li className="flex items-start">
                      <span className="material-symbols-outlined text-primary text-xl mr-3 mt-0.5">
                        check_circle
                      </span>
                      <span>
                        <strong className="font-semibold text-gray-900 dark:text-white">
                          Easy Appointment Booking:
                        </strong>{' '}
                        Schedule and manage your visits online, anytime.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="material-symbols-outlined text-primary text-xl mr-3 mt-0.5">
                        check_circle
                      </span>
                      <span>
                        <strong className="font-semibold text-gray-900 dark:text-white">
                          Access Your Medical History:
                        </strong>{' '}
                        Securely view your records and test results.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="material-symbols-outlined text-primary text-xl mr-3 mt-0.5">
                        check_circle
                      </span>
                      <span>
                        <strong className="font-semibold text-gray-900 dark:text-white">
                          Secure Communication:
                        </strong>{' '}
                        Send and receive messages from our care team.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

