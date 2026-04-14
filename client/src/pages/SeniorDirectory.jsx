import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { getUnmatchedSeniors, setUserMatch, getUserProfile } from '../services/users.js'
import { ROUTES, ROLES } from '../utils/constants.js'
import SeniorProfileCard from '../components/directory/SeniorProfileCard.jsx'
import SeniorProfileModal from '../components/directory/SeniorProfileModal.jsx'
import Loader from '../components/ui/Loader.jsx'
import Toast from '../components/ui/Toast.jsx'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'

function SeniorDirectory() {
  const { userProfile, refreshUserProfile } = useAuth()
  const navigate = useNavigate()

  const [seniors, setSeniors] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSenior, setSelectedSenior] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [matching, setMatching] = useState(false)
  const [toast, setToast] = useState({ message: '', type: 'success' })
  const [searchQuery, setSearchQuery] = useState('')

  // Redirect non-teens away
  useEffect(() => {
    if (userProfile && userProfile.role !== ROLES.TEEN) {
      navigate(ROUTES.DASHBOARD, { replace: true })
    }
  }, [userProfile, navigate])

  // Redirect if already matched
  useEffect(() => {
    if (userProfile?.matchedPartnerId) {
      navigate(ROUTES.DASHBOARD, { replace: true })
    }
  }, [userProfile, navigate])

  const loadSeniors = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getUnmatchedSeniors()
      // Exclude seniors who haven't completed onboarding (no name yet)
      setSeniors(data.filter((s) => s.onboardingComplete && s.name))
    } catch {
      setToast({ message: 'Unable to load available seniors. Please refresh.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSeniors()
  }, [loadSeniors])

  const handleViewProfile = (senior) => {
    setSelectedSenior(senior)
    setModalOpen(true)
  }

  const handleMatch = async (senior) => {
    if (!userProfile?.uid || !senior?.id) return
    setMatching(true)
    try {
      const matchReason = `${userProfile.name} chose to be ${senior.name}'s tech tutor on Seecoteen.`
      await setUserMatch(userProfile.uid, senior.id, matchReason)
      await setUserMatch(senior.id, userProfile.uid, matchReason)
      await refreshUserProfile()

      setToast({
        message: `You're now matched with ${senior.name}! Head to your dashboard to get started.`,
        type: 'success',
      })
      setModalOpen(false)

      // Brief delay so the toast is readable, then redirect to dashboard
      setTimeout(() => navigate(ROUTES.DASHBOARD, { replace: true }), 2000)
    } catch {
      setToast({ message: 'Something went wrong. Please try again.', type: 'error' })
    } finally {
      setMatching(false)
    }
  }

  const filteredSeniors = seniors.filter((s) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      s.name?.toLowerCase().includes(q) ||
      s.background?.toLowerCase().includes(q) ||
      s.interests?.some((i) => i.toLowerCase().includes(q))
    )
  })

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl sm:text-4xl text-primary mb-2">
          Available Seniors
        </h1>
        <p className="font-body text-primary/60 max-w-2xl">
          These seniors are looking for a tech tutor. Browse their profiles, find someone
          whose background speaks to you, and start your mentorship.
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, background, or interest..."
            aria-label="Search available seniors"
            className="input-field pl-12"
          />
        </div>
      </div>

      {loading ? (
        <Loader size="lg" message="Finding available seniors..." fullPage />
      ) : filteredSeniors.length === 0 ? (
        <Card className="text-center py-16">
          <div
            className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-5"
            aria-hidden="true"
          >
            <svg className="w-10 h-10 text-accent/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="font-heading text-2xl text-primary mb-3">
            {searchQuery ? 'No seniors match your search' : 'No seniors available right now'}
          </h2>
          <p className="font-body text-primary/60 max-w-md mx-auto mb-6">
            {searchQuery
              ? 'Try a different search term or clear the filter.'
              : 'All seniors are currently matched with tutors. Check back soon as new seniors join regularly.'}
          </p>
          {searchQuery && (
            <Button
              variant="ghost"
              onClick={() => setSearchQuery('')}
              ariaLabel="Clear search"
            >
              Clear search
            </Button>
          )}
        </Card>
      ) : (
        <>
          <p className="font-body text-sm text-primary/50 mb-5">
            {filteredSeniors.length} senior{filteredSeniors.length !== 1 ? 's' : ''} available
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSeniors.map((senior) => (
              <SeniorProfileCard
                key={senior.id}
                senior={senior}
                onViewProfile={handleViewProfile}
              />
            ))}
          </div>
        </>
      )}

      {/* Profile modal */}
      <SeniorProfileModal
        senior={selectedSenior}
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedSenior(null) }}
        onMatch={handleMatch}
        matching={matching}
      />
    </div>
  )
}

export default SeniorDirectory