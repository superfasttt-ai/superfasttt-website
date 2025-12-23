import type { Block } from 'payload'

import { linkGroup } from '@/fields/linkGroup'

export const ProductShowcase: Block = {
  slug: 'productShowcase',
  interfaceName: 'ProductShowcaseBlock',
  labels: {
    singular: 'Showcase Produit',
    plural: 'Showcases Produit',
  },
  fields: [
    {
      name: 'badge',
      type: 'text',
      label: 'Badge (optionnel)',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titre de la section',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description (optionnel)',
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 6,
      labels: {
        singular: 'Élément',
        plural: 'Éléments',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Titre',
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          label: 'Description',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Image/Illustration',
          admin: {
            description: "Image ou capture d'écran illustrant la fonctionnalité",
          },
        },
        {
          name: 'icon',
          type: 'select',
          label: "Icône/Animation (si pas d'image)",
          admin: {
            description: '🎬 = animation SVG animée, 🔷 = icône statique Lucide',
          },
          options: [
            // Animations SVG (prioritaires)
            { label: '🎬 Brain - Réseau neuronal IA', value: 'brain' },
            { label: '🎬 Assistants - Multi-agents', value: 'users' },
            { label: '🎬 Models - Modèles IA', value: 'layers' },
            { label: '🎬 Connectors - Outils connectés', value: 'cloud' },
            { label: '🎬 Marketing - Contenu créatif', value: 'zap' },
            { label: '🎬 Métier - Données sécurisées', value: 'shield' },
            { label: '🎬 Support - Service client', value: 'headphones' },
            // Icônes statiques Lucide
            { label: '🔷 Database', value: 'database' },
            { label: '🔷 Code', value: 'code' },
            { label: '🔷 Globe', value: 'globe' },
            { label: '🔷 Lock', value: 'lock' },
            { label: '🔷 Settings', value: 'settings' },
            { label: '🔷 Chart', value: 'chart' },
            { label: '🔷 Rocket', value: 'rocket' },
            { label: '🔷 Terminal', value: 'terminal' },
            { label: '🔷 Workflow', value: 'workflow' },
          ],
        },
        {
          name: 'features',
          type: 'array',
          label: 'Points clés (optionnel)',
          maxRows: 4,
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
              label: 'Texte',
            },
          ],
        },
        linkGroup({
          appearances: ['default', 'outline'],
          overrides: {
            name: 'itemLinks',
            maxRows: 1,
            label: 'Lien (optionnel)',
          },
        }),
      ],
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid',
      label: 'Disposition',
      options: [
        { label: 'Grille', value: 'grid' },
        { label: 'Grande carte + petites', value: 'bento' },
        { label: 'Alternée (image/texte)', value: 'alternating' },
      ],
    },
  ],
}
