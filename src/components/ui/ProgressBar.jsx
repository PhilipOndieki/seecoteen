import React from 'react'
import PropTypes from 'prop-types'

/**
 * Accessible progress bar component.
 */
function ProgressBar({ value, max = 100, label = '', showPercent = true, color = 'amber', className = '' }) {
  const percent = Math.min(100, Math.max(0, Math.round((value / max) * 100)))

  const colors = {
    amber: 'bg-accent',
    green: 'bg-accent-secondary',
    blue: 'bg-blue-500',
  }

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-primary">{label}</span>}
          {showPercent && (
            <span className="text-sm font-medium text-accent">{percent}%</span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || `Progress: ${percent}%`}
        className="w-full h-3 bg-gray-100 rounded-full overflow-hidden"
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${colors[color]}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

ProgressBar.propTypes = {
  value: PropTypes.number.isRequired,
  max: PropTypes.number,
  label: PropTypes.string,
  showPercent: PropTypes.bool,
  color: PropTypes.oneOf(['amber', 'green', 'blue']),
  className: PropTypes.string,
}

export default ProgressBar
