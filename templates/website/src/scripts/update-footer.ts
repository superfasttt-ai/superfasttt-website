/**
 * Script pour modifier le footer via l'API locale Payload CMS
 * - Retire les liens non désirés
 * - Ajoute une colonne "Départements" avec les services
 *
 * Exécution: pnpm tsx src/scripts/update-footer.ts
 */

import 'dotenv/config'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Footer } from '@/payload-types'

const LINKS_TO_REMOVE = [
  'Guides & Livres blancs',
  'Communauté',
  'Carrières',
  'Presse',
  'Certifications',
  'Changelog',
  'Roadmap',
  'Status',
]

const DEPARTMENTS_COLUMN = {
  title: 'Départements',
  links: [
    { label: 'Sales', link: { type: 'custom' as const, url: '/departements/sales' } },
    {
      label: 'Customer Support',
      link: { type: 'custom' as const, url: '/departements/customer-support' },
    },
    {
      label: 'Marketing & Content',
      link: { type: 'custom' as const, url: '/departements/marketing-content' },
    },
    { label: 'Engineering', link: { type: 'custom' as const, url: '/departements/engineering' } },
    {
      label: 'Data & Analytics',
      link: { type: 'custom' as const, url: '/departements/data-analytics' },
    },
    { label: 'Knowledge', link: { type: 'custom' as const, url: '/departements/knowledge' } },
    { label: 'IT', link: { type: 'custom' as const, url: '/departements/it' } },
    { label: 'Legal', link: { type: 'custom' as const, url: '/departements/legal' } },
    { label: 'People', link: { type: 'custom' as const, url: '/departements/people' } },
    { label: 'Productivity', link: { type: 'custom' as const, url: '/departements/productivity' } },
  ],
}

async function updateFooter() {
  console.log('🚀 Démarrage de la mise à jour du footer...')

  const payload = await getPayload({ config: configPromise })

  // Récupérer le footer actuel
  console.log('📥 Récupération du footer actuel...')
  const footer = (await payload.findGlobal({
    slug: 'footer',
    locale: 'fr',
  })) as Footer

  console.log(`   Colonnes actuelles: ${footer.columns?.length ?? 0}`)

  // Afficher les liens actuels pour debug
  footer.columns?.forEach((col, i) => {
    console.log(`   ${i + 1}. ${col.title}: ${col.links?.map((l) => l.label).join(', ')}`)
  })

  // Filtrer les liens à retirer de chaque colonne
  const filteredColumns =
    footer.columns?.map((column) => {
      const filteredLinks = column.links?.filter((link) => !LINKS_TO_REMOVE.includes(link.label))
      return {
        title: column.title,
        links: filteredLinks?.map((link) => ({
          label: link.label,
          link: link.link,
        })),
      }
    }) ?? []

  // Retirer les colonnes vides après filtrage
  const nonEmptyColumns = filteredColumns.filter(
    (column) => column.links && column.links.length > 0,
  )

  // Réorganiser pour respecter la limite de 5 colonnes
  // Fusionner Produit et Ressources en une seule colonne "Produit & Ressources"
  const produitColumn = nonEmptyColumns.find((c) => c.title === 'Produit')
  const ressourcesColumn = nonEmptyColumns.find((c) => c.title === 'Ressources')
  const otherColumns = nonEmptyColumns.filter(
    (c) => c.title !== 'Produit' && c.title !== 'Ressources',
  )

  const mergedColumn = {
    title: 'Produit & Ressources',
    links: [...(produitColumn?.links ?? []), ...(ressourcesColumn?.links ?? [])],
  }

  // Colonnes finales : Produit & Ressources, Secteurs, Entreprise, Légal, Départements
  const updatedColumns = [mergedColumn, ...otherColumns, DEPARTMENTS_COLUMN]

  console.log(`\n🔄 Mise à jour du footer...`)
  console.log(`   Colonnes après modification: ${updatedColumns.length}`)

  // Mettre à jour le footer
  await payload.updateGlobal({
    slug: 'footer',
    locale: 'fr',
    data: {
      columns: updatedColumns,
    },
    context: {
      disableRevalidate: true,
    },
  })

  console.log('\n✅ Footer mis à jour avec succès!')
  console.log('   Nouvelles colonnes:')
  updatedColumns.forEach((col, i) => {
    console.log(`   ${i + 1}. ${col.title} (${col.links?.length ?? 0} liens)`)
  })

  console.log('\n🔗 Liens retirés:')
  LINKS_TO_REMOVE.forEach((link) => console.log(`   - ${link}`))

  console.log('\n🆕 Colonne ajoutée: Départements avec 10 services')
  console.log('📦 Colonnes Produit et Ressources fusionnées')

  process.exit(0)
}

updateFooter().catch((error) => {
  console.error('❌ Erreur:', error.message)
  process.exit(1)
})
