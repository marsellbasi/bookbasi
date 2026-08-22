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
      description: 'Required for published imagery. Describe the visually important subject or moment concisely.',
      validation: (rule) => rule.required().max(180),
    }),
    defineField({name: 'caption', title: 'Caption', type: 'string', validation: (rule) => rule.max(200)}),
    defineField({
      name: 'category',
      title: 'Featured work category',
      type: 'string',
      description: 'Optional editorial category used to balance the homepage selection.',
      options: {list: [
        {title: 'Event Coverage', value: 'events'},
        {title: 'Team Headshots', value: 'headshots'},
        {title: 'Personal Branding', value: 'branding'},
        {title: 'Portraits', value: 'portraits'},
      ]},
    }),
    defineField({name: 'displayOrder', title: 'Display priority', type: 'number', validation: (rule) => rule.integer().min(0)}),
    defineField({
      name: 'orientationHint',
      title: 'Homepage orientation',
      type: 'string',
      description: 'Optional layout hint. The authored crop and hotspot remain authoritative.',
      options: {list: [
        {title: 'Portrait', value: 'portrait'},
        {title: 'Landscape', value: 'landscape'},
        {title: 'Square', value: 'square'},
      ], layout: 'radio'},
    }),
  ],
})
