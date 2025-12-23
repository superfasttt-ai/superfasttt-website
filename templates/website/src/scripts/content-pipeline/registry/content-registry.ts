/**
 * Content Registry
 * Tracks generation progress and page status
 */

import fs from 'fs/promises'
import path from 'path'

import { pathsConfig } from '../config'
import { competitors, industries, metiers, services } from '../taxonomy'
import type {
  ContentRegistry,
  ContentStatus,
  ContentType,
  Locale,
  Priority,
  RegistryPage,
} from '../types'

// ============================================================================
// REGISTRY PATH
// ============================================================================

function getRegistryPath(): string {
  return path.resolve(process.cwd(), pathsConfig.registry, 'content-registry.json')
}

// ============================================================================
// REGISTRY MANAGER
// ============================================================================

export class RegistryManager {
  private registry: ContentRegistry | null = null

  /**
   * Load registry from file
   */
  async load(): Promise<ContentRegistry> {
    if (this.registry) return this.registry

    try {
      const content = await fs.readFile(getRegistryPath(), 'utf-8')
      this.registry = JSON.parse(content)
      return this.registry!
    } catch {
      // Initialize empty registry
      this.registry = this.initializeRegistry()
      await this.save()
      return this.registry
    }
  }

  /**
   * Save registry to file
   */
  async save(): Promise<void> {
    if (!this.registry) return

    // Update metadata
    this.registry.metadata.lastUpdated = new Date().toISOString()
    this.registry.metadata.totalPages = this.registry.pages.length
    this.registry.metadata.generated = this.countByStatus('generated')
    this.registry.metadata.pending = this.countByStatus('pending')
    this.registry.metadata.reviewed = this.countByStatus('reviewed')
    this.registry.metadata.published = this.countByStatus('published')
    this.registry.metadata.errors = this.countByStatus('error')

    const registryPath = getRegistryPath()
    await fs.mkdir(path.dirname(registryPath), { recursive: true })
    await fs.writeFile(registryPath, JSON.stringify(this.registry, null, 2))
  }

  /**
   * Initialize registry from taxonomy
   */
  private initializeRegistry(): ContentRegistry {
    const pages: RegistryPage[] = []

    // Add services
    services.forEach((service) => {
      pages.push(
        this.createRegistryPage(
          service.id,
          'service',
          service.slug,
          service.title,
          service.priority,
          service.batch,
        ),
      )
    })

    // Add industries
    industries.forEach((industry) => {
      pages.push(
        this.createRegistryPage(
          industry.id,
          'industry',
          industry.slug,
          industry.title,
          industry.priority,
          industry.batch,
        ),
      )
    })

    // Add metiers
    metiers.forEach((metier) => {
      pages.push(
        this.createRegistryPage(
          metier.id,
          'metier',
          metier.slug,
          metier.title,
          metier.priority,
          metier.batch,
        ),
      )
    })

    // Add comparisons
    competitors.forEach((competitor) => {
      pages.push(
        this.createRegistryPage(
          `comparison-${competitor.id}`,
          'comparison',
          {
            fr: `superfasttt-vs-${competitor.id}`,
            en: `superfasttt-vs-${competitor.id}`,
            es: `superfasttt-vs-${competitor.id}`,
          },
          {
            fr: `SUPERFASTTT vs ${competitor.name}`,
            en: `SUPERFASTTT vs ${competitor.name}`,
            es: `SUPERFASTTT vs ${competitor.name}`,
          },
          'medium',
          2,
        ),
      )
    })

    return {
      metadata: {
        lastUpdated: new Date().toISOString(),
        totalPages: pages.length,
        generated: 0,
        pending: pages.length,
        reviewed: 0,
        published: 0,
        errors: 0,
      },
      pages,
    }
  }

