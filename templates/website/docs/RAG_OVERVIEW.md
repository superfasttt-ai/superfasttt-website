RAG_OVERVIEW.md

tableau de bord rag et gestion du cortex de connaissance

introduction

Le module de gestion du RAG dans SUPERFASTTT fournit une visibilité complète sur le cortex de connaissance d’une instance.
Il permet aux administrateurs de comprendre ce qui a été ingéré, comment les documents ont été transformés, l’état du vector store, les erreurs éventuelles et la qualité globale du corpus utilisé par les agents IA.

Ce document décrit l’architecture, les métriques, les vues d’administration et les bonnes pratiques pour superviser et maintenir un système RAG fiable et performant dans SUPERFASTTT.

⸻

objectifs du module

Le tableau de bord RAG a quatre missions principales : 1. Donner une vision claire du contenu et de la santé du cortex IA 2. Permettre de diagnostiquer les problèmes d’indexation et de qualité 3. Offrir des outils d’exploration du corpus et des embeddings 4. Assurer la maîtrise des ressources (stockage, compute, index, volumétrie)

Il s’inscrit dans le fonctionnement existant de SUPERFASTTT, qui repose sur :
• un backend FastAPI complet (documents, RAG, embeddings)
• un vector store configurable (pgvector ou qdrant)
• un stockage souverain des fichiers (S3 Scaleway)
• une administration technique via l’interface admin
• la logique d’ingestion et d’indexation décrite dans l’architecture générale ￼

⸻

architecture générale du rag dans superfasttt

composants impliqués

Le système RAG comporte plusieurs sous modules :
• documents API
upload, extraction, structuration, ingestion
cf. modules décrits dans les fichiers techniques existants ￼
• ingestion pipeline
nettoyage, découpe (chunking), embeddings, indexation
• vector store
pgvector ou qdrant selon configuration du tenant
cf. chapitre « option qdrant » de l’architecture générale ￼
• stockage fichiers
bucket S3 dédié au tenant
• cortex de connaissance
ensemble des documents + chunks + embeddings
• admin RAG overview
module de visualisation, qualité, erreurs, état du système

schéma simplifié

Upload fichier → Extraction → Chunking → Embeddings → Vector store
↓ ↓ ↓ ↓
Stockage S3 Métadonnées Indexation Requêtes IA (RAG)
↓ ↓
Admin → Vue documents, chunks, erreurs, vector store, stats

⸻

vues proposées dans l’admin

Une nouvelle section est ajoutée dans l’admin :

admin → rag et documents

Elle contient les pages suivantes :
• tableau de bord général
• documents
• chunks
• vector store
• erreurs et qualité
• réglages RAG

⸻

tableau de bord général

métriques globales
• total documents ingérés
• total chunks générés
• total embeddings
• poids total des fichiers stockés
• volume du vector store
• dernier document ingéré
• derniers documents indexés
• nombre de documents en échec

graphiques
• évolution du nombre de documents par jour
• croissance du vector store
• volume de stockage S3 dans le temps
• répartition par type de fichier (pdf, word, email, texte, media)

Ces métriques reposent sur les données existantes du core documents et sur les métriques systèmes présentes dans l’architecture admin ￼.

⸻

vue documents

Liste complète des fichiers ingérés.

colonnes affichées
• nom du document
• type (pdf, txt, docx, audio, etc.)
• taille
• date d’upload
• statut d’indexation
• nombre de chunks
• dernière mise à jour
• actions (réindexer, supprimer, ouvrir)

statuts
• en traitement
• indexé
• échec
• non pris en charge
• ignoré (fichier vide ou non exploitable)

⸻

vue chunks

Interface permettant d’explorer les textes réellement indexés dans le cortex.

informations affichées
• aperçu du chunk (texte)
• id du chunk
• document source + page
• score de densité (nombre de tokens)
• taille en tokens
• modèle d’embedding utilisé
• date d’indexation

