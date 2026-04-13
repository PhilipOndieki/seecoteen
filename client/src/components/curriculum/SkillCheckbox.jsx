import React from 'react'
import PropTypes from 'prop-types'

/**
 * Single skill checkbox that a senior can check off as they learn.
 */
function SkillCheckbox({ skill, checked, onChange, disabled = false, index }) {
  const id = `skill-${index}`

  return (
    <label
      htmlFor={id}
      className={`flex items-start gap-4 p-4 rounded-lg cursor-pointer transition-all duration-200 min-h-[48px] ${
        checked ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-transparent hover:border-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        aria-label={`Skill: ${skill}`}
        className="mt-0.5 flex-shrink-0 accent-accent-secondary"
      />
      <span
        className={`font-body text-base leading-relaxed ${
          checked ? 'text-accent-secondary line-through opacity-70' : 'text-primary'
        }`}
      >
        {skill}
      </span>
      {checked && (
        <svg
          className="ml-auto flex-shrink-0 w-5 h-5 text-accent-secondary mt-0.5"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-label="Completed"
        >
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )}
    </label>
  )
}

SkillCheckbox.propTypes = {
  skill: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  index: PropTypes.number.isRequired,
}

export default SkillCheckbox
