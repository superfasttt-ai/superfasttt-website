/**
 * Configuration i18n pour le frontend
 */

export const locales = ['fr', 'en', 'es'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'fr'

export const localeLabels: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
  es: 'Español',
}

export const localeFlags: Record<Locale, string> = {
  fr: '🇫🇷',
  en: '🇬🇧',
  es: '🇪🇸',
}

/**
 * Vérifie si une chaîne est une locale valide
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

/**
 * Récupère la locale depuis un segment d'URL
 */
export function getLocaleFromSegment(segment: string | undefined): Locale {
  if (segment && isValidLocale(segment)) {
    return segment
  }
  return defaultLocale
}
