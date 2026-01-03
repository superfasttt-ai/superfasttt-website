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
// ICON VALIDATION
// ============================================================================

const FEATURE_GRID_ICONS = [
  'brain',
  'database',
  'cloud',
  'shield',
  'users',
  'zap',
  'code',
  'globe',
  'lock',
  'layers',
  'settings',
  'chart',
] as const

const PRODUCT_SHOWCASE_ICONS = [
  'brain',
  'users',
  'layers',
  'cloud',
  'zap',
  'shield',
  'headphones',
  'database',
  'code',
  'globe',
  'lock',
  'settings',
  'chart',
  'rocket',
  'terminal',
  'workflow',
] as const

const TRUST_INDICATOR_ICONS = ['shield', 'globe', 'lock', 'check', 'star', 'zap'] as const

type FeatureGridIcon = (typeof FEATURE_GRID_ICONS)[number]
type ProductShowcaseIcon = (typeof PRODUCT_SHOWCASE_ICONS)[number]
type TrustIndicatorIcon = (typeof TRUST_INDICATOR_ICONS)[number]

const ICON_MAPPINGS: Record<string, string> = {
  // Common mappings for invalid icons
  search: 'globe',
  file: 'database',
  document: 'database',
  folder: 'layers',
  check: 'shield',
  checkmark: 'shield',
  star: 'zap',
  lightning: 'zap',
  bolt: 'zap',
  gear: 'settings',
  cog: 'settings',
  server: 'database',
  storage: 'database',
  network: 'cloud',
  api: 'code',
  integration: 'layers',
  connect: 'cloud',
  link: 'cloud',
  refresh: 'zap',
  sync: 'cloud',
  upload: 'cloud',
  download: 'cloud',
  analytics: 'chart',
  graph: 'chart',
  metrics: 'chart',
  dashboard: 'chart',
  report: 'chart',
  key: 'lock',
  security: 'shield',
  protect: 'shield',
  safe: 'shield',
  team: 'users',
  people: 'users',
  group: 'users',
  person: 'users',
  user: 'users',
  ai: 'brain',
  intelligence: 'brain',
  neural: 'brain',
  learning: 'brain',
  model: 'brain',
  cpu: 'brain',
  chip: 'brain',
  fast: 'zap',
  speed: 'zap',
  quick: 'zap',
  performance: 'zap',
  world: 'globe',
  earth: 'globe',
  international: 'globe',
  language: 'globe',
  translation: 'globe',
  stack: 'layers',
  module: 'layers',
  component: 'layers',
  block: 'layers',
  box: 'layers',
  package: 'layers',
  terminal: 'terminal',
  console: 'terminal',
  cli: 'terminal',
  command: 'terminal',
  launch: 'rocket',
  deploy: 'rocket',
  start: 'rocket',
  automation: 'workflow',
  process: 'workflow',
  flow: 'workflow',
  pipeline: 'workflow',
  support: 'headphones',
  help: 'headphones',
  service: 'headphones',
  customer: 'headphones',
}

function validateFeatureGridIcon(icon: string): FeatureGridIcon {
  const lowerIcon = icon?.toLowerCase() || ''
  if (FEATURE_GRID_ICONS.includes(lowerIcon as FeatureGridIcon)) {
    return lowerIcon as FeatureGridIcon
  }
  const mapped = ICON_MAPPINGS[lowerIcon]
  if (mapped && FEATURE_GRID_ICONS.includes(mapped as FeatureGridIcon)) {
    return mapped as FeatureGridIcon
  }
  return 'brain' // default fallback
}

function validateProductShowcaseIcon(icon: string): ProductShowcaseIcon {
  const lowerIcon = icon?.toLowerCase() || ''
  if (PRODUCT_SHOWCASE_ICONS.includes(lowerIcon as ProductShowcaseIcon)) {
    return lowerIcon as ProductShowcaseIcon
  }
  const mapped = ICON_MAPPINGS[lowerIcon]
  if (mapped && PRODUCT_SHOWCASE_ICONS.includes(mapped as ProductShowcaseIcon)) {
    return mapped as ProductShowcaseIcon
  }
  return 'brain' // default fallback
}

function validateTrustIndicatorIcon(icon: string): TrustIndicatorIcon {
  const lowerIcon = icon?.toLowerCase() || ''
  if (TRUST_INDICATOR_ICONS.includes(lowerIcon as TrustIndicatorIcon)) {
    return lowerIcon as TrustIndicatorIcon
  }
  const mapped = ICON_MAPPINGS[lowerIcon]
  if (mapped && TRUST_INDICATOR_ICONS.includes(mapped as TrustIndicatorIcon)) {
    return mapped as TrustIndicatorIcon
  }
  return 'shield' // default fallback
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
          trustIndicators: block.trustIndicators
            ? {
                headline: '',
                indicators: (Array.isArray(block.trustIndicators)
                  ? block.trustIndicators
                  : block.trustIndicators.indicators || []
                ).map((indicator: any) => ({
                  icon: validateTrustIndicatorIcon(indicator.icon),
                  label: indicator.text || indicator.label,
                })),
              }
            : undefined,
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
            icon: validateFeatureGridIcon(feature.icon),
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
            icon: item.icon ? validateProductShowcaseIcon(item.icon) : undefined,
            features: item.keyFeatures?.map((kf) => ({ text: kf.feature })),
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

      case 'faq':
        return {
          blockType: 'faq',
          blockName: block.blockName,
          badge: block.badge,
          title: block.title,
          description: block.description,
          items: block.items.map((item) => ({
            question: item.question,
            answer: item.answer,
          })),
          allowMultipleOpen: block.allowMultipleOpen ?? false,
        }

      default:
        return block
    }
  })
}

/**
 * Get URL prefix for content type
 * NOTE: This is now deprecated - slugs from taxonomy already include the prefix
 * Kept for backward compatibility with old content
 */
function getUrlPrefix(_type: ContentType, _locale: Locale): string {
  // Slugs in taxonomy now include the full path (e.g., 'produit/rag', 'solutions/sante')
  // No additional prefix needed
  return ''
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
