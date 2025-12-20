# Roadmap d'implémentation SSO/OAuth2

> Planning détaillé pour implémenter le système OAuth2/OIDC Provider et External SSO dans SUPERFASTTT

---

## 📋 Vue d'ensemble

### Objectif global

Transformer SUPERFASTTT en **Identity Provider OAuth2/OIDC** avec support des SSO providers externes (Google/Microsoft).

### État actuel (Décembre 2025 - Mise à jour)

**✅ IMPLÉMENTÉ :**

- ✅ JWT HS256 pour authentification interne
- ✅ API Keys pour accès machine-to-machine
- ✅ Multi-tenant avec isolation schemas PostgreSQL
- ✅ RBAC permissions granulaires
- ✅ Audit logs complets
- ✅ **OAuth2 Authorization Code Flow** avec PKCE
- ✅ **Tables oauth2_clients et oauth2_authorization_codes**
- ✅ **Endpoints /auth/authorize, /auth/token, /auth/silent-authorize**
- ✅ **Admin API pour gérer les clients OAuth2**
- ✅ **SSO entre apps (knowledge-hub, admin, sf-project, sf-workflow)**

**⏳ À IMPLÉMENTER :**

- ⏳ JWT RS256 + JWKS (actuellement HS256)
- ⏳ External SSO Providers (Google/Microsoft login)
- ⏳ Consent screen UI
- ⏳ User consent management page

---

## 🗓️ Planning global

| Phase                                  | Durée           | Effort   | Priorité    | Statut                             |
| -------------------------------------- | --------------- | -------- | ----------- | ---------------------------------- |
| **Phase 0** - Infrastructure existante | -               | -        | -           | ✅ **FAIT**                        |
| **Phase 1** - OAuth2 Core (MVP)        | 4 semaines      | 160h     | P0 Critical | ✅ **FAIT**                        |
| **Phase 2** - RS256 + JWKS             | 2 semaines      | 80h      | P0 Critical | ⏳ **EN COURS** (HS256 fonctionne) |
| **Phase 3** - External SSO Providers   | 3 semaines      | 120h     | P1 High     | 📝 **À FAIRE**                     |
| **Phase 4** - Admin UI + UX            | 2 semaines      | 80h      | P1 High     | ⚠️ **PARTIEL** (API OK, UI manque) |
| **Phase 5** - Monitoring + Production  | 1 semaine       | 40h      | P2 Medium   | 📝 **À FAIRE**                     |
| **TOTAL**                              | **12 semaines** | **480h** |             |                                    |

---

## Phase 0 : Infrastructure existante ✅

**Durée :** N/A - Déjà implémenté

### Composants existants

#### Base de données

- ✅ Table `users` avec multi-tenant support
- ✅ Table `tenants` avec isolation schemas
- ✅ Table `api_keys` avec scopes
- ✅ Table `audit_logs` pour traçabilité

#### Authentification

- ✅ JWT Service (HS256) - `apps/api/app/core/auth/jwt.py`
- ✅ Auth endpoints - `apps/api/app/routes/auth/login.py`
  - `POST /api/auth/login`
  - `POST /api/auth/refresh`
  - `GET /api/auth/me`
- ✅ API Key authentication - `apps/api/app/core/security/auth_service.py`

#### Autorisation

- ✅ RBAC système - `apps/api/app/core/rbac/permissions.py`
- ✅ Roles: SUPER_ADMIN, TENANT_ADMIN, MANAGER, USER, VIEWER
- ✅ Permissions granulaires: `{resource}.{action}.{scope}`

#### Infrastructure

- ✅ Multi-tenant middleware
- ✅ FastAPI dependencies pour auth
- ✅ Rate limiting
- ✅ Audit logging

### ✅ Critères de succès

- [x] Users peuvent se connecter avec email/password
- [x] JWT access/refresh tokens fonctionnels
- [x] API Keys fonctionnelles pour accès programmatique
- [x] RBAC protège les endpoints
- [x] Multi-tenant isolation complète

---

## Phase 1 : OAuth2 Core (MVP)

**Durée :** 4 semaines
**Effort :** 160 heures
**Priorité :** P0 Critical

### Objectif

Implémenter le flow OAuth2 Authorization Code basique permettant à une app externe de s'authentifier.

### 1.1 - Base de données OAuth2 (Semaine 1 - 40h)

#### Tables à créer

**`oauth_clients`** - Applications externes enregistrées

