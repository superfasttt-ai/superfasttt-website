'use client'

import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/utilities/ui'

interface GlowCardProps {
  children: React.ReactNode
  className?: string
}

export const GlowCard: React.FC<GlowCardProps> = ({ children, className }) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setIsAnimating(true)
            setHasAnimated(true)
            // Arrêter l'animation après un tour complet (3s)
            setTimeout(() => {
              setIsAnimating(false)
            }, 3000)
          }
        })
      },
      {
        threshold: 0.3,
        rootMargin: '0px',
      },
    )

    observer.observe(card)

    return () => {
      observer.disconnect()
    }
  }, [hasAnimated])

  return (
    <div
      ref={cardRef}
      className={cn(
        'glow-card group relative rounded-xl border border-border bg-card transition-all duration-300',
        isAnimating && 'glow-card--animating',
        className,
      )}
    >
      {children}
    </div>
  )
}
