/**
 * Taxonomy Index
 * Central export for all taxonomy data
 */

export * from './services'
export * from './industries'
export * from './metiers'
export * from './competitors'

import { competitors, getCompetitorById, getCompetitorsByCategory } from './competitors'
import {
  getIndustriesByBatch,
  getIndustriesByPriority,
  getIndustryById,
  industries,
} from './industries'
import { getMetierById, getMetiersByBatch, getMetiersByPriority, metiers } from './metiers'
import {
  getChildServices,
  getServiceById,
  getServicesByBatch,
  getServicesByPriority,
  services,
} from './services'

import type { ContentType, Locale, Priority } from '../types'

// ============================================================================
// AGGREGATED FUNCTIONS
// ============================================================================

/**
 * Get all taxonomy nodes
 */
export function getAllTaxonomyNodes() {
  return {
    services,
    industries,
    metiers,
    competitors,
  }
}

/**
 * Get taxonomy by type and ID
 */
export function getTaxonomyById(type: ContentType, id: string) {
  switch (type) {
    case 'service':
      return getServiceById(id)
    case 'industry':
      return getIndustryById(id)
    case 'metier':
      return getMetierById(id)
    case 'comparison':
      return getCompetitorById(id)
    default:
      return undefined
  }
}

/**
 * Get all items for a specific batch
 */
export function getBatchItems(batch: number) {
  return {
    services: getServicesByBatch(batch),
    industries: getIndustriesByBatch(batch),
    metiers: getMetiersByBatch(batch),
  }
}

/**
 * Get all items for a specific priority
 */
export function getPriorityItems(priority: Priority) {
  return {
    services: getServicesByPriority(priority),
    industries: getIndustriesByPriority(priority),
    metiers: getMetiersByPriority(priority),
  }
}

/**
 * Get related pages for internal linking
 */
export function getRelatedPages(type: ContentType, id: string, locale: Locale) {
  const related: { slug: string; title: string; type: ContentType }[] = []

  // Get node
  const node = getTaxonomyById(type, id)
  if (!node) return related

  // Add child services if this is a parent service
  if (type === 'service') {
    const children = getChildServices(id)
    children.forEach((child) => {
      related.push({
        slug: `/services/${child.slug[locale]}`,
        title: child.title[locale],
        type: 'service',
      })
    })
  }

  // Add related industries (first 3)
  industries.slice(0, 3).forEach((industry) => {
    if (industry.id !== id) {
      related.push({
        slug: `/secteurs/${industry.slug[locale]}`,
        title: industry.title[locale],
        type: 'industry',
      })
    }
  })

  // Add related metiers (first 3)
  metiers.slice(0, 3).forEach((metier) => {
    if (metier.id !== id) {
      related.push({
        slug: `/metiers/${metier.slug[locale]}`,
        title: metier.title[locale],
        type: 'metier',
      })
    }
  })

  return related.slice(0, 6) // Limit to 6 related pages
}

/**
 * Get statistics about taxonomy
 */
export function getTaxonomyStats() {
  return {
    services: {
      total: services.length,
      highPriority: getServicesByPriority('high').length,
      batch1: getServicesByBatch(1).length,
      batch2: getServicesByBatch(2).length,
    },
    industries: {
      total: industries.length,
      highPriority: getIndustriesByPriority('high').length,
      batch1: getIndustriesByBatch(1).length,
      batch2: getIndustriesByBatch(2).length,
    },
    metiers: {
      total: metiers.length,
      highPriority: getMetiersByPriority('high').length,
      batch1: getMetiersByBatch(1).length,
      batch2: getMetiersByBatch(2).length,
    },
    competitors: {
      total: competitors.length,
      bigTech: getCompetitorsByCategory('big-tech').length,
      european: getCompetitorsByCategory('european').length,
      openSource: getCompetitorsByCategory('open-source').length,
      specialized: getCompetitorsByCategory('specialized').length,
    },
  }
}

/**
 * Print taxonomy summary to console
 */
export function printTaxonomySummary() {
  const stats = getTaxonomyStats()

  console.log('\n📊 Taxonomy Summary')
  console.log('═══════════════════════════════════════════')
  console.log(`\n📦 Services: ${stats.services.total}`)
  console.log(`   - High priority: ${stats.services.highPriority}`)
  console.log(`   - Batch 1: ${stats.services.batch1}`)
  console.log(`   - Batch 2: ${stats.services.batch2}`)

  console.log(`\n🏭 Industries: ${stats.industries.total}`)
  console.log(`   - High priority: ${stats.industries.highPriority}`)
  console.log(`   - Batch 1: ${stats.industries.batch1}`)
  console.log(`   - Batch 2: ${stats.industries.batch2}`)

  console.log(`\n👔 Métiers: ${stats.metiers.total}`)
  console.log(`   - High priority: ${stats.metiers.highPriority}`)
  console.log(`   - Batch 1: ${stats.metiers.batch1}`)
  console.log(`   - Batch 2: ${stats.metiers.batch2}`)

  console.log(`\n⚔️  Competitors: ${stats.competitors.total}`)
  console.log(`   - Big Tech: ${stats.competitors.bigTech}`)
  console.log(`   - European: ${stats.competitors.european}`)
  console.log(`   - Open Source: ${stats.competitors.openSource}`)
  console.log(`   - Specialized: ${stats.competitors.specialized}`)

  const totalPages =
    (stats.services.total +
      stats.industries.total +
      stats.metiers.total +
      stats.competitors.total) *
    3 // 3 languages

  console.log('\n═══════════════════════════════════════════')
  console.log(`📄 Total pages to generate (3 languages): ${totalPages}`)
  console.log('═══════════════════════════════════════════\n')
}
