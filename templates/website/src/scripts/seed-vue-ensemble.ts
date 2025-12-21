/**
 * Script pour créer/mettre à jour la page "Vue d'ensemble" SUPERFASTTT FR via l'API PayloadCMS
 * Basé sur le contenu de templates/website/exemples/vue-ensemble.md
 *
 * Exécution: pnpm seed:vue-ensemble
 */

import 'dotenv/config'

import type { RequiredDataFromCollectionSlug } from 'payload'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

// ID de la page à mettre à jour (fourni par l'utilisateur)
const PAGE_ID = '6946c8ab089a3ba91c03f572'

// Données de la page Vue d'ensemble SUPERFASTTT FR basées sur vue-ensemble.md v3
const getVueEnsembleData = (): RequiredDataFromCollectionSlug<'pages'> => {
  return {
    slug: 'vue-ensemble',
    _status: 'published',
    title: "Vue d'ensemble",
    hero: {
      type: 'none',
    },
    layout: [
      // SECTION 1 : HERO
      {
        blockType: 'heroModern',
        blockName: 'Hero',
        badge: 'IA Souveraine',
        title: 'Reprenez le contrôle',
        highlightedText: 'de votre intelligence artificielle',
        description:
          "Un socle IA souverain pour connecter vos données, choisir vos modèles, et gouverner les usages — dans un cadre auditable. SUPERFASTTT : la plateforme qui s'intègre à votre existant sans le remplacer, et vous rend maître de votre stratégie IA.",
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
              label: "Découvrir nos cas d'usage",
              url: '/cas-usage',
            },
          },
        ],
        trustIndicators: {
          headline: 'Conforme aux standards européens',
          indicators: [
            { icon: 'shield', label: 'RGPD' },
            { icon: 'globe', label: 'Souverain' },
            { icon: 'lock', label: 'Auditable' },
          ],
        },
        showGridPattern: true,
        showGradientOrbs: true,
        showFoundationVisual: false,
      },

      // SECTION 2 : PROBLÉMATIQUE
      {
        blockType: 'featureGrid',
        blockName: 'Problématique',
        badge: 'Le constat',
        title: "L'IA d'entreprise ne peut plus dépendre des géants américains",
        description:
          "Vous utilisez déjà l'IA. ChatGPT, Copilot, Gemini. Vos équipes adorent. Mais trois questions restent sans réponse.",
        columns: '3',
        features: [
          {
            icon: 'globe',
            title: 'Où vont vos données ?',
            description:
              "Chaque conversation, chaque document analysé transite par des infrastructures hors de votre contrôle. En cas d'audit, sauriez-vous prouver leur localisation exacte ?",
          },
          {
            icon: 'settings',
            title: 'Qui maîtrise vos modèles ?',
            description:
              "Vous dépendez d'un fournisseur unique qui peut modifier ses conditions, augmenter ses tarifs, ou restreindre l'accès sans préavis.",
          },
          {
            icon: 'shield',
            title: 'Pouvez-vous démontrer votre conformité ?',
            description:
              "Face à un audit RGPD, HDS ou ACPR, disposez-vous des journaux, des traces et des preuves que vos données sensibles n'ont jamais quitté le périmètre autorisé ?",
          },
        ],
      },

      // SECTION 3 : NOTRE RÉPONSE
      {
        blockType: 'featureGrid',
        blockName: 'Notre réponse',
        badge: 'La solution',
        title: "Une plateforme qui s'intègre sans tout remplacer",
        description:
          "SUPERFASTTT n'est pas un chatbot de plus. C'est l'infrastructure complète qui permet à votre organisation de déployer l'IA à grande échelle, tout en gardant le contrôle total. Pensez à SUPERFASTTT comme le \"Odoo de l'Intelligence Artificielle\" : une suite modulaire où chaque brique s'active selon vos besoins.",
        columns: '3',
        features: [
          {
            icon: 'zap',
            title: 'Pas de migration lourde',
            description: 'On connecte vos outils existants sans les remplacer.',
          },
          {
            icon: 'database',
            title: 'Pas de remplacement',
            description: 'Vos documents restent où ils sont, nous les indexons.',
          },
          {
            icon: 'layers',
            title: 'Pas de big bang',
            description: 'Vous activez les fonctionnalités progressivement.',
          },
        ],
      },

      // SECTION 4 : LES 4 PILIERS
      {
        blockType: 'featureGrid',
        blockName: 'Les 4 piliers',
        badge: 'Ce qui nous différencie',
        title: 'Les 4 piliers de SUPERFASTTT',
        columns: '2',
        features: [
          {
            icon: 'shield',
            title: 'Souveraineté maîtrisée',
            description:
              "Vos données restent dans votre périmètre de confiance. Cloud France, serveur dédié ou sur site. Chiffrement au repos et en transit. Isolation stricte entre clients. Journaux d'accès consultables et exportables.",
          },
          {
            icon: 'settings',
            title: 'Contrôle granulaire',
            description:
              'Chaque assistant est rattaché à un profil IA, un périmètre de données, et des règles de gouvernance. Définissez quels modèles accèdent à quelles sources, quels collaborateurs utilisent quelles fonctionnalités.',
          },
          {
            icon: 'chart',
            title: 'Gouvernance auditable',
            description:
              "Journal d'audit complet avec chaque requête tracée. Coûts et consommations par service, projet, profil IA. Alertes en temps réel sur les dépassements de quotas et comportements anormaux.",
          },
          {
            icon: 'cloud',
            title: 'Interopérabilité native',
            description:
              "S'intègre à votre existant. Vos espaces documentaires restent la source de vérité (Drive, SharePoint, Notion). Vos outils de communication deviennent des canaux d'accès à l'IA (Teams, Slack).",
          },
        ],
      },

      // SECTION 5 : CE QUE VOUS POUVEZ FAIRE
      {
        blockType: 'productShowcase',
        blockName: 'Usages',
        badge: 'Capacités',
        title: "Une plateforme, des dizaines d'usages",
        layout: 'alternating',
        items: [
          {
            title: "Centraliser votre savoir d'entreprise",
            description:
              'Transformez vos documents éparpillés en une base de connaissances intelligente. Connectez vos sources (Drive, SharePoint, Notion, emails...), la plateforme indexe et structure automatiquement vos contenus.',
            icon: 'brain',
            features: [
              { text: 'Chaque réponse cite ses sources' },
              { text: 'Mises à jour synchronisées automatiquement' },
              { text: "Droits d'accès de la source respectés" },
            ],
          },
          {
            title: 'Déployer des assistants métier',
            description:
              'Créez des assistants IA spécialisés pour chaque fonction : RH, Support, Commercial, Qualité, Formation. Chaque assistant a un périmètre de données défini et des instructions métier spécifiques.',
            icon: 'users',
            features: [
              { text: 'Périmètre de données défini' },
              { text: 'Instructions métier spécifiques' },
              { text: 'Permissions et limites propres' },
            ],
          },
          {
            title: "Choisir vos modèles d'IA",
            description:
              'Gardez votre liberté de choix. Utilisez plusieurs modèles selon les besoins et la sensibilité des données. Si un fournisseur change ses conditions, vous basculez sans refonte.',
            icon: 'layers',
            features: [
              { text: 'Pas de vendor lock-in' },
              { text: 'Rapport qualité/coût optimisé' },
              { text: 'Réversibilité intégrée' },
            ],
          },
          {
            title: 'Connecter vos outils existants',
            description:
              "L'IA accède à vos vraies données, là où elles sont. Google Drive, Microsoft SharePoint, OneDrive, Teams, Notion, Confluence, Slack, Salesforce, HubSpot, outils d'analyse d'appels.",
            icon: 'cloud',
            features: [
              { text: 'Authentification OAuth2 sécurisée' },
              { text: 'Synchronisation incrémentale' },
              { text: 'Tokens chiffrés, révocables' },
            ],
          },
        ],
      },

      // SECTION 6 : MODES DE DÉPLOIEMENT
      {
        blockType: 'productShowcase',
        blockName: 'Déploiement',
        badge: 'Options',
        title: "Trois formules pour s'adapter à vos contraintes",
        layout: 'grid',
        items: [
          {
            title: 'Formule Cloud',
            description:
              'Pour démarrer rapidement avec un cadre sécurisé. Mise en service en moins de 48h. Hébergement sur infrastructure française. Mises à jour automatiques.',
            icon: 'cloud',
            features: [
              { text: 'Données cloisonnées' },
              { text: 'Support inclus' },
              { text: 'Idéal PME/startups/ETI' },
            ],
          },
          {
            title: 'Formule Dédiée',
            description:
              'Pour les organisations qui veulent plus de garanties. Serveur dédié à votre organisation. Sous-domaine personnalisé. Engagement de disponibilité (SLA).',
            icon: 'database',
            features: [
              { text: 'Infrastructure dédiée' },
              { text: 'Base de données isolée' },
              { text: 'Idéal ETI/grands comptes' },
            ],
          },
          {
            title: 'Formule Sur-Site',
            description:
              'Pour le contrôle total de bout en bout. Installation sur vos propres serveurs. Fonctionnement possible sans connexion externe (air-gap). Modèles IA exécutés localement.',
            icon: 'lock',
            features: [
              { text: 'Aucune donnée ne sort' },
              { text: 'Audits sur site possibles' },
              { text: 'Idéal défense/banques/santé' },
            ],
          },
        ],
      },

      // SECTION 7 : CONFORMITÉ
      {
        blockType: 'statsSection',
        blockName: 'Conformité',
        badge: 'Conformité',
        title: 'Conçu pour les secteurs les plus exigeants',
        description: 'SUPERFASTTT répond aux exigences réglementaires les plus strictes.',
        variant: 'cards',
        columns: '4',
        stats: [
          {
            value: 'RGPD',
            label: 'Conforme',
            description:
              "Hébergement France/Europe. Pas de transfert hors UE. Droit à l'effacement intégré.",
          },
          {
            value: 'HDS',
            label: 'Compatible',
            description:
              'Architecture compatible Hébergement Données de Santé. Isolation totale des données patients.',
          },
          {
            value: 'ACPR',
            label: 'Ready',
            description:
              "Journaux d'audit conservés. Séparation stricte des environnements. Contrôles RBAC.",
          },
          {
            value: 'OIV',
            label: 'Adapté',
            description:
              'Déploiement air-gap disponible. Aucune dépendance à des services étrangers.',
          },
        ],
      },

      // SECTION 8 : CAS D'USAGE PAR DIRECTION
      {
        blockType: 'sectorCards',
        blockName: "Cas d'usage",
        badge: 'Par métier',
        title: "L'IA au service de chaque direction",
        sectors: [
          {
            icon: 'briefcase',
            title: 'Direction Générale',
            description:
              'Synthèse automatique des rapports et comptes-rendus. Assistant stratégique avec accès aux indicateurs clés. Veille concurrentielle sur vos sources documentaires.',
            features: [{ text: 'Décisions plus rapides' }, { text: 'Mieux documentées' }],
          },
          {
            icon: 'heart',
            title: 'Ressources Humaines',
            description:
              "Réponses instantanées aux questions des collaborateurs. Analyse et présélection des candidatures. Support personnalisé pour l'intégration des nouveaux.",
            features: [
              { text: 'Équipe RH libérée' },
              { text: 'Sollicitations récurrentes réduites' },
            ],
          },
          {
            icon: 'building',
            title: 'Relation Client',
            description:
              'Chatbot qui répond avec votre documentation produit. Escalade intelligente vers les bons experts. Suggestions de réponses pour les conseillers.',
            features: [
              { text: 'Satisfaction client améliorée' },
              { text: 'Temps de réponse réduit' },
            ],
          },
          {
            icon: 'banknote',
            title: 'Finance et Conformité',
            description:
              "Recherche instantanée dans les contrats et la réglementation. Détection d'anomalies dans les données. Automatisation du reporting périodique.",
            features: [{ text: 'Moins de risques' }, { text: "Plus de temps pour l'analyse" }],
          },
          {
            icon: 'factory',
            title: 'Industrie et Qualité',
            description:
              'Documentation technique interrogeable en langage naturel. Support à la maintenance et au diagnostic. Analyse des incidents et capitalisation.',
            features: [{ text: 'Expertise accessible à tous' }, { text: 'Erreurs réduites' }],
          },
          {
            icon: 'scale',
            title: 'Commerce',
            description:
              "Brief client généré avant chaque rendez-vous. Analyse des appels de vente. Propositions commerciales assistées. Enrichissement du CRM par l'IA.",
            features: [
              { text: 'Commerciaux mieux préparés' },
              { text: 'Cycles de vente raccourcis' },
            ],
          },
        ],
      },

      // SECTION 9 : INTÉGRATION À VOTRE SI
      {
        blockType: 'featureGrid',
        blockName: 'Intégration',
        badge: 'Technique',
        title: "S'intègre naturellement à votre environnement",
        columns: '3',
        features: [
          {
            icon: 'settings',
            title: 'Pour vos équipes IT',
            description:
              "Interface d'administration complète. Gestion des droits RBAC. Connexion à votre annuaire (SSO Azure AD, Google Workspace). Supervision des usages et coûts.",
          },
          {
            icon: 'code',
            title: 'Pour vos développeurs',
            description:
              'API documentée pour toutes les fonctionnalités. SDK pour créer vos propres intégrations. Webhooks pour automatisations sur événements.',
          },
          {
            icon: 'users',
            title: 'Pour vos utilisateurs',
            description:
              'Interface simple, accessible sans formation. Assistants intégrables dans leurs outils quotidiens. Réponses contextuelles et sourcées.',
          },
        ],
      },

      // SECTION 10 : NOTRE ENGAGEMENT
      {
        blockType: 'featureGrid',
        blockName: 'Engagement',
        badge: 'Notre vision',
        title: "Une vision européenne de l'IA d'entreprise",
        description:
          "SUPERFASTTT est développé par Matsiya, une équipe française convaincue que l'intelligence artificielle doit servir l'entreprise sans la mettre en danger. L'IA n'est pas réservée aux géants de la tech.",
        columns: '2',
        features: [
          {
            icon: 'globe',
            title: 'Standards ouverts',
            description:
              'Pas de formats propriétaires. Réversibilité intégrée, pas de dépendance forcée.',
          },
          {
            icon: 'shield',
            title: 'Transparence totale',
            description:
              "Transparence sur l'architecture et les flux de données. Accompagnement humain, pas des tickets sans réponse.",
          },
        ],
      },

      // SECTION 11 : CTA FINAL
      {
        blockType: 'ctaModern',
        blockName: 'CTA Final',
        title: 'Prêt à reprendre le contrôle ?',
        description:
          "Découvrez comment SUPERFASTTT peut s'adapter à votre contexte, vos contraintes et vos objectifs. Démonstration sur vos cas d'usage réels. Évaluation de conformité offerte. Accompagnement au déploiement. Sans engagement.",
        variant: 'gradient',
        links: [
          {
            link: {
              type: 'custom',
              appearance: 'default',
              label: 'Demander une démonstration personnalisée',
              url: '/contact',
            },
          },
          {
            link: {
              type: 'custom',
              appearance: 'outline',
              label: 'Recevoir la présentation complète',
              url: '/presentation',
            },
          },
        ],
      },
    ],
    meta: {
      title: "SUPERFASTTT - Plateforme IA Souveraine pour l'Entreprise Européenne",
      description:
        "Déployez l'intelligence artificielle dans votre entreprise en gardant le contrôle total. Hébergement France/Europe, conformité RGPD native, gouvernance auditable, intégration à vos outils existants.",
    },
  } as RequiredDataFromCollectionSlug<'pages'>
}

