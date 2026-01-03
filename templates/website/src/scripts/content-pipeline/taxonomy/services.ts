/**
 * Services Taxonomy
 * Defines all service pages for the content pipeline
 */

import type { ServiceTaxonomy } from '../types'

export const services: ServiceTaxonomy[] = [
  // ============================================================================
  // RAG & BASE DE CONNAISSANCES
  // ============================================================================
  {
    id: 'service-rag',
    type: 'service',
    slug: {
      fr: 'produit/rag',
      en: 'product/rag',
      es: 'producto/rag',
    },
    title: {
      fr: 'RAG & Base de Connaissances',
      en: 'RAG & Knowledge Base',
      es: 'RAG y Base de Conocimientos',
    },
    description: {
      fr: "Transformez vos documents en intelligence exploitable avec notre système RAG multimodal. Indexez PDF, images, audio et connectez vos sources d'entreprise.",
      en: 'Transform your documents into actionable intelligence with our multimodal RAG system. Index PDFs, images, audio and connect your enterprise sources.',
      es: 'Transforme sus documentos en inteligencia accionable con nuestro sistema RAG multimodal. Indexe PDFs, imágenes, audio y conecte sus fuentes empresariales.',
    },
    seoKeywords: {
      fr: 'RAG entreprise, base de connaissances IA, recherche sémantique, indexation documents',
      en: 'enterprise RAG, AI knowledge base, semantic search, document indexing',
      es: 'RAG empresarial, base de conocimientos IA, búsqueda semántica, indexación documentos',
    },
    parentId: undefined,
    icon: 'database',
    priority: 'high',
    batch: 1,
    useCases: [
      'Recherche dans la documentation interne',
      'FAQ automatisée',
      'Assistance aux équipes support',
      "Capitalisation des connaissances d'experts",
    ],
    benefits: [
      'Réponses précises basées sur vos documents',
      'Réduction du temps de recherche de 80%',
      'Préservation du savoir institutionnel',
    ],
    targetAudiences: ['DSI', 'Knowledge Managers', 'Support Client', 'RH'],
  },
  {
    id: 'service-rag-multimodal',
    type: 'service',
    slug: {
      fr: 'rag-multimodal',
      en: 'multimodal-rag',
      es: 'rag-multimodal',
    },
    title: {
      fr: 'RAG Multimodal',
      en: 'Multimodal RAG',
      es: 'RAG Multimodal',
    },
    description: {
      fr: 'Indexez et interrogez tous types de contenus : PDF, images, présentations, audio, vidéos. Notre RAG comprend le contexte visuel et textuel.',
      en: 'Index and query all content types: PDFs, images, presentations, audio, videos. Our RAG understands visual and textual context.',
      es: 'Indexe e interrogue todo tipo de contenidos: PDFs, imágenes, presentaciones, audio, videos. Nuestro RAG comprende el contexto visual y textual.',
    },
    seoKeywords: {
      fr: 'RAG multimodal, indexation images, OCR intelligent, analyse documents',
      en: 'multimodal RAG, image indexing, intelligent OCR, document analysis',
      es: 'RAG multimodal, indexación imágenes, OCR inteligente, análisis documentos',
    },
    parentId: 'service-rag',
    icon: 'image',
    priority: 'high',
    batch: 1,
    useCases: [
      'Analyse de schémas techniques',
      'Extraction de données de factures',
      'Recherche dans les présentations',
    ],
    benefits: [
      'Support de 50+ formats de fichiers',
      'OCR intelligent intégré',
      'Compréhension du contexte visuel',
    ],
    targetAudiences: ['R&D', 'Finance', 'Juridique'],
  },
  {
    id: 'service-recherche-semantique',
    type: 'service',
    slug: {
      fr: 'recherche-semantique',
      en: 'semantic-search',
      es: 'busqueda-semantica',
    },
    title: {
      fr: 'Recherche Sémantique',
      en: 'Semantic Search',
      es: 'Búsqueda Semántica',
    },
    description: {
      fr: 'Trouvez les informations pertinentes même sans les mots-clés exacts. Notre moteur comprend le sens de vos requêtes.',
      en: 'Find relevant information even without exact keywords. Our engine understands the meaning of your queries.',
      es: 'Encuentre información relevante incluso sin palabras clave exactas. Nuestro motor comprende el significado de sus consultas.',
    },
    seoKeywords: {
      fr: 'recherche sémantique entreprise, moteur de recherche IA, vector search',
      en: 'enterprise semantic search, AI search engine, vector search',
      es: 'búsqueda semántica empresarial, motor de búsqueda IA, vector search',
    },
    parentId: 'service-rag',
    icon: 'search',
    priority: 'medium',
    batch: 2,
    useCases: [
      'Recherche documentaire avancée',
      'Discovery de contenus',
      'Suggestions automatiques',
    ],
    benefits: ['Pertinence 10x supérieure', 'Zéro configuration de synonymes', 'Multilingue natif'],
    targetAudiences: ['Knowledge Managers', 'Documentalistes', 'Chercheurs'],
  },

  // ============================================================================
  // ORCHESTRATION MULTI-MODÈLES
  // ============================================================================
  {
    id: 'service-orchestration',
    type: 'service',
    slug: {
      fr: 'produit/orchestration',
      en: 'product/orchestration',
      es: 'producto/orquestacion',
    },
    title: {
      fr: 'Orchestration Multi-Modèles',
      en: 'Multi-Model Orchestration',
      es: 'Orquestación Multi-Modelos',
    },
    description: {
      fr: 'Routez intelligemment vos requêtes vers le bon modèle. Combinez cloud et on-premise selon la sensibilité des données.',
      en: 'Intelligently route your requests to the right model. Combine cloud and on-premise based on data sensitivity.',
      es: 'Enrute inteligentemente sus solicitudes al modelo adecuado. Combine cloud y on-premise según la sensibilidad de los datos.',
    },
    seoKeywords: {
      fr: 'orchestration LLM, routage IA, multi-modèles, gateway IA',
      en: 'LLM orchestration, AI routing, multi-model, AI gateway',
      es: 'orquestación LLM, enrutamiento IA, multi-modelos, gateway IA',
    },
    parentId: undefined,
    icon: 'git-branch',
    priority: 'high',
    batch: 1,
    useCases: [
      'Données sensibles vers modèles locaux',
      'Optimisation des coûts',
      'Fallback automatique',
    ],
    benefits: ['Réduction des coûts de 40%', 'Aucune donnée sensible sur le cloud', 'SLA garanti'],
    targetAudiences: ['DSI', 'CTO', 'RSSI'],
  },
  {
    id: 'service-multi-providers',
    type: 'service',
    slug: {
      fr: 'multi-fournisseurs-llm',
      en: 'multi-llm-providers',
      es: 'multi-proveedores-llm',
    },
    title: {
      fr: 'Multi-Fournisseurs LLM',
      en: 'Multi-LLM Providers',
      es: 'Multi-Proveedores LLM',
    },
    description: {
      fr: 'OpenAI, Anthropic, Mistral, Ollama, OpenRouter... Connectez tous vos fournisseurs depuis une interface unique.',
      en: 'OpenAI, Anthropic, Mistral, Ollama, OpenRouter... Connect all your providers from a single interface.',
      es: 'OpenAI, Anthropic, Mistral, Ollama, OpenRouter... Conecte todos sus proveedores desde una única interfaz.',
    },
    seoKeywords: {
      fr: 'multi-fournisseurs LLM, OpenAI alternative, Mistral entreprise, LiteLLM',
      en: 'multi-provider LLM, OpenAI alternative, enterprise Mistral, LiteLLM',
      es: 'multi-proveedor LLM, alternativa OpenAI, Mistral empresarial, LiteLLM',
    },
    parentId: 'service-orchestration',
    icon: 'layers',
    priority: 'high',
    batch: 1,
    useCases: [
      'Éviter le vendor lock-in',
      'Tester de nouveaux modèles',
      'Optimiser le rapport qualité/prix',
    ],
    benefits: ['Support de 100+ modèles', 'Clés API par tenant', 'Changement de modèle sans code'],
    targetAudiences: ['CTO', 'Architectes', 'DevOps'],
  },
  {
    id: 'service-routage-intelligent',
    type: 'service',
    slug: {
      fr: 'routage-intelligent',
      en: 'intelligent-routing',
      es: 'enrutamiento-inteligente',
    },
    title: {
      fr: 'Routage Intelligent',
      en: 'Intelligent Routing',
      es: 'Enrutamiento Inteligente',
    },
    description: {
      fr: 'Définissez des règles de routage basées sur le contenu, la sensibilité, le coût ou la performance. Automatisez vos choix de modèles.',
      en: 'Define routing rules based on content, sensitivity, cost or performance. Automate your model choices.',
      es: 'Defina reglas de enrutamiento basadas en contenido, sensibilidad, costo o rendimiento. Automatice sus elecciones de modelos.',
    },
    seoKeywords: {
      fr: 'routage LLM, politique IA, classification données, règles IA',
      en: 'LLM routing, AI policy, data classification, AI rules',
      es: 'enrutamiento LLM, política IA, clasificación datos, reglas IA',
    },
    parentId: 'service-orchestration',
    icon: 'filter',
    priority: 'medium',
    batch: 2,
    useCases: [
      'Données RH vers modèle local',
      'Requêtes simples vers modèle économique',
      'Fallback en cas de panne',
    ],
    benefits: ['Politiques granulaires', 'Classification automatique', 'Zero latence ajoutée'],
    targetAudiences: ['RSSI', 'DPO', 'Architectes'],
  },

  // ============================================================================
  // GOUVERNANCE & OBSERVABILITÉ
  // ============================================================================
  {
    id: 'service-gouvernance',
    type: 'service',
    slug: {
      fr: 'produit/gouvernance',
      en: 'product/governance',
      es: 'producto/gobernanza',
    },
    title: {
      fr: 'Gouvernance IA',
      en: 'AI Governance',
      es: 'Gobernanza IA',
    },
    description: {
      fr: 'Pilotez vos usages IA avec un dashboard temps réel. Suivez les coûts, définissez des quotas, auditez les interactions.',
      en: 'Manage your AI usage with a real-time dashboard. Track costs, set quotas, audit interactions.',
      es: 'Gestione sus usos de IA con un dashboard en tiempo real. Siga costos, defina cuotas, audite interacciones.',
    },
    seoKeywords: {
      fr: 'gouvernance IA, dashboard LLM, suivi coûts IA, audit IA',
      en: 'AI governance, LLM dashboard, AI cost tracking, AI audit',
      es: 'gobernanza IA, dashboard LLM, seguimiento costos IA, auditoría IA',
    },
    parentId: undefined,
    icon: 'bar-chart',
    priority: 'high',
    batch: 1,
    useCases: ['Contrôle budgétaire IA', 'Conformité réglementaire', 'Optimisation des usages'],
    benefits: ['Visibilité 360° sur les usages', 'Alertes temps réel', 'Rapports automatisés'],
    targetAudiences: ['DAF', 'DSI', 'COMEX'],
  },
  {
    id: 'service-suivi-couts',
    type: 'service',
    slug: {
      fr: 'suivi-couts-ia',
      en: 'ai-cost-tracking',
      es: 'seguimiento-costos-ia',
    },
    title: {
      fr: 'Suivi des Coûts IA',
      en: 'AI Cost Tracking',
      es: 'Seguimiento de Costos IA',
    },
    description: {
      fr: 'Visualisez vos dépenses IA par modèle, équipe, utilisateur ou projet. Anticipez et optimisez votre budget.',
      en: 'Visualize your AI spending by model, team, user or project. Anticipate and optimize your budget.',
      es: 'Visualice sus gastos IA por modelo, equipo, usuario o proyecto. Anticipe y optimice su presupuesto.',
    },
    seoKeywords: {
      fr: 'coûts LLM, budget IA entreprise, optimisation tokens, FinOps IA',
      en: 'LLM costs, enterprise AI budget, token optimization, AI FinOps',
      es: 'costos LLM, presupuesto IA empresarial, optimización tokens, FinOps IA',
    },
    parentId: 'service-gouvernance',
    icon: 'dollar-sign',
    priority: 'high',
    batch: 1,
    useCases: [
      'Allocation budgétaire par département',
      'Refacturation interne',
      'Prévisions de consommation',
    ],
    benefits: ['Granularité au token près', 'Alertes de dépassement', 'Export comptable'],
    targetAudiences: ['DAF', 'Contrôle de Gestion', 'IT Finance'],
  },
  {
    id: 'service-audit-trail',
    type: 'service',
    slug: {
      fr: 'audit-trail-ia',
      en: 'ai-audit-trail',
      es: 'audit-trail-ia',
    },
    title: {
      fr: 'Audit Trail IA',
      en: 'AI Audit Trail',
      es: 'Audit Trail IA',
    },
    description: {
      fr: 'Tracez chaque interaction IA pour la conformité. Qui a demandé quoi, quand, à quel modèle, avec quelle réponse.',
      en: 'Trace every AI interaction for compliance. Who asked what, when, to which model, with what response.',
      es: 'Rastree cada interacción IA para cumplimiento. Quién preguntó qué, cuándo, a qué modelo, con qué respuesta.',
    },
    seoKeywords: {
      fr: 'audit IA, traçabilité LLM, conformité RGPD IA, logs IA',
      en: 'AI audit, LLM traceability, AI GDPR compliance, AI logs',
      es: 'auditoría IA, trazabilidad LLM, cumplimiento RGPD IA, logs IA',
    },
    parentId: 'service-gouvernance',
    icon: 'clipboard',
    priority: 'high',
    batch: 1,
    useCases: ['Audits réglementaires', 'Investigations internes', 'Preuve de conformité'],
    benefits: ['Logs immuables', 'Recherche avancée', 'Export pour auditeurs'],
    targetAudiences: ['DPO', 'RSSI', 'Auditeurs', 'Juridique'],
  },

  // ============================================================================
  // CONTEXTE ENTREPRISE
  // ============================================================================
  {
    id: 'service-contexte-entreprise',
    type: 'service',
    slug: {
      fr: 'contexte-entreprise',
      en: 'enterprise-context',
      es: 'contexto-empresarial',
    },
    title: {
      fr: 'Contexte Entreprise',
      en: 'Enterprise Context',
      es: 'Contexto Empresarial',
    },
    description: {
      fr: "Injectez l'identité de votre entreprise dans tous vos agents IA. Vocabulaire, ton, valeurs, règles : une cohérence globale.",
      en: 'Inject your company identity into all your AI agents. Vocabulary, tone, values, rules: global consistency.',
      es: 'Inyecte la identidad de su empresa en todos sus agentes IA. Vocabulario, tono, valores, reglas: coherencia global.',
    },
    seoKeywords: {
      fr: 'contexte IA entreprise, personnalisation LLM, identité marque IA',
      en: 'enterprise AI context, LLM customization, AI brand identity',
      es: 'contexto IA empresarial, personalización LLM, identidad marca IA',
    },
    parentId: undefined,
    icon: 'building',
    priority: 'high',
    batch: 1,
    useCases: ['Cohérence de marque', 'Vocabulaire métier', 'Règles de conformité'],
    benefits: [
      'Ton uniforme sur tous les canaux',
      'Terminologie métier respectée',
      'Règles toujours appliquées',
    ],
    targetAudiences: ['Marketing', 'Communication', 'Direction Générale'],
  },
  {
    id: 'service-glossaire-metier',
    type: 'service',
    slug: {
      fr: 'glossaire-metier',
      en: 'business-glossary',
      es: 'glosario-empresarial',
    },
    title: {
      fr: 'Glossaire Métier',
      en: 'Business Glossary',
      es: 'Glosario Empresarial',
    },
    description: {
      fr: 'Définissez vos termes métier, acronymes et jargon. Les agents IA les comprennent et les utilisent correctement.',
      en: 'Define your business terms, acronyms and jargon. AI agents understand and use them correctly.',
      es: 'Defina sus términos de negocio, acrónimos y jerga. Los agentes IA los comprenden y usan correctamente.',
    },
    seoKeywords: {
      fr: 'glossaire IA, terminologie métier, vocabulaire entreprise, dictionnaire IA',
      en: 'AI glossary, business terminology, enterprise vocabulary, AI dictionary',
      es: 'glosario IA, terminología empresarial, vocabulario empresa, diccionario IA',
    },
    parentId: 'service-contexte-entreprise',
    icon: 'book',
    priority: 'medium',
    batch: 2,
    useCases: [
      'Formation des nouveaux arrivants',
      'Cohérence documentaire',
      'Communication interne',
    ],
    benefits: ['Import depuis Excel', 'Synonymes gérés', 'Mise à jour centralisée'],
    targetAudiences: ['Knowledge Managers', 'RH', 'Documentation'],
  },

  // ============================================================================
  // MÉMOIRE UTILISATEUR
  // ============================================================================
  {
    id: 'service-memoire-utilisateur',
    type: 'service',
    slug: {
      fr: 'memoire-utilisateur',
      en: 'user-memory',
      es: 'memoria-usuario',
    },
    title: {
      fr: 'Mémoire Utilisateur',
      en: 'User Memory',
      es: 'Memoria de Usuario',
    },
    description: {
      fr: "Chaque utilisateur a sa mémoire persistante. L'IA se souvient des préférences, du contexte et des interactions passées.",
      en: 'Each user has their persistent memory. AI remembers preferences, context and past interactions.',
      es: 'Cada usuario tiene su memoria persistente. La IA recuerda preferencias, contexto e interacciones pasadas.',
    },
    seoKeywords: {
      fr: 'mémoire IA, personnalisation utilisateur, contexte persistant, IA conversationnelle',
      en: 'AI memory, user personalization, persistent context, conversational AI',
      es: 'memoria IA, personalización usuario, contexto persistente, IA conversacional',
    },
    parentId: undefined,
    icon: 'user',
    priority: 'high',
    batch: 1,
    useCases: [
      'Assistants personnalisés',
      'Continuité des conversations',
      'Recommandations contextuelles',
    ],
    benefits: ['Expérience sur mesure', 'Pas de répétition', 'Amélioration continue'],
    targetAudiences: ['Product Managers', 'UX', 'Support'],
  },

  // ============================================================================
  // AGENTS IA MÉTIERS
  // ============================================================================
  {
    id: 'service-agents-ia',
    type: 'service',
    slug: {
      fr: 'produit/agents-ia',
      en: 'product/ai-agents',
      es: 'producto/agentes-ia',
    },
    title: {
      fr: 'Agents IA Métiers',
      en: 'Business AI Agents',
      es: 'Agentes IA Empresariales',
    },
    description: {
      fr: 'Créez des assistants IA spécialisés par fonction : RH, Juridique, Finance, Support... Chacun avec ses sources et ses règles.',
      en: 'Create specialized AI assistants by function: HR, Legal, Finance, Support... Each with its sources and rules.',
      es: 'Cree asistentes IA especializados por función: RRHH, Legal, Finanzas, Soporte... Cada uno con sus fuentes y reglas.',
    },
    seoKeywords: {
      fr: 'agents IA métier, assistant virtuel entreprise, chatbot spécialisé',
      en: 'business AI agents, enterprise virtual assistant, specialized chatbot',
      es: 'agentes IA empresariales, asistente virtual empresa, chatbot especializado',
    },
    parentId: undefined,
    icon: 'users',
    priority: 'high',
    batch: 1,
    useCases: ['Assistant RH', 'Conseiller juridique', 'Support technique', 'Analyste financier'],
    benefits: ['Configuration no-code', 'Isolation des données', 'Personnalité ajustable'],
    targetAudiences: ['Responsables métiers', 'DSI', 'Innovation'],
  },

  // ============================================================================
  // INTÉGRATIONS & CONNECTEURS
  // ============================================================================
  {
    id: 'service-integrations',
    type: 'service',
    slug: {
      fr: 'produit/integrations',
      en: 'product/integrations',
      es: 'producto/integraciones',
    },
    title: {
      fr: 'Intégrations & Connecteurs',
      en: 'Integrations & Connectors',
      es: 'Integraciones y Conectores',
    },
    description: {
      fr: 'Connectez SUPERFASTTT à vos outils : SharePoint, Drive, Notion, Slack, Dropbox... Synchronisation automatique et sécurisée.',
      en: 'Connect SUPERFASTTT to your tools: SharePoint, Drive, Notion, Slack, Dropbox... Automatic and secure sync.',
      es: 'Conecte SUPERFASTTT a sus herramientas: SharePoint, Drive, Notion, Slack, Dropbox... Sincronización automática y segura.',
    },
    seoKeywords: {
      fr: 'intégration IA entreprise, connecteur SharePoint, sync Notion, API entreprise',
      en: 'enterprise AI integration, SharePoint connector, Notion sync, enterprise API',
      es: 'integración IA empresarial, conector SharePoint, sync Notion, API empresarial',
    },
    parentId: undefined,
    icon: 'link',
    priority: 'high',
    batch: 1,
    useCases: ['Centralisation des sources', 'Mise à jour automatique', 'Gouvernance unifiée'],
    benefits: ['20+ connecteurs natifs', 'OAuth2 sécurisé', 'Sync incrémentale'],
    targetAudiences: ['DSI', 'IT', 'Administrateurs'],
  },

  // ============================================================================
  // APPS TIERCES / MARKETPLACE
  // ============================================================================
  {
    id: 'service-apps-tierces',
    type: 'service',
    slug: {
      fr: 'produit/apps',
      en: 'product/apps',
      es: 'producto/apps',
    },
    title: {
      fr: 'Apps Tierces & Marketplace',
      en: 'Third-Party Apps & Marketplace',
      es: 'Apps de Terceros y Marketplace',
    },
    description: {
      fr: 'Étendez SUPERFASTTT avec des applications tierces. SDK développeur, SSO automatique, publication simplifiée.',
      en: 'Extend SUPERFASTTT with third-party applications. Developer SDK, automatic SSO, simplified publishing.',
      es: 'Extienda SUPERFASTTT con aplicaciones de terceros. SDK desarrollador, SSO automático, publicación simplificada.',
    },
    seoKeywords: {
      fr: 'marketplace IA, apps tierces, SDK IA, extensions entreprise',
      en: 'AI marketplace, third-party apps, AI SDK, enterprise extensions',
      es: 'marketplace IA, apps terceros, SDK IA, extensiones empresariales',
    },
    parentId: undefined,
    icon: 'package',
    priority: 'medium',
    batch: 2,
    useCases: ['Modules métiers spécifiques', 'Intégrations sur mesure', 'Écosystème partenaires'],
    benefits: ['Architecture modulaire', 'SSO transparent', 'Gouvernance centralisée'],
    targetAudiences: ['Développeurs', 'Partenaires', 'DSI'],
  },

  // ============================================================================
  // DÉPLOIEMENT & SOUVERAINETÉ
  // ============================================================================
  {
    id: 'service-deploiement',
    type: 'service',
    slug: {
      fr: 'produit/securite',
      en: 'product/security',
      es: 'producto/seguridad',
    },
    title: {
      fr: 'Déploiement & Souveraineté',
      en: 'Deployment & Sovereignty',
      es: 'Despliegue y Soberanía',
    },
    description: {
      fr: 'Cloud France, on-premise, air-gap... Choisissez où vos données et modèles sont hébergés. Souveraineté totale garantie.',
      en: 'Cloud France, on-premise, air-gap... Choose where your data and models are hosted. Total sovereignty guaranteed.',
      es: 'Cloud Francia, on-premise, air-gap... Elija dónde se alojan sus datos y modelos. Soberanía total garantizada.',
    },
    seoKeywords: {
      fr: 'IA souveraine, cloud français, on-premise IA, hébergement sécurisé',
      en: 'sovereign AI, French cloud, on-premise AI, secure hosting',
      es: 'IA soberana, cloud francés, on-premise IA, alojamiento seguro',
    },
    parentId: undefined,
    icon: 'server',
    priority: 'high',
    batch: 1,
    useCases: ['Données ultra-sensibles', 'Exigences réglementaires', 'Isolation complète'],
    benefits: ['Cloud Scaleway France', 'Installation en 48h', 'Support dédié'],
    targetAudiences: ['DSI', 'RSSI', 'DPO', 'Secteur public'],
  },

  // ============================================================================
  // PAGES LANDING PRODUIT
  // ============================================================================
  {
    id: 'service-overview',
    type: 'service',
    slug: {
      fr: 'produit/vue-ensemble',
      en: 'product/overview',
      es: 'producto/resumen',
    },
    title: {
      fr: "Vue d'ensemble",
      en: 'Product Overview',
      es: 'Visión General',
    },
    description: {
      fr: 'Découvrez SUPERFASTTT, la plateforme IA tout-en-un pour les entreprises. RAG, Agents IA, Orchestration multi-modèles et Gouvernance.',
      en: 'Discover SUPERFASTTT, the all-in-one AI platform for enterprises. RAG, AI Agents, Multi-model Orchestration and Governance.',
      es: 'Descubra SUPERFASTTT, la plataforma IA todo-en-uno para empresas. RAG, Agentes IA, Orquestación multi-modelos y Gobernanza.',
    },
    seoKeywords: {
      fr: 'plateforme IA entreprise, SUPERFASTTT, IA tout-en-un, solution IA B2B',
      en: 'enterprise AI platform, SUPERFASTTT, all-in-one AI, B2B AI solution',
      es: 'plataforma IA empresarial, SUPERFASTTT, IA todo-en-uno, solución IA B2B',
    },
    parentId: undefined,
    icon: 'home',
    priority: 'high',
    batch: 0,
    useCases: ["Déploiement IA à l'échelle", 'Centralisation des usages IA', 'Gouvernance unifiée'],
    benefits: [
      'Plateforme tout-en-un',
      'Déploiement cloud ou on-premise',
      'Support entreprise dédié',
    ],
    targetAudiences: ['DSI', 'CTO', 'COMEX', 'Innovation'],
  },
  {
    id: 'service-api',
    type: 'service',
    slug: {
      fr: 'produit/api',
      en: 'product/api',
      es: 'producto/api',
    },
    title: {
      fr: 'API & Développeurs',
      en: 'API & Developers',
      es: 'API y Desarrolladores',
    },
    description: {
      fr: 'Intégrez SUPERFASTTT dans vos applications avec notre API REST complète. SDK disponibles, webhooks, documentation interactive.',
      en: 'Integrate SUPERFASTTT into your applications with our complete REST API. SDKs available, webhooks, interactive documentation.',
      es: 'Integre SUPERFASTTT en sus aplicaciones con nuestra API REST completa. SDKs disponibles, webhooks, documentación interactiva.',
    },
    seoKeywords: {
      fr: 'API IA, SDK développeur, intégration IA, REST API LLM',
      en: 'AI API, developer SDK, AI integration, LLM REST API',
      es: 'API IA, SDK desarrollador, integración IA, REST API LLM',
    },
    parentId: undefined,
    icon: 'code',
    priority: 'high',
    batch: 0,
    useCases: [
      'Intégration dans applications métier',
      'Automatisation de workflows',
      "Développement d'extensions",
    ],
    benefits: ['API REST documentée', 'SDK Python, Node.js, Go', 'Sandbox de test gratuit'],
    targetAudiences: ['Développeurs', 'CTO', 'Architectes', 'DevOps'],
  },
]

export function getServiceById(id: string): ServiceTaxonomy | undefined {
  return services.find((s) => s.id === id)
}

export function getServicesByPriority(
  priority: 'high' | 'medium' | 'normal' | 'low',
): ServiceTaxonomy[] {
  return services.filter((s) => s.priority === priority)
}

export function getServicesByBatch(batch: number): ServiceTaxonomy[] {
  return services.filter((s) => s.batch === batch)
}

export function getChildServices(parentId: string): ServiceTaxonomy[] {
  return services.filter((s) => s.parentId === parentId)
}
