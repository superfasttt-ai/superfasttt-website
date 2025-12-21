/**
 * Script pour créer la homepage SUPERFASTTT FR via l'API PayloadCMS
 * Basé sur le contenu de templates/website/exemples/home.md
 *
 * Exécution: pnpm seed:homepage
 */

import 'dotenv/config'

import type { RequiredDataFromCollectionSlug } from 'payload'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

// Données de la homepage SUPERFASTTT FR basées sur home.md v3
const getHomepageData = (): RequiredDataFromCollectionSlug<'pages'> => {
  return {
    slug: 'home',
    _status: 'published',
    title: 'Accueil',
    hero: {
      type: 'none',
    },
    layout: [
      // SECTION 1 : HERO
      {
        blockType: 'heroModern',
        blockName: 'Hero',
        badge: 'IA Souveraine',
        title: "L'intelligence artificielle",
        highlightedText: 'qui reste chez vous.',
        description:
          "Orchestrez l'IA dans tous vos métiers. Sans envoyer vos données ailleurs. SUPERFASTTT est la plateforme souveraine qui donne à votre entreprise la puissance de l'IA générative — sur votre infrastructure, sous votre contrôle.",
        links: [
          {
            link: {
              type: 'custom',
              appearance: 'default',
              label: 'Demander une démonstration',
              url: '/contact',
            },
          },
          {
            link: {
              type: 'custom',
              appearance: 'outline',
              label: "Découvrir l'architecture",
              url: '/architecture',
            },
          },
        ],
        trustIndicators: {
          headline: 'Conforme aux standards européens',
          indicators: [
            { icon: 'shield', label: 'RGPD' },
            { icon: 'globe', label: 'Souverain' },
            { icon: 'lock', label: 'Chiffré' },
          ],
        },
        showGridPattern: true,
        showGradientOrbs: true,
        showFoundationVisual: true,
      },
      // SECTION 3 : LA SOLUTION - Les 4 piliers
      {
        blockType: 'featureGrid',
        blockName: 'Les 4 piliers',
        badge: 'La solution',
        title: 'Une plateforme complète. Souveraine. Gouvernable.',
        description:
          'SUPERFASTTT est une infrastructure IA complète, déployée chez vous ou sur notre cloud français. Vous gardez le contrôle total : sur vos données, sur les modèles utilisés, et sur chaque usage.',
        columns: '2',
        features: [
          {
            icon: 'shield',
            title: 'Souveraineté totale',
            description:
              'Vos données, vos modèles, vos clés API. Rien ne sort de votre périmètre. Fonctionnement possible en environnement déconnecté, sans aucune dépendance externe.',
          },
          {
            icon: 'layers',
            title: 'Le bon modèle au bon endroit',
            description:
              'Définissez quel modèle IA utilise chaque service. Un modèle cloud performant là où les données sont peu sensibles. Un modèle souverain ou local là où la confidentialité est critique.',
          },
          {
            icon: 'chart',
            title: 'Visibilité et contrôle sur tous les usages',
            description:
              "Tableau de bord centralisé : qui utilise l'IA, pour quoi, avec quelles données, à quel coût. Alertes, quotas, règles d'usage. Fini l'IA qui échappe à la DSI.",
          },
          {
            icon: 'cloud',
            title: 'Interopérabilité native',
            description:
              "Connectez SharePoint, Google Drive, Notion. Déployez des agents dans Teams. Intégrez via API ou SDK. Standards ouverts, pas d'enfermement.",
          },
        ],
      },
      // SECTION 4 : CONTRÔLE PAR SERVICE
      {
        blockType: 'productShowcase',
        blockName: 'Contrôle par service',
        badge: 'Contrôle par service',
        title: 'Un modèle par métier. Vous décidez.',
        description:
          "SUPERFASTTT vous permet de définir précisément quel modèle d'IA utilise chaque département — selon ses contraintes de confidentialité, de performance et de coût.",
        layout: 'alternating',
        items: [
          {
            title: 'Marketing',
            description:
              'Le marketing manipule des briefs et des contenus de campagne — données peu sensibles, besoin de créativité. Un modèle cloud performant convient parfaitement.',
            icon: 'zap',
            features: [
              { text: 'Modèle cloud performant' },
              { text: 'Créativité maximale' },
              { text: 'Coût optimisé' },
            ],
          },
          {
            title: 'R&D',
            description:
              "La R&D travaille sur des brevets, des formules, des plans techniques — données ultra-confidentielles. Un modèle local ou souverain s'impose.",
            icon: 'shield',
            features: [
              { text: 'Modèle local ou souverain' },
              { text: 'Confidentialité maximale' },
              { text: 'Aucune fuite de données' },
            ],
          },
          {
            title: 'Support Client',
            description:
              "Le support client traite un volume important de demandes — l'optimisation du coût par requête est clé. Un modèle économique fait le travail.",
            icon: 'headphones',
            features: [
              { text: 'Modèle économique' },
              { text: 'Volume élevé' },
              { text: 'Coût maîtrisé' },
            ],
          },
        ],
      },
      // SECTION 5 : GOUVERNANCE ET OBSERVABILITÉ
      {
        blockType: 'featureGrid',
        blockName: 'Gouvernance',
        badge: 'Gouvernance',
        title: 'Mesurez. Contrôlez. Gouvernez.',
        description:
          "L'IA sans visibilité, c'est l'IA hors de contrôle. SUPERFASTTT vous donne les outils pour piloter l'usage de l'IA comme n'importe quelle ressource stratégique.",
        columns: '2',
        features: [
          {
            icon: 'chart',
            title: 'Tableau de bord en temps réel',
            description:
              'Visualisez le nombre de requêtes par utilisateur, équipe, service. Suivez les modèles utilisés et leur répartition. Mesurez le coût IA détaillé par département.',
          },
          {
            icon: 'shield',
            title: 'Alertes et quotas',
            description:
              "Définissez des limites de consommation par équipe. Recevez des alertes en cas d'usage anormal. Bloquez automatiquement si un seuil est dépassé.",
          },
          {
            icon: 'database',
            title: 'Historique complet',
            description:
              "Chaque requête est tracée : qui, quand, quel modèle, quelles données. Exportez l'historique pour vos audits de conformité.",
          },
          {
            icon: 'settings',
            title: "Règles d'usage centralisées",
            description:
              'Interdisez certains types de requêtes. Forcez la validation humaine sur certains workflows. Définissez des règles globales que tous les agents respectent.',
          },
        ],
      },
      // SECTION 7 : FONCTIONNALITÉS CLÉS
      {
        blockType: 'featureGrid',
        blockName: 'Fonctionnalités',
        badge: 'Fonctionnalités',
        title: "Tout ce qu'il faut pour orchestrer l'IA d'entreprise",
        columns: '3',
        features: [
          {
            icon: 'database',
            title: 'Cortex de connaissance',
            description:
              'Transformez vos documents en intelligence interrogeable. Chaque service dispose de sa propre base de connaissances, avec ses modèles optimisés pour son métier.',
          },
          {
            icon: 'brain',
            title: 'Mémoire persistante',
            description:
              'Vos agents apprennent de chaque interaction. La mémoire longue durée permet une personnalisation continue, avec consolidation automatique.',
          },
          {
            icon: 'users',
            title: 'Agents IA métiers',
            description:
              'Créez des agents spécialisés : assistant juridique, support technique, copilote commercial. Chaque agent hérite du contexte entreprise.',
          },
          {
            icon: 'layers',
            title: 'Orchestration multi-modèles',
            description:
              'Mistral, Claude, GPT-4, modèles locaux. Choisissez le bon modèle pour chaque usage selon les niveaux de confidentialité.',
          },
          {
            icon: 'code',
            title: 'Apps métiers et extensions',
            description:
              "Comme un ERP modulaire, étendez la plateforme avec des applications métiers. Chaque app s'intègre nativement.",
          },
          {
            icon: 'cloud',
            title: 'Intégrations natives',
            description:
              "SharePoint, Google Drive, Notion, Teams, Slack. Synchronisation automatique, indexation continue, respect des permissions d'origine.",
          },
        ],
      },
      // SECTION 8 : CONFORMITÉ ET CERTIFICATIONS
      {
        blockType: 'statsSection',
        blockName: 'Conformité',
        badge: 'Conformité',
        title: 'Pensé pour les secteurs régulés',
        description:
          'SUPERFASTTT répond aux exigences les plus strictes en matière de conformité et de sécurité des données.',
        variant: 'cards',
        columns: '4',
        stats: [
          {
            value: 'RGPD',
            label: 'Conforme',
            description: 'Données hébergées en France. Pas de transfert hors UE.',
          },
          {
            value: 'HDS',
            label: 'Ready',
            description: 'Architecture compatible Hébergeur de Données de Santé.',
          },
          {
            value: 'ACPR',
            label: 'Compatible',
            description: 'Conçu pour les contraintes du secteur financier.',
          },
          {
            value: 'SecNum',
            label: 'Cloud Friendly',
            description: 'Déployable sur infrastructure qualifiée SecNumCloud.',
          },
        ],
      },
      // SECTION 6 : POUR QUI - Audiences
      {
        blockType: 'sectorCards',
        blockName: 'Audiences',
        badge: 'Pour qui',
        title: 'Conçu pour les entreprises qui ne peuvent pas se permettre le compromis',
        sectors: [
          {
            icon: 'briefcase',
            title: 'Pour les dirigeants',
            description:
              "L'IA n'est pas qu'un sujet technique. C'est un sujet de gouvernance. SUPERFASTTT vous donne le tableau de bord pour piloter l'IA comme n'importe quelle ressource critique.",
            features: [
              { text: 'Reprenez le contrôle sur votre IA' },
              { text: 'Éliminez le risque réglementaire' },
              { text: "Pilotez l'usage comme un actif stratégique" },
            ],
          },
          {
            icon: 'factory',
            title: 'Pour les DSI / CTO',
            description:
              'Une stack IA que vous pouvez auditer, comprendre, et faire évoluer. Avec une visibilité totale sur qui utilise quoi.',
            features: [
              { text: 'Architecture API-first, SDK TypeScript' },
              { text: 'Déploiement en une commande' },
              { text: 'SSO, permissions granulaires, audit logs' },
            ],
          },
        ],
      },
      // SECTION 10 : MODÈLES DE DÉPLOIEMENT
      {
        blockType: 'productShowcase',
        blockName: 'Déploiement',
        badge: 'Déploiement',
        title: 'Choisissez votre niveau de souveraineté',
        layout: 'grid',
        items: [
          {
            title: 'Cloud SUPERFASTTT (France)',
            description:
              "Entreprises souhaitant un démarrage rapide sans gérer l'infrastructure. Hébergement en France (Scaleway, Paris), sauvegardes automatiques, mises à jour et support inclus.",
            icon: 'cloud',
            features: [
              { text: 'Vos données restent en France' },
              { text: 'Export complet à tout moment' },
              { text: 'Migration vers vos serveurs possible' },
            ],
          },
          {
            title: 'Sur vos serveurs (On-Premise)',
            description:
              'Secteurs régulés, environnements déconnectés, contrôle total. Logiciel prêt à installer (Docker), scripts automatisés, documentation complète.',
            icon: 'database',
            features: [
              { text: '100% sur votre infrastructure' },
              { text: 'Aucune connexion externe requise' },
              { text: 'Personnalisation illimitée' },
            ],
          },
        ],
      },
      // SECTION 14 : CTA FINAL
      {
        blockType: 'ctaModern',
        blockName: 'CTA Final',
        title: 'Prêt à reprendre le contrôle de votre IA ?',
        description:
          "Discutons de vos enjeux. Notre équipe vous montre comment SUPERFASTTT s'adapte à votre contexte — secteur, contraintes réglementaires, infrastructure existante.",
        variant: 'gradient',
        links: [
          {
            link: {
              type: 'custom',
              appearance: 'default',
              label: 'Planifier une démonstration',
              url: '/contact',
            },
          },
          {
            link: {
              type: 'custom',
              appearance: 'outline',
              label: 'Télécharger la documentation technique',
              url: '/docs',
            },
          },
        ],
      },
    ],
    meta: {
      title: "SUPERFASTTT - L'IA souveraine pour l'entreprise européenne",
      description:
        'SUPERFASTTT est la plateforme IA souveraine pour les entreprises européennes. Contrôlez quel modèle utilise chaque service, mesurez tous les usages, gardez vos données en France.',
    },
  } as RequiredDataFromCollectionSlug<'pages'>
}

