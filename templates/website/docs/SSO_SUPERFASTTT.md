# Architecture SSO pour SUPERFASTTT avec OAuth2 et OIDC

> **✅ STATUT (Décembre 2025) :**
>
> - ✅ **OAuth2 Authorization Code Flow** avec PKCE - IMPLÉMENTÉ
> - ✅ **Tables oauth2_clients et oauth2_authorization_codes** - IMPLÉMENTÉ
> - ✅ **Endpoints /auth/authorize, /auth/token, /auth/silent-authorize** - IMPLÉMENTÉ
> - ✅ **Admin API pour gérer les clients OAuth2** - IMPLÉMENTÉ
> - ✅ **SSO entre apps (knowledge-hub, admin, sf-project, sf-workflow)** - IMPLÉMENTÉ
> - ⏳ **JWT RS256 + JWKS** - En cours (HS256 fonctionne actuellement)
> - ⏳ **External SSO Providers (Google/Microsoft)** - À implémenter
>
> Voir [SSO_IMPLEMENTATION_ROADMAP.md](./SSO_IMPLEMENTATION_ROADMAP.md) pour le planning détaillé.

## Navigation Documentation

| Document                                                               | Description                                                |
| ---------------------------------------------------------------------- | ---------------------------------------------------------- |
| **[AUTHENTICATION_ARCHITECTURE.md](./AUTHENTICATION_ARCHITECTURE.md)** | 📖 **Vue d'ensemble** - Document maître d'authentification |
| **[AUTH_TERMINOLOGY.md](./AUTH_TERMINOLOGY.md)**                       | 📚 Glossaire des termes OAuth2/OIDC/SSO                    |
| **[SSO_IMPLEMENTATION_ROADMAP.md](./SSO_IMPLEMENTATION_ROADMAP.md)**   | 🗓️ Planning d'implémentation détaillé                      |
| **[AUTHENTIFICATION.md](./AUTHENTIFICATION.md)**                       | 🔐 Authentification interne (JWT HS256)                    |
| **[API_KEYS_SYSTEM.md](./API_KEYS_SYSTEM.md)**                         | 🔑 API Keys pour accès machine-to-machine                  |

---

## Contexte et objectif

SUPERFASTTT doit supporter des applications externes (notebook IA, assistant spécialisé, analytics, etc.) hébergées sur des **domaines distincts**, tout en offrant une **expérience d'authentification unique (Single Sign-On)**.

### Cas d'usage

**Scénario 1 - Utilisateur avec compte email/password :**

```
1. User se connecte sur SUPERFASTTT avec email/password
2. User clique sur "Ouvrir Notebook IA" → redirect vers notebook.example.com
3. Notebook redirige vers SUPERFASTTT OAuth2
4. SUPERFASTTT détecte session existante → génère code immédiatement
5. User connecté sur Notebook SANS re-login ✅
6. User clique sur "Ouvrir Assistant" → même process, SANS re-login ✅
```

**Scénario 2 - Entreprise avec Google Workspace :**

```
1. User employee@acme-corp.com visite SUPERFASTTT
2. Clique "Se connecter avec Google"
3. Authentifié par Google Workspace
4. Compte créé automatiquement dans SUPERFASTTT
5. User peut maintenant accéder aux apps tierces via SSO SUPERFASTTT ✅
```

### Objectif technique

L'utilisateur se connecte **une seule fois** et accède à **toutes les applications** sans re-saisir ses identifiants.

Cette architecture suit les standards **OAuth 2.0 (RFC 6749)** et **OpenID Connect**, utilisés par Google, Microsoft, GitHub et autres Identity Providers majeurs.

### Pourquoi OAuth2/OIDC ?

✅ **Standard industriel** - Bibliothèques disponibles dans tous les langages
✅ **Sécurité éprouvée** - Utilisé par Google, Microsoft, GitHub, etc.
✅ **Délégation de permissions** - User autorise explicitement chaque app
✅ **Révocation granulaire** - User peut révoquer accès par app
✅ **Audit complet** - Traçabilité de tous les accès
✅ **Scalabilité** - Support de milliers d'apps tierces
✅ **Interopérabilité** - Apps peuvent utiliser bibliothèques OAuth2 standard

## principes fondamentaux

### ce que nous voulons éviter

- cookies partagés entre domaines (limité à \*.example.com, risques XSS)
- tokens dans les URLs (exposition dans les logs)
- authentification custom non-standard (maintenance complexe)
- session côté client uniquement (révocation impossible)

### ce que nous voulons atteindre

- authentification unique sur n'importe quel domaine
- tokens scopés par application avec révocation granulaire
- compatibilité avec les standards OAuth2/OIDC
- support futur de Sign in with Google/Microsoft
- audit complet des accès
- expérience utilisateur fluide (pas de re-login)

## architecture générale

### composants

```
superfasttt identity provider
├── backend (fastapi)
│   ├── /auth/authorize (authorization endpoint)
│   ├── /auth/token (token endpoint)
│   ├── /auth/userinfo (oidc userinfo)
│   ├── /auth/revoke (révocation)
│   └── /.well-known/openid-configuration (discovery)
├── frontend (next.js)
│   ├── /auth/login (page de connexion)
│   └── /auth/consent (écran de consentement)
└── base de données
    ├── oauth_clients (apps enregistrées)
    ├── authorization_codes (codes temporaires)
    ├── refresh_tokens (tokens longue durée)
    └── user_consents (permissions accordées)

applications externes
├── notebook.example.com
├── assistant.example.com
└── analytics.example.com
    ├── utilisent next-auth ou autre lib oauth2
    ├── configurent superfasttt comme provider
    └── refresh automatique des access tokens
```

### flux utilisateur typique

```
user visite notebook.example.com (première fois)
↓
redirect → superfasttt.example.com/auth/authorize
↓
superfasttt vérifie session
├─ session existe → consent screen (si première app)
└─ pas de session → page de login
↓
user se connecte (email/password, google, etc.)
↓
superfasttt crée session locale (cookie httpOnly)
↓
génère authorization code
↓
redirect → notebook.example.com/callback?code=xxx
↓
notebook échange code contre tokens (backend-to-backend)
↓
notebook stocke refresh_token en base (chiffré)
↓
user connecté sur notebook

user visite assistant.example.com (même navigateur)
↓
redirect → superfasttt.example.com/auth/authorize
↓
superfasttt voit la session existante
↓
génère authorization code immédiatement
↓
redirect → assistant.example.com/callback?code=yyy
↓
user connecté SANS re-saisir password
```

### intégration external sso providers (google/microsoft)

SUPERFASTTT agit comme **client OAuth2** auprès de Google/Microsoft pour permettre aux entreprises de se connecter avec leurs comptes professionnels.

```
┌─────────────────────────────────────────────────────────────────┐
│                     Dual Role de SUPERFASTTT                     │
│                                                                  │
│  ┌──────────────────────┐          ┌──────────────────────┐     │
│  │  SUPERFASTTT comme   │          │  SUPERFASTTT comme   │     │
│  │  CLIENT OAuth2       │          │  PROVIDER OAuth2     │     │
│  │  (vers Google/MS)    │          │  (pour apps tierces) │     │
│  └──────────────────────┘          └──────────────────────┘     │
│           │                                    │                │
│           │ 1. Login Google                    │                │
│           ▼                                    ▼                │
│  User → Google OAuth → SUPERFASTTT → JWT → Apps tierces OAuth2 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Flux complet avec External SSO :**

```
1. User employee@acme-corp.com visite SUPERFASTTT
   ↓
2. Clique "Se connecter avec Google Workspace"
   ↓
3. Redirect → accounts.google.com (Google Authorization)
   ↓
