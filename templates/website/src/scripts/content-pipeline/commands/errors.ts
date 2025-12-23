#!/usr/bin/env tsx
/**
 * Errors Command
 * Show and manage generation errors
 *
 * Usage:
 *   pnpm content:errors          # Show all errors
 *   pnpm content:errors --reset  # Reset errors to pending for retry
 */

import { createPipeline } from '../index'

async function main() {
  const args = process.argv.slice(2)
  const shouldReset = args.includes('--reset')

  try {
    const pipeline = await createPipeline()

    if (shouldReset) {
      await pipeline.resetErrors()
    } else {
      await pipeline.showErrors()
    }
  } catch (error) {
    console.error('❌ Failed:', error)
    process.exit(1)
  }
}

main()
