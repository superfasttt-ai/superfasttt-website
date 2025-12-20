# Décision Architecturale : PostgreSQL Managé vs On-Premise

**Date** : 9 novembre 2025
**Statut** : ✅ Acceptée
**Décision** : **Approche Hybride** (Managé par défaut, On-Premise en option)

---

## 🎯 Contexte

SUPERFASTTT est une plateforme **souveraine** où la souveraineté des données est un principe fondamental. La question se pose : **faut-il utiliser PostgreSQL managé (Scaleway) ou PostgreSQL on-premise (Docker) ?**

---

## ⚖️ Analyse Comparative

### Option 1 : PostgreSQL Managé Scaleway (Recommandée)

**Architecture** :

```
Instance Cliente (Scaleway)
└── App SUPERFASTTT (Docker)
    └── Connexion à PostgreSQL Managé Scaleway
        └── Schéma dédié "tenant_xxx"
```

**✅ Avantages** :

- Backups automatiques quotidiens (30 jours rétention)
- Haute disponibilité native (99.9% SLA)
- Point-in-time recovery
- Mises à jour sécurité automatiques
- Monitoring et alertes inclus
- Scaling vertical sans downtime
- Support Scaleway en cas de problème
- **Données hébergées en France** (RGPD compliant)
- Coût prévisible (~15-50€/mois selon taille)

**❌ Inconvénients** :

