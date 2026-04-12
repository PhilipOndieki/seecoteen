import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase.js'

/**
 * Get the curriculum progress record for a user and track.
 * @param {string} userId
 * @param {string} trackId
 * @returns {Promise<Object|null>}
 */
export async function getTrackProgress(userId, trackId) {
  const id = `${userId}_${trackId}`
  const ref = doc(db, 'curriculum', id)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

/**
 * Get all curriculum progress records for a user.
 * @param {string} userId
 * @returns {Promise<Object[]>}
 */
export async function getAllProgressForUser(userId) {
  const ref = collection(db, 'curriculum')
  const q = query(ref, where('userId', '==', userId))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

/**
 * Initialize a curriculum track for a user (if not already started).
 * @param {string} userId
 * @param {string} trackId
 * @returns {Promise<void>}
 */
export async function initTrackProgress(userId, trackId) {
  const id = `${userId}_${trackId}`
  const ref = doc(db, 'curriculum', id)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, {
      userId,
      trackId,
      sessionsCompleted: 0,
      skillsUnlocked: [],
      lastUpdated: serverTimestamp(),
    })
  }
}

/**
 * Mark a session as completed and unlock the session's skills.
 * @param {string} userId
 * @param {string} trackId
 * @param {number} sessionNumber
 * @param {string[]} skills  List of skill strings to unlock
 * @returns {Promise<void>}
 */
export async function completeTrackSession(userId, trackId, sessionNumber, skills) {
  const id = `${userId}_${trackId}`
  const ref = doc(db, 'curriculum', id)
  const snap = await getDoc(ref)

  if (!snap.exists()) {
    await setDoc(ref, {
      userId,
      trackId,
      sessionsCompleted: sessionNumber,
      skillsUnlocked: skills,
      lastUpdated: serverTimestamp(),
    })
  } else {
    const existing = snap.data()
    const merged = [...new Set([...(existing.skillsUnlocked || []), ...skills])]
    await updateDoc(ref, {
      sessionsCompleted: Math.max(existing.sessionsCompleted || 0, sessionNumber),
      skillsUnlocked: merged,
      lastUpdated: serverTimestamp(),
    })
  }
}

/**
 * Get a summary of all unlocked skills across all tracks.
 * @param {string} userId
 * @returns {Promise<string[]>}
 */
export async function getAllUnlockedSkills(userId) {
  const records = await getAllProgressForUser(userId)
  const allSkills = records.flatMap((r) => r.skillsUnlocked || [])
  return [...new Set(allSkills)]
}
