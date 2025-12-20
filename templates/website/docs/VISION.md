# SUPERFASTTT AI Platform

## Documentation Technique et Architecture

---

## 📋 Table des matières

# 📋 table des matières

1. [Vision et principes](#vision-et-principes)

   - Vision
   - Principes de conception
   - Esprit d’ingénierie

2. [Architecture technique](#architecture-technique)

   - Vision infrastructure
   - Stack technologique
   - Modèle d’architecture par client
   - Schéma database
   - Schéma visuel par client
   - Architecture : isolation forte par client
   - Architecture Docker par client
   - Isolation et sécurité
   - Avantages de l’architecture
   - Gestion multi-LLM et orchestration IA
   - Gestion du tenant_id et contextes d’exécution

3. [Apps Tierces](#apps-tierces)

   - Vision
   - Architecture
   - Distribution : Registry simple
   - Authentification SSO
   - Guide développeur

4. [Système d’intégrations et connecteurs](#système-dintégrations-et-connecteurs)

   - Vision
   - Principes de conception
   - Architecture modulaire
   - Sécurité et souveraineté
   - Synchronisation et normalisation
   - Ingestion et indexation
   - Observabilité et monitoring
   - Stack technique résumée
   - Expérience utilisateur
   - En résumé

5. [Options de déploiement PostgreSQL](#options-de-déploiement-postgresql)

   - Vision
   - Option 1 : PostgreSQL managé mutualisé
   - Option 2 : PostgreSQL on-premise dédié
   - Tableau comparatif
   - Processus de choix
   - Migration entre options
   - Recommandations par profil

6. [Provisioning et gestion](#provisioning-et-gestion)

   - Provisioning automatisé
   - Gestion centralisée
   - Monitoring global
   - Infrastructure as code
   - Backups et disaster recovery
   - Scaling
   - Dimensionnement type

7. [Sécurité et conformité](#sécurité-et-conformité)

   - Conformité et géolocalisation
   - RGPD
   - Sécurité multi-niveaux
   - Conformité par option PostgreSQL

8. [Conclusion](#conclusion)

---

## Vision et Principes

### Vision

SUPERFASTTT AI Platform a pour mission d'aider les entreprises à reprendre la main sur leur intelligence artificielle.

L'objectif n'est pas seulement de créer des agents IA, mais de construire **un système souverain, modulaire et durable** — une infrastructure capable d'orchestrer l'intelligence dans tous les métiers de l'entreprise.

La plateforme est pensée comme un **socle AI Native** : elle ne dépend d'aucun fournisseur externe, peut s'installer n'importe où, et s'adapte à la réalité de chaque environnement.

**SUPERFASTTT incarne une approche pragmatique de l'IA : utile, explicable, interopérable.**

### Principes de Conception

#### 🛡️ Souveraineté avant tout

- Les données, les modèles et les clés appartiennent à l'entreprise
- Aucune dépendance forcée à un service cloud
- Tout doit pouvoir fonctionner localement, sans connexion externe si nécessaire
- Possibilité d'utiliser ses propres clés API (OpenRouter, etc.)
- **Privacy by design** : les données de l'entreprise ne sont pas chez nous, uniquement les données de traitement

#### ⚡ Simplicité opérationnelle

- Le déploiement doit tenir en une commande
- L'infrastructure doit être lisible, prévisible et auto-documentée
- Chaque développeur doit pouvoir comprendre la structure du projet en moins d'une heure

#### 🧩 Architecture modulaire

- Le backend est une API complète, les apps tierces apportent des interfaces spécialisées
- Le noyau reste complet, les apps tierces consomment l'API pour des usages verticaux
- Ce principe garantit l'évolutivité, la stabilité et la liberté d'expérimentation

#### 🔗 Interopérabilité ouverte

- SUPERFASTTT parle le langage de l'open source : FastAPI, Next.js, PostgreSQL, Docker, LlamaIndex
- Les standards ouverts assurent la pérennité du projet et facilitent les contributions externes
- **MCP-native** : chaque agent expose un manifeste MCP et des endpoints normalisés pour être interopérable

#### 🔒 Transparence et sécurité

- Aucune clé, donnée ou dépendance n'est cachée
- Le chiffrement est systématique, la sécurité est intégrée dès la conception
- Les logs, configurations et workflows sont conçus pour être audités facilement

#### 📊 Performance raisonnée

- La priorité n'est pas le scaling aveugle, mais la stabilité
- Optimiser d'abord les fondations (base, cache, vector store), puis ouvrir la scalabilité horizontale quand elle devient nécessaire

#### 📖 Lisibilité du code et durabilité du produit

- Le code doit être lisible avant d'être "smart"
- Chaque module doit pouvoir être repris, testé, ou remplacé sans dépendances implicites
- La documentation n'est pas un livrable secondaire, c'est un composant de la plateforme

### Esprit d'Ingénierie

SUPERFASTTT n'est pas une application : **c'est une plateforme cognitive**.

Chaque app tierce est un cerveau métier relié à une même intelligence centrale.

Le rôle du développeur n'est pas de coder des fonctionnalités isolées, mais de composer des systèmes intelligents interconnectés.

**Le code est au service d'une vision : une IA maîtrisée, explicable, et réellement intégrée dans le quotidien des entreprises.**

---

## Architecture Technique

### Vision Infrastructure

Solution permettant d'équiper des milliers d'entreprises avec une suite IA complète.

**Principe** : Architecture à isolation forte — chaque client dispose de son propre serveur applicatif, son propre espace de stockage, et son propre schéma de base de données (avec choix entre PostgreSQL managé ou on-premise).

### Stack Technologique

#### Frontend & Backend

- **Next.js 14+** avec App Router
- **TypeScript**
- Server Actions pour mutations
- API Routes pour endpoints
- **shadcn/ui** pour l'interface

#### Authentification

- **Auth.js** (NextAuth)
- Multi-tenant par sous-domaine
- Sessions sécurisées

#### Base de Données

- **PostgreSQL** (managé Scaleway OU on-premise)
- Extension **pgvector** pour embeddings vectoriels
- Schémas dédiés par client
- Backups automatiques

#### Stockage Fichiers

- **Object Storage S3 Scaleway**
- Buckets dédiés par client
- Chiffrement server-side

#### Cache & Queue (optionnel)

- **Redis** managé Scaleway
- Cache requêtes
- Queue traitement asynchrone

#### Compute

- **Instances Scaleway** (PLAY2, PRO2)
- **Docker Compose**
- Une instance par client

#### Infrastructure as Code

- **Terraform** pour provisioning
- **GitHub Actions** pour CI/CD
- Ansible pour configuration (optionnel)

#### Monitoring

- **Grafana** pour visualisation
- **Prometheus** pour métriques
- **Loki** pour logs
- PagerDuty pour alertes

### Modèle d'Architecture par Client

Chaque client dispose d'une **isolation complète** sur trois niveaux :

#### 1. Serveur Applicatif Dédié

- 1 instance Scaleway dédiée
- 1 application Next.js qui tourne uniquement pour lui
- Variables d'environnement uniques
- Logs isolés
- Performance non impactée par les autres clients

#### 2. Espace de Stockage Dédié

- 1 bucket S3 Scaleway dédié
- Ses documents ne sont jamais mélangés avec d'autres
- Credentials IAM uniques

#### 3. Schéma Base de Données Dédié

- **Option Managé** : 1 schéma dédié dans PostgreSQL Scaleway mutualisé
- **Option On-Premise** : 1 instance PostgreSQL complète dans son conteneur
- Credentials uniques
- Isolation totale des données

#### 4. Sous-domaine Dédié

- URL unique : `nomclient.votredomaine.fr`
- Certificat SSL dédié automatique
- Possibilité domaine custom

### Schéma Database

```
Architecture TOUJOURS dédiée (1 serveur par client)
    │
    ├─→ Option A : PostgreSQL Managé Scaleway (mutualisé par schémas)
    │   └─ Client préfère simplicité + gestion automatique
    │
    └─→ Option B : PostgreSQL On-Premise (dans leur instance Docker)
        └─ Client préfère souveraineté totale + contrôle
```

### Schéma Visuel par Client

```
Client "Entreprise A"
│
├── Instance Scaleway dédiée
│   └── Docker Compose
│       ├── Container: Application Next.js
│       └── Container: PostgreSQL (si on-premise)
│
├── Bucket S3 "entrepriseA-docs"
│   └── Documents et fichiers
│
├── Schéma PostgreSQL dédié
│   └── Option 1: Schéma dans DB Scaleway mutualisée
│   └── Option 2: DB locale dans conteneur
│
└── URL : entrepriseA.votredomaine.fr
```

### Architecture : Isolation Forte par Client

```
┌─────────────────────────────────────────────────────────┐
│              ARCHITECTURE DÉDIÉE (toujours)             │
│                                                         │
│  Instance Client A          Instance Client B           │
│  ┌─────────────────┐       ┌─────────────────┐          │
│  │ App Next.js     │       │ App Next.js     │          │
│  │ Apps Tierces    │       │ Apps Tierces    │          │
│  │ Agent AI        │       │ Agent AI        │          │
│  └────────┬────────┘       └────────┬────────┘          │
│           │                         │                   │
│     ┌─────┴─────┐             ┌────┴──────┐             │
│     │           │             │           │             │
│     ▼           ▼             ▼           ▼             │
│  Option A   Option B       Option A   Option B          │
│  ┌──────┐  ┌──────┐      ┌──────┐  ┌──────┐             │
│  │ PG   │  │ PG   │      │ PG   │  │ PG   │             │
│  │Scalew│  │Local │      │Scalew│  │Local │             │
│  │(schém│  │(cont)│      │(schém│  │(cont)│             │
│  └──────┘  └──────┘      └──────┘  └──────┘             │
└─────────────────────────────────────────────────────────┘
```

**Résultat** : Les clients ne se croisent jamais. **Isolation totale.**

### Architecture Docker par Client

Un **template Docker Compose unique** déployé sur chaque serveur client :

```yaml
services:
  app:
    image: superfasttt/app:latest
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - S3_BUCKET=${CLIENT_BUCKET}
      - TENANT_SCHEMA=${TENANT_SCHEMA}

  postgres:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    # Utilisé uniquement si option on-premise
    # Reste présent mais inactif si option managé

volumes:
  pgdata:
```

**Comportement selon l'option PostgreSQL** :

- **Option Managé** : `DATABASE_URL` pointe vers Scaleway, conteneur `postgres` reste dormant
- **Option On-Premise** : `DATABASE_URL` pointe vers `postgres:5432`, conteneur local actif

### Isolation et Sécurité

#### Isolation Applicative

Chaque client :

- A son propre serveur (instance compute)
- Son application ne peut accéder qu'à son schéma PostgreSQL
- Ses fichiers sont dans son bucket S3 dédié
- Ne peut jamais atteindre l'application d'un autre client

#### Isolation Base de Données

**Option Managé (PostgreSQL Scaleway)** :

- Chaque client a un user PostgreSQL unique
- Le user a accès uniquement à son schéma
- Impossible techniquement d'accéder à un autre schéma
- Même en cas de faille applicative, PostgreSQL bloque

Exemple :

```
✓ User "entrepriseA" peut faire :
  SELECT * FROM tenant_entrepriseA.documents

✗ User "entrepriseA" ne peut PAS faire :
  SELECT * FROM tenant_entrepriseB.documents
  → PostgreSQL refuse la requête
```

**Option On-Premise** :

- PostgreSQL complet dans le conteneur du client
- Aucun accès réseau externe à la base
- Isolation physique maximale

#### Isolation Réseau

- Firewall configuré (ports 80/443 uniquement ouverts)
- PostgreSQL accessible uniquement via réseau privé Scaleway (si managé)
- Pas de communication inter-clients possible

#### Chiffrement

**En transit** :

- HTTPS obligatoire (TLS 1.3)
- Certificats SSL automatiques

**Au repos** :

- PostgreSQL : chiffrement disque Scaleway
- S3 : chiffrement server-side
- Backups chiffrés

### Avantages de l'Architecture

#### ✅ Isolation Forte

- Chaque client a son serveur applicatif dédié
- Performance prévisible et garantie
- Pas d'effet "noisy neighbor"
- Customisation possible par client
- Updates déployables progressivement
- Debugging facilité (logs isolés)

#### ✅ Flexibilité PostgreSQL

- Client choisit son niveau de souveraineté
- Migration possible entre options
- Adapté à tous les profils (startup → entreprise régulée)

#### ✅ Sécurité

- Isolation garantie à tous les niveaux
- Impossible d'accéder aux données d'un autre client
- Conforme RGPD
- Pattern éprouvé par milliers de SaaS
- Auditable et traçable

## Option de Stockage Vectoriel Qdrant

### Vision

SUPERFASTTT permet désormais à chaque client de choisir son **moteur de stockage vectoriel** selon ses besoins de performance, de volume et de souveraineté.

Deux options sont disponibles :

- **pgvector (par défaut)** – intégré à PostgreSQL, simple et suffisant pour la majorité des cas d’usage.
- **Qdrant** – moteur vectoriel spécialisé, haute performance et scalable, recommandé pour les environnements à fort volume ou à usage IA intensif.

---

### Architecture

### Option 1 : PostgreSQL + pgvector (par défaut)

**Principe :**
Les embeddings vectoriels sont stockés directement dans les tables PostgreSQL, dans le schéma dédié au client.

**Avantages :**

- Simplicité maximale
- Aucune dépendance supplémentaire
- Sauvegardes unifiées avec le reste des données
- Compatible avec les outils analytiques SQL

**Limites :**

- Performances limitées sur gros volumes (> 1M vectors)
- Scalabilité horizontale restreinte

---

### Option 2 : Qdrant (moteur vectoriel dédié)

**Principe :**
Les embeddings sont déportés dans une instance Qdrant, managée ou locale, accessible via API HTTP.

Chaque client dispose :

- d’une **collection Qdrant dédiée** (`tenant_nomclient`)
- d’un **API Key unique**
- d’une **connexion privée ou locale** selon le mode de déploiement

**Avantages :**

- Haute performance (index HNSW optimisé)
- Scalabilité horizontale native
- Recherches sémantiques rapides et précises
- Décorrélation entre données métier (PostgreSQL) et embeddings (Qdrant)

**Limites :**

- Infrastructure supplémentaire
- Backups séparés
- Monitoring spécifique

---

### Intégration Technique

### Variables d’environnement

```bash
VECTOR_STORE=qdrant          # ou 'postgres'
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=********
QDRANT_COLLECTION=tenant_entrepriseA
```

### Exemple de docker-compose

```yaml
services:
  app:
    image: superfasttt/app:latest
    environment:
      - VECTOR_STORE=qdrant
      - QDRANT_URL=http://qdrant:6333
      - QDRANT_API_KEY=${QDRANT_API_KEY}
      - DATABASE_URL=${DATABASE_URL}
      - TENANT_SCHEMA=${TENANT_SCHEMA}
    depends_on:
      - qdrant

  qdrant:
    image: qdrant/qdrant:v1.10
    ports:
      - '6333:6333'
    volumes:
      - qdrant_data:/qdrant/storage
    environment:
      - QDRANT__SERVICE__API_KEY=${QDRANT_API_KEY}

volumes:
  qdrant_data:
```

### Exemple d’abstraction logicielle

```python
from superfasttt.core.config import settings
from superfasttt.core.vector.pgvector import PgVectorStore
from superfasttt.core.vector.qdrant import QdrantStore

def get_vector_store():
    if settings.VECTOR_STORE == "qdrant":
        return QdrantStore(settings.QDRANT_URL, settings.QDRANT_API_KEY)
    return PgVectorStore(settings.DATABASE_URL)
```

---

## Sécurité et Isolation

- Une **collection Qdrant par client**
- **API Key dédiée** à chaque instance ou collection
- **Connexion privée** (VPC Scaleway ou localhost)
- **Chiffrement au repos** via volumes disques
- **Logs et métriques isolés**

---

## Scénarios Recommandés

| Profil client                        | Recommandation                         |
| ------------------------------------ | -------------------------------------- |
| TPE / PME standard                   | pgvector (simplicité, un seul backend) |
| Client IA avancé (RAG, NLP intensif) | Qdrant managé                          |
| Environnement souverain / déconnecté | Qdrant on-premise                      |
| Secteur régulé (santé, finance)      | Qdrant local avec chiffrement disque   |

---

## Avantages Comparés

| Critère                 | pgvector     | Qdrant                  |
| ----------------------- | ------------ | ----------------------- |
| Simplicité              | ⭐⭐⭐⭐⭐   | ⭐⭐                    |
| Performance >1M vectors | ⭐⭐         | ⭐⭐⭐⭐⭐              |
| Scalabilité horizontale | ⭐⭐         | ⭐⭐⭐⭐                |
| Latence requête         | ~5–10ms      | ~1–3ms                  |
| Maintenance             | Faible       | Moyenne                 |
| Mode offline            | Oui          | Oui                     |
| Isolation client        | Schéma dédié | Collection dédiée       |
| Conformité RGPD         | Oui          | Oui                     |
| Observabilité           | Basique      | Avancée (metrics + API) |

---

## Conclusion

L’option **Qdrant** complète l’approche souveraine et modulaire de SUPERFASTTT :

- Chaque client peut choisir son moteur vectoriel selon son profil.
- L’abstraction logicielle unifiée garantit la compatibilité totale.
- Aucune dépendance forte : Qdrant peut être activé ou désactivé sans impact sur le code métier.

Cette approche maintient le principe central : **isolation, souveraineté et flexibilité by design.**

---

### 🧠 Gestion multi-LLM et orchestration IA

#### Vision

La plateforme SUPERFASTTT a été pensée pour fonctionner avec **plusieurs modèles de langage** (LLM) de manière transparente, souveraine et performante.  
L’objectif est de permettre à chaque client, app tierce ou agent IA de **choisir le modèle le plus adapté** à sa tâche, tout en garantissant :

- une **gestion centralisée des clés et usages**,
- une **interopérabilité totale** entre fournisseurs,
- et une **observabilité complète** des appels IA.

SUPERFASTTT n’est pas lié à un modèle unique.  
Le noyau prend en charge un **ensemble de fournisseurs compatibles OpenAI API** : OpenAI, Anthropic, Mistral, Google, Ollama, OpenRouter, Hugging Face, etc.

---

#### Architecture de la couche LLM

SUPERFASTTT intègre un **service d’orchestration multi-LLM** basé sur **LiteLLM**, une passerelle open-source qui unifie l’accès à plus de 100 modèles différents via une API standardisée.

##### Composants

| Composant                | Rôle                                                     |
| ------------------------ | -------------------------------------------------------- |
| **LiteLLM Proxy**        | Service d’abstraction multi-LLM (API OpenAI compatible)  |
| **superfast.core.llm**   | Module interne de gestion des appels, politiques et logs |
| **PostgreSQL (tenant)**  | Suivi des usages et coûts par utilisateur et ion         |
| **Grafana / Prometheus** | Visualisation temps réel des métriques IA                |
| **Admin UI**             | Tableau de bord des usages et quotas IA                  |

---

#### Schéma d’architecture

```
┌───────────────────────────────┐
│       Extension Métier        │
│   (ex : Facturation, CRM…)    │
│         ↕ MCP Tools           │
└──────────────┬────────────────┘
               │
               ▼
     ┌─────────────────────┐
     │ superfast.core.llm  │
     │ - Auth & quotas     │
     │ - Logging usages    │
     │ - Sélection modèle  │
     └──────────┬──────────┘
                │
                ▼
       ┌────────────────┐
       │ LiteLLM Proxy  │
       │ - OpenAI API   │
       │ - Multi-vendor │
       │ - Monitoring   │
       └────────┬───────┘
                │
   ┌────────────┼────────────────────────────┐
   │            │            │               │
   ▼            ▼            ▼               ▼
 OpenAI     Anthropic     Mistral       Ollama Local
   │            │            │               │
   └────────────┴────────────┴───────────────┘

```

---

#### Fonctionnement

1. Une extension ou un agent appelle la fonction :

```
python
  from superfast.core.llm import call_llm

  response = await call_llm(
      model="mistral/open-mixtral",
      messages=[{"role": "user", "content": "Résume ce document"}],
      tenant_id="entrepriseA"
  )
```

2. Le module \`superfast.core.llm\` :
   - valide les permissions et quotas du tenant,
   - sélectionne la clé et le modèle appropriés,
   - transmet la requête au **LiteLLM Proxy**.
3. Le proxy exécute l’appel vers le fournisseur choisi (OpenAI, Mistral, etc.).
4. Le résultat est renvoyé à l’extension et **enregistré en base** (usage, tokens, coût, latence).

---

#### Gestion des clés et modèles

Chaque client dispose de **ses propres clés et politiques d’usage**, stockées de manière chiffrée.

```
yaml
# Exemple de configuration multi-LLM
models:
 - model_name: openai/gpt-4o-mini
   api_key: ${OPENAI_KEY}
 - model_name: anthropic/claude-3-sonnet
   api_key: ${ANTHROPIC_KEY}
 - model_name: mistral/open-mixtral
   api_key: ${MISTRAL_KEY}
 - model_name: ollama/llama3
   api_base: http://localhost:11434
```

L’administrateur peut :

- activer / désactiver des modèles pour un tenant,
- définir un **modèle par défaut** pour chaque type d’usage (chat, RAG, génération),
- ajuster les **quotas mensuels de tokens** par plan.

---

#### Journalisation et suivi des usages

Chaque requête LLM est tracée et agrégée pour un suivi complet :

```
sql
CREATE TABLE llm_usage (
 id UUID PRIMARY KEY,
 tenant_id TEXT,
 user_id TEXT,
 model TEXT,
 tokens_input INT,
 tokens_output INT,
 cost DECIMAL,
 latency_ms INT,
 created_at TIMESTAMP DEFAULT now()
);
```

Les métriques peuvent être exposées à Grafana / Prometheus :

- Temps de réponse moyen par modèle
- Coût cumulé par client / mois
- Nombre de requêtes IA par extension
- Répartition par fournisseur

---

#### Avantages de cette approche

| Aspect               | Bénéfices                                        |
| -------------------- | ------------------------------------------------ |
| **Interopérabilité** | Une seule API pour tous les modèles              |
| **Souveraineté**     | LiteLLM est auto-hébergeable                     |
| **Sécurité**         | Clés API isolées par tenant                      |
| **Traçabilité**      | Journalisation complète des appels et coûts      |
| **Scalabilité**      | Load balancing, cache et fallback automatiques   |
| **Flexibilité**      | Ajout de nouveaux LLMs sans modification du code |
| **Observabilité**    | Intégration Prometheus / Grafana                 |

---

### 🧩 Gestion du tenant_id et contextes d’exécution

#### Vision

Le paramètre \`tenant_id\` permet à la plateforme de **relier toutes les actions, appels IA et données à un même contexte d’entreprise**.  
Selon le **mode d’isolation**, il peut être **implicite** ou **explicite**.

---

#### 1. Mode isolation forte (déploiement par client)

Chaque entreprise dispose de **sa propre instance** avec serveur, base, bucket et sous-domaine dédiés.

##### Conséquence

Le \`tenant_id\` est **implicite**.  
L’application connaît déjà le client via sa configuration d’environnement.

```
bash
TENANT_ID=entrepriseA
DATABASE_SCHEMA=tenant_entrepriseA
CLIENT_BUCKET=entrepriseA-docs
```

Le développeur **n’a pas besoin de le passer dans le code** :

```
python
response = await call_llm(
   model="mistral/open-mixtral",
   messages=[{"role": "user", "content": "Analyse ce document"}]
)
```

---

#### 2. Mode mutualisé (multi-tenant)

Plusieurs clients partagent une même application avec **schémas PostgreSQL distincts**.

##### Conséquence

Le \`tenant_id\` devient **explicite** :

```
python
response = await call_llm(
   model="gpt-4o-mini",
   messages=[{"role": "user", "content": "Résume ce texte"}],
   tenant_id="entrepriseA"
)
```

et est ajouté au header :

```
X-Tenant-ID: entrepriseA
```

---

#### 3. Mode hybride

Les deux modes peuvent coexister.  
Le code reste compatible grâce à un paramètre facultatif :

```
python
def call_llm(model, messages, tenant_id=None):
   tenant_id = tenant_id or os.getenv("TENANT_ID")
   ...
```

---

#### 4. Avantages

| Aspect                       | Bénéfice                             |
| ---------------------------- | ------------------------------------ |
| **Compatibilité ascendante** | Migration facile entre modes         |
| **Clarté du contexte**       | Traces cohérentes par client         |
| **Sécurité**                 | Filtrage des requêtes par tenant     |
| **Scalabilité**              | Support du multi-tenant à la demande |
| **Simplicité**               | Mode implicite transparent           |

---

#### En résumé

> Dans le mode actuel de SUPERFASTTT, le \`tenant_id\` est **implicite et résolu automatiquement**,  
> mais son maintien dans le code garantit une **compatibilité totale** avec le futur multi-tenant.

---

## Apps Tierces

### Vision

SUPERFASTTT permet aux développeurs externes de créer des **apps tierces** qui consomment l'API du backend. Ces apps enrichissent les fonctionnalités de la plateforme sans modifier le core.

**SUPERFASTTT n'est pas un CMS traditionnel comme WordPress.** C'est une **plateforme d'agents IA headless** où le backend (intelligence, données, traitement) est complet et souverain, tandis que les apps tierces fournissent des interfaces spécialisées.

### Architecture

```
┌─────────────────────────────────────────┐
│   SUPERFASTTT CORE (Backend complet)    │
│   - Agents IA avec RAG                  │
│   - Documents, Conversations            │
│   - Vector store + PostgreSQL           │
│   - API REST + MCP + Webhooks           │
└─────────────┬───────────────────────────┘
              │
              │ API publique sécurisée
              │
     ┌────────┴────────────────┐
     │                         │
     ▼                         ▼
┌──────────────┐        ┌──────────────┐
│ Apps Tierces │        │ Apps Custom  │
│ (Marketplace)│        │ (Clients)    │
└──────────────┘        └──────────────┘
```

### Principe fondamental

> Les apps tierces sont **autonomes** mais **ne gèrent pas leur propre login**.
> L'instance SUPERFASTTT possède la fenêtre d'authentification.
> Une fois authentifié, l'utilisateur accède à toutes les apps tierces sans se reconnecter (SSO).

### Distribution : Registry Simple

Les apps tierces sont distribuées via un **registry centralisé** qui liste les apps disponibles :

```
┌─────────────────────────────────────────────────────────────────┐
│                    Registry SUPERFASTTT                          │
│                (registry.superfasttt.com/apps.json)              │
│                                                                  │
│  {                                                               │
│    "apps": [                                                     │
│      {                                                           │
│        "id": "knowledge-hub",                                    │
│        "name": "Knowledge Hub",                                  │
│        "version": "1.0.0",                                       │
│        "download_url": "https://.../bundle.zip",                 │
│        "permissions": ["documents:read", "rag:query"]            │
│      }                                                           │
│    ]                                                             │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
   Instance A            Instance B            Instance C
   (Les 10 000 instances peuvent installer la même app)
```

### Workflow Installation

1. **Admin** va dans Admin UI → "Apps Tierces"
2. **Instance** récupère la liste depuis le registry
3. **Admin** voit les apps disponibles et clique "Installer"
4. **Instance** télécharge le bundle et l'extrait vers `/apps/{app-id}/`
5. **App** disponible pour les utilisateurs autorisés

### Authentification SSO

```
┌─────────────────────────────────────────────────────────────────┐
│                    Instance Client                               │
│                    (xyz.superfasttt.com)                         │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │   /admin     │  │   /api       │  │  /apps/knowledge-hub │   │
│  │  Admin UI    │  │  Backend     │  │  App Tierce          │   │
│  │  (Next.js)   │  │  (FastAPI)   │  │  (React SPA)         │   │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘   │
│         │                 │                      │               │
│         │    Cookie JWT   │                      │               │
│         │    (httpOnly)   │                      │               │
│         └────────────────►│◄─────────────────────┘               │
│                           │                                      │
│                    Token partagé (même domaine = SSO)            │
└─────────────────────────────────────────────────────────────────┘
```

Les apps tierces utilisent des **chemins relatifs** pour les appels API :

```typescript
// Dans l'app tierce - PAS de domaine hardcodé
fetch('/api/documents') // Résolu automatiquement vers xyz.superfasttt.com/api/documents
```

### Pour les Développeurs

Un développeur crée une app tierce en :

1. Créant une SPA (Next.js, React, Vue...)
2. Utilisant le SDK `@superfasttt/sdk` pour les appels API
3. Configurant le `basePath` vers `/apps/{app-id}/`
4. Buildant en mode statique (`next export`)
5. Soumettant le bundle au registry SUPERFASTTT

**L'app est agnostique au domaine** — le même build fonctionne sur toutes les instances.

---

## Système d'Intégrations et Connecteurs

### Vision

Le **système d’intégrations** de SUPERFASTTT permet aux entreprises de connecter leurs outils existants — Google Drive, SharePoint, Notion, Slack, TLDV, Gong, etc. — afin de synchroniser et d’indexer leurs données dans le **Cortex de connaissance**.  
Cette couche est essentielle pour que les agents IA puissent accéder à la réalité métier de chaque entreprise, sans dépendance à des services externes.

SUPERFASTTT adopte une approche **souveraine, modulaire et interopérable** : chaque intégration est un connecteur indépendant, sécurisé et auto-déclaratif.  
Les données ne quittent jamais l’environnement du client — elles sont collectées, normalisées et indexées localement.

---

### Principes de Conception

### 🧩 Architecture Modulaire

- Chaque connecteur est un module autonome, décrit par un manifest JSON (`integrations/<nom>/manifest.json`).
- Le noyau charge dynamiquement les connecteurs disponibles au démarrage.
- L’ajout ou la mise à jour d’un connecteur ne nécessite aucune modification du core.
- L’architecture supporte les intégrations de type **pull (sync)** ou **webhook (push)**.

### 🔐 Sécurité et Souveraineté

- Authentification OAuth2 gérée via **Authlib**, bibliothèque Python open source conforme RFC 6749.
- **Chiffrement des tokens** avec `cryptography.Fernet` (AES‑128) avant stockage en base.
- **Isolation stricte par tenant** : chaque client dispose de ses propres credentials et schémas PostgreSQL.
- Aucun service tiers n’intervient dans les flux d’authentification ou de synchronisation.
- Audit trail complet : chaque connexion, refresh ou accès est journalisé.

### ⚙️ Synchronisation et Normalisation

- Les données issues des outils connectés sont transformées en un format unifié, `DocumentEnvelope`.
- Les synchronisations sont **asynchrones** (via **Celery**) et **incrémentales** : seules les modifications récentes sont traitées.
- **Redis** est utilisé pour :
  - le cache des métadonnées et états temporaires,
  - le stockage des tokens OAuth states (protection CSRF),
  - la gestion du rate limiting distribué.
- Les connecteurs s’appuient sur les SDK officiels ou sur des **loaders LlamaHub** (GoogleDriveReader, NotionReader, etc.).

### 🧠 Ingestion et Indexation

- Les documents normalisés sont transmis à **LlamaIndex**, qui assure :
  - la découpe sémantique (chunking intelligent),
  - la génération d’embeddings,
  - et la mise à jour incrémentale des vecteurs.
- Les vecteurs sont stockés dans **pgvector** (PostgreSQL), les fichiers bruts dans **S3 Scaleway**.
- Le Cortex IA devient ainsi capable de répondre aux questions directement à partir des contenus issus des outils connectés.

### 📊 Observabilité et Monitoring

- **Prometheus** collecte les métriques de synchronisation (durée, volume, erreurs, latence API).
- **Grafana** offre des dashboards par connecteur (suivi des syncs, erreurs, taux de succès).
- **Loki** centralise les logs structurés en JSON pour une traçabilité complète.
- Les métriques clés (sync_jobs_total, sync_errors_total, latency_seconds) garantissent transparence et fiabilité.

---

### Stack Technique Résumée

| Composant             | Technologie                 | Rôle                                             |
| --------------------- | --------------------------- | ------------------------------------------------ |
| **API Backend**       | FastAPI                     | Routes REST et gestion des connecteurs           |
| **Authentification**  | Authlib                     | Gestion OAuth2 complète et standardisée          |
| **Chiffrement**       | Cryptography (Fernet)       | Sécurisation des tokens OAuth au repos           |
| **Queue & Cache**     | Redis                       | Stockage états, rate limiting et broker Celery   |
| **Orchestration**     | Celery                      | Tâches asynchrones de synchronisation            |
| **Base de données**   | PostgreSQL + pgvector       | Stockage souverain des données et embeddings     |
| **Stockage Fichiers** | S3 Scaleway                 | Conservation souveraine des documents bruts      |
| **Indexation IA**     | LlamaIndex + LlamaHub       | Transformation et vectorisation des documents    |
| **Monitoring**        | Prometheus + Grafana + Loki | Observabilité et alerting en temps réel          |
| **UI Frontend**       | Next.js + shadcn/ui         | Interface de connexion et suivi des intégrations |

---

### Expérience Utilisateur

L’utilisateur dispose d’un **espace d’intégration** dans l’interface SUPERFASTTT :

1. Sélectionne un service (ex. : Google Drive, Notion)
2. Autorise la connexion OAuth2 sécurisée
3. Configure les dossiers, espaces ou filtres à synchroniser
4. Suit l’état des synchronisations en temps réel
5. Peut mettre en pause, re‑authentifier ou supprimer la connexion à tout moment

**Statuts visuels :**

- 🟢 Connecté et synchronisé
- 🟡 En cours de synchronisation
- 🔴 Erreur d’authentification ou quota atteint
- ⏸️ En pause

---

### En Résumé

> Le **Système d’Intégrations** fait de SUPERFASTTT une plateforme réellement interconnectée, souveraine et scalable.  
> Grâce à une stack moderne et open source (FastAPI, Authlib, Redis, Celery, LlamaIndex), chaque entreprise peut connecter ses outils en toute sécurité, tout en conservant la pleine maîtrise de ses données et de son intelligence interne.

---

## Options de Déploiement PostgreSQL

### Vision

SUPERFASTTT propose une **architecture de base de données flexible** permettant à chaque client de choisir le niveau de souveraineté et de contrôle qu'il souhaite sur ses données.

Cette flexibilité respecte les principes fondamentaux de la plateforme tout en s'adaptant aux contraintes et préférences de chaque entreprise.

### Deux Options Disponibles

#### Option 1 : PostgreSQL Managé Mutualisé (Recommandé)

**Principe**  
Le client utilise une instance PostgreSQL managée par Scaleway, partagée avec d'autres clients via l'isolation par schémas dédiés. Chaque client dispose de son propre schéma avec permissions strictes, garantissant une isolation totale des données.

**Architecture**

```
Instance Client A (Serveur dédié)
└── Application SUPERFASTTT
    └── Se connecte à PostgreSQL Scaleway Managé
        └── Schéma "tenant_clientA" (isolé)

Instance Client B (Serveur dédié)
└── Application SUPERFASTTT
    └── Se connecte à PostgreSQL Scaleway Managé
        └── Schéma "tenant_clientB" (isolé)

PostgreSQL Managé Scaleway (mutualisé)
├── Schéma tenant_clientA (permissions: user_clientA uniquement)
├── Schéma tenant_clientB (permissions: user_clientB uniquement)
└── Schéma tenant_clientC (permissions: user_clientC uniquement)
```

**Avantages**

- ✅ Backups automatiques quotidiens (rétention 30 jours)
- ✅ Haute disponibilité native
- ✅ Monitoring et métriques automatiques
- ✅ Scaling vertical sans downtime
- ✅ Mises à jour sécurité gérées par Scaleway
- ✅ Point-in-time recovery disponible
- ✅ Coût optimisé (mutualisation infrastructure)
- ✅ Gestion simplifiée (pas de compétences DBA requises)
- ✅ SLA garanti par Scaleway

**Isolation et Sécurité**

- Schéma PostgreSQL dédié par client
- User PostgreSQL unique avec permissions strictes
- Impossible d'accéder aux données d'un autre client
- Chiffrement au repos et en transit
- Connexions via réseau privé Scaleway uniquement

**Idéal pour**

- Clients recherchant simplicité opérationnelle
- Équipes sans expertise DBA
- Besoin de haute disponibilité garantie
- Contraintes budgétaires optimisées
- Focus sur le métier plutôt que l'infrastructure

**Configuration**

```bash
DATABASE_URL=postgresql://client_a:***@postgres-managed.scaleway.com:5432/superfasttt
DATABASE_SCHEMA=tenant_client_a
DATABASE_SSL_MODE=require
BACKUP_ENABLED=false  # Géré par Scaleway
```

#### Option 2 : PostgreSQL On-Premise Dédié

**Principe**  
Le client dispose de sa propre instance PostgreSQL complète, déployée dans un conteneur Docker sur son serveur applicatif. **Isolation maximale et contrôle total** sur la base de données.

**Architecture**

```
Instance Client A (Serveur dédié)
├── Container: Application SUPERFASTTT
│   └── Se connecte à localhost:5432
└── Container: PostgreSQL dédié
    └── Volume: données PostgreSQL Client A

Instance Client B (Serveur dédié)
├── Container: Application SUPERFASTTT
│   └── Se connecte à localhost:5432
└── Container: PostgreSQL dédié
    └── Volume: données PostgreSQL Client B
```

**Avantages**

- ✅ Souveraineté totale sur les données
- ✅ Aucune dépendance externe (fonctionne offline)
- ✅ Contrôle complet configuration PostgreSQL
- ✅ Latence minimale (même serveur)
- ✅ Pas de limite de connexions partagées
- ✅ Personnalisation optimisations possible
- ✅ Audit et conformité simplifiés
- ✅ Aucun coût récurrent base de données

**Responsabilités Client**

- ⚠️ Backups à configurer et gérer (scripts fournis)
- ⚠️ Monitoring à mettre en place
- ⚠️ Mises à jour PostgreSQL à appliquer
- ⚠️ Dimensionnement ressources à ajuster
- ⚠️ Haute disponibilité à implémenter si besoin

**Idéal pour**

- Clients avec exigences souveraineté maximale
- Environnements hautement régulés (santé, finance)
- Équipes avec compétences DBA internes
- Besoin de fonctionner en mode déconnecté
- Contraintes de conformité strictes
- Optimisations performance spécifiques

**Configuration**

```bash
DATABASE_URL=postgresql://superfasttt:***@postgres:5432/superfasttt
DATABASE_SCHEMA=public
DATABASE_SSL_MODE=disable  # Connexion locale
BACKUP_ENABLED=true
BACKUP_SCHEDULE=0 2 * * *  # Daily 2am
BACKUP_RETENTION_DAYS=30
```

### Tableau Comparatif

| Critère                 | PostgreSQL Managé                   | PostgreSQL On-Premise               |
| ----------------------- | ----------------------------------- | ----------------------------------- |
| **Souveraineté**        | Élevée (données en France)          | Maximale (contrôle total)           |
| **Simplicité**          | ⭐⭐⭐⭐⭐ Installation automatique | ⭐⭐⭐ Configuration requise        |
| **Backups**             | Automatiques quotidiens             | À gérer (scripts fournis)           |
| **Haute disponibilité** | Native, garantie                    | À implémenter si besoin             |
| **Monitoring**          | Inclus (Scaleway)                   | À configurer                        |
| **Mises à jour**        | Automatiques sécurité               | Manuelles                           |
| **Performance**         | Excellente (hardware optimisé)      | Dépend du serveur choisi            |
| **Latence**             | ~1-2ms (réseau privé)               | <0.5ms (localhost)                  |
| **Coût mensuel**        | Inclus dans forfait                 | Aucun (ressources serveur)          |
| **Scalabilité**         | Vertical facile sans downtime       | Nécessite redimensionnement serveur |
| **Compétences**         | Aucune requise                      | DBA ou DevOps souhaitable           |
| **Mode offline**        | Non (nécessite réseau)              | Oui (autonome complet)              |
| **Conformité**          | Certifications Scaleway             | Audit direct possible               |

### Processus de Choix

#### À la Souscription

Lors de la création d'une nouvelle instance SUPERFASTTT, le client choisit son option PostgreSQL.

**Questionnaire de décision** :

- Avez-vous des exigences de souveraineté maximale ? → **Oui** = On-premise
- Disposez-vous de compétences DBA en interne ? → **Non** = Managé
- Avez-vous besoin de fonctionner en mode déconnecté ? → **Oui** = On-premise
- Privilégiez-vous la simplicité opérationnelle ? → **Oui** = Managé
- Budget infrastructure limité ? → **Oui** = Managé

### Migration entre Options

#### De Managé vers On-Premise

**Cas d'usage** : Client souhaite plus de contrôle après quelques mois

**Processus** :

1. Export complet du schéma depuis PostgreSQL managé
2. Provisioning nouveau serveur avec PostgreSQL on-premise
3. Import des données dans nouvelle instance
4. Tests de validation
5. Bascule DNS vers nouvelle instance
6. Suppression ancien schéma managé

**Durée estimée** : 2-4 heures selon volume données

#### D'On-Premise vers Managé

**Cas d'usage** : Client préfère déléguer la gestion après expérimentation

**Processus** :

1. Création schéma dans PostgreSQL managé
2. Dump de l'instance on-premise
3. Restore dans schéma managé
4. Tests de validation
5. Reconfiguration application (DATABASE_URL)
6. Arrêt conteneur PostgreSQL local

**Durée estimée** : 1-3 heures selon volume données

### Recommandations par Profil

#### Startup / PME sans IT

→ **PostgreSQL Managé**

- Focus métier, pas infrastructure
- Coûts prévisibles inclus
- Scaling automatique

#### Entreprise avec DSI établie

→ **Au choix selon politique**

- IT mature → On-Premise possible
- Préférence cloud → Managé

#### Secteur régulé (Santé, Finance)

→ **PostgreSQL On-Premise recommandé**

- Contrôle total pour audits
- Souveraineté maximale
- Certifications simplifiées

#### Environnement déconnecté

→ **PostgreSQL On-Premise obligatoire**

- Aucune dépendance réseau externe
- Fonctionnement autonome garanti

---

## Provisioning et Gestion

### Provisioning Automatisé

#### Création d'un Nouveau Client

**Étape 1 : Formulaire d'inscription**

- Client remplit formulaire web
- Choix sous-domaine et plan
- Choix option PostgreSQL (managé/on-premise)

**Étape 2 : API déclenche provisioning (5-10 minutes)**

Actions automatiques :

**Scaleway Compute** :

- Création instance via API Scaleway
- Installation Docker et dépendances via cloud-init
- Déploiement application Next.js
- Configuration variables d'environnement

**Scaleway S3** :

- Création bucket avec nom unique
- Configuration CORS
- Génération credentials IAM

**PostgreSQL** :

Si **option managé** :

- Création schéma dédié dans l'instance centrale
- Création user PostgreSQL avec credentials uniques
- Application permissions (accès schéma uniquement)
- Initialisation tables

Si **option on-premise** :

- Déploiement conteneur PostgreSQL dans Docker Compose
- Génération password sécurisé
- Configuration volumes persistance
- Initialisation base de données
- Configuration scripts backup automatiques

**DNS et SSL** :

- Configuration sous-domaine
- Provisioning certificat SSL Let's Encrypt

**Étape 3 : Client reçoit email**

- URL : `entrepriseX.votredomaine.fr`
- Credentials admin temporaires
- Lien vers documentation

#### Rollback en Cas d'Échec

- Suppression automatique des ressources créées
- Libération sous-domaine
- Logs détaillés pour debug
- Notification équipe technique

### Gestion Centralisée

#### Dashboard Administrateur

**Vue d'ensemble** :

- Liste de tous les clients avec statuts
- Health checks temps réel
- Métriques agrégées
- Alertes et incidents

**Actions disponibles** :

- Provisioning nouveau client
- Suspension/réactivation client
- Upgrade/downgrade plan
- Accès logs et métriques par client
- Déploiement updates

#### Monitoring Global

**Health checks automatiques** (toutes les 5 min) :

- Application up/down
- Temps de réponse
- Taux d'erreur
- Espace disque

**Alertes intelligentes** :

- Notification si instance down
- Alerte si taux erreur élevé
- Avertissement espace disque
- Auto-remediation : redémarrage automatique

**Métriques PostgreSQL** (option managé) :

- Nombre connexions
- Performance requêtes
- Taille par schéma
- Utilisation ressources

#### Infrastructure as Code

**Terraform** :

- Templates réutilisables par ressource
- Provisioning via API
- État centralisé
- Destroy sécurisé avec confirmations

**CI/CD** :

- Déploiement automatique via GitHub Actions
- Tests avant déploiement
- Rolling updates progressifs
- Rollback automatique si erreur

### Backups et Disaster Recovery

#### Stratégie Backups

**PostgreSQL Managé** :

- Backups quotidiens automatiques (géré par Scaleway)
- Rétention 30 jours
- Point-in-time recovery disponible
- Backup avant chaque migration

**PostgreSQL On-Premise** :

- Scripts backup automatiques fournis
- Cron job quotidien pré-configuré
- Stockage backups dans volume dédié
- Alertes si backup échoue

**S3** :

- Versioning activé par bucket
- Lifecycle policies configurables
- Réplication haute durabilité native

**Application** :

- Code dans Git (source de vérité)
- Images Docker versionnées
- Configuration dans Terraform

#### Restauration

**Client individuel** :

- Restauration schéma PostgreSQL depuis backup
- Restauration fichiers S3 depuis versions
- Redéploiement application si nécessaire

**Incident global** :

- Failover automatique si PostgreSQL HA
- Restauration depuis backup
- Communication clients
- Basculement région si nécessaire

### Scaling

#### Scaling PostgreSQL Managé (Vertical)

Évolution selon croissance :

- Début : 4 vCPU, 16GB RAM
- 500 clients : 8 vCPU, 32GB RAM
- 1000 clients : 16 vCPU, 64GB RAM
- 5000+ clients : 32 vCPU, 128GB RAM

Opération :

- Upgrade via console Scaleway
- Downtime minimal (< 5 minutes)
- Transparent pour clients

#### Scaling Horizontal (si nécessaire)

Au-delà de 5000 clients :

- Split PostgreSQL par région
- Ou par segment client
- Sharding possible mais rarement nécessaire

#### Scaling Applicatif

Par client :

- Upgrade instance compute si besoin
- Auto-scaling optionnel
- Monitoring utilisation ressources

### Dimensionnement Type

#### Pour 1000 Clients

**Compute** :

- 1000 instances Scaleway (1 par client)
- Type : PLAY2

**PostgreSQL Managé** (si majorité managé) :

- 1 instance managée centrale
- Taille : 16 vCPU, 64GB RAM
- Stockage : 200-500GB

**PostgreSQL On-Premise** (si majorité on-premise) :

- Aucune instance centrale
- Ressources dans chaque serveur client

**S3** :

- 1000 buckets (1 par client)
- Volume total variable selon usage

**Redis** (optionnel) :

- 1 instance managée centrale
- Ou 1 par client selon besoin

---

## Sécurité et Conformité

### Conformité et Géolocalisation

#### RGPD

**Géolocalisation** :

- Données en France (Paris) ou Europe (Amsterdam)
- Pas de transfert hors UE
- Choix région possible par client

**Droits utilisateurs** :

- Export données en 1 clic
- Suppression complète garantie
- Logs d'accès conservés
- Transparence traitements

#### Sécurité Multi-Niveaux

**Isolation garantie** :

- **Application** : Serveur dédié par client
- **Base de données** : Schéma dédié avec permissions strictes (managé) ou instance dédiée (on-premise)
- **Stockage** : Bucket dédié par client
- **Réseau** : Firewall et réseau privé

**Chiffrement** :

- **Transit** : HTTPS/TLS 1.3
- **Repos** : Chiffrement disque et S3
- **Backups** : Chiffrés

### Conformité par Option PostgreSQL

#### Option Managé

✅ Données hébergées en France (Paris) ou Europe (Amsterdam)  
✅ Conformité RGPD native  
✅ Certifications Scaleway (ISO 27001, etc.)  
✅ DPA (Data Processing Agreement) standard

#### Option On-Premise

✅ Données sur serveurs maîtrisés par client  
✅ Conformité RGPD (responsabilité client)  
✅ Audits directs possibles  
✅ Certifications selon hébergement choisi

---

## Conclusion

SUPERFASTTT AI Platform incarne une vision pragmatique de l'intelligence artificielle d'entreprise :

✅ **Souveraine** : Les données et l'intelligence appartiennent à l'entreprise  
✅ **Modulaire** : Extensions à la WordPress/Odoo pour composer sa suite métier  
✅ **Flexible** : Choix entre simplicité (managé) et contrôle total (on-premise)  
✅ **Interopérable** : Standards ouverts et protocole MCP  
✅ **Scalable** : Architecture éprouvée pour des milliers de clients  
✅ **Sécurisée** : Isolation totale et conformité RGPD

**Cette architecture permet de bâtir une infrastructure d'agents IA maîtrisée, explicable, et réellement intégrée dans le quotidien des entreprises.**

---

_Document technique SUPERFASTTT AI Platform — Version 1.0_
