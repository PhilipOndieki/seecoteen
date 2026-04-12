import React from 'react'
import Card from '../ui/Card.jsx'

const steps = [
  {
    number: '01',
    icon: (
      <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    seniorTitle: 'Tell us about yourself',
    seniorDesc: 'Share your professional background, what you\'d like to learn, and what knowledge you\'re excited to pass on. It takes about 3 minutes.',
    teenTitle: 'Share your interests and skills',
    teenDesc: 'Tell us what subjects you love, why you want to volunteer, and what career paths interest you. We\'ll use this to find your perfect match.',
  },
  {
    number: '02',
    icon: (
      <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    seniorTitle: 'Get matched with your tutor',
    seniorDesc: 'Our AI considers your background and your tutor\'s interests to create a meaningful connection — not just a random pairing.',
    teenTitle: 'Meet your senior partner',
    teenDesc: 'You\'ll be paired with a senior whose professional life connects with your interests. A retired engineer paired with a teen who loves building things — that\'s GenBridge.',
  },
  {
    number: '03',
    icon: (
      <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m8.66-9h-1M4.34 12h-1m15.07-6.07l-.71.71M6.34 17.66l-.71.71m12.02 0l-.71-.71M6.34 6.34l-.71-.71" />
        <circle cx="12" cy="12" r="3" strokeWidth={1.5} />
      </svg>
    ),
    seniorTitle: 'Learn at your own pace',
    seniorDesc: 'Each session is guided, simple, and designed so you never feel rushed. Your tutor follows a structured plan — so you\'ll always know what to expect.',
    teenTitle: 'Teach, earn hours, grow together',
    teenDesc: 'Follow structured session guides, log your hours, collect wisdom from your senior, and build a portfolio of impact for college applications.',
  },
]

function HowItWorks() {
  return (
    <section
      aria-labelledby="how-it-works-heading"
      className="section-padding bg-background"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            id="how-it-works-heading"
            className="font-heading text-3xl sm:text-4xl text-primary mb-4"
          >
            How GenBridge works
          </h2>
          <p className="font-body text-primary/70 text-lg max-w-2xl mx-auto">
            Three simple steps. Two people. One powerful exchange.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step) => (
            <Card key={step.number} className="relative overflow-hidden">
              {/* Step number watermark */}
              <div
                className="absolute top-4 right-4 font-heading font-bold text-5xl text-accent/10 select-none"
                aria-hidden="true"
              >
                {step.number}
              </div>

              <div className="mb-4">{step.icon}</div>

              {/* Senior perspective */}
              <div className="mb-5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-accent rounded-full text-sm font-medium mb-3">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  For seniors
                </div>
                <h3 className="font-heading text-xl text-primary mb-2">{step.seniorTitle}</h3>
                <p className="font-body text-primary/70 leading-relaxed">{step.seniorDesc}</p>
              </div>

              <div className="border-t border-gray-100 pt-5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-accent-secondary rounded-full text-sm font-medium mb-3">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  For teen tutors
                </div>
                <h3 className="font-heading text-xl text-primary mb-2">{step.teenTitle}</h3>
                <p className="font-body text-primary/70 leading-relaxed">{step.teenDesc}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
