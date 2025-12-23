/**
 * Product Brief - Source of Truth for Superfasttt
 *
 * Ce fichier centralise toutes les informations produit utilisées
 * pour la génération de contenu. Il est construit à partir de:
 * - VISION.md
 * - RAG_OVERVIEW.md
 * - PROFILS_IA.md
 * - INTEGRATIONS.md
 * - CONTEXTE_ENTREPRISE.md
 * - seed-homepage-fr.ts
 */

import type { ProductBrief } from '../types'

export const productBrief: ProductBrief = {
  companyName: 'SUPERFASTTT',

  tagline: {
    fr: "L'intelligence artificielle qui reste chez vous",
    en: 'The AI that stays with you',
    es: 'La inteligencia artificial que se queda contigo',
  },

  valueProposition: {
    fr: "Plateforme IA souveraine pour orchestrer l'IA dans tous vos métiers, sans envoyer vos données ailleurs. Gardez le contrôle total sur vos modèles, vos données et vos coûts.",
    en: 'Sovereign AI platform to orchestrate AI across all your departments, without sending your data elsewhere. Keep total control over your models, data and costs.',
    es: 'Plataforma de IA soberana para orquestar la IA en todos sus departamentos, sin enviar sus datos a otro lugar. Mantenga el control total sobre sus modelos, datos y costos.',
  },

  pillars: [
    {
      id: 'sovereignty',
      title: {
        fr: 'Souveraineté totale',
        en: 'Total sovereignty',
        es: 'Soberanía total',
      },
      description: {
        fr: 'Vos données, vos modèles, vos clés API. Rien ne sort de votre périmètre. Hébergement en France sur infrastructure Scaleway ou sur vos propres serveurs.',
        en: 'Your data, your models, your API keys. Nothing leaves your perimeter. Hosting in France on Scaleway infrastructure or on your own servers.',
        es: 'Sus datos, sus modelos, sus claves API. Nada sale de su perímetro. Alojamiento en Francia en infraestructura Scaleway o en sus propios servidores.',
      },
      icon: 'shield',
    },
    {
      id: 'model-control',
      title: {
        fr: 'Le bon modèle au bon endroit',
        en: 'The right model in the right place',
        es: 'El modelo adecuado en el lugar adecuado',
      },
      description: {
        fr: 'Définissez quel modèle IA utilise chaque service selon la sensibilité des données. Routage intelligent entre modèles cloud et on-premise via LiteLLM.',
        en: 'Define which AI model each service uses based on data sensitivity. Intelligent routing between cloud and on-premise models via LiteLLM.',
        es: 'Defina qué modelo de IA utiliza cada servicio según la sensibilidad de los datos. Enrutamiento inteligente entre modelos cloud y on-premise a través de LiteLLM.',
      },
      icon: 'layers',
    },
    {
      id: 'governance',
      title: {
        fr: 'Gouvernance auditable',
        en: 'Auditable governance',
        es: 'Gobernanza auditable',
      },
      description: {
        fr: "Tableau de bord centralisé: qui utilise l'IA, pour quoi, avec quelles données, à quel coût. Quotas, alertes et audit trail complet.",
        en: 'Centralized dashboard: who uses AI, for what, with what data, at what cost. Quotas, alerts and complete audit trail.',
        es: 'Panel centralizado: quién usa la IA, para qué, con qué datos, a qué costo. Cuotas, alertas y registro de auditoría completo.',
      },
      icon: 'chart',
    },
    {
      id: 'interoperability',
      title: {
        fr: 'Interopérabilité native',
        en: 'Native interoperability',
        es: 'Interoperabilidad nativa',
      },
      description: {
        fr: 'Connectez SharePoint, Google Drive, Notion, Slack. Déployez des agents dans Teams. Framework de connecteurs extensible avec OAuth2 et sync incrémental.',
        en: 'Connect SharePoint, Google Drive, Notion, Slack. Deploy agents in Teams. Extensible connector framework with OAuth2 and incremental sync.',
        es: 'Conecte SharePoint, Google Drive, Notion, Slack. Despliegue agentes en Teams. Marco de conectores extensible con OAuth2 y sincronización incremental.',
      },
      icon: 'cloud',
    },
  ],

  features: [
    // RAG & Knowledge Base
    {
      id: 'rag-multimodal',
      name: {
        fr: 'RAG Multimodal',
        en: 'Multimodal RAG',
        es: 'RAG Multimodal',
      },
      description: {
        fr: 'Indexez PDF, documents Office, images, audio. Recherche sémantique dans votre base de connaissances avec chunking intelligent.',
        en: 'Index PDFs, Office documents, images, audio. Semantic search in your knowledge base with intelligent chunking.',
        es: 'Indexe PDFs, documentos Office, imágenes, audio. Búsqueda semántica en su base de conocimientos con chunking inteligente.',
      },
      category: 'rag',
    },
    {
      id: 'rag-dashboard',
      name: {
        fr: 'Dashboard RAG',
        en: 'RAG Dashboard',
        es: 'Panel RAG',
      },
      description: {
        fr: 'Visibilité complète sur le cortex de connaissance: documents ingérés, chunks, embeddings, erreurs, qualité du corpus.',
        en: 'Complete visibility on knowledge cortex: ingested documents, chunks, embeddings, errors, corpus quality.',
        es: 'Visibilidad completa del córtex de conocimiento: documentos ingeridos, chunks, embeddings, errores, calidad del corpus.',
      },
      category: 'rag',
    },
    // Assistants
    {
      id: 'ai-assistants',
      name: {
        fr: 'Assistants IA Métiers',
        en: 'Business AI Assistants',
        es: 'Asistentes IA de Negocios',
      },
      description: {
        fr: 'Créez des agents personnalisés par département avec profils IA configurables: paramètres RAG, LLM, chunking, retrieval.',
        en: 'Create custom agents per department with configurable AI profiles: RAG, LLM, chunking, retrieval parameters.',
        es: 'Cree agentes personalizados por departamento con perfiles IA configurables: parámetros RAG, LLM, chunking, retrieval.',
      },
      category: 'assistants',
    },
    {
      id: 'ai-profiles',
      name: {
        fr: 'Profils IA',
        en: 'AI Profiles',
        es: 'Perfiles IA',
      },
      description: {
        fr: "Configuration fine du comportement: stratégie de chunking, modèle d'embedding, retrieval hybride, reranking, citations forcées, mode strict.",
        en: 'Fine-grained behavior configuration: chunking strategy, embedding model, hybrid retrieval, reranking, forced citations, strict mode.',
        es: 'Configuración fina del comportamiento: estrategia de chunking, modelo de embedding, retrieval híbrido, reranking, citas forzadas, modo estricto.',
      },
      category: 'assistants',
    },
    // Context & Memory
    {
      id: 'enterprise-context',
      name: {
        fr: 'Contexte Entreprise',
        en: 'Enterprise Context',
        es: 'Contexto Empresarial',
      },
      description: {
        fr: "Noyau d'identité permanent: mission, vision, valeurs, vocabulaire métier, style de communication, règles globales pour tous les agents.",
        en: 'Permanent identity kernel: mission, vision, values, business vocabulary, communication style, global rules for all agents.',
        es: 'Núcleo de identidad permanente: misión, visión, valores, vocabulario de negocios, estilo de comunicación, reglas globales para todos los agentes.',
      },
      category: 'context',
    },
    {
      id: 'user-memory',
      name: {
        fr: 'Mémoire Utilisateur',
        en: 'User Memory',
        es: 'Memoria de Usuario',
      },
      description: {
        fr: 'Mémoire persistante par utilisateur avec consolidation automatique. Contexte conversationnel préservé entre sessions.',
        en: 'Persistent memory per user with automatic consolidation. Conversational context preserved between sessions.',
        es: 'Memoria persistente por usuario con consolidación automática. Contexto conversacional preservado entre sesiones.',
      },
      category: 'context',
    },
    // Orchestration
    {
      id: 'multi-model',
      name: {
        fr: 'Orchestration Multi-Modèles',
        en: 'Multi-Model Orchestration',
        es: 'Orquestación Multi-Modelos',
      },
      description: {
        fr: 'Routage intelligent vers OpenAI, Anthropic, Mistral, Ollama, OpenRouter. Fallback automatique et load balancing via LiteLLM Proxy.',
        en: 'Intelligent routing to OpenAI, Anthropic, Mistral, Ollama, OpenRouter. Automatic fallback and load balancing via LiteLLM Proxy.',
        es: 'Enrutamiento inteligente a OpenAI, Anthropic, Mistral, Ollama, OpenRouter. Fallback automático y balanceo de carga a través de LiteLLM Proxy.',
      },
      category: 'orchestration',
    },
    {
      id: 'api-keys',
      name: {
        fr: 'Clés API par Tenant',
        en: 'Per-Tenant API Keys',
        es: 'Claves API por Tenant',
      },
      description: {
        fr: 'Chaque organisation utilise ses propres clés API. Isolation complète des coûts et des accès entre tenants.',
        en: 'Each organization uses its own API keys. Complete isolation of costs and access between tenants.',
        es: 'Cada organización utiliza sus propias claves API. Aislamiento completo de costos y accesos entre tenants.',
      },
      category: 'orchestration',
    },
    // Governance
    {
      id: 'usage-dashboard',
      name: {
        fr: 'Dashboard Usages',
        en: 'Usage Dashboard',
        es: 'Panel de Uso',
      },
      description: {
        fr: 'Suivi en temps réel des usages par modèle, équipe, utilisateur. Coûts, tokens consommés, requêtes, latence.',
        en: 'Real-time usage tracking by model, team, user. Costs, tokens consumed, requests, latency.',
        es: 'Seguimiento en tiempo real de usos por modelo, equipo, usuario. Costos, tokens consumidos, solicitudes, latencia.',
      },
      category: 'governance',
    },
    {
      id: 'quotas-alerts',
      name: {
        fr: 'Quotas et Alertes',
        en: 'Quotas and Alerts',
        es: 'Cuotas y Alertas',
      },
      description: {
        fr: 'Définissez des limites par utilisateur ou équipe. Alertes automatiques en cas de dépassement ou anomalie.',
        en: 'Set limits per user or team. Automatic alerts for overruns or anomalies.',
        es: 'Establezca límites por usuario o equipo. Alertas automáticas por excesos o anomalías.',
      },
      category: 'governance',
    },
    {
      id: 'audit-trail',
      name: {
        fr: 'Audit Trail',
        en: 'Audit Trail',
        es: 'Registro de Auditoría',
      },
      description: {
        fr: 'Journal complet de toutes les interactions IA: qui, quand, quel modèle, quelles données, quelle réponse.',
        en: 'Complete log of all AI interactions: who, when, which model, what data, what response.',
        es: 'Registro completo de todas las interacciones IA: quién, cuándo, qué modelo, qué datos, qué respuesta.',
      },
      category: 'governance',
    },
    // Integrations
    {
      id: 'connectors',
      name: {
        fr: 'Connecteurs',
        en: 'Connectors',
        es: 'Conectores',
      },
      description: {
        fr: 'Google Drive, SharePoint, Notion, Slack, Dropbox. OAuth2 et synchronisation incrémentale automatique.',
        en: 'Google Drive, SharePoint, Notion, Slack, Dropbox. OAuth2 and automatic incremental synchronization.',
        es: 'Google Drive, SharePoint, Notion, Slack, Dropbox. OAuth2 y sincronización incremental automática.',
      },
      category: 'integrations',
    },
    {
      id: 'connector-framework',
      name: {
        fr: 'Framework Connecteurs',
        en: 'Connector Framework',
        es: 'Framework de Conectores',
      },
      description: {
        fr: 'Architecture modulaire pour ajouter rapidement de nouvelles intégrations. BaseConnector, DocumentEnvelope, SyncState.',
        en: 'Modular architecture to quickly add new integrations. BaseConnector, DocumentEnvelope, SyncState.',
        es: 'Arquitectura modular para agregar rápidamente nuevas integraciones. BaseConnector, DocumentEnvelope, SyncState.',
      },
      category: 'integrations',
    },
    // Apps
    {
      id: 'marketplace',
      name: {
        fr: 'Marketplace Apps',
        en: 'App Marketplace',
        es: 'Marketplace de Apps',
      },
      description: {
        fr: "Écosystème d'applications tierces. SDK développeur, SSO automatique, publication et distribution.",
        en: 'Third-party application ecosystem. Developer SDK, automatic SSO, publishing and distribution.',
        es: 'Ecosistema de aplicaciones de terceros. SDK para desarrolladores, SSO automático, publicación y distribución.',
      },
      category: 'apps',
    },
  ],

  differentiators: [
    'Souveraineté des données (hébergement France, on-premise possible)',
    'Multi-modèles avec routage intelligent',
    'Gouvernance et visibilité complète sur les usages',
    'Contexte entreprise natif',
    'Mémoire utilisateur persistante',
    'Architecture ouverte et extensible',
    'Stack open-source (Next.js, FastAPI, PostgreSQL)',
  ],

  compliance: [
    {
      name: 'RGPD',
      status: 'compliant',
      description: {
        fr: 'Hébergement en France, données non transférées hors UE',
        en: 'Hosting in France, data not transferred outside EU',
        es: 'Alojamiento en Francia, datos no transferidos fuera de la UE',
      },
    },
    {
      name: 'HDS',
      status: 'ready',
      description: {
        fr: 'Architecture compatible Hébergeur de Données de Santé',
        en: 'Health Data Hosting compatible architecture',
        es: 'Arquitectura compatible con Alojamiento de Datos de Salud',
      },
    },
    {
      name: 'ACPR',
      status: 'compatible',
      description: {
        fr: 'Conformité secteur bancaire et assurance',
        en: 'Banking and insurance sector compliance',
        es: 'Cumplimiento del sector bancario y de seguros',
      },
    },
    {
      name: 'SecNumCloud',
      status: 'friendly',
      description: {
        fr: 'Déployable sur infrastructure qualifiée SecNumCloud',
        en: 'Deployable on SecNumCloud qualified infrastructure',
        es: 'Desplegable en infraestructura calificada SecNumCloud',
      },
    },
    {
      name: 'ISO 27001',
      status: 'compatible',
      description: {
        fr: 'Pratiques de sécurité alignées sur la norme',
        en: 'Security practices aligned with the standard',
        es: 'Prácticas de seguridad alineadas con la norma',
      },
    },
  ],

  deploymentOptions: [
    {
      id: 'cloud-france',
      title: {
        fr: 'Cloud SUPERFASTTT (France)',
        en: 'SUPERFASTTT Cloud (France)',
        es: 'Cloud SUPERFASTTT (Francia)',
      },
      description: {
        fr: 'Démarrage rapide, hébergement Scaleway en France, maintenance incluse',
        en: 'Quick start, Scaleway hosting in France, maintenance included',
        es: 'Inicio rápido, alojamiento Scaleway en Francia, mantenimiento incluido',
      },
    },
    {
      id: 'dedicated',
      title: {
        fr: 'Cloud Dédié',
        en: 'Dedicated Cloud',
        es: 'Cloud Dedicado',
      },
      description: {
        fr: 'Instance dédiée sur infrastructure isolée, PostgreSQL dédié',
        en: 'Dedicated instance on isolated infrastructure, dedicated PostgreSQL',
        es: 'Instancia dedicada en infraestructura aislada, PostgreSQL dedicado',
      },
    },
    {
      id: 'on-premise',
      title: {
        fr: 'Sur vos serveurs (On-Premise)',
        en: 'On your servers (On-Premise)',
        es: 'En sus servidores (On-Premise)',
      },
      description: {
        fr: 'Contrôle total, environnements déconnectés (air-gap), conformité maximale',
        en: 'Total control, disconnected environments (air-gap), maximum compliance',
        es: 'Control total, entornos desconectados (air-gap), cumplimiento máximo',
      },
    },
  ],

  stack: [
    'Next.js 15 (frontend)',
    'FastAPI (backend Python)',
    'PostgreSQL + pgvector',
    'Qdrant (option vector store)',
    'LlamaIndex (RAG)',
    'LiteLLM (orchestration LLM)',
    'Scaleway (cloud France)',
    'Docker / Kubernetes',
  ],

  targetAudiences: [
    'Dirigeants / COMEX',
    'DSI / CTO',
    'RSSI / DPO',
    'Métiers régulés (finance, santé, assurance)',
    'Grandes entreprises et ETI',
    'Secteur public',
  ],
}

// Helper function to get localized content
export function getLocalizedBrief(locale: 'fr' | 'en' | 'es') {
  return {
    companyName: productBrief.companyName,
    tagline: productBrief.tagline[locale],
    valueProposition: productBrief.valueProposition[locale],
    pillars: productBrief.pillars.map((p) => ({
      ...p,
      title: p.title[locale],
      description: p.description[locale],
    })),
    features: productBrief.features.map((f) => ({
      ...f,
      name: f.name[locale],
      description: f.description[locale],
    })),
    compliance: productBrief.compliance.map((c) => ({
      ...c,
      description: c.description[locale],
    })),
    deploymentOptions: productBrief.deploymentOptions.map((d) => ({
      ...d,
      title: d.title[locale],
      description: d.description[locale],
    })),
    differentiators: productBrief.differentiators,
    stack: productBrief.stack,
    targetAudiences: productBrief.targetAudiences,
  }
}

// Export brief as JSON string for prompts
export function getBriefForPrompt(locale: 'fr' | 'en' | 'es'): string {
  const brief = getLocalizedBrief(locale)
  return JSON.stringify(brief, null, 2)
}
