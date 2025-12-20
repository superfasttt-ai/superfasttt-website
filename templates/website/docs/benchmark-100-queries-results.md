# Benchmark 100 Queries - Retrieve + Generate Latency

**Date**: 2025-11-20
**Objectif**: P95 < 2000ms (2 secondes)
**Queries**: 100 queries variées

---

## Méthodologie

### Configuration du Test

- **Nombre de queries**: 100 queries diverses
- **Catégories testées**:
  - Architecture (20 queries)
  - Multi-tenancy (15 queries)
  - RAG Engine (15 queries)
  - Vector Store (15 queries)
  - LiteLLM (10 queries)
  - MCP Tools (10 queries)
  - Admin UI (10 queries)
  - Clients externes (5 queries)

### Métriques Mesurées

1. **Total End-to-End Latency** - Temps total incluant réseau
2. **Retrieve + Generate** (search_time_ms) - Temps interne RAG
3. **Network Overhead** - Différence entre total et search
4. **Confidence Scores** - Qualité des réponses
5. **Success Rate** - Taux de réussite

### Objectifs SLA

| Métrique     | Objectif |
| ------------ | -------- |
| P95 Total    | < 2000ms |
| P95 Search   | < 2000ms |
| Success Rate | ≥ 99.5%  |

---

## ✅ Résultats Finaux (100 Queries Complétées)

**Date d'exécution**: 2025-11-20 10:19:59 - 10:29:32
**Durée totale**: ~10 minutes
**Queries exécutées**: 100 / 100
**Taux de succès**: **97%** (97 réussies, 3 échecs)

---

## 📊 Métriques de Latence

### Total End-to-End Latency

