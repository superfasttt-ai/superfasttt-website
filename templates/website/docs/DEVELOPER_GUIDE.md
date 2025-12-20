# Guide Développeur - SUPERFASTTT Core

> Documentation complète pour développer des applications tierces qui consomment SUPERFASTTT Core

---

## 📋 Table des Matières

1. [Introduction](#introduction)
2. [Quick Start](#quick-start)
3. [Architecture Core](#architecture-core)
4. [Authentification](#authentification)
5. [API REST](#api-rest)
6. [MCP Tools](#mcp-tools)
7. [SDK TypeScript](#sdk-typescript)
8. [Développer une App Tierce](#développer-une-app-tierce)
9. [Exemples Complets](#exemples-complets)
10. [Déploiement](#déploiement)
11. [Troubleshooting](#troubleshooting)

---

## Introduction

### Qu'est-ce que SUPERFASTTT Core ?

SUPERFASTTT Core est une **plateforme Backend-as-a-Service (BaaS) IA souveraine** qui fournit :

- ✅ **API REST complète** - Documents, RAG, Conversations, Agents, Analytics
- ✅ **MCP Tools exhaustifs** - 20+ outils IA prêts à utiliser
- ✅ **Authentification JWT** - Auth centralisée avec RBAC granulaire
- ✅ **Multi-LLM** - Orchestration OpenAI, Anthropic, Mistral, Ollama
- ✅ **RAG Avancé** - LlamaIndex + pgvector ou Qdrant
- ✅ **SDK TypeScript** - Client typé pour toutes les API

### Pour Qui ?

Ce guide est destiné aux **développeurs d'entreprises** qui veulent :

- Créer des applications IA personnalisées
- Consommer les capacités IA de SUPERFASTTT via API
- Intégrer l'IA dans leurs workflows existants
- Maîtriser leur stack IA sans dépendance externe

### Architecture Générale

```
┌─────────────────────────────────────────┐
│   Votre Application Tierce              │
│   (Next.js, React, Vue, Mobile...)      │
│                                         │
│   📱 Interface utilisateur custom       │
│   🔐 Auth partagée via SDK              │
│   🎨 Design propre à votre marque       │
└────────────┬────────────────────────────┘
             │
             │ HTTPS + JWT
             ▼
┌─────────────────────────────────────────┐
│   SUPERFASTTT Core Backend              │
│   (Instance dédiée à votre entreprise)  │
│                                         │
│   🔌 API REST                           │
│   🤖 MCP Tools                          │
│   🧠 RAG Engine                         │
│   💬 LLM Orchestration                  │
│   📊 Analytics                          │
└─────────────────────────────────────────┘
```

---

## Quick Start

### Prérequis

- **Node.js** 18+ ou 20+
- **npm** ou **yarn** ou **pnpm**
- **Compte SUPERFASTTT** avec instance dédiée
- **API Key** (fournie par votre admin SUPERFASTTT)

### 1. Créer Votre Premier Projet

```bash
# Créer une app Next.js
npx create-next-app@latest my-superfasttt-app
cd my-superfasttt-app

# Installer le SDK SUPERFASTTT
npm install @superfasttt/sdk

# Installer React Query (recommandé)
npm install @tanstack/react-query
```

### 2. Configuration

Créez un fichier `.env.local` :

```bash
# URL de votre instance SUPERFASTTT
NEXT_PUBLIC_SUPERFASTTT_API_URL=https://votre-instance.superfasttt.com/api

# API Key (fournie par votre admin)
SUPERFASTTT_API_KEY=sk_live_xxxxxxxxxxxxxxxxxxxxx
```

### 3. Premier Appel API

```typescript
// lib/superfasttt.ts
import { SuperfastttClient } from '@superfasttt/sdk'

export const client = new SuperfastttClient({
  apiUrl: process.env.NEXT_PUBLIC_SUPERFASTTT_API_URL!,
  apiKey: process.env.SUPERFASTTT_API_KEY!,
})
```

```typescript
// app/page.tsx
'use client'

import { useQuery } from '@tanstack/react-query'
import { client } from '@/lib/superfasttt'

export default function HomePage() {
  const { data: documents, isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: () => client.documents.list()
  })

  if (isLoading) return <div>Chargement...</div>

  return (
    <div>
      <h1>Mes Documents</h1>
      <ul>
        {documents?.map(doc => (
          <li key={doc.id}>{doc.filename}</li>
        ))}
      </ul>
    </div>
  )
}
```

### 4. Tester

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) et vous devriez voir vos documents !

---

## Architecture Core

### Vue d'ensemble du Backend

SUPERFASTTT Core est composé de plusieurs modules :

```
SUPERFASTTT Core Backend
├── Auth Module              # JWT, RBAC, Users
├── Documents Module         # Upload, RAG, Search
├── Conversations Module     # Chat, History, Context
├── Agents Module            # AI Agents, Orchestration
├── MCP Module               # MCP Tools Registry
├── Integrations Module      # Google Drive, Notion, Slack...
├── Webhooks Module          # Event subscriptions
└── Analytics Module         # Usage, Costs, Performance
```

### API REST Disponibles

| Module            | Endpoints              | Description                  |
| ----------------- | ---------------------- | ---------------------------- |
| **Auth**          | `/api/auth/*`          | Login, logout, refresh token |
| **Users**         | `/api/users/*`         | CRUD utilisateurs            |
| **Documents**     | `/api/documents/*`     | Upload, query, search        |
| **Conversations** | `/api/conversations/*` | Chat, historique             |
| **Agents**        | `/api/agents/*`        | Exécuter agents IA           |
| **MCP**           | `/api/mcp/*`           | Appeler MCP tools            |
| **Webhooks**      | `/api/webhooks/*`      | S'abonner aux events         |
| **Analytics**     | `/api/analytics/*`     | Usage et statistiques        |

### MCP Tools Disponibles

MCP (Model Context Protocol) expose des outils appelables par les agents IA :

| Tool                 | Description                                        |
| -------------------- | -------------------------------------------------- |
| `analyze_document`   | Analyse un document (summary, entities, keywords)  |
| `search_knowledge`   | Recherche sémantique dans la base de connaissances |
| `chat_with_context`  | Chat avec contexte RAG                             |
| `extract_entities`   | Extrait les entités nommées d'un texte             |
| `generate_summary`   | Génère un résumé de document                       |
| `translate_text`     | Traduction multi-langue                            |
| `sentiment_analysis` | Analyse de sentiment                               |
| ...                  | +15 autres tools                                   |

### Webhooks Disponibles

| Event                  | Déclenché quand              |
| ---------------------- | ---------------------------- |
| `document.uploaded`    | Un document est uploadé      |
| `document.processed`   | Un document est indexé       |
| `conversation.started` | Une conversation démarre     |
| `conversation.message` | Un message est envoyé        |
| `agent.executed`       | Un agent IA s'exécute        |
| `analytics.threshold`  | Un seuil d'usage est atteint |

---

## Authentification

### Obtenir une API Key

1. Connectez-vous à l'Admin UI de votre instance SUPERFASTTT
2. Allez dans **Settings → API Keys**
3. Cliquez sur **Generate New Key**
4. Copiez la clé (elle ne sera affichée qu'une fois)

**Types de clés :**

- `sk_live_*` : Clé de production
- `sk_test_*` : Clé de test (rate limits plus souples)

### Flow JWT

```
1. Votre app envoie API Key dans header Authorization
   → Authorization: Bearer sk_live_xxx

2. SUPERFASTTT valide la clé et retourne un JWT
   → Token valide 24h

3. Votre app stocke le JWT (localStorage ou cookie)

4. Tous les appels API incluent le JWT
   → Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

5. Backend valide le JWT et vérifie les permissions
```

### Exemple : Authentification

```typescript
// lib/auth.ts
import { SuperfastttClient } from '@superfasttt/sdk'

const client = new SuperfastttClient({
  apiUrl: process.env.NEXT_PUBLIC_SUPERFASTTT_API_URL!,
})

export async function login(apiKey: string) {
  // Authentifier avec API Key
  const { token, user } = await client.auth.authenticate(apiKey)

  // Stocker le token
  localStorage.setItem('superfasttt_token', token)

  // Configurer le client avec le token
  client.setToken(token)

  return { token, user }
}

export async function logout() {
  localStorage.removeItem('superfasttt_token')
  client.setToken(null)
}

export function getStoredToken(): string | null {
  return localStorage.getItem('superfasttt_token')
}
```

### Permissions et RBAC

Chaque utilisateur a des **permissions granulaires** :

```typescript
// Exemple de payload JWT
{
  "sub": "user_123",
  "tenant_id": "acme_corp",
  "email": "dev@acme.com",
  "roles": ["developer"],
  "permissions": [
    "documents.read",
    "documents.create",
    "conversations.read",
    "conversations.create",
    "agents.execute"
  ],
  "exp": 1736953200
}
```

**Format des permissions** : `{resource}.{action}`

**Vérification côté client (UX)** :

```typescript
function UploadButton({ user }) {
  const canUpload = user.permissions.includes('documents.create')

  if (!canUpload) {
    return <div>Accès refusé - Contactez votre admin</div>
  }

  return <button onClick={handleUpload}>Upload Document</button>
}
```

**Vérification côté backend (sécurité)** :

Toutes les routes API vérifient automatiquement les permissions. Si vous n'avez pas la permission, vous recevez une erreur `403 Forbidden`.

---

## API REST

### Documents API

#### Upload Document

**POST** `/api/documents`

Upload et indexe un document dans le RAG.

**Permissions** : `documents.create`

**Request** :

```bash
curl -X POST https://instance.superfasttt.com/api/documents \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@document.pdf"
```

**Response** :

```json
{
  "id": "doc_abc123",
  "filename": "document.pdf",
  "size": 245678,
  "mime_type": "application/pdf",
  "status": "processing",
  "created_at": "2025-01-15T10:00:00Z"
}
```

**SDK** :

```typescript
const doc = await client.documents.upload(file)
console.log(doc.id) // doc_abc123
```

#### List Documents

**GET** `/api/documents`

Liste tous les documents avec filtres.

**Permissions** : `documents.read`

**Query Parameters** :

- `status` : `processing`, `completed`, `failed`
- `limit` : Nombre de résultats (défaut: 10)
- `offset` : Pagination (défaut: 0)

**Request** :

```bash
curl https://instance.superfasttt.com/api/documents?status=completed&limit=20 \
  -H "Authorization: Bearer $TOKEN"
```

**SDK** :

```typescript
const documents = await client.documents.list({
  status: 'completed',
  limit: 20,
})
```

#### Query Document

**POST** `/api/documents/{document_id}/query`

Pose une question sur un document spécifique.

**Permissions** : `documents.read`

**Request** :

```bash
curl -X POST https://instance.superfasttt.com/api/documents/doc_abc123/query \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Quel est le résumé de ce document?",
    "include_sources": true
  }'
```

**Response** :

```json
{
  "answer": "Ce document traite de l'architecture microservices...",
  "sources": [
    {
      "page": 2,
      "content": "Les microservices permettent...",
      "score": 0.95
    }
  ],
  "confidence": 0.92,
  "model": "gpt-4o-mini",
  "tokens_used": 1250
}
```

**SDK** :

```typescript
const result = await client.documents.query('doc_abc123', {
  query: 'Quel est le résumé?',
  includeSources: true,
})

console.log(result.answer)
console.log(result.sources)
```

#### Search Documents

**POST** `/api/documents/search`

Recherche sémantique dans tous les documents.

**Permissions** : `documents.read`

**Request** :

```bash
curl -X POST https://instance.superfasttt.com/api/documents/search \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "architecture microservices",
    "limit": 5
  }'
```

**SDK** :

```typescript
const results = await client.documents.search({
  query: 'architecture microservices',
  limit: 5,
})

results.forEach((result) => {
  console.log(result.document.filename, result.score)
})
```

### Conversations API

#### Create Conversation

**POST** `/api/conversations`

Crée une nouvelle conversation.

**Permissions** : `conversations.create`

**SDK** :

```typescript
const conversation = await client.conversations.create({
  title: 'Discussion sur le projet X',
  model: 'gpt-4o-mini',
  systemPrompt: 'Tu es un assistant expert en architecture logicielle.',
})
```

#### Send Message

**POST** `/api/conversations/{conversation_id}/messages`

Envoie un message dans une conversation.

**Permissions** : `conversations.create`

**SDK** :

```typescript
const response = await client.conversations.sendMessage(conversationId, {
  content: 'Explique-moi les microservices',
  includeContext: true, // Inclure le RAG
  documents: ['doc_abc123'], // Documents de contexte
})

console.log(response.content) // Réponse de l'IA
console.log(response.sources) // Sources RAG utilisées
```

### Agents API

#### Execute Agent

**POST** `/api/agents/{agent_id}/execute`

Exécute un agent IA avec des paramètres.

**Permissions** : `agents.execute`

**SDK** :

```typescript
const result = await client.agents.execute('agent_summarizer', {
  input: {
    documentId: 'doc_abc123',
    maxLength: 500,
  },
})

console.log(result.output)
console.log(result.executionTime)
console.log(result.tokensUsed)
```

### Analytics API

#### Get Usage Stats

**GET** `/api/analytics/usage`

Récupère les statistiques d'usage.

**Permissions** : `analytics.read`

**SDK** :

```typescript
const stats = await client.analytics.getUsage({
  startDate: '2025-01-01',
  endDate: '2025-01-31',
  groupBy: 'day',
})

console.log(stats.totalTokens)
console.log(stats.totalCost)
console.log(stats.byModel)
```

---

## MCP Tools

### Qu'est-ce que MCP ?

**MCP (Model Context Protocol)** est un protocole qui expose des outils appelables par les agents IA ou directement via API.

Chaque tool a :

- Un **nom** unique
- Une **description** pour l'IA
- Des **paramètres** typés (JSON Schema)
- Une **fonction d'exécution**

### Liste des Tools Disponibles

#### analyze_document

Analyse un document et extrait des informations structurées.

**Paramètres** :

- `document_id` (string, required) : ID du document
- `analysis_type` (enum, required) : `summary`, `entities`, `keywords`, `sentiment`

**Exemple** :

```typescript
const result = await client.mcp.call('analyze_document', {
  document_id: 'doc_abc123',
  analysis_type: 'summary',
})

console.log(result.data.summary)
```

#### search_knowledge

Recherche sémantique dans la base de connaissances.

**Paramètres** :

- `query` (string, required) : Question ou recherche
- `filters` (object, optional) : Filtres (type, date, etc.)
- `limit` (integer, optional) : Nombre de résultats (défaut: 5)

**Exemple** :

```typescript
const results = await client.mcp.call('search_knowledge', {
  query: 'Quels sont nos processus de déploiement?',
  filters: {
    document_type: 'documentation',
    date_range: {
      start: '2024-01-01',
      end: '2025-01-31',
    },
  },
  limit: 10,
})

results.data.results.forEach((r) => {
  console.log(r.content, r.score)
})
```

#### chat_with_context

Chat avec un agent IA ayant accès au contexte documentaire.

**Paramètres** :

- `message` (string, required) : Message utilisateur
- `conversation_id` (string, optional) : ID conversation existante
- `documents` (array, optional) : IDs des documents de contexte
- `model` (string, optional) : Modèle LLM (défaut: gpt-4o-mini)

**Exemple** :

```typescript
const response = await client.mcp.call('chat_with_context', {
  message: 'Résume les documents sélectionnés',
  documents: ['doc_abc123', 'doc_def456'],
  model: 'gpt-4o-mini',
})

console.log(response.data.response)
console.log(response.data.sources)
```

### Appeler un Tool

#### Via SDK

```typescript
const result = await client.mcp.call('tool_name', {
  param1: 'value1',
  param2: 'value2',
})

if (result.success) {
  console.log(result.data)
} else {
  console.error(result.error)
}
```

#### Via API REST

```bash
curl -X POST https://instance.superfasttt.com/api/mcp/call \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "analyze_document",
    "parameters": {
      "document_id": "doc_abc123",
      "analysis_type": "summary"
    }
  }'
```

---

## SDK TypeScript

### Installation

```bash
npm install @superfasttt/sdk
```

### Configuration

```typescript
import { SuperfastttClient } from '@superfasttt/sdk'

const client = new SuperfastttClient({
  apiUrl: 'https://instance.superfasttt.com/api',
  apiKey: process.env.SUPERFASTTT_API_KEY,
})
```

### Modules Disponibles

#### Documents

```typescript
// Upload
const doc = await client.documents.upload(file)

// List
const docs = await client.documents.list({ status: 'completed' })

// Get
const doc = await client.documents.get('doc_abc123')

// Query
const result = await client.documents.query('doc_abc123', {
  query: 'Résumé?',
})

// Search
const results = await client.documents.search({ query: 'microservices' })

// Delete
await client.documents.delete('doc_abc123')
```

#### Conversations

```typescript
// Create
const conv = await client.conversations.create({
  title: 'Discussion',
  model: 'gpt-4o-mini',
})

// Send message
const response = await client.conversations.sendMessage(conv.id, {
  content: 'Hello!',
})

// Get history
const messages = await client.conversations.getMessages(conv.id)

// Delete
await client.conversations.delete(conv.id)
```

#### Agents

```typescript
// List agents
const agents = await client.agents.list()

// Execute
const result = await client.agents.execute('agent_id', {
  input: { ... }
})

// Get execution status
const status = await client.agents.getExecutionStatus('execution_id')
```

#### MCP Tools

```typescript
// List tools
const tools = await client.mcp.listTools()

// Call tool
const result = await client.mcp.call('tool_name', { param: 'value' })
```

#### Analytics

```typescript
// Usage stats
const usage = await client.analytics.getUsage({
  startDate: '2025-01-01',
  endDate: '2025-01-31',
})

// Costs
const costs = await client.analytics.getCosts({
  groupBy: 'model',
})
```

### Types TypeScript

Le SDK est entièrement typé :

```typescript
import type { Document, Conversation, Message, Agent, MCPTool, UsageStats } from '@superfasttt/sdk'

const doc: Document = await client.documents.get('doc_abc123')
const conv: Conversation = await client.conversations.create({ title: 'Test' })
```

### Hooks React

```typescript
import {
  useDocuments,
  useConversations,
  useAgents
} from '@superfasttt/sdk/react'

function MyComponent() {
  const { data: documents, isLoading } = useDocuments()
  const { mutate: sendMessage } = useSendMessage()

  return (
    <div>
      {isLoading ? 'Loading...' : (
        <ul>
          {documents?.map(doc => (
            <li key={doc.id}>{doc.filename}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

---

## Développer une App Tierce

### Setup Projet

#### 1. Créer le projet

```bash
npx create-next-app@latest my-app
cd my-app
npm install @superfasttt/sdk @tanstack/react-query
```

#### 2. Configuration

```typescript
// lib/superfasttt.ts
import { SuperfastttClient } from '@superfasttt/sdk'

export const client = new SuperfastttClient({
  apiUrl: process.env.NEXT_PUBLIC_SUPERFASTTT_API_URL!,
  apiKey: process.env.SUPERFASTTT_API_KEY!,
})
```

```typescript
// app/providers.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SuperfastttProvider } from '@superfasttt/sdk/react'

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuperfastttProvider client={client}>
        {children}
      </SuperfastttProvider>
    </QueryClientProvider>
  )
}
```

### Intégration UI

#### Composants de Base

```typescript
// components/DocumentUpload.tsx
'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSuperfasttt } from '@superfasttt/sdk/react'

export function DocumentUpload() {
  const [file, setFile] = useState<File | null>(null)
  const client = useSuperfasttt()
  const queryClient = useQueryClient()

  const upload = useMutation({
    mutationFn: (file: File) => client.documents.upload(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      setFile(null)
    }
  })

  return (
    <div>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button
        onClick={() => file && upload.mutate(file)}
        disabled={!file || upload.isPending}
      >
        {upload.isPending ? 'Upload...' : 'Upload'}
      </button>
      {upload.isError && <div>Erreur: {upload.error.message}</div>}
    </div>
  )
}
```

```typescript
// components/DocumentsList.tsx
'use client'

import { useQuery } from '@tanstack/react-query'
import { useSuperfasttt } from '@superfasttt/sdk/react'

export function DocumentsList() {
  const client = useSuperfasttt()

  const { data: documents, isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: () => client.documents.list()
  })

  if (isLoading) return <div>Loading...</div>

  return (
    <ul>
      {documents?.map(doc => (
        <li key={doc.id}>
          <span>{doc.filename}</span>
          <span>{doc.status}</span>
        </li>
      ))}
    </ul>
  )
}
```

### Best Practices

#### 1. Sécurité

```typescript
// ❌ NE JAMAIS exposer l'API key côté client
const client = new SuperfastttClient({
  apiKey: 'sk_live_xxx', // DANGER !
})

// ✅ Utiliser une route API Next.js
// app/api/superfasttt/route.ts
export async function POST(request: Request) {
  const client = new SuperfastttClient({
    apiKey: process.env.SUPERFASTTT_API_KEY!, // Server-side only
  })

  const body = await request.json()
  const result = await client.documents.query(body.docId, body.query)

  return Response.json(result)
}
```

#### 2. Performance

```typescript
// ✅ Utiliser React Query pour le caching
const { data } = useQuery({
  queryKey: ['documents'],
  queryFn: () => client.documents.list(),
  staleTime: 5 * 60 * 1000, // Cache 5 minutes
})
```

#### 3. Error Handling

```typescript
// ✅ Gérer les erreurs proprement
const upload = useMutation({
  mutationFn: (file: File) => client.documents.upload(file),
  onError: (error) => {
    if (error.response?.status === 403) {
      toast.error('Permission refusée')
    } else if (error.response?.status === 429) {
      toast.error('Rate limit atteint - réessayez plus tard')
    } else {
      toast.error("Erreur lors de l'upload")
    }
  },
})
```

---

## Exemples Complets

### 1. App de Chat avec RAG

```typescript
// app/chat/page.tsx
'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useSuperfasttt } from '@superfasttt/sdk/react'

export default function ChatPage() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [conversationId, setConversationId] = useState(null)
  const client = useSuperfasttt()

  // Créer conversation au mount
  useEffect(() => {
    client.conversations.create({ title: 'New Chat' })
      .then(conv => setConversationId(conv.id))
  }, [])

  const sendMessage = useMutation({
    mutationFn: (content: string) =>
      client.conversations.sendMessage(conversationId, {
        content,
        includeContext: true
      }),
    onSuccess: (response) => {
      setMessages(prev => [
        ...prev,
        { role: 'user', content: input },
        { role: 'assistant', content: response.content, sources: response.sources }
      ])
      setInput('')
    }
  })

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <div>{msg.content}</div>
            {msg.sources && (
              <div className="sources">
                Sources:
                {msg.sources.map((s, j) => (
                  <span key={j}>{s.document.filename} (p.{s.page})</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage.mutate(input)}
          placeholder="Posez votre question..."
        />
        <button
          onClick={() => sendMessage.mutate(input)}
          disabled={!input || sendMessage.isPending}
        >
          Envoyer
        </button>
      </div>
    </div>
  )
}
```

### 2. App de Gestion Documentaire

```typescript
// app/documents/page.tsx
'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSuperfasttt } from '@superfasttt/sdk/react'

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDoc, setSelectedDoc] = useState(null)
  const client = useSuperfasttt()
  const queryClient = useQueryClient()

  // Liste des documents
  const { data: documents } = useQuery({
    queryKey: ['documents'],
    queryFn: () => client.documents.list()
  })

  // Upload
  const upload = useMutation({
    mutationFn: (file: File) => client.documents.upload(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    }
  })

  // Recherche
  const search = useMutation({
    mutationFn: (query: string) =>
      client.documents.search({ query, limit: 10 })
  })

  // Query document
  const queryDoc = useMutation({
    mutationFn: ({ docId, query }: { docId: string, query: string }) =>
      client.documents.query(docId, { query })
  })

  return (
    <div className="documents-page">
      <aside className="sidebar">
        <div className="upload">
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) upload.mutate(file)
            }}
          />
        </div>

        <div className="search">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher..."
          />
          <button onClick={() => search.mutate(searchQuery)}>
            Rechercher
          </button>
        </div>

        <ul className="documents-list">
          {documents?.map(doc => (
            <li
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className={selectedDoc?.id === doc.id ? 'active' : ''}
            >
              {doc.filename}
            </li>
          ))}
        </ul>
      </aside>

      <main className="content">
        {selectedDoc ? (
          <DocumentViewer
            document={selectedDoc}
            onQuery={(query) => queryDoc.mutate({
              docId: selectedDoc.id,
              query
            })}
            queryResult={queryDoc.data}
          />
        ) : (
          <div>Sélectionnez un document</div>
        )}
      </main>
    </div>
  )
}
```

---

## Déploiement

### Build Production

```bash
npm run build
npm run start
```

### Variables d'Environnement

```bash
# Production
NEXT_PUBLIC_SUPERFASTTT_API_URL=https://prod-instance.superfasttt.com/api
SUPERFASTTT_API_KEY=sk_live_xxxxxxxxxxxxx

# Staging
NEXT_PUBLIC_SUPERFASTTT_API_URL=https://staging-instance.superfasttt.com/api
SUPERFASTTT_API_KEY=sk_test_xxxxxxxxxxxxx
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## Troubleshooting

### Erreurs Communes

#### 401 Unauthorized

```
Cause: Token invalide ou expiré
Solution: Vérifier l'API key ou rafraîchir le token
```

#### 403 Forbidden

```
Cause: Permission manquante
Solution: Vérifier les permissions de votre user dans Admin UI
```

#### 429 Too Many Requests

```
Cause: Rate limit atteint
Solution: Implémenter un système de retry avec backoff
```

### Debugging

```typescript
// Activer les logs du SDK
const client = new SuperfastttClient({
  apiUrl: '...',
  apiKey: '...',
  debug: true, // Affiche tous les appels API
})
```

### Support

- 📧 Email: support@superfasttt.com
- 📚 Documentation: https://docs.superfasttt.com
- 💬 Discord: https://discord.gg/superfasttt

---

**© 2025 SUPERFASTTT - Guide Développeur v1.0**
