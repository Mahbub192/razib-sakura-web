'use client'

import Link from 'next/link'
import { useState, useRef, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function VerifyForm() {
  const searchParams = useSearchParams()
  const phoneNumber = searchParams.get('phone') || ''
  const maskedPhone = phoneNumber ? `**${phoneNumber.slice(-2)}` : '**98'
  
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (code[index] === '' && index > 0) {
        // If current field is empty, clear previous and focus it
        const newCode = [...code]
        newCode[index - 1] = ''
        setCode(newCode)
        inputRefs.current[index - 1]?.focus()
      } else {
        // Clear current field
        const newCode = [...code]
        newCode[index] = ''
        setCode(newCode)
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    if (/^\d+$/.test(pastedData)) {
      const newCode = [...code]
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedData[i] || ''
      }
      setCode(newCode)
      // Focus the last filled input or the first empty one
      const nextIndex = Math.min(pastedData.length, 5)
      inputRefs.current[nextIndex]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const verificationCode = code.join('')
    
    if (verificationCode.length !== 6) {
      alert('Please enter the complete 6-digit code')
      return
    }

    setIsLoading(true)
    
    // TODO: Implement verification logic
    console.log('Verifying code:', verificationCode)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Redirect to reset password page after successful verification
      // router.push(`/auth/reset-password?phone=${phoneNumber}&verified=true`)
    }, 1000)
  }

  const handleResend = async () => {
    // TODO: Implement resend code logic
    console.log('Resending code to:', phoneNumber)
    
    // Reset code fields
    setCode(['', '', '', '', '', ''])
    inputRefs.current[0]?.focus()
    
    // TODO: Call API to resend code
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 bg-background-light dark:bg-background-dark">
      {/* Logo */}
      <div className="absolute top-8 left-8 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-3xl">
          health_and_safety
        </span>
        <span className="text-xl font-bold text-[#111418] dark:text-white">HealthClinic</span>
      </div>

      <div className="w-full max-w-md">
        <div className="flex flex-col rounded-xl bg-white dark:bg-[#16222d] shadow-sm">
          {/* Page Heading */}
          <div className="flex flex-col gap-2 p-8 text-center">
            <p className="text-3xl font-black leading-tight tracking-[-0.03em] text-[#111418] dark:text-white">
              Enter Verification Code
            </p>
            <p className="text-base font-normal leading-normal text-[#617589] dark:text-gray-400">
              We've sent a 6-digit code to your phone number ending in {maskedPhone}.
            </p>
          </div>

          <div className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="flex w-full flex-col items-center gap-6">
              {/* Verification Code Inputs */}
              <fieldset className="flex w-full justify-center gap-3">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el
                    }}
                    type="number"
                    inputMode="numeric"
                    max={9}
                    maxLength={1}
                    min={0}
                    value={digit}
                    onChange={(e) => {
                      const value = e.target.value.slice(-1)
                      handleChange(index, value)
                    }}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="flex h-16 w-12 flex-1 rounded-lg border border-[#dbe0e6] dark:border-[#344252] bg-background-light dark:bg-background-dark text-center text-2xl font-bold [appearance:textfield] focus:border-primary focus:outline-0 focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                ))}
              </fieldset>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={isLoading || code.join('').length !== 6}
                className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="truncate">
                  {isLoading ? 'Verifying...' : 'Verify Code'}
                </span>
              </button>

              {/* Resend Link */}
              <p className="text-sm font-normal leading-normal text-center text-[#617589] dark:text-gray-400">
                Didn't receive the code?{' '}
                <button
                  type="button"
                  onClick={handleResend}
                  className="font-semibold text-primary underline hover:text-primary/80"
                >
                  Resend
                </button>
              </p>
            </form>
          </div>
        </div>

        {/* Back to Sign In Link */}
        <Link
          href="/auth/login"
          className="flex items-center justify-center gap-2 pt-6 text-sm font-normal leading-normal text-center text-[#617589] dark:text-gray-400 hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          <span>Back to Sign In</span>
        </Link>
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 bg-background-light dark:bg-background-dark">
        <div className="w-full max-w-md">
          <div className="flex flex-col rounded-xl bg-white dark:bg-[#16222d] shadow-sm p-8">
            <p className="text-center text-[#617589] dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <VerifyForm />
    </Suspense>
  )
}

