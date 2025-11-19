'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PatientSidebar } from '@/components/layout/PatientSidebar'
import { patientApi, Conversation, Message, MessagesResponse } from '@/lib/api/patients'
import { apiClient } from '@/lib/api/client'

export default function PatientMessages() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [currentMessages, setCurrentMessages] = useState<Message[]>([])
  const [currentConversationData, setCurrentConversationData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'unread' | 'flagged'>('all')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    fetchConversations()
    fetchCurrentUserId()
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation)
    }
  }, [selectedConversation])

  const fetchCurrentUserId = async () => {
    try {
      const profileResponse = await patientApi.getProfile()
      if (profileResponse.success && profileResponse.data) {
        setCurrentUserId(profileResponse.data.id)
      }
    } catch (err) {
      console.error('Failed to get user ID:', err)
    }
  }

  const fetchConversations = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await patientApi.getMessages()
      if (response.success && response.data) {
        setConversations(response.data.conversations || [])
        // Auto-select first conversation if available
        if (response.data.conversations && response.data.conversations.length > 0 && !selectedConversation) {
          setSelectedConversation(response.data.conversations[0].id)
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
      const response = await patientApi.getMessages({ conversationId })
      if (response.success && response.data) {
        setCurrentMessages(response.data.currentConversation?.messages || [])
        setCurrentConversationData(response.data.currentConversation)
      }
    } catch (err: any) {
      console.error('Messages fetch error:', err)
    } finally {
      setLoadingMessages(false)
    }
  }

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedConversation || !currentUserId) return

    const conversation = conversations.find((c) => c.id === selectedConversation)
    if (!conversation) {
      alert('Cannot send message: Conversation not found')
      return
    }

    // Find the other participant (doctor/assistant)
    const otherParticipant = currentConversationData?.participants?.find(
      (p: any) => p.id !== currentUserId,
    )

    if (!otherParticipant) {
      alert('Cannot send message: Recipient not found')
      return
    }

    try {
      setSending(true)
      const response = await apiClient.post('/messages', {
        senderId: currentUserId,
        receiverId: otherParticipant.id,
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
    const matchesSearch = conv.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter =
      filter === 'all' || (filter === 'unread' && conv.unread) || (filter === 'flagged' && false)
    return matchesSearch && matchesFilter
  })

  const selectedConv = conversations.find((c) => c.id === selectedConversation)
  const unreadCount = conversations.filter((c) => c.unread).length

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex gap-2 p-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-sm border-b-2 transition-colors ${
                filter === 'all'
                  ? 'border-primary text-primary font-semibold'
                  : 'border-transparent text-[#617589] dark:text-gray-400 hover:text-primary'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 text-sm border-b-2 transition-colors relative ${
                filter === 'unread'
                  ? 'border-primary text-primary font-semibold'
                  : 'border-transparent text-[#617589] dark:text-gray-400 hover:text-primary'
              }`}
            >
              Unread
              {unreadCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs rounded">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setFilter('flagged')}
              className={`px-3 py-1.5 text-sm border-b-2 transition-colors ${
                filter === 'flagged'
                  ? 'border-primary text-primary font-semibold'
                  : 'border-transparent text-[#617589] dark:text-gray-400 hover:text-primary'
              }`}
            >
              Flagged
            </button>
          </div>

          {loading ? (
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  </div>
                ))}
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
              <p className="text-[#617589] dark:text-gray-400 text-sm text-center">No conversations found</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conv) => (
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
                      {conv.unread && (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="w-2 h-2 bg-primary rounded-full"></span>
                          <span className="text-xs text-primary font-semibold">
                            {conv.unreadCount} unread
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chat Window */}
        {selectedConversation && selectedConv ? (
          <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold">{selectedConv.avatar}</span>
                </div>
                <div>
                  <p className="font-semibold text-[#111418] dark:text-white">{selectedConv.name}</p>
                  <p className="text-xs text-[#617589] dark:text-gray-400">
                    {selectedConv.online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm">
                <span className="material-symbols-outlined text-sm">edit</span>
                New Message
              </button>
            </div>

            {loadingMessages ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-[#617589] dark:text-gray-400 text-sm">Loading messages...</p>
                </div>
              </div>
            ) : currentMessages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-600 mb-4">
                    chat_bubble_outline
                  </span>
                  <p className="text-[#617589] dark:text-gray-400">No messages yet. Start the conversation!</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {currentMessages.map((msg, index) => {
                  const isPatient = msg.isPatient
                  const showDateSeparator =
                    index === 0 ||
                    new Date(msg.createdAt).toDateString() !==
                      new Date(currentMessages[index - 1].createdAt).toDateString()

                  return (
                    <div key={msg.id}>
                      {showDateSeparator && (
                        <div className="text-center text-xs text-[#617589] dark:text-gray-400 mb-4">
                          {new Date(msg.createdAt).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                      )}
                      <div className={`flex gap-3 ${isPatient ? 'justify-end' : ''}`}>
                        {!isPatient && (
                          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-primary text-xs font-semibold">{msg.senderInitial}</span>
                          </div>
                        )}
                        <div className={`flex flex-col ${isPatient ? 'items-end' : 'items-start'} max-w-md`}>
                          <div
                            className={`rounded-lg p-4 ${
                              isPatient
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-[#111418] dark:text-white'
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {isPatient && (
                              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                                <span className="text-primary text-xs font-semibold">
                                  {currentUserId?.charAt(0)?.toUpperCase() || 'P'}
                                </span>
                              </div>
                            )}
                            <p className="text-xs text-[#617589] dark:text-gray-400">
                              {msg.formattedTime} {msg.formattedDate && `· ${msg.formattedDate}`}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  disabled={sending}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={sending || !message.trim()}
                  className="w-10 h-10 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-sm">send</span>
                </button>
                <button className="w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm">attach_file</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-800">
            <div className="text-center">
              <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-600 mb-4">
                chat_bubble_outline
              </span>
              <p className="text-[#617589] dark:text-gray-400 text-lg">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
