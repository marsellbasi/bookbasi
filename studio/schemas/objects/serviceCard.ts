import {defineField, defineType} from 'sanity'

const validDestination = (value: string | undefined) => {
  if (!value) return true
  if (/^\/(?!\/)/.test(value)) return true

  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol) || 'Use an absolute http(s) URL or a root-relative path beginning with /.'
  } catch {
    return 'Use an absolute http(s) URL or a root-relative path beginning with /.'
  }
}

export const serviceCardType = defineType({
  name: 'serviceCard',
  title: 'Service Card',
  type: 'object',
  fields: [
    defineField({
      name: 'internalName',
      title: 'Internal label',
      type: 'string',
      description: 'Used only in Sanity to help editors identify this card.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => [
        rule.required(),
        rule.max(80).warning('Long titles may wrap more than expected in the approved card layout.'),
      ],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (rule) => [
        rule.required(),
        rule.max(220).warning('Long descriptions may make this card taller than neighboring cards.'),
      ],
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA label',
      type: 'string',
      description: 'The complete visible call-to-action text, including words such as “Explore”.',
      validation: (rule) => [
        rule.required(),
        rule.max(100).warning('Long CTA labels may wrap on small screens.'),
      ],
    }),
    defineField({
      name: 'ctaUrl',
      title: 'CTA destination',
      type: 'string',
      description: 'An absolute http(s) URL or an internal root-relative path beginning with /.',
      validation: (rule) => rule.required().custom(validDestination),
    }),
    defineField({
      name: 'isActive',
      title: 'Visible on Book BASI',
      type: 'boolean',
      description: 'Turn off to hide this card without deleting its content or changing its array position.',
      initialValue: true,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      internalName: 'internalName',
      ctaLabel: 'ctaLabel',
      ctaUrl: 'ctaUrl',
      isActive: 'isActive',
    },
    prepare({title, internalName, ctaLabel, ctaUrl, isActive}) {
      const label = title || internalName || 'Untitled service card'
      const destination = ctaUrl ? ` → ${ctaUrl}` : ''
      return {
        title: isActive === false ? `${label} — Hidden` : label,
        subtitle: isActive === false ? `Hidden · ${ctaLabel || 'No CTA'}${destination}` : `${ctaLabel || 'No CTA'}${destination}`,
      }
    },
  },
})
