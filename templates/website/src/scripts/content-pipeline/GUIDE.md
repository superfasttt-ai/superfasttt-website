# Content Pipeline - Guide d'utilisation

Pipeline de génération de contenu IA pour SUPERFASTTT. Génère automatiquement des pages services, industries, métiers et comparatifs en 3 langues (FR, EN, ES).

## Configuration requise

### Variables d'environnement

Ajouter dans `.env` :

```bash
# Obligatoire - Clé API Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Optionnel - Clé API Serper.dev pour la recherche web
SERPER_API_KEY=...

# Optionnel - Configuration avancée
ANTHROPIC_MODEL=claude-sonnet-4-20250514  # Modèle par défaut
ANTHROPIC_MAX_TOKENS=4096                  # Tokens max par requête
ANTHROPIC_RATE_LIMIT=50                    # Requêtes/minute
```

---

## Commandes disponibles

### Prévisualisation (avant génération)

```bash
# Voir le résumé du brief produit
pnpm content:preview

# Voir le brief produit complet (JSON)
pnpm content:preview --full

# Prévisualiser un service spécifique
pnpm content:preview --service=rag
pnpm content:preview --service=orchestration
pnpm content:preview --service=gouvernance

# Prévisualiser une industrie
pnpm content:preview --industry=sante
pnpm content:preview --industry=finance
pnpm content:preview --industry=juridique

# Prévisualiser un métier
pnpm content:preview --metier=dsi
pnpm content:preview --metier=dirigeants
pnpm content:preview --metier=dpo

# Prévisualiser un concurrent
pnpm content:preview --competitor=microsoft-copilot
pnpm content:preview --competitor=chatgpt-enterprise

# Voir un template de prompt
pnpm content:preview --prompt=service
pnpm content:preview --prompt=industry
pnpm content:preview --prompt=metier
pnpm content:preview --prompt=comparison

# Changer la langue de prévisualisation
pnpm content:preview --service=rag --locale=en
pnpm content:preview --industry=sante --locale=es
```

### Taxonomie

```bash
# Voir le résumé de la taxonomie
pnpm content:taxonomy

# Lister tous les éléments
pnpm content:taxonomy --list
```

### Génération de contenu

```bash
# Dry run - prévisualiser sans générer
pnpm content:dry-run
pnpm content:dry-run --type=service
pnpm content:dry-run --batch=1

# Générer les 10 prochaines pages (FR uniquement)
pnpm content:generate

# Générer pour toutes les langues
pnpm content:generate --all-locales

# Générer par type
pnpm content:generate --type=service
pnpm content:generate --type=industry
pnpm content:generate --type=metier
pnpm content:generate --type=comparison

# Raccourcis par type (toutes langues)
pnpm content:services
pnpm content:industries
pnpm content:metiers

# Filtrer par batch
pnpm content:generate --batch=1
pnpm content:generate --batch=2

# Filtrer par priorité
pnpm content:generate --priority=high
pnpm content:generate --priority=medium

# Générer une page spécifique
pnpm content:generate --id=service-rag
pnpm content:generate --id=industry-sante --all-locales

# Limiter le nombre de pages
pnpm content:generate --limit=5
pnpm content:generate --limit=20 --type=service

# Sans recherche Serper.dev
pnpm content:generate --no-research

# Sans génération de briefs images
pnpm content:generate --no-images

# Combinaisons
pnpm content:generate --type=service --batch=1 --all-locales --limit=5
```

### Suivi et gestion

```bash
# Voir le statut de progression
pnpm content:status

# Voir les erreurs
pnpm content:errors

# Réinitialiser les erreurs pour réessayer
pnpm content:errors --reset
```

---

## Structure des fichiers

