import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../firebase.js'

/**
 * Create a new session document.
 * @param {Object} sessionData
 * @returns {Promise<string>} The new session ID
 */
export async function createSession(sessionData) {
  const ref = collection(db, 'sessions')
  const docRef = await addDoc(ref, {
    ...sessionData,
    status: 'scheduled',
    createdAt: serverTimestamp(),
    date: sessionData.date ? Timestamp.fromDate(new Date(sessionData.date)) : serverTimestamp(),
  })
  return docRef.id
}

/**
 * Get all sessions for a given user (as senior or teen).
 * @param {string} userId
 * @param {'senior'|'teen'} role
 * @returns {Promise<Object[]>}
 */
export async function getSessionsForUser(userId, role) {
  const field = role === 'senior' ? 'seniorId' : 'teenId'
  const ref = collection(db, 'sessions')
  const q = query(ref, where(field, '==', userId), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

/**
 * Mark a session as completed.
 * @param {string} sessionId
 * @returns {Promise<void>}
 */
export async function completeSession(sessionId) {
  const ref = doc(db, 'sessions', sessionId)
  await updateDoc(ref, { status: 'completed' })
}

/**
 * Get the count of completed sessions between two users.
 * @param {string} seniorId
 * @param {string} teenId
 * @returns {Promise<number>}
 */
export async function getCompletedSessionCount(seniorId, teenId) {
  const ref = collection(db, 'sessions')
  const q = query(
    ref,
    where('seniorId', '==', seniorId),
    where('teenId', '==', teenId),
    where('status', '==', 'completed')
  )
  const snap = await getDocs(q)
  return snap.size
}

/**
 * Get the total number of completed sessions for a teen (for hour tracking).
 * @param {string} teenId
 * @returns {Promise<number>}
 */
export async function getTotalTeachingHours(teenId) {
  const ref = collection(db, 'sessions')
  const q = query(ref, where('teenId', '==', teenId), where('status', '==', 'completed'))
  const snap = await getDocs(q)
  // Each session averages 25 minutes = ~0.42 hours, we round to 0.5 per session
  return Math.round(snap.size * 0.5 * 10) / 10
}
