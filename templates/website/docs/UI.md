# Guide d'utilisation des composants UI

Ce document décrit les bonnes pratiques pour utiliser les composants UI de l'application, en particulier les **Sheets** de shadcn/ui.

## Sheets (Panneaux latéraux)

Les Sheets sont des panneaux qui s'ouvrent sur le côté de l'écran pour afficher du contenu supplémentaire (formulaires, détails, etc.).

### Structure de base

```tsx
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@superfasttt/ui'

;<Sheet open={open} onOpenChange={onOpenChange}>
  <SheetContent className="sm:max-w-[540px] flex flex-col p-6">
    <SheetHeader className="px-0">
      <SheetTitle>Titre de la sheet</SheetTitle>
      <SheetDescription>Description de la sheet</SheetDescription>
    </SheetHeader>

    <div className="flex-1 overflow-y-auto -mx-6 px-6 space-y-6 mt-6">
      {/* Contenu scrollable ici */}
    </div>

    <div className="border-t pt-4 -mx-6 px-6">{/* Footer avec boutons d'action */}</div>
  </SheetContent>
</Sheet>
```

### Explication de la structure

#### 1. SheetContent

```tsx
<SheetContent className="sm:max-w-[540px] flex flex-col p-6">
```

- **`flex flex-col`** : Structure flexbox en colonne pour organiser header, contenu et footer
- **`p-6`** : Padding uniforme de 24px sur tous les côtés
- **`sm:max-w-[540px]`** : Largeur maximale sur écrans moyens et grands

#### 2. SheetHeader

```tsx
<SheetHeader className="px-0">
```

- **`px-0`** : Supprime le padding horizontal car déjà géré par le parent
- Contient le titre et la description
- Reste fixe en haut (ne scroll pas)

#### 3. Zone de contenu scrollable

```tsx
<div className="flex-1 overflow-y-auto -mx-6 px-6 space-y-6 mt-6">
```

- **`flex-1`** : Prend tout l'espace disponible entre header et footer
- **`overflow-y-auto`** : Active le scroll vertical si nécessaire
- **`-mx-6`** : Marges négatives pour annuler le padding du parent
- **`px-6`** : Réapplique le padding pour aligner le contenu
- **`space-y-6`** : Espacement vertical entre les éléments
- **`mt-6`** : Marge top pour espacer du header

💡 **Pourquoi `-mx-6 px-6` ?**

- Les marges négatives permettent au scrollbar de s'étendre jusqu'aux bords
- Le padding réappliqué maintient l'alignement du contenu avec le header

#### 4. Footer

```tsx
<div className="border-t pt-4 -mx-6 px-6">
```

- **`border-t`** : Bordure supérieure pour séparer du contenu
- **`pt-4`** : Padding top de 16px
- **`-mx-6 px-6`** : Même technique que le contenu pour que le border s'étende sur toute la largeur

### Exemple complet : Sheet avec formulaire

```tsx
'use client'

import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Button,
  Input,
  Label,
} from '@superfasttt/ui'

interface MySheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MySheet({ open, onOpenChange }: MySheetProps) {
  const [formData, setFormData] = useState({ name: '', email: '' })

  const handleSave = () => {
    console.log('Save:', formData)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[540px] flex flex-col p-6">
        <SheetHeader className="px-0">
          <SheetTitle>Créer un utilisateur</SheetTitle>
          <SheetDescription>Remplissez les informations ci-dessous</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto -mx-6 px-6 space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nom</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div className="border-t pt-4 -mx-6 px-6">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formData.name || !formData.email}
              className="flex-1"
            >
              Enregistrer
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
```

### ❌ Erreurs courantes à éviter

#### 1. Ne pas wrapper le SheetHeader

```tsx
❌ Incorrect
<div className="px-6 pt-6">
  <SheetHeader>
    ...
  </SheetHeader>
</div>

✅ Correct
<SheetHeader className="px-0">
  ...
</SheetHeader>
```

#### 2. Oublier les marges négatives sur le contenu scrollable

```tsx
❌ Incorrect
<div className="flex-1 overflow-y-auto px-6">
  {/* Le scrollbar sera décalé */}
</div>

✅ Correct
<div className="flex-1 overflow-y-auto -mx-6 px-6">
  {/* Le scrollbar touche les bords */}
</div>
```

#### 3. Utiliser `p-0` sans réappliquer le padding

```tsx
❌ Incorrect
<SheetContent className="sm:max-w-[540px] flex flex-col p-0">
  {/* Tout touche les bords */}
</SheetContent>

✅ Correct
<SheetContent className="sm:max-w-[540px] flex flex-col p-6">
  {/* Padding uniforme */}
</SheetContent>
```

### Points clés à retenir

1. ✅ Toujours utiliser `p-6` sur `SheetContent`
2. ✅ Toujours utiliser `px-0` sur `SheetHeader`
3. ✅ Toujours utiliser `-mx-6 px-6` sur le contenu scrollable et le footer
4. ✅ Utiliser `flex flex-col` pour organiser header, contenu et footer
5. ✅ Le contenu scrollable doit avoir `flex-1 overflow-y-auto`

### Référence

Pour plus d'informations, consultez la documentation officielle de shadcn/ui :

- [Sheet Component](https://ui.shadcn.com/docs/components/sheet)
