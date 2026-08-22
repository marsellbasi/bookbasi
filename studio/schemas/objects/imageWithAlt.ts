import {defineField, defineType} from 'sanity'

export const imageWithAltType = defineType({
  name: 'imageWithAlt',
  title: 'Image',
  type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Alternative text',
      type: 'string',
      description: 'Describe the image for people who cannot see it. Leave empty only when decorative.',
      validation: (rule) => rule.max(180),
    }),
    defineField({name: 'caption', title: 'Caption', type: 'string', validation: (rule) => rule.max(200)}),
  ],
})
