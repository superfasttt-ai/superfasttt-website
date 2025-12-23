# Template - Page Service

## Contexte produit

{{productBrief}}

## Service à documenter

- **Nom**: {{serviceName}}
- **Description**: {{serviceDescription}}
- **Catégorie**: {{serviceCategory}}
- **Mots-clés SEO**: {{seoKeywords}}

## Pages liées (pour maillage interne)

{{relatedPages}}

## Structure JSON attendue

Génère une page complète au format JSON avec cette structure exacte:

```json
{
  "title": "Titre de la page (sans nom produit)",
  "slug": "slug-url-optimise-seo",
  "layout": [
    {
      "blockType": "heroModern",
      "badge": "Catégorie courte (2-3 mots)",
      "title": "Titre accrocheur orienté bénéfice",
      "highlightedText": "Partie mise en valeur du titre",
      "description": "2-3 phrases de proposition de valeur",
      "trustIndicators": [
        { "icon": "shield", "text": "Indicateur confiance 1" },
        { "icon": "check", "text": "Indicateur confiance 2" },
        { "icon": "lock", "text": "Indicateur confiance 3" }
      ]
    },
    {
      "blockType": "featureGrid",
      "badge": "Le problème",
      "title": "Titre de la section problème",
      "description": "Introduction du problème",
      "columns": 3,
      "features": [
        {
          "icon": "alert-triangle",
          "title": "Pain point 1",
          "description": "Description du problème"
        }
      ]
    },
    {
      "blockType": "productShowcase",
      "badge": "La solution",
      "title": "Titre orienté solution",
      "description": "Introduction de la solution",
      "layout": "alternating",
      "items": [
        {
          "title": "Fonctionnalité clé 1",
          "description": "Explication détaillée",
          "icon": "icon-name",
          "keyFeatures": [
            { "feature": "Point fort 1" },
            { "feature": "Point fort 2" },
            { "feature": "Point fort 3" }
          ]
        }
      ]
    },
    {
      "blockType": "statsSection",
      "badge": "Résultats",
      "title": "Des résultats mesurables",
      "variant": "cards",
      "stats": [
        {
          "value": "X%",
          "label": "Métrique",
          "description": "Explication"
        }
      ]
    },
    {
      "blockType": "ctaModern",
      "title": "Appel à l'action",
      "description": "Incitation à passer à l'action",
      "variant": "gradient",
      "links": [
        { "link": { "type": "custom", "label": "Demander une démo", "url": "/contact" } },
        { "link": { "type": "custom", "label": "Documentation", "url": "/docs" } }
      ]
    }
  ],
  "faq": [
    {
      "question": "Question naturelle comme posée à Google",
      "answer": "Réponse concise en 2-3 phrases",
      "keywords": ["mot-clé-1", "mot-clé-2"]
    }
  ],
  "meta": {
    "title": "Titre SEO (55-60 caractères, mot-clé en début)",
    "description": "Meta description (150-160 caractères, incite au clic)",
    "keywords": ["mot-clé-1", "mot-clé-2", "mot-clé-3"]
  },
  "internalLinks": [
    {
      "slug": "/chemin/page-liee",
      "title": "Titre de la page liée",
      "type": "service"
    }
  ]
}
```

## Consignes spécifiques

1. **Hero**: Titre orienté bénéfice, pas descriptif. Maximum 8 mots.
2. **Problème**: 3 pain points concrets que ce service résout
3. **Solution**: 3-4 fonctionnalités avec 3 points forts chacune
4. **Stats**: 3-4 métriques (marquer "exemple" si estimées)
5. **FAQ**: 4-5 questions naturelles pour le SEO/GEO
6. **CTA**: Deux actions (démo + documentation)
7. **Meta**: Optimisé pour le référencement

## Icônes disponibles

shield, lock, check, zap, users, building, database, cloud, server, cog, bar-chart, pie-chart, trending-up, search, file-text, folder, globe, key, alert-triangle, clock, refresh, layers, cpu, hard-drive, terminal, code, git-branch, package, tool, settings, eye, eye-off, filter, grid, list, maximize, minimize, move, plus, minus, x, chevron-right, chevron-down, external-link, download, upload, share, copy, edit, trash, archive, bookmark, star, heart, message-circle, mail, phone, calendar, map-pin, navigation, compass, target, award, gift, percent, dollar-sign, credit-card, shopping-cart, truck, box, briefcase, clipboard, file, file-plus, folder-plus, image, camera, video, mic, volume, headphones, monitor, smartphone, tablet, wifi, bluetooth, battery, power, sun, moon, cloud-rain, thermometer, droplet, wind, umbrella, coffee, book, bookmark, pen-tool, scissors, link, paperclip
