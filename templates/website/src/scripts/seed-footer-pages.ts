/**
 * Script pour créer les pages manquantes du footer
 * - 1 page Secteur: Défense
 * - 9 pages Départements
 * Usage: pnpm tsx src/scripts/seed-footer-pages.ts
 */

import 'dotenv/config'

import type { RequiredDataFromCollectionSlug } from 'payload'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

interface FooterPage {
  slug: string
  title: string
  badge: string
  heroTitle: string
  heroHighlight: string
  heroDescription: string
  metaTitle: string
  metaDescription: string
  problemBadge: string
  problemTitle: string
  problemDescription: string
  problems: Array<{ icon: string; title: string; description: string }>
  solutionBadge: string
  solutionTitle: string
  solutionDescription: string
  solutions: Array<{ icon: string; title: string; description: string }>
  useCases: Array<{
    title: string
    description: string
    icon: string
    features: string[]
  }>
  stats: Array<{ value: string; label: string; description: string }>
  faq: Array<{ question: string; answer: string }>
}

// Page Défense
const DEFENSE_PAGE: FooterPage = {
  slug: 'solutions/defense',
  title: 'Défense & Sécurité',
  badge: 'Défense',
  heroTitle: 'IA souveraine',
  heroHighlight: 'pour la défense et la sécurité',
  heroDescription:
    "Déployez l'intelligence artificielle dans vos opérations de défense avec une garantie de souveraineté absolue. Mode air-gap, hébergement sur site, et traçabilité complète.",
  metaTitle: 'IA Souveraine pour la Défense | SUPERFASTTT',
  metaDescription:
    'Plateforme IA conforme aux exigences de défense. Mode air-gap, déploiement sur site, souveraineté totale des données.',
  problemBadge: 'Enjeux Défense',
  problemTitle: "L'IA dans la défense : souveraineté absolue",
  problemDescription:
    "Le secteur de la défense fait face à des exigences de sécurité qui rendent l'adoption de l'IA complexe.",
  problems: [
    {
      icon: 'shield',
      title: 'Classification des données',
      description:
        "Les données de défense sont classifiées. Aucune solution cloud externe ne peut les traiter. Comment bénéficier de l'IA sans compromettre la sécurité ?",
    },
    {
      icon: 'lock',
      title: 'Indépendance technologique',
      description:
        "Dépendre d'un fournisseur étranger pour l'IA crée une vulnérabilité stratégique. Comment garantir l'autonomie technologique ?",
    },
    {
      icon: 'globe',
      title: 'Fonctionnement déconnecté',
      description:
        "Les environnements opérationnels n'ont pas toujours accès à Internet. Comment déployer l'IA en mode air-gap ?",
    },
  ],
  solutionBadge: 'Notre réponse',
  solutionTitle: 'Une plateforme IA conçue pour la défense',
  solutionDescription:
    'SUPERFASTTT répond aux exigences les plus strictes du secteur de la défense avec une architecture souveraine de bout en bout.',
  solutions: [
    {
      icon: 'lock',
      title: 'Déploiement air-gap',
      description:
        'Installation complète sur vos infrastructures. Fonctionne sans aucune connexion externe. Modèles IA exécutés localement.',
    },
    {
      icon: 'shield',
      title: 'Souveraineté totale',
      description:
        'Aucun composant étranger. Code auditable. Pas de dépendance à des services cloud américains ou chinois.',
    },
    {
      icon: 'chart',
      title: 'Traçabilité complète',
      description:
        'Chaque requête journalisée. Audit trail conforme aux exigences de sécurité. Export pour les contrôles.',
    },
  ],
  useCases: [
    {
      title: 'Analyse de renseignement',
      description:
        "Accélérez l'analyse de grandes masses de données textuelles avec une IA qui reste dans votre périmètre sécurisé.",
      icon: 'brain',
      features: ['Synthèse automatique', "Extraction d'entités", 'Corrélation de sources'],
    },
    {
      title: 'Documentation technique',
      description:
        'Rendez votre documentation technique (manuels, procédures, spécifications) interrogeable en langage naturel.',
      icon: 'database',
      features: ['Recherche instantanée', 'Réponses sourcées', 'Accès hors ligne'],
    },
    {
      title: 'Formation et simulation',
      description:
        'Créez des assistants de formation qui connaissent vos procédures et peuvent répondre aux questions des personnels.',
      icon: 'users',
      features: [
        'Assistants personnalisés',
        'Quiz et évaluations',
        'Parcours de montée en compétences',
      ],
    },
  ],
  stats: [
    {
      value: 'Air-gap',
      label: 'Possible',
      description: 'Fonctionnement complet sans connexion Internet',
    },
    {
      value: '100%',
      label: 'Français',
      description: 'Aucun composant étranger dans la chaîne',
    },
    {
      value: 'On-premise',
      label: 'Natif',
      description: 'Installation sur vos propres infrastructures',
    },
    {
      value: 'Auditable',
      label: 'Code',
      description: 'Code source disponible pour audit de sécurité',
    },
  ],
  faq: [
    {
      question: 'La solution peut-elle fonctionner en mode air-gap ?',
      answer:
        "Oui. SUPERFASTTT peut être déployé en mode totalement déconnecté. Les modèles IA s'exécutent localement, sans aucune connexion à Internet. Les mises à jour se font par support physique sécurisé.",
    },
    {
      question: 'Comment garantissez-vous la souveraineté de la solution ?',
      answer:
        "Notre stack est 100% français/européen : serveurs, base de données, modèles IA. Aucun composant n'est soumis au Cloud Act ou à des lois extraterritoriales. Le code est auditable sur demande.",
    },
    {
      question: 'Quels modèles IA peuvent être utilisés en mode déconnecté ?',
      answer:
        'Nous supportons plusieurs modèles open-source exécutables localement (Mistral, Llama, etc.). Pour les environnements les plus sensibles, nous pouvons intégrer des modèles entraînés spécifiquement pour vos besoins.',
    },
    {
      question: 'La solution est-elle homologuée ?',
      answer:
        "Nous accompagnons nos clients dans le processus d'homologation. Notre architecture est conçue pour faciliter l'obtention des agréments nécessaires (SSI, IGI 1300, etc.).",
    },
  ],
}

