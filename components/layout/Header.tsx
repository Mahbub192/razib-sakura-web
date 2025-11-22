'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api/auth'

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    // Listen for storage changes (login/logout from other tabs)
    const handleStorageChange = () => {
      checkAuth()
    }
    // Also check on focus (when user returns to tab)
    const handleFocus = () => {
      checkAuth()
    }
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('focus', handleFocus)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  const checkAuth = () => {
    const authenticated = authApi.isAuthenticated()
    const currentUser = authApi.getCurrentUser()
    setIsAuthenticated(authenticated)
    setUser(currentUser)
  }

  const handleLogout = () => {
    authApi.logout()
    setIsAuthenticated(false)
    setUser(null)
    router.push('/')
    router.refresh()
  }

  const handleProtectedLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!isAuthenticated) {
      e.preventDefault()
      router.push(`/auth/login?redirect=${encodeURIComponent(href)}`)
    }
  }

  const getDashboardLink = () => {
    if (!user) return '/auth/login'
    const role = user.role?.toLowerCase()
    if (role === 'patient') return '/patient/dashboard'
    if (role === 'doctor') return '/doctor/dashboard'
    if (role === 'assistant') return '/assistant/dashboard'
    if (role === 'admin') return '/admin/dashboard'
    return '/auth/login'
  }

  const getAppointmentsLink = () => {
    if (!user) return '/auth/login'
    const role = user.role?.toLowerCase()
    if (role === 'patient') return '/patient/appointments'
    return '/auth/login'
  }

  const getMessagesLink = () => {
    if (!user) return '/auth/login'
    const role = user.role?.toLowerCase()
    if (role === 'patient') return '/patient/messages'
    return '/auth/login'
  }

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-gray-800 px-4 sm:px-6 lg:px-8 py-4 bg-white dark:bg-background-dark sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-3 text-[#111418] dark:text-white">
        <div className="text-primary">
          {/* Sakura Logo - Cherry Blossom */}
          <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="20" fill="url(#sakuraGradient)" opacity="0.2"/>
            <path d="M24 8C24 8 18 12 18 18C18 24 24 28 24 28C24 28 30 24 30 18C30 12 24 8 24 8Z" fill="#FF69B4"/>
            <path d="M24 20C24 20 20 22 20 24C20 26 24 28 24 28C24 28 28 26 28 24C28 22 24 20 24 20Z" fill="#FFB6C1"/>
            <path d="M20 16L24 12L28 16" stroke="#FF69B4" strokeWidth="2" strokeLinecap="round"/>
            <path d="M16 24L12 24L16 28" stroke="#FF69B4" strokeWidth="2" strokeLinecap="round"/>
            <path d="M24 32L24 36L28 32" stroke="#FF69B4" strokeWidth="2" strokeLinecap="round"/>
            <path d="M32 24L36 24L32 20" stroke="#FF69B4" strokeWidth="2" strokeLinecap="round"/>
            <defs>
              <linearGradient id="sakuraGradient" x1="0" y1="0" x2="48" y2="48">
                <stop offset="0%" stopColor="#FF69B4"/>
                <stop offset="100%" stopColor="#FFB6C1"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h2 className="text-[#111418] dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">Sakura</h2>
      </Link>

      <nav className="hidden lg:flex flex-1 justify-center gap-8">
        <Link href="/" className="text-primary text-sm font-bold leading-normal">
          Home
        </Link>
        <Link href="/today" className="text-[#111418] dark:text-gray-300 hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal">
          Today's Patients
        </Link>
        <Link href="/find-doctor" className="text-[#111418] dark:text-gray-300 hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal">
          Find a Doctor
        </Link>
        {isAuthenticated ? (
          <>
            <Link 
              href={getAppointmentsLink()} 
              className="text-[#111418] dark:text-gray-300 hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal"
            >
              My Appointments
            </Link>
            <Link 
              href={getMessagesLink()} 
              className="text-[#111418] dark:text-gray-300 hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal"
            >
              Messages
            </Link>
          </>
        ) : (
          <>
            <Link 
              href="/auth/login" 
              onClick={(e) => handleProtectedLink(e, '/patient/appointments')}
              className="text-[#111418] dark:text-gray-300 hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal"
            >
              My Appointments
            </Link>
            <Link 
              href="/auth/login" 
              onClick={(e) => handleProtectedLink(e, '/patient/messages')}
              className="text-[#111418] dark:text-gray-300 hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal"
            >
              Messages
            </Link>
          </>
        )}
      </nav>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <Link
              href={getDashboardLink()}
              className="flex items-center gap-2 px-4 py-2 text-[#111418] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 bg-gradient-to-br from-primary-200 to-primary-400 flex items-center justify-center">
                <span className="text-primary-700 font-semibold text-sm">
                  {user?.fullName?.charAt(0) || 'U'}
                </span>
              </div>
              <span className="hidden md:inline text-sm font-medium">{user?.fullName || 'User'}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-red-600 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-red-700 transition-colors"
            >
              <span className="truncate">Logout</span>
            </button>
          </>
        ) : (
          <Link
            href="/auth/login"
            className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors"
          >
            <span className="truncate">Log In</span>
          </Link>
        )}
      </div>
    </header>
  )
}
