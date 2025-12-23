# Template - Page Métier/Fonction

## Contexte produit

{{productBrief}}

## Métier à documenter

- **Nom**: {{metierName}}
- **Description**: {{metierDescription}}
- **Pain points**: {{painPoints}}
- **KPIs clés**: {{kpis}}
- **Mots-clés SEO**: {{seoKeywords}}

## Pages liées (pour maillage interne)

{{relatedPages}}

## Structure JSON attendue

Génère une page complète au format JSON avec cette structure exacte:

```json
{
  "title": "Titre de la page",
  "slug": "slug-url-optimise-seo",
  "layout": [
    {
      "blockType": "heroModern",
      "badge": "Pour les [fonction]",
      "title": "L'IA qui [bénéfice principal]",
      "highlightedText": "bénéfice principal",
      "description": "Proposition de valeur pour ce métier",
      "trustIndicators": [
        { "icon": "clock", "text": "Gain de temps" },
        { "icon": "shield", "text": "Contrôle total" },
        { "icon": "bar-chart", "text": "ROI mesurable" }
      ]
    },
    {
      "blockType": "featureGrid",
      "badge": "Vos défis",
      "title": "Les enjeux quotidiens des [fonction]",
      "description": "Problématiques que vous rencontrez",
      "columns": 3,
      "features": [
        {
          "icon": "alert-triangle",
          "title": "Pain point métier",
          "description": "Description du problème quotidien"
        }
      ]
    },
    {
      "blockType": "productShowcase",
      "badge": "Nos solutions",
      "title": "SUPERFASTTT pour les [fonction]",
      "description": "Des fonctionnalités pensées pour votre métier",
      "layout": "alternating",
      "items": [
        {
          "title": "Solution au pain point",
          "description": "Comment SUPERFASTTT résout ce problème",
          "icon": "icon-name",
          "keyFeatures": [
            { "feature": "Fonctionnalité clé 1" },
            { "feature": "Fonctionnalité clé 2" },
            { "feature": "Fonctionnalité clé 3" }
          ]
        }
      ]
    },
    {
      "blockType": "statsSection",
      "badge": "ROI",
      "title": "Des résultats pour votre fonction",
      "variant": "cards",
      "stats": [
        {
          "value": "X%",
          "label": "KPI métier",
          "description": "Impact concret"
        }
      ]
    },
    {
      "blockType": "featureGrid",
      "badge": "Premiers pas",
      "title": "Comment démarrer",
      "description": "Un onboarding adapté à votre fonction",
      "columns": 3,
      "features": [
        {
          "icon": "play",
          "title": "Étape 1",
          "description": "Action concrète"
        },
        {
          "icon": "settings",
          "title": "Étape 2",
          "description": "Action concrète"
        },
        {
          "icon": "check",
          "title": "Étape 3",
          "description": "Action concrète"
        }
      ]
    },
    {
      "blockType": "ctaModern",
      "title": "Prêt à transformer votre quotidien ?",
      "description": "Découvrez SUPERFASTTT en conditions réelles",
      "variant": "gradient",
      "links": [
        { "link": { "type": "custom", "label": "Voir une démo", "url": "/contact" } },
        { "link": { "type": "custom", "label": "Guide [fonction]", "url": "/guides" } }
      ]
    }
  ],
  "faq": [
    {
      "question": "Comment SUPERFASTTT aide les [fonction] ?",
      "answer": "Réponse orientée bénéfices métier",
      "keywords": ["metier", "fonction", "benefice"]
    },
    {
      "question": "Quel est le ROI pour un [fonction] ?",
      "answer": "Réponse avec métriques concrètes",
      "keywords": ["roi", "productivite", "gains"]
    }
  ],
  "meta": {
    "title": "IA pour [Métier] | SUPERFASTTT - Gagnez en productivité",
    "description": "Meta description orientée bénéfices métier",
    "keywords": ["ia-metier", "productivite", "outil"]
  },
  "internalLinks": [
    {
      "slug": "/chemin/page-liee",
      "title": "Titre de la page liée",
      "type": "metier"
    }
  ]
}
```

## Consignes spécifiques

1. **Hero**: Focus sur le bénéfice principal pour ce métier
2. **Pain points**: 3-4 problèmes quotidiens spécifiques à la fonction
3. **Solutions**: Mapping 1:1 avec les pain points
4. **KPIs**: Métriques que ce métier suit (temps gagné, coûts réduits, etc.)
5. **Getting started**: 3 étapes simples pour démarrer
6. **FAQ**: Questions sur l'adoption, le ROI, l'intégration
7. **CTA**: Démo + Guide spécifique au métier

## Personas par métier

- **Dirigeants/COMEX**: Vision stratégique, gouvernance, ROI global
- **DSI/CTO**: Architecture, sécurité, intégration SI, scalabilité
- **RSSI**: Risques, conformité, audit, protection données
- **DPO**: RGPD, consentement, droits des personnes, registres
- **DAF**: Coûts, budgets, ROI, contrôle dépenses IA
- **DRH**: Recrutement, formation, onboarding, expérience collaborateur
- **Juridique**: Contrats, compliance, responsabilité, propriété intellectuelle
- **Marketing**: Contenu, campagnes, personnalisation, brand
- **Commercial**: CRM, avant-vente, proposals, closing
- **Support**: Tickets, FAQ, satisfaction, temps de résolution
- **R&D**: Prototypage, veille, innovation, expérimentation
- **IT/Dev**: API, SDK, intégration, automatisation

## Icônes disponibles

(même liste que service-page.md)
