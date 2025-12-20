import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Logo du footer (optionnel)',
      },
    },
    {
      name: 'columns',
      type: 'array',
      label: 'Colonnes',
      labels: {
        singular: 'Colonne',
        plural: 'Colonnes',
      },
      maxRows: 5,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
          admin: {
            description: 'Titre de la colonne (ex: Produit, Secteurs...)',
          },
        },
        {
          name: 'links',
          type: 'array',
          label: 'Liens',
          labels: {
            singular: 'Lien',
            plural: 'Liens',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              localized: true,
            },
            link({
              appearances: false,
              disableLabel: true,
            }),
          ],
        },
      ],
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/ColumnRowLabel#ColumnRowLabel',
        },
      },
    },
    {
      name: 'bottomBar',
      type: 'group',
      label: 'Barre inférieure',
      fields: [
        {
          name: 'copyright',
          type: 'text',
          localized: true,
          defaultValue: '© 2025 Matsiya',
          admin: {
            description: 'Texte de copyright',
          },
        },
        {
          name: 'badges',
          type: 'array',
          label: 'Badges de confiance',
          labels: {
            singular: 'Badge',
            plural: 'Badges',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              localized: true,
              admin: {
                description: 'Ex: Hébergé en France, Conforme RGPD',
              },
            },
            {
              name: 'icon',
              type: 'text',
              admin: {
                description: "Emoji ou nom d'icône (optionnel)",
              },
            },
          ],
        },
        {
          name: 'socialLinks',
          type: 'array',
          label: 'Réseaux sociaux',
          labels: {
            singular: 'Réseau social',
            plural: 'Réseaux sociaux',
          },
          fields: [
            {
              name: 'platform',
              type: 'select',
              required: true,
              options: [
                { label: 'LinkedIn', value: 'linkedin' },
                { label: 'GitHub', value: 'github' },
                { label: 'Twitter/X', value: 'twitter' },
                { label: 'YouTube', value: 'youtube' },
                { label: 'Instagram', value: 'instagram' },
              ],
            },
            {
              name: 'url',
              type: 'text',
              required: true,
              label: 'URL',
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
