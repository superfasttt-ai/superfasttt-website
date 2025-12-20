# 🎨 Architecture du Design System SUPERFASTTT

**Date** : 10 novembre 2025 (Mis à jour après implémentation)
**Package** : `@superfasttt/ui`
**Location** : `packages/ui/`
**Status** : ✅ Implémenté avec Tailwind CSS v4 + shadcn/ui

---

## 📍 Où est le Design System ?

### Structure Complète

```
superfasttt-core/
│
├── packages/
│   └── ui/                           # ⭐ DESIGN SYSTEM (ici !)
│       ├── package.json              # @superfasttt/ui
│       ├── tsconfig.json
│       ├── tailwind.config.ts        # Config Tailwind centralisée
│       │
│       ├── components/
│       │   ├── ui/                   # 🎨 Composants shadcn/ui
│       │   │   ├── button.tsx
│       │   │   ├── card.tsx
│       │   │   ├── input.tsx
│       │   │   ├── label.tsx
│       │   │   ├── table.tsx
│       │   │   ├── badge.tsx
│       │   │   ├── dialog.tsx
│       │   │   ├── dropdown-menu.tsx
│       │   │   ├── toast.tsx
│       │   │   └── ... (tous les composants shadcn)
│       │   │
│       │   └── shared/               # 🔧 Composants custom
│       │       ├── logo.tsx
│       │       ├── loading-spinner.tsx
│       │       ├── page-header.tsx
│       │       └── ... (vos composants perso)
│       │
│       ├── lib/
│       │   └── utils.ts              # Fonction cn() et autres utils
│       │
│       ├── styles/
│       │   └── globals.css           # CSS global avec variables Tailwind
│       │
│       └── index.ts                  # ⭐ Barrel export (point d'entrée)
│
├── apps/
│   ├── shell/                        # ✅ Utilise @superfasttt/ui
│   │   ├── package.json              # dependencies: "@superfasttt/ui": "workspace:*"
│   │   └── app/
│   │       └── page.tsx              # import { Button } from '@superfasttt/ui'
│   │
│   └── admin/                        # ✅ Utilise @superfasttt/ui
│       ├── package.json              # dependencies: "@superfasttt/ui": "workspace:*"
│       └── app/
│           └── page.tsx              # import { Card } from '@superfasttt/ui'
```

---

## 🎯 Comment ça Marche ?

### 1. **Installation shadcn/ui DANS packages/ui/**

```bash
cd packages/ui

# Installer shadcn/ui (les composants vont dans components/ui/)
npx shadcn@latest add button card input label table badge dialog dropdown-menu toast

# Les fichiers seront créés automatiquement :
# ✅ components/ui/button.tsx
# ✅ components/ui/card.tsx
# ✅ etc...
```

### 2. **Export depuis packages/ui/index.ts**

```typescript
// packages/ui/index.ts

// Utils
export * from './lib/utils'

// Composants shadcn/ui
export { Button } from './components/ui/button'
export { Card, CardHeader, CardTitle, CardContent } from './components/ui/card'
export { Input } from './components/ui/input'
export { Label } from './components/ui/label'
// ... tous les autres

// Composants custom
export { Logo } from './components/shared/logo'
export { LoadingSpinner } from './components/shared/loading-spinner'
```

### 3. **Utilisation dans Shell**

```typescript
// apps/shell/app/page.tsx

import { Button, Card, CardHeader, CardTitle } from '@superfasttt/ui'

export default function HomePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>SUPERFASTTT Shell</CardTitle>
      </CardHeader>
      <Button>Click me</Button>
    </Card>
  )
}
```

### 4. **Utilisation dans Admin**

```typescript
// apps/admin/app/page.tsx

import { Button, Input, Label } from '@superfasttt/ui'

export default function AdminPage() {
  return (
    <div>
      <Label>Username</Label>
      <Input type="text" />
      <Button>Login</Button>
    </div>
  )
}
```

---

## 🔄 Workflow de Développement

### Ajouter un Nouveau Composant shadcn

```bash
# 1. Aller dans le package UI
cd packages/ui

# 2. Ajouter le composant via shadcn CLI
npx shadcn@latest add select  # Exemple: ajouter Select

# 3. Le fichier est créé automatiquement
# ✅ components/ui/select.tsx

# 4. Exporter dans index.ts
# packages/ui/index.ts
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select'

# 5. Utiliser dans shell ou admin
# apps/shell/app/page.tsx
import { Select } from '@superfasttt/ui'
```

### Créer un Composant Custom

```bash
# 1. Créer le fichier dans shared/
cd packages/ui
touch components/shared/page-header.tsx

# 2. Coder le composant
# packages/ui/components/shared/page-header.tsx
import { Card } from '../ui/card'

export function PageHeader({ title }: { title: string }) {
  return (
    <Card className="p-4">
      <h1 className="text-2xl font-bold">{title}</h1>
    </Card>
  )
}

# 3. Exporter dans index.ts
# packages/ui/index.ts
export { PageHeader } from './components/shared/page-header'

# 4. Utiliser dans les apps
# apps/shell/app/page.tsx
import { PageHeader } from '@superfasttt/ui'
```

---

## 🎨 Styles et Tailwind v4

### ✅ Configuration Implémentée (Tailwind CSS v4)

**Architecture CSS en monorepo** :