async function seedVueEnsemble() {
  console.log('🚀 Démarrage de la mise à jour de la page "Vue d\'ensemble" SUPERFASTTT...')

  const payload = await getPayload({ config: configPromise })

  const vueEnsembleData = getVueEnsembleData()

  try {
    // Mettre à jour la page avec l'ID spécifié
    console.log(`📝 Mise à jour de la page (ID: ${PAGE_ID})...`)

    await payload.update({
      collection: 'pages',
      id: PAGE_ID,
      data: vueEnsembleData,
      locale: 'fr',
      context: {
        disableRevalidate: true,
      },
    })

    console.log('✅ Page "Vue d\'ensemble" mise à jour avec succès!')
  } catch (error) {
    // Si l'ID n'existe pas, essayer de trouver par slug ou créer
    console.log('⚠️ Page non trouvée par ID, recherche par slug...')

    const existingPages = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: 'vue-ensemble',
        },
      },
      limit: 1,
    })

    if (existingPages.docs.length > 0) {
      const existingPage = existingPages.docs[0]
      console.log(`📝 Mise à jour de la page existante (ID: ${existingPage.id})...`)

      await payload.update({
        collection: 'pages',
        id: existingPage.id,
        data: vueEnsembleData,
        locale: 'fr',
        context: {
          disableRevalidate: true,
        },
      })

      console.log('✅ Page "Vue d\'ensemble" mise à jour avec succès!')
    } else {
      console.log('📄 Création de la page "Vue d\'ensemble"...')

      await payload.create({
        collection: 'pages',
        data: vueEnsembleData,
        locale: 'fr',
        context: {
          disableRevalidate: true,
        },
      })

      console.log('✅ Page "Vue d\'ensemble" créée avec succès!')
    }
  }

  console.log('\n📋 Contenu de la page "Vue d\'ensemble" (basé sur vue-ensemble.md v3):')
  console.log('   - HeroModern: Reprenez le contrôle de votre intelligence artificielle')
  console.log('   - FeatureGrid: Problématique (3 questions clés)')
  console.log('   - FeatureGrid: Notre réponse (intégration sans remplacement)')
  console.log(
    '   - FeatureGrid: Les 4 piliers (souveraineté, contrôle, gouvernance, interopérabilité)',
  )
  console.log('   - ProductShowcase: Usages (savoir, assistants, modèles, connecteurs)')
  console.log('   - ProductShowcase: Déploiement (Cloud, Dédié, Sur-Site)')
  console.log('   - StatsSection: Conformité (RGPD, HDS, ACPR, OIV)')
  console.log("   - SectorCards: Cas d'usage par direction (6 métiers)")
  console.log('   - FeatureGrid: Intégration (IT, développeurs, utilisateurs)')
  console.log('   - FeatureGrid: Notre engagement (vision européenne)')
  console.log('   - CtaModern: Prêt à reprendre le contrôle ?')
  console.log('\n🌐 Accédez à la page: http://localhost:3007/vue-ensemble')
  console.log('🔧 Admin: http://localhost:3007/admin/collections/pages/' + PAGE_ID)

  process.exit(0)
}

seedVueEnsemble().catch((error) => {
  console.error('❌ Erreur lors de la mise à jour:', error)
  process.exit(1)
})
