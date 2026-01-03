import React from 'react'
import type { Page, Post, FAQBlock } from '@/payload-types'
import { getServerSideURL } from './getURL'

interface BreadcrumbItem {
  name: string
  url: string
}

interface LexicalNode {
  type?: string
  text?: string
  children?: LexicalNode[]
}

function extractTextFromLexical(node: LexicalNode | null | undefined): string {
  if (!node) return ''

  if (node.text) {
    return node.text
  }

  if (node.children && Array.isArray(node.children)) {
    return node.children.map((child) => extractTextFromLexical(child)).join(' ')
  }

  return ''
}

function extractTextFromRichText(richText: unknown): string {
  if (!richText || typeof richText !== 'object') return ''

  const root = (richText as { root?: LexicalNode }).root
  if (!root) return ''

  return extractTextFromLexical(root).trim().replace(/\s+/g, ' ')
}

const SITE_URL = () => getServerSideURL()

const ORGANIZATION_INFO = {
  name: 'SUPERFASTTT',
  legalName: 'SUPERFASTTT',
  url: SITE_URL,
  logo: () => `${SITE_URL()}/logo-superfasttt.svg`,
  address: {
    streetAddress: '45 Av. du Président J F Kennedy',
    addressLocality: 'Biarritz',
    postalCode: '64200',
    addressCountry: 'FR',
  },
  description:
    "SUPERFASTTT accompagne les entreprises dans leur transformation IA avec des solutions d'intelligence artificielle souveraines et sur-mesure.",
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: ORGANIZATION_INFO.name,
    legalName: ORGANIZATION_INFO.legalName,
    url: ORGANIZATION_INFO.url(),
    logo: ORGANIZATION_INFO.logo(),
    description: ORGANIZATION_INFO.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: ORGANIZATION_INFO.address.streetAddress,
      addressLocality: ORGANIZATION_INFO.address.addressLocality,
      postalCode: ORGANIZATION_INFO.address.postalCode,
      addressCountry: ORGANIZATION_INFO.address.addressCountry,
    },
  }
}

export function generateWebSiteSchema() {
  const siteUrl = SITE_URL()
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: ORGANIZATION_INFO.name,
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateFAQSchema(faqBlock: FAQBlock) {
  if (!faqBlock.items || faqBlock.items.length === 0) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqBlock.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: extractTextFromRichText(item.answer),
      },
    })),
  }
}

export function generateArticleSchema(post: Partial<Post>, locale: string = 'fr') {
  const siteUrl = SITE_URL()
  const postUrl = `${siteUrl}/${locale !== 'fr' ? locale + '/' : ''}posts/${post.slug}`

  const imageUrl =
    post.meta?.image && typeof post.meta.image === 'object' && 'url' in post.meta.image
      ? `${siteUrl}${post.meta.image.url}`
      : `${siteUrl}/website-template-OG.webp`

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title || post.meta?.title,
    description: post.meta?.description,
    image: imageUrl,
    url: postUrl,
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Organization',
      name: ORGANIZATION_INFO.name,
      url: ORGANIZATION_INFO.url(),
    },
    publisher: {
      '@type': 'Organization',
      name: ORGANIZATION_INFO.name,
      logo: {
        '@type': 'ImageObject',
        url: ORGANIZATION_INFO.logo(),
      },
    },
  }
}

export function generateServiceSchema(page: Partial<Page>, locale: string = 'fr') {
  const siteUrl = SITE_URL()
  const slug = Array.isArray(page.slug) ? page.slug.join('/') : page.slug || ''
  const pageUrl = `${siteUrl}/${locale !== 'fr' ? locale + '/' : ''}${slug}`

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: page.title || page.meta?.title,
    description: page.meta?.description,
    url: pageUrl,
    provider: {
      '@type': 'Organization',
      name: ORGANIZATION_INFO.name,
      url: ORGANIZATION_INFO.url(),
    },
    areaServed: {
      '@type': 'Country',
      name: 'France',
    },
  }
}

export function JsonLdScript({ data }: { data: object | object[] | null }) {
  if (!data) return null

  const jsonLd = Array.isArray(data) ? data : [data]

  return (
    <>
      {jsonLd.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  )
}
