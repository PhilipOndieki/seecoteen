import React from 'react'
import PropTypes from 'prop-types'

/**
 * Shield-shaped score display component for the Scam Simulator.
 */
function ScamScoreCard({ score = 0, size = 'lg' }) {
  const dimensions = {
    sm: { outer: 64, text: '12', label: '8' },
    md: { outer: 96, text: '18', label: '10' },
    lg: { outer: 120, text: '22', label: '12' },
  }
  const dim = dimensions[size]

  // Color based on score
  const shieldColor =
    score >= 80 ? '#6B9E78' : score >= 50 ? '#E07B39' : score >= 25 ? '#E67E22' : '#C0392B'

  return (
    <div
      className="flex flex-col items-center gap-2"
      role="img"
      aria-label={`Scam shield score: ${score} out of 100`}
    >
      <svg
        width={dim.outer}
        height={dim.outer}
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden="true"
      >
        {/* Shield background */}
        <path
          d="M50 5 L85 20 L85 55 C85 72.5 68.75 87.5 50 95 C31.25 87.5 15 72.5 15 55 L15 20 Z"
          fill="#E5E7EB"
        />
        {/* Shield fill based on score */}
        <clipPath id={`score-clip-${score}`}>
          <rect x="0" y={100 - score} width="100" height={score} />
        </clipPath>
        <path
          d="M50 5 L85 20 L85 55 C85 72.5 68.75 87.5 50 95 C31.25 87.5 15 72.5 15 55 L15 20 Z"
          fill={shieldColor}
          clipPath={`url(#score-clip-${score})`}
        />
        {/* Score text */}
        <text
          x="50"
          y="52"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize={dim.text}
          fontWeight="bold"
          fontFamily="Inter, sans-serif"
        >
          {score}%
        </text>
      </svg>
      <p className="font-body text-primary/60 text-sm text-center">
        {score === 0
          ? 'No attempts yet'
          : score >= 80
          ? 'Expert shield'
          : score >= 60
          ? 'Strong shield'
          : score >= 40
          ? 'Building up'
          : 'Keep practicing'}
      </p>
    </div>
  )
}

ScamScoreCard.propTypes = {
  score: PropTypes.number,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
}

export default ScamScoreCard
