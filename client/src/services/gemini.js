import { safeParseJSON } from '../utils/helpers.js'

/**
 * Make a raw request to the Gemini API.
 * @param {string} prompt
 * @returns {Promise<string>} The text response
 */
async function callGemini(prompt) {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Gemini proxy error ${response.status}: ${error}`)
  }

  const data = await response.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('No response received from AI.')
  return text.trim()
}

/**
 * Generate a warm match explanation between a senior and teen.
 * @param {Object} seniorProfile
 * @param {Object} teenProfile
 * @returns {Promise<string>} A single warm sentence explaining the match
 */
export async function generateMatch(seniorProfile, teenProfile) {
  const seniorSummary = `Name: ${seniorProfile.name}, Background: ${seniorProfile.background}, Learning goals: ${(seniorProfile.interests || []).join(', ')}`
  const teenSummary = `Name: ${teenProfile.name}, Interest areas: ${(teenProfile.interests || []).join(', ')}, Why they joined: ${teenProfile.joinReason || 'Not specified'}`

  const prompt = `You are a warm, human matchmaker for Seecoteen, a platform connecting senior citizens with teen tech tutors. Given this senior profile: ${seniorSummary} and this teen profile: ${teenSummary}, write a single warm sentence in plain English explaining why they are a great match. Focus on the connection between the senior's professional background and the teen's interests. Maximum 40 words. No jargon. Sound human and encouraging.`

  return callGemini(prompt)
}

/**
 * Generate a realistic scam scenario for the Scam Shield simulator.
 * @param {string} scenarioType - 'email'|'sms'|'phone'|'investment'|'romance'
 * @param {number} difficulty - 1 through 5
 * @returns {Promise<{scenarioText: string, redFlags: string[], explanation: string, isScam: boolean}>}
 */
export async function generateScamScenario(scenarioType, difficulty) {
  const prompt = `Generate a realistic scam scenario of type ${scenarioType} at difficulty level ${difficulty} out of 5 targeting a senior citizen. Difficulty 1 has obvious red flags. Difficulty 5 is highly sophisticated and nearly convincing. Return a JSON object with fields: scenarioText (the scam content as it would appear), redFlags (array of strings listing every red flag present), explanation (plain English explanation written kindly to a senior citizen of why this is a scam), isScam (always true). Return only valid JSON, no markdown, no preamble.`

  const text = await callGemini(prompt)

  // Strip any markdown code fences if present
  const cleaned = text.replace(/```json\n?/gi, '').replace(/```\n?/gi, '').trim()
  const parsed = safeParseJSON(cleaned)

  if (!parsed || !parsed.scenarioText) {
    throw new Error('The AI returned an unexpected response. Please try again.')
  }

  return {
    scenarioText: parsed.scenarioText,
    redFlags: Array.isArray(parsed.redFlags) ? parsed.redFlags : [],
    explanation: parsed.explanation || 'This is a scam. Always be cautious with unexpected messages.',
    isScam: true,
  }
}

/**
 * Generate a personalized encouragement message for a senior's progress.
 * @param {Object} progressData
 * @param {number} progressData.sessionsCompleted
 * @param {number} progressData.skillsUnlocked
 * @param {number} progressData.shieldScore
 * @param {string} progressData.name
 * @param {string} [progressData.currentTrack]
 * @returns {Promise<string>} Two sentences of genuine encouragement
 */
export async function generateEncouragement(progressData) {
  const summary = `Name: ${progressData.name}, Sessions completed: ${progressData.sessionsCompleted}, Skills unlocked: ${progressData.skillsUnlocked}, Scam shield score: ${progressData.shieldScore}%, Current learning track: ${progressData.currentTrack || 'just getting started'}`

  const prompt = `You are a warm, encouraging coach for a senior citizen learning technology. Given this progress data: ${summary}, write two sentences of specific, genuine encouragement. Mention something specific from their progress. Never be condescending. Sound like a kind friend, not a system.`

  return callGemini(prompt)
}
