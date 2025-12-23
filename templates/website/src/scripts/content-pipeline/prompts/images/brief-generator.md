# Génération de Briefs d'Images

## Contexte

- **Page**: {{pageTitle}}
- **Type**: {{pageType}}
- **Thème principal**: {{mainTheme}}
- **Mots-clés**: {{keywords}}

## Identité visuelle SUPERFASTTT

- **Couleurs**: Bleu corporate (#0066CC), blanc, accents violet/indigo
- **Style**: Professionnel, tech, européen, souverain
- **Ambiance**: Confiance, contrôle, innovation maîtrisée
- **Motifs**: Géométrie, connexions, données, protection

## Consignes

Génère 3 briefs d'images différents pour le hero de cette page.

Chaque brief doit:

1. Être suffisamment détaillé pour un générateur d'images IA (Midjourney, DALL-E, Imagen)
2. Refléter le thème de la page
3. Respecter l'identité visuelle SUPERFASTTT
4. Être utilisable sans retouche majeure

## Éléments à TOUJOURS éviter

- Visages humains (risque de uncanny valley)
- Mains (souvent mal générées)
- Texte ou logos (illisibles)
- Éléments cartoon ou enfantins
- Couleurs flashy ou néon
- Références culturelles spécifiques
- Symboles religieux ou politiques

## Structure JSON attendue

```json
{
  "pageId": "{{pageId}}",
  "pageTitle": "{{pageTitle}}",
  "images": [
    {
      "position": "hero",
      "briefs": [
        {
          "id": "{{pageId}}-hero-1",
          "prompt": "Description détaillée en anglais pour le générateur d'images. Abstract visualization of [concept], [style details], [color scheme], [mood], [technical specs]",
          "style": "corporate-tech-abstract",
          "dimensions": "16:9",
          "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
          "avoid": ["element1", "element2", "element3"]
        },
        {
          "id": "{{pageId}}-hero-2",
          "prompt": "Alternative 2...",
          "style": "isometric-illustration",
          "dimensions": "16:9",
          "keywords": [],
          "avoid": []
        },
        {
          "id": "{{pageId}}-hero-3",
          "prompt": "Alternative 3...",
          "style": "geometric-data-viz",
          "dimensions": "16:9",
          "keywords": [],
          "avoid": []
        }
      ]
    },
    {
      "position": "og-image",
      "briefs": [
        {
          "id": "{{pageId}}-og-1",
          "prompt": "Professional OG image, subtle tech background, space for text overlay on left side, corporate blue tones, clean and minimal",
          "style": "og-image-template",
          "dimensions": "1200x630",
          "keywords": ["professional", "tech", "clean", "minimal"],
          "avoid": ["busy backgrounds", "faces", "text"]
        }
      ]
    }
  ]
}
```

## Styles recommandés

### corporate-tech-abstract

- Formes géométriques abstraites
- Gradients subtils bleu/violet
- Lignes de connexion
- Aspect professionnel et épuré

### isometric-illustration

- Vue isométrique 3D
- Éléments tech stylisés
- Palette de couleurs cohérente
- Style "flat design" moderne

### geometric-data-viz

- Visualisation de données abstraite
- Nœuds et connexions
- Grille ou pattern en fond
- Accent sur la structure

### gradient-mesh

- Dégradés fluides
- Formes organiques
- Couleurs douces
- Effet moderne et apaisant

### tech-pattern

- Patterns répétitifs
- Circuits ou réseaux
- Minimaliste
- Fond utilisable

## Dimensions standards

- **16:9**: Hero sections, bannières
- **1:1**: Icônes, features, réseaux sociaux
- **1200x630**: Open Graph (partage social)
- **4:3**: Illustrations intérieures

## Exemples de prompts efficaces

### Pour une page RAG

```
Abstract visualization of knowledge flowing between interconnected documents,
glowing neural pathways in corporate blue (#0066CC) and white,
clean minimalist style, dark gradient background transitioning to light,
no text, professional business context, 8k quality
```

### Pour une page Sécurité

```
Isometric illustration of a secure data vault with protective shield layers,
documents transforming into encrypted light particles,
French tech company aesthetic with sovereignty theme,
blue gradient background, modern flat design, no people
```

### Pour une page Industrie Santé

```
Abstract medical data visualization, DNA helix merging with secure network nodes,
soft blue and white color palette suggesting trust and care,
subtle cross pattern, clean professional healthcare aesthetic,
space for text on left third, no faces or medical equipment
```
