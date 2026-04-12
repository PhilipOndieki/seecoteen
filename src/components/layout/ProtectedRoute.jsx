import React from 'react'
import PropTypes from 'prop-types'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'
import { ROUTES } from '../../utils/constants.js'
import Loader from '../ui/Loader.jsx'

/**
 * Guards routes that require authentication.
 * Redirects to /auth if unauthenticated.
 * Redirects to /onboarding if profile is incomplete (unless requireOnboarding=false).
 */
function ProtectedRoute({ children, requireOnboarding = true }) {
  const { currentUser, userProfile, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" message="Loading your account..." />
      </div>
    )
  }

  if (!currentUser) {
    return <Navigate to={ROUTES.AUTH} state={{ from: location }} replace />
  }

  // If profile exists but onboarding is not complete, redirect to onboarding
  if (requireOnboarding && userProfile && !userProfile.onboardingComplete) {
    return <Navigate to={ROUTES.ONBOARDING} replace />
  }

  return children
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requireOnboarding: PropTypes.bool,
}

export default ProtectedRoute