4. User s'authentifie sur Google
   ↓
5. Google redirect → superfasttt.com/auth/callback/google?code=xxx
   ↓
6. SUPERFASTTT échange code Google contre access_token
   ↓
7. SUPERFASTTT récupère profil user depuis Google (email, nom, photo)
   ↓
8. SUPERFASTTT trouve ou crée user en base (JIT provisioning)
   ↓
9. SUPERFASTTT crée session JWT HS256 (auth interne)
   ↓
10. User maintenant connecté sur SUPERFASTTT
   ↓
11. User visite notebook.example.com
   ↓
12. Notebook redirect → superfasttt.com/auth/authorize (OAuth2)
   ↓
13. SUPERFASTTT voit session existante → génère authorization code
   ↓
14. Redirect → notebook.example.com/callback?code=yyy
   ↓
15. Notebook échange code contre access_token (OAuth2)
   ↓
16. User connecté sur Notebook via SSO SUPERFASTTT
    (qui lui-même a authentifié via Google SSO)
```

**Tables supplémentaires pour External SSO :**

```sql
-- Configuration SSO providers par tenant
CREATE TABLE external_identity_providers (
    id UUID PRIMARY KEY,
    tenant_id VARCHAR(100) NOT NULL,
    provider VARCHAR(50) NOT NULL,  -- 'google', 'microsoft', 'github'
    client_id VARCHAR(255) NOT NULL,
    client_secret_encrypted TEXT NOT NULL,
    config JSONB,  -- domain_restriction, microsoft_tenant_id, etc.
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Linking users SUPERFASTTT <-> comptes externes
CREATE TABLE user_external_identities (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    provider VARCHAR(50) NOT NULL,
    external_user_id VARCHAR(255) NOT NULL,  -- Google sub, Microsoft oid
    external_email VARCHAR(255),
    metadata JSONB,
    linked_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(provider, external_user_id)
);
```

**Voir :** [AUTHENTIFICATION.md](./AUTHENTIFICATION.md#sso-providers) pour détails implémentation External SSO.

---

## modèle de données

### table oauth_clients

Enregistrement des applications externes autorisées.

```sql
CREATE TABLE oauth_clients (
    id UUID PRIMARY KEY,
    client_id VARCHAR(255) UNIQUE NOT NULL,
    client_secret_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url VARCHAR(500),
    redirect_uris TEXT[] NOT NULL,
    allowed_scopes TEXT[] NOT NULL,
    is_trusted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- index pour recherche rapide
CREATE INDEX idx_oauth_clients_client_id ON oauth_clients(client_id);
```

Champs importants :

- client_id : identifiant public (ex: notebook-app)
- client_secret_hash : secret hashé avec bcrypt (jamais en clair)
- redirect_uris : whitelist stricte des URLs de callback
- allowed_scopes : permissions maximales que l'app peut demander
- is_trusted : si true, pas de consent screen

### table authorization_codes

Codes éphémères échangés contre des tokens.

```sql
CREATE TABLE authorization_codes (
    id UUID PRIMARY KEY,
    code VARCHAR(255) UNIQUE NOT NULL,
    client_id VARCHAR(255) NOT NULL REFERENCES oauth_clients(client_id),
    user_id UUID NOT NULL REFERENCES users(id),
    redirect_uri VARCHAR(500) NOT NULL,
    scopes TEXT[] NOT NULL,
    code_challenge VARCHAR(255),
    code_challenge_method VARCHAR(10),
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- index pour validation rapide
CREATE INDEX idx_auth_codes_code ON authorization_codes(code);
CREATE INDEX idx_auth_codes_expires ON authorization_codes(expires_at);

-- nettoyage automatique des codes expirés
CREATE INDEX idx_auth_codes_cleanup ON authorization_codes(created_at)
WHERE used = true OR expires_at < NOW();
```

Propriétés :

- durée de vie : 10 minutes
- usage unique (used=true après échange)
- code_challenge : support PKCE pour apps publiques

### table refresh_tokens

Tokens longue durée pour renouveler les access tokens.

```sql
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY,
    token VARCHAR(255) UNIQUE NOT NULL,
    client_id VARCHAR(255) NOT NULL REFERENCES oauth_clients(client_id),
    user_id UUID NOT NULL REFERENCES users(id),
    scopes TEXT[] NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN DEFAULT false,
    last_used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- index pour validation et révocation
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_client ON refresh_tokens(client_id, user_id);
```

Caractéristiques :

- durée de vie : 90 jours par défaut
- opaque (UUID, pas JWT)
- révocable individuellement
- rotation possible (émission nouveau token à chaque refresh)

### table user_consents

Consentements utilisateur pour chaque application.

```sql
CREATE TABLE user_consents (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    client_id VARCHAR(255) NOT NULL REFERENCES oauth_clients(client_id),
    scopes TEXT[] NOT NULL,
    granted_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,

    UNIQUE(user_id, client_id)
);

-- index pour vérification rapide
CREATE INDEX idx_user_consents_lookup ON user_consents(user_id, client_id);
```

Permet :

- éviter de redemander le consentement à chaque connexion
- révocation par l'utilisateur via interface
- audit des permissions accordées

## implémentation backend superfasttt

### endpoint authorization

Point d'entrée OAuth2, gère la redirection vers login et génération du code.

```python
# core/routes/oauth.py

from fastapi import APIRouter, Request, HTTPException, Depends
from fastapi.responses import RedirectResponse, HTMLResponse
from datetime import datetime, timedelta
import secrets

router = APIRouter(prefix="/auth", tags=["oauth"])

@router.get("/authorize")
async def authorize(
    request: Request,
    response_type: str,
    client_id: str,
    redirect_uri: str,
    scope: str,
    state: str,
    code_challenge: str = None,
    code_challenge_method: str = None,
    prompt: str = None
):
    """
    OAuth2 Authorization Endpoint

    Paramètres:
    - response_type: doit être "code" (authorization code flow)
    - client_id: identifiant de l'application
    - redirect_uri: URL de callback (doit être whitelistée)
    - scope: permissions demandées (ex: "openid profile documents.read")
    - state: valeur aléatoire pour protection CSRF
    - code_challenge: hash pour PKCE (optionnel)
    - code_challenge_method: S256 ou plain
    - prompt: none|login|consent
    """

    # validation du response_type
    if response_type != "code":
        raise HTTPException(
            status_code=400,
            detail="unsupported_response_type"
        )

    # validation du client
    client = await oauth_service.get_client(client_id)
    if not client:
        raise HTTPException(
            status_code=400,
            detail="invalid_client"
        )

    # validation du redirect_uri
    if redirect_uri not in client.redirect_uris:
        raise HTTPException(
            status_code=400,
            detail="invalid_redirect_uri"
        )

    # validation des scopes
    requested_scopes = scope.split()
    if not all(s in client.allowed_scopes for s in requested_scopes):
        raise HTTPException(
            status_code=400,
            detail="invalid_scope"
        )

    # récupération de la session utilisateur
    session = await auth_service.get_current_session(request)

    # pas de session et prompt=none → erreur
    if not session and prompt == "none":
        return redirect_with_error(
            redirect_uri,
            "login_required",
            state
        )

    # pas de session → redirect vers login
    if not session:
        login_url = (
            f"/auth/login?"
            f"returnTo=/auth/authorize"
            f"?response_type={response_type}"
            f"&client_id={client_id}"
            f"&redirect_uri={redirect_uri}"
            f"&scope={scope}"
            f"&state={state}"
        )
        return RedirectResponse(url=login_url)

    # vérification du consentement
    consent = await oauth_service.get_user_consent(
        user_id=session.user_id,
        client_id=client_id
    )

    # pas de consentement et app non trusted → consent screen
    if not consent and not client.is_trusted and prompt != "none":
        return await render_consent_screen(
            client=client,
            user=session.user,
            scopes=requested_scopes,
            state=state
        )

    # génération de l'authorization code
    code = await oauth_service.create_authorization_code(
        client_id=client_id,
        user_id=session.user_id,
        redirect_uri=redirect_uri,
        scopes=requested_scopes,
        code_challenge=code_challenge,
        code_challenge_method=code_challenge_method
    )

    # enregistrement du consentement si nouveau
    if not consent:
        await oauth_service.save_user_consent(
            user_id=session.user_id,
            client_id=client_id,
            scopes=requested_scopes
        )

    # redirect vers l'app avec le code
    callback_url = f"{redirect_uri}?code={code.code}&state={state}"
    return RedirectResponse(url=callback_url)


def redirect_with_error(redirect_uri: str, error: str, state: str):
    """Redirect avec erreur OAuth2"""
    url = f"{redirect_uri}?error={error}"
    if state:
        url += f"&state={state}"
    return RedirectResponse(url=url)


async def render_consent_screen(client, user, scopes, state):
    """Affiche l'écran de consentement"""
    return HTMLResponse(
        content=templates.render("consent.html", {
            "client": client,
            "user": user,
            "scopes": scopes,
            "state": state,
            "scope_descriptions": get_scope_descriptions(scopes)
        })
    )
```

### endpoint token

Échange le code contre les tokens ou refresh un access token.

```python
@router.post("/token")
async def token(
    grant_type: str = Form(...),
    code: str = Form(None),
    refresh_token: str = Form(None),
    client_id: str = Form(...),
    client_secret: str = Form(...),
    redirect_uri: str = Form(None),
    code_verifier: str = Form(None)
):
    """
    OAuth2 Token Endpoint

    Deux flows supportés:
    1. authorization_code: échange code contre tokens
    2. refresh_token: renouvelle access token
    """

    # authentification du client
    client = await oauth_service.authenticate_client(
        client_id=client_id,
        client_secret=client_secret
    )

    if not client:
        raise HTTPException(
            status_code=401,
            detail="invalid_client"
        )

    if grant_type == "authorization_code":
        return await handle_authorization_code_grant(
            client=client,
            code=code,
            redirect_uri=redirect_uri,
            code_verifier=code_verifier
        )

    elif grant_type == "refresh_token":
        return await handle_refresh_token_grant(
            client=client,
            refresh_token=refresh_token
        )

    else:
        raise HTTPException(
            status_code=400,
            detail="unsupported_grant_type"
        )


async def handle_authorization_code_grant(
    client,
    code: str,
    redirect_uri: str,
    code_verifier: str = None
):
    """Échange authorization code contre tokens"""

    # récupération et validation du code
    auth_code = await oauth_service.get_authorization_code(code)

    if not auth_code:
        raise HTTPException(400, "invalid_grant")

    if auth_code.used:
        # tentative de réutilisation → révoque tous les tokens
        await oauth_service.revoke_all_tokens_for_code(code)
        raise HTTPException(400, "invalid_grant")

    if auth_code.expired:
        raise HTTPException(400, "invalid_grant")

    if auth_code.client_id != client.client_id:
        raise HTTPException(400, "invalid_grant")

    if auth_code.redirect_uri != redirect_uri:
        raise HTTPException(400, "invalid_grant")

    # validation PKCE si présent
    if auth_code.code_challenge:
        if not code_verifier:
            raise HTTPException(400, "code_verifier_required")

        if not verify_pkce(
            code_verifier,
            auth_code.code_challenge,
            auth_code.code_challenge_method
        ):
            raise HTTPException(400, "invalid_grant")

    # marquer le code comme utilisé
    await oauth_service.mark_code_as_used(code)

    # générer access token (JWT)
    access_token = jwt_service.generate_access_token(
        user_id=auth_code.user_id,
        client_id=client.client_id,
        scopes=auth_code.scopes,
        expires_in=3600  # 1 heure
    )

    # générer refresh token (opaque)
    refresh_token = await oauth_service.create_refresh_token(
        client_id=client.client_id,
        user_id=auth_code.user_id,
        scopes=auth_code.scopes,
        expires_in=90 * 24 * 3600  # 90 jours
    )

    # générer id_token si scope openid présent
    id_token = None
    if "openid" in auth_code.scopes:
        user = await user_service.get_user(auth_code.user_id)
        id_token = jwt_service.generate_id_token(
            user=user,
            client_id=client.client_id,
            scopes=auth_code.scopes
        )

    return {
        "access_token": access_token,
        "token_type": "Bearer",
        "expires_in": 3600,
        "refresh_token": refresh_token.token,
        "scope": " ".join(auth_code.scopes),
        "id_token": id_token
    }


async def handle_refresh_token_grant(client, refresh_token: str):
    """Renouvelle access token avec refresh token"""

    rt = await oauth_service.get_refresh_token(refresh_token)

    if not rt:
        raise HTTPException(400, "invalid_grant")

    if rt.revoked or rt.expired:
        raise HTTPException(400, "invalid_grant")

    if rt.client_id != client.client_id:
        raise HTTPException(400, "invalid_grant")

    # mise à jour last_used_at
    await oauth_service.update_refresh_token_usage(refresh_token)

    # générer nouveau access token
    access_token = jwt_service.generate_access_token(
        user_id=rt.user_id,
        client_id=client.client_id,
        scopes=rt.scopes,
        expires_in=3600
    )

    # optionnel: rotation du refresh token
    # new_refresh_token = await oauth_service.rotate_refresh_token(rt)

    return {
        "access_token": access_token,
        "token_type": "Bearer",
        "expires_in": 3600,
        "scope": " ".join(rt.scopes)
    }
```

### endpoint userinfo

Retourne les informations utilisateur (OIDC).

```python
@router.get("/userinfo")
async def userinfo(
    authorization: str = Header(...)
):
    """
    OIDC UserInfo Endpoint

    Retourne les claims utilisateur basés sur les scopes
    """

    # extraction et validation du JWT
    token = authorization.replace("Bearer ", "")
    payload = jwt_service.verify_access_token(token)

    if not payload:
        raise HTTPException(401, "invalid_token")

    user = await user_service.get_user(payload["sub"])

    # claims de base (toujours retournés)
    claims = {
        "sub": str(user.id)
    }

    # claims profile (si scope profile)
    if "profile" in payload.get("scopes", []):
        claims.update({
            "name": user.name,
            "given_name": user.given_name,
            "family_name": user.family_name,
            "picture": user.avatar_url,
            "locale": user.locale
        })

    # claims email (si scope email)
    if "email" in payload.get("scopes", []):
        claims.update({
            "email": user.email,
            "email_verified": user.email_verified
        })

    # claims custom superfasttt
    if "superfasttt.tenant" in payload.get("scopes", []):
        tenant = await tenant_service.get_tenant(user.tenant_id)
        claims.update({
            "tenant_id": str(tenant.id),
            "tenant_name": tenant.name,
            "role": user.role
        })

    return claims
```

### endpoint discovery

Configuration OIDC auto-découverte.

```python
@router.get("/.well-known/openid-configuration")
async def openid_configuration(request: Request):
    """
    OIDC Discovery Document

    Permet aux clients de découvrir automatiquement
    les endpoints et capabilities du serveur
    """

    base_url = str(request.base_url).rstrip("/")

    return {
        "issuer": base_url,
        "authorization_endpoint": f"{base_url}/auth/authorize",
        "token_endpoint": f"{base_url}/auth/token",
        "userinfo_endpoint": f"{base_url}/auth/userinfo",
        "jwks_uri": f"{base_url}/auth/jwks",
        "revocation_endpoint": f"{base_url}/auth/revoke",

        "scopes_supported": [
            "openid",
            "profile",
            "email",
            "offline_access",
            "documents.read",
            "documents.write",
            "conversations.create",
            "conversations.read",
            "agents.read",
            "agents.write",
            "superfasttt.tenant",
            "superfasttt.admin"
        ],

        "response_types_supported": ["code"],
        "grant_types_supported": [
            "authorization_code",
            "refresh_token"
        ],

        "subject_types_supported": ["public"],

        "id_token_signing_alg_values_supported": ["RS256"],
        "userinfo_signing_alg_values_supported": ["none"],

        "token_endpoint_auth_methods_supported": [
            "client_secret_post",
            "client_secret_basic"
        ],

        "code_challenge_methods_supported": ["S256", "plain"],

        "claims_supported": [
            "sub",
            "name",
            "given_name",
            "family_name",
            "email",
            "email_verified",
            "picture",
            "locale",
            "tenant_id",
            "tenant_name",
            "role"
        ]
    }
```

### endpoint jwks

Clés publiques pour vérification des JWT.

```python
@router.get("/jwks")
async def jwks():
    """
    JSON Web Key Set

    Expose les clés publiques utilisées pour signer les JWT
    Les apps peuvent vérifier les signatures localement
    """

    public_keys = jwt_service.get_public_keys()

    return {
        "keys": [
            {
                "kty": "RSA",
                "use": "sig",
                "kid": key.kid,
                "n": key.n,
                "e": key.e,
                "alg": "RS256"
            }
            for key in public_keys
        ]
    }
```

### endpoint revoke

Révocation de tokens.

```python
@router.post("/revoke")
async def revoke(
    token: str = Form(...),
    token_type_hint: str = Form(None),
    client_id: str = Form(...),
    client_secret: str = Form(...)
):
    """
    Token Revocation Endpoint (RFC 7009)

    Permet de révoquer un refresh token ou access token
    """

    # authentification du client
    client = await oauth_service.authenticate_client(
        client_id=client_id,
        client_secret=client_secret
    )

    if not client:
        raise HTTPException(401, "invalid_client")

    # tentative de révocation
    if token_type_hint == "refresh_token":
        await oauth_service.revoke_refresh_token(token)
    else:
        # essayer refresh token puis access token
        revoked = await oauth_service.revoke_refresh_token(token)
        if not revoked:
            await oauth_service.blacklist_access_token(token)

    # toujours retourner 200 (même si token invalide)
    return {"status": "ok"}
```

## services oauth

### oauth_service.py

Logique métier pour OAuth2.

```python
# core/services/oauth_service.py

import secrets
import hashlib
from datetime import datetime, timedelta

class OAuthService:

    async def get_client(self, client_id: str):
        """Récupère un client OAuth2"""
        return await db.execute(
            "SELECT * FROM oauth_clients WHERE client_id = $1",
            client_id
        )

    async def authenticate_client(
        self,
        client_id: str,
        client_secret: str
    ):
        """Authentifie un client avec son secret"""
        client = await self.get_client(client_id)

        if not client:
            return None

        if not verify_password(client_secret, client.client_secret_hash):
            return None

        return client

    async def create_authorization_code(
        self,
        client_id: str,
        user_id: str,
        redirect_uri: str,
        scopes: list[str],
        code_challenge: str = None,
        code_challenge_method: str = None
    ):
        """Génère un authorization code"""

        code = secrets.token_urlsafe(32)
        expires_at = datetime.utcnow() + timedelta(minutes=10)

        return await db.execute(
            """
            INSERT INTO authorization_codes
            (code, client_id, user_id, redirect_uri, scopes,
             code_challenge, code_challenge_method, expires_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
            """,
            code, client_id, user_id, redirect_uri, scopes,
            code_challenge, code_challenge_method, expires_at
        )

    async def get_authorization_code(self, code: str):
        """Récupère un authorization code"""
        return await db.execute(
            "SELECT * FROM authorization_codes WHERE code = $1",
            code
        )

    async def mark_code_as_used(self, code: str):
        """Marque un code comme utilisé"""
        await db.execute(
            "UPDATE authorization_codes SET used = true WHERE code = $1",
            code
        )

    async def create_refresh_token(
        self,
        client_id: str,
        user_id: str,
        scopes: list[str],
        expires_in: int
    ):
        """Génère un refresh token"""

        token = secrets.token_urlsafe(32)
        expires_at = datetime.utcnow() + timedelta(seconds=expires_in)

        return await db.execute(
            """
            INSERT INTO refresh_tokens
            (token, client_id, user_id, scopes, expires_at)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
            """,
            token, client_id, user_id, scopes, expires_at
        )

    async def get_refresh_token(self, token: str):
        """Récupère un refresh token"""
        return await db.execute(
            """
            SELECT * FROM refresh_tokens
            WHERE token = $1
            AND revoked = false
            AND expires_at > NOW()
            """,
            token
        )

    async def revoke_refresh_token(self, token: str):
        """Révoque un refresh token"""
        result = await db.execute(
            "UPDATE refresh_tokens SET revoked = true WHERE token = $1",
            token
        )
        return result.rowcount > 0

    async def get_user_consent(self, user_id: str, client_id: str):
        """Récupère le consentement utilisateur"""
        return await db.execute(
            """
            SELECT * FROM user_consents
            WHERE user_id = $1 AND client_id = $2
            AND (expires_at IS NULL OR expires_at > NOW())
            """,
            user_id, client_id
        )

    async def save_user_consent(
        self,
        user_id: str,
        client_id: str,
        scopes: list[str]
    ):
        """Enregistre le consentement utilisateur"""
        await db.execute(
            """
            INSERT INTO user_consents (user_id, client_id, scopes)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, client_id)
            DO UPDATE SET scopes = $3, granted_at = NOW()
            """,
            user_id, client_id, scopes
        )


def verify_pkce(
    code_verifier: str,
    code_challenge: str,
    method: str
) -> bool:
    """Vérifie le PKCE challenge"""

    if method == "plain":
        return code_verifier == code_challenge

    elif method == "S256":
        computed = hashlib.sha256(
            code_verifier.encode()
        ).digest()
        computed_b64 = base64.urlsafe_b64encode(computed).decode().rstrip("=")
        return computed_b64 == code_challenge

    return False
```

### jwt_service.py

Génération et validation des JWT **pour OAuth2** (RS256).

> **⚠️ IMPORTANT :** Ce service JWT utilise **RS256** (clés asymétriques) pour les **access tokens OAuth2** destinés aux apps tierces.
>
> **SUPERFASTTT utilise DEUX services JWT distincts :**
>
> - **JWT HS256** (existant) : Authentification interne, sessions admin → [AUTHENTIFICATION.md](./AUTHENTIFICATION.md)
> - **JWT RS256** (ce service, à implémenter) : Access tokens OAuth2 pour apps tierces
>
> **Pourquoi RS256 pour OAuth2 ?**
>
> - ✅ Standard OIDC requis
> - ✅ Apps tierces peuvent vérifier tokens avec clé publique (JWKS endpoint)
> - ✅ Pas besoin de partager secret avec apps tierces
> - ✅ Rotation de clés sans casser apps existantes

**Fichier :** `apps/api/app/core/auth/jwt_rs256.py` (à créer)

```python
# core/services/jwt_service.py

import jwt
from datetime import datetime, timedelta

class JWTService:
    """Service JWT RS256 pour OAuth2 access tokens"""

    def __init__(self, private_key: str, public_key: str):
        self.private_key = private_key  # Clé RSA privée (signature)
        self.public_key = public_key    # Clé RSA publique (vérification)
        self.algorithm = "RS256"
        self.issuer = "https://superfasttt.example.com"

    def generate_access_token(
        self,
        user_id: str,
        client_id: str,
        scopes: list[str],
        expires_in: int = 3600
    ) -> str:
        """Génère un access token JWT"""

        now = datetime.utcnow()

        payload = {
            "iss": self.issuer,
            "sub": str(user_id),
            "aud": client_id,
            "iat": int(now.timestamp()),
            "exp": int((now + timedelta(seconds=expires_in)).timestamp()),
            "scopes": scopes
        }

        return jwt.encode(
            payload,
            self.private_key,
            algorithm=self.algorithm,
            headers={"kid": "superfasttt-2024"}
        )

    def generate_id_token(
        self,
        user,
        client_id: str,
        scopes: list[str]
    ) -> str:
        """Génère un ID token OIDC"""

        now = datetime.utcnow()

        payload = {
            "iss": self.issuer,
            "sub": str(user.id),
            "aud": client_id,
            "iat": int(now.timestamp()),
            "exp": int((now + timedelta(hours=1)).timestamp()),

            # claims standard
            "email": user.email if "email" in scopes else None,
            "email_verified": user.email_verified if "email" in scopes else None,
            "name": user.name if "profile" in scopes else None,
            "picture": user.avatar_url if "profile" in scopes else None,

            # claims custom
            "tenant_id": str(user.tenant_id),
            "role": user.role
        }

        # nettoyer les None
        payload = {k: v for k, v in payload.items() if v is not None}

        return jwt.encode(
            payload,
            self.private_key,
            algorithm=self.algorithm
        )

    def verify_access_token(self, token: str) -> dict:
        """Vérifie et décode un access token"""

        try:
            payload = jwt.decode(
                token,
                self.public_key,
                algorithms=[self.algorithm],
                issuer=self.issuer
            )
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None

    def get_public_keys(self):
        """Retourne les clés publiques pour JWKS"""
        # extraction des composants RSA de la clé publique
        # pour exposition via /auth/jwks
        pass
```

## implémentation apps externes

### configuration next-auth

Intégration standard avec Next.js.

```typescript
// app-externe/lib/auth.ts

import { AuthOptions } from 'next-auth'
import { JWT } from 'next-auth/jwt'

const SUPERFASTTT_URL = process.env.SUPERFASTTT_URL
const CLIENT_ID = process.env.SUPERFASTTT_CLIENT_ID
const CLIENT_SECRET = process.env.SUPERFASTTT_CLIENT_SECRET

export const authOptions: AuthOptions = {
  providers: [
    {
      id: 'superfasttt',
      name: 'SUPERFASTTT',
      type: 'oauth',

      // discovery automatique via well-known
      wellKnown: `${SUPERFASTTT_URL}/.well-known/openid-configuration`,

      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,

      authorization: {
        params: {
          scope: 'openid profile email documents.read conversations.create',
          response_type: 'code',
        },
      },

      // mapping des claims OIDC vers profil next-auth
      profile(profile) {
        return {
          id: profile.sub,
          email: profile.email,
          name: profile.name,
          image: profile.picture,
          tenantId: profile.tenant_id,
          role: profile.role,
        }
      },
    },
  ],

  callbacks: {
    // stockage des tokens dans la session JWT
    async jwt({ token, account, profile }) {
      // première connexion
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.expiresAt = account.expires_at
        token.idToken = account.id_token
      }

      // vérifier si access token expiré
      if (Date.now() < (token.expiresAt as number) * 1000) {
        return token
      }

      // refresh le token
      return await refreshAccessToken(token)
    },

    // exposition des tokens dans la session client
    async session({ session, token }) {
      session.user.id = token.sub
      session.user.tenantId = token.tenantId
      session.user.role = token.role
      session.accessToken = token.accessToken
      session.error = token.error

      return session
    },
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await fetch(`${SUPERFASTTT_URL}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken as string,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to refresh token')
    }

    const refreshed = await response.json()

    return {
      ...token,
      accessToken: refreshed.access_token,
      expiresAt: Date.now() / 1000 + refreshed.expires_in,
      refreshToken: refreshed.refresh_token ?? token.refreshToken,
    }
  } catch (error) {
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    }
  }
}
```

### appels api sécurisés

Helper pour appeler les APIs SUPERFASTTT.

```typescript
// app-externe/lib/superfasttt-api.ts

import { getServerSession } from 'next-auth'
import { authOptions } from './auth'

export class SuperfastttAPIError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
  }
}

export async function callSuperfastttAPI(endpoint: string, options: RequestInit = {}) {
  const session = await getServerSession(authOptions)

  if (!session?.accessToken) {
    throw new SuperfastttAPIError(401, 'Not authenticated')
  }

  if (session.error === 'RefreshAccessTokenError') {
    throw new SuperfastttAPIError(401, 'Token refresh failed')
  }

  const response = await fetch(`${process.env.SUPERFASTTT_URL}/api/v1/${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new SuperfastttAPIError(response.status, await response.text())
  }

  return response.json()
}

// exemples d'utilisation

export async function getDocuments() {
  return callSuperfastttAPI('documents')
}

export async function sendMessage(conversationId: string, message: string) {
  return callSuperfastttAPI('conversations/chat', {
    method: 'POST',
    body: JSON.stringify({
      conversation_id: conversationId,
      message,
    }),
  })
}
```

### protection des routes

Middleware pour protéger les pages.

```typescript
// app-externe/middleware.ts

import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/auth/signin',
  },
})

export const config = {
  matcher: [
    // protéger toutes les routes sauf auth et public
    '/((?!auth|_next/static|_next/image|favicon.ico).*)',
  ],
}
```

### interface utilisateur

Page de connexion personnalisée.

```typescript
// app-externe/app/auth/signin/page.tsx

import { signIn } from "next-auth/react"

export default function SignIn() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Notebook IA</h1>
          <p className="mt-2 text-gray-600">
            Connectez-vous avec votre compte SUPERFASTTT
          </p>
        </div>

        <button
          onClick={() => signIn("superfasttt", {
            callbackUrl: "/"
          })}
          className="w-full rounded-lg bg-blue-600 px-4 py-3
                     text-white hover:bg-blue-700"
        >
          Se connecter avec SUPERFASTTT
        </button>
      </div>
    </div>
  )
}
```

## interface admin superfasttt

### gestion des applications externes

Écran d'administration pour enregistrer les apps.

```python
# admin/routes/oauth_clients.py

