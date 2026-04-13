import React, { createContext, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase.js'
import { getUserProfile } from '../services/users.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      if (user) {
        try {
          const profile = await getUserProfile(user.uid)
          if (!profile) {
            setUserProfile({
              uid: user.uid,
              email: user.email,
              name: user.displayName || '',
              role: 'senior',
              onboardingComplete: false,
            })
          } else {
            setUserProfile(profile)
          }
        } catch (err) {
          console.error('Failed to load user profile:', err)
          setUserProfile({
            uid: user.uid,
            email: user.email,
            name: user.displayName || '',
            role: 'senior',
            onboardingComplete: false,
          })
        }
      } else {
        setUserProfile(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const refreshUserProfile = async () => {
    if (currentUser) {
      try {
        const profile = await getUserProfile(currentUser.uid)
        setUserProfile(profile)
      } catch {
        setUserProfile(null)
      }
    }
  }

  const value = {
    currentUser,
    userProfile,
    loading,
    refreshUserProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
