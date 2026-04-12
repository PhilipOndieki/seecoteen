import React from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import ExchangeEntry from './ExchangeEntry.jsx'
import Button from '../ui/Button.jsx'
import { ROUTES } from '../../utils/constants.js'

/**
 * Full timeline of exchange log entries.
 */
function ExchangeTimeline({ entries }) {
  const navigate = useNavigate()

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        {/* Illustration placeholder */}
        <div
          className="w-32 h-32 bg-orange-50 rounded-full flex items-center justify-center mb-6"
          aria-hidden="true"
        >
          <svg className="w-16 h-16 text-accent/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h2 className="font-heading text-2xl text-primary mb-3">
          Your story together starts here
        </h2>
        <p className="font-body text-primary/60 max-w-md mb-6">
          After your first session, both you and your partner will log what was taught and what wisdom was shared. Those entries will appear here.
        </p>
        <Button
          variant="primary"
          onClick={() => navigate(ROUTES.CURRICULUM)}
          ariaLabel="Schedule your first learning session"
        >
          Start your first session
        </Button>
      </div>
    )
  }

  return (
    <div className="relative space-y-2">
      {entries.map((entry, index) => (
        <ExchangeEntry
          key={entry.id}
          entry={entry}
          sessionNumber={entries.length - index}
        />
      ))}
    </div>
  )
}

ExchangeTimeline.propTypes = {
  entries: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
    })
  ).isRequired,
}

export default ExchangeTimeline
