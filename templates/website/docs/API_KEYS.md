gestion des api keys

Ce document décrit le fonctionnement du module API Keys de superfasttt, la manière dont les clés sont générées, stockées, utilisées, et gérées depuis l’Admin UI.

Les API keys permettent à des applications externes, scripts, automations ou outils no code d’appeler l’API de l’instance superfasttt de façon sécurisée, sans passer par l’authentification utilisateur classique.

⸻

objectifs du module

Le système d’API keys permet :
• de générer des clés d’accès pour l’API REST
• de définir précisément les permissions accordées à chaque clé
• de gérer plusieurs clés par utilisateur ou par instance
• de révoquer une clé à tout moment
• de tracer l’utilisation des clés (audit)
• de simplifier l’accès pour les intégrations externes

Ce module s’appuie sur le même système RBAC que l’authentification utilisateur, mais appliqué à un contexte machine à machine.

⸻

fonctionnement général

modèle d’authentification

Une API key est envoyée dans l’en-tête HTTP :

Authorization: Bearer sk_live_xxxxxx

Le backend : 1. récupère la clé brute 2. calcule son hash 3. recherche un hash correspondant dans la base 4. vérifie qu’elle n’est pas révoquée 5. charge les permissions associées 6. injecte un utilisateur technique dans la requête

La clé n’est jamais stockée en clair, seul un hash est conservé.

⸻

schéma de la base de données

Table : api_keys

colonne type description
id uuid identifiant unique
tenant_id text tenant associé
user_id uuid (nullable) optionnel, propriétaire humain
name text nom affiché dans l’admin
key_hash text hash sécurisé de la clé
permissions text[] permissions associées
created_at timestamp date de création
last_used_at timestamp (nullable) dernière utilisation
ip_last_used text (nullable) adresse ip
revoked_at timestamp (nullable) date de révocation

⸻

génération d’une clé

Lorsqu’une API key est créée : 1. une clé est générée localement (préfixe sk*live*...) 2. un hash sécurisé est stocké en base 3. la clé brute est affichée une seule fois dans l’Admin UI 4. la clé brute n’est jamais retrievable ensuite

La clé générée est compatible avec les intégrations suivantes :
• n8n
• make
• zapier
• curl
• intégrations internes
• scalar (pour tester les instances)

⸻

permissions associées

Chaque API key possède un ensemble de permissions.

Elles peuvent être :
• héritées d’un rôle (si associée à un user)
• définies manuellement
• limitées à un scope métier

Exemples :
• documents.read.all
• documents.write.all
• rag.query
• mcp.execute
• extensions.facturation.read
• extensions.facturation.manage
• analytics.read

Les wildcards \* sont supportées.

⸻

utilisation dans les appels api

Exemple :

curl -X GET \
 -H "Authorization: Bearer sk_live_Qhs8..." \
 https://client.superfasttt.com/api/documents

Ou avec JavaScript :

await fetch("https://client.superfasttt.com/api/documents", {
headers: {
Authorization: "Bearer sk_live_Qhs8..."
}
})

Ou depuis Scalar :
• sélectionner l’instance
• insérer l’API key dans les headers
• tester les endpoints en direct

⸻

audit et traçabilité

À chaque appel :
• last_used_at est mis à jour
• ip_last_used est enregistré
• un audit log peut être généré (optionnel)
• les permissions appliquées sont enregistrées (optionnel)

Cela permet de repérer :
• quelles clés sont encore actives
• quelles clés ne servent plus
• quelles clés posent potentiellement un problème

⸻

gestion dans l’admin ui

Le module apparaît dans :

Admin UI → paramètres → api keys

liste des clés existantes

La page liste toutes les clés de l’instance :
• nom
• date de création
• propriétaire
• permissions
• dernière utilisation
• ip d’origine
• statut (active ou révoquée)

création d’une nouvelle clé

Workflow : 1. cliquer sur “nouvelle clé” 2. donner un nom 3. choisir le propriétaire (facultatif) 4. définir les permissions 5. valider 6. la clé brute apparaît dans une modal, avec copie possible

Note : la clé ne sera plus jamais affichée ensuite.

modification d’une clé

Pour chaque clé :
• changement du nom
• ajustement des permissions
• visualisation de l’usage

révocation d’une clé

Une clé peut être :
• révoquée immédiatement
• réactivée (si non supprimée définitivement)

Révoquer une clé la rend inutilisable instantanément.

suppression d’une clé

Supprime la ligne en base.
Action définitive, généralement utilisée pour nettoyer les environnements.

⸻

sécurité

Le système d’API keys suit les règles suivantes :
• hashage obligatoire côté serveur
• affichage unique de la clé brute
• permissions granulaires
• même système RBAC que les utilisateurs
• support wildcard sécurisé
• isolation stricte par tenant
• audit complet
• compatibilité avec les quotas et rate limits
• jamais stockée côté client superfasttt

⸻

cas d’usage typiques

intégrations no code (n8n, make, zapier)

Les clés permettent d’automatiser :
• traitement de documents
• exécution d’agents
• envoi de messages
• synchronisation de données

apps tierces du marketplace

Les développeurs peuvent :
• appeler l’API superfasttt
• utiliser MCP
• exploiter le RAG
• déclencher des workflows IA

développement interne

Pour tester un environnement via Scalar :
• sélectionner l’instance
• ajouter l’API key dans les headers
• tester l’API sans authentification UI

⸻

résumé

Le module API keys fournit :
• un système complet et sécurisé d’accès machine à machine
• un contrôle total des permissions
• une gestion simple via l’Admin UI
• une intégration native avec Scalar et les outils externes
• une compatibilité totale avec l’architecture multi-instance de superfasttt
