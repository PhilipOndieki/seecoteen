import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import { getAllProgressForUser, completeTrackSession, initTrackProgress } from '../services/curriculum.js'
import { createSession, completeSession } from '../services/sessions.js'
import { CURRICULUM_TRACKS, ROLES } from '../utils/constants.js'
import TrackCard from '../components/curriculum/TrackCard.jsx'
import SessionPlan from '../components/curriculum/SessionPlan.jsx'
import Loader from '../components/ui/Loader.jsx'
import Toast from '../components/ui/Toast.jsx'
import Button from '../components/ui/Button.jsx'

function Curriculum() {
  const { userProfile } = useAuth()
  const role = userProfile?.role

  const [progressMap, setProgressMap] = useState({})
  const [selectedTrack, setSelectedTrack] = useState(null)
  const [selectedSession, setSelectedSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState({ message: '', type: 'success' })

  useEffect(() => {
    if (!userProfile?.uid) return
    loadProgress()
  }, [userProfile?.uid])

  const loadProgress = async () => {
    setLoading(true)
    try {
      const records = await getAllProgressForUser(userProfile.uid)
      const map = {}
      records.forEach((r) => { map[r.trackId] = r })
      setProgressMap(map)

      // Auto-select first incomplete track for seniors
      if (role === ROLES.SENIOR) {
        const firstIncomplete = CURRICULUM_TRACKS.find(
          (t) => !map[t.id] || (map[t.id]?.sessionsCompleted || 0) < 3
        )
        if (firstIncomplete) {
          handleSelectTrack(firstIncomplete, map)
        }
      }
    } catch {
      setToast({ message: 'Unable to load your progress. Please refresh.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleSelectTrack = (track, pMap = progressMap) => {
    setSelectedTrack(track)
    const progress = pMap[track.id]
    const nextSession = progress ? progress.sessionsCompleted : 0
    const sessionIndex = Math.min(nextSession, 2) // 0-indexed, max 2
    setSelectedSession(track.sessions[sessionIndex])
  }

  const handleMarkComplete = async (skills) => {
    if (!selectedTrack || !selectedSession) return
    setSaving(true)
    try {
      await initTrackProgress(userProfile.uid, selectedTrack.id)
      await completeTrackSession(
        userProfile.uid,
        selectedTrack.id,
        selectedSession.number,
        skills
      )

      // Create a session record
      const sessionId = await createSession({
        seniorId: role === ROLES.SENIOR ? userProfile.uid : userProfile.matchedPartnerId,
        teenId: role === ROLES.TEEN ? userProfile.uid : userProfile.matchedPartnerId,
        curriculumTrack: selectedTrack.id,
        sessionNumber: selectedSession.number,
      })
      await completeSession(sessionId)

      setToast({ message: `Session ${selectedSession.number} completed! Great work.`, type: 'success' })
      await loadProgress()
    } catch {
      setToast({ message: 'Unable to save your progress. Please try again.', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const currentProgress = selectedTrack ? progressMap[selectedTrack.id] : null
  const isSessionCompleted = (session) => {
    return (currentProgress?.sessionsCompleted || 0) >= session.number
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" message="Loading your curriculum..." />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      <div className="mb-8">
        <h1 className="font-heading text-3xl sm:text-4xl text-primary mb-2">
          {role === ROLES.SENIOR ? 'Your Learning Journey' : 'Teaching Curriculum'}
        </h1>
        <p className="font-body text-primary/60">
          {role === ROLES.SENIOR
            ? 'Take it one session at a time. There\'s no rush.'
            : 'Five tracks, three sessions each. Choose where to guide your senior.'}
        </p>
      </div>

      {/* For seniors: show current track sessions directly */}
      {role === ROLES.SENIOR && selectedTrack && selectedSession ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar: track selector */}
          <aside aria-label="Learning tracks" className="lg:col-span-1">
            <h2 className="font-heading text-xl text-primary mb-4">Your tracks</h2>
            <div className="space-y-3">
              {CURRICULUM_TRACKS.map((track) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  sessionsCompleted={progressMap[track.id]?.sessionsCompleted || 0}
                  isActive={selectedTrack?.id === track.id}
                  onClick={() => handleSelectTrack(track)}
                />
              ))}
            </div>
          </aside>

          {/* Main: current session */}
          <main className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setSelectedTrack(null); setSelectedSession(null) }}
                ariaLabel="View all tracks"
              >
                ← All tracks
              </Button>
              <h2 className="font-heading text-2xl text-primary">{selectedTrack.title}</h2>
            </div>

            {/* Session tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1" role="tablist" aria-label="Sessions">
              {selectedTrack.sessions.map((s) => (
                <button
                  key={s.number}
                  role="tab"
                  aria-selected={selectedSession?.number === s.number}
                  onClick={() => setSelectedSession(s)}
                  className={`px-4 py-2 rounded-lg font-body font-medium text-sm whitespace-nowrap min-h-[48px] transition-all duration-200 ${
                    selectedSession?.number === s.number
                      ? 'bg-accent text-white'
                      : isSessionCompleted(s)
                      ? 'bg-green-50 text-accent-secondary border border-green-200'
                      : 'bg-white text-primary border border-gray-200 hover:border-accent'
                  }`}
                  aria-label={`Session ${s.number}: ${s.title}`}
                >
                  {isSessionCompleted(s) ? '✓ ' : ''}Session {s.number}
                </button>
              ))}
            </div>

            <SessionPlan
              session={selectedSession}
              trackTitle={selectedTrack.title}
              role={role}
              onMarkComplete={handleMarkComplete}
              isCompleted={isSessionCompleted(selectedSession)}
              saving={saving}
            />
          </main>
        </div>
      ) : (
        /* Teen view OR senior before track selection: track grid */
        <div>
          {role === ROLES.SENIOR && (
            <p className="font-body text-primary/60 mb-6">
              Select a learning track to get started.
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {CURRICULUM_TRACKS.map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                sessionsCompleted={progressMap[track.id]?.sessionsCompleted || 0}
                isActive={false}
                onClick={() => handleSelectTrack(track)}
              />
            ))}
          </div>

          {selectedTrack && selectedSession && (
            <div className="mt-8">
              <div className="flex items-center gap-3 mb-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setSelectedTrack(null); setSelectedSession(null) }}
                  ariaLabel="View all tracks"
                >
                  ← All tracks
                </Button>
                <h2 className="font-heading text-2xl text-primary">{selectedTrack.title}</h2>
              </div>

              <div className="flex gap-2 mb-6 overflow-x-auto pb-1" role="tablist" aria-label="Sessions">
                {selectedTrack.sessions.map((s) => (
                  <button
                    key={s.number}
                    role="tab"
                    aria-selected={selectedSession?.number === s.number}
                    onClick={() => setSelectedSession(s)}
                    className={`px-4 py-2 rounded-lg font-body font-medium text-sm whitespace-nowrap min-h-[48px] transition-all duration-200 ${
                      selectedSession?.number === s.number
                        ? 'bg-accent text-white'
                        : isSessionCompleted(s)
                        ? 'bg-green-50 text-accent-secondary border border-green-200'
                        : 'bg-white text-primary border border-gray-200 hover:border-accent'
                    }`}
                    aria-label={`Session ${s.number}: ${s.title}`}
                  >
                    {isSessionCompleted(s) ? '✓ ' : ''}Session {s.number}
                  </button>
                ))}
              </div>

              <SessionPlan
                session={selectedSession}
                trackTitle={selectedTrack.title}
                role={role}
                onMarkComplete={handleMarkComplete}
                isCompleted={isSessionCompleted(selectedSession)}
                saving={saving}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Curriculum
