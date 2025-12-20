# Documentation SUPERFASTTT

> Documentation technique complète du projet SUPERFASTTT

---

## 🚀 Démarrage rapide

**Nouveau sur le projet ?** Commencez par :

1. 📖 [Vision du produit](./VISION.md)
2. 🏗️ [Architecture générale](./AUTHENTICATION_ARCHITECTURE.md)
3. ⚙️ [Setup première instance](./SETUP_INSTANCE_FIRST_TIME.md)
4. 🔐 [Guide développeur](./DEVELOPER_GUIDE.md)

---

## 🔐 Authentification & Autorisation

> **⭐ START HERE :** [AUTHENTICATION_ARCHITECTURE.md](./AUTHENTICATION_ARCHITECTURE.md) - Vue d'ensemble complète

### Documents principaux

| Document                                                               | Description                                   | Statut    |
| ---------------------------------------------------------------------- | --------------------------------------------- | --------- |
| **[AUTHENTICATION_ARCHITECTURE.md](./AUTHENTICATION_ARCHITECTURE.md)** | 📖 Vue d'ensemble de tous les systèmes d'auth | ✅ À jour |
| **[AUTH_TERMINOLOGY.md](./AUTH_TERMINOLOGY.md)**                       | 📚 Glossaire OAuth2/OIDC/SSO/JWT              | ✅ À jour |
| **[SSO_IMPLEMENTATION_ROADMAP.md](./SSO_IMPLEMENTATION_ROADMAP.md)**   | 🗓️ Planning implémentation OAuth2 (12 sem)    | ✅ À jour |

### Par système d'authentification

#### 1. JWT Interne (HS256) - Sessions utilisateurs ✅ Implémenté

**Usage :** Connexion admin SUPERFASTTT, sessions web

- **[AUTHENTIFICATION.md](./AUTHENTIFICATION.md)** - Authentification interne complète
  - Email/password login
  - OTP (2FA)
  - External SSO (Google/Microsoft)
  - Sessions JWT HS256
  - Multi-tenant

**Fichiers code :**

- `apps/api/app/core/auth/jwt.py` - Service JWT HS256
- `apps/api/app/routes/auth/login.py` - Endpoints login/refresh
- `apps/api/app/models/user.py` - Model utilisateur

---

#### 2. API Keys - Accès machine-to-machine ✅ Implémenté

**Usage :** Scripts, webhooks, CI/CD, services backend

- **[API_KEYS_SYSTEM.md](./API_KEYS_SYSTEM.md)** - Système complet API Keys

  - Format : `sk_live_xxxxx` / `sk_test_xxxxx`
  - Scopes et permissions
  - Révocation et expiration
  - Audit complet

- **[API_KEYS.md](./API_KEYS.md)** - Guide rapide API Keys

**Fichiers code :**

- `apps/api/app/models/api_key.py` - Model API Key
- `apps/api/app/core/security/auth_service.py` - Auth API Keys

---

#### 3. OAuth2/OIDC Provider (RS256) - Apps tierces SSO 🔨 À implémenter

**Usage :** Single Sign-On pour apps externes (Notebook IA, Assistant, etc.)

- **[SSO_SUPERFASTTT.md](./SSO_SUPERFASTTT.md)** - Architecture OAuth2/OIDC Provider
  - SUPERFASTTT comme Identity Provider
  - Authorization Code Flow
  - PKCE support
  - OIDC discovery
  - Access tokens RS256
  - Refresh tokens opaque

**Roadmap :** [SSO_IMPLEMENTATION_ROADMAP.md](./SSO_IMPLEMENTATION_ROADMAP.md)

**À créer :**

- Tables : `oauth_clients`, `authorization_codes`, `refresh_tokens`, `user_consents`
- Endpoints : `/auth/authorize`, `/auth/token`, `/auth/userinfo`
- Service : `apps/api/app/core/auth/jwt_rs256.py`

---

#### 4. Permissions & Autorisations ✅ Implémenté

**Usage :** Contrôle d'accès granulaire (RBAC)

- **[MODULE_PERMISSIONS.md](./MODULE_PERMISSIONS.md)** - Système RBAC
  - Rôles : SUPER_ADMIN, TENANT_ADMIN, MANAGER, USER, VIEWER
  - Permissions : `{resource}.{action}.{scope}`
  - Middleware protection routes

**Fichiers code :**

- `apps/api/app/core/rbac/permissions.py` - RBAC
- `apps/api/app/core/auth/dependencies.py` - Dépendances FastAPI

---

## 🔌 Intégrations

### OAuth2 Client (SUPERFASTTT → Services externes) ✅ Implémenté

**Usage :** Connexions vers Google Drive, Slack, Notion, etc.

- **[INTEGRATIONS_AUTH.md](./INTEGRATIONS_AUTH.md)** - OAuth2 client pour intégrations
  - SUPERFASTTT comme client OAuth2
  - Connexion vers services externes
  - Gestion tokens intégrations

**Fichiers code :**

- `apps/api/app/services/integrations/` - Services intégrations
- `apps/api/app/models/integration_token.py` - Tokens chiffrés

---

## 🏗️ Architecture & Déploiement

| Document                                             | Description                    |
| ---------------------------------------------------- | ------------------------------ |
| **[ADMIN_ARCHITECTURE.md](./ADMIN_ARCHITECTURE.md)** | Architecture interface admin   |
| **[DEPLOYMENT.md](./DEPLOYMENT.md)**                 | Guide déploiement production   |
| **[APPS_TIERCES_GUIDE.md](./APPS_TIERCES_GUIDE.md)** | Guide développeur apps tierces |

---

## 📚 Guides

| Document                                                           | Description               |
| ------------------------------------------------------------------ | ------------------------- |
| **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)**                     | Guide développeur complet |
| **[SETUP_INSTANCE_FIRST_TIME.md](./SETUP_INSTANCE_FIRST_TIME.md)** | Setup première instance   |
| **[VISION.md](./VISION.md)**                                       | Vision produit            |
| **[MEMOIRE_BY_USER.md](./MEMOIRE_BY_USER.md)**                     | Mémoire utilisateur       |

---

## 🔍 Index par sujet

### Authentification

**Je veux :** Comprendre comment marche l'auth
→ [AUTHENTICATION_ARCHITECTURE.md](./AUTHENTICATION_ARCHITECTURE.md)

**Je veux :** Implémenter login utilisateur
→ [AUTHENTIFICATION.md](./AUTHENTIFICATION.md)

**Je veux :** Créer une app tierce avec SSO
→ [SSO_SUPERFASTTT.md](./SSO_SUPERFASTTT.md)

**Je veux :** Utiliser l'API programmatiquement
→ [API_KEYS_SYSTEM.md](./API_KEYS_SYSTEM.md)

**Je veux :** Comprendre OAuth2 vs OIDC vs SSO
→ [AUTH_TERMINOLOGY.md](./AUTH_TERMINOLOGY.md)

---

### Intégrations

**Je veux :** Connecter SUPERFASTTT à Google Drive
→ [INTEGRATIONS_AUTH.md](./INTEGRATIONS_AUTH.md)

**Je veux :** Créer un nouveau connecteur
→ [INTEGRATIONS.md](./INTEGRATIONS.md)

---

### Permissions

**Je veux :** Comprendre les rôles et permissions
→ [MODULE_PERMISSIONS.md](./MODULE_PERMISSIONS.md)

**Je veux :** Protéger un endpoint API
→ [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md#permissions)

---

### Déploiement

**Je veux :** Déployer en production
→ [DEPLOYMENT.md](./DEPLOYMENT.md)

**Je veux :** Setup ma première instance
→ [SETUP_INSTANCE_FIRST_TIME.md](./SETUP_INSTANCE_FIRST_TIME.md)

---

## 📊 Matrice de décision : Quelle méthode d'authentification utiliser ?

```
L'utilisateur est-il humain ?
│
├─ NON (script, service, webhook)
│   └─> API KEYS
│       📖 Docs : API_KEYS_SYSTEM.md
│
└─ OUI
    │
    ├─ Accède à l'admin SUPERFASTTT ?
    │   └─> JWT INTERNE (HS256)
    │       📖 Docs : AUTHENTIFICATION.md
    │
    ├─ Accède à une app tierce ?
    │   └─> OAuth2 PROVIDER (RS256) 🔨 À implémenter
    │       📖 Docs : SSO_SUPERFASTTT.md
    │       📖 Roadmap : SSO_IMPLEMENTATION_ROADMAP.md
    │
    └─ Entreprise avec Google/Microsoft ?
        └─> EXTERNAL SSO → puis JWT interne ou OAuth2
            📖 Docs : AUTHENTIFICATION.md#sso-providers
```

---

## 🛠️ État d'implémentation global

| Système                      | Backend    | Frontend   | Tests      | Documentation |
| ---------------------------- | ---------- | ---------- | ---------- | ------------- |
| **JWT HS256 Interne**        | ✅ Fait    | ⚠️ Partiel | ✅ Fait    | ✅ À jour     |
| **API Keys**                 | ✅ Fait    | ✅ Fait    | ✅ Fait    | ✅ À jour     |
| **OAuth2 Provider (RS256)**  | ❌ À faire | ❌ À faire | ❌ À faire | ✅ À jour     |
| **External SSO (Google/MS)** | ⚠️ Models  | ❌ À faire | ❌ À faire | ✅ À jour     |
| **RBAC Permissions**         | ✅ Fait    | ✅ Fait    | ✅ Fait    | ✅ À jour     |
| **Intégrations OAuth2**      | ✅ Fait    | ⚠️ Partiel | ⚠️ Partiel | ✅ À jour     |

**Légende :** ✅ Fait | ⚠️ Partiel | ❌ À faire | 🔨 En cours

---

## 📖 Conventions de documentation

### Format des documents

Chaque document technique suit cette structure :

1. **Titre + Navigation** - Liens vers docs connexes
2. **Introduction** - Objectif et portée
3. **Architecture** - Diagrammes et flux
4. **Implémentation** - Code et exemples
5. **Configuration** - Variables et setup
6. **Tests** - Comment tester
7. **Références** - Liens et ressources

### Codes couleur

- 📖 Documentation / Vue d'ensemble
- 🔐 Authentification / Sécurité
- 🔑 API Keys / Accès
- 🔌 Intégrations
- 🏗️ Architecture
- 🗓️ Planning / Roadmap
- 📚 Guides / Tutoriels
- ⚙️ Configuration
- ✅ Implémenté
- 🔨 En cours
- ❌ À faire
- ⚠️ Partiel / Attention

---

## 🤝 Contribution

Pour contribuer à la documentation :

1. **Lire d'abord** la documentation existante
2. **Vérifier** l'état d'implémentation
3. **Suivre** les conventions de format
4. **Mettre à jour** la date de dernière modification
5. **Tester** les exemples de code

**Questions :** Consultez [AUTH_TERMINOLOGY.md](./AUTH_TERMINOLOGY.md) pour le vocabulaire

---

## 📞 Support

**Issues :** GitHub Issues avec label approprié (`documentation`, `authentication`, `bug`, etc.)

**Discussions :** GitHub Discussions pour questions générales

---

**Dernière mise à jour :** 2025-01-22
**Mainteneur :** Équipe SUPERFASTTT Core
