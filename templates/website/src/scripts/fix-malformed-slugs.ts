#!/usr/bin/env tsx
/**
 * Script pour corriger les slugs malformés dans Payload
 * Les slugs comme "servicesproduitrag" doivent devenir "produit/rag"
 *
 * Usage: pnpm tsx src/scripts/fix-malformed-slugs.ts
 */

import 'dotenv/config'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

// Mapping des slugs malformés vers les slugs corrects
const SLUG_FIXES: Record<string, string> = {
  // Services/Produit
  'servicesproduitvue-ensemble': 'produit/vue-ensemble',
  servicesproduitrag: 'produit/rag',
  'servicesproduitagents-ia': 'produit/agents-ia',
  servicesproduitapps: 'produit/apps',
  servicesproduitintegrations: 'produit/integrations',
  servicesproduitsecurite: 'produit/securite',
  servicesproduitorchestration: 'produit/orchestration',
  servicesproduitgouvernance: 'produit/gouvernance',
  servicesproduitapi: 'produit/api',
  // Métiers/Départements
  metiersdepartementsventes: 'departements/ventes',
  'metiersdepartementssupport-client': 'departements/support-client',
  metiersdepartementsmarketing: 'departements/marketing',
  metiersdepartementsingenierie: 'departements/ingenierie',
  'metiersdepartementsdata-analytics': 'departements/data-analytics',
  metiersdepartementsit: 'departements/it',
  metiersdepartementsjuridique: 'departements/juridique',
  metiersdepartementsrh: 'departements/rh',
  metiersdepartementsproductivite: 'departements/productivite',
  metiersdepartementsdirection: 'departements/direction',
  metiersdepartementssecurite: 'departements/securite',
  metiersdepartementsconformite: 'departements/conformite',
  metiersdepartementsfinance: 'departements/finance',
  metiersdepartementsknowledge: 'departements/knowledge',
  // Industries/Solutions
  industrysolutionssante: 'solutions/sante',
  industrysolutionsfinance: 'solutions/finance',
  industrysolutionsassurance: 'solutions/assurance',
  industrysolutionsindustrie: 'solutions/industrie',
  industrysolutionsretail: 'solutions/retail',
  industrysolutionsadministration: 'solutions/administration',
  industrysolutionsenergie: 'solutions/energie',
  industrysolutionsimmobilier: 'solutions/immobilier',
  industrysolutionstransport: 'solutions/transport',
  industrysolutionseducation: 'solutions/education',
  industrysolutionsjuridique: 'solutions/juridique',
  industrysolutionsconseil: 'solutions/conseil',
  industrysolutionsentreprises: 'solutions/entreprises',
  // Solutions sans préfixe
  solutionssante: 'solutions/sante',
  solutionsfinance: 'solutions/finance',
  solutionsindustrie: 'solutions/industrie',
  solutionsadministration: 'solutions/administration',
  solutionsjuridique: 'solutions/juridique',
  solutionsentreprises: 'solutions/entreprises',
  solutionsdefense: 'solutions/defense',
  // Départements sans préfixe
  departementsventes: 'departements/ventes',
  'departementssupport-client': 'departements/support-client',
  departementsmarketing: 'departements/marketing',
  departementsingenierie: 'departements/ingenierie',
  'departementsdata-analytics': 'departements/data-analytics',
  departementsknowledge: 'departements/knowledge',
  departementsit: 'departements/it',
  departementsjuridique: 'departements/juridique',
  departementsrh: 'departements/rh',
  departementsproductivite: 'departements/productivite',
  // Anciennes pages avec préfixes collés
  'servicesrag-multimodal': 'produit/rag-multimodal',
  'produitagents-ia-rag': 'produit/agents-ia',
  'produitapps-marketplace': 'produit/apps',
  produitintegrations: 'produit/integrations',
  'produitsecurite-souverainete': 'produit/securite',
  'produitapi-developpeurs': 'produit/api',
  'solutionsadministration-publique': 'solutions/administration',
  'solutionssante-hds': 'solutions/sante',
  'solutionsfinance-assurance': 'solutions/finance',
  'solutionsindustrie-defense': 'solutions/industrie',
  'solutionsservices-juridiques': 'solutions/juridique',
  'solutionseti-grandes-entreprises': 'solutions/entreprises',
  // Pages légales
  legalrgpd: 'legal/rgpd',
  'legalsecurite-conformite': 'legal/securite-conformite',
  'legalpolitique-confidentialite': 'legal/politique-confidentialite',
  'legalcgu-cgv': 'legal/cgu-cgv',
  'legalmentions-legales': 'legal/mentions-legales',
  // Entreprise
  entreprisecontact: 'entreprise/contact',
  entreprisepartenaires: 'entreprise/partenaires',
  entrepriseequipe: 'entreprise/equipe',
  'entreprisea-propos': 'entreprise/a-propos',
  // Ressources
  'ressourcescentre-aide': 'ressources/centre-aide',
  'ressourceswebinars-evenements': 'ressources/webinars-evenements',
  'ressourcescas-clients': 'ressources/cas-clients',
  ressourcesblog: 'ressources/blog',
  ressourcesdocumentation: 'ressources/documentation',
  // Pages simples
  'vue-ensemble': 'produit/vue-ensemble',
}

