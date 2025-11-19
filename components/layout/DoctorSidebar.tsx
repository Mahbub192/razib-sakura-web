'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  name: string
  href: string
  icon: string
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/doctor/dashboard', icon: 'dashboard' },
  { name: 'Patients', href: '/doctor/patients', icon: 'people' },
  { name: 'Calendar', href: '/doctor/calendar', icon: 'event' },
  { name: 'Appointment Slots', href: '/doctor/appointment-slots', icon: 'schedule' },
  { name: 'Home Page Information', href: '/doctor/home-page', icon: 'edit' },
  { name: 'Reports', href: '/doctor/reports', icon: 'bar_chart' },
  { name: 'Settings', href: '/doctor/settings/profile', icon: 'settings' },
]

export const DoctorSidebar = () => {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen flex flex-col">
      {/* User Profile */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
            <span className="text-primary font-semibold text-lg">A</span>
          </div>
          <div>
            <p className="font-semibold text-[#111418] dark:text-white">Dr. Ashraful Islam Razib</p>
            <p className="text-sm text-[#617589] dark:text-gray-400">ENT Specialist</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-[#617589] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Summary Cards */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
        <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
          <p className="text-sm text-[#617589] dark:text-gray-400 mb-1">Total Patients</p>
          <p className="text-2xl font-bold text-[#111418] dark:text-white">850</p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">+1.5% this month</p>
        </div>
        <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
          <p className="text-sm text-[#617589] dark:text-gray-400 mb-1">Appointments Today</p>
          <p className="text-2xl font-bold text-[#111418] dark:text-white">12</p>
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">-5% vs yesterday</p>
        </div>
      </div>
    </aside>
  )
}

