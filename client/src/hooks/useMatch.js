import { useState, useEffect } from 'react'
import { useAuth } from './useAuth.js'
import { getUserProfile } from '../services/users.js'

/**
 * Hook to load the matched partner's profile.
 * Polls refreshUserProfile every 15 seconds so the senior's dashboard
 * picks up a new match without requiring a manual page reload.
 * @returns {{ partner: Object|null, loading: boolean, error: string|null }}
 */
export function useMatch() {
  const { userProfile, refreshUserProfile } = useAuth()
  const [partner, setPartner] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Poll for profile updates every 15s when there is no match yet.
  // This covers the case where a teen matches with the senior while
  // the senior has the dashboard open — they see the update automatically.
  useEffect(() => {
    if (userProfile?.matchedPartnerId) return // already matched, no need to poll

    const interval = setInterval(async () => {
      try {
        await refreshUserProfile()
      } catch {
        // silent — polling failure should never crash the UI
      }
    }, 15000) // every 15 seconds

    return () => clearInterval(interval)
  }, [userProfile?.matchedPartnerId, refreshUserProfile])

  // Load partner profile whenever matchedPartnerId changes
  useEffect(() => {
    if (!userProfile?.matchedPartnerId) {
      setPartner(null)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    getUserProfile(userProfile.matchedPartnerId)
      .then((p) => {
        if (!cancelled) setPartner(p)
      })
      .catch(() => {
        if (!cancelled) setError('Unable to load your partner\'s profile right now.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [userProfile?.matchedPartnerId])

  return { partner, loading, error }
}

export default useMatch