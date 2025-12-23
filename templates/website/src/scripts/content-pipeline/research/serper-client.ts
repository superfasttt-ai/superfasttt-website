/**
 * Serper.dev Client
 * Web search and research capabilities for content enrichment
 */

import fs from 'fs/promises'
import path from 'path'

import { pathsConfig, serperConfig } from '../config'
import type { NewsResult, ResearchCache, ResearchData, SearchResult } from '../types'
import { getCompetitorById } from '../taxonomy'

// ============================================================================
// TYPES
// ============================================================================

interface SerperSearchOptions {
  country?: string
  language?: string
  limit?: number
  type?: 'search' | 'news'
}

interface SerperResponse {
  organic?: Array<{
    title: string
    link: string
    snippet: string
    date?: string
  }>
  news?: Array<{
    title: string
    link: string
    snippet: string
    date?: string
    source?: string
    imageUrl?: string
  }>
}

// ============================================================================
// CACHE MANAGEMENT
// ============================================================================

async function getCachePath(): Promise<string> {
  const cacheDir = path.resolve(process.cwd(), pathsConfig.cache)
  await fs.mkdir(cacheDir, { recursive: true })
  return path.join(cacheDir, 'research-cache.json')
}

async function loadCache(): Promise<Record<string, ResearchCache>> {
  try {
    const cachePath = await getCachePath()
    const content = await fs.readFile(cachePath, 'utf-8')
    return JSON.parse(content)
  } catch {
    return {}
  }
}

async function saveCache(cache: Record<string, ResearchCache>): Promise<void> {
  const cachePath = await getCachePath()
  await fs.writeFile(cachePath, JSON.stringify(cache, null, 2))
}

function getCacheKey(query: string, options: SerperSearchOptions): string {
  return `${query}|${options.country || 'fr'}|${options.language || 'fr'}|${options.type || 'search'}`
}

function isCacheValid(cache: ResearchCache): boolean {
  const expirationDays = serperConfig.cacheExpirationDays
  const expiresAt = new Date(cache.expiresAt)
  return new Date() < expiresAt
}

// ============================================================================
// SERPER CLIENT
// ============================================================================

export class SerperClient {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = serperConfig.apiKey
    this.baseUrl = serperConfig.baseUrl