```
content-pipeline/
├── index.ts                     # Orchestrateur principal
├── config.ts                    # Configuration
├── types.ts                     # Types TypeScript
│
├── briefs/
│   └── product-brief.ts         # Brief produit SUPERFASTTT
│
├── ai/
│   ├── client.ts                # Client Claude API (rate limiting)
│   └── prompt-loader.ts         # Chargeur de prompts
│
├── prompts/                     # Templates éditables
│   ├── system/
│   │   ├── base.md              # Prompt système de base
│   │   ├── tone-fr.md           # Style français
│   │   ├── tone-en.md           # Style anglais
│   │   └── tone-es.md           # Style espagnol
│   ├── pages/
│   │   ├── service-page.md      # Template service
│   │   ├── industry-page.md     # Template industrie
│   │   ├── metier-page.md       # Template métier
│   │   ├── comparison-page.md   # Template comparatif
│   │   └── blog-post.md         # Template blog
│   └── images/
│       └── brief-generator.md   # Briefs pour images IA
│
├── taxonomy/
│   ├── index.ts                 # Export centralisé
│   ├── services.ts              # 17 services
│   ├── industries.ts            # 12 industries
│   ├── metiers.ts               # 14 métiers
│   └── competitors.ts           # 9 concurrents
│
├── research/
│   └── serper-client.ts         # Client Serper.dev + cache
│
├── generators/
│   └── page-generator.ts        # Génération via Claude
│
├── publishers/
│   └── page-publisher.ts        # Publication Payload
│
├── registry/
│   └── content-registry.ts      # Suivi de progression
│
└── commands/
    ├── generate.ts              # pnpm content:generate
    ├── status.ts                # pnpm content:status
    ├── errors.ts                # pnpm content:errors
    ├── taxonomy.ts              # pnpm content:taxonomy
    └── preview-brief.ts         # pnpm content:preview
```

---

## Workflow recommandé

### 1. Vérifier les briefs

```bash
# Vérifier le brief produit
pnpm content:preview

# Vérifier la taxonomie
pnpm content:taxonomy --list

# Vérifier quelques éléments clés
pnpm content:preview --service=rag
pnpm content:preview --industry=sante
pnpm content:preview --metier=dsi
```

### 2. Dry run

```bash
# Voir ce qui sera généré
pnpm content:dry-run --batch=1 --priority=high
```

### 3. Générer progressivement

```bash
# Semaine 1 - Batch 1, haute priorité, FR d'abord
pnpm content:generate --batch=1 --priority=high --limit=10

# Vérifier le statut
pnpm content:status

# Ajouter EN et ES
pnpm content:generate --batch=1 --priority=high --locale=en
pnpm content:generate --batch=1 --priority=high --locale=es

# Semaine 2 - Continuer
pnpm content:generate --batch=1 --limit=20 --all-locales
```

### 4. Gérer les erreurs

```bash
# Voir les erreurs
pnpm content:errors

# Réessayer les erreurs
pnpm content:errors --reset
pnpm content:generate --limit=5
```

---

## Taxonomie actuelle

### Services (17)

| ID                           | Titre                       | Priorité | Batch |
| ---------------------------- | --------------------------- | -------- | ----- |
| service-rag                  | RAG & Base de Connaissances | high     | 1     |
| service-rag-multimodal       | RAG Multimodal              | high     | 1     |
| service-recherche-semantique | Recherche Sémantique        | medium   | 2     |
| service-orchestration        | Orchestration Multi-Modèles | high     | 1     |
| service-multi-providers      | Multi-Fournisseurs LLM      | high     | 1     |
| service-routage-intelligent  | Routage Intelligent         | medium   | 2     |
| service-gouvernance          | Gouvernance IA              | high     | 1     |
| service-suivi-couts          | Suivi des Coûts IA          | high     | 1     |
| service-audit-trail          | Audit Trail IA              | high     | 1     |
| service-contexte-entreprise  | Contexte Entreprise         | high     | 1     |
| service-glossaire-metier     | Glossaire Métier            | medium   | 2     |
| service-memoire-utilisateur  | Mémoire Utilisateur         | high     | 1     |
| service-agents-ia            | Agents IA Métiers           | high     | 1     |
| service-integrations         | Intégrations & Connecteurs  | high     | 1     |
| service-apps-tierces         | Apps Tierces & Marketplace  | medium   | 2     |
| service-deploiement          | Déploiement & Souveraineté  | high     | 1     |

### Industries (12)

| ID                      | Titre                     | Priorité | Batch |
| ----------------------- | ------------------------- | -------- | ----- |
| industry-sante          | Santé & Médical           | high     | 1     |
| industry-finance        | Finance & Banque          | high     | 1     |
| industry-assurance      | Assurance                 | high     | 1     |
| industry-industrie      | Industrie & Manufacturing | high     | 1     |
| industry-retail         | Retail & E-commerce       | medium   | 2     |
| industry-secteur-public | Services Publics          | high     | 1     |
| industry-energie        | Énergie & Utilities       | medium   | 2     |
| industry-immobilier     | Immobilier & Construction | medium   | 2     |
| industry-transport      | Transport & Logistique    | medium   | 2     |
| industry-education      | Éducation & Formation     | medium   | 2     |
| industry-juridique      | Juridique & Cabinets      | high     | 1     |
| industry-conseil        | Conseil & Services Pro    | medium   | 2     |

