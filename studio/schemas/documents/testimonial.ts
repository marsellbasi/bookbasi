import {defineField, defineType} from 'sanity'

export const testimonialType = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({name: 'quote', title: 'Quote', type: 'text', rows: 5, validation: (rule) => rule.required().max(700)}),
    defineField({name: 'name', title: 'Name', type: 'string', validation: (rule) => rule.required().max(100)}),
    defineField({name: 'context', title: 'Role / organization / context', type: 'string', validation: (rule) => rule.max(160)}),
    defineField({name: 'service', title: 'Related service', type: 'reference', to: [{type: 'service'}]}),
    defineField({name: 'active', title: 'Approved and active', type: 'boolean', initialValue: false, description: 'Publish only with permission to use the quote and attribution.'}),
    defineField({name: 'displayOrder', title: 'Display order', type: 'number', initialValue: 100, validation: (rule) => rule.integer().min(0)}),
  ],
  preview: {select: {title: 'name', subtitle: 'context'}},
})
