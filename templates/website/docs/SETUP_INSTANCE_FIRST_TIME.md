setup instance

assistant d’installation superfasttt
document de référence pour les maquettes, écrans react et logique backend

⸻

0. welcome

Écran d’introduction affiché uniquement si l’instance n’a pas encore été initialisée.

contenu :
• logo superfasttt
• texte : « bienvenue dans l’assistant d’installation de votre instance superfasttt »
• bouton commencer

comportement :
• aucune authentification requise
• redirection automatique vers étape 1

⸻

1. choix du type de base de données postgresql

Objectif : déterminer l’origine de la base pour adapter la configuration.

trois options visuelles (cartes) :

option 1 : postgres local à l’instance
• le conteneur postgres natif de la stack docker est utilisé
• connexion sur localhost:5432
• ssl désactivé

option 2 : postgres managé scaleway
• connexion à une base dbaaS scaleway
• ssl obligatoire

option 3 : postgres privé
• base interne de l’entreprise ou cloud privé
• configuration complète nécessaire

actions :
• choisir une option → passe à l’étape 2

⸻

2. configuration de postgresql (selon l’option choisie)

option 1 : postgres local

champs :
• mot de passe super utilisateur postgres
• nom de la base (default : superfasttt)
• schéma tenant (default : public)

infos pré remplies :
• host = localhost
• port = 5432
• ssl = désactivé

actions :
• bouton tester la connexion
• bouton continuer (uniquement si test ok)

⸻

option 2 : postgres managé scaleway

champs :
• host
• port
• database
• username
• password
• ssl = obligatoire et non modifiable

actions :
• tester la connexion
• continuer (si test ok)

messages d’aide :
• penser à autoriser l’ip de l’instance dans scaleway
• pgvector doit être activé dans scaleway

⸻

option 3 : postgres privé

champs :
• host
• port
• ssl (oui/non)
• database
• username
• password
• schéma tenant
• options avancées (expandable) :
• pool min
• pool max
• statement timeout
• ssl root cert (upload)

actions :
• tester la connexion
• continuer (si test ok)

⸻

3. test de connexion postgresql

Lorsque l’utilisateur clique sur tester, effectuer :
• test connexion tcp
• test authentification
• test version postgresql >= 14
• test présence extension pgvector
• test droits : create schema, create table
• tentative création schéma temporaire tenant_test
• insertion puis lecture simple
• suppression schéma test

afficher résultat :
• succès → autoriser bouton continuer
• erreur → afficher message clair (host unreachable, auth failed, pgvector absent, permissions insuffisantes)

si tout est ok :
• création réelle du schéma tenant
• exécution des migrations initiales
• flag interne : DATABASE_CONFIGURED=true

⸻

4. création du super administrateur

Écran affiché uniquement une fois la base configurée.

champs obligatoires :
• prénom
• nom
• email professionnel
• numéro mobile
• mot de passe
• confirmation mot de passe

règles :
• email unique
• mobile format international
• mot de passe ≥ 8 caractères
• aucune vérification email (emails pas encore configurés)
• aucune otp

actions :
• bouton créer mon compte

comportement backend :
• création super_admin
• hash du mot de passe
• création session et login automatique
• enregistrement flag SETUP_SUPERADMIN_CREATED=true

en cas d’erreur :
• email déjà existant
• base inaccessible (rare si étapes précédentes OK)
• format mobile invalide
• mot de passe trop faible

⸻

5. configuration optionnelle du stockage s3

Objectif : permettre un fonctionnement complet (uploads, documents, bases de connaissance).

champs :
• fournisseur : scaleway / amazon s3 / ovh / minio / générique
• endpoint
• région
• access key
• secret key
• bucket
• sous dossier (optionnel)
• ssl oui/non
• mode public/privé

actions :
• tester la connexion (upload test.txt → list → delete)
• sauvegarder
• ignorer (passer à l’étape suivante)

erreurs courantes :
• permission denied
• bucket non trouvé
• credentials invalides
• endpoint inaccessible
• region mismatch

⸻

6. configuration optionnelle du système email

Utile pour otp, invitations, notifications.

deux modes :

smtp

champs :
• host
• port
• secure (tls / starttls)
• username
• password
• email expéditeur
• nom expéditeur

action :
• envoyer email test

⸻

sendgrid api

champs :
• clé api
• template id otp
• template id invitation

action :
• envoyer email test

⸻

mailgun / ses / générique

champs variables selon provider :
• clé api
• domaine
• url api
• région
• from email
• from name

action :
• envoyer email test

messages d’erreur possibles :
• auth failed
• quota exceeded
• port bloqué
• ip non autorisée

actions :
• sauvegarder
• ignorer et continuer

⸻

7. finalisation du setup

Écran de fin.

contenu :
• « votre instance est maintenant opérationnelle »
• « vous êtes connecté en tant que super administrateur »
• rappel : vous pourrez configurer stockage et email plus tard dans l’admin

bouton :
• accéder à l’admin

comportement backend :
• écriture flag final : SETUP_COMPLETED=true
• blocage définitif de /setup
• l’instance passe en mode normal

⸻

comportements backend obligatoires

mode setup
• accessible uniquement si SETUP_COMPLETED absent
• api normales désactivées
• auth désactivée sauf création du super admin
• middleware redirige tout vers /setup

sortie du mode setup
• /setup devient inaccessible
• activer authentification normale
• activer otp si email est configuré
• activer stockage s3 si configuré
• activer toutes les api tenant

⸻

edge cases à gérer
• postgres local non démarré → message explicite
• pgvector absent dans postgres privé → setup impossible
• permissions insuffisantes → “l’utilisateur n’a pas le droit create schema”
• email déjà existant → proposer conversion en super admin
• erreur réseau s3 → afficher endpoint exact testé
• smtp port bloqué → conseiller port alternatif

⸻
