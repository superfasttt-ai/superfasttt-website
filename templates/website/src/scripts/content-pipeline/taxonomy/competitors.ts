/**
 * Competitors Data
 * Defines competitor information for comparison pages
 */

import type { Competitor } from '../types'

export const competitors: Competitor[] = [
  // ============================================================================
  // BIG TECH
  // ============================================================================
  {
    id: 'microsoft-copilot',
    name: 'Microsoft 365 Copilot',
    website: 'https://www.microsoft.com/copilot',
    category: 'big-tech',
    strengths: [
      {
        fr: 'Intégration native Office 365',
        en: 'Native Office 365 integration',
        es: 'Integración nativa Office 365',
      },
      {
        fr: 'Large base utilisateurs existante',
        en: 'Large existing user base',
        es: 'Gran base de usuarios existente',
      },
      { fr: 'Puissance de GPT-4', en: 'GPT-4 power', es: 'Potencia de GPT-4' },
      {
        fr: 'Écosystème Microsoft complet',
        en: 'Complete Microsoft ecosystem',
        es: 'Ecosistema Microsoft completo',
      },
    ],
    weaknesses: [
      {
        fr: 'Données transitent par Azure US',
        en: 'Data goes through Azure US',
        es: 'Datos transitan por Azure US',
      },
      {
        fr: 'Pas de contrôle sur les modèles',
        en: 'No control over models',
        es: 'Sin control sobre los modelos',
      },
      {
        fr: 'Coût élevé par utilisateur (30€/mois)',
        en: 'High cost per user (€30/month)',
        es: 'Costo alto por usuario (30€/mes)',
      },
      {
        fr: 'Dépendance écosystème Microsoft',
        en: 'Microsoft ecosystem dependency',
        es: 'Dependencia ecosistema Microsoft',
      },
      {
        fr: 'Personnalisation limitée',
        en: 'Limited customization',
        es: 'Personalización limitada',
      },
    ],
    pricing: '30€/utilisateur/mois',
    sovereignty: 'none',
    deployment: ['cloud'],
    certifications: ['SOC 2', 'ISO 27001'],
    targetAudience: ['PME', 'Grandes entreprises', 'Utilisateurs Office'],
  },
  {
    id: 'google-gemini',
    name: 'Google Gemini for Workspace',
    website: 'https://workspace.google.com/solutions/ai/',
    category: 'big-tech',
    strengths: [
      {
        fr: 'Intégration Google Workspace native',
        en: 'Native Google Workspace integration',
        es: 'Integración nativa Google Workspace',
      },
      { fr: 'Modèle Gemini performant', en: 'Powerful Gemini model', es: 'Modelo Gemini potente' },
      {
        fr: 'Recherche et indexation avancées',
        en: 'Advanced search and indexing',
        es: 'Búsqueda e indexación avanzadas',
      },
    ],
    weaknesses: [
      { fr: 'Données hébergées aux US', en: 'Data hosted in US', es: 'Datos alojados en US' },
      {
        fr: 'Pas de déploiement on-premise',
        en: 'No on-premise deployment',
        es: 'Sin despliegue on-premise',
      },
      {
        fr: 'Verrouillage écosystème Google',
        en: 'Google ecosystem lock-in',
        es: 'Bloqueo ecosistema Google',
      },
    ],
    pricing: '30$/utilisateur/mois',
    sovereignty: 'none',
    deployment: ['cloud'],
    certifications: ['SOC 2', 'ISO 27001', 'FedRAMP'],
    targetAudience: ['PME', 'Startups', 'Utilisateurs Google'],
  },
  {
    id: 'chatgpt-enterprise',
    name: 'ChatGPT Enterprise',
    website: 'https://openai.com/enterprise',
    category: 'big-tech',
    strengths: [
      {
        fr: 'Accès à GPT-4 et nouveaux modèles',
        en: 'Access to GPT-4 and new models',
        es: 'Acceso a GPT-4 y nuevos modelos',
      },
      {
        fr: 'Interface utilisateur intuitive',
        en: 'Intuitive user interface',
        es: 'Interfaz de usuario intuitiva',
      },
      {
        fr: 'Pas de formation sur les données',
        en: 'No training on data',
        es: 'Sin entrenamiento en datos',
      },
      { fr: 'SSO et admin console', en: 'SSO and admin console', es: 'SSO y consola admin' },
    ],
    weaknesses: [
      {
        fr: 'Données transitent par OpenAI (US)',
        en: 'Data goes through OpenAI (US)',
        es: 'Datos transitan por OpenAI (US)',
      },
      { fr: 'Pas de RAG natif', en: 'No native RAG', es: 'Sin RAG nativo' },
      {
        fr: 'Pas de déploiement on-premise',
        en: 'No on-premise deployment',
        es: 'Sin despliegue on-premise',
      },
      { fr: 'Intégrations limitées', en: 'Limited integrations', es: 'Integraciones limitadas' },
    ],
    pricing: 'Sur devis (estimé 25-30$/utilisateur/mois)',
    sovereignty: 'none',
    deployment: ['cloud'],
    certifications: ['SOC 2', 'GDPR'],
    targetAudience: ['Entreprises', 'Équipes tech'],
  },
  {
    id: 'amazon-q',
    name: 'Amazon Q Business',
    website: 'https://aws.amazon.com/q/business/',
    category: 'big-tech',
    strengths: [
      { fr: 'Intégration AWS native', en: 'Native AWS integration', es: 'Integración AWS nativa' },
      { fr: 'Connecteurs nombreux', en: 'Many connectors', es: 'Muchos conectores' },
      { fr: 'RAG intégré', en: 'Integrated RAG', es: 'RAG integrado' },
    ],
    weaknesses: [
      { fr: 'Complexité AWS', en: 'AWS complexity', es: 'Complejidad AWS' },
      {
        fr: 'Données sur AWS (souvent US)',
        en: 'Data on AWS (often US)',
        es: 'Datos en AWS (a menudo US)',
      },
      { fr: "Courbe d'apprentissage", en: 'Learning curve', es: 'Curva de aprendizaje' },
    ],
    pricing: '20$/utilisateur/mois',
    sovereignty: 'partial',
    deployment: ['cloud'],
    certifications: ['SOC 2', 'ISO 27001', 'FedRAMP', 'HDS'],
    targetAudience: ['Entreprises AWS', 'Équipes tech'],
  },

  // ============================================================================
  // EUROPEAN / SOVEREIGN
  // ============================================================================
  {
    id: 'mistral-le-chat',
    name: 'Mistral Le Chat / La Plateforme',
    website: 'https://mistral.ai',
    category: 'european',
    strengths: [
      {
        fr: 'Modèles européens performants',
        en: 'Performant European models',
        es: 'Modelos europeos potentes',
      },
      {
        fr: 'Hébergement Europe possible',
        en: 'European hosting available',
        es: 'Alojamiento Europa disponible',
      },
      {
        fr: 'Open source (certains modèles)',
        en: 'Open source (some models)',
        es: 'Open source (algunos modelos)',
      },
      { fr: 'Prix compétitifs', en: 'Competitive pricing', es: 'Precios competitivos' },
    ],
    weaknesses: [
      {
        fr: 'Pas de plateforme entreprise complète',
        en: 'No complete enterprise platform',
        es: 'Sin plataforma empresarial completa',
      },
      {
        fr: 'RAG à construire soi-même',
        en: 'RAG to build yourself',
        es: 'RAG a construir uno mismo',
      },
      {
        fr: 'Pas de gouvernance intégrée',
        en: 'No integrated governance',
        es: 'Sin gobernanza integrada',
      },
      { fr: 'Support limité', en: 'Limited support', es: 'Soporte limitado' },
    ],
    pricing: 'Pay-as-you-go (API)',
    sovereignty: 'partial',
    deployment: ['cloud', 'on-premise'],
    certifications: ['GDPR'],
    targetAudience: ['Développeurs', 'Startups', 'Entreprises tech'],
  },
  {
    id: 'huggingface',
    name: 'HuggingFace',
    website: 'https://huggingface.co',
    category: 'european',
    strengths: [
      {
        fr: 'Catalogue de modèles immense',
        en: 'Huge model catalog',
        es: 'Catálogo de modelos enorme',
      },
      { fr: 'Communauté active', en: 'Active community', es: 'Comunidad activa' },
      { fr: 'Open source', en: 'Open source', es: 'Open source' },
      { fr: 'Flexibilité maximale', en: 'Maximum flexibility', es: 'Flexibilidad máxima' },
    ],
    weaknesses: [
      {
        fr: 'Pas de solution clé en main',
        en: 'No turnkey solution',
        es: 'Sin solución llave en mano',
      },
      {
        fr: 'Expertise technique requise',
        en: 'Technical expertise required',
        es: 'Experiencia técnica requerida',
      },
      {
        fr: 'Pas de gouvernance entreprise',
        en: 'No enterprise governance',
        es: 'Sin gobernanza empresarial',
      },
      { fr: 'Support communautaire', en: 'Community support', es: 'Soporte comunitario' },
    ],
    pricing: 'Gratuit + Inference Endpoints payants',
    sovereignty: 'partial',
    deployment: ['cloud', 'on-premise'],
    certifications: ['SOC 2'],
    targetAudience: ['Data Scientists', 'Développeurs', 'Chercheurs'],
  },

  // ============================================================================
  // SPECIALIZED / VERTICAL
  // ============================================================================
  {
    id: 'notion-ai',
    name: 'Notion AI',
    website: 'https://notion.so/product/ai',
    category: 'specialized',
    strengths: [
      {
        fr: 'Intégration Notion parfaite',
        en: 'Perfect Notion integration',
        es: 'Integración Notion perfecta',
      },
      { fr: 'Interface simple', en: 'Simple interface', es: 'Interfaz simple' },
      { fr: 'Prix accessible', en: 'Accessible pricing', es: 'Precio accesible' },
    ],
    weaknesses: [
      { fr: 'Limité à Notion', en: 'Limited to Notion', es: 'Limitado a Notion' },
      { fr: 'Données US', en: 'US data', es: 'Datos US' },
      { fr: 'Pas de RAG avancé', en: 'No advanced RAG', es: 'Sin RAG avanzado' },
      {
        fr: "Pas pour l'entreprise régulée",
        en: 'Not for regulated enterprise',
        es: 'No para empresa regulada',
      },
    ],
    pricing: '10$/utilisateur/mois (add-on)',
    sovereignty: 'none',
    deployment: ['cloud'],
    certifications: ['SOC 2'],
    targetAudience: ['PME', 'Startups', 'Équipes Notion'],
  },

  // ============================================================================
  // OPEN SOURCE / DIY
  // ============================================================================
  {
    id: 'langchain-diy',
    name: 'LangChain / LlamaIndex (DIY)',
    website: 'https://langchain.com',
    category: 'open-source',
    strengths: [
      { fr: 'Flexibilité totale', en: 'Total flexibility', es: 'Flexibilidad total' },
      { fr: 'Open source', en: 'Open source', es: 'Open source' },
      { fr: 'Communauté large', en: 'Large community', es: 'Comunidad amplia' },
      { fr: 'Contrôle complet', en: 'Complete control', es: 'Control completo' },
    ],
    weaknesses: [
      {
        fr: 'Développement interne nécessaire',
        en: 'Internal development required',
        es: 'Desarrollo interno necesario',
      },
      { fr: 'Maintenance continue', en: 'Ongoing maintenance', es: 'Mantenimiento continuo' },
      {
        fr: 'Pas de support entreprise',
        en: 'No enterprise support',
        es: 'Sin soporte empresarial',
      },
      { fr: 'Time-to-value long', en: 'Long time-to-value', es: 'Time-to-value largo' },
      { fr: 'Gouvernance à construire', en: 'Governance to build', es: 'Gobernanza a construir' },
    ],
    pricing: "Gratuit (coûts d'infra + développement)",
    sovereignty: 'full',
    deployment: ['on-premise', 'cloud', 'hybrid'],
    certifications: [],
    targetAudience: ['Équipes tech', 'Startups', 'R&D'],
  },
  {
    id: 'ollama-local',
    name: 'Ollama / LocalAI',
    website: 'https://ollama.com',
    category: 'open-source',
    strengths: [
      { fr: 'Exécution 100% locale', en: '100% local execution', es: 'Ejecución 100% local' },
      { fr: 'Gratuit', en: 'Free', es: 'Gratuito' },
      { fr: 'Contrôle total des données', en: 'Total data control', es: 'Control total de datos' },
      { fr: 'Simple à démarrer', en: 'Simple to start', es: 'Simple para empezar' },
    ],
    weaknesses: [
      {
        fr: 'Pas de fonctionnalités entreprise',
        en: 'No enterprise features',
        es: 'Sin funcionalidades empresariales',
      },
      {
        fr: 'Performance limitée (hardware)',
        en: 'Limited performance (hardware)',
        es: 'Rendimiento limitado (hardware)',
      },
      { fr: 'Pas de RAG intégré', en: 'No integrated RAG', es: 'Sin RAG integrado' },
      { fr: 'Pas de gouvernance', en: 'No governance', es: 'Sin gobernanza' },
    ],
    pricing: 'Gratuit',
    sovereignty: 'full',
    deployment: ['on-premise'],
    certifications: [],
    targetAudience: ['Développeurs', 'Expérimentateurs', 'Usage personnel'],
  },
]

export function getCompetitorById(id: string): Competitor | undefined {
  return competitors.find((c) => c.id === id)
}

export function getCompetitorsByCategory(
  category: 'big-tech' | 'european' | 'open-source' | 'specialized',
): Competitor[] {
  return competitors.filter((c) => c.category === category)
}
