# Template - Article Blog

## Contexte produit

{{productBrief}}

## Article à rédiger

- **Titre**: {{postTitle}}
- **Catégorie**: {{category}}
- **Sujet**: {{topic}}
- **Mots-clés SEO**: {{seoKeywords}}
- **Audience cible**: {{targetAudience}}

## Sources de recherche (Serper.dev)

{{researchSources}}

## Structure JSON attendue

Génère un article complet au format JSON avec cette structure exacte:

```json
{
  "title": "Titre accrocheur de l'article",
  "slug": "slug-url-optimise-seo",
  "excerpt": "Résumé de l'article en 2-3 phrases (150 caractères max)",
  "category": "Catégorie du blog",
  "readingTime": 8,
  "tableOfContents": [
    { "id": "section-1", "title": "Titre section 1", "level": 2 },
    { "id": "sous-section-1-1", "title": "Sous-section 1.1", "level": 3 },
    { "id": "section-2", "title": "Titre section 2", "level": 2 }
  ],
  "content": {
    "root": {
      "type": "root",
      "children": [
        {
          "type": "paragraph",
          "children": [
            { "type": "text", "text": "Introduction captivante qui pose le contexte et l'enjeu." }
          ]
        },
        {
          "type": "heading",
          "tag": "h2",
          "children": [{ "type": "text", "text": "Titre de section" }],
          "id": "section-1"
        },
        {
          "type": "paragraph",
          "children": [{ "type": "text", "text": "Contenu de la section..." }]
        },
        {
          "type": "list",
          "listType": "bullet",
          "children": [
            {
              "type": "listitem",
              "children": [{ "type": "text", "text": "Point 1" }]
            },
            {
              "type": "listitem",
              "children": [{ "type": "text", "text": "Point 2" }]
            }
          ]
        },
        {
          "type": "heading",
          "tag": "h3",
          "children": [{ "type": "text", "text": "Sous-titre" }],
          "id": "sous-section-1-1"
        },
        {
          "type": "paragraph",
          "children": [
            { "type": "text", "text": "Contenu..." },
            { "type": "text", "text": "texte en gras", "format": ["bold"] },
            { "type": "text", "text": " suite du texte." }
          ]
        },
        {
          "type": "quote",
          "children": [{ "type": "text", "text": "Citation importante ou point clé à retenir." }]
        },
        {
          "type": "heading",
          "tag": "h2",
          "children": [{ "type": "text", "text": "Conclusion" }]
        },
        {
          "type": "paragraph",
          "children": [{ "type": "text", "text": "Résumé et appel à l'action." }]
        }
      ]
    }
  },
  "faq": [
    {
      "question": "Question fréquente sur le sujet",
      "answer": "Réponse concise et informative",
      "keywords": ["mot-cle-1", "mot-cle-2"]
    }
  ],
  "relatedTopics": ["sujet-lie-1", "sujet-lie-2", "sujet-lie-3"],
  "meta": {
    "title": "Titre SEO (55-60 caractères)",
    "description": "Meta description (150-160 caractères)",
    "keywords": ["mot-cle-1", "mot-cle-2", "mot-cle-3"]
  },
  "sources": [
    {
      "title": "Titre de la source",
      "url": "https://...",
      "accessedAt": "2024-01-15"
    }
  ],
  "internalLinks": [
    {
      "slug": "/services/rag",
      "title": "RAG & Base de connaissances",
      "type": "service"
    }
  ]
}
```

## Consignes spécifiques

1. **Introduction**: Hook + contexte + annonce du plan
2. **Structure**: H2 pour sections principales, H3 pour sous-sections
3. **Longueur**: 1500-2500 mots (environ 8-12 min de lecture)
4. **Table des matières**: Générée automatiquement depuis les H2/H3
5. **Listes**: Utiliser des bullet points pour les énumérations
6. **Citations**: Mettre en avant les points clés
7. **FAQ**: 3-5 questions pour le GEO
8. **Conclusion**: Résumé + CTA vers contenu lié
9. **Sources**: Citer toutes les sources utilisées

## Types de contenu par catégorie

### IA & Entreprise

- Tendances et prédictions
- ROI et business case
- Adoption et change management

### Souveraineté & RGPD

- Réglementation et conformité
- Guides pratiques
- Actualités légales

### RAG & Knowledge Management

- Tutoriels techniques
- Best practices
- Comparatifs d'approches

### LLM & Modèles

- Nouveautés et releases
- Comparatifs de modèles
- Fine-tuning et personnalisation

### Cas clients

- Success stories
- Témoignages
- Études de cas

## Format Lexical simplifié

Utiliser uniquement ces types de nœuds:

- `paragraph`: Texte standard
- `heading`: Titres (tag: h2, h3)
- `list`: Listes (listType: bullet ou number)
- `listitem`: Élément de liste
- `quote`: Citation ou encadré
- `text`: Contenu texte (format: ["bold"], ["italic"], ["underline"])
- `link`: Lien (url: "...", children: [...])

## Bonnes pratiques SEO/GEO

- Mot-clé principal dans le titre et H1
- Mots-clés secondaires dans les H2
- Questions naturelles dans la FAQ
- Liens internes vers contenus liés
- Meta description incitant au clic
- Contenu scannable (listes, sous-titres)
