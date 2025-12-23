/**
 * Page Generator
 * Generates pages using Claude API and taxonomy data
 */

import { getClaudeClient } from '../ai/client'
import { buildPageGenerationPrompt } from '../ai/prompt-loader'
import { getBriefForPrompt } from '../briefs/product-brief'
import { formatResearchForPrompt, getSerperClient } from '../research/serper-client'
import { getRelatedPages } from '../taxonomy'
import type {
  ContentType,
  GeneratedPage,
  ImageBriefPosition,
  IndustryTaxonomy,
  Locale,
  MetierTaxonomy,
  PageImageBriefs,
  ServiceTaxonomy,
} from '../types'

// ============================================================================
// TYPES
// ============================================================================

export interface GenerationOptions {
  includeResearch?: boolean
  generateImageBriefs?: boolean
}

export interface GenerationResult {
  page: GeneratedPage
  imageBriefs?: PageImageBriefs
  tokensUsed: {
    input: number
    output: number
  }
  duration: number
}

// ============================================================================
// PAGE GENERATOR
// ============================================================================

export class PageGenerator {
  private claude = getClaudeClient()
  private serper = getSerperClient()

  /**
   * Generate a service page
   */
  async generateServicePage(
    service: ServiceTaxonomy,
    locale: Locale,
    options: GenerationOptions = {},
  ): Promise<GenerationResult> {
    const startTime = Date.now()

    // Get related pages for internal linking
    const relatedPages = getRelatedPages('service', service.id, locale)

    // Build prompt variables
    const variables = {
      productBrief: getBriefForPrompt(locale),
      serviceName: service.title[locale],
      serviceDescription: service.description[locale],
      serviceCategory: service.parentId || 'main',
      seoKeywords: service.seoKeywords[locale],
      relatedPages: JSON.stringify(relatedPages, null, 2),
    }

    // Build prompts
    const { systemPrompt, userPrompt } = await buildPageGenerationPrompt(
      'service',
      locale,
      variables,
    )

    // Generate content
    const response = await this.claude.generateJson<GeneratedPage>(systemPrompt, userPrompt, {
      maxTokens: 10096,
      temperature: 0.6,
    })

    // Generate image briefs if requested
    let imageBriefs: PageImageBriefs | undefined
    if (options.generateImageBriefs) {
      imageBriefs = await this.generateImageBriefs(
        service.id,
        service.title[locale],
        'service',
        service.seoKeywords[locale],
      )
    }

    return {
      page: {
        ...response.content,
        id: service.id,
        type: 'service',
        slug: service.slug[locale],
      },
      imageBriefs,
      tokensUsed: response.usage,
      duration: Date.now() - startTime,
    }
  }

  /**
   * Generate an industry page
   */
  async generateIndustryPage(
    industry: IndustryTaxonomy,
    locale: Locale,
    options: GenerationOptions = {},
  ): Promise<GenerationResult> {
    const startTime = Date.now()

    // Research if enabled
    let researchData = ''
    if (options.includeResearch && this.serper.isConfigured()) {
      const research = await this.serper.researchIndustry(industry.title.fr, locale)
      researchData = formatResearchForPrompt(research)
    }

    // Get related pages
    const relatedPages = getRelatedPages('industry', industry.id, locale)

    // Build prompt variables
    const variables = {
      productBrief: getBriefForPrompt(locale),
      industryName: industry.title[locale],
      industryDescription: industry.description[locale],
      regulations: industry.regulations.join(', '),
      certifications: industry.certifications.join(', '),
      seoKeywords: industry.seoKeywords[locale],
      relatedPages: JSON.stringify(relatedPages, null, 2),
      researchSources: researchData || 'Pas de recherche disponible',
    }

    // Build prompts
    const { systemPrompt, userPrompt } = await buildPageGenerationPrompt(
      'industry',
      locale,
      variables,
    )

    // Generate content
    const response = await this.claude.generateJson<GeneratedPage>(systemPrompt, userPrompt, {
      maxTokens: 4096,
      temperature: 0.7,
    })

    // Generate image briefs if requested
    let imageBriefs: PageImageBriefs | undefined
    if (options.generateImageBriefs) {
      imageBriefs = await this.generateImageBriefs(
        industry.id,
        industry.title[locale],
        'industry',
        industry.seoKeywords[locale],
      )
    }

    return {
      page: {
        ...response.content,
        id: industry.id,
        type: 'industry',
        slug: industry.slug[locale],
      },
      imageBriefs,
      tokensUsed: response.usage,
      duration: Date.now() - startTime,
    }
  }

  /**
   * Generate a metier page
   */
  async generateMetierPage(
    metier: MetierTaxonomy,
    locale: Locale,
    options: GenerationOptions = {},
  ): Promise<GenerationResult> {
    const startTime = Date.now()

    // Get related pages
    const relatedPages = getRelatedPages('metier', metier.id, locale)

    // Build prompt variables
    const variables = {
      productBrief: getBriefForPrompt(locale),
      metierName: metier.title[locale],
      metierDescription: metier.description[locale],
      painPoints: metier.painPoints.join(', '),
      kpis: metier.kpis.join(', '),
      seoKeywords: metier.seoKeywords[locale],
      relatedPages: JSON.stringify(relatedPages, null, 2),
    }

    // Build prompts
    const { systemPrompt, userPrompt } = await buildPageGenerationPrompt(
      'metier',
      locale,
      variables,
    )

    // Generate content
    const response = await this.claude.generateJson<GeneratedPage>(systemPrompt, userPrompt, {
      maxTokens: 4096,
      temperature: 0.7,
    })

    // Generate image briefs if requested
    let imageBriefs: PageImageBriefs | undefined
    if (options.generateImageBriefs) {
      imageBriefs = await this.generateImageBriefs(
        metier.id,
        metier.title[locale],
        'metier',
        metier.seoKeywords[locale],
      )
    }

    return {
      page: {
        ...response.content,
        id: metier.id,
        type: 'metier',
        slug: metier.slug[locale],
      },
      imageBriefs,
      tokensUsed: response.usage,
      duration: Date.now() - startTime,
    }
  }

  /**
   * Generate image briefs for a page
   */
  private async generateImageBriefs(
    pageId: string,
    pageTitle: string,
    pageType: ContentType,
    keywords: string,
  ): Promise<PageImageBriefs> {
    const { systemPrompt, userPrompt } = await import('../ai/prompt-loader').then((m) =>
      m.buildImageBriefPrompt({
        pageId,
        pageTitle,
        pageType,
        mainTheme: pageTitle,
        keywords,
      }),
    )

    const response = await this.claude.generateJson<{ images: ImageBriefPosition[] }>(
      systemPrompt,
      userPrompt,
      {
        maxTokens: 2048,
        temperature: 0.8,
      },
    )

    return {
      pageId,
      pageTitle,
      images: response.content.images || [],
    }
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let generatorInstance: PageGenerator | null = null

/**
 * Get or create a singleton PageGenerator instance
 */
export function getPageGenerator(): PageGenerator {
  if (!generatorInstance) {
    generatorInstance = new PageGenerator()
  }
  return generatorInstance
}
