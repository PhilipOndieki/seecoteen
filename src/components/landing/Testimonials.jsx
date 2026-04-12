import React from 'react'
import Card from '../ui/Card.jsx'
import { getInitials } from '../../utils/helpers.js'

const testimonials = [
  {
    name: 'Margaret T.',
    age: '72',
    role: 'senior',
    background: 'Retired nurse',
    quote:
      'I was terrified of my new smartphone. My granddaughter set it up and I couldn\'t remember a thing. Then Ethan joined as my tutor, and everything changed. He was so patient — he never made me feel silly. Now I video call my daughter in Denver every Sunday. I never thought I\'d say this, but I actually look forward to using my phone.',
  },
  {
    name: 'Ethan K.',
    age: '16',
    role: 'teen',
    background: 'Aspiring engineer',
    quote:
      'I thought I was just helping someone learn to use their phone. But Margaret spent 30 minutes telling me about what nursing was like in the 1970s — no computers, no digital records, all memory and handwriting. It completely changed how I think about healthcare technology. I\'m putting this on my college applications, but honestly I\'d keep doing it even if I wasn\'t.',
  },
]

function Testimonials() {
  return (
    <section
      aria-labelledby="testimonials-heading"
      className="section-padding bg-orange-50/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            id="testimonials-heading"
            className="font-heading text-3xl sm:text-4xl text-primary mb-4"
          >
            Real connections. Real change.
          </h2>
          <p className="font-body text-primary/70 text-lg max-w-2xl mx-auto">
            When knowledge flows both ways, everyone grows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t) => (
            <Card key={t.name} className="relative">
              {/* Quote mark */}
              <div
                className="absolute top-6 right-6 font-heading text-7xl text-accent/15 leading-none select-none"
                aria-hidden="true"
              >
                &ldquo;
              </div>

              <div className="flex items-center gap-4 mb-6">
                {/* Avatar */}
                <div
                  className="w-14 h-14 rounded-full bg-accent flex items-center justify-center text-white font-heading font-bold text-xl flex-shrink-0"
                  aria-label={`${t.name} avatar`}
                >
                  {getInitials(t.name)}
                </div>
                <div>
                  <p className="font-body font-semibold text-primary text-lg">{t.name}</p>
                  <p className="font-body text-primary/60 text-sm">
                    Age {t.age} &bull; {t.background}
                  </p>
                  <span
                    className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      t.role === 'senior'
                        ? 'bg-orange-100 text-accent'
                        : 'bg-green-100 text-accent-secondary'
                    }`}
                  >
                    {t.role === 'senior' ? 'Senior Learner' : 'Teen Tutor'}
                  </span>
                </div>
              </div>

              <blockquote>
                <p className="font-body text-primary/80 leading-relaxed italic text-base">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </blockquote>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
