'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Globe, ChevronDown } from 'lucide-react'

export const LOCALES = [
  { code: 'fr', label: 'FR', fullLabel: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'EN', fullLabel: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'ES', fullLabel: 'Español', flag: '🇪🇸' },
]

const DEFAULT_LOCALE = 'fr'

interface LanguageSelectorProps {
  currentLocale?: string
  variant?: 'dropdown' | 'inline'
  onSelect?: () => void
}

// Parse pathname to extract locale and slug
function parsePathname(pathname: string): { locale: string; slug: string } {
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 0) {
    return { locale: DEFAULT_LOCALE, slug: 'home' }
  }

  const firstSegment = segments[0]
  const isLocalePrefix =
    LOCALES.some((l) => l.code === firstSegment) && firstSegment !== DEFAULT_LOCALE

  if (isLocalePrefix) {
    const slug = segments.slice(1).join('/') || 'home'
    return { locale: firstSegment, slug }
  }

  return { locale: DEFAULT_LOCALE, slug: segments.join('/') || 'home' }
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLocale = 'fr',
  variant = 'dropdown',
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [alternateSlugs, setAlternateSlugs] = useState<Record<string, string> | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const currentLang = LOCALES.find((l) => l.code === currentLocale) || LOCALES[0]

  // Fetch alternate slugs when pathname changes
  const fetchAlternateSlugs = useCallback(async () => {
    const { locale, slug } = parsePathname(pathname)

    // Skip for home page - no slug translation needed
    if (slug === 'home') {
      setAlternateSlugs(null)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(
        `/api/alternate-slugs?slug=${encodeURIComponent(slug)}&locale=${locale}`,
      )
      if (response.ok) {
        const data = await response.json()
        setAlternateSlugs(data.alternateSlugs)
      } else {
        setAlternateSlugs(null)
      }
    } catch (error) {
      console.error('Failed to fetch alternate slugs:', error)
      setAlternateSlugs(null)
    } finally {
      setIsLoading(false)
    }
  }, [pathname])

  useEffect(() => {
    fetchAlternateSlugs()
  }, [fetchAlternateSlugs])

  const handleLocaleChange = (targetLocale: string) => {
    const { slug: currentSlug } = parsePathname(pathname)

    // Determine the target slug
    let targetSlug = currentSlug
    if (alternateSlugs && alternateSlugs[targetLocale]) {
      targetSlug = alternateSlugs[targetLocale]
    }

    // Build the new path
    let newPath: string
    if (targetSlug === 'home') {
      // Home page
      newPath = targetLocale === DEFAULT_LOCALE ? '/' : `/${targetLocale}`
    } else {
      // Regular page
      newPath =
        targetLocale === DEFAULT_LOCALE ? `/${targetSlug}` : `/${targetLocale}/${targetSlug}`
    }

    router.push(newPath)
    setIsOpen(false)
    onSelect?.()
  }

  // Inline variant for mobile
  if (variant === 'inline') {
    return (
      <div className="flex gap-2">
        {LOCALES.map((locale) => (
          <button
            key={locale.code}
            onClick={() => handleLocaleChange(locale.code)}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
              locale.code === currentLocale
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            } ${isLoading ? 'opacity-50 cursor-wait' : ''}`}
          >
            <span>{locale.flag}</span>
            <span className="text-sm font-medium">{locale.label}</span>
          </button>
        ))}
      </div>
    )
  }

  // Dropdown variant for desktop
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 text-sm text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800/50 transition-all duration-200"
      >
        <Globe className="w-4 h-4" />
        <span>{currentLang.label}</span>
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full right-0 mt-2 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl py-2 z-50 min-w-[140px] animate-in fade-in slide-in-from-top-2 duration-200">
            {LOCALES.map((locale) => (
              <button
                key={locale.code}
                onClick={() => handleLocaleChange(locale.code)}
                disabled={isLoading}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  locale.code === currentLocale
                    ? 'text-white bg-zinc-800/50'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                } ${isLoading ? 'opacity-50 cursor-wait' : ''}`}
              >
                <span>{locale.flag}</span>
                <span>{locale.fullLabel}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
