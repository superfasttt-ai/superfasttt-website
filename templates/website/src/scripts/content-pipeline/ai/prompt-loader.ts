/**
 * Prompt Loader
 * Loads and interpolates prompts from .md files
 */

import fs from 'fs/promises'
import path from 'path'

import { pathsConfig } from '../config'
import type { Locale } from '../types'

// ============================================================================
// TYPES
// ============================================================================

export interface PromptVariables {
  [key: string]: string | undefined
}

export interface LoadedPrompt {
  content: string
  path: string
}

// ============================================================================
// PROMPT LOADER
// ============================================================================

export class PromptLoader {
  private promptsDir: string
  private cache: Map<string, string> = new Map()

  constructor(promptsDir?: string) {
    this.promptsDir = promptsDir || path.resolve(process.cwd(), pathsConfig.prompts)
  }

  /**
   * Load a prompt from a file and interpolate variables
   */
  async loadPrompt(promptPath: string, variables: PromptVariables = {}): Promise<string> {
    const fullPath = path.join(this.promptsDir, promptPath)

    // Check cache first
    let template = this.cache.get(fullPath)
    if (!template) {
      try {
        template = await fs.readFile(fullPath, 'utf-8')
        this.cache.set(fullPath, template)
      } catch (error) {
        throw new Error(`Failed to load prompt from ${fullPath}: ${error}`)
      }
    }

    return this.interpolate(template, variables)
  }

  /**
   * Load the base system prompt
   */
  async loadSystemPrompt(locale: Locale = 'fr'): Promise<string> {
    const basePrompt = await this.loadPrompt('system/base.md')
    const tonePrompt = await this.loadPrompt(`system/tone-${locale}.md`)

    return `${basePrompt}\n\n${tonePrompt}`
  }

  /**
   * Load a page template prompt
   */
  async loadPagePrompt(
    pageType: 'service' | 'industry' | 'metier' | 'comparison' | 'blog-post',
    variables: PromptVariables = {},
  ): Promise<string> {
    const promptFile = `pages/${pageType}-page.md`
    return this.loadPrompt(promptFile, variables)
  }

  /**
   * Load the image brief generator prompt
   */
  async loadImageBriefPrompt(variables: PromptVariables = {}): Promise<string> {
    return this.loadPrompt('images/brief-generator.md', variables)
  }

  /**
   * Interpolate variables in a template
   * Supports {{variableName}} syntax
   */
  private interpolate(template: string, variables: PromptVariables): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      const value = variables[key]
      if (value === undefined) {
        // Keep the placeholder if no value provided
        return match
      }
      return value
    })
  }

  /**
   * Clear the prompt cache
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * List all available prompts
   */
  async listPrompts(): Promise<string[]> {
    const prompts: string[] = []

    async function scanDir(dir: string, prefix: string = ''): Promise<void> {
      const entries = await fs.readdir(dir, { withFileTypes: true })
      for (const entry of entries) {
        const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name
        if (entry.isDirectory()) {
          await scanDir(path.join(dir, entry.name), relativePath)
        } else if (entry.name.endsWith('.md')) {
          prompts.push(relativePath)
        }
      }
    }

    await scanDir(this.promptsDir)
    return prompts
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let loaderInstance: PromptLoader | null = null

/**
 * Get or create a singleton PromptLoader instance
 */
export function getPromptLoader(): PromptLoader {
  if (!loaderInstance) {
    loaderInstance = new PromptLoader()
  }
  return loaderInstance
}

/**
 * Create a new PromptLoader instance
 */
export function createPromptLoader(promptsDir?: string): PromptLoader {
  return new PromptLoader(promptsDir)
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Build a complete prompt for page generation
 */
export async function buildPageGenerationPrompt(
  pageType: 'service' | 'industry' | 'metier' | 'comparison' | 'blog-post',
  locale: Locale,
  variables: PromptVariables,
): Promise<{ systemPrompt: string; userPrompt: string }> {
  const loader = getPromptLoader()

  const systemPrompt = await loader.loadSystemPrompt(locale)
  const userPrompt = await loader.loadPagePrompt(pageType, variables)

  return { systemPrompt, userPrompt }
}

/**
 * Build a prompt for image brief generation
 */
export async function buildImageBriefPrompt(variables: PromptVariables): Promise<{
  systemPrompt: string
  userPrompt: string
}> {
  const loader = getPromptLoader()

  const systemPrompt = await loader.loadSystemPrompt('en') // Image prompts are in English
  const userPrompt = await loader.loadImageBriefPrompt(variables)

  return { systemPrompt, userPrompt }
}