  private createRegistryPage(
    id: string,
    type: ContentType,
    slug: { fr: string; en: string; es: string },
    title: { fr: string; en: string; es: string },
    priority: Priority,
    batch: number,
  ): RegistryPage {
    return {
      id,
      type,
      slug,
      title,
      status: { fr: 'pending', en: 'pending', es: 'pending' },
      priority,
      batch,
    }
  }

  private countByStatus(status: ContentStatus): number {
    if (!this.registry) return 0

    let count = 0
    this.registry.pages.forEach((page) => {
      if (page.status.fr === status) count++
      if (page.status.en === status) count++
      if (page.status.es === status) count++
    })
    return count
  }

  // ============================================================================
  // PAGE OPERATIONS
  // ============================================================================

  /**
   * Get page by ID
   */
  async getPage(id: string): Promise<RegistryPage | undefined> {
    const registry = await this.load()
    return registry.pages.find((p) => p.id === id)
  }

  /**
   * Update page status
   */
  async updateStatus(
    id: string,
    locale: Locale,
    status: ContentStatus,
    payloadId?: string,
  ): Promise<void> {
    const registry = await this.load()
    const page = registry.pages.find((p) => p.id === id)

    if (page) {
      page.status[locale] = status

      if (payloadId) {
        if (!page.payloadId) page.payloadId = {}
        page.payloadId[locale] = payloadId
      }

      if (status === 'generated') {
        page.generatedAt = new Date().toISOString()
      } else if (status === 'reviewed') {
        if (!page.reviewedAt) page.reviewedAt = {}
        page.reviewedAt[locale] = new Date().toISOString()
      } else if (status === 'published') {
        if (!page.publishedAt) page.publishedAt = {}
        page.publishedAt[locale] = new Date().toISOString()
      } else if (status === 'error') {
        // Error status is handled separately with setError
      }

      await this.save()
    }
  }

  /**
   * Set error for a page
   */
  async setError(id: string, locale: Locale, error: string): Promise<void> {
    const registry = await this.load()
    const page = registry.pages.find((p) => p.id === id)

    if (page) {
      page.status[locale] = 'error'
      if (!page.error) page.error = {}
      page.error[locale] = error
      await this.save()
    }
  }

  /**
   * Get pages by status
   */
  async getPagesByStatus(status: ContentStatus, locale?: Locale): Promise<RegistryPage[]> {
    const registry = await this.load()

    return registry.pages.filter((page) => {
      if (locale) {
        return page.status[locale] === status
      }
      return page.status.fr === status || page.status.en === status || page.status.es === status
    })
  }

  /**
   * Get pages by batch
   */
  async getPagesByBatch(batch: number): Promise<RegistryPage[]> {
    const registry = await this.load()
    return registry.pages.filter((p) => p.batch === batch)
  }

  /**
   * Get pages by type
   */
  async getPagesByType(type: ContentType): Promise<RegistryPage[]> {
    const registry = await this.load()
    return registry.pages.filter((p) => p.type === type)
  }

  /**
   * Get pages by priority
   */
  async getPagesByPriority(priority: Priority): Promise<RegistryPage[]> {
    const registry = await this.load()
    return registry.pages.filter((p) => p.priority === priority)
  }

  /**
   * Get next pages to generate
   */
  async getNextToGenerate(limit: number = 10, locale?: Locale): Promise<RegistryPage[]> {
    const registry = await this.load()

    // Sort by priority (high first) then batch
    const priorityOrder: Record<Priority, number> = { high: 0, medium: 1, normal: 2, low: 3 }

    const pending = registry.pages
      .filter((page) => {
        if (locale) {
          return page.status[locale] === 'pending'
        }
        return (
          page.status.fr === 'pending' ||
          page.status.en === 'pending' ||
          page.status.es === 'pending'
        )
      })
      .sort((a, b) => {
        // First by priority
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
        if (priorityDiff !== 0) return priorityDiff
        // Then by batch
        return a.batch - b.batch
      })

    return pending.slice(0, limit)
  }

  // ============================================================================
  // REPORTING
  // ============================================================================

