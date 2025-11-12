'use client'

import Link from 'next/link'
import { useState } from 'react'

interface Conversation {
  id: string
  patientName: string
  patientImage: string
  lastMessage: string
  timestamp: string
  unreadCount: number
  isActive: boolean
}

interface Message {
  id: string
  sender: 'patient' | 'assistant' | 'system'
  text: string
  timestamp: string
  type: 'SMS' | 'Email'
  senderImage?: string
}

export default function AssistantCommunicationsPage() {
  const [filter, setFilter] = useState<'all' | 'unread' | 'flagged'>('unread')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedConversation, setSelectedConversation] = useState<string>('1')
  const [message, setMessage] = useState('')

  const conversations: Conversation[] = [
    {
      id: '1',
      patientName: 'Olivia Chen',
      patientImage:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB_zdnXmiaJoLQMdhhDqziBwUjlz2BtljGpYwCdWHnSBGWBp0vQ_ApTbyu3qEDV6gIIyNq2ItEStgHmPoNI02y2xRk6Y7sPtE2mqj85U-J9ITXXhYOy946aZwkkOkea0W9wnjXcj3kLwDODvC-z0LArO7ppam4M2Zh2G3wkp2eU04G8iwHJTn6tSOJAw5tnToFrbdLDys5io4Sb1KjY7CK7kYHWFOKw3iQePAuWZ2PiDC25zXQkH6yOpE8j8E3c4a2pDsRw6HDgEkw',
      lastMessage: 'SMS: Ok, thank you for the reminder!',
      timestamp: '10:42 AM',
      unreadCount: 1,
      isActive: true,
    },
    {
      id: '2',
      patientName: 'Benjamin Carter',
      patientImage:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDypXqXXjbEvMnTX2wsx20S69x9V2VxJK4HsehVxPB_kfZIAU4Cnecb6g-leoB7XqFtxRTp6SB1gtY0-IMZ51buUbLW8HLAk8OIeqTaUGtRUVwlbUg1SI6rzHZ54w0Qa6LQvGsJp2sgSJmVYIMpz_0vRg32UDZ_hMjbydCUthDOpQBCcDXUFPbZlS8CGbkYszG2mECA0USsr4EWoEww2Jp-2_nkzK0PdmNbWvLiwyENW3AodetZFYRtxi_YK0q83dWEH3Rh4LG0V_w',
      lastMessage: 'Email: Appointment Reminder: Your...',
      timestamp: 'Yesterday',
      unreadCount: 1,
      isActive: false,
    },
    {
      id: '3',
      patientName: 'Sophia Rodriguez',
      patientImage:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD_cvDOOxvgeQ74oMR1WiR6DnRU4U4rBGnbXEmqmKNHFx8BiUv90UupCbmEIMlVojFpuqq7D3by05buolzuxsu-rw-xt1arjZRKjw-uBMg8WsnZK1hMawPWj03Usyh4NevKym4tqq_WNedH1uhTxesBhzz1ipSNQ6fQlUHQhiI1_lKVy8gPJcTvD42OEDft83niCtvShF3ngEE6Jlp6k6NKZ975hzB1s0aAmjFabOJRehkNaz_BJ108W4gErY6B7RRrL_G3mn3XnGg',
      lastMessage: 'You: Hi Sophia, just a reminder...',
      timestamp: 'Mon',
      unreadCount: 0,
      isActive: false,
    },
    {
      id: '4',
      patientName: 'Liam Goldberg',
      patientImage:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuArjmB9poU4jKIus46OMrS-M3mVZmqh4hSdnl_T0TacgIQdi4WrPrxrOvcVe23aZR8_VZlu5j6f3Vg67rZ1SYl7pVMliTAxjTeWw1SkrUJ1-KMxrlOj5VquRqyG32mj17SLdYZmczSrlBe4Yp1r1LQsL219XIfRQMwPP5BHPk-kQr5ocYhDIEH4MTE2ZW4JYnufjtrQlNtFqt22Pc3wUpvR0SFrPvCTy6waq0A9UNeFiIKzD8JIbzZgIC9pWHv84Gbd49hwbECglds',
      lastMessage: 'System: Appointment Confirmed.',
      timestamp: 'Oct 24',
      unreadCount: 0,
      isActive: false,
    },
  ]

  const messages: Message[] = [
    {
      id: '1',
      sender: 'patient',
      text: 'Ok, thank you for the reminder!',
      timestamp: '10:42 AM',
      type: 'SMS',
      senderImage:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBXdU9yatunjOOgdVLay5d7lLPl745054WasIDCqUK31k3-DcJw8fPKoVuv-AMfwl-1rtt-cSUlGnzrAtafsmPLeFYLG1yVMGws9PuTOt66YuEova5PGkAzzuZZ7Rt8cIJH1OnSyP7nndH6KrFcLDCJbMwvOsxeA3svMgicE53NmSXuS67bZMWY_fXONGBwqTbhEJl_XH3oIQ5Z8CtDnSbZZWnsRFfD2h--X903zFLJZ1YSvpaHVSlnWWTHYS_7gaOryncYtW9fRXA',
    },
    {
      id: '2',
      sender: 'assistant',
      text: "You're welcome, Olivia. We look forward to seeing you.",
      timestamp: '10:45 AM',
      type: 'SMS',
    },
    {
      id: '3',
      sender: 'system',
      text: 'Automated Reminder Sent Yesterday at 3:00 PM',
      timestamp: '',
      type: 'SMS',
    },
  ]

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch = conv.patientName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter =
      filter === 'all' || (filter === 'unread' && conv.unreadCount > 0) || (filter === 'flagged' && false) // Add flagged logic if needed
    return matchesSearch && matchesFilter
  })

  const currentConversation = conversations.find((c) => c.id === selectedConversation)

  const handleSendMessage = (type: 'SMS' | 'Email') => {
    if (!message.trim()) return
    // TODO: Implement send message logic
    console.log(`Sending ${type}:`, message)
    setMessage('')
  }

  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200">
      {/* Sidebar */}
      <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 w-64 p-4 shrink-0">
        <div className="flex flex-col gap-4">
          {/* Profile */}
          <div className="flex gap-3 items-center">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDaxM0wNFKrDU8Mv8BAOJspA5Z6u2Y55brKTpqS4ROf6q8xEbWBzaPg4yjolSXminz0fSpTGjvgY9W9y59Lw3KPW4__KGKK6yaax2B48p2d5vcW_707PRwZUcPPOrVhmqwVQqZAWo2sF-sff_tYDTm91aBuuzAYMzxJtzBsWOt5p-0MSLu8fM-EprRrkaE9_7SvNJb68IICeo4-ThCJOAkqilKQKYUF-ILNjtSs40ohwSn0CYsB4hBg_2hUwiDDlGp94z_6uV7pUvY")',
              }}
            />
            <div className="flex flex-col">
              <h1 className="text-gray-900 dark:text-white text-base font-medium leading-normal">Sarah Johnson</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">Medical Assistant</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-2 mt-4">
            <Link
              href="/assistant/dashboard"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <span className="material-symbols-outlined text-2xl">dashboard</span>
              <p className="text-sm font-medium leading-normal">Dashboard</p>
            </Link>
            <Link
              href="/assistant/appointments"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <span className="material-symbols-outlined text-2xl">list_alt</span>
              <p className="text-sm font-medium leading-normal">Appointments</p>
            </Link>
            <Link
              href="/assistant/patients"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <span className="material-symbols-outlined text-2xl">group</span>
              <p className="text-sm font-medium leading-normal">Patients</p>
            </Link>
            <Link
              href="/assistant/calendar"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <span className="material-symbols-outlined text-2xl">calendar_month</span>
              <p className="text-sm font-medium leading-normal">Calendar</p>
            </Link>
            <Link
              href="/assistant/reports"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <span className="material-symbols-outlined text-2xl">bar_chart</span>
              <p className="text-sm font-medium leading-normal">Reports</p>
            </Link>
            <Link
              href="/assistant/communications"
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary"
            >
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                chat
              </span>
              <p className="text-sm font-medium leading-normal">Communications</p>
            </Link>
            <Link
              href="/assistant/settings"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <span className="material-symbols-outlined text-2xl">settings</span>
              <p className="text-sm font-medium leading-normal">Settings</p>
            </Link>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-4">
          <Link
            href="/assistant/appointments/new"
            className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em]"
          >
            <span className="truncate">New Appointment</span>
          </Link>
          <div className="flex flex-col gap-1">
            <Link
              href="/assistant/settings"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <span className="material-symbols-outlined text-2xl">settings</span>
              <p className="text-sm font-medium leading-normal">Settings</p>
            </Link>
            <Link
              href="/assistant/help"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <span className="material-symbols-outlined text-2xl">help</span>
              <p className="text-sm font-medium leading-normal">Help</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 grid grid-cols-12 h-screen">
        {/* Left Column: Conversation List */}
        <div className="col-span-3 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Conversations</h2>
            {/* Search Bar */}
            <label className="flex flex-col min-w-40 h-12 w-full">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-gray-100 dark:bg-gray-800">
                <div className="text-gray-500 dark:text-gray-400 flex items-center justify-center pl-4">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-gray-500 dark:placeholder:text-gray-400 px-2 text-sm font-normal leading-normal"
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </label>
          </div>

          {/* Segmented Buttons */}
          <div className="p-4">
            <div className="flex h-10 w-full items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
              <label
                className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-medium leading-normal transition-colors ${
                  filter === 'all'
                    ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <span className="truncate">All</span>
                <input
                  className="invisible w-0"
                  name="filters"
                  type="radio"
                  value="all"
                  checked={filter === 'all'}
                  onChange={() => setFilter('all')}
                />
              </label>
              <label
                className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-medium leading-normal transition-colors relative ${
                  filter === 'unread'
                    ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <span className="truncate">Unread</span>
                {conversations.filter((c) => c.unreadCount > 0).length > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 text-xs flex items-center justify-center bg-orange-500 text-white rounded-full">
                    {conversations.filter((c) => c.unreadCount > 0).length}
                  </span>
                )}
                <input
                  className="invisible w-0"
                  name="filters"
                  type="radio"
                  value="unread"
                  checked={filter === 'unread'}
                  onChange={() => setFilter('unread')}
                />
              </label>
              <label
                className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-medium leading-normal transition-colors ${
                  filter === 'flagged'
                    ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <span className="truncate">Flagged</span>
                <input
                  className="invisible w-0"
                  name="filters"
                  type="radio"
                  value="flagged"
                  checked={filter === 'flagged'}
                  onChange={() => setFilter('flagged')}
                />
              </label>
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                className={`flex gap-4 px-4 py-3 justify-between border-l-4 cursor-pointer transition-colors ${
                  conv.isActive && selectedConversation === conv.id
                    ? 'bg-primary/10 border-primary'
                    : 'bg-white dark:bg-gray-900 border-transparent hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12"
                    style={{ backgroundImage: `url("${conv.patientImage}")` }}
                  />
                  <div className="flex flex-1 flex-col justify-center">
                    <p className="text-gray-900 dark:text-white text-sm font-semibold leading-normal">{conv.patientName}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs font-normal leading-normal">{conv.lastMessage}</p>
                  </div>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-1">
                  <p className="text-gray-500 dark:text-gray-400 text-xs font-normal leading-normal">{conv.timestamp}</p>
                  {conv.unreadCount > 0 && (
                    <div className="size-5 flex items-center justify-center text-xs bg-orange-500 text-white rounded-full">
                      {conv.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Column: Chat Interface */}
        <div className="col-span-6 bg-gray-50 dark:bg-gray-800 flex flex-col h-full">
          <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shrink-0">
            <div className="flex items-center gap-3">
              {currentConversation && (
                <>
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                    style={{ backgroundImage: `url("${currentConversation.patientImage}")` }}
                  />
                  <div>
                    <p className="text-gray-900 dark:text-white font-semibold">{currentConversation.patientName}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">(555) 123-4567</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Date Separator */}
            <div className="text-center text-xs text-gray-500 dark:text-gray-400">Today</div>

            {/* Messages */}
            {messages.map((msg) => {
              if (msg.sender === 'system') {
                return (
                  <div key={msg.id} className="flex justify-center">
                    <div className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-3 py-1 rounded-full">
                      {msg.text}
                    </div>
                  </div>
                )
              }

              const isAssistant = msg.sender === 'assistant'
              return (
                <div key={msg.id} className={`flex gap-3 ${isAssistant ? 'flex-row-reverse' : ''}`}>
                  {!isAssistant && msg.senderImage && (
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 shrink-0"
                      style={{ backgroundImage: `url("${msg.senderImage}")` }}
                    />
                  )}
                  {isAssistant && (
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 shrink-0"
                      style={{
                        backgroundImage:
                          'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBeegf_xYNida_8B9kYtHzvHOyyyDandiCE4zNCkfQGKdbt9e2Qokptcq7jiPZU64reWm5FG24-R5O1JRVVShbsromeXhVN8Z78fN88D7AnBtYLlYZQd2VJ8K06A1bgk5OyV1JZAWKPM7mc2IYHEfM10oBBojlW8QUDbMchzPkUUd_cbb-1BW2bOyM8HPtSYn3Nhc9YXxSseXa2DrUgv8KJQIhzD1UzE5kcaa1bPVOHUpvGuzE-MTKL3CP4LHK9OWyLBIU0LTlWEJw")',
                      }}
                    />
                  )}
                  <div className={`flex flex-col items-${isAssistant ? 'end' : 'start'} gap-1`}>
                    <div
                      className={`p-3 rounded-lg max-w-md ${
                        isAssistant
                          ? 'bg-primary/20 rounded-tr-none'
                          : 'bg-white dark:bg-gray-900 rounded-tl-none'
                      }`}
                    >
                      <p className="text-gray-900 dark:text-white text-sm">{msg.text}</p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {msg.timestamp} {msg.timestamp && '·'} {msg.type}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Message Input */}
          <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-auto">
            <div className="relative">
              <textarea
                className="form-textarea w-full p-3 pr-12 border border-gray-200 dark:border-gray-700 rounded-lg text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
                placeholder="Type your message..."
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-primary">
                <span className="material-symbols-outlined text-2xl">mood</span>
              </button>
            </div>
            <div className="flex justify-between items-center mt-3">
              <div>
                <button className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-md">
                  <span className="material-symbols-outlined text-base">integration_instructions</span>
                  Use Template
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSendMessage('Email')}
                  className="flex min-w-[84px] items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-semibold leading-normal"
                >
                  <span className="material-symbols-outlined text-base">email</span>
                  <span className="truncate">Send Email</span>
                </button>
                <button
                  onClick={() => handleSendMessage('SMS')}
                  className="flex min-w-[84px] items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-semibold leading-normal"
                >
                  <span className="material-symbols-outlined text-base">sms</span>
                  <span className="truncate">Send SMS</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contextual Panel */}
        <div className="col-span-3 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 flex flex-col p-6 space-y-8">
          {/* Patient Profile Card */}
          {currentConversation && (
            <>
              <div className="flex flex-col items-center text-center">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-24 mb-4"
                  style={{ backgroundImage: `url("${currentConversation.patientImage}")` }}
                />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Olivia Chen</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">DOB: 05/12/1988</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">(555) 123-4567</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">olivia.chen@example.com</p>
              </div>

              <hr className="border-gray-200 dark:border-gray-700" />

              {/* Upcoming Appointments */}
              <div>
                <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Upcoming Appointments</h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary">
                      <span className="material-symbols-outlined">calendar_month</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Follow-up Visit</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Nov 15, 2023 at 2:30 PM</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary">
                      <span className="material-symbols-outlined">calendar_month</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Annual Check-up</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Jan 22, 2024 at 11:00 AM</p>
                    </div>
                  </li>
                </ul>
              </div>

              <hr className="border-gray-200 dark:border-gray-700" />

              {/* Quick Actions */}
              <div>
                <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h4>
                <div className="flex flex-col space-y-2">
                  <Link
                    href="/assistant/appointments/new"
                    className="w-full text-left flex items-center gap-3 p-3 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <span className="material-symbols-outlined text-xl">add_circle</span>
                    Schedule New Appointment
                  </Link>
                  <button className="w-full text-left flex items-center gap-3 p-3 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <span className="material-symbols-outlined text-xl">send</span>
                    Send Appointment Reminder
                  </button>
                  <Link
                    href="/assistant/patients"
                    className="w-full text-left flex items-center gap-3 p-3 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <span className="material-symbols-outlined text-xl">person</span>
                    View Full Patient Record
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

