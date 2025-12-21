'use client'

import React from 'react'
import { cn } from '@/utilities/ui'
import { GlowCard } from '@/components/GlowCard'

import type { StatsSectionBlock as StatsSectionBlockProps } from '@/payload-types'

export const StatsSectionBlock: React.FC<StatsSectionBlockProps> = ({
  badge,
  title,
  description,
  stats,
  variant = 'default',
  columns = '4',
}) => {
  const gridCols = {
    '2': 'md:grid-cols-2',
    '3': 'md:grid-cols-3',
    '4': 'md:grid-cols-2 lg:grid-cols-4',
  }

  const renderStat = (stat: NonNullable<StatsSectionBlockProps['stats']>[0], index: number) => {
    if (variant === 'cards') {
      return (
        <GlowCard key={index} className="p-6">
          <div className="relative">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-400 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent mb-2">
              {stat.value}
            </div>
            <div className="text-base font-medium text-foreground mb-1">{stat.label}</div>
            {stat.description && (
              <p className="text-sm text-muted-foreground">{stat.description}</p>
            )}
          </div>
        </GlowCard>
      )
    }

    if (variant === 'gradient') {
      return (
        <div key={index} className="text-center">
          <div className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-emerald-600 via-cyan-500 to-blue-500 dark:from-emerald-400 dark:via-cyan-400 dark:to-blue-400 bg-clip-text text-transparent mb-2">
            {stat.value}
          </div>
          <div className="text-lg font-medium text-foreground mb-1">{stat.label}</div>
          {stat.description && <p className="text-sm text-muted-foreground">{stat.description}</p>}
        </div>
      )
    }

    return (
      <div key={index} className="text-center">
        <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">{stat.value}</div>
        <div className="text-lg font-medium text-muted-foreground">{stat.label}</div>
        {stat.description && (
          <p className="text-sm text-muted-foreground mt-1">{stat.description}</p>
        )}
      </div>
    )
  }

  return (
    <section
      className={cn('py-24 bg-background', variant === 'gradient' && 'border-y border-border')}
    >
      <div className="container px-4 md:px-6">
        {(badge || title || description) && (
          <div className="text-center max-w-3xl mx-auto mb-16">
            {badge && (
              <div className="inline-flex items-center rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground mb-4">
                {badge}
              </div>
            )}
            {title && (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
                {title}
              </h2>
            )}
            {description && <p className="text-lg text-muted-foreground">{description}</p>}
          </div>
        )}

        <div className={cn('grid gap-8 md:gap-12', gridCols[columns as keyof typeof gridCols])}>
          {stats?.map((stat, index) => renderStat(stat, index))}
        </div>
      </div>
    </section>
  )
}