```
packages/ui/styles/globals.css
  ├─ @import "tailwindcss"
  ├─ @source "../components/**/*.{ts,tsx}"  ← Scan composants shadcn
  ├─ :root { --background, --primary, etc. }
  ├─ .dark { ... }
  ├─ @theme inline { ... }
  └─ @layer base { ... }

apps/admin/app/layout.tsx
  ├─ import "@superfasttt/ui/styles/globals.css"  ← Design system
  └─ import "./globals.css"                        ← Scan app

apps/admin/app/globals.css
  ├─ @import "tailwindcss"
  └─ @source "./app/**/*.{ts,tsx}"  ← Scan uniquement pages admin

apps/shell/ → Même structure
```

### Import CSS dans les Apps

```typescript
// apps/shell/app/layout.tsx & apps/admin/app/layout.tsx
import "@superfasttt/ui/styles/globals.css"  // ⭐ Design system CSS
import "./globals.css"                        // App-specific @source

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="light">
      <body className="bg-white text-gray-900">{children}</body>
    </html>
  )
}
```

### PostCSS Configuration (Tailwind v4)

```javascript
// packages/ui/postcss.config.mjs
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}

// apps/admin/postcss.config.mjs (même config)
// apps/shell/postcss.config.mjs (même config)
```

### Package.json Exports

```json
// packages/ui/package.json
{
  "name": "@superfasttt/ui",
  "exports": {
    ".": "./index.ts",
    "./styles/globals.css": "./styles/globals.css" // ⭐ Export CSS
  }
}
```

---

## ✅ Avantages de cette Architecture

### 1. **Single Source of Truth**

- ✅ Un seul endroit pour les composants
- ✅ Pas de duplication entre shell et admin
- ✅ Modifications propagées automatiquement

### 2. **Cohérence Visuelle**

- ✅ Même look & feel partout
- ✅ Même thème Tailwind
- ✅ Mêmes couleurs, spacing, etc.

### 3. **Maintenabilité**

- ✅ Update un composant = update partout
- ✅ Pas de drift entre les apps
- ✅ Facile de tester les composants isolément

### 4. **Scalabilité**

- ✅ Ajout de nouvelles apps facile
- ✅ Réutilisation dans apps-marketplace/ (apps UI CDN)
- ✅ Possibilité de publier le package séparément

### 5. **Developer Experience**

- ✅ Autocomplétion TypeScript
- ✅ Import simple : `from '@superfasttt/ui'`
- ✅ Hot reload entre packages (pnpm workspace)

---

## 📦 Package.json du Design System

```json
{
  "name": "@superfasttt/ui",
  "version": "1.0.0",
  "private": true,
  "main": "./index.ts",
  "types": "./index.ts",
  "exports": {
    ".": "./index.ts",
    "./styles/globals.css": "./styles/globals.css"
  },
  "peerDependencies": {
    "react": "^18",
    "react-dom": "^18"
  },
  "dependencies": {
    "@radix-ui/react-*": "...",
    "class-variance-authority": "...",
    "clsx": "...",
    "tailwind-merge": "..."
  }
}
```

---

## ✅ Setup Monorepo Complété

### Ce qui est fait

1. ✅ **shadcn/ui installé dans packages/ui/**

   - Button, Card, Badge, Input, Label, etc.
   - Tous les composants dans `components/ui/`

2. ✅ **Exports configurés dans index.ts**

   ```typescript
   export * from './components/ui/button'
   export * from './components/ui/card'
   // ... tous les composants
   ```

3. ✅ **Import fonctionnel dans shell/admin**

   ```typescript
   import { Button, Card, Badge } from '@superfasttt/ui'
   ```

4. ✅ **Configuration Tailwind v4**

   - CSS centralisé dans `packages/ui/styles/globals.css`
   - `@source` directives pour scanner les composants
   - `@theme inline` pour les variables CSS
   - PostCSS v4 configuré partout

5. ✅ **Tests validés**
   - Page de test créée: `apps/admin/app/test-components/page.tsx`
   - Composants shadcn stylisés correctement
   - Light mode activé par défaut

### Commandes disponibles

```bash
# Installer toutes les dépendances (tous les workspaces)
pnpm install

# Démarrer l'admin
pnpm dev:admin  # http://localhost:3000

# Démarrer le shell
pnpm dev:shell  # http://localhost:3001
```

## 🚀 Prochaines Étapes: Backend Python + PostgreSQL

Maintenant que le frontend est prêt, on passe au backend:

1. **Créer `apps/api/` avec FastAPI**

   - FastAPI + PostgreSQL + SQLAlchemy
   - Structure Python propre
   - API endpoints pour admin

2. **Setup PostgreSQL local**

   - docker-compose avec PostgreSQL
   - Migrations avec Alembic
   - Schéma de base (users, roles, extensions)

3. **Connexion Frontend ↔ Backend**
   - API client dans apps/admin
   - Endpoints RESTful
   - Authentification JWT

---

## 📚 Ressources

- **shadcn/ui Docs** : https://ui.shadcn.com
- **Tailwind CSS** : https://tailwindcss.com
- **Radix UI** (base de shadcn) : https://radix-ui.com
- **pnpm Workspaces** : https://pnpm.io/workspaces

---

## 🎯 Résumé

**Le Design System est dans `packages/ui/`** et est utilisé par **toutes les apps** via `@superfasttt/ui`.

**C'est comme une bibliothèque NPM interne** à votre monorepo, mais locale et partagée entre toutes vos apps.

**Architecture propre dès le début** = Pas de refacto plus tard ! 🚀
