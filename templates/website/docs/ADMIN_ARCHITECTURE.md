# Admin UI - Dashboard d'Administration

Application Next.js pour l'administration et la configuration de l'instance SUPERFASTTT.

## 🎯 Rôle

Le **Admin UI** est l'interface d'administration unique pour chaque tenant SUPERFASTTT qui permet :

- ✅ Configuration de l'instance (paramètres, branding)
- ✅ Gestion des **utilisateurs et rôles**
- ✅ Activation/désactivation des **extensions**
- ✅ Gestion des **permissions** par rôle
- ✅ Monitoring et **logs système**
- ✅ Gestion des **API keys LLM**
- ✅ Statistiques d'usage (tokens, coûts, latence)

**Important :** L'Admin UI est l'interface principale pour gérer votre instance SUPERFASTTT. Chaque tenant accède à son propre espace d'administration isolé.

---

## 📁 Structure

```
apps/admin/
├── package.json              # Dépendances Next.js 14+, TypeScript
├── tsconfig.json             # Configuration TypeScript
├── next.config.js            # Configuration Next.js
├── tailwind.config.js        # Styles
├── README.md                 # Ce fichier
│
├── lib/                      # Services et utilitaires
│   ├── api-client.ts         # Client API admin
│   ├── auth.ts               # Auth admin (JWT)
│   └── permissions.ts        # Vérification permissions admin
│
├── app/                      # Next.js App Router
│   ├── layout.tsx            # Layout global
│   ├── page.tsx              # Dashboard principal
│   │
│   ├── users/                # Gestion utilisateurs
│   │   ├── page.tsx          # Liste utilisateurs
│   │   ├── [id]/page.tsx     # Détail utilisateur
│   │   └── new/page.tsx      # Créer utilisateur
│   │
│   ├── roles/                # Gestion rôles et permissions
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   │
│   ├── extensions/           # Gestion extensions
│   │   ├── page.tsx          # Liste extensions
│   │   └── [id]/             # Config extension
│   │       ├── page.tsx
│   │       └── settings/page.tsx
│   │
│   ├── apps/                 # Gestion apps UI
│   │   ├── page.tsx          # Liste apps marketplace
│   │   └── [id]/             # Config app
│   │       ├── page.tsx      # Activation, version
│   │       └── permissions/page.tsx
│   │
│   ├── settings/             # Paramètres instance
│   │   ├── page.tsx          # Général
│   │   ├── branding/page.tsx # Logo, couleurs
│   │   └── api-keys/page.tsx # API keys
│   │
│   ├── monitoring/           # Monitoring
│   │   ├── page.tsx          # Dashboard monitoring
│   │   └── logs/page.tsx     # Logs système
│   │
│   └── api/                  # API Routes (proxy vers backend)
│       └── admin/
│           └── [...path]/route.ts
│
├── components/               # Composants UI
│   ├── users/
│   │   ├── user-table.tsx
│   │   ├── user-form.tsx
│   │   └── role-badge.tsx
│   │
│   ├── extensions/
│   │   ├── extension-card.tsx
│   │   └── extension-toggle.tsx
│   │
│   └── common/
│       ├── layout.tsx
│       ├── sidebar.tsx
│       └── header.tsx
│
└── .env.example              # Variables d'env requises
```

---

## 🔧 Développement Local

### Installation

```bash
cd apps/admin
npm install
```