async function seedHomepageFR() {
  console.log('🚀 Démarrage du seed de la homepage FR SUPERFASTTT...')

  const payload = await getPayload({ config: configPromise })

  // Vérifier si une page home existe déjà
  const existingPages = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: 'home',
      },
    },
    limit: 1,
  })

  const homepageData = getHomepageData()

  if (existingPages.docs.length > 0) {
    // Mettre à jour la page existante
    const existingPage = existingPages.docs[0]
    console.log(`📝 Mise à jour de la page home existante (ID: ${existingPage.id})...`)

    await payload.update({
      collection: 'pages',
      id: existingPage.id,
      data: homepageData,
      locale: 'fr',
      context: {
        disableRevalidate: true,
      },
    })

    console.log('✅ Homepage FR mise à jour avec succès!')
  } else {
    // Créer une nouvelle page
    console.log('📄 Création de la page home...')

    await payload.create({
      collection: 'pages',
      data: homepageData,
      locale: 'fr',
      context: {
        disableRevalidate: true,
      },
    })

    console.log('✅ Homepage FR créée avec succès!')
  }

  console.log('\n📋 Contenu de la homepage (basé sur home.md v3):')
  console.log("   - HeroModern: L'intelligence artificielle qui reste chez vous")
  console.log(
    '   - FeatureGrid: Les 4 piliers (souveraineté, modèles, visibilité, interopérabilité)',
  )
  console.log('   - ProductShowcase: Contrôle par service (Marketing, R&D, Support)')
  console.log('   - FeatureGrid: Gouvernance (dashboard, alertes, historique, règles)')
  console.log('   - FeatureGrid: 6 fonctionnalités clés')
  console.log('   - StatsSection: Conformité (RGPD, HDS, ACPR, SecNumCloud)')
  console.log('   - SectorCards: Audiences (Dirigeants, DSI/CTO)')
  console.log('   - ProductShowcase: Déploiement (Cloud France, On-Premise)')
  console.log('   - CtaModern: Prêt à reprendre le contrôle ?')
  console.log('\n🌐 Accédez à la homepage: http://localhost:3000/')

  process.exit(0)
}

seedHomepageFR().catch((error) => {
  console.error('❌ Erreur lors du seed:', error)
  process.exit(1)
})
