import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './components/layout/ProtectedRoute.jsx'
import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'
import Landing from './pages/Landing.jsx'
import Auth from './pages/Auth.jsx'
import Onboarding from './pages/Onboarding.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Curriculum from './pages/Curriculum.jsx'
import ScamSimulator from './pages/ScamSimulator.jsx'
import ExchangeLog from './pages/ExchangeLog.jsx'
import Progress from './pages/Progress.jsx'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-background">
          <Navbar />
          <main id="main-content" className="flex-1" tabIndex="-1">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/onboarding"
                element={
                  <ProtectedRoute requireOnboarding={false}>
                    <Onboarding />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/curriculum"
                element={
                  <ProtectedRoute>
                    <Curriculum />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/scam-simulator"
                element={
                  <ProtectedRoute>
                    <ScamSimulator />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/exchange-log"
                element={
                  <ProtectedRoute>
                    <ExchangeLog />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/progress"
                element={
                  <ProtectedRoute>
                    <Progress />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
