import React from 'react'
import PropTypes from 'prop-types'

/**
 * Accessible text input with visible label above the field.
 */
function Input({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  disabled = false,
  error = '',
  hint = '',
  maxLength,
  autoComplete,
  className = '',
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={id} className="input-label">
        {label}
        {required && (
          <span className="text-error ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
      {hint && <p className="text-sm text-gray-500 -mt-1">{hint}</p>}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        autoComplete={autoComplete}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={`input-field ${error ? 'border-error focus:border-error' : ''} ${disabled ? 'bg-gray-50 cursor-not-allowed text-gray-400' : ''}`}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm text-error flex items-center gap-1">
          <span aria-hidden="true">⚠</span> {error}
        </p>
      )}
      {maxLength && value !== undefined && (
        <p className="text-xs text-gray-400 text-right">
          {value.length}/{maxLength} characters
        </p>
      )}
    </div>
  )
}

Input.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  hint: PropTypes.string,
  maxLength: PropTypes.number,
  autoComplete: PropTypes.string,
  className: PropTypes.string,
}

export default Input
