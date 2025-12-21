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
  const variants = {
    gradient:
      'bg-gradient-to-br from-emerald-500/10 via-cyan-500/10 to-blue-500/10 dark:from-emerald-900/50 dark:via-cyan-900/50 dark:to-blue-900/50 border border-border',
    dark: 'bg-card border border-border',
    bordered: 'bg-card/50 border border-border',
  }

  return (
    <section className="py-24 bg-background">
      <div className="container px-4 md:px-6">
        <div
          className={cn(
            'relative overflow-hidden rounded-3xl p-12 md:p-16 lg:p-20',
            variants[variant as keyof typeof variants],
          )}
        >
          {/* Background pattern - Light mode */}
          <div
            className="absolute inset-0 dark:hidden"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)`,
              backgroundSize: '32px 32px',
            }}
          />
          {/* Background pattern - Dark mode */}
          <div
            className="absolute inset-0 hidden dark:block"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
              backgroundSize: '32px 32px',
            }}
          />

          {/* Gradient orbs */}
          {variant === 'gradient' && (
            <>
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
            </>
          )}

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            {/* Title */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6">
              {title}
            </h2>

            {/* Description */}
            {description && (
              <p className="text-lg md:text-xl mb-10 leading-relaxed text-muted-foreground">
                {description}
              </p>
            )}

            {/* CTA Buttons - Vercel style */}
            {Array.isArray(links) && links.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {links.map(({ link }, i) => (
                  <CMSLink
                    key={i}
                    {...link}
                    className={cn(
                      'inline-flex items-center justify-center h-12 px-8 rounded-lg font-medium transition-all',
                      link.appearance === 'default'
                        ? 'bg-foreground text-background hover:bg-foreground/90'
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
