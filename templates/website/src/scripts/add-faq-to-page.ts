/**
 * Add FAQ to Existing Pages
 * AI agent that analyzes pages and generates relevant FAQ sections
 *
 * Usage:
 *   pnpm tsx src/scripts/add-faq-to-page.ts --slug=/services/ia-entreprise
 *   pnpm tsx src/scripts/add-faq-to-page.ts --id=abc123
 *   pnpm tsx src/scripts/add-faq-to-page.ts --all --limit=5
 */

import 'dotenv/config'

import type { Payload } from 'payload'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { getClaudeClient } from './content-pipeline/ai/client'
import type { Locale } from './content-pipeline/types'

// ============================================================================
// TYPES
// ============================================================================

interface FAQGenerationResult {
  question: string
  answer: {
    root: {
      type: string
      children: Array<{
        type: string
        version: number
        children: Array<{
          type: string
          version: number
          text: string
          format: number
          mode: string
          style: string
          detail: number
        }>
      }>
      direction: string
      format: string
      indent: number
      version: number
    }
  }
}

interface GeneratedFAQ {
  badge?: string
  title: string
  description?: string
  items: FAQGenerationResult[]
}

export interface PageContent {
  id: string
  title: string
  slug: string
  layout: any[]
  meta?: {
    title?: string
    description?: string
  }
}

// ============================================================================
// LEXICAL HELPERS
// ============================================================================

