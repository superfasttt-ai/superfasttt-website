import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { homeStatic } from '@/endpoints/seed/home-static'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { defaultLocale, locales, type Locale, isValidLocale } from '@/i18n/config'
import {
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateServiceSchema,
  JsonLdScript,
} from '@/utilities/jsonLd'
import { getServerSideURL } from '@/utilities/getURL'
import type { FAQBlock } from '@/payload-types'

// Parse les segments d'URL pour extraire locale et slug
function parseSegments(segments: string[]): { locale: Locale; slug: string } {
  if (!segments || segments.length === 0) {
    return { locale: defaultLocale, slug: 'home' }
  }

  const firstSegment = segments[0]

  // Vérifier si le premier segment est une locale non-default
  if (isValidLocale(firstSegment) && firstSegment !== defaultLocale) {
    const slug = segments.slice(1).join('/') || 'home'
    return { locale: firstSegment, slug }
  }

  // Sinon c'est un slug avec la locale par défaut
  return { locale: defaultLocale, slug: segments.join('/') || 'home' }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  const allParams: { slug: string[] }[] = []

  // Page d'accueil FR (pas de segments)
  allParams.push({ slug: [] })

  // Générer les params pour chaque locale
  for (const locale of locales) {
    const pages = await payload.find({
      collection: 'pages',
      draft: false,
      limit: 1000,
      locale: locale,
      overrideAccess: false,
      pagination: false,
      select: {
        slug: true,
      },
    })

    if (locale === defaultLocale) {
      // Pour FR: ['solutions', 'sante'], ['contact'], etc.
      const params = pages.docs
        ?.filter((doc) => doc.slug !== 'home')
        .map(({ slug }) => {
          // Split le slug pour gérer les chemins comme 'solutions/sante'
          const slugParts = (slug as string).split('/')
          return { slug: slugParts }
        })
      allParams.push(...params)
    } else {
      // Pour EN/ES: ['en'], ['en', 'solutions', 'healthcare'], etc.
      // Page d'accueil de la locale
      allParams.push({ slug: [locale] })
      // Autres pages
      const params = pages.docs
        ?.filter((doc) => doc.slug !== 'home')
        .map(({ slug }) => {
          // Split le slug et ajoute la locale en premier
          const slugParts = (slug as string).split('/')
          return { slug: [locale, ...slugParts] }
        })
      allParams.push(...params)
    }
  }

  return allParams
}

type Args = {
  params: Promise<{
    slug?: string[]
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug: segments } = await paramsPromise

  // Parser les segments pour extraire locale et slug
  const { locale, slug } = parseSegments(segments || [])

  // Decode pour supporter les caractères spéciaux
  const decodedSlug = decodeURIComponent(slug)

  const url =
    locale === defaultLocale
      ? decodedSlug === 'home'
        ? '/'
        : '/' + decodedSlug
      : decodedSlug === 'home'
        ? `/${locale}`
        : `/${locale}/${decodedSlug}`

  let page: RequiredDataFromCollectionSlug<'pages'> | null

  page = await queryPageBySlug({
    slug: decodedSlug,
    locale: locale,
  })

  // Fallback sur la page statique si home n'existe pas
  if (!page && decodedSlug === 'home') {
    page = homeStatic
  }

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page

  // Générer les JSON-LD schemas
  const siteUrl = getServerSideURL()
  const jsonLdSchemas: object[] = []

  // Breadcrumb schema
  const breadcrumbItems = [{ name: 'Accueil', url: siteUrl }]
  if (decodedSlug !== 'home') {
    const slugParts = decodedSlug.split('/')
    let currentPath = locale === defaultLocale ? '' : `/${locale}`
    slugParts.forEach((part, index) => {
      currentPath += `/${part}`
      const name = page.title && index === slugParts.length - 1 ? page.title : part
      breadcrumbItems.push({ name, url: `${siteUrl}${currentPath}` })
    })
  }
  jsonLdSchemas.push(generateBreadcrumbSchema(breadcrumbItems))

  // FAQ schema si la page contient un bloc FAQ
  const faqBlock = layout?.find((block): block is FAQBlock => block.blockType === 'faq')
  if (faqBlock) {
    const faqSchema = generateFAQSchema(faqBlock)
    if (faqSchema) {
      jsonLdSchemas.push(faqSchema)
    }
  }

  // Service schema si le slug contient "services" ou "solutions"
  if (decodedSlug.includes('services') || decodedSlug.includes('solutions')) {
    jsonLdSchemas.push(generateServiceSchema(page, locale))
  }

  return (
    <article className="pt-16 pb-24">
      <JsonLdScript data={jsonLdSchemas} />
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug: segments } = await paramsPromise
  const { locale, slug } = parseSegments(segments || [])
  const decodedSlug = decodeURIComponent(slug)

  const page = await queryPageBySlug({
    slug: decodedSlug,
    locale: locale,
  })

  return generateMeta({ doc: page })
}

const queryPageBySlug = cache(async ({ slug, locale }: { slug: string; locale: Locale }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    locale: locale,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
