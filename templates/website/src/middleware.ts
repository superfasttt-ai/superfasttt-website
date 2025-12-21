import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['fr', 'en', 'es']
const defaultLocale = 'fr'

// Paths to skip (admin, api, static files, etc.)
const skipPaths = ['/admin', '/api', '/next', '/_next', '/favicon', '/robots', '/sitemap']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip admin, API, and static paths
  if (skipPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Skip files with extensions
  if (pathname.includes('.')) {
    return NextResponse.next()
  }

  // Extract the first segment
  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0]

  // Check if first segment is a valid non-default locale
  const isLocalePrefix =
    firstSegment && locales.includes(firstSegment) && firstSegment !== defaultLocale

  // Determine the locale
  const locale = isLocalePrefix ? firstSegment : defaultLocale

  // Create response with locale header for the layout to use
  const response = NextResponse.next()
  response.headers.set('x-locale', locale)
  response.headers.set('x-pathname', pathname)

  return response
}

export const config = {
  matcher: [
    // Match all paths except static files and api
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}