### Métiers (14)

| ID                  | Titre                | Priorité | Batch |
| ------------------- | -------------------- | -------- | ----- |
| metier-dirigeants   | Dirigeants & COMEX   | high     | 1     |
| metier-dsi          | DSI & CTO            | high     | 1     |
| metier-rssi         | RSSI & Sécurité      | high     | 1     |
| metier-dpo          | DPO & Conformité     | high     | 1     |
| metier-daf          | DAF & Finance        | high     | 1     |
| metier-drh          | DRH & RH             | medium   | 2     |
| metier-juridique    | Directeur Juridique  | high     | 1     |
| metier-marketing    | Directeur Marketing  | medium   | 2     |
| metier-commercial   | Directeur Commercial | medium   | 2     |
| metier-support      | Support Client       | high     | 1     |
| metier-rnd          | R&D & Innovation     | medium   | 2     |
| metier-operations   | Opérations & COO     | medium   | 2     |
| metier-developpeurs | Développeurs & IT    | medium   | 2     |

### Concurrents (9)

| ID                 | Nom                         | Catégorie   |
| ------------------ | --------------------------- | ----------- |
| microsoft-copilot  | Microsoft 365 Copilot       | big-tech    |
| google-gemini      | Google Gemini for Workspace | big-tech    |
| chatgpt-enterprise | ChatGPT Enterprise          | big-tech    |
| amazon-q           | Amazon Q Business           | big-tech    |
| mistral-le-chat    | Mistral Le Chat             | european    |
| huggingface        | HuggingFace                 | european    |
| notion-ai          | Notion AI                   | specialized |
| langchain-diy      | LangChain / LlamaIndex      | open-source |
| ollama-local       | Ollama / LocalAI            | open-source |

---

## Estimation des pages

| Type        | Pages FR | Total (3 langues) |
| ----------- | -------- | ----------------- |
| Services    | 17       | 51                |
| Industries  | 12       | 36                |
| Métiers     | 14       | 42                |
| Comparisons | 9        | 27                |
| **Total**   | **52**   | **156**           |

---

## Modifier les prompts

Les prompts sont des fichiers `.md` éditables dans `prompts/`. Modifier directement ces fichiers pour ajuster le ton, la structure ou les consignes.

### Exemple : changer le ton français

Éditer `prompts/system/tone-fr.md` :

```markdown
## Ton

- **Confiant** sans être arrogant
- **Expert** sans être condescendant
  ...
```

### Exemple : modifier la structure d'une page service

Éditer `prompts/pages/service-page.md` pour changer les sections, le format JSON attendu, ou les consignes.

---

## Modifier la taxonomie

Éditer les fichiers dans `taxonomy/` pour ajouter, modifier ou supprimer des éléments.

### Ajouter un service

Dans `taxonomy/services.ts` :

```typescript
{
  id: 'service-nouveau',
  type: 'service',
  slug: {
    fr: 'nouveau-service',
    en: 'new-service',
    es: 'nuevo-servicio',
  },
  title: {
    fr: 'Nouveau Service',
    en: 'New Service',
    es: 'Nuevo Servicio',
  },
  // ...
}
```

Puis réinitialiser le registre :

```bash
rm -f src/scripts/content-pipeline/registry/content-registry.json
pnpm content:status  # Régénère le registre
```

---

## Coûts estimés

Avec Claude Sonnet 4 :

- ~$0.003 par 1K tokens input
- ~$0.015 par 1K tokens output
- Estimation : ~$0.10-0.20 par page générée
- Total 156 pages : ~$15-30

---

## Dépannage

### Erreur "ANTHROPIC_API_KEY is required"

```bash
# Vérifier que la clé est dans .env
cat .env | grep ANTHROPIC

# Ou exporter directement
export ANTHROPIC_API_KEY=sk-ant-...
```

### Erreur de rate limiting

Le client gère automatiquement le rate limiting (50 req/min par défaut). Si vous rencontrez des erreurs :

```bash
# Réduire la limite
export ANTHROPIC_RATE_LIMIT=30
```

### Pages en erreur

```bash
# Voir les erreurs
pnpm content:errors

# Réinitialiser et réessayer
pnpm content:errors --reset
pnpm content:generate --limit=5
```

### Registre corrompu

```bash
# Supprimer et régénérer
rm -f src/scripts/content-pipeline/registry/content-registry.json
pnpm content:status
```
