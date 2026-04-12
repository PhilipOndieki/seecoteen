import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth'
import { auth } from '../firebase.js'

const googleProvider = new GoogleAuthProvider()

/**
 * Register a new user with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export async function registerWithEmail(email, password) {
  return createUserWithEmailAndPassword(auth, email, password)
}

/**
 * Sign in with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export async function signInWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
}

/**
 * Sign in with Google OAuth popup.
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export async function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider)
}

/**
 * Sign out the current user.
 * @returns {Promise<void>}
 */
export async function signOutUser() {
  return signOut(auth)
}

/**
 * Send a password reset email.
 * @param {string} email
 * @returns {Promise<void>}
 */
export async function resetPassword(email) {
  return sendPasswordResetEmail(auth, email)
}

/**
 * Update the display name of the current user.
 * @param {string} displayName
 * @returns {Promise<void>}
 */
export async function updateUserDisplayName(displayName) {
  if (!auth.currentUser) throw new Error('No user is signed in.')
  return updateProfile(auth.currentUser, { displayName })
}
