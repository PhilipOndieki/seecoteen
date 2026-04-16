import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../ui/Button.jsx'
import { ROUTES } from '../../utils/constants.js'
import { signInWithGoogle } from '../../services/auth.js'
import { createUserProfile, getUserProfile } from '../../services/users.js'

function Hero() {
  const navigate = useNavigate()
  const [loadingRole, setLoadingRole] = useState(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Stagger the entrance animation after mount
    const t = setTimeout(() => setMounted(true), 60)
    return () => clearTimeout(t)
  }, [])

  const handleGoogleSignIn = async (role) => {
    setLoadingRole(role)
    try {
      const cred = await signInWithGoogle()
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
      console.error('Google sign-in failed:', err)
    } finally {
      setLoadingRole(null)
    }
  }

  return (
    <section
      aria-label="Seecoteen hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* ── Background image ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=1600&auto=format&fit=crop&q=80"
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            // Shift focus to the quieter mid-section of the photo
            objectPosition: 'center 40%',
          }}
          loading="eager"
        />

        {/*
          Layered overlays:
          1. Radial gradient: darker in center-bottom where text lives
          2. Linear gradient: strong fade from top so navbar blends in
          3. Solid dark base to guarantee contrast
        */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(ellipse 80% 60% at 50% 65%, rgba(18,26,40,0.72) 0%, rgba(18,26,40,0.18) 100%),
              linear-gradient(to bottom,
                rgba(18,26,40,0.55) 0%,
                rgba(18,26,40,0.18) 28%,
                rgba(18,26,40,0.28) 60%,
                rgba(18,26,40,0.78) 100%
              )
            `,
          }}
        />
      </div>

      {/* ── Navbar ghost gradient — blends the sticky white navbar into the hero ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100px',
          background: 'linear-gradient(to bottom, rgba(18,26,40,0.45) 0%, transparent 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* ── Main content — true optical center ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // Optical center: slightly above math center
          paddingTop: '64px',
          paddingBottom: '64px',
          paddingLeft: '1rem',
          paddingRight: '1rem',
        }}
      >
        <div
          style={{
            maxWidth: '760px',
            width: '100%',
            textAlign: 'center',
            // Staggered entrance
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          {/* H1 — large, dominant */}
          <h1
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontWeight: 800,
              fontSize: 'clamp(2.6rem, 7vw, 5.2rem)',
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              margin: '0 0 20px 0',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.65s ease 0.08s, transform 0.65s ease 0.08s',
            }}
          >
            Where age is no barrier.
          </h1>

          {/* Subheading — clearly subordinate, more breathing room */}
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              fontSize: 'clamp(1.1rem, 2.6vw, 1.45rem)',
              color: '#E07B39',
              margin: '0 0 48px 0',
              letterSpacing: '0.01em',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(14px)',
              transition: 'opacity 0.65s ease 0.18s, transform 0.65s ease 0.18s',
            }}
          >
            Where wisdom meets the future.
          </p>

          {/* CTAs — generous gap from subheading */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '14px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity 0.65s ease 0.28s, transform 0.65s ease 0.28s',
            }}
          >
            {/* Senior CTA — filled */}
            <button
              onClick={() => handleGoogleSignIn('senior')}
              disabled={loadingRole !== null}
              aria-label="Join Seecoteen as a senior citizen using Google"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '15px 32px',
                fontSize: '1rem',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                color: '#ffffff',
                backgroundColor: '#E07B39',
                border: '2px solid #E07B39',
                borderRadius: '8px',
                cursor: loadingRole !== null ? 'not-allowed' : 'pointer',
                opacity: loadingRole !== null ? 0.7 : 1,
                minHeight: '52px',
                transition: 'background-color 0.2s, transform 0.15s, box-shadow 0.2s',
                boxShadow: '0 4px 20px rgba(224,123,57,0.35)',
              }}
              onMouseEnter={e => {
                if (loadingRole === null) {
                  e.currentTarget.style.backgroundColor = '#c96e2e'
                  e.currentTarget.style.borderColor = '#c96e2e'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 28px rgba(224,123,57,0.45)'
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#E07B39'
                e.currentTarget.style.borderColor = '#E07B39'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(224,123,57,0.35)'
              }}
            >
              {loadingRole === 'senior' ? (
                <span
                  style={{
                    width: '18px',
                    height: '18px',
                    border: '2px solid rgba(255,255,255,0.4)',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite',
                    display: 'inline-block',
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                />
              ) : (
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
              I&apos;m a Senior
            </button>

            {/* Teen CTA — outlined */}
            <button
              onClick={() => handleGoogleSignIn('teen')}
              disabled={loadingRole !== null}
              aria-label="Join Seecoteen as a teen tutor using Google"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '15px 32px',
                fontSize: '1rem',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                color: '#ffffff',
                backgroundColor: 'rgba(255,255,255,0.08)',
                border: '2px solid rgba(255,255,255,0.55)',
                borderRadius: '8px',
                cursor: loadingRole !== null ? 'not-allowed' : 'pointer',
                opacity: loadingRole !== null ? 0.7 : 1,
                minHeight: '52px',
                backdropFilter: 'blur(8px)',
                transition: 'background-color 0.2s, border-color 0.2s, transform 0.15s',
              }}
              onMouseEnter={e => {
                if (loadingRole === null) {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.16)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.85)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.55)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {loadingRole === 'teen' ? (
                <span
                  style={{
                    width: '18px',
                    height: '18px',
                    border: '2px solid rgba(255,255,255,0.4)',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite',
                    display: 'inline-block',
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                />
              ) : (
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              )}
              I&apos;m a Teen Tutor
            </button>
          </div>

        </div>
      </div>

      {/* ── Keyframe styles ── */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  )
}

export default Hero