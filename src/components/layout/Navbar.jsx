import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'
import { signOutUser } from '../../services/auth.js'
import { ROUTES } from '../../utils/constants.js'
import Button from '../ui/Button.jsx'

function Navbar() {
  const { currentUser, userProfile } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      await signOutUser()
      navigate(ROUTES.HOME)
    } catch {
      // silent fail — user will remain signed in
    } finally {
      setSigningOut(false)
    }
  }

  const navLinks = currentUser
    ? [
        { to: ROUTES.DASHBOARD, label: 'Dashboard' },
        { to: ROUTES.CURRICULUM, label: 'Curriculum' },
        { to: ROUTES.SCAM_SIMULATOR, label: 'Scam Shield' },
        { to: ROUTES.EXCHANGE_LOG, label: 'Exchange Log' },
        { to: ROUTES.PROGRESS, label: 'Progress' },
      ]
    : []

  const activeLinkClass = 'text-accent font-medium border-b-2 border-accent pb-0.5'
  const inactiveLinkClass = 'text-primary hover:text-accent transition-colors duration-200'

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-sm shadow-sm border-b border-gray-100">
      <nav
        aria-label="Main navigation"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16"
      >
        {/* Logo */}
        <Link
          to={ROUTES.HOME}
          className="flex items-center gap-2 focus-visible:outline-accent rounded-sm"
          aria-label="Seecoteen home"
        >
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center" aria-hidden="true">
            <span className="font-heading font-bold text-white text-lg">G</span>
          </div>
          <span className="font-heading font-bold text-primary text-xl">Seecoteen</span>
        </Link>

        {/* Desktop nav links */}
        {currentUser && (
          <ul className="hidden md:flex items-center gap-6 list-none" role="list">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `font-body text-base ${isActive ? activeLinkClass : inactiveLinkClass}`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        )}

        {/* Auth actions */}
        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 font-body">
                {userProfile?.name || currentUser.email}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                loading={signingOut}
                ariaLabel="Sign out of Seecoteen"
              >
                Sign out
              </Button>
            </div>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`${ROUTES.AUTH}?role=senior`)}
                ariaLabel="Sign in as a senior citizen"
              >
                Sign in
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(`${ROUTES.AUTH}?role=senior`)}
                ariaLabel="Join Seecoteen"
              >
                Join free
              </Button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center"
        >
          {menuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-surface border-t border-gray-100 px-4 pb-4 animate-fadeIn"
        >
          {currentUser && (
            <ul className="flex flex-col gap-1 pt-3 list-none" role="list">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `block py-3 px-4 rounded-lg font-body text-base ${isActive ? 'bg-orange-50 text-accent font-medium' : 'text-primary hover:bg-gray-50'}`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
              <li className="pt-2 border-t border-gray-100 mt-2">
                <button
                  onClick={handleSignOut}
                  className="w-full text-left py-3 px-4 rounded-lg font-body text-base text-error hover:bg-red-50 transition-colors min-h-[48px]"
                  aria-label="Sign out of Seecoteen"
                >
                  Sign out
                </button>
              </li>
            </ul>
          )}
          {!currentUser && (
            <div className="flex flex-col gap-2 pt-3">
              <Button
                variant="primary"
                fullWidth
                onClick={() => { navigate(`${ROUTES.AUTH}?role=senior`); setMenuOpen(false) }}
                ariaLabel="Join Seecoteen"
              >
                Join free
              </Button>
              <Button
                variant="secondary"
                fullWidth
                onClick={() => { navigate(ROUTES.AUTH); setMenuOpen(false) }}
                ariaLabel="Sign in to Seecoteen"
              >
                Sign in
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  )
}

export default Navbar
