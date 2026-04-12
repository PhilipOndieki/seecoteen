import React from 'react'
import PropTypes from 'prop-types'
import Card from '../ui/Card.jsx'
import ProgressBar from '../ui/ProgressBar.jsx'
import Badge from '../ui/Badge.jsx'

const iconMap = {
  smartphone: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  video: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  shield: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  sparkles: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  building: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
    </svg>
  ),
}

const colorMap = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', badge: 'blue' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600', badge: 'blue' },
  green: { bg: 'bg-green-50', text: 'text-green-600', badge: 'green' },
  amber: { bg: 'bg-orange-50', text: 'text-accent', badge: 'amber' },
  teal: { bg: 'bg-teal-50', text: 'text-teal-600', badge: 'green' },
}

function TrackCard({ track, sessionsCompleted = 0, isActive = false, onClick }) {
  const colors = colorMap[track.color] || colorMap.amber
  const isComplete = sessionsCompleted >= 3

  return (
    <Card
      hoverable
      onClick={onClick}
      className={`relative transition-all duration-200 ${isActive ? 'ring-2 ring-accent' : ''}`}
    >
      {isActive && (
        <div className="absolute top-4 right-4">
          <Badge variant="amber">Current</Badge>
        </div>
      )}
      {isComplete && (
        <div className="absolute top-4 right-4">
          <Badge variant="green">Complete</Badge>
        </div>
      )}

      <div className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center mb-4 ${colors.text}`}>
        {iconMap[track.icon]}
      </div>

      <h3 className="font-heading text-xl text-primary mb-2">{track.title}</h3>
      <p className="font-body text-primary/60 text-sm mb-4 leading-relaxed">{track.description}</p>

      <ProgressBar
        value={sessionsCompleted}
        max={3}
        label={`${sessionsCompleted} of 3 sessions`}
        color={isComplete ? 'green' : 'amber'}
      />

      <p className="text-sm text-primary/50 mt-3 font-body">
        {isComplete
          ? 'All sessions completed!'
          : `${3 - sessionsCompleted} session${3 - sessionsCompleted === 1 ? '' : 's'} remaining`}
      </p>
    </Card>
  )
}

TrackCard.propTypes = {
  track: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  sessionsCompleted: PropTypes.number,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
}

export default TrackCard
