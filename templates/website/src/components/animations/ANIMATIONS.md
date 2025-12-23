# Guide des Animations SVG

Ce document explique comment gérer les animations SVG dans le projet SUPERFASTTT.

## Architecture

```
src/components/animations/
├── ANIMATIONS.md          # Ce fichier
├── registry.ts            # Registre central des animations
├── brain/index.tsx        # Animation réseau neuronal
├── assistants/index.tsx   # Animation multi-agents
├── models/index.tsx       # Animation modèles IA
├── connectors/index.tsx   # Animation connecteurs
├── marketing/index.tsx    # Animation marketing
├── rnd/index.tsx          # Animation R&D
└── support/index.tsx      # Animation support
```

## Animations disponibles

| ID           | Description                 | Icône mappée |
| ------------ | --------------------------- | ------------ |
| `brain`      | Réseau neuronal IA          | brain        |
| `assistants` | Multi-agents collaboratifs  | users        |
| `models`     | Modèles IA empilés          | layers       |
| `connectors` | Outils connectés            | cloud        |
| `marketing`  | Contenu créatif             | zap          |
| `rnd`        | Métier - Données sécurisées | shield       |
| `support`    | Service client              | headphones   |

## Ajouter une nouvelle animation

### Étape 1 : Créer le composant

Créer `src/components/animations/<nom>/index.tsx` :

```tsx
'use client'

import React from 'react'

interface Props {
  className?: string
}

export function NomAnimation({ className }: Props) {
  return (
    <svg
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Description de l'animation"
    >
      {/* Définitions (gradients, filtres) */}
      <defs>
        <linearGradient id="nom-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>

      {/* Éléments SVG avec animations SMIL */}
      <circle cx="200" cy="150" r="50" fill="url(#nom-gradient)">
        <animate attributeName="r" values="50;60;50" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

export default NomAnimation
```

### Étape 2 : Ajouter au registry

Dans `src/components/animations/registry.ts`, ajouter :

```ts
export const ANIMATIONS: Record<string, ComponentType<AnimationProps>> = {
  // ... animations existantes
  nom: dynamic(() => import('./nom').then((mod) => mod.NomAnimation), {
    ssr: false,
  }),
}
```

### Étape 3 : Ajouter le mapping icône → animation

Dans `src/blocks/ProductShowcase/Component.tsx`, ajouter au mapping :

```ts
const ICON_TO_ANIMATION: Record<string, AnimationId> = {
  // ... mappings existants
  'icone-lucide': 'nom', // ex: 'sparkles': 'nom'
}
```

### Étape 4 : Ajouter l'option CMS

Dans `src/blocks/ProductShowcase/config.ts`, ajouter l'option :

```ts
options: [
  // Animations SVG (prioritaires)
  { label: '🎬 Nom - Description', value: 'icone-lucide' },
  // ...
]
```

### Étape 5 : Mettre à jour le bloc Animation (optionnel)

Si vous voulez aussi l'utiliser dans le bloc Animation standalone, modifier `src/blocks/Animation/config.ts` :

```ts
options: [
  // ...
  { label: 'Nom (Description)', value: 'nom' },
]
```

## Ajouter une icône Lucide (sans animation)

### Étape 1 : Vérifier la disponibilité

Les icônes Lucide sont déjà importées. Voir la liste sur https://lucide.dev/icons

### Étape 2 : Ajouter l'option CMS

Dans `src/blocks/ProductShowcase/config.ts` :

```ts
options: [
  // ... dans la section "Icônes statiques Lucide"
  { label: '🔷 NomIcone', value: 'nomicone' },
]
```

### Étape 3 : Ajouter le rendu

Dans `src/blocks/ProductShowcase/Component.tsx`, ajouter dans le switch/map des icônes :

```tsx
import { NomIcone } from 'lucide-react'

// Dans le composant, ajouter le cas
case 'nomicone':
  return <NomIcone className="w-12 h-12" />
```

## Bonnes pratiques pour les animations

### Performance

- Utiliser `ssr: false` dans dynamic() pour éviter les problèmes d'hydratation
- Préférer les animations SMIL (`<animate>`) aux animations CSS pour les SVG
- Limiter le nombre d'éléments animés simultanément

### Accessibilité

- Toujours ajouter `aria-label` sur le SVG racine
- Utiliser `prefers-reduced-motion` pour désactiver les animations si nécessaire

### Couleurs

- Utiliser les variables CSS du thème quand possible
- Pour le dark mode, utiliser `className="dark:..."` ou des gradients adaptatifs

### Structure SVG

- Viewbox recommandé : `400x300` (ratio 4:3) ou `600x400` (ratio 3:2)
- Grouper les éléments liés dans des `<g>`
- Utiliser des IDs uniques pour les gradients (préfixer avec le nom de l'animation)

## Demander une animation à Claude Code

Pour demander une nouvelle animation, fournir :

1. **Concept** : Ce que l'animation doit représenter
2. **Style** : Minimaliste, technique, organique, etc.
3. **Couleurs** : Palette souhaitée (ou "palette SUPERFASTTT" pour emerald/cyan/blue)
4. **Mouvement** : Type d'animation (pulse, rotation, flux, etc.)

Exemple de prompt :

```
Crée une animation SVG pour représenter [concept].
Style : [style]
Palette : emerald (#34d399), cyan (#22d3ee), blue (#3b82f6)
Animation : [type de mouvement]
Intègre-la dans le système d'animations existant.
```
