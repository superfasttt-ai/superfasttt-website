# Authentification Interne SUPERFASTTT

> **📖 Portée :** Ce document décrit l'authentification **INTERNE** de SUPERFASTTT (admin/sessions utilisateurs avec JWT HS256).
>
> **Pour les apps tierces :** Voir [SSO_SUPERFASTTT.md](./SSO_SUPERFASTTT.md) (OAuth2/OIDC Provider)

## Navigation Documentation

| Document                                                               | Description                             |
| ---------------------------------------------------------------------- | --------------------------------------- |
| **[AUTHENTICATION_ARCHITECTURE.md](./AUTHENTICATION_ARCHITECTURE.md)** | 📖 **Vue d'ensemble** - Document maître |
| **[SSO_SUPERFASTTT.md](./SSO_SUPERFASTTT.md)**                         | 🔐 OAuth2 Provider pour apps tierces    |
| **[API_KEYS_SYSTEM.md](./API_KEYS_SYSTEM.md)**                         | 🔑 API Keys machine-to-machine          |
| **[AUTH_TERMINOLOGY.md](./AUTH_TERMINOLOGY.md)**                       | 📚 Glossaire des termes                 |

---

## 📘 Introduction

L'authentification **INTERNE** dans SUPERFASTTT est conçue pour être **multi-tenant, sécurisée et flexible**.

Le système repose sur une architecture backend **FastAPI** robuste avec des **sessions JWT (HS256)**, une **isolation stricte par tenant**, et un support natif pour **email/password, OTP et External SSO (Google/Microsoft)**.

### Deux systèmes d'authentification distincts

SUPERFASTTT utilise **DEUX systèmes JWT différents** :

1. **JWT HS256** (ce document) - **Authentification interne**

   - Usage : Admin SUPERFASTTT, sessions utilisateurs
   - Algorithme : HS256 (secret symétrique)
   - Durée : 7 jours (configurable)
   - Cookie httpOnly

2. **JWT RS256** - **OAuth2 pour apps tierces** → Voir [SSO_SUPERFASTTT.md](./SSO_SUPERFASTTT.md)
   - Usage : Access tokens pour apps externes
   - Algorithme : RS256 (clés asymétriques)
   - Durée : 1 heure + refresh token
   - Vérifiable par apps tierces (JWKS)

**Ces deux systèmes coexistent harmonieusement.**

> ✅ **État d'implémentation (Décembre 2025)** :
>
> - ✅ JWT HS256 interne **implémenté**
> - ✅ OAuth2 Authorization Code Flow **implémenté** (avec HS256)
> - ⏳ OAuth2 RS256 + JWKS **en cours** (voir roadmap)

---

## 🏗️ Architecture Actuelle vs Cible

### Architecture Cible (V1)

```
┌──────────────────────────────────────────────┐
│            ADMIN UI (Next.js)                │
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │         Session Management           │    │
│  │  - Gère login/logout                 │    │
│  │  - Stocke JWT en httpOnly cookie     │    │
│  │  │  - Middleware de protection       │    │
│  └───────────────────┬──────────────────┘    │
│                      │                       │
│  ┌───────────────────▼──────────────────┐    │
│  │     Interface Administrateur         │    │
│  │  - Dashboard, settings, users        │    │
│  │  - Affiche infos session             │    │
│  └──────────────────┬───────────────────┘    │
│                     │                        │
└─────────────────────┼────────────────────────┘
                      │
                      │ HTTP + JWT Cookie
                      │ Header: X-Tenant-ID
                      ▼
┌──────────────────────────────────────────────┐
│           API BACKEND (FastAPI)              │
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │    Tenant Isolation Middleware       │    │
│  │  - Extrait tenant_id                 │    │
│  │  - Valide isolation multi-tenant     │    │
│  └───────────────────┬──────────────────┘    │
│                      │                       │
│  ┌───────────────────▼──────────────────┐    │
│  │   Authentication Middleware (TODO)   │    │
│  │  - Décode et valide JWT              │    │
│  │  - Vérifie user_id, role, tenant     │    │
│  └───────────────────┬──────────────────┘    │
│                      │                       │
│  ┌───────────────────▼──────────────────┐    │
│  │      Auth Services (✅ Implémenté)   │    │
│  │  - OTP génération/validation         │    │
│  │  - Session management                │    │
│  │  - Password policies                 │    │
│  │  - Login monitoring                  │    │
│  │  - SSO providers                     │    │
│  └──────────────────────────────────────┘    │
│                                              │
└───────────────────┬──────────────────────────┘
                    │
                    ▼
            ┌──────────────┐
            │  PostgreSQL  │
            │  - users     │
            │  - sessions  │
            │  - otp_codes │
            │  - auth_*    │
            └──────────────┘
```

### État d'Implémentation

