'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState, useRef, useCallback } from 'react'
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
  const [isOverDark, setIsOverDark] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
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

  // Detect if header is over a dark section
  const checkDarkSection = useCallback(() => {
    if (!headerRef.current) return

    const headerRect = headerRef.current.getBoundingClientRect()
    const headerMiddle = headerRect.top + headerRect.height / 2

    // Find all sections with dark background (bg-primary class)
    const darkSections = document.querySelectorAll('.bg-primary, [class*="bg-primary"]')

    let overDark = false
    darkSections.forEach((section) => {
      const rect = section.getBoundingClientRect()
      if (headerMiddle >= rect.top && headerMiddle <= rect.bottom) {
        overDark = true
      }
    })

    setIsOverDark(overDark)
  }, [])

  useEffect(() => {
    checkDarkSection()
    window.addEventListener('scroll', checkDarkSection)
    window.addEventListener('resize', checkDarkSection)

    return () => {
      window.removeEventListener('scroll', checkDarkSection)
      window.removeEventListener('resize', checkDarkSection)
    }
  }, [checkDarkSection])

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

  // Determine header styles based on dark section and scroll state
  const getHeaderClasses = () => {
    if (isOverDark && !scrolled) {
      // Over dark section, not scrolled: transparent with no blur
      return 'bg-transparent'
    }
    if (scrolled) {
      // Scrolled: always light background with blur
      return 'bg-white/90 backdrop-blur-lg shadow-sm shadow-black/5'
    }
    // Default: light semi-transparent
    return 'bg-white/70 backdrop-blur-md'
  }

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${getHeaderClasses()}`}
        {...(theme ? { 'data-theme': theme } : {})}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center px-4 lg:px-6 py-3 transition-all duration-300">
            <Link href="/" className="flex items-center">
              {logoMedia?.url ? (
                <img src={logoMedia.url} alt={logoMedia.alt || 'Logo'} className="h-7 w-auto" />
              ) : (
                <Logo
                  loading="eager"
                  priority="high"
                  variant={isOverDark && !scrolled ? 'light' : 'dark'}
                />
              )}
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              <HeaderNav data={data} isOverDark={isOverDark && !scrolled} />
              {data.showLanguageSelector && (
                <LanguageSelector currentLocale={locale} isOverDark={isOverDark && !scrolled} />
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className={`lg:hidden p-2 transition-colors ${
                isOverDark && !scrolled
                  ? 'text-white/80 hover:text-white hover:bg-white/10'
                  : 'text-muted-foreground hover:text-primary hover:bg-muted'
              }`}
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
