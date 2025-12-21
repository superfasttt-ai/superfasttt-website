import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'

export interface AnimationProps {
  className?: string
}

// Liste statique des animations disponibles (meilleur tree-shaking)
export const ANIMATIONS: Record<string, ComponentType<AnimationProps>> = {
  brain: dynamic(() => import('./brain').then((mod) => mod.Brain), {
    ssr: false,
  }),
  assistants: dynamic(() => import('./assistants').then((mod) => mod.Assistants), {
    ssr: false,
  }),
  models: dynamic(() => import('./models').then((mod) => mod.Models), {
    ssr: false,
  }),
  connectors: dynamic(() => import('./connectors').then((mod) => mod.Connectors), {
    ssr: false,
  }),
  marketing: dynamic(() => import('./marketing').then((mod) => mod.Marketing), {
    ssr: false,
  }),
  rnd: dynamic(() => import('./rnd').then((mod) => mod.RnD), {
    ssr: false,
  }),
  support: dynamic(() => import('./support').then((mod) => mod.Support), {
    ssr: false,
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