    if (!this.apiKey) {
      console.warn('⚠️  SERPER_API_KEY not set. Research features will be disabled.')
    }
  }

  /**
   * Check if the client is configured
   */
  isConfigured(): boolean {
    return Boolean(this.apiKey)
  }

  /**
   * Perform a web search
   */
  async search(query: string, options: SerperSearchOptions = {}): Promise<SearchResult[]> {
    if (!this.isConfigured()) {
      console.warn('⚠️  Serper not configured, returning empty results')
      return []
    }

    const cacheKey = getCacheKey(query, options)

    // Check cache
    const cache = await loadCache()
    if (cache[cacheKey] && isCacheValid(cache[cacheKey])) {
      console.log(`📦 Using cached results for: ${query}`)
      return cache[cacheKey].results
    }

    // Make API call
    console.log(`🔍 Searching: ${query}`)

    try {
      const response = await fetch(`${this.baseUrl}/search`, {
        method: 'POST',
        headers: {
          'X-API-KEY': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: query,
          gl: options.country || serperConfig.defaultCountry,
          hl: options.language || serperConfig.defaultLanguage,
          num: options.limit || 10,
        }),
      })

      if (!response.ok) {
        throw new Error(`Serper API error: ${response.status} ${response.statusText}`)
      }

      const data: SerperResponse = await response.json()
      const results = this.parseSearchResults(data)

      // Update cache
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + serperConfig.cacheExpirationDays)

      cache[cacheKey] = {
        query,
        results,
        cachedAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString(),
      }
      await saveCache(cache)

      return results
    } catch (error) {
      console.error(`❌ Search failed for "${query}":`, error)
      return []
    }
  }

  /**
   * Search for news
   */
  async searchNews(query: string, options: SerperSearchOptions = {}): Promise<NewsResult[]> {
    if (!this.isConfigured()) {
      return []
    }

    console.log(`📰 Searching news: ${query}`)

    try {
      const response = await fetch(`${this.baseUrl}/news`, {
        method: 'POST',
        headers: {
          'X-API-KEY': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: query,
          gl: options.country || serperConfig.defaultCountry,
          hl: options.language || serperConfig.defaultLanguage,
          num: options.limit || 10,
        }),
      })

      if (!response.ok) {
        throw new Error(`Serper API error: ${response.status} ${response.statusText}`)
      }

      const data: SerperResponse = await response.json()
      return this.parseNewsResults(data)
    } catch (error) {
      console.error(`❌ News search failed for "${query}":`, error)
      return []
    }
  }

  /**
   * Research a competitor for comparison page
   */
  async researchCompetitor(competitorId: string): Promise<ResearchData> {
    const competitor = getCompetitorById(competitorId)
    if (!competitor) {
      console.warn(`⚠️  Competitor not found: ${competitorId}`)
      return {
        searchResults: [],
        newsResults: [],
        cachedAt: new Date().toISOString(),
      }
    }

    console.log(`🔬 Researching competitor: ${competitor.name}`)

    // Parallel searches
    const [pricingResults, featuresResults, reviewsResults, newsResults] = await Promise.all([
      this.search(`${competitor.name} pricing 2024 enterprise`),
      this.search(`${competitor.name} features enterprise AI`),
      this.search(`${competitor.name} review comparison`),
      this.searchNews(`${competitor.name} AI enterprise`),
    ])

    // Combine and deduplicate
    const allSearchResults = [...pricingResults, ...featuresResults, ...reviewsResults]
    const uniqueResults = this.deduplicateResults(allSearchResults)

    return {
      competitor,
      searchResults: uniqueResults,
      newsResults,
      cachedAt: new Date().toISOString(),
    }
  }

  /**
   * Research a topic for blog post
   */
  async researchTopic(topic: string, locale: string = 'fr'): Promise<ResearchData> {
    console.log(`📚 Researching topic: ${topic}`)

    const language = locale === 'fr' ? 'fr' : locale === 'es' ? 'es' : 'en'
    const country = locale === 'fr' ? 'fr' : locale === 'es' ? 'es' : 'us'

    const [generalResults, statsResults, newsResults] = await Promise.all([
      this.search(topic, { language, country }),
      this.search(`${topic} statistics data 2024`, { language, country }),
      this.searchNews(topic, { language, country }),
    ])

    const allSearchResults = [...generalResults, ...statsResults]
    const uniqueResults = this.deduplicateResults(allSearchResults)

    return {
      searchResults: uniqueResults,
      newsResults,
      cachedAt: new Date().toISOString(),
    }
  }

  /**
   * Research for industry page
   */
  async researchIndustry(industryName: string, locale: string = 'fr'): Promise<ResearchData> {
    console.log(`🏭 Researching industry: ${industryName}`)

    const language = locale === 'fr' ? 'fr' : locale === 'es' ? 'es' : 'en'
    const country = locale === 'fr' ? 'fr' : locale === 'es' ? 'es' : 'us'

    const [regulationResults, trendsResults, newsResults] = await Promise.all([
      this.search(`${industryName} réglementation IA 2024`, { language, country }),
      this.search(`${industryName} tendances IA entreprise`, { language, country }),
      this.searchNews(`${industryName} intelligence artificielle`, { language, country, limit: 5 }),
    ])

    const allSearchResults = [...regulationResults, ...trendsResults]
    const uniqueResults = this.deduplicateResults(allSearchResults)

    return {
      searchResults: uniqueResults,
      newsResults,
      cachedAt: new Date().toISOString(),
    }
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  private parseSearchResults(data: SerperResponse): SearchResult[] {
    if (!data.organic) return []

    return data.organic.map((item) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
      date: item.date,
    }))
  }

  private parseNewsResults(data: SerperResponse): NewsResult[] {
    if (!data.news) return []

    return data.news.map((item) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
      date: item.date,
      source: item.source || 'Unknown',
      imageUrl: item.imageUrl,
    }))
  }

  private deduplicateResults(results: SearchResult[]): SearchResult[] {
    const seen = new Set<string>()
    return results.filter((result) => {
      if (seen.has(result.link)) return false
      seen.add(result.link)
      return true
    })
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let clientInstance: SerperClient | null = null

/**
 * Get or create a singleton Serper client instance
 */
export function getSerperClient(): SerperClient {
  if (!clientInstance) {
    clientInstance = new SerperClient()
  }
  return clientInstance
}

/**
 * Format research data for prompt injection
 */
export function formatResearchForPrompt(research: ResearchData): string {
  if (research.searchResults.length === 0 && research.newsResults.length === 0) {
    return 'Aucune recherche disponible.'
  }

  const sections: string[] = []

  if (research.competitor) {
    sections.push(`## Concurrent: ${research.competitor.name}`)
    sections.push(`Site web: ${research.competitor.website}`)
    sections.push(`Catégorie: ${research.competitor.category}`)
    sections.push(`Pricing: ${research.competitor.pricing}`)
  }

  if (research.searchResults.length > 0) {
    sections.push('\n## Sources web')
    research.searchResults.slice(0, 5).forEach((result, i) => {
      sections.push(`${i + 1}. [${result.title}](${result.link})`)
      sections.push(`   ${result.snippet}`)
    })
  }

  if (research.newsResults.length > 0) {
    sections.push('\n## Actualités récentes')
    research.newsResults.slice(0, 3).forEach((news, i) => {
      sections.push(`${i + 1}. [${news.title}](${news.link}) - ${news.source}`)
      if (news.date) sections.push(`   Date: ${news.date}`)
    })
  }

  return sections.join('\n')
}
