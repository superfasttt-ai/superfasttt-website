# Documentation Développeur – Module Utilisateurs & Permissions

## 🎯 Objectif du Module

Le module **Utilisateurs & Permissions** gère l'ensemble du contrôle d'accès de la plateforme SUPERFASTTT.
Il repose sur un modèle **RBAC hybride** (Role-Based Access Control) combinant :

- Rôles prédéfinis simples pour 95% des cas d'usage
- Permissions personnalisées pour les cas spécifiques
- Un middleware universel pour la vérification d'accès sur les endpoints et extensions

### Évolutions V1.1

La version **V1.1** introduit :

- un système de cache en mémoire pour accélérer la vérification des droits
- une gestion de wildcards plus robuste
- une hiérarchie implicite des permissions
- une meilleure couverture de tests unitaires

L'objectif : fournir une base **solide, lisible et extensible** couvrant 80% des besoins sans complexité inutile, tout en conservant la philosophie : **simplicité, sécurité, évolutivité**.

---

## 🧱 Architecture Générale

```
superfasttt-core/
├── packages/
│   ├── core/
│   │   ├── auth/                  # Gestion sessions et JWT
│   │   ├── permissions/           # Logique RBAC (ce module)
│   │   │   ├── __init__.py
│   │   │   ├── models.py          # Schémas SQLAlchemy / Pydantic
│   │   │   ├── service.py         # Gestion et vérification des droits
│   │   │   ├── middleware.py      # Décorateur @require_permission + vérification d'accès
│   │   │   ├── cache.py           # Gestion cache TTL local (V1.1)
│   │   │   ├── hierarchy.py       # Hiérarchie implicite de permissions (V1.1)
│   │   │   ├── audit.py           # Audit trail des changements
│   │   │   └── tests/
│   │   │       ├── test_roles.py
│   │   │       ├── test_permissions.py
│   │   │       ├── test_middleware.py
│   │   │       └── test_audit.py
│   │   └── database/
│   │       └── migrations/
│   │           └── 2025_11_permissions_v1.sql
└── apps/
    ├── api/                       # Backend FastAPI
    └── web/                       # Interface Admin (Next.js)
```

---

## ⚙️ Schéma de Base de Données

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'manager', 'user', 'viewer')),
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE user_permissions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  permission TEXT NOT NULL,
  granted_by UUID REFERENCES users(id),
  granted_at TIMESTAMP DEFAULT now(),
  expires_at TIMESTAMP,
  reason TEXT,
  conditions JSONB,
  delegated_from UUID REFERENCES users(id),
  UNIQUE(user_id, permission)
);

