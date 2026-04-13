import React from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../utils/constants.js'

function Footer() {
  return (
    <footer className="bg-primary text-white mt-auto" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center" aria-hidden="true">
                <span className="font-heading font-bold text-white text-lg">G</span>
              </div>
              <span className="font-heading font-bold text-white text-xl">Seecoteen</span>
            </div>
            <p className="text-white/70 font-body text-sm leading-relaxed">
              Where age is no barrier. Where wisdom meets the future.
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer navigation">
            <h3 className="font-body font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Platform
            </h3>
            <ul className="flex flex-col gap-2 list-none">
              {[
                { to: ROUTES.HOME, label: 'Home' },
                { to: ROUTES.AUTH, label: 'Sign Up' },
                { to: ROUTES.CURRICULUM, label: 'Curriculum' },
                { to: ROUTES.SCAM_SIMULATOR, label: 'Scam Shield' },
                { to: ROUTES.PROGRESS, label: 'Progress' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-white/70 hover:text-accent transition-colors font-body text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mission */}
          <div>
            <h3 className="font-body font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Our Mission
            </h3>
            <p className="text-white/70 font-body text-sm leading-relaxed">
              To connect senior citizens with teenage tutors for structured technology literacy sessions while enabling a two-way exchange where seniors share their life and professional wisdom in return.
            </p>
            <p className="text-white/50 font-body text-xs mt-4">
              Together we reduce the digital divide, one session at a time.
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-white/40 font-body text-xs text-center sm:text-left">
            &copy; {new Date().getFullYear()} Seecoteen, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