fonctionnalités
• recherche mot clé
• filtrage par document
• tri par date, longueur ou score
• aperçu des embeddings (facultatif)
• export chunk (texte brut)

⸻

vue vector store

La vue s’adapte au moteur configuré dans le tenant :

si pgvector

Informations affichées :
• nombre de vecteurs
• taille de la table vector store
• nombre total de chunks
• vue SQL rapide
• taux de fragmentation
• temps moyen de requête (analyse optionnelle)

Requêtes système utiles :

SELECT COUNT(\*) FROM rag_embeddings;
SELECT pg_size_pretty(pg_total_relation_size('rag_embeddings'));

si qdrant

Informations exposées via l’API du moteur :
• nombre de points
• taille sur disque
• nombre d’indexes
• configuration HNSW
• topologie des segments
• ratio points actifs points tombstones

⸻

vue erreurs et qualité

Liste des documents ayant rencontré un problème :

erreurs typiques
• pdf illisible
• extraction impossible
• ocr en échec
• fichier vide
• format non supporté
• embeddings non générés
• chunks impossibles à créer

indicateurs qualité
• taux de documents indexés
• taux d’erreurs sur les 24 dernières heures
• volume de chunks anormaux (trop courts ou trop longs)
• recommandations automatiques (dans une future version)

⸻

Vue Recherche et Test

Interface pour tester le RAG en conditions réelles.

Fonctionnalités :

- Recherche sémantique globale
- Test de requête sur un document spécifique
- Affichage des chunks retournés avec scores
- Feedback sur la pertinence (✅/❌)
- Comparaison de requêtes (A/B test)

⸻

réglages rag

Page permettant à l’admin de configurer les paramètres pour toute l’instance :
• modèle d’embedding utilisé
• taille des chunks
• overlap
• filtres MIME type autorisés
• taille maximale par fichier
• activation ocr
• option de recalcul embeddings
• vector store utilisé (pgvector ou qdrant)

Ces paramètres reposent sur les mécanismes configurables déjà présents dans le core (LLMs, embeddings, réglages API) décrits dans la documentation architecture backend ￼.

⸻

endpoints backend associés

Pour intégrer ce module, les endpoints suivants doivent être ajoutés dans api/v1/documents :

liste documents

GET /api/v1/documents

détail document

GET /api/v1/documents/{id}

réindexation d’un document

POST /api/v1/documents/{id}/reindex

suppression d’un document

DELETE /api/v1/documents/{id}

liste chunks

GET /api/v1/documents/{id}/chunks
GET /api/v1/chunks?search=x&page=1

info vector store

GET /api/v1/rag/vector-store

La structure suit les conventions du backend extensions et admin définies dans les fichiers d’architecture plateforme et admin UI ￼ ￼.

⸻

rôle dans la plateforme

Le tableau de bord RAG devient un élément clé du positionnement SUPERFASTTT :
• permet aux entreprises de voir et comprendre ce que contient vraiment leur intelligence interne
• structure le cortex de connaissance comme un actif métier
• donne un langage commun entre dirigeants, équipes métiers et équipes techniques
• facilite le diagnostic IA et l’optimisation des agents
• participe à la démarche IA Native définie dans la vision générale de la plateforme ￼

⸻

évolutions prévues
• exploration vectorielle des proximités (nearest neighbors)
• carte sémantique du corpus
• suggestions de nettoyage et de consolidation
• alertes automatiques en cas de taux d’erreurs élevé
• comparaison avant après réindexation
• intégration avec les intégrations externes (google drive, notion, sharepoint)

⸻

conclusion

Ce module apporte une brique essentielle à SUPERFASTTT :
la capacité de donner de la transparence, du contrôle et de la compréhension sur le fonctionnement réel du RAG.

Il positionne le cortex de connaissance comme un élément structuré, pilotable et mesurable, parfaitement aligné avec l’architecture modulaire, souveraine et orientée entreprise de la plateforme.

⸻
