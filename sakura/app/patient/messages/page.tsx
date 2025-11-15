'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PatientSidebar } from '@/components/layout/PatientSidebar'

export default function PatientMessages() {
  const [selectedConversation, setSelectedConversation] = useState('dr-sharma')

  const conversations = [
    {
      id: 'dr-sharma',
      name: 'Dr. Anya Sharma',
      avatar: 'A',
      lastMessage: 'Follow-up on your recent lab results',
      snippet: "Hi Amelia, I've reviewed your resul...",
      time: '10:45 AM',
      unread: true,
      online: true,
    },
    {
      id: 'front-desk',
      name: 'Clinic Front Desk',
      avatar: 'C',
      lastMessage: 'Re: Appointment Confirmation',
      snippet: 'This is a reminder for your upcomi...',
      time: 'Yesterday',
      unread: false,
    },
    {
      id: 'dr-sharma-2',
      name: 'Dr. Anya Sharma',
      avatar: 'A',
      lastMessage: 'Prescription Refill Question',
      snippet: 'Hello, I see you requested a refill f...',
      time: 'Nov 10',
      unread: false,
    },
  ]

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <PatientSidebar />
      
      <main className="flex-1 flex">
        {/* Messages List */}
        <div className="w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-[#111418] dark:text-white mb-2">Secure Messages</h2>
            <p className="text-sm text-[#617589] dark:text-gray-400">
              Communicate securely with your doctor and clinic staff.
            </p>
          </div>

          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#617589] dark:text-gray-400 text-sm">
                search
              </span>
              <input
                type="text"
                placeholder="Search messages..."
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
                  selectedConversation === conv.id ? 'bg-primary/5' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold">{conv.avatar}</span>
                    </div>
                    {conv.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-semibold text-[#111418] dark:text-white text-sm">{conv.name}</p>
                      <span className="text-xs text-[#617589] dark:text-gray-400">{conv.time}</span>
                    </div>
                    <p className="text-sm text-[#617589] dark:text-gray-400 truncate">{conv.lastMessage}</p>
                    <p className="text-xs text-[#617589] dark:text-gray-400 truncate">{conv.snippet}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-primary font-semibold">A</span>
              </div>
              <div>
                <p className="font-semibold text-[#111418] dark:text-white">Dr. Anya Sharma</p>
                <p className="text-xs text-[#617589] dark:text-gray-400">Today, 10:45 AM</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm">
              <span className="material-symbols-outlined text-sm">edit</span>
              New Message
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary text-xs font-semibold">A</span>
              </div>
              <div className="flex-1">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 max-w-md">
                  <p className="text-[#111418] dark:text-white text-sm">
                    Hi Amelia, I've reviewed your recent lab results, and everything looks stable. Please continue with your current medication as prescribed. Let me know if you have any questions.
                  </p>
                </div>
                <p className="text-xs text-[#617589] dark:text-gray-400 mt-1">10:45 AM</p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <div className="flex-1"></div>
              <div className="flex-1 max-w-md">
                <div className="bg-primary text-white rounded-lg p-4">
                  <p className="text-sm">
                    Hello Dr. Sharma, I just wanted to check if you had a chance to look at my recent lab results. Thank you!
                  </p>
                </div>
                <div className="flex items-center gap-2 justify-end mt-1">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary text-xs font-semibold">A</span>
                  </div>
                  <p className="text-xs text-[#617589] dark:text-gray-400">Today, 9:15 AM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message here..."
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="w-10 h-10 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
              <button className="w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">attach_file</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

