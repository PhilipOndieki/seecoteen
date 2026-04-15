import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import Card from '../ui/Card.jsx'
import Button from '../ui/Button.jsx'
import ProgressBar from '../ui/ProgressBar.jsx'
import Loader from '../ui/Loader.jsx'
import Toast from '../ui/Toast.jsx'
import UnassignModal from './UnassignModal.jsx'
import { useMatch } from '../../hooks/useMatch.js'
import { useAuth } from '../../hooks/useAuth.js'
import { getAllProgressForUser } from '../../services/curriculum.js'
import { getTotalTeachingHours } from '../../services/sessions.js'
import { getSeniorWisdomForTeen, getLatestExchangeEntry } from '../../services/exchange.js'
import { unmatchUsers } from '../../services/users.js'
import { CURRICULUM_TRACKS, ROUTES } from '../../utils/constants.js'
import { getGreetingTime } from '../../utils/helpers.js'

function TeenDashboard({ profile }) {
  const navigate = useNavigate()
  const { partner, loading: matchLoading } = useMatch()
  const { refreshUserProfile } = useAuth()
  const [teachingHours, setTeachingHours] = useState(0)
  const [wisdomCount, setWisdomCount] = useState(0)
  const [curriculumData, setCurriculumData] = useState([])
  const [latestEntry, setLatestEntry] = useState(null)
  const [dataLoading, setDataLoading] = useState(true)
  const [unassignModalOpen, setUnassignModalOpen] = useState(false)
  const [unassigning, setUnassigning] = useState(false)
  const [toast, setToast] = useState({ message: '', type: 'success' })

  useEffect(() => {
    async function loadData() {
      setDataLoading(true)
      try {
        const [hours, wisdom, progress, entry] = await Promise.all([
          getTotalTeachingHours(profile.uid),
          getSeniorWisdomForTeen(profile.uid),
          getAllProgressForUser(profile.uid),
          getLatestExchangeEntry(profile.uid, 'teen'),
        ])
        setTeachingHours(hours)
        setWisdomCount(wisdom.length)
        setCurriculumData(progress)
        setLatestEntry(entry)
      } catch {
        // Data will show defaults
      } finally {
        setDataLoading(false)
      }
    }
    loadData()
  }, [profile.uid])

  const handleUnassignConfirm = async () => {
    if (!profile.uid || !partner?.uid) return
    setUnassigning(true)
    try {
      await unmatchUsers(profile.uid, partner.uid)
      await refreshUserProfile()
      setUnassignModalOpen(false)
      setToast({
        message: `You've been unassigned from ${partner.name}. Find a new senior to mentor.`,
        type: 'info',
      })
      // Brief pause for toast readability then redirect to directory
      setTimeout(() => navigate(ROUTES.SENIOR_DIRECTORY, { replace: true }), 2000)
    } catch {
      setToast({ message: 'Something went wrong. Please try again.', type: 'error' })
    } finally {
      setUnassigning(false)
    }
  }

  const greeting = getGreetingTime()
  const greetings = {
    morning: `Good morning, ${profile.name}!`,
    afternoon: `Hey ${profile.name}, ready to make a difference today?`,
    evening: `Evening, ${profile.name} — great to see you!`,
  }

  // Next track to work on
  const activeProgress = curriculumData.find((p) => p.sessionsCompleted < 3) || null
  const nextTrack = activeProgress
    ? CURRICULUM_TRACKS.find((t) => t.id === activeProgress.trackId)
    : CURRICULUM_TRACKS[0]
  const nextSession = activeProgress ? activeProgress.sessionsCompleted + 1 : 1

  // Total sessions completed across all tracks
  const totalSessions = curriculumData.reduce((sum, p) => sum + (p.sessionsCompleted || 0), 0)

  return (
    <div className="space-y-6 animate-fadeIn">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      {/* Greeting */}
      <div>
        <h1 className="font-heading text-3xl sm:text-4xl text-primary">
          {greetings[greeting]}
        </h1>
        <p className="font-body text-primary/60 mt-1">
          You&apos;ve logged{' '}
          <span className="text-accent font-semibold">{teachingHours} teaching hours</span> so far.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Match card */}
        <Card>
          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-full bg-accent-secondary flex items-center justify-center text-white font-heading font-bold text-2xl flex-shrink-0"
              aria-label={partner ? `${partner.name} avatar` : 'Senior avatar'}
            >
              {matchLoading ? '...' : partner ? partner.name[0].toUpperCase() : '?'}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-heading text-xl text-primary mb-1">Your Senior</h2>
              {matchLoading ? (
                <Loader size="sm" />
              ) : partner ? (
                <>
                  <p className="font-body font-semibold text-primary">{partner.name}</p>
                  <p className="font-body text-primary/60 text-sm mb-1">{partner.background}</p>
                  <p className="font-body text-primary/50 text-sm mb-3 italic">
                    Match confirmed. Time to make a difference.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate(ROUTES.CURRICULUM)}
                      ariaLabel={`View your session guide for ${partner.name}`}
                    >
                      Start session guide
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setUnassignModalOpen(true)}
                      ariaLabel={`Unassign from ${partner.name}`}
                    >
                      Unassign
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="font-body text-primary/60 text-sm mb-3">
                    You haven&apos;t been matched yet. Browse available seniors and choose who you&apos;d like to mentor.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate(ROUTES.SENIOR_DIRECTORY)}
                    ariaLabel="Browse available seniors to find your match"
                  >
                    Find a Senior →
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Next session */}
        <Card>
          <h2 className="font-heading text-xl text-primary mb-4">Next Session</h2>
          {dataLoading ? (
            <Loader size="sm" />
          ) : (
            <>
              <p className="font-body font-semibold text-primary mb-1">
                {nextTrack?.title || 'Smartphone Basics'}
              </p>
              <p className="font-body text-primary/60 text-sm mb-1">
                Session {Math.min(nextSession, 3)} of 3
              </p>
              <p className="font-body text-primary/50 text-sm mb-3">
                {nextTrack?.sessions?.[Math.min(nextSession - 1, 2)]?.objective}
              </p>
              <ProgressBar
                value={activeProgress?.sessionsCompleted || 0}
                max={3}
                label="Track progress"
                className="mb-4"
                color="green"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(ROUTES.CURRICULUM)}
                ariaLabel="Open your session teaching guide"
                fullWidth
              >
                Open teaching guide
              </Button>
            </>
          )}
        </Card>

        {/* Teaching hours tracker */}
        <Card className="text-center">
          <h2 className="font-heading text-xl text-primary mb-3">Your Impact</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p
                className="font-heading font-bold text-5xl text-accent mb-1"
                aria-label={`${teachingHours} teaching hours`}
              >
                {teachingHours}
              </p>
              <p className="font-body text-primary/60 text-sm">hours taught</p>
            </div>
            <div>
              <p
                className="font-heading font-bold text-5xl text-accent-secondary mb-1"
                aria-label={`${totalSessions} sessions completed`}
              >
                {totalSessions}
              </p>
              <p className="font-body text-primary/60 text-sm">sessions done</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(ROUTES.PROGRESS)}
              ariaLabel="View your shareable impact card"
              fullWidth
            >
              View impact card →
            </Button>
          </div>
        </Card>

        {/* Knowledge collected */}
        <Card>
          <h2 className="font-heading text-xl text-primary mb-4">Knowledge Collected</h2>
          {dataLoading ? (
            <Loader size="sm" />
          ) : (
            <>
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0"
                  aria-hidden="true"
                >
                  <svg className="w-7 h-7 text-accent-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <p className="font-heading font-bold text-4xl text-accent-secondary">
                    {wisdomCount}
                  </p>
                  <p className="font-body text-primary/60 text-sm">
                    wisdom {wisdomCount === 1 ? 'story' : 'stories'} from {partner?.name || 'your senior'}
                  </p>
                </div>
              </div>
              {latestEntry?.seniorEntry && (
                <div className="bg-green-50 rounded-lg p-4 mb-4">
                  <p className="font-body text-primary/80 text-sm italic">
                    &ldquo;{latestEntry.seniorEntry}&rdquo;
                  </p>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(ROUTES.EXCHANGE_LOG)}
                ariaLabel="Read all senior wisdom stories"
              >
                Read their stories →
              </Button>
            </>
          )}
        </Card>
      </div>

      {/* Shareable impact card preview */}
      <Card className="bg-gradient-to-r from-primary to-blue-900 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl text-white mb-1">Your Impact This Month</h2>
            <p className="font-body text-white/70 text-sm">
              Download your volunteer record for college applications.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(ROUTES.PROGRESS)}
            ariaLabel="Download your impact summary"
            className="text-white hover:bg-white/10 border border-white/30 flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download summary
          </Button>
        </div>
      </Card>

      {/* Unassign confirmation modal */}
      {partner && (
        <UnassignModal
          isOpen={unassignModalOpen}
          onClose={() => setUnassignModalOpen(false)}
          onConfirm={handleUnassignConfirm}
          seniorName={partner.name}
          unassigning={unassigning}
        />
      )}
    </div>
  )
}

TeenDashboard.propTypes = {
  profile: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    matchReason: PropTypes.string,
  }).isRequired,
}

export default TeenDashboard