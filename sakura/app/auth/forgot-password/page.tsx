'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function ForgotPasswordPage() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [codeSent, setCodeSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // TODO: Implement send code logic
    console.log('Sending verification code to:', phoneNumber)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setCodeSent(true)
      // After code is sent, redirect to reset-password page with phone number
      // router.push(`/auth/reset-password?phone=${phoneNumber}`)
    }, 1000)
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden p-4">
      <div className="layout-container flex h-full grow flex-col w-full max-w-md">
        <div className="flex flex-col items-center gap-8 py-10">
          {/* Logo Header */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
              <span className="material-symbols-outlined !text-3xl">health_and_safety</span>
            </div>
            <p className="text-2xl font-bold text-[#111418] dark:text-white">Wellness Clinic</p>
          </div>

          {/* Card Container */}
          <div className="flex w-full flex-col gap-8 rounded-xl bg-white dark:bg-background-dark/50 p-8 shadow-sm">
            {/* Page Heading */}
            <div className="flex flex-col gap-2 text-center">
              <p className="text-[#111418] dark:text-white text-3xl font-bold leading-tight tracking-tighter">
                Reset Your Password
              </p>
              <p className="text-[#617589] dark:text-gray-300 text-base font-normal leading-normal">
                {codeSent
                  ? 'Verification code has been sent to your phone number.'
                  : 'Enter your registered phone number to receive a verification code.'}
              </p>
            </div>

            {!codeSent ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* Phone Number Field */}
                <label className="flex flex-col w-full">
                  <p className="text-[#111418] dark:text-white text-base font-medium leading-normal pb-2">
                    Phone Number
                  </p>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-4 text-[#617589] dark:text-gray-400">
                      phone
                    </span>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter your phone number"
                      required
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-background-dark h-14 placeholder:text-[#617589] dark:placeholder:text-gray-500 pl-12 pr-4 text-base font-normal leading-normal"
                    />
                  </div>
                </label>

                {/* Send Code Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 w-full bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="truncate">
                    {isLoading ? 'Sending...' : 'Send Code'}
                  </span>
                </button>
              </form>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-center p-4 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary text-4xl">
                    check_circle
                  </span>
                </div>
                <p className="text-center text-[#617589] dark:text-gray-300 text-sm">
                  Please check your phone for the verification code.
                </p>
                <Link
                  href={`/auth/reset-password?phone=${encodeURIComponent(phoneNumber)}`}
                  className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 w-full bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background-dark transition-colors text-center"
                >
                  <span className="truncate">Continue to Reset Password</span>
                </Link>
                <button
                  onClick={() => {
                    setCodeSent(false)
                    setPhoneNumber('')
                  }}
                  className="text-[#617589] dark:text-gray-300 text-sm font-normal leading-normal text-center underline hover:text-primary dark:hover:text-primary/80"
                >
                  Resend Code
                </button>
              </div>
            )}

            {/* Back to Login Link */}
            <Link
              href="/auth/login"
              className="text-[#617589] dark:text-gray-300 text-sm font-normal leading-normal text-center underline hover:text-primary dark:hover:text-primary/80"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