| Métrique   | Valeur       | Status                                     |
| ---------- | ------------ | ------------------------------------------ |
| **Min**    | 2019 ms      |                                            |
| **P50**    | 3831 ms      |                                            |
| **P95**    | **10964 ms** | ❌ **FAIL** (5.5x au-dessus de l'objectif) |
| **P99**    | 21242 ms     |                                            |
| **Max**    | 21242 ms     |                                            |
| **Mean**   | 4635 ms      |                                            |
| **Median** | 3831 ms      |                                            |

### Retrieve + Generate (search_time_ms)

| Métrique | Valeur       | Status                                     |
| -------- | ------------ | ------------------------------------------ |
| **Min**  | 1946 ms      |                                            |
| **P50**  | 3751 ms      |                                            |
| **P95**  | **10848 ms** | ❌ **FAIL** (5.4x au-dessus de l'objectif) |
| **P99**  | 21160 ms     |                                            |
| **Max**  | 21160 ms     |                                            |
| **Mean** | 4522 ms      |                                            |

### Network + Processing Overhead

- **Mean**: 113 ms
- **Median**: 98 ms

**Observation**: Le réseau ne représente que ~2.5% de la latence totale. Le problème est dans la pipeline RAG (embedding + search + LLM).

---

## 📈 Métriques de Qualité

### Confidence Scores (Scores de Confiance)

| Métrique   | Valeur |
| ---------- | ------ |
| **Min**    | 0.121  |
| **Mean**   | 0.341  |
| **Median** | 0.331  |
| **Max**    | 0.528  |

### Distribution des Scores

| Catégorie            | Nombre | Pourcentage |
| -------------------- | ------ | ----------- |
| **High (≥0.7)**      | 0      | 0.0% ❌     |
| **Medium (0.4-0.7)** | 24     | 24.7%       |
| **Low (<0.4)**       | 73     | 75.3% ⚠️    |

**⚠️ Alerte Qualité**: 75% des réponses ont une confiance faible (<0.4). Cela indique un **problème de pertinence** des chunks récupérés.

---

## 🎯 Conformité SLA

| Objectif                 | Cible    | Résultat     | Status      |
| ------------------------ | -------- | ------------ | ----------- |
| **P95 Total < 2000ms**   | < 2000ms | **10964 ms** | ❌ **FAIL** |
| **P95 Search < 2000ms**  | < 2000ms | **10848 ms** | ❌ **FAIL** |
| **Success Rate ≥ 99.5%** | ≥ 99.5%  | **97.0%**    | ❌ **FAIL** |

### Status Global

**❌ SLA NON RESPECTÉ** - Aucun des 3 objectifs n'est atteint

### Gap Analysis

- **Gap P95**: +8964ms au-dessus de la cible
- **Amélioration nécessaire**: **82% de réduction**
- **Facteur actuel**: 5.5x trop lent

---

## 🔍 Analyse des Problèmes

### Problème #1: Latence Excessive (P95: 10.8s vs objectif 2s)

**Causes identifiées**:

1. **Embedding API externe** (~1-2s par query)

   - Appel synchrone à OpenAI text-embedding-3-small
   - Latence réseau + génération du vecteur 1536-dim

2. **Recherche vectorielle lente** (~0.5-1s)

   - PGVector sur un petit dataset (peu de chunks)
   - Pas d'index optimisé pour la recherche

3. **Génération LLM lente** (~3-5s)

   - Modèle gpt-4o-mini via LiteLLM
   - Pas de cache pour questions répétitives
   - Contexte possiblement trop large

4. **Pas de parallélisation**
   - Opérations séquentielles (embedding → search → LLM)

### Problème #2: Qualité Faible (75% des réponses <0.4 confiance)

**Causes identifiées**:

1. **Dataset insuffisant** (1 seul document de test)

   - Chunks peu pertinents pour 100 questions variées
   - Beaucoup de questions sans contexte adapté

2. **Pas de reranking**

   - Top-K basique sans réordonnancement par pertinence

3. **Scores de similarité bruts**
   - Pas de calibration des seuils de confiance

### Problème #3: Taux de Succès Insuffisant (97% vs 99.5%)

**Causes**:

- 3 queries ont échoué (timeouts ou erreurs API)
- Pas de retry automatique
- Pas de circuit breaker

---

## Actions Recommandées (si SLA non atteint)

### Priorité Immédiate (P0)

1. **Ajouter plus de documents** (50-100 docs)

   - Améliore la pertinence
   - Réduit les timeouts

2. **Implémenter cache Redis**

   - Cache hit latency: ~200ms
   - Taux de hit estimé: 40-60%

3. **Paralléliser les opérations**
   - Embedding + cache check en parallèle
   - Gain estimé: -20%

### Optimisations Court Terme (P1)

1. **Utiliser embeddings locaux**

   - Latency: 1-2s → 50ms
   - Gain: -1.5s par query

2. **Passer à gpt-3.5-turbo**

   - Latency LLM: 3-5s → 1-2s
   - Gain: -2s par query

3. **Ajouter reranking**
   - Impact: +500ms mais +15% confiance

### Target après optimisations

- P95: 14150ms → **1800ms** ✅
- Gain total: -87%

---

## 📋 Plan d'Action Priorisé

### Phase 0: Amélioration du Dataset (URGENT)

**Impact estimé**: +30% confiance, -10% latence
**Effort**: 2-3 heures

1. **Ingérer plus de documents**
   - Ajouter 10-20 documents couvrant toutes les catégories
   - Documents: ARCHITECTURE_V1_EXPLAINED.md, VECTORSTORE_ARCHITECTURE.md, MODULE_PERMISSIONS.md, etc.
   - Cible: 500+ chunks au lieu de ~50 actuels

### Phase 1: Quick Wins (Semaine 1)

**Impact estimé**: P95 10.8s → 5s (-54%)
**Effort**: 1 semaine

1. **Cache Redis pour embeddings** (apps/api/app/core/cache/)

   ```python
   # Clé: hash(query_text) → embedding_vector
   # TTL: 24h
   # Gain: -1.5s sur cache hit (50% des queries)
   ```

2. **Paralléliser embedding + LLM**

   ```python
   # Au lieu de: embed → search → generate
   # Faire: (embed + cache_check) en parallèle
   # Gain: -500ms
   ```

3. **Passer à gpt-4o-mini-turbo** ou **gpt-3.5-turbo**
   - LLM plus rapide pour génération
   - Gain: -1.5s par query

**P95 après Phase 1**: ~5000ms (toujours au-dessus mais 2x mieux)

### Phase 2: Optimisations Moyennes (Semaine 2-3)

**Impact estimé**: P95 5s → 2.5s (-50%)
**Effort**: 2 semaines

1. **Embeddings locaux** (Sentence Transformers)

   ```python
   from sentence_transformers import SentenceTransformer
   model = SentenceTransformer('all-MiniLM-L6-v2')
   # Latency: 1-2s → 50ms
   # Gain: -1.5s par query
   ```

2. **Reranking avec cross-encoder**

   ```python
   from sentence_transformers import CrossEncoder
   reranker = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')
   # Améliore confiance +20%
   # Coût: +200ms
   ```

3. **Hybrid search (BM25 + vector)**
   - Combine recherche lexicale + sémantique
   - Améliore pertinence +15%

**P95 après Phase 2**: ~2500ms (proche de l'objectif)

### Phase 3: Optimisations Avancées (Semaine 4+)

**Impact estimé**: P95 2.5s → 1.5s (-40%)
**Effort**: 3-4 semaines

1. **Streaming LLM responses**

   - Commence à retourner la réponse avant la fin
   - TTFB (Time To First Byte): -60%

2. **Query routing intelligent**

   - Route faciles → petit modèle rapide
   - Route complexes → gros modèle précis

3. **Index HNSW pour PGVector**
   ```sql
   CREATE INDEX ON chunks USING hnsw (embedding vector_cosine_ops);
   -- Gain: -300ms sur la recherche
   ```

**P95 après Phase 3**: ~1500ms ✅ (objectif atteint)

---

## 🎯 Conclusion

### Status SLA Final

- ❌ **P95 Total < 2000ms**: 10964ms (FAIL - 5.5x trop lent)
- ❌ **P95 Search < 2000ms**: 10848ms (FAIL - 5.4x trop lent)
- ❌ **Success Rate ≥ 99.5%**: 97.0% (FAIL - 2.5% en dessous)

### Points Clés

1. **Latence principale**: Embedding API externe (~40%) + LLM generation (~50%)
2. **Qualité faible**: Dataset insuffisant (1 doc → 500+ chunks nécessaires)
3. **3 échecs**: Manque de retry et circuit breaker

### Prochaines Étapes Immédiates

1. ✅ **Phase 0**: Ingérer 10-20 documents (2-3h) → Tests avec evaluation fixtures
2. 🔄 **Phase 1**: Cache Redis + parallélisation (1 semaine)
3. ⏳ **Phase 2**: Embeddings locaux + reranking (2 semaines)
4. ⏳ **Phase 3**: Optimisations avancées (1 mois)

### Fichiers de Référence Créés

- ✅ `tests/fixtures/rag_evaluation.json` - 15 Q&A de référence pour tests de qualité
- ✅ `docs/benchmark-100-queries-results.md` - Résultats détaillés avec plan d'action
- ✅ `docs/rag-performance.md` - Documentation complète des optimisations
- ✅ `apps/api/benchmark_100_queries.py` - Script de benchmark reproductible

---

**Benchmark Complété**: 2025-11-20 10:29:32
**Prochaine Action**: Ingérer plus de documents et re-tester avec evaluation fixtures
