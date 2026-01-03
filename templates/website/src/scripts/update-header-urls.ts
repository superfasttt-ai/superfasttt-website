#!/usr/bin/env tsx
/**
 * Script pour mettre à jour les URLs du menu header vers la nouvelle structure SEO
 *
 * Usage: pnpm tsx templates/website/src/scripts/update-header-urls.ts
 */

import 'dotenv/config'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

// Mapping des anciennes URLs vers les nouvelles
const HEADER_URL_MAPPING: Record<string, string> = {
  // Menu Produit
  '/produit/agents-ia-rag': '/produit/rag',
  '/produit/apps-marketplace': '/produit/apps',
  '/produit/securite-souverainete': '/produit/securite',
  '/produit/api-developpeurs': '/produit/api',
  // Menu Solutions (optionnel - si on veut aligner avec la taxonomy)
  '/solutions/administration-publique': '/solutions/administration',
  '/solutions/sante-hds': '/solutions/sante',
  '/solutions/finance-assurance': '/solutions/finance',
  '/solutions/industrie-defense': '/solutions/industrie',
  '/solutions/services-juridiques': '/solutions/juridique',
  '/solutions/eti-grandes-entreprises': '/solutions/entreprises',
}

async function updateHeaderUrls() {
  console.log('\n🔄 Mise à jour des URLs du header...\n')

  const payload = await getPayload({ config: configPromise })

  // Récupérer le header actuel
  const header = await payload.findGlobal({
    slug: 'header',
    locale: 'fr',
  })

  if (!header) {
    console.error('❌ Header non trouvé')
    process.exit(1)
  }

  console.log('📋 Header actuel récupéré')

  let updatedCount = 0

  // Fonction pour mettre à jour les URLs dans les navItems
  function updateNavItems(items: any[]): any[] {
    return items.map((item: any) => {
      // Vérifier le lien principal
      if (item.link?.url && HEADER_URL_MAPPING[item.link.url]) {
        const oldUrl = item.link.url
        const newUrl = HEADER_URL_MAPPING[oldUrl]
        console.log(`  ✏️  ${item.label || 'Item'}: ${oldUrl} → ${newUrl}`)
        updatedCount++
        item.link.url = newUrl
      }

      // Vérifier les mega menu sections
      if (item.megaMenu?.sections) {
        item.megaMenu.sections = item.megaMenu.sections.map((section: any) => {
          if (section.links) {
            section.links = section.links.map((linkItem: any) => {
              const url = linkItem.link?.url
              if (url && HEADER_URL_MAPPING[url]) {
                const newUrl = HEADER_URL_MAPPING[url]
                console.log(`  ✏️  ${linkItem.label || 'Item'}: ${url} → ${newUrl}`)
                updatedCount++
                linkItem.link.url = newUrl
              }
              return linkItem
            })
          }
          return section
        })
      }

      // Vérifier les mega menu items (ancienne structure)
      if (item.megaMenu?.items) {
        item.megaMenu.items = item.megaMenu.items.map((megaItem: any) => {
          if (megaItem.link?.url && HEADER_URL_MAPPING[megaItem.link.url]) {
            const oldUrl = megaItem.link.url
            const newUrl = HEADER_URL_MAPPING[oldUrl]
            console.log(`  ✏️  ${megaItem.label || 'Item'}: ${oldUrl} → ${newUrl}`)
            updatedCount++
            megaItem.link.url = newUrl
          }
          return megaItem
        })
      }

      return item
    })
  }

  // Mettre à jour les navItems
  const updatedNavItems = updateNavItems(header.navItems || [])

  if (updatedCount === 0) {
    console.log('\n✅ Aucune URL à mettre à jour (déjà à jour ou URLs non trouvées)')
    console.log('💡 Vous pouvez mettre à jour manuellement via /admin/globals/header')
    process.exit(0)
  }

  // Sauvegarder le header
  await payload.updateGlobal({
    slug: 'header',
    locale: 'fr',
    data: {
      ...header,
      navItems: updatedNavItems,
    },
    context: {
      disableRevalidate: true,
    },
  })

  console.log(`\n✅ Header mis à jour! (${updatedCount} URLs modifiées)`)
  process.exit(0)
}

updateHeaderUrls().catch((error) => {
  console.error('❌ Erreur:', error)
  process.exit(1)
})
