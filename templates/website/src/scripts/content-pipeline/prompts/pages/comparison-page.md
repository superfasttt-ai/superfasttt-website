# Template - Page Comparatif

## Contexte produit

{{productBrief}}

## Comparaison à documenter

- **Concurrent**: {{competitorName}}
- **Catégorie**: {{competitorCategory}}
- **Forces du concurrent**: {{competitorStrengths}}
- **Faiblesses du concurrent**: {{competitorWeaknesses}}
- **Mots-clés SEO**: {{seoKeywords}}

## Sources de recherche (Serper.dev)

{{researchSources}}

## Structure JSON attendue

Génère une page complète au format JSON avec cette structure exacte:

```json
{
  "title": "SUPERFASTTT vs [Concurrent]",
  "slug": "superfasttt-vs-concurrent",
  "layout": [
    {
      "blockType": "heroModern",
      "badge": "Comparatif",
      "title": "SUPERFASTTT vs [Concurrent]",
      "highlightedText": "vs [Concurrent]",
      "description": "Comparaison objective pour vous aider à choisir",
      "trustIndicators": [
        { "icon": "scale", "text": "Analyse objective" },
        { "icon": "check", "text": "Critères clairs" },
        { "icon": "calendar", "text": "Mis à jour récemment" }
      ]
    },
    {
      "blockType": "featureGrid",
      "badge": "En résumé",
      "title": "Les différences clés",
      "description": "Ce qui distingue les deux solutions",
      "columns": 2,
      "features": [
        {
          "icon": "shield",
          "title": "SUPERFASTTT",
          "description": "Avantage principal de SUPERFASTTT"
        },
        {
          "icon": "globe",
          "title": "[Concurrent]",
          "description": "Point fort du concurrent"
        }
      ]
    },
    {
      "blockType": "content",
      "blockName": "Tableau comparatif",
      "columns": [
        {
          "size": "full",
          "richText": {
            "root": {
              "type": "root",
              "children": [
                {
                  "type": "heading",
                  "tag": "h2",
                  "children": [{ "type": "text", "text": "Comparaison détaillée" }]
                },
                {
                  "type": "table",
                  "children": []
                }
              ]
            }
          }
        }
      ]
    },
    {
      "blockType": "productShowcase",
      "badge": "Avantages SUPERFASTTT",
      "title": "Pourquoi choisir SUPERFASTTT",
      "description": "Les points forts face à [Concurrent]",
      "layout": "alternating",
      "items": [
        {
          "title": "Avantage différenciant 1",
          "description": "Explication de l'avantage",
          "icon": "icon-name",
          "keyFeatures": [{ "feature": "Détail 1" }, { "feature": "Détail 2" }]
        }
      ]
    },
    {
      "blockType": "featureGrid",
      "badge": "Cas d'usage",
      "title": "Quand choisir quelle solution",
      "description": "Recommandations selon votre contexte",
      "columns": 2,
      "features": [
        {
          "icon": "check",
          "title": "Choisir SUPERFASTTT si...",
          "description": "Critères favorisant SUPERFASTTT"
        },
        {
          "icon": "arrow-right",
          "title": "Choisir [Concurrent] si...",
          "description": "Critères favorisant le concurrent"
        }
      ]
    },
    {
      "blockType": "ctaModern",
      "title": "Comparez par vous-même",
      "description": "Testez SUPERFASTTT et voyez la différence",
      "variant": "gradient",
      "links": [
        { "link": { "type": "custom", "label": "Essai gratuit", "url": "/trial" } },
        { "link": { "type": "custom", "label": "Parler à un expert", "url": "/contact" } }
      ]
    }
  ],
  "faq": [
    {
      "question": "SUPERFASTTT est-il meilleur que [Concurrent] ?",
      "answer": "Réponse nuancée selon les cas d'usage",
      "keywords": ["comparatif", "alternative", "vs"]
    },
    {
      "question": "Combien coûte SUPERFASTTT vs [Concurrent] ?",
      "answer": "Comparaison tarifaire",
      "keywords": ["prix", "tarif", "cout"]
    },
    {
      "question": "Peut-on migrer de [Concurrent] vers SUPERFASTTT ?",
      "answer": "Processus de migration",
      "keywords": ["migration", "transfert", "switch"]
    }
  ],
  "meta": {
    "title": "SUPERFASTTT vs [Concurrent] - Comparatif 2024",
    "description": "Comparaison détaillée entre SUPERFASTTT et [Concurrent]. Découvrez les différences en termes de fonctionnalités, prix et souveraineté.",
    "keywords": ["superfasttt-vs-concurrent", "alternative", "comparatif"]
  },
  "sources": [
    {
      "title": "Titre de la source",
      "url": "https://...",
      "accessedAt": "2024-01-15"
    }
  ],
  "internalLinks": []
}
```

## Consignes spécifiques

1. **Objectivité**: Reconnaître les points forts du concurrent
2. **Honnêteté**: Ne pas dénigrer, comparer factuellement
3. **Différenciation**: Focus sur souveraineté, contrôle, conformité
4. **Sources**: Citer les sources de recherche (pricing, features)
5. **FAQ**: Questions de comparaison naturelles
6. **Recommandations**: "Choisir X si..." pour aider la décision

## Critères de comparaison standards

1. **Souveraineté des données**

   - Localisation des données
   - Conformité RGPD
   - Certifications (HDS, SecNumCloud)

2. **Contrôle des modèles**

   - Choix des LLM
   - Déploiement on-premise
   - Fine-tuning possible

3. **Fonctionnalités**

   - RAG / Knowledge base
   - Multi-modèles
   - Intégrations

4. **Gouvernance**

   - Suivi des usages
   - Contrôle des coûts
   - Audit trail

5. **Pricing**

   - Modèle tarifaire
   - Coût par utilisateur
   - Coûts cachés

6. **Support**
   - Niveaux de support
   - Localisation équipe
   - SLA

## Ton pour les comparatifs

- Factuel et documenté
- Reconnaître les forces du concurrent
- Expliquer les différences, pas les jugements
- Laisser le lecteur décider
- Citer les sources
