import React from 'react'
import { useAuth } from '../hooks/useAuth.js'
import { ROLES } from '../utils/constants.js'
import SeniorDashboard from '../components/dashboard/SeniorDashboard.jsx'
import TeenDashboard from '../components/dashboard/TeenDashboard.jsx'
import Loader from '../components/ui/Loader.jsx'

function Dashboard() {
  const { userProfile, loading } = useAuth()

  if (loading || !userProfile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" message="Loading your dashboard..." />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {userProfile.role === ROLES.SENIOR ? (
        <SeniorDashboard profile={userProfile} />
      ) : (
        <TeenDashboard profile={userProfile} />
      )}
    </div>
  )
}

export default Dashboard
