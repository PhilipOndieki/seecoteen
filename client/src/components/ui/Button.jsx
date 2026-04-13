import React from 'react'
import PropTypes from 'prop-types'

/**
 * Reusable button component with primary, secondary, and ghost variants.
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  ariaLabel,
  fullWidth = false,
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-body font-medium rounded-btn min-h-[48px] min-w-[48px] transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-accent focus-visible:ring-offset-2'

  const variants = {
    primary:
      'bg-accent text-white hover:bg-orange-600 disabled:bg-disabled disabled:cursor-not-allowed disabled:text-white',
    secondary:
      'bg-white text-primary border-2 border-primary hover:bg-gray-50 disabled:bg-disabled disabled:cursor-not-allowed disabled:border-disabled disabled:text-gray-500',
    ghost:
      'bg-transparent text-accent hover:bg-orange-50 disabled:cursor-not-allowed disabled:text-disabled',
    danger:
      'bg-error text-white hover:bg-red-700 disabled:bg-disabled disabled:cursor-not-allowed',
    success:
      'bg-accent-secondary text-white hover:bg-green-700 disabled:bg-disabled disabled:cursor-not-allowed',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading && (
        <span
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost', 'danger', 'success']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
  fullWidth: PropTypes.bool,
}

export default Button
