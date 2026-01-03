import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'
import React from 'react'
import { AnimationSkeleton } from './AnimationSkeleton'

export interface AnimationProps {
  className?: string
}

const loadingFallback = () => <AnimationSkeleton className="w-full h-full" />

// Liste statique des animations disponibles (meilleur tree-shaking)
export const ANIMATIONS: Record<string, ComponentType<AnimationProps>> = {
  brain: dynamic(() => import('./brain').then((mod) => mod.Brain), {
    ssr: false,
    loading: loadingFallback,
  }),
  assistants: dynamic(() => import('./assistants').then((mod) => mod.Assistants), {
    ssr: false,
    loading: loadingFallback,
  }),
  models: dynamic(() => import('./models').then((mod) => mod.Models), {
    ssr: false,
    loading: loadingFallback,
  }),
  connectors: dynamic(() => import('./connectors').then((mod) => mod.Connectors), {
    ssr: false,
    loading: loadingFallback,
  }),
  marketing: dynamic(() => import('./marketing').then((mod) => mod.Marketing), {
    ssr: false,
    loading: loadingFallback,
  }),
  rnd: dynamic(() => import('./rnd').then((mod) => mod.RnD), {
    ssr: false,
    loading: loadingFallback,
  }),
  support: dynamic(() => import('./support').then((mod) => mod.Support), {
    ssr: false,
    loading: loadingFallback,
  }),
}

export type AnimationId = keyof typeof ANIMATIONS

// Pour le champ select dans Payload CMS
export const ANIMATION_OPTIONS = Object.keys(ANIMATIONS).map((id) => ({
  label: id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' '),
  value: id,
}))

// Helper pour récupérer une animation
export function getAnimation(id: string): ComponentType<AnimationProps> | null {
  return ANIMATIONS[id] || null
}
