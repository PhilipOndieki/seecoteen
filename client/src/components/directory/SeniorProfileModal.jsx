import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import Badge from '../ui/Badge.jsx'

const learningGoalLabels = {
  smartphone: 'Smartphone Basics',
  'video-calling': 'Video Calling',
  'online-safety': 'Online Safety',
  'ai-tools': 'AI Tools',
  'gov-websites': 'Gov Websites',
}

/**
 * Full senior profile modal with a Match CTA.
 * Email is never rendered here.
 */
function SeniorProfileModal({ senior, isOpen, onClose, onMatch, matching }) {
  if (!senior) return null

  const initials = senior.name
    ? senior.name.split(' ').filter(Boolean).slice(0, 2).map((n) => n[0].toUpperCase()).join('')
    : '?'

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${senior.name || 'Senior'}'s Profile`}
      size="md"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-5">
          <div
            className="w-20 h-20 rounded-full bg-accent flex items-center justify-center text-white font-heading font-bold text-3xl flex-shrink-0"
            aria-label={`${senior.name} avatar`}
          >
            {initials}
          </div>
          <div>
            <h3 className="font-heading text-2xl text-primary">{senior.name || 'Anonymous'}</h3>
            {senior.ageRange && (
              <p className="font-body text-primary/60">Age range: {senior.ageRange}</p>
            )}
          </div>
        </div>

        {/* Background */}
        {senior.background && (
          <div className="bg-orange-50 rounded-lg p-4">
            <p className="font-body text-xs font-semibold text-accent uppercase tracking-wider mb-1">
              Background
            </p>
            <p className="font-body text-primary/80 text-base">{senior.background}</p>
          </div>
        )}

        {/* Learning goals */}
        {senior.interests && senior.interests.length > 0 && (
          <div>
            <p className="font-body text-xs font-semibold text-primary/50 uppercase tracking-wider mb-3">
              What they want to learn
            </p>
            <div className="flex flex-wrap gap-2">
              {senior.interests.map((goal) => (
                <Badge key={goal} variant="amber">
                  {learningGoalLabels[goal] || goal}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Privacy note */}
        <p className="font-body text-xs text-primary/40 italic">
          Contact details are not shared. You'll connect through the Seecoteen platform.
        </p>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="secondary"
            onClick={onClose}
            ariaLabel="Close profile"
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => onMatch(senior)}
            loading={matching}
            disabled={matching}
            ariaLabel={`Match with ${senior.name}`}
            className="flex-1"
          >
            Match with {senior.name?.split(' ')[0] || 'this Senior'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

SeniorProfileModal.propTypes = {
  senior: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    ageRange: PropTypes.string,
    background: PropTypes.string,
    interests: PropTypes.arrayOf(PropTypes.string),
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onMatch: PropTypes.func.isRequired,
  matching: PropTypes.bool.isRequired,
}

export default SeniorProfileModal