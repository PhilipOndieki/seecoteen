/**
 * Format a Firestore timestamp or JS Date to a readable string.
 * @param {import('firebase/firestore').Timestamp|Date|string|null} timestamp
 * @returns {string}
 */
export function formatDate(timestamp) {
  if (!timestamp) return 'Unknown date'
  let date
  if (timestamp?.toDate) {
    date = timestamp.toDate()
  } else if (timestamp instanceof Date) {
    date = timestamp
  } else {
    date = new Date(timestamp)
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Format a timestamp to a relative "time ago" string.
 * @param {import('firebase/firestore').Timestamp|Date|null} timestamp
 * @returns {string}
 */
export function timeAgo(timestamp) {
  if (!timestamp) return ''
  let date
  if (timestamp?.toDate) {
    date = timestamp.toDate()
  } else if (timestamp instanceof Date) {
    date = timestamp
  } else {
    date = new Date(timestamp)
  }

  const now = new Date()
  const diffMs = now - date
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return formatDate(timestamp)
}

/**
 * Truncate a string to maxLength characters, adding ellipsis.
 * @param {string} str
 * @param {number} maxLength
 * @returns {string}
 */
export function truncate(str, maxLength = 100) {
  if (!str) return ''
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength).trimEnd() + '...'
}

/**
 * Get the time-of-day greeting.
 * @returns {string} "morning" | "afternoon" | "evening"
 */
export function getGreetingTime() {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  return 'evening'
}

/**
 * Get initials from a full name (up to 2 characters).
 * @param {string} name
 * @returns {string}
 */
export function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('')
}

/**
 * Calculate percentage, clamped between 0 and 100.
 * @param {number} value
 * @param {number} total
 * @returns {number}
 */
export function percentage(value, total) {
  if (!total || total === 0) return 0
  return Math.min(100, Math.max(0, Math.round((value / total) * 100)))
}

/**
 * Generate a unique ID (for local use before Firestore assignment).
 * @returns {string}
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

/**
 * Safely parse JSON, returning null on failure.
 * @param {string} str
 * @returns {any|null}
 */
export function safeParseJSON(str) {
  try {
    return JSON.parse(str)
  } catch {
    return null
  }
}

/**
 * Map a Firebase auth error code to a plain English message.
 * @param {string} code
 * @returns {string}
 */
export function friendlyAuthError(code) {
  const messages = {
    'auth/email-already-in-use': 'An account with this email already exists. Try signing in instead.',
    'auth/invalid-email': 'That email address doesn\'t look right. Please check it and try again.',
    'auth/user-not-found': 'We couldn\'t find an account with that email. Would you like to sign up?',
    'auth/wrong-password': 'Incorrect password. Please try again or use "Forgot password."',
    'auth/too-many-requests': 'Too many sign-in attempts. Please wait a few minutes and try again.',
    'auth/network-request-failed': 'Connection issue. Please check your internet and try again.',
    'auth/weak-password': 'Please choose a stronger password — at least 8 characters.',
    'auth/popup-closed-by-user': 'Sign-in was cancelled. Please try again.',
    'auth/cancelled-popup-request': 'Sign-in was cancelled. Please try again.',
    'auth/account-exists-with-different-credential': 'An account with this email already exists. Try signing in with email and password.',
    'auth/requires-recent-login': 'For security, please sign out and sign back in before doing this.',
    'auth/invalid-credential': 'Incorrect email or password. Please check your details and try again.',
  }
  return messages[code] || 'Something went wrong. Please try again in a moment.'
}
