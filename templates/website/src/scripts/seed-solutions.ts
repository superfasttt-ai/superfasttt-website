/**
 * Script pour créer les 6 pages Solutions du menu header
 * Usage: pnpm tsx src/scripts/seed-solutions.ts
 */

import 'dotenv/config'

import type { RequiredDataFromCollectionSlug } from 'payload'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

interface SolutionPage {
  slug: string
  title: string
  badge: string
  heroTitle: string
  heroHighlight: string
  heroDescription: string
  metaTitle: string
  metaDescription: string
  problemBadge: string
  problemTitle: string
  problemDescription: string
  problems: Array<{ icon: string; title: string; description: string }>
  solutionBadge: string
  solutionTitle: string
  solutionDescription: string
  solutions: Array<{ icon: string; title: string; description: string }>
  useCases: Array<{
    title: string
    description: string
    icon: string
    features: string[]
  }>
  stats: Array<{ value: string; label: string; description: string }>
  faq: Array<{ question: string; answer: string }>
}

const SOLUTIONS: SolutionPage[] = [
  {
    slug: 'solutions/sante',
    title: 'Santé & Médical',
    badge: 'Santé',
    heroTitle: 'IA souveraine',
    heroHighlight: 'pour le secteur de la santé',
    heroDescription:
      "Déployez l'intelligence artificielle dans votre établissement de santé avec une architecture HDS-ready. Données patients protégées, conformité RGPD native, et traçabilité complète pour les audits.",
    metaTitle: 'IA Souveraine pour la Santé | SUPERFASTTT',
    metaDescription:
      'Plateforme IA conforme HDS pour les établissements de santé. Protection des données patients, conformité RGPD, hébergement souverain France/Europe.',
    problemBadge: 'Enjeux Santé',
    problemTitle: "L'IA dans la santé : des défis uniques",
    problemDescription:
      "Le secteur médical fait face à des contraintes réglementaires strictes qui freinent l'adoption de l'IA.",
    problems: [
      {
        icon: 'shield',
        title: 'Données patients sensibles',
        description:
          "Chaque dossier médical contient des informations hautement confidentielles. Comment garantir qu'aucune donnée patient ne quitte votre périmètre de confiance ?",
      },
      {
        icon: 'lock',
        title: 'Conformité HDS obligatoire',
        description:
          "L'Hébergement de Données de Santé impose des exigences techniques strictes. Votre solution IA actuelle est-elle certifiée ?",
      },
      {
        icon: 'chart',
        title: 'Traçabilité pour les audits',
        description:
          'ARS, CNIL, certification HAS : vous devez prouver exactement qui a accédé à quelles données et pour quel usage.',
      },
    ],
    solutionBadge: 'Notre réponse',
    solutionTitle: 'Une plateforme IA conçue pour la santé',
    solutionDescription:
      'SUPERFASTTT répond aux exigences les plus strictes du secteur médical avec une architecture pensée dès le départ pour la conformité.',
    solutions: [
      {
        icon: 'database',
        title: 'Architecture HDS-ready',
        description:
          'Infrastructure compatible avec les exigences HDS. Isolation des données patients. Chiffrement bout en bout.',
      },
      {
        icon: 'shield',
        title: 'Hébergement souverain',
        description:
          "Données hébergées exclusivement en France sur des datacenters certifiés. Aucun transfert hors de l'Union Européenne.",
      },
      {
        icon: 'chart',
        title: 'Audit trail complet',
        description:
          'Chaque requête tracée avec horodatage, utilisateur, et données accédées. Journaux conservés selon les durées réglementaires.',
      },
    ],
    useCases: [
      {
        title: 'Aide au diagnostic médical',
        description:
          "Assistez vos praticiens avec une IA qui accède à la littérature médicale et aux protocoles de l'établissement.",
        icon: 'brain',
        features: [
          'Recherche dans la documentation médicale',
          'Synthèse des antécédents patient',
          "Suggestions basées sur l'EBM",
        ],
      },
      {
        title: 'Codage et facturation',
        description:
          "Automatisez le codage des actes et optimisez la facturation tout en restant conforme aux règles de l'Assurance Maladie.",
        icon: 'chart',
        features: [
          'Suggestion de codes CCAM/NGAP',
          'Détection des erreurs de codage',
          'Optimisation du recouvrement',
        ],
      },
      {
        title: 'Accueil et orientation',
        description:
          'Chatbot intelligent pour orienter les patients vers le bon service et répondre aux questions fréquentes.',
        icon: 'users',
        features: ['Disponible 24h/24', 'Multilingue', 'Escalade vers un humain si nécessaire'],
      },
    ],
    stats: [
      {
        value: 'HDS',
        label: 'Compatible',
        description: "Architecture prête pour l'hébergement de données de santé",
      },
      {
        value: '100%',
        label: 'France',
        description: 'Données hébergées exclusivement sur le territoire français',
      },
      {
        value: '0',
        label: 'Transfert hors UE',
        description: 'Aucune donnée patient ne quitte le périmètre européen',
      },
      {
        value: '7 ans',
        label: 'Conservation',
        description: "Journaux d'audit conservés selon les obligations légales",
      },
    ],
    faq: [
      {
        question: 'SUPERFASTTT est-il certifié HDS ?',
        answer:
          "SUPERFASTTT propose une architecture compatible HDS. Pour les établissements nécessitant une certification formelle, nous travaillons avec des hébergeurs certifiés HDS partenaires. Notre infrastructure est conçue dès l'origine pour répondre aux 6 activités du référentiel HDS.",
      },
      {
        question: 'Comment garantissez-vous la confidentialité des données patients ?',
        answer:
          "Plusieurs niveaux de protection : chiffrement des données au repos et en transit, isolation stricte entre établissements, authentification forte SSO, droits d'accès granulaires par service/profil. Aucune donnée n'est utilisée pour entraîner les modèles IA.",
      },
      {
        question: "L'IA peut-elle accéder aux dossiers patients ?",
        answer:
          'Uniquement si vous le configurez explicitement. Vous définissez précisément quels assistants accèdent à quelles sources de données, avec quels droits. Chaque accès est tracé et auditable.',
      },
      {
        question: 'Comment fonctionne la traçabilité ?',
        answer:
          "Chaque requête génère une entrée dans le journal d'audit : date/heure, utilisateur, assistant utilisé, sources consultées, réponse générée. Ces logs sont conservés selon vos obligations réglementaires et exportables pour les audits.",
      },
    ],
  },
  {
    slug: 'solutions/finance',
    title: 'Finance & Banque',
    badge: 'Finance',
    heroTitle: 'IA conforme',
    heroHighlight: 'pour les services financiers',
    heroDescription:
      "Déployez l'intelligence artificielle dans votre institution financière avec une gouvernance ACPR-ready. Traçabilité des décisions, audit trail complet, et séparation des environnements.",
    metaTitle: 'IA Souveraine pour la Finance | SUPERFASTTT',
    metaDescription:
      'Plateforme IA conforme aux exigences bancaires et assurantielles. Gouvernance ACPR, traçabilité complète, hébergement souverain.',
    problemBadge: 'Enjeux Finance',
    problemTitle: "L'IA dans la finance : conformité et contrôle",
    problemDescription:
      "Les institutions financières font face à des exigences réglementaires strictes qui compliquent l'adoption de l'IA.",
    problems: [
      {
        icon: 'shield',
        title: 'Exigences réglementaires',
        description:
          "ACPR, AMF, Bâle III : les régulateurs exigent une traçabilité complète des décisions assistées par l'IA. Comment prouver la conformité ?",
      },
      {
        icon: 'lock',
        title: 'Secret bancaire',
        description:
          'Les données clients sont hautement confidentielles. Impossible de les envoyer à des services cloud non maîtrisés.',
      },
      {
        icon: 'chart',
        title: "Explicabilité de l'IA",
        description:
          "En cas de refus de crédit ou de décision impactante, vous devez pouvoir expliquer le raisonnement de l'IA.",
      },
    ],
    solutionBadge: 'Notre réponse',
    solutionTitle: 'Une plateforme IA pensée pour la finance',
    solutionDescription:
      'SUPERFASTTT répond aux exigences des régulateurs financiers avec une architecture de gouvernance native.',
    solutions: [
      {
        icon: 'chart',
        title: 'Audit trail complet',
        description:
          'Chaque décision IA tracée de bout en bout. Journaux conservés selon les durées ACPR. Export pour les contrôles.',
      },
      {
        icon: 'shield',
        title: 'Séparation des environnements',
        description:
          'Isolation stricte entre entités, entre activités réglementées et non réglementées. Contrôles RBAC granulaires.',
      },
      {
        icon: 'lock',
        title: 'Hébergement souverain',
        description:
          'Données hébergées en France, sans transfert hors UE. Compatible avec les exigences de localisation des données.',
      },
    ],
    useCases: [
      {
        title: 'Analyse de documents',
        description:
          'Accélérez le traitement des dossiers clients : contrats, justificatifs, états financiers.',
        icon: 'database',
        features: [
          'Extraction automatique des données',
          'Vérification de cohérence',
          "Détection d'anomalies",
        ],
      },
      {
        title: 'Assistant conformité',
        description:
          'Aidez vos équipes conformité à naviguer dans la réglementation et à répondre aux sollicitations.',
        icon: 'shield',
        features: [
          'Recherche dans les textes réglementaires',
          'Veille automatisée',
          'Génération de rapports',
        ],
      },
      {
        title: 'Support client augmenté',
        description:
          'Assistez vos conseillers avec des réponses contextuelles basées sur le dossier client.',
        icon: 'users',
        features: [
          'Historique client unifié',
          'Suggestions de produits adaptés',
          'Réponses aux questions fréquentes',
        ],
      },
    ],
    stats: [
      {
        value: 'ACPR',
        label: 'Ready',
        description: 'Architecture conforme aux exigences du régulateur bancaire français',
      },
      {
        value: '100%',
        label: 'Traçable',
        description: 'Chaque décision IA documentée et auditable',
      },
      {
        value: 'RGPD',
        label: 'Conforme',
        description: 'Hébergement France/Europe, pas de transfert hors UE',
      },
      {
        value: 'ISO 27001',
        label: 'Aligné',
        description: 'Pratiques de sécurité conformes aux standards internationaux',
      },
    ],
    faq: [
      {
        question: 'Comment SUPERFASTTT aide-t-il à la conformité ACPR ?',
        answer:
          "Notre plateforme intègre nativement les exigences de traçabilité de l'ACPR : journal d'audit complet, conservation des traces sur la durée légale, export pour les contrôles, séparation des environnements réglementés.",
      },
      {
        question: "Les données clients sont-elles utilisées pour entraîner l'IA ?",
        answer:
          "Non. Vos données clients ne sont jamais utilisées pour l'entraînement des modèles. Elles restent strictement dans votre périmètre et ne sont accessibles qu'aux utilisateurs autorisés.",
      },
      {
        question: 'Comment gérez-vous le secret bancaire ?',
        answer:
          "Isolation totale entre institutions, chiffrement des données au repos et en transit, authentification forte, droits d'accès granulaires. Aucune donnée n'est partagée entre clients.",
      },
      {
        question: "L'IA peut-elle prendre des décisions de crédit ?",
        answer:
          "L'IA de SUPERFASTTT est conçue comme un outil d'aide à la décision, pas comme un décideur autonome. Elle fournit des analyses et suggestions que vos équipes valident. Chaque interaction est tracée pour l'explicabilité.",
      },
    ],
  },
  {
    slug: 'solutions/industrie',
    title: 'Industrie & Manufacturing',
    badge: 'Industrie',
    heroTitle: 'IA opérationnelle',
    heroHighlight: "pour l'industrie",
    heroDescription:
      "Déployez l'intelligence artificielle sur vos sites de production. Documentation technique accessible, maintenance prédictive, et capitalisation du savoir-faire industriel.",
    metaTitle: "IA Souveraine pour l'Industrie | SUPERFASTTT",
    metaDescription:
      "Plateforme IA pour l'industrie et le manufacturing. Documentation technique intelligente, maintenance assistée, capitalisation des connaissances.",
    problemBadge: 'Enjeux Industrie',
    problemTitle: "L'IA dans l'industrie : productivité et expertise",
    problemDescription:
      "L'industrie fait face à des défis uniques : documentation dispersée, perte de savoir-faire, et pression sur les coûts.",
    problems: [
      {
        icon: 'database',
        title: 'Documentation dispersée',
        description:
          "Manuels techniques, procédures qualité, fiches de sécurité : l'information est éparpillée et difficile à trouver rapidement.",
      },
      {
        icon: 'users',
        title: 'Perte du savoir-faire',
        description:
          "Les experts partent à la retraite, les compétences se perdent. Comment capitaliser l'expertise accumulée pendant des décennies ?",
      },
      {
        icon: 'zap',
        title: 'Temps de résolution',
        description:
          'Chaque minute de panne coûte cher. Vos techniciens perdent du temps à chercher la bonne procédure au lieu de résoudre.',
      },
    ],
    solutionBadge: 'Notre réponse',
    solutionTitle: "Une plateforme IA adaptée à l'usine",
    solutionDescription:
      'SUPERFASTTT transforme votre documentation technique en assistant intelligent accessible à tous les opérateurs.',
    solutions: [
      {
        icon: 'brain',
        title: 'Base de connaissances unifiée',
        description:
          "Centralisez toute votre documentation technique. L'IA répond aux questions en langage naturel avec les sources.",
      },
      {
        icon: 'zap',
        title: 'Assistance terrain',
        description:
          'Accès mobile pour les techniciens sur le terrain. Réponses instantanées, même en mode déconnecté si nécessaire.',
      },
      {
        icon: 'chart',
        title: 'Capitalisation continue',
        description:
          "Capturez le savoir-faire des experts. L'IA apprend des résolutions passées pour suggérer les meilleures solutions.",
      },
    ],
    useCases: [
      {
        title: 'Documentation technique intelligente',
        description:
          'Rendez votre documentation technique interrogeable en langage naturel. Plus besoin de connaître le bon document.',
        icon: 'database',
        features: ['Recherche en langage naturel', 'Réponses avec citations', 'Accès mobile'],
      },
      {
        title: 'Aide au diagnostic',
        description:
          'Assistez vos techniciens dans le diagnostic des pannes avec des suggestions basées sur les résolutions passées.',
        icon: 'settings',
        features: [
          'Analyse des symptômes',
          'Suggestions de causes probables',
          'Procédures de résolution',
        ],
      },
      {
        title: 'Formation et onboarding',
        description:
          'Accélérez la montée en compétences des nouveaux opérateurs avec un assistant qui connaît vos procédures.',
        icon: 'users',
        features: [
          'Réponses aux questions métier',
          'Parcours de formation guidés',
          'Quiz de validation',
        ],
      },
    ],
    stats: [
      {
        value: '-40%',
        label: 'Temps de résolution',
        description: 'Réduction moyenne du temps de diagnostic des pannes',
      },
      {
        value: '100%',
        label: 'Documentation accessible',
        description: 'Toute votre documentation technique en un seul point',
      },
      {
        value: '24/7',
        label: 'Disponibilité',
        description: "L'expertise accessible à tout moment, même la nuit",
      },
      {
        value: '0',
        label: 'Formation requise',
        description: 'Interface en langage naturel, pas de compétence technique requise',
      },
    ],
    faq: [
      {
        question: 'Comment intégrer notre documentation technique existante ?',
        answer:
          'SUPERFASTTT se connecte à vos systèmes de gestion documentaire existants (SharePoint, Confluence, systèmes PLM). Nous indexons vos documents PDF, Word, Excel et les rendons interrogeables. Pas de migration de contenu nécessaire.',
      },
      {
        question: "L'IA peut-elle fonctionner hors ligne ?",
        answer:
          'Pour les environnements déconnectés (usines isolées, interventions terrain), nous proposons un mode dédié avec synchronisation. Les documents critiques restent accessibles même sans connexion.',
      },
      {
        question: 'Comment garantir la confidentialité des secrets industriels ?',
        answer:
          'Hébergement sur vos serveurs ou cloud privé français, isolation totale entre entreprises, chiffrement de bout en bout. Vos secrets industriels ne quittent jamais votre périmètre.',
      },
      {
        question: 'Combien de temps pour déployer la solution ?',
        answer:
          'Un pilote sur un périmètre limité (une ligne de production, un type de documentation) peut être opérationnel en 2-4 semaines. Le déploiement complet dépend du volume documentaire et de la complexité de votre environnement.',
      },
    ],
  },
  {
    slug: 'solutions/administration',
    title: 'Secteur Public',
    badge: 'Public',
    heroTitle: 'IA souveraine',
    heroHighlight: 'pour les administrations',
    heroDescription:
      "Déployez l'intelligence artificielle dans votre administration avec une garantie de souveraineté totale. Données sur le territoire national, conformité RGPD, et transparence des traitements.",
    metaTitle: 'IA Souveraine pour le Secteur Public | SUPERFASTTT',
    metaDescription:
      'Plateforme IA conforme aux exigences du secteur public. Souveraineté des données, conformité RGPD, hébergement France.',
    problemBadge: 'Enjeux Publics',
    problemTitle: "L'IA dans le secteur public : confiance et souveraineté",
    problemDescription:
      'Les administrations font face à des exigences uniques : souveraineté des données, transparence, et accessibilité.',
    problems: [
      {
        icon: 'globe',
        title: 'Souveraineté des données',
        description:
          "Les données des citoyens ne peuvent pas transiter par des serveurs étrangers. Comment utiliser l'IA sans compromettre la souveraineté ?",
      },
      {
        icon: 'shield',
        title: 'Transparence des algorithmes',
        description:
          "Les citoyens ont le droit de comprendre les décisions les concernant. Comment garantir l'explicabilité de l'IA ?",
      },
      {
        icon: 'users',
        title: 'Accessibilité universelle',
        description:
          'Le service public doit être accessible à tous. Comment déployer une IA inclusive et non discriminante ?',
      },
    ],
    solutionBadge: 'Notre réponse',
    solutionTitle: 'Une plateforme IA conçue pour le service public',
    solutionDescription:
      'SUPERFASTTT répond aux exigences uniques des administrations avec une souveraineté et une transparence totales.',
    solutions: [
      {
        icon: 'globe',
        title: 'Hébergement France',
        description:
          'Infrastructure exclusivement française, opérée par des acteurs français. Aucun transfert de données hors du territoire.',
      },
      {
        icon: 'chart',
        title: 'Transparence native',
        description:
          "Chaque réponse cite ses sources. Journal d'audit consultable. Explicabilité des traitements sur demande.",
      },
      {
        icon: 'users',
        title: 'Accessibilité RGAA',
        description:
          "Interface conforme au référentiel d'accessibilité. Support multilingue. Compatibilité avec les technologies d'assistance.",
      },
    ],
    useCases: [
      {
        title: 'Accueil des usagers',
        description:
          'Assistant disponible 24h/24 pour orienter les usagers et répondre aux questions fréquentes sur les démarches.',
        icon: 'users',
        features: [
          'Réponses aux questions courantes',
          'Orientation vers le bon service',
          'Prise de rendez-vous',
        ],
      },
      {
        title: 'Aide à la rédaction',
        description:
          'Assistez vos agents dans la rédaction de courriers, notes et rapports avec les formules administratives appropriées.',
        icon: 'database',
        features: [
          'Modèles de courriers',
          'Vérification réglementaire',
          'Cohérence terminologique',
        ],
      },
      {
        title: 'Recherche documentaire',
        description:
          'Rendez votre base documentaire (circulaires, notes, procédures) interrogeable en langage naturel.',
        icon: 'brain',
        features: ['Recherche en langage courant', 'Réponses sourcées', 'Historique des versions'],
      },
    ],
    stats: [
      {
        value: '100%',
        label: 'Souverain',
        description: 'Hébergement exclusivement français, opérateurs français',
      },
      {
        value: 'RGPD',
        label: 'Conforme',
        description: 'Conformité native, pas de transfert hors UE',
      },
      {
        value: 'RGAA',
        label: 'Accessible',
        description: "Interface conforme au référentiel d'accessibilité",
      },
      {
        value: '0€',
        label: 'Cloud Act',
        description: 'Aucune soumission aux lois extraterritoriales américaines',
      },
    ],
    faq: [
      {
        question: 'Comment garantissez-vous la souveraineté des données ?',
        answer:
          "Toute notre infrastructure est hébergée en France, opérée par des équipes françaises. Nous n'utilisons aucun service cloud américain. Vos données ne transitent jamais par des serveurs étrangers et ne sont soumises à aucune loi extraterritoriale.",
      },
      {
        question: 'La solution est-elle accessible aux personnes handicapées ?',
        answer:
          "Oui. Notre interface est conçue selon le référentiel RGAA (Référentiel Général d'Amélioration de l'Accessibilité). Elle est compatible avec les lecteurs d'écran, navigation au clavier, et autres technologies d'assistance.",
      },
      {
        question: "Comment expliquer les réponses de l'IA aux usagers ?",
        answer:
          "Chaque réponse cite ses sources (document, article de loi, procédure). Sur demande, nous pouvons fournir un détail du raisonnement suivi par l'IA pour arriver à sa réponse.",
      },
      {
        question: "Peut-on personnaliser l'assistant pour notre administration ?",
        answer:
          "Oui. Vous définissez le périmètre documentaire, le ton des réponses, les sujets à traiter ou éviter. L'assistant s'adapte à votre charte et vos procédures spécifiques.",
      },
    ],
  },
  {
    slug: 'solutions/juridique',
    title: 'Juridique & Cabinets',
    badge: 'Juridique',
    heroTitle: 'IA confidentielle',
    heroHighlight: 'pour les professionnels du droit',
    heroDescription:
      "Déployez l'intelligence artificielle dans votre cabinet avec une garantie de confidentialité absolue. Secret professionnel préservé, données clients protégées, et traçabilité complète.",
    metaTitle: 'IA Souveraine pour le Juridique | SUPERFASTTT',
    metaDescription:
      'Plateforme IA conforme aux exigences du secret professionnel. Confidentialité absolue, hébergement souverain, traçabilité complète.',
    problemBadge: 'Enjeux Juridiques',
    problemTitle: "L'IA dans le juridique : confidentialité et précision",
    problemDescription:
      "Les professionnels du droit font face à des exigences de confidentialité absolue qui freinent l'adoption de l'IA.",
    problems: [
      {
        icon: 'lock',
        title: 'Secret professionnel',
        description:
          "Le secret professionnel est absolu. Comment utiliser l'IA sans risquer de compromettre la confidentialité des dossiers clients ?",
      },
      {
        icon: 'database',
        title: 'Volume documentaire',
        description:
          "Jurisprudence, doctrine, contrats : le volume d'information à traiter explose. Comment rester à jour sans y passer des heures ?",
      },
      {
        icon: 'chart',
        title: 'Fiabilité des sources',
        description:
          "Une erreur de droit peut coûter un procès. Comment s'assurer que l'IA cite des sources fiables et à jour ?",
      },
    ],
    solutionBadge: 'Notre réponse',
    solutionTitle: 'Une plateforme IA conçue pour les juristes',
    solutionDescription:
      'SUPERFASTTT répond aux exigences du secret professionnel avec une architecture de confidentialité native.',
    solutions: [
      {
        icon: 'lock',
        title: 'Confidentialité absolue',
        description:
          'Isolation totale entre cabinets, chiffrement de bout en bout, aucun accès aux données par nos équipes.',
      },
      {
        icon: 'database',
        title: 'Sources vérifiables',
        description:
          'Chaque réponse cite ses sources avec liens vers les textes originaux. Vous vérifiez avant de vous engager.',
      },
      {
        icon: 'shield',
        title: 'Hébergement souverain',
        description:
          'Données hébergées en France, pas de soumission au Cloud Act. Vos dossiers restent sous droit français.',
      },
    ],
    useCases: [
      {
        title: 'Recherche juridique',
        description:
          'Interrogez la jurisprudence, la doctrine et vos propres dossiers en langage naturel.',
        icon: 'brain',
        features: [
          'Recherche multi-sources',
          'Liens vers les textes originaux',
          'Synthèse des positions',
        ],
      },
      {
        title: 'Analyse de contrats',
        description:
          'Faites analyser vos contrats pour identifier les clauses à risque et les points à négocier.',
        icon: 'database',
        features: [
          'Détection des clauses problématiques',
          'Comparaison avec vos standards',
          'Suggestions de modifications',
        ],
      },
      {
        title: 'Rédaction assistée',
        description:
          'Accélérez la rédaction de vos actes et conclusions avec un assistant qui connaît vos modèles.',
        icon: 'settings',
        features: [
          'Modèles personnalisables',
          'Vérification des références',
          'Cohérence terminologique',
        ],
      },
    ],
    stats: [
      {
        value: '100%',
        label: 'Confidentiel',
        description: 'Isolation totale, chiffrement bout en bout',
      },
      {
        value: 'France',
        label: 'Hébergement',
        description: 'Données sous droit français exclusivement',
      },
      {
        value: '0',
        label: 'Accès tiers',
        description: 'Aucun accès à vos données par nos équipes',
      },
      {
        value: '-60%',
        label: 'Temps de recherche',
        description: 'Réduction moyenne du temps de recherche documentaire',
      },
    ],
    faq: [
      {
        question: 'Comment le secret professionnel est-il garanti ?',
        answer:
          'Isolation totale entre cabinets (chaque cabinet a son environnement dédié), chiffrement de bout en bout des données, aucun accès possible par nos équipes techniques. Vos dossiers clients sont aussi protégés que dans votre coffre-fort physique.',
      },
      {
        question: "L'IA peut-elle remplacer un juriste ?",
        answer:
          "Non, et ce n'est pas l'objectif. SUPERFASTTT est un outil d'assistance qui accélère la recherche et la rédaction. Le jugement juridique reste celui de l'avocat ou du juriste. L'IA ne prend aucune décision à votre place.",
      },
      {
        question: "Comment vérifier les sources citées par l'IA ?",
        answer:
          'Chaque réponse inclut des liens vers les textes sources (Légifrance, bases de jurisprudence, vos propres documents). Vous pouvez vérifier chaque affirmation avant de vous en servir.',
      },
      {
        question: "Mes données servent-elles à entraîner l'IA ?",
        answer:
          "Non. Vos données ne sont jamais utilisées pour l'entraînement des modèles. Elles restent strictement dans votre périmètre et ne servent qu'à répondre à vos propres requêtes.",
      },
    ],
  },
  {
    slug: 'solutions/entreprises',
    title: 'ETI & Grandes Entreprises',
    badge: 'Entreprises',
    heroTitle: 'IA évolutive',
    heroHighlight: "pour l'entreprise en croissance",
    heroDescription:
      "Déployez l'intelligence artificielle à l'échelle de votre organisation. Gouvernance centralisée, déploiement progressif, et ROI mesurable sur chaque cas d'usage.",
    metaTitle: 'IA Souveraine pour les ETI et Grandes Entreprises | SUPERFASTTT',
    metaDescription:
      'Plateforme IA scalable pour les ETI et grands comptes. Gouvernance centralisée, déploiement multi-entités, ROI mesurable.',
    problemBadge: 'Enjeux ETI',
    problemTitle: "L'IA en entreprise : gouvernance et scalabilité",
    problemDescription:
      "Les ETI et grands comptes font face à des défis de gouvernance et de déploiement à l'échelle.",
    problems: [
      {
        icon: 'settings',
        title: 'Shadow AI',
        description:
          "Vos équipes utilisent déjà l'IA de manière non contrôlée. Comment reprendre le contrôle sans brider l'innovation ?",
      },
      {
        icon: 'chart',
        title: 'ROI incertain',
        description:
          "Difficile de mesurer la valeur réelle de l'IA. Comment justifier l'investissement auprès de la direction ?",
      },
      {
        icon: 'users',
        title: 'Déploiement complexe',
        description:
          'Multiples entités, métiers différents, systèmes hétérogènes. Comment déployer sans créer un projet monstre ?',
      },
    ],
    solutionBadge: 'Notre réponse',
    solutionTitle: 'Une plateforme IA qui grandit avec vous',
    solutionDescription:
      "SUPERFASTTT s'adapte à la complexité de votre organisation avec une gouvernance centralisée et un déploiement progressif.",
    solutions: [
      {
        icon: 'settings',
        title: 'Gouvernance centralisée',
        description:
          "Console d'administration unique pour gérer tous les usages IA. Politiques par entité, métier, profil.",
      },
      {
        icon: 'chart',
        title: 'Mesure du ROI',
        description:
          "Tableaux de bord par cas d'usage, entité, équipe. Coûts et gains quantifiés. Rapports exportables.",
      },
      {
        icon: 'zap',
        title: 'Déploiement progressif',
        description:
          "Commencez petit, étendez rapidement. Chaque cas d'usage validé devient un template pour le suivant.",
      },
    ],
    useCases: [
      {
        title: "Productivité de l'entreprise",
        description:
          'Déployez des assistants IA pour chaque fonction : RH, Finance, Commercial, Support, Juridique.',
        icon: 'users',
        features: [
          'Un assistant par métier',
          'Données cloisonnées par fonction',
          'Mesure du temps gagné',
        ],
      },
      {
        title: 'Base de connaissances',
        description:
          "Centralisez le savoir de l'entreprise et rendez-le accessible à tous en langage naturel.",
        icon: 'brain',
        features: ['Indexation multi-sources', 'Réponses sourcées', 'Mise à jour automatique'],
      },
      {
        title: 'Automatisation des processus',
        description:
          'Identifiez et automatisez les tâches répétitives à fort volume avec des workflows IA.',
        icon: 'workflow',
        features: ['Détection des opportunités', 'Workflows configurables', 'Supervision humaine'],
      },
    ],
    stats: [
      {
        value: '100+',
        label: 'Utilisateurs',
        description: 'Plateforme conçue pour les organisations de 100 à 10 000+ utilisateurs',
      },
      {
        value: 'Multi-entités',
        label: 'Support',
        description: 'Gestion centralisée de plusieurs filiales ou BU',
      },
      {
        value: 'SSO',
        label: 'Intégration',
        description: 'Authentification via Azure AD, Google Workspace, Okta',
      },
      {
        value: 'API',
        label: 'Ouverte',
        description: 'Intégration dans vos outils et processus existants',
      },
    ],
    faq: [
      {
        question: 'Comment commencer sans tout bouleverser ?',
        answer:
          "Nous recommandons de démarrer par un pilote sur un cas d'usage ciblé (ex: support RH, documentation technique). Une fois validé, le modèle se réplique facilement aux autres métiers. Pas de big bang, pas de risque.",
      },
      {
        question: 'Comment gérer plusieurs entités/filiales ?',
        answer:
          'La plateforme supporte nativement le multi-tenant. Chaque entité a son espace isolé avec ses propres données, utilisateurs et politiques. La gouvernance reste centralisée au niveau groupe.',
      },
      {
        question: 'Comment mesurer le ROI ?',
        answer:
          "Tableaux de bord intégrés par cas d'usage : nombre de requêtes, temps économisé estimé, satisfaction utilisateurs. Vous pouvez exporter ces données pour vos reportings internes.",
      },
      {
        question: 'Quel accompagnement proposez-vous ?',
        answer:
          "Au-delà de la plateforme, nous accompagnons vos équipes : identification des cas d'usage prioritaires, formation des champions internes, support au déploiement, optimisation continue.",
      },
    ],
  },
]

