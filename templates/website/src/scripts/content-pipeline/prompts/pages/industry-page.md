# Template - Page Industrie/Secteur

## Contexte produit

{{productBrief}}

## Secteur à documenter

- **Nom**: {{industryName}}
- **Description**: {{industryDescription}}
- **Réglementations**: {{regulations}}
- **Certifications requises**: {{certifications}}
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
      "badge": "Secteur",
      "title": "L'IA souveraine pour [secteur]",
      "highlightedText": "souveraine",
      "description": "Proposition de valeur spécifique au secteur",
      "trustIndicators": [
        { "icon": "shield", "text": "Certification pertinente" },
        { "icon": "check", "text": "Conformité sectorielle" },
        { "icon": "lock", "text": "Protection données" }
      ]
    },
    {
      "blockType": "sectorCards",
      "badge": "Défis",
      "title": "Les enjeux de [secteur]",
      "description": "Introduction des problématiques",
      "sectors": [
        {
          "icon": "icon-name",
          "title": "Défi sectoriel 1",
          "description": "Description du défi",
          "keyPoints": [{ "point": "Aspect 1" }, { "point": "Aspect 2" }]
        }
      ]
    },
    {
      "blockType": "featureGrid",
      "badge": "Conformité",
      "title": "Une conformité native",
      "description": "Comment SUPERFASTTT répond aux exigences réglementaires",
      "columns": 3,
      "features": [
        {
          "icon": "shield",
          "title": "Certification/Norme",
          "description": "Ce que ça garantit"
        }
      ]
    },
    {
      "blockType": "productShowcase",
      "badge": "Solutions",
      "title": "Des solutions adaptées à [secteur]",
      "description": "Fonctionnalités pertinentes pour le secteur",
      "layout": "alternating",
      "items": [
        {
          "title": "Cas d'usage sectoriel",
          "description": "Comment ça fonctionne",
          "icon": "icon-name",
          "keyFeatures": [
            { "feature": "Bénéfice 1" },
            { "feature": "Bénéfice 2" },
            { "feature": "Bénéfice 3" }
          ]
        }
      ]
    },
    {
      "blockType": "statsSection",
      "badge": "Impact",
      "title": "Résultats sectoriels",
      "variant": "gradient",
      "stats": [
        {
          "value": "X%",
          "label": "Métrique sectorielle",
          "description": "Contexte"
        }
      ]
    },
    {
      "blockType": "ctaModern",
      "title": "Prêt à transformer [secteur] ?",
      "description": "Découvrez comment nos clients du secteur tirent parti de l'IA souveraine",
      "variant": "dark",
      "links": [
        { "link": { "type": "custom", "label": "Démo sectorielle", "url": "/contact" } },
        { "link": { "type": "custom", "label": "Cas clients", "url": "/clients" } }
      ]
    }
  ],
  "faq": [
    {
      "question": "L'IA SUPERFASTTT est-elle conforme [réglementation] ?",
      "answer": "Réponse sur la conformité",
      "keywords": ["conformite", "reglementation", "secteur"]
    },
    {
      "question": "Comment protéger les données [type] avec l'IA ?",
      "answer": "Réponse sur la protection des données",
      "keywords": ["protection", "donnees", "securite"]
    }
  ],
  "meta": {
    "title": "IA pour [Secteur] | SUPERFASTTT - Conforme [Réglementation]",
    "description": "Meta description orientée secteur et conformité",
    "keywords": ["ia-secteur", "conformite", "souverainete"]
  },
  "internalLinks": [
    {
      "slug": "/chemin/page-liee",
      "title": "Titre de la page liée",
      "type": "industry"
    }
  ]
}
```

## Consignes spécifiques

1. **Hero**: Mettre en avant la conformité sectorielle dès le début
2. **Défis**: 3-4 problématiques spécifiques au secteur (réglementation, données sensibles, etc.)
3. **Conformité**: Toutes les certifications/normes pertinentes (HDS, ACPR, SecNumCloud, etc.)
4. **Solutions**: 3-4 cas d'usage concrets pour le secteur
5. **Stats**: Métriques sectorielles (gains de temps, réduction risques, etc.)
6. **FAQ**: Questions sur conformité, protection données, intégration SI existant
7. **CTA**: Orientation "démo sectorielle" et "cas clients"

## Réglementations et certifications par secteur

- **Santé**: HDS (Hébergeur de Données de Santé), HIPAA, données patients
- **Finance/Banque**: ACPR, données bancaires, PCI-DSS, directive NIS2
- **Assurance**: ACPR, Solvabilité II, données assurés
- **Secteur public**: SecNumCloud, RGS, RGPD strict, données citoyens
- **Énergie**: NIS2, infrastructure critique, ANSSI
- **Tous secteurs**: RGPD, ISO 27001, SOC 2

## Icônes disponibles

(même liste que service-page.md)
