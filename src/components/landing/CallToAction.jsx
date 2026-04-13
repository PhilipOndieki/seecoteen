import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../ui/Button.jsx'
import { ROUTES } from '../../utils/constants.js'

function CallToAction() {
  const navigate = useNavigate()

  return (
    <section
      aria-labelledby="cta-heading"
      className="bg-accent section-padding"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2
          id="cta-heading"
          className="font-heading text-3xl sm:text-4xl text-white mb-4"
        >
          Ready to bridge the gap?
        </h2>
        <p className="font-body text-white/85 text-lg mb-10 leading-relaxed">
          Whether you want to learn technology or share what you know — there is someone waiting to meet you.
          Join Seecoteen today, completely free.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(`${ROUTES.AUTH}?role=senior`)}
            aria-label="Sign up as a senior citizen"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-body font-semibold text-accent bg-white rounded-btn hover:bg-gray-100 transition-all duration-200 min-h-[48px] focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Join as a Senior
          </button>
          <button
            onClick={() => navigate(`${ROUTES.AUTH}?role=teen`)}
            aria-label="Sign up as a teen tutor"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-body font-semibold text-white border-2 border-white rounded-btn hover:bg-white/10 transition-all duration-200 min-h-[48px] focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Join as a Teen Tutor
          </button>
        </div>
      </div>
    </section>
  )
}

export default CallToAction
