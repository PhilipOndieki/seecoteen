import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  doc,
  getDocs,
  limit,
} from 'firebase/firestore'
import { db } from '../firebase.js'

/**
 * Generate a consistent conversation ID for a senior/teen pair.
 * Alphabetically sorted so it's the same regardless of who queries.
 * @param {string} seniorId
 * @param {string} teenId
 * @returns {string}
 */
export function getConversationId(seniorId, teenId) {
  return [seniorId, teenId].sort().join('_')
}

/**
 * Send a message in a conversation.
 * @param {string} seniorId
 * @param {string} teenId
 * @param {string} senderId
 * @param {string} text
 * @returns {Promise<string>} The new message document ID
 */
export async function sendMessage(seniorId, teenId, senderId, text) {
  const conversationId = getConversationId(seniorId, teenId)
  const ref = collection(db, 'messages')
  const docRef = await addDoc(ref, {
    conversationId,
    seniorId,
    teenId,
    senderId,
    text: text.trim(),
    read: false,
    timestamp: serverTimestamp(),
  })
  return docRef.id
}

/**
 * Subscribe to live messages for a conversation.
 * Returns an unsubscribe function — call it on component unmount.
 * @param {string} seniorId
 * @param {string} teenId
 * @param {function} onMessages - callback with array of message objects
 * @returns {function} unsubscribe
 */
export function subscribeToMessages(seniorId, teenId, onMessages) {
  const conversationId = getConversationId(seniorId, teenId)
  const ref = collection(db, 'messages')
  const q = query(
    ref,
    where('conversationId', '==', conversationId),
    orderBy('timestamp', 'asc'),
    limit(100)
  )

  return onSnapshot(q, (snap) => {
    const messages = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }))
    onMessages(messages)
  })
}

/**
 * Mark all unread messages in a conversation as read for a given user.
 * @param {string} seniorId
 * @param {string} teenId
 * @param {string} currentUserId
 * @returns {Promise<void>}
 */
export async function markMessagesAsRead(seniorId, teenId, currentUserId) {
  const conversationId = getConversationId(seniorId, teenId)
  const ref = collection(db, 'messages')
  const q = query(
    ref,
    where('conversationId', '==', conversationId),
    where('read', '==', false)
  )
  const snap = await getDocs(q)
  const updates = snap.docs
    .filter((d) => d.data().senderId !== currentUserId)
    .map((d) => updateDoc(doc(db, 'messages', d.id), { read: true }))
  await Promise.all(updates)
}

/**
 * Get the count of unread messages for a user in a conversation.
 * @param {string} seniorId
 * @param {string} teenId
 * @param {string} currentUserId
 * @returns {Promise<number>}
 */
export async function getUnreadCount(seniorId, teenId, currentUserId) {
  const conversationId = getConversationId(seniorId, teenId)
  const ref = collection(db, 'messages')
  const q = query(
    ref,
    where('conversationId', '==', conversationId),
    where('read', '==', false)
  )
  const snap = await getDocs(q)
  return snap.docs.filter((d) => d.data().senderId !== currentUserId).length
}