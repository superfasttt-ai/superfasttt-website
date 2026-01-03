'use client'

import React, { Suspense } from 'react'
import Image from 'next/image'
import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'
import { GlowCard } from '@/components/GlowCard'
import { ANIMATIONS, type AnimationId } from '@/components/animations/registry'
import { AnimationSkeleton } from '@/components/animations/AnimationSkeleton'

import type { ProductShowcaseBlock as ProductShowcaseBlockProps, Media } from '@/payload-types'

// Mapping des icônes vers les IDs d'animation
const ICON_TO_ANIMATION: Record<string, AnimationId> = {
  brain: 'brain',
  users: 'assistants',
  layers: 'models',
  cloud: 'connectors',
  zap: 'marketing',
  shield: 'rnd',
  headphones: 'support',
}

const iconComponents: Record<string, React.FC<{ className?: string }>> = {
  brain: ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      />
    </svg>
  ),
  database: ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
      />
    </svg>
  ),
  cloud: ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
      />
    </svg>
  ),
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
  users: ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
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
  code: ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
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
  layers: ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
      />
    </svg>
  ),
  settings: ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  ),
  chart: ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  ),
  headphones: ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
      />
    </svg>
  ),
  rocket: ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
      />
    </svg>
  ),
  terminal: ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  ),
  workflow: ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
      />
    </svg>
  ),
}

type ShowcaseItem = NonNullable<ProductShowcaseBlockProps['items']>[0]

type BackgroundStyle = 'white' | 'muted'

interface ProductShowcaseBlockComponentProps extends ProductShowcaseBlockProps {
  backgroundStyle?: BackgroundStyle
}

export const ProductShowcaseBlock: React.FC<ProductShowcaseBlockComponentProps> = ({
  badge,
  title,
  description,
  items,
  layout = 'grid',
  backgroundStyle = 'white',
}) => {
  const renderCard = (item: ShowcaseItem, index: number, isLarge = false) => {
    const image = item.image as Media | undefined
    const IconComponent = item.icon ? iconComponents[item.icon] : null

    return (
      <GlowCard
        key={index}
        className={cn('overflow-hidden', isLarge ? 'md:col-span-2 md:row-span-2' : '')}
      >
        <div className={cn('relative p-6 md:p-8', isLarge && 'lg:p-10')}>
          {image?.url ? (
            <div
              className={cn(
                'relative rounded-lg overflow-hidden mb-6 bg-muted',
                isLarge ? 'h-48 md:h-64 lg:h-80' : 'h-32 md:h-40',
              )}
            >
              <Image src={image.url} alt={item.title} fill className="object-cover" />
            </div>
          ) : IconComponent ? (
            <div
              className={cn(
                'mb-6 inline-flex items-center justify-center rounded-lg bg-accent/10 text-accent border border-accent/20',
                isLarge ? 'w-14 h-14' : 'w-12 h-12',
              )}
            >
              <IconComponent className={isLarge ? 'w-7 h-7' : 'w-6 h-6'} />
            </div>
          ) : null}

          <h3
            className={cn(
              'font-semibold text-foreground mb-3',
              isLarge ? 'text-2xl md:text-3xl' : 'text-xl',
            )}
          >
            {item.title}
          </h3>

          <p
            className={cn(
              'text-muted-foreground leading-relaxed',
              isLarge ? 'text-base' : 'text-base',
            )}
          >
            {item.description}
          </p>

          {item.features && item.features.length > 0 && (
            <ul className="mt-4 space-y-2">
              {item.features.map((feature, featureIndex) => (
                <li
                  key={featureIndex}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <svg
                    className="w-4 h-4 text-accent flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {feature.text}
                </li>
              ))}
            </ul>
          )}

          {item.itemLinks && item.itemLinks.length > 0 && (
            <div className="mt-6">
              {item.itemLinks.map(({ link }, linkIndex) => (
                <CMSLink
                  key={linkIndex}
                  {...link}
                  className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors group/link"
                >
                  <span className="group-hover/link:underline">{link.label}</span>
                  <svg
                    className="w-4 h-4 transition-transform group-hover/link:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </CMSLink>
              ))}
            </div>
          )}
        </div>
      </GlowCard>
    )
  }

  const renderAlternating = () => {
    return (
      <div className="space-y-24">
        {items?.map((item, index) => {
          const image = item.image as Media | undefined
          const IconComponent = item.icon ? iconComponents[item.icon] : null
          const isReversed = index % 2 === 1

          return (
            <div
              key={index}
              className={cn(
                'grid gap-8 lg:gap-16 items-center',
                'md:grid-cols-2',
                isReversed && 'md:[&>*:first-child]:order-2',
              )}
            >
              <div>
                {IconComponent && (
                  <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                    <IconComponent className="w-7 h-7" />
                  </div>
                )}

                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  {item.title}
                </h3>

                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  {item.description}
                </p>

                {item.features && item.features.length > 0 && (
                  <ul className="space-y-3 mb-6">
                    {item.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center gap-3 text-muted-foreground"
                      >
                        <svg
                          className="w-5 h-5 text-accent flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {feature.text}
                      </li>
                    ))}
                  </ul>
                )}

                {item.itemLinks && item.itemLinks.length > 0 && (
                  <div>
                    {item.itemLinks.map(({ link }, linkIndex) => (
                      <CMSLink
                        key={linkIndex}
                        {...link}
                        className="inline-flex items-center gap-2 font-medium text-accent hover:text-accent/80 transition-colors group/link"
                      >
                        <span className="group-hover/link:underline">{link.label}</span>
                        <svg
                          className="w-4 h-4 transition-transform group-hover/link:translate-x-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </CMSLink>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                {image?.url ? (
                  <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl">
                    <Image
                      src={image.url}
                      alt={item.title}
                      width={image.width || 600}
                      height={image.height || 400}
                      className="w-full h-auto"
                    />
                  </div>
                ) : item.icon && ICON_TO_ANIMATION[item.icon] ? (
                  (() => {
                    const animationId = ICON_TO_ANIMATION[item.icon]
                    const AnimationComponent = ANIMATIONS[animationId]
                    return (
                      <div className="relative rounded-2xl border border-border bg-card/50 aspect-video overflow-hidden">
                        <Suspense fallback={<AnimationSkeleton className="w-full h-full" />}>
                          <AnimationComponent className="w-full h-full" />
                        </Suspense>
                      </div>
                    )
                  })()
                ) : (
                  <div className="relative rounded-2xl border border-border bg-card aspect-video flex items-center justify-center">
                    {IconComponent && (
                      <IconComponent className="w-24 h-24 text-muted-foreground/20" />
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <section className={cn('py-24', backgroundStyle === 'muted' ? 'bg-muted/50' : 'bg-background')}>
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
                {title.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < title.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </h2>
            )}
            {description && <p className="text-lg text-muted-foreground">{description}</p>}
          </div>
        )}

        {layout === 'alternating' ? (
          renderAlternating()
        ) : layout === 'bento' ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items?.map((item, index) => renderCard(item, index, index === 0))}
          </div>
        ) : (
          <div
            className={cn(
              'grid gap-6',
              items?.length === 1 && 'md:grid-cols-1 max-w-xl mx-auto',
              items?.length === 2 && 'md:grid-cols-2 max-w-4xl mx-auto',
              items?.length && items.length >= 3 && 'md:grid-cols-2 lg:grid-cols-3',
            )}
          >
            {items?.map((item, index) => renderCard(item, index))}
          </div>
        )}
      </div>
    </section>
  )
}
