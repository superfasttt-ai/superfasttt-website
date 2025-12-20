mémoire ia avec mem0

document de référence pour la conception des écrans admin

objectif

Permettre aux administrateurs de configurer, superviser et contrôler le système de mémoire longue durée utilisé par les agents IA.
Cette rubrique gère les réglages globaux, la configuration du backend mémoire, les politiques de stockage, les limites, la purge et le monitoring.

⸻

structure globale de la rubrique

La rubrique se compose de trois sections principales : 1. paramètres globaux 2. configuration backend 3. monitoring et maintenance

⸻

1. paramètres globaux

écran paramètres généraux

Section affichée en premier dans la rubrique mémoire ia.

éléments à afficher :

activation mémoire
• switch
• description : active ou désactive la mémoire longue durée pour l’ensemble de l’instance
• tooltip : quand désactivé, aucune nouvelle information n’est ajoutée à la mémoire

modes de mémoire

mem0 propose plusieurs modes, à refléter dans l’UI :
• radio buttons
• mémoire conversationnelle
• mémoire personnelle
• mémoire contextuelle
• mémoire mixte
• description pour chaque mode

profondeur mémoire
• slider ou input numérique
• options mem0 natives : nombre maximum de mémoires conservées, taille maximale de chaque entrée
• tooltip : la profondeur définie la limite d’éléments par utilisateur avant consolidation

politique de consolidation

mem0 offre une réécriture automatisée (summaries) des mémoires anciennes.
• switch activer la consolidation
• champ : intervalle de consolidation
• toutes les 24h
• toutes les 72h
• toutes les 168h
• champ : type de consolidation
• résumé par lot
• fusion des mémoires similaires
• élimination des redondances
• champ : modèle utilisé pour la consolidation
• dropdown basé sur les modèles configurés dans superfasttt

politique de filtrage

(mem0 supporte le filtrage via LLM pour sélectionner ce qui est ajouté)
• switch activer filtrage
• champ : modèle pour filtrage mémoire
• champ : règles de filtrage
• toggle : ne pas stocker données personnelles sensibles
• toggle : ne pas stocker informations professionnelles critiques
• toggle : stocker uniquement préférences et habitudes
• input texte : règle de filtrage personnalisée (prompt utilisé par mem0)

⸻

2. configuration backend mémoire

écran choix du stockage

mem0 peut fonctionner avec différents backends.
Afficher les options sous forme de cards ou radio buttons.

backend disponible
• postgres (par défaut)
• qdrant
• redis (optionnel, si intégré plus tard)
• mixte (postgres pour données, qdrant pour vecteurs)

si postgres sélectionné
• afficher les champs suivants :
• schéma utilisé
• taille totale occupée
• nombre d’entrées mémoire
• index pgvector activé
• switch : activer similar search
• switch : activer search par texte brut

si qdrant sélectionné
• champs :
• url qdrant (read only si géré par superfasttt)
• collection utilisée
• nombre de vecteurs
• dimension embeddings
• distance metric
• switch : activer hnsw
• switch : activer compression

réglages embeddings

(mem0 supporte plusieurs modèles d’embeddings selon ton infra)
• dropdown : modèle embeddings utilisé
• preview coût estimé (optionnel)
• max dimension
• taille chunk mémoire pour vectorisation

⸻

3. monitoring et maintenance

écran monitoring

Présenter un tableau de bord simple avec charts shadcn.

indicateurs clés
• nombre total de mémoires
• mémoires créées 24h
• mémoires consolidées 24h
• taille totale stockage
• coût ia estimé des opérations mémoire (basé sur modèles utilisés)
• taux d’accès mémoire par requête llm
• temps moyen de récupération mémoire

charts
• ligne : évolution du volume mémoire dans le temps
• donut : répartition par type de mémoire (conversationnelle, personnelle, contextuelle)
• barres : modèles les plus utilisés pour consolidation et filtrage
• ligne : latence moyenne recherche mémoire
• barres : nombre de hits vs miss sur les recherches mémoire

⸻

écran maintenance

Actions administratives plus techniques.

purge partielle
• boutons :
• purger mémoires de plus de 30 jours
• purger mémoires de plus de 90 jours
• purger mémoires sans accès depuis 6 mois
• confirmation modale obligatoire

purge totale
• bouton : réinitialiser la mémoire de l’instance
• warning visuel rouge
• double confirmation obligatoire

export mémoire
• bouton : exporter la mémoire
• formats : json, csv
• tooltip : utile pour audit ou conformité

journal des opérations

Table listant :
• type opération : ajout, consolidation, filtrage, suppression
• nombre d’items impactés
• utilisateur lié
• date
• modèle utilisé
• action menée automatiquement par mem0

⸻

intégration dans l’admin superfasttt

emplacement dans le menu

paramètres  
 modèles ia  
 connecteurs  
 mémoire ia  
 sécurité

permissions nécessaires
• memory.manage
• memory.view
• memory.purge
• memory.export

⸻

styles et directives pour mockup
• composants shadcn pour inputs, sliders, tables, charts
• toujours utiliser les classes shadcn cohérentes avec admin
• privilégier cards séparées pour les sections
• garder la structure en colonnes sur desktop et une pile verticalisée sur mobile
• éviter surcharge visuelle, découper les blocs selon les sections ci dessus

⸻
