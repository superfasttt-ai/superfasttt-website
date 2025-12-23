#!/usr/bin/env tsx
/**
 * Preview Brief Command
 * Preview product brief and taxonomy details before generation
 *
 * Usage:
 *   pnpm content:preview                     # Show product brief summary
 *   pnpm content:preview --full              # Show full product brief
 *   pnpm content:preview --service=rag       # Preview service brief
 *   pnpm content:preview --industry=sante    # Preview industry brief
 *   pnpm content:preview --metier=dsi        # Preview metier brief
 *   pnpm content:preview --competitor=microsoft-copilot  # Preview competitor
 *   pnpm content:preview --prompt=service    # Show prompt template
 */

import { getProductBriefForPrompt, productBrief } from '../briefs/product-brief'
import { getPromptLoader } from '../ai/prompt-loader'
import {
  getServiceById,
  getIndustryById,
  getMetierById,
  getCompetitorById,
  services,
  industries,
  metiers,
  competitors,
} from '../taxonomy'
import type { Locale } from '../types'

async function main() {
  const args = process.argv.slice(2)

  // Parse arguments
  const showFull = args.includes('--full')
  const serviceArg = args.find((a) => a.startsWith('--service='))
  const industryArg = args.find((a) => a.startsWith('--industry='))
  const metierArg = args.find((a) => a.startsWith('--metier='))
  const competitorArg = args.find((a) => a.startsWith('--competitor='))
  const promptArg = args.find((a) => a.startsWith('--prompt='))
  const localeArg = args.find((a) => a.startsWith('--locale='))

  const locale: Locale = (localeArg?.split('=')[1] as Locale) || 'fr'

  console.log('\n📋 Content Pipeline - Preview')
  console.log('═══════════════════════════════════════\n')

  // Show specific service
  if (serviceArg) {
    const searchTerm = serviceArg.split('=')[1]
    const service = services.find(
      (s) => s.id.includes(searchTerm) || s.slug.fr.includes(searchTerm),
    )

    if (!service) {
      console.log(`❌ Service not found: ${searchTerm}`)
      console.log('\nAvailable services:')
      services.forEach((s) => console.log(`  - ${s.id}`))
      return
    }

    console.log(`📦 SERVICE: ${service.title[locale]}`)
    console.log('───────────────────────────────────────')
    console.log(`ID: ${service.id}`)
    console.log(`Slug: ${service.slug[locale]}`)
    console.log(`Priority: ${service.priority}`)
    console.log(`Batch: ${service.batch}`)
    console.log(`Parent: ${service.parentId || 'none'}`)
    console.log(`\nDescription:`)
    console.log(`  ${service.description[locale]}`)
    console.log(`\nSEO Keywords:`)
    console.log(`  ${service.seoKeywords[locale]}`)
    console.log(`\nUse Cases:`)
    service.useCases.forEach((uc) => console.log(`  • ${uc}`))
    console.log(`\nBenefits:`)
    service.benefits.forEach((b) => console.log(`  • ${b}`))
    console.log(`\nTarget Audiences:`)
    service.targetAudiences.forEach((ta) => console.log(`  • ${ta}`))
    return
  }

  // Show specific industry
  if (industryArg) {
    const searchTerm = industryArg.split('=')[1]
    const industry = industries.find(
      (i) => i.id.includes(searchTerm) || i.slug.fr.includes(searchTerm),
    )

    if (!industry) {
      console.log(`❌ Industry not found: ${searchTerm}`)
      console.log('\nAvailable industries:')
      industries.forEach((i) => console.log(`  - ${i.id}`))
      return
    }

    console.log(`🏭 INDUSTRY: ${industry.title[locale]}`)
    console.log('───────────────────────────────────────')
    console.log(`ID: ${industry.id}`)
    console.log(`Slug: ${industry.slug[locale]}`)
    console.log(`Priority: ${industry.priority}`)
    console.log(`Batch: ${industry.batch}`)
    console.log(`\nDescription:`)
    console.log(`  ${industry.description[locale]}`)
    console.log(`\nSEO Keywords:`)
    console.log(`  ${industry.seoKeywords[locale]}`)
    console.log(`\nChallenges:`)
    industry.challenges.forEach((c) => console.log(`  • ${c}`))
    console.log(`\nRegulations:`)
    industry.regulations.forEach((r) => console.log(`  • ${r}`))
    console.log(`\nCertifications:`)
    industry.certifications.forEach((c) => console.log(`  • ${c}`))
    return
  }

  // Show specific metier
  if (metierArg) {
    const searchTerm = metierArg.split('=')[1]
    const metier = metiers.find((m) => m.id.includes(searchTerm) || m.slug.fr.includes(searchTerm))

    if (!metier) {
      console.log(`❌ Metier not found: ${searchTerm}`)
      console.log('\nAvailable metiers:')
      metiers.forEach((m) => console.log(`  - ${m.id}`))
      return
    }

    console.log(`👔 METIER: ${metier.title[locale]}`)
    console.log('───────────────────────────────────────')
    console.log(`ID: ${metier.id}`)
    console.log(`Slug: ${metier.slug[locale]}`)
    console.log(`Priority: ${metier.priority}`)
    console.log(`Batch: ${metier.batch}`)
    console.log(`\nDescription:`)
    console.log(`  ${metier.description[locale]}`)
    console.log(`\nSEO Keywords:`)
    console.log(`  ${metier.seoKeywords[locale]}`)
    console.log(`\nPain Points:`)
    metier.painPoints.forEach((pp) => console.log(`  • ${pp}`))
    console.log(`\nSolutions:`)
    metier.solutions.forEach((s) => console.log(`  • ${s}`))
    console.log(`\nKPIs:`)
    metier.kpis.forEach((k) => console.log(`  • ${k}`))
    return
  }

  // Show specific competitor
  if (competitorArg) {
    const searchTerm = competitorArg.split('=')[1]
    const competitor = competitors.find((c) => c.id.includes(searchTerm))

    if (!competitor) {
      console.log(`❌ Competitor not found: ${searchTerm}`)
      console.log('\nAvailable competitors:')
      competitors.forEach((c) => console.log(`  - ${c.id}: ${c.name}`))
      return
    }

    console.log(`⚔️  COMPETITOR: ${competitor.name}`)
    console.log('───────────────────────────────────────')
    console.log(`ID: ${competitor.id}`)
    console.log(`Category: ${competitor.category}`)
    console.log(`Website: ${competitor.website}`)
    console.log(`Pricing: ${competitor.pricing}`)
    console.log(`Sovereignty: ${competitor.sovereignty}`)
    console.log(`Deployment: ${competitor.deployment.join(', ')}`)
    console.log(`\nStrengths:`)
    competitor.strengths.forEach((s) => console.log(`  ✅ ${s[locale]}`))
    console.log(`\nWeaknesses:`)
    competitor.weaknesses.forEach((w) => console.log(`  ❌ ${w[locale]}`))
    console.log(`\nCertifications: ${competitor.certifications.join(', ')}`)
    console.log(`Target Audience: ${competitor.targetAudience.join(', ')}`)
    return
  }

  // Show prompt template
  if (promptArg) {
    const promptType = promptArg.split('=')[1] as
      | 'service'
      | 'industry'
      | 'metier'
      | 'comparison'
      | 'blog-post'
    const loader = getPromptLoader()

    try {
      console.log(`📝 PROMPT TEMPLATE: ${promptType}-page.md`)
      console.log('───────────────────────────────────────\n')

      const prompt = await loader.loadPagePrompt(promptType, {
        productBrief: '[PRODUCT BRIEF]',
        serviceName: '[SERVICE NAME]',
        serviceDescription: '[SERVICE DESCRIPTION]',
        serviceCategory: '[CATEGORY]',
        industryName: '[INDUSTRY NAME]',
        industryDescription: '[INDUSTRY DESCRIPTION]',
        metierName: '[METIER NAME]',
        metierDescription: '[METIER DESCRIPTION]',
        seoKeywords: '[SEO KEYWORDS]',
        relatedPages: '[RELATED PAGES]',
        regulations: '[REGULATIONS]',
        certifications: '[CERTIFICATIONS]',
        painPoints: '[PAIN POINTS]',
        kpis: '[KPIS]',
      })

      console.log(prompt)
    } catch (error) {
      console.log(`❌ Prompt not found: ${promptType}`)
      console.log('\nAvailable prompts: service, industry, metier, comparison, blog-post')
    }
    return
  }

  // Default: Show product brief
  if (showFull) {
    console.log('🏢 PRODUCT BRIEF (Full)')
    console.log('───────────────────────────────────────\n')
    console.log(JSON.stringify(productBrief, null, 2))
  } else {
    console.log('🏢 PRODUCT BRIEF (Summary)')
    console.log('───────────────────────────────────────\n')

    console.log(`Company: ${productBrief.companyName}`)
    console.log(`Tagline: ${productBrief.tagline[locale]}`)
    console.log(`\nValue Proposition:`)
    console.log(`  ${productBrief.valueProposition[locale]}`)

    console.log(`\n📊 PILLARS (${productBrief.pillars.length}):`)
    productBrief.pillars.forEach((p) => {
      console.log(`  • ${p.title[locale]}: ${p.description[locale].substring(0, 80)}...`)
    })

    console.log(`\n⚙️  FEATURES (${productBrief.features.length}):`)
    const categories = [...new Set(productBrief.features.map((f) => f.category))]
    categories.forEach((cat) => {
      const features = productBrief.features.filter((f) => f.category === cat)
      console.log(`  ${cat}: ${features.map((f) => f.name[locale]).join(', ')}`)
    })

    console.log(`\n✅ COMPLIANCE (${productBrief.compliance.length}):`)
    productBrief.compliance.forEach((c) => {
      console.log(`  • ${c.name} (${c.status})`)
    })

    console.log(`\n🚀 DEPLOYMENT OPTIONS (${productBrief.deploymentOptions.length}):`)
    productBrief.deploymentOptions.forEach((d) => {
      console.log(`  • ${d.title[locale]}`)
    })

    console.log(`\n🎯 TARGET AUDIENCES:`)
    productBrief.targetAudiences.forEach((ta) => {
      console.log(`  • ${ta}`)
    })

    console.log(`\n💻 TECH STACK:`)
    console.log(`  ${productBrief.stack.join(', ')}`)
  }

  console.log('\n───────────────────────────────────────')
  console.log('Options:')
  console.log('  --full                    Show full product brief JSON')
  console.log('  --service=<id>            Preview specific service')
  console.log('  --industry=<id>           Preview specific industry')
  console.log('  --metier=<id>             Preview specific metier')
  console.log('  --competitor=<id>         Preview specific competitor')
  console.log('  --prompt=<type>           Show prompt template')
  console.log('  --locale=<fr|en|es>       Set locale (default: fr)')
  console.log('')
}

main()
