/**
 * Claude API Client with Rate Limiting
 * Wrapper around @anthropic-ai/sdk with built-in rate limiting, retry logic, and JSON parsing
 */

import Anthropic from '@anthropic-ai/sdk'

import { anthropicConfig } from '../config'

// ============================================================================
// TYPES
// ============================================================================

export interface ClaudeMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ClaudeRequestOptions {
  systemPrompt?: string
  messages: ClaudeMessage[]
  maxTokens?: number
  temperature?: number
  parseJson?: boolean
}

export interface ClaudeResponse<T = string> {
  content: T
  usage: {
    inputTokens: number
    outputTokens: number
  }
  stopReason: string
}

// ============================================================================
// RATE LIMITER
// ============================================================================

class RateLimiter {
  private tokens: number
  private lastRefill: number
  private readonly maxTokens: number
  private readonly refillRate: number // tokens per ms

  constructor(requestsPerMinute: number) {
    this.maxTokens = requestsPerMinute
    this.tokens = requestsPerMinute
    this.lastRefill = Date.now()
    this.refillRate = requestsPerMinute / 60000 // Convert to per ms
  }

  private refill(): void {
    const now = Date.now()
    const elapsed = now - this.lastRefill
    const tokensToAdd = elapsed * this.refillRate
    this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd)
    this.lastRefill = now
  }

  async acquire(): Promise<void> {
    this.refill()

    if (this.tokens >= 1) {
      this.tokens -= 1
      return
    }

    // Calculate wait time until next token is available
    const waitTime = Math.ceil((1 - this.tokens) / this.refillRate)
    await this.sleep(waitTime)
    this.refill()
    this.tokens -= 1
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

// ============================================================================
// RETRY LOGIC
// ============================================================================

interface RetryOptions {
  maxRetries: number
  baseDelay: number
  maxDelay: number
}

const defaultRetryOptions: RetryOptions = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 30000,
}

async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = defaultRetryOptions,
): Promise<T> {
  let lastError: Error | undefined

  for (let attempt = 0; attempt <= options.maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      // Don't retry on certain errors
      if (error instanceof Anthropic.BadRequestError) {
        throw error
      }

      if (error instanceof Anthropic.AuthenticationError) {
        throw error
      }

      // Check if we should retry
      if (attempt === options.maxRetries) {
        break
      }

      // Calculate delay with exponential backoff and jitter
      const delay = Math.min(
        options.baseDelay * Math.pow(2, attempt) + Math.random() * 1000,
        options.maxDelay,
      )

      console.warn(
        `⚠️  Claude API error (attempt ${attempt + 1}/${options.maxRetries + 1}): ${lastError.message}`,
      )
      console.warn(`   Retrying in ${Math.round(delay / 1000)}s...`)

      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw lastError
}

// ============================================================================
// JSON PARSING
// ============================================================================

function extractJson<T>(text: string): T {
  // Try to find JSON in the response
  // Sometimes Claude wraps JSON in markdown code blocks

  // First, try direct parse
  try {
    return JSON.parse(text) as T
  } catch {
    // Try to extract from code blocks
  }

  // Try to extract from ```json ... ``` blocks
  const jsonBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (jsonBlockMatch) {
    try {
      return JSON.parse(jsonBlockMatch[1].trim()) as T
    } catch {
      // Continue to next attempt
    }
  }

  // Try to find JSON object or array in the text
  const jsonMatch = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/)
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[1]) as T
    } catch {
      // Continue to error
    }
  }

  throw new Error(`Failed to parse JSON from Claude response: ${text.substring(0, 200)}...`)
}

// ============================================================================
// CLAUDE CLIENT
// ============================================================================

export class ClaudeClient {
  private client: Anthropic
  private rateLimiter: RateLimiter
  private model: string
  private defaultMaxTokens: number

  constructor() {
    if (!anthropicConfig.apiKey) {
      throw new Error('ANTHROPIC_API_KEY is required')
    }

    this.client = new Anthropic({
      apiKey: anthropicConfig.apiKey,
    })

    this.rateLimiter = new RateLimiter(anthropicConfig.rateLimitPerMinute)
    this.model = anthropicConfig.model
    this.defaultMaxTokens = anthropicConfig.maxTokens
  }

  /**
   * Send a message to Claude and get a response
   */
  async chat<T = string>(options: ClaudeRequestOptions): Promise<ClaudeResponse<T>> {
    const { systemPrompt, messages, maxTokens, temperature = 0.7, parseJson = false } = options

    // Wait for rate limiter
    await this.rateLimiter.acquire()

    // Make the API call with retry logic
    const response = await withRetry(async () => {
      return this.client.messages.create({
        model: this.model,
        max_tokens: maxTokens || this.defaultMaxTokens,
        temperature,
        system: systemPrompt,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      })
    })

    // Extract text content
    const textContent = response.content.find((c) => c.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content in Claude response')
    }

    const rawContent = textContent.text

    // Parse JSON if requested
    const content = parseJson ? extractJson<T>(rawContent) : (rawContent as T)

    return {
      content,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      },
      stopReason: response.stop_reason || 'unknown',
    }
  }

  /**
   * Generate content with a system prompt and user message
   * Convenience method for single-turn generation
   */
  async generate<T = string>(
    systemPrompt: string,
    userPrompt: string,
    options: { maxTokens?: number; temperature?: number; parseJson?: boolean } = {},
  ): Promise<ClaudeResponse<T>> {
    return this.chat<T>({
      systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
      ...options,
    })
  }

  /**
   * Generate content and parse as JSON
   * Convenience method for structured output
   */
  async generateJson<T>(
    systemPrompt: string,
    userPrompt: string,
    options: { maxTokens?: number; temperature?: number } = {},
  ): Promise<ClaudeResponse<T>> {
    return this.generate<T>(systemPrompt, userPrompt, {
      ...options,
      parseJson: true,
    })
  }

  /**
   * Get the current model being used
   */
  getModel(): string {
    return this.model
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let clientInstance: ClaudeClient | null = null

/**
 * Get or create a singleton Claude client instance
 */
export function getClaudeClient(): ClaudeClient {
  if (!clientInstance) {
    clientInstance = new ClaudeClient()
  }
  return clientInstance
}

/**
 * Create a new Claude client instance (for testing or custom config)
 */
export function createClaudeClient(): ClaudeClient {
  return new ClaudeClient()
}
