# Terminologie - Authentification et Autorisation

> Glossaire complet des termes utilisés dans la documentation d'authentification SUPERFASTTT

---

## 🎯 Comment utiliser ce document

Ce glossaire clarifie les termes qui peuvent prêter à confusion, notamment :

- **OAuth2** (utilisé dans 3 contextes différents)
- **SSO** (Single Sign-On vs SSO Providers)
- **Tokens** (plusieurs types)
- **Scopes vs Permissions**

---

## A

### Access Token

**JWT de courte durée** utilisé pour accéder aux APIs.

**Contexte JWT Interne :**

- Algorithme : HS256
- Durée : 7 jours
- Usage : Appels API depuis l'admin SUPERFASTTT

**Contexte OAuth2 :**

- Algorithme : RS256
- Durée : 1 heure
- Usage : Appels API depuis apps tierces
- Vérifié avec clé publique (JWKS)

**Exemple :**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### API Key

**Token long-terme opaque** pour accès machine-to-machine sans utilisateur humain.

**Format :**

- Production : `sk_live_xxxxxxxxxxxxx`
- Test : `sk_test_xxxxxxxxxxxxx`

**Caractéristiques :**

- Stocké hashé (SHA256) en base de données
- Scopes granulaires (`documents:read`, `admin`)
- Révocable instantanément
- Pas d'expiration ou configurable

**Usage :** Scripts, webhooks, CI/CD, services backend

**Voir :** [API_KEYS_SYSTEM.md](./API_KEYS_SYSTEM.md)

---

### Authorization Code

**Code temporaire** généré par le serveur OAuth2 et échangé contre des tokens.

**Caractéristiques :**

- Durée de vie : 10 minutes
- Usage unique (invalide après échange)
- Format : UUID ou chaîne aléatoire sécurisée
- Lié à : client_id, user_id, redirect_uri, scopes

**Flow :**

```
1. User autorise app → Serveur génère code
2. Serveur redirect vers app : /callback?code=abc123
3. App échange code contre tokens (backend-to-backend)
4. Code devient invalide
```

