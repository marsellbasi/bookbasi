import {defineField, defineType} from 'sanity'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  initialValue: {
    siteTitle: 'Book BASI',
    email: 'info@everythingbasi.com',
    instagramUrl: 'https://www.instagram.com/book.basi/',
    serviceArea: 'Metro Atlanta',
    bookingDestination: 'mailto:info@everythingbasi.com?subject=Book%20BASI%20Inquiry',
  },
  groups: [
    {name: 'identity', title: 'Identity', default: true},
    {name: 'contact', title: 'Contact'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'siteTitle', title: 'Site title', type: 'string', group: 'identity', validation: (rule) => rule.required()}),
    defineField({name: 'siteDescription', title: 'Site description', type: 'text', rows: 3, group: 'identity', validation: (rule) => rule.required().max(180)}),
    defineField({name: 'primaryLogo', title: 'Primary logo', type: 'imageWithAlt', group: 'identity'}),
    defineField({name: 'alternateLogo', title: 'Alternate logo', type: 'imageWithAlt', group: 'identity'}),
    defineField({name: 'primaryCta', title: 'Primary CTA', type: 'callToAction', group: 'identity', validation: (rule) => rule.required()}),
    defineField({
      name: 'bookingDestination',
      title: 'Central booking destination',
      type: 'string',
      group: 'contact',
      description: 'The default destination used by booking calls to action across the site.',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'email', title: 'Email', type: 'string', group: 'contact', validation: (rule) => rule.required().email()}),
    defineField({name: 'phone', title: 'Phone', type: 'string', group: 'contact'}),
    defineField({name: 'instagramUrl', title: 'Instagram URL', type: 'url', group: 'contact', validation: (rule) => rule.uri({scheme: ['https']})}),
    defineField({name: 'serviceArea', title: 'Location / service area', type: 'string', group: 'contact'}),
    defineField({name: 'footerText', title: 'Footer text', type: 'string', group: 'identity', validation: (rule) => rule.max(140)}),
    defineField({name: 'defaultSeoTitle', title: 'Default SEO title', type: 'string', group: 'seo', validation: (rule) => rule.required().max(70)}),
    defineField({name: 'defaultSeoDescription', title: 'Default SEO description', type: 'text', rows: 3, group: 'seo', validation: (rule) => rule.required().max(170)}),
    defineField({name: 'socialImage', title: 'Default social image', type: 'imageWithAlt', group: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'Site Settings'})},
})
