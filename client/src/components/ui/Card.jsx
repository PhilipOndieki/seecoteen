import React from 'react'
import PropTypes from 'prop-types'

/**
 * Surface card component with consistent shadow and padding.
 */
function Card({ children, className = '', onClick, hoverable = false, padding = 'md' }) {
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  const base = `bg-surface rounded-card shadow-card ${paddings[padding]}`
  const hover = hoverable
    ? 'hover:shadow-card-hover transition-shadow duration-200 cursor-pointer'
    : ''

  return onClick ? (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick(e)}
      className={`${base} ${hover} ${className}`}
    >
      {children}
    </div>
  ) : (
    <div className={`${base} ${className}`}>{children}</div>
  )
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
  hoverable: PropTypes.bool,
  padding: PropTypes.oneOf(['sm', 'md', 'lg']),
}

export default Card
