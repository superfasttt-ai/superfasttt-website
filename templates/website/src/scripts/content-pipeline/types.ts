/**
 * Content Pipeline Types
 * Interfaces for the AI content generation system
 */

// ============================================================================
// LOCALES
// ============================================================================

export type Locale = 'fr' | 'en' | 'es'

export const LOCALES: Locale[] = ['fr', 'en', 'es']
export const DEFAULT_LOCALE: Locale = 'fr'

// ============================================================================
// TAXONOMY
// ============================================================================

export type ContentType = 'service' | 'industry' | 'metier' | 'usecase' | 'comparison' | 'blog-post'

export type ContentStatus =
  | 'pending'
  | 'generating'
  | 'generated'
  | 'reviewed'
  | 'published'
  | 'error'

export type Priority = 'high' | 'medium' | 'normal' | 'low'

export interface LocalizedString {
  fr: string
  en: string
  es: string
}

export interface TaxonomyNode {
  id: string
  type: ContentType
  slug: LocalizedString
  title: LocalizedString
  description: LocalizedString
  parentId?: string
  children?: TaxonomyNode[]
  seoKeywords: LocalizedString
  relatedNodeIds?: string[]
  icon?: string
  priority: Priority
  batch: number
}

export interface ServiceTaxonomy extends TaxonomyNode {
  type: 'service'
  useCases: string[]
  benefits: string[]
  targetAudiences: string[]
}

export interface IndustryTaxonomy extends TaxonomyNode {
  type: 'industry'
  challenges: string[]
  regulations: string[]
  certifications: string[]
}

export interface MetierTaxonomy extends TaxonomyNode {
  type: 'metier'
  painPoints: string[]
  solutions: string[]
  kpis: string[]
}

export interface UseCaseTaxonomy extends TaxonomyNode {
  type: 'usecase'
  relatedServices: string[]
  relatedMetiers: string[]
}

export interface ComparisonTaxonomy extends TaxonomyNode {
  type: 'comparison'
  competitorId: string
}

export interface BlogCategory {
  id: string
  slug: LocalizedString
  title: LocalizedString
  description: LocalizedString
}

// ============================================================================
// COMPETITOR DATA
// ============================================================================

export type CompetitorCategory = 'big-tech' | 'european' | 'open-source' | 'specialized'
export type SovereigntyLevel = 'none' | 'partial' | 'full'
export type DeploymentOption = 'cloud' | 'on-premise' | 'hybrid'

export interface Competitor {
  id: string
  name: string
  logo?: string
  website: string
  category: CompetitorCategory
  strengths: LocalizedString[]
  weaknesses: LocalizedString[]
  pricing: string
  sovereignty: SovereigntyLevel
  deployment: DeploymentOption[]
  certifications: string[]
  targetAudience: string[]
  lastUpdated?: string
}

// ============================================================================
// PRODUCT BRIEF
// ============================================================================

export interface ProductPillar {
  id: string
  title: LocalizedString
  description: LocalizedString
  icon: string
}

export interface ProductFeature {
  id: string
  name: LocalizedString
  description: LocalizedString
  category: string
}

export interface ComplianceInfo {
  name: string
  status: 'compliant' | 'ready' | 'compatible' | 'friendly'
  description: LocalizedString
}

export interface DeploymentOptionInfo {
  id: string
  title: LocalizedString
  description: LocalizedString
}

export interface ProductBrief {
  companyName: string
  tagline: LocalizedString
  valueProposition: LocalizedString
  pillars: ProductPillar[]
  features: ProductFeature[]
  differentiators: string[]
  compliance: ComplianceInfo[]
  deploymentOptions: DeploymentOptionInfo[]
  stack: string[]
  targetAudiences: string[]
}

// ============================================================================
// CONTENT GENERATION
// ============================================================================

export interface FAQ {
  question: string
  answer: string
  keywords: string[]
}

export interface InternalLink {
  slug: string
  title: string
  type: ContentType
}

export interface MetaSEO {
  title: string
  description: string
  keywords?: string[]
}

export interface GeneratedPage {
  id: string
  type: ContentType
  slug: string
  title: string
  layout: PageBlock[]
  faq: FAQ[]
  meta: MetaSEO
  internalLinks: InternalLink[]
  sources?: Source[]
}

export interface Source {
  title: string
  url: string
  accessedAt: string
}

// ============================================================================
// PAGE BLOCKS (matching PayloadCMS types)
// ============================================================================

export type PageBlock =
  | HeroModernBlock
  | FeatureGridBlock
  | ProductShowcaseBlock
  | SectorCardsBlock
  | StatsSectionBlock
  | CtaModernBlock
  | ContentBlock
  | FAQBlockType

export interface HeroModernBlock {
  blockType: 'heroModern'
  blockName?: string
  badge?: string
  title: string
  highlightedText?: string
  description?: string
  links?: LinkItem[]
  trustIndicators?: TrustIndicator[]
}

