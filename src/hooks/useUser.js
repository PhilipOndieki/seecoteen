import { useState, useEffect } from 'react'
import { useAuth } from './useAuth.js'
import { getUserProfile } from '../services/users.js'

/**
 * Hook to access and refresh the current user's Firestore profile.
 * @returns {{ profile: Object|null, loading: boolean, error: string|null, refresh: Function }}
 */
export function useUser() {
  const { currentUser, userProfile } = useAuth()
  const [profile, setProfile] = useState(userProfile)
  const [loading, setLoading] = useState(!userProfile && !!currentUser)
  const [error, setError] = useState(null)

  useEffect(() => {
    setProfile(userProfile)
  }, [userProfile])

  const refresh = async () => {
    if (!currentUser) return
    setLoading(true)
    setError(null)
    try {
      const fresh = await getUserProfile(currentUser.uid)
      setProfile(fresh)
    } catch {
      setError('Unable to load your profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return { profile, loading, error, refresh }
}

export default useUser
