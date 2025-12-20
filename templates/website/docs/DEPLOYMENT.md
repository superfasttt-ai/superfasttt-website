# 🚀 Guide de Déploiement SUPERFASTTT

> Différences entre développement local et production

---

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Mode Développement](#mode-développement)
3. [Mode Production](#mode-production)
4. [Variables d'Environnement](#variables-denvironnement)
5. [Docker Compose](#docker-compose)
6. [Base de Données](#base-de-données)
7. [Stockage S3](#stockage-s3)
8. [Sécurité](#sécurité)
9. [Monitoring](#monitoring)
10. [Checklist Déploiement](#checklist-déploiement)

---

## 🌍 Vue d'ensemble

| Aspect              | Développement              | Production                       |
| ------------------- | -------------------------- | -------------------------------- |
| **Base de données** | PostgreSQL Docker local    | PostgreSQL Managé (Scaleway)     |
| **Stockage S3**     | MinIO Docker local         | Scaleway Object Storage          |
| **Redis**           | Redis Docker local         | Redis Managé (Scaleway)          |
| **LLM Gateway**     | LiteLLM Docker local       | LiteLLM hébergé                  |
| **HTTPS**           | Non (HTTP uniquement)      | Oui (obligatoire)                |
| **JWT Secret**      | Simple (dev_jwt_secret...) | Aléatoire 64+ caractères         |
| **Logs**            | Console Docker             | Loki centralisé                  |
| **Monitoring**      | Optionnel                  | Prometheus + Grafana obligatoire |
| **Backups**         | Manuels                    | Automatiques quotidiens          |

---

## 💻 Mode Développement

### Architecture Locale

```
┌─────────────────────────────────────────┐
│  Ordinateur du Développeur              │
│                                         │
│  ┌──────────┐  ┌──────────┐            │
│  │ Admin UI │  │ Shell UI │            │
│  │ :3003    │  │ :3000    │            │
│  └────┬─────┘  └────┬─────┘            │
│       │             │                   │
│       └─────┬───────┘                   │
│             │                           │
│  ┌──────────▼──────────────────┐       │
│  │    API Backend :8001         │       │
│  │  (Docker Container)          │       │
│  └──────┬──────────────┬────────┘       │
│         │              │                 │
│  ┌──────▼─────┐  ┌────▼───────┐        │
│  │ PostgreSQL │  │   MinIO    │        │
│  │   :5432    │  │   :9000    │        │
│  │  (Docker)  │  │  (Docker)  │        │
│  └────────────┘  └────────────┘        │
│                                         │
│  ┌────────────┐  ┌────────────┐        │
│  │   Redis    │  │  LiteLLM   │        │
│  │   :6380    │  │   :4000    │        │
│  │  (Docker)  │  │  (Docker)  │        │
│  └────────────┘  └────────────┘        │
└─────────────────────────────────────────┘
```

### Fichier `.env` Développement

```bash
# === PostgreSQL (Docker Local) ===
DATABASE_URL=postgresql+asyncpg://superfasttt:superfasttt_dev_password@localhost:5432/superfasttt

# === Redis (Docker Local) ===
REDIS_URL=redis://:superfasttt_dev_password@localhost:6380/0

# === S3 MinIO (Docker Local) ===
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=superfasttt
S3_SECRET_KEY=superfasttt_dev_password
S3_BUCKET=superfasttt-dev

# === JWT (Simple pour dev) ===
JWT_SECRET=dev_jwt_secret_change_me_in_production
ACCESS_TOKEN_EXPIRE_MINUTES=10080  # 7 jours
REFRESH_TOKEN_EXPIRE_DAYS=30

# === LLM ===
OPENAI_API_KEY=sk-proj-VOTRE_CLE_DEV
LITELLM_ENDPOINT=http://localhost:4000
LITELLM_MASTER_KEY=sk-1234

# === SMTP (MailHog local) ===
SMTP_HOST=localhost
SMTP_PORT=1025

# === Monitoring (Désactivé) ===
SENTRY_DSN=
PROMETHEUS_ENABLED=false
```

### Commandes Développement

```bash
# Démarrer la stack Docker complète
docker-compose up -d

# Voir les logs en temps réel
docker-compose logs -f

# Redémarrer un service
docker-compose restart api-superfasttt

# Arrêter tout
docker-compose down

# Supprimer les volumes (⚠️ perte de données)
docker-compose down -v
```

---

## 🏭 Mode Production

### Architecture Production (Scaleway)

```
                     ┌─────────────────┐
                     │   Cloudflare    │
                     │   (DNS + SSL)   │
                     └────────┬────────┘
                              │ HTTPS
                ┌─────────────▼──────────────┐
                │  Load Balancer (Scaleway)  │
                │  tenant1.superfasttt.com   │
                │  tenant2.superfasttt.com   │
                └─────────────┬──────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼────────┐   ┌────────▼────────┐   ┌───────▼────────┐
│  API Instance  │   │  API Instance   │   │  API Instance  │
│   Tenant 1     │   │   Tenant 2      │   │   Tenant 3     │
│  (Scaleway VM) │   │  (Scaleway VM)  │   │  (Scaleway VM) │
└───────┬────────┘   └────────┬────────┘   └───────┬────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼────────┐   ┌────────▼────────┐   ┌───────▼────────┐
│   PostgreSQL   │   │  Object Storage │   │   Redis DB     │
│    Managé      │   │   (S3 Scaleway) │   │    Managé      │
│   (Scaleway)   │   │                 │   │   (Scaleway)   │
└────────────────┘   └─────────────────┘   └────────────────┘
```

### Fichier `.env` Production

```bash
# === PostgreSQL Managé (Scaleway) ===
DATABASE_URL=postgresql+asyncpg://user:password@postgres.scaleway.com:5432/superfasttt_prod

# === Redis Managé (Scaleway) ===
REDIS_URL=redis://:password@redis.scaleway.com:6379/0

# === S3 Scaleway Object Storage ===
S3_ENDPOINT=https://s3.fr-par.scw.cloud
S3_ACCESS_KEY=SCWXXXXXXXXXXXXXXXXX
S3_SECRET_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
S3_BUCKET=superfasttt-prod-tenant1
S3_REGION=fr-par

# === JWT (Sécurisé) ===
# Généré avec: python3 -c "import secrets; print(secrets.token_urlsafe(64))"
JWT_SECRET=XKzP9mN2vB8qL5jR7wY4tF6hG3dS1aC0eU8oI6pM9nV2xW5zQ7rT4jL3kH8fD2sA
ACCESS_TOKEN_EXPIRE_MINUTES=10080  # 7 jours
REFRESH_TOKEN_EXPIRE_DAYS=30

# === LLM (Production) ===
OPENAI_API_KEY=sk-proj-VOTRE_CLE_PRODUCTION
ANTHROPIC_API_KEY=sk-ant-VOTRE_CLE_PRODUCTION
LITELLM_ENDPOINT=https://litellm.superfasttt.com
LITELLM_MASTER_KEY=sk-VOTRE_MASTER_KEY_SECURISEE

# === SMTP (Production - ex: SendGrid) ===
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG.VOTRE_API_KEY
SMTP_FROM=noreply@superfasttt.com

# === Monitoring (Activé) ===
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
PROMETHEUS_ENABLED=true
PROMETHEUS_PORT=9090
GRAFANA_ENABLED=true
LOKI_ENABLED=true

# === Scaleway Spécifique ===
SCALEWAY_ORGANIZATION_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
SCALEWAY_PROJECT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
SCALEWAY_ACCESS_KEY=SCWXXXXXXXXXXXXXXXXX
SCALEWAY_SECRET_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
SCALEWAY_REGION=fr-par
SCALEWAY_ZONE=fr-par-1

# === Security ===
ALLOWED_ORIGINS=https://tenant1.superfasttt.com,https://admin.superfasttt.com
ENVIRONMENT=production
DEBUG=false
LOG_LEVEL=INFO
```

### Docker Compose Production

Créer un fichier `docker-compose.prod.yml` :

```yaml
services:
  api-superfasttt:
    build:
      context: ./apps/api
      dockerfile: Dockerfile
    container_name: superfasttt-api
    command: gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
    ports:
      - '8000:8000'
    env_file:
      - .env.production
    restart: always
    healthcheck:
      test: ['CMD-SHELL', 'curl -f http://localhost:8000/health || exit 1']
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G
        reservations:
          cpus: '1'
          memory: 2G
    logging:
      driver: 'json-file'
      options:
        max-size: '10m'
        max-file: '3'

  # Monitoring
  prometheus:
    image: prom/prometheus:latest
    container_name: superfasttt-prometheus
    volumes:
      - ./tools/monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    ports:
      - '9090:9090'
    restart: always

  grafana:
    image: grafana/grafana:latest
    container_name: superfasttt-grafana
    volumes:
      - grafana_data:/var/lib/grafana
    ports:
      - '3001:3000'
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=CHANGE_ME_IN_PRODUCTION
    restart: always

volumes:
  prometheus_data:
  grafana_data:
```

### Commandes Production

```bash
# Démarrer la stack production
docker-compose -f docker-compose.prod.yml up -d

# Voir l'état des services
docker-compose -f docker-compose.prod.yml ps

# Logs avec limite de lignes
docker-compose -f docker-compose.prod.yml logs --tail=100 -f

# Redémarrage graceful (zero downtime)
docker-compose -f docker-compose.prod.yml up -d --no-deps --build api-superfasttt

# Backup base de données (si PostgreSQL Docker - déconseillé en prod)
docker exec superfasttt-postgres pg_dump -U superfasttt superfasttt > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup avec PostgreSQL managé Scaleway
PGPASSWORD=password pg_dump -h postgres.scaleway.com -U user -d superfasttt_prod > backup.sql
```

---

## 🔐 Variables d'Environnement

### Tableau Comparatif

| Variable             | Développement            | Production                  | Obligatoire |
| -------------------- | ------------------------ | --------------------------- | ----------- |
| `DATABASE_URL`       | localhost:5432           | postgres.scaleway.com       | ✅          |
| `REDIS_URL`          | localhost:6380           | redis.scaleway.com          | ✅          |
| `S3_ENDPOINT`        | http://localhost:9000    | https://s3.fr-par.scw.cloud | ✅          |
| `S3_ACCESS_KEY`      | superfasttt              | SCWXXXXXXXXX                | ✅          |
| `S3_SECRET_KEY`      | superfasttt_dev_password | xxxxx-xxxxx-xxxxx           | ✅          |
| `JWT_SECRET`         | dev_jwt_secret...        | 64+ caractères aléatoires   | ✅          |
| `OPENAI_API_KEY`     | sk-proj-dev              | sk-proj-prod                | ✅          |
| `SENTRY_DSN`         | (vide)                   | https://sentry.io/xxxxx     | Recommandé  |
| `PROMETHEUS_ENABLED` | false                    | true                        | Recommandé  |
| `ALLOWED_ORIGINS`    | \*                       | Liste domaines spécifiques  | ✅          |
| `ENVIRONMENT`        | development              | production                  | ✅          |
| `DEBUG`              | true                     | false                       | ✅          |

### Génération de Secrets Sécurisés

```bash
# JWT Secret (64 caractères)
python3 -c "import secrets; print(secrets.token_urlsafe(64))"

# Password aléatoire (32 caractères)
python3 -c "import secrets; print(secrets.token_urlsafe(32))"

# UUID
python3 -c "import uuid; print(uuid.uuid4())"
```

---

## 🗄️ Base de Données

### Développement (Docker)

```bash
# PostgreSQL 16 avec pgvector
services:
  postgres:
    image: pgvector/pgvector:pg16
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: superfasttt
      POSTGRES_PASSWORD: superfasttt_dev_password
      POSTGRES_DB: superfasttt
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

**Connexion :**

```bash
psql -h localhost -U superfasttt -d superfasttt
```

### Production (Scaleway Managed)

**Avantages :**

- ✅ Backups automatiques quotidiens
- ✅ Haute disponibilité (99.95% SLA)
- ✅ Réplication multi-zone
- ✅ Monitoring intégré
- ✅ Mises à jour sécurisées automatiques
- ✅ Encryption au repos

**Configuration recommandée :**

- **Instance Type** : DB-GP-S (2 vCPU, 4 GB RAM) minimum
- **Storage** : 50 GB SSD (évolutif)
- **Version** : PostgreSQL 16
- **Extensions** : pgvector, uuid-ossp

**Backups :**

```bash
# Backup automatique (quotidien)
# Configuré via console Scaleway

# Backup manuel
pg_dump -h DB_HOST -U DB_USER -d DB_NAME > backup_$(date +%Y%m%d).sql

# Restauration
psql -h DB_HOST -U DB_USER -d DB_NAME < backup_20250115.sql
```

---

## 🗂️ Stockage S3

### Développement (MinIO)

```bash
# MinIO local (compatible S3)
services:
  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    ports:
      - "9000:9000"  # API
      - "9001:9001"  # Console
    environment:
      MINIO_ROOT_USER: superfasttt
      MINIO_ROOT_PASSWORD: superfasttt_dev_password
```

**Accès console :** http://localhost:9001

### Production (Scaleway Object Storage)

**Avantages :**

- ✅ Compatible S3 100%
- ✅ Stockage illimité
- ✅ Prix au GB (0.01€/GB/mois)
- ✅ CDN intégré
- ✅ Versionning
- ✅ Lifecycle rules

**Configuration :**

```python
# Dans apps/api/app/core/storage.py
import boto3

s3_client = boto3.client(
    's3',
    endpoint_url='https://s3.fr-par.scw.cloud',
    aws_access_key_id=os.getenv('S3_ACCESS_KEY'),
    aws_secret_access_key=os.getenv('S3_SECRET_KEY'),
    region_name='fr-par'
)
```

---

## 🔒 Sécurité

### Checklist Production

- [ ] **JWT_SECRET** généré aléatoirement (64+ caractères)
- [ ] **HTTPS** activé avec certificats SSL valides
- [ ] **CORS** configuré avec origines spécifiques (`ALLOWED_ORIGINS`)
- [ ] **Rate Limiting** activé sur l'API
- [ ] **Secrets** stockés dans variables d'environnement (jamais dans le code)
- [ ] **Backups** automatiques activés (DB, S3)
- [ ] **Logs** centralisés et sécurisés
- [ ] **Monitoring** actif (Prometheus, Sentry)
- [ ] **Firewall** configuré (ports 22, 80, 443 uniquement)
- [ ] **SSH Keys** uniquement (pas de password)
- [ ] **Fail2ban** installé contre brute force
- [ ] **Updates** automatiques du système
- [ ] **WAF** activé (Web Application Firewall)

### HTTPS Configuration (Nginx)

```nginx
server {
    listen 443 ssl http2;
    server_name tenant1.superfasttt.com;

    ssl_certificate /etc/letsencrypt/live/tenant1.superfasttt.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tenant1.superfasttt.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 📊 Monitoring

### Prometheus Configuration

```yaml
# tools/monitoring/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'superfasttt-api'
    static_configs:
      - targets: ['api-superfasttt:8000']
    metrics_path: '/metrics'
```

### Grafana Dashboards

Importer les dashboards recommandés :

- **FastAPI Dashboard** : ID 16110
- **PostgreSQL Dashboard** : ID 9628
- **Redis Dashboard** : ID 11835

### Sentry (Erreurs)

```python
# apps/api/main.py
import sentry_sdk

if os.getenv('ENVIRONMENT') == 'production':
    sentry_sdk.init(
        dsn=os.getenv('SENTRY_DSN'),
        traces_sample_rate=0.1,
        environment='production'
    )
```

---

## ✅ Checklist Déploiement

### Avant le Déploiement

- [ ] Tous les tests passent (`pytest`)
- [ ] Migrations DB testées
- [ ] Variables d'environnement production créées
- [ ] Secrets générés et sécurisés
- [ ] Backups configurés
- [ ] Monitoring configuré
- [ ] DNS configurés
- [ ] SSL certificats générés
- [ ] Documentation mise à jour

### Déploiement Initial

```bash
# 1. Cloner le repo sur le serveur
git clone https://github.com/superfasttt-ai/superfasttt-core.git
cd superfasttt-core

# 2. Checkout branche production
git checkout main

# 3. Copier .env.production
cp .env.production .env

# 4. Build et démarrer
docker-compose -f docker-compose.prod.yml up -d --build

# 5. Vérifier les services
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs -f

# 6. Health check
curl https://tenant1.superfasttt.com/health

# 7. Tester l'authentification
curl https://tenant1.superfasttt.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'
```

### Mise à Jour Production

```bash
# 1. Pull derniers changements
git pull origin main

# 2. Rebuild sans downtime
docker-compose -f docker-compose.prod.yml up -d --no-deps --build api-superfasttt

# 3. Appliquer migrations (si nécessaire)
docker exec superfasttt-api alembic upgrade head

# 4. Vérifier
curl https://tenant1.superfasttt.com/health
```

---

## 📞 Support

Pour toute question sur le déploiement :

- 📖 Documentation : [docs/](../docs/)
- 🐛 Issues : GitHub Issues
- 💬 Email : devops@superfasttt.com

---

**Bon déploiement ! 🚀**
