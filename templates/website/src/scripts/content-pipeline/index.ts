/**
 * Content Pipeline
 * Main orchestrator for AI content generation
 */

import type { Payload } from 'payload'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { validateConfig } from './config'
import { getPageGenerator } from './generators/page-generator'
import { createPagePublisher, type PagePublisher } from './publishers/page-publisher'
import { getRegistry } from './registry/content-registry'
import { getIndustryById, getMetierById, getServiceById, printTaxonomySummary } from './taxonomy'
import type {
  ContentType,
  GeneratedPage,
  GenerationOptions,
  GenerationResult,
  Locale,
  RegistryPage,
} from './types'
import { addFAQToPage, generateFAQForPage, type PageContent } from '../add-faq-to-page'

// Re-export types and utilities
export * from './types'
export * from './config'
export { getClaudeClient } from './ai/client'
export { getPromptLoader } from './ai/prompt-loader'
export { getSerperClient } from './research/serper-client'
export { getPageGenerator } from './generators/page-generator'
export { createPagePublisher } from './publishers/page-publisher'
export { getRegistry } from './registry/content-registry'
export * from './taxonomy'

// ============================================================================
// CONTENT PIPELINE
// ============================================================================

export class ContentPipeline {
  private generator = getPageGenerator()
  private registry = getRegistry()
  private payload: Payload | null = null
  private publisher: PagePublisher | null = null

  /**
   * Initialize the pipeline
   */
  async initialize(): Promise<void> {
    console.log('\n🚀 Initializing Content Pipeline...\n')

    // Validate configuration
    validateConfig()

    // Initialize Payload
    this.payload = await getPayload({ config: configPromise })
    this.publisher = createPagePublisher(this.payload)
    console.log('✅ Payload CMS initialized\n')

    // Load registry
    await this.registry.load()

    // Print taxonomy summary
    printTaxonomySummary()
  }

  /**
   * Generate content based on options
   */
  async generate(options: GenerationOptions): Promise<GenerationResult[]> {
    const results: GenerationResult[] = []
    const { locales, types, ids, batch, priority, limit = 10, dryRun } = options

    // Get pages to generate
    let pages: RegistryPage[] = []

    if (ids && ids.length > 0) {
      // Generate specific pages
      for (const id of ids) {
        const page = await this.registry.getPage(id)
        if (page) pages.push(page)
      }
    } else {
      // Get next pages based on filters
      pages = await this.registry.getNextToGenerate(limit)

      // Filter by type if specified
      if (types && types.length > 0) {
        pages = pages.filter((p) => types.includes(p.type))
      }

      // Filter by batch if specified
      if (batch !== undefined) {
        pages = pages.filter((p) => p.batch === batch)
      }

      // Filter by priority if specified
      if (priority) {
        pages = pages.filter((p) => p.priority === priority)
      }
    }

    if (pages.length === 0) {
      console.log('ℹ️  No pages to generate')
      return results
    }

    console.log(`\n📄 Found ${pages.length} pages to generate\n`)

    // Generate each page
    for (const page of pages) {
      for (const locale of locales) {
        // Skip if already generated for this locale
        if (page.status[locale] !== 'pending') {
          console.log(`⏭️  Skipping ${page.id} (${locale}) - already ${page.status[locale]}`)
          continue
        }

        if (dryRun) {
          console.log(`🔍 [DRY RUN] Would generate: ${page.id} (${locale})`)
          continue
        }

        try {
          // Update status to generating
          await this.registry.updateStatus(page.id, locale, 'generating')

          // Generate based on type
          const result = await this.generatePage(page, locale, options)
          results.push(result)

          // Update status
          await this.registry.updateStatus(page.id, locale, 'generated')

          console.log(`✅ Generated: ${page.title[locale]} (${locale}) in ${result.duration}ms`)
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error)
          await this.registry.setError(page.id, locale, errorMessage)
          console.error(`❌ Failed: ${page.id} (${locale}) - ${errorMessage}`)
        }
      }
    }

    // Save registry
    await this.registry.save()

