import React from 'react'
import PropTypes from 'prop-types'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'

/**
 * Confirmation modal before a teen unassigns from their senior.
 */
function UnassignModal({ isOpen, onClose, onConfirm, seniorName, unassigning }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Unassign from this Senior?"
      size="sm"
    >
      <div className="space-y-5">
        {/* Warning icon */}
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0"
            aria-hidden="true"
          >
            <svg
              className="w-6 h-6 text-error"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div>
            <p className="font-body text-primary font-semibold">
              Are you sure you want to unassign from{' '}
              <span className="text-accent">{seniorName}</span>?
            </p>
          </div>
        </div>

        {/* Consequences */}
        <ul className="space-y-2 list-none bg-gray-50 rounded-lg p-4">
          {[
            `${seniorName} will be moved back to the available seniors list`,
            'Your session history and exchange log will be preserved',
            'You can choose a new senior from the directory',
          ].map((point, i) => (
            <li key={i} className="flex items-start gap-3">
              <svg
                className="w-4 h-4 text-primary/40 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="font-body text-sm text-primary/70">{point}</p>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={unassigning}
            ariaLabel="Cancel and keep your current match"
            className="flex-1"
          >
            Keep my match
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            loading={unassigning}
            disabled={unassigning}
            ariaLabel={`Confirm unassign from ${seniorName}`}
            className="flex-1"
          >
            Yes, unassign
          </Button>
        </div>
      </div>
    </Modal>
  )
}

UnassignModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  seniorName: PropTypes.string.isRequired,
  unassigning: PropTypes.bool.isRequired,
}

export default UnassignModal