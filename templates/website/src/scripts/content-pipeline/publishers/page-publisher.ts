/**
 * Page Publisher
 * Publishes generated pages to PayloadCMS
 */

import type { Payload } from 'payload'

import type { ContentType, GeneratedPage, Locale } from '../types'

// ============================================================================
// TYPES
// ============================================================================

export interface PublishOptions {
  asDraft?: boolean
  disableRevalidate?: boolean
}

export interface PublishResult {
  success: boolean
  payloadId?: string
  error?: string
  isNew: boolean
}

// ============================================================================
// BLOCK TRANSFORMERS
// ============================================================================

/**
 * Transform generated blocks to Payload format
 */
function transformBlocks(layout: GeneratedPage['layout']): any[] {
  return layout.map((block) => {
    switch (block.blockType) {
      case 'heroModern':
        return {
          blockType: 'heroModern',
          blockName: block.blockName,
          badge: block.badge,
          title: block.title,
          highlightedText: block.highlightedText,
          description: block.description,
          links: block.links?.map((link) => ({
            link: {
              type: link.link.type,
              label: link.link.label,
              url: link.link.url,
            },
          })),
          trustIndicators: block.trustIndicators?.map((indicator) => ({
            icon: indicator.icon,
            text: indicator.text,
          })),
        }

      case 'featureGrid':
        return {
          blockType: 'featureGrid',
          blockName: block.blockName,
          badge: block.badge,
          title: block.title,
          description: block.description,
          columns: block.columns,
          features: block.features.map((feature) => ({
            icon: feature.icon,
            title: feature.title,
            description: feature.description,
          })),
        }

      case 'productShowcase':
        return {
          blockType: 'productShowcase',
          blockName: block.blockName,
          badge: block.badge,
          title: block.title,
          description: block.description,
          layout: block.layout,
          items: block.items.map((item) => ({
            title: item.title,
            description: item.description,
            icon: item.icon,
            animationType: item.animationType,
            keyFeatures: item.keyFeatures?.map((kf) => ({ feature: kf.feature })),
          })),
        }

      case 'sectorCards':
        return {
          blockType: 'sectorCards',
          blockName: block.blockName,
          badge: block.badge,
          title: block.title,
          description: block.description,
          sectors: block.sectors.map((sector) => ({
            icon: sector.icon,
            title: sector.title,
            description: sector.description,
            keyPoints: sector.keyPoints?.map((kp) => ({ point: kp.point })),
          })),
        }

      case 'statsSection':
        return {
          blockType: 'statsSection',
          blockName: block.blockName,
          badge: block.badge,
          title: block.title,
          description: block.description,
          variant: block.variant,
          stats: block.stats.map((stat) => ({
            value: stat.value,
            label: stat.label,
            description: stat.description,
          })),
        }

      case 'ctaModern':
        return {
          blockType: 'ctaModern',
          blockName: block.blockName,
          title: block.title,
          description: block.description,
          variant: block.variant,
          links: block.links?.map((link) => ({
            link: {
              type: link.link.type,
              label: link.link.label,
              url: link.link.url,
            },
          })),
        }

      case 'content':
        return {
          blockType: 'content',
          blockName: block.blockName,
          columns: block.columns.map((col) => ({
            size: col.size,
            richText: col.richText,
          })),
        }

      default:
        return block
    }
  })
}

/**
 * Get URL prefix for content type
 */
function getUrlPrefix(type: ContentType, locale: Locale): string {
  const prefixes: Record<ContentType, Record<Locale, string>> = {
    service: { fr: '/services', en: '/en/services', es: '/es/servicios' },
    industry: { fr: '/secteurs', en: '/en/industries', es: '/es/sectores' },
    metier: { fr: '/metiers', en: '/en/roles', es: '/es/profesiones' },
    usecase: { fr: '/cas-usage', en: '/en/use-cases', es: '/es/casos-uso' },
    comparison: { fr: '/comparatifs', en: '/en/comparisons', es: '/es/comparativas' },
    'blog-post': { fr: '/blog', en: '/en/blog', es: '/es/blog' },
  }
  return prefixes[type]?.[locale] || ''
}

// ============================================================================
// PAGE PUBLISHER
// ============================================================================

export class PagePublisher {
  private payload: Payload

  constructor(payload: Payload) {
    this.payload = payload
  }

  /**
   * Publish a generated page to Payload
   */
  async publishPage(
    page: GeneratedPage,
    locale: Locale,
    options: PublishOptions = {},
  ): Promise<PublishResult> {
    const { asDraft = true, disableRevalidate = true } = options

    try {
      // Check if page already exists
      const existing = await this.findExistingPage(page.slug, locale)

      const urlPrefix = getUrlPrefix(page.type, locale)
      const fullSlug = `${urlPrefix}/${page.slug}`.replace(/\/+/g, '/')

      // Prepare page data
      const pageData = {
        title: page.title,
        slug: fullSlug,
        layout: transformBlocks(page.layout),
        meta: {
          title: page.meta.title,
          description: page.meta.description,
        },
        _status: asDraft ? 'draft' : 'published',
      }

      let result: any

      if (existing) {
        // Update existing page
        result = await this.payload.update({
          collection: 'pages',
          id: existing.id,
          locale,
          data: pageData as any,
          context: {
            disableRevalidate,
          },
        })

        console.log(`📝 Updated page: ${page.title} (${locale})`)
      } else {
        // Create new page
        result = await this.payload.create({
          collection: 'pages',
          locale,
          data: pageData as any,
          context: {
            disableRevalidate,
          },
        })

        console.log(`✨ Created page: ${page.title} (${locale})`)
      }

      return {
        success: true,
        payloadId: result.id,
        isNew: !existing,
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error(`❌ Failed to publish page: ${page.title} (${locale})`, errorMessage)

      return {
        success: false,
        error: errorMessage,
        isNew: false,
      }
    }
  }

  /**
   * Publish a localized version of an existing page
   */
  async publishLocalization(
    existingId: string,
    page: GeneratedPage,
    locale: Locale,
    options: PublishOptions = {},
  ): Promise<PublishResult> {
    const { asDraft = true, disableRevalidate = true } = options

    try {
      const urlPrefix = getUrlPrefix(page.type, locale)
      const fullSlug = `${urlPrefix}/${page.slug}`.replace(/\/+/g, '/')

      const pageData = {
        title: page.title,
        slug: fullSlug,
        layout: transformBlocks(page.layout),
        meta: {
          title: page.meta.title,
          description: page.meta.description,
        },
        _status: asDraft ? 'draft' : 'published',
      }

      const result = await this.payload.update({
        collection: 'pages',
        id: existingId,
        locale,
        data: pageData as any,
        context: {
          disableRevalidate,
        },
      })

      console.log(`🌍 Added ${locale} localization: ${page.title}`)

      return {
        success: true,
        payloadId: result.id,
        isNew: false,
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error(`❌ Failed to add localization: ${page.title} (${locale})`, errorMessage)

      return {
        success: false,
        error: errorMessage,
        isNew: false,
      }
    }
  }

  /**
   * Find existing page by slug
   */
  private async findExistingPage(slug: string, locale: Locale): Promise<{ id: string } | null> {
    try {
      const result = await this.payload.find({
        collection: 'pages',
        locale,
        where: {
          slug: {
            contains: slug,
          },
        },
        limit: 1,
      })

      if (result.docs.length > 0) {
        return { id: result.docs[0].id as string }
      }

      return null
    } catch {
      return null
    }
  }

  /**
   * Publish FAQ to a separate collection (if exists)
   */
  async publishFAQ(pageId: string, faq: GeneratedPage['faq'], locale: Locale): Promise<void> {
    // Check if FAQ collection exists
    const collections = Object.keys(this.payload.collections)
    if (!collections.includes('faq')) {
      console.log('ℹ️  FAQ collection not found, skipping FAQ publish')
      return
    }

    try {
      for (const item of faq) {
        await this.payload.create({
          collection: 'faq' as any,
          locale,
          data: {
            question: item.question,
            answer: item.answer,
            keywords: item.keywords,
            relatedPage: pageId,
          } as any,
        })
      }
      console.log(`📋 Published ${faq.length} FAQ items`)
    } catch (error) {
      console.warn('⚠️  Failed to publish FAQ items:', error)
    }
  }
}

// ============================================================================
// FACTORY FUNCTION
// ============================================================================

/**
 * Create a PagePublisher instance
 */
export function createPagePublisher(payload: Payload): PagePublisher {
  return new PagePublisher(payload)
}
