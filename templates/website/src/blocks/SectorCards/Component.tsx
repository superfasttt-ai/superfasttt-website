'use client'

import React from 'react'

import type { SectorCardsBlock as SectorCardsBlockProps } from '@/payload-types'
import { cn } from '@/utilities/ui'
import { GlowCard } from '@/components/GlowCard'

const iconComponents: Record<string, React.FC<{ className?: string }>> = {
  building: ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    </svg>
  ),
  heart: ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  ),
  banknote: ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  ),
  scale: ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
      />
    </svg>
  ),
  shieldCheck: ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  ),
  briefcase: ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  ),
  factory: ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
      />
    </svg>
  ),
  landmark: ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
      />
    </svg>
  ),
}

type BackgroundStyle = 'white' | 'muted' | 'dark'

interface SectorCardsBlockComponentProps extends SectorCardsBlockProps {
  backgroundStyle?: BackgroundStyle
}

export const SectorCardsBlock: React.FC<SectorCardsBlockComponentProps> = ({
  badge,
  title,
  description,
  sectors,
  backgroundStyle = 'white',
}) => {
  const isDark = backgroundStyle === 'dark'

  const sectionBg = {
    white: 'bg-background',
    muted: 'bg-muted/50',
    dark: 'bg-primary',
  }

  return (
    <section className={cn('py-24', sectionBg[backgroundStyle])}>
      <div className="container px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          {badge && (
            <div
              className={cn(
                'inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium mb-4',
                isDark
                  ? 'border-white/20 bg-white/10 text-white/80'
                  : 'border-border bg-card text-muted-foreground',
              )}
            >
              {badge}
            </div>
          )}
          <h2
            className={cn(
              'text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4',
              isDark ? 'text-white' : 'text-foreground',
            )}
          >
            {title}
          </h2>
          {description && (
            <p className={cn('text-lg', isDark ? 'text-white/70' : 'text-muted-foreground')}>
              {description}
            </p>
          )}
        </div>

        {/* Sectors Grid */}
        <div
          className={cn(
            'grid gap-6',
            sectors?.length === 1 && 'md:grid-cols-1 max-w-xl mx-auto',
            sectors?.length === 2 && 'md:grid-cols-2 max-w-4xl mx-auto',
            sectors?.length && sectors.length >= 3 && 'md:grid-cols-2 lg:grid-cols-3',
          )}
        >
          {sectors?.map((sector, index) => {
            const IconComponent = iconComponents[sector.icon] || iconComponents.briefcase
            // Alterner les variantes pour plus de dynamisme
            const cardVariant = isDark ? 'dark' : index % 2 === 0 ? 'gradient' : 'default'
            return (
              <GlowCard key={index} className="p-8" variant={cardVariant}>
                <div className="relative">
                  {/* Icon avec gradient */}
                  <div
                    className={cn(
                      'mb-6 inline-flex items-center justify-center w-14 h-14 rounded-xl transition-transform duration-300 group-hover:scale-110',
                      isDark
                        ? 'bg-gradient-to-br from-accent/30 to-accent/10 text-accent border border-accent/30'
                        : 'bg-gradient-to-br from-accent/20 to-secondary/10 text-accent border border-accent/20',
                    )}
                  >
                    <IconComponent className="w-7 h-7" />
                  </div>

                  {/* Title */}
                  <h3
                    className={cn(
                      'text-xl font-semibold mb-3',
                      isDark ? 'text-white' : 'text-foreground',
                    )}
                  >
                    {sector.title}
                  </h3>

                  {/* Description */}
                  <p
                    className={cn(
                      'mb-6 leading-relaxed',
                      isDark ? 'text-white/70' : 'text-muted-foreground',
                    )}
                  >
                    {sector.description}
                  </p>

                  {/* Features list */}
                  {sector.features && sector.features.length > 0 && (
                    <ul className="space-y-3">
                      {sector.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className={cn(
                            'flex items-center gap-3 text-sm',
                            isDark ? 'text-white/70' : 'text-muted-foreground',
                          )}
                        >
                          <div
                            className={cn(
                              'flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center',
                              isDark ? 'bg-accent/20' : 'bg-accent/10',
                            )}
                          >
                            <svg
                              className="w-3 h-3 text-accent"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          {feature.text}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </GlowCard>
            )
          })}
        </div>
      </div>
    </section>
  )
}
