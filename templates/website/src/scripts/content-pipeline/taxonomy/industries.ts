/**
 * Industries Taxonomy
 * Defines all industry/sector pages for the content pipeline
 */

import type { IndustryTaxonomy } from '../types'

export const industries: IndustryTaxonomy[] = [
  // ============================================================================
  // SANTÉ & MÉDICAL
  // ============================================================================
  {
    id: 'industry-sante',
    type: 'industry',
    slug: {
      fr: 'solutions/sante',
      en: 'solutions/healthcare',
      es: 'soluciones/salud',
    },
    title: {
      fr: 'Santé & Médical',
      en: 'Healthcare & Medical',
      es: 'Salud y Médico',
    },
    description: {
      fr: "L'IA souveraine pour le secteur de la santé. Conforme HDS, protection des données patients, déploiement sécurisé.",
      en: 'Sovereign AI for the healthcare sector. HDS compliant, patient data protection, secure deployment.',
      es: 'IA soberana para el sector salud. Conforme HDS, protección de datos de pacientes, despliegue seguro.',
    },
    seoKeywords: {
      fr: 'IA santé, HDS, données patients, hôpital IA, médical IA',
      en: 'healthcare AI, HDS, patient data, hospital AI, medical AI',
      es: 'IA salud, HDS, datos pacientes, hospital IA, médico IA',
    },
    icon: 'heart',
    priority: 'high',
    batch: 0,
    challenges: [
      'Protection des données de santé',
      'Conformité HDS obligatoire',
      'Interopérabilité des SI hospitaliers',
      'Temps médecins limité',
    ],
    regulations: ['HDS (Hébergeur de Données de Santé)', 'RGPD', 'HIPAA (international)'],
    certifications: ['HDS', 'ISO 27001', 'ISO 27701'],
  },

  // ============================================================================
  // FINANCE & BANQUE
  // ============================================================================
  {
    id: 'industry-finance',
    type: 'industry',
    slug: {
      fr: 'solutions/finance',
      en: 'solutions/finance',
      es: 'soluciones/finanzas',
    },
    title: {
      fr: 'Finance & Banque',
      en: 'Finance & Banking',
      es: 'Finanzas y Banca',
    },
    description: {
      fr: 'IA sécurisée pour les institutions financières. Conformité ACPR, protection des données bancaires, audit trail complet.',
      en: 'Secure AI for financial institutions. ACPR compliant, banking data protection, complete audit trail.',
      es: 'IA segura para instituciones financieras. Conforme ACPR, protección datos bancarios, audit trail completo.',
    },
    seoKeywords: {
      fr: 'IA finance, banque IA, ACPR, données bancaires, fintech souveraine',
      en: 'finance AI, banking AI, regulatory compliance, banking data, sovereign fintech',
      es: 'IA finanzas, banca IA, ACPR, datos bancarios, fintech soberana',
    },
    icon: 'credit-card',
    priority: 'high',
    batch: 0,
    challenges: [
      'Réglementation stricte ACPR',
      'Données clients ultra-sensibles',
      'Détection de fraude',
      'KYC/AML automatisé',
    ],
    regulations: ['ACPR', 'RGPD', 'PCI-DSS', 'NIS2', 'DORA'],
    certifications: ['SOC 2', 'ISO 27001', 'PCI-DSS'],
  },

  // ============================================================================
  // ASSURANCE
  // ============================================================================
  {
    id: 'industry-assurance',
    type: 'industry',
    slug: {
      fr: 'solutions/assurance',
      en: 'solutions/insurance',
      es: 'soluciones/seguros',
    },
    title: {
      fr: 'Assurance',
      en: 'Insurance',
      es: 'Seguros',
    },
    description: {
      fr: "IA pour les compagnies d'assurance. Traitement des sinistres, conformité Solvabilité II, analyse des risques.",
      en: 'AI for insurance companies. Claims processing, Solvency II compliance, risk analysis.',
      es: 'IA para compañías de seguros. Procesamiento de siniestros, conformidad Solvencia II, análisis de riesgos.',
    },
    seoKeywords: {
      fr: 'IA assurance, sinistres IA, Solvabilité II, insurtech',
      en: 'insurance AI, claims AI, Solvency II, insurtech',
      es: 'IA seguros, siniestros IA, Solvencia II, insurtech',
    },
    icon: 'shield',
    priority: 'high',
    batch: 1,
    challenges: [
      'Traitement massif de sinistres',
      'Détection de fraude',
      'Conformité Solvabilité II',
      'Personnalisation des offres',
    ],
    regulations: ['ACPR', 'Solvabilité II', 'RGPD', 'DDA'],
    certifications: ['SOC 2', 'ISO 27001'],
  },

  // ============================================================================
  // INDUSTRIE & MANUFACTURING
  // ============================================================================
  {
    id: 'industry-industrie',
    type: 'industry',
    slug: {
      fr: 'solutions/industrie',
      en: 'solutions/manufacturing',
      es: 'soluciones/industria',
    },
    title: {
      fr: 'Industrie & Manufacturing',
      en: 'Industry & Manufacturing',
      es: 'Industria y Manufactura',
    },
    description: {
      fr: "IA pour l'industrie. Optimisation supply chain, maintenance prédictive, qualité, documentation technique.",
      en: 'AI for industry. Supply chain optimization, predictive maintenance, quality, technical documentation.',
      es: 'IA para industria. Optimización supply chain, mantenimiento predictivo, calidad, documentación técnica.',
    },
    seoKeywords: {
      fr: 'IA industrie, manufacturing IA, supply chain IA, maintenance prédictive',
      en: 'industry AI, manufacturing AI, supply chain AI, predictive maintenance',
      es: 'IA industria, manufactura IA, supply chain IA, mantenimiento predictivo',
    },
    icon: 'tool',
    priority: 'high',
    batch: 0,
    challenges: [
      'Documentation technique volumineuse',
      'Maintenance des équipements',
      'Optimisation de la production',
      'Traçabilité qualité',
    ],
    regulations: ['ISO 9001', 'NIS2', 'RGPD'],
    certifications: ['ISO 9001', 'ISO 27001', 'ISO 14001'],
  },

  // ============================================================================
  // RETAIL & E-COMMERCE
  // ============================================================================
  {
    id: 'industry-retail',
    type: 'industry',
    slug: {
      fr: 'solutions/retail',
      en: 'solutions/retail',
      es: 'soluciones/retail',
    },
    title: {
      fr: 'Retail & E-commerce',
      en: 'Retail & E-commerce',
      es: 'Retail y E-commerce',
    },
    description: {
      fr: 'IA pour le retail. Personnalisation client, gestion des stocks, support client automatisé, analyse des ventes.',
      en: 'AI for retail. Customer personalization, inventory management, automated customer support, sales analysis.',
      es: 'IA para retail. Personalización cliente, gestión de stocks, soporte cliente automatizado, análisis de ventas.',
    },
    seoKeywords: {
      fr: 'IA retail, e-commerce IA, personnalisation client, chatbot retail',
      en: 'retail AI, e-commerce AI, customer personalization, retail chatbot',
      es: 'IA retail, e-commerce IA, personalización cliente, chatbot retail',
    },
    icon: 'shopping-cart',
    priority: 'medium',
    batch: 2,
    challenges: [
      'Personnalisation à grande échelle',
      'Gestion des stocks omnicanal',
      'Support client 24/7',
      'Analyse comportementale',
    ],
    regulations: ['RGPD', 'Directive e-commerce'],
    certifications: ['PCI-DSS', 'ISO 27001'],
  },

  // ============================================================================
  // SERVICES PUBLICS & COLLECTIVITÉS
  // ============================================================================
  {
    id: 'industry-secteur-public',
    type: 'industry',
    slug: {
      fr: 'solutions/administration',
      en: 'solutions/public-sector',
      es: 'soluciones/administracion',
    },
    title: {
      fr: 'Services Publics & Collectivités',
      en: 'Public Sector & Government',
      es: 'Sector Público y Gobierno',
    },
    description: {
      fr: 'IA souveraine pour le secteur public. Conforme SecNumCloud, protection des données citoyens, déploiement on-premise.',
      en: 'Sovereign AI for the public sector. SecNumCloud compliant, citizen data protection, on-premise deployment.',
      es: 'IA soberana para el sector público. Conforme SecNumCloud, protección datos ciudadanos, despliegue on-premise.',
    },
    seoKeywords: {
      fr: 'IA secteur public, SecNumCloud, collectivités IA, administration IA',
      en: 'public sector AI, SecNumCloud, government AI, administration AI',
      es: 'IA sector público, SecNumCloud, gobierno IA, administración IA',
    },
    icon: 'building',
    priority: 'high',
    batch: 0,
    challenges: [
      'Souveraineté des données obligatoire',
      'Conformité SecNumCloud',
      'Accessibilité des services',
      'Budget contraint',
    ],
    regulations: ['RGPD renforcé', 'RGS', 'SecNumCloud', 'NIS2'],
    certifications: ['SecNumCloud', 'RGS', 'ISO 27001'],
  },

  // ============================================================================
  // ÉNERGIE & UTILITIES
  // ============================================================================
  {
    id: 'industry-energie',
    type: 'industry',
    slug: {
      fr: 'solutions/energie',
      en: 'solutions/energy',
      es: 'soluciones/energia',
    },
    title: {
      fr: 'Énergie & Utilities',
      en: 'Energy & Utilities',
      es: 'Energía y Utilities',
    },
    description: {
      fr: "IA pour le secteur de l'énergie. Infrastructure critique, optimisation réseau, maintenance prédictive, conformité NIS2.",
      en: 'AI for the energy sector. Critical infrastructure, network optimization, predictive maintenance, NIS2 compliance.',
      es: 'IA para el sector energético. Infraestructura crítica, optimización red, mantenimiento predictivo, conformidad NIS2.',
    },
    seoKeywords: {
      fr: 'IA énergie, utilities IA, infrastructure critique, NIS2',
      en: 'energy AI, utilities AI, critical infrastructure, NIS2',
      es: 'IA energía, utilities IA, infraestructura crítica, NIS2',
    },
    icon: 'zap',
    priority: 'medium',
    batch: 2,
    challenges: [
      'Infrastructure critique à protéger',
      'Conformité NIS2 obligatoire',
      'Optimisation de la distribution',
      'Transition énergétique',
    ],
    regulations: ['NIS2', 'RGPD', 'Réglementations sectorielles'],
    certifications: ['ISO 27001', 'ISO 27019', 'IEC 62351'],
  },

  // ============================================================================
  // IMMOBILIER & CONSTRUCTION
  // ============================================================================
  {
    id: 'industry-immobilier',
    type: 'industry',
    slug: {
      fr: 'solutions/immobilier',
      en: 'solutions/real-estate',
      es: 'soluciones/inmobiliario',
    },
    title: {
      fr: 'Immobilier & Construction',
      en: 'Real Estate & Construction',
      es: 'Inmobiliario y Construcción',
    },
    description: {
      fr: "IA pour l'immobilier et la construction. Gestion de projets, documentation technique, relation client, analyse de marché.",
      en: 'AI for real estate and construction. Project management, technical documentation, customer relations, market analysis.',
      es: 'IA para inmobiliario y construcción. Gestión de proyectos, documentación técnica, relación cliente, análisis de mercado.',
    },
    seoKeywords: {
      fr: 'IA immobilier, construction IA, proptech, gestion projet BTP',
      en: 'real estate AI, construction AI, proptech, BTP project management',
      es: 'IA inmobiliario, construcción IA, proptech, gestión proyecto',
    },
    icon: 'home',
    priority: 'medium',
    batch: 2,
    challenges: [
      'Documentation projet volumineuse',
      'Coordination multi-intervenants',
      'Suivi réglementaire',
      'Relation client longue durée',
    ],
    regulations: ['RGPD', 'Réglementations urbanisme'],
    certifications: ['ISO 9001', 'ISO 27001'],
  },

  // ============================================================================
  // TRANSPORT & LOGISTIQUE
  // ============================================================================
  {
    id: 'industry-transport',
    type: 'industry',
    slug: {
      fr: 'solutions/transport',
      en: 'solutions/transport',
      es: 'soluciones/transporte',
    },
    title: {
      fr: 'Transport & Logistique',
      en: 'Transport & Logistics',
      es: 'Transporte y Logística',
    },
    description: {
      fr: 'IA pour le transport et la logistique. Optimisation des tournées, tracking, gestion de flotte, service client.',
      en: 'AI for transport and logistics. Route optimization, tracking, fleet management, customer service.',
      es: 'IA para transporte y logística. Optimización de rutas, tracking, gestión de flota, servicio al cliente.',
    },
    seoKeywords: {
      fr: 'IA transport, logistique IA, optimisation tournées, tracking colis',
      en: 'transport AI, logistics AI, route optimization, package tracking',
      es: 'IA transporte, logística IA, optimización rutas, tracking paquetes',
    },
    icon: 'truck',
    priority: 'medium',
    batch: 2,
    challenges: [
      'Optimisation des coûts de transport',
      'Traçabilité des livraisons',
      'Gestion de flotte',
      'Service client réactif',
    ],
    regulations: ['RGPD', 'Réglementations transport'],
    certifications: ['ISO 9001', 'ISO 27001', 'ISO 28000'],
  },

  // ============================================================================
  // ÉDUCATION & FORMATION
  // ============================================================================
  {
    id: 'industry-education',
    type: 'industry',
    slug: {
      fr: 'solutions/education',
      en: 'solutions/education',
      es: 'soluciones/educacion',
    },
    title: {
      fr: 'Éducation & Formation',
      en: 'Education & Training',
      es: 'Educación y Formación',
    },
    description: {
      fr: "IA pour l'éducation. E-learning personnalisé, assistance aux enseignants, gestion administrative, orientation.",
      en: 'AI for education. Personalized e-learning, teacher assistance, administrative management, guidance.',
      es: 'IA para educación. E-learning personalizado, asistencia a profesores, gestión administrativa, orientación.',
    },
    seoKeywords: {
      fr: 'IA éducation, e-learning IA, edtech, formation IA',
      en: 'education AI, e-learning AI, edtech, training AI',
      es: 'IA educación, e-learning IA, edtech, formación IA',
    },
    icon: 'book',
    priority: 'medium',
    batch: 2,
    challenges: [
      'Personnalisation des parcours',
      'Protection des données étudiants',
      'Charge administrative',
      'Accessibilité',
    ],
    regulations: ['RGPD', 'CNIL éducation'],
    certifications: ['ISO 27001'],
  },

  // ============================================================================
  // JURIDIQUE & CABINETS
  // ============================================================================
  {
    id: 'industry-juridique',
    type: 'industry',
    slug: {
      fr: 'solutions/juridique',
      en: 'solutions/legal',
      es: 'soluciones/juridico',
    },
    title: {
      fr: 'Juridique & Cabinets',
      en: 'Legal & Law Firms',
      es: 'Jurídico y Despachos',
    },
    description: {
      fr: 'IA pour le secteur juridique. Analyse de contrats, due diligence, recherche jurisprudentielle, rédaction assistée.',
      en: 'AI for the legal sector. Contract analysis, due diligence, case law research, assisted drafting.',
      es: 'IA para el sector jurídico. Análisis de contratos, due diligence, investigación jurisprudencial, redacción asistida.',
    },
    seoKeywords: {
      fr: 'IA juridique, legaltech, analyse contrats IA, due diligence IA',
      en: 'legal AI, legaltech, AI contract analysis, AI due diligence',
      es: 'IA jurídico, legaltech, análisis contratos IA, due diligence IA',
    },
    icon: 'file-text',
    priority: 'high',
    batch: 0,
    challenges: [
      'Confidentialité absolue',
      'Volume de documents',
      'Recherche jurisprudentielle',
      'Secret professionnel',
    ],
    regulations: ['RGPD', 'Secret professionnel', 'Déontologie'],
    certifications: ['ISO 27001', 'ISO 27701'],
  },

  // ============================================================================
  // CONSEIL & SERVICES PROFESSIONNELS
  // ============================================================================
  {
    id: 'industry-conseil',
    type: 'industry',
    slug: {
      fr: 'solutions/conseil',
      en: 'solutions/consulting',
      es: 'soluciones/consultoria',
    },
    title: {
      fr: 'Conseil & Services Professionnels',
      en: 'Consulting & Professional Services',
      es: 'Consultoría y Servicios Profesionales',
    },
    description: {
      fr: 'IA pour le conseil. Knowledge management, capitalisation expertise, propositions commerciales, delivery.',
      en: 'AI for consulting. Knowledge management, expertise capitalization, business proposals, delivery.',
      es: 'IA para consultoría. Knowledge management, capitalización expertise, propuestas comerciales, delivery.',
    },
    seoKeywords: {
      fr: 'IA conseil, knowledge management, capitalisation expertise, propositions IA',
      en: 'consulting AI, knowledge management, expertise capitalization, AI proposals',
      es: 'IA consultoría, knowledge management, capitalización expertise, propuestas IA',
    },
    icon: 'briefcase',
    priority: 'medium',
    batch: 2,
    challenges: [
      'Capitalisation du savoir',
      'Turnover des consultants',
      'Personnalisation des propositions',
      'Delivery multi-clients',
    ],
    regulations: ['RGPD', 'Confidentialité client'],
    certifications: ['ISO 27001', 'ISO 9001'],
  },

  // ============================================================================
  // ETI & GRANDES ENTREPRISES
  // ============================================================================
  {
    id: 'industry-enterprise',
    type: 'industry',
    slug: {
      fr: 'solutions/entreprises',
      en: 'solutions/enterprise',
      es: 'soluciones/empresas',
    },
    title: {
      fr: 'ETI & Grandes Entreprises',
      en: 'Mid-size & Large Enterprises',
      es: 'PYMES y Grandes Empresas',
    },
    description: {
      fr: 'IA pour les ETI et grandes entreprises. Scalabilité, gouvernance multi-entités, intégration SI complexe, support dédié.',
      en: 'AI for mid-size and large enterprises. Scalability, multi-entity governance, complex SI integration, dedicated support.',
      es: 'IA para PYMES y grandes empresas. Escalabilidad, gobernanza multi-entidad, integración SI compleja, soporte dedicado.',
    },
    seoKeywords: {
      fr: 'IA entreprise, IA ETI, grands comptes IA, plateforme IA entreprise',
      en: 'enterprise AI, mid-size AI, large accounts AI, enterprise AI platform',
      es: 'IA empresarial, IA PYME, grandes cuentas IA, plataforma IA empresarial',
    },
    icon: 'building-2',
    priority: 'high',
    batch: 0,
    challenges: [
      'Gouvernance multi-entités',
      'Intégration SI complexe',
      'Scalabilité à grande échelle',
      'Conformité multi-réglementations',
    ],
    regulations: ['RGPD', 'NIS2', 'Réglementations sectorielles'],
    certifications: ['ISO 27001', 'SOC 2', 'ISO 9001'],
  },
]

export function getIndustryById(id: string): IndustryTaxonomy | undefined {
  return industries.find((i) => i.id === id)
}

export function getIndustriesByPriority(
  priority: 'high' | 'medium' | 'normal' | 'low',
): IndustryTaxonomy[] {
  return industries.filter((i) => i.priority === priority)
}

export function getIndustriesByBatch(batch: number): IndustryTaxonomy[] {
  return industries.filter((i) => i.batch === batch)
}
