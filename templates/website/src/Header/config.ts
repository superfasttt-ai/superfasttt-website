import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Logo du site (optionnel)',
      },
    },
    {
      name: 'navItems',
      type: 'array',
      label: 'Navigation',
      labels: {
        singular: 'Item de navigation',
        plural: 'Items de navigation',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
          admin: {
            description: 'Texte affiché dans le menu',
          },
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          defaultValue: 'link',
          options: [
            { label: 'Lien simple', value: 'link' },
            { label: 'Mega-menu', value: 'mega-menu' },
          ],
        },
        link({
          appearances: false,
          overrides: {
            admin: {
              condition: (_, siblingData) => siblingData?.type === 'link',
            },
          },
        }),
        {
          name: 'megaMenu',
          type: 'group',
          label: 'Mega-menu',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'mega-menu',
          },
          fields: [
            {
              name: 'sections',
              type: 'array',
              label: 'Sections',
              labels: {
                singular: 'Section',
                plural: 'Sections',
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  localized: true,
                  admin: {
                    description: 'Titre de la section (optionnel)',
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
                    {
                      name: 'description',
                      type: 'text',
                      localized: true,
                      admin: {
                        description: 'Description courte (optionnel)',
                      },
                    },
                    {
                      name: 'icon',
                      type: 'text',
                      admin: {
                        description: 'Icône ou emoji (optionnel)',
                      },
                    },
                    link({
                      appearances: false,
                      disableLabel: true,
                    }),
                  ],
                },
              ],
            },
          ],
        },
      ],
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'showLanguageSelector',
      type: 'checkbox',
      label: 'Afficher le sélecteur de langue',
      defaultValue: true,
    },
    {
      name: 'ctaButton',
      type: 'group',
      label: 'Bouton CTA',
      fields: [
        {
          name: 'label',
          type: 'text',
          localized: true,
          defaultValue: 'Démo gratuite',
        },
        link({
          appearances: false,
          disableLabel: true,
        }),
      ],
    },
    {
      name: 'loginLink',
      type: 'group',
      label: 'Lien Connexion',
      fields: [
        {
          name: 'label',
          type: 'text',
          localized: true,
          defaultValue: 'Connexion',
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL',
          defaultValue: '/login',
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
