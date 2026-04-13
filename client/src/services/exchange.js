import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase.js'

/**
 * Add a new exchange log entry after a session.
 * @param {Object} entry
 * @param {string} entry.sessionId
 * @param {string} entry.seniorId
 * @param {string} entry.teenId
 * @param {string} entry.teenEntry
 * @param {string} entry.seniorEntry
 * @returns {Promise<string>} The new entry document ID
 */
export async function addExchangeEntry(entry) {
  const ref = collection(db, 'exchangeLog')
  const docRef = await addDoc(ref, {
    ...entry,
    timestamp: serverTimestamp(),
  })
  return docRef.id
}

/**
 * Get all exchange log entries for a senior.
 * @param {string} seniorId
 * @param {number} [limitCount=50]
 * @returns {Promise<Object[]>}
 */
export async function getExchangeEntriesForSenior(seniorId, limitCount = 50) {
  const ref = collection(db, 'exchangeLog')
  const q = query(
    ref,
    where('seniorId', '==', seniorId),
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

/**
 * Get all exchange log entries for a teen.
 * @param {string} teenId
 * @param {number} [limitCount=50]
 * @returns {Promise<Object[]>}
 */
export async function getExchangeEntriesForTeen(teenId, limitCount = 50) {
  const ref = collection(db, 'exchangeLog')
  const q = query(
    ref,
    where('teenId', '==', teenId),
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

/**
 * Get the most recent exchange entry for a user (either role).
 * @param {string} userId
 * @param {'senior'|'teen'} role
 * @returns {Promise<Object|null>}
 */
export async function getLatestExchangeEntry(userId, role) {
  const entries =
    role === 'senior'
      ? await getExchangeEntriesForSenior(userId, 1)
      : await getExchangeEntriesForTeen(userId, 1)
  return entries[0] || null
}

/**
 * Get all wisdom entries shared by seniors (for teen's knowledge collection).
 * @param {string} teenId
 * @returns {Promise<string[]>}
 */
export async function getSeniorWisdomForTeen(teenId) {
  const entries = await getExchangeEntriesForTeen(teenId)
  return entries.map((e) => e.seniorEntry).filter(Boolean)
}
