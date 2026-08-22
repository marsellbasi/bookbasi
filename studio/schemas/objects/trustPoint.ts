import {defineField, defineType} from 'sanity'

export const trustPointType = defineType({
  name: 'trustPoint',
  title: 'Trust Point',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Customer outcome', type: 'string', validation: (rule) => rule.required().max(90)}),
    defineField({name: 'description', title: 'Supporting detail', type: 'string', validation: (rule) => rule.required().max(160)}),
  ],
  preview: {select: {title: 'title', subtitle: 'description'}},
})
