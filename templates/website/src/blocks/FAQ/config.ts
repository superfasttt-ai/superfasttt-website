import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const FAQ: Block = {
  slug: 'faq',
  interfaceName: 'FAQBlock',
  labels: {
    singular: 'FAQ',
    plural: 'FAQs',
  },
  fields: [
    {
      name: 'badge',
      type: 'text',
      label: 'Badge (optionnel)',
      localized: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Titre de la section',
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description (optionnel)',
      localized: true,
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 20,
      labels: {
        singular: 'Question',
        plural: 'Questions',
      },
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
          label: 'Question',
          localized: true,
        },
        {
          name: 'answer',
          type: 'richText',
          required: true,
          label: 'Réponse',
          localized: true,
          editor: lexicalEditor({
            features: ({ rootFeatures }) => {
              return [
                ...rootFeatures,
                HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
                FixedToolbarFeature(),
                InlineToolbarFeature(),
              ]
            },
          }),
        },
      ],
    },
    {
      name: 'allowMultipleOpen',
      type: 'checkbox',
      label: 'Autoriser plusieurs réponses ouvertes',
      defaultValue: false,
      admin: {
        description: 'Si activé, plusieurs questions peuvent être ouvertes simultanément',
      },
    },
  ],
}
