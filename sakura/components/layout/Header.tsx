'use client'

import Link from 'next/link'
import { useState } from 'react'

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-gray-800 px-4 sm:px-6 lg:px-8 py-4 bg-white dark:bg-background-dark sticky top-0 z-50">
      <div className="flex items-center gap-4 text-[#111418] dark:text-white">
        <div className="text-primary">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"></path>
          </svg>
        </div>
        <h2 className="text-[#111418] dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">HealthSystem</h2>
      </div>

      <nav className="hidden lg:flex flex-1 justify-center gap-8">
        <Link href="/" className="text-primary text-sm font-bold leading-normal">
          Home
        </Link>
        <Link href="/find-doctor" className="text-[#111418] dark:text-gray-300 hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal">
          Find a Doctor
        </Link>
        <Link href="/appointments" className="text-[#111418] dark:text-gray-300 hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal">
          My Appointments
        </Link>
        <Link href="/messages" className="text-[#111418] dark:text-gray-300 hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal">
          Messages
        </Link>
      </nav>

      <div className="flex items-center gap-4">
        <Link
          href="/auth/login"
          className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors"
        >
          <span className="truncate">Log In</span>
        </Link>
        <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-background-light dark:bg-background-dark text-[#111418] dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800">
          <span className="material-symbols-outlined text-xl">notifications</span>
        </button>
        <div className="relative">
          <button className="flex items-center gap-2">
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 bg-gradient-to-br from-primary-200 to-primary-400 flex items-center justify-center">
              <span className="text-primary-700 font-semibold">A</span>
            </div>
            <span className="hidden md:inline text-sm font-medium text-[#111418] dark:text-gray-300">Alex Johnson</span>
            <span className="material-symbols-outlined hidden md:inline text-[#111418] dark:text-gray-300">expand_more</span>
          </button>
        </div>
      </div>
    </header>
  )
}
