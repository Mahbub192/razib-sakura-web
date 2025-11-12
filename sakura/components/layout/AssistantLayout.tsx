'use client'

import AssistantSidebar from './AssistantSidebar'

interface AssistantLayoutProps {
  children: React.ReactNode
  activePage?: string
}

export default function AssistantLayout({ children, activePage }: AssistantLayoutProps) {
  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-200">
      <AssistantSidebar activePage={activePage} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}