async function fixMalformedSlugs() {
  console.log('\n🔧 Correction des slugs malformés...\n')

  const payload = await getPayload({ config: configPromise })

  const pages = await payload.find({
    collection: 'pages',
    locale: 'fr',
    limit: 100,
  })

  console.log(`📋 ${pages.totalDocs} pages trouvées\n`)

  let fixedCount = 0
  let skippedCount = 0

  for (const page of pages.docs) {
    const currentSlug = page.slug as string

    // Vérifier si le slug est déjà correct (contient un /)
    if (currentSlug.includes('/')) {
      continue
    }

    // Chercher dans le mapping
    let newSlug = SLUG_FIXES[currentSlug]

    // Si pas dans le mapping, essayer de deviner
    if (!newSlug) {
      // Patterns à détecter
      const patterns = [
        { prefix: 'servicesproduit', replacement: 'produit/' },
        { prefix: 'metiersdepartements', replacement: 'departements/' },
        { prefix: 'industrysolutions', replacement: 'solutions/' },
        { prefix: 'legal', replacement: 'legal/' },
        { prefix: 'entreprise', replacement: 'entreprise/' },
        { prefix: 'ressources', replacement: 'ressources/' },
        { prefix: 'produit', replacement: 'produit/' },
        { prefix: 'solutions', replacement: 'solutions/' },
        { prefix: 'departements', replacement: 'departements/' },
      ]

      for (const { prefix, replacement } of patterns) {
        if (currentSlug.startsWith(prefix) && !currentSlug.includes('/')) {
          const rest = currentSlug.slice(prefix.length)
          if (rest) {
            newSlug = `${replacement}${rest}`
            break
          }
        }
      }
    }

    if (!newSlug) {
      console.log(`⚠️  Impossible de corriger: ${currentSlug}`)
      skippedCount++
      continue
    }

    // Mettre à jour
    try {
      await payload.update({
        collection: 'pages',
        id: page.id as string,
        data: { slug: newSlug },
        locale: 'fr',
        context: { disableRevalidate: true },
      })

      console.log(`✅ ${currentSlug} → ${newSlug}`)
      fixedCount++
    } catch (error) {
      console.error(`❌ Erreur pour ${currentSlug}:`, error)
    }
  }

  console.log('\n📊 Résumé:')
  console.log(`  ✅ Corrigés: ${fixedCount}`)
  console.log(`  ⚠️  Ignorés: ${skippedCount}`)
  console.log(`  📄 Déjà OK: ${pages.totalDocs - fixedCount - skippedCount}`)

  process.exit(0)
}

fixMalformedSlugs().catch((error) => {
  console.error('❌ Erreur:', error)
  process.exit(1)
})
