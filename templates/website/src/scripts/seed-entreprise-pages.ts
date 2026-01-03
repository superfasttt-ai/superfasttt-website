/**
 * Script pour créer les pages Entreprise (À propos, Contact, Tarifs) et mettre à jour le footer
 * Usage: pnpm tsx src/scripts/seed-entreprise-pages.ts
 */

import 'dotenv/config'

import type { RequiredDataFromCollectionSlug } from 'payload'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

// ========== RICH TEXT HELPERS ==========

function createRichText(text: string) {
  return {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              text: text,
              format: 0,
              detail: 0,
              mode: 'normal',
              style: '',
              version: 1,
            },
          ],
          format: '',
          indent: 0,
          textFormat: 0,
          version: 1,
          direction: 'ltr',
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

function createRichTextWithParagraphs(paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text: text,
            format: 0,
            detail: 0,
            mode: 'normal',
            style: '',
            version: 1,
          },
        ],
        format: '',
        indent: 0,
        textFormat: 0,
        version: 1,
        direction: 'ltr',
      })),
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

// ========== CONTACT FORM ==========

const contactFormData: RequiredDataFromCollectionSlug<'forms'> = {
  title: 'Formulaire de contact',
  confirmationType: 'message',
  confirmationMessage: {
    root: {
      type: 'root',
      children: [
        {
          type: 'heading',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'Merci pour votre message !',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          tag: 'h2',
          version: 1,
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'Nous avons bien reçu votre demande et vous recontacterons sous 24h.',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          textFormat: 0,
          version: 1,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  },
  emails: [
    {
      emailFrom: '"SUPERFASTTT" <noreply@superfasttt.com>',
      emailTo: 'contact@superfasttt.com',
      subject: 'Nouveau message de contact - {{full-name}}',
      message: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Nouveau message de contact reçu :',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              textFormat: 0,
              version: 1,
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Nom : {{full-name}}',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              textFormat: 0,
              version: 1,
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Email : {{email}}',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              textFormat: 0,
              version: 1,
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Téléphone : {{phone}}',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              textFormat: 0,
              version: 1,
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Entreprise : {{company}}',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              textFormat: 0,
              version: 1,
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Message : {{message}}',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              textFormat: 0,
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
    },
  ],
  fields: [
    {
      name: 'full-name',
      blockName: 'full-name',
      blockType: 'text',
      label: 'Nom complet',
      required: true,
      width: 50,
    },
    {
      name: 'email',
      blockName: 'email',
      blockType: 'email',
      label: 'Email',
      required: true,
      width: 50,
    },
    {
      name: 'phone',
      blockName: 'phone',
      blockType: 'text',
      label: 'Téléphone',
      required: false,
      width: 50,
    },
    {
      name: 'company',
      blockName: 'company',
      blockType: 'text',
      label: 'Entreprise',
      required: false,
      width: 50,
    },
    {
      name: 'message',
      blockName: 'message',
      blockType: 'textarea',
      label: 'Votre message',
      required: true,
      width: 100,
    },
  ],
  submitButtonLabel: 'Envoyer',
}

// ========== PAGE À PROPOS ==========

const aProposPage: RequiredDataFromCollectionSlug<'pages'> = {
  slug: 'a-propos',
  _status: 'published',
  title: 'À propos',
  hero: { type: 'none' },
  layout: [
    // HERO
    {
      blockType: 'heroModern',
      blockName: 'Hero',
      badge: 'À propos de SUPERFASTTT',
      title: 'Reprenez la main',
      highlightedText: 'sur votre IA',
      description:
        "SUPERFASTTT aide les entreprises à faire de l'IA un levier concret au service du quotidien. Pas un chatbot de plus, mais un socle durable qui relie vos documents, procédures et savoir-faire à des agents capables d'assister, répondre et automatiser, sans exposer vos données.",
      links: [
        {
          link: {
            type: 'custom',
            appearance: 'default',
            label: 'Découvrir nos solutions',
            url: '/produit/vue-ensemble',
          },
        },
        {
          link: {
            type: 'custom',
            appearance: 'outline',
            label: 'Nous contacter',
            url: '/contact',
          },
        },
      ],
      trustIndicators: {
        headline: '',
        indicators: [
          { icon: 'shield', label: 'Souveraineté' },
          { icon: 'lock', label: 'Zéro lock-in' },
          { icon: 'globe', label: 'Hébergé en France' },
        ],
      },
    },
    // NOTRE PHILOSOPHIE
    {
      blockType: 'featureGrid',
      blockName: 'Notre philosophie',
      badge: 'Notre vision',
      title: 'Une plateforme ouverte et interopérable',
      description:
        'SUPERFASTTT est conçu pour éviter tout verrouillage fournisseur. Vos données restent votre propriété, dans un espace strictement isolé par organisation, et vous conservez la liberté de faire évoluer votre environnement.',
      columns: '3',
      features: [
        {
          icon: 'database',
          title: 'Vos données, votre contrôle',
          description:
            'Espace strictement isolé par organisation. Vos données ne servent jamais à entraîner des modèles tiers.',
        },
        {
          icon: 'code',
          title: 'Liberté technologique',
          description:
            'Choisissez vos modèles, votre hébergement, vos intégrations. Évoluez sans dépendance à un fournisseur unique.',
        },
        {
          icon: 'globe',
          title: 'Interopérabilité native',
          description:
            "Une plateforme qui s'intègre à votre système d'information existant plutôt que de l'enfermer.",
        },
      ],
    },
    // CE QUE SUPERFASTTT APPORTE
    {
      blockType: 'featureGrid',
      blockName: 'Ce que SUPERFASTTT apporte',
      badge: 'Nos engagements',
      title: 'Ce que SUPERFASTTT apporte',
      description: 'Une plateforme IA conçue pour durer, sans compromis sur la souveraineté.',
      columns: '2',
      features: [
        {
          icon: 'database',
          title: 'Base de connaissance exploitable',
          description:
            "Une base de connaissance d'entreprise exploitable par tous, au bon moment. Vos documents, procédures et savoir-faire accessibles en langage naturel.",
        },
        {
          icon: 'brain',
          title: 'Agents et automatisations',
          description:
            "Des agents et automatisations pour réduire les tâches répétitives et fiabiliser l'exécution. Libérez du temps pour ce qui compte vraiment.",
        },
        {
          icon: 'shield',
          title: 'Souveraineté réelle',
          description:
            'Contrôle total des données, des clés de chiffrement et des choix techniques. Vos données restent les vôtres, point final.',
        },
        {
          icon: 'lock',
          title: 'Zéro lock-in',
          description:
            "Architecture ouverte, API documentées et intégrations standards. Possibilité d'évoluer ou de migrer sans dépendance.",
        },
      ],
    },
    // STATS / GARANTIES
    {
      blockType: 'statsSection',
      blockName: 'Garanties',
      badge: 'Nos garanties',
      title: 'Des engagements concrets',
      description: 'Ce qui nous différencie des solutions IA génériques.',
      variant: 'cards',
      columns: '4',
      stats: [
        {
          value: '100%',
          label: 'Souverain',
          description: 'Hébergement et traitement des données en France',
        },
        {
          value: '0',
          label: 'Lock-in',
          description: 'Aucun verrouillage fournisseur, architecture ouverte',
        },
        {
          value: 'RGPD',
          label: 'Natif',
          description: 'Conformité intégrée dès la conception',
        },
        {
          value: 'API',
          label: 'Ouvertes',
          description: 'Intégration avec vos outils existants',
        },
      ],
    },
    // COMMENT CA MARCHE
    {
      blockType: 'productShowcase',
      blockName: 'Comment ça marche',
      badge: 'Notre approche',
      title: 'Comment SUPERFASTTT fonctionne',
      layout: 'alternating',
      items: [
        {
          title: 'Connectez vos sources',
          description:
            "Reliez vos documents, bases de données, outils métier. SUPERFASTTT indexe et structure l'information automatiquement.",
          icon: 'database',
          features: [
            { text: 'Documents et fichiers' },
            { text: 'Bases de données' },
            { text: 'Outils métier (CRM, ERP...)' },
          ],
        },
        {
          title: 'Créez vos agents',
          description:
            "Configurez des agents spécialisés pour vos cas d'usage : support client, analyse de données, rédaction, automatisation.",
          icon: 'brain',
          features: [
            { text: 'Agents personnalisés' },
            { text: 'Workflows automatisés' },
            { text: 'Intégrations sur-mesure' },
          ],
        },
        {
          title: 'Déployez et itérez',
          description:
            'Mettez en production rapidement et améliorez en continu. Vos équipes gagnent en productivité dès les premiers jours.',
          icon: 'zap',
          features: [
            { text: 'Déploiement rapide' },
            { text: 'Feedback continu' },
            { text: 'Évolution sans rupture' },
          ],
        },
      ],
    },
    // CTA
    {
      blockType: 'ctaModern',
      blockName: 'CTA',
      title: 'Discutons de votre projet IA',
      description:
        "Chaque projet est unique. Prenons le temps d'échanger sur vos enjeux et de voir comment SUPERFASTTT peut vous aider à reprendre la main sur votre IA.",
      variant: 'gradient',
      links: [
        {
          link: {
            type: 'custom',
            appearance: 'default',
            label: 'Nous contacter',
            url: '/contact',
          },
        },
        {
          link: {
            type: 'custom',
            appearance: 'outline',
            label: 'Voir les tarifs',
            url: '/tarifs',
          },
        },
      ],
    },
  ],
  meta: {
    title: 'À propos | SUPERFASTTT - Plateforme IA Souveraine',
    description:
      'SUPERFASTTT aide les entreprises à reprendre la main sur leur IA. Souveraineté des données, zéro lock-in, architecture ouverte.',
  },
} as RequiredDataFromCollectionSlug<'pages'>

// ========== PAGE CONTACT ==========

function createContactPage(formId: string | number): RequiredDataFromCollectionSlug<'pages'> {
  return {
    slug: 'contact',
    _status: 'published',
    title: 'Contact',
    hero: { type: 'none' },
    layout: [
      // HERO
      {
        blockType: 'heroModern',
        blockName: 'Hero',
        badge: 'Contact',
        title: 'Parlons de',
        highlightedText: 'votre projet IA',
        description:
          'Une question, une demande de démo, un projet ? Notre équipe vous répond sous 24h.',
        links: [],
        trustIndicators: {
          headline: '',
          indicators: [
            { icon: 'zap', label: 'Réponse sous 24h' },
            { icon: 'star', label: 'Équipe dédiée' },
            { icon: 'shield', label: 'Échange confidentiel' },
          ],
        },
      },
      // FORMULAIRE
      {
        blockType: 'formBlock',
        blockName: 'Formulaire de contact',
        enableIntro: true,
        form: formId,
        introContent: {
          root: {
            type: 'root',
            children: [
              {
                type: 'heading',
                children: [
                  {
                    type: 'text',
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: 'Envoyez-nous un message',
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                tag: 'h3',
                version: 1,
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: 'Décrivez votre projet ou posez vos questions. Nous vous recontacterons rapidement.',
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                textFormat: 0,
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
      },
      // INFOS COMPLEMENTAIRES
      {
        blockType: 'content',
        blockName: 'Infos',
        columns: [
          {
            size: 'full',
            richText: createRichTextWithParagraphs([
              'Vous pouvez également nous contacter par email à contact@superfasttt.com',
              'Notre siège : 45 Avenue du Président J.F. Kennedy, 64200 Biarritz, France',
            ]),
          },
        ],
      },
    ],
    meta: {
      title: 'Contact | SUPERFASTTT',
      description:
        "Contactez l'équipe SUPERFASTTT. Une question sur nos solutions IA ? Demandez une démo ou discutons de votre projet.",
    },
  } as RequiredDataFromCollectionSlug<'pages'>
}

// ========== PAGE TARIFS ==========

const tarifsPage: RequiredDataFromCollectionSlug<'pages'> = {
  slug: 'tarifs',
  _status: 'published',
  title: 'Tarifs',
  hero: { type: 'none' },
  layout: [
    // HERO
    {
      blockType: 'heroModern',
      blockName: 'Hero',
      badge: 'Tarifs',
      title: 'Des solutions',
      highlightedText: 'adaptées à vos besoins',
      description:
        'Chaque entreprise est unique. Nos offres le sont aussi. Nous construisons ensemble la solution qui correspond à votre contexte et vos objectifs.',
      links: [
        {
          link: {
            type: 'custom',
            appearance: 'default',
            label: 'Demander un devis gratuit',
            url: '/contact',
          },
        },
      ],
      trustIndicators: {
        headline: '',
        indicators: [
          { icon: 'zap', label: 'Audit gratuit' },
          { icon: 'check', label: 'ROI calculé' },
          { icon: 'star', label: 'Sur-mesure' },
        ],
      },
    },
    // POURQUOI PAS DE PRIX AFFICHES
    {
      blockType: 'featureGrid',
      blockName: 'Notre approche',
      badge: 'Transparence',
      title: 'Pourquoi une tarification sur-mesure ?',
      description:
        'Nous préférons prendre le temps de comprendre vos besoins avant de vous proposer une solution.',
      columns: '3',
      features: [
        {
          icon: 'users',
          title: 'Chaque contexte est unique',
          description:
            'Votre secteur, votre taille, vos enjeux spécifiques : nous adaptons notre offre à votre réalité.',
        },
        {
          icon: 'chart',
          title: 'ROI calculé ensemble',
          description:
            "Avant de parler prix, nous identifions les gains potentiels. L'investissement doit être justifié.",
        },
        {
          icon: 'shield',
          title: 'Engagement mutuel',
          description:
            'Nous nous engageons sur des résultats, pas sur des fonctionnalités. Votre succès est notre priorité.',
        },
      ],
    },
    // GRILLE INDICATIVE
    {
      blockType: 'featureGrid',
      blockName: 'Offres',
      badge: 'Nos offres',
      title: "Trois niveaux d'accompagnement",
      description: 'Du premier pas IA au déploiement enterprise, nous avons une offre pour vous.',
      columns: '3',
      features: [
        {
          icon: 'zap',
          title: 'Starter',
          description:
            "Idéal pour les PME qui font leurs premiers pas avec l'IA. Déploiement rapide, accompagnement personnalisé. Sur devis.",
        },
        {
          icon: 'brain',
          title: 'Business',
          description:
            'Pour les ETI qui veulent un déploiement complet. Intégrations avancées, formation des équipes. Sur devis.',
        },
        {
          icon: 'shield',
          title: 'Enterprise',
          description:
            'Solution sur-mesure pour les grands comptes. Déploiement on-premise possible, SLA dédié. Sur devis.',
        },
      ],
    },
    // CE QUI EST INCLUS
    {
      blockType: 'statsSection',
      blockName: 'Inclus',
      badge: 'Ce qui est inclus',
      title: 'Une offre complète',
      description: 'Toutes nos formules incluent les fondamentaux pour réussir.',
      variant: 'cards',
      columns: '4',
      stats: [
        {
          value: '✓',
          label: 'Audit initial',
          description: 'Gratuit, pour comprendre vos besoins',
        },
        {
          value: '✓',
          label: 'Roadmap IA',
          description: "Plan d'action personnalisé",
        },
        {
          value: '✓',
          label: 'Accompagnement',
          description: 'Formation et support continu',
        },
        {
          value: '✓',
          label: 'Hébergement FR',
          description: 'Souveraineté et conformité RGPD',
        },
      ],
    },
    // COMMENT CA MARCHE
    {
      blockType: 'productShowcase',
      blockName: 'Process',
      badge: 'Comment ça marche',
      title: 'De la demande au déploiement',
      layout: 'alternating',
      items: [
        {
          title: 'Échange découverte',
          description:
            '15-30 minutes pour comprendre vos enjeux, votre contexte, vos objectifs. Sans engagement.',
          icon: 'users',
          features: [{ text: 'Gratuit' }, { text: 'Sans engagement' }, { text: 'À votre rythme' }],
        },
        {
          title: 'Audit de vos besoins',
          description:
            "Nous analysons vos processus actuels et identifions les opportunités d'automatisation et d'IA.",
          icon: 'brain',
          features: [
            { text: 'Audit gratuit' },
            { text: 'Recommandations' },
            { text: 'Quick wins' },
          ],
        },
        {
          title: 'Proposition sur-mesure',
          description:
            'Une offre claire, avec un périmètre défini, un budget transparent, et un ROI estimé.',
          icon: 'chart',
          features: [{ text: 'Prix transparent' }, { text: 'ROI projeté' }, { text: 'Planning' }],
        },
        {
          title: 'Déploiement accompagné',
          description:
            'Nous vous accompagnons à chaque étape : configuration, formation, mise en production.',
          icon: 'zap',
          features: [
            { text: 'Formation incluse' },
            { text: 'Support dédié' },
            { text: 'Suivi régulier' },
          ],
        },
      ],
    },
    // CTA
    {
      blockType: 'ctaModern',
      blockName: 'CTA',
      title: 'Obtenez votre estimation personnalisée',
      description:
        'Demandez un devis gratuit. Nous vous recontactons sous 24h pour planifier un échange découverte.',
      variant: 'gradient',
      links: [
        {
          link: {
            type: 'custom',
            appearance: 'default',
            label: 'Demander un devis gratuit',
            url: '/contact',
          },
        },
      ],
    },
  ],
  meta: {
    title: 'Tarifs | SUPERFASTTT - Solutions IA sur-mesure',
    description:
      'Découvrez nos offres IA adaptées à votre entreprise. Audit gratuit, tarification transparente, accompagnement personnalisé.',
  },
} as RequiredDataFromCollectionSlug<'pages'>

// ========== FOOTER UPDATE ==========

async function updateFooter(payload: Awaited<ReturnType<typeof getPayload>>) {
  console.log('\n🔧 Mise à jour du footer...')

  const currentFooter = await payload.findGlobal({
    slug: 'footer',
    locale: 'fr',
  })

  // Colonnes du footer (sans Équipe et Partenaires)
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
        // Équipe et Partenaires retirés
        { label: 'À propos', link: { type: 'custom' as const, url: '/a-propos' } },
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

  console.log('✅ Footer mis à jour (Équipe et Partenaires retirés)')
}

// ========== MAIN ==========

async function seedEntreprisePages() {
  console.log('🚀 Création des pages Entreprise...\n')

  const payload = await getPayload({ config: configPromise })

  // 1. Mettre à jour le footer
  await updateFooter(payload)

  // 2. Créer ou mettre à jour le formulaire de contact
  console.log('\n📝 Création du formulaire de contact...')
  let contactForm
  const existingForms = await payload.find({
    collection: 'forms',
    where: { title: { equals: 'Formulaire de contact' } },
    limit: 1,
  })

  if (existingForms.docs.length > 0) {
    contactForm = await payload.update({
      collection: 'forms',
      id: existingForms.docs[0].id,
      data: contactFormData,
      context: { disableRevalidate: true },
    })
    console.log('✅ Formulaire de contact mis à jour')
  } else {
    contactForm = await payload.create({
      collection: 'forms',
      data: contactFormData,
      context: { disableRevalidate: true },
    })
    console.log('✨ Formulaire de contact créé')
  }

  // 3. Créer les pages
  const pages = [
    { data: aProposPage, name: 'À propos' },
    { data: createContactPage(contactForm.id), name: 'Contact' },
    { data: tarifsPage, name: 'Tarifs' },
  ]

  console.log('\n📄 Création des pages...')

  for (const page of pages) {
    try {
      const existing = await payload.find({
        collection: 'pages',
        where: { slug: { equals: page.data.slug } },
        locale: 'fr',
        limit: 1,
      })

      if (existing.docs.length > 0) {
        await payload.update({
          collection: 'pages',
          id: existing.docs[0].id,
          data: page.data,
          locale: 'fr',
          context: { disableRevalidate: true },
        })
        console.log(`✅ Page ${page.name} mise à jour`)
      } else {
        await payload.create({
          collection: 'pages',
          data: page.data,
          locale: 'fr',
          context: { disableRevalidate: true },
        })
        console.log(`✨ Page ${page.name} créée`)
      }
    } catch (error) {
      console.error(`❌ Erreur pour la page ${page.name}:`, error)
    }
  }

  console.log('\n✅ Terminé !')
  console.log('\nPages créées :')
  console.log('  - /a-propos')
  console.log('  - /contact')
  console.log('  - /tarifs')
  console.log('\nFooter mis à jour (Équipe et Partenaires retirés)')

  process.exit(0)
}

seedEntreprisePages().catch((error) => {
  console.error('❌ Erreur:', error)
  process.exit(1)
})
