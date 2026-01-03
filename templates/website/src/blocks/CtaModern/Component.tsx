'use client'

import React from 'react'
import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'

import type { CtaModernBlock as CtaModernBlockProps } from '@/payload-types'

export const CtaModernBlock: React.FC<CtaModernBlockProps> = ({
  title,
  description,
  links,
  variant = 'gradient',
}) => {
  const isPrimary = variant === 'primary'

  const containerVariants = {
    gradient:
      'bg-gradient-to-br from-accent/10 via-secondary/10 to-primary/10 border border-border',
    primary: 'bg-primary border-0',
    dark: 'bg-card border border-border',
    bordered: 'bg-card/50 border border-border',
  }

  return (
    <section
      className={cn('py-24 section-gradient-top', isPrimary ? 'bg-primary' : 'bg-background')}
    >
      <div className="container px-4 md:px-6">
        <div
          className={cn(
            'relative overflow-hidden rounded-3xl p-12 md:p-16 lg:p-20',
            containerVariants[variant as keyof typeof containerVariants],
          )}
        >
          {/* Background pattern */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: isPrimary
                ? `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`
                : `linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)`,
              backgroundSize: '32px 32px',
            }}
          />

          {/* Gradient orbs */}
          {(variant === 'gradient' || isPrimary) && (
            <>
              <div
                className={cn(
                  'absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2',
                  isPrimary ? 'bg-accent/30' : 'bg-accent/10',
                )}
              />
              <div
                className={cn(
                  'absolute bottom-0 left-0 w-96 h-96 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2',
                  isPrimary ? 'bg-secondary/30' : 'bg-secondary/10',
                )}
              />
            </>
          )}

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            {/* Title */}
            <h2
              className={cn(
                'text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6',
                isPrimary ? 'text-white' : 'text-foreground',
              )}
            >
              {title}
            </h2>

            {/* Description */}
            {description && (
              <p
                className={cn(
                  'text-lg md:text-xl mb-10 leading-relaxed',
                  isPrimary ? 'text-white/70' : 'text-muted-foreground',
                )}
              >
                {description}
              </p>
            )}

            {/* CTA Buttons */}
            {Array.isArray(links) && links.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {links.map(({ link }, i) => (
                  <CMSLink
                    key={i}
                    {...link}
                    className={cn(
                      'inline-flex items-center justify-center h-12 px-8 rounded-lg font-medium transition-all',
                      link.appearance === 'default'
                        ? isPrimary
                          ? 'bg-accent text-white hover:bg-accent/90'
                          : 'bg-foreground text-background hover:bg-foreground/90'
                        : isPrimary
                          ? 'border border-white/20 bg-white/10 text-white hover:bg-white/20'
                          : 'border border-border bg-card text-foreground hover:bg-card/80',
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
