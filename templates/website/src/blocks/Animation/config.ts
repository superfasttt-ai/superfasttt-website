import type { Block } from 'payload'

export const Animation: Block = {
  slug: 'animation',
  interfaceName: 'AnimationBlock',
  labels: {
    singular: 'Animation',
    plural: 'Animations',
  },
  fields: [
    {
      name: 'animationId',
      type: 'select',
      required: true,
      label: 'Animation',
      options: [
        { label: 'Brain (Réseau neuronal)', value: 'brain' },
        { label: 'Assistants (Multi-agents)', value: 'assistants' },
        { label: 'Models (Modèles IA)', value: 'models' },
        { label: 'Connectors (Outils connectés)', value: 'connectors' },
        { label: 'Marketing (Contenu créatif)', value: 'marketing' },
        { label: 'R&D (Sécurité)', value: 'rnd' },
        { label: 'Support (Service client)', value: 'support' },
      ],
      admin: {
        description: "Sélectionnez l'animation à afficher",
      },
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'full',
      label: 'Disposition',
      options: [
        { label: 'Pleine largeur', value: 'full' },
        { label: 'Avec texte à gauche', value: 'text-left' },
        { label: 'Avec texte à droite', value: 'text-right' },
        { label: 'Centré (petit)', value: 'centered-small' },
        { label: 'Centré (moyen)', value: 'centered-medium' },
      ],
    },
    {
      name: 'title',
      type: 'text',
      label: 'Titre',
      localized: true,
      admin: {
        condition: (_, { layout }) => layout === 'text-left' || layout === 'text-right',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      localized: true,
      admin: {
        condition: (_, { layout }) => layout === 'text-left' || layout === 'text-right',
      },
    },
    {
      name: 'aspectRatio',
      type: 'select',
      defaultValue: 'video',
      label: "Ratio d'aspect",
      options: [
        { label: '16:9 (Vidéo)', value: 'video' },
        { label: '4:3', value: 'standard' },
        { label: '1:1 (Carré)', value: 'square' },
      ],
    },
  ],
}
