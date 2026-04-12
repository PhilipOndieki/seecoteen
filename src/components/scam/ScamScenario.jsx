import React from 'react'
import PropTypes from 'prop-types'
import Card from '../ui/Card.jsx'

/**
 * Renders a scam scenario as it would appear in real life
 * based on the scenario type.
 */
function ScamScenario({ scenario, scenarioType }) {
  if (!scenario) return null

  if (scenarioType === 'email') {
    return (
      <Card className="font-mono text-sm" aria-label="Email scam scenario">
        <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
          {/* Email header */}
          <div className="bg-white border-b border-gray-200 px-5 py-4 space-y-2">
            <div className="flex items-start gap-3">
              <span className="text-gray-500 w-16 flex-shrink-0 text-xs font-body pt-0.5">From:</span>
              <span className="font-body text-sm text-primary break-all">
                {extractField(scenario, 'From') || 'noreply@secure-bank-verify.com'}
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gray-500 w-16 flex-shrink-0 text-xs font-body pt-0.5">Subject:</span>
              <span className="font-body text-sm text-primary font-medium">
                {extractField(scenario, 'Subject') || 'URGENT: Your account needs verification'}
              </span>
            </div>
          </div>
          {/* Email body */}
          <div className="p-5 bg-white">
            <p className="font-body text-primary leading-relaxed whitespace-pre-wrap text-base">
              {extractBody(scenario)}
            </p>
          </div>
        </div>
      </Card>
    )
  }

  if (scenarioType === 'sms') {
    return (
      <Card aria-label="SMS scam scenario">
        <div className="max-w-sm mx-auto">
          <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 mb-2 inline-block max-w-full">
            <p className="font-body text-primary text-base leading-relaxed whitespace-pre-wrap">
              {scenario.scenarioText}
            </p>
          </div>
          <p className="text-xs text-gray-400 mt-1 font-body">Unknown number &bull; Just now</p>
        </div>
      </Card>
    )
  }

  if (scenarioType === 'phone') {
    const lines = scenario.scenarioText.split('\n').filter(Boolean)
    return (
      <Card aria-label="Phone call scam scenario — transcript">
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center" aria-hidden="true">
            <svg className="w-5 h-5 text-accent-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <div>
            <p className="font-body font-semibold text-primary text-sm">Incoming call from unknown number</p>
            <p className="font-body text-gray-400 text-xs">Call transcript</p>
          </div>
        </div>
        <div className="space-y-3">
          {lines.map((line, i) => {
            const isCaller = line.toLowerCase().startsWith('caller:') || line.toLowerCase().startsWith('scammer:')
            const text = line.replace(/^(caller:|scammer:|you:)/i, '').trim()
            return (
              <div key={i} className={`flex gap-2 ${isCaller ? '' : 'flex-row-reverse'}`}>
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[85%] font-body text-sm leading-relaxed ${
                    isCaller
                      ? 'bg-gray-100 text-primary rounded-tl-sm'
                      : 'bg-blue-100 text-primary rounded-tr-sm'
                  }`}
                >
                  {text || line}
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    )
  }

  if (scenarioType === 'investment') {
    return (
      <Card aria-label="Investment scam scenario — fake offer">
        <div className="border-2 border-accent rounded-lg overflow-hidden">
          <div className="bg-accent px-5 py-3">
            <p className="font-heading font-bold text-white text-lg">EXCLUSIVE INVESTMENT OPPORTUNITY</p>
            <p className="font-body text-white/80 text-sm">Limited time offer — act now</p>
          </div>
          <div className="p-5 bg-white">
            <p className="font-body text-primary leading-relaxed whitespace-pre-wrap text-base">
              {scenario.scenarioText}
            </p>
          </div>
        </div>
      </Card>
    )
  }

  if (scenarioType === 'romance') {
    const messages = scenario.scenarioText.split('\n').filter(Boolean)
    return (
      <Card aria-label="Romance scam scenario — fake messaging thread">
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center" aria-hidden="true">
            <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <div>
            <p className="font-body font-semibold text-primary text-sm">Message conversation</p>
            <p className="font-body text-gray-400 text-xs">Online dating / social media</p>
          </div>
        </div>
        <div className="space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? '' : 'flex-row-reverse'}`}>
              <div
                className={`px-4 py-2 rounded-2xl max-w-[85%] font-body text-sm leading-relaxed ${
                  i % 2 === 0
                    ? 'bg-gray-100 text-primary rounded-tl-sm'
                    : 'bg-blue-100 text-primary rounded-tr-sm'
                }`}
              >
                {msg}
              </div>
            </div>
          ))}
        </div>
      </Card>
    )
  }

  // Default fallback
  return (
    <Card aria-label="Scam scenario">
      <p className="font-body text-primary leading-relaxed whitespace-pre-wrap text-base">
        {scenario.scenarioText}
      </p>
    </Card>
  )
}

/**
 * Extract a header field value from the scenario text.
 */
function extractField(scenario, field) {
  const lines = (scenario.scenarioText || '').split('\n')
  const line = lines.find((l) => l.toLowerCase().startsWith(field.toLowerCase() + ':'))
  return line ? line.slice(field.length + 1).trim() : null
}

/**
 * Extract the body text (lines after the From/Subject headers).
 */
function extractBody(scenario) {
  const lines = (scenario.scenarioText || '').split('\n')
  const headerEnd = lines.findIndex(
    (l, i) => i > 0 && !l.toLowerCase().startsWith('from:') && !l.toLowerCase().startsWith('subject:')
  )
  return headerEnd >= 0 ? lines.slice(headerEnd).join('\n').trim() : scenario.scenarioText
}

ScamScenario.propTypes = {
  scenario: PropTypes.shape({
    scenarioText: PropTypes.string.isRequired,
    redFlags: PropTypes.arrayOf(PropTypes.string),
    explanation: PropTypes.string,
    isScam: PropTypes.bool,
  }),
  scenarioType: PropTypes.string.isRequired,
}

export default ScamScenario
