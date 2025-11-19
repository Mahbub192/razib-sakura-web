'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

interface AssistantSidebarProps {
  activePage?: string
}

export default function AssistantSidebar({ activePage }: AssistantSidebarProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems = [
    { href: '/assistant/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { href: '/assistant/appointments', label: 'Appointments', icon: 'list_alt' },
    { href: '/assistant/patients', label: 'Patients', icon: 'group' },
    { href: '/assistant/calendar', label: 'Calendar', icon: 'calendar_month' },
    { href: '/assistant/reports', label: 'Reports', icon: 'bar_chart' },
    { href: '/assistant/communications', label: 'Communications', icon: 'chat' },
    { href: '/assistant/settings', label: 'Settings', icon: 'settings' },
  ]

  const isActive = (href: string) => {
    if (activePage) {
      return activePage === href
    }
    return pathname === href || pathname?.startsWith(href + '/')
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg"
        aria-label="Toggle menu"
      >
        <span className="material-symbols-outlined text-2xl text-gray-700 dark:text-gray-300">
          {isMobileMenuOpen ? 'close' : 'menu'}
        </span>
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark p-4 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col gap-4 h-full overflow-y-auto">
          {/* Profile Section */}
          <div className="flex items-center gap-3 px-2">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 flex-shrink-0"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDaxM0wNFKrDU8Mv8BAOJspA5Z6u2Y55brKTpqS4ROf6q8xEbWBzaPg4yjolSXminz0fSpTGjvgY9W9y59Lw3KPW4__KGKK6yaax2B48p2d5vcW_707PRwZUcPPOrVhmqwVQqZAWo2sF-sff_tYDTm91aBuuzAYMzxJtzBsWOt5p-0MSLu8fM-EprRrkaE9_7SvNJb68IICeo4-ThCJOAkqilKQKYUF-ILNjtSs40ohwSn0CYsB4hBg_2hUwiDDlGp94z_6uV7pUvY")',
              }}
            />
            <div className="flex flex-col min-w-0">
              <h1 className="text-gray-900 dark:text-white text-base font-semibold leading-normal truncate">
                Sarah Johnson
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal truncate">
                Medical Assistant
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2 mt-4">
            {navigationItems.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    active
                      ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className={`material-symbols-outlined text-2xl flex-shrink-0 ${active ? 'fill' : ''}`}>
                    {item.icon}
                  </span>
                  <p className={`text-sm leading-normal truncate ${active ? 'font-semibold' : 'font-medium'}`}>
                    {item.label}
                  </p>
                </Link>
              )
            })}
          </nav>

          {/* Stats Cards - Hidden on mobile, visible on desktop */}
          <div className="hidden lg:flex mt-auto flex-col gap-4">
            <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-4 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-normal">Total Patients</p>
              <p className="text-gray-900 dark:text-white tracking-light text-3xl font-bold leading-tight">850</p>
              <p className="text-green-600 dark:text-green-500 text-sm font-medium leading-normal">+1.5% this month</p>
            </div>
            <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-4 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-normal">Appointments Today</p>
              <p className="text-gray-900 dark:text-white tracking-light text-3xl font-bold leading-tight">12</p>
              <p className="text-red-600 dark:text-red-500 text-sm font-medium leading-normal">-5% vs yesterday</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

