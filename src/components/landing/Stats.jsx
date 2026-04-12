import React from 'react'

const stats = [
  {
    number: '22 Million',
    label: 'seniors lack home broadband access',
    detail: 'Left behind as essential services move online.',
    source: 'Pew Research Center, 2023',
  },
  {
    number: '$4.8 Billion',
    label: 'lost by seniors to scams in 2024',
    detail: 'Digital literacy is the most powerful protection.',
    source: 'FBI Internet Crime Complaint Center (IC3), 2024',
  },
  {
    number: '60%',
    label: 'of seniors feel smartphones are too complicated',
    detail: 'Not because they can\'t learn — because no one has taught them.',
    source: 'AARP Technology Survey, 2023',
  },
]

function Stats() {
  return (
    <section
      aria-labelledby="stats-heading"
      className="section-padding bg-primary"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            id="stats-heading"
            className="font-heading text-3xl sm:text-4xl text-white mb-4"
          >
            The digital divide is real
          </h2>
          <p className="font-body text-white/70 text-lg max-w-2xl mx-auto">
            These numbers represent millions of people who deserve a bridge — not a barrier.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat) => (
            <article
              key={stat.number}
              className="text-center p-8 bg-white/5 rounded-card border border-white/10"
            >
              <p
                className="font-heading font-bold text-5xl sm:text-6xl text-accent mb-3"
                aria-label={`${stat.number} — ${stat.label}`}
              >
                {stat.number}
              </p>
              <p className="font-body font-semibold text-white text-lg mb-2">
                {stat.label}
              </p>
              <p className="font-body text-white/60 text-base mb-4">{stat.detail}</p>
              <p className="font-body text-white/35 text-xs">Source: {stat.source}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Stats
