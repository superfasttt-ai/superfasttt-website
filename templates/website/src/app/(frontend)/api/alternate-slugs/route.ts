import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { locales, defaultLocale, type Locale } from '@/i18n/config'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  const currentLocale = (searchParams.get('locale') as Locale) || defaultLocale

  if (!slug) {
    return NextResponse.json({ error: 'slug parameter required' }, { status: 400 })
  }

  try {
    const payload = await getPayload({ config: configPromise })

    // First, find the page with the given slug in the current locale
    const result = await payload.find({
      collection: 'pages',
      limit: 1,
      locale: currentLocale,
      where: {
        slug: {
          equals: slug,
        },
      },
    })

    if (!result.docs || result.docs.length === 0) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    const pageId = result.docs[0].id

    // Now fetch the page's slug for each locale
    const alternateSlugs: Record<string, string> = {}

    for (const locale of locales) {
      const localeResult = await payload.findByID({
        collection: 'pages',
        id: pageId,
        locale: locale,
      })

      if (localeResult?.slug) {
        alternateSlugs[locale] = localeResult.slug as string
      }
    }

    return NextResponse.json({ alternateSlugs, pageId })
  } catch (error) {
    console.error('Error fetching alternate slugs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
