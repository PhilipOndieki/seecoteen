import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import { getAllProgressForUser, getAllUnlockedSkills } from '../services/curriculum.js'
import { getScamScoreTrend, getCurrentShieldScore } from '../services/scam.js'
import { getSeniorWisdomForTeen, getExchangeEntriesForTeen } from '../services/exchange.js'
import { getTotalTeachingHours, getCompletedSessionCount } from '../services/sessions.js'
import { generateEncouragement } from '../services/gemini.js'
import { CURRICULUM_TRACKS, ROLES } from '../utils/constants.js'
import { useMatch } from '../hooks/useMatch.js'
import Card from '../components/ui/Card.jsx'
import Loader from '../components/ui/Loader.jsx'
import Button from '../components/ui/Button.jsx'
import Badge from '../components/ui/Badge.jsx'
import ScamScoreCard from '../components/scam/ScamScoreCard.jsx'
import Toast from '../components/ui/Toast.jsx'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { truncate } from '../utils/helpers.js'

function SeniorProgress({ profile, partner }) {
  const [progressData, setProgressData] = useState([])
  const [unlockedSkills, setUnlockedSkills] = useState([])
  const [shieldScore, setShieldScore] = useState(0)
  const [scoreTrend, setScoreTrend] = useState([])
  const [completedSessions, setCompletedSessions] = useState(0)
  const [encouragement, setEncouragement] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [profile.uid])

  const loadData = async () => {
    setLoading(true)
    try {
      const [progress, skills, score, trend] = await Promise.all([
        getAllProgressForUser(profile.uid),
        getAllUnlockedSkills(profile.uid),
        getCurrentShieldScore(profile.uid),
        getScamScoreTrend(profile.uid),
      ])
      setProgressData(progress)
      setUnlockedSkills(skills)
      setShieldScore(score)
      setScoreTrend(trend.map((t, i) => ({ attempt: i + 1, score: t.score })))

      const total = progress.reduce((sum, p) => sum + (p.sessionsCompleted || 0), 0)
      setCompletedSessions(total)

      // Generate encouragement
      try {
        const currentTrack = CURRICULUM_TRACKS.find((t) =>
          progress.some((p) => p.trackId === t.id && p.sessionsCompleted < 3)
        )
        const msg = await generateEncouragement({
          name: profile.name,
          sessionsCompleted: total,
          skillsUnlocked: skills.length,
          shieldScore: score,
          currentTrack: currentTrack?.title,
        })
        setEncouragement(msg)
      } catch {
        // encouragement is optional
      }
    } catch {
      // data will show defaults
    } finally {
      setLoading(false)
    }
  }

  // All possible skills across all tracks
  const allSkills = CURRICULUM_TRACKS.flatMap((t) => t.sessions.flatMap((s) => s.skills))
  const uniqueSkills = [...new Set(allSkills)]

  if (loading) return <Loader size="lg" message="Loading your progress..." fullPage />

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Encouragement */}
      {encouragement && (
        <Card className="bg-orange-50 border border-orange-100">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div>
              <p className="font-body font-semibold text-primary mb-1">A note for you, {profile.name}</p>
              <p className="font-body text-primary/80 leading-relaxed italic">{encouragement}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="text-center">
          <p className="font-heading font-bold text-5xl text-accent mb-2" aria-label={`${completedSessions} sessions completed`}>
            {completedSessions}
          </p>
          <p className="font-body text-primary/60">
            sessions with {partner?.name || 'your tutor'}
          </p>
        </Card>
        <Card className="text-center">
          <p className="font-heading font-bold text-5xl text-accent-secondary mb-2" aria-label={`${unlockedSkills.length} skills unlocked`}>
            {unlockedSkills.length}
          </p>
          <p className="font-body text-primary/60">skills unlocked</p>
        </Card>
        <Card className="flex items-center justify-center">
          <ScamScoreCard score={shieldScore} size="md" />
        </Card>
      </div>

      {/* Skills grid */}
      <Card>
        <h2 className="font-heading text-2xl text-primary mb-5">Skills Unlocked</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {uniqueSkills.slice(0, 30).map((skill, i) => {
            const isUnlocked = unlockedSkills.includes(skill)
            return (
              <div
                key={i}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  isUnlocked ? 'bg-green-50' : 'bg-gray-50 opacity-50'
                }`}
                aria-label={`${skill} — ${isUnlocked ? 'unlocked' : 'locked'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isUnlocked ? 'bg-accent-secondary' : 'bg-gray-300'
                  }`}
                  aria-hidden="true"
                >
                  {isUnlocked ? (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                </div>
                <p className="font-body text-sm text-primary/80">{truncate(skill, 60)}</p>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Scam score trend chart */}
      {scoreTrend.length > 1 && (
        <Card>
          <h2 className="font-heading text-2xl text-primary mb-5">Scam Shield Trend</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scoreTrend} aria-label="Scam score trend over last attempts">
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" />
                <XAxis dataKey="attempt" label={{ value: 'Attempt', position: 'insideBottom', offset: -2 }} tick={{ fontFamily: 'Inter' }} />
                <YAxis domain={[0, 100]} tick={{ fontFamily: 'Inter' }} />
                <Tooltip
                  formatter={(value) => [`${value}%`, 'Score']}
                  contentStyle={{ fontFamily: 'Inter', fontSize: '14px', borderRadius: '8px' }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#6B9E78"
                  strokeWidth={2.5}
                  dot={{ fill: '#6B9E78', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  )
}

function TeenProgress({ profile, partner }) {
  const [teachingHours, setTeachingHours] = useState(0)
  const [wisdomEntries, setWisdomEntries] = useState([])
  const [unlockedSkills, setUnlockedSkills] = useState([])
  const [completedSessions, setCompletedSessions] = useState(0)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState({ message: '', type: 'success' })
  const impactCardRef = useRef(null)

  useEffect(() => {
    loadData()
  }, [profile.uid])

  const loadData = async () => {
    setLoading(true)
    try {
      const [hours, wisdom, skills, allProgress] = await Promise.all([
        getTotalTeachingHours(profile.uid),
        getSeniorWisdomForTeen(profile.uid),
        getAllUnlockedSkills(profile.uid),
        getAllProgressForUser(profile.uid),
      ])
      setTeachingHours(hours)
      setWisdomEntries(wisdom)
      setUnlockedSkills(skills)
      const total = allProgress.reduce((sum, p) => sum + (p.sessionsCompleted || 0), 0)
      setCompletedSessions(total)
    } catch {
      // defaults
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadImpact = () => {
    // Create a printable page for the impact card
    const win = window.open('', '_blank')
    if (!win) {
      setToast({ message: 'Please allow pop-ups to download your impact summary.', type: 'warning' })
      return
    }
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Seecoteen Impact Summary — ${profile.name}</title>
        <style>
          body { font-family: Georgia, serif; padding: 40px; max-width: 600px; margin: 0 auto; color: #1E2A3A; }
          h1 { font-size: 28px; margin-bottom: 4px; }
          .subtitle { color: #E07B39; font-size: 18px; margin-bottom: 32px; }
          .stat { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; font-size: 16px; }
          .stat-num { font-weight: bold; color: #E07B39; font-size: 20px; }
          .footer { margin-top: 40px; font-size: 12px; color: #888; text-align: center; }
          .logo { font-size: 22px; font-weight: bold; color: #1E2A3A; margin-bottom: 24px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="logo">Seecoteen</div>
        <h1>${profile.name}</h1>
        <div class="subtitle">Volunteer Impact Summary</div>
        <div class="stat"><span>Teaching hours logged</span><span class="stat-num">${teachingHours} hours</span></div>
        <div class="stat"><span>Sessions completed</span><span class="stat-num">${completedSessions}</span></div>
        <div class="stat"><span>Skills taught</span><span class="stat-num">${unlockedSkills.length}</span></div>
        <div class="stat"><span>Seniors helped</span><span class="stat-num">${partner ? 1 : 0}</span></div>
        <div class="stat"><span>Wisdom entries received</span><span class="stat-num">${wisdomEntries.length}</span></div>
        <div class="footer">
          Generated by Seecoteen &bull; A program of GenLink, 501(c)(3) &bull; Austin, TX<br/>
          ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </body>
      </html>
    `)
    win.document.close()
    win.focus()
    setTimeout(() => win.print(), 500)
  }

  if (loading) return <Loader size="lg" message="Loading your progress..." fullPage />

  return (
    <div className="space-y-8 animate-fadeIn">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      {/* Impact card */}
      <Card
        ref={impactCardRef}
        className="bg-gradient-to-br from-primary to-blue-900 text-white"
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
          <div>
            <p className="font-body text-white/60 text-sm mb-1">Your Impact This Month</p>
            <h2 className="font-heading text-2xl text-white mb-4">{profile.name}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Hours taught', value: teachingHours },
                { label: 'Sessions done', value: completedSessions },
                { label: 'Skills taught', value: unlockedSkills.length },
                { label: 'Seniors helped', value: partner ? 1 : 0 },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-heading font-bold text-3xl text-accent">{stat.value}</p>
                  <p className="font-body text-white/60 text-xs">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={handleDownloadImpact}
            ariaLabel="Download your impact summary for college applications"
            className="text-white hover:bg-white/10 border border-white/30 flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download summary
          </Button>
        </div>
        <p className="text-white/40 text-xs mt-4">
          Suitable for college applications and volunteer records
        </p>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card>
          <h2 className="font-heading text-xl text-primary mb-4">Teaching Hours</h2>
          <p className="font-heading font-bold text-6xl text-accent mb-2" aria-label={`${teachingHours} total teaching hours`}>
            {teachingHours}
          </p>
          <p className="font-body text-primary/60">hours of technology mentoring</p>
        </Card>
        <Card>
          <h2 className="font-heading text-xl text-primary mb-4">Skills Taught</h2>
          <p className="font-heading font-bold text-6xl text-accent-secondary mb-2" aria-label={`${unlockedSkills.length} skills taught`}>
            {unlockedSkills.length}
          </p>
          <p className="font-body text-primary/60">technology skills delivered</p>
        </Card>
      </div>

      {/* Knowledge collected */}
      <Card>
        <h2 className="font-heading text-2xl text-primary mb-5">Knowledge Collected</h2>
        <p className="font-body text-primary/60 mb-5">
          Every piece of wisdom {partner?.name || 'your senior'} has shared with you.
        </p>
        {wisdomEntries.length === 0 ? (
          <p className="font-body text-primary/40 italic">
            Wisdom entries will appear here after your first session.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {wisdomEntries.map((wisdom, i) => (
              <blockquote
                key={i}
                className="bg-green-50 border-l-4 border-accent-secondary rounded-r-lg p-4"
              >
                <p className="font-body text-primary/80 italic leading-relaxed">
                  &ldquo;{wisdom}&rdquo;
                </p>
                <footer className="mt-2">
                  <cite className="font-body text-accent-secondary text-sm not-italic">
                    — {partner?.name || 'Your senior'}
                  </cite>
                </footer>
              </blockquote>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

function Progress() {
  const { userProfile } = useAuth()
  const { partner } = useMatch()
  const role = userProfile?.role

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" message="Loading your progress..." />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="mb-8">
        <h1 className="font-heading text-3xl sm:text-4xl text-primary mb-2">Your Progress</h1>
        <p className="font-body text-primary/60">
          {role === ROLES.SENIOR
            ? 'Everything you\'ve accomplished on your learning journey.'
            : 'Your volunteer record and the wisdom you\'ve collected.'}
        </p>
      </div>

      {role === ROLES.SENIOR ? (
        <SeniorProgress profile={userProfile} partner={partner} />
      ) : (
        <TeenProgress profile={userProfile} partner={partner} />
      )}
    </div>
  )
}

export default Progress
