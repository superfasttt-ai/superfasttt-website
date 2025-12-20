# contexte entreprise

document de référence pour la conception des écrans admin

## objectif

Définir un noyau de contexte minimal, stable et transverse à toute l’instance.  
Ce contexte représente l’identité, les invariants et les règles globales de l’entreprise, utilisés par tous les agents IA, indépendamment des RAG métiers.

Le contexte entreprise est :

- natif
- permanent
- non désactivable
- séparé des knowledge bases métiers et des mémoires utilisateurs

---

# structure globale de la rubrique

La rubrique se compose de quatre blocs principaux :

1. vue d’ensemble
2. identité et positionnement
3. vocabulaire et style
4. règles globales pour les agents

Chaque bloc est entièrement éditable dans l’admin, sans notion de document source, uniquement du contenu clair et structuré.

---

# 1. vue d’ensemble

## écran vue d’ensemble

Page d’entrée de la rubrique contexte entreprise.

### éléments à afficher

- encart résumé
  - titre : résumé du contexte entreprise
  - texte court : 3 à 5 lignes décrivant l’entreprise et son positionnement
- indicateurs

  - nombre de blocs identité
  - nombre de blocs vocabulaire et style
  - nombre de règles globales actives
  - date de dernière mise à jour du contexte
  - utilisateur ayant effectué la dernière mise à jour

- info technique
  - état de la vectorisation du contexte
    - à jour
    - en attente de reindexation
  - modèle d’embedding utilisé pour ce contexte
  - taille totale du contexte en tokens

### actions

- bouton : modifier le résumé global
- bouton : ouvrir identité
- bouton : ouvrir vocabulaire et style
- bouton : ouvrir règles globales
- bouton : reindexer le contexte (si le texte a été modifié de façon importante)

---

# 2. identité et positionnement

## écran identité

Cette section décrit qui est l’entreprise, ce qu’elle fait et comment elle se présente.

### affichage

Liste de blocs structurés, sous forme de cartes :

- mission
- vision
- positionnement
- audience cible
- promesse principale
- piliers stratégiques
- valeurs clés

Chaque bloc affiche :

- titre du bloc
- extrait du contenu
- date de mise à jour
- auteur

### actions

- créer un bloc identité
- modifier un bloc
- dupliquer un bloc
- archiver un bloc

---

## écran détail bloc identité

Formulaire d’édition d’un bloc individuel.

### champs

- type de bloc

  - mission
  - vision
  - positionnement
  - valeurs
  - piliers stratégiques
  - autre (avec champ texte libre)

- titre du bloc
- contenu en clair

  - zone de texte riche
  - objectif : formulation lisible par un humain, pas un prompt brut

- importance

  - normale
  - élevée
  - critique

- ordre d’affichage
  - entier permettant d’ordonner les blocs dans l’injection

### métadonnées

- date de création
- date de mise à jour
- créé par
- modifié par

Ces métadonnées sont affichées mais non éditables dans l’UI.

---

# 3. vocabulaire et style

## écran vocabulaire et glossaire minimal

Cette section définit les termes clés et acronymes que les agents doivent comprendre et utiliser.

### affichage

Table de termes, chaque ligne avec :

- terme
- catégorie
- définition courte
- statut
- dernière mise à jour

Filtres possibles :

- rechercher par terme
- filtrer par catégorie
- filtrer par statut

### actions

- ajouter un terme
- modifier
- archiver
- importer un lexique à partir d’un fichier tableur
  - permettre l’upload d’un csv ou xlsx
  - mapping colonne terme et définition

---

## écran ajouter ou modifier un terme

### champs

- terme
- définition
- catégorie

  - produit
  - service
  - équipe
  - processus
  - finance
  - interne
  - autre

- synonymes

  - liste séparée par virgule

- notes pour l’ia

  - champ texte expliquant comment l’agent doit utiliser ou interpréter ce terme

- statut
  - actif
  - archivé

---

## écran style de communication

Définit le ton et le style à utiliser dans toutes les réponses générées.

### éléments

- ton global

  - proche du terrain
  - institutionnel
  - pédagogique
  - expert
  - convivial
  - autre

- champs texte

  - comment se présenter
    - exemple : “nous sommes …”
  - ton écrit
    - phrases types
    - choses à éviter
  - vouvoiement ou tutoiement
  - niveau de technicité
    - très simple
    - intermédiaire
    - expert

### actions

- modifier style
- réinitialiser aux valeurs par défaut

---

# 4. règles globales pour les agents

## écran liste des règles globales

Ces règles s’appliquent à tous les agents de l’instance, quels que soient les RAG métiers et les mémoires utilisateurs.

### affichage

Table des règles :

- titre
- type de règle
- importance
- appliquée à
  - tous les agents
  - liste d’agents
- statut
  - actif
  - désactivé
- dernière mise à jour

### actions

- créer une règle globale
- modifier
- dupliquer
- désactiver

---

## écran créer ou modifier une règle globale

### champs

- titre de la règle
- type

  - sécurité et conformité
  - contenu interdit
  - priorités métier
  - contraintes légales
  - contraintes internes
  - instructions comportementales
  - autre

- contenu en clair

  - description complète de la règle

- importance

  - normale
  - élevée
  - critique

- appliqué à

  - tous les agents
  - liste d’agents ou d’usages

- mode d’application
  - bloc hard
    - la règle ne peut pas être contournée
  - recommandation
    - la règle doit être suivie sauf contrainte contraire explicite

### métadonnées

- date de création
- date de mise à jour
- auteur

---

# comportement technique attendu

## injection dans les prompts

Le contexte entreprise est injecté automatiquement dans tous les appels aux modèles, avant les instructions agent spécifiques et avant tout RAG métier.

Ordre recommandé pour l’orchestration :

1. contexte entreprise kernel
   - identité
   - style
   - vocabulaire
   - règles globales
2. instructions spécifiques à l’agent
3. contexte conversationnel
4. résultats éventuels des RAG métiers

Le contexte est injecté sous forme de texte consolidé, éventuellement résumé, mais toujours issu de ces champs éditables.

## vectorisation

- tout le contenu actif du contexte kernel est vectorisé dans un index dédié
- ce vecteur n’est pas alimenté par des documents externes
- la vectorisation est relancée après des modifications importantes

## permissions

Nouveaux droits recommandés :

- context.view
- context.edit_identity
- context.edit_vocabulary
- context.edit_rules

Seuls les utilisateurs ayant les permissions adéquates peuvent modifier le contexte entreprise.

---
