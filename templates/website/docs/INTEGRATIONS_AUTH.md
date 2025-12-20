oauth

documentation développeur pour le module oauth du système d’intégrations superfasttt

⸻

objectif

Ce document décrit le fonctionnement complet de la couche oauth utilisée par les connecteurs superfasttt pour se connecter à des services externes comme google drive, sharepoint, slack, notion, dropbox, hubspot, salesforce, zoom et d’autres.

Le but est de fournir une architecture :
• souveraine
• sécurisée
• générique
• compatible avec tous les services oauth2
• simple à utiliser dans chaque connecteur

⸻

architecture générale

Le module oauth se trouve dans :

integrations/base/oauth.py
integrations/base/token_store.py
integrations/base/oauth_state.py

Il encapsule toutes les opérations nécessaires à un flux oauth complet :
• génération de l’url d’autorisation
• gestion du code et de l’échange access token
• gestion du refresh token
• sécurisation totale des tokens
• stockage chiffré dans postgres
• récupération transparente du token pour les connecteurs
• rotation silencieuse
• gestion du state anti csrf
• gestion des erreurs oauth proprement

L’objectif est que les connecteurs n’aient jamais à réécrire cette logique.

⸻

dépendances techniques

Le module repose sur trois éléments clés :

1. authlib

Bibliothèque oauth standard permettant :
• création des urls oauth
• validation de code
• refresh des tokens
• gestion scopes
• flux avec pkce
• compatibilité google, microsoft, slack, notion, hubspot, salesforce

2. cryptography fernet

Permet de chiffrer les tokens dans postgres.

Chaque access token, refresh token ou client secret est chiffré à la volée.

3. postgres

Stocke :
• tokens chiffrés
• dates d’expiration
• scopes
• type de service
• tenant id associé
• state temporaire pour le flux oauth

⸻

rôles du module oauth

Le module a 8 responsabilités.

1. construire l’url de connexion

url = oauth.get_authorization_url()

Cette url est affichée dans l’admin.

2. gérer le retour du service

Une fois que l’utilisateur autorise l’accès, le service redirige vers :

POST /integrations/<service>/callback

Le callback appelle :

token = oauth.exchange_code(code, state)

3. chiffrer les tokens

Avant stockage :

encrypted = fernet.encrypt(token_json)

4. stocker en base

Le module écrit dans la table :

integration_tokens
tenant_id
service_id
encrypted_token
expires_at
refresh_token
scopes
updated_at

5. fournir un token toujours valide

Un connecteur demande :

token = oauth.get_token()

Le module renvoie automatiquement :
• un token valide
ou
• régénère le token via refresh et renvoie le nouveau

6. gérer les erreurs oauth

Types gérés :
• invalid_grant
• token_expired
• refresh_failed
• expired_state
• invalid_scope
• rate_limited

7. gérer la rotation silencieuse

Si un token expire pendant un job :

oauth.refresh_token()

Le job continue automatiquement.

8. révoquer un token

Lorsqu’un utilisateur désactive l’intégration :

oauth.revoke()
oauth.delete_from_store()

⸻

fonctionnement détaillé

1. initialisation

Chaque connecteur instancie son client oauth :

self.oauth = OAuthClient(
tenant_id=tenant_id,
service_id="google-drive",
client_id=config.client_id,
client_secret=config.client_secret,
authorize_url=config.authorize_url,
token_url=config.token_url,
scopes=config.scopes
)

2. génération de l’url d’autorisation

auth_url = oauth.build_authorize_url(redirect_uri)

Le module génère :
• state sécurisé (CSRF)
• code_verifier (PKCE)
• code_challenge (PKCE)
• scopes
• redirect_uri

Le state est stocké temporairement dans redis ou postgres.

3. callback et échange du code

Une fois l’utilisateur revenu :

token = oauth.exchange_code(code, expected_state)

Authlib s’occupe :
• de valider le state
• d’échanger le code
• de récupérer access token et refresh token
• de valider la signature jwt si nécessaire

Le token est ensuite chiffré et stocké.

4. récupération du token valide

Lorsqu’un connecteur appelle :

token = oauth.get_valid_token()

Le module : 1. charge le token encrypté 2. déchiffre 3. vérifie la date d’expiration 4. si expiré → refresh automatique 5. si refresh réussi → stockage et retour 6. si refresh échoue → statut erreur pour l’admin

5. refresh automatique

new_token = oauth.refresh_token()

Ce flux est commun à tous les services, même si leurs règles diffèrent.

6. stockage chiffré

Grâce à fernet :

encrypted = fernet.encrypt(json.dumps(token).encode())

Le secret de fernet est propre à chaque instance client.

⸻

structure du code

oauthclient

class OAuthClient:
def build_authorize_url(self, redirect_uri): ...
def exchange_code(self, code, state): ...
def refresh_token(self): ...
def revoke(self): ...
def get_valid_token(self): ...

token store

class TokenStore:
def load(self, tenant_id, service_id): ...
def save(self, tenant_id, service_id, token): ...
def delete(self, tenant_id, service_id): ...

oauth state

Gère :
• state csrf
• code_verifier pkce
• expiration du state

⸻

gestion des erreurs

Toutes les erreurs oauth sont standardisées :
• oauth_invalid_state
• oauth_invalid_code
• oauth_expired
• oauth_refresh_failed
• oauth_revoked
• oauth_missing_scopes
• oauth_api_unavailable

Les erreurs sont visibles dans :
• la page d’intégration
• les logs
• le monitoring

⸻

interface admin

La rubrique intégrations affiche :
• bouton connecter
• bouton reconnecter
• statut du token
• date d’expiration du token
• date du prochain refresh
• derniers messages d’erreur oauth
• scopes accordés

L’utilisateur n’a jamais accès aux tokens chiffrés.

⸻

exemple minimal d’un flux oauth pour un connecteur

class GoogleDriveConnector(BaseConnector):
async def connect(self):
return await self.oauth.build_authorize_url(redirect_uri)

    async def callback(self, code, state):
        token = await self.oauth.exchange_code(code, state)
        await self.oauth.store.save(token)

    async def sync(self):
        token = await self.oauth.get_valid_token()
        files = await self.api.list_files(token)
        ...

Le connecteur ne gère jamais directement :
• l’expiration
• le refresh
• la sécurité
• le stockage

Tout est géré par le module oauth.

⸻

bonnes pratiques
• ne jamais stocker un token en clair
• toujours utiliser scopes minimaux
• toujours activer pkce quand le service le permet
• ne pas multiplier les refresh manuels
• utiliser get_valid_token dans les connecteurs
• prévoir une interface utilisateur simple dans l’admin
• loguer toutes les erreurs oauth

⸻

conclusion

Le module oauth de superfasttt fournit :
• une gestion oauth unifiée
• une sécurité maximale des tokens
• une indépendance vis à vis des services externes
• une architecture stable et scalable
• une intégration simple dans chaque connecteur

Grâce à ce module, chaque intégration peut être ajoutée en quelques heures plutôt qu’en plusieurs jours.

⸻
