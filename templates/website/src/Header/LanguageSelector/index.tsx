'use client'

import React, { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Globe, ChevronDown } from 'lucide-react'

const LOCALES = [
  { code: 'fr', label: 'FR', fullLabel: 'Français' },
  { code: 'en', label: 'EN', fullLabel: 'English' },
  { code: 'es', label: 'ES', fullLabel: 'Español' },
]

interface LanguageSelectorProps {
  currentLocale?: string
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ currentLocale = 'fr' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const currentLang = LOCALES.find((l) => l.code === currentLocale) || LOCALES[0]

  const handleLocaleChange = (localeCode: string) => {
    // Construct new path with locale prefix
    const segments = pathname.split('/').filter(Boolean)

    // Remove current locale if present
    if (LOCALES.some((l) => l.code === segments[0])) {
      segments.shift()
    }

    // Add new locale (if not default)
    const newPath =
      localeCode === 'fr' ? `/${segments.join('/')}` : `/${localeCode}/${segments.join('/')}`

    router.push(newPath || '/')
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors px-2 py-1 rounded-md hover:bg-muted"
      >
        <Globe className="w-4 h-4" />
        <span>{currentLang.label}</span>
        <ChevronDown className="w-3 h-3" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full right-0 mt-1 bg-background border border-border rounded-md shadow-lg py-1 z-50 min-w-[120px]">
            {LOCALES.map((locale) => (
              <button
                key={locale.code}
                onClick={() => handleLocaleChange(locale.code)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors ${
                  locale.code === currentLocale ? 'text-primary font-medium' : ''
                }`}
              >
                {locale.fullLabel}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