```sql
CREATE TABLE oauth_clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(100) NOT NULL,
    client_id VARCHAR(255) UNIQUE NOT NULL,
    client_secret_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url VARCHAR(500),
    redirect_uris TEXT[] NOT NULL,
    allowed_scopes TEXT[] NOT NULL,
    is_trusted BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID REFERENCES users(id),

    CONSTRAINT valid_redirect_uris CHECK (array_length(redirect_uris, 1) > 0)
);

CREATE INDEX idx_oauth_clients_client_id ON oauth_clients(client_id);
CREATE INDEX idx_oauth_clients_tenant ON oauth_clients(tenant_id);
```

**`authorization_codes`** - Codes temporaires

```sql
CREATE TABLE authorization_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(255) UNIQUE NOT NULL,
    client_id VARCHAR(255) NOT NULL REFERENCES oauth_clients(client_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tenant_id VARCHAR(100) NOT NULL,
    redirect_uri VARCHAR(500) NOT NULL,
    scopes TEXT[] NOT NULL,
    code_challenge VARCHAR(255),
    code_challenge_method VARCHAR(10),
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT false,
    used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_auth_codes_code ON authorization_codes(code);
CREATE INDEX idx_auth_codes_expires ON authorization_codes(expires_at);
CREATE INDEX idx_auth_codes_user ON authorization_codes(user_id);

-- Nettoyage automatique
CREATE INDEX idx_auth_codes_cleanup ON authorization_codes(created_at)
WHERE used = true OR expires_at < NOW();
```

**`refresh_tokens_oauth`** - Tokens longue durée

```sql
CREATE TABLE refresh_tokens_oauth (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token VARCHAR(255) UNIQUE NOT NULL,
    client_id VARCHAR(255) NOT NULL REFERENCES oauth_clients(client_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tenant_id VARCHAR(100) NOT NULL,
    scopes TEXT[] NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN DEFAULT false,
    revoked_at TIMESTAMP,
    last_used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT valid_expiration CHECK (expires_at > created_at)
);

CREATE INDEX idx_refresh_tokens_token ON refresh_tokens_oauth(token);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens_oauth(user_id);
CREATE INDEX idx_refresh_tokens_client ON refresh_tokens_oauth(client_id, user_id);
CREATE INDEX idx_refresh_tokens_active ON refresh_tokens_oauth(expires_at, revoked) WHERE revoked = false;
```

**`user_consents`** - Consentements utilisateur

```sql
CREATE TABLE user_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    client_id VARCHAR(255) NOT NULL REFERENCES oauth_clients(client_id) ON DELETE CASCADE,
    tenant_id VARCHAR(100) NOT NULL,
    scopes TEXT[] NOT NULL,
    granted_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,

    UNIQUE(user_id, client_id)
);

CREATE INDEX idx_user_consents_lookup ON user_consents(user_id, client_id);
CREATE INDEX idx_user_consents_user ON user_consents(user_id);
```

#### Migration Alembic

```python
# apps/api/app/migrations/versions/xxx_oauth2_tables.py

def upgrade():
    # Créer toutes les tables ci-dessus
    pass

def downgrade():
    # Drop tables in reverse order
    op.drop_table('user_consents')
    op.drop_table('refresh_tokens_oauth')
    op.drop_table('authorization_codes')
    op.drop_table('oauth_clients')
```

#### Tâches

- [ ] Créer migration Alembic
- [ ] Créer models SQLAlchemy - `apps/api/app/models/oauth.py`
- [ ] Créer schemas Pydantic - `apps/api/app/schemas/oauth.py`
- [ ] Tests unitaires des models

**Fichiers à créer :**

- `apps/api/app/models/oauth.py`
- `apps/api/app/schemas/oauth.py`
- `apps/api/app/migrations/versions/xxx_oauth2_tables.py`
- `tests/models/test_oauth.py`

---

### 1.2 - OAuth2 Service Layer (Semaine 2 - 40h)

#### Service OAuth2

**Fichier :** `apps/api/app/services/oauth_service.py`

```python
class OAuth2Service:
    """Service pour gérer le flow OAuth2"""

    async def get_client(self, client_id: str) -> OAuthClient | None:
        """Récupère un client OAuth2"""

    async def authenticate_client(
        self,
        client_id: str,
        client_secret: str
    ) -> OAuthClient | None:
        """Authentifie un client avec son secret"""

    async def create_authorization_code(
        self,
        client_id: str,
        user_id: UUID,
        tenant_id: str,
        redirect_uri: str,
        scopes: list[str],
        code_challenge: str | None = None,
        code_challenge_method: str | None = None
    ) -> AuthorizationCode:
        """Génère un authorization code"""

    async def exchange_code_for_tokens(
        self,
        code: str,
        client_id: str,
        redirect_uri: str,
        code_verifier: str | None = None
    ) -> dict:
        """Échange authorization code contre tokens"""

    async def refresh_access_token(
        self,
        refresh_token: str,
        client_id: str
    ) -> dict:
        """Renouvelle access token"""

    async def revoke_token(
        self,
        token: str,
        token_type_hint: str | None = None
    ) -> bool:
        """Révoque un token"""

    async def get_user_consent(
        self,
        user_id: UUID,
        client_id: str
    ) -> UserConsent | None:
        """Récupère consentement utilisateur"""

    async def save_user_consent(
        self,
        user_id: UUID,
        client_id: str,
        scopes: list[str]
    ) -> UserConsent:
        """Enregistre consentement utilisateur"""
```

