déploiement automatisé

documentation pour la mise en place d’un déploiement automatique d’instances superfasttt sans passer par le wizard de setup.
objectif : permettre la création d’instances en masse, préconfigurées, sécurisées et immédiatement opérationnelles.

⸻

1. objectif du déploiement automatisé

le déploiement automatisé permet :
• de créer une instance superfasttt sans lancer l’assistant setup
• de préconfigurer la base postgres
• de préconfigurer le storage s3
• de configurer le provider email
• de créer automatiquement le super admin
• d’activer toutes les api dès le premier boot
• d’éviter toute intervention manuelle

ce mode est conçu pour gérer des dizaines, centaines ou milliers d’instances.

⸻

2. principe général

le wizard setup n’est affiché que si l’instance n’est pas configurée.
en injectant les bonnes variables d’environnement, tu peux complètement bypass le setup.

au premier démarrage, le backend détecte :

si SKIP_SETUP=true :
charger configuration postgres
charger configuration storage
charger configuration email
exécuter migrations
créer super admin
marquer setup comme terminé
sinon :
afficher wizard

résultat : l’instance est immédiatement utilisable.

⸻

3. configuration à injecter

toutes les configurations sont injectées via variables d’environnement.

3.1 postgresql

DATABASE_URL=postgresql://user:pass@host:5432/superfasttt?sslmode=require
DATABASE_SCHEMA=tenant_nomclient
DATABASE_SSL=true

pour un déploiement mutualisé via schémas :
• un schéma par client
• un user postgres par client
• une url unique par instance

3.2 stockage s3

STORAGE_PROVIDER=s3
STORAGE_ENDPOINT=https://s3.fr-par.scw.cloud
STORAGE_BUCKET=superfasttt-central
STORAGE_REGION=fr-par
STORAGE_ACCESS_KEY=xxxx
STORAGE_SECRET_KEY=xxxx
STORAGE_SECURE=true

tu peux soit :
• utiliser un bucket dédié par instance
ou
• un seul bucket avec sous-dossiers tenant_xxx

3.3 email

EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=xxxx

ou

EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.exemple.com
SMTP_PORT=587
SMTP_USERNAME=xxxx
SMTP_PASSWORD=xxxx
SMTP_SECURE=starttls
EMAIL_FROM=superfasttt@exemple.com
EMAIL_FROM_NAME=superfasttt

3.4 création automatique du super admin

AUTO_SUPERADMIN_EMAIL=admin@client.fr
AUTO_SUPERADMIN_FIRSTNAME=Alice
AUTO_SUPERADMIN_LASTNAME=Martin
AUTO_SUPERADMIN_PASSWORD=xxxx
AUTO_SUPERADMIN_PHONE=+33xxxxxxx

si cet utilisateur existe déjà :
• vérifier qu’il est super admin
• sinon le promouvoir automatiquement

3.5 bypass du setup

SKIP_SETUP=true

si SKIP_SETUP n’est pas défini → wizard affiché.

⸻

4. logique backend pour le déploiement automatisé

le backend doit exécuter cette logique au démarrage :

si SKIP_SETUP=true :

    1. vérifier connexion postgres
    2. vérifier schéma tenant
    3. exécuter migrations initiales
    4. configurer stockage s3 si vars présentes
    5. configurer provider email si vars présentes
    6. créer super admin automatiquement
    7. enregistrer SETUP_COMPLETED=true
    8. désactiver définitivement /setup

sinon :
mode setup normal

avantages :
• zero interaction
• zero friction
• instance immédiatement disponible
• aucune page setup affichée

⸻

5. provisioning automatisé du tenant

5.1 schéma postgres

créer un schéma unique par instance :

tenant_clientA
tenant_clientB
tenant_clientC

5.2 user postgres associé

pour chaque client :
• créer un user postgres dédié
• lui donner accès uniquement à son schéma

permissions requises :
• usage
• create
• select
• insert
• update
• delete

exemple :

grant usage on schema tenant_clientA to clientA_user;
grant create on schema tenant_clientA to clientA_user;

5.3 injection automatique dans l’instance

DATABASE_URL=postgres://clientA_user:pass@postgres:5432/db
DATABASE_SCHEMA=tenant_clientA

⸻

6. provisioning du stockage

option 1 : un bucket par client

nommage conseillé :

superfasttt-clientA
superfasttt-clientB

option 2 : un bucket global

superfasttt-central

puis un dossier par client :

tenant_clientA/
tenant_clientB/

tu peux provisionner ça via terraform, n8n ou ansible.

⸻

7. exemple de docker compose automatisé

services:
app:
image: superfasttt/app:latest
environment:
DATABASE_URL: ${DATABASE_URL}
DATABASE_SCHEMA: ${DATABASE_SCHEMA}
STORAGE_PROVIDER: s3
STORAGE_ENDPOINT: ${S3_ENDPOINT}
STORAGE_BUCKET: ${S3_BUCKET}
STORAGE_ACCESS_KEY: ${S3_ACCESS_KEY}
STORAGE_SECRET_KEY: ${S3_SECRET_KEY}
AUTO_SUPERADMIN_EMAIL: ${ADMIN_EMAIL}
AUTO_SUPERADMIN_FIRSTNAME: ${ADMIN_FIRST}
AUTO_SUPERADMIN_LASTNAME: ${ADMIN_LAST}
AUTO_SUPERADMIN_PASSWORD: ${ADMIN_PASS}
AUTO_SUPERADMIN_PHONE: ${ADMIN_PHONE}
SKIP_SETUP: true

résultat :
• l’instance démarre déjà configurée
• le super admin existe
• le stockage est fonctionnel
• l’email est prêt
• aucune vue de setup affichée

⸻

8. automatisation complète avec terraform

workflow recommandé : 1. créer schéma dans postgresql managé 2. créer user postgres 3. créer bucket ou dossier s3 4. créer clés iam 5. générer .env client 6. déployer docker compose 7. vérifier avec /health 8. envoyer lien d’accès au client

l’ensemble peut être déclenché via un :
• fichier terraform
• pipeline github
• workflow n8n
• ou api interne superfasttt

⸻

9. automatisation complète avec n8n

exemple d’automatisation : 1. trigger (nouveau client) 2. créer schéma postgres via node postgresql 3. créer user postgres 4. créer bucket s3 ou dossier 5. générer .env 6. copier les fichiers via ssh sur le serveur du client 7. exécuter docker compose up -d 8. polling sur /health 9. envoyer un email au client avec lien de connexion

⸻

10. stratégie de sécurité
    • SEULE la machine de déploiement doit avoir le droit de créer des schémas
    • chaque user postgres client doit avoir scope minimal
    • jamais stocker des mots de passe en clair dans un repo
    • privilégier vault pour les secrets
    • rotation automatique des clés s3
    • limiter les ports exposés sur chaque instance

⸻

11. cas d’erreurs à gérer
    • mauvaise connexion postgres
    • schéma non existant ou déjà utilisé
    • permissions insuffisantes
    • bucket inaccessible
    • clé s3 invalide
    • email provider mal configuré
    • super admin déjà existant mais non super_admin
    • storage folder non créé

chaque erreur doit interrompre le déploiement et remonter un message clair.

⸻

12. résumé

pour déployer automatiquement une instance sans setup, il suffit :
• d’injecter toutes les variables de configuration
• de créer un super admin auto
• d’activer SKIP_SETUP=true
• de lancer l’instance avec docker compose

le backend fait le reste.
