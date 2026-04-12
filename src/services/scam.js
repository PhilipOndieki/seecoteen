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
 * Save a scam simulator attempt to Firestore.
 * @param {string} userId
 * @param {Object} attempt
 * @param {string} attempt.scenarioType
 * @param {number} attempt.difficulty
 * @param {boolean} attempt.correct
 * @param {number} attempt.score
 * @returns {Promise<string>} The new score document ID
 */
export async function saveScamScore(userId, attempt) {
  const ref = collection(db, 'scamScores')
  const docRef = await addDoc(ref, {
    userId,
    scenarioType: attempt.scenarioType,
    difficulty: attempt.difficulty,
    correct: attempt.correct,
    score: attempt.score,
    timestamp: serverTimestamp(),
  })
  return docRef.id
}

/**
 * Get all scam scores for a user, ordered by most recent first.
 * @param {string} userId
 * @param {number} [limitCount=50]
 * @returns {Promise<Object[]>}
 */
export async function getScamScores(userId, limitCount = 50) {
  const ref = collection(db, 'scamScores')
  const q = query(
    ref,
    where('userId', '==', userId),
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

/**
 * Get the last 10 scam score values for charting.
 * @param {string} userId
 * @returns {Promise<Array<{score: number, timestamp: any, correct: boolean}>>}
 */
export async function getScamScoreTrend(userId) {
  const scores = await getScamScores(userId, 10)
  return scores.reverse().map((s) => ({
    score: s.score,
    timestamp: s.timestamp,
    correct: s.correct,
  }))
}

/**
 * Calculate the current shield score (0–100) based on recent performance.
 * @param {string} userId
 * @returns {Promise<number>}
 */
export async function getCurrentShieldScore(userId) {
  const scores = await getScamScores(userId, 20)
  if (scores.length === 0) return 0
  const correct = scores.filter((s) => s.correct).length
  return Math.round((correct / scores.length) * 100)
}

/**
 * Count consecutive correct answers to determine when to increase difficulty.
 * @param {string} userId
 * @returns {Promise<number>}
 */
export async function getConsecutiveCorrect(userId) {
  const scores = await getScamScores(userId, 10)
  let count = 0
  for (const s of scores) {
    if (s.correct) count++
    else break
  }
  return count
}

/**
 * Calculate the next difficulty level based on consecutive correct answers.
 * @param {string} userId
 * @param {number} currentDifficulty
 * @returns {Promise<number>}
 */
export async function getNextDifficulty(userId, currentDifficulty) {
  const consecutive = await getConsecutiveCorrect(userId)
  if (consecutive >= 3 && currentDifficulty < 5) {
    return currentDifficulty + 1
  }
  return currentDifficulty
}
