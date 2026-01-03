#!/usr/bin/env tsx
/**
 * Script pour mettre à jour les slugs des pages existantes vers la nouvelle structure SEO
 *
 * Usage: pnpm tsx templates/website/src/scripts/update-page-slugs.ts
 */

import 'dotenv/config'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

// Mapping des anciens slugs vers les nouveaux
// Inclut les variations possibles (avec ou sans préfixe)
const SLUG_UPDATES: Array<{ oldSlugs: string[]; newSlug: string; title: string }> = [
  {
    oldSlugs: [
      'rag-base-connaissances',
      '/services/rag-base-connaissances',
      'servicesrag-base-connaissances',
    ],
    newSlug: 'produit/rag',
    title: 'RAG & Base de Connaissances',
  },
  {
    oldSlugs: ['agents-ia-metiers', '/services/agents-ia-metiers', 'servicesagents-ia-metiers'],
    newSlug: 'produit/agents-ia',
    title: 'Agents IA Métiers',
  },
]

async function updatePageSlugs() {
  console.log('\n🔄 Mise à jour des slugs des pages existantes...\n')

  const payload = await getPayload({ config: configPromise })

  let updatedCount = 0
  let notFoundCount = 0

  for (const { oldSlugs, newSlug, title } of SLUG_UPDATES) {
    console.log(`📄 Recherche: ${title}`)

    // Chercher la page avec l'un des anciens slugs possibles
    let page: any = null
    let foundSlug = ''

    for (const oldSlug of oldSlugs) {
      const pages = await payload.find({
        collection: 'pages',
        where: {
          slug: { equals: oldSlug },
        },
        locale: 'fr',
        limit: 1,
      })

      if (pages.docs.length > 0) {
        page = pages.docs[0]
        foundSlug = oldSlug
        break
      }
    }

    if (!page) {
      console.log(`  ⚠️  Page non trouvée (slugs tentés: ${oldSlugs.join(', ')})`)
      notFoundCount++
      continue
    }

    console.log(`  ✓ Page trouvée (ID: ${page.id}, slug actuel: ${foundSlug})`)

    // Mettre à jour le slug
    try {
      await payload.update({
        collection: 'pages',
        id: page.id,
        data: {
          slug: newSlug,
        },
        locale: 'fr',
        context: {
          disableRevalidate: true,
        },
      })

      console.log(`  ✅ Slug mis à jour: ${foundSlug} → ${newSlug}`)
      updatedCount++
    } catch (error) {
      console.error(`  ❌ Erreur lors de la mise à jour:`, error)
    }
  }

  console.log('\n📊 Résumé:')
  console.log(`  - Pages mises à jour: ${updatedCount}`)
  console.log(`  - Pages non trouvées: ${notFoundCount}`)

  if (updatedCount > 0) {
    console.log('\n✅ Migration des slugs terminée!')
    console.log(
      '\n📝 Prochaine étape: Mettre à jour les URLs dans le header via /admin/globals/header',
    )
  }

  process.exit(0)
}

updatePageSlugs().catch((error) => {
  console.error('❌ Erreur:', error)
  process.exit(1)
})
