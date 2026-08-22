import {defineField, defineType} from 'sanity'

export const seoType = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'SEO title', type: 'string', validation: (rule) => rule.max(70).warning()}),
    defineField({name: 'description', title: 'Meta description', type: 'text', rows: 3, validation: (rule) => rule.max(170).warning()}),
    defineField({name: 'socialImage', title: 'Social image', type: 'imageWithAlt'}),
  ],
})
