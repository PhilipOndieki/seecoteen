import React from 'react'
import PropTypes from 'prop-types'
import Card from '../ui/Card.jsx'
import Button from '../ui/Button.jsx'

/**
 * Displays post-answer feedback with red flag explanations.
 */
function ScamFeedback({ scenario, userAnsweredScam, onTryAnother }) {
  const correct = userAnsweredScam // scenarios are always scams
  const redFlags = scenario?.redFlags || []

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Result banner */}
      <Card
        className={`border-2 ${
          correct ? 'border-accent-secondary bg-green-50' : 'border-error bg-red-50'
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
              correct ? 'bg-accent-secondary' : 'bg-error'
            }`}
            aria-hidden="true"
          >
            {correct ? (
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <h2
              className={`font-heading text-2xl mb-2 ${
                correct ? 'text-accent-secondary' : 'text-error'
              }`}
            >
              {correct ? 'Well spotted! That was a scam.' : 'That was a scam — and a tricky one!'}
            </h2>
            <p className="font-body text-primary/80 leading-relaxed">
              {correct
                ? 'You correctly identified that something was wrong. Your instincts are getting sharper!'
                : "Don't worry — even security professionals miss sophisticated scams sometimes. Let's look at what gave it away."}
            </p>
          </div>
        </div>
      </Card>

      {/* Explanation */}
      <Card>
        <h3 className="font-heading text-xl text-primary mb-3">Here&apos;s what you need to know</h3>
        <p className="font-body text-primary/80 leading-relaxed">{scenario?.explanation}</p>
      </Card>

      {/* Red flags */}
      {redFlags.length > 0 && (
        <Card>
          <h3 className="font-heading text-xl text-primary mb-4">
            Red flags in this scenario
          </h3>
          <ul className="space-y-3 list-none">
            {redFlags.map((flag, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-0.5"
                  aria-hidden="true"
                >
                  <svg className="w-3.5 h-3.5 text-error" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </span>
                <p className="font-body text-primary/80 leading-relaxed flex-1">{flag}</p>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Golden rule reminder */}
      <Card className="bg-blue-50 border border-blue-100">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div>
            <p className="font-body font-semibold text-primary mb-1">Remember the golden rule</p>
            <p className="font-body text-primary/70 text-sm">
              If something feels urgent, unexpected, or asks for money or personal information — stop, hang up or close it, and call the real organization directly using a number you find yourself.
            </p>
          </div>
        </div>
      </Card>

      {/* Try another */}
      <div className="flex justify-center pt-2">
        <Button
          variant="primary"
          size="lg"
          onClick={onTryAnother}
          ariaLabel="Try another scam scenario"
        >
          Try another scenario
        </Button>
      </div>
    </div>
  )
}

ScamFeedback.propTypes = {
  scenario: PropTypes.shape({
    redFlags: PropTypes.arrayOf(PropTypes.string),
    explanation: PropTypes.string,
  }),
  userAnsweredScam: PropTypes.bool.isRequired,
  onTryAnother: PropTypes.func.isRequired,
}

export default ScamFeedback
