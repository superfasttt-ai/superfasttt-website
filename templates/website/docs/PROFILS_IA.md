# Documentation : Profils IA dans SUPERFASTTT

## Vue d'ensemble

Les **Profils IA** sont des configurations complètes qui combinent un modèle LLM, un modèle d'embeddings et un ensemble de paramètres personnalisés pour le chunking, la génération et le retrieval RAG (Retrieval-Augmented Generation).

Chaque profil définit précisément comment :

- Les documents sont découpés en chunks (chunking)
- Les chunks sont transformés en vecteurs (embeddings)
- Les informations pertinentes sont récupérées (retrieval)
- Le LLM génère les réponses

---

## Architecture des Profils

Un profil IA se compose de **4 sections principales** :

### 1. Informations de base

- **Nom** : Identifiant unique du profil (ex: `commercial`, `technique_industriel`)
- **Description** : Usage et contexte du profil
- **Modèle LLM** : Modèle de génération de texte (ex: GPT-4, Claude Sonnet)
- **Modèle Embedding** : Modèle de vectorisation (ex: text-embedding-3-large)

### 2. Paramètres de Chunking

Définit comment découper les documents en morceaux manipulables.

### 3. Paramètres LLM

Contrôle le comportement du modèle de génération.

### 4. Paramètres RAG

Configure la stratégie de retrieval et les contraintes de génération.

---

## 1. Paramètres de Chunking

Le chunking est l'étape critique qui transforme des documents longs en morceaux de taille gérable pour l'embedding et le retrieval.

### 1.1 Stratégie de Chunking (`chunkingStrategy`)

Détermine **comment** découper le texte.

#### Options disponibles :

##### `fixed_size` - Taille fixe (Simple)

- **Fonctionnement** : Découpe le texte tous les N caractères/tokens/mots
- **Avantages** : Rapide, prévisible, simple à implémenter
- **Inconvénients** : Peut couper au milieu de phrases ou de concepts importants
- **Cas d'usage** : Documents très structurés, données tabulaires
- **Implémentation LlamaIndex** : `SimpleNodeParser` ou `SentenceSplitter` en mode basique

##### `recursive` - Récursif (Recommandé) ⭐

- **Fonctionnement** : Découpe sur des séparateurs hiérarchiques (paragraphes → phrases → mots)
- **Avantages** : Respecte la structure du texte, préserve le contexte sémantique
- **Inconvénients** : Légèrement plus lent que fixed_size
- **Cas d'usage** : **Recommandé pour 90% des cas** - documentation, articles, emails
- **Implémentation LlamaIndex** : `SentenceSplitter` avec `chunk_size` et séparateurs personnalisés
- **Séparateurs par défaut** : `["\n\n", "\n", ". ", " ", ""]` (du plus large au plus fin)

##### `semantic` - Sémantique (IA)

