import React from 'react'
import PropTypes from 'prop-types'
import Card from '../ui/Card.jsx'
import Badge from '../ui/Badge.jsx'
import Button from '../ui/Button.jsx'

/**
 * A compact senior profile card shown in the directory listing.
 * Email is never passed into this component.
 */
function SeniorProfileCard({ senior, onViewProfile }) {
  const initials = senior.name
    ? senior.name.split(' ').filter(Boolean).slice(0, 2).map((n) => n[0].toUpperCase()).join('')
    : '?'

  const learningGoalLabels = {
    smartphone: 'Smartphone Basics',
    'video-calling': 'Video Calling',
    'online-safety': 'Online Safety',
    'ai-tools': 'AI Tools',
    'gov-websites': 'Gov Websites',
  }

  return (
    <Card hoverable className="flex flex-col h-full">
      {/* Avatar + name */}
      <div className="flex items-start gap-4 mb-4">
        <div
          className="w-14 h-14 rounded-full bg-accent flex items-center justify-center text-white font-heading font-bold text-xl flex-shrink-0"
          aria-label={`${senior.name} avatar`}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading text-lg text-primary truncate">{senior.name || 'Anonymous'}</h3>
          {senior.ageRange && (
            <p className="font-body text-sm text-primary/60">Age {senior.ageRange}</p>
          )}
          {senior.background && (
            <p className="font-body text-sm text-primary/70 mt-0.5 truncate">{senior.background}</p>
          )}
        </div>
      </div>

      {/* Learning goals */}
      {senior.interests && senior.interests.length > 0 && (
        <div className="mb-4">
          <p className="font-body text-xs font-semibold text-primary/50 uppercase tracking-wider mb-2">
            Wants to learn
          </p>
          <div className="flex flex-wrap gap-1.5">
            {senior.interests.slice(0, 3).map((goal) => (
              <Badge key={goal} variant="amber">
                {learningGoalLabels[goal] || goal}
              </Badge>
            ))}
            {senior.interests.length > 3 && (
              <Badge variant="gray">+{senior.interests.length - 3} more</Badge>
            )}
          </div>
        </div>
      )}

      <div className="mt-auto pt-4 border-t border-gray-100">
        <Button
          variant="primary"
          size="sm"
          fullWidth
          onClick={() => onViewProfile(senior)}
          ariaLabel={`View ${senior.name}'s full profile`}
        >
          View Profile
        </Button>
      </div>
    </Card>
  )
}

SeniorProfileCard.propTypes = {
  senior: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    ageRange: PropTypes.string,
    background: PropTypes.string,
    interests: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onViewProfile: PropTypes.func.isRequired,
}

export default SeniorProfileCard