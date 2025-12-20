# Guide Développeur - Apps Tierces SUPERFASTTT

> Comment créer, publier et déployer une application tierce sur SUPERFASTTT

---

## Clé

### Architecture SUPERFASTTT

SUPERFASTTT n'est **pas un SaaS mutualisé**. Chaque client dispose de sa **propre instance dédiée** :

```
Client XYZ :
├── Serveur dédié (Scaleway, on-premise, etc.)
├── Instance SUPERFASTTT complète
├── Base de données isolée
└── Stockage dédié
```

### Qu'est-ce qu'une App Tierce ?

Une app tierce est une **application frontend autonome** qui :

- Consomme l'API SUPERFASTTT du client
- Est installée **localement sur l'instance du client**
- S'exécute sur le même domaine que l'instance
- Bénéficie de l'authentification SUPERFASTTT

```
https://instance-client.com/
├── /api              → Backend SUPERFASTTT
├── /admin            → Interface d'administration
└── /apps/mon-app     → Votre app tierce (déployée localement)
```

---

## Fonctionnement Global

```
┌─────────────────────────────────────────────────────────────┐
│                   SUPERFASTTT Registry                       │
│                   (registry.superfasttt.com)                 │
│                                                              │
│   Stocke les bundles d'apps validées et publiées            │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ 1. L'admin installe l'app
                              │    depuis le Marketplace
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                Instance Client (xyz.domaine.com)             │
│                                                              │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│   │   /api      │  │   /admin    │  │  /apps/mon-app      │ │
│   │  Backend    │  │  Admin UI   │  │  Votre App          │ │
│   │  SUPERFASTTT│  │             │  │  (téléchargée)      │ │
│   └─────────────┘  └─────────────┘  └─────────────────────┘ │
│         ▲                                    │               │
│         │         Appels API                 │               │
│         └────────────────────────────────────┘               │
└─────────────────────────────────────────────────────────────┘
```

---

## Structure d'une App Tierce

### Arborescence

```
mon-app/
├── manifest.json           # Métadonnées et configuration
├── package.json            # Dépendances Node.js
├── Dockerfile              # Build de l'app (optionnel si SPA pure)
│
├── src/                    # Code source
│   ├── index.tsx           # Point d'entrée
│   ├── App.tsx             # Composant principal
│   ├── pages/              # Pages de l'app
│   │   ├── index.tsx
│   │   ├── settings.tsx
│   │   └── ...
│   ├── components/         # Composants réutilisables
│   └── lib/                # Utilitaires
│       └── api.ts          # Client API SUPERFASTTT
│
├── public/                 # Assets statiques
│   └── icon.svg
│
└── dist/                   # Build final (généré)
    ├── index.html
    ├── assets/
    │   ├── main.[hash].js
    │   └── main.[hash].css
    └── manifest.json
```

### manifest.json

Le manifest décrit votre app et ses besoins :

```json
{
  "id": "notebook",
  "name": "Notebook",
  "version": "1.0.0",
  "description": "Application de prise de notes intelligente avec IA",
  "author": {
    "name": "Acme Dev",
    "email": "dev@acme.com",
    "url": "https://acme.com"
  },

  "icon": "icon.svg",
  "screenshots": ["screenshots/home.png", "screenshots/editor.png"],

  "type": "spa",

  "entry": "index.html",

  "basePath": "/apps/notebook",

  "permissions": [
    "documents:read",
    "documents:write",
    "conversations:read",
    "conversations:write",
    "rag:query"
  ],

  "requires": {
    "superfasttt": ">=1.0.0"
  },

  "settings": {
    "schema": {
      "theme": {
        "type": "string",
        "enum": ["light", "dark", "auto"],
        "default": "auto",
        "title": "Thème"
      },
      "autoSave": {
        "type": "boolean",
        "default": true,
        "title": "Sauvegarde automatique"
      }
    }
  },

  "build": {
    "command": "npm run build",
    "output": "dist"
  }
}
```

---

## Développement

### 1. Initialiser le projet

```bash
# Créer le projet avec le CLI SUPERFASTTT
npx create-superfasttt-app mon-app

# Ou manuellement
mkdir mon-app && cd mon-app
npm init -y
npm install @superfasttt/sdk @superfasttt/app-runtime
npm install react react-dom react-router-dom
npm install -D vite @vitejs/plugin-react typescript
```

### 2. Configuration Vite

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // IMPORTANT : base path dynamique pour fonctionner sur n'importe quelle instance
  base: '/apps/notebook/',

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Génère un manifest pour l'intégrité
    manifest: true,
  },

  server: {
    port: 3001,
    // Proxy vers une instance SUPERFASTTT locale pour le dev
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
```

### 3. Point d'entrée

```tsx
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { SuperfastttProvider } from '@superfasttt/app-runtime'
import App from './App'
import './index.css'

// Le runtime injecte la configuration
declare global {
  interface Window {
    __SUPERFASTTT_CONFIG__: {
      apiUrl: string
      basePath: string
      token: string
      user: {
        id: string
        email: string
        permissions: string[]
      }
      settings: Record<string, any>
    }
  }
}

const config = window.__SUPERFASTTT_CONFIG__

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SuperfastttProvider config={config}>
      <BrowserRouter basename={config.basePath}>
        <App />
      </BrowserRouter>
    </SuperfastttProvider>
  </React.StrictMode>,
)
```

### 4. Utiliser le SDK

```tsx
// src/App.tsx
import { useSuperfasttt, useAuth } from '@superfasttt/app-runtime'
import { Routes, Route, Link } from 'react-router-dom'
import NotesPage from './pages/NotesPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  const { user } = useAuth()

  return (
    <div className="app">
      <header>
        <h1>Notebook</h1>
        <span>Connecté : {user.email}</span>
      </header>

      <nav>
        <Link to="/">Notes</Link>
        <Link to="/settings">Paramètres</Link>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<NotesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  )
}
```

```tsx
// src/pages/NotesPage.tsx
import { useState, useEffect } from 'react'
import { useSuperfasttt } from '@superfasttt/app-runtime'

interface Note {
  id: string
  title: string
  content: string
  created_at: string
}

