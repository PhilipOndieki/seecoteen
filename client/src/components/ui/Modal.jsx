import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

/**
 * Accessible modal dialog component with focus trap.
 */
function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const modalRef = useRef(null)
  const previousFocusRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement
      setTimeout(() => {
        modalRef.current?.focus()
      }, 50)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      previousFocusRef.current?.focus()
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-primary/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`relative w-full ${sizes[size]} bg-surface rounded-card shadow-modal animate-fadeIn max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <h2 id="modal-title" className="font-heading text-xl text-primary">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="ml-4 p-2 rounded-full hover:bg-gray-100 transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
}

export default Modal
