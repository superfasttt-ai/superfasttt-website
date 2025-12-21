'use client'

import React, { Suspense } from 'react'
import { cn } from '@/utilities/ui'
import { ANIMATIONS, type AnimationId } from '@/components/animations/registry'
import type { AnimationBlock as AnimationBlockProps } from '@/payload-types'

const aspectRatioClasses: Record<string, string> = {
  video: 'aspect-video',
  standard: 'aspect-[4/3]',
  square: 'aspect-square',
}

export const AnimationBlock: React.FC<AnimationBlockProps> = ({
  animationId,
  layout = 'full',
  title,
  description,
  aspectRatio = 'video',
}) => {
  const AnimationComponent = animationId ? ANIMATIONS[animationId as AnimationId] : null

  if (!AnimationComponent) {
    // Fallback en développement uniquement
    if (process.env.NODE_ENV === 'development') {
      return (
        <div className="container">
          <div className="rounded-lg border border-dashed border-amber-500/50 bg-amber-500/10 p-8 text-center">
            <p className="text-amber-600">Animation non trouvée: {animationId}</p>
          </div>
        </div>
      )
    }
    return null
  }

  const renderAnimation = () => (
    <div
      className={cn(
        'relative rounded-2xl border border-border bg-card/50 overflow-hidden',
        aspectRatioClasses[aspectRatio] || 'aspect-video',
      )}
    >
      <Suspense
        fallback={<div className="absolute inset-0 animate-pulse bg-muted/20 rounded-lg" />}
      >
        <AnimationComponent className="w-full h-full" />
      </Suspense>
    </div>
  )

  if (layout === 'full') {
    return (
      <section className="py-16">
        <div className="container px-4 md:px-6">{renderAnimation()}</div>
      </section>
    )
  }

  if (layout === 'text-left' || layout === 'text-right') {
    return (
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div
            className={cn(
              'grid gap-8 lg:gap-16 items-center md:grid-cols-2',
              layout === 'text-right' && 'md:[&>*:first-child]:order-2',
            )}
          >
            <div>
              {title && (
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-lg text-muted-foreground leading-relaxed">{description}</p>
              )}
            </div>
            {renderAnimation()}
          </div>
        </div>
      </section>
    )
  }

  // Centered layouts
  return (
    <section className="py-16">
      <div
        className={cn(
          'container px-4 md:px-6 mx-auto',
          layout === 'centered-small' && 'max-w-md',
          layout === 'centered-medium' && 'max-w-2xl',
        )}
      >
        {renderAnimation()}
      </div>
    </section>
  )
}