export default function NotesPage() {
  const { api } = useSuperfasttt()
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNotes()
  }, [])

  async function loadNotes() {
    try {
      // Appel API vers le backend SUPERFASTTT
      const response = await api.get('/api/documents', {
        params: { type: 'note' },
      })
      setNotes(response.data)
    } catch (error) {
      console.error('Erreur chargement notes:', error)
    } finally {
      setLoading(false)
    }
  }

  async function createNote() {
    const response = await api.post('/api/documents', {
      title: 'Nouvelle note',
      content: '',
      type: 'note',
    })
    setNotes([response.data, ...notes])
  }

  async function askAI(noteId: string, question: string) {
    // Utiliser le RAG SUPERFASTTT
    const response = await api.post('/api/rag/query', {
      query: question,
      context: { note_id: noteId },
    })
    return response.data.answer
  }

  if (loading) return <div>Chargement...</div>

  return (
    <div>
      <button onClick={createNote}>Nouvelle note</button>

      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

### 5. Développement local

```bash
# Terminal 1 : Backend SUPERFASTTT (si local)
cd superfasttt && docker-compose up

# Terminal 2 : Votre app
cd mon-app && npm run dev
```

Accédez à `http://localhost:3001` — le proxy redirige les appels `/api` vers SUPERFASTTT.

---

## Publication

### 1. Build de l'app

```bash
npm run build
```

Génère le dossier `dist/` avec tous les assets.

### 2. Validation locale

```bash
# Vérifier le manifest
npx @superfasttt/cli validate

# Vérifier la taille du bundle
npx @superfasttt/cli check-size

# Scan de sécurité
npx @superfasttt/cli security-scan
```

### 3. Publication sur le Registry

```bash
# Se connecter au registry SUPERFASTTT
npx @superfasttt/cli login

# Publier l'app
npx @superfasttt/cli publish

# Output :
# ✓ Manifest validé
# ✓ Bundle uploadé (245 KB)
# ✓ Scan sécurité passé
# ✓ App "notebook" v1.0.0 publiée
# ✓ En attente de validation SUPERFASTTT
```

### 4. Processus de validation

1. **Automatique** :
   - Scan de sécurité (vulnérabilités, code malveillant)
   - Vérification des permissions demandées
   - Test de build reproductible
2. **Manuel** (équipe SUPERFASTTT) :

   - Review du code si permissions sensibles
   - Vérification conformité RGPD
   - Test fonctionnel

3. **Publication** :
   - App disponible dans le Marketplace
   - Visible par tous les admins d'instances

---

## Installation par le Client

### Côté Admin SUPERFASTTT

L'administrateur de l'instance cliente :

1. Va dans **Admin → Marketplace**
2. Recherche "Notebook"
3. Clique **Installer**

```
┌─────────────────────────────────────────────────────────┐
│  Marketplace                                             │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  🔍 Rechercher une app...                               │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ 📓 Notebook                              v1.0.0    │ │
│  │ Application de prise de notes avec IA             │ │
│  │                                                    │ │
│  │ Permissions requises :                            │ │
│  │ • documents:read                                  │ │
│  │ • documents:write                                 │ │
│  │ • conversations:read                              │ │
│  │                                                    │ │
│  │ [Installer]                                       │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Ce qui se passe techniquement

```
1. Admin clique "Installer"
         │
         ▼
2. Instance télécharge le bundle depuis registry.superfasttt.com
         │
         ▼
3. Bundle extrait dans /var/superfasttt/apps/notebook/
         │
         ▼
4. Nginx/Traefik configuré automatiquement :
   location /apps/notebook {
     alias /var/superfasttt/apps/notebook/dist;
     try_files $uri $uri/ /apps/notebook/index.html;
   }
         │
         ▼
5. Entrée créée en base de données :
   INSERT INTO installed_apps (id, version, enabled, settings)
   VALUES ('notebook', '1.0.0', true, '{}')
         │
         ▼
6. App accessible sur https://instance-client.com/apps/notebook
```

### Accès utilisateur

L'utilisateur final :

1. Se connecte sur `https://instance-client.com` (login SUPERFASTTT)
2. Voit "Notebook" dans le menu (si permissions ok)
3. Clique → accède à `https://instance-client.com/apps/notebook`
4. **Déjà authentifié** (même domaine, même session)

---

## Authentification (SSO Automatique)

### Comment ça marche

Votre app n'a **pas besoin de gérer l'authentification**.

**Pourquoi ?** Les apps tierces sont servies depuis le **même domaine** que l'instance SUPERFASTTT (ex: `instance-client.com/apps/notebook`). Le cookie JWT de session est automatiquement partagé = **SSO natif** sans configuration.

```
Utilisateur accède à /apps/notebook
         │
         ▼
SUPERFASTTT vérifie la session
         │
         ├─── Pas connecté ? → Redirect /login
         │
         └─── Connecté ? → Continue
                   │
                   ▼
         Injecte la config dans la page :

         <script>
           window.__SUPERFASTTT_CONFIG__ = {
             apiUrl: "https://instance-client.com/api",
             basePath: "/apps/notebook",
             token: "eyJ...",  // JWT valide
             user: {
               id: "user_123",
               email: "user@example.com",
               permissions: ["documents:read", "documents:write"]
             },
             settings: {
               theme: "dark",
               autoSave: true
             }
           }
         </script>

         │
         ▼
Votre app React démarre avec le contexte
```

### Utiliser l'auth dans votre app

```tsx
import { useAuth, useApi } from '@superfasttt/app-runtime'

function MyComponent() {
  const { user, hasPermission } = useAuth()
  const api = useApi() // Client HTTP avec token pré-configuré

  // Vérifier une permission
  if (!hasPermission('documents:write')) {
    return <div>Accès refusé</div>
  }

  // Appeler l'API (token automatiquement inclus)
  const createDoc = async () => {
    const response = await api.post('/api/documents', {
      title: 'Mon document',
    })
  }

  return <div>Bienvenue {user.email}</div>
}
```

---

## Communication avec l'API

### Endpoints disponibles

Votre app peut appeler tous les endpoints SUPERFASTTT selon ses permissions :

```typescript
// Documents
GET    /api/documents
POST   /api/documents
GET    /api/documents/:id
PUT    /api/documents/:id
DELETE /api/documents/:id

// RAG (Recherche IA)
POST   /api/rag/query
POST   /api/rag/index

// Conversations
GET    /api/conversations
POST   /api/conversations
POST   /api/conversations/:id/messages

// Apps tierces utilisent l'API standard du noyau
// Pas de routes /extensions/ - le backend est monolithique
```

### Backend personnalisé (non recommandé pour V1)

En V1, les apps tierces sont **purement frontend** et consomment l'API SUPERFASTTT existante.

Si votre app nécessite une logique backend spécifique, contactez l'équipe SUPERFASTTT pour discuter des options (contribution au noyau, API dédiée, etc.).

---

## Mises à jour

### Publier une mise à jour

```bash
# Bumper la version dans manifest.json
# "version": "1.1.0"

# Rebuild et publish
npm run build
npx @superfasttt/cli publish
```

### Côté client

L'admin voit une notification :

```
┌─────────────────────────────────────────────────────────┐
│  Apps installées                                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  📓 Notebook                                             │
│  Version installée : 1.0.0                              │
│  ⚠️ Mise à jour disponible : 1.1.0                      │
│                                                          │
│  [Mettre à jour]  [Changelog]                           │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

L'admin clique **Mettre à jour** → le nouveau bundle est téléchargé et remplace l'ancien.

---

## Bonnes Pratiques

### Performance

- **Bundle < 500 KB** (gzippé)
- **Code splitting** pour les pages lourdes
- **Lazy loading** des composants non critiques

```tsx
// Lazy loading d'une page
const SettingsPage = lazy(() => import('./pages/SettingsPage'))

<Suspense fallback={<Loading />}>
  <SettingsPage />
</Suspense>
```

### Sécurité

- **Ne jamais stocker de secrets** dans le code frontend
- **Valider les permissions** côté UI (UX) ET côté API (sécurité)
- **Échapper les entrées utilisateur** (XSS)

### UX

- **Respecter le thème** de l'instance (clair/sombre)
- **Utiliser les composants SUPERFASTTT** quand disponibles
- **Gérer les erreurs** proprement

```tsx
import { useTheme, Toast } from '@superfasttt/app-runtime'

function MyApp() {
  const { theme } = useTheme() // 'light' | 'dark'

  return <div className={theme}>{/* Votre app */}</div>
}
```

---

## Résumé

| Étape          | Action                                        |
| -------------- | --------------------------------------------- |
| **Développer** | Créer une app React/Vue/Svelte avec le SDK    |
| **Tester**     | `npm run dev` avec proxy vers instance locale |
| **Builder**    | `npm run build` → génère `dist/`              |
| **Valider**    | `npx @superfasttt/cli validate`               |
| **Publier**    | `npx @superfasttt/cli publish`                |
| **Installer**  | Admin client → Marketplace → Installer        |
| **Utiliser**   | `https://instance-client.com/apps/mon-app`    |

---

## Support

- **Documentation** : https://docs.superfasttt.com/apps
- **Exemples** : https://github.com/superfasttt/app-examples
- **Discord** : https://discord.gg/superfasttt
- **Email** : developers@superfasttt.com

---

_Guide Développeur Apps Tierces SUPERFASTTT — Version 1.0_
