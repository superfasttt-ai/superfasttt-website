# 🧠 Documentation technique : Multi-RAG & Multi-Modèles dans SUPERFASTTT

## 🎯 Objectif

Ce document décrit comment **SUPERFASTTT** gère :

- la **recherche inter-RAG** (recherche entre plusieurs espaces cognitifs d’entreprise),
- la **sélection dynamique de modèles IA** selon les métiers, services et usages,
- et la **configuration simplifiée dans l’interface d’administration**, guidée par des suggestions intelligentes.

---

## 🧩 1. Vision globale

Chaque entreprise possède plusieurs réalités cognitives : ingénierie, RH, commerce, qualité, direction…  
Chaque domaine nécessite une combinaison différente de modèles **LLM + Embedding + Vector Store**.

L’idée : faire du **Cortex de connaissance SUPERFASTTT** un système **multi-profil**, où chaque service dispose de son propre moteur d’intelligence.

---

## ⚙️ 2. Architecture conceptuelle

```
Entreprise
│
├── Profils IA
│   ├── technique_industriel  → mxbai + Mistral
│   ├── commercial            → text-embedding-3-small + GPT-4o-mini
│   ├── rh                    → bge-fr + Claude 3 Sonnet
│   └── direction             → voyage-3 + Ministral-8x7b
│
└── RAGs associés
    ├── RAG Technique
    ├── RAG RH
    ├── RAG Commercial
    └── RAG Global
```

Chaque RAG utilise le **profil IA** le plus adapté à son métier.  
Les recherches transversales sont orchestrées par **LlamaIndex RouterQueryEngine**.

---

## 🧠 3. Interface d’administration : gestion des profils IA

### 🔧 Vue principale : IA Profiles

```
[IA Profiles]
───────────────────────────────────────────────
Profil : technique_industriel
Embedding : mxbai-embed-large-v1 (1024)
LLM : mistral/open-mixtral
Vector Store : pgvector
Chunk size : 600 tokens

Profil : commercial
Embedding : text-embedding-3-small (1536)
LLM : openai/gpt-4o-mini
Vector Store : pgvector
Chunk size : 400 tokens

[+ Ajouter un profil] [Tester] [Comparer] [Suggestions]
───────────────────────────────────────────────
```

Chaque profil est **éditable**, avec :

- un sélecteur de modèle d’embedding (local, cloud, souverain),
- un sélecteur de LLM (Mistral, OpenAI, Anthropic, Ollama),
- les paramètres de chunking, vectorisation et filtrage.

Les changements sont sauvegardés dans `tenant_config`.

---

## 🤖 4. Système de suggestions intelligentes

### Logique d’aide à la configuration

L’assistant IA de configuration analyse :

- le nom du RAG,
- le type de données stockées,
- et les besoins déclarés (coût, souveraineté, performance).

Il propose automatiquement le meilleur profil :

```typescript
if (rag_name.includes('tech') || rag_name.includes('plan')) {
  suggest_profile = 'technique_industriel' // Mistral + mxbai
}
if (rag_name.includes('rh') || rag_name.includes('cv')) {
  suggest_profile = 'rh_multilingue' // Claude + bge-fr
}
if (rag_name.includes('client') || rag_name.includes('vente')) {
  suggest_profile = 'commercial' // GPT-4o-mini + text-embedding-3-small
}
```

### Interface d’aide contextuelle

```
💡 Suggestion automatique :
Le RAG "plans_ingénierie" contient 1 200 documents techniques.
Profil suggéré : [technique_industriel] (Mistral + mxbai)
→ Pertinence : ★★★★★  |  Coût estimé : €€  |  Souveraineté : 100 %
```

L’administrateur peut :

- **Accepter** la suggestion (1 clic),
- **Personnaliser** les modèles,
- **Comparer** avec un autre profil IA.

---

## 🧩 5. Comparaison et A/B Testing des profils IA

Depuis l’admin, l’utilisateur peut comparer deux profils IA sur une même requête :

```
🔬 Comparer les profils
───────────────────────────────────────────────
Question test : "Quels incidents techniques ont affecté la production ?"

Profil A : technique_industriel
Profil B : commercial

Résultats :
- Pertinence : A = 9.2 / 10 | B = 7.4 / 10
- Latence : A = 480 ms | B = 320 ms
- Coût : A = 0.0031 € | B = 0.0057 €

➡ Profil recommandé : technique_industriel
───────────────────────────────────────────────
```

Les résultats sont enregistrés pour affiner les suggestions futures.

---

## ⚡ 6. Observabilité et métriques IA

Un dashboard Grafana dédié suit les performances par profil IA :

```sql
SELECT
  profile_name,
  AVG(latency_ms) AS avg_latency,
  SUM(cost_usd) AS total_cost,
  COUNT(*) AS query_count
FROM llm_usage
GROUP BY profile_name;
```

### Indicateurs affichés :

- Temps moyen de réponse par profil
- Coût cumulé par mois
- Taux d’utilisation de chaque profil
- Taux d’erreur / fallback
- Corrélation entre latence et qualité perçue

---

## 🔄 7. Gestion du “profil par défaut”

Lorsqu’aucun profil n’est spécifié dans un RAG, SUPERFASTTT applique le profil **`balanced`** :

```json
{
  "default_profile": "balanced",
  "balanced": {
    "embedding": "text-embedding-3-small",
    "llm": "gpt-4o-mini",
    "use_case": "usage général équilibré coût/qualité"
  }
}
```

Ce profil garantit une expérience homogène dès l’installation initiale.

---

## ✅ 8. Avantages clés

| Avantage              | Description                                        |
| --------------------- | -------------------------------------------------- |
| 🎯 Pertinence métier  | Chaque département bénéficie du modèle adapté      |
| 💰 Économie IA        | Usage raisonné des modèles coûteux                 |
| 🔐 Souveraineté       | Choix par service du niveau d’exposition cloud     |
| ⚙️ Flexibilité        | Migration progressive possible sans rupture        |
| 🧠 Auto-apprentissage | Les suggestions IA s’améliorent avec l’usage       |
| 📊 Transparence       | Suivi des coûts, latence et performance par profil |

---

## 🚀 9. Étapes de développement

1. Créer le module `core/admin/ia_profiles.py` pour la gestion des profils.
2. Créer le composant UI `AdminIAProfiles` (React + shadcn/ui).
3. Intégrer l’assistant de suggestions IA.
4. Connecter les métriques Grafana.
5. Ajouter A/B testing et visualisation des performances.
6. Synchroniser le `tenant_config` avec PostgreSQL.

---

## 🧩 10. En résumé

| Élément                    | Description                                             |
| -------------------------- | ------------------------------------------------------- |
| **Multi-profils IA**       | Un moteur IA par métier ou service                      |
| **Multi-RAG**              | Requêtes transversales entre domaines                   |
| **Admin guidée par IA**    | Suggestions et comparateurs automatiques                |
| **Souveraineté adaptable** | Local, cloud, mixte                                     |
| **Pilotage complet**       | Coût, pertinence, latence mesurables                    |
| **Résultat final**         | Une IA d’entreprise configurable, souveraine et vivante |

---

**Document interne – SUPERFASTTT AI Platform v2.3**  
Auteur : Matsiya | Date : 2025-11
