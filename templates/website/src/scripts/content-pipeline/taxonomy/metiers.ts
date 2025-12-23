/**
 * Métiers Taxonomy
 * Defines all profession/role pages for the content pipeline
 */

import type { MetierTaxonomy } from '../types'

export const metiers: MetierTaxonomy[] = [
  // ============================================================================
  // DIRECTION GÉNÉRALE
  // ============================================================================
  {
    id: 'metier-dirigeants',
    type: 'metier',
    slug: {
      fr: 'dirigeants-comex',
      en: 'executives-c-suite',
      es: 'directivos-comite',
    },
    title: {
      fr: 'Dirigeants & COMEX',
      en: 'Executives & C-Suite',
      es: 'Directivos y COMEX',
    },
    description: {
      fr: "L'IA au service de la stratégie. Pilotage, gouvernance et vision pour les décideurs.",
      en: 'AI for strategy. Governance, oversight and vision for decision-makers.',
      es: 'IA para la estrategia. Gobernanza, supervisión y visión para decisores.',
    },
    seoKeywords: {
      fr: 'IA dirigeants, COMEX IA, gouvernance IA, stratégie IA',
      en: 'AI executives, C-suite AI, AI governance, AI strategy',
      es: 'IA directivos, COMEX IA, gobernanza IA, estrategia IA',
    },
    icon: 'crown',
    priority: 'high',
    batch: 1,
    painPoints: [
      'Manque de visibilité sur les usages IA',
      'Risques réglementaires non maîtrisés',
      "ROI de l'IA difficile à mesurer",
      'Shadow IT des équipes',
    ],
    solutions: [
      'Dashboard de gouvernance centralisé',
      'Rapports de conformité automatisés',
      'Métriques de ROI temps réel',
      'Contrôle des usages par équipe',
    ],
    kpis: ["TCO de l'IA", "Taux d'adoption", 'Score de conformité', 'Productivité globale'],
  },

  // ============================================================================
  // DSI & CTO
  // ============================================================================
  {
    id: 'metier-dsi',
    type: 'metier',
    slug: {
      fr: 'dsi-cto',
      en: 'cio-cto',
      es: 'cio-cto',
    },
    title: {
      fr: 'DSI & CTO',
      en: 'CIO & CTO',
      es: 'CIO y CTO',
    },
    description: {
      fr: 'Architecture IA souveraine pour les DSI. Intégration SI, sécurité, scalabilité.',
      en: 'Sovereign AI architecture for CIOs. SI integration, security, scalability.',
      es: 'Arquitectura IA soberana para CIOs. Integración SI, seguridad, escalabilidad.',
    },
    seoKeywords: {
      fr: 'IA DSI, architecture IA, intégration SI, sécurité IA',
      en: 'CIO AI, AI architecture, SI integration, AI security',
      es: 'CIO IA, arquitectura IA, integración SI, seguridad IA',
    },
    icon: 'server',
    priority: 'high',
    batch: 1,
    painPoints: [
      'Multiplication des solutions IA',
      'Intégration au SI existant complexe',
      'Gestion des accès et identités',
      'Scalabilité incertaine',
    ],
    solutions: [
      'Plateforme IA unifiée',
      'API REST et SDK complets',
      'SSO et SCIM natifs',
      'Architecture cloud-native',
    ],
    kpis: [
      "Temps d'intégration",
      'Disponibilité SLA',
      'Coût par utilisateur',
      'Incidents sécurité',
    ],
  },

  // ============================================================================
  // RSSI
  // ============================================================================
  {
    id: 'metier-rssi',
    type: 'metier',
    slug: {
      fr: 'rssi-securite',
      en: 'ciso-security',
      es: 'ciso-seguridad',
    },
    title: {
      fr: 'RSSI & Sécurité',
      en: 'CISO & Security',
      es: 'CISO y Seguridad',
    },
    description: {
      fr: "Sécurité de l'IA par conception. Audit, conformité, protection des données.",
      en: 'Security by design for AI. Audit, compliance, data protection.',
      es: 'Seguridad por diseño para IA. Auditoría, cumplimiento, protección de datos.',
    },
    seoKeywords: {
      fr: 'sécurité IA, RSSI IA, audit IA, protection données IA',
      en: 'AI security, CISO AI, AI audit, AI data protection',
      es: 'seguridad IA, CISO IA, auditoría IA, protección datos IA',
    },
    icon: 'shield',
    priority: 'high',
    batch: 1,
    painPoints: [
      'Données sensibles exposées aux LLM cloud',
      'Traçabilité insuffisante',
      'Fuite de données potentielle',
      'Conformité multi-réglementations',
    ],
    solutions: [
      'Routage données sensibles vers modèles locaux',
      'Audit trail complet et immuable',
      'Chiffrement bout-en-bout',
      'Conformité RGPD, HDS, SecNumCloud',
    ],
    kpis: ['Incidents sécurité', 'Score conformité', 'Données exposées', 'Temps de détection'],
  },

  // ============================================================================
  // DPO
  // ============================================================================
  {
    id: 'metier-dpo',
    type: 'metier',
    slug: {
      fr: 'dpo-conformite',
      en: 'dpo-compliance',
      es: 'dpo-cumplimiento',
    },
    title: {
      fr: 'DPO & Conformité',
      en: 'DPO & Compliance',
      es: 'DPO y Cumplimiento',
    },
    description: {
      fr: 'RGPD et conformité IA. Registre des traitements, droits des personnes, audit.',
      en: 'GDPR and AI compliance. Processing register, data subject rights, audit.',
      es: 'RGPD y cumplimiento IA. Registro de tratamientos, derechos de personas, auditoría.',
    },
    seoKeywords: {
      fr: 'DPO IA, RGPD IA, conformité IA, droits personnes IA',
      en: 'DPO AI, GDPR AI, AI compliance, data subject rights AI',
      es: 'DPO IA, RGPD IA, cumplimiento IA, derechos personas IA',
    },
    icon: 'clipboard',
    priority: 'high',
    batch: 1,
    painPoints: [
      'Registre des traitements IA à maintenir',
      "Droits d'accès et d'oubli à exercer",
      'Documentation des décisions IA',
      'Localisation des données incertaine',
    ],
    solutions: [
      'Registre automatisé des usages IA',
      'Export et suppression de données utilisateur',
      'Explainability des réponses IA',
      'Hébergement France garanti',
    ],
    kpis: ['Demandes RGPD traitées', 'Délai de réponse', 'Registres à jour', 'Audit réussis'],
  },

  // ============================================================================
  // DAF
  // ============================================================================
  {
    id: 'metier-daf',
    type: 'metier',
    slug: {
      fr: 'daf-finance',
      en: 'cfo-finance',
      es: 'cfo-finanzas',
    },
    title: {
      fr: 'DAF & Finance',
      en: 'CFO & Finance',
      es: 'CFO y Finanzas',
    },
    description: {
      fr: 'Maîtrise des coûts IA. Budget, allocation, refacturation, ROI.',
      en: 'AI cost control. Budget, allocation, chargeback, ROI.',
      es: 'Control de costos IA. Presupuesto, asignación, refacturación, ROI.',
    },
    seoKeywords: {
      fr: 'coûts IA, budget IA, DAF IA, FinOps IA',
      en: 'AI costs, AI budget, CFO AI, AI FinOps',
      es: 'costos IA, presupuesto IA, CFO IA, FinOps IA',
    },
    icon: 'dollar-sign',
    priority: 'high',
    batch: 1,
    painPoints: [
      'Coûts IA imprévisibles',
      'Pas de visibilité par département',
      'Refacturation interne complexe',
      'ROI difficile à calculer',
    ],
    solutions: [
      'Suivi des coûts temps réel par équipe',
      'Quotas et alertes de dépassement',
      'Export pour refacturation',
      'Métriques de productivité',
    ],
    kpis: ['Coût par utilisateur', 'Budget vs réel', "ROI par cas d'usage", 'Tendance mensuelle'],
  },

  // ============================================================================
  // DRH
  // ============================================================================
  {
    id: 'metier-drh',
    type: 'metier',
    slug: {
      fr: 'drh-rh',
      en: 'chro-hr',
      es: 'chro-rrhh',
    },
    title: {
      fr: 'DRH & RH',
      en: 'CHRO & HR',
      es: 'CHRO y RRHH',
    },
    description: {
      fr: 'IA pour les RH. Recrutement, onboarding, formation, expérience collaborateur.',
      en: 'AI for HR. Recruitment, onboarding, training, employee experience.',
      es: 'IA para RRHH. Reclutamiento, onboarding, formación, experiencia empleado.',
    },
    seoKeywords: {
      fr: 'IA RH, recrutement IA, onboarding IA, formation IA',
      en: 'HR AI, AI recruitment, AI onboarding, AI training',
      es: 'IA RRHH, reclutamiento IA, onboarding IA, formación IA',
    },
    icon: 'users',
    priority: 'medium',
    batch: 2,
    painPoints: [
      'Questions RH répétitives',
      'Onboarding chronophage',
      'Formation non personnalisée',
      'Données RH sensibles',
    ],
    solutions: [
      'Chatbot RH self-service',
      "Parcours d'intégration intelligent",
      'Formation adaptative',
      'Données RH isolées et sécurisées',
    ],
    kpis: [
      'Tickets RH évités',
      "Temps d'onboarding",
      'Taux complétion formation',
      'Satisfaction collaborateur',
    ],
  },

  // ============================================================================
  // DIRECTEUR JURIDIQUE
  // ============================================================================
  {
    id: 'metier-juridique',
    type: 'metier',
    slug: {
      fr: 'directeur-juridique',
      en: 'general-counsel',
      es: 'director-juridico',
    },
    title: {
      fr: 'Directeur Juridique',
      en: 'General Counsel',
      es: 'Director Jurídico',
    },
    description: {
      fr: 'IA pour le juridique. Analyse de contrats, veille réglementaire, due diligence.',
      en: 'AI for legal. Contract analysis, regulatory monitoring, due diligence.',
      es: 'IA para jurídico. Análisis de contratos, vigilancia regulatoria, due diligence.',
    },
    seoKeywords: {
      fr: 'IA juridique, analyse contrats, veille juridique, due diligence',
      en: 'legal AI, contract analysis, legal monitoring, due diligence',
      es: 'IA jurídico, análisis contratos, vigilancia jurídica, due diligence',
    },
    icon: 'file-text',
    priority: 'high',
    batch: 1,
    painPoints: [
      'Volume de contrats à analyser',
      'Veille réglementaire chronophage',
      'Due diligence sous pression',
      'Confidentialité absolue requise',
    ],
    solutions: [
      'Analyse de clauses automatisée',
      'Alertes réglementaires personnalisées',
      'Data room virtuelle sécurisée',
      'Modèle on-premise pour la confidentialité',
    ],
    kpis: ['Contrats analysés/jour', 'Temps de revue', 'Risques détectés', 'Coût par contrat'],
  },

  // ============================================================================
  // DIRECTEUR MARKETING
  // ============================================================================
  {
    id: 'metier-marketing',
    type: 'metier',
    slug: {
      fr: 'directeur-marketing',
      en: 'cmo-marketing',
      es: 'director-marketing',
    },
    title: {
      fr: 'Directeur Marketing',
      en: 'CMO & Marketing',
      es: 'Director de Marketing',
    },
    description: {
      fr: 'IA pour le marketing. Création de contenu, personnalisation, analyse de campagnes.',
      en: 'AI for marketing. Content creation, personalization, campaign analysis.',
      es: 'IA para marketing. Creación de contenido, personalización, análisis de campañas.',
    },
    seoKeywords: {
      fr: 'IA marketing, contenu IA, personnalisation IA, campagnes IA',
      en: 'marketing AI, AI content, AI personalization, AI campaigns',
      es: 'IA marketing, contenido IA, personalización IA, campañas IA',
    },
    icon: 'target',
    priority: 'medium',
    batch: 2,
    painPoints: [
      'Production de contenu à grande échelle',
      'Cohérence de marque difficile',
      'Personnalisation limitée',
      'Analyse multicanal complexe',
    ],
    solutions: [
      'Génération de contenu brand-safe',
      'Contexte entreprise pour le ton',
      'Recommandations personnalisées',
      'Dashboard analytics unifié',
    ],
    kpis: ['Contenus produits/mois', 'Temps de création', 'Engagement', 'Coût par contenu'],
  },

  // ============================================================================
  // DIRECTEUR COMMERCIAL
  // ============================================================================
  {
    id: 'metier-commercial',
    type: 'metier',
    slug: {
      fr: 'directeur-commercial',
      en: 'cso-sales',
      es: 'director-comercial',
    },
    title: {
      fr: 'Directeur Commercial',
      en: 'CSO & Sales',
      es: 'Director Comercial',
    },
    description: {
      fr: 'IA pour le commercial. Propositions, CRM enrichi, préparation RDV, closing.',
      en: 'AI for sales. Proposals, enriched CRM, meeting prep, closing.',
      es: 'IA para comercial. Propuestas, CRM enriquecido, preparación reuniones, cierre.',
    },
    seoKeywords: {
      fr: 'IA commercial, propositions IA, CRM IA, vente IA',
      en: 'sales AI, AI proposals, AI CRM, AI selling',
      es: 'IA comercial, propuestas IA, CRM IA, ventas IA',
    },
    icon: 'briefcase',
    priority: 'medium',
    batch: 2,
    painPoints: [
      'Propositions commerciales chronophages',
      'Préparation des RDV insuffisante',
      'Suivi des opportunités manuel',
      'Informations dispersées',
    ],
    solutions: [
      'Génération de propositions personnalisées',
      'Brief pré-meeting automatique',
      'Enrichissement CRM intelligent',
      'Base de connaissances commerciale',
    ],
    kpis: ['Temps de proposition', 'Taux de conversion', 'Cycle de vente', 'Win rate'],
  },

  // ============================================================================
  // SUPPORT CLIENT
  // ============================================================================
  {
    id: 'metier-support',
    type: 'metier',
    slug: {
      fr: 'support-client',
      en: 'customer-support',
      es: 'soporte-cliente',
    },
    title: {
      fr: 'Support Client',
      en: 'Customer Support',
      es: 'Soporte al Cliente',
    },
    description: {
      fr: 'IA pour le support. Réponses automatisées, escalade intelligente, satisfaction.',
      en: 'AI for support. Automated responses, smart escalation, satisfaction.',
      es: 'IA para soporte. Respuestas automatizadas, escalado inteligente, satisfacción.',
    },
    seoKeywords: {
      fr: 'IA support, chatbot support, service client IA, ticketing IA',
      en: 'support AI, support chatbot, AI customer service, AI ticketing',
      es: 'IA soporte, chatbot soporte, servicio cliente IA, ticketing IA',
    },
    icon: 'message-circle',
    priority: 'high',
    batch: 1,
    painPoints: [
      'Volume de tickets croissant',
      'Questions répétitives',
      'Temps de réponse élevé',
      'Formation des nouveaux agents',
    ],
    solutions: [
      'Chatbot de niveau 1 intelligent',
      'Suggestions de réponses aux agents',
      'Escalade automatique qualifiée',
      'Base de connaissances auto-alimentée',
    ],
    kpis: ['Tickets résolus en self-service', 'Temps de réponse', 'CSAT', 'Coût par ticket'],
  },

  // ============================================================================
  // R&D / INNOVATION
  // ============================================================================
  {
    id: 'metier-rnd',
    type: 'metier',
    slug: {
      fr: 'rnd-innovation',
      en: 'rd-innovation',
      es: 'id-innovacion',
    },
    title: {
      fr: 'R&D & Innovation',
      en: 'R&D & Innovation',
      es: 'I+D e Innovación',
    },
    description: {
      fr: 'IA pour la R&D. Prototypage rapide, veille technologique, expérimentation.',
      en: 'AI for R&D. Rapid prototyping, tech monitoring, experimentation.',
      es: 'IA para I+D. Prototipado rápido, vigilancia tecnológica, experimentación.',
    },
    seoKeywords: {
      fr: 'IA R&D, innovation IA, prototypage IA, veille technologique',
      en: 'R&D AI, AI innovation, AI prototyping, tech monitoring',
      es: 'IA I+D, innovación IA, prototipado IA, vigilancia tecnológica',
    },
    icon: 'cpu',
    priority: 'medium',
    batch: 2,
    painPoints: [
      'Accès limité aux derniers modèles',
      'Prototypage lent',
      'Veille technologique dispersée',
      'Expérimentation coûteuse',
    ],
    solutions: [
      'Accès à 100+ modèles via une interface',
      'SDK pour prototypage rapide',
      'Agrégation de sources techniques',
      'Environnement sandbox sécurisé',
    ],
    kpis: ['POCs lancés/mois', 'Time to prototype', 'Technologies testées', 'Innovations validées'],
  },

  // ============================================================================
  // OPERATIONS / COO
  // ============================================================================
  {
    id: 'metier-operations',
    type: 'metier',
    slug: {
      fr: 'operations-coo',
      en: 'operations-coo',
      es: 'operaciones-coo',
    },
    title: {
      fr: 'Opérations & COO',
      en: 'Operations & COO',
      es: 'Operaciones y COO',
    },
    description: {
      fr: 'IA pour les opérations. Automatisation, processus, efficacité, reporting.',
      en: 'AI for operations. Automation, processes, efficiency, reporting.',
      es: 'IA para operaciones. Automatización, procesos, eficiencia, reporting.',
    },
    seoKeywords: {
      fr: 'IA opérations, automatisation processus, efficacité IA, COO IA',
      en: 'operations AI, process automation, AI efficiency, COO AI',
      es: 'IA operaciones, automatización procesos, eficiencia IA, COO IA',
    },
    icon: 'settings',
    priority: 'medium',
    batch: 2,
    painPoints: [
      'Processus manuels répétitifs',
      'Reporting chronophage',
      'Coordination inter-équipes',
      'Visibilité limitée',
    ],
    solutions: [
      'Automatisation des workflows',
      'Génération de rapports automatique',
      'Assistant de coordination',
      'Dashboard opérationnel temps réel',
    ],
    kpis: ['Tâches automatisées', 'Temps gagné/semaine', 'Erreurs évitées', 'Cycle time'],
  },

  // ============================================================================
  // IT / DÉVELOPPEURS
  // ============================================================================
  {
    id: 'metier-developpeurs',
    type: 'metier',
    slug: {
      fr: 'developpeurs-it',
      en: 'developers-it',
      es: 'desarrolladores-it',
    },
    title: {
      fr: 'Développeurs & IT',
      en: 'Developers & IT',
      es: 'Desarrolladores e IT',
    },
    description: {
      fr: 'IA pour les développeurs. API, SDK, intégration, automatisation.',
      en: 'AI for developers. API, SDK, integration, automation.',
      es: 'IA para desarrolladores. API, SDK, integración, automatización.',
    },
    seoKeywords: {
      fr: 'API IA, SDK IA, développeurs IA, intégration IA',
      en: 'AI API, AI SDK, AI developers, AI integration',
      es: 'API IA, SDK IA, desarrolladores IA, integración IA',
    },
    icon: 'code',
    priority: 'medium',
    batch: 2,
    painPoints: [
      'API dispersées et incompatibles',
      'Documentation insuffisante',
      'Tests et debug IA complexes',
      'Déploiement multi-environnements',
    ],
    solutions: [
      'API unifiée OpenAI-compatible',
      'Documentation interactive',
      'Playground de test intégré',
      'SDK multi-langages',
    ],
    kpis: [
      "Temps d'intégration",
      'Appels API/jour',
      'Erreurs de production',
      'Satisfaction développeurs',
    ],
  },
]

export function getMetierById(id: string): MetierTaxonomy | undefined {
  return metiers.find((m) => m.id === id)
}

export function getMetiersByPriority(
  priority: 'high' | 'medium' | 'normal' | 'low',
): MetierTaxonomy[] {
  return metiers.filter((m) => m.priority === priority)
}

export function getMetiersByBatch(batch: number): MetierTaxonomy[] {
  return metiers.filter((m) => m.batch === batch)
}
