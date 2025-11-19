'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminSidebar() {
  const pathname = usePathname()

  const menuItems = [
    {
      title: 'Dashboard',
      icon: 'dashboard',
      href: '/admin/dashboard',
    },
    {
      title: 'Users',
      icon: 'people',
      href: '/admin/users',
    },
    {
      title: 'Doctors',
      icon: 'medical_services',
      href: '/admin/doctors',
    },
    {
      title: 'Patients',
      icon: 'person',
      href: '/admin/patients',
    },
    {
      title: 'Assistants',
      icon: 'support_agent',
      href: '/admin/assistants',
    },
    {
      title: 'Clinics',
      icon: 'local_hospital',
      href: '/admin/clinics',
    },
    {
      title: 'Appointments',
      icon: 'event',
      href: '/admin/appointments',
    },
    {
      title: 'Analytics',
      icon: 'analytics',
      href: '/admin/analytics',
    },
    {
      title: 'Settings',
      icon: 'settings',
      href: '/admin/settings',
    },
  ]

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen fixed left-0 top-0 pt-16">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-[#617589] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              <span className="font-medium">{item.title}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

