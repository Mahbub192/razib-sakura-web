'use client'

import AssistantSidebar from './AssistantSidebar'

interface AssistantLayoutProps {
  children: React.ReactNode
  activePage?: string
}

export default function AssistantLayout({ children, activePage }: AssistantLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-200">
      <AssistantSidebar activePage={activePage} />
      <main className="flex-1 overflow-y-auto lg:ml-0 pt-16 lg:pt-0">{children}</main>
    </div>
  )
}

