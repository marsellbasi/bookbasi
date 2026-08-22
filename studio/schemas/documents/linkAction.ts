import {defineField, defineType} from 'sanity'

export const linkActionType = defineType({
  name: 'linkAction',
  title: 'Link / Action',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required().max(80)}),
    defineField({name: 'subtitle', title: 'Short subtitle', type: 'string', validation: (rule) => rule.max(120)}),
    defineField({name: 'url', title: 'URL or site path', type: 'string', validation: (rule) => rule.required().max(500)}),
    defineField({name: 'icon', title: 'Icon identifier', type: 'string', description: 'Optional identifier from the approved site icon set; never executable code.', validation: (rule) => rule.regex(/^[a-z0-9-]*$/i, {name: 'icon identifier'}).max(40)}),
    defineField({name: 'variant', title: 'Style', type: 'string', options: {list: ['primary', 'secondary', 'quiet'], layout: 'radio'}, initialValue: 'secondary', validation: (rule) => rule.required()}),
    defineField({name: 'active', title: 'Active', type: 'boolean', initialValue: true}),
    defineField({name: 'displayOrder', title: 'Display order', type: 'number', initialValue: 100, validation: (rule) => rule.required().integer().min(0)}),
  ],
  orderings: [{title: 'Display order', name: 'displayOrder', by: [{field: 'displayOrder', direction: 'asc'}]}],
  preview: {select: {title: 'title', subtitle: 'url'}},
})
