#!/usr/bin/env tsx
/**
 * Script pour franciser les slugs des départements dans le footer
 *
 * Usage: pnpm tsx templates/website/src/scripts/update-footer-french-slugs.ts
 */

import 'dotenv/config'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

// Mapping des slugs pour les départements (aligné avec taxonomy)
const DEPARTEMENT_SLUG_MAPPING: Record<string, string> = {
  // Anciens slugs anglais
  '/departements/sales': '/departements/ventes',
  '/departements/customer-support': '/departements/support-client',
  '/departements/marketing-content': '/departements/marketing',
  '/departements/engineering': '/departements/ingenierie',
  '/departements/data-analytics': '/departements/data-analytics',
  '/departements/knowledge': '/departements/knowledge',
  '/departements/it': '/departements/it',
  '/departements/legal': '/departements/juridique',
  '/departements/people': '/departements/rh',
  '/departements/productivity': '/departements/productivite',
  // Anciens slugs français avec -contenu
  '/departements/marketing-contenu': '/departements/marketing',
  '/departements/knowledge-management': '/departements/knowledge',
}

// Mapping des labels vers versions finales
const DEPARTEMENT_LABEL_MAPPING: Record<string, string> = {
  Sales: 'Ventes',
  'Customer Support': 'Support Client',
  'Marketing & Content': 'Marketing',
  'Marketing & Contenu': 'Marketing',
  Engineering: 'Ingénierie',
  'Data & Analytics': 'Data & Analytics',
  Knowledge: 'Knowledge',
  'Knowledge Management': 'Knowledge',
  IT: 'IT',
  Legal: 'Juridique',
  People: 'Ressources Humaines',
  Productivity: 'Productivité',
}

async function updateFooterFrenchSlugs() {
  console.log('\n🔄 Mise à jour des slugs français du footer...\n')

  const payload = await getPayload({ config: configPromise })

  // Récupérer le footer actuel
  const footer = await payload.findGlobal({
    slug: 'footer',
    locale: 'fr',
  })

  if (!footer) {
    console.error('❌ Footer non trouvé')
    process.exit(1)
  }

  console.log('📋 Footer actuel récupéré')

  // Parcourir les colonnes pour trouver les départements
  const updatedColumns = (footer.columns || []).map((column: any) => {
    // Vérifier si c'est la colonne Départements
    if (
      column.title?.toLowerCase().includes('département') ||
      column.title?.toLowerCase().includes('department')
    ) {
      console.log(`\n📁 Colonne trouvée: ${column.title}`)

      const updatedLinks = (column.links || []).map((link: any) => {
        const currentUrl = link.link?.url || ''
        const currentLabel = link.label || ''

        // Trouver le nouveau slug
        const newUrl = DEPARTEMENT_SLUG_MAPPING[currentUrl] || currentUrl
        const newLabel = DEPARTEMENT_LABEL_MAPPING[currentLabel] || currentLabel

        if (newUrl !== currentUrl || newLabel !== currentLabel) {
          console.log(`  ✏️  ${currentLabel} (${currentUrl}) → ${newLabel} (${newUrl})`)
        }

        return {
          ...link,
          label: newLabel,
          link: {
            ...link.link,
            url: newUrl,
          },
        }
      })

      return {
        ...column,
        links: updatedLinks,
      }
    }

    return column
  })

  // Mettre à jour le footer (avec disableRevalidate pour éviter l'erreur Next.js)
  await payload.updateGlobal({
    slug: 'footer',
    locale: 'fr',
    data: {
      ...footer,
      columns: updatedColumns,
    },
    context: {
      disableRevalidate: true,
    },
  })

  console.log('\n✅ Footer mis à jour avec les slugs français!')

  // Afficher un résumé
  console.log('\n📊 Résumé des modifications:')
  for (const [oldSlug, newSlug] of Object.entries(DEPARTEMENT_SLUG_MAPPING)) {
    if (oldSlug !== newSlug) {
      console.log(`  ${oldSlug} → ${newSlug}`)
    }
  }

  process.exit(0)
}

updateFooterFrenchSlugs().catch((error) => {
  console.error('❌ Erreur:', error)
  process.exit(1)
})
