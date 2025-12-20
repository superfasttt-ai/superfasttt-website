'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Menu } from 'lucide-react'

import type { Header } from '@/payload-types'
import type { Media } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'
import { MobileNav } from './MobileNav'
import { LanguageSelector } from './LanguageSelector'

interface HeaderClientProps {
  data: Header
  locale?: string
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, locale = 'fr' }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    setMobileMenuOpen(false)
  }, [pathname, setHeaderTheme])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
  }, [headerTheme, theme])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  const logoMedia = data.logo as Media | null

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        {...(theme ? { 'data-theme': theme } : {})}
      >
        <div className="container mx-auto px-4">
          <div
            className={`mt-4 flex justify-between items-center px-4 lg:px-6 py-3 rounded-full transition-all duration-300 ${
              scrolled
                ? 'bg-zinc-950/90 backdrop-blur-xl border border-zinc-800/50 shadow-xl shadow-black/10'
                : 'bg-zinc-950/70 backdrop-blur-md border border-zinc-800/30'
            }`}
          >
            <Link href="/" className="flex items-center">
              {logoMedia?.url ? (
                <img
                  src={logoMedia.url}
                  alt={logoMedia.alt || 'Logo'}
                  className="h-7 w-auto brightness-0 invert"
                />
              ) : (
                <Logo loading="eager" priority="high" className="brightness-0 invert" />
              )}
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              <HeaderNav data={data} />
              {data.showLanguageSelector && <LanguageSelector currentLocale={locale} />}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-full transition-colors"
              aria-label="Ouvrir le menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileNav
        data={data}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        locale={locale}
      />
    </>
  )
}