// Pages Départements
const DEPARTEMENT_PAGES: FooterPage[] = [
  {
    slug: 'departements/support-client',
    title: 'Support Client',
    badge: 'Support',
    heroTitle: 'IA pour le',
    heroHighlight: 'support client',
    heroDescription:
      'Transformez votre service client avec une IA qui répond instantanément aux questions fréquentes, assiste vos agents, et améliore la satisfaction client.',
    metaTitle: 'IA pour le Support Client | SUPERFASTTT',
    metaDescription:
      "Améliorez votre support client avec l'IA : chatbot intelligent, assistance aux agents, réponses instantanées et personnalisées.",
    problemBadge: 'Enjeux Support',
    problemTitle: 'Le support client face à la pression',
    problemDescription:
      'Les équipes support sont submergées par les demandes répétitives et peinent à maintenir la qualité de service.',
    problems: [
      {
        icon: 'users',
        title: 'Volume de demandes',
        description:
          'Les mêmes questions reviennent constamment. Vos agents passent leur temps sur des demandes simples au lieu des cas complexes.',
      },
      {
        icon: 'zap',
        title: 'Temps de réponse',
        description:
          'Les clients attendent des réponses immédiates, 24h/24. Difficile de tenir ce rythme avec une équipe humaine seule.',
      },
      {
        icon: 'database',
        title: 'Connaissance dispersée',
        description:
          "La documentation produit est éparpillée. Les agents perdent du temps à chercher l'information au lieu de la transmettre.",
      },
    ],
    solutionBadge: 'Notre réponse',
    solutionTitle: 'Une IA qui augmente votre équipe support',
    solutionDescription:
      'SUPERFASTTT donne à vos agents et clients un accès instantané à toute votre connaissance produit.',
    solutions: [
      {
        icon: 'brain',
        title: 'Chatbot intelligent',
        description:
          'Un assistant qui répond aux questions fréquentes avec votre documentation, vos FAQ, vos procédures.',
      },
      {
        icon: 'users',
        title: 'Assistance aux agents',
        description:
          "Suggestions de réponses en temps réel. L'agent valide et personnalise, l'IA fait le travail de recherche.",
      },
      {
        icon: 'chart',
        title: 'Escalade intelligente',
        description:
          "L'IA sait quand passer la main à un humain. Les cas complexes sont dirigés vers le bon expert.",
      },
    ],
    useCases: [
      {
        title: 'Self-service client',
        description:
          'Chatbot disponible 24h/24 qui répond aux questions sur vos produits, commandes, procédures.',
        icon: 'users',
        features: ['Réponses instantanées', 'Disponible 24/7', 'Multilingue'],
      },
      {
        title: 'Copilote agent',
        description:
          "Assistant qui suggère des réponses à vos agents pendant qu'ils traitent les tickets.",
        icon: 'brain',
        features: ['Suggestions contextuelles', 'Historique client', 'Templates personnalisés'],
      },
      {
        title: 'Base de connaissances',
        description: 'Toute votre documentation produit interrogeable en langage naturel.',
        icon: 'database',
        features: ['Recherche instantanée', 'Réponses sourcées', 'Mise à jour automatique'],
      },
    ],
    stats: [
      {
        value: '-60%',
        label: 'Tickets L1',
        description: 'Réduction des demandes de niveau 1 grâce au self-service',
      },
      {
        value: '+40%',
        label: 'Productivité',
        description: "Gain de productivité des agents avec l'assistance IA",
      },
      {
        value: '24/7',
        label: 'Disponibilité',
        description: 'Support automatisé disponible à toute heure',
      },
      {
        value: '<30s',
        label: 'Temps réponse',
        description: 'Temps de réponse moyen du chatbot',
      },
    ],
    faq: [
      {
        question: 'Le chatbot peut-il vraiment répondre à nos questions métier ?',
        answer:
          'Oui, car il est entraîné sur VOTRE documentation : FAQ, manuels, procédures, historique de tickets. Il répond avec vos informations, pas des réponses génériques.',
      },
      {
        question: 'Comment le chatbot sait-il quand passer à un humain ?',
        answer:
          "Vous définissez les règles d'escalade : sujets sensibles, frustration détectée, demande explicite. L'IA transfère le contexte complet à l'agent.",
      },
      {
        question: 'Les agents vont-ils être remplacés ?',
        answer:
          "Non. L'IA traite les demandes simples et répétitives, libérant vos agents pour les cas complexes à forte valeur ajoutée où l'humain fait la différence.",
      },
      {
        question: 'Comment mesurer le ROI ?',
        answer:
          "Tableaux de bord intégrés : volume de demandes traitées par l'IA, temps gagné par les agents, évolution de la satisfaction client, coût par ticket.",
      },
    ],
  },
  {
    slug: 'departements/marketing',
    title: 'Marketing',
    badge: 'Marketing',
    heroTitle: 'IA pour le',
    heroHighlight: 'marketing',
    heroDescription:
      'Accélérez votre production de contenu, personnalisez vos communications, et analysez vos performances avec une IA qui connaît votre marque.',
    metaTitle: 'IA pour le Marketing | SUPERFASTTT',
    metaDescription:
      "Boostez votre marketing avec l'IA : génération de contenu, personnalisation, analyse de données, tout en respectant votre charte.",
    problemBadge: 'Enjeux Marketing',
    problemTitle: 'Le marketing sous pression',
    problemDescription:
      'Les équipes marketing doivent produire toujours plus de contenu, sur toujours plus de canaux, avec des ressources limitées.',
    problems: [
      {
        icon: 'zap',
        title: 'Volume de contenu',
        description:
          "Blog, réseaux sociaux, emails, landing pages... La demande de contenu explose mais l'équipe n'a pas grandi.",
      },
      {
        icon: 'users',
        title: 'Personnalisation',
        description:
          'Les clients attendent des messages personnalisés. Impossible de créer des variantes pour chaque segment manuellement.',
      },
      {
        icon: 'chart',
        title: 'Analyse des données',
        description:
          'Les données sont là mais qui a le temps de les analyser ? Les insights restent cachés dans les tableaux.',
      },
    ],
    solutionBadge: 'Notre réponse',
    solutionTitle: 'Une IA qui connaît votre marque',
    solutionDescription:
      "SUPERFASTTT vous aide à produire plus vite sans sacrifier la qualité ni l'identité de marque.",
    solutions: [
      {
        icon: 'brain',
        title: 'Génération de contenu',
        description:
          "Articles, posts, emails générés dans le ton de votre marque. Vous validez, l'IA produit.",
      },
      {
        icon: 'users',
        title: "Personnalisation à l'échelle",
        description:
          'Créez des variantes de vos messages pour chaque segment, persona, ou étape du funnel.',
      },
      {
        icon: 'chart',
        title: 'Analyse intelligente',
        description:
          "Posez vos questions en langage naturel. L'IA fouille vos données et remonte les insights.",
      },
    ],
    useCases: [
      {
        title: 'Rédaction assistée',
        description:
          "Générez des ébauches d'articles, posts sociaux, emails que vous affinez ensuite.",
        icon: 'brain',
        features: ['Ton de marque respecté', 'SEO intégré', 'Variantes multiples'],
      },
      {
        title: 'Personnalisation emails',
        description: 'Créez des versions personnalisées de vos emails pour chaque segment.',
        icon: 'users',
        features: ['Variables dynamiques', 'A/B testing facilité', 'Ton adapté'],
      },
      {
        title: 'Analyse de campagnes',
        description: 'Interrogez vos données de performance en langage naturel.',
        icon: 'chart',
        features: ['Insights automatiques', 'Recommandations', 'Rapports générés'],
      },
    ],
    stats: [
      {
        value: '3x',
        label: 'Plus de contenu',
        description: 'Multiplication de la production de contenu',
      },
      {
        value: '-50%',
        label: 'Temps rédaction',
        description: 'Réduction du temps de rédaction par contenu',
      },
      {
        value: '+25%',
        label: 'Engagement',
        description: "Amélioration de l'engagement grâce à la personnalisation",
      },
      {
        value: '∞',
        label: 'Variantes',
        description: 'Personnalisation illimitée de vos messages',
      },
    ],
    faq: [
      {
        question: "L'IA peut-elle vraiment écrire dans notre ton de marque ?",
        answer:
          "Oui. Vous alimentez l'IA avec vos guidelines, exemples de contenus validés, vocabulaire à utiliser ou éviter. Elle apprend votre style et le reproduit.",
      },
      {
        question: 'Le contenu généré est-il unique ?',
        answer:
          "Oui. L'IA génère du contenu original à chaque fois. Nous recommandons toujours une relecture humaine avant publication, comme pour tout contenu.",
      },
      {
        question: 'Peut-on connecter nos outils analytics ?',
        answer:
          "Oui. SUPERFASTTT s'intègre à vos sources de données (Google Analytics, CRM, etc.) pour vous permettre d'interroger vos performances en langage naturel.",
      },
      {
        question: 'Quid du SEO ?',
        answer:
          "L'IA peut optimiser vos contenus pour le SEO : suggestions de mots-clés, structure de titres, méta-descriptions. Vous gardez le contrôle éditorial.",
      },
    ],
  },
  {
    slug: 'departements/ingenierie',
    title: 'Ingénierie',
    badge: 'Ingénierie',
    heroTitle: 'IA pour les',
    heroHighlight: 'équipes techniques',
    heroDescription:
      'Accélérez le développement, améliorez la documentation, et capitalisez sur votre savoir-faire technique avec une IA qui comprend votre code.',
    metaTitle: "IA pour l'Ingénierie | SUPERFASTTT",
    metaDescription:
      "Boostez vos équipes techniques avec l'IA : documentation intelligente, assistance au code, partage de connaissances.",
    problemBadge: 'Enjeux Ingénierie',
    problemTitle: 'Les équipes tech face à la complexité',
    problemDescription:
      "Les équipes techniques passent trop de temps à chercher de l'information et pas assez à créer de la valeur.",
    problems: [
      {
        icon: 'database',
        title: 'Documentation obsolète',
        description:
          "La documentation existe mais n'est jamais à jour. Personne ne la maintient, personne ne la trouve.",
      },
      {
        icon: 'users',
        title: 'Onboarding lent',
        description:
          'Les nouveaux développeurs mettent des mois à devenir productifs. Chaque départ emporte du savoir.',
      },
      {
        icon: 'code',
        title: 'Dette technique',
        description:
          "Le code legacy est incompréhensible. Personne n'ose y toucher par peur de tout casser.",
      },
    ],
    solutionBadge: 'Notre réponse',
    solutionTitle: 'Une IA qui comprend votre codebase',
    solutionDescription: "SUPERFASTTT rend votre savoir technique accessible à toute l'équipe.",
    solutions: [
      {
        icon: 'database',
        title: 'Documentation vivante',
        description:
          'Interrogez votre documentation technique, vos wikis, vos README en langage naturel.',
      },
      {
        icon: 'code',
        title: 'Compréhension du code',
        description: "L'IA analyse votre code et répond aux questions sur son fonctionnement.",
      },
      {
        icon: 'users',
        title: 'Accélération onboarding',
        description: 'Les nouveaux ont un assistant qui connaît votre stack et vos conventions.',
      },
    ],
    useCases: [
      {
        title: 'Assistant développeur',
        description: 'Un copilote qui connaît votre codebase, vos patterns, vos conventions.',
        icon: 'code',
        features: ['Explications de code', 'Suggestions contextuelles', 'Revue automatique'],
      },
      {
        title: 'Documentation technique',
        description: 'Rendez toute votre documentation interrogeable instantanément.',
        icon: 'database',
        features: ['Recherche en langage naturel', 'Réponses sourcées', 'API docs'],
      },
      {
        title: 'Base de connaissances',
        description:
          "Capturez les décisions d'architecture, les post-mortems, les bonnes pratiques.",
        icon: 'brain',
        features: ['ADRs consultables', 'Historique des choix', 'Contexte préservé'],
      },
    ],
    stats: [
      {
        value: '-40%',
        label: 'Temps recherche',
        description: "Réduction du temps passé à chercher de l'information",
      },
      {
        value: '2x',
        label: 'Onboarding',
        description: 'Accélération de la montée en compétences des nouveaux',
      },
      {
        value: '100%',
        label: 'Docs accessibles',
        description: 'Toute la documentation en un seul point',
      },
      {
        value: '0',
        label: 'Silos',
        description: 'Fin des silos de connaissance entre équipes',
      },
    ],
    faq: [
      {
        question: "L'IA peut-elle vraiment comprendre notre code ?",
        answer:
          "Oui. L'IA indexe votre codebase et peut expliquer le fonctionnement de fonctions, classes, modules. Elle comprend le contexte et les dépendances.",
      },
      {
        question: 'Notre code reste-t-il confidentiel ?',
        answer:
          'Absolument. Votre code reste dans votre périmètre. Nous proposons des déploiements sur site ou cloud privé pour les organisations les plus sensibles.',
      },
      {
        question: 'Quels langages sont supportés ?',
        answer:
          'Les principaux langages (Python, JavaScript/TypeScript, Java, C#, Go, Rust, etc.) sont supportés. Contactez-nous pour vos besoins spécifiques.',
      },
      {
        question: "Comment ça s'intègre à notre workflow ?",
        answer:
          'Via des intégrations IDE (VS Code, JetBrains), Slack, ou directement dans vos outils internes via notre API.',
      },
    ],
  },
  {
    slug: 'departements/data-analytics',
    title: 'Data & Analytics',
    badge: 'Data',
    heroTitle: 'IA pour la',
    heroHighlight: "data et l'analytics",
    heroDescription:
      "Démocratisez l'accès à vos données. Permettez à tous de poser des questions en langage naturel et d'obtenir des insights instantanés.",
    metaTitle: 'IA pour la Data & Analytics | SUPERFASTTT',
    metaDescription:
      "Rendez vos données accessibles à tous avec l'IA : questions en langage naturel, visualisations automatiques, insights instantanés.",
    problemBadge: 'Enjeux Data',
    problemTitle: 'La data accessible à tous ?',
    problemDescription:
      "Les données sont là mais seuls quelques experts peuvent les exploiter. Le reste de l'entreprise attend.",
    problems: [
      {
        icon: 'users',
        title: 'Bottleneck data team',
        description:
          "Chaque demande d'analyse passe par l'équipe data. File d'attente interminable, frustration généralisée.",
      },
      {
        icon: 'code',
        title: 'SQL requis',
        description:
          'Pour obtenir une réponse, il faut savoir écrire du SQL. Les métiers dépendent des techs pour chaque question.',
      },
      {
        icon: 'chart',
        title: 'Insights cachés',
        description:
          "Les données existent mais personne n'a le temps de les explorer. Les opportunités restent invisibles.",
      },
    ],
    solutionBadge: 'Notre réponse',
    solutionTitle: 'Posez vos questions, obtenez des réponses',
    solutionDescription: "SUPERFASTTT permet à chacun d'interroger vos données en langage naturel.",
    solutions: [
      {
        icon: 'brain',
        title: 'Questions en langage naturel',
        description:
          "Posez votre question comme vous la poseriez à un collègue. L'IA traduit en requête et vous répond.",
      },
      {
        icon: 'chart',
        title: 'Visualisations automatiques',
        description:
          "L'IA choisit le bon type de graphique et le génère. Vous n'avez plus à maîtriser les outils BI.",
      },
      {
        icon: 'zap',
        title: 'Insights proactifs',
        description: "L'IA repère les anomalies et tendances significatives et vous alerte.",
      },
    ],
    useCases: [
      {
        title: 'Self-service analytics',
        description:
          'Chaque collaborateur peut interroger les données sans passer par la data team.',
        icon: 'users',
        features: ['Questions en français', 'Réponses instantanées', 'Pas de SQL requis'],
      },
      {
        title: 'Dashboards conversationnels',
        description: 'Interrogez vos tableaux de bord en langage naturel pour aller plus loin.',
        icon: 'chart',
        features: ['Drill-down vocal', 'Filtres dynamiques', 'Export facile'],
      },
      {
        title: "Détection d'anomalies",
        description: "L'IA surveille vos KPIs et vous alerte en cas de déviation significative.",
        icon: 'zap',
        features: ['Alertes intelligentes', 'Contexte fourni', "Suggestions d'actions"],
      },
    ],
    stats: [
      {
        value: '-80%',
        label: 'Demandes data',
        description: "Réduction des demandes à l'équipe data",
      },
      {
        value: '10x',
        label: "Plus d'analyses",
        description: 'Multiplication des analyses réalisées',
      },
      {
        value: '<5s',
        label: 'Temps réponse',
        description: 'Temps moyen pour obtenir une réponse',
      },
      {
        value: '0',
        label: 'Formation',
        description: 'Pas de formation BI requise',
      },
    ],
    faq: [
      {
        question: "L'IA peut-elle accéder à nos bases de données ?",
        answer:
          "Oui. SUPERFASTTT se connecte à vos sources de données (SQL, data warehouse, etc.) de manière sécurisée. L'IA traduit les questions en requêtes optimisées.",
      },
      {
        question: 'Les réponses sont-elles fiables ?',
        answer:
          "Chaque réponse montre la requête exécutée et les sources utilisées. Vous pouvez vérifier et ajuster. L'IA n'invente pas de données.",
      },
      {
        question: "Comment gérer les droits d'accès ?",
        answer:
          "Les droits d'accès aux données sont respectés. Un utilisateur ne peut interroger que les données auxquelles il a accès dans vos systèmes sources.",
      },
      {
        question: 'Quelles sources de données sont supportées ?',
        answer:
          'Les principales bases SQL (PostgreSQL, MySQL, SQL Server), data warehouses (Snowflake, BigQuery, Redshift), et outils BI (Tableau, Power BI) sont supportés.',
      },
    ],
  },
  {
    slug: 'departements/knowledge',
    title: 'Knowledge Management',
    badge: 'Knowledge',
    heroTitle: 'IA pour le',
    heroHighlight: 'knowledge management',
    heroDescription:
      "Transformez vos documents éparpillés en une base de connaissances intelligente. Chaque collaborateur accède instantanément au savoir de l'entreprise.",
    metaTitle: 'IA pour le Knowledge Management | SUPERFASTTT',
    metaDescription:
      "Centralisez et rendez accessible tout le savoir de votre entreprise avec l'IA. Recherche instantanée, réponses sourcées.",
    problemBadge: 'Enjeux Knowledge',
    problemTitle: "Le savoir dispersé de l'entreprise",
    problemDescription:
      "L'information existe mais personne ne la trouve. Chaque départ emporte du savoir. Les erreurs se répètent.",
    problems: [
      {
        icon: 'database',
        title: 'Documents éparpillés',
        description:
          "Drive, SharePoint, Notion, emails, Slack... L'information est partout et nulle part à la fois.",
      },
      {
        icon: 'users',
        title: 'Perte du savoir',
        description:
          "Quand un expert part, son savoir part avec lui. Des années d'expérience disparaissent.",
      },
      {
        icon: 'zap',
        title: 'Temps de recherche',
        description:
          'Les collaborateurs passent des heures à chercher une information qui existe quelque part.',
      },
    ],
    solutionBadge: 'Notre réponse',
    solutionTitle: 'Une mémoire collective intelligente',
    solutionDescription:
      'SUPERFASTTT indexe toutes vos sources et les rend interrogeables instantanément.',
    solutions: [
      {
        icon: 'database',
        title: 'Indexation multi-sources',
        description:
          "Connectez tous vos outils. L'IA indexe et structure automatiquement vos contenus.",
      },
      {
        icon: 'brain',
        title: 'Recherche intelligente',
        description:
          "Posez votre question en langage naturel. L'IA trouve la réponse et cite ses sources.",
      },
      {
        icon: 'chart',
        title: 'Capitalisation continue',
        description:
          'Chaque interaction enrichit la base. Le savoir tacite devient explicite et partageable.',
      },
    ],
    useCases: [
      {
        title: 'Base de connaissances unifiée',
        description: "Un point d'entrée unique pour tout le savoir de l'entreprise.",
        icon: 'database',
        features: ['Toutes sources connectées', 'Mise à jour automatique', 'Droits respectés'],
      },
      {
        title: 'Assistant expert',
        description:
          "Chaque collaborateur a accès à un assistant qui connaît tout le savoir de l'entreprise.",
        icon: 'brain',
        features: ['Réponses sourcées', 'Contexte préservé', 'Suggestions proactives'],
      },
      {
        title: 'Capture du savoir tacite',
        description: 'Transformez les échanges et décisions en connaissances documentées.',
        icon: 'users',
        features: ['Résumés de réunions', 'Décisions tracées', 'Expertise capitalisée'],
      },
    ],
    stats: [
      {
        value: '-70%',
        label: 'Temps recherche',
        description: "Réduction du temps passé à chercher l'information",
      },
      {
        value: '100%',
        label: 'Savoir accessible',
        description: 'Tout le savoir en un seul point',
      },
      {
        value: '0',
        label: 'Perte au départ',
        description: 'Le savoir reste même quand les experts partent',
      },
      {
        value: '∞',
        label: 'Sources',
        description: 'Connexion illimitée de sources documentaires',
      },
    ],
    faq: [
      {
        question: 'Quelles sources pouvez-vous connecter ?',
        answer:
          "Google Drive, Microsoft SharePoint/OneDrive, Notion, Confluence, Slack, emails, et bien d'autres. Notre liste de connecteurs s'étend continuellement.",
      },
      {
        question: "Comment sont gérés les droits d'accès ?",
        answer:
          "Les droits de vos sources sont respectés. Un utilisateur ne voit que les documents auxquels il a accès dans les systèmes d'origine.",
      },
      {
        question: 'La mise à jour est-elle automatique ?',
        answer:
          "Oui. L'indexation est incrémentale et quasi temps réel. Quand un document change, l'index est mis à jour automatiquement.",
      },
      {
        question: 'Comment capturer le savoir tacite ?',
        answer:
          'Via des intégrations Slack/Teams qui captent les échanges pertinents, des résumés de réunions automatiques, et des assistants qui documentent les décisions.',
      },
    ],
  },
  {
    slug: 'departements/it',
    title: 'IT',
    badge: 'IT',
    heroTitle: 'IA pour les',
    heroHighlight: 'équipes IT',
    heroDescription:
      'Automatisez le support IT de niveau 1, accélérez la résolution des incidents, et donnez à vos utilisateurs un assistant disponible 24h/24.',
    metaTitle: "IA pour l'IT | SUPERFASTTT",
    metaDescription:
      "Optimisez votre support IT avec l'IA : chatbot helpdesk, résolution d'incidents, documentation technique accessible.",
    problemBadge: 'Enjeux IT',
    problemTitle: 'Le support IT sous pression',
    problemDescription:
      'Les équipes IT sont submergées par les demandes répétitives et manquent de temps pour les projets à valeur ajoutée.',
    problems: [
      {
        icon: 'users',
        title: 'Demandes répétitives',
        description:
          '80% des tickets concernent les mêmes problèmes : mots de passe, accès, configuration. Un travail répétitif qui occupe vos meilleurs éléments.',
      },
      {
        icon: 'zap',
        title: 'Disponibilité',
        description:
          "Les utilisateurs ont besoin d'aide à toute heure. Impossible de maintenir un support humain 24h/24.",
      },
      {
        icon: 'database',
        title: 'Documentation dispersée',
        description:
          'Les procédures existent mais sont impossibles à trouver. Chaque technicien a sa propre méthode.',
      },
    ],
    solutionBadge: 'Notre réponse',
    solutionTitle: "Un helpdesk augmenté par l'IA",
    solutionDescription:
      'SUPERFASTTT résout les demandes simples et assiste vos techniciens sur les cas complexes.',
    solutions: [
      {
        icon: 'brain',
        title: 'Chatbot helpdesk',
        description:
          'Un assistant qui répond aux questions IT courantes, guide les utilisateurs, et résout les problèmes simples.',
      },
      {
        icon: 'database',
        title: 'Base de connaissances IT',
        description:
          'Toutes vos procédures, guides de dépannage, FAQ en un seul endroit interrogeable.',
      },
      {
        icon: 'chart',
        title: 'Analyse des incidents',
        description:
          "L'IA détecte les patterns, identifie les problèmes récurrents, et suggère des améliorations.",
      },
    ],
    useCases: [
      {
        title: 'Self-service IT',
        description: 'Les utilisateurs résolvent leurs problèmes simples sans ouvrir de ticket.',
        icon: 'users',
        features: ['Réinitialisation mot de passe', "Demande d'accès", 'Guides interactifs'],
      },
      {
        title: 'Assistant technicien',
        description: 'Un copilote qui aide vos techniciens à diagnostiquer et résoudre plus vite.',
        icon: 'brain',
        features: [
          'Recherche dans les docs',
          'Historique des incidents',
          'Suggestions de résolution',
        ],
      },
      {
        title: 'Prévention des incidents',
        description: 'Analyse des patterns pour prévenir les problèmes récurrents.',
        icon: 'chart',
        features: ["Détection d'anomalies", 'Alertes proactives', 'Recommandations'],
      },
    ],
    stats: [
      {
        value: '-50%',
        label: 'Tickets L1',
        description: 'Réduction des tickets de niveau 1',
      },
      {
        value: '24/7',
        label: 'Support',
        description: 'Assistance disponible à toute heure',
      },
      {
        value: '-30%',
        label: 'Temps résolution',
        description: 'Réduction du temps de résolution moyen',
      },
      {
        value: '+40%',
        label: 'Satisfaction',
        description: 'Amélioration de la satisfaction utilisateur',
      },
    ],
    faq: [
      {
        question: 'Le chatbot peut-il vraiment résoudre des problèmes IT ?',
        answer:
          "Oui, pour les problèmes documentés et les procédures standards. Il guide l'utilisateur étape par étape. Pour les cas complexes, il transfère au support humain avec tout le contexte.",
      },
      {
        question: 'Comment intégrer notre ITSM existant ?',
        answer:
          "SUPERFASTTT s'intègre aux principaux outils ITSM (ServiceNow, Jira Service Management, Freshservice, etc.) pour créer des tickets et enrichir les données.",
      },
      {
        question: 'Les utilisateurs ne vont-ils pas préférer un humain ?',
        answer:
          'Pour les problèmes simples, les utilisateurs préfèrent une résolution immédiate. Le chatbot répond en secondes, pas en heures. Pour les cas complexes, le transfert humain reste disponible.',
      },
      {
        question: 'Comment alimenter la base de connaissances ?',
        answer:
          "Importez vos procédures existantes, vos FAQ, vos guides. L'IA apprend aussi des résolutions de tickets pour enrichir automatiquement la base.",
      },
    ],
  },
  {
    slug: 'departements/juridique',
    title: 'Juridique',
    badge: 'Juridique',
    heroTitle: 'IA pour les',
    heroHighlight: 'équipes juridiques',
    heroDescription:
      "Accélérez la recherche juridique, l'analyse de contrats, et la veille réglementaire avec une IA qui préserve la confidentialité absolue.",
    metaTitle: 'IA pour le Juridique | SUPERFASTTT',
    metaDescription:
      "Optimisez vos opérations juridiques avec l'IA : recherche, analyse de contrats, veille réglementaire, en toute confidentialité.",
    problemBadge: 'Enjeux Juridique',
    problemTitle: 'Les juristes débordés',
    problemDescription:
      'Les équipes juridiques passent trop de temps sur des tâches répétitives et manquent de temps pour le conseil stratégique.',
    problems: [
      {
        icon: 'database',
        title: 'Recherche chronophage',
        description:
          'Fouiller la jurisprudence, les contrats passés, la réglementation... Des heures de recherche pour chaque dossier.',
      },
      {
        icon: 'zap',
        title: 'Volume de contrats',
        description:
          'Le nombre de contrats à relire explose. Impossible de tout analyser en profondeur.',
      },
      {
        icon: 'chart',
        title: 'Veille réglementaire',
        description:
          'La réglementation évolue constamment. Comment rester à jour sans y passer tout son temps ?',
      },
    ],
    solutionBadge: 'Notre réponse',
    solutionTitle: 'Une IA qui respecte le secret professionnel',
    solutionDescription:
      'SUPERFASTTT accélère le travail juridique tout en garantissant la confidentialité absolue.',
    solutions: [
      {
        icon: 'brain',
        title: 'Recherche augmentée',
        description:
          'Interrogez jurisprudence, doctrine et vos propres dossiers en langage naturel.',
      },
      {
        icon: 'database',
        title: 'Analyse de contrats',
        description:
          'Détectez les clauses à risque, comparez avec vos standards, identifiez les écarts.',
      },
      {
        icon: 'chart',
        title: 'Veille automatisée',
        description: 'Surveillez les évolutions réglementaires pertinentes et recevez des alertes.',
      },
    ],
    useCases: [
      {
        title: 'Recherche juridique',
        description: 'Trouvez instantanément la jurisprudence et la doctrine pertinentes.',
        icon: 'brain',
        features: ['Recherche multi-sources', 'Synthèse automatique', 'Citations précises'],
      },
      {
        title: 'Revue de contrats',
        description: 'Analysez vos contrats pour identifier les clauses problématiques.',
        icon: 'database',
        features: [
          'Détection de clauses',
          'Comparaison aux standards',
          'Suggestions de modifications',
        ],
      },
      {
        title: 'Veille réglementaire',
        description: 'Restez informé des évolutions juridiques qui vous concernent.',
        icon: 'chart',
        features: ['Alertes personnalisées', 'Résumés automatiques', 'Impact sur vos activités'],
      },
    ],
    stats: [
      {
        value: '-60%',
        label: 'Temps recherche',
        description: 'Réduction du temps de recherche documentaire',
      },
      {
        value: '3x',
        label: 'Contrats analysés',
        description: "Multiplication de la capacité d'analyse",
      },
      {
        value: '100%',
        label: 'Confidentiel',
        description: "Données jamais partagées ni utilisées pour l'entraînement",
      },
      {
        value: '∞',
        label: 'Sources',
        description: 'Connexion illimitée de bases juridiques',
      },
    ],
    faq: [
      {
        question: 'La confidentialité est-elle garantie ?',
        answer:
          'Absolument. Isolation totale de vos données, chiffrement bout en bout, aucun accès par nos équipes. Vos dossiers sont aussi protégés que dans votre coffre-fort.',
      },
      {
        question: "L'IA peut-elle remplacer un juriste ?",
        answer:
          "Non. L'IA accélère les tâches de recherche et d'analyse mais le jugement juridique reste celui du professionnel. C'est un outil d'assistance, pas de remplacement.",
      },
      {
        question: 'Quelles bases juridiques sont accessibles ?',
        answer:
          "Légifrance, bases de jurisprudence, doctrine, plus vos propres documents (contrats, notes, modèles). Nous pouvons intégrer d'autres sources sur demande.",
      },
      {
        question: 'Comment vérifier les sources citées ?',
        answer:
          'Chaque réponse inclut les références précises (articles, décisions, pages). Vous pouvez cliquer pour accéder au document source et vérifier.',
      },
    ],
  },
  {
    slug: 'departements/rh',
    title: 'Ressources Humaines',
    badge: 'RH',
    heroTitle: 'IA pour les',
    heroHighlight: 'ressources humaines',
    heroDescription:
      "Automatisez les réponses aux questions RH, accélérez le recrutement, et améliorez l'expérience collaborateur avec une IA qui connaît vos politiques.",
    metaTitle: 'IA pour les RH | SUPERFASTTT',
    metaDescription:
      "Transformez vos RH avec l'IA : chatbot collaborateur, aide au recrutement, onboarding automatisé, en toute conformité RGPD.",
    problemBadge: 'Enjeux RH',
    problemTitle: 'Les RH submergées de demandes',
    problemDescription:
      'Les équipes RH passent trop de temps à répondre aux mêmes questions et manquent de temps pour les projets stratégiques.',
    problems: [
      {
        icon: 'users',
        title: 'Questions répétitives',
        description:
          'Congés, mutuelle, notes de frais... Les mêmes questions reviennent sans cesse et mobilisent vos équipes.',
      },
      {
        icon: 'zap',
        title: 'Recrutement lent',
        description:
          'Tri des CV, présélection, coordination des entretiens... Le processus est long et fastidieux.',
      },
      {
        icon: 'database',
        title: 'Onboarding manuel',
        description:
          'Chaque nouvelle recrue nécessite un accompagnement individuel. Difficile à scaler.',
      },
    ],
    solutionBadge: 'Notre réponse',
    solutionTitle: 'Une IA au service des collaborateurs',
    solutionDescription:
      "SUPERFASTTT répond aux questions des collaborateurs et libère du temps pour l'humain.",
    solutions: [
      {
        icon: 'users',
        title: 'Assistant collaborateur',
        description: 'Un chatbot qui répond instantanément aux questions RH courantes, 24h/24.',
      },
      {
        icon: 'brain',
        title: 'Aide au recrutement',
        description: 'Présélection des CV, génération de questions, synthèse des entretiens.',
      },
      {
        icon: 'zap',
        title: 'Onboarding augmenté',
        description: 'Un assistant qui accompagne les nouveaux et répond à toutes leurs questions.',
      },
    ],
    useCases: [
      {
        title: 'Chatbot RH',
        description:
          'Réponses instantanées aux questions sur les congés, la mutuelle, les process RH.',
        icon: 'users',
        features: ['Disponible 24/7', 'Personnalisé par pays/entité', 'Escalade RH si nécessaire'],
      },
      {
        title: 'Screening CV',
        description: 'Analyse et présélection automatique des candidatures selon vos critères.',
        icon: 'brain',
        features: [
          'Critères personnalisables',
          'Ranking des candidats',
          'Détection de biais réduite',
        ],
      },
      {
        title: 'Buddy virtuel',
        description: 'Un assistant qui accompagne les nouveaux pendant leur onboarding.',
        icon: 'zap',
        features: ['Réponses aux questions', 'Parcours guidé', 'Check-ins automatiques'],
      },
    ],
    stats: [
      {
        value: '-70%',
        label: 'Demandes L1',
        description: 'Réduction des demandes RH de niveau 1',
      },
      {
        value: '-50%',
        label: 'Temps recrutement',
        description: 'Réduction du temps de présélection',
      },
      {
        value: '24/7',
        label: 'Disponibilité',
        description: 'Réponses aux collaborateurs à toute heure',
      },
      {
        value: '+30%',
        label: 'Satisfaction',
        description: "Amélioration de l'expérience collaborateur",
      },
    ],
    faq: [
      {
        question: 'Le chatbot connaît-il nos politiques RH spécifiques ?',
        answer:
          "Oui. Vous alimentez l'IA avec vos politiques, conventions, accords d'entreprise. Il répond avec VOS règles, pas des informations génériques.",
      },
      {
        question: 'Les données personnelles sont-elles protégées ?',
        answer:
          'Absolument. RGPD natif, hébergement France/Europe, pas de transfert de données personnelles hors de votre périmètre. Nous sommes conçus pour la conformité.',
      },
      {
        question: "L'IA peut-elle prendre des décisions de recrutement ?",
        answer:
          "Non. L'IA assiste la présélection mais la décision reste humaine. Elle fournit des analyses et suggestions que vos recruteurs valident.",
      },
      {
        question: 'Comment gérer les différences par pays/entité ?',
        answer:
          "Le chatbot s'adapte au contexte : pays, entité, statut du collaborateur. Chacun reçoit les réponses correspondant à SA situation.",
      },
    ],
  },
  {
    slug: 'departements/productivite',
    title: 'Productivité',
    badge: 'Productivité',
    heroTitle: 'IA pour la',
    heroHighlight: 'productivité',
    heroDescription:
      'Éliminez les tâches répétitives, automatisez les workflows, et permettez à chacun de se concentrer sur ce qui compte vraiment.',
    metaTitle: 'IA pour la Productivité | SUPERFASTTT',
    metaDescription:
      "Boostez la productivité de vos équipes avec l'IA : automatisation des tâches, assistants personnels, workflows intelligents.",
    problemBadge: 'Enjeux Productivité',
    problemTitle: 'Trop de temps perdu',
    problemDescription:
      'Les collaborateurs passent une grande partie de leur temps sur des tâches à faible valeur ajoutée.',
    problems: [
      {
        icon: 'zap',
        title: 'Tâches répétitives',
        description:
          'Emails, rapports, synthèses, mises à jour... Des heures passées sur des tâches qui pourraient être automatisées.',
      },
      {
        icon: 'database',
        title: "Recherche d'information",
        description:
          'Trouver la bonne information prend du temps. Elle existe quelque part mais où exactement ?',
      },
      {
        icon: 'users',
        title: 'Réunions inefficaces',
        description:
          'Trop de réunions, pas assez de comptes-rendus, des actions perdues entre les mailles.',
      },
    ],
    solutionBadge: 'Notre réponse',
    solutionTitle: 'Un assistant personnel pour chacun',
    solutionDescription:
      "SUPERFASTTT donne à chaque collaborateur un assistant IA qui s'occupe des tâches fastidieuses.",
    solutions: [
      {
        icon: 'brain',
        title: 'Assistant personnel',
        description: 'Un copilote qui aide à rédiger, synthétiser, rechercher, et organiser.',
      },
      {
        icon: 'zap',
        title: 'Automatisation',
        description:
          'Les tâches répétitives sont automatisées. Le collaborateur se concentre sur la valeur.',
      },
      {
        icon: 'chart',
        title: 'Insights proactifs',
        description: "L'IA suggère des actions, rappelle les échéances, anticipe les besoins.",
      },
    ],
    useCases: [
      {
        title: 'Rédaction assistée',
        description: "Emails, rapports, présentations générés et affinés avec l'aide de l'IA.",
        icon: 'brain',
        features: ['Ébauches rapides', 'Ton adapté au contexte', 'Correction et amélioration'],
      },
      {
        title: 'Synthèse de réunions',
        description: 'Comptes-rendus automatiques, actions extraites, rappels envoyés.',
        icon: 'users',
        features: ['Transcription automatique', 'Points clés extraits', 'Suivi des actions'],
      },
      {
        title: 'Recherche intelligente',
        description: "Trouvez n'importe quelle information dans vos outils en quelques secondes.",
        icon: 'database',
        features: ['Recherche multi-sources', 'Réponses directes', 'Contexte préservé'],
      },
    ],
    stats: [
      {
        value: '+2h',
        label: 'Par jour',
        description: 'Temps gagné en moyenne par collaborateur',
      },
      {
        value: '-80%',
        label: 'Tâches répétitives',
        description: 'Réduction des tâches manuelles récurrentes',
      },
      {
        value: '100%',
        label: 'Équipes',
        description: 'Accessible à tous, pas seulement aux experts',
      },
      {
        value: '0',
        label: 'Formation',
        description: 'Interface en langage naturel, pas de compétence requise',
      },
    ],
    faq: [
      {
        question: "L'IA peut-elle vraiment écrire à ma place ?",
        answer:
          'Elle génère des ébauches que vous affinez. Pour les emails et documents standards, elle fait 80% du travail. Vous validez, ajustez, et envoyez.',
      },
      {
        question: 'Comment fonctionne la synthèse de réunions ?',
        answer:
          "L'IA transcrit la réunion, identifie les points clés, extrait les décisions et actions, et génère un compte-rendu structuré. Vous validez et partagez.",
      },
      {
        question: 'Mes documents restent-ils confidentiels ?',
        answer:
          "Oui. Vos documents ne quittent pas votre périmètre. L'IA traite vos données sans les stocker ni les utiliser pour l'entraînement.",
      },
      {
        question: "Faut-il une formation pour utiliser l'IA ?",
        answer:
          "Non. L'interface est en langage naturel. Vous parlez à l'IA comme vous parleriez à un assistant humain. Elle comprend le contexte et s'adapte.",
      },
    ],
  },
]

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