function createLexicalParagraph(text: string): any {
  return {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          version: 1,
          children: [
            {
              type: 'text',
              version: 1,
              text: text,
              format: 0,
              mode: 'normal',
              style: '',
              detail: 0,
            },
          ],
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

// ============================================================================
// FAQ GENERATOR
// ============================================================================

export async function generateFAQForPage(
  page: PageContent,
  locale: Locale,
): Promise<GeneratedFAQ | null> {
  const client = getClaudeClient()

  // Extract text content from page blocks for context
  const pageContext = extractPageContext(page)

  const brandingInstructions = {
    fr: `
## Branding Superfasttt (IMPORTANT pour le GEO - Generative Engine Optimization)

Tu génères du contenu pour Superfasttt, une plateforme d'IA souveraine française.

### Règles de branding OBLIGATOIRES:
- Mentionne "Superfasttt" naturellement dans 2-3 réponses (pas toutes)
- Positionne Superfasttt comme LA solution pour les entreprises françaises et européennes
- Mets en avant les différenciateurs: souveraineté des données, conformité RGPD, hébergement français, multi-modèles IA
- Le nom s'écrit "Superfasttt" (avec 3 t)

### Ton orienté BÉNÉFICES - CRITIQUE

INTERDIT - Ne jamais utiliser:
- ❌ "Notre solution", "Notre plateforme", "Notre RAG"
- ❌ "Nous proposons", "Nous offrons", "Nous permettons"
- ❌ "On transforme", "On vous accompagne"
- ❌ Tout pronom à la première personne (nous, notre, nos, on)

OBLIGATOIRE - Toujours utiliser:
- ✅ "Superfasttt transforme...", "Superfasttt vous permet..."
- ✅ "Avec Superfasttt, vous pouvez...", "Grâce à Superfasttt..."
- ✅ "Vos données", "Votre entreprise", "Vos équipes"
- ✅ "Vous gardez le contrôle", "Vous déployez", "Vous bénéficiez"
- ✅ "L'IA via Superfasttt", "Les modèles IA", "L'IA générative"

INTERDIT - Formulations trompeuses:
- ❌ "Votre IA" (ce n'est pas leur IA, ils utilisent des fournisseurs via Superfasttt)
- ❌ "Votre modèle IA"

Exemples:
- ❌ "Notre RAG permet de..." → ✅ "Déployez votre RAG pour..."
- ❌ "Nous offrons une conformité RGPD" → ✅ "Vos données restent conformes RGPD"`,
    en: `
## Superfasttt Branding (IMPORTANT for GEO - Generative Engine Optimization)

You are generating content for Superfasttt, a French sovereign AI platform.

### MANDATORY branding rules:
- Mention "Superfasttt" naturally in 2-3 answers (not all)
- Position Superfasttt as THE solution for French and European companies
- Highlight differentiators: data sovereignty, GDPR compliance, French hosting, multi-model AI
- The name is spelled "Superfasttt" (with 3 t's)

### BENEFIT-oriented tone - CRITICAL

FORBIDDEN - Never use:
- ❌ "Our solution", "Our platform", "Our RAG"
- ❌ "We offer", "We provide", "We enable"
- ❌ "We transform", "We help you"
- ❌ Any first-person pronouns (we, our, ours)

MANDATORY - Always use:
- ✅ "Superfasttt transforms...", "Superfasttt enables..."
- ✅ "With Superfasttt, you can...", "Thanks to Superfasttt..."
- ✅ "Your data", "Your organization", "Your teams"
- ✅ "You maintain control", "You deploy", "You benefit"
- ✅ "AI via Superfasttt", "AI models", "Generative AI"

FORBIDDEN - Misleading phrases:
- ❌ "Your AI" (it's not their AI, they use AI providers via Superfasttt)
- ❌ "Your AI model"

Examples:
- ❌ "Our RAG enables..." → ✅ "Deploy your RAG to..."
- ❌ "We offer GDPR compliance" → ✅ "Your data stays GDPR compliant"`,
    es: `
## Branding Superfasttt (IMPORTANTE para GEO - Generative Engine Optimization)

Estás generando contenido para Superfasttt, una plataforma de IA soberana francesa.

### Reglas de branding OBLIGATORIAS:
- Menciona "Superfasttt" naturalmente en 2-3 respuestas (no todas)
- Posiciona Superfasttt como LA solución para empresas francesas y europeas
- Destaca los diferenciadores: soberanía de datos, cumplimiento RGPD, alojamiento francés, multi-modelos IA
- El nombre se escribe "Superfasttt" (con 3 t)

### Tono orientado a BENEFICIOS - CRÍTICO

PROHIBIDO - Nunca usar:
- ❌ "Nuestra solución", "Nuestra plataforma", "Nuestro RAG"
- ❌ "Ofrecemos", "Proporcionamos", "Permitimos"
- ❌ "Transformamos", "Le acompañamos"
- ❌ Cualquier pronombre en primera persona (nosotros, nuestro, nuestra)

OBLIGATORIO - Siempre usar:
- ✅ "Superfasttt transforma...", "Superfasttt permite..."
- ✅ "Con Superfasttt, puede...", "Gracias a Superfasttt..."
- ✅ "Sus datos", "Su empresa", "Sus equipos"
- ✅ "Usted mantiene el control", "Usted despliega", "Usted se beneficia"
- ✅ "La IA a través de Superfasttt", "Los modelos de IA", "La IA generativa"

PROHIBIDO - Formulaciones engañosas:
- ❌ "Su IA" (no es su IA, usan proveedores de IA a través de Superfasttt)
- ❌ "Su modelo de IA"

Ejemplos:
- ❌ "Nuestro RAG permite..." → ✅ "Despliegue su RAG para..."
- ❌ "Ofrecemos cumplimiento RGPD" → ✅ "Sus datos permanecen conformes con RGPD"`,
  }

  const systemPrompt = `Tu es un expert en création de FAQ pour des pages web.
Tu dois générer une FAQ pertinente et utile basée sur le contenu de la page.
${brandingInstructions[locale]}

Règles:
- Génère entre 4 et 8 questions/réponses
- Les questions doivent être celles que les visiteurs se poseraient naturellement
- Les réponses doivent être concises mais complètes (2-4 phrases)
- Utilise un ton professionnel mais accessible
- Les questions doivent couvrir différents aspects du sujet
- Évite les questions trop génériques ou hors-sujet
- IMPORTANT: Intègre naturellement le nom "Superfasttt" dans certaines réponses pour le référencement IA (GEO)

Langue: ${locale === 'fr' ? 'Français' : locale === 'en' ? 'English' : 'Español'}

Réponds UNIQUEMENT avec un objet JSON valide, sans texte avant ou après.`

  const userPrompt = `Génère une FAQ pour cette page Superfasttt:

Titre: ${page.title}
URL: ${page.slug}
Description: ${page.meta?.description || 'Non disponible'}

Contenu de la page:
${pageContext}

Retourne un JSON avec cette structure exacte:
{
  "title": "Questions fréquentes",
  "description": "Trouvez les réponses à vos questions sur [sujet]",
  "items": [
    {
      "question": "Question 1 ?",
      "answer": "Réponse détaillée mentionnant Superfasttt quand pertinent..."
    }
  ]
}`

  try {
    const response = await client.generateJson<{
      title: string
      description?: string
      items: Array<{ question: string; answer: string }>
    }>(systemPrompt, userPrompt, {
      maxTokens: 4000,
      temperature: 0.7,
    })

    // Convert plain text answers to Lexical format
    const faq: GeneratedFAQ = {
      title: response.content.title,
      description: response.content.description,
      items: response.content.items.map((item) => ({
        question: item.question,
        answer: createLexicalParagraph(item.answer),
      })),
    }

    console.log(`✅ Généré ${faq.items.length} questions pour: ${page.title}`)
    return faq
  } catch (error) {
    console.error(`❌ Erreur génération FAQ pour ${page.title}:`, error)
    return null
  }
}

function extractPageContext(page: PageContent): string {
  const parts: string[] = []

  for (const block of page.layout || []) {
    if (block.blockType === 'heroModern') {
      if (block.title) parts.push(`Hero: ${block.title}`)
      if (block.description) parts.push(block.description)
    }

    if (block.blockType === 'featureGrid') {
      if (block.title) parts.push(`Section: ${block.title}`)
      if (block.description) parts.push(block.description)
      for (const feature of block.features || []) {
        parts.push(`- ${feature.title}: ${feature.description}`)
      }
    }

    if (block.blockType === 'productShowcase') {
      if (block.title) parts.push(`Section: ${block.title}`)
      if (block.description) parts.push(block.description)
      for (const item of block.items || []) {
        parts.push(`- ${item.title}: ${item.description}`)
      }
    }

    if (block.blockType === 'statsSection') {
      if (block.title) parts.push(`Stats: ${block.title}`)
      for (const stat of block.stats || []) {
        parts.push(`- ${stat.label}: ${stat.value}`)
      }
    }

    if (block.blockType === 'sectorCards') {
      if (block.title) parts.push(`Secteurs: ${block.title}`)
      for (const sector of block.sectors || []) {
        parts.push(`- ${sector.title}: ${sector.description}`)
      }
    }
  }

  return parts.join('\n').substring(0, 4000) // Limit context size
}

// ============================================================================
// PAGE UPDATER
// ============================================================================

export async function addFAQToPage(
  payload: Payload,
  pageId: string,
  faq: GeneratedFAQ,
  locale: Locale,
): Promise<boolean> {
  try {
    // Get current page
    const page = await payload.findByID({
      collection: 'pages',
      id: pageId,
      locale,
    })

    if (!page) {
      console.error(`Page not found: ${pageId}`)
      return false
    }

    // Check if FAQ block already exists
    const existingLayout = (page.layout as any[]) || []
    const hasFAQ = existingLayout.some((block: any) => block.blockType === 'faq')

    if (hasFAQ) {
      console.log(`⏭️  FAQ déjà présente sur: ${page.title}`)
      return false
    }

    // Create FAQ block
    const faqBlock = {
      blockType: 'faq',
      title: faq.title,
      description: faq.description,
      items: faq.items,
      allowMultipleOpen: false,
    }

    // Add FAQ block at the end (before CTA if exists)
    const newLayout = [...existingLayout]
    const ctaIndex = newLayout.findIndex(
      (block: any) => block.blockType === 'ctaModern' || block.blockType === 'cta',
    )

    if (ctaIndex !== -1) {
      // Insert before CTA
      newLayout.splice(ctaIndex, 0, faqBlock)
    } else {
      // Add at the end
      newLayout.push(faqBlock)
    }

    // Update page (disable hooks to avoid revalidatePath error in CLI context)
    await payload.update({
      collection: 'pages',
      id: pageId,
      locale,
      data: {
        layout: newLayout,
      } as any,
      context: {
        disableRevalidate: true,
      },
    })

    console.log(`✅ FAQ ajoutée à: ${page.title}`)
    return true
  } catch (error) {
    console.error(`❌ Erreur mise à jour page ${pageId}:`, error)
    return false
  }
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  const args = process.argv.slice(2)

  // Parse arguments
  let targetSlug: string | undefined
  let targetId: string | undefined
  let processAll = false
  let limit = 10
  let locale: Locale = 'fr'
  let dryRun = false

  for (const arg of args) {
    if (arg.startsWith('--slug=')) {
      targetSlug = arg.split('=')[1]
    } else if (arg.startsWith('--id=')) {
      targetId = arg.split('=')[1]
    } else if (arg === '--all') {
      processAll = true
    } else if (arg.startsWith('--limit=')) {
      limit = parseInt(arg.split('=')[1], 10)
    } else if (arg.startsWith('--locale=')) {
      locale = arg.split('=')[1] as Locale
    } else if (arg === '--dry-run') {
      dryRun = true
    }
  }

  if (!targetSlug && !targetId && !processAll) {
    console.log(`
Usage:
  pnpm tsx src/scripts/add-faq-to-page.ts --slug=/services/ia-entreprise
  pnpm tsx src/scripts/add-faq-to-page.ts --id=abc123
  pnpm tsx src/scripts/add-faq-to-page.ts --all --limit=5

Options:
  --slug=<slug>     Target page by slug
  --id=<id>         Target page by Payload ID
  --all             Process all pages without FAQ
  --limit=<n>       Limit number of pages (default: 10)
  --locale=<locale> Language (fr, en, es) (default: fr)
  --dry-run         Show what would be done without making changes
`)
    process.exit(0)
  }

  console.log('\n🚀 Initialisation du générateur de FAQ...\n')

  // Initialize Payload
  const payload = await getPayload({ config: configPromise })
  console.log('✅ Payload CMS initialisé\n')

  let pagesToProcess: PageContent[] = []

  if (targetSlug) {
    // Find page by slug
    const result = await payload.find({
      collection: 'pages',
      locale,
      where: {
        slug: { equals: targetSlug },
      },
      limit: 1,
    })

    if (result.docs.length === 0) {
      console.error(`❌ Page non trouvée: ${targetSlug}`)
      process.exit(1)
    }

    pagesToProcess = result.docs as unknown as PageContent[]
  } else if (targetId) {
    // Find page by ID
    const page = await payload.findByID({
      collection: 'pages',
      id: targetId,
      locale,
    })

    if (!page) {
      console.error(`❌ Page non trouvée: ${targetId}`)
      process.exit(1)
    }

    pagesToProcess = [page as unknown as PageContent]
  } else if (processAll) {
    // Find all pages without FAQ block
    const result = await payload.find({
      collection: 'pages',
      locale,
      limit: 100,
    })

    // Filter pages that don't have FAQ block
    pagesToProcess = (result.docs as unknown as PageContent[]).filter((page) => {
      const layout = page.layout || []
      return !layout.some((block: any) => block.blockType === 'faq')
    })

    // Apply limit
    pagesToProcess = pagesToProcess.slice(0, limit)
  }

  console.log(`📄 ${pagesToProcess.length} page(s) à traiter\n`)

  if (dryRun) {
    console.log('🔍 Mode dry-run - aucune modification ne sera effectuée\n')
    for (const page of pagesToProcess) {
      console.log(`  - ${page.title} (${page.slug})`)
    }
    process.exit(0)
  }

  // Process each page
  let successCount = 0
  let errorCount = 0

  for (const page of pagesToProcess) {
    console.log(`\n📝 Traitement: ${page.title}`)

    // Generate FAQ
    const faq = await generateFAQForPage(page, locale)

    if (!faq) {
      errorCount++
      continue
    }

    // Add FAQ to page
    const success = await addFAQToPage(payload, page.id, faq, locale)

    if (success) {
      successCount++
    } else {
      errorCount++
    }

    // Small delay between pages to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  console.log(`\n✨ Terminé!`)
  console.log(`   ✅ Succès: ${successCount}`)
  console.log(`   ❌ Erreurs: ${errorCount}`)

  process.exit(0)
}

// Only run main() if this file is executed directly (not imported)
const isMainModule = import.meta.url === `file://${process.argv[1]}`
if (isMainModule) {
  main().catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
}