  /**
   * Print status summary
   */
  async printStatus(): Promise<void> {
    const registry = await this.load()
    const { metadata } = registry

    console.log('\n')
    console.log('┌─────────────────────────────────────────────────────────────────┐')
    console.log('│                    SUPERFASTTT Content Pipeline                 │')
    console.log('├─────────────────────────────────────────────────────────────────┤')

    const progress = Math.round((metadata.generated / (metadata.totalPages * 3)) * 40)
    const progressBar = '█'.repeat(progress) + '░'.repeat(40 - progress)
    console.log(`│  Progress: ${progressBar}  ${metadata.generated}/${metadata.totalPages * 3}  │`)

    console.log('├─────────────────────────────────────────────────────────────────┤')
    console.log('│  Type        │ Pending │ Generated │ Reviewed │ Published      │')
    console.log('│──────────────│─────────│───────────│──────────│────────────────│')

    const types: ContentType[] = ['service', 'industry', 'metier', 'comparison']
    for (const type of types) {
      const pages = registry.pages.filter((p) => p.type === type)
      const stats = this.getTypeStats(pages)
      const typeLabel = type.padEnd(12)
      console.log(
        `│  ${typeLabel} │   ${stats.pending.toString().padStart(3)}   │    ${stats.generated.toString().padStart(3)}    │    ${stats.reviewed.toString().padStart(3)}   │      ${stats.published.toString().padStart(3)}       │`,
      )
    }

    console.log('├─────────────────────────────────────────────────────────────────┤')

    // Count by locale
    const frCount = registry.pages.filter((p) => p.status.fr !== 'pending').length
    const enCount = registry.pages.filter((p) => p.status.en !== 'pending').length
    const esCount = registry.pages.filter((p) => p.status.es !== 'pending').length
    console.log(
      `│  FR: ${frCount} │ EN: ${enCount} │ ES: ${esCount}                                        │`,
    )

    console.log('└─────────────────────────────────────────────────────────────────┘')

    if (metadata.errors > 0) {
      console.log(
        `\n⚠️  ${metadata.errors} errors found. Run 'pnpm content:errors' to see details.`,
      )
    }

    console.log(`\nLast updated: ${metadata.lastUpdated}`)
    console.log('\n')
  }

  private getTypeStats(pages: RegistryPage[]): Record<ContentStatus, number> {
    const stats: Record<ContentStatus, number> = {
      pending: 0,
      generating: 0,
      generated: 0,
      reviewed: 0,
      published: 0,
      error: 0,
    }

    pages.forEach((page) => {
      stats[page.status.fr as ContentStatus]++
      stats[page.status.en as ContentStatus]++
      stats[page.status.es as ContentStatus]++
    })

    return stats
  }

  /**
   * Get errors list
   */
  async getErrors(): Promise<Array<{ id: string; locale: Locale; error: string }>> {
    const registry = await this.load()
    const errors: Array<{ id: string; locale: Locale; error: string }> = []

    registry.pages.forEach((page) => {
      if (page.error) {
        const locales: Locale[] = ['fr', 'en', 'es']
        locales.forEach((locale) => {
          if (page.error?.[locale]) {
            errors.push({
              id: page.id,
              locale,
              error: page.error[locale]!,
            })
          }
        })
      }
    })

    return errors
  }

  /**
   * Reset errors for retry
   */
  async resetErrors(): Promise<number> {
    const registry = await this.load()
    let count = 0

    registry.pages.forEach((page) => {
      const locales: Locale[] = ['fr', 'en', 'es']
      locales.forEach((locale) => {
        if (page.status[locale] === 'error') {
          page.status[locale] = 'pending'
          if (page.error) delete page.error[locale]
          count++
        }
      })
    })

    await this.save()
    return count
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let registryInstance: RegistryManager | null = null

/**
 * Get or create a singleton RegistryManager instance
 */
export function getRegistry(): RegistryManager {
  if (!registryInstance) {
    registryInstance = new RegistryManager()
  }
  return registryInstance
}