### Configuration

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_INSTANCE_ID=dev-instance
ADMIN_SECRET=your-admin-secret
```

### Lancement

```bash
npm run dev
# Admin disponible sur http://localhost:3001
```

---

## 🚀 Fonctionnalités Principales

### 1. Gestion Utilisateurs

#### Liste Utilisateurs - `/users`

Affiche tous les utilisateurs de l'instance avec filtres.

**Fonctionnalités :**

- 📋 Table avec pagination
- 🔍 Recherche par nom, email
- 🏷️ Filtres par rôle, statut (actif/inactif)
- ➕ Créer nouvel utilisateur
- ✏️ Modifier utilisateur
- 🗑️ Désactiver/Supprimer utilisateur

**API utilisée :**

```typescript
GET /api/admin/users?search=john&role=admin&limit=50&offset=0
```

#### Créer/Modifier Utilisateur - `/users/new`, `/users/{id}`

Formulaire de création/modification d'utilisateur.

**Champs :**

- Nom, Email
- Rôle(s) : Admin, User, etc.
- Permissions spécifiques
- Statut : Actif/Inactif

**API :**

```typescript
POST /api/admin/users
{
  "email": "john@example.com",
  "name": "John Doe",
  "roles": ["user"],
  "permissions": ["social-posts.read"],
  "password": "initial-password"
}
```

---

### 2. Gestion Rôles et Permissions - `/roles`

#### Liste Rôles

Affiche tous les rôles configurés.

**Rôles par défaut :**

- **Admin** : Accès complet à l'instance
- **User** : Accès standard aux apps
- **Viewer** : Lecture seule

**API :**

```typescript
GET / api / admin / roles
```

#### Modifier Rôle - `/roles/{id}`

Configurez les permissions d'un rôle.

**Exemple :**

```typescript
PATCH /api/admin/roles/admin
{
  "permissions": [
    "*.admin",           // Accès admin toutes extensions
    "social-posts.*",    // Toutes permissions social-posts
    "knowledge-base.*"
  ]
}
```

---

### 3. Gestion Extensions - `/extensions`

#### Liste Extensions

Affiche toutes les extensions disponibles (activées ou non).

**Informations affichées :**

- Nom, description, version
- Status : ✅ Activée / ❌ Désactivée
- Nombre d'utilisateurs utilisant l'extension
- Permissions requises

**Actions :**

- Toggle activation/désactivation
- Configurer paramètres extension
- Voir logs extension

**API :**

```typescript
GET / api / admin / extensions
```

**Response :**

```json
{
  "extensions": [
    {
      "id": "meeting-notes",
      "name": "Meeting Notes",
      "version": "2.0.0",
      "enabled": true,
      "type": "backend",
      "api_endpoints": [
        "GET /extensions/meeting-notes/meetings",
        "POST /extensions/meeting-notes/analyze"
      ],
      "mcp_tools": ["analyze_meeting", "get_transcript"],
      "permissions": ["meeting-notes.read", "meeting-notes.manage"],
      "active_users": 25
    },
    {
      "id": "social-posts",
      "name": "Social Posts",
      "version": "1.2.0",
      "enabled": true,
      "type": "backend",
      "active_users": 18
    }
  ]
}
```

#### Toggle Extension

```typescript
POST /api/admin/extensions/social-posts/toggle
{
  "enabled": true
}
```

#### Configuration Extension - `/extensions/{id}/settings`

Paramètres spécifiques à l'extension.

**Exemple pour social-posts :**

- API keys plateformes (Twitter, LinkedIn)
- Webhooks URLs
- Rate limits

---

### 4. Gestion Apps UI - `/apps`

#### Liste Apps Marketplace

Affiche toutes les apps UI disponibles dans le marketplace.

**Informations :**

- Nom, description, version disponible
- Version actuellement déployée sur l'instance
- Status : ✅ Activée / ❌ Désactivée
- CDN URLs
- Permissions requises

**Actions :**

- Activer/désactiver app
- Changer version (upgrade/downgrade)
- Configurer permissions
- Voir analytics usage

**API :**

```typescript
GET / api / admin / apps
```

**Response :**

```json
{
  "apps": [
    {
      "id": "social-posts",
      "name": "Social Posts",
      "description": "Gérer posts multi-plateformes",
      "latest_version": "1.3.0",
      "installed_version": "1.2.0",
      "enabled": true,
      "bundle_urls": ["https://cdn.superfasttt.com/apps/social-posts/1.2.0/bundle.js"],
      "permissions": ["social-posts.read", "social-posts.manage"],
      "requires_backend": "social-posts",
      "active_users": 18
    },
    {
      "id": "knowledge-base",
      "name": "Knowledge Base",
      "latest_version": "1.1.0",
      "installed_version": null,
      "enabled": false,
      "requires_backend": "knowledge-base"
    }
  ]
}
```

#### Activer/Désactiver App

```typescript
POST /api/admin/apps/social-posts/toggle
{
  "enabled": true
}
```

#### Changer Version

```typescript
POST /api/admin/apps/social-posts/version
{
  "version": "1.3.0"
}
```

---

### 5. Paramètres Instance - `/settings`

#### Général - `/settings`

Paramètres généraux de l'instance.

**Champs :**

- Nom instance
- URL publique
- Timezone
- Langue par défaut
- Limites (storage, users, etc.)

**API :**

```typescript
PATCH /api/admin/settings
{
  "instance_name": "Acme Corp",
  "public_url": "https://acme.superfasttt.com",
  "timezone": "Europe/Paris",
  "default_language": "fr"
}
```

#### Branding - `/settings/branding`

Personnalisation visuelle.

**Champs :**

- Logo (upload)
- Couleur primaire
- Couleur secondaire
- Favicon

#### API Keys - `/settings/api-keys`

Gestion des API keys pour accès programmatique.

**Fonctionnalités :**

- Créer nouvelle API key
- Révoquer API key
- Définir scopes (permissions) par key
- Voir usage (dernière utilisation, nombre d'appels)

**API :**

```typescript
POST /api/admin/api-keys
{
  "name": "CI/CD Pipeline",
  "scopes": ["social-posts.read", "social-posts.manage"],
  "expires_at": "2025-12-31"
}

Response:
{
  "id": "key_abc123",
  "key": "sk_live_abc123xyz789",  // Affichée une seule fois
  "name": "CI/CD Pipeline",
  "scopes": ["social-posts.read"],
  "created_at": "2025-01-14T12:00:00Z"
}
```

---

### 6. Monitoring - `/monitoring`

#### Dashboard Monitoring

Vue d'ensemble de la santé de l'instance.

**Métriques :**

- CPU, RAM, Disk usage
- Nombre requêtes API (par heure, jour)
- Erreurs 4xx, 5xx
- Temps de réponse moyen
- Extensions actives/inactives
- Utilisateurs actifs (24h, 7j, 30j)

**API :**

```typescript
GET / api / admin / monitoring / metrics
```

#### Logs Système - `/monitoring/logs`

Affiche les logs système avec filtres.

**Filtres :**

- Niveau : DEBUG, INFO, WARNING, ERROR
- Extension : Tous, meeting-notes, social-posts, etc.
- Date range
- Recherche full-text

**API :**

```typescript
GET /api/admin/monitoring/logs?level=ERROR&extension=social-posts&limit=100
```

---

## 🔐 Sécurité

### Authentification Admin

L'accès à l'admin nécessite un compte avec rôle `admin`.

```typescript
// lib/auth.ts

export async function requireAdmin(user: User) {
  if (!user.roles.includes('admin')) {
    throw new Error('Admin access required')
  }
}
```

### Protection Routes

Toutes les routes admin sont protégées.

```typescript
// app/users/page.tsx

import { requireAdmin } from '@/lib/auth'

export default async function UsersPage() {
  const user = await getCurrentUser()
  await requireAdmin(user)

  // Render page
}
```

### Audit Logs

Toutes les actions admin sont loggées.

```typescript
POST /api/admin/audit
{
  "action": "user.created",
  "user_id": "admin_xyz",
  "target": "user_abc123",
  "details": {
    "email": "john@example.com",
    "roles": ["user"]
  }
}
```

---

## 📦 Build & Déploiement

### Build Production

```bash
npm run build
# Génère .next/ avec optimisations

npm run start
# Lance en mode production sur port 3001
```

### Déploiement Docker

```yaml
# docker-compose.yml
services:
  admin:
    image: superfasttt/admin:1.0.0
    ports:
      - '3001:3001'
    environment:
      - NEXT_PUBLIC_API_URL=${API_URL}
      - ADMIN_SECRET=${ADMIN_SECRET}
      - INSTANCE_ID=${INSTANCE_ID}
```

---

## 🔗 Voir Aussi

- [EXTENSIONS_PLAN.md - Admin UI](../../EXTENSIONS_PLAN.md)
- [apps/shell](../shell/README.md) - Shell UI pour utilisateurs
- [apps/api](../../apps/api/README.md) - Backend API

---

## 💡 Exemples de Composants

### Extension Toggle Component

```typescript
// components/extensions/extension-toggle.tsx

'use client'

import { useState } from 'react'

interface ExtensionToggleProps {
  extension: {
    id: string
    name: string
    enabled: boolean
  }
}

export function ExtensionToggle({ extension }: ExtensionToggleProps) {
  const [enabled, setEnabled] = useState(extension.enabled)
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/extensions/${extension.id}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !enabled })
      })

      if (response.ok) {
        setEnabled(!enabled)
      }
    } catch (error) {
      console.error('Failed to toggle extension', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`toggle ${enabled ? 'enabled' : 'disabled'}`}
    >
      {enabled ? '✅ Enabled' : '❌ Disabled'}
    </button>
  )
}
```

### User Form Component

```typescript
// components/users/user-form.tsx

'use client'

import { useState } from 'react'

export function UserForm({ onSubmit, initialData }) {
  const [formData, setFormData] = useState(initialData || {
    email: '',
    name: '',
    roles: [],
    permissions: []
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div>
        <label>Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div>
        <label>Roles</label>
        <select
          multiple
          value={formData.roles}
          onChange={(e) => setFormData({
            ...formData,
            roles: Array.from(e.target.selectedOptions, opt => opt.value)
          })}
        >
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="viewer">Viewer</option>
        </select>
      </div>

      <button type="submit">Save User</button>
    </form>
  )
}
```

---

**Admin UI : Interface complète pour administrer votre instance SUPERFASTTT.** 🚀