| Composant               | État             | Fichiers                                                                                                                   |
| ----------------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Database Schema**     | ✅ Implémenté    | `apps/api/app/models/user.py`, `auth_settings.py`, `user_session.py`, `otp_code.py`, `login_attempt.py`, `sso_provider.py` |
| **Backend Services**    | ✅ Implémenté    | `apps/api/app/services/{otp,session,password,login_monitoring,sso}_service.py`                                             |
| **Tenant Middleware**   | ✅ Implémenté    | `apps/api/app/core/middleware.py`                                                                                          |
| **JWT Auth Middleware** | ⚠️ À implémenter | -                                                                                                                          |
| **Auth API Routes**     | ⚠️ Partiellement | `apps/api/app/routes/auth.py` (settings only)                                                                              |
| **Login/Register Flow** | ❌ À implémenter | -                                                                                                                          |
| **Admin UI Auth**       | ❌ À implémenter | UI mockup exists in `apps/admin/app/[locale]/settings/authentication/`                                                     |
| **Email Service**       | ❌ À implémenter | Config exists, no sending implementation                                                                                   |

---

## 🗄️ Schéma de Base de Données

### Table `users`

Fichier : `apps/api/app/models/user.py`

```python
class User(BaseModel):
    id: UUID (primary key)
    tenant_id: String(100)  # Isolation multi-tenant
    email: String(255)  # Unique, indexed
    username: String(100)  # Unique, indexed
    full_name: String(255)
    hashed_password: String(255)  # bcrypt
    is_active: Boolean  # Compte actif/désactivé
    is_verified: Boolean  # Email vérifié
    role: Enum(UserRole)  # super_admin, tenant_admin, user, viewer
    last_login_at: DateTime(timezone=True)
    created_at: DateTime(timezone=True)
    updated_at: DateTime(timezone=True)
```

**Rôles disponibles** :

```python
class UserRole(str, enum.Enum):
    SUPER_ADMIN = "super_admin"      # Admin global SUPERFASTTT
    TENANT_ADMIN = "tenant_admin"    # Admin d'une instance
    USER = "user"                    # Utilisateur standard
    VIEWER = "viewer"                # Lecture seule
```

### Table `user_sessions`

Fichier : `apps/api/app/models/user_session.py`

```python
class UserSession(BaseModel):
    id: UUID (primary key)
    user_id: UUID (foreign key → users.id)
    tenant_id: String(100)
    session_token: String(255)  # JWT ou identifiant unique
    ip_address: INET
    user_agent: Text
    expires_at: DateTime(timezone=True)
    last_activity_at: DateTime(timezone=True)
    created_at: DateTime(timezone=True)

    # Relations
    user: User (relationship)
```

**Fonctionnalités** :

- ✅ Gestion de sessions multiples par utilisateur
- ✅ Tracking IP et user agent
- ✅ Expiration configurable
- ✅ Terminaison de session (logout)
- ✅ Limitation du nombre de sessions concurrentes

### Table `auth_settings`

Fichier : `apps/api/app/models/auth_settings.py`

Configuration d'authentification **par tenant** :

```python
class AuthSettings(BaseModel):
    id: UUID (primary key)
    tenant_id: String(100)  # Unique

    # Méthodes d'authentification
    password_enabled: Boolean = True
    otp_email_enabled: Boolean = False
    otp_sms_enabled: Boolean = False
    sso_enabled: Boolean = False

    # Politique de mot de passe
    password_min_length: Integer = 8
    password_require_uppercase: Boolean = True
    password_require_lowercase: Boolean = True
    password_require_numbers: Boolean = True
    password_require_special: Boolean = True
    password_expiry_days: Integer = 90

    # Sessions
    session_timeout_minutes: Integer = 60
    max_concurrent_sessions: Integer = 5
    remember_me_enabled: Boolean = True
    remember_me_duration_days: Integer = 30

    # Sécurité
    mfa_enabled: Boolean = False
    mfa_required_for_admins: Boolean = False
    rate_limit_enabled: Boolean = True
    rate_limit_max_attempts: Integer = 5
    rate_limit_window_minutes: Integer = 15
    account_lockout_enabled: Boolean = True
    account_lockout_duration_minutes: Integer = 30
    captcha_enabled: Boolean = False
    captcha_threshold_attempts: Integer = 3

    # OTP
    otp_length: Integer = 6
    otp_expiry_minutes: Integer = 10
    otp_max_attempts: Integer = 3
    otp_backup_codes_enabled: Boolean = False
```

### Table `otp_codes`

Fichier : `apps/api/app/models/otp_code.py`

```python
class OTPCode(BaseModel):
    id: UUID (primary key)
    user_id: UUID (foreign key → users.id)
    code: String(10)  # Code numérique
    purpose: String(50)  # 'login', 'password_reset', '2fa', 'email_verification'
    attempts: Integer = 0
    max_attempts: Integer = 3
    expires_at: DateTime(timezone=True)
    used_at: DateTime(timezone=True, nullable=True)
    created_at: DateTime(timezone=True)
```

### Table `login_attempts`

Fichier : `apps/api/app/models/login_attempt.py`

Tracking des tentatives de connexion pour sécurité et audit :

```python
class LoginAttempt(BaseModel):
    id: UUID (primary key)
    tenant_id: String(100)
    user_id: UUID (foreign key, nullable)  # NULL si email inconnu
    email: String(255)
    ip_address: INET
    user_agent: Text
    success: Boolean
    failure_reason: String(100)  # 'invalid_password', 'account_locked', 'invalid_email'
    created_at: DateTime(timezone=True)
```

### Table `external_identity_providers` (anciennement `sso_providers`)

> **⚠️ NOTE TERMINOLOGIE :** Cette table sera renommée `external_identity_providers` pour éviter confusion avec SUPERFASTTT agissant comme SSO Provider (voir [SSO_SUPERFASTTT.md](./SSO_SUPERFASTTT.md)).
>
> **Rôle de cette table :** SUPERFASTTT comme **client OAuth2** se connectant À Google/Microsoft pour authentifier les users.

Fichier : `apps/api/app/models/sso_provider.py` (à renommer `external_identity_provider.py`)

Configuration des **External SSO Providers** (Google, Microsoft, OAuth2 custom) :

```python
class SSOProvider(BaseModel):
    id: UUID (primary key)
    tenant_id: String(100)
    provider_type: String(50)  # 'microsoft', 'google', 'oauth2', 'saml'
    provider_name: String(100)  # Nom d'affichage

    # OAuth2 Configuration
    client_id: String(255)
    client_secret_encrypted: Text  # Chiffré avec Fernet
    authorization_url: String(500)
    token_url: String(500)
    user_info_url: String(500)
    scopes: JSONB  # ["openid", "profile", "email"]

    # Mapping utilisateur
    user_id_claim: String(100) = "sub"
    email_claim: String(100) = "email"
    name_claim: String(100) = "name"

    # Options
    is_enabled: Boolean = True
    allow_auto_registration: Boolean = False
    default_role: String(50) = "user"

    created_at: DateTime(timezone=True)
    updated_at: DateTime(timezone=True)
```

---

## 🔧 Services Backend Implémentés

### 1. OTP Service

Fichier : `apps/api/app/services/otp_service.py`

**Fonctions disponibles** :

```python
# Génération de code OTP
generate_code(length: int = 6) -> str
    """Génère un code numérique aléatoire"""

# Création d'un OTP
create_otp(
    db: Session,
    user_id: UUID,
    purpose: str,  # 'login', 'password_reset', '2fa', 'email_verification'
    settings: AuthSettings
) -> OTPCode
    """Crée un OTP avec expiration configurée"""

# Validation d'un OTP
verify_otp(
    db: Session,
    user_id: UUID,
    code: str,
    purpose: str
) -> bool
    """Valide un code OTP et incrémente les tentatives"""

# Invalidation
invalidate_user_otps(db: Session, user_id: UUID, purpose: str) -> int
    """Invalide tous les OTP actifs d'un utilisateur"""

# Nettoyage
cleanup_expired_otps(db: Session) -> int
    """Job de nettoyage des OTP expirés"""
```

**Exemple d'utilisation** :

```python
# Générer et envoyer un OTP pour connexion
otp = create_otp(db, user.id, "login", auth_settings)
# TODO: Envoyer par email avec email_service
send_otp_email(user.email, otp.code)

# Validation
if verify_otp(db, user.id, user_input_code, "login"):
    # Créer session
    create_session(db, user.id, ...)
```

### 2. Session Service

Fichier : `apps/api/app/services/session_service.py`

```python
# Création de session
create_session(
    db: Session,
    user_id: UUID,
    tenant_id: str,
    ip_address: str,
    user_agent: str,
    settings: AuthSettings
) -> UserSession
    """Crée une nouvelle session avec expiration"""

# Récupération de sessions actives
get_active_sessions(db: Session, user_id: UUID) -> List[UserSession]
    """Liste toutes les sessions actives d'un utilisateur"""

# Mise à jour de l'activité
update_activity(db: Session, session_token: str) -> UserSession
    """Met à jour last_activity_at (pour sliding sessions)"""

# Terminaison de session
terminate_session(db: Session, session_token: str) -> bool
    """Logout : termine une session"""

terminate_user_sessions(db: Session, user_id: UUID) -> int
    """Termine toutes les sessions d'un utilisateur (logout global)"""

# Limite de sessions concurrentes
enforce_max_sessions(db: Session, user_id: UUID, max_sessions: int) -> int
    """Supprime les sessions les plus anciennes si dépassement"""

# Nettoyage
cleanup_expired_sessions(db: Session) -> int
    """Job de nettoyage des sessions expirées"""
```

### 3. Password Service

Fichier : `apps/api/app/services/password_service.py`

```python
# Validation selon politique
validate_password(password: str, settings: AuthSettings) -> Tuple[bool, List[str]]
    """
    Retourne (is_valid, errors)
    Vérifie: longueur, majuscules, minuscules, chiffres, caractères spéciaux
    """

# Force du mot de passe
get_password_strength(password: str) -> str
    """Retourne : 'weak', 'medium', 'strong', 'very_strong'"""

# Description de la politique
get_policy_description(settings: AuthSettings) -> str
    """Génère une description lisible des exigences"""
```

**Exemple** :

```python
is_valid, errors = validate_password("MyP@ssw0rd", auth_settings)
if not is_valid:
    raise HTTPException(400, detail=errors)

strength = get_password_strength("MyP@ssw0rd")  # 'strong'
```

### 4. Login Monitoring Service

Fichier : `apps/api/app/services/login_monitoring_service.py`

**Suivi et détection d'anomalies** :

```python
# Enregistrement d'une tentative
log_attempt(
    db: Session,
    tenant_id: str,
    email: str,
    ip_address: str,
    user_agent: str,
    success: bool,
    user_id: UUID = None,
    failure_reason: str = None
) -> LoginAttempt

# Tentatives récentes
get_recent_attempts(
    db: Session,
    tenant_id: str,
    limit: int = 50
) -> List[LoginAttempt]

# Détection brute-force par email
get_failed_attempts_by_email(
    db: Session,
    tenant_id: str,
    email: str,
    minutes: int = 15
) -> int

# Détection brute-force par IP
get_failed_attempts_by_ip(
    db: Session,
    tenant_id: str,
    ip_address: str,
    minutes: int = 15
) -> int

# IPs suspectes
get_suspicious_ips(
    db: Session,
    tenant_id: str,
    threshold: int = 5,
    minutes: int = 15
) -> List[dict]

# Statistiques
get_statistics(
    db: Session,
    tenant_id: str,
    hours: int = 24
) -> dict
    """Retourne : total, success_count, failure_count, success_rate"""
```

### 5. SSO Service

Fichier : `apps/api/app/services/sso_service.py`

```python
# Chiffrement des secrets
encrypt_secret(secret: str) -> str
decrypt_secret(encrypted_secret: str) -> str

# CRUD SSO Providers
create_provider(db: Session, tenant_id: str, data: dict) -> SSOProvider
update_provider(db: Session, provider_id: UUID, data: dict) -> SSOProvider
delete_provider(db: Session, provider_id: UUID) -> bool
get_provider_config(db: Session, provider_id: UUID) -> dict
    """Retourne config déchiffrée pour OAuth flow"""

# Activation/désactivation
toggle_provider(db: Session, provider_id: UUID, enabled: bool) -> SSOProvider

# Liste des providers actifs
get_active_providers(db: Session, tenant_id: str) -> List[SSOProvider]
```

---

## 🔒 Isolation Multi-Tenant

Fichier : `apps/api/app/core/middleware.py`

### Middleware d'Isolation Tenant

**Implémentation** :

```python
class TenantMiddleware:
    """
    Extrait et valide le tenant_id depuis :
    1. Header X-Tenant-ID (priorité)
    2. Sous-domaine (entrepriseA.superfasttt.com)
    3. Query param ?tenant_id=xxx
    4. Path param /tenants/{tenant_id}/...
    """

    async def __call__(self, request: Request, call_next):
        tenant_id = self._extract_tenant_id(request)
        request.state.tenant_id = tenant_id
        response = await call_next(request)
        return response
```

**Dependency Injection** :

```python
# Dans vos routes FastAPI
from app.core.dependencies import get_tenant_id, require_tenant

@router.get("/users")
async def list_users(
    tenant_id: str = Depends(get_tenant_id),  # Optional
    db: Session = Depends(get_db)
):
    return db.query(User).filter(User.tenant_id == tenant_id).all()

@router.post("/auth/login")
async def login(
    credentials: LoginRequest,
    tenant_id: str = Depends(require_tenant),  # Required, raises 400 if missing
    db: Session = Depends(get_db)
):
    # tenant_id garanti présent
    ...
```

---

## 🔑 Configuration JWT

Fichier : `apps/api/app/core/config.py`

```python
class Settings(BaseSettings):
    # JWT
    JWT_SECRET: str  # Clé de signature
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Auth
    AUTH_SECRET: str  # Partagé avec Admin UI pour validation

    # Email (pour OTP)
    SMTP_HOST: str = "mailhog"  # Dev: MailHog
    SMTP_PORT: int = 1025
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    SMTP_FROM: str = "noreply@superfasttt.local"
```

**Variables d'environnement** (`.env`) :

```bash
# JWT
JWT_SECRET=change_me_in_production_use_strong_secret_key_here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Auth
AUTH_SECRET=another_secret_for_session_signing

# Email (développement)
SMTP_HOST=mailhog
SMTP_PORT=1025
SMTP_FROM=noreply@superfasttt.local

# Email (production - exemple SendGrid)
# SMTP_HOST=smtp.sendgrid.net
# SMTP_PORT=587
# SMTP_USER=apikey
# SMTP_PASSWORD=SG.xxxxxxxxxxxxx
# SMTP_FROM=noreply@votredomaine.com
```

---

## 🚀 Routes API Implémentées

Fichier : `apps/api/app/routes/auth.py`

### Routes Actuelles (Partiel)

```python
# Configuration d'authentification
GET    /api/auth/settings              # Récupérer config tenant
PUT    /api/auth/settings              # Modifier config tenant

# Gestion des sessions
GET    /api/auth/sessions              # Lister sessions actives
DELETE /api/auth/sessions/{session_id} # Terminer une session

# SSO
GET    /api/auth/sso/providers         # Liste des providers SSO
POST   /api/auth/sso/providers         # Ajouter provider
PUT    /api/auth/sso/providers/{id}    # Modifier provider
DELETE /api/auth/sso/providers/{id}    # Supprimer provider

# Monitoring
GET    /api/auth/monitoring/attempts         # Logs de tentatives
GET    /api/auth/monitoring/suspicious-ips   # IPs suspectes
GET    /api/auth/monitoring/statistics       # Statistiques globales
```

### Routes À Implémenter

```python
# ❌ Inscription
POST   /api/auth/register
    """
    Crée un utilisateur, génère OTP de vérification email
    Envoie email avec lien/code de validation
    """

# ❌ Vérification email
POST   /api/auth/verify-email
    """
    Valide le code OTP d'email verification
    Active le compte (is_verified = True)
    """

# ❌ Connexion
POST   /api/auth/login
    """
    Valide email/password
    Vérifie rate limiting, account lockout
    Log tentative (LoginAttempt)
    Crée session + JWT
    Retourne access_token et refresh_token
    """

# ❌ Connexion OTP
POST   /api/auth/login/otp/send
    """Envoie un OTP par email pour connexion sans password"""

POST   /api/auth/login/otp/verify
    """Valide l'OTP et crée la session"""

# ❌ Déconnexion
POST   /api/auth/logout
    """Termine la session courante"""

# ❌ Rafraîchissement token
POST   /api/auth/refresh
    """Échange refresh_token contre nouveau access_token"""

# ❌ Réinitialisation mot de passe
POST   /api/auth/password/forgot
    """Génère OTP reset, envoie email avec lien"""

POST   /api/auth/password/reset
    """Valide OTP + nouveau password, update hashed_password"""

# ❌ Changement mot de passe (authentifié)
POST   /api/auth/password/change
    """Vérifie ancien password, update avec nouveau"""

# ❌ OAuth2/SSO
GET    /api/auth/sso/{provider}/authorize
    """Redirige vers authorization_url du provider"""

GET    /api/auth/sso/{provider}/callback
    """
    Callback OAuth2
    Échange authorization code contre token
    Récupère user_info
    Crée ou lie utilisateur
    Crée session
    """
```

---

## 🔐 Middleware JWT (À Implémenter)

### Architecture Cible

```python
# apps/api/app/core/auth.py (À CRÉER)

from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from app.core.config import settings
from app.models.user import User

security = HTTPBearer()

async def get_current_user(
    request: Request,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """
    Dépendance FastAPI pour extraire et valider le JWT.
    Utilisable sur toutes les routes protégées.
    """
    token = credentials.credentials

    try:
        # Décodage JWT
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM]
        )

        user_id: str = payload.get("user_id")
        tenant_id: str = payload.get("tenant_id")

        if user_id is None:
            raise HTTPException(401, "Invalid token payload")

        # Vérification tenant isolation
        request_tenant = request.state.tenant_id
        if request_tenant and tenant_id != request_tenant:
            raise HTTPException(403, "Tenant mismatch")

        # Récupération utilisateur
        user = db.query(User).filter(
            User.id == user_id,
            User.tenant_id == tenant_id
        ).first()

        if not user:
            raise HTTPException(401, "User not found")

        if not user.is_active:
            raise HTTPException(403, "User account disabled")

        return user

    except JWTError:
        raise HTTPException(401, "Invalid or expired token")

# Variantes
async def get_current_admin(
    user: User = Depends(get_current_user)
) -> User:
    """Require admin role"""
    if user.role not in ["tenant_admin", "super_admin"]:
        raise HTTPException(403, "Admin access required")
    return user

async def get_current_super_admin(
    user: User = Depends(get_current_user)
) -> User:
    """Require super_admin role"""
    if user.role != "super_admin":
        raise HTTPException(403, "Super admin access required")
    return user
```

**Utilisation dans les routes** :

```python
from app.core.auth import get_current_user, get_current_admin

@router.get("/users/me")
async def get_profile(
    current_user: User = Depends(get_current_user)
):
    """Route protégée : utilisateur authentifié requis"""
    return current_user

@router.post("/users")
async def create_user(
    data: UserCreate,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Route protégée : admin requis"""
    new_user = User(**data.dict(), tenant_id=current_user.tenant_id)
    db.add(new_user)
    db.commit()
    return new_user
```

---

## 📧 Service Email (À Implémenter)

### Architecture Cible

```python
# apps/api/app/services/email_service.py (À CRÉER)

from app.core.config import settings
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

class EmailService:
    """Service d'envoi d'emails via SMTP"""

    def send_otp_email(self, email: str, code: str, purpose: str):
        """Envoie un email avec code OTP"""
        subject = self._get_subject(purpose)
        body = self._render_template(purpose, {"code": code})
        self._send(email, subject, body)

    def send_password_reset(self, email: str, reset_link: str):
        """Email de réinitialisation mot de passe"""
        subject = "Réinitialiser votre mot de passe"
        body = f"Cliquez ici pour réinitialiser : {reset_link}"
        self._send(email, subject, body)

    def send_welcome(self, email: str, name: str):
        """Email de bienvenue après inscription"""
        ...

    def _send(self, to: str, subject: str, body: str):
        """Envoi SMTP générique"""
        msg = MIMEMultipart()
        msg['From'] = settings.SMTP_FROM
        msg['To'] = to
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'html'))

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            if settings.SMTP_USER:
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(msg)

    def _render_template(self, template_name: str, context: dict) -> str:
        """Charge et rend un template email"""
        # TODO: Utiliser Jinja2 pour templates HTML
        pass
```

### Templates Email (À Créer)

```
apps/api/app/templates/emails/
├── otp_login.html
├── otp_password_reset.html
├── otp_email_verification.html
├── welcome.html
├── password_changed.html
└── suspicious_login.html
```

---

## 🎨 Interface Admin (UI Mockup Existant)

Fichier : `apps/admin/app/[locale]/settings/authentication/`

### Pages Existantes (Frontend Only)

1. **Dashboard** : `/settings/authentication/page.tsx`

   - Vue d'ensemble : méthodes actives, sessions actives, statistiques

2. **Méthodes d'authentification** : `/settings/authentication/methods/page.tsx`

   - Toggle Password, OTP Email, OTP SMS, SSO
   - Configuration par méthode

3. **Politique de mot de passe** : `/settings/authentication/password-policy/page.tsx`

   - Longueur minimale, complexité, expiration
   - Simulation en temps réel

4. **Limite de sessions** : `/settings/authentication/sessions/page.tsx`

   - Timeout, max sessions concurrentes, remember me

5. **Sécurité avancée** : `/settings/authentication/security/page.tsx`

   - MFA, rate limiting, account lockout, CAPTCHA

6. **Fournisseurs SSO** : `/settings/authentication/sso/page.tsx`

   - Liste des providers (Google, Microsoft, custom OAuth2)
   - Configuration OAuth2

7. **Logs d'authentification** : `/settings/authentication/logs/page.tsx`
   - Tentatives de connexion, IPs suspectes, statistiques

**État actuel** : UI complète mais **aucune connexion au backend**. Données mockées.

### Intégration Frontend-Backend (À Faire)

```typescript
// apps/admin/lib/api/auth.ts (À CRÉER)

export async function getAuthSettings(tenantId: string) {
  const res = await fetch(`/api/auth/settings`, {
    headers: { 'X-Tenant-ID': tenantId },
  })
  return res.json()
}

export async function updateAuthSettings(tenantId: string, data: any) {
  const res = await fetch(`/api/auth/settings`, {
    method: 'PUT',
    headers: {
      'X-Tenant-ID': tenantId,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function getLoginAttempts(tenantId: string) {
  const res = await fetch(`/api/auth/monitoring/attempts`, {
    headers: { 'X-Tenant-ID': tenantId },
  })
  return res.json()
}

// Usage dans les pages
const { data: settings } = useSWR(`/api/auth/settings`, () => getAuthSettings(tenantId))
```

---

## 🔄 Flux Complet (Cible V1)

### 1. Inscription (Register Flow)

```
1. Utilisateur → Formulaire inscription (email, password, nom)
2. Frontend → POST /api/auth/register
3. Backend :
   - Valide password selon AuthSettings
   - Hash password (bcrypt)
   - Crée User (is_verified=False)
   - Génère OTP email_verification
   - Envoie email avec code/lien
4. Utilisateur → Reçoit email
5. Utilisateur → Clique lien ou saisit code
6. Frontend → POST /api/auth/verify-email {code}
7. Backend :
   - Valide OTP
   - is_verified = True
   - Optionnel : crée session auto-login
8. Redirect → /dashboard
```

### 2. Connexion Password (Login Flow)

```
1. Utilisateur → Formulaire login (email, password)
2. Frontend → POST /api/auth/login
3. Backend :
   - Vérifie rate limiting (LoginAttempt)
   - Vérifie account lockout
   - Récupère User par email + tenant_id
   - Vérifie password (bcrypt.verify)
   - Si échec : log_attempt(success=False), incrémente compteur
   - Si success :
     - log_attempt(success=True)
     - Crée UserSession
     - Génère JWT avec payload :
       {
         "user_id": "uuid",
         "tenant_id": "entrepriseA",
         "role": "tenant_admin",
         "exp": timestamp
       }
     - Retourne {access_token, refresh_token, user}
4. Frontend :
   - Stocke access_token en httpOnly cookie (ou localStorage pour SPA)
   - Redirect /dashboard
```

### 3. Connexion OTP (Passwordless Flow)

```
1. Utilisateur → Saisit email
2. Frontend → POST /api/auth/login/otp/send
3. Backend :
   - Vérifie rate limiting
   - Génère OTP (6 chiffres)
   - Stocke dans otp_codes (purpose='login')
   - Envoie email avec code
4. Utilisateur → Reçoit email, saisit code
5. Frontend → POST /api/auth/login/otp/verify {email, code}
6. Backend :
   - Valide OTP
   - Crée session
   - Génère JWT
7. Frontend → Stocke token, redirect /dashboard
```

### 4. Réinitialisation Mot de Passe

```
1. Utilisateur → Clique "Mot de passe oublié"
2. Frontend → POST /api/auth/password/forgot {email}
3. Backend :
   - Génère OTP password_reset
   - Envoie email avec lien /reset-password?token=xxx
4. Utilisateur → Clique lien
5. Frontend → Affiche formulaire nouveau password
6. Frontend → POST /api/auth/password/reset {token, new_password}
7. Backend :
   - Valide OTP
   - Valide password selon politique
   - Hash + update hashed_password
   - Invalide tous les OTP de l'user
   - Optionnel : termine toutes les sessions
8. Frontend → Message succès, redirect /login
```

### 5. SSO OAuth2 (Google/Microsoft)

```
1. Utilisateur → Clique "Se connecter avec Google"
2. Frontend → Redirect GET /api/auth/sso/google/authorize
3. Backend :
   - Récupère SSOProvider pour Google
   - Génère state CSRF token
   - Redirect vers authorization_url de Google
4. Google → Authentification utilisateur
5. Google → Callback /api/auth/sso/google/callback?code=xxx&state=yyy
6. Backend :
   - Vérifie state CSRF
   - Échange code contre access_token (Google)
   - Appelle user_info_url pour récupérer profil
   - Extrait email (email_claim)
   - Recherche User existant par email
   - Si pas trouvé ET allow_auto_registration=True :
     - Crée nouveau User (is_verified=True)
   - Crée session
   - Génère JWT
   - Redirect /dashboard avec token
7. Frontend → Stocke token
```

---

## 🛡️ Sécurité et Bonnes Pratiques

### Implémenté

- ✅ **Isolation multi-tenant stricte** (TenantMiddleware)
- ✅ **Password hashing bcrypt** (passlib dans requirements)
- ✅ **Tracking des tentatives de connexion** (LoginAttempt)
- ✅ **Sessions avec expiration** (UserSession.expires_at)
- ✅ **OTP avec limitation de tentatives** (OTPCode.max_attempts)
- ✅ **Chiffrement des secrets SSO** (Fernet)
- ✅ **Configuration sécurité par tenant** (AuthSettings)

### À Implémenter

- ⚠️ **JWT signé et vérifié** (config existe, middleware manquant)
- ⚠️ **Cookies httpOnly + Secure** (frontend manquant)
- ⚠️ **Rate limiting sur /login** (détection implémentée, blocage manquant)
- ⚠️ **Account lockout** (détection implémentée, blocage manquant)
- ⚠️ **CAPTCHA** (config existe, intégration manquante)
- ⚠️ **MFA/2FA** (infrastructure OTP prête, flow manquant)
- ⚠️ **Audit logging vers Grafana/Loki** (LoginAttempt existe, export manquant)
- ⚠️ **Rotation des JWT secrets** (config simple secret, pas multi-secret)

### Recommandations Production

```bash
# Variables d'environnement critiques
JWT_SECRET=<générer avec: openssl rand -hex 32>
AUTH_SECRET=<générer avec: openssl rand -hex 32>

# Politique de mot de passe stricte
password_min_length=12
password_require_uppercase=True
password_require_lowercase=True
password_require_numbers=True
password_require_special=True
password_expiry_days=90

# Rate limiting agressif
rate_limit_enabled=True
rate_limit_max_attempts=3
rate_limit_window_minutes=15
account_lockout_enabled=True
account_lockout_duration_minutes=60

# MFA obligatoire pour admins
mfa_enabled=True
mfa_required_for_admins=True

# Sessions courtes
session_timeout_minutes=30
max_concurrent_sessions=3

# Email production
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=$SENDGRID_API_KEY
SMTP_FROM=noreply@votredomaine.com
```

---

## 📊 Récapitulatif : État d'Implémentation

| Composant                 | Backend                     | Frontend     | Intégration |
| ------------------------- | --------------------------- | ------------ | ----------- |
| **Database Schema**       | ✅ Complet                  | -            | -           |
| **User Model**            | ✅ users table              | -            | -           |
| **Session Management**    | ✅ user_sessions + service  | ❌           | ❌          |
| **OTP Service**           | ✅ otp_codes + service      | ❌           | ❌          |
| **Password Service**      | ✅ validation + strength    | ❌           | ❌          |
| **Login Monitoring**      | ✅ login_attempts + service | ❌           | ❌          |
| **SSO Providers**         | ✅ sso_providers + service  | ✅ UI mockup | ❌          |
| **Auth Settings**         | ✅ auth_settings + service  | ✅ UI mockup | ⚠️ Partiel  |
| **JWT Middleware**        | ❌                          | -            | ❌          |
| **Login/Register Routes** | ❌                          | ❌           | ❌          |
| **Email Service**         | ❌                          | -            | ❌          |
| **Rate Limiting**         | ✅ Détection                | ❌ Blocage   | ❌          |
| **Account Lockout**       | ✅ Détection                | ❌ Blocage   | ❌          |
| **MFA/2FA**               | ✅ Infrastructure           | ❌ Flow      | ❌          |
| **Password Reset**        | ⚠️ OTP service              | ❌           | ❌          |

**Légende** :

- ✅ Implémenté et fonctionnel
- ⚠️ Partiellement implémenté
- ❌ Non implémenté

---

## 🚀 Roadmap d'Implémentation

### Phase 1 : Authentification de Base (Priorité Haute)

1. **Email Service** (1-2j)

   - Créer `apps/api/app/services/email_service.py`
   - Templates HTML pour OTP, reset password, welcome
   - Test avec MailHog (dev)

2. **JWT Middleware** (1j)

   - Créer `apps/api/app/core/auth.py`
   - Dépendances `get_current_user`, `get_current_admin`
   - Tests unitaires

3. **Routes Login/Register** (2-3j)

   - `POST /api/auth/register` + email verification
   - `POST /api/auth/login` + JWT generation
   - `POST /api/auth/logout`
   - `POST /api/auth/refresh`

4. **Password Reset** (1j)

   - `POST /api/auth/password/forgot`
   - `POST /api/auth/password/reset`

5. **Frontend Login/Register** (2-3j)
   - Pages login, register, verify-email
   - Formulaires avec validation
   - Stockage JWT (cookie httpOnly)
   - Middleware de protection de routes

### Phase 2 : Sécurité Avancée (Priorité Moyenne)

6. **Rate Limiting Actif** (1j)

   - Middleware FastAPI
   - Blocage après N tentatives

7. **Account Lockout** (1j)

   - Désactivation temporaire after N failures
   - Email d'alerte

8. **Connexion OTP** (1-2j)

   - `POST /api/auth/login/otp/send`
   - `POST /api/auth/login/otp/verify`
   - Frontend OTP form

9. **Intégration Frontend-Backend Settings** (1j)
   - Connecter UI mockup AuthSettings à l'API
   - SWR/React Query pour cache

### Phase 3 : SSO et MFA (Priorité Basse)

10. **OAuth2 Flow** (3-4j)

    - `GET /api/auth/sso/{provider}/authorize`
    - `GET /api/auth/sso/{provider}/callback`
    - Gestion state CSRF
    - Auto-provisioning utilisateurs

11. **MFA/2FA** (2-3j)

    - Enrollment flow
    - Backup codes generation
    - Validation 2FA à chaque login

12. **CAPTCHA** (1j)
    - Intégration reCAPTCHA v3
    - Activation après threshold

### Phase 4 : Monitoring et Audit (Priorité Basse)

13. **Audit Logging Export** (1-2j)

    - Export LoginAttempt vers Grafana/Loki
    - Dashboards

14. **Alertes Sécurité** (1j)
    - Email admin sur IPs suspectes
    - Webhook pour SIEM

---

## 🔗 Fichiers Importants

| Fichier                                             | Description            |
| --------------------------------------------------- | ---------------------- |
| `apps/api/app/models/user.py`                       | Modèle utilisateur     |
| `apps/api/app/models/user_session.py`               | Modèle session         |
| `apps/api/app/models/otp_code.py`                   | Modèle OTP             |
| `apps/api/app/models/login_attempt.py`              | Tracking tentatives    |
| `apps/api/app/models/auth_settings.py`              | Config auth par tenant |
| `apps/api/app/models/sso_provider.py`               | Config SSO             |
| `apps/api/app/services/otp_service.py`              | Service OTP            |
| `apps/api/app/services/session_service.py`          | Service sessions       |
| `apps/api/app/services/password_service.py`         | Service passwords      |
| `apps/api/app/services/login_monitoring_service.py` | Service monitoring     |
| `apps/api/app/services/sso_service.py`              | Service SSO            |
| `apps/api/app/core/middleware.py`                   | Tenant isolation       |
| `apps/api/app/core/config.py`                       | Configuration JWT/Auth |
| `apps/api/app/routes/auth.py`                       | Routes auth (partiel)  |
| `apps/admin/app/[locale]/settings/authentication/`  | UI Admin (mockup)      |

---

## 💡 En Résumé

### Ce qui existe :

- ✅ **Backend robuste** : modèles, services, isolation tenant
- ✅ **UI Admin complète** : mockups de toutes les pages settings
- ✅ **Infrastructure OTP, sessions, SSO** : prête à l'emploi

### Ce qui manque :

- ❌ **Flux login/register** : routes API + pages frontend
- ❌ **JWT middleware** : validation et protection routes
- ❌ **Email service** : envoi réel d'emails
- ❌ **Intégration frontend-backend** : connecter UI aux APIs

### Prochaine étape critique :

**Implémenter le flux login/register complet** (Phase 1 de la roadmap) pour rendre le système opérationnel.

---

**Documentation maintenue à jour le : 2025-01-15**
**Version : 1.0 - État réel de l'implémentation**