#### Helpers sécurité

```python
def generate_authorization_code() -> str:
    """Génère code sécurisé (43 chars)"""
    return secrets.token_urlsafe(32)

def verify_pkce(
    code_verifier: str,
    code_challenge: str,
    method: str
) -> bool:
    """Vérifie PKCE challenge"""
    if method == "plain":
        return code_verifier == code_challenge
    elif method == "S256":
        computed = hashlib.sha256(code_verifier.encode()).digest()
        computed_b64 = base64.urlsafe_b64encode(computed).decode().rstrip("=")
        return computed_b64 == code_challenge
    return False
```

#### Tâches

- [ ] Créer `OAuth2Service` class
- [ ] Implémenter PKCE verification
- [ ] Validation redirect_uri stricte
- [ ] Code usage unique enforcement
- [ ] Tests unitaires complets

**Fichiers à créer :**

- `apps/api/app/services/oauth_service.py`
- `apps/api/app/core/security/pkce.py`
- `tests/services/test_oauth_service.py`

---

### 1.3 - OAuth2 Endpoints (Semaine 3 - 40h)

#### `/auth/authorize` - Authorization endpoint

**Fichier :** `apps/api/app/routes/oauth/authorize.py`

```python
@router.get("/auth/authorize")
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

    1. Valide client_id, redirect_uri, scopes
    2. Vérifie session utilisateur (cookie JWT)
    3. Si pas de session → redirect login
    4. Si session → vérifie consent
    5. Si pas de consent → affiche consent screen
    6. Génère authorization code
    7. Redirect vers app avec code
    """
```

#### `/auth/token` - Token endpoint

```python
@router.post("/auth/token")
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

    Supports:
    - authorization_code: échange code contre tokens
    - refresh_token: renouvelle access token
    """
```

#### Tâches

- [ ] Implémenter `/auth/authorize` endpoint
- [ ] Implémenter `/auth/token` endpoint
- [ ] Gestion erreurs OAuth2 standard
- [ ] Validation complète paramètres
- [ ] Tests d'intégration

**Fichiers à créer :**

- `apps/api/app/routes/oauth/authorize.py`
- `apps/api/app/routes/oauth/token.py`
- `apps/api/app/routes/oauth/__init__.py`
- `tests/routes/oauth/test_authorize.py`
- `tests/routes/oauth/test_token.py`

---

### 1.4 - Admin API OAuth2 Clients (Semaine 4 - 40h)

#### Endpoints admin

**Fichier :** `apps/api/app/routes/admin/oauth_clients.py`

```python
@router.get("/api/v1/admin/oauth-clients")
async def list_oauth_clients(
    current_user: User = Depends(require_admin)
):
    """Liste clients OAuth2 du tenant"""

@router.post("/api/v1/admin/oauth-clients")
async def create_oauth_client(
    client: OAuthClientCreate,
    current_user: User = Depends(require_admin)
):
    """Crée nouveau client OAuth2"""
    # Générer client_id et client_secret
    # Retourner secret UNE SEULE FOIS

@router.put("/api/v1/admin/oauth-clients/{client_id}")
async def update_oauth_client(...)

@router.delete("/api/v1/admin/oauth-clients/{client_id}")
async def delete_oauth_client(...)

@router.post("/api/v1/admin/oauth-clients/{client_id}/rotate-secret")
async def rotate_client_secret(...)
```

#### Tâches

- [ ] CRUD complet OAuth2 clients
- [ ] Génération client_id/client_secret sécurisés
- [ ] Validation redirect URIs (format URL, HTTPS prod)
- [ ] Tests API complets

**Fichiers à créer :**

- `apps/api/app/routes/admin/oauth_clients.py`
- `tests/routes/admin/test_oauth_clients.py`

---

### ✅ Critères de succès Phase 1

