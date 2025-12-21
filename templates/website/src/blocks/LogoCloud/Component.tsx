'use client'

import React from 'react'
import Image from 'next/image'
import { cn } from '@/utilities/ui'

import type { LogoCloudBlock as LogoCloudBlockProps, Media } from '@/payload-types'

export const LogoCloudBlock: React.FC<LogoCloudBlockProps> = ({
  headline,
  logos,
  variant = 'default',
  grayscale = true,
}) => {
  const renderLogo = (item: NonNullable<LogoCloudBlockProps['logos']>[0], index: number) => {
    const logo = item.logo as Media
    if (!logo?.url) return null

    const logoElement = (
      <Image
        src={logo.url}
        alt={item.name}
        width={logo.width || 120}
        height={logo.height || 40}
        className={cn(
          'h-8 md:h-10 w-auto object-contain transition-all duration-300',
          grayscale && 'opacity-60 grayscale hover:opacity-100 hover:grayscale-0',
        )}
      />
    )

    if (item.url) {
      return (
        <a
          key={index}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center"
        >
          {logoElement}
        </a>
      )
    }

    return (
      <div key={index} className="flex items-center justify-center">
        {logoElement}
      </div>
    )
  }

  if (variant === 'marquee') {
    return (
      <section className="py-12 md:py-16 overflow-hidden bg-background">
        <div className="container px-4 md:px-6 mb-8">
          {headline && <p className="text-center text-sm text-muted-foreground">{headline}</p>}
        </div>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
          <div className="flex animate-marquee">
            <div className="flex items-center gap-12 md:gap-16 px-8">
              {logos?.map((item, index) => renderLogo(item, index))}
            </div>
            <div className="flex items-center gap-12 md:gap-16 px-8">
              {logos?.map((item, index) => renderLogo(item, index + (logos?.length || 0)))}
            </div>
          </div>
        </div>
        <style jsx>{`
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
        `}</style>
      </section>
    )
  }

  return (
    <section
      className={cn(
        'py-12 md:py-16',
        variant === 'withBackground' ? 'bg-muted/30' : 'bg-background',
      )}
    >
      <div className="container px-4 md:px-6">
        {headline && <p className="text-center text-sm text-muted-foreground mb-8">{headline}</p>}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
          {logos?.map((item, index) => renderLogo(item, index))}
        </div>
      </div>
    </section>
  )
}
