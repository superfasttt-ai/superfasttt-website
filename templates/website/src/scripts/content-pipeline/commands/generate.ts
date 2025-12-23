#!/usr/bin/env tsx
/**
 * Generate Content Command
 * Main command to generate content via the pipeline
 *
 * Usage:
 *   pnpm content:generate                        # Generate next 10 pending pages (FR only)
 *   pnpm content:generate --all-locales          # Generate for all languages
 *   pnpm content:generate --type=service         # Generate only services
 *   pnpm content:generate --batch=1              # Generate batch 1 only
 *   pnpm content:generate --priority=high        # Generate high priority only
 *   pnpm content:generate --id=service-rag       # Generate specific page
 *   pnpm content:generate --limit=5              # Limit to 5 pages
 *   pnpm content:generate --dry-run              # Preview what would be generated
 *   pnpm content:generate --no-research          # Skip Serper.dev research
 *   pnpm content:generate --no-images            # Skip image brief generation
 */

import 'dotenv/config'

import { createPipeline, parseArgs } from '../index'

async function main() {
  const args = process.argv.slice(2)
  const options = parseArgs(args)

  console.log('\n🎯 Content Generation')
  console.log('═══════════════════════════════════════')
  console.log(`Locales: ${options.locales?.join(', ')}`)
  if (options.types) console.log(`Types: ${options.types.join(', ')}`)
  if (options.batch !== undefined) console.log(`Batch: ${options.batch}`)
  if (options.priority) console.log(`Priority: ${options.priority}`)
  if (options.ids) console.log(`IDs: ${options.ids.join(', ')}`)
  console.log(`Limit: ${options.limit || 10}`)
  console.log(`Dry run: ${options.dryRun ? 'yes' : 'no'}`)
  console.log(`Include research: ${options.includeResearch ? 'yes' : 'no'}`)
  console.log(`Generate images: ${options.generateImageBriefs ? 'yes' : 'no'}`)
  console.log('═══════════════════════════════════════\n')

  try {
    const pipeline = await createPipeline()

    const results = await pipeline.generate({
      locales: options.locales || ['fr'],
      types: options.types,
      ids: options.ids,
      batch: options.batch,
      priority: options.priority,
      limit: options.limit || 10,
      dryRun: options.dryRun || false,
      asDraft: options.asDraft ?? true,
      includeResearch: options.includeResearch ?? true,
      generateImageBriefs: options.generateImageBriefs ?? true,
    })

    console.log('\n═══════════════════════════════════════')
    console.log(`✅ Generation complete: ${results.length} pages generated`)

    if (results.length > 0) {
      const totalDuration = results.reduce((sum, r) => sum + (r.duration || 0), 0)
      console.log(`⏱️  Total time: ${Math.round(totalDuration / 1000)}s`)
      console.log(`📊 Average: ${Math.round(totalDuration / results.length / 1000)}s per page`)
    }

    // Show status
    await pipeline.status()
  } catch (error) {
    console.error('\n❌ Generation failed:', error)
    process.exit(1)
  }
}

main()
