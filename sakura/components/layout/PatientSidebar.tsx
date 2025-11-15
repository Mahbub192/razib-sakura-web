'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  name: string
  href: string
  icon: string
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/patient/dashboard', icon: 'dashboard' },
  { name: 'Appointments', href: '/patient/appointments', icon: 'event' },
  { name: 'Medical Records', href: '/patient/medical-records', icon: 'folder' },
  { name: 'Lab Results', href: '/patient/lab-results', icon: 'science' },
  { name: 'Messages', href: '/patient/messages', icon: 'chat_bubble' },
  { name: 'Prescriptions', href: '/patient/prescriptions', icon: 'medication' },
]

const bottomNavItems: NavItem[] = [
  { name: 'Update Profile', href: '/patient/profile', icon: 'person' },
  { name: 'Log Out', href: '/auth/login', icon: 'logout' },
]

export const PatientSidebar = () => {
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
            <p className="font-semibold text-[#111418] dark:text-white">Amelia Reyes</p>
            <p className="text-sm text-[#617589] dark:text-gray-400">Patient Dashboard</p>
          </div>
        </div>
      </div>

      {/* Book Appointment Button */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Link
          href="/patient/appointments/book"
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold shadow-sm"
        >
          <span className="material-symbols-outlined text-lg">add_circle</span>
          <span>Book Appointment</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
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

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        {bottomNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#617589] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </aside>
  )
}