- **Fonctionnement** : Utilise les embeddings pour détecter les changements de sujet/thème
- **Avantages** : Chunks les plus cohérents sémantiquement, meilleure qualité RAG
- **Inconvénients** : Coûteux en calcul (requiert des embeddings), plus lent
- **Cas d'usage** : Documents complexes avec des transitions de sujets subtiles
- **Implémentation LlamaIndex** : `SemanticSplitterNodeParser` (nécessite un modèle d'embedding)
- **Paramètre associé** : `chunkingModelId` - modèle d'embedding utilisé pour détecter les limites

##### `token_based` - Basé sur les tokens

- **Fonctionnement** : Découpe basée sur le compte de tokens du modèle (pas de caractères)
- **Avantages** : Précision maximale pour la gestion du contexte LLM, évite les dépassements
- **Inconvénients** : Nécessite un tokenizer, légèrement plus lent
- **Cas d'usage** : Quand la précision du contexte est critique (legal, compliance)
- **Implémentation LlamaIndex** : `TokenTextSplitter` avec le tokenizer du modèle cible

##### `markdown_aware` - Compatible Markdown

- **Fonctionnement** : Découpe en respectant la structure Markdown (headers, code blocks)
- **Avantages** : Préserve les blocs de code, les titres, les listes
- **Inconvénients** : Spécifique à Markdown
- **Cas d'usage** : Documentation technique, READMEs, wikis
- **Implémentation LlamaIndex** : `MarkdownNodeParser` avec détection des headers

---

### 1.2 Unité de Mesure (`chunkSizeUnit`)

Définit l'unité utilisée pour `chunkSize` et `chunkOverlap`.

#### Options :

- **`characters`** : Compte en caractères bruts

  - Simple mais imprécis (un mot chinois = 1 char, un mot anglais = 5+ chars)
  - Utile pour du texte ASCII simple

- **`tokens`** : Compte en tokens du modèle (recommandé) ⭐

  - Précision maximale pour gérer le contexte LLM
  - Évite les surprises de dépassement de contexte
  - Nécessite le tokenizer du modèle (ex: tiktoken pour OpenAI)

- **`words`** : Compte en mots (séparés par espaces)
  - Approximation raisonnable
  - Plus lisible humainement que les tokens

---

### 1.3 Taille des Chunks (`chunkSize`)

**Valeur** : 256 - 2048 (unité définie par `chunkSizeUnit`)
**Défaut recommandé** : 512 tokens

**Impact** :

- **Trop petit** (< 256) : Perte de contexte, fragmentation excessive
- **Optimal** (512-1024) : Bon équilibre contexte/précision
- **Trop grand** (> 1500) : Risque de dilution de l'information pertinente

**Guide par cas d'usage** :

- **FAQ, Q&A courtes** : 256-512 tokens
- **Documentation générale** : 512-1024 tokens
- **Articles longs, études** : 1024-2048 tokens

---

### 1.4 Overlap (`chunkOverlap`)

**Valeur** : 0 - 200 (dans l'unité de `chunkSizeUnit`)
**Défaut recommandé** : 50 tokens

**Objectif** : Créer un chevauchement entre chunks consécutifs pour :

- Éviter de couper des concepts importants
- Maintenir la continuité contextuelle
- Améliorer le retrieval sur des questions multi-chunks

**Règle générale** : `overlap = 10-15% de chunkSize`

**Exemple avec chunkSize=512 et overlap=50** :

```
Chunk 1 : [0......462][463-512]
Chunk 2 :           [463-512][513-975]
Chunk 3 :                    [926-975][976-1438]
```

Les zones [463-512], [926-975] sont dupliquées.

---

### 1.5 Taille Minimale de Chunk (`minChunkSize`)

**Valeur** : 50 - 500
**Défaut recommandé** : 100

**Objectif** : Éviter la création de chunks trop petits qui manquent de contexte.

Lors du chunking, si un morceau fait moins que `minChunkSize`, il sera :

- Fusionné avec le chunk précédent/suivant
- Ou ignoré s'il ne contient que des métadonnées

---

### 1.6 Chunks Max par Document (`maxChunksPerDocument`)

**Valeur** : Optionnel (vide = illimité)
**Défaut recommandé** : Aucune limite pour la plupart des cas

**Objectif** : Limiter le nombre de chunks créés par document pour :

- Contrôler les coûts d'embedding
- Éviter de polluer la base vectorielle avec des documents trop longs
- Gérer la mémoire sur de très gros documents

**Comportement** : Si un document génère plus de N chunks, seuls les N premiers sont conservés.

---

### 1.7 Préserver les Métadonnées (`preserveMetadata`)

**Valeur** : Boolean (défaut: `true`)

**Objectif** : Conserver ou non les métadonnées de structure du document :

- Numéros de page
- En-têtes de section
- Noms de fichiers
- Timestamps

**Activation recommandée** pour :

- Documents officiels (contracts, legal)
- Documentation technique avec versioning
- Sources citables (académique, recherche)

**Implémentation LlamaIndex** : Les métadonnées sont stockées dans `node.metadata` et peuvent être :

- Incluses dans l'embedding (via `metadata_mode="all"`)
- Utilisées pour le filtrage post-retrieval
- Affichées dans les citations

---

### 1.8 Modèle pour Chunking Sémantique (`chunkingModelId`)

**Visible uniquement si** `chunkingStrategy = "semantic"`

**Objectif** : Spécifier quel modèle d'embedding utiliser pour détecter les limites sémantiques.

**Note importante** : Ce modèle peut être **différent** du modèle d'embedding principal.

**Cas d'usage** :

- Utiliser un modèle rapide (text-embedding-ada-002) pour le chunking
- Puis un modèle précis (text-embedding-3-large) pour l'embedding final

---

## 2. Paramètres LLM

Ces paramètres contrôlent le comportement du modèle de génération lors de la création de réponses.

### 2.1 Temperature (`temperature`)

**Valeur** : 0.0 - 2.0
**Défaut recommandé** : 0.7

**Effet** :

- **0.0** : Déterministe, répétitif, factuel (idéal pour Q&A techniques)
- **0.7** : Équilibré, légèrement créatif (recommandé)
- **1.0+** : Créatif, varié, risque d'hallucinations (idéal pour brainstorming)

---

### 2.2 Max Tokens (`maxTokens`)

**Valeur** : 100 - 4096+
**Défaut recommandé** : 2000

**Définition** : Nombre maximal de tokens dans la réponse générée.

**Guide** :

- **Réponses courtes (Q&A)** : 500-1000
- **Réponses détaillées** : 2000-3000
- **Documents longs** : 4000+

---

### 2.3 Top P (`topP`)

**Valeur** : 0.0 - 1.0
**Défaut recommandé** : 1.0

**Définition** : Nucleus sampling - considère les tokens dont la probabilité cumulée atteint P.

- **0.9** : Plus focalisé, moins créatif
- **1.0** : Tous les tokens possibles considérés

**Note** : Généralement utilisé **en alternative** à temperature, pas en combinaison.

---

### 2.4 Frequency Penalty (`frequencyPenalty`)

**Valeur** : 0.0 - 2.0
**Défaut recommandé** : 0.0

**Effet** : Pénalise les tokens déjà apparus (proportionnellement à leur fréquence).

- Réduit les répétitions
- Encourage la diversité lexicale

---

### 2.5 Presence Penalty (`presencePenalty`)

**Valeur** : 0.0 - 2.0
**Défaut recommandé** : 0.0

**Effet** : Pénalise les tokens déjà apparus (binaire - présent ou non).

- Encourage l'exploration de nouveaux sujets
- Réduit les formulations répétitives

---

## 3. Paramètres RAG

Ces paramètres définissent comment le système récupère et utilise l'information du contexte.

### 3.1 Stratégie de Retrieval (`retrievalStrategy`)

Détermine **comment** rechercher les chunks pertinents dans la base vectorielle.

#### Options :

##### `semantic` - Sémantique (Vectoriel pur)

- **Fonctionnement** : Recherche par similarité cosinus dans l'espace vectoriel
- **Avantages** :
  - Comprend les synonymes et paraphrases
  - Fonctionne en multilingue
  - Capture le sens profond
- **Inconvénients** :
  - Peut manquer des mots-clés exacts
  - Moins performant sur des termes techniques rares
- **Cas d'usage** : Questions conceptuelles, recherche de sens
- **Implémentation LlamaIndex** : `VectorStoreIndex.as_query_engine(similarity_top_k=...)`

##### `hybrid` - Hybride (Recommandé) ⭐

- **Fonctionnement** : Combine recherche vectorielle (semantic) + recherche lexicale (BM25)
- **Avantages** :
  - Meilleur des deux mondes
  - Excellente performance générale
  - Robuste sur tous types de questions
- **Inconvénients** : Légèrement plus lent (deux recherches)
- **Cas d'usage** : **Recommandé par défaut** pour la plupart des systèmes RAG
- **Implémentation LlamaIndex** : `QueryFusionRetriever` avec `VectorIndexRetriever` + `BM25Retriever`
- **Paramètre associé** : `hybridAlpha` - contrôle l'équilibre entre les deux

##### `bm25` - BM25 (Lexical)

- **Fonctionnement** : Recherche par correspondance de mots-clés (TF-IDF amélioré)
- **Avantages** :
  - Très rapide
  - Excellent sur les termes techniques exacts
  - Pas besoin d'embeddings (économique)
- **Inconvénients** :
  - Ne comprend pas les synonymes
  - Monolingue
  - Sensible aux fautes d'orthographe
- **Cas d'usage** : Recherche de termes techniques précis, codes, références
- **Implémentation LlamaIndex** : `BM25Retriever`

---

### 3.2 Alpha Hybride (`hybridAlpha`)

**Visible uniquement si** `retrievalStrategy = "hybrid"`

**Valeur** : 0.0 - 1.0
**Défaut recommandé** : 0.5 (équilibré)

**Définition** : Contrôle le poids relatif entre recherche sémantique et BM25.

**Formule** :

```
score_final = (alpha × score_semantic) + ((1 - alpha) × score_bm25)
```

**Valeurs** :

- **0.0** : 100% BM25 (lexical pur)
- **0.3** : Favorise BM25 (bon pour termes techniques)
- **0.5** : Équilibré (recommandé)
- **0.7** : Favorise sémantique (bon pour questions conceptuelles)
- **1.0** : 100% sémantique (équivalent à `semantic`)

**Guide de réglage** :

- **Documentation technique avec jargon** : 0.3-0.4
- **Usage général** : 0.5
- **Questions conceptuelles** : 0.6-0.7

---

### 3.3 Seuil de Similarité (`similarityThreshold`)

**Valeur** : 0.0 - 1.0
**Défaut recommandé** : 0.7

**Définition** : Score minimal de similarité pour qu'un chunk soit considéré comme pertinent.

**Effet** :

- **Bas (0.5-0.6)** : Plus de résultats, risque de bruit
- **Moyen (0.7-0.8)** : Équilibré (recommandé)
- **Élevé (0.9+)** : Très strict, risque de manquer de l'information

**Note** : Ce seuil s'applique **après** la recherche initiale, comme un filtre de qualité.

---

### 3.4 Nombre de Chunks (`numChunks`)

**Valeur** : 1 - 20
**Défaut recommandé** : 5

**Définition** : Nombre de chunks les plus pertinents à récupérer et inclure dans le contexte du LLM.

**Impact sur le contexte** :

```
Tokens_contexte ≈ numChunks × chunkSize
```

**Guide** :

- **Q&A simple** : 3-5 chunks
- **Analyse détaillée** : 10-15 chunks
- **Comparaison multi-sources** : 15-20 chunks

**Attention** : Plus de chunks = plus de contexte, mais aussi :

- Plus de coût (tokens d'input)
- Plus de latence
- Risque de dilution de l'information pertinente

---

### 3.5 Activer le Reranking (`rerankEnabled`)

**Valeur** : Boolean (défaut: `false`)

**Définition** : Après la recherche initiale, réordonne les chunks avec un modèle de reranking plus puissant.

**Fonctionnement** :

1. Retrieval initial : récupère 20-50 chunks candidats
2. Reranking : réordonne avec un modèle cross-encoder (ex: ms-marco)
3. Sélection finale : garde les `numChunks` meilleurs

**Avantages** :

- Améliore significativement la pertinence (+15-30% en précision)
- Réduit les faux positifs
- Meilleur ordre = meilleure utilisation du contexte par le LLM

**Inconvénients** :

- Coût additionnel (appel API au reranker)
- Latence accrue (+100-500ms)

**Quand activer** :

- ✅ Applications critiques (legal, médical, finance)
- ✅ Quand la précision prime sur la vitesse
- ❌ Chatbot temps-réel avec contraintes de latence strictes

**Implémentation LlamaIndex** :

```python
from llama_index.postprocessor import CohereRerank, SentenceTransformerRerank

# Option 1 : Cohere Rerank (API)
reranker = CohereRerank(top_n=5)

# Option 2 : Sentence Transformer (local)
reranker = SentenceTransformerRerank(top_n=5, model="cross-encoder/ms-marco-MiniLM-L-6-v2")

query_engine = index.as_query_engine(
    similarity_top_k=20,  # Récupère 20 candidats
    node_postprocessors=[reranker]  # Rerank et garde top 5
)
```

---

### 3.6 Forcer les Citations (`forceCitations`)

**Valeur** : Boolean (défaut: `false`)

**Définition** : Oblige le LLM à citer explicitement les sources (chunks) dans sa réponse.

**Effet quand activé** :

- Le prompt système inclut : "TOUJOURS citer les sources utilisées avec [Source N]"
- Chaque affirmation doit référencer le chunk source
- Améliore la traçabilité et la confiance

**Format de réponse attendu** :

```
La photosynthèse est le processus par lequel les plantes convertissent
la lumière en énergie chimique [Source 1]. Ce processus se déroule
principalement dans les chloroplastes [Source 2].

Sources :
[1] document_biologie.pdf, page 42
[2] cours_botanique.md, section 3.2
```

**Cas d'usage** :

- ✅ Documentation officielle
- ✅ Recherche académique
- ✅ Compliance et audit trails
- ✅ Support client avec SLA de traçabilité
- ❌ Chatbot conversationnel informel

**Implémentation LlamaIndex** :

```python
# Ajout au prompt système
citation_template = """
Basez votre réponse UNIQUEMENT sur le contexte fourni.
Pour chaque information, citez explicitement la source avec [Source N].
À la fin de votre réponse, listez toutes les sources utilisées.
"""

query_engine = index.as_query_engine(
    text_qa_template=citation_template,
    response_mode="tree_summarize"  # Meilleur pour citations multi-chunks
)
```

---

### 3.7 Mode Strict (`strictMode`)

**Valeur** : Boolean (défaut: `false`)

**Définition** : Contraint le LLM à répondre **UNIQUEMENT** avec les informations présentes dans le contexte fourni.

**Différence avec `forceCitations`** :

- `forceCitations` : "Cite tes sources"
- `strictMode` : "N'utilise QUE le contexte, rien de ta connaissance pré-entraînée"

**Effet quand activé** :

**Mode Normal (strictMode=false)** :

```
User: Qu'est-ce que la photosynthèse ?
Context: [chunk sur la chlorophylle]
LLM: La photosynthèse est le processus par lequel les plantes
     convertissent la lumière en énergie. La chlorophylle, mentionnée
     dans le document, joue un rôle clé... [utilise aussi sa connaissance générale]
```

**Mode Strict (strictMode=true)** :

```
User: Qu'est-ce que la photosynthèse ?
Context: [chunk sur la chlorophylle]
LLM: Basé sur le contexte fourni, je peux vous informer que la
     chlorophylle est un pigment impliqué dans la photosynthèse.
     Le contexte ne contient pas de définition complète de la photosynthèse.
```

**Cas d'usage** :

- ✅ **Applications réglementées** (finance, santé, legal)
- ✅ **Documentation propriétaire** (éviter les hallucinations)
- ✅ **Contrôle qualité strict** (chaque affirmation doit être sourcée)
- ✅ **Audit et compliance**
- ❌ Chatbot conversationnel général
- ❌ Assistant créatif

**Risques en mode strict** :

- Réponses plus courtes ou incomplètes
- Frustration utilisateur si le contexte est insuffisant
- Nécessite une base de connaissances très complète

**Implémentation LlamaIndex** :

```python
strict_prompt = """
Vous êtes un assistant IA en mode strict.

RÈGLES ABSOLUES :
1. Répondez UNIQUEMENT en utilisant les informations du contexte fourni ci-dessous
2. N'utilisez JAMAIS votre connaissance pré-entraînée
3. Si le contexte ne contient pas l'information demandée, dites explicitement :
   "Je ne peux pas répondre à cette question avec le contexte fourni."
4. Ne faites AUCUNE inférence ou déduction au-delà de ce qui est explicitement écrit

Contexte :
{context_str}

Question : {query_str}

Réponse (basée UNIQUEMENT sur le contexte) :
"""

query_engine = index.as_query_engine(
    text_qa_template=strict_prompt,
    similarity_top_k=10  # Plus de contexte pour compenser la strictitude
)
```

**Combinaison recommandée** :

```
strictMode=true + forceCitations=true + rerankEnabled=true
= Configuration "Enterprise Compliance"
```

---

## Implémentation avec LlamaIndex

### Pipeline complet d'un Profil IA

```python
from llama_index import (
    VectorStoreIndex,
    ServiceContext,
    SimpleDirectoryReader,
)
from llama_index.node_parser import SentenceSplitter, SemanticSplitterNodeParser
from llama_index.llms import OpenAI
from llama_index.embeddings import OpenAIEmbedding
from llama_index.postprocessor import CohereRerank, SimilarityPostprocessor
from llama_index.retrievers import BM25Retriever, VectorIndexRetriever, QueryFusionRetriever

class AIProfile:
    def __init__(self, profile_config):
        """Initialise un profil IA basé sur la configuration UI"""
        self.config = profile_config

        # 1. Initialiser le LLM
        self.llm = OpenAI(
            model=profile_config['llm_model_id'],
            temperature=profile_config['temperature'],
            max_tokens=profile_config['max_tokens'],
            top_p=profile_config['top_p'],
            frequency_penalty=profile_config['frequency_penalty'],
            presence_penalty=profile_config['presence_penalty']
        )

        # 2. Initialiser l'embedding
        self.embed_model = OpenAIEmbedding(
            model=profile_config['embedding_model_id']
        )

        # 3. Configurer le node parser (chunking)
        self.node_parser = self._create_node_parser()

        # 4. Créer le service context
        self.service_context = ServiceContext.from_defaults(
            llm=self.llm,
            embed_model=self.embed_model,
            node_parser=self.node_parser
        )

    def _create_node_parser(self):
        """Crée le parser selon la stratégie de chunking"""
        strategy = self.config['chunking_strategy']
        chunk_size = self.config['chunk_size']
        chunk_overlap = self.config['chunk_overlap']

        if strategy == 'recursive':
            return SentenceSplitter(
                chunk_size=chunk_size,
                chunk_overlap=chunk_overlap,
                separator="\n\n"
            )

        elif strategy == 'semantic':
            chunking_embed_model = OpenAIEmbedding(
                model=self.config['chunking_model_id']
            )
            return SemanticSplitterNodeParser(
                embed_model=chunking_embed_model,
                buffer_size=1,
                breakpoint_percentile_threshold=95
            )

        elif strategy == 'token_based':
            from llama_index.node_parser import TokenTextSplitter
            return TokenTextSplitter(
                chunk_size=chunk_size,
                chunk_overlap=chunk_overlap
            )

        elif strategy == 'markdown_aware':
            from llama_index.node_parser import MarkdownNodeParser
            return MarkdownNodeParser()

        else:  # fixed_size
            return SentenceSplitter(
                chunk_size=chunk_size,
                chunk_overlap=chunk_overlap
            )

    def create_index(self, documents):
        """Crée l'index vectoriel"""
        return VectorStoreIndex.from_documents(
            documents,
            service_context=self.service_context,
            show_progress=True
        )

    def create_query_engine(self, index):
        """Crée le query engine avec retrieval strategy"""
        strategy = self.config['retrieval_strategy']

        # Configurer les retrievers
        if strategy == 'semantic':
            retriever = VectorIndexRetriever(
                index=index,
                similarity_top_k=self.config['num_chunks'] * 2
            )

        elif strategy == 'hybrid':
            vector_retriever = VectorIndexRetriever(
                index=index,
                similarity_top_k=self.config['num_chunks'] * 2
            )
            bm25_retriever = BM25Retriever.from_defaults(
                index=index,
                similarity_top_k=self.config['num_chunks'] * 2
            )
            retriever = QueryFusionRetriever(
                retrievers=[vector_retriever, bm25_retriever],
                similarity_top_k=self.config['num_chunks'],
                num_queries=1,
                mode="relative_score",
                alpha=self.config.get('hybrid_alpha', 0.5)
            )

        elif strategy == 'bm25':
            retriever = BM25Retriever.from_defaults(
                index=index,
                similarity_top_k=self.config['num_chunks'] * 2
            )

        # Configurer les postprocessors
        postprocessors = []

        # Similarity threshold filter
        postprocessors.append(
            SimilarityPostprocessor(
                similarity_cutoff=self.config['similarity_threshold']
            )
        )

        # Reranker si activé
        if self.config.get('rerank_enabled', False):
            postprocessors.append(
                CohereRerank(
                    top_n=self.config['num_chunks'],
                    model="rerank-english-v2.0"
                )
            )

        # Construire le prompt selon strict mode et citations
        query_template = self._build_prompt_template()

        # Créer le query engine
        query_engine = index.as_query_engine(
            retriever=retriever,
            node_postprocessors=postprocessors,
            text_qa_template=query_template,
            response_mode="compact"
        )

        return query_engine

    def _build_prompt_template(self):
        """Construit le template de prompt selon les paramètres"""
        base_prompt = "Contexte :\n{context_str}\n\nQuestion : {query_str}\n\n"

        if self.config.get('strict_mode', False):
            base_prompt += """
RÈGLES STRICTES :
- Répondez UNIQUEMENT avec les informations du contexte fourni
- N'utilisez JAMAIS votre connaissance pré-entraînée
- Si l'information n'est pas dans le contexte, dites-le explicitement
"""

        if self.config.get('force_citations', False):
            base_prompt += """
- Citez TOUJOURS vos sources avec [Source N]
- Listez toutes les sources utilisées à la fin de votre réponse
"""

        base_prompt += "\nRéponse :"

        return base_prompt


# Utilisation
profile_config = {
    'llm_model_id': 'gpt-4',
    'embedding_model_id': 'text-embedding-3-large',
    'chunking_strategy': 'recursive',
    'chunk_size': 512,
    'chunk_overlap': 50,
    'temperature': 0.7,
    'max_tokens': 2000,
    'retrieval_strategy': 'hybrid',
    'hybrid_alpha': 0.5,
    'num_chunks': 5,
    'similarity_threshold': 0.7,
    'rerank_enabled': True,
    'force_citations': True,
    'strict_mode': True
}

profile = AIProfile(profile_config)
documents = SimpleDirectoryReader('data/').load_data()
index = profile.create_index(documents)
query_engine = profile.create_query_engine(index)

response = query_engine.query("Quelle est la politique de remboursement ?")
print(response)
```

---

## Recommandations par Cas d'Usage

### 1. Chatbot Support Client (Général)

```yaml
chunking_strategy: recursive
chunk_size: 512
chunk_overlap: 50
retrieval_strategy: hybrid
hybrid_alpha: 0.5
num_chunks: 5
rerank_enabled: false # Vitesse prioritaire
force_citations: false
strict_mode: false
temperature: 0.7
```

### 2. Documentation Technique / API Docs

```yaml
chunking_strategy: markdown_aware
chunk_size: 1024
chunk_overlap: 100
retrieval_strategy: hybrid
hybrid_alpha: 0.4 # Favorise BM25 pour termes techniques
num_chunks: 8
rerank_enabled: true
force_citations: true
strict_mode: true
temperature: 0.3 # Factuel
```

### 3. Legal / Compliance

```yaml
chunking_strategy: recursive
chunk_size: 768
chunk_overlap: 100
retrieval_strategy: hybrid
hybrid_alpha: 0.5
num_chunks: 10
rerank_enabled: true
force_citations: true
strict_mode: true # CRITIQUE
temperature: 0.1 # Très factuel
preserve_metadata: true # Traçabilité
```

### 4. FAQ / Q&A Court

```yaml
chunking_strategy: recursive
chunk_size: 256
chunk_overlap: 30
retrieval_strategy: semantic
num_chunks: 3
rerank_enabled: false
force_citations: false
strict_mode: false
temperature: 0.5
```

### 5. Recherche Académique / Études

```yaml
chunking_strategy: semantic
chunk_size: 1024
chunk_overlap: 150
retrieval_strategy: hybrid
hybrid_alpha: 0.6 # Favorise sémantique
num_chunks: 15
rerank_enabled: true
force_citations: true
strict_mode: false # Permet synthèse
temperature: 0.4
```

---

## Métriques et Optimisation

### Comment évaluer un profil ?

#### 1. Métriques de Retrieval

- **Recall@K** : Proportion de chunks pertinents dans les K premiers résultats
- **Precision@K** : Proportion de résultats pertinents parmi les K retournés
- **MRR (Mean Reciprocal Rank)** : Rang moyen du premier résultat pertinent

#### 2. Métriques de Génération

- **Faithfulness** : La réponse est-elle fidèle au contexte ?
- **Answer Relevancy** : La réponse répond-elle à la question ?
- **Context Relevancy** : Le contexte récupéré est-il pertinent ?

#### 3. Coûts

- **Coût d'embedding** : `nb_chunks × coût_par_1k_tokens × chunk_size / 1000`
- **Coût de génération** : `(contexte_tokens + réponse_tokens) × coût_LLM`

### Outils d'évaluation avec LlamaIndex

```python
from llama_index.evaluation import (
    FaithfulnessEvaluator,
    RelevancyEvaluator,
    RetrieverEvaluator
)

# Évaluer le retriever
retriever_evaluator = RetrieverEvaluator.from_metric_names(
    ["mrr", "hit_rate"],
    retriever=retriever
)

# Évaluer la génération
faithfulness = FaithfulnessEvaluator(service_context=service_context)
relevancy = RelevancyEvaluator(service_context=service_context)

# Tester
response = query_engine.query("Question test")
faith_result = faithfulness.evaluate_response(response=response)
rel_result = relevancy.evaluate_response(query="Question test", response=response)

print(f"Faithfulness: {faith_result.score}")
print(f"Relevancy: {rel_result.score}")
```

---

## Limites et Considérations

### 1. Trade-offs Fondamentaux

- **Précision vs Vitesse** : Reranking, semantic chunking = +qualité, -vitesse
- **Contexte vs Coût** : Plus de chunks = meilleur contexte, mais ↑ coûts
- **Strict vs Conversationnel** : Strict mode = fiable mais moins flexible

### 2. Limites Techniques

- **Max context window** : Vérifier que `num_chunks × chunk_size < context_window_LLM`
- **Embedding dimensions** : Modèles d'embedding doivent être compatibles avec le vector store
- **Multilingue** : BM25 est faible en multilingue, privilégier semantic/hybrid

### 3. Considérations de Production

- **Cache** : Implémenter un cache pour les embeddings fréquemment utilisés
- **Versioning** : Tracker les versions de profils pour reproduire les résultats
- **A/B Testing** : Tester plusieurs profils en production avant de généraliser

---

## Conclusion

Les Profils IA dans SUPERFASTTT permettent une personnalisation complète du pipeline RAG. La clé est de :

1. **Commencer simple** : Profil par défaut (recursive, hybrid, citations désactivées)
2. **Mesurer** : Évaluer avec des métriques objectives
3. **Itérer** : Ajuster selon les retours utilisateurs et métriques
4. **Spécialiser** : Créer des profils dédiés par cas d'usage

**Profil recommandé par défaut** :

```yaml
chunking_strategy: recursive
chunk_size: 512 tokens
chunk_overlap: 50 tokens
retrieval_strategy: hybrid
hybrid_alpha: 0.5
num_chunks: 5
similarity_threshold: 0.7
rerank_enabled: false # Activer si besoin de qualité max
force_citations: false # Activer pour compliance
strict_mode: false # Activer pour legal/regulated
temperature: 0.7
```

Cette configuration offre un excellent équilibre pour 80% des cas d'usage.
