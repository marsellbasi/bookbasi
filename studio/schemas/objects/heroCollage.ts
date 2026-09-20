import {defineField, defineType} from 'sanity'

export const heroCollageType = defineType({
  name: 'heroCollage',
  title: 'Hero Collage',
  type: 'object',
  description: 'Three real BASI photographs. The event image is visually dominant; the collage renders only when all three are published with alt text.',
  fields: [
    defineField({
      name: 'event',
      title: 'Event coverage image',
      type: 'imageWithAlt',
      description: 'The dominant image. Landscape framing works best; the hotspot controls the desktop crop.',
    }),
    defineField({
      name: 'headshot',
      title: 'Headshot image',
      type: 'imageWithAlt',
      description: 'Portrait framing (4:5).',
    }),
    defineField({
      name: 'portrait',
      title: 'Portrait / personal branding image',
      type: 'imageWithAlt',
      description: 'Portrait framing (4:5).',
    }),
  ],
  preview: {
    select: {event: 'event.alt', headshot: 'headshot.alt', portrait: 'portrait.alt'},
    prepare({event, headshot, portrait}) {
      const count = [event, headshot, portrait].filter(Boolean).length
      return {title: 'Hero collage', subtitle: count === 3 ? 'Complete — 3 of 3 images' : `Incomplete — ${count} of 3 images`}
    },
  },
})
