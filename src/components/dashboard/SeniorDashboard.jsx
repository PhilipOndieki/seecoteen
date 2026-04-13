import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import Card from '../ui/Card.jsx'
import Button from '../ui/Button.jsx'
import ProgressBar from '../ui/ProgressBar.jsx'
import Loader from '../ui/Loader.jsx'
import { useMatch } from '../../hooks/useMatch.js'
import { getAllProgressForUser } from '../../services/curriculum.js'
import { getCurrentShieldScore } from '../../services/scam.js'
import { getLatestExchangeEntry } from '../../services/exchange.js'
import { CURRICULUM_TRACKS, ROUTES } from '../../utils/constants.js'
import { getGreetingTime, timeAgo } from '../../utils/helpers.js'

function SeniorDashboard({ profile }) {
  const navigate = useNavigate()
  const { partner, loading: matchLoading } = useMatch()
  const [curriculumData, setCurriculumData] = useState([])
  const [shieldScore, setShieldScore] = useState(0)
  const [latestEntry, setLatestEntry] = useState(null)
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setDataLoading(true)
      try {
        const [progress, score, entry] = await Promise.all([
          getAllProgressForUser(profile.uid),
          getCurrentShieldScore(profile.uid),
          getLatestExchangeEntry(profile.uid, 'senior'),
        ])
        setCurriculumData(progress)
        setShieldScore(score)
        setLatestEntry(entry)
      } catch {
        // Data will show defaults
      } finally {
        setDataLoading(false)
      }
    }
    loadData()
  }, [profile.uid])

  const greeting = getGreetingTime()

  // Find current active track
  const activeProgress = curriculumData.find((p) => p.sessionsCompleted < 3) || curriculumData[0]
  const activeTrack = activeProgress
    ? CURRICULUM_TRACKS.find((t) => t.id === activeProgress.trackId)
    : CURRICULUM_TRACKS[0]
  const currentSession = activeProgress ? activeProgress.sessionsCompleted + 1 : 1

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Greeting */}
      <div>
        <h1 className="font-heading text-3xl sm:text-4xl text-primary">
          Good {greeting}, {profile.name}.
        </h1>
        <p className="font-body text-primary/60 mt-1">Welcome back to Seecoteen.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Match card */}
        <Card>
          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-white font-heading font-bold text-2xl flex-shrink-0"
              aria-label={partner ? `${partner.name} avatar` : 'Tutor avatar'}
            >
              {matchLoading ? '...' : partner ? partner.name[0].toUpperCase() : '?'}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-heading text-xl text-primary mb-1">Your Tutor</h2>
              {matchLoading ? (
                <Loader size="sm" message="Finding your match..." />
              ) : partner ? (
                <>
                  <p className="font-body font-semibold text-primary text-lg">{partner.name}</p>
                  <p className="font-body text-primary/60 text-sm mb-3">
                    {profile.matchReason || 'A great match for you.'}
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate(ROUTES.CURRICULUM)}
                    ariaLabel={`View your curriculum with ${partner.name}`}
                  >
                    Continue learning together
                  </Button>
                </>
              ) : (
                <>
                  <p className="font-body text-primary/60 text-sm mb-3">
                    Your tutor match is being arranged. Complete your profile to speed this up.
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(ROUTES.ONBOARDING)}
                    ariaLabel="Complete your profile"
                  >
                    Complete your profile
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Current skill module */}
        <Card>
          <h2 className="font-heading text-xl text-primary mb-4">Current Learning</h2>
          {dataLoading ? (
            <Loader size="sm" />
          ) : (
            <>
              <p className="font-body font-semibold text-primary mb-1">
                {activeTrack?.title || 'Smartphone Basics'}
              </p>
              <p className="font-body text-primary/60 text-sm mb-3">
                Session {Math.min(currentSession, 3)} of 3
              </p>
              <ProgressBar
                value={activeProgress?.sessionsCompleted || 0}
                max={3}
                label="Sessions completed"
                className="mb-4"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(ROUTES.CURRICULUM)}
                ariaLabel="Continue your learning session"
                fullWidth
              >
                Continue learning
              </Button>
            </>
          )}
        </Card>

        {/* Scam Shield card */}
        <Card>
          <h2 className="font-heading text-xl text-primary mb-4">Scam Shield</h2>
          {dataLoading ? (
            <Loader size="sm" />
          ) : (
            <div className="flex items-center gap-6">
              {/* Shield graphic */}
              <div className="relative w-20 h-20 flex-shrink-0" aria-label={`Shield score: ${shieldScore}%`}>
                <svg viewBox="0 0 80 80" className="w-full h-full" aria-hidden="true">
                  <path
                    d="M40 4 L68 16 L68 44 C68 58 55 70 40 76 C25 70 12 58 12 44 L12 16 Z"
                    fill="#E5E7EB"
                  />
                  <path
                    d="M40 4 L68 16 L68 44 C68 58 55 70 40 76 C25 70 12 58 12 44 L12 16 Z"
                    fill="#6B9E78"
                    style={{
                      clipPath: `inset(${100 - shieldScore}% 0 0 0)`,
                    }}
                  />
                  <text
                    x="40"
                    y="44"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="14"
                    fontWeight="bold"
                    fontFamily="Inter, sans-serif"
                  >
                    {shieldScore}%
                  </text>
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-body text-primary/70 text-sm mb-3">
                  {shieldScore === 0
                    ? 'You haven\'t practiced yet. Let\'s see how good your scam radar is!'
                    : shieldScore < 50
                    ? 'Good start! Keep practicing to strengthen your shield.'
                    : shieldScore < 80
                    ? 'You\'re getting good at spotting scams. Keep it up!'
                    : 'Excellent! Your scam shield is very strong.'}
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(ROUTES.SCAM_SIMULATOR)}
                  ariaLabel="Practice scam detection"
                >
                  Practice today
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Exchange log preview */}
        <Card>
          <h2 className="font-heading text-xl text-primary mb-4">Exchange Log</h2>
          {dataLoading ? (
            <Loader size="sm" />
          ) : latestEntry ? (
            <>
              <div className="bg-orange-50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs font-medium text-accent">Your tutor shared</span>
                </div>
                <p className="font-body text-primary/80 text-sm italic">
                  &ldquo;{latestEntry.teenEntry}&rdquo;
                </p>
                <p className="text-xs text-primary/40 mt-2">{timeAgo(latestEntry.timestamp)}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(ROUTES.EXCHANGE_LOG)}
                ariaLabel="See your full exchange history"
              >
                See full history →
              </Button>
            </>
          ) : (
            <>
              <p className="font-body text-primary/60 text-sm mb-4">
                Your story together starts after your first session.
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(ROUTES.CURRICULUM)}
                ariaLabel="Start your first learning session"
              >
                Start your first session →
              </Button>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}

SeniorDashboard.propTypes = {
  profile: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    matchReason: PropTypes.string,
  }).isRequired,
}

export default SeniorDashboard