@router.get("/api/v1/admin/oauth-clients")
async def list_oauth_clients(
    current_user: User = Depends(require_admin)
):
    """Liste toutes les applications OAuth2 enregistrées"""
    return await oauth_service.list_clients()


@router.post("/api/v1/admin/oauth-clients")
async def create_oauth_client(
    client: OAuthClientCreate,
    current_user: User = Depends(require_admin)
):
    """Enregistre une nouvelle application externe"""

    # générer client_id et client_secret
    client_id = f"{slugify(client.name)}-{secrets.token_hex(4)}"
    client_secret = secrets.token_urlsafe(32)
    client_secret_hash = hash_password(client_secret)

    created = await oauth_service.create_client(
        client_id=client_id,
        client_secret_hash=client_secret_hash,
        name=client.name,
        description=client.description,
        logo_url=client.logo_url,
        redirect_uris=client.redirect_uris,
        allowed_scopes=client.allowed_scopes,
        is_trusted=client.is_trusted
    )

    # retourner le secret une seule fois
    return {
        **created,
        "client_secret": client_secret,
        "warning": "Conservez ce secret, il ne sera plus affiché"
    }


@router.put("/api/v1/admin/oauth-clients/{client_id}")
async def update_oauth_client(
    client_id: str,
    updates: OAuthClientUpdate,
    current_user: User = Depends(require_admin)
):
    """Met à jour une application OAuth2"""
    return await oauth_service.update_client(client_id, updates)