function createPageData(solution: SolutionPage): RequiredDataFromCollectionSlug<'pages'> {
  return {
    slug: solution.slug,
    _status: 'draft',
    title: solution.title,
    hero: {
      type: 'none',
    },
    layout: [
      // HERO
      {
        blockType: 'heroModern',
        blockName: 'Hero',
        badge: solution.badge,
        title: solution.heroTitle,
        highlightedText: solution.heroHighlight,
        description: solution.heroDescription,
        links: [
          {
            link: {
              type: 'custom',
              appearance: 'default',
              label: 'Demander une démonstration',
              url: '/contact',
            },
          },
          {
            link: {
              type: 'custom',
              appearance: 'outline',
              label: "Voir les cas d'usage",
              url: '/produit/vue-ensemble',
            },
          },
        ],
        trustIndicators: {
          headline: '',
          indicators: [
            { icon: 'shield', label: 'RGPD' },
            { icon: 'globe', label: 'Souverain' },
            { icon: 'lock', label: 'Conforme' },
          ],
        },
      },
      // PROBLÉMATIQUE
      {
        blockType: 'featureGrid',
        blockName: 'Problématique',
        badge: solution.problemBadge,
        title: solution.problemTitle,
        description: solution.problemDescription,
        columns: '3',
        features: solution.problems.map((p) => ({
          icon: p.icon,
          title: p.title,
          description: p.description,
        })),
      },
      // SOLUTION
      {
        blockType: 'featureGrid',
        blockName: 'Solution',
        badge: solution.solutionBadge,
        title: solution.solutionTitle,
        description: solution.solutionDescription,
        columns: '3',
        features: solution.solutions.map((s) => ({
          icon: s.icon,
          title: s.title,
          description: s.description,
        })),
      },
      // CAS D'USAGE
      {
        blockType: 'productShowcase',
        blockName: "Cas d'usage",
        badge: "Cas d'usage",
        title: 'Comment nos clients utilisent SUPERFASTTT',
        layout: 'alternating',
        items: solution.useCases.map((uc) => ({
          title: uc.title,
          description: uc.description,
          icon: uc.icon,
          features: uc.features.map((f) => ({ text: f })),
        })),
      },
      // STATS
      {
        blockType: 'statsSection',
        blockName: 'Conformité',
        badge: 'Garanties',
        title: 'Une plateforme conçue pour votre secteur',
        variant: 'cards',
        columns: '4',
        stats: solution.stats.map((s) => ({
          value: s.value,
          label: s.label,
          description: s.description,
        })),
      },
      // FAQ
      {
        blockType: 'faq',
        blockName: 'FAQ',
        badge: 'FAQ',
        title: 'Questions fréquentes',
        items: solution.faq.map((f) => ({
          question: f.question,
          answer: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: f.answer,
                      format: 0,
                      detail: 0,
                      mode: 'normal',
                      style: '',
                      version: 1,
                    },
                  ],
                  format: '',
                  indent: 0,
                  textFormat: 0,
                  version: 1,
                  direction: 'ltr',
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1,
            },
          },
        })),
        allowMultipleOpen: false,
      },
      // CTA
      {
        blockType: 'ctaModern',
        blockName: 'CTA',
        title: 'Prêt à transformer votre ' + solution.title.toLowerCase() + ' ?',
        description:
          "Découvrez comment SUPERFASTTT peut répondre à vos enjeux spécifiques. Démonstration personnalisée sur vos cas d'usage réels.",
        variant: 'gradient',
        links: [
          {
            link: {
              type: 'custom',
              appearance: 'default',
              label: 'Demander une démonstration',
              url: '/contact',
            },
          },
        ],
      },
    ],
    meta: {
      title: solution.metaTitle,
      description: solution.metaDescription,
    },
  } as RequiredDataFromCollectionSlug<'pages'>
}

