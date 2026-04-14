import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import {
  registerWithEmail,
  signInWithEmail,
  signInWithGoogle,
} from '../services/auth.js'
import { createUserProfile, getUserProfile } from '../services/users.js'
import { ROLES, ROUTES } from '../utils/constants.js'
import { friendlyAuthError } from '../utils/helpers.js'
import Button from '../components/ui/Button.jsx'
import Input from '../components/ui/Input.jsx'
import Card from '../components/ui/Card.jsx'

function PasswordStrength({ password }) {
  if (!password) return null

  const checks = [
    { label: 'At least 8 characters', pass: password.length >= 8 },
    { label: 'Contains a number', pass: /\d/.test(password) },
    { label: 'Contains a letter', pass: /[a-zA-Z]/.test(password) },
  ]

  return (
    <ul className="space-y-1 mt-2 list-none" aria-label="Password requirements">
      {checks.map((c) => (
        <li key={c.label} className={`flex items-center gap-2 text-sm font-body ${c.pass ? 'text-accent-secondary' : 'text-primary/50'}`}>
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            {c.pass ? (
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            ) : (
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            )}
          </svg>
          <span aria-live="polite">{c.label}{c.pass ? ' ✓' : ''}</span>
        </li>
      ))}
    </ul>
  )
}

function Auth() {
  const { currentUser, userProfile } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [mode, setMode] = useState('signup') // 'signup' | 'signin'
  const [role, setRole] = useState(searchParams.get('role') || ROLES.SENIOR)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')

  // Redirect if already authenticated
  useEffect(() => {
    if (currentUser && userProfile?.onboardingComplete) {
      navigate(ROUTES.DASHBOARD, { replace: true })
    } else if (currentUser && userProfile && !userProfile.onboardingComplete) {
      navigate(ROUTES.ONBOARDING, { replace: true })
    }
  }, [currentUser, userProfile, navigate])

  const handleEmailAuth = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'signup') {
        const cred = await registerWithEmail(email, password)
        await createUserProfile(cred.user.uid, {
          role,
          email,
          name: '',
          onboardingComplete: false,
        })
        navigate(ROUTES.ONBOARDING, { replace: true })
      } else {
        const cred = await signInWithEmail(email, password)
        const profile = await getUserProfile(cred.user.uid)
        if (profile?.onboardingComplete) {
          navigate(ROUTES.DASHBOARD, { replace: true })
        } else {
          navigate(ROUTES.ONBOARDING, { replace: true })
        }
      }
    } catch (err) {
      setError(friendlyAuthError(err.code))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setError('')
    setGoogleLoading(true)
    try {
      const cred = await signInWithGoogle()
      // Check if profile already exists
      const existing = await getUserProfile(cred.user.uid)
      if (!existing) {
        await createUserProfile(cred.user.uid, {
          role,
          email: cred.user.email,
          name: cred.user.displayName || '',
          onboardingComplete: false,
        })
        navigate(ROUTES.ONBOARDING, { replace: true })
      } else if (existing.onboardingComplete) {
        navigate(ROUTES.DASHBOARD, { replace: true })
      } else {
        navigate(ROUTES.ONBOARDING, { replace: true })
      }
    } catch (err) {
      setError(friendlyAuthError(err.code))
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center" aria-hidden="true">
              <span className="font-heading font-bold text-white text-xl">S</span>
            </div>
            <span className="font-heading font-bold text-primary text-2xl">Seecoteen</span>
          </div>
          <h1 className="font-heading text-3xl text-primary mt-2">
            {mode === 'signup' ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="font-body text-primary/60 mt-1">
            {mode === 'signup' ? 'Join free — no credit card needed.' : 'Sign in to continue.'}
          </p>
        </div>

        {/* Role selection (signup only) */}
        {mode === 'signup' && (
          <div className="mb-6">
            <p className="font-body font-medium text-primary mb-3 text-center">Who are you joining as?</p>
            <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Select your role">
              {[
                { value: ROLES.SENIOR, label: 'I\'m a Senior', sub: 'I want to learn technology', icon: '👴' },
                { value: ROLES.TEEN, label: 'I\'m a Teen Tutor', sub: 'I want to teach and grow', icon: '🎓' },
              ].map((r) => (
                <button
                  key={r.value}
                  role="radio"
                  aria-checked={role === r.value}
                  onClick={() => setRole(r.value)}
                  className={`p-4 rounded-card border-2 text-left transition-all duration-200 min-h-[48px] ${
                    role === r.value
                      ? 'border-accent bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                  aria-label={r.label}
                >
                  <span className="text-2xl mb-2 block" aria-hidden="true">{r.icon}</span>
                  <p className="font-body font-semibold text-primary text-sm">{r.label}</p>
                  <p className="font-body text-primary/60 text-xs mt-0.5">{r.sub}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        <Card>
          {/* Error */}
          {error && (
            <div
              role="alert"
              className="bg-red-50 border border-red-200 rounded-lg p-4 mb-5 flex items-start gap-3"
            >
              <svg className="w-5 h-5 text-error flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="font-body text-error text-sm">{error}</p>
            </div>
          )}

          {/* Google OAuth */}
          <Button
            variant="secondary"
            fullWidth
            onClick={handleGoogleAuth}
            loading={googleLoading}
            ariaLabel="Continue with Google"
            className="mb-4"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>

          <div className="flex items-center gap-3 my-5" aria-hidden="true">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="font-body text-gray-400 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Email/Password form */}
          <form onSubmit={handleEmailAuth} noValidate>
            <div className="space-y-4">
              <Input
                id="email"
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
              />
              <div>
                <Input
                  id="password"
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  placeholder={mode === 'signup' ? 'Create a strong password' : 'Your password'}
                />
                {mode === 'signup' && <PasswordStrength password={password} />}
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              ariaLabel={mode === 'signup' ? 'Create your Seecoteen account' : 'Sign in to Seecoteen'}
              className="mt-6"
            >
              {mode === 'signup' ? 'Create my account' : 'Sign in'}
            </Button>
          </form>

          {/* Toggle sign in / sign up */}
          <p className="font-body text-center text-primary/60 text-sm mt-5">
            {mode === 'signup' ? 'Already have an account?' : "Don't have an account yet?"}
            {' '}
            <button
              onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setError('') }}
              className="text-accent font-medium hover:underline min-h-[24px]"
              aria-label={mode === 'signup' ? 'Switch to sign in' : 'Switch to sign up'}
            >
              {mode === 'signup' ? 'Sign in' : 'Sign up for free'}
            </button>
          </p>
        </Card>
      </div>
    </div>
  )
}

export default Auth
