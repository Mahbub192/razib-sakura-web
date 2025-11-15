'use client'

import { useState } from 'react'
import { DoctorSidebar } from '@/components/layout/DoctorSidebar'

export default function DoctorCommunications() {
  const [selectedConversation, setSelectedConversation] = useState('olivia-chen')

  const conversations = [
    {
      id: 'olivia-chen',
      name: 'Olivia Chen',
      phone: '(555) 123-4567',
      lastMessage: 'Ok, thank you for the reminder!',
      time: '10:42 AM',
      unread: 1,
      type: 'SMS',
    },
    {
      id: 'benjamin-carter',
      name: 'Benjamin Carter',
      lastMessage: 'Appointment Reminder: Your...',
      time: 'Yesterday',
      unread: 1,
      type: 'Email',
    },
    {
      id: 'sophia-rodriguez',
      name: 'Sophia Rodriguez',
      lastMessage: 'You: Hi Sophia, just a reminder...',
      time: 'Mon',
      type: 'SMS',
    },
    {
      id: 'liam-goldberg',
      name: 'Liam Goldberg',
      lastMessage: 'System: Appointment Confirmed.',
      time: 'Oct 24',
      type: 'System',
    },
  ]

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <DoctorSidebar />
      
      <main className="flex-1 flex">
        {/* Conversations List */}
        <div className="w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-[#111418] dark:text-white mb-2">Conversations</h2>
            <p className="text-sm text-[#617589] dark:text-gray-400">
              Communicate with your patients securely.
            </p>
          </div>

          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#617589] dark:text-gray-400 text-sm">
                search
              </span>
              <input
                type="text"
                placeholder="Search patients..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex gap-2 p-4 border-b border-gray-200 dark:border-gray-700">
            <button className="px-3 py-1.5 text-sm border-b-2 border-primary text-primary font-semibold">
              All
            </button>
            <button className="px-3 py-1.5 text-sm text-[#617589] dark:text-gray-400 hover:text-primary transition-colors">
              Unread <span className="ml-1 px-1.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs rounded">2</span>
            </button>
            <button className="px-3 py-1.5 text-sm text-[#617589] dark:text-gray-400 hover:text-primary transition-colors">
              Flagged
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                  selectedConversation === conv.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">{conv.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-semibold text-[#111418] dark:text-white text-sm">{conv.name}</p>
                      <span className="text-xs text-[#617589] dark:text-gray-400">{conv.time}</span>
                    </div>
                    <p className="text-xs text-[#617589] dark:text-gray-400 truncate">
                      {conv.type}: {conv.lastMessage}
                    </p>
                    {conv.unread && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs rounded">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-primary font-semibold">O</span>
              </div>
              <div>
                <p className="font-semibold text-[#111418] dark:text-white">Olivia Chen</p>
                <p className="text-xs text-[#617589] dark:text-gray-400">(555) 123-4567</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="text-center text-xs text-[#617589] dark:text-gray-400 mb-4">Today</div>

            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary text-xs font-semibold">O</span>
              </div>
              <div className="flex-1">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 max-w-md">
                  <p className="text-[#111418] dark:text-white text-sm">
                    Ok, thank you for the reminder!
                  </p>
                </div>
                <p className="text-xs text-[#617589] dark:text-gray-400 mt-1">10:42 AM • SMS</p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <div className="flex-1"></div>
              <div className="flex-1 max-w-md">
                <div className="bg-primary text-white rounded-lg p-4">
                  <p className="text-sm">
                    You're welcome, Olivia. We look forward to seeing you.
                  </p>
                </div>
                <div className="flex items-center gap-2 justify-end mt-1">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary text-xs font-semibold">A</span>
                  </div>
                  <p className="text-xs text-[#617589] dark:text-gray-400">10:45 AM • SMS</p>
                </div>
              </div>
            </div>

            <div className="text-center text-xs text-[#617589] dark:text-gray-400 mt-4">
              Automated Reminder Sent Yesterday at 3:00 PM
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2 mb-2">
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm">
                <span className="material-symbols-outlined text-sm">description</span>
                Use Template
              </button>
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm">
                <span className="material-symbols-outlined text-sm">mail</span>
                Send Email
              </button>
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm">
                <span className="material-symbols-outlined text-sm">chat_bubble</span>
                Send SMS
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Patient Details Sidebar */}
        <div className="w-80 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <div className="mb-6">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary font-semibold text-2xl">O</span>
            </div>
            <h3 className="text-xl font-bold text-[#111418] dark:text-white text-center mb-2">Olivia Chen</h3>
            <div className="text-center space-y-1 text-sm text-[#617589] dark:text-gray-400">
              <p>DOB: 05/12/1988</p>
              <p>(555) 123-4567</p>
              <p>olivia.chen@example.com</p>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-[#111418] dark:text-white mb-3">Upcoming Appointments</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="material-symbols-outlined text-primary text-sm">event</span>
                <div>
                  <p className="text-sm font-semibold text-[#111418] dark:text-white">Follow-up Visit</p>
                  <p className="text-xs text-[#617589] dark:text-gray-400">Nov 15, 2023 at 2:30 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="material-symbols-outlined text-primary text-sm">event</span>
                <div>
                  <p className="text-sm font-semibold text-[#111418] dark:text-white">Annual Check-up</p>
                  <p className="text-xs text-[#617589] dark:text-gray-400">Jan 22, 2024 at 11:00 AM</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-[#111418] dark:text-white mb-3">Quick Actions</h4>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm">
                <span className="material-symbols-outlined text-sm">add</span>
                Schedule New Appointment
              </button>
              <button className="w-full px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors flex items-center gap-2 text-sm">
                <span className="material-symbols-outlined text-sm">send</span>
                Send Appointment Reminder
              </button>
              <button className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm">
                <span className="material-symbols-outlined text-sm">person</span>
                View Full Patient Record
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