- [ ] Tables OAuth2 créées et migrées
- [ ] Models et schemas fonctionnels
- [ ] OAuth2Service implémenté et testé
- [ ] Endpoints `/auth/authorize` et `/auth/token` fonctionnels
- [ ] Admin API CRUD clients fonctionnel
- [ ] Tests unitaires passent (>80% coverage)
- [ ] Tests d'intégration E2E passent
- [ ] **Demo :** App externe peut s'authentifier et recevoir access token

---

## Phase 2 : RS256 + JWKS

**Durée :** 2 semaines
**Effort :** 80 heures
**Priorité :** P0 Critical

### Objectif

Implémenter JWT RS256 avec clés asymétriques et exposition JWKS pour vérification par apps tierces.

### 2.1 - JWT RS256 Service (Semaine 1 - 40h)

#### Génération clés RSA

```bash
# Générer paire de clés RSA 2048 bits
openssl genrsa -out private_key.pem 2048
openssl rsa -in private_key.pem -pubout -out public_key.pem
```

#### Service JWT RS256

**Fichier :** `apps/api/app/core/auth/jwt_rs256.py`

```python
class JWTRS256Service:
    """Service JWT avec RS256 pour OAuth2"""

    def __init__(self):
        self.private_key = self._load_private_key()
        self.public_key = self._load_public_key()
        self.algorithm = "RS256"
        self.issuer = settings.OAUTH2_ISSUER
        self.kid = "superfasttt-2025-01"

    def generate_access_token(
        self,
        user_id: UUID,
        tenant_id: str,
        client_id: str,
        scopes: list[str],
        expires_in: int = 3600
    ) -> str:
        """Génère access token RS256"""
        payload = {
            "iss": self.issuer,
            "sub": str(user_id),
            "aud": client_id,
            "tenant_id": tenant_id,
            "scopes": scopes,
            "iat": int(datetime.utcnow().timestamp()),
            "exp": int((datetime.utcnow() + timedelta(seconds=expires_in)).timestamp()),
            "token_type": "access"
        }

        return jwt.encode(
            payload,
            self.private_key,
            algorithm=self.algorithm,
            headers={"kid": self.kid}
        )

    def generate_id_token(
        self,
        user: User,
        client_id: str,
        scopes: list[str],
        nonce: str | None = None
    ) -> str:
        """Génère ID token OIDC"""
        payload = {
            "iss": self.issuer,
            "sub": str(user.id),
            "aud": client_id,
            "iat": int(datetime.utcnow().timestamp()),
            "exp": int((datetime.utcnow() + timedelta(hours=1)).timestamp()),
            "nonce": nonce
        }

        # Claims selon scopes
        if "email" in scopes:
            payload["email"] = user.email
            payload["email_verified"] = user.is_verified

        if "profile" in scopes:
            payload["name"] = user.full_name
            payload["picture"] = user.avatar_url

        return jwt.encode(payload, self.private_key, algorithm=self.algorithm)

    def verify_access_token(self, token: str) -> dict:
        """Vérifie et décode access token"""
        try:
            return jwt.decode(
                token,
                self.public_key,
                algorithms=[self.algorithm],
                issuer=self.issuer
            )
        except jwt.ExpiredSignatureError:
            raise HTTPException(401, "token_expired")
        except jwt.InvalidTokenError:
            raise HTTPException(401, "invalid_token")
```

#### Configuration

**Fichier :** `apps/api/app/core/config.py`

```python
class Settings(BaseSettings):
    # JWT HS256 (existant - auth interne)
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 jours

    # JWT RS256 (nouveau - OAuth2)
    OAUTH2_PRIVATE_KEY_PATH: str = "keys/private_key.pem"
    OAUTH2_PUBLIC_KEY_PATH: str = "keys/public_key.pem"
    OAUTH2_ISSUER: str = "https://superfasttt.com"
    OAUTH2_ACCESS_TOKEN_EXPIRE_SECONDS: int = 3600  # 1 heure
```

#### Tâches

- [ ] Générer et stocker clés RSA sécurisées
- [ ] Implémenter `JWTRS256Service`
- [ ] Rotation de clés (multi-kids support)
- [ ] Tests vérification tokens

**Fichiers à créer :**

- `apps/api/app/core/auth/jwt_rs256.py`
- `apps/api/keys/` (gitignored, clés en secrets manager prod)
- `tests/core/auth/test_jwt_rs256.py`

---

### 2.2 - OIDC Endpoints (Semaine 2 - 40h)

#### `/.well-known/openid-configuration` - Discovery

