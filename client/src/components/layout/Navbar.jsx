import React, { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'
import { signOutUser } from '../../services/auth.js'
import { ROUTES } from '../../utils/constants.js'
import Button from '../ui/Button.jsx'

function Navbar() {
  const { currentUser, userProfile } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const isLanding = location.pathname === '/'

  // Transparent-to-white scroll transition on the landing page
  useEffect(() => {
    if (!isLanding) return
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    // Check immediately in case page loaded scrolled down
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [isLanding])

  // On non-landing pages: always solid white
  const transparent = isLanding && !scrolled && !menuOpen

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      await signOutUser()
      navigate(ROUTES.HOME)
    } catch {
      // silent fail
    } finally {
      setSigningOut(false)
    }
  }

  const navLinks = currentUser
    ? [
        { to: ROUTES.DASHBOARD, label: 'Dashboard' },
        ...(userProfile?.role === 'teen' && !userProfile?.matchedPartnerId
          ? [{ to: ROUTES.SENIOR_DIRECTORY, label: 'Find a Senior' }]
          : []),
        { to: ROUTES.CURRICULUM, label: 'Curriculum' },
        { to: ROUTES.SCAM_SIMULATOR, label: 'Scam Shield' },
        { to: ROUTES.EXCHANGE_LOG, label: 'Exchange Log' },
        { to: ROUTES.PROGRESS, label: 'Progress' },
        { to: ROUTES.CHAT, label: 'Messages' },
      ]
    : []

  // Dynamic styles based on scroll/page state
  const headerStyle = {
    position: 'sticky',
    top: 0,
    zIndex: 40,
    transition: 'background-color 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease',
    backgroundColor: transparent ? 'transparent' : 'rgba(255,255,255,0.97)',
    backdropFilter: transparent ? 'none' : 'blur(10px)',
    boxShadow: transparent ? 'none' : '0 1px 12px rgba(30,42,58,0.08)',
    borderBottom: transparent ? '1px solid transparent' : '1px solid rgba(30,42,58,0.06)',
  }

  const logoTextColor = transparent ? '#ffffff' : '#1E2A3A'
  const logoBgColor = transparent ? 'rgba(224,123,57,0.85)' : '#E07B39'

  const activeLinkStyle = {
    color: transparent ? '#E07B39' : '#E07B39',
    fontWeight: 500,
    borderBottom: '2px solid #E07B39',
    paddingBottom: '2px',
  }
  const inactiveLinkStyle = (isTransparent) => ({
    color: isTransparent ? 'rgba(255,255,255,0.88)' : '#1E2A3A',
    transition: 'color 0.2s',
  })

  return (
    <header style={headerStyle}>
      <nav
        aria-label="Main navigation"
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
        }}
      >
        {/* Logo */}
        <Link
          to={ROUTES.HOME}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
          }}
          aria-label="Seecoteen home"
        >
          <div
            aria-hidden="true"
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: logoBgColor,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.35s ease',
            }}
          >
            <span
              style={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 700,
                color: '#fff',
                fontSize: '1.15rem',
                lineHeight: 1,
              }}
            >
              S
            </span>
          </div>
          <span
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontWeight: 700,
              fontSize: '1.25rem',
              color: logoTextColor,
              transition: 'color 0.35s ease',
            }}
          >
            Seecoteen
          </span>
        </Link>

        {/* Desktop nav links */}
        {currentUser && (
          <ul
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '24px',
              listStyle: 'none',
              margin: 0,
              padding: 0,
            }}
            className="desktop-nav"
            role="list"
          >
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  style={({ isActive }) =>
                    isActive
                      ? { ...activeLinkStyle, fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', textDecoration: 'none' }
                      : { ...inactiveLinkStyle(transparent), fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', textDecoration: 'none' }
                  }
                  onMouseEnter={e => { if (!e.currentTarget.classList.contains('active')) e.currentTarget.style.color = '#E07B39' }}
                  onMouseLeave={e => { e.currentTarget.style.color = transparent ? 'rgba(255,255,255,0.88)' : '#1E2A3A' }}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        )}

        {/* Auth actions — desktop */}
        <div
          style={{ display: 'none', alignItems: 'center', gap: '12px' }}
          className="desktop-auth"
        >
          {currentUser ? (
            <>
              <span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem',
                  color: transparent ? 'rgba(255,255,255,0.65)' : '#6B7280',
                  transition: 'color 0.35s ease',
                }}
              >
                {userProfile?.name || currentUser.email}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                loading={signingOut}
                ariaLabel="Sign out of Seecoteen"
                style={{
                  color: transparent ? 'rgba(255,255,255,0.8)' : undefined,
                }}
              >
                Sign out
              </Button>
            </>
          ) : (
            <button
              onClick={() => navigate(ROUTES.AUTH)}
              aria-label="Join Seecoteen"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 20px',
                fontSize: '0.9rem',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                minHeight: '40px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                // On landing (transparent): outlined white button
                // On other pages: filled orange button
                color: transparent ? '#ffffff' : '#ffffff',
                backgroundColor: transparent ? 'rgba(255,255,255,0.12)' : '#E07B39',
                border: transparent ? '1.5px solid rgba(255,255,255,0.5)' : '1.5px solid #E07B39',
                backdropFilter: transparent ? 'blur(8px)' : 'none',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = transparent ? 'rgba(255,255,255,0.22)' : '#c96e2e'
                e.currentTarget.style.borderColor = transparent ? 'rgba(255,255,255,0.75)' : '#c96e2e'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = transparent ? 'rgba(255,255,255,0.12)' : '#E07B39'
                e.currentTarget.style.borderColor = transparent ? 'rgba(255,255,255,0.5)' : '#E07B39'
              }}
            >
              Join free
            </button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen(!menuOpen)}
          className="mobile-hamburger"
          style={{
            padding: '8px',
            borderRadius: '8px',
            cursor: 'pointer',
            backgroundColor: 'transparent',
            border: 'none',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '48px',
            minWidth: '48px',
            color: transparent ? '#ffffff' : '#1E2A3A',
            transition: 'color 0.35s ease',
          }}
        >
          {menuOpen ? (
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          style={{
            backgroundColor: 'rgba(255,255,255,0.98)',
            backdropFilter: 'blur(12px)',
            borderTop: '1px solid rgba(30,42,58,0.06)',
            padding: '8px 16px 16px',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          {currentUser && (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '2px' }} role="list">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    style={({ isActive }) => ({
                      display: 'block',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '1rem',
                      textDecoration: 'none',
                      fontWeight: isActive ? 500 : 400,
                      backgroundColor: isActive ? '#FFF5EE' : 'transparent',
                      color: isActive ? '#E07B39' : '#1E2A3A',
                      minHeight: '48px',
                    })}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
              <li style={{ paddingTop: '8px', borderTop: '1px solid rgba(30,42,58,0.06)', marginTop: '4px' }}>
                <button
                  onClick={handleSignOut}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '1rem',
                    color: '#C0392B',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    minHeight: '48px',
                  }}
                  aria-label="Sign out of Seecoteen"
                >
                  Sign out
                </button>
              </li>
            </ul>
          )}
          {!currentUser && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '8px' }}>
              <Button variant="primary" fullWidth onClick={() => { navigate(`${ROUTES.AUTH}?role=senior`); setMenuOpen(false) }} ariaLabel="Join Seecoteen">
                Join free
              </Button>
              <Button variant="secondary" fullWidth onClick={() => { navigate(ROUTES.AUTH); setMenuOpen(false) }} ariaLabel="Sign in to Seecoteen">
                Sign in
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Responsive styles injected once */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .desktop-auth { display: flex !important; }
          .mobile-hamburger { display: none !important; }
        }
        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
          .desktop-auth { display: none !important; }
          .mobile-hamburger { display: flex !important; }
        }
      `}</style>
    </header>
  )
}

export default Navbar