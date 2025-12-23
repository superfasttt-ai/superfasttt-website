/**
 * Content Pipeline Configuration
 */

import type { Locale, Priority } from './types'

export interface ContentPipelineConfig {
  anthropic: {
    apiKey: string
    model: string
    maxTokens: number
    rateLimitPerMinute: number
  }
  serper: {
    apiKey: string
    baseUrl: string
    defaultCountry: string
    defaultLanguage: string
    cacheExpirationDays: number
  }
  generation: {
    defaultLocales: Locale[]
    defaultPriority: Priority
    asDraft: boolean
    includeResearch: boolean
    generateImageBriefs: boolean
  }
  paths: {
    prompts: string
    registry: string
    cache: string
    imageBriefs: string
  }
}

function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name]
  if (!value && defaultValue === undefined) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value || defaultValue || ''
}

function getOptionalEnvVar(name: string, defaultValue: string): string {
  return process.env[name] || defaultValue
}

export const config: ContentPipelineConfig = {
  anthropic: {
    apiKey: getEnvVar('ANTHROPIC_API_KEY', ''),
    model: getOptionalEnvVar('ANTHROPIC_MODEL', 'claude-sonnet-4-20250514'),
    maxTokens: parseInt(getOptionalEnvVar('ANTHROPIC_MAX_TOKENS', '4096'), 10),
    rateLimitPerMinute: parseInt(getOptionalEnvVar('ANTHROPIC_RATE_LIMIT', '50'), 10),
  },
  serper: {
    apiKey: getEnvVar('SERPER_API_KEY', ''),
    baseUrl: 'https://google.serper.dev',
    defaultCountry: 'fr',
    defaultLanguage: 'fr',
    cacheExpirationDays: 7,
  },
  generation: {
    defaultLocales: ['fr', 'en', 'es'],
    defaultPriority: 'normal',
    asDraft: true,
    includeResearch: true,
    generateImageBriefs: true,
  },
  paths: {
    prompts: 'src/scripts/content-pipeline/prompts',
    registry: 'src/scripts/content-pipeline/registry',
    cache: 'src/scripts/content-pipeline/cache',
    imageBriefs: 'src/scripts/content-pipeline/registry/image-briefs.json',
  },
}

// Validate configuration
export function validateConfig(): void {
  const errors: string[] = []

  if (!config.anthropic.apiKey) {
    errors.push('ANTHROPIC_API_KEY is required')
  }

  if (errors.length > 0) {
    console.warn('⚠️  Configuration warnings:')
    errors.forEach((error) => console.warn(`   - ${error}`))
  }
}

// Export individual configs for convenience
export const anthropicConfig = config.anthropic
export const serperConfig = config.serper
export const generationConfig = config.generation
export const pathsConfig = config.paths