async function seedSolutions() {
  console.log('🚀 Création des 6 pages Solutions...\n')

  const payload = await getPayload({ config: configPromise })

  for (const solution of SOLUTIONS) {
    const pageData = createPageData(solution)

    try {
      // Chercher si la page existe déjà
      const existing = await payload.find({
        collection: 'pages',
        where: {
          slug: { equals: solution.slug },
        },
        locale: 'fr',
        limit: 1,
      })

      if (existing.docs.length > 0) {
        // Mettre à jour
        await payload.update({
          collection: 'pages',
          id: existing.docs[0].id,
          data: pageData,
          locale: 'fr',
          context: { disableRevalidate: true },
        })
        console.log(`✅ Mise à jour: ${solution.title} (${solution.slug})`)
      } else {
        // Créer
        await payload.create({
          collection: 'pages',
          data: pageData,
          locale: 'fr',
          context: { disableRevalidate: true },
        })
        console.log(`✨ Créée: ${solution.title} (${solution.slug})`)
      }
    } catch (error) {
      console.error(`❌ Erreur pour ${solution.slug}:`, error)
    }
  }

  console.log('\n📋 Pages Solutions créées:')
  for (const solution of SOLUTIONS) {
    console.log(`   - /${solution.slug} : ${solution.title}`)
  }

  console.log('\n🌐 Accédez aux pages:')
  console.log('   http://localhost:3001/solutions/sante')
  console.log('   http://localhost:3001/solutions/finance')
  console.log('   http://localhost:3001/solutions/industrie')
  console.log('   http://localhost:3001/solutions/administration')
  console.log('   http://localhost:3001/solutions/juridique')
  console.log('   http://localhost:3001/solutions/entreprises')

  process.exit(0)
}

seedSolutions().catch((error) => {
  console.error('❌ Erreur:', error)
  process.exit(1)
})
