import type { Block } from 'payload'

export const StatsSection: Block = {
  slug: 'statsSection',
  interfaceName: 'StatsSectionBlock',
  labels: {
    singular: 'Section Statistiques',
    plural: 'Sections Statistiques',
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
      label: 'Titre (optionnel)',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description (optionnel)',
    },
    {
      name: 'stats',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 6,
      labels: {
        singular: 'Statistique',
        plural: 'Statistiques',
      },
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
          label: 'Valeur',
          admin: {
            description: 'Ex: "99.9%", "10M+", "24x", "<50ms"',
          },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Label',
          admin: {
            description: 'Ex: "Uptime", "Utilisateurs", "Plus rapide"',
          },
        },
        {
          name: 'description',
          type: 'text',
          label: 'Description (optionnel)',
          admin: {
            description: 'Texte explicatif supplémentaire',
          },
        },
      ],
    },
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'default',
      label: 'Style',
      options: [
        { label: 'Par défaut', value: 'default' },
        { label: 'Cartes', value: 'cards' },
        { label: 'Gradient', value: 'gradient' },
      ],
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '4',
      label: 'Nombre de colonnes',
      options: [
        { label: '2 colonnes', value: '2' },
        { label: '3 colonnes', value: '3' },
        { label: '4 colonnes', value: '4' },
      ],
    },
  ],
}
