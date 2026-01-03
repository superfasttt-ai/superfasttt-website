/**
 * Script pour vérifier les pages du footer
 * Usage: pnpm tsx src/scripts/check-footer-pages.ts
 */

import 'dotenv/config'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

async function checkPages() {
  const payload = await getPayload({ config: configPromise })

  const footerSlugs = [
    // Secteurs
    'solutions/administration',
    'solutions/sante',
    'solutions/finance',
    'solutions/defense',
    'solutions/industrie',
    // Départements
    'departements/ventes',
    'departements/support-client',
    'departements/marketing',
    'departements/ingenierie',
    'departements/data-analytics',
    'departements/knowledge',
    'departements/it',
    'departements/juridique',
    'departements/rh',
    'departements/productivite',
  ]

  console.log('\n📋 Vérification des pages du footer:\n')
  console.log('=== SECTEURS ===')

  const missing: string[] = []

  for (const slug of footerSlugs) {
    const result = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      locale: 'fr',
      limit: 1,
    })

    if (slug === 'departements/ventes') console.log('\n=== DÉPARTEMENTS ===')

    if (result.docs.length > 0) {
      const page = result.docs[0]
      console.log(`✅ /${slug} : ${page.title}`)
    } else {
      console.log(`❌ /${slug} : MANQUANTE`)
      missing.push(slug)
    }
  }

  console.log(
    `\n📊 Résumé: ${footerSlugs.length - missing.length} pages existantes, ${missing.length} manquantes`,
  )
  if (missing.length > 0) {
    console.log('\nPages à créer:')
    missing.forEach((s) => console.log(`  - /${s}`))
  }

  process.exit(0)
}

checkPages().catch((e) => {
  console.error(e)
  process.exit(1)
})
