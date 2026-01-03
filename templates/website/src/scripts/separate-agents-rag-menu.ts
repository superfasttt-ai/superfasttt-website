#!/usr/bin/env tsx
/**
 * Script pour séparer "Agents IA & RAG" en deux entrées dans le menu header
 *
 * Usage: pnpm tsx templates/website/src/scripts/separate-agents-rag-menu.ts
 */

import 'dotenv/config'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

async function separateAgentsRagMenu() {
  console.log('\n🔄 Séparation "Agents IA & RAG" dans le header...\n')

  const payload = await getPayload({ config: configPromise })

  const header = await payload.findGlobal({
    slug: 'header',
    locale: 'fr',
  })

  if (!header) {
    console.error('❌ Header non trouvé')
    process.exit(1)
  }

  console.log('📋 Header récupéré')

  let modified = false

  // Parcourir les navItems pour trouver le menu Produit
  const updatedNavItems = (header.navItems || []).map((item: any) => {
    if (item.label === 'Produit' && item.megaMenu?.sections) {
      item.megaMenu.sections = item.megaMenu.sections.map((section: any) => {
        if (section.links) {
          const newLinks: any[] = []

          section.links.forEach((linkItem: any) => {
            // Remplacer 'Agents IA & RAG' par deux entrées séparées
            if (
              linkItem.label === 'Agents IA & RAG' ||
              linkItem.link?.url === '/produit/rag' ||
              linkItem.link?.url === '/produit/agents-ia-rag'
            ) {
              // Ajouter RAG
              newLinks.push({
                label: 'RAG & Knowledge Base',
                description: 'Transformez vos documents en intelligence',
                icon: '📚',
                link: {
                  type: 'custom',
                  url: '/produit/rag',
                },
              })

              // Ajouter Agents IA
              newLinks.push({
                label: 'Agents IA Métiers',
                description: 'Assistants spécialisés par fonction',
                icon: '🤖',
                link: {
                  type: 'custom',
                  url: '/produit/agents-ia',
                },
              })

              modified = true
              console.log('  ✅ "Agents IA & RAG" séparé en:')
              console.log('     - RAG & Knowledge Base (/produit/rag)')
              console.log('     - Agents IA Métiers (/produit/agents-ia)')
            } else {
              newLinks.push(linkItem)
            }
          })

          section.links = newLinks
        }
        return section
      })
    }
    return item
  })

  if (!modified) {
    console.log('\n⚠️  Entrée "Agents IA & RAG" non trouvée (peut-être déjà séparée)')
    process.exit(0)
  }

  // Sauvegarder
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

  console.log('\n✅ Header mis à jour avec les deux entrées séparées!')
  process.exit(0)
}

separateAgentsRagMenu().catch((error) => {
  console.error('❌ Erreur:', error)
  process.exit(1)
})
