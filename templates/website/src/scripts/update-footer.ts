/**
 * Script pour mettre à jour le footer avec les liens Secteurs et Départements
 * Usage: pnpm tsx src/scripts/update-footer.ts
 */

import 'dotenv/config'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

async function updateFooter() {
  console.log('\n🔧 Mise à jour du footer...\n')

  const payload = await getPayload({ config: configPromise })

  // Récupérer le footer actuel pour conserver bottomBar si existant
  const currentFooter = await payload.findGlobal({
    slug: 'footer',
    locale: 'fr',
  })

  console.log('📋 Footer actuel récupéré')

  // Définir les colonnes du footer (max 5)
  const columns = [
    {
      title: 'Produit',
      links: [
        {
          label: "Vue d'ensemble",
          link: { type: 'custom' as const, url: '/produit/vue-ensemble' },
        },
        { label: 'RAG & Knowledge Base', link: { type: 'custom' as const, url: '/produit/rag' } },
        { label: 'Agents IA', link: { type: 'custom' as const, url: '/produit/agents-ia' } },
        { label: 'Apps & Marketplace', link: { type: 'custom' as const, url: '/produit/apps' } },
        { label: 'Intégrations', link: { type: 'custom' as const, url: '/produit/integrations' } },
        { label: 'Sécurité', link: { type: 'custom' as const, url: '/produit/securite' } },
        { label: 'API', link: { type: 'custom' as const, url: '/produit/api' } },
      ],
    },
    {
      title: 'Secteurs',
      links: [
        {
          label: 'Secteur public',
          link: { type: 'custom' as const, url: '/solutions/administration' },
        },
        { label: 'Santé', link: { type: 'custom' as const, url: '/solutions/sante' } },
        { label: 'Finance', link: { type: 'custom' as const, url: '/solutions/finance' } },
        { label: 'Défense', link: { type: 'custom' as const, url: '/solutions/defense' } },
        { label: 'Industrie', link: { type: 'custom' as const, url: '/solutions/industrie' } },
      ],
    },
    {
      title: 'Départements',
      links: [
        { label: 'Ventes', link: { type: 'custom' as const, url: '/departements/ventes' } },
        {
          label: 'Support Client',
          link: { type: 'custom' as const, url: '/departements/support-client' },
        },
        { label: 'Marketing', link: { type: 'custom' as const, url: '/departements/marketing' } },
        { label: 'Ingénierie', link: { type: 'custom' as const, url: '/departements/ingenierie' } },
        {
          label: 'Data & Analytics',
          link: { type: 'custom' as const, url: '/departements/data-analytics' },
        },
        { label: 'Knowledge', link: { type: 'custom' as const, url: '/departements/knowledge' } },
        { label: 'IT', link: { type: 'custom' as const, url: '/departements/it' } },
        { label: 'Juridique', link: { type: 'custom' as const, url: '/departements/juridique' } },
        { label: 'RH', link: { type: 'custom' as const, url: '/departements/rh' } },
        {
          label: 'Productivité',
          link: { type: 'custom' as const, url: '/departements/productivite' },
        },
      ],
    },
    {
      title: 'Entreprise',
      links: [
        { label: 'À propos', link: { type: 'custom' as const, url: '/entreprise/a-propos' } },
        { label: 'Équipe', link: { type: 'custom' as const, url: '/entreprise/equipe' } },
        { label: 'Partenaires', link: { type: 'custom' as const, url: '/entreprise/partenaires' } },
        { label: 'Contact', link: { type: 'custom' as const, url: '/contact' } },
        { label: 'Tarifs', link: { type: 'custom' as const, url: '/tarifs' } },
      ],
    },
    {
      title: 'Légal',
      links: [
        {
          label: 'Mentions légales',
          link: { type: 'custom' as const, url: '/legal/mentions-legales' },
        },
        { label: 'CGU / CGV', link: { type: 'custom' as const, url: '/legal/cgu-cgv' } },
        {
          label: 'Politique de confidentialité',
          link: { type: 'custom' as const, url: '/legal/politique-confidentialite' },
        },
        { label: 'RGPD', link: { type: 'custom' as const, url: '/legal/rgpd' } },
        {
          label: 'Sécurité & Conformité',
          link: { type: 'custom' as const, url: '/legal/securite-conformite' },
        },
      ],
    },
  ]

  // Mettre à jour le footer
  await payload.updateGlobal({
    slug: 'footer',
    locale: 'fr',
    data: {
      logo: currentFooter.logo,
      columns,
      bottomBar: {
        copyright: '© 2025 Matsiya - SUPERFASTTT',
        badges: [
          { label: 'Hébergé en France', icon: '🇫🇷' },
          { label: 'Conforme RGPD', icon: '🔒' },
          { label: 'IA Souveraine', icon: '🛡️' },
        ],
        socialLinks: [
          { platform: 'linkedin' as const, url: 'https://linkedin.com/company/superfasttt' },
          { platform: 'github' as const, url: 'https://github.com/superfasttt' },
          { platform: 'twitter' as const, url: 'https://twitter.com/superfasttt' },
        ],
      },
    },
    context: {
      disableRevalidate: true,
    },
  })

  console.log('✅ Footer mis à jour avec succès!\n')
  console.log('Colonnes:')
  columns.forEach((col) => {
    console.log(`  📁 ${col.title} (${col.links.length} liens)`)
    col.links.forEach((link) => {
      console.log(`     - ${link.label} → ${link.link.url}`)
    })
  })

  process.exit(0)
}

updateFooter().catch((error) => {
  console.error('❌ Erreur:', error)
  process.exit(1)
})
