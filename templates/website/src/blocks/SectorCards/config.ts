import type { Block } from 'payload'

export const SectorCards: Block = {
  slug: 'sectorCards',
  interfaceName: 'SectorCardsBlock',
  labels: {
    singular: 'Cards Secteurs',
    plural: 'Cards Secteurs',
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
      name: 'sectors',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 8,
      labels: {
        singular: 'Secteur',
        plural: 'Secteurs',
      },
      fields: [
        {
          name: 'icon',
          type: 'select',
          required: true,
          label: 'Icône',
          options: [
            { label: 'Building (Admin)', value: 'building' },
            { label: 'Heart (Santé)', value: 'heart' },
            { label: 'Banknote (Finance)', value: 'banknote' },
            { label: 'Scale (Juridique)', value: 'scale' },
            { label: 'Shield (Défense)', value: 'shieldCheck' },
            { label: 'Briefcase (Enterprise)', value: 'briefcase' },
            { label: 'Factory (Industrie)', value: 'factory' },
            { label: 'Landmark (Gouvernement)', value: 'landmark' },
          ],
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Nom du secteur',
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          label: 'Description',
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
            },
          ],
        },
      ],
    },
  ],
}
