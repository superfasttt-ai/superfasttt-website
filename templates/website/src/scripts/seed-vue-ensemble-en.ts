/**
 * Script to create/update the "Overview" page SUPERFASTTT EN via PayloadCMS API
 * Based on content from templates/website/exemples/vue-ensemble.md (English version)
 *
 * Execution: pnpm seed:vue-ensemble:en
 */

import 'dotenv/config'

import type { RequiredDataFromCollectionSlug } from 'payload'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

// Page ID to update (provided by user)
const PAGE_ID = '6946c8ab089a3ba91c03f572'

// Overview page data SUPERFASTTT EN based on vue-ensemble.md v3
const getOverviewData = (): RequiredDataFromCollectionSlug<'pages'> => {
  return {
    slug: 'overview',
    _status: 'published',
    title: 'Overview',
    hero: {
      type: 'none',
    },
    layout: [
      // SECTION 1: HERO
      {
        blockType: 'heroModern',
        blockName: 'Hero',
        badge: 'Sovereign AI',
        title: 'Take back control',
        highlightedText: 'of your artificial intelligence',
        description:
          'A sovereign AI foundation to connect your data, choose your models, and govern usage — within an auditable framework. SUPERFASTTT: the platform that integrates with your existing systems without replacing them, making you the master of your AI strategy.',
        links: [
          {
            link: {
              type: 'custom',
              appearance: 'default',
              label: 'Request a demo',
              url: '/contact',
            },
          },
          {
            link: {
              type: 'custom',
              appearance: 'outline',
              label: 'Discover our use cases',
              url: '/use-cases',
            },
          },
        ],
        trustIndicators: {
          headline: 'Compliant with European standards',
          indicators: [
            { icon: 'shield', label: 'GDPR' },
            { icon: 'globe', label: 'Sovereign' },
            { icon: 'lock', label: 'Auditable' },
          ],
        },
        showGridPattern: true,
        showGradientOrbs: true,
        showFoundationVisual: false,
      },

      // SECTION 2: THE PROBLEM
      {
        blockType: 'featureGrid',
        blockName: 'Problem',
        badge: 'The reality',
        title: 'Enterprise AI can no longer depend on American giants',
        description:
          "You're already using AI. ChatGPT, Copilot, Gemini. Your teams love it. But three questions remain unanswered.",
        columns: '3',
        features: [
          {
            icon: 'globe',
            title: 'Where does your data go?',
            description:
              'Every conversation, every analyzed document passes through infrastructures outside your control. In case of an audit, could you prove their exact location?',
          },
          {
            icon: 'settings',
            title: 'Who controls your models?',
            description:
              'You depend on a single provider who can change their terms, raise prices, or restrict access without notice.',
          },
          {
            icon: 'shield',
            title: 'Can you demonstrate compliance?',
            description:
              'Facing a GDPR, HIPAA, or financial audit, do you have the logs, traces, and proof that your sensitive data never left the authorized perimeter?',
          },
        ],
      },

      // SECTION 3: OUR ANSWER
      {
        blockType: 'featureGrid',
        blockName: 'Our answer',
        badge: 'The solution',
        title: 'A platform that integrates without replacing everything',
        description:
          'SUPERFASTTT isn\'t just another chatbot. It\'s the complete infrastructure that allows your organization to deploy AI at scale while maintaining full control. Think of SUPERFASTTT as the "Odoo of Artificial Intelligence": a modular suite where each component activates according to your needs.',
        columns: '3',
        features: [
          {
            icon: 'zap',
            title: 'No heavy migration',
            description: 'We connect your existing tools without replacing them.',
          },
          {
            icon: 'database',
            title: 'No replacement needed',
            description: 'Your documents stay where they are, we index them.',
          },
          {
            icon: 'layers',
            title: 'No big bang approach',
            description: 'You activate features progressively.',
          },
        ],
      },

      // SECTION 4: THE 4 PILLARS
      {
        blockType: 'featureGrid',
        blockName: 'The 4 pillars',
        badge: 'What sets us apart',
        title: 'The 4 pillars of SUPERFASTTT',
        columns: '2',
        features: [
          {
            icon: 'shield',
            title: 'Controlled sovereignty',
            description:
              'Your data stays within your trust perimeter. French Cloud, dedicated server, or on-premise. Encryption at rest and in transit. Strict isolation between clients. Access logs consultable and exportable.',
          },
          {
            icon: 'settings',
            title: 'Granular control',
            description:
              'Each assistant is linked to an AI profile, a data scope, and governance rules. Define which models access which sources, which employees use which features.',
          },
          {
            icon: 'chart',
            title: 'Auditable governance',
            description:
              'Complete audit log with every request tracked. Costs and consumption by service, project, AI profile. Real-time alerts on quota overruns and abnormal behavior.',
          },
          {
            icon: 'cloud',
            title: 'Native interoperability',
            description:
              'Integrates with your existing systems. Your document spaces remain the source of truth (Drive, SharePoint, Notion). Your communication tools become AI access channels (Teams, Slack).',
          },
        ],
      },

      // SECTION 5: WHAT YOU CAN DO
      {
        blockType: 'productShowcase',
        blockName: 'Use cases',
        badge: 'Capabilities',
        title: 'One platform, dozens of use cases',
        layout: 'alternating',
        items: [
          {
            title: 'Centralize your enterprise knowledge',
            description:
              'Transform your scattered documents into an intelligent knowledge base. Connect your sources (Drive, SharePoint, Notion, emails...), the platform automatically indexes and structures your content.',
            icon: 'brain',
            features: [
              { text: 'Every answer cites its sources' },
              { text: 'Updates synchronized automatically' },
              { text: 'Source access rights respected' },
            ],
          },
          {
            title: 'Deploy business assistants',
            description:
              'Create specialized AI assistants for each function: HR, Support, Sales, Quality, Training. Each assistant has a defined data scope and specific business instructions.',
            icon: 'users',
            features: [
              { text: 'Defined data perimeter' },
              { text: 'Specific business instructions' },
              { text: 'Own permissions and limits' },
            ],
          },
          {
            title: 'Choose your AI models',
            description:
              'Keep your freedom of choice. Use multiple models based on needs and data sensitivity. If a provider changes their terms, you switch without rebuilding.',
            icon: 'layers',
            features: [
              { text: 'No vendor lock-in' },
              { text: 'Optimized quality/cost ratio' },
              { text: 'Built-in reversibility' },
            ],
          },
          {
            title: 'Connect your existing tools',
            description:
              'AI accesses your real data, where it lives. Google Drive, Microsoft SharePoint, OneDrive, Teams, Notion, Confluence, Slack, Salesforce, HubSpot, call analysis tools.',
            icon: 'cloud',
            features: [
              { text: 'Secure OAuth2 authentication' },
              { text: 'Incremental synchronization' },
              { text: 'Encrypted, revocable tokens' },
            ],
          },
        ],
      },

      // SECTION 6: DEPLOYMENT MODES
      {
        blockType: 'productShowcase',
        blockName: 'Deployment',
        badge: 'Options',
        title: 'Three formulas to adapt to your constraints',
        layout: 'grid',
        items: [
          {
            title: 'Cloud Formula',
            description:
              'To get started quickly with a secure framework. Service within 48 hours. Hosting on French infrastructure. Automatic updates.',
            icon: 'cloud',
            features: [
              { text: 'Isolated data' },
              { text: 'Support included' },
              { text: 'Ideal for SMBs/startups' },
            ],
          },
          {
            title: 'Dedicated Formula',
            description:
              'For organizations that want more guarantees. Server dedicated to your organization. Custom subdomain. Availability commitment (SLA).',
            icon: 'database',
            features: [
              { text: 'Dedicated infrastructure' },
              { text: 'Isolated database' },
              { text: 'Ideal for mid-size/enterprise' },
            ],
          },
          {
            title: 'On-Premise Formula',
            description:
              'For complete end-to-end control. Installation on your own servers. Can operate without external connection (air-gap). AI models run locally.',
            icon: 'lock',
            features: [
              { text: 'No data leaves your perimeter' },
              { text: 'On-site audits possible' },
              { text: 'Ideal for defense/banking/healthcare' },
            ],
          },
        ],
      },

      // SECTION 7: COMPLIANCE
      {
        blockType: 'statsSection',
        blockName: 'Compliance',
        badge: 'Compliance',
        title: 'Designed for the most demanding sectors',
        description: 'SUPERFASTTT meets the strictest regulatory requirements.',
        variant: 'cards',
        columns: '4',
        stats: [
          {
            value: 'GDPR',
            label: 'Compliant',
            description:
              'France/Europe hosting. No transfer outside EU. Right to erasure built-in.',
          },
          {
            value: 'HIPAA',
            label: 'Compatible',
            description:
              'Architecture compatible with health data hosting. Total isolation of patient data.',
          },
          {
            value: 'SOC 2',
            label: 'Ready',
            description: 'Audit logs preserved. Strict environment separation. RBAC controls.',
          },
          {
            value: 'Air-Gap',
            label: 'Available',
            description: 'Air-gap deployment available. No dependency on foreign services.',
          },
        ],
      },

      // SECTION 8: USE CASES BY DEPARTMENT
      {
        blockType: 'sectorCards',
        blockName: 'Use cases',
        badge: 'By department',
        title: 'AI serving every department',
        sectors: [
          {
            icon: 'briefcase',
            title: 'Executive Leadership',
            description:
              'Automatic synthesis of reports and meeting notes. Strategic assistant with access to key indicators. Competitive intelligence on your document sources.',
            features: [{ text: 'Faster decisions' }, { text: 'Better documented' }],
          },
          {
            icon: 'heart',
            title: 'Human Resources',
            description:
              'Instant answers to employee questions. Analysis and pre-screening of applications. Personalized support for onboarding new hires.',
            features: [{ text: 'HR team freed up' }, { text: 'Recurring requests reduced' }],
          },
          {
            icon: 'building',
            title: 'Customer Relations',
            description:
              'Chatbot that answers with your product documentation. Intelligent escalation to the right experts. Response suggestions for advisors.',
            features: [
              { text: 'Improved customer satisfaction' },
              { text: 'Reduced response time' },
            ],
          },
          {
            icon: 'banknote',
            title: 'Finance and Compliance',
            description:
              'Instant search in contracts and regulations. Anomaly detection in data. Automation of periodic reporting.',
            features: [{ text: 'Less risk' }, { text: 'More time for analysis' }],
          },
          {
            icon: 'factory',
            title: 'Manufacturing and Quality',
            description:
              'Technical documentation queryable in natural language. Support for maintenance and diagnostics. Incident analysis and knowledge capture.',
            features: [{ text: 'Expertise accessible to all' }, { text: 'Reduced errors' }],
          },
          {
            icon: 'scale',
            title: 'Sales',
            description:
              'Client brief generated before each meeting. Sales call analysis. AI-assisted commercial proposals. CRM enrichment by AI.',
            features: [{ text: 'Better prepared salespeople' }, { text: 'Shorter sales cycles' }],
          },
        ],
      },

      // SECTION 9: INTEGRATION WITH YOUR IT
      {
        blockType: 'featureGrid',
        blockName: 'Integration',
        badge: 'Technical',
        title: 'Integrates naturally with your environment',
        columns: '3',
        features: [
          {
            icon: 'settings',
            title: 'For your IT teams',
            description:
              'Complete administration interface. RBAC rights management. Connection to your directory (SSO Azure AD, Google Workspace). Usage and cost monitoring.',
          },
          {
            icon: 'code',
            title: 'For your developers',
            description:
              'Documented API for all features. SDK to create your own integrations. Webhooks for event-driven automations.',
          },
          {
            icon: 'users',
            title: 'For your users',
            description:
              'Simple interface, accessible without training. Assistants integrable into their daily tools. Contextual, sourced responses.',
          },
        ],
      },

      // SECTION 10: OUR COMMITMENT
      {
        blockType: 'featureGrid',
        blockName: 'Commitment',
        badge: 'Our vision',
        title: 'A European vision of enterprise AI',
        description:
          "SUPERFASTTT is developed by Matsiya, a French team convinced that artificial intelligence should serve the enterprise without endangering it. AI isn't reserved for tech giants.",
        columns: '2',
        features: [
          {
            icon: 'globe',
            title: 'Open standards',
            description: 'No proprietary formats. Built-in reversibility, no forced dependency.',
          },
          {
            icon: 'shield',
            title: 'Total transparency',
            description:
              'Transparency on architecture and data flows. Human support, not unanswered tickets.',
          },
        ],
      },

      // SECTION 11: FINAL CTA
      {
        blockType: 'ctaModern',
        blockName: 'Final CTA',
        title: 'Ready to take back control?',
        description:
          'Discover how SUPERFASTTT can adapt to your context, constraints, and objectives. Demo on your real use cases. Free compliance assessment. Deployment support. No commitment.',
        variant: 'gradient',
        links: [
          {
            link: {
              type: 'custom',
              appearance: 'default',
              label: 'Request a personalized demo',
              url: '/contact',
            },
          },
          {
            link: {
              type: 'custom',
              appearance: 'outline',
              label: 'Get the full presentation',
              url: '/presentation',
            },
          },
        ],
      },
    ],
    meta: {
      title: 'SUPERFASTTT - Sovereign AI Platform for European Enterprises',
      description:
        'Deploy artificial intelligence in your enterprise while maintaining full control. France/Europe hosting, native GDPR compliance, auditable governance, integration with your existing tools.',
    },
  } as RequiredDataFromCollectionSlug<'pages'>
}

