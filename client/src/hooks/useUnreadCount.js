import { useState, useEffect } from 'react'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase.js'
import { getConversationId } from '../services/chat.js'
import { useAuth } from './useAuth.js'
import { useMatch } from './useMatch.js'
import { ROLES } from '../utils/constants.js'

/**
 * Returns the live count of unread messages for the current user.
 * Powers the badge on the Messages nav link.
 * @returns {number}
 */
export function useUnreadCount() {
  const { userProfile } = useAuth()
  const { partner } = useMatch()
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!userProfile?.uid || !partner?.uid) {
      setCount(0)
      return
    }

    const seniorId = userProfile.role === ROLES.SENIOR ? userProfile.uid : partner.uid
    const teenId = userProfile.role === ROLES.TEEN ? userProfile.uid : partner.uid
    const conversationId = getConversationId(seniorId, teenId)

    const ref = collection(db, 'messages')
    const q = query(
      ref,
      where('conversationId', '==', conversationId),
      where('read', '==', false)
    )

    const unsubscribe = onSnapshot(q, (snap) => {
      const unread = snap.docs.filter(
        (d) => d.data().senderId !== userProfile.uid
      ).length
      setCount(unread)
    })

    return unsubscribe
  }, [userProfile?.uid, userProfile?.role, partner?.uid])

  return count
}

export default useUnreadCount