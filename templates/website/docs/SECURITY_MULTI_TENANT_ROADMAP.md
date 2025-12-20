# Roadmap Sécurité - Mode SaaS Mutualisé

> Guide développeur pour renforcer la sécurité du mode multi-tenant

---

## Table des Matières

1. [Contexte et Objectifs](#contexte-et-objectifs)
2. [État Actuel](#état-actuel)
3. [Priorité 1 - Rate Limiting](#priorité-1---rate-limiting)
4. [Priorité 2 - Row-Level Security PostgreSQL](#priorité-2---row-level-security-postgresql)
5. [Priorité 3 - Salt Dynamique](#priorité-3---salt-dynamique)
6. [Priorité 4 - MFA/2FA](#priorité-4---mfa2fa)
7. [Priorité 5 - IP Whitelisting API Keys](#priorité-5---ip-whitelisting-api-keys)
8. [Priorité 6 - Rotation des Secrets](#priorité-6---rotation-des-secrets)
9. [Priorité 7 - Alertes Sécurité Temps Réel](#priorité-7---alertes-sécurité-temps-réel)
10. [Checklist de Validation](#checklist-de-validation)
11. [Ressources](#ressources)

---

## Contexte et Objectifs

### Pourquoi ce Document ?

Le mode **SaaS mutualisé** (multi-tenant) partage une infrastructure entre plusieurs clients. Cette mutualisation nécessite des garanties de sécurité renforcées pour :

- Empêcher les accès cross-tenant
- Protéger contre les attaques par force brute
- Garantir la conformité RGPD
- Répondre aux exigences des clients B2B enterprise

### Objectif

Atteindre un niveau de sécurité **enterprise-grade** compatible avec :

- Clients grands comptes
- Secteurs régulés (santé, finance, juridique)
- Certifications SOC 2, ISO 27001

---

## État Actuel

### Ce qui est bien implémenté

| Composant                       | Fichier                             | Status      |
| ------------------------------- | ----------------------------------- | ----------- |
| Isolation par schéma PostgreSQL | `app/core/database.py`              | ✅ Solide   |
| Authentification JWT            | `app/core/auth/jwt.py`              | ✅ Bon      |
| API Keys hashées (SHA256)       | `app/core/security/auth_service.py` | ✅ Sécurisé |
| RBAC (5 rôles, 50+ permissions) | `app/core/rbac/permissions.py`      | ✅ Complet  |
| Audit Trail                     | `app/core/audit/service.py`         | ✅ Bon      |
| Chiffrement Fernet              | `app/core/encryption.py`            | ✅ Standard |
| Timing-safe comparison          | `app/core/security/auth_service.py` | ✅ Sécurisé |

### Ce qui manque

| Composant                | Risque                      | Priorité      |
| ------------------------ | --------------------------- | ------------- |
| Rate Limiting            | Attaques brute force, DDoS  | P1 - Critique |
| Row-Level Security (RLS) | Defense in depth            | P2 - Élevée   |
| Salt dynamique           | Compromission chiffrement   | P3 - Moyenne  |
| MFA/2FA                  | Compromission comptes admin | P4 - Moyenne  |
| IP Whitelisting          | Abus API Keys               | P5 - Moyenne  |
| Rotation secrets         | Compromission long terme    | P6 - Moyenne  |
| Alertes temps réel       | Détection incidents         | P7 - Moyenne  |

---

## Priorité 1 - Rate Limiting

### Problème

Sans rate limiting, l'API est vulnérable à :

- Attaques par force brute sur l'authentification
- Déni de service (DDoS applicatif)
- Abus de ressources par un tenant
- Scraping massif des données

### Solution

Implémenter un rate limiting à plusieurs niveaux avec **SlowAPI** + **Redis**.

### Implémentation

#### 1. Installer les dépendances

```bash
# Dans apps/api/pyproject.toml
pip install slowapi redis
```

#### 2. Créer le service de rate limiting

**Fichier:** `apps/api/app/core/security/rate_limiter.py`

```python
"""
Rate Limiting Service pour protection API multi-tenant.
"""
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request, HTTPException
from redis import asyncio as aioredis
from typing import Optional
import os

from app.core.config import settings


def get_tenant_identifier(request: Request) -> str:
    """
    Identifie le tenant pour le rate limiting.
    Combine IP + tenant_id pour isolation par tenant.
    """
    ip = get_remote_address(request)
    tenant_id = getattr(request.state, "tenant_id", "unknown")
    return f"{tenant_id}:{ip}"


def get_api_key_identifier(request: Request) -> str:
    """
    Identifie par API Key pour limiter par clé.
    """
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer sk-"):
        # Utiliser le préfixe de la clé (premiers 10 caractères)
        return auth_header[7:17]
    return get_tenant_identifier(request)


# Configuration Redis
redis_url = settings.REDIS_URL or "redis://localhost:6379/1"

# Limiter principal
limiter = Limiter(
    key_func=get_tenant_identifier,
    storage_uri=redis_url,
    strategy="fixed-window",  # ou "moving-window" pour plus de précision
)


class RateLimitConfig:
    """Configuration des limites par type d'endpoint."""

    # Endpoints d'authentification (plus restrictifs)
    AUTH_LOGIN = "5/minute"
    AUTH_REGISTER = "3/minute"
    AUTH_PASSWORD_RESET = "3/hour"

    # Endpoints API standards
    API_READ = "100/minute"
    API_WRITE = "30/minute"
    API_SEARCH = "50/minute"

    # Endpoints IA (coûteux)
    AI_CHAT = "20/minute"
    AI_EMBEDDING = "50/minute"
    AI_RAG_QUERY = "30/minute"

    # Endpoints admin
    ADMIN_READ = "60/minute"
    ADMIN_WRITE = "20/minute"

    # Limites globales par tenant
    TENANT_GLOBAL = "1000/minute"

    # Limites par API Key
    API_KEY_DEFAULT = "500/minute"


async def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded):
    """Handler pour les erreurs de rate limit."""
    # Log l'événement pour monitoring
    from app.core.audit.service import audit_service

    await audit_service.log(
        tenant_id=getattr(request.state, "tenant_id", "unknown"),
        action="security.rate_limit_exceeded",
        resource_type="api",
        ip_address=get_remote_address(request),
        user_agent=request.headers.get("User-Agent"),
        endpoint=str(request.url.path),
        http_method=request.method,
        metadata={
            "limit": str(exc.detail),
            "identifier": get_tenant_identifier(request),
        },
        message=f"Rate limit exceeded: {exc.detail}",
        request=request,
    )

    raise HTTPException(
        status_code=429,
        detail={
            "error": "rate_limit_exceeded",
            "message": "Trop de requêtes. Veuillez réessayer plus tard.",
            "retry_after": exc.retry_after,
        },
        headers={"Retry-After": str(exc.retry_after)},
    )
```

#### 3. Intégrer dans FastAPI

**Fichier:** `apps/api/main.py`

```python
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from app.core.security.rate_limiter import limiter, rate_limit_exceeded_handler

# Ajouter le limiter à l'app
app.state.limiter = limiter

# Handler pour les erreurs de rate limit
app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)
```

#### 4. Appliquer aux routes

**Exemple:** `apps/api/app/api/v1/auth.py`

```python
from app.core.security.rate_limiter import limiter, RateLimitConfig

@router.post("/login")
@limiter.limit(RateLimitConfig.AUTH_LOGIN)
async def login(request: Request, credentials: LoginRequest):
    """Login avec rate limiting strict."""
    ...

@router.post("/register")
@limiter.limit(RateLimitConfig.AUTH_REGISTER)
async def register(request: Request, user_data: RegisterRequest):
    """Register avec rate limiting strict."""
    ...
```

**Exemple:** `apps/api/app/api/v1/documents.py`

```python
@router.get("/")
@limiter.limit(RateLimitConfig.API_READ)
async def list_documents(request: Request, ...):
    ...

@router.post("/")
@limiter.limit(RateLimitConfig.API_WRITE)
async def create_document(request: Request, ...):
    ...
```

#### 5. Rate limiting par API Key

**Fichier:** `apps/api/app/core/security/rate_limiter.py` (ajout)

```python
async def check_api_key_rate_limit(
    api_key_id: str,
    limit: Optional[int] = None,
    window: int = 60,
) -> bool:
    """
    Vérifie le rate limit pour une API Key spécifique.
    Permet des limites personnalisées par clé.
    """
    redis = aioredis.from_url(redis_url)
    key = f"ratelimit:apikey:{api_key_id}"

    # Limite par défaut ou personnalisée
    max_requests = limit or 500

    try:
        current = await redis.incr(key)
        if current == 1:
            await redis.expire(key, window)

        if current > max_requests:
            return False
        return True
    finally:
        await redis.close()
```

### Variables d'environnement

```bash
# .env
RATE_LIMIT_ENABLED=true
RATE_LIMIT_STORAGE_URL=redis://redis:6379/1
RATE_LIMIT_DEFAULT_LIMIT=100/minute
RATE_LIMIT_AUTH_LIMIT=5/minute
```

### Tests

```python
# tests/test_rate_limiting.py
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_rate_limit_login():
    """Test que le login est limité à 5 requêtes/minute."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        # 5 premières requêtes OK
        for _ in range(5):
            response = await client.post("/api/v1/auth/login", json={...})
            assert response.status_code in [200, 401]

        # 6ème requête bloquée
        response = await client.post("/api/v1/auth/login", json={...})
        assert response.status_code == 429
        assert "retry_after" in response.json()
```

---

## Priorité 2 - Row-Level Security PostgreSQL

### Problème

L'isolation actuelle repose uniquement sur `SET search_path`. Si une faille SQL ou un bug applicatif bypass cette logique, un tenant pourrait accéder aux données d'un autre.

### Solution

Ajouter **Row-Level Security (RLS)** PostgreSQL comme **defense in depth**.

### Implémentation

#### 1. Créer la migration Alembic

**Fichier:** `apps/api/alembic/versions/xxx_add_rls_policies.py`

```python
"""Add Row-Level Security policies for multi-tenant isolation.

Revision ID: xxx
"""
from alembic import op

def upgrade():
    # Activer RLS sur les tables principales
    tables = [
        'documents',
        'conversations',
        'messages',
        'agents',
        'ai_profiles',
        'memories',
        'api_keys',
        'users',
        'audit_logs',
    ]

    for table in tables:
        # Activer RLS
        op.execute(f'ALTER TABLE {table} ENABLE ROW LEVEL SECURITY;')

        # Forcer RLS même pour le owner de la table
        op.execute(f'ALTER TABLE {table} FORCE ROW LEVEL SECURITY;')

        # Créer la politique d'isolation
        op.execute(f'''
            CREATE POLICY tenant_isolation_policy ON {table}
            USING (tenant_id = current_setting('app.current_tenant_id', true))
            WITH CHECK (tenant_id = current_setting('app.current_tenant_id', true));
        ''')

    # Créer un rôle applicatif avec RLS
    op.execute('''
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'app_user') THEN
                CREATE ROLE app_user;
            END IF;
        END
        $$;
    ''')

    # Accorder les permissions
    for table in tables:
        op.execute(f'GRANT SELECT, INSERT, UPDATE, DELETE ON {table} TO app_user;')


def downgrade():
    tables = [
        'documents', 'conversations', 'messages', 'agents',
        'ai_profiles', 'memories', 'api_keys', 'users', 'audit_logs',
    ]

    for table in tables:
        op.execute(f'DROP POLICY IF EXISTS tenant_isolation_policy ON {table};')
        op.execute(f'ALTER TABLE {table} DISABLE ROW LEVEL SECURITY;')
```

#### 2. Modifier la gestion de session

**Fichier:** `apps/api/app/core/database.py` (modification)

```python
async def set_search_path(
    session: AsyncSession,
    tenant_id: Optional[str] = None
) -> None:
    """
    Configure l'isolation tenant avec search_path ET RLS.
    Double protection: schéma + row-level security.
    """
    if tenant_id:
        schema_name = f"tenant_{tenant_id}"

        # 1. Isolation par schéma (existant)
        await session.execute(
            text(f'SET search_path TO "{schema_name}", public')
        )

        # 2. Isolation RLS (nouveau)
        await session.execute(
            text("SET app.current_tenant_id = :tenant_id"),
            {"tenant_id": tenant_id}
        )
    else:
        await session.execute(text("SET search_path TO public"))
        await session.execute(text("RESET app.current_tenant_id"))
```

#### 3. Configuration pour bypass admin

Pour les opérations d'administration cross-tenant :

```python
async def set_admin_context(session: AsyncSession) -> None:
    """
    Configure le contexte admin qui bypass RLS.
    À utiliser uniquement pour les opérations d'administration.
    """
    # Utiliser le rôle superuser qui bypass RLS
    await session.execute(text("SET ROLE postgres;"))

async def reset_admin_context(session: AsyncSession) -> None:
    """Revenir au rôle applicatif normal."""
    await session.execute(text("RESET ROLE;"))
```

### Tests

```python
# tests/test_rls.py
@pytest.mark.asyncio
async def test_rls_prevents_cross_tenant_access():
    """Test que RLS empêche l'accès cross-tenant même sans search_path."""
    async with get_session() as session:
        # Configurer pour tenant_A
        await session.execute(
            text("SET app.current_tenant_id = 'tenant_a'")
        )

        # Créer un document pour tenant_A
        await session.execute(
            text("INSERT INTO documents (id, tenant_id, title) VALUES (1, 'tenant_a', 'Doc A')")
        )

        # Changer pour tenant_B
        await session.execute(
            text("SET app.current_tenant_id = 'tenant_b'")
        )

        # Tenter de lire le document de tenant_A
        result = await session.execute(
            text("SELECT * FROM documents WHERE id = 1")
        )

        # RLS doit bloquer l'accès
        assert result.fetchone() is None
```

---

## Priorité 3 - Salt Dynamique

### Problème

Le salt de chiffrement est actuellement hardcodé :

```python
# app/core/encryption.py (actuel)
salt = b"superfasttt_salt_v1"  # RISQUE: identique partout
```

Si ce salt est compromis, tous les environnements sont vulnérables.

### Solution

Utiliser un salt unique par environnement stocké en variable d'environnement.

### Implémentation

#### 1. Générer un salt unique par environnement

```bash
# Générer un salt (à faire une fois par environnement)
python -c "import secrets; print(secrets.token_hex(32))"
```

#### 2. Modifier le service de chiffrement

**Fichier:** `apps/api/app/core/encryption.py` (modification)

```python
import os
import base64
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.backends import default_backend


class EncryptionService:
    """Service de chiffrement avec salt dynamique."""

    _instance = None
    _fernet = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        """Initialise le chiffrement avec salt dynamique."""
        secret = os.getenv("ENCRYPTION_SECRET")
        if not secret:
            raise ValueError("ENCRYPTION_SECRET must be set")

        # Salt dynamique depuis l'environnement
        salt_hex = os.getenv("ENCRYPTION_SALT")
        if not salt_hex:
            raise ValueError(
                "ENCRYPTION_SALT must be set. "
                "Generate with: python -c \"import secrets; print(secrets.token_hex(32))\""
            )

        salt = bytes.fromhex(salt_hex)

        # Valider la longueur du salt (minimum 16 bytes recommandé)
        if len(salt) < 16:
            raise ValueError("ENCRYPTION_SALT must be at least 32 hex characters (16 bytes)")

        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
            backend=default_backend()
        )

        key = base64.urlsafe_b64encode(kdf.derive(secret.encode()))
        self._fernet = Fernet(key)

    def encrypt(self, plaintext: str) -> str:
        """Chiffre une chaîne de caractères."""
        if not plaintext:
            return ""
        return self._fernet.encrypt(plaintext.encode()).decode()

    def decrypt(self, ciphertext: str) -> str:
        """Déchiffre une chaîne de caractères."""
        if not ciphertext:
            return ""
        return self._fernet.decrypt(ciphertext.encode()).decode()


# Singleton
encryption_service = EncryptionService()
```

#### 3. Variables d'environnement

```bash
# .env.example (ajouter)

# Chiffrement
# IMPORTANT: Générer des valeurs uniques par environnement!
# python -c "import secrets; print(secrets.token_hex(32))"
ENCRYPTION_SECRET=your-encryption-secret-min-32-chars
ENCRYPTION_SALT=your-unique-salt-per-environment-64-hex-chars
```

```bash
# .env.production (exemple)
ENCRYPTION_SECRET=super_secret_key_production_environment_2024
ENCRYPTION_SALT=a3f8c2d1e4b5a6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1
```

#### 4. Migration des données existantes

Si des données sont déjà chiffrées avec l'ancien salt :

```python
# scripts/migrate_encryption.py
"""
Script de migration du chiffrement vers le nouveau salt.
À exécuter une seule fois lors de la mise à jour.
"""
import os
from app.core.encryption import EncryptionService

# Ancien service avec salt hardcodé (temporaire)
class LegacyEncryptionService:
    def __init__(self):
        salt = b"superfasttt_salt_v1"  # Ancien salt
        # ... reste de l'initialisation

    def decrypt(self, ciphertext: str) -> str:
        # ... déchiffrement avec ancien salt

async def migrate_encrypted_data():
    """Migre les données chiffrées vers le nouveau salt."""
    legacy = LegacyEncryptionService()
    new_service = EncryptionService()

    # Migrer les configs tenant
    async with get_session() as session:
        configs = await session.execute(
            text("SELECT id, database_config FROM tenants WHERE database_config IS NOT NULL")
        )

        for row in configs:
            try:
                # Déchiffrer avec ancien salt
                decrypted = legacy.decrypt(row.database_config)
                # Re-chiffrer avec nouveau salt
                encrypted = new_service.encrypt(decrypted)
                # Mettre à jour
                await session.execute(
                    text("UPDATE tenants SET database_config = :config WHERE id = :id"),
                    {"config": encrypted, "id": row.id}
                )
            except Exception as e:
                print(f"Erreur migration tenant {row.id}: {e}")

        await session.commit()

if __name__ == "__main__":
    import asyncio
    asyncio.run(migrate_encrypted_data())
```

---

## Priorité 4 - MFA/2FA

### Problème

Sans MFA, un mot de passe compromis donne un accès complet au compte, particulièrement critique pour les admins.

### Solution

Implémenter TOTP (Time-based One-Time Password) compatible avec Google Authenticator, Authy, etc.

### Implémentation

#### 1. Installer les dépendances

```bash
pip install pyotp qrcode[pil]
```

#### 2. Créer le service MFA

**Fichier:** `apps/api/app/core/security/mfa_service.py`

```python
"""
Service MFA basé sur TOTP (RFC 6238).
Compatible avec Google Authenticator, Authy, Microsoft Authenticator.
"""
import pyotp
import qrcode
import qrcode.image.svg
from io import BytesIO
import base64
from typing import Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from app.core.encryption import encryption_service


class MFAService:
    """Service de gestion MFA/2FA."""

    ISSUER_NAME = "SUPERFASTTT"

    def generate_secret(self) -> str:
        """Génère un nouveau secret TOTP."""
        return pyotp.random_base32()

    def get_totp_uri(self, secret: str, email: str) -> str:
        """Génère l'URI pour QR code."""
        totp = pyotp.TOTP(secret)
        return totp.provisioning_uri(
            name=email,
            issuer_name=self.ISSUER_NAME
        )

    def generate_qr_code(self, secret: str, email: str) -> str:
        """
        Génère un QR code en base64 pour affichage.
        Retourne: data:image/svg+xml;base64,xxx
        """
        uri = self.get_totp_uri(secret, email)

        # Générer QR code SVG
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(uri)
        qr.make(fit=True)

        img = qr.make_image(image_factory=qrcode.image.svg.SvgImage)

        buffer = BytesIO()
        img.save(buffer)
        svg_data = buffer.getvalue().decode()

        # Encoder en base64
        b64 = base64.b64encode(svg_data.encode()).decode()
        return f"data:image/svg+xml;base64,{b64}"

    def verify_code(self, secret: str, code: str) -> bool:
        """
        Vérifie un code TOTP.
        Accepte le code actuel et les 2 codes adjacents (tolérance de 60s).
        """
        if not secret or not code:
            return False

        totp = pyotp.TOTP(secret)
        # valid_window=1 accepte le code précédent et suivant
        return totp.verify(code, valid_window=1)

    def generate_backup_codes(self, count: int = 10) -> list[str]:
        """Génère des codes de secours à usage unique."""
        import secrets
        return [secrets.token_hex(4).upper() for _ in range(count)]

    async def enable_mfa(
        self,
        session: AsyncSession,
        user_id: str,
        secret: str,
        backup_codes: list[str],
    ) -> bool:
        """Active le MFA pour un utilisateur."""
        # Chiffrer le secret et les codes
        encrypted_secret = encryption_service.encrypt(secret)
        encrypted_codes = encryption_service.encrypt(",".join(backup_codes))

        await session.execute(
            text("""
                UPDATE users
                SET mfa_enabled = true,
                    mfa_secret = :secret,
                    mfa_backup_codes = :backup_codes,
                    updated_at = NOW()
                WHERE user_id = :user_id
            """),
            {
                "user_id": user_id,
                "secret": encrypted_secret,
                "backup_codes": encrypted_codes,
            }
        )
        await session.commit()
        return True

    async def disable_mfa(
        self,
        session: AsyncSession,
        user_id: str,
    ) -> bool:
        """Désactive le MFA pour un utilisateur."""
        await session.execute(
            text("""
                UPDATE users
                SET mfa_enabled = false,
                    mfa_secret = NULL,
                    mfa_backup_codes = NULL,
                    updated_at = NOW()
                WHERE user_id = :user_id
            """),
            {"user_id": user_id}
        )
        await session.commit()
        return True

    async def verify_user_mfa(
        self,
        session: AsyncSession,
        user_id: str,
        code: str,
    ) -> Tuple[bool, Optional[str]]:
        """
        Vérifie le code MFA d'un utilisateur.
        Retourne: (success, error_message)
        """
        result = await session.execute(
            text("""
                SELECT mfa_secret, mfa_backup_codes
                FROM users
                WHERE user_id = :user_id AND mfa_enabled = true
            """),
            {"user_id": user_id}
        )
        row = result.fetchone()

        if not row:
            return False, "MFA not enabled for this user"

        # Déchiffrer le secret
        secret = encryption_service.decrypt(row.mfa_secret)

        # Vérifier le code TOTP
        if self.verify_code(secret, code):
            return True, None

        # Vérifier les codes de secours
        if row.mfa_backup_codes:
            backup_codes = encryption_service.decrypt(row.mfa_backup_codes).split(",")
            if code.upper() in backup_codes:
                # Supprimer le code utilisé
                backup_codes.remove(code.upper())
                encrypted_codes = encryption_service.encrypt(",".join(backup_codes))
                await session.execute(
                    text("UPDATE users SET mfa_backup_codes = :codes WHERE user_id = :user_id"),
                    {"codes": encrypted_codes, "user_id": user_id}
                )
                await session.commit()
                return True, None

        return False, "Invalid MFA code"


mfa_service = MFAService()
```

#### 3. Migration pour ajouter les colonnes MFA

**Fichier:** `apps/api/alembic/versions/xxx_add_mfa_columns.py`

```python
"""Add MFA columns to users table.

Revision ID: xxx
"""
from alembic import op
import sqlalchemy as sa

def upgrade():
    op.add_column('users', sa.Column('mfa_enabled', sa.Boolean(), default=False))
    op.add_column('users', sa.Column('mfa_secret', sa.String(255), nullable=True))
    op.add_column('users', sa.Column('mfa_backup_codes', sa.Text(), nullable=True))

    # Index pour les requêtes sur mfa_enabled
    op.create_index('idx_users_mfa_enabled', 'users', ['mfa_enabled'])

def downgrade():
    op.drop_index('idx_users_mfa_enabled')
    op.drop_column('users', 'mfa_backup_codes')
    op.drop_column('users', 'mfa_secret')
    op.drop_column('users', 'mfa_enabled')
```

#### 4. Endpoints API

**Fichier:** `apps/api/app/api/v1/mfa.py`

```python
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.core.security.mfa_service import mfa_service
from app.core.auth.dependencies import get_current_active_user

router = APIRouter(prefix="/mfa", tags=["MFA"])


class MFASetupResponse(BaseModel):
    secret: str
    qr_code: str  # data:image/svg+xml;base64,...
    backup_codes: list[str]


class MFAVerifyRequest(BaseModel):
    code: str


@router.post("/setup", response_model=MFASetupResponse)
async def setup_mfa(
    user = Depends(get_current_active_user),
    session = Depends(get_session),
):
    """
    Initialise la configuration MFA.
    Retourne le QR code et les codes de secours.
    L'utilisateur doit appeler /verify pour activer.
    """
    secret = mfa_service.generate_secret()
    qr_code = mfa_service.generate_qr_code(secret, user.email)
    backup_codes = mfa_service.generate_backup_codes()

    # Stocker temporairement (non activé)
    # Le secret sera activé après vérification

    return MFASetupResponse(
        secret=secret,
        qr_code=qr_code,
        backup_codes=backup_codes,
    )


@router.post("/enable")
async def enable_mfa(
    request: MFAVerifyRequest,
    secret: str,  # Passé depuis le setup
    user = Depends(get_current_active_user),
    session = Depends(get_session),
):
    """Active le MFA après vérification du premier code."""
    if not mfa_service.verify_code(secret, request.code):
        raise HTTPException(400, "Invalid code. Please try again.")

    backup_codes = mfa_service.generate_backup_codes()
    await mfa_service.enable_mfa(session, user.user_id, secret, backup_codes)

    return {"message": "MFA enabled successfully", "backup_codes": backup_codes}


@router.post("/disable")
async def disable_mfa(
    request: MFAVerifyRequest,
    user = Depends(get_current_active_user),
    session = Depends(get_session),
):
    """Désactive le MFA (nécessite le code actuel)."""
    success, error = await mfa_service.verify_user_mfa(
        session, user.user_id, request.code
    )

    if not success:
        raise HTTPException(400, error)

    await mfa_service.disable_mfa(session, user.user_id)
    return {"message": "MFA disabled successfully"}
```

#### 5. Modifier le flow de login

**Fichier:** `apps/api/app/api/v1/auth.py` (modification)

```python
@router.post("/login")
async def login(credentials: LoginRequest, session = Depends(get_session)):
    """Login avec support MFA."""
    # 1. Vérifier email/password
    user = await authenticate_user(session, credentials.email, credentials.password)
    if not user:
        raise HTTPException(401, "Invalid credentials")

    # 2. Vérifier si MFA activé
    if user.mfa_enabled:
        if not credentials.mfa_code:
            # Retourner un état intermédiaire
            return {
                "requires_mfa": True,
                "message": "MFA code required"
            }

        # Vérifier le code MFA
        success, error = await mfa_service.verify_user_mfa(
            session, user.user_id, credentials.mfa_code
        )
        if not success:
            raise HTTPException(401, f"MFA verification failed: {error}")

    # 3. Générer le token
    token = create_access_token(user)
    return {"access_token": token, "token_type": "bearer"}
```

---

## Priorité 5 - IP Whitelisting API Keys

### Problème

Une API Key volée peut être utilisée depuis n'importe quelle IP.

### Solution

Permettre de restreindre les API Keys à des plages d'IP spécifiques.

### Implémentation

#### 1. Migration

```python
"""Add IP whitelist to API keys.

Revision ID: xxx
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import ARRAY

def upgrade():
    op.add_column(
        'api_keys',
        sa.Column('allowed_ips', ARRAY(sa.String(45)), nullable=True)
    )
    # NULL = toutes IPs autorisées
    # [] = aucune IP autorisée (clé bloquée)
    # ['1.2.3.4', '10.0.0.0/8'] = IPs/CIDR spécifiques

def downgrade():
    op.drop_column('api_keys', 'allowed_ips')
```

#### 2. Service de validation IP

**Fichier:** `apps/api/app/core/security/ip_validator.py`

```python
"""
Service de validation d'IP avec support CIDR.
"""
import ipaddress
from typing import Optional


class IPValidator:
    """Valide les adresses IP contre une whitelist."""

    @staticmethod
    def is_ip_allowed(
        client_ip: str,
        allowed_ips: Optional[list[str]]
    ) -> bool:
        """
        Vérifie si une IP est dans la whitelist.

        Args:
            client_ip: IP du client (ex: "192.168.1.100")
            allowed_ips: Liste d'IPs ou CIDR (ex: ["10.0.0.0/8", "192.168.1.100"])

        Returns:
            True si autorisé, False sinon
        """
        # Si pas de whitelist, tout est autorisé
        if allowed_ips is None:
            return True

        # Si whitelist vide, rien n'est autorisé
        if len(allowed_ips) == 0:
            return False

        try:
            client = ipaddress.ip_address(client_ip)
        except ValueError:
            return False

        for allowed in allowed_ips:
            try:
                # Essayer comme réseau CIDR
                if "/" in allowed:
                    network = ipaddress.ip_network(allowed, strict=False)
                    if client in network:
                        return True
                else:
                    # Essayer comme IP unique
                    if client == ipaddress.ip_address(allowed):
                        return True
            except ValueError:
                continue

        return False


ip_validator = IPValidator()
```

#### 3. Intégrer dans la validation API Key

**Fichier:** `apps/api/app/core/security/auth_service.py` (modification)

```python
from app.core.security.ip_validator import ip_validator

async def validate_api_key(
    key: str,
    tenant_id: str,
    client_ip: str,  # Nouveau paramètre
    required_scope: Optional[str] = None,
) -> APIKey:
    """Valide une API Key avec vérification IP."""

    # ... validation existante ...

    # Vérifier l'IP
    if not ip_validator.is_ip_allowed(client_ip, api_key.allowed_ips):
        # Log tentative
        await audit_service.log(
            tenant_id=tenant_id,
            action="security.ip_blocked",
            resource_type="api_key",
            resource_id=str(api_key.api_key_id),
            ip_address=client_ip,
            message=f"API Key access blocked from IP {client_ip}",
        )
        raise APIKeyError("Access denied from this IP address")

    return api_key
```

---

## Priorité 6 - Rotation des Secrets

### Problème

Les secrets (JWT_SECRET, ENCRYPTION_SECRET) sont statiques. En cas de compromission, il faut pouvoir les changer sans interruption de service.

### Solution

Implémenter un système de rotation avec support de plusieurs secrets simultanés.

### Implémentation

#### 1. Configuration multi-secrets

```bash
# .env
# Secret actuel (utilisé pour signer)
JWT_SECRET=current_secret_2024_v2

# Secrets précédents (acceptés pour validation, séparés par virgule)
JWT_SECRET_PREVIOUS=old_secret_2024_v1,older_secret_2023

# Même principe pour le chiffrement
ENCRYPTION_SECRET=current_encryption_key
ENCRYPTION_SECRET_PREVIOUS=old_encryption_key
```

#### 2. Service JWT avec rotation

**Fichier:** `apps/api/app/core/auth/jwt.py` (modification)

```python
import os
from typing import Optional
from jose import jwt, JWTError

class JWTService:
    """Service JWT avec support rotation des secrets."""

    def __init__(self):
        self.current_secret = os.getenv("JWT_SECRET")
        previous = os.getenv("JWT_SECRET_PREVIOUS", "")
        self.previous_secrets = [s.strip() for s in previous.split(",") if s.strip()]
        self.algorithm = os.getenv("JWT_ALGORITHM", "HS256")

    def create_token(self, payload: dict) -> str:
        """Crée un token avec le secret actuel."""
        return jwt.encode(payload, self.current_secret, algorithm=self.algorithm)

    def verify_token(self, token: str) -> Optional[dict]:
        """
        Vérifie un token.
        Essaie d'abord avec le secret actuel, puis les précédents.
        """
        # Essayer le secret actuel
        secrets_to_try = [self.current_secret] + self.previous_secrets

        for secret in secrets_to_try:
            try:
                payload = jwt.decode(
                    token,
                    secret,
                    algorithms=[self.algorithm]
                )
                return payload
            except JWTError:
                continue

        return None  # Aucun secret n'a fonctionné


jwt_service = JWTService()
```

#### 3. Procédure de rotation

````markdown
## Procédure de Rotation JWT_SECRET

1. Générer le nouveau secret:
   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(64))"
   ```
````

2. Mettre à jour les variables d'environnement:

   ```bash
   # Déplacer l'actuel vers previous
   JWT_SECRET_PREVIOUS=<ancien_jwt_secret>,<plus_ancien_si_existe>

   # Définir le nouveau
   JWT_SECRET=<nouveau_secret>
   ```

3. Redéployer l'application

4. Attendre l'expiration des anciens tokens (7 jours par défaut)

5. Supprimer les anciens secrets de JWT_SECRET_PREVIOUS

````

---

## Priorité 7 - Alertes Sécurité Temps Réel

### Problème

Les événements de sécurité sont loggés mais pas alertés en temps réel.

### Solution

Implémenter un système d'alertes avec notifications (email, Slack, webhook).

### Implémentation

#### 1. Service d'alertes

**Fichier:** `apps/api/app/core/security/alert_service.py`

```python
"""
Service d'alertes sécurité temps réel.
"""
import os
import httpx
from enum import Enum
from typing import Optional
from datetime import datetime

from app.core.config import settings


class AlertSeverity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class AlertType(str, Enum):
    BRUTE_FORCE = "brute_force"
    RATE_LIMIT = "rate_limit"
    SUSPICIOUS_IP = "suspicious_ip"
    API_KEY_ABUSE = "api_key_abuse"
    CROSS_TENANT_ATTEMPT = "cross_tenant_attempt"
    ADMIN_ACTION = "admin_action"
    MFA_FAILED = "mfa_failed"


class SecurityAlertService:
    """Service d'alertes sécurité."""

    def __init__(self):
        self.slack_webhook = os.getenv("SECURITY_SLACK_WEBHOOK")
        self.alert_email = os.getenv("SECURITY_ALERT_EMAIL")
        self.webhook_url = os.getenv("SECURITY_WEBHOOK_URL")

    async def send_alert(
        self,
        alert_type: AlertType,
        severity: AlertSeverity,
        tenant_id: str,
        message: str,
        details: Optional[dict] = None,
    ):
        """Envoie une alerte sur tous les canaux configurés."""
        alert = {
            "type": alert_type.value,
            "severity": severity.value,
            "tenant_id": tenant_id,
            "message": message,
            "details": details or {},
            "timestamp": datetime.utcnow().isoformat(),
            "environment": settings.ENVIRONMENT,
        }

        # Envoyer en parallèle sur tous les canaux
        import asyncio
        tasks = []

        if self.slack_webhook:
            tasks.append(self._send_slack(alert))

        if self.webhook_url:
            tasks.append(self._send_webhook(alert))

        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)

    async def _send_slack(self, alert: dict):
        """Envoie vers Slack."""
        color = {
            "low": "#36a64f",
            "medium": "#ff9800",
            "high": "#f44336",
            "critical": "#9c27b0",
        }.get(alert["severity"], "#757575")

        payload = {
            "attachments": [{
                "color": color,
                "title": f"🚨 Security Alert: {alert['type']}",
                "text": alert["message"],
                "fields": [
                    {"title": "Severity", "value": alert["severity"], "short": True},
                    {"title": "Tenant", "value": alert["tenant_id"], "short": True},
                    {"title": "Environment", "value": alert["environment"], "short": True},
                ],
                "ts": datetime.utcnow().timestamp(),
            }]
        }

        async with httpx.AsyncClient() as client:
            await client.post(self.slack_webhook, json=payload)

    async def _send_webhook(self, alert: dict):
        """Envoie vers un webhook personnalisé."""
        async with httpx.AsyncClient() as client:
            await client.post(
                self.webhook_url,
                json=alert,
                headers={"Content-Type": "application/json"},
            )


security_alert_service = SecurityAlertService()


# Helpers pour les cas courants
async def alert_brute_force(tenant_id: str, ip: str, attempts: int):
    await security_alert_service.send_alert(
        AlertType.BRUTE_FORCE,
        AlertSeverity.HIGH,
        tenant_id,
        f"Possible brute force attack detected from IP {ip}",
        {"ip": ip, "attempts": attempts},
    )


async def alert_cross_tenant_attempt(tenant_id: str, target_tenant: str, user_id: str):
    await security_alert_service.send_alert(
        AlertType.CROSS_TENANT_ATTEMPT,
        AlertSeverity.CRITICAL,
        tenant_id,
        f"Cross-tenant access attempt detected",
        {"source_tenant": tenant_id, "target_tenant": target_tenant, "user_id": user_id},
    )
````

#### 2. Variables d'environnement

```bash
# .env
SECURITY_SLACK_WEBHOOK=https://hooks.slack.com/services/xxx/yyy/zzz
SECURITY_ALERT_EMAIL=security@company.com
SECURITY_WEBHOOK_URL=https://your-siem.com/webhook
```

---

## Checklist de Validation

### Avant Mise en Production

```
## Rate Limiting
[ ] SlowAPI installé et configuré
[ ] Redis configuré pour le stockage
[ ] Limites définies pour tous les endpoints
[ ] Tests de charge effectués
[ ] Logs de rate limit vérifiés

## Row-Level Security
[ ] Migration RLS exécutée
[ ] Policies créées pour toutes les tables
[ ] Tests cross-tenant effectués
[ ] Performance vérifiée (indexes OK)

## Salt Dynamique
[ ] ENCRYPTION_SALT configuré par environnement
[ ] Migration des données existantes effectuée
[ ] Backup des anciens salts conservé
[ ] Tests de déchiffrement OK

## MFA
[ ] Tables mfa_* créées
[ ] Endpoints /mfa/* fonctionnels
[ ] QR code généré correctement
[ ] Codes de secours fonctionnels
[ ] Flow de login modifié

## IP Whitelisting
[ ] Colonne allowed_ips ajoutée
[ ] Validation CIDR fonctionnelle
[ ] UI de gestion des IPs
[ ] Logs des accès bloqués

## Rotation Secrets
[ ] Support multi-secrets configuré
[ ] Procédure de rotation documentée
[ ] Tests avec anciens tokens

## Alertes
[ ] Webhook Slack configuré
[ ] Alertes critiques testées
[ ] Dashboard de monitoring
```

### Tests de Sécurité

```bash
# Test rate limiting
for i in {1..10}; do curl -X POST https://api.example.com/auth/login; done

# Test RLS
psql -c "SET app.current_tenant_id = 'tenant_a'; SELECT * FROM documents WHERE tenant_id = 'tenant_b';"

# Test MFA
curl -X POST https://api.example.com/auth/login \
  -d '{"email": "user@test.com", "password": "xxx"}'
# Doit retourner requires_mfa: true

# Test IP Whitelist
curl -X GET https://api.example.com/api/v1/documents \
  -H "Authorization: Bearer sk-xxx" \
  --interface eth0  # Depuis une IP non whitelistée
```

---

## Ressources

### Documentation

- [OWASP Top 10](https://owasp.org/Top10/)
- [PostgreSQL Row-Level Security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [SlowAPI Documentation](https://slowapi.readthedocs.io/)
- [PyOTP (TOTP)](https://pyauth.github.io/pyotp/)
- [NIST Digital Identity Guidelines](https://pages.nist.gov/800-63-3/)

### Fichiers du Projet

| Fichier                              | Description                     |
| ------------------------------------ | ------------------------------- |
| `app/core/security/rate_limiter.py`  | Service de rate limiting        |
| `app/core/security/mfa_service.py`   | Service MFA/TOTP                |
| `app/core/security/ip_validator.py`  | Validation IP/CIDR              |
| `app/core/security/alert_service.py` | Alertes temps réel              |
| `app/core/encryption.py`             | Chiffrement avec salt dynamique |
| `app/core/auth/jwt.py`               | JWT avec rotation               |
| `alembic/versions/xxx_add_rls.py`    | Migration RLS                   |
| `alembic/versions/xxx_add_mfa.py`    | Migration MFA                   |

---

## Changelog

| Date       | Version | Changements      |
| ---------- | ------- | ---------------- |
| 2024-12-17 | 1.0     | Document initial |

---

> **Note:** Ce document doit être mis à jour après chaque implémentation. Cocher les items de la checklist au fur et à mesure.