```python
@router.get("/.well-known/openid-configuration")
async def openid_configuration(request: Request):
    """OIDC Discovery Document"""
    base_url = str(request.base_url).rstrip("/")

    return {
        "issuer": base_url,
        "authorization_endpoint": f"{base_url}/auth/authorize",
        "token_endpoint": f"{base_url}/auth/token",
        "userinfo_endpoint": f"{base_url}/auth/userinfo",
        "jwks_uri": f"{base_url}/auth/jwks",
        "revocation_endpoint": f"{base_url}/auth/revoke",
        "scopes_supported": [
            "openid", "profile", "email", "offline_access",
            "documents.read", "documents.write",
            "conversations.create", "conversations.read",
            "agents.read", "superfasttt.tenant"
        ],
        "response_types_supported": ["code"],
        "grant_types_supported": ["authorization_code", "refresh_token"],
        "subject_types_supported": ["public"],
        "id_token_signing_alg_values_supported": ["RS256"],
        "token_endpoint_auth_methods_supported": ["client_secret_post"],
        "code_challenge_methods_supported": ["S256", "plain"]
    }
```

#### `/auth/jwks` - JSON Web Key Set

```python
@router.get("/auth/jwks")
async def jwks():
    """Expose clés publiques RSA"""
    jwt_service = get_jwt_rs256_service()

    # Extraire composants RSA de la clé publique
    public_key_obj = serialization.load_pem_public_key(jwt_service.public_key)
    public_numbers = public_key_obj.public_numbers()

    # Encoder n et e en base64url
    n = base64.urlsafe_b64encode(
        public_numbers.n.to_bytes(256, 'big')
    ).decode().rstrip("=")

    e = base64.urlsafe_b64encode(
        public_numbers.e.to_bytes(3, 'big')
    ).decode().rstrip("=")

    return {
        "keys": [
            {
                "kty": "RSA",
                "use": "sig",
                "kid": jwt_service.kid,
                "n": n,
                "e": e,
                "alg": "RS256"
            }
        ]
    }
```

#### `/auth/userinfo` - UserInfo

```python
@router.get("/auth/userinfo")
async def userinfo(
    current_user: User = Depends(get_current_user_oauth)
):
    """OIDC UserInfo Endpoint"""
    # Récupérer scopes du access token
    scopes = current_user.token_scopes

    claims = {"sub": str(current_user.id)}

    if "profile" in scopes:
        claims.update({
            "name": current_user.full_name,
            "picture": current_user.avatar_url
        })

    if "email" in scopes:
        claims.update({
            "email": current_user.email,
            "email_verified": current_user.is_verified
        })

    if "superfasttt.tenant" in scopes:
        claims["tenant_id"] = current_user.tenant_id
        claims["role"] = current_user.role

    return claims
```

#### Tâches

- [ ] Implémenter discovery endpoint
- [ ] Implémenter JWKS endpoint
- [ ] Implémenter UserInfo endpoint
- [ ] Dependency `get_current_user_oauth` (valide RS256)
- [ ] Tests conformité OIDC

**Fichiers à créer :**

- `apps/api/app/routes/oidc/discovery.py`
- `apps/api/app/routes/oidc/jwks.py`
- `apps/api/app/routes/oidc/userinfo.py`
- `apps/api/app/core/auth/dependencies_oauth.py`
- `tests/routes/oidc/test_discovery.py`

---

### ✅ Critères de succès Phase 2

- [ ] Clés RSA générées et sécurisées
- [ ] JWT RS256 service fonctionnel
- [ ] OIDC discovery endpoint conforme
- [ ] JWKS endpoint expose clés publiques
- [ ] UserInfo endpoint retourne claims corrects
- [ ] Apps tierces peuvent vérifier tokens localement
- [ ] Tests passent
- [ ] **Demo :** App externe vérifie signature access token avec JWKS

---

## Phase 3 : External SSO Providers

**Durée :** 3 semaines
**Effort :** 120 heures
**Priorité :** P1 High

### Objectif

Permettre login avec Google Workspace et Microsoft 365.

### 3.1 - Base de données SSO Providers (Semaine 1 - 20h)

#### Tables

```sql
CREATE TABLE external_identity_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(100) NOT NULL,
    provider VARCHAR(50) NOT NULL,  -- 'google', 'microsoft', 'github'
    client_id VARCHAR(255) NOT NULL,
    client_secret_encrypted TEXT NOT NULL,
    config JSONB NOT NULL DEFAULT '{}',  -- domain_restriction, tenant_id, etc.
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(tenant_id, provider)
);

CREATE TABLE user_external_identities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    external_user_id VARCHAR(255) NOT NULL,  -- Google sub, Microsoft oid
    external_email VARCHAR(255),
    metadata JSONB DEFAULT '{}',
    linked_at TIMESTAMP DEFAULT NOW(),
    last_login_at TIMESTAMP,

    UNIQUE(provider, external_user_id)
);

CREATE INDEX idx_external_identities_user ON user_external_identities(user_id);
CREATE INDEX idx_external_identities_provider ON user_external_identities(provider, external_user_id);
```