- Contrôle limité (pas d'accès root)
- Dépendance à Scaleway (vendor lock-in modéré)
- Coût récurrent

**🎯 Usage recommandé** :

- 90% des clients (PME, ETI, startups)
- Clients qui privilégient simplicité + fiabilité

---

### Option 2 : PostgreSQL On-Premise (Docker)

**Architecture** :

```
Instance Cliente
└── Docker Compose
    ├── App SUPERFASTTT
    └── PostgreSQL (conteneur dédié)
```

**✅ Avantages** :

- **Souveraineté totale** (100% contrôle)
- Accès root complet (tuning avancé)
- Pas de coût PostgreSQL séparé (inclus dans compute)
- Possibilité d'hébergement hors cloud (air-gap)
- Aucune dépendance externe

**❌ Inconvénients** :

- **Complexité opérationnelle élevée** :
  - Backups à gérer manuellement
  - Réplication à configurer
  - Monitoring à mettre en place
  - Patches sécurité à appliquer
  - Tuning performance manuel
  - Recovery en cas de crash
- Nécessite compétences DBA
- Risque de perte de données sans backups robustes
- Scaling complexe
- Pas de support PostgreSQL

**🎯 Usage recommandé** :

- 10% des clients (banques, défense, santé, gouvernement)
- Clients avec contraintes réglementaires strictes
- Clients avec équipe DBA dédiée
- Environnements air-gap (déconnectés d'internet)

---

## ✅ Décision : Approche Hybride

### Stratégie Retenue

**2 Formules Commerciales** :

#### 🥇 **Formule Standard** (par défaut - 90% clients)

- PostgreSQL Managé Scaleway
- Backups + HA inclus
- Support infra par Scaleway
- **Prix** : 99€/mois/client
- **Cible** : PME, ETI, startups

#### 🏆 **Formule Souveraine** (option premium - 10% clients)

- PostgreSQL on-premise (Docker)
- Scripts backup automatisés fournis
- Support DBA inclus dans l'abonnement
- Monitoring pré-configuré (Prometheus/Grafana)
- **Prix** : 149€/mois/client (+50€ pour la complexité)
- **Cible** : Banques, défense, santé, gouvernement

---

## 🏗️ Implémentation Technique

### Phase 1 : Développement Local (Actuel)

**Status** : ✅ Déjà configuré dans `docker-compose.yml`

```yaml
services:
  postgres:
    image: pgvector/pgvector:pg16
    # Configuration pour dev local uniquement
```

**Usage** : `make up` → PostgreSQL local pour développer

---

### Phase 2 : Production Formule Standard

**Configuration** : `.env`

```bash
# PostgreSQL Managé Scaleway
DATABASE_URL=postgresql://tenant_abc:xxxxx@postgres-managed.scaleway.com:5432/superfasttt
DATABASE_SCHEMA=tenant_abc
DATABASE_SSL_MODE=require
```

**Provisioning** : Script Terraform

```hcl
resource "scaleway_rdb_instance" "superfasttt" {
  name          = "superfasttt-main"
  node_type     = "db-dev-s"
  engine        = "PostgreSQL-16"
  is_ha_cluster = true
  volume_size   = 50
  backup_schedule = "0 3 * * *"  # 3h du matin
}
```

**Schémas** : Créés automatiquement par script provisioning

```sql
-- Script provisioning tenant
CREATE SCHEMA IF NOT EXISTS tenant_abc;
CREATE USER tenant_abc WITH PASSWORD 'xxx';
GRANT ALL PRIVILEGES ON SCHEMA tenant_abc TO tenant_abc;
ALTER USER tenant_abc SET search_path TO tenant_abc;
```

---

### Phase 3 : Production Formule Souveraine

**Configuration** : `docker-compose.prod.yml`

```yaml
services:
  postgres:
    image: pgvector/pgvector:pg16
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    environment:
      - POSTGRES_DB=superfasttt
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    # Backup automatique avec pg_dump
    deploy:
      restart_policy:
        condition: always

  postgres-backup:
    image: prodrigestivill/postgres-backup-local
    depends_on:
      - postgres
    volumes:
      - ./backups:/backups
    environment:
      - POSTGRES_HOST=postgres
      - POSTGRES_DB=superfasttt
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - SCHEDULE=@daily
      - BACKUP_KEEP_DAYS=30
```

**Scripts fournis** :

- `scripts/backup-postgres.sh` - Backup manuel
- `scripts/restore-postgres.sh` - Restore from backup
- `scripts/setup-replication.sh` - HA setup (optionnel)

---

## 📊 Matrice de Décision Client

| Critère Client                 | Formule Standard | Formule Souveraine |
| ------------------------------ | ---------------- | ------------------ |
| Budget < 200€/mois             | ✅ Recommandé    | ❌                 |
| Pas d'équipe DBA               | ✅ Obligatoire   | ❌                 |
| Secteur régulé (banque, santé) | 🟡 Possible      | ✅ Recommandé      |
| Contrainte air-gap             | ❌               | ✅ Obligatoire     |
| Volume données < 100GB         | ✅ Optimal       | 🟡 Possible        |
| Besoin HA critique             | ✅ Natif         | 🔴 À configurer    |
| RGPD France/EU                 | ✅ Compliant     | ✅ Compliant       |

---

## 🔄 Migration Entre Formules

### Standard → Souveraine

**Scénario** : Client commence en Standard, puis veut 100% on-premise

**Process** :

1. Provisionner nouvelle instance avec PostgreSQL Docker
2. Exporter schéma Scaleway : `pg_dump`
3. Importer dans PostgreSQL on-premise : `pg_restore`
4. Changer `DATABASE_URL` dans `.env`
5. Redémarrer app
6. Supprimer schéma Scaleway

**Downtime** : ~30 min (maintenance planifiée)

---

### Souveraine → Standard

**Scénario** : Client veut simplifier et déléguer backups

**Process** :

1. Créer schéma dans PostgreSQL Managé
2. Exporter PostgreSQL on-premise : `pg_dump`
3. Importer dans Scaleway : `pg_restore`
4. Changer `DATABASE_URL`
5. Redémarrer app
6. Désactiver conteneur PostgreSQL local

**Downtime** : ~30 min

---

## 🎯 Recommandation Finale

### Pour le MVP et Lancement Initial

**✅ Commencer avec PostgreSQL Managé Scaleway** :

**Raisons** :

1. **Time to Market** : Focus sur features, pas sur ops
2. **Fiabilité** : Backups pro dès J1
3. **Scalabilité** : Croissance sans friction
4. **Coût** : Optimisé pour démarrage
5. **Support** : Scaleway gère l'infra DB

### Pour la Commercialisation

**✅ Proposer 2 Formules** :

- **Standard (99€)** : Argument simplicité + fiabilité
- **Souveraine (149€)** : Argument contrôle 100% + clients régulés

### Argumentaire Commercial

**Formule Standard** :

> "Vos données sont hébergées en France sur infrastructure Scaleway certifiée, avec backups automatiques quotidiens et haute disponibilité native. Vous vous concentrez sur votre métier, nous gérons l'infrastructure."

**Formule Souveraine** :

> "PostgreSQL déployé dans votre propre infrastructure, contrôle root complet, scripts backup professionnels fournis, support DBA inclus. Souveraineté maximale pour secteurs régulés."

---

## 📚 Ressources

- [Documentation PostgreSQL Scaleway](https://www.scaleway.com/en/database/)
- [Guide Backup PostgreSQL](https://www.postgresql.org/docs/current/backup.html)
- [RGPD et Hébergement France](https://www.cnil.fr/fr/reglement-europeen-protection-donnees)

---

**Décision validée par** : Équipe Technique SUPERFASTTT
**Date** : 9 novembre 2025
**Prochaine révision** : Après MVP (6 mois)
