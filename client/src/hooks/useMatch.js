import { useState, useEffect } from 'react'
import { useAuth } from './useAuth.js'
import { getUserProfile } from '../services/users.js'

/**
 * Hook to load the matched partner's profile.
 * @returns {{ partner: Object|null, loading: boolean, error: string|null }}
 */
export function useMatch() {
  const { userProfile } = useAuth()
  const [partner, setPartner] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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