#### Tâches

- [ ] Créer migration
- [ ] Models SQLAlchemy
- [ ] Encryption service pour client secrets

---

### 3.2 - OAuth2 Client abstraction (Semaine 1 - 20h)

#### Provider abstraction

**Fichier :** `apps/api/app/services/sso/base.py`

```python
class SSOProvider(ABC):
    """Base class pour SSO providers"""

    @abstractmethod
    async def get_authorization_url(
        self,
        redirect_uri: str,
        state: str
    ) -> str:
        """URL d'authorization du provider"""

    @abstractmethod
    async def exchange_code_for_token(
        self,
        code: str,
        redirect_uri: str
    ) -> dict:
        """Échange code contre access token"""

    @abstractmethod
    async def get_user_info(self, access_token: str) -> dict:
        """Récupère infos utilisateur"""
```

#### Google provider

**Fichier :** `apps/api/app/services/sso/google.py`

```python
class GoogleSSOProvider(SSOProvider):
    AUTHORIZATION_URL = "https://accounts.google.com/o/oauth2/v2/auth"
    TOKEN_URL = "https://oauth2.googleapis.com/token"
    USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"

    async def get_authorization_url(self, redirect_uri: str, state: str) -> str:
        params = {
            "client_id": self.client_id,
            "redirect_uri": redirect_uri,
            "response_type": "code",
            "scope": "openid email profile",
            "state": state,
            "access_type": "offline",
            "prompt": "select_account"
        }
        return f"{self.AUTHORIZATION_URL}?{urlencode(params)}"
```

#### Microsoft provider

**Fichier :** `apps/api/app/services/sso/microsoft.py`

```python
class MicrosoftSSOProvider(SSOProvider):
    AUTHORIZATION_URL = "https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize"
    TOKEN_URL = "https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token"
    USERINFO_URL = "https://graph.microsoft.com/v1.0/me"
```

#### Tâches

- [ ] Abstraction `SSOProvider`
- [ ] Implémenter `GoogleSSOProvider`
- [ ] Implémenter `MicrosoftSSOProvider`
- [ ] Tests avec mocks

---

### 3.3 - SSO Login Endpoints (Semaine 2 - 40h)

#### Endpoints

```python
@router.get("/auth/login/{provider}")
async def sso_login(
    provider: str,
    request: Request,
    tenant_id: str = Query(...)
):
    """Initie login SSO"""
    # 1. Récupérer config provider du tenant
    # 2. Générer state et le stocker en session
    # 3. Redirect vers provider authorization URL

@router.get("/auth/callback/{provider}")
async def sso_callback(
    provider: str,
    code: str,
    state: str,
    request: Request
):
    """Callback SSO provider"""
    # 1. Vérifier state
    # 2. Échanger code contre access token
    # 3. Récupérer user info du provider
    # 4. Trouver ou créer user SUPERFASTTT
    # 5. Lier external identity
    # 6. Créer session JWT HS256
    # 7. Redirect vers frontend
```

#### Account linking logic

```python
async def link_or_create_user(
    provider: str,
    external_user_id: str,
    external_email: str,
    user_info: dict,
    tenant_id: str
) -> User:
    """Lie ou crée utilisateur"""

    # 1. Chercher si external identity existe déjà
    external_id = await db.find_external_identity(provider, external_user_id)
    if external_id:
        return await db.get_user(external_id.user_id)

    # 2. Chercher user par email dans le tenant
    user = await db.find_user_by_email(external_email, tenant_id)

    if user:
        # Lier external identity à user existant
        await db.create_external_identity(
            user_id=user.id,
            provider=provider,
            external_user_id=external_user_id,
            external_email=external_email
        )
        return user

    # 3. Créer nouveau user (JIT provisioning)
    user = await db.create_user(
        email=external_email,
        full_name=user_info.get("name"),
        avatar_url=user_info.get("picture"),
        tenant_id=tenant_id,
        is_verified=True,  # Email vérifié par provider
        role="USER"
    )

    await db.create_external_identity(
        user_id=user.id,
        provider=provider,
        external_user_id=external_user_id,
        external_email=external_email
    )

    return user
```

#### Tâches

- [ ] Endpoints login/callback
- [ ] Account linking logic
- [ ] JIT provisioning
- [ ] Domain restriction support
- [ ] Tests E2E avec mocks

---

### 3.4 - Admin UI SSO Config (Semaine 3 - 40h)

#### API Admin

