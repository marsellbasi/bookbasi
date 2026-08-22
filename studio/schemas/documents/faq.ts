import {defineField, defineType} from 'sanity'

export const faqType = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({name: 'question', title: 'Question', type: 'string', validation: (rule) => rule.required().max(180)}),
    defineField({name: 'answer', title: 'Answer', type: 'text', rows: 5, validation: (rule) => rule.required().max(1200)}),
    defineField({name: 'service', title: 'Related service', type: 'reference', to: [{type: 'service'}]}),
    defineField({name: 'active', title: 'Active', type: 'boolean', initialValue: false}),
    defineField({name: 'displayOrder', title: 'Display order', type: 'number', initialValue: 100, validation: (rule) => rule.integer().min(0)}),
  ],
  orderings: [{title: 'Display order', name: 'displayOrder', by: [{field: 'displayOrder', direction: 'asc'}]}],
  preview: {select: {title: 'question'}},
})
