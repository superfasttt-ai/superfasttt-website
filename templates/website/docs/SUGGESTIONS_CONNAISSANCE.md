suggestions de connaissance

Rubrique permettant d’identifier, revoir et valider les éléments de connaissance métier proposés automatiquement par l’IA avant leur intégration dans la mémoire d’entreprise.

⸻

objectif

Faciliter l’enrichissement continu du contexte entreprise en centralisant les suggestions issues :
• des interactions avec les agents IA
• des documents analysés
• des réponses récurrentes dans les conversations internes
• des workflows automatisés
• des contenus validés par les collaborateurs
• des patterns détectés dans les requêtes RAG

Cette rubrique sécurise la montée en compétence du système sans jamais exploiter de données personnelles ou de mémoire individuelle des utilisateurs.

⸻

structure globale de la rubrique

La sous-rubrique suggestions de connaissance se compose de trois vues : 1. inbox des suggestions 2. détail d’une suggestion 3. historique des décisions

⸻

1. inbox des suggestions

Écran principal présentant toutes les suggestions détectées par le système.

éléments affichés

Chaque suggestion est affichée sous forme de card ou ligne enrichie :
• titre proposé
• extrait de contenu
• catégorie potentielle (suggestion IA)
• score de pertinence (0–100)
• source :
• conversation
• agent
• document
• workflow
• date de détection
• boutons d’action :
• ajouter à la mémoire
• modifier avant ajout
• ignorer

filtres
• source (conversation, document, agent, workflow)
• score de pertinence
• catégorie suggérée
• date
• statut (nouveau, vu, modifié)

comportement
• les suggestions restent visibles tant qu’elles n’ont pas été validées ou ignorées
• aucune suggestion n’est ajoutée automatiquement à la mémoire entreprise
• les suggestions ignorées ne sont plus proposées (sauf changement majeur de contenu)

⸻

2. détail d’une suggestion

Écran permettant d’inspecter en profondeur la suggestion avant validation.

contenu affiché
• version complète du texte
• source exacte (ex : document X, fichier Y, agent Z)
• horodatage
• score de confiance IA
• catégorie proposée
• tags détectés
• prévisualisation du rendu final dans la mémoire RAG
• note explicative sur la logique de détection (ex : règle heuristique, consolidation, pattern)

actions disponibles
• modifier :
• texte libre
• catégorie
• tags
• titre
• ajouter à la mémoire :
• enregistre dans mémoire validée
• vectorise selon les paramètres du contexte entreprise
• déclenche les éventuelles automatisations associées
• supprime la suggestion de l’inbox
• ignorer :
• archive la suggestion
• empêche sa ré-émission automatique

⸻

3. historique des décisions

Vue permettant de suivre toutes les actions réalisées sur les suggestions.

informations affichées
• suggestion validée / ignorée
• utilisateur ayant pris la décision
• version modifiée (si applicable)
• catégorie choisie
• date et heure
• lien vers l’entrée dans la mémoire entreprise (si validée)
• raison optionnelle (champ texte libre)

filtrage et recherche
• par utilisateur
• par catégorie
• par type d’action
• par période
• par mot-clé dans la suggestion

⸻

fonctionnement technique

principes
• aucune donnée de mémoire personnelle n’est utilisée
• seules les productions explicites et professionnelles sont analysées
• la détection des suggestions repose sur :
• scores de répétition
• qualité des réponses IA validées par les humains
• cohérence métier
• patterns fréquents dans les requêtes
• signaux heuristiques intégrés dans SUPERFASTTT

pipeline 1. détection d’un bloc de connaissance potentielle 2. extraction du texte utile 3. anonymisation automatique (suppression noms, emails, références personnelles) 4. catégorisation automatique 5. scoring de pertinence 6. envoi dans la rubrique suggestions de connaissance

stockage
• suggestions stockées dans une table dédiée
• aucune inclusion automatique dans la mémoire entreprise
• conservation configurable (par défaut 90 jours)

⸻

permissions
• context.suggestions.view : voir les suggestions
• context.suggestions.manage : valider, modifier, ignorer
• context.suggestions.audit : consulter l’historique
• les permissions admin classiques ne donnent pas automatiquement accès aux suggestions

⸻

expérience utilisateur
• interface basée sur shadcn/ui
• affichage en cards sur desktop
• liste verticale sur mobile
• prévisualisation côté droit sur écrans larges
• actions rapides via dropdown
• transitions fluides
• faible charge cognitive
• design sans surcharge visuelle

⸻

bénéfices
• enrichissement continu de la mémoire entreprise
• transmission du savoir structurée et pérenne
• pas de captation de mémoire personnelle
• cohérence méthodologique dans toute l’entreprise
• gain de performance pour les agents IA
• facilitation du travail des managers et nouveaux arrivants
