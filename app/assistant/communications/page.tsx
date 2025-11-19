'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { assistantApi } from '@/lib/api/assistants'

interface Conversation {
  id: string
  patientName: string
  patientImage?: string
  lastMessage: string
  timestamp: string
  unreadCount: number
  isActive: boolean
  patientId?: string
  patient?: {
    id: string
    fullName: string
    email?: string
    phoneNumber?: string
    avatar?: string
    dateOfBirth?: string
  }
}

interface Message {
  id: string
  sender: 'patient' | 'assistant' | 'system'
  text: string
  timestamp: string
  type: 'SMS' | 'Email'
  senderImage?: string
  createdAt?: string
  senderId?: string
  receiverId?: string
}

export default function AssistantCommunicationsPage() {
  const [filter, setFilter] = useState<'all' | 'unread' | 'flagged'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [currentPatient, setCurrentPatient] = useState<any>(null)

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation)
    }
  }, [selectedConversation])

  const fetchConversations = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await assistantApi.getConversations()
      if (response.success && response.data) {
        // Format conversations for frontend
        const formatted = response.data.map((conv: any) => {
          const otherParticipant = conv.participants?.find(
            (p: any) => p.role === 'PATIENT' || p.role === 'DOCTOR',
          )
          const lastMessage = conv.messages?.[conv.messages.length - 1]
          const lastMessageDate = lastMessage?.createdAt
            ? new Date(lastMessage.createdAt)
            : conv.updatedAt
            ? new Date(conv.updatedAt)
            : new Date()

          // Format timestamp
          const now = new Date()
          const diffTime = now.getTime() - lastMessageDate.getTime()
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
          let timestamp = ''
          if (diffDays === 0) {
            timestamp = lastMessageDate.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            })
          } else if (diffDays === 1) {
            timestamp = 'Yesterday'
          } else if (diffDays < 7) {
            timestamp = lastMessageDate.toLocaleDateString('en-US', { weekday: 'short' })
          } else {
            timestamp = lastMessageDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })
          }

          return {
            id: conv.id,
            patientName: otherParticipant?.fullName || 'Unknown',
            patientImage: otherParticipant?.avatar,
            lastMessage: lastMessage
              ? `${lastMessage.content?.substring(0, 50)}${lastMessage.content?.length > 50 ? '...' : ''}`
              : 'No messages',
            timestamp,
            unreadCount: conv.unreadCount || 0,
            isActive: true,
            patientId: otherParticipant?.id,
            patient: otherParticipant,
          }
        })
        setConversations(formatted)
        // Auto-select first conversation if available
        if (formatted.length > 0 && !selectedConversation) {
          setSelectedConversation(formatted[0].id)
        }
      } else {
        setError(response.message || 'Failed to load conversations')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load conversations')
      console.error('Conversations fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (conversationId: string) => {
    try {
      setLoadingMessages(true)
      const response = await assistantApi.getConversationMessages(conversationId)
      if (response.success && response.data) {
        // Get current user ID from profile
        const profileResponse = await assistantApi.getProfile()
        const currentUserId = profileResponse.success && profileResponse.data ? profileResponse.data.id : ''

        // Format messages for frontend
        const formatted = response.data.map((msg: any) => {
          const isAssistant = msg.senderId === currentUserId
          const isPatient = msg.sender?.role === 'PATIENT'
          const isSystem = msg.sender?.role === 'SYSTEM' || !msg.sender

          let sender: 'patient' | 'assistant' | 'system' = 'system'
          if (isPatient) sender = 'patient'
          else if (isAssistant) sender = 'assistant'

          const msgDate = new Date(msg.createdAt || msg.created_at || Date.now())
          const timestamp = msgDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          })

          return {
            id: msg.id,
            sender,
            text: msg.content || '',
            timestamp,
            type: 'SMS' as const,
            senderImage: msg.sender?.avatar,
            createdAt: msg.createdAt || msg.created_at,
            senderId: msg.senderId,
            receiverId: msg.receiverId,
          }
        })

        setMessages(formatted)

        // Set current patient from conversation
        const conv = conversations.find((c) => c.id === conversationId)
        if (conv?.patient) {
          setCurrentPatient(conv.patient)
        }
      }
    } catch (err: any) {
      console.error('Messages fetch error:', err)
    } finally {
      setLoadingMessages(false)
    }
  }

  const handleSendMessage = async (type: 'SMS' | 'Email') => {
    if (!message.trim() || !selectedConversation) return

    const conversation = conversations.find((c) => c.id === selectedConversation)
    if (!conversation?.patientId) {
      alert('Cannot send message: Patient not found')
      return
    }

    try {
      setSending(true)
      const response = await assistantApi.sendMessage({
        receiverId: conversation.patientId,
        content: message,
      })

      if (response.success) {
        setMessage('')
        // Refresh messages
        await fetchMessages(selectedConversation)
        // Refresh conversations to update last message
        await fetchConversations()
      } else {
        alert(response.message || 'Failed to send message')
      }
    } catch (err: any) {
      alert(err.message || 'Failed to send message')
      console.error('Send message error:', err)
    } finally {
      setSending(false)
    }
  }

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch = conv.patientName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter =
      filter === 'all' || (filter === 'unread' && conv.unreadCount > 0) || (filter === 'flagged' && false)
    return matchesSearch && matchesFilter
  })

  const currentConversation = conversations.find((c) => c.id === selectedConversation)

  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200">
      {/* Sidebar */}
      <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 w-64 p-4 shrink-0">
        <div className="flex flex-col gap-4">
          {/* Profile */}
          <div className="flex gap-3 items-center">
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-semibold text-lg">A</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-gray-900 dark:text-white text-base font-medium leading-normal">Assistant</h1>
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
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 h-screen overflow-hidden">
        {/* Left Column: Conversation List */}
        <div className="col-span-1 lg:col-span-3 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full overflow-hidden">
          <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Conversations</h2>
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
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Loading conversations...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center">
                <p className="text-red-600 dark:text-red-400 text-sm mb-4">{error}</p>
                <button
                  onClick={fetchConversations}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center">No conversations found</p>
            </div>
          ) : (
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
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 flex items-center justify-center"
                      style={{
                        backgroundImage: conv.patientImage ? `url("${conv.patientImage}")` : undefined,
                        backgroundColor: conv.patientImage ? undefined : '#e0e7ff',
                      }}
                    >
                      {!conv.patientImage && (
                        <span className="text-primary font-semibold text-lg">
                          {conv.patientName?.charAt(0)?.toUpperCase() || 'P'}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      <p className="text-gray-900 dark:text-white text-sm font-semibold leading-normal">
                        {conv.patientName}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs font-normal leading-normal truncate">
                        {conv.lastMessage}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-1">
                    <p className="text-gray-500 dark:text-gray-400 text-xs font-normal leading-normal">
                      {conv.timestamp}
                    </p>
                    {conv.unreadCount > 0 && (
                      <div className="size-5 flex items-center justify-center text-xs bg-orange-500 text-white rounded-full">
                        {conv.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Center Column: Chat Interface */}
        {selectedConversation ? (
          <div className="col-span-1 lg:col-span-6 bg-gray-50 dark:bg-gray-800 flex flex-col h-full hidden lg:flex">
            <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shrink-0">
              <div className="flex items-center gap-3">
                {currentConversation && (
                  <>
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 flex items-center justify-center"
                      style={{
                        backgroundImage: currentConversation.patientImage
                          ? `url("${currentConversation.patientImage}")`
                          : undefined,
                        backgroundColor: currentConversation.patientImage ? undefined : '#e0e7ff',
                      }}
                    >
                      {!currentConversation.patientImage && (
                        <span className="text-primary font-semibold">
                          {currentConversation.patientName?.charAt(0)?.toUpperCase() || 'P'}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-gray-900 dark:text-white font-semibold">
                        {currentConversation.patientName}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {currentConversation.patient?.phoneNumber || '(No phone)'}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {loadingMessages ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Loading messages...</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Date Separator */}
                  {messages.length > 0 && (
                    <div className="text-center text-xs text-gray-500 dark:text-gray-400">Today</div>
                  )}

                  {/* Messages */}
                  {messages.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((msg) => {
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
                          {!isAssistant && (
                            <div
                              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 shrink-0 flex items-center justify-center"
                              style={{
                                backgroundImage: msg.senderImage ? `url("${msg.senderImage}")` : undefined,
                                backgroundColor: msg.senderImage ? undefined : '#e0e7ff',
                              }}
                            >
                              {!msg.senderImage && (
                                <span className="text-primary font-semibold text-xs">
                                  {currentConversation?.patientName?.charAt(0)?.toUpperCase() || 'P'}
                                </span>
                              )}
                            </div>
                          )}
                          {isAssistant && (
                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 shrink-0 bg-primary/20 flex items-center justify-center">
                              <span className="text-primary font-semibold text-xs">A</span>
                            </div>
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
                    })
                  )}
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
                      disabled={sending}
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
                        disabled={sending || !message.trim()}
                        className="flex min-w-[84px] items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-semibold leading-normal disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="material-symbols-outlined text-base">email</span>
                        <span className="truncate">Send Email</span>
                      </button>
                      <button
                        onClick={() => handleSendMessage('SMS')}
                        disabled={sending || !message.trim()}
                        className="flex min-w-[84px] items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-semibold leading-normal disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="material-symbols-outlined text-base">sms</span>
                        <span className="truncate">Send SMS</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="col-span-1 lg:col-span-6 bg-gray-50 dark:bg-gray-800 flex items-center justify-center hidden lg:flex">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <span className="material-symbols-outlined text-6xl mb-4">chat_bubble_outline</span>
              <p className="text-lg">Select a conversation to start messaging</p>
            </div>
          </div>
        )}

        {/* Right Column: Contextual Panel */}
        {currentConversation && currentPatient && (
          <div className="col-span-1 lg:col-span-3 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 flex flex-col p-4 sm:p-6 space-y-6 sm:space-y-8 hidden xl:flex">
            {/* Patient Profile Card */}
            <div className="flex flex-col items-center text-center">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-24 mb-4 flex items-center justify-center"
                style={{
                  backgroundImage: currentPatient.avatar ? `url("${currentPatient.avatar}")` : undefined,
                  backgroundColor: currentPatient.avatar ? undefined : '#e0e7ff',
                }}
              >
                {!currentPatient.avatar && (
                  <span className="text-primary font-semibold text-2xl">
                    {currentPatient.fullName?.charAt(0)?.toUpperCase() || 'P'}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{currentPatient.fullName}</h3>
              {currentPatient.dateOfBirth && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  DOB: {new Date(currentPatient.dateOfBirth).toLocaleDateString()}
                </p>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {currentPatient.phoneNumber || '(No phone)'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {currentPatient.email || '(No email)'}
              </p>
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
                  href={`/assistant/patients`}
                  className="w-full text-left flex items-center gap-3 p-3 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <span className="material-symbols-outlined text-xl">person</span>
                  View Full Patient Record
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
