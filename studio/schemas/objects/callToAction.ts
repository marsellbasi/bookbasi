import {defineField, defineType} from 'sanity'

export const callToActionType = defineType({
  name: 'callToAction',
  title: 'Call to Action',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required().max(60)}),
    defineField({
      name: 'destination',
      title: 'Destination',
      type: 'string',
      description: 'Use a homepage anchor such as #contact, an email link, or a complete https:// URL.',
      validation: (rule) =>
        rule.required().custom((value) => {
          if (!value) return true
          return /^(\/|https:\/\/|mailto:|tel:)/.test(value) || 'Use an internal path, HTTPS URL, email, or telephone link.'
        }),
    }),
  ],
  preview: {
    select: {title: 'label', subtitle: 'destination'},
  },
})
