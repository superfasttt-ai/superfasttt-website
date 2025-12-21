import type { Block } from 'payload'

export const LogoCloud: Block = {
  slug: 'logoCloud',
  interfaceName: 'LogoCloudBlock',
  labels: {
    singular: 'Logo Cloud',
    plural: 'Logo Clouds',
  },
  fields: [
    {
      name: 'headline',
      type: 'text',
      label: 'Titre (optionnel)',
      admin: {
        description: 'Ex: "Ils nous font confiance" ou "Utilisé par les meilleures équipes"',
      },
    },
    {
      name: 'logos',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 12,
      labels: {
        singular: 'Logo',
        plural: 'Logos',
      },
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Image du logo',
          admin: {
            description: 'Recommandé: SVG ou PNG transparent, hauteur max 40px',
          },
        },
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Nom de la marque',
          admin: {
            description: "Pour l'accessibilité (attribut alt)",
          },
        },
        {
          name: 'url',
          type: 'text',
          label: 'Lien (optionnel)',
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
        { label: 'Avec fond', value: 'withBackground' },
        { label: 'Défilement infini', value: 'marquee' },
      ],
    },
    {
      name: 'grayscale',
      type: 'checkbox',
      defaultValue: true,
      label: 'Logos en niveaux de gris',
      admin: {
        description: 'Les logos deviennent colorés au survol',
      },
    },
  ],
}
