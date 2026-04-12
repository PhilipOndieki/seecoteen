import { useAuth as useAuthContext } from '../context/AuthContext.jsx'

/**
 * Hook to access the current auth state including Firebase user and Firestore profile.
 * @returns {{ currentUser: import('firebase/auth').User|null, userProfile: Object|null, loading: boolean, refreshUserProfile: Function }}
 */
export function useAuth() {
  return useAuthContext()
}

export default useAuth
