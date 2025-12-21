import type { Block } from 'payload'

import { linkGroup } from '@/fields/linkGroup'

export const CtaModern: Block = {
  slug: 'ctaModern',
  interfaceName: 'CtaModernBlock',
  labels: {
    singular: 'CTA Moderne',
    plural: 'CTAs Modernes',
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
      label: 'Description',
    },
    linkGroup({
      appearances: ['default', 'outline'],
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'gradient',
      label: 'Style',
      options: [
        { label: 'Gradient (violet/indigo)', value: 'gradient' },
        { label: 'Sombre', value: 'dark' },
        { label: 'Bordure', value: 'bordered' },
      ],
    },
  ],
}
