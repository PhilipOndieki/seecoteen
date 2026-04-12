import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import {
  getExchangeEntriesForSenior,
  getExchangeEntriesForTeen,
  addExchangeEntry,
} from '../services/exchange.js'
import { getSessionsForUser } from '../services/sessions.js'
import { ROLES } from '../utils/constants.js'
import ExchangeTimeline from '../components/exchange/ExchangeTimeline.jsx'
import Modal from '../components/ui/Modal.jsx'
import Button from '../components/ui/Button.jsx'
import Loader from '../components/ui/Loader.jsx'
import Toast from '../components/ui/Toast.jsx'
import Card from '../components/ui/Card.jsx'

function ExchangeLog() {
  const { userProfile } = useAuth()
  const role = userProfile?.role

  const [entries, setEntries] = useState([])
  const [completedSessions, setCompletedSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [logModalOpen, setLogModalOpen] = useState(false)
  const [teenEntry, setTeenEntry] = useState('')
  const [seniorEntry, setSeniorEntry] = useState('')
  const [selectedSessionId, setSelectedSessionId] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState({ message: '', type: 'success' })

  useEffect(() => {
    if (!userProfile?.uid) return
    loadData()
  }, [userProfile?.uid])

  const loadData = async () => {
    setLoading(true)
    try {
      const [exchangeEntries, sessions] = await Promise.all([
        role === ROLES.SENIOR
          ? getExchangeEntriesForSenior(userProfile.uid)
          : getExchangeEntriesForTeen(userProfile.uid),
        getSessionsForUser(userProfile.uid, role),
      ])
      setEntries(exchangeEntries)
      setCompletedSessions(sessions.filter((s) => s.status === 'completed'))
    } catch {
      setToast({ message: 'Unable to load your exchange log right now.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleLogEntry = async () => {
    if (!teenEntry.trim() && !seniorEntry.trim()) return
    setSaving(true)
    try {
      await addExchangeEntry({
        sessionId: selectedSessionId || `manual-${Date.now()}`,
        seniorId: role === ROLES.SENIOR ? userProfile.uid : userProfile.matchedPartnerId || '',
        teenId: role === ROLES.TEEN ? userProfile.uid : userProfile.matchedPartnerId || '',
        teenEntry: teenEntry.trim(),
        seniorEntry: seniorEntry.trim(),
      })
      setToast({ message: 'Your exchange entry has been saved!', type: 'success' })
      setLogModalOpen(false)
      setTeenEntry('')
      setSeniorEntry('')
      await loadData()
    } catch {
      setToast({ message: 'Unable to save your entry. Please try again.', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-10">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl text-primary mb-2">Exchange Log</h1>
          <p className="font-body text-primary/60">
            A record of what was taught and what wisdom was shared, session by session.
          </p>
        </div>
        {completedSessions.length > 0 && (
          <Button
            variant="primary"
            onClick={() => setLogModalOpen(true)}
            ariaLabel="Log an exchange entry for a completed session"
            className="flex-shrink-0"
          >
            + Log entry
          </Button>
        )}
      </div>

      {loading ? (
        <Loader size="lg" message="Loading your exchange log..." fullPage />
      ) : (
        <ExchangeTimeline entries={entries} />
      )}

      {/* Log Entry Modal */}
      <Modal
        isOpen={logModalOpen}
        onClose={() => setLogModalOpen(false)}
        title="Log this session's exchange"
      >
        <div className="space-y-5">
          <p className="font-body text-primary/70">
            After each session, both of you log what was shared. This creates your shared story.
          </p>

          {completedSessions.length > 0 && (
            <div className="flex flex-col gap-2">
              <label htmlFor="sessionSelect" className="input-label">
                Which session is this for?
              </label>
              <select
                id="sessionSelect"
                value={selectedSessionId}
                onChange={(e) => setSelectedSessionId(e.target.value)}
                className="input-field"
                aria-label="Select the session for this exchange entry"
              >
                <option value="">Select a session</option>
                {completedSessions.slice(0, 5).map((s, i) => (
                  <option key={s.id} value={s.id}>
                    Session {i + 1} — {s.curriculumTrack?.replace(/-/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Teen entry */}
          <div className="flex flex-col gap-2">
            <label htmlFor="teenEntry" className="input-label flex items-center gap-2">
              <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Tech skill covered today
            </label>
            <textarea
              id="teenEntry"
              value={teenEntry}
              onChange={(e) => setTeenEntry(e.target.value.slice(0, 150))}
              placeholder="e.g. We learned how to save a contact and make a phone call"
              rows={3}
              maxLength={150}
              className="input-field resize-none"
              aria-label="Describe the tech skill you covered today"
            />
            <p className="text-xs text-gray-400 text-right">{teenEntry.length}/150</p>
          </div>

          {/* Senior entry */}
          <div className="flex flex-col gap-2">
            <label htmlFor="seniorEntry" className="input-label flex items-center gap-2">
              <svg className="w-4 h-4 text-accent-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Wisdom or knowledge shared today
            </label>
            <textarea
              id="seniorEntry"
              value={seniorEntry}
              onChange={(e) => setSeniorEntry(e.target.value.slice(0, 150))}
              placeholder="e.g. I told my tutor about how we managed crops without weather apps in the 1980s"
              rows={3}
              maxLength={150}
              className="input-field resize-none text-lg"
              aria-label="Describe the wisdom or knowledge you shared today"
            />
            <p className="text-xs text-gray-400 text-right">{seniorEntry.length}/150</p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setLogModalOpen(false)}
              ariaLabel="Cancel and close"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleLogEntry}
              loading={saving}
              disabled={!teenEntry.trim() && !seniorEntry.trim()}
              ariaLabel="Save this exchange entry"
              className="flex-1"
            >
              Save entry
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ExchangeLog