export interface LinkItem {
  link: {
    type: 'custom' | 'reference'
    label: string
    url?: string
  }
}

export interface TrustIndicator {
  icon: string
  text: string
}

export interface FeatureGridBlock {
  blockType: 'featureGrid'
  blockName?: string
  badge?: string
  title: string
  description?: string
  columns?: 2 | 3 | 4
  features: FeatureItem[]
}

export interface FeatureItem {
  icon: string
  title: string
  description: string
}

export interface ProductShowcaseBlock {
  blockType: 'productShowcase'
  blockName?: string
  badge?: string
  title: string
  description?: string
  layout?: 'alternating' | 'grid'
  items: ProductShowcaseItem[]
}

export interface ProductShowcaseItem {
  title: string
  description: string
  icon?: string
  animationType?: string
  keyFeatures?: { feature: string }[]
}

export interface SectorCardsBlock {
  blockType: 'sectorCards'
  blockName?: string
  badge?: string
  title: string
  description?: string
  sectors: SectorCard[]
}

export interface SectorCard {
  icon: string
  title: string
  description: string
  keyPoints?: { point: string }[]
}

export interface StatsSectionBlock {
  blockType: 'statsSection'
  blockName?: string
  badge?: string
  title: string
  description?: string
  variant?: 'default' | 'cards' | 'gradient'
  stats: StatItem[]
}

export interface StatItem {
  value: string
  label: string
  description?: string
}

export interface CtaModernBlock {
  blockType: 'ctaModern'
  blockName?: string
  title: string
  description?: string
  variant?: 'gradient' | 'dark' | 'bordered'
  links?: LinkItem[]
}

export interface ContentBlock {
  blockType: 'content'
  blockName?: string
  columns: ContentColumn[]
}

export interface ContentColumn {
  size: 'oneThird' | 'half' | 'twoThirds' | 'full'
  richText: any // Lexical content
}

export interface FAQBlockType {
  blockType: 'faq'
  blockName?: string
  badge?: string
  title?: string
  description?: string
  items: FAQItem[]
  allowMultipleOpen?: boolean
}

export interface FAQItem {
  question: string
  answer: any // Lexical rich text content
}

// ============================================================================
// REGISTRY
// ============================================================================

export interface RegistryMetadata {
  lastUpdated: string
  totalPages: number
  generated: number
  pending: number
  reviewed: number
  published: number
  errors: number
}

export interface RegistryPage {
  id: string
  type: ContentType
  slug: Partial<Record<Locale, string>>
  title: Partial<Record<Locale, string>>
  status: Partial<Record<Locale, ContentStatus>>
  payloadId?: Partial<Record<Locale, string>>
  generatedAt?: string
  reviewedAt?: Partial<Record<Locale, string>>
  publishedAt?: Partial<Record<Locale, string>>
  error?: Partial<Record<Locale, string>>
  priority: Priority
  batch: number
}

export interface ContentRegistry {
  metadata: RegistryMetadata
  pages: RegistryPage[]
}

// ============================================================================
// IMAGE BRIEFS
// ============================================================================

export type ImagePosition = 'hero' | 'feature' | 'illustration' | 'og-image'

export interface ImageBriefItem {
  id: string
  prompt: string
  style: string
  dimensions: string
  keywords: string[]
  avoid: string[]
}

export interface ImageBriefPosition {
  position: ImagePosition
  briefs: ImageBriefItem[]
}

export interface PageImageBriefs {
  pageId: string
  pageTitle: string
  images: ImageBriefPosition[]
}

export interface ImageBriefsRegistry {
  generatedAt: string
  briefs: PageImageBriefs[]
}

// ============================================================================
// RESEARCH (Serper.dev)
// ============================================================================

export interface SearchResult {
  title: string
  link: string
  snippet: string
  date?: string
}

export interface NewsResult extends SearchResult {
  source: string
  imageUrl?: string
}

export interface ResearchCache {
  query: string
  results: SearchResult[]
  cachedAt: string
  expiresAt: string
}

export interface ResearchData {
  competitor?: Competitor
  searchResults: SearchResult[]
  newsResults: NewsResult[]
  cachedAt: string
}

// ============================================================================
// GENERATION OPTIONS
// ============================================================================

export interface GenerationOptions {
  locales: Locale[]
  types?: ContentType[]
  ids?: string[]
  batch?: number
  priority?: Priority
  limit?: number
  dryRun: boolean
  asDraft: boolean
  includeResearch: boolean
  generateImageBriefs: boolean
  withFaq: boolean
}

export interface GenerationResult {
  success: boolean
  pageId: string
  slug: string
  locale: Locale
  payloadId?: string
  error?: string
  duration?: number
}

// ============================================================================
// BATCH CONFIG
// ============================================================================

export interface BatchItem {
  type: ContentType
  ids: string[]
}

export interface BatchConfig {
  week: number
  priority: Priority
  items: BatchItem[]
}

export type BatchConfigMap = Record<string, BatchConfig>