```python
@router.get("/api/v1/admin/sso-providers")
async def list_sso_providers(...)

@router.post("/api/v1/admin/sso-providers")
async def configure_sso_provider(...)

@router.put("/api/v1/admin/sso-providers/{provider}")
async def update_sso_provider(...)

@router.delete("/api/v1/admin/sso-providers/{provider}")
async def disable_sso_provider(...)

@router.post("/api/v1/admin/sso-providers/{provider}/test")
async def test_sso_connection(...)
```

#### Frontend (basique)

- Page configuration SSO providers
- Formulaire Google (client ID/secret)
- Formulaire Microsoft (client ID/secret/tenant)
- Test de connexion

#### Tâches

- [ ] API admin SSO providers
- [ ] Page admin frontend (basique)
- [ ] Tests connexion SSO
- [ ] Documentation setup

---

### ✅ Critères de succès Phase 3

- [ ] Tables SSO providers créées
- [ ] Google SSO fonctionnel
- [ ] Microsoft SSO fonctionnel
- [ ] Account linking fonctionne
- [ ] JIT provisioning fonctionne
- [ ] Admin peut configurer providers
- [ ] Tests E2E passent
- [ ] **Demo :** User se connecte avec Google, accède à SUPERFASTTT, puis SSO vers app tierce

---

## Phase 4 : Admin UI + UX

**Durée :** 2 semaines
**Effort :** 80 heures
**Priorité :** P1 High

### 4.1 - Admin UI OAuth2 Clients (Semaine 1 - 40h)

#### Pages à créer

- `/admin/settings/oauth-clients` - Liste clients
- `/admin/settings/oauth-clients/new` - Créer client
- `/admin/settings/oauth-clients/:id/edit` - Éditer client
- `/admin/settings/oauth-clients/:id/tokens` - Tokens actifs

#### Composants

```typescript
// OAuth2ClientList.tsx
- Liste avec nom, client_id, scopes, status
- Actions : Edit, View tokens, Rotate secret, Delete

// OAuth2ClientForm.tsx
- Nom, description, logo URL
- Redirect URIs (liste éditable)
- Scopes sélectionnables (checkboxes)
- Trusted app toggle

// OAuth2ClientSecret.tsx
- Affichage one-time du secret
- Copy to clipboard
- Warning message
```

#### Tâches

- [ ] Pages admin Next.js
- [ ] Composants React
- [ ] Intégration API
- [ ] UX/UI polish

---

### 4.2 - User Consent Management (Semaine 2 - 40h)

#### Page utilisateur

`/settings/connected-apps` - Apps autorisées

#### Fonctionnalités

- Liste apps avec accès
- Scopes accordés
- Date dernier accès
- Bouton révoquer accès

#### Consent screen

Template HTML pour écran de consentement

```html
<!-- apps/api/app/templates/consent.html -->
<form action="/auth/authorize/consent" method="POST">
  <h2>{{ client.name }} demande accès à :</h2>

  <ul>
    {% for scope in scopes %}
    <li>{{ scope_descriptions[scope] }}</li>
    {% endfor %}
  </ul>

  <button name="decision" value="deny">Refuser</button>
  <button name="decision" value="allow">Autoriser</button>
</form>
```

#### Tâches

- [ ] Page connected apps
- [ ] Consent screen template
- [ ] Révocation tokens
- [ ] Tests UX

---

### ✅ Critères de succès Phase 4

- [ ] Admin UI OAuth2 clients complet
- [ ] Users peuvent voir apps connectées
- [ ] Users peuvent révoquer accès
- [ ] Consent screen clair et professionnel
- [ ] UX testée et validée

---

## Phase 5 : Monitoring + Production

**Durée :** 1 semaine
**Effort :** 40 heures
**Priorité :** P2 Medium

### 5.1 - Metrics & Monitoring (3 jours - 24h)

#### Prometheus metrics

```python
oauth_authorization_requests = Counter(
    "oauth_authorization_requests_total",
    "Authorization requests",
    ["client_id", "status"]
)

oauth_token_issued = Counter(
    "oauth_tokens_issued_total",
    "Tokens issued",
    ["client_id", "grant_type"]
)

oauth_token_refreshed = Counter(
    "oauth_tokens_refreshed_total",
    "Token refreshes",
    ["client_id"]
)

oauth_errors = Counter(
    "oauth_errors_total",
    "OAuth errors",
    ["error_type"]
)
```

#### Grafana dashboard

- Tokens émis par jour
- Taux de refresh
- Erreurs par type
- Clients les plus actifs

---

### 5.2 - Cleanup Tasks (2 jours - 16h)

