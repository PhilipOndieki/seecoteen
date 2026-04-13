import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { ROUTES } from '../utils/constants.js'
import Hero from '../components/landing/Hero.jsx'
import HowItWorks from '../components/landing/HowItWorks.jsx'
import Stats from '../components/landing/Stats.jsx'
import Testimonials from '../components/landing/Testimonials.jsx'
import CallToAction from '../components/landing/CallToAction.jsx'
import { useEffect } from 'react'

function Landing() {
  const { currentUser, userProfile } = useAuth()
  const navigate = useNavigate()

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (currentUser && userProfile?.onboardingComplete) {
      navigate(ROUTES.DASHBOARD, { replace: true })
    } else if (currentUser && userProfile && !userProfile.onboardingComplete) {
      navigate(ROUTES.ONBOARDING, { replace: true })
    }
  }, [currentUser, userProfile, navigate])

  return (
    <div>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-20 focus:left-4 bg-accent text-white px-4 py-2 rounded-lg z-50 font-body"
      >
        Skip to main content
      </a>
      <Hero />
      <HowItWorks />
      <Stats />
      <Testimonials />
      <CallToAction />
    </div>
  )
}

export default Landing
