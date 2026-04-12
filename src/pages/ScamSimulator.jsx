import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import { generateScamScenario } from '../services/gemini.js'
import { saveScamScore, getCurrentShieldScore, getNextDifficulty } from '../services/scam.js'
import { SCAM_TYPES } from '../utils/constants.js'
import ScamScenario from '../components/scam/ScamScenario.jsx'
import ScamFeedback from '../components/scam/ScamFeedback.jsx'
import ScamScoreCard from '../components/scam/ScamScoreCard.jsx'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Loader from '../components/ui/Loader.jsx'
import Badge from '../components/ui/Badge.jsx'
import Toast from '../components/ui/Toast.jsx'

const PHASE = {
  SELECT: 'select',
  SCENARIO: 'scenario',
  ANSWERED: 'answered',
}

function ScamSimulator() {
  const { userProfile } = useAuth()
  const [shieldScore, setShieldScore] = useState(0)
  const [difficulty, setDifficulty] = useState(1)
  const [selectedType, setSelectedType] = useState('')
  const [scenario, setScenario] = useState(null)
  const [currentType, setCurrentType] = useState('')
  const [phase, setPhase] = useState(PHASE.SELECT)
  const [userAnswered, setUserAnswered] = useState(null) // true = said "something's wrong" (correct), false = said "looks real"
  const [generating, setGenerating] = useState(false)
  const [toast, setToast] = useState({ message: '', type: 'success' })

  useEffect(() => {
    if (!userProfile?.uid) return
    loadScoreData()
  }, [userProfile?.uid])

  const loadScoreData = async () => {
    try {
      const [score, nextDiff] = await Promise.all([
        getCurrentShieldScore(userProfile.uid),
        getNextDifficulty(userProfile.uid, difficulty),
      ])
      setShieldScore(score)
      setDifficulty(nextDiff)
    } catch {
      // defaults remain
    }
  }

  const startScenario = async (type) => {
    const actualType = type || SCAM_TYPES[Math.floor(Math.random() * SCAM_TYPES.length)].value
    setCurrentType(actualType)
    setGenerating(true)
    setPhase(PHASE.SCENARIO)
    setScenario(null)
    try {
      const gen = await generateScamScenario(actualType, difficulty)
      setScenario(gen)
    } catch {
      setToast({ message: 'Unable to generate a scenario right now. Please try again.', type: 'error' })
      setPhase(PHASE.SELECT)
    } finally {
      setGenerating(false)
    }
  }

  const handleAnswer = async (userSaidScam) => {
    setUserAnswered(userSaidScam)
    setPhase(PHASE.ANSWERED)
    const correct = userSaidScam // all scenarios are scams
    const score = correct ? Math.min(100, shieldScore + 5) : Math.max(0, shieldScore - 3)

    try {
      await saveScamScore(userProfile.uid, {
        scenarioType: currentType,
        difficulty,
        correct,
        score,
      })
      await loadScoreData()
    } catch {
      // Score save failure is non-fatal
    }
  }

  const handleTryAnother = () => {
    setScenario(null)
    setUserAnswered(null)
    setPhase(PHASE.SELECT)
  }

  const difficultyLabel = ['', 'Beginner', 'Easy', 'Moderate', 'Advanced', 'Expert'][difficulty]

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-10">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl text-primary mb-2">
            Scam Shield Training
          </h1>
          <p className="font-body text-primary/60">
            Practice recognizing scams so you can protect yourself in real life.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="amber">Difficulty: {difficultyLabel}</Badge>
            {difficulty > 1 && (
              <Badge variant="green">Difficulty auto-increased from correct answers</Badge>
            )}
          </div>
        </div>
        <div className="flex-shrink-0">
          <ScamScoreCard score={shieldScore} size="lg" />
        </div>
      </div>

      {/* SELECT phase */}
      {phase === PHASE.SELECT && (
        <div className="animate-fadeIn space-y-8">
          <Card>
            <h2 className="font-heading text-2xl text-primary mb-2">How does this work?</h2>
            <p className="font-body text-primary/70 leading-relaxed mb-4">
              You&apos;ll be shown a realistic scam as it would appear in real life — an email, a text message, a phone call, or an investment offer. Read it carefully, then decide: does something feel wrong?
            </p>
            <ol className="space-y-2 list-none">
              {[
                'Read the scenario carefully',
                'Decide if it looks real or suspicious',
                'See what the red flags were',
                'Your shield score improves with each correct answer',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-accent text-white rounded-full text-xs font-bold flex items-center justify-center mt-0.5" aria-hidden="true">
                    {i + 1}
                  </span>
                  <p className="font-body text-primary/80">{step}</p>
                </li>
              ))}
            </ol>
          </Card>

          <div>
            <h2 className="font-heading text-2xl text-primary mb-4">Choose a scenario type</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {SCAM_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  aria-pressed={selectedType === type.value}
                  className={`p-4 rounded-card border-2 text-left min-h-[48px] transition-all duration-200 ${
                    selectedType === type.value
                      ? 'border-accent bg-orange-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  aria-label={`Select ${type.label}`}
                >
                  <p className="font-body font-semibold text-primary">{type.label}</p>
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={() => startScenario(selectedType)}
                disabled={!selectedType}
                ariaLabel={selectedType ? `Start ${SCAM_TYPES.find(t => t.value === selectedType)?.label} scenario` : 'Select a scenario type first'}
                className="flex-1"
              >
                Start scenario
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => startScenario('')}
                ariaLabel="Surprise me with a random scenario type"
                className="flex-1"
              >
                Surprise me
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* SCENARIO phase */}
      {phase === PHASE.SCENARIO && (
        <div className="animate-fadeIn space-y-6">
          {generating ? (
            <Card>
              <Loader size="lg" message="Generating your scenario..." fullPage />
            </Card>
          ) : scenario ? (
            <>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="amber">
                  {SCAM_TYPES.find((t) => t.value === currentType)?.label || 'Scam scenario'}
                </Badge>
                <Badge variant="gray">Difficulty {difficulty}</Badge>
              </div>

              <ScamScenario scenario={scenario} scenarioType={currentType} />

              <Card className="bg-orange-50 border border-orange-100">
                <h2 className="font-heading text-xl text-primary mb-3">
                  What do you think?
                </h2>
                <p className="font-body text-primary/70 mb-5">
                  Read the scenario above carefully. Does something seem off, or does it look genuine?
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    variant="danger"
                    size="lg"
                    onClick={() => handleAnswer(false)}
                    ariaLabel="This looks real — I would respond to it"
                    fullWidth
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    This looks real
                  </Button>
                  <Button
                    variant="success"
                    size="lg"
                    onClick={() => handleAnswer(true)}
                    ariaLabel="Something is wrong here — this looks suspicious"
                    fullWidth
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Something is wrong here
                  </Button>
                </div>
              </Card>
            </>
          ) : null}
        </div>
      )}

      {/* ANSWERED phase */}
      {phase === PHASE.ANSWERED && scenario && (
        <ScamFeedback
          scenario={scenario}
          userAnsweredScam={userAnswered}
          onTryAnother={handleTryAnother}
        />
      )}
    </div>
  )
}

export default ScamSimulator
