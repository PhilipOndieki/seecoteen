import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore'
import { db } from '../firebase.js'

/**
 * Get a user's Firestore profile by UID.
 * @param {string} uid
 * @returns {Promise<Object|null>}
 */
export async function getUserProfile(uid) {
  const ref = doc(db, 'users', uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

/**
 * Create or overwrite a user profile in Firestore.
 * @param {string} uid
 * @param {Object} data
 * @returns {Promise<void>}
 */
export async function createUserProfile(uid, data) {
  const ref = doc(db, 'users', uid)
  await setDoc(ref, {
    uid,
    matchedPartnerId: null,
    matchReason: null,
    ...data,
    createdAt: serverTimestamp(),
    lastActive: serverTimestamp(),
  })
}

/**
 * Update specific fields on a user's profile.
 * @param {string} uid
 * @param {Object} data
 * @returns {Promise<void>}
 */
export async function updateUserProfile(uid, data) {
  const ref = doc(db, 'users', uid)
  await updateDoc(ref, {
    ...data,
    lastActive: serverTimestamp(),
  })
}

/**
 * Get all users with a specific role.
 * @param {'senior'|'teen'} role
 * @returns {Promise<Object[]>}
 */
export async function getUsersByRole(role) {
  const ref = collection(db, 'users')
  const q = query(ref, where('role', '==', role))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

/**
 * Set a match between two users.
 * @param {string} uid
 * @param {string} partnerId
 * @param {string} matchReason
 * @returns {Promise<void>}
 */
export async function setUserMatch(uid, partnerId, matchReason) {
  await updateUserProfile(uid, { matchedPartnerId: partnerId, matchReason })
}

/**
 * Mark onboarding as complete for a user.
 * @param {string} uid
 * @returns {Promise<void>}
 */
export async function completeOnboarding(uid) {
  await updateUserProfile(uid, { onboardingComplete: true })
}

/**
 * Get all senior users who have not yet been matched with a tutor.
 * @returns {Promise<Object[]>}
 */
export async function getUnmatchedSeniors() {
  const ref = collection(db, 'users')
  const q = query(
    ref,
    where('role', '==', 'senior'),
    where('matchedPartnerId', '==', null)
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => {
    const data = d.data()
    // Strip email before returning — never expose it to the client directory
    const { email: _email, ...safeData } = data
    return { id: d.id, ...safeData }
  })
}
