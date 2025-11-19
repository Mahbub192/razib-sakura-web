'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

type PasswordStrength = 'weak' | 'medium' | 'strong'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const phoneNumber = searchParams.get('phone') || ''
  const verified = searchParams.get('verified') === 'true'

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Calculate password strength
  const calculatePasswordStrength = (password: string): { strength: PasswordStrength; percentage: number; label: string; color: string } => {
    if (password.length === 0) {
      return { strength: 'weak', percentage: 0, label: '', color: '' }
    }

    let strength = 0
    let percentage = 0
    let label = ''
    let color = ''

    // Length check
    if (password.length >= 8) strength += 1
    if (password.length >= 12) strength += 1

    // Character variety checks
    if (/[a-z]/.test(password)) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1

    if (strength <= 2) {
      percentage = 25
      label = 'Weak'
      color = '#D0021B' // soft-red
    } else if (strength <= 4) {
      percentage = 50
      label = 'Medium'
      color = '#FFA500' // orange
    } else {
      percentage = 100
      label = 'Strong'
      color = '#50E3C2' // gentle-green
    }

    return { strength: strength <= 2 ? 'weak' : strength <= 4 ? 'medium' : 'strong', percentage, label, color }
  }

  const passwordStrength = calculatePasswordStrength(newPassword)

  // Check if passwords match
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0
  const showPasswordMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    if (!/[0-9]/.test(newPassword)) {
      setError('Password must include at least one number')
      return
    }

    if (!/[^a-zA-Z0-9]/.test(newPassword)) {
      setError('Password must include at least one special character')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)

    // TODO: Implement reset password logic
    console.log('Resetting password for:', phoneNumber)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Redirect to login page after successful password reset
      router.push('/auth/login?passwordReset=true')
    }, 1000)
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 bg-background-light dark:bg-background-dark">
      <div className="flex w-full max-w-md flex-col items-center rounded-xl border border-gray-200/80 bg-white dark:border-gray-800 dark:bg-background-dark shadow-sm">
        {/* TopNavBar Section */}
        <header className="flex w-full items-center justify-center whitespace-nowrap border-b border-solid border-gray-200 dark:border-gray-800 px-6 sm:px-10 py-4">
          <div className="flex items-center gap-3 text-[#333333] dark:text-gray-200">
            <div className="size-6 text-[#4A90E2]">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold leading-tight tracking-tight">ClinicLogo</h2>
          </div>
        </header>

        <main className="w-full p-6 sm:p-10">
          <div className="flex flex-col gap-8">
            {/* PageHeading Section */}
            <div className="flex flex-col gap-2 text-center">
              <p className="text-[#333333] dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">
                Create Your New Password
              </p>
              <p className="text-[#757575] dark:text-gray-400 text-base font-normal leading-normal">
                Your new password must be at least 8 characters long and include a number and a special character.
              </p>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* New Password Field */}
              <label className="flex flex-col w-full">
                <p className="text-[#333333] dark:text-gray-200 text-sm font-medium leading-normal pb-2">
                  New Password
                </p>
                <div className="relative flex w-full flex-1 items-stretch rounded-lg">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value)
                      setError('')
                    }}
                    placeholder="Enter your new password"
                    required
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#333333] dark:text-gray-100 dark:bg-background-dark focus:ring-2 focus:ring-[#4A90E2] focus:outline-none border border-gray-300 dark:border-gray-700 bg-white h-12 placeholder:text-[#757575] dark:placeholder:text-gray-500 pl-4 pr-12 text-base font-normal leading-normal"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#757575] dark:text-gray-400 hover:text-[#333333] dark:hover:text-gray-300"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showNewPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </label>

              {/* Password Strength Indicator */}
              {newPassword.length > 0 && (
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium leading-normal text-[#333333] dark:text-gray-300">
                      Password Strength:{' '}
                      <span
                        style={{
                          color: passwordStrength.color || '#D0021B',
                        }}
                      >
                        {passwordStrength.label}
                      </span>
                    </p>
                  </div>
                  <div className="w-full rounded-full bg-gray-200 dark:bg-gray-700 h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${passwordStrength.percentage}%`,
                        backgroundColor: passwordStrength.color || '#D0021B',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Confirm New Password Field */}
              <label className="flex flex-col w-full">
                <p className="text-[#333333] dark:text-gray-200 text-sm font-medium leading-normal pb-2">
                  Confirm New Password
                </p>
                <div className="relative flex w-full flex-1 items-stretch rounded-lg">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      setError('')
                    }}
                    placeholder="Re-enter your new password"
                    required
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#333333] dark:text-gray-100 dark:bg-background-dark focus:ring-2 focus:ring-[#4A90E2] focus:outline-none border border-gray-300 dark:border-gray-700 bg-white h-12 placeholder:text-[#757575] dark:placeholder:text-gray-500 pl-4 pr-12 text-base font-normal leading-normal"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#757575] dark:text-gray-400 hover:text-[#333333] dark:hover:text-gray-300"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showConfirmPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </label>

              {/* Error Message */}
              {(error || showPasswordMismatch) && (
                <div className="flex items-center gap-2 text-[#D0021B] dark:text-red-400">
                  <span className="material-symbols-outlined text-base">error</span>
                  <p className="text-sm font-medium">
                    {error || 'Passwords do not match.'}
                  </p>
                </div>
              )}

              {/* Button Section */}
              <button
                type="submit"
                disabled={isLoading || !passwordsMatch || passwordStrength.strength === 'weak'}
                className="flex h-12 w-full items-center justify-center rounded-lg bg-[#4A90E2] px-6 text-base font-bold text-white shadow-sm hover:bg-[#4A90E2]/90 focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:ring-offset-2 dark:focus:ring-offset-background-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 bg-background-light dark:bg-background-dark">
          <div className="flex w-full max-w-md flex-col items-center rounded-xl border border-gray-200/80 bg-white dark:border-gray-800 dark:bg-background-dark shadow-sm p-8">
            <p className="text-center text-[#757575] dark:text-gray-400">Loading...</p>
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  )
}

