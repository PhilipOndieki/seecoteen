import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Card from '../ui/Card.jsx'
import Button from '../ui/Button.jsx'
import SkillCheckbox from './SkillCheckbox.jsx'
import Badge from '../ui/Badge.jsx'

/**
 * Renders a single session plan for a curriculum track.
 * Senior view: simplified, large text, one skill at a time.
 * Teen view: full teaching guide layout.
 */
function SessionPlan({ session, trackTitle, role, onMarkComplete, isCompleted, saving }) {
  const [checkedSkills, setCheckedSkills] = useState(
    session.skills.reduce((acc, _, i) => ({ ...acc, [i]: isCompleted }), {})
  )
  const [showGuide, setShowGuide] = useState(false)

  const allChecked = session.skills.every((_, i) => checkedSkills[i])

  const handleSkillToggle = (index) => {
    setCheckedSkills((prev) => ({ ...prev, [index]: !prev[index] }))
  }

  return (
    <article aria-labelledby={`session-${session.number}-heading`} className="space-y-6">
      {/* Session header */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="amber">Session {session.number}</Badge>
              <Badge variant="gray">{session.duration}</Badge>
              {isCompleted && <Badge variant="green">Completed</Badge>}
            </div>
            <h2
              id={`session-${session.number}-heading`}
              className="font-heading text-2xl text-primary mb-2"
            >
              {session.title}
            </h2>
            <p className="font-body text-primary/70 leading-relaxed">{session.objective}</p>
          </div>
        </div>

        {/* Skills section */}
        <div className="mt-6">
          <h3 className="font-body font-semibold text-primary mb-3">
            {role === 'senior' ? 'What you\'ll learn today:' : 'Skills to cover with your senior:'}
          </h3>
          <div className="space-y-2">
            {session.skills.map((skill, i) => (
              <SkillCheckbox
                key={i}
                skill={skill}
                checked={!!checkedSkills[i]}
                onChange={() => !isCompleted && handleSkillToggle(i)}
                disabled={isCompleted}
                index={i}
              />
            ))}
          </div>
        </div>

        {/* Complete button */}
        {!isCompleted && (
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={() => onMarkComplete(session.skills)}
              disabled={!allChecked || saving}
              loading={saving}
              ariaLabel={`Mark session ${session.number} as complete`}
              fullWidth
            >
              {allChecked
                ? `Mark session ${session.number} complete`
                : `Check all skills first (${Object.values(checkedSkills).filter(Boolean).length}/${session.skills.length})`}
            </Button>
          </div>
        )}
      </Card>

      {/* Teen teaching guide */}
      {role === 'teen' && (
        <Card>
          <button
            onClick={() => setShowGuide(!showGuide)}
            aria-expanded={showGuide}
            className="w-full flex items-center justify-between text-left min-h-[48px] group"
            aria-label={showGuide ? 'Hide teaching guide' : 'Show teaching guide'}
          >
            <h3 className="font-heading text-xl text-primary group-hover:text-accent transition-colors">
              Teaching Guide
            </h3>
            <svg
              className={`w-5 h-5 text-accent transition-transform duration-200 ${showGuide ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showGuide && (
            <div className="mt-4 space-y-4 animate-fadeIn">
              <p className="font-body text-primary/60 text-sm italic">
                Follow these steps with your senior during the session.
              </p>
              <ol className="space-y-3 list-none">
                {session.teachingGuide.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span
                      className="flex-shrink-0 w-7 h-7 rounded-full bg-accent text-white text-sm font-bold flex items-center justify-center mt-0.5"
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                    <p className="font-body text-primary/80 leading-relaxed flex-1">{step}</p>
                  </li>
                ))}
              </ol>
              <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 mt-4">
                <p className="font-body text-accent font-medium text-sm">
                  Remember: your senior is the expert in their own life. Ask questions and listen as much as you teach.
                </p>
              </div>
            </div>
          )}
        </Card>
      )}
    </article>
  )
}

SessionPlan.propTypes = {
  session: PropTypes.shape({
    number: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    objective: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    skills: PropTypes.arrayOf(PropTypes.string).isRequired,
    teachingGuide: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  trackTitle: PropTypes.string.isRequired,
  role: PropTypes.oneOf(['senior', 'teen']).isRequired,
  onMarkComplete: PropTypes.func.isRequired,
  isCompleted: PropTypes.bool.isRequired,
  saving: PropTypes.bool.isRequired,
}

export default SessionPlan
