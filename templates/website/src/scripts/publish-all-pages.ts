/**
 * Script pour publier toutes les pages en draft
 * Usage: pnpm tsx src/scripts/publish-all-pages.ts
 */

import 'dotenv/config'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

async function publishAllPages() {
  console.log('\n📤 Publication de toutes les pages draft...\n')

  const payload = await getPayload({ config: configPromise })

  // Récupérer toutes les pages en draft
  const pages = await payload.find({
    collection: 'pages',
    locale: 'fr',
    limit: 100,
    where: {
      _status: { equals: 'draft' },
    },
  })

  console.log(`📋 ${pages.totalDocs} pages en draft trouvées\n`)

  let publishedCount = 0
  let errorCount = 0

  for (const page of pages.docs) {
    try {
      await payload.update({
        collection: 'pages',
        id: page.id,
        data: {
          _status: 'published',
        },
        locale: 'fr',
        context: { disableRevalidate: true },
      })
      console.log(`✅ Publiée: ${page.title} (/${page.slug})`)
      publishedCount++
    } catch (error) {
      console.error(`❌ Erreur pour ${page.slug}:`, error)
      errorCount++
    }
  }

  console.log('\n📊 Résumé:')
  console.log(`   ✅ Publiées: ${publishedCount}`)
  console.log(`   ❌ Erreurs: ${errorCount}`)

  process.exit(0)
}

publishAllPages().catch((error) => {
  console.error('❌ Erreur:', error)
  process.exit(1)
})
