'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'
import type { Media } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'
import { LanguageSelector } from './LanguageSelector'

interface HeaderClientProps {
  data: Header
  locale?: string
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, locale = 'fr' }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  const logoMedia = data.logo as Media | null

  return (
    <header className="container relative z-20" {...(theme ? { 'data-theme': theme } : {})}>
      <div className="py-8 flex justify-between items-center">
        <Link href="/">
          {logoMedia?.url ? (
            <img
              src={logoMedia.url}
              alt={logoMedia.alt || 'Logo'}
              className="h-8 w-auto invert dark:invert-0"
            />
          ) : (
            <Logo loading="eager" priority="high" className="invert dark:invert-0" />
          )}
        </Link>
        <div className="flex items-center gap-4">
          <HeaderNav data={data} />
          {data.showLanguageSelector && <LanguageSelector currentLocale={locale} />}
        </div>
      </div>
    </header>
  )
}
