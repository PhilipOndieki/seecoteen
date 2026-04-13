import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../ui/Button.jsx'
import { ROUTES } from '../../utils/constants.js'

function Hero() {
  const navigate = useNavigate()

  return (
    <section
      aria-label="Seecoteen hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=1600&auto=format&fit=crop&q=80"
          alt=""
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
        <div className="absolute inset-0 bg-primary/55" />
      </div>
      {/* Attribution */}
      <p className="absolute bottom-4 right-4 text-white/40 text-xs font-body z-10">
        Photo by{' '}
        <a
          href="https://unsplash.com/@johnschno"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white/70"
        >
          John Schnobrich
        </a>{' '}
        on Unsplash
      </p>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        <h1 className="font-heading font-bold text-white text-4xl sm:text-5xl lg:text-6xl mb-4 leading-tight">
          Where age is no barrier.
        </h1>
        <h2 className="font-body text-accent text-2xl sm:text-3xl mb-6 font-normal">
          Where wisdom meets the future.
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate(`${ROUTES.AUTH}?role=senior`)}
            ariaLabel="Join Seecoteen as a senior citizen"
            className="text-lg px-8 py-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            I&apos;m a Senior
          </Button>
          <button
            onClick={() => navigate(`${ROUTES.AUTH}?role=teen`)}
            aria-label="Join Seecoteen as a teen tutor"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-body font-medium text-white border-2 border-white rounded-btn hover:bg-white hover:text-primary transition-all duration-200 min-h-[48px] focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            I&apos;m a Teen Tutor
          </button>
        </div>
        </div>
    </section>
  )
}

export default Hero
