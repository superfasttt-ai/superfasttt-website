'use client'

import React from 'react'
import { CMSLink } from '@/components/Link'
import { FoundationVisual } from './FoundationVisual'

import type { HeroModernBlock as HeroModernBlockProps } from '@/payload-types'

const trustIcons: Record<string, React.FC<{ className?: string }>> = {
  shield: ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  ),
  globe: ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  lock: ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  ),
  check: ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
    </svg>
  ),
  star: ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </svg>
  ),
  zap: ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  ),
}

export const HeroModernBlock: React.FC<HeroModernBlockProps> = ({
  badge,
  title,
  highlightedText,
  description,
  links,
  trustIndicators,
  showGridPattern = true,
  showGradientOrbs = true,
  showFoundationVisual = false,
}) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Grid pattern Vercel style */}
      {showGridPattern && (
        <div
          className="absolute inset-0 dark:opacity-100 opacity-50"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />
      )}
      {showGridPattern && (
        <div
          className="absolute inset-0 hidden dark:block"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />
      )}

      {/* Gradient orbs - Vercel/Supabase style */}
      {showGradientOrbs && (
        <>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-blue-500/10 dark:from-emerald-500/20 dark:via-cyan-500/20 dark:to-blue-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-gradient-to-r from-purple-500/5 to-pink-500/5 dark:from-purple-500/10 dark:to-pink-500/10 rounded-full blur-[100px]" />
        </>
      )}

      {/* Radial fade overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/50" />

      {/* Foundation Visual - socle rectangulaire */}
      {showFoundationVisual && (
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <FoundationVisual className="w-full opacity-80" />
        </div>
      )}

      <div className="container relative z-10 px-4 md:px-6 py-24">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          {/* Badge */}
          {badge && (
            <div className="inline-flex items-center rounded-full border border-border bg-card backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-muted-foreground">
              <span className="mr-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {badge}
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground">
            {title}
            {highlightedText && (
              <>
                <br />
                <span className="bg-gradient-to-r from-emerald-600 via-cyan-500 to-blue-500 dark:from-emerald-400 dark:via-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
                  {highlightedText}
                </span>
              </>
            )}
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            {description}
          </p>

          {/* CTA Buttons - Vercel style */}
          {Array.isArray(links) && links.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {links.map(({ link }, i) => (
                <CMSLink
                  key={i}
                  {...link}
                  className={
                    link.appearance === 'default'
                      ? 'inline-flex items-center justify-center h-12 px-6 rounded-lg bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors'
                      : 'inline-flex items-center justify-center h-12 px-6 rounded-lg border border-border bg-card text-foreground font-medium hover:bg-card/80 transition-colors'
                  }
                />
              ))}
            </div>
          )}

          {/* Trust indicators */}
          {trustIndicators &&
            (trustIndicators.headline ||
              (trustIndicators.indicators && trustIndicators.indicators.length > 0)) && (
              <div className="pt-16 flex flex-col items-center gap-4">
                {trustIndicators.headline && (
                  <p className="text-sm text-muted-foreground">{trustIndicators.headline}</p>
                )}
                {trustIndicators.indicators && trustIndicators.indicators.length > 0 && (
                  <div className="flex items-center gap-8 text-muted-foreground">
                    {trustIndicators.indicators.map((indicator, index) => {
                      const IconComponent = indicator.icon ? trustIcons[indicator.icon] : null
                      return (
                        <span key={index} className="flex items-center gap-2 text-sm">
                          {IconComponent && <IconComponent className="w-4 h-4" />}
                          {indicator.label}
                        </span>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
        </div>
      </div>
    </section>
  )
}