@router.delete("/api/v1/admin/oauth-clients/{client_id}")
async def delete_oauth_client(
    client_id: str,
    current_user: User = Depends(require_admin)
):
    """Supprime une application OAuth2"""

    # révoque tous les tokens actifs
    await oauth_service.revoke_all_client_tokens(client_id)

    # supprime le client
    await oauth_service.delete_client(client_id)

    return {"status": "deleted"}
```

### interface web admin

Composant React pour gérer les apps.

```typescript
// admin/components/oauth-clients.tsx

export function OAuthClientsManager() {
  const [clients, setClients] = useState([])
  const [showCreate, setShowCreate] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Applications externes</h2>
        <button onClick={() => setShowCreate(true)}>
          Ajouter une application
        </button>
      </div>

      <div className="grid gap-4">
        {clients.map(client => (
          <div key={client.id} className="border rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                {client.logo_url && (
                  <img
                    src={client.logo_url}
                    className="w-12 h-12 rounded"
                  />
                )}
                <div>
                  <h3 className="font-semibold">{client.name}</h3>
                  <p className="text-sm text-gray-600">
                    {client.description}
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    <div>Client ID: <code>{client.client_id}</code></div>
                    <div>Scopes: {client.allowed_scopes.join(", ")}</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => editClient(client)}>
                  Modifier
                </button>
                <button onClick={() => viewTokens(client)}>
                  Tokens actifs
                </button>
                <button
                  onClick={() => deleteClient(client)}
                  className="text-red-600"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showCreate && (
        <CreateOAuthClientModal
          onClose={() => setShowCreate(false)}
          onCreated={(client) => {
            setClients([...clients, client])
            setShowCreate(false)
          }}
        />
      )}
    </div>
  )
}
```

### monitoring des tokens

Interface pour voir les tokens actifs.

```python
# admin/routes/oauth_tokens.py

