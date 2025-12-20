connecteurs

documentation développeur pour le système d’intégrations superfasttt

⸻

objectif

Cette documentation décrit le système de connecteurs utilisé par superfasttt pour intégrer des services externes tels que google drive, sharepoint, notion, slack, dropbox et d’autres sources de données.

Le but est de fournir une architecture générique, souveraine et extensible, permettant d’ajouter rapidement de nouvelles intégrations sans complexité ni duplication de code.

⸻

philosophie

superfasttt ne code pas chaque intégration indépendamment.
superfasttt fournit un framework de connecteurs.

Les connecteurs sont des modules autonomes capables de :
• se connecter à un service externe
• gérer l’authentification (oauth2 ou api key)
• synchroniser des données de manière incrémentale
• normaliser les contenus dans un format unique
• indexer les documents dans le cortex de connaissance
• gérer erreurs, quotas, logs, statuts
• exposer une interface simple dans l’admin

Ce modèle permet d’ajouter 50 intégrations sans alourdir le code du core.

⸻

architecture générale

superfasttt-core/
integrations/
base/
base_connector.py
oauth.py
token_store.py
scheduler.py
sync_state.py
logger.py
normalizer.py
google-drive/
manifest.json
connector.py
schemas/
sharepoint/
manifest.json
connector.py
schemas/
notion/
manifest.json
connector.py
schemas/
slack/
dropbox/
...

Chaque connecteur :
• hérite de BaseConnector
• définit ses propres méthodes minimalistes
• déclare son manifest lisible par le moteur
• s’appuie sur des loaders externes ou sa propre logique

⸻

cycle de vie d’un connecteur 1. installation
Le connecteur est chargé par le moteur au démarrage via son manifest. 2. connexion
L’utilisateur configure l’intégration dans l’admin.
Le connecteur gère oauth2 ou une clé API. 3. synchronisation
Le scheduler appelle le connecteur selon sa fréquence.
Le connecteur récupère les données par petites pages. 4. normalisation
Le connecteur transforme chaque élément en DocumentEnvelope. 5. indexation
Les documents sont envoyés au cortex et au vector store. 6. mise à jour incrémentale
Le connecteur utilise SyncState pour ne reprendre que les modifications. 7. gestion des erreurs
Les erreurs sont journalisées et visibles dans l’admin. 8. pause et reprise
Le connecteur peut être stoppé ou redémarré par l’utilisateur.

⸻

format manifest

Chaque connecteur commence par un fichier manifest.json :

{
"id": "google-drive",
"name": "Google Drive",
"description": "Synchronisation fichiers et dossiers",
"auth": {
"type": "oauth2",
"scopes": ["https://www.googleapis.com/auth/drive.readonly"]
},
"sync": {
"mode": "incremental",
"frequency": "15m"
},
"permissions": [
"integrations.read",
"integrations.manage"
]
}

⸻

base connector

Tous les connecteurs héritent de la classe BaseConnector.

exemple minimal

class ConnecteurGoogleDrive(BaseConnector):

    async def connect(self):
        return await self.oauth.create_token()

    async def refresh(self):
        return await self.oauth.refresh_token()

    async def pull(self, cursor=None):
        return await self.loader.list_files(cursor)

    async def normalize(self, raw_item):
        return DocumentEnvelope(
            id=raw_item["id"],
            title=raw_item["name"],
            content=None,
            source="google-drive",
            url=raw_item["webViewLink"],
            metadata=raw_item
        )

    async def sync(self):
        await self.run_incremental_sync()

La plupart des connecteurs tiennent en 40 à 80 lignes.

⸻

composantes techniques

oauth2

Le module oauth.py prend en charge :
• url d’autorisation
• échange du code
• refresh token
• gestion de l’expiration
• encryption des tokens en base

token store

Stockage sécurisé dans postgres, chiffré avec fernet.

scheduler

Tâches celery qui appellent les connecteurs selon la fréquence définie :
• sync immédiat
• sync planifié
• sync incrémental
• sync par intervalle

sync state

Stocke pour chaque connecteur :
• dernier cursor
• dernière date de sync
• id des éléments déjà traités
• erreurs rencontrées

normalizer

Transforme les données dans un format uniforme DocumentEnvelope.

logger

Chaque connecteur dispose de logs étendus :
• erreurs oauth
• erreurs api
• dépassement de quotas
• expirations
• documents récupérés
• temps de traitement

⸻

structure d’un connecteur

google-drive/
manifest.json
connector.py
schemas/
file.json
folder.json

Le connecteur :
• déclare comment se connecter
• gère la pagination
• transforme les données
• appelle un loader si nécessaire

⸻

loader externe ou api native

Un connecteur peut fonctionner de deux façons :

1. via un loader existant (ex. llama hub)

Très rapide à implémenter, idéal pour :
• google drive
• notion
• slack
• confluence

2. via une api native

Nécessaire pour les intégrations professionnelles :
• sharepoint
• salesforce
• hubspot

Les deux fonctionnent grâce au même framework.

⸻

format document envelope

Tous les connecteurs produisent ce format standard :

{
"id": "12345",
"title": "Document.pdf",
"content": "texte extrait…",
"source": "google-drive",
"url": "https://...",
"metadata": {
"mime_type": "application/pdf",
"owner": "Alex",
"size": 2048
},
"permissions": {
"visibility": "private"
}
}

Ce format est ensuite envoyé :
• au cortex
• au vector store (pgvector ou qdrant)
• au moteur de recherche interne

⸻

interface admin

Chaque connecteur apparaît dans la rubrique intégrations avec :
• bouton connecter
• statut (connecté, en attente, erreur)
• paramètres (dossiers à suivre, espaces, filtres)
• dernière synchronisation
• prochain run
• erreurs liées aux quotas
• logs complets
• bouton reconnecter oauth

Un connecteur peut être :
• activé
• désactivé
• mis en pause
• reconfiguré

⸻

ajout d’un nouveau connecteur

étape 1 : créer le dossier

integrations/mon-service/

étape 2 : créer le manifest

{
"id": "mon-service",
"auth": { "type": "api_key" },
"sync": { "mode": "incremental" }
}

étape 3 : créer le connector.py

class MonServiceConnector(BaseConnector):
async def pull(self, cursor=None):
return await self.api.list_changes(cursor)

    async def normalize(self, item):
        return DocumentEnvelope(...)

étape 4 : déclarer la fréquence

étape 5 : tester via l’admin

⸻

gestion des erreurs

Le moteur gère automatiquement :
• expiration oauth
• rafraîchissement token
• redémarrage backoff
• quotas atteints
• erreurs 429
• pagination cassée
• interruptions réseau

L’utilisateur voit tout dans la section logs.

⸻

bonnes pratiques
• toujours paginer
• toujours respecter les quotas
• toujours écrire un normalizer clair
• ne pas stocker d’informations sensibles
• utiliser metadata pour conserver les infos utiles
• privilégier les loaders externes quand ils existent

⸻

conclusion

Ce système de connecteurs donne à superfasttt :
• une architecture souveraine
• la possibilité d’ajouter des dizaines d’intégrations
• un code maintenable
• une cohérence totale entre connecteurs
• une expérience admin simple et fiable

Ce framework est la base indispensable pour proposer un catalogue d’intégrations riche sans alourdir l’architecture.

⸻
