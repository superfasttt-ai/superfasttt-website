#!/usr/bin/env tsx
/**
 * Taxonomy Command
 * Show taxonomy statistics and details
 *
 * Usage:
 *   pnpm content:taxonomy           # Show summary
 *   pnpm content:taxonomy --list    # List all items
 */

import { printTaxonomySummary, getAllTaxonomyNodes, getTaxonomyStats } from '../taxonomy'

async function main() {
  const args = process.argv.slice(2)
  const showList = args.includes('--list')

  console.log('\n📚 Content Taxonomy')
  console.log('═══════════════════════════════════════\n')

  if (showList) {
    const nodes = getAllTaxonomyNodes()

    console.log('📦 SERVICES')
    console.log('───────────')
    nodes.services.forEach((s) => {
      const prefix = s.parentId ? '  └─ ' : ''
      console.log(`${prefix}[${s.priority}] ${s.id}: ${s.title.fr}`)
    })

    console.log('\n🏭 INDUSTRIES')
    console.log('─────────────')
    nodes.industries.forEach((i) => {
      console.log(`[${i.priority}] ${i.id}: ${i.title.fr}`)
    })

    console.log('\n👔 MÉTIERS')
    console.log('──────────')
    nodes.metiers.forEach((m) => {
      console.log(`[${m.priority}] ${m.id}: ${m.title.fr}`)
    })

    console.log('\n⚔️  COMPETITORS')
    console.log('───────────────')
    nodes.competitors.forEach((c) => {
      console.log(`[${c.category}] ${c.id}: ${c.name}`)
    })
  } else {
    printTaxonomySummary()
  }

  const stats = getTaxonomyStats()
  const totalPages =
    (stats.services.total +
      stats.industries.total +
      stats.metiers.total +
      stats.competitors.total) *
    3

  console.log(`\n📄 Total pages to generate: ${totalPages}`)
  console.log('  (Services + Industries + Métiers + Comparisons) × 3 languages')
  console.log('')
}

main()
