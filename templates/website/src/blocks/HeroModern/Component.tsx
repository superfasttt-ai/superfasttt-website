'use client'

import React from 'react'
import { CMSLink } from '@/components/Link'
import { FoundationVisual } from './FoundationVisual'
import { cn } from '@/utilities/ui'

import type { HeroModernBlock as HeroModernBlockProps, Media } from '@/payload-types'

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

type HeroVariant = 'light' | 'dark'

interface HeroModernBlockComponentProps extends HeroModernBlockProps {
  variant?: HeroVariant
}

export const HeroModernBlock: React.FC<HeroModernBlockComponentProps> = ({
  badge,
  title,
  highlightedText,
  description,
  links,
  trustIndicators,
  backgroundImage,
  backgroundImageOpacity = '20',
  showGridPattern = true,
  showGradientOrbs = true,
  showFoundationVisual = false,
  variant = 'light',
}) => {
  const bgImage = backgroundImage as Media | null
  const hasBackgroundImage = bgImage?.url
  // Force dark text style when background image is present
  const isDark = hasBackgroundImage || variant === 'dark'

  return (
    <section
      className={cn(
        'relative min-h-screen flex items-center justify-center overflow-hidden',
        hasBackgroundImage ? 'bg-primary' : isDark ? 'bg-primary' : 'bg-background',
      )}
    >
      {/* Background Image */}
      {hasBackgroundImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${bgImage.url})`,
              opacity: Number(backgroundImageOpacity) / 100,
            }}
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary/80" />
        </>
      )}

      {/* Grid pattern */}
      {showGridPattern && (
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: isDark
              ? `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`
              : `linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />
      )}

      {/* Gradient orbs - Vercel/Supabase style */}
      {showGradientOrbs && (
        <>
          <div
            className={cn(
              'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px]',
              isDark
                ? 'bg-gradient-to-r from-accent/30 via-secondary/20 to-accent/10'
                : 'bg-gradient-to-r from-accent/10 via-secondary/10 to-primary/10',
            )}
          />
          <div
            className={cn(
              'absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full blur-[100px]',
              isDark
                ? 'bg-gradient-to-r from-accent/20 to-secondary/10'
                : 'bg-gradient-to-r from-secondary/5 to-primary/5',
            )}
          />
        </>
      )}

      {/* Radial fade overlay */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-b from-transparent via-transparent',
          isDark ? 'to-primary/50' : 'to-background/50',
        )}
      />

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
            <div
              className={cn(
                'inline-flex items-center rounded-full border backdrop-blur-sm px-4 py-1.5 text-sm font-medium',
                isDark
                  ? 'border-white/20 bg-white/10 text-white/80'
                  : 'border-border bg-card text-muted-foreground',
              )}
            >
              <span className="mr-2 h-1.5 w-1.5 rounded-full bg-accent" />
              {badge}
            </div>
          )}

          {/* Title */}
          <h1
            className={cn(
              'text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight',
              isDark ? 'text-white' : 'text-foreground',
            )}
          >
            {title}
            {highlightedText && (
              <>
                <br />
                <span
                  className={cn(
                    'bg-clip-text text-transparent',
                    isDark
                      ? 'bg-gradient-to-r from-accent via-accent/80 to-white'
                      : 'bg-gradient-to-r from-accent via-secondary to-primary',
                  )}
                >
                  {highlightedText}
                </span>
              </>
            )}
          </h1>

          {/* Description */}
          <p
            className={cn(
              'text-lg md:text-xl max-w-2xl leading-relaxed',
              isDark ? 'text-white/70' : 'text-muted-foreground',
            )}
          >
            {description}
          </p>

          {/* CTA Buttons */}
          {Array.isArray(links) && links.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {links.map(({ link }, i) => (
                <CMSLink
                  key={i}
                  {...link}
                  className={cn(
                    'inline-flex items-center justify-center h-12 px-6 rounded-lg font-medium transition-colors',
                    link.appearance === 'default'
                      ? isDark
                        ? 'bg-accent text-white hover:bg-accent/90'
                        : 'bg-foreground text-background hover:bg-foreground/90'
                      : isDark
                        ? 'border border-white/20 bg-white/10 text-white hover:bg-white/20'
                        : 'border border-border bg-card text-foreground hover:bg-card/80',
                  )}
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
                  <p className={cn('text-sm', isDark ? 'text-white/60' : 'text-muted-foreground')}>
                    {trustIndicators.headline}
                  </p>
                )}
                {trustIndicators.indicators && trustIndicators.indicators.length > 0 && (
                  <div
                    className={cn(
                      'flex items-center gap-8',
                      isDark ? 'text-white/60' : 'text-muted-foreground',
                    )}
                  >
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
