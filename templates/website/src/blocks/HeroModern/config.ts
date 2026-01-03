import type { Block } from 'payload'

import { linkGroup } from '@/fields/linkGroup'

export const HeroModern: Block = {
  slug: 'heroModern',
  interfaceName: 'HeroModernBlock',
  labels: {
    singular: 'Hero Moderne',
    plural: 'Heros Modernes',
  },
  fields: [
    {
      name: 'badge',
      type: 'text',
      label: 'Badge (optionnel)',
      admin: {
        description: 'Petit texte au-dessus du titre (ex: "Nouveau", "IA Souveraine")',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titre principal',
    },
    {
      name: 'highlightedText',
      type: 'text',
      label: 'Texte surligné (gradient)',
      admin: {
        description: 'Partie du titre avec effet gradient',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Description',
    },
    linkGroup({
      appearances: ['default', 'outline'],
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'trustIndicators',
      type: 'group',
      label: 'Indicateurs de confiance',
      fields: [
        {
          name: 'headline',
          type: 'text',
          label: 'Titre des indicateurs (optionnel)',
          admin: {
            description: 'Ex: "Conforme aux standards européens"',
          },
        },
        {
          name: 'indicators',
          type: 'array',
          label: 'Indicateurs',
          maxRows: 4,
          fields: [
            {
              name: 'icon',
              type: 'select',
              required: true,
              label: 'Icône',
              options: [
                { label: 'Shield (Sécurité)', value: 'shield' },
                { label: 'Globe', value: 'globe' },
                { label: 'Lock', value: 'lock' },
                { label: 'Check', value: 'check' },
                { label: 'Star', value: 'star' },
                { label: 'Zap (Performance)', value: 'zap' },
              ],
            },
            {
              name: 'label',
              type: 'text',
              required: true,
              label: 'Label',
            },
          ],
        },
      ],
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Image de fond (optionnel)',
      admin: {
        description: 'Image de fond avec overlay sombre. Recommandé: 1920x1080 minimum.',
      },
    },
    {
      name: 'backgroundImageOpacity',
      type: 'select',
      label: "Opacité de l'image de fond",
      defaultValue: '20',
      options: [
        { label: '10%', value: '10' },
        { label: '20%', value: '20' },
        { label: '30%', value: '30' },
        { label: '40%', value: '40' },
        { label: '50%', value: '50' },
      ],
      admin: {
        description: 'Visible uniquement si une image de fond est définie',
      },
    },
    {
      name: 'showGridPattern',
      type: 'checkbox',
      defaultValue: true,
      label: 'Afficher le pattern de grille',
    },
    {
      name: 'showGradientOrbs',
      type: 'checkbox',
      defaultValue: true,
      label: 'Afficher les orbes de gradient',
    },
    {
      name: 'showFoundationVisual',
      type: 'checkbox',
      defaultValue: false,
      label: 'Afficher le visuel "Fondation" animé',
      admin: {
        description: 'Triangle animé avec lignes convergentes style Vercel',
      },
    },
  ],
}