@router.get("/api/v1/admin/oauth-tokens")
async def list_active_tokens(
    client_id: str = None,
    user_id: str = None,
    current_user: User = Depends(require_admin)
):
    """Liste les refresh tokens actifs"""

    query = """
        SELECT
            rt.*,
            oc.name as client_name,
            u.email as user_email
        FROM refresh_tokens rt
        JOIN oauth_clients oc ON rt.client_id = oc.client_id
        JOIN users u ON rt.user_id = u.id
        WHERE rt.revoked = false
        AND rt.expires_at > NOW()
    """

    if client_id:
        query += f" AND rt.client_id = '{client_id}'"

    if user_id:
        query += f" AND rt.user_id = '{user_id}'"

    query += " ORDER BY rt.created_at DESC"

    return await db.execute(query)


@router.post("/api/v1/admin/oauth-tokens/revoke")
async def revoke_token(
    token_id: str,
    current_user: User = Depends(require_admin)
):
    """Révoque un refresh token spécifique"""

    await oauth_service.revoke_refresh_token_by_id(token_id)

    # émettre événement pour audit
    await events.emit("oauth.token.revoked", {
        "token_id": token_id,
        "revoked_by": current_user.id,
        "revoked_at": datetime.utcnow()
    })

    return {"status": "revoked"}
