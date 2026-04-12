import React from 'react'
import PropTypes from 'prop-types'
import Card from '../ui/Card.jsx'
import { formatDate } from '../../utils/helpers.js'

/**
 * A single timeline entry in the Exchange Log.
 */
function ExchangeEntry({ entry, sessionNumber }) {
  return (
    <article
      aria-labelledby={`entry-${entry.id}-heading`}
      className="relative pl-8 animate-slideIn"
    >
      {/* Timeline line */}
      <div
        className="absolute left-3 top-8 bottom-0 w-px bg-gray-200"
        aria-hidden="true"
      />
      {/* Timeline dot */}
      <div
        className="absolute left-0 top-6 w-6 h-6 bg-accent rounded-full border-2 border-white shadow-sm flex items-center justify-center"
        aria-hidden="true"
      >
        <div className="w-2 h-2 bg-white rounded-full" />
      </div>

      <Card className="mb-1">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h3
            id={`entry-${entry.id}-heading`}
            className="font-heading text-lg text-primary"
          >
            Session {sessionNumber}
          </h3>
          <time
            dateTime={entry.timestamp?.toDate?.()?.toISOString()}
            className="font-body text-sm text-primary/50"
          >
            {formatDate(entry.timestamp)}
          </time>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Teen entry */}
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-4 h-4 text-accent flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="font-body font-semibold text-accent text-sm">Tech taught</span>
            </div>
            <p className="font-body text-primary/80 text-base leading-relaxed">
              {entry.teenEntry || (
                <em className="text-primary/40">No entry recorded</em>
              )}
            </p>
          </div>

          {/* Senior entry */}
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-4 h-4 text-accent-secondary flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="font-body font-semibold text-accent-secondary text-sm">Wisdom shared</span>
            </div>
            <p className="font-body text-primary/80 text-base leading-relaxed">
              {entry.seniorEntry || (
                <em className="text-primary/40">No entry recorded</em>
              )}
            </p>
          </div>
        </div>
      </Card>
    </article>
  )
}

ExchangeEntry.propTypes = {
  entry: PropTypes.shape({
    id: PropTypes.string.isRequired,
    teenEntry: PropTypes.string,
    seniorEntry: PropTypes.string,
    timestamp: PropTypes.object,
  }).isRequired,
  sessionNumber: PropTypes.number.isRequired,
}

export default ExchangeEntry