    return results
  }

  /**
   * Generate a single page
   */
  private async generatePage(
    page: RegistryPage,
    locale: Locale,
    options: GenerationOptions,
  ): Promise<GenerationResult> {
    const genOptions = {
      includeResearch: options.includeResearch,
      generateImageBriefs: options.generateImageBriefs,
    }

    let generatedPage: GeneratedPage
    let duration: number

    switch (page.type) {
      case 'service': {
        const service = getServiceById(page.id)
        if (!service) throw new Error(`Service not found: ${page.id}`)
        const result = await this.generator.generateServicePage(service, locale, genOptions)
        generatedPage = result.page
        duration = result.duration
        break
      }

      case 'industry': {
        const industry = getIndustryById(page.id)
        if (!industry) throw new Error(`Industry not found: ${page.id}`)
        const result = await this.generator.generateIndustryPage(industry, locale, genOptions)
        generatedPage = result.page
        duration = result.duration
        break
      }

      case 'metier': {
        const metier = getMetierById(page.id)
        if (!metier) throw new Error(`Metier not found: ${page.id}`)
        const result = await this.generator.generateMetierPage(metier, locale, genOptions)
        generatedPage = result.page
        duration = result.duration
        break
      }

      default:
        throw new Error(`Unsupported content type: ${page.type}`)
    }

    // Publish to Payload CMS
    let payloadId: string | undefined
    if (this.publisher) {
      const publishResult = await this.publisher.publishPage(generatedPage, locale, {
        asDraft: options.asDraft ?? true,
        disableRevalidate: true,
      })

      if (!publishResult.success) {
        throw new Error(`Failed to publish: ${publishResult.error}`)
      }

      payloadId = publishResult.payloadId
      console.log(`📤 Published to Payload: ${generatedPage.title} (ID: ${payloadId})`)

      // Generate FAQ if option enabled
      if (options.withFaq && payloadId && this.payload) {
        console.log(`🔄 Generating FAQ for: ${generatedPage.title}`)
        try {
          // Fetch the published page to get its content
          const publishedPage = await this.payload.findByID({
            collection: 'pages',
            id: payloadId,
            locale,
          })

          if (publishedPage) {
            const pageContent: PageContent = {
              id: payloadId,
              title: publishedPage.title as string,
              slug: publishedPage.slug as string,
              layout: (publishedPage.layout as any[]) || [],
              meta: publishedPage.meta as any,
            }

            const faq = await generateFAQForPage(pageContent, locale)
            if (faq) {
              const faqAdded = await addFAQToPage(this.payload, payloadId, faq, locale)
              if (faqAdded) {
                console.log(`✅ FAQ added to: ${generatedPage.title}`)
              }
            }
          }
        } catch (faqError) {
          console.error(`⚠️ Failed to generate FAQ (page still created): ${faqError}`)
        }
      }
    }

    return {
      success: true,
      pageId: page.id,
      slug: generatedPage.slug,
      locale,
      duration,
    }
  }

  /**
   * Show current status
   */
  async status(): Promise<void> {
    await this.registry.printStatus()
  }

  /**
   * Show errors
   */
  async showErrors(): Promise<void> {
    const errors = await this.registry.getErrors()

    if (errors.length === 0) {
      console.log('✅ No errors found')
      return
    }

    console.log(`\n❌ Found ${errors.length} errors:\n`)
    errors.forEach((error, i) => {
      console.log(`${i + 1}. ${error.id} (${error.locale}): ${error.error}`)
    })
  }

  /**
   * Reset errors for retry
   */
  async resetErrors(): Promise<void> {
    const count = await this.registry.resetErrors()
    console.log(`🔄 Reset ${count} errors to pending`)
  }
}

// ============================================================================
// CLI HELPERS
// ============================================================================

/**
 * Parse command line arguments
 */
export function parseArgs(args: string[]): Partial<GenerationOptions> {
  const options: Partial<GenerationOptions> = {
    locales: ['fr'],
    dryRun: false,
    asDraft: true,
    includeResearch: true,
    generateImageBriefs: true,
    withFaq: false,
  }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    if (arg === '--dry-run') {
      options.dryRun = true
    } else if (arg === '--all-locales') {
      options.locales = ['fr', 'en', 'es']
    } else if (arg.startsWith('--locale=')) {
      options.locales = [arg.split('=')[1] as Locale]
    } else if (arg.startsWith('--type=')) {
      const type = arg.split('=')[1] as ContentType
      options.types = [type]
    } else if (arg.startsWith('--id=')) {
      const id = arg.split('=')[1]
      options.ids = [id]
    } else if (arg.startsWith('--batch=')) {
      options.batch = parseInt(arg.split('=')[1], 10)
    } else if (arg.startsWith('--priority=')) {
      options.priority = arg.split('=')[1] as 'high' | 'medium' | 'normal' | 'low'
    } else if (arg.startsWith('--limit=')) {
      options.limit = parseInt(arg.split('=')[1], 10)
    } else if (arg === '--no-research') {
      options.includeResearch = false
    } else if (arg === '--no-images') {
      options.generateImageBriefs = false
    } else if (arg === '--publish') {
      options.asDraft = false
    } else if (arg === '--with-faq') {
      options.withFaq = true
    }
  }

  return options
}

// ============================================================================
// MAIN ENTRY POINT
// ============================================================================

/**
 * Create and initialize a ContentPipeline instance
 */
export async function createPipeline(): Promise<ContentPipeline> {
  const pipeline = new ContentPipeline()
  await pipeline.initialize()
  return pipeline
}