```

## sécurité

### protection csrf

Les paramètres state et nonce protègent contre CSRF.

```python
# validation du state
if request_state != session_state:
    raise HTTPException(400, "state_mismatch")

# validation du nonce dans id_token
if id_token_nonce != authorization_nonce:
    raise HTTPException(400, "nonce_mismatch")
```

### pkce pour apps publiques

Apps mobiles ou SPA sans client secret.

```typescript
// génération du code_verifier et code_challenge

import crypto from 'crypto'

function generateCodeVerifier(): string {
  return crypto.randomBytes(32).toString('base64url')
}

function generateCodeChallenge(verifier: string): string {
  return crypto.createHash('sha256').update(verifier).digest('base64url')
}

// lors de l'authorization request
const verifier = generateCodeVerifier()
const challenge = generateCodeChallenge(verifier)

// stocker verifier localement
sessionStorage.setItem('code_verifier', verifier)

// envoyer challenge dans l'URL
window.location.href =
  `${SUPERFASTTT_URL}/auth/authorize?` +
  `client_id=${CLIENT_ID}&` +
  `redirect_uri=${REDIRECT_URI}&` +
  `code_challenge=${challenge}&` +
  `code_challenge_method=S256`

// lors du token exchange
const storedVerifier = sessionStorage.getItem('code_verifier')

fetch(`${SUPERFASTTT_URL}/auth/token`, {
  method: 'POST',
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    code_verifier: storedVerifier,
  }),
})
```

### rate limiting

Protection contre les attaques par force brute.

```python
# middleware rate limit sur /auth/token

from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@router.post("/token")
@limiter.limit("10/minute")
async def token(request: Request, ...):
    # endpoint protégé
    pass
```

### rotation des secrets

Procédure pour renouveler client_secret.

```python
@router.post("/api/v1/admin/oauth-clients/{client_id}/rotate-secret")
async def rotate_client_secret(
    client_id: str,
    current_user: User = Depends(require_admin)
):
    """Génère un nouveau client_secret"""

    new_secret = secrets.token_urlsafe(32)
    new_hash = hash_password(new_secret)

    await oauth_service.update_client_secret(client_id, new_hash)

    await events.emit("oauth.client.secret_rotated", {
        "client_id": client_id,
        "rotated_by": current_user.id
    })

    return {
        "client_secret": new_secret,
        "warning": "Mettez à jour vos applications immédiatement"
    }
```

### audit trail

Logs complets des événements OAuth2.

```python
# événements tracés

await events.emit("oauth.authorization.requested", {
    "client_id": client_id,
    "user_id": user_id,
    "scopes": scopes,
    "ip": request.client.host
})

await events.emit("oauth.authorization.granted", {
    "code": code,
    "client_id": client_id,
    "user_id": user_id
})

await events.emit("oauth.token.issued", {
    "client_id": client_id,
    "user_id": user_id,
    "scopes": scopes,
    "expires_at": expires_at
})

await events.emit("oauth.token.refreshed", {
    "refresh_token_id": rt.id,
    "user_id": user_id
})

await events.emit("oauth.token.revoked", {
    "token_id": token_id,
    "reason": "user_logout"
})
```

## scopes et permissions

### scopes standard oidc

- openid : identité utilisateur de base
- profile : nom, prénom, photo
- email : adresse email
- offline_access : obtenir un refresh token

### scopes superfasttt

- documents.read : lire les documents
- documents.write : créer/modifier des documents
- documents.delete : supprimer des documents
- conversations.create : créer des conversations
- conversations.read : lire les conversations
- conversations.delete : supprimer des conversations
- agents.read : lire les agents
- agents.write : créer/modifier des agents
- rag.query : interroger le rag
- analytics.read : voir les analytics
- superfasttt.tenant : informations tenant
- superfasttt.admin : accès admin (dangereux)

### mapping avec rbac superfasttt

Les scopes OAuth2 doivent respecter les permissions RBAC.

```python
async def validate_scopes_for_user(
    user: User,
    requested_scopes: list[str]
) -> list[str]:
    """
    Filtre les scopes demandés selon les permissions RBAC
    """

    # récupérer les permissions du user
    permissions = await rbac_service.get_user_permissions(user.id)

    granted_scopes = []

    for scope in requested_scopes:
        # scopes OIDC toujours accordés
        if scope in ["openid", "profile", "email", "offline_access"]:
            granted_scopes.append(scope)
            continue

        # mapper scope → permission RBAC
        required_permission = map_scope_to_permission(scope)

        if required_permission in permissions:
            granted_scopes.append(scope)

    return granted_scopes


