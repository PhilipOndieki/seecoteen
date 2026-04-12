import React from 'react'
import PropTypes from 'prop-types'

/**
 * Status/category badge component.
 */
function Badge({ children, variant = 'amber', className = '' }) {
  const variants = {
    amber: 'bg-orange-100 text-accent border border-orange-200',
    green: 'bg-green-100 text-accent-secondary border border-green-200',
    blue: 'bg-blue-100 text-blue-700 border border-blue-200',
    gray: 'bg-gray-100 text-gray-600 border border-gray-200',
    red: 'bg-red-100 text-error border border-red-200',
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['amber', 'green', 'blue', 'gray', 'red']),
  className: PropTypes.string,
}

export default Badge
