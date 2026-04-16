import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import { useMatch } from '../hooks/useMatch.js'
import {
  sendMessage,
  subscribeToMessages,
  markMessagesAsRead,
} from '../services/chat.js'
import { ROLES } from '../utils/constants.js'
import { formatDate, timeAgo } from '../utils/helpers.js'
import Loader from '../components/ui/Loader.jsx'
import Button from '../components/ui/Button.jsx'

// ─── Message bubble ───────────────────────────────────────────────────────────

function MessageBubble({ message, isOwn, senderName }) {
  const isTimestamp = (ts) => ts?.toDate ? ts.toDate() : ts ? new Date(ts) : null
  const date = isTimestamp(message.timestamp)

  return (
    <div className={`flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar dot */}
      {!isOwn && (
        <div
          className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mb-1"
          aria-hidden="true"
        >
          {senderName?.[0]?.toUpperCase() || '?'}
        </div>
      )}

      <div className={`flex flex-col gap-1 max-w-[75%] ${isOwn ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-3 rounded-2xl text-base font-body leading-relaxed break-words ${
            isOwn
              ? 'bg-accent text-white rounded-br-sm'
              : 'bg-white text-primary shadow-card rounded-bl-sm'
          }`}
        >
          {message.text}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-primary/40 font-body">
            {date ? date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : ''}
          </span>
          {isOwn && (
            <span className="text-xs text-primary/40" aria-label={message.read ? 'Read' : 'Delivered'}>
              {message.read ? (
                // Double check — read
                <svg className="w-3.5 h-3.5 text-accent-secondary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                // Single check — sent
                <svg className="w-3.5 h-3.5 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Date separator ───────────────────────────────────────────────────────────

function DateSeparator({ timestamp }) {
  if (!timestamp) return null
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  let label
  if (date.toDateString() === today.toDateString()) label = 'Today'
  else if (date.toDateString() === yesterday.toDateString()) label = 'Yesterday'
  else label = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="flex items-center gap-3 py-2" aria-label={`Messages from ${label}`}>
      <div className="flex-1 h-px bg-gray-100" />
      <span className="font-body text-xs text-primary/40 font-medium px-2">{label}</span>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  )
}

// ─── Typing indicator ─────────────────────────────────────────────────────────

function TypingIndicator({ name }) {
  return (
    <div className="flex items-end gap-2">
      <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
        {name?.[0]?.toUpperCase() || '?'}
      </div>
      <div className="bg-white shadow-card px-4 py-3 rounded-2xl rounded-bl-sm">
        <div className="flex items-center gap-1" aria-label={`${name} is typing`}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 bg-primary/30 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.9s' }}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyChat({ partnerName, role }) {
  const prompt =
    role === ROLES.SENIOR
      ? `Say hello to ${partnerName}! They're here to help you learn.`
      : `Start the conversation with ${partnerName}. Introduce yourself!`

  return (
    <div className="flex flex-col items-center justify-center h-full py-16 text-center px-6">
      <div
        className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-5"
        aria-hidden="true"
      >
        <svg className="w-10 h-10 text-accent/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
      <h2 className="font-heading text-xl text-primary mb-2">No messages yet</h2>
      <p className="font-body text-primary/60 text-base max-w-xs">{prompt}</p>
    </div>
  )
}

// ─── No match state ───────────────────────────────────────────────────────────

function NoMatch({ role }) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-16 text-center px-6">
      <div
        className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-5"
        aria-hidden="true"
      >
        <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <h2 className="font-heading text-xl text-primary mb-2">No match yet</h2>
      <p className="font-body text-primary/60 text-base max-w-xs">
        {role === ROLES.TEEN
          ? 'Find a senior to mentor and your chat will appear here.'
          : 'Once a teen tutor matches with you, your chat will appear here.'}
      </p>
    </div>
  )
}

// ─── Main Chat page ───────────────────────────────────────────────────────────

function Chat() {
  const { userProfile } = useAuth()
  const { partner, loading: matchLoading } = useMatch()

  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [sending, setSending] = useState(false)
  const [messagesLoading, setMessagesLoading] = useState(true)
  const [isTyping, setIsTyping] = useState(false)

  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const typingTimerRef = useRef(null)

  const seniorId =
    userProfile?.role === ROLES.SENIOR ? userProfile.uid : partner?.uid
  const teenId =
    userProfile?.role === ROLES.TEEN ? userProfile.uid : partner?.uid

  // Subscribe to messages
  useEffect(() => {
    if (!seniorId || !teenId) {
      setMessagesLoading(false)
      return
    }
    console.log('seniorId:', seniorId)
    console.log('teenId:', teenId)
    console.log('conversationId will be:', [seniorId, teenId].sort().join('_'))
    setMessagesLoading(true)
    const unsubscribe = subscribeToMessages(seniorId, teenId, (msgs) => {
      setMessages(msgs)
      setMessagesLoading(false)
    })

    return unsubscribe
  }, [seniorId, teenId])

  // Mark messages as read when they arrive
  useEffect(() => {
    if (!seniorId || !teenId || !userProfile?.uid || messages.length === 0) return
    markMessagesAsRead(seniorId, teenId, userProfile.uid).catch(() => {})
  }, [messages, seniorId, teenId, userProfile?.uid])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Simulate typing indicator — clears after 2s of no input
  const handleInputChange = (e) => {
    setInputText(e.target.value)
    setIsTyping(true)
    clearTimeout(typingTimerRef.current)
    typingTimerRef.current = setTimeout(() => setIsTyping(false), 2000)
  }

  const handleSend = useCallback(async () => {
    const text = inputText.trim()
    if (!text || sending || !seniorId || !teenId) return

    setSending(true)
    setInputText('')
    setIsTyping(false)
    clearTimeout(typingTimerRef.current)

    try {
      await sendMessage(seniorId, teenId, userProfile.uid, text)
    } catch {
      // Restore text on failure
      setInputText(text)
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }, [inputText, sending, seniorId, teenId, userProfile?.uid])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Group messages by date for separators
  const groupedMessages = messages.reduce((groups, msg, i) => {
    const prev = messages[i - 1]
    const currDate = msg.timestamp?.toDate ? msg.timestamp.toDate() : new Date()
    const prevDate = prev?.timestamp?.toDate ? prev.timestamp.toDate() : null

    const showDate =
      !prevDate || currDate.toDateString() !== prevDate.toDateString()

    groups.push({ message: msg, showDate })
    return groups
  }, [])

  const canChat = !!partner && !!seniorId && !!teenId

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="font-heading text-3xl sm:text-4xl text-primary mb-1">Messages</h1>
        <p className="font-body text-primary/60">
          {partner
            ? `Your conversation with ${partner.name}`
            : 'Your direct line to your partner'}
        </p>
      </div>

      {/* Chat container */}
      <div className="bg-surface rounded-card shadow-card overflow-hidden flex flex-col" style={{ height: '70vh' }}>

        {/* Chat header */}
        {partner && (
          <div className="flex items-center gap-4 px-5 py-4 border-b border-gray-100 bg-white flex-shrink-0">
            <div
              className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-heading font-bold text-lg flex-shrink-0"
              aria-label={`${partner.name} avatar`}
            >
              {partner.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-body font-semibold text-primary truncate">{partner.name}</p>
              <p className="font-body text-xs text-accent-secondary flex items-center gap-1.5">
                <span className="w-2 h-2 bg-accent-secondary rounded-full inline-block" aria-hidden="true" />
                {userProfile?.role === ROLES.TEEN ? 'Your senior' : 'Your tutor'}
              </p>
            </div>
          </div>
        )}

        {/* Messages area */}
        <div
          className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-gray-50/50"
          aria-label="Chat messages"
          aria-live="polite"
          aria-atomic="false"
        >
          {matchLoading || messagesLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader size="md" message="Loading messages..." />
            </div>
          ) : !canChat ? (
            <NoMatch role={userProfile?.role} />
          ) : messages.length === 0 ? (
            <EmptyChat partnerName={partner?.name} role={userProfile?.role} />
          ) : (
            <>
              {groupedMessages.map(({ message, showDate }) => (
                <React.Fragment key={message.id}>
                  {showDate && <DateSeparator timestamp={message.timestamp} />}
                  <MessageBubble
                    message={message}
                    isOwn={message.senderId === userProfile?.uid}
                    senderName={message.senderId === userProfile?.uid ? userProfile?.name : partner?.name}
                  />
                </React.Fragment>
              ))}
              {/* Scroll anchor */}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* Input area */}
        {canChat && (
          <div className="px-4 py-3 border-t border-gray-100 bg-white flex-shrink-0">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={inputText}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    userProfile?.role === ROLES.SENIOR
                      ? 'Type your message...'
                      : `Message ${partner?.name}...`
                  }
                  rows={1}
                  maxLength={1000}
                  disabled={sending}
                  aria-label="Message input"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl font-body text-primary bg-gray-50 focus:border-accent focus:bg-white focus:outline-none transition-all duration-200 resize-none leading-relaxed text-base disabled:opacity-50"
                  style={{
                    minHeight: '48px',
                    maxHeight: '120px',
                    overflowY: inputText.split('\n').length > 3 ? 'auto' : 'hidden',
                  }}
                  onInput={(e) => {
                    e.target.style.height = 'auto'
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
                  }}
                />
                {inputText.length > 800 && (
                  <p className="absolute right-3 bottom-2 text-xs text-primary/40">
                    {inputText.length}/1000
                  </p>
                )}
              </div>
              <button
                onClick={handleSend}
                disabled={!inputText.trim() || sending}
                aria-label="Send message"
                className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white hover:bg-orange-600 transition-all duration-200 active:scale-95 disabled:bg-disabled disabled:cursor-not-allowed flex-shrink-0 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                {sending ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                ) : (
                  <svg className="w-5 h-5 translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
            <p className="font-body text-xs text-primary/40 mt-2 px-1">
              Press Enter to send · Shift+Enter for a new line
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Chat