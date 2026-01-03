'use client'

import React from 'react'
import { cn } from '@/utilities/ui'

interface GlowCardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'dark' | 'gradient' | 'glass'
}

export const GlowCard: React.FC<GlowCardProps> = ({ children, className, variant = 'default' }) => {
  const variants = {
    // Card standard avec fond solid
    default: [
      'bg-card border border-border',
      'hover:border-accent/40 hover:shadow-xl hover:shadow-accent/10',
      'hover:-translate-y-1',
    ].join(' '),

    // Card pour fond sombre (primary)
    dark: [
      'bg-gradient-to-br from-secondary/90 via-secondary/70 to-primary/80',
      'border border-white/10 backdrop-blur-sm',
      'hover:border-accent/40 hover:shadow-xl hover:shadow-accent/20',
      'hover:-translate-y-1',
    ].join(' '),

    // Card avec gradient subtil accent
    gradient: [
      'bg-gradient-to-br from-card via-card to-accent/5',
      'border border-border',
      'hover:border-accent/40 hover:shadow-xl hover:shadow-accent/10',
      'hover:to-accent/10',
      'hover:-translate-y-1',
    ].join(' '),

    // Card effet verre
    glass: [
      'bg-white/80 backdrop-blur-md',
      'border border-white/20',
      'shadow-lg shadow-black/5',
      'hover:bg-white/90 hover:shadow-xl hover:shadow-accent/10',
      'hover:-translate-y-1',
    ].join(' '),
  }

  return (
    <div
      className={cn(
        'group relative rounded-2xl transition-all duration-300 ease-out overflow-hidden',
        variants[variant],
        className,
      )}
    >
      {/* Gradient overlay subtil au hover */}
      <div
        className={cn(
          'absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none',
          'group-hover:opacity-100',
          variant === 'dark'
            ? 'bg-gradient-to-br from-accent/10 via-transparent to-transparent'
            : 'bg-gradient-to-br from-accent/5 via-transparent to-secondary/5',
        )}
      />

      {/* Ligne de lumière en haut */}
      <div
        className={cn(
          'absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px',
          'bg-gradient-to-r from-transparent via-accent/50 to-transparent',
          'opacity-0 group-hover:opacity-100 transition-opacity duration-500',
        )}
      />

      {/* Contenu */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
