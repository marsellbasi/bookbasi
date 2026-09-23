import {defineField, defineType} from 'sanity'

const requiredWhenEnabled = (value: unknown, context: {parent?: unknown}) => {
  const enabled = (context.parent as {enabled?: boolean} | undefined)?.enabled === true
  return enabled && !value ? 'Required while the announcement is enabled.' : true
}

export const siteAnnouncementType = defineType({
  name: 'siteAnnouncement',
  title: 'Site Announcement',
  type: 'object',
  description: 'A slim sitewide band shown directly below the header. Turn it off to remove it completely; changes go live after publishing and the automatic site rebuild.',
  fields: [
    defineField({name: 'enabled', title: 'Enabled', type: 'boolean', initialValue: false}),
    defineField({
      name: 'label',
      title: 'Campaign label',
      type: 'string',
      description: 'Short uppercase campaign name, e.g. BASI SPOOKY SEASON.',
      validation: (rule) => rule.max(32).custom(requiredWhenEnabled),
    }),
    defineField({
      name: 'message',
      title: 'Headline / message',
      type: 'string',
      validation: (rule) => rule.max(60).custom(requiredWhenEnabled),
    }),
    defineField({
      name: 'supportingText',
      title: 'Supporting text',
      type: 'string',
      description: 'Optional short detail such as a deadline.',
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA label',
      type: 'string',
      validation: (rule) => rule.max(24).custom(requiredWhenEnabled),
    }),
    defineField({
      name: 'ctaUrl',
      title: 'CTA URL',
      type: 'url',
      description: 'Complete https:// URL or an internal path.',
      validation: (rule) => rule.uri({scheme: ['https'], allowRelative: true}).custom(requiredWhenEnabled),
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open link in a new tab',
      type: 'boolean',
      description: 'Leave off for BASI-owned destinations.',
      initialValue: false,
    }),
    defineField({
      name: 'theme',
      title: 'Style',
      type: 'string',
      options: {
        list: [
          {title: 'Gold', value: 'gold'},
          {title: 'Dark', value: 'dark'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'gold',
    }),
  ],
  preview: {
    select: {label: 'label', message: 'message', enabled: 'enabled'},
    prepare: ({label, message, enabled}) => ({
      title: label || 'Site announcement',
      subtitle: `${enabled ? 'On' : 'Off'}${message ? ` · ${message}` : ''}`,
    }),
  },
})