def map_scope_to_permission(scope: str) -> str:
    """Map OAuth2 scope vers permission RBAC"""

    mapping = {
        "documents.read": "documents:read",
        "documents.write": "documents:write",
        "documents.delete": "documents:delete",
        "conversations.create": "conversations:create",
        "conversations.read": "conversations:read",
        # etc.
    }

    return mapping.get(scope)
```

## migration et compatibilité

### migration depuis auth.js existant

SUPERFASTTT utilise déjà Auth.js pour le frontend Next.js.

```typescript
// avant (auth.js local)
providers: [
  CredentialsProvider({
    async authorize(credentials) {
      // validation locale
    },
  }),
]

// après (auth.js + oauth2 superfasttt)
providers: [
  {
    id: 'superfasttt',
    type: 'oauth',
    wellKnown: 'https://superfasttt.example.com/.well-known/openid-configuration',
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
  },
]
```

Le frontend SUPERFASTTT peut aussi devenir un client OAuth2 de son propre backend.

### cohabitation sessions locales et oauth2

Durant la transition, supporter les deux modes.

```python
@router.get("/auth/authorize")
async def authorize(request: Request, ...):
    # vérifier session Auth.js existante
    auth_js_session = request.cookies.get("next-auth.session-token")

    if auth_js_session:
        # récupérer user depuis session Auth.js
        user = await auth_js_service.get_user_from_session(auth_js_session)
    else:
        # fallback sur cookie de session classique
        user = await get_current_user(request)

    # continuer le flow OAuth2 normalement
    ...
```

### apps sans next-auth

Pour des apps Python, mobile, ou autres frameworks.

```python
# exemple fastapi app externe

from authlib.integrations.httpx_client import OAuth2Client

client = OAuth2Client(
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET
)

# fetch configuration
metadata = await client.fetch_server_metadata(
    "https://superfasttt.example.com/.well-known/openid-configuration"
)

# authorization
authorization_url = client.create_authorization_url(
    metadata["authorization_endpoint"],
    redirect_uri="https://myapp.com/callback",
    scope="openid profile documents.read"
)

# token exchange
token = await client.fetch_token(
    metadata["token_endpoint"],
    authorization_response=request.url,
    redirect_uri="https://myapp.com/callback"
)

# appels api avec token
headers = {"Authorization": f"Bearer {token['access_token']}"}
```

## opérations et monitoring

### métriques à surveiller

```python
# prometheus metrics

oauth_authorization_requests = Counter(
    "oauth_authorization_requests_total",
    "Total authorization requests",
    ["client_id", "status"]
)

oauth_token_issued = Counter(
    "oauth_tokens_issued_total",
    "Total tokens issued",
    ["client_id", "grant_type"]
)

oauth_token_refresh = Counter(
    "oauth_tokens_refreshed_total",
    "Total token refreshes",
    ["client_id"]
)

oauth_token_revoked = Counter(
    "oauth_tokens_revoked_total",
    "Total token revocations",
    ["client_id", "reason"]
)

oauth_errors = Counter(
    "oauth_errors_total",
    "Total OAuth errors",
    ["error_type"]
)
```

### dashboard monitoring

Grafana dashboard pour visualiser :

- nombre de clients OAuth2 actifs
- tokens émis par jour
- taux de refresh
- taux d'erreur par type
- latence des endpoints OAuth2
- tokens actifs par client
- distribution des scopes demandés

### alertes

```yaml
# alertes prometheus

groups:
  - name: oauth
    rules:
      - alert: OAuthHighErrorRate
        expr: rate(oauth_errors_total[5m]) > 10
        annotations:
          summary: Taux d'erreur OAuth2 élevé

      - alert: OAuthTokenLeakage
        expr: oauth_authorization_requests_total{status="invalid_redirect_uri"} > 100
        annotations:
          summary: Tentatives de vol de tokens détectées

      - alert: OAuthRefreshTokenExpiring
        expr: oauth_refresh_token_expiry_seconds < 86400
        annotations:
          summary: Refresh tokens expirant dans moins de 24h
```

### nettoyage automatique

Tâche cron pour supprimer les anciennes données.

```python
# tasks/cleanup_oauth.py

async def cleanup_expired_codes():
    """Supprime les authorization codes expirés"""
    await db.execute(
        """
        DELETE FROM authorization_codes
        WHERE expires_at < NOW() - INTERVAL '1 day'
        OR (used = true AND created_at < NOW() - INTERVAL '1 day')
        """
    )

async def cleanup_revoked_tokens():
    """Supprime les refresh tokens révoqués anciens"""
    await db.execute(
        """
        DELETE FROM refresh_tokens
        WHERE revoked = true
        AND created_at < NOW() - INTERVAL '90 days'
        """
    )

async def cleanup_expired_consents():
    """Supprime les consentements expirés"""
    await db.execute(
        """
        DELETE FROM user_consents
        WHERE expires_at IS NOT NULL
        AND expires_at < NOW()
        """
    )

# cronjob quotidien
schedule.every().day.at("03:00").do(cleanup_expired_codes)
schedule.every().day.at("03:15").do(cleanup_revoked_tokens)
schedule.every().day.at("03:30").do(cleanup_expired_consents)
```

## roadmap d'implémentation

### phase 1 : mvp oauth2 basique (2 semaines)

objectif : permettre à une app externe de s'authentifier

tâches :

- créer tables oauth_clients, authorization_codes, refresh_tokens
- implémenter /auth/authorize endpoint
- implémenter /auth/token endpoint (authorization_code grant)
- créer interface admin pour enregistrer clients
- tester avec une app externe simple (ex: notebook)

critères de succès :

- user peut se connecter sur app externe via superfasttt
- access token fonctionne pour appeler apis superfasttt
- refresh token permet de renouveler access token

### phase 2 : oidc complet (1 semaine)

objectif : conformité standard openid connect

tâches :

- implémenter /auth/userinfo endpoint
- générer id_token dans token endpoint
- créer /.well-known/openid-configuration
- implémenter /auth/jwks
- tester avec bibliothèques oauth2 standard

critères de succès :

- discovery automatique fonctionne
- id_token contient les bons claims
- apps peuvent vérifier JWT localement

### phase 3 : sécurité et ux (1 semaine)

objectif : expérience utilisateur fluide et sécurisée

tâches :

- implémenter consent screen
- ajouter support pkce
- implémenter /auth/revoke
- ajouter rate limiting
- créer page de gestion des consentements utilisateur

critères de succès :

- user voit écran de consentement première fois
- apps publiques peuvent utiliser pkce
- user peut révoquer accès via interface
- protection contre force brute

### phase 4 : monitoring et opérations (3 jours)

objectif : observabilité complète

tâches :

- ajouter métriques prometheus
- créer dashboard grafana
- implémenter audit trail complet
- configurer alertes
- créer tâches de nettoyage

critères de succès :

- visibilité complète des événements oauth2
- alertes fonctionnelles
- audit trail exploitable
- cleanup automatique

### phase 5 : fonctionnalités avancées (optionnel)

objectif : features entreprise

tâches :

- device flow pour cli/iot
- token exchange (rfc 8693)
- dynamic client registration
- backchannel logout
- fédération avec idps externes

critères de succès :

- cli peut s'authentifier sans navigateur
- apps peuvent échanger tokens
- clients peuvent s'enregistrer automatiquement

## tests et validation

### tests unitaires

```python
# tests/test_oauth_service.py

