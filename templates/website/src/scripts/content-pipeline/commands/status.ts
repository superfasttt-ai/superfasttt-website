#!/usr/bin/env tsx
/**
 * Status Command
 * Show current generation progress
 *
 * Usage:
 *   pnpm content:status
 */

import { createPipeline } from '../index'

async function main() {
  try {
    const pipeline = await createPipeline()
    await pipeline.status()
  } catch (error) {
    console.error('❌ Failed to get status:', error)
    process.exit(1)
  }
}

main()
