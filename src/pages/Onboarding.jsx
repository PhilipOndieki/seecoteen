import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { updateUserProfile, completeOnboarding, getUsersByRole } from '../services/users.js'
import { generateMatch } from '../services/gemini.js'
import { setUserMatch } from '../services/users.js'
import {
  ROLES,
  ROUTES,
  SENIOR_AGE_RANGES,
  SENIOR_BACKGROUNDS,
  SENIOR_LEARNING_GOALS,
  TEEN_INTEREST_AREAS,
  TEEN_AGE_OPTIONS,
} from '../utils/constants.js'
import Button from '../components/ui/Button.jsx'
import Input from '../components/ui/Input.jsx'
import Card from '../components/ui/Card.jsx'
import ProgressBar from '../components/ui/ProgressBar.jsx'
import Loader from '../components/ui/Loader.jsx'

function ChipSelect({ options, selected, onToggle, multi = true, label }) {
  return (
    <fieldset>
      <legend className="sr-only">{label}</legend>
      <div className="flex flex-wrap gap-3" role="group" aria-label={label}>
        {options.map((opt) => {
          const value = typeof opt === 'string' ? opt : opt.value
          const display = typeof opt === 'string' ? opt : opt.label
          const isSelected = multi ? selected.includes(value) : selected === value
          return (
            <button
              key={value}
              type="button"
              onClick={() => onToggle(value)}
              aria-pressed={isSelected}
              aria-label={display}
              className={`px-5 py-3 rounded-full border-2 font-body font-medium transition-all duration-200 min-h-[48px] text-base ${
                isSelected
                  ? 'border-accent bg-accent text-white'
                  : 'border-gray-200 bg-white text-primary hover:border-gray-300'
              }`}
            >
              {display}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

function Onboarding() {
  const { currentUser, userProfile, refreshUserProfile } = useAuth()
  const navigate = useNavigate()
  const role = userProfile?.role || ROLES.SENIOR

  const totalSteps = 4
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Senior fields
  const [name, setName] = useState(userProfile?.name || '')
  const [ageRange, setAgeRange] = useState('')
  const [background, setBackground] = useState('')
  const [learningGoals, setLearningGoals] = useState([])

  // Teen fields
  const [teenAge, setTeenAge] = useState('')
  const [interests, setInterests] = useState([])
  const [joinReason, setJoinReason] = useState('')

  const toggleMulti = (value, setter, current) => {
    setter(current.includes(value) ? current.filter((v) => v !== value) : [...current, value])
  }

  const handleNext = () => {
    setError('')
    if (step === 1 && !name.trim()) {
      setError('Please enter your name to continue.')
      return
    }
    if (step === 2) {
      if (role === ROLES.SENIOR && !ageRange) {
        setError('Please select your age range.')
        return
      }
      if (role === ROLES.TEEN && !teenAge) {
        setError('Please select your age.')
        return
      }
    }
    if (step === 3) {
      if (role === ROLES.SENIOR && !background) {
        setError('Please tell us a bit about your background.')
        return
      }
      if (role === ROLES.TEEN && interests.length === 0) {
        setError('Please select at least one interest area.')
        return
      }
    }
    setStep((s) => s + 1)
  }

  const handleBack = () => {
    setError('')
    setStep((s) => Math.max(1, s - 1))
  }

  const handleComplete = async () => {
    setError('')
    setSaving(true)
    try {
      const profileData = {
        name: name.trim(),
        onboardingComplete: true,
        ...(role === ROLES.SENIOR
          ? { ageRange, background, interests: learningGoals }
          : { ageRange: teenAge, interests, joinReason }),
      }
      await updateUserProfile(currentUser.uid, profileData)

      // Attempt to find a match via Gemini
      try {
        const oppositeRole = role === ROLES.SENIOR ? ROLES.TEEN : ROLES.SENIOR
        const candidates = await getUsersByRole(oppositeRole)
        const unmatched = candidates.filter((c) => !c.matchedPartnerId)
        if (unmatched.length > 0) {
          const partner = unmatched[0]
          const myProfile = { name: name.trim(), background, interests: learningGoals }
          const partnerProfile = { name: partner.name, interests: partner.interests, joinReason: partner.joinReason }

          const seniorProf = role === ROLES.SENIOR ? myProfile : partnerProfile
          const teenProf = role === ROLES.TEEN ? myProfile : partnerProfile

          const matchReason = await generateMatch(seniorProf, teenProf)

          await setUserMatch(currentUser.uid, partner.uid, matchReason)
          await setUserMatch(partner.uid, currentUser.uid, matchReason)
        }
      } catch {
        // Match failure is non-fatal; user can still proceed
      }

      await refreshUserProfile()
      navigate(ROUTES.DASHBOARD, { replace: true })
    } catch {
      setError('Something went wrong saving your profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const stepTitles = {
    senior: ['Your name', 'Your age range', 'Your background', 'What to learn'],
    teen: ['Your name', 'Your age', 'Your interests', 'Why you\'re here'],
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl text-primary mb-2">
            {role === ROLES.SENIOR ? 'Welcome to Seecoteen' : 'Set up your profile'}
          </h1>
          <p className="font-body text-primary/60">
            Step {step} of {totalSteps} — {stepTitles[role]?.[step - 1]}
          </p>
        </div>

        {/* Progress */}
        <ProgressBar
          value={step}
          max={totalSteps}
          label={`Step ${step} of ${totalSteps}`}
          className="mb-8"
        />

        <Card>
          {error && (
            <div role="alert" className="bg-red-50 border border-red-200 rounded-lg p-4 mb-5">
              <p className="font-body text-error text-sm">{error}</p>
            </div>
          )}

          {/* ===== STEP 1: Name ===== */}
          {step === 1 && (
            <div className="animate-fadeIn">
              <h2 className="font-heading text-2xl text-primary mb-6">
                {role === ROLES.SENIOR ? 'What\'s your name?' : 'What\'s your name?'}
              </h2>
              <Input
                id="name"
                label="Your first name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder={role === ROLES.SENIOR ? 'e.g. Margaret' : 'e.g. Ethan'}
                autoComplete="given-name"
                hint={role === ROLES.SENIOR ? 'This is how your tutor will address you.' : 'This is how your senior will know you.'}
              />
            </div>
          )}

          {/* ===== STEP 2: Age ===== */}
          {step === 2 && role === ROLES.SENIOR && (
            <div className="animate-fadeIn">
              <h2 className="font-heading text-2xl text-primary mb-6">
                What age range are you in?
              </h2>
              <ChipSelect
                options={SENIOR_AGE_RANGES}
                selected={ageRange}
                onToggle={setAgeRange}
                multi={false}
                label="Select your age range"
              />
            </div>
          )}
          {step === 2 && role === ROLES.TEEN && (
            <div className="animate-fadeIn">
              <h2 className="font-heading text-2xl text-primary mb-6">
                How old are you?
              </h2>
              <ChipSelect
                options={TEEN_AGE_OPTIONS.map((a) => ({ value: String(a), label: `${a} years old` }))}
                selected={teenAge}
                onToggle={setTeenAge}
                multi={false}
                label="Select your age"
              />
            </div>
          )}

          {/* ===== STEP 3: Background / Interests ===== */}
          {step === 3 && role === ROLES.SENIOR && (
            <div className="animate-fadeIn">
              <h2 className="font-heading text-2xl text-primary mb-2">
                What did you do before retiring?
              </h2>
              <p className="font-body text-primary/60 mb-5">
                Your tutor will use this to connect with you. There are no wrong answers.
              </p>
              <Input
                id="background"
                label="Your career or background"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                placeholder="e.g. Retired nurse, Farmer, Teacher..."
                hint="Type your own or choose from below"
              />
              <div className="mt-4">
                <ChipSelect
                  options={SENIOR_BACKGROUNDS}
                  selected={background}
                  onToggle={setBackground}
                  multi={false}
                  label="Common backgrounds"
                />
              </div>
            </div>
          )}
          {step === 3 && role === ROLES.TEEN && (
            <div className="animate-fadeIn">
              <h2 className="font-heading text-2xl text-primary mb-2">
                What subjects or careers interest you?
              </h2>
              <p className="font-body text-primary/60 mb-5">
                Select all that apply. We&apos;ll use this to find you a great match.
              </p>
              <ChipSelect
                options={TEEN_INTEREST_AREAS}
                selected={interests}
                onToggle={(v) => toggleMulti(v, setInterests, interests)}
                multi
                label="Select your interests"
              />
            </div>
          )}

          {/* ===== STEP 4: Goals / Why join ===== */}
          {step === 4 && role === ROLES.SENIOR && (
            <div className="animate-fadeIn">
              <h2 className="font-heading text-2xl text-primary mb-2">
                What do you most want to learn?
              </h2>
              <p className="font-body text-primary/60 mb-5">
                Select everything that interests you. You&apos;ll work through these with your tutor.
              </p>
              <ChipSelect
                options={SENIOR_LEARNING_GOALS}
                selected={learningGoals}
                onToggle={(v) => toggleMulti(v, setLearningGoals, learningGoals)}
                multi
                label="Learning goals"
              />
            </div>
          )}
          {step === 4 && role === ROLES.TEEN && (
            <div className="animate-fadeIn">
              <h2 className="font-heading text-2xl text-primary mb-2">
                Why do you want to join Seecoteen?
              </h2>
              <p className="font-body text-primary/60 mb-5">
                Optional — but your senior would love to know.
              </p>
              <div className="flex flex-col gap-2">
                <label htmlFor="joinReason" className="input-label">
                  In your own words (optional)
                </label>
                <textarea
                  id="joinReason"
                  value={joinReason}
                  onChange={(e) => setJoinReason(e.target.value.slice(0, 200))}
                  placeholder="e.g. I want to help seniors feel more confident with technology, and I'm excited to learn from their life experiences..."
                  rows={4}
                  maxLength={200}
                  className="input-field resize-none"
                  aria-label="Why do you want to join Seecoteen"
                />
                <p className="text-xs text-gray-400 text-right">{joinReason.length}/200</p>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <Button
                variant="secondary"
                onClick={handleBack}
                ariaLabel="Go to previous step"
              >
                Back
              </Button>
            )}
            {step < totalSteps ? (
              <Button
                variant="primary"
                onClick={handleNext}
                ariaLabel={`Go to step ${step + 1}`}
                fullWidth={step === 1}
                className="flex-1"
              >
                Continue
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleComplete}
                loading={saving}
                ariaLabel="Complete setup and go to your dashboard"
                className="flex-1"
              >
                {saving ? 'Setting up your account...' : 'Complete setup'}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Onboarding
