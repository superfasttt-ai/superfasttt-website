# Header & Footer B2B SaaS - Documentation

## Résumé

Implémentation d'une navigation Header/Footer adaptée à un site B2B SaaS international ciblant les secteurs régulés européens.

## Fonctionnalités implémentées

### Internationalisation (i18n)

- **Langues supportées** : Français (défaut), English, Español
- **Configuration** : `payload.config.ts` avec `localization`
- **Fallback** : activé (si traduction manquante → langue par défaut)

### Header

#### Structure dans l'admin Payload

| Champ                  | Type            | Description                      |
| ---------------------- | --------------- | -------------------------------- |
| `logo`                 | Upload (Media)  | Logo personnalisé (optionnel)    |
| `navItems`             | Array           | Items de navigation              |
| `navItems.label`       | Text (localisé) | Texte affiché                    |
| `navItems.type`        | Select          | `link` ou `mega-menu`            |
| `navItems.link`        | Group           | Lien simple (si type=link)       |
| `navItems.megaMenu`    | Group           | Configuration mega-menu          |
| `showLanguageSelector` | Checkbox        | Afficher le sélecteur FR/EN/ES   |
| `ctaButton`            | Group           | Bouton CTA (ex: "Démo gratuite") |
| `loginLink`            | Group           | Lien connexion                   |

#### Mega-menu

Structure du mega-menu (pleine largeur, style Stripe/Linear) :

```
megaMenu
└── sections (array)
    ├── title (text, localisé) - Titre de section optionnel
    └── links (array)
        ├── label (text, localisé)
        ├── description (text, localisé) - Description courte
        ├── icon (text) - Emoji ou icône
        └── link (group) - Référence page/post ou URL custom
```

### Footer

#### Structure dans l'admin Payload

| Champ                   | Type            | Description                           |
| ----------------------- | --------------- | ------------------------------------- |
| `logo`                  | Upload (Media)  | Logo du footer (optionnel)            |
| `columns`               | Array (max 5)   | Colonnes de liens                     |
| `columns.title`         | Text (localisé) | Titre colonne (ex: Produit, Secteurs) |
| `columns.links`         | Array           | Liens de la colonne                   |
| `bottomBar`             | Group           | Barre inférieure                      |
| `bottomBar.copyright`   | Text (localisé) | Copyright                             |
| `bottomBar.badges`      | Array           | Badges de confiance                   |
| `bottomBar.socialLinks` | Array           | Réseaux sociaux                       |

#### Réseaux sociaux supportés

- LinkedIn
- GitHub
- Twitter/X
- YouTube
- Instagram

---

## Fichiers modifiés/créés

### Configuration Payload

| Fichier                 | Action                        |
| ----------------------- | ----------------------------- |
| `src/payload.config.ts` | Ajout i18n (FR/EN/ES)         |
| `src/Header/config.ts`  | Nouvelle structure mega-menus |
| `src/Footer/config.ts`  | Nouvelle structure 5 colonnes |

### Composants Header

| Fichier                                 | Action                                    |
| --------------------------------------- | ----------------------------------------- |
| `src/Header/Component.tsx`              | Inchangé (server component)               |
| `src/Header/Component.client.tsx`       | Support logo dynamique + LanguageSelector |
| `src/Header/Nav/index.tsx`              | Support mega-menus + CTA + Login          |
| `src/Header/MegaMenu/index.tsx`         | **Créé** - Composant mega-menu            |
| `src/Header/LanguageSelector/index.tsx` | **Créé** - Sélecteur de langue            |
| `src/Header/RowLabel.tsx`               | Adapté au nouveau format                  |

### Composants Footer

| Fichier                         | Action                               |
| ------------------------------- | ------------------------------------ |
| `src/Footer/Component.tsx`      | Layout 5 colonnes + bottom bar       |
| `src/Footer/ColumnRowLabel.tsx` | **Créé** - Label pour colonnes admin |
| `src/Footer/RowLabel.tsx`       | **Supprimé** (remplacé)              |

---

## Exemple de configuration Header

### Navigation suggérée

```
Logo | Produit ▾ | Solutions ▾ | Ressources ▾ | Tarifs | Entreprise ▾ | 🌐 FR ▾ | Connexion | [Démo gratuite]
```

### Mega-menu "Produit"

| Section      | Liens                                                     |
| ------------ | --------------------------------------------------------- |
| (sans titre) | Vue d'ensemble, Agents IA & RAG, Apps & Marketplace       |
| Technique    | Intégrations, Sécurité & Souveraineté, API & Développeurs |

### Mega-menu "Solutions"

| Section     | Liens                                                               |
| ----------- | ------------------------------------------------------------------- |
| Par secteur | Administration publique, Santé (HDS), Finance & Assurance           |
|             | Industrie & Défense, Services juridiques, ETI & Grandes entreprises |

---

## Exemple de configuration Footer

### 5 colonnes

| Produit         | Secteurs       | Ressources        | Entreprise  | Légal                        |
| --------------- | -------------- | ----------------- | ----------- | ---------------------------- |
| Fonctionnalités | Secteur public | Documentation API | À propos    | Mentions légales             |
| Tarifs          | Santé          | Blog              | Carrières   | CGU / CGV                    |
| Changelog       | Finance        | Cas clients       | Presse      | Politique de confidentialité |
| Roadmap         | Défense        | Guides            | Contact     | Sécurité & Conformité        |
| Status page     | Industrie      | Communauté        | Partenaires | RGPD                         |

### Bottom bar

```
[Logo] © 2025 Matsiya | 🇫🇷 Hébergé en France | ✓ Conforme RGPD | [LinkedIn] [GitHub] [Twitter]
```

---

## Utilisation dans l'admin

1. Aller sur `http://localhost:3001/admin`
2. Dans le menu latéral, cliquer sur **Globals**
3. Sélectionner **Header** ou **Footer**
4. Utiliser le sélecteur de langue en haut pour éditer chaque version (FR/EN/ES)
5. Sauvegarder

---

## Notes techniques

- Les champs marqués `localized: true` ont une version par langue
- Le mega-menu s'ouvre au survol (hover)
- Le LanguageSelector utilise le routing Next.js pour changer de locale
- Les icônes sociales sont en SVG inline pour éviter les dépendances externes
