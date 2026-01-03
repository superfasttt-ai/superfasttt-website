'use client'

import React from 'react'
import { cn } from '@/utilities/ui'
import { GlowCard } from '@/components/GlowCard'

import type { StatsSectionBlock as StatsSectionBlockProps } from '@/payload-types'

type BackgroundStyle = 'white' | 'muted' | 'dark'

interface StatsSectionBlockComponentProps extends StatsSectionBlockProps {
  backgroundStyle?: BackgroundStyle
}

export const StatsSectionBlock: React.FC<StatsSectionBlockComponentProps> = ({
  badge,
  title,
  description,
  stats,
  variant = 'default',
  columns = '4',
  backgroundStyle = 'white',
}) => {
  const gridCols = {
    '2': 'md:grid-cols-2',
    '3': 'md:grid-cols-3',
    '4': 'md:grid-cols-2 lg:grid-cols-4',
  }

  const isDark = backgroundStyle === 'dark'

  const sectionBg = {
    white: 'bg-background',
    muted: 'bg-muted/50',
    dark: 'bg-primary',
  }

  const renderStat = (stat: NonNullable<StatsSectionBlockProps['stats']>[0], index: number) => {
    if (variant === 'cards') {
      // Alterner les variantes de cards
      const cardVariant = isDark ? 'dark' : index % 2 === 0 ? 'gradient' : 'default'
      return (
        <GlowCard key={index} className="p-6 text-center" variant={cardVariant}>
          <div className="relative">
            <div
              className={cn(
                'text-4xl md:text-5xl font-bold mb-2',
                isDark
                  ? 'bg-gradient-to-r from-accent via-white/90 to-accent bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-accent via-secondary to-accent bg-clip-text text-transparent',
              )}
            >
              {stat.value}
            </div>
            <div
              className={cn(
                'text-base font-semibold mb-1',
                isDark ? 'text-white' : 'text-foreground',
              )}
            >
              {stat.label}
            </div>
            {stat.description && (
              <p className={cn('text-sm', isDark ? 'text-white/60' : 'text-muted-foreground')}>
                {stat.description}
              </p>
            )}
          </div>
        </GlowCard>
      )
    }

    if (variant === 'gradient') {
      return (
        <div key={index} className="text-center">
          <div
            className={cn(
              'text-5xl md:text-6xl lg:text-7xl font-bold mb-2',
              isDark
                ? 'bg-gradient-to-r from-accent via-white to-accent bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-accent via-secondary to-primary bg-clip-text text-transparent',
            )}
          >
            {stat.value}
          </div>
          <div
            className={cn('text-lg font-medium mb-1', isDark ? 'text-white' : 'text-foreground')}
          >
            {stat.label}
          </div>
          {stat.description && (
            <p className={cn('text-sm', isDark ? 'text-white/60' : 'text-muted-foreground')}>
              {stat.description}
            </p>
          )}
        </div>
      )
    }

    return (
      <div key={index} className="text-center">
        <div
          className={cn(
            'text-4xl md:text-5xl font-bold mb-2',
            isDark ? 'text-white' : 'text-foreground',
          )}
        >
          {stat.value}
        </div>
        <div
          className={cn('text-lg font-medium', isDark ? 'text-white/70' : 'text-muted-foreground')}
        >
          {stat.label}
        </div>
        {stat.description && (
          <p className={cn('text-sm mt-1', isDark ? 'text-white/60' : 'text-muted-foreground')}>
            {stat.description}
          </p>
        )}
      </div>
    )
  }

  return (
    <section
      className={cn(
        'py-24',
        sectionBg[backgroundStyle],
        variant === 'gradient' && 'section-gradient-top section-gradient-bottom',
      )}
    >
      <div className="container px-4 md:px-6">
        {(badge || title || description) && (
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
            {title && (
              <h2
                className={cn(
                  'text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4',
                  isDark ? 'text-white' : 'text-foreground',
                )}
              >
                {title}
              </h2>
            )}
            {description && (
              <p className={cn('text-lg', isDark ? 'text-white/70' : 'text-muted-foreground')}>
                {description}
              </p>
            )}
          </div>
        )}

        <div className={cn('grid gap-8 md:gap-12', gridCols[columns as keyof typeof gridCols])}>
          {stats?.map((stat, index) => renderStat(stat, index))}
        </div>
      </div>
    </section>
  )
}