function createPageData(page: FooterPage): RequiredDataFromCollectionSlug<'pages'> {
  return {
    slug: page.slug,
    _status: 'draft',
    title: page.title,
    hero: { type: 'none' },
    layout: [
      // HERO
      {
        blockType: 'heroModern',
        blockName: 'Hero',
        badge: page.badge,
        title: page.heroTitle,
        highlightedText: page.heroHighlight,
        description: page.heroDescription,
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
              label: "Voir les cas d'usage",
              url: '/produit/vue-ensemble',
            },
          },
        ],
        trustIndicators: {
          headline: '',
          indicators: [
            { icon: 'shield', label: 'RGPD' },
            { icon: 'globe', label: 'Souverain' },
            { icon: 'lock', label: 'Conforme' },
          ],
        },
      },
      // PROBLÉMATIQUE
      {
        blockType: 'featureGrid',
        blockName: 'Problématique',
        badge: page.problemBadge,
        title: page.problemTitle,
        description: page.problemDescription,
        columns: '3',
        features: page.problems.map((p) => ({
          icon: p.icon,
          title: p.title,
          description: p.description,
        })),
      },
      // SOLUTION
      {
        blockType: 'featureGrid',
        blockName: 'Solution',
        badge: page.solutionBadge,
        title: page.solutionTitle,
        description: page.solutionDescription,
        columns: '3',
        features: page.solutions.map((s) => ({
          icon: s.icon,
          title: s.title,
          description: s.description,
        })),
      },
      // CAS D'USAGE
      {
        blockType: 'productShowcase',
        blockName: "Cas d'usage",
        badge: "Cas d'usage",
        title: 'Comment nos clients utilisent SUPERFASTTT',
        layout: 'alternating',
        items: page.useCases.map((uc) => ({
          title: uc.title,
          description: uc.description,
          icon: uc.icon,
          features: uc.features.map((f) => ({ text: f })),
        })),
      },
      // STATS
      {
        blockType: 'statsSection',
        blockName: 'Conformité',
        badge: 'Garanties',
        title: 'Une plateforme conçue pour votre métier',
        variant: 'cards',
        columns: '4',
        stats: page.stats.map((s) => ({
          value: s.value,
          label: s.label,
          description: s.description,
        })),
      },
      // FAQ
      {
        blockType: 'faq',
        blockName: 'FAQ',
        badge: 'FAQ',
        title: 'Questions fréquentes',
        items: page.faq.map((f) => ({
          question: f.question,
          answer: createRichText(f.answer),
        })),
        allowMultipleOpen: false,
      },
      // CTA
      {
        blockType: 'ctaModern',
        blockName: 'CTA',
        title: 'Prêt à transformer votre ' + page.title.toLowerCase() + ' ?',
        description:
          "Découvrez comment SUPERFASTTT peut répondre à vos enjeux spécifiques. Démonstration personnalisée sur vos cas d'usage réels.",
        variant: 'gradient',
        links: [
          {
            link: {
              type: 'custom',
              appearance: 'default',
              label: 'Demander une démonstration',
              url: '/contact',
            },
          },
        ],
      },
    ],
    meta: {
      title: page.metaTitle,
      description: page.metaDescription,
    },
  } as RequiredDataFromCollectionSlug<'pages'>
}