**Voir :** [SSO_SUPERFASTTT.md](./SSO_SUPERFASTTT.md#authorization-code-flow)

---

### Authorization Server

**Serveur qui émet les tokens OAuth2.**

Dans le contexte SUPERFASTTT :

- **SUPERFASTTT = Authorization Server** pour apps tierces
- **Google/Microsoft = Authorization Server** pour login utilisateurs

**Synonymes :** OAuth2 Provider, Identity Provider (dans contexte OAuth2)

---

### Audience (aud)

**Claim JWT** indiquant le destinataire prévu du token.

**Exemple :**

```json
{
  "aud": "notebook-app-client-id",
  "sub": "user-uuid",
  "iss": "https://superfasttt.com"
}
```

L'app `notebook` doit vérifier que `aud` correspond à son `client_id`.

---

## C

### Client ID

**Identifiant public** d'une application OAuth2 enregistrée.

**Exemples :**

- `notebook-app-abc123`
- `assistant-xyz789`

**Non confidentiel** : peut être exposé dans le code frontend.

**Voir aussi :** Client Secret

---

### Client Secret

**Secret partagé** entre l'application OAuth2 et le serveur d'autorisation.

**Caractéristiques :**

- ⚠️ **CONFIDENTIEL** : ne JAMAIS exposer en frontend
- Stocké hashé (bcrypt) en base de données
- Utilisé pour authentifier l'app lors de l'échange de code
- Rotation régulière recommandée

**Utilisation :** Applications backend uniquement (pas SPA, pas mobile sans backend)

---

### Consent Screen

**Écran d'autorisation** affiché à l'utilisateur pour approuver les permissions demandées par une app.

**Exemple :**

```
┌─────────────────────────────────────────┐
│  Notebook IA demande accès à :          │
│                                         │
│  ✓ Votre profil et email               │
│  ✓ Lire vos documents                  │
│  ✓ Créer des conversations             │
│                                         │
│  [ Refuser ]  [ Autoriser ]            │
└─────────────────────────────────────────┘
```

**Bypass :** Apps "trusted" (is_trusted=true) skip le consent screen

---

## E

### External Identity Provider

**Service tiers** permettant l'authentification (Google, Microsoft, GitHub).

**Contexte :** SUPERFASTTT agit comme **client OAuth2** auprès de ces providers.

**Synonymes :** SSO Provider, External SSO, OAuth2 Provider (attention au contexte)

**Table DB :** `external_identity_providers`

**Voir :** [AUTHENTIFICATION.md](./AUTHENTIFICATION.md#sso-providers)

---

## G

### Grant Type

**Type de flow OAuth2** utilisé pour obtenir des tokens.

**SUPERFASTTT supporte :**

| Grant Type           | Usage                      | Sécurité  |
| -------------------- | -------------------------- | --------- |
| `authorization_code` | Apps avec backend          | ✅ Élevée |
| `refresh_token`      | Renouvellement token       | ✅ Élevée |
| `client_credentials` | Machine-to-machine (futur) | ✅ Élevée |

**Non supportés (moins sécurisés) :**

- ❌ `password` (resource owner password)
- ❌ `implicit` (deprecated)

---

## H

### HS256 (HMAC-SHA256)

**Algorithme de signature JWT symétrique.**

**Caractéristiques :**

- Utilise un secret partagé unique
- Signature ET vérification requièrent le secret
- Plus simple et rapide que RS256
- Pas de clé publique à exposer

**Usage dans SUPERFASTTT :** JWT internes (admin, sessions utilisateurs)

**Exemple :**

```python
jwt.encode(payload, "secret-key", algorithm="HS256")
```

**Voir aussi :** RS256

---

## I

### ID Token

**JWT OIDC** contenant les informations d'identité de l'utilisateur.

**Caractéristiques :**

- Retourné UNIQUEMENT si scope `openid` demandé
- Contient claims : sub, email, name, picture, etc.
- Signature RS256 vérifiable avec clé publique
- Ne doit PAS être utilisé pour appels API (utiliser access token)

**Exemple payload :**

```json
{
  "iss": "https://superfasttt.com",
  "sub": "user-uuid",
  "aud": "notebook-app",
  "exp": 1234567890,
  "email": "user@example.com",
  "name": "John Doe",
  "picture": "https://...",
  "tenant_id": "company-slug"
}
```

---

### Identity Provider (IdP)

**Système qui authentifie les utilisateurs et fournit leurs informations d'identité.**

**Contextes multiples :**

- **SUPERFASTTT = IdP** pour apps tierces (OAuth2 Provider)
- **Google/Microsoft = IdP** pour utilisateurs SUPERFASTTT (External SSO)

**Synonymes :** Authorization Server (OAuth2), SSO Provider

---

### Issuer (iss)

**Claim JWT** identifiant l'émetteur du token.

**Exemple :**

```json
{
  "iss": "https://superfasttt.com",
  "sub": "user-uuid"
}
```

Les apps doivent valider que `iss` correspond au serveur attendu.

---

## J

### JSON Web Key Set (JWKS)

**Ensemble de clés publiques** au format JSON pour vérifier les signatures JWT.

**Endpoint :** `GET /.well-known/jwks.json` ou `GET /auth/jwks`

**Exemple :**

```json
{
  "keys": [
    {
      "kty": "RSA",
      "use": "sig",
      "kid": "superfasttt-2024",
      "n": "modulus...",
      "e": "AQAB",
      "alg": "RS256"
    }
  ]
}
```

**Usage :** Apps tierces téléchargent JWKS pour valider access tokens localement

---

### JSON Web Token (JWT)

**Standard de token** encodé en Base64 contenant des claims JSON signés.

**Structure :**

```
header.payload.signature

eyJhbGc... (header)
.
eyJzdWI... (payload)
.
SflKxwRJ... (signature)
```

**Types dans SUPERFASTTT :**

- Access tokens (HS256 ou RS256)
- Refresh tokens (opaque UUID, pas JWT)
- ID tokens (RS256, OIDC)

---

## M

### Multi-Tenant

**Architecture** où une instance unique sert plusieurs organisations (tenants) avec isolation des données.

**Isolation dans SUPERFASTTT :**

- PostgreSQL schemas : `tenant_companya`, `tenant_companyb`
- Middleware : `SET search_path = tenant_xxx`
- Header : `X-Tenant-ID: company-slug`

**Voir :** [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## O

### OAuth2

**Protocole standard** pour déléguer l'accès à des ressources.

**⚠️ ATTENTION : 3 usages différents dans SUPERFASTTT :**

#### 1. OAuth2 Provider (SUPERFASTTT → Apps tierces)

- **SUPERFASTTT = serveur d'autorisation**
- Apps tierces utilisent OAuth2 pour accéder aux ressources SUPERFASTTT
- Endpoints : `/auth/authorize`, `/auth/token`
- **Doc :** [SSO_SUPERFASTTT.md](./SSO_SUPERFASTTT.md)

#### 2. OAuth2 Client (SUPERFASTTT → Services externes)

- **SUPERFASTTT = client OAuth2**
- Connexion vers Google Drive, Slack, Notion, etc.
- SUPERFASTTT demande accès aux ressources externes
- **Doc :** [INTEGRATIONS_OAUTH_CLIENT.md](./INTEGRATIONS_OAUTH_CLIENT.md)

#### 3. External SSO Providers (Google/Microsoft → SUPERFASTTT)

- **SUPERFASTTT = client OAuth2**
- Users s'authentifient via Google/Microsoft
- SUPERFASTTT récupère identity utilisateur
- **Doc :** [AUTHENTIFICATION.md](./AUTHENTIFICATION.md#sso-providers)

**Ces trois usages sont complémentaires et peuvent coexister.**

---

### OAuth2 Client

**Terme ambigu selon contexte :**

**Contexte A - Application qui utilise OAuth2 :**

- Dans SSO_SUPERFASTTT.md : app tierce (Notebook, Assistant) enregistrée
- Table DB : `oauth_clients`

**Contexte B - SUPERFASTTT comme client OAuth2 :**

- Dans INTEGRATIONS_OAUTH_CLIENT.md : SUPERFASTTT se connecte à Google Drive
- SUPERFASTTT demande des tokens à des services externes

**Toujours préciser le contexte pour éviter confusion !**

---

### OIDC (OpenID Connect)

**Extension d'OAuth2** pour l'authentification (en plus de l'autorisation).

**Ajoute à OAuth2 :**

- ID Token (JWT avec infos utilisateur)
- UserInfo endpoint (`/auth/userinfo`)
- Discovery endpoint (`/.well-known/openid-configuration`)
- Scopes standard : `openid`, `profile`, `email`

**Usage :** OAuth2 = autorisation, OIDC = authentification + autorisation

**Voir :** [SSO_SUPERFASTTT.md](./SSO_SUPERFASTTT.md)

---

### Opaque Token

**Token dont le contenu n'est pas lisible** sans interroger le serveur.

**Exemples :**

- Refresh tokens : UUID stocké en DB
- API Keys : Hash SHA256 en DB

**Opposé :** JWT (self-contained, décodable)

---

## P

### PKCE (Proof Key for Code Exchange)

**Extension OAuth2** pour sécuriser les apps publiques (SPA, mobile).

**Principe :**

```
1. App génère code_verifier (chaîne aléatoire)
2. App calcule code_challenge = SHA256(code_verifier)
3. App envoie code_challenge dans /authorize
4. Serveur stocke code_challenge avec authorization code
5. App envoie code_verifier dans /token
6. Serveur vérifie : SHA256(code_verifier) == code_challenge
```

**Protection :** Empêche interception du code par une app malveillante

**Obligatoire pour :** Apps sans client secret (SPA, mobile)

---

### Permission

**Droit d'accès granulaire** dans le système RBAC de SUPERFASTTT.

**Format :** `{resource}.{action}.{scope}`

**Exemples :**

- `documents.read.own` - Lire ses propres documents
- `documents.write.team` - Écrire documents de l'équipe
- `users.delete.all` - Supprimer tous les utilisateurs

**Voir :** [MODULE_PERMISSIONS.md](./MODULE_PERMISSIONS.md)

**Voir aussi :** Scope (OAuth2)

---

## R

### RBAC (Role-Based Access Control)

**Système de permissions** basé sur les rôles utilisateur.

**Rôles SUPERFASTTT :**

- `SUPER_ADMIN` : Toutes permissions globales
- `TENANT_ADMIN` : Admin du tenant
- `MANAGER` : Gestion d'équipe
- `USER` : Utilisateur standard
- `VIEWER` : Lecture seule
- `API_CLIENT` : Accès API uniquement

**Voir :** [MODULE_PERMISSIONS.md](./MODULE_PERMISSIONS.md)

---

### Redirect URI

**URL de callback** où le serveur OAuth2 redirige après autorisation.

**Exemple :**

```
https://notebook.example.com/auth/callback
```

**Sécurité :**

- Whitelist stricte en base de données (`oauth_clients.redirect_uris`)
- Validation exacte (pas de wildcards)
- Doit être HTTPS en production

**Erreur courante :** `redirect_uri` dans `/token` doit être IDENTIQUE à `/authorize`

---

### Refresh Token

**Token long-terme** pour renouveler les access tokens sans re-authentification.

**Caractéristiques :**

- Format : UUID opaque (pas JWT)
- Durée : 90 jours (configurable)
- Stockage : Base de données (table `refresh_tokens`)
- Révocable : Oui (flag `revoked`)
- Usage : Échange contre nouveau access token

**Flow :**

```
POST /auth/token
grant_type=refresh_token
&refresh_token=rt_xxxxx
&client_id=notebook-app
&client_secret=secret

→ Retourne nouveau access_token
```

**Sécurité :** Rotation optionnelle (émet nouveau refresh token à chaque usage)

---

### Resource Owner

**Utilisateur** qui possède les ressources protégées.

**Exemple :** User qui autorise Notebook IA à accéder à ses documents SUPERFASTTT

---

### RS256 (RSA-SHA256)

**Algorithme de signature JWT asymétrique.**

**Caractéristiques :**

- Utilise paire de clés RSA (publique + privée)
- Signature requiert clé privée (serveur uniquement)
- Vérification requiert clé publique (exposable via JWKS)
- Plus sécurisé pour OAuth2/OIDC
- Standard requis pour OIDC

**Usage dans SUPERFASTTT :** Access tokens OAuth2 pour apps tierces

**Exemple :**

```python
jwt.encode(
    payload,
    rsa_private_key,
    algorithm="RS256",
    headers={"kid": "superfasttt-2024"}
)
```

**Voir aussi :** HS256

---

## S

### Scope

**Terme avec DEUX significations différentes :**

#### Scope OAuth2

**Permission demandée** par une application OAuth2.

**Format :** String simple séparée par espaces

**Exemples :**

- `openid profile email` (OIDC standard)
- `documents.read documents.write`
- `conversations.create`

**Usage :** Définit ce qu'une app peut faire

#### Scope RBAC

**Portée d'une permission** dans le système RBAC.

**Format :** Suffixe de la permission

**Exemples :**

- `documents.read.{own|team|all}` - `own` est le scope
- `.own` = ressources propres
- `.team` = ressources de l'équipe
- `.all` = toutes ressources du tenant

**Mapping :** Scope OAuth2 → Permission RBAC selon rôle user

**Voir :** [AUTHENTICATION_ARCHITECTURE.md](./AUTHENTICATION_ARCHITECTURE.md#mapping-scopes-permissions)

---

### Single Sign-On (SSO)

**Mécanisme** permettant de s'authentifier une fois et accéder à plusieurs applications.

**⚠️ ATTENTION : Deux usages différents :**

#### SSO SUPERFASTTT (OAuth2 Provider)

- **SUPERFASTTT = fournisseur SSO**
- User se connecte sur SUPERFASTTT
- Accède aux apps tierces sans re-login
- **Doc :** [SSO_SUPERFASTTT.md](./SSO_SUPERFASTTT.md)

#### SSO Providers Externes (Google/Microsoft)

- **Google/Microsoft = fournisseur SSO**
- User se connecte avec compte Google/Microsoft
- Accède à SUPERFASTTT sans créer compte
- **Doc :** [AUTHENTIFICATION.md](./AUTHENTIFICATION.md#sso-providers)

**Les deux peuvent coexister !**

---

### State

**Paramètre aléatoire** pour protection CSRF dans OAuth2.

**Flow :**

```
1. App génère state = random()
2. App stocke state en session
3. App envoie /authorize?state=xxx
4. Serveur redirige /callback?state=xxx
5. App vérifie state reçu == state stocké
```

**Protection :** Empêche attaques CSRF (cross-site request forgery)

**Obligatoire :** Oui dans OAuth2

---

### Subject (sub)

**Claim JWT** identifiant l'utilisateur.

**Exemple :**

```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com"
}
```

**Format :** UUID de l'utilisateur dans SUPERFASTTT

---

## T

### Tenant

**Organisation/entreprise** dans un système multi-tenant.

**Isolation SUPERFASTTT :**

- Schema PostgreSQL : `tenant_{slug}`
- Identifiant : `tenant_id` (slug unique)
- Toutes les ressources liées à un tenant

**Exemple :** Company "Acme Corp" → `tenant_id: acme-corp`

---

### Token Endpoint

**Endpoint OAuth2** pour échanger authorization code contre tokens.

**URL :** `POST /auth/token`

**Usages :**

- Exchange authorization code → access token + refresh token
- Refresh access token avec refresh token

**Voir :** [SSO_SUPERFASTTT.md](./SSO_SUPERFASTTT.md#token-endpoint)

---

## U

### UserInfo Endpoint

**Endpoint OIDC** retournant les informations utilisateur.

**URL :** `GET /auth/userinfo`

**Authentification :** Access token requis

**Retourne :**

```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "picture": "https://...",
  "tenant_id": "company-slug",
  "role": "USER"
}
```

**Claims retournés :** Basés sur les scopes de l'access token

---

## W

### Well-Known Endpoint

**Endpoint de découverte OIDC** exposant la configuration du serveur.

**URL :** `GET /.well-known/openid-configuration`

**Retourne :**

```json
{
  "issuer": "https://superfasttt.com",
  "authorization_endpoint": "https://superfasttt.com/auth/authorize",
  "token_endpoint": "https://superfasttt.com/auth/token",
  "userinfo_endpoint": "https://superfasttt.com/auth/userinfo",
  "jwks_uri": "https://superfasttt.com/auth/jwks",
  "scopes_supported": ["openid", "profile", "email", "documents.read"],
  "response_types_supported": ["code"],
  "grant_types_supported": ["authorization_code", "refresh_token"]
}
```

**Usage :** Bibliothèques OAuth2 auto-découvrent la configuration

---

## Acronymes

| Acronyme   | Signification                          | Description                              |
| ---------- | -------------------------------------- | ---------------------------------------- |
| **OIDC**   | OpenID Connect                         | Extension OAuth2 pour authentification   |
| **OAuth2** | Open Authorization 2.0                 | Protocole d'autorisation                 |
| **JWT**    | JSON Web Token                         | Format de token encodé Base64            |
| **JWKS**   | JSON Web Key Set                       | Ensemble clés publiques JSON             |
| **PKCE**   | Proof Key for Code Exchange            | Extension OAuth2 sécurité apps publiques |
| **RBAC**   | Role-Based Access Control              | Contrôle accès basé rôles                |
| **SSO**    | Single Sign-On                         | Authentification unique multi-apps       |
| **IdP**    | Identity Provider                      | Fournisseur d'identité                   |
| **HMAC**   | Hash-based Message Authentication Code | Algorithme signature symétrique          |
| **RSA**    | Rivest-Shamir-Adleman                  | Algorithme cryptographie asymétrique     |
| **CSRF**   | Cross-Site Request Forgery             | Attaque web                              |
| **JIT**    | Just-In-Time                           | Provisioning automatique                 |

---

## Confusions fréquentes

### OAuth2 vs OIDC

- **OAuth2** = Autorisation (permission d'accéder à des ressources)
- **OIDC** = Authentification (qui est l'utilisateur) + Autorisation
- **OIDC = OAuth2 + ID Token + UserInfo + Discovery**

### Scope vs Permission

- **Scope OAuth2** = Ce qu'une app demande (`documents.read`)
- **Permission RBAC** = Ce qu'un user peut faire (`documents.read.own`)
- **Mapping** = Scope → Permissions selon rôle user

### Access Token vs Refresh Token

- **Access Token** = Court-terme (1h), JWT, pour appels API
- **Refresh Token** = Long-terme (90j), opaque, pour renouveler access token

### Client ID vs Client Secret

- **Client ID** = Public, identifie l'app
- **Client Secret** = Confidentiel, authentifie l'app

### HS256 vs RS256

- **HS256** = Symétrique, secret partagé, simple
- **RS256** = Asymétrique, paire clés, standard OIDC

### SSO Provider (deux sens)

- **SUPERFASTTT = SSO Provider** pour apps tierces
- **Google/Microsoft = SSO Provider** pour SUPERFASTTT

---

## Voir aussi

- **[AUTHENTICATION_ARCHITECTURE.md](./AUTHENTICATION_ARCHITECTURE.md)** - Vue d'ensemble
- **[SSO_SUPERFASTTT.md](./SSO_SUPERFASTTT.md)** - OAuth2/OIDC Provider
- **[AUTHENTIFICATION.md](./AUTHENTIFICATION.md)** - JWT interne + External SSO
- **[API_KEYS_SYSTEM.md](./API_KEYS_SYSTEM.md)** - API Keys
- **[MODULE_PERMISSIONS.md](./MODULE_PERMISSIONS.md)** - RBAC

---

**Dernière mise à jour :** 2025-01-22
