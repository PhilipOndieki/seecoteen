import React from 'react'
import PropTypes from 'prop-types'

/**
 * Loading spinner component for async operations.
 */
function Loader({ size = 'md', message = 'Loading...', fullPage = false }) {
  const sizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  }

  const spinner = (
    <div
      role="status"
      aria-label={message}
      className={`flex flex-col items-center gap-4 ${fullPage ? 'min-h-[400px] justify-center' : ''}`}
    >
      <div
        className={`${sizes[size]} border-accent/30 border-t-accent rounded-full animate-spin`}
        aria-hidden="true"
      />
      {message && (
        <p className="text-primary/60 font-body text-sm">{message}</p>
      )}
    </div>
  )

  if (fullPage) {
    return (
      <div className="flex items-center justify-center w-full py-20">
        {spinner}
      </div>
    )
  }

  return spinner
}

Loader.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  message: PropTypes.string,
  fullPage: PropTypes.bool,
}

export default Loader