async def test_create_authorization_code():
    code = await oauth_service.create_authorization_code(
        client_id="test-app",
        user_id="user-123",
        redirect_uri="https://app.com/callback",
        scopes=["openid", "profile"]
    )

    assert code.code is not None
    assert len(code.code) == 43
    assert code.expires_at > datetime.utcnow()


async def test_authorization_code_single_use():
    code = await oauth_service.create_authorization_code(...)

    # premier échange réussit
    tokens1 = await oauth_service.exchange_code(code.code)
    assert tokens1 is not None

    # deuxième échange échoue
    tokens2 = await oauth_service.exchange_code(code.code)
    assert tokens2 is None


async def test_refresh_token():
    rt = await oauth_service.create_refresh_token(...)

    # refresh réussit
    new_token = await oauth_service.refresh_access_token(rt.token)
    assert new_token is not None

    # révocation
    await oauth_service.revoke_refresh_token(rt.token)

    # refresh échoue après révocation
    revoked = await oauth_service.refresh_access_token(rt.token)
    assert revoked is None
```

### tests d'intégration

```python
# tests/test_oauth_flow.py

async def test_full_authorization_flow():
    # 1. app démarre authorization
    auth_url = f"/auth/authorize?client_id=test&redirect_uri=..."
    response = await client.get(auth_url)

    # pas de session → redirect login
    assert response.status_code == 302
    assert "/auth/login" in response.headers["location"]

    # 2. user se connecte
    login_response = await client.post("/auth/login", {
        "email": "test@example.com",
        "password": "password"
    })

    # 3. retry authorization
    response = await client.get(auth_url, cookies=login_response.cookies)

    # redirect vers app avec code
    assert response.status_code == 302
    location = response.headers["location"]
    assert "code=" in location

    # 4. app échange code contre tokens
    code = extract_code_from_url(location)
    token_response = await client.post("/auth/token", {
        "grant_type": "authorization_code",
        "code": code,
        "client_id": "test",
        "client_secret": "secret"
    })

    assert token_response.status_code == 200
    tokens = token_response.json()
    assert "access_token" in tokens
    assert "refresh_token" in tokens

    # 5. utiliser access token
    api_response = await client.get(
        "/api/v1/documents",
        headers={"Authorization": f"Bearer {tokens['access_token']}"}
    )

    assert api_response.status_code == 200
```

### tests de sécurité

```python
# tests/test_oauth_security.py

async def test_code_reuse_prevention():
    """Vérifie qu'un code ne peut pas être réutilisé"""
    code = await create_test_code()

    # premier échange
    await exchange_code(code)

    # deuxième tentative
    with pytest.raises(InvalidGrantError):
        await exchange_code(code)


async def test_pkce_validation():
    """Vérifie la validation PKCE"""
    verifier = generate_code_verifier()
    challenge = generate_code_challenge(verifier)

    code = await create_code_with_challenge(challenge, "S256")

    # échange avec bon verifier
    tokens = await exchange_code(code, code_verifier=verifier)
    assert tokens is not None

    # échange avec mauvais verifier
    code2 = await create_code_with_challenge(challenge, "S256")
    with pytest.raises(InvalidGrantError):
        await exchange_code(code2, code_verifier="wrong")


async def test_redirect_uri_validation():
    """Vérifie validation stricte redirect_uri"""

    # redirect_uri whitelistée
    code = await create_authorization_code(
        redirect_uri="https://app.com/callback"
    )
    tokens = await exchange_code(code, redirect_uri="https://app.com/callback")
    assert tokens is not None

    # redirect_uri différente
    with pytest.raises(InvalidGrantError):
        await exchange_code(code, redirect_uri="https://evil.com/steal")
```

## documentation développeur

### guide quick start

```markdown
# quick start oauth2 superfasttt

## 1. enregistrer votre application

Dans l'admin SUPERFASTTT, créer une nouvelle application :

- Nom : My App
- Redirect URIs : https://myapp.com/auth/callback
- Scopes : openid, profile, email, documents.read

Vous recevrez :

- client_id : myapp-abc123
- client_secret : secret_xyz (à conserver précieusement)

## 2. configurer votre application

npm install next-auth

Créer auth.config.ts selon la documentation.

## 3. rediriger vers superfasttt

https://superfasttt.example.com/auth/authorize?
response_type=code&
client_id=myapp-abc123&
redirect_uri=https://myapp.com/auth/callback&
scope=openid+profile+email+documents.read&
state=random-state

## 4. recevoir le code

L'utilisateur est redirigé vers :
https://myapp.com/auth/callback?code=abc123&state=random-state

## 5. échanger contre tokens

POST https://superfasttt.example.com/auth/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&
code=abc123&
client_id=myapp-abc123&
client_secret=secret_xyz&
redirect_uri=https://myapp.com/auth/callback

Réponse :
{
"access*token": "eyJ...",
"token_type": "Bearer",
"expires_in": 3600,
"refresh_token": "rt*...",
"id_token": "eyJ..."
}

## 6. utiliser l'access token

GET https://superfasttt.example.com/api/v1/documents
Authorization: Bearer eyJ...
```

### exemples de code

Repository GitHub avec exemples :

- next.js + next-auth
- react spa + pkce
- python fastapi
- mobile react native
- cli tool

## conclusion

Cette architecture OAuth2/OIDC permet à SUPERFASTTT de :

### avantages business

- supporter des apps externes sur n'importe quel domaine
- créer un écosystème d'applications tierces
- offrir "Sign in with SUPERFASTTT"
- faciliter l'adoption par les développeurs
- support SSO entreprise (Google Workspace, Microsoft 365)

### avantages techniques

- standard industriel éprouvé
- sécurité robuste avec révocation granulaire
- scalabilité excellente
- interopérabilité maximale
- compatibilité avec bibliothèques OAuth2 standard

### avantages utilisateur

- connexion unique transparente
- contrôle des permissions par app
- expérience fluide entre applications
- possibilité de se connecter avec compte professionnel (Google/Microsoft)

---

## prochaines étapes

Ce document décrit l'architecture cible. Pour l'implémentation :

1. **📖 Lire d'abord :** [AUTHENTICATION_ARCHITECTURE.md](./AUTHENTICATION_ARCHITECTURE.md) - Vue d'ensemble de tous les systèmes d'auth
2. **🗓️ Suivre la roadmap :** [SSO_IMPLEMENTATION_ROADMAP.md](./SSO_IMPLEMENTATION_ROADMAP.md) - Planning détaillé d'implémentation (12 semaines)
3. **📚 Consulter le glossaire :** [AUTH_TERMINOLOGY.md](./AUTH_TERMINOLOGY.md) - Termes OAuth2/OIDC/SSO
4. **🔐 Vérifier l'existant :** [AUTHENTIFICATION.md](./AUTHENTIFICATION.md) - JWT HS256 et sessions déjà implémentés

**Phases d'implémentation :**

- **Phase 1** (4 sem) : OAuth2 Core - Tables, endpoints, admin API
- **Phase 2** (2 sem) : RS256 + JWKS - Clés asymétriques, OIDC discovery
- **Phase 3** (3 sem) : External SSO - Google/Microsoft login
- **Phase 4** (2 sem) : Admin UI + UX - Interface de gestion
- **Phase 5** (1 sem) : Monitoring + Production ready

**Total : 12 semaines (3 mois)**

---

**Dernière mise à jour :** 2025-12-19
**Auteurs :** Équipe SUPERFASTTT Core
**Statut :** ✅ OAuth2 Core implémenté | ⏳ RS256 + External SSO en cours