CREATE TABLE permissions_audit (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  permission TEXT,
  old_value TEXT,
  new_value TEXT,
  performed_by UUID REFERENCES users(id),
  reason TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE teams (
  id UUID PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE user_teams (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT now(),
  PRIMARY KEY (user_id, team_id)
);

CREATE TABLE team_permissions (
  id UUID PRIMARY KEY,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  permission TEXT NOT NULL,
  granted_at TIMESTAMP DEFAULT now()
);
```

**Note :** Les colonnes `expires_at`, `delegated_from` et `conditions` sont présentes mais inactives en V1/V1.1. Elles sont prêtes pour les évolutions futures (V2+).

---

## 🧩 Rôles Prédéfinis (Hardcodés)

| Rôle        | Description                   | Exemples de permissions                                |
| ----------- | ----------------------------- | ------------------------------------------------------ |
| super_admin | Contrôle total sur l'instance | `*.*.*`                                                |
| admin       | Gestion système non critique  | `users.*.*`, `documents.*.*`, `extensions.*.configure` |
| manager     | Gestion de son équipe         | `documents.*.team`, `users.read.team`                  |
| user        | Utilisation standard          | `documents.read.own`, `extensions.*.use`               |
| viewer      | Lecture seule                 | `documents.read.shared`, `extensions.*.read`           |

---

## 🧠 Structure de Permission

Format standard :

```
{resource}.{action}.{scope}
```

**Exemples :**

- `documents.read.own`
- `documents.delete.all`
- `extensions.facturation.use`
- `llm.usage.view.own`

### Wildcards

Le système supporte les wildcards (`*`) pour matcher plusieurs permissions :

- `*.*.*` : toutes les permissions
- `documents.*.own` : toutes les actions sur les documents propres
- `extensions.*.use` : utilisation de toutes les extensions

---

## 🧩 Nouveautés Techniques V1.1

### 1. Gestion des Wildcards Robuste

```python
def has_permission(user_permissions, required: str) -> bool:
    """Vérifie la présence d'une permission, avec gestion complète des wildcards."""
    if "*.*.*" in user_permissions:
        return True
    if required in user_permissions:
        return True

    req_parts = required.split('.')

    for perm in user_permissions:
        parts = perm.split('.')
        if len(parts) != len(req_parts):
            continue

        match = all(p == '*' or p == r for p, r in zip(parts, req_parts))
        if match:
            return True

    return False
```

### 2. Cache TTL en Mémoire

**Fichier : `cache.py`**

```python
from datetime import datetime, timedelta

_permission_cache = {}
_cache_ttl = timedelta(minutes=5)

def get_cache(key: str):
    cached = _permission_cache.get(key)
    if cached and datetime.now() - cached["time"] < _cache_ttl:
        return cached["data"]
    return None

def set_cache(key: str, data):
    _permission_cache[key] = {"data": data, "time": datetime.now()}

def invalidate_cache(key: str):
    _permission_cache.pop(key, None)
```

**Avantages :**

- Réduction des requêtes à la base de données
- TTL de 5 minutes par défaut
- Invalidation manuelle possible pour les mises à jour en temps réel

### 3. Hiérarchie Implicite des Permissions

**Fichier : `hierarchy.py`**

```python
PERMISSION_HIERARCHY = {
    "documents.delete.all": ["documents.write.all", "documents.read.all"],
    "documents.write.all": ["documents.read.all"],
    "extensions.*.configure": ["extensions.*.use"]
}

def expand_permissions(permissions: list) -> set:
    expanded = set(permissions)
    for perm in permissions:
        if perm in PERMISSION_HIERARCHY:
            expanded.update(PERMISSION_HIERARCHY[perm])
    return expanded
```

**Principe :**
Si un utilisateur a `documents.delete.all`, il obtient automatiquement `documents.write.all` et `documents.read.all`.

---

## 🧰 Middleware de Vérification (V1.1)

**Fichier : `superfasttt/core/permissions/middleware.py`**

```python
from functools import wraps
from fastapi import HTTPException, Depends
from superfasttt.core.auth import get_current_user
from superfasttt.core.permissions.cache import get_cache, set_cache, invalidate_cache
from superfasttt.core.permissions.hierarchy import expand_permissions
from superfasttt.core.database import db

ROLE_PERMISSIONS = {
    "super_admin": ["*.*.*"],
    "admin": [
        "users.*.*", "extensions.*.configure", "documents.*.*",
        "settings.read.*", "system.monitoring.read", "llm.*.use", "llm.usage.view.all"
    ],
    "manager": [
        "users.read.team", "users.write.team", "documents.*.team",
        "extensions.*.use", "llm.*.use"
    ],
    "user": [
        "documents.read.own", "documents.write.own",
        "documents.read.shared", "extensions.*.use", "llm.*.use"
    ],
    "viewer": ["documents.read.shared", "extensions.*.read"]
}

async def get_user_permissions(user_id: str, force_refresh=False):
    cache_key = f"perms:{user_id}"
    if not force_refresh:
        cached = get_cache(cache_key)
        if cached:
            return cached

    user = await db.get_user(user_id)
    perms = ROLE_PERMISSIONS.get(user.role, [])

    custom = await db.query(
        "SELECT permission FROM user_permissions WHERE user_id = $1 AND (expires_at IS NULL OR expires_at > now())",
        user_id
    )
    custom_perms = [p["permission"] for p in custom]

    all_permissions = expand_permissions(perms + custom_perms)
    set_cache(cache_key, list(all_permissions))
    return list(all_permissions)

def has_permission(user_permissions, required: str) -> bool:
    if "*.*.*" in user_permissions:
        return True
    if required in user_permissions:
        return True

    req_parts = required.split('.')
    for perm in user_permissions:
        parts = perm.split('.')
        if len(parts) != len(req_parts):
            continue
        match = all(p == '*' or p == r for p, r in zip(parts, req_parts))
        if match:
            return True
    return False

def require_permission(permission: str):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, current_user=Depends(get_current_user), **kwargs):
            user_perms = await get_user_permissions(current_user.id)
            if not has_permission(user_perms, permission):
                raise HTTPException(
                    status_code=403,
                    detail={
                        "error": "Permission denied",
                        "required_permission": permission,
                        "message": f"Vous n'avez pas la permission requise : {permission}"
                    }
                )
            return await func(*args, current_user=current_user, **kwargs)
        return wrapper
    return decorator
```

---

## 🔗 Exemple d'Usage dans une Extension

```python
# extensions/facturation/backend/api.py

from fastapi import APIRouter, Depends
from superfasttt.core.permissions.middleware import require_permission
from superfasttt.core.auth import get_current_user

router = APIRouter(prefix="/extensions/facturation")

@router.post("/invoices")
@require_permission("extensions.facturation.use")
async def create_invoice(data, current_user=Depends(get_current_user)):
    return {"status": "ok", "message": "Facture créée"}
```

---

## 🧾 Audit Trail

Chaque changement de rôle ou permission génère une entrée dans `permissions_audit` :

| Colonne        | Description                          |
| -------------- | ------------------------------------ |
| `user_id`      | Utilisateur concerné                 |
| `action`       | `granted`, `revoked`, `role_changed` |
| `permission`   | Code de permission concerné          |
| `performed_by` | Auteur de la modification            |
| `reason`       | Motif                                |
| `created_at`   | Date du changement                   |

### Exemple de log

```
2025-11-10 14:32  |  Jean Admin
✓ Ajout permission: documents.delete.all
Raison: nettoyage annuel des archives
```

---

## 🧪 Tests Unitaires

**Fichier : `tests/test_permissions.py`**

```python
import pytest
from superfasttt.core.permissions.middleware import has_permission
from superfasttt.core.permissions.hierarchy import expand_permissions

def test_wildcard_resource():
    assert has_permission(["documents.*.own"], "documents.read.own")
    assert has_permission(["documents.*.own"], "documents.write.own")
    assert not has_permission(["documents.*.own"], "documents.read.all")

def test_hierarchy_expansion():
    perms = expand_permissions(["documents.delete.all"])
    assert "documents.write.all" in perms
    assert "documents.read.all" in perms

def test_permission_expiration(db):
    db.query("INSERT INTO user_permissions (user_id, permission, expires_at) VALUES ('u1', 'documents.delete.all', now() - interval '1 day')")
    perms = db.query("SELECT permission FROM user_permissions WHERE expires_at IS NULL OR expires_at > now()")
    assert len(perms) == 0

def test_audit_trail_entry(db):
    db.query("INSERT INTO permissions_audit (user_id, action, permission, performed_by, reason) VALUES ('u1', 'granted', 'documents.delete.all', 'admin1', 'test')")
    logs = db.query("SELECT * FROM permissions_audit WHERE user_id = 'u1'")
    assert logs[0]['action'] == 'granted'
```

### Scénarios de Test Recommandés

| Test                                    | Rôle        | Permission            | Attendu |
| --------------------------------------- | ----------- | --------------------- | ------- |
| Super admin peut tout faire             | super_admin | system.settings.write | ✅      |
| Admin ne peut pas gérer la facturation  | admin       | system.billing.manage | ❌      |
| Manager peut modifier son équipe        | manager     | users.write.team      | ✅      |
| User ne peut pas supprimer de documents | user        | documents.delete.all  | ❌      |
| Viewer peut lire les documents partagés | viewer      | documents.read.shared | ✅      |

---

## 🖥️ Interface Admin (Front)

Fonctionnalités clés :

- Sélection du rôle principal via radio buttons
- Ajout ou retrait de permissions custom
- Historique visible (5 derniers changements)
- Messages d'erreur explicites (`403 Forbidden`)

Composants :

- `UserList.tsx` → table paginée des utilisateurs
- `UserModal.tsx` → rôle + permissions additionnelles
- `AuditTimeline.tsx` → chronologie des modifications

---

## 🧩 Extension Future (V2+)

Champs déjà présents et prêts pour évolution :

- `expires_at` → permissions temporaires
- `delegated_from` → délégation de droits
- `conditions` → permissions conditionnelles (JSONB)
- Tables `teams`, `team_permissions` → groupes métier

Aucune migration destructive à prévoir pour passer en V2.

---

## 🧭 Bonnes Pratiques Développeurs

✅ Toujours utiliser `@require_permission()` sur les endpoints sensibles
✅ Toujours documenter la permission requise dans le code ou l'OpenAPI
✅ Favoriser les rôles plutôt que les permissions individuelles
✅ Ne jamais accorder `*.*.*` hors super_admin
✅ Utiliser le champ `reason` pour chaque modification manuelle
✅ Invalider le cache après modification d'une permission
✅ Tester les wildcards et hiérarchies dans les tests unitaires

---

## 📦 Commandes Utiles (CLI Dev)

```bash
# Appliquer la migration RBAC V1
alembic upgrade head

# Lancer les tests unitaires
pytest packages/core/permissions/tests/

# Rejouer une vérification
python scripts/check_permission.py --user user_123 --perm documents.read.all

# Invalider le cache pour un utilisateur
python scripts/invalidate_cache.py --user user_123
```

---

## 🧩 Points Clés à Retenir

- V1 = simplicité maximale + fondations robustes
- V1.1 = optimisations (cache, hiérarchie, wildcards améliorés)
- 5 rôles natifs couvrent la majorité des cas
- Structure SQL déjà prête pour toutes les évolutions futures
- Sécurité et audit intégrés dès la conception
- Aucun besoin de refonte pour les futures versions V2/V3

---

## 🧭 Versionning

| Version | Date       | Changements majeurs                                               |
| ------- | ---------- | ----------------------------------------------------------------- |
| 1.0     | 2025-11-10 | Version initiale (RBAC de base)                                   |
| 1.1     | 2025-11-11 | Cache TTL, hiérarchie implicite, tests étendus, wildcard amélioré |

---

© 2025 SUPERFASTTT – Module Permissions
