import type { Block } from 'payload'

export const FeatureGrid: Block = {
  slug: 'featureGrid',
  interfaceName: 'FeatureGridBlock',
  labels: {
    singular: 'Grille de Features',
    plural: 'Grilles de Features',
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
      name: 'features',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 12,
      labels: {
        singular: 'Feature',
        plural: 'Features',
      },
      fields: [
        {
          name: 'icon',
          type: 'select',
          required: true,
          label: 'Icône',
          options: [
            { label: 'Brain (IA)', value: 'brain' },
            { label: 'Database', value: 'database' },
            { label: 'Cloud', value: 'cloud' },
            { label: 'Shield (Sécurité)', value: 'shield' },
            { label: 'Users', value: 'users' },
            { label: 'Zap (Performance)', value: 'zap' },
            { label: 'Code', value: 'code' },
            { label: 'Globe', value: 'globe' },
            { label: 'Lock', value: 'lock' },
            { label: 'Layers', value: 'layers' },
            { label: 'Settings', value: 'settings' },
            { label: 'Chart', value: 'chart' },
          ],
        },
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
      ],
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      label: 'Nombre de colonnes',
      options: [
        { label: '2 colonnes', value: '2' },
        { label: '3 colonnes', value: '3' },
        { label: '4 colonnes', value: '4' },
      ],
    },
  ],
}