```python
# apps/api/app/tasks/oauth_cleanup.py

async def cleanup_expired_codes():
    """Supprime codes expirés (> 1 jour)"""

async def cleanup_revoked_tokens():
    """Supprime refresh tokens révoqués (> 90 jours)"""

# Cron: tous les jours à 3h
```

---

### ✅ Critères de succès Phase 5

- [ ] Métriques Prometheus en place
- [ ] Dashboard Grafana fonctionnel
- [ ] Alertes configurées
- [ ] Cleanup tasks automatiques
- [ ] Documentation opérationnelle
- [ ] Logs structurés
- [ ] **Production ready!**

---

## Tests

### Tests unitaires

- [ ] Models OAuth2 (100% coverage)
- [ ] OAuth2Service (100% coverage)
- [ ] JWT RS256 service (100% coverage)
- [ ] SSO providers (mocked, 100% coverage)

### Tests d'intégration

- [ ] Flow OAuth2 complet
- [ ] PKCE validation
- [ ] Token refresh
- [ ] Token revocation
- [ ] SSO Google login
- [ ] SSO Microsoft login
- [ ] Account linking

### Tests E2E

- [ ] User login → app tierce SSO → API call
- [ ] Multiple apps SSO (seamless)
- [ ] Admin crée client → app utilise
- [ ] User révoque accès → token invalide

---

## Documentation

À créer/mettre à jour :

- [x] `AUTHENTICATION_ARCHITECTURE.md` - Vue d'ensemble ✅
- [x] `AUTH_TERMINOLOGY.md` - Glossaire ✅
- [x] `SSO_IMPLEMENTATION_ROADMAP.md` - Ce document ✅
- [ ] `SSO_SUPERFASTTT.md` - Mise à jour avec implémentation réelle
- [ ] `DEVELOPER_GUIDE.md` - Guide intégration apps tierces
- [ ] `DEPLOYMENT.md` - Configuration production OAuth2
- [ ] API docs OpenAPI - Endpoints OAuth2/OIDC

---

## Risques et mitigation

| Risque                              | Impact              | Probabilité | Mitigation                          |
| ----------------------------------- | ------------------- | ----------- | ----------------------------------- |
| Complexité OAuth2 sous-estimée      | Retard 2-3 semaines | Moyenne     | Buffer de 20% dans estimations      |
| Intégration SSO providers bloquante | Retard 1 semaine    | Faible      | Tests précoces avec Google/MS       |
| Performance avec RS256              | Latence API         | Faible      | Benchmarks, caching clés publiques  |
| Migration data existante complexe   | Retard 1 semaine    | Moyenne     | Plan de migration détaillé          |
| Sécurité - vulnérabilités OAuth2    | Critique            | Moyenne     | Code review, audit sécurité externe |

---

## Dépendances

### Bibliothèques Python

```toml
# pyproject.toml
dependencies = [
    "pyjwt[crypto]>=2.8.0",  # JWT avec RS256
    "cryptography>=41.0.0",   # RSA keys
    "httpx>=0.25.0",          # OAuth2 client HTTP
]
```

### Secrets management

- Clés RSA privées → AWS Secrets Manager / Vault
- Client secrets providers → Encrypted en DB

### Infrastructure

- PostgreSQL ≥ 14 (JSONB, UUID)
- Redis (state storage OAuth2 flow)

---

## Déploiement

### Environnements

**Development :**

- OAuth2 issuer : `http://localhost:8000`
- Redirect URIs : `http://localhost:*`

**Staging :**

- OAuth2 issuer : `https://staging.superfasttt.com`
- Redirect URIs : HTTPS only

**Production :**

- OAuth2 issuer : `https://superfasttt.com`
- Redirect URIs : HTTPS only, strict whitelist
- Rate limiting agressif
- WAF activé

---

## Support post-launch

### Formation

- [ ] Guide admin : configurer SSO providers
- [ ] Guide dev : intégrer app tierce
- [ ] Vidéos tutoriels

### Monitoring

- [ ] Alertes PagerDuty
- [ ] Dashboard temps réel
- [ ] SLA 99.9% disponibilité endpoints OAuth2

---

## Timeline résumé

```
Semaine 1-4   : Phase 1 - OAuth2 Core MVP
Semaine 5-6   : Phase 2 - RS256 + JWKS
Semaine 7-9   : Phase 3 - External SSO (Google/MS)
Semaine 10-11 : Phase 4 - Admin UI + UX
Semaine 12    : Phase 5 - Monitoring + Production

Total : 12 semaines (3 mois)
```

---

**Prochaine étape :** Phase 1 - Semaine 1 - Créer tables OAuth2

**Dernière mise à jour :** 2025-01-22