async function seedFooterPages() {
  console.log('🚀 Création des pages du footer...\n')

  const payload = await getPayload({ config: configPromise })

  // Toutes les pages à créer
  const allPages = [DEFENSE_PAGE, ...DEPARTEMENT_PAGES]

  let created = 0
  let updated = 0
  let errors = 0

  for (const page of allPages) {
    const pageData = createPageData(page)

    try {
      // Chercher si la page existe déjà
      const existing = await payload.find({
        collection: 'pages',
        where: { slug: { equals: page.slug } },
        locale: 'fr',
        limit: 1,
      })

      if (existing.docs.length > 0) {
        await payload.update({
          collection: 'pages',
          id: existing.docs[0].id,
          data: pageData,
          locale: 'fr',
          context: { disableRevalidate: true },
        })
        console.log(`✅ Mise à jour: ${page.title} (/${page.slug})`)
        updated++
      } else {
        await payload.create({
          collection: 'pages',
          data: pageData,
          locale: 'fr',
          context: { disableRevalidate: true },
        })
        console.log(`✨ Créée: ${page.title} (/${page.slug})`)
        created++
      }
    } catch (error) {
      console.error(`❌ Erreur pour ${page.slug}:`, error)
      errors++
    }
  }

  console.log('\n📊 Résumé:')
  console.log(`   ✨ Créées: ${created}`)
  console.log(`   ✅ Mises à jour: ${updated}`)
  console.log(`   ❌ Erreurs: ${errors}`)

  process.exit(0)
}

seedFooterPages().catch((error) => {
  console.error('❌ Erreur:', error)
  process.exit(1)
})