async function seedOverviewEN() {
  console.log('🚀 Starting update of "Overview" page SUPERFASTTT (EN)...')

  const payload = await getPayload({ config: configPromise })

  const overviewData = getOverviewData()

  try {
    // Update page with specified ID
    console.log(`📝 Updating page (ID: ${PAGE_ID})...`)

    await payload.update({
      collection: 'pages',
      id: PAGE_ID,
      data: overviewData,
      locale: 'en',
      context: {
        disableRevalidate: true,
      },
    })

    console.log('✅ "Overview" page updated successfully!')
  } catch (error) {
    // If ID doesn't exist, try to find by slug or create
    console.log('⚠️ Page not found by ID, searching by slug...')

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
      console.log(`📝 Updating existing page (ID: ${existingPage.id})...`)

      await payload.update({
        collection: 'pages',
        id: existingPage.id,
        data: overviewData,
        locale: 'en',
        context: {
          disableRevalidate: true,
        },
      })

      console.log('✅ "Overview" page updated successfully!')
    } else {
      console.log('📄 Creating "Overview" page...')

      await payload.create({
        collection: 'pages',
        data: overviewData,
        locale: 'en',
        context: {
          disableRevalidate: true,
        },
      })

      console.log('✅ "Overview" page created successfully!')
    }
  }

  console.log('\n📋 "Overview" page content (based on vue-ensemble.md v3 - EN):')
  console.log('   - HeroModern: Take back control of your artificial intelligence')
  console.log('   - FeatureGrid: Problem (3 key questions)')
  console.log('   - FeatureGrid: Our answer (integration without replacement)')
  console.log(
    '   - FeatureGrid: The 4 pillars (sovereignty, control, governance, interoperability)',
  )
  console.log('   - ProductShowcase: Use cases (knowledge, assistants, models, connectors)')
  console.log('   - ProductShowcase: Deployment (Cloud, Dedicated, On-Premise)')
  console.log('   - StatsSection: Compliance (GDPR, HIPAA, SOC 2, Air-Gap)')
  console.log('   - SectorCards: Use cases by department (6 departments)')
  console.log('   - FeatureGrid: Integration (IT, developers, users)')
  console.log('   - FeatureGrid: Our commitment (European vision)')
  console.log('   - CtaModern: Ready to take back control?')
  console.log('\n🌐 Access the page: http://localhost:3007/en/overview')
  console.log('🔧 Admin: http://localhost:3007/admin/collections/pages/' + PAGE_ID)

  process.exit(0)
}

seedOverviewEN().catch((error) => {
  console.error('❌ Error during update:', error)
  process.exit(1)
})
