import {getCliClient} from 'sanity/cli'

const PROJECT_ID = 'spjfohj1'
const DATASET = 'production'
const API_VERSION = '2026-08-01'
const dryRun = process.argv.includes('--dry-run')

const client = getCliClient({apiVersion: API_VERSION})
const config = client.config()

if (config.projectId !== PROJECT_ID || config.dataset !== DATASET) {
  throw new Error(`Refusing to seed ${config.projectId}/${config.dataset}; expected ${PROJECT_ID}/${DATASET}.`)
}

const bookingDestination = 'mailto:info@everythingbasi.com?subject=Book%20BASI%20Inquiry'

const documents = [
  {
    _id: 'siteSettings',
    _type: 'siteSettings',
    values: {
      siteTitle: 'Book BASI',
      siteDescription: 'Professional photography for events, teams, brands, and people in Metro Atlanta.',
      primaryCta: {_type: 'callToAction', label: 'Book BASI', destination: bookingDestination},
      bookingDestination,
      email: 'info@everythingbasi.com',
      instagramUrl: 'https://www.instagram.com/book.basi/',
      serviceArea: 'Metro Atlanta',
      footerText: 'The Foundation of Presence.',
      defaultSeoTitle: 'Book BASI | Atlanta Event Photography, Headshots & Branding',
      defaultSeoDescription: 'Professional photography for events, teams, brands, and portraits in Metro Atlanta. Book BASI for event coverage, headshots, branding, and portrait sessions.',
    },
  },
  {
    _id: 'homePage',
    _type: 'homePage',
    values: {
      eyebrow: 'The Foundation of Presence',
      headline: 'Make your presence visible.',
      supportingCopy: 'Professional photography for events, teams, brands, and people.',
      primaryCta: {_type: 'callToAction', label: 'Book BASI', destination: bookingDestination},
      secondaryCta: {_type: 'callToAction', label: 'Explore Services', destination: '#services'},
      chooserEyebrow: 'Start here',
      chooserHeading: 'Choose your next step',
      servicesEyebrow: 'Services',
      servicesHeading: 'Photography built around how you show up.',
      introduction: 'Choose the service that fits your moment, team, brand, or individual presence.',
      presenceStatement: 'BASI means foundation. We create the visual foundation for how you show up.',
      trustHeading: 'A clear, professional process.',
      trustCopy: 'From the first conversation through final delivery, the experience is built to be organized, intentional, and reliable.',
      trustPoints: [
        {_key: 'professional-process', _type: 'trustPoint', title: 'Professional process', description: 'Clear communication and an organized experience from inquiry through delivery.'},
        {_key: 'visual-consistency', _type: 'trustPoint', title: 'Visual consistency', description: 'Images designed to work together across your professional presence.'},
        {_key: 'real-world-use', _type: 'trustPoint', title: 'Built for real-world use', description: 'Photography prepared for websites, social media, marketing, teams, and campaigns.'},
        {_key: 'reliable-delivery', _type: 'trustPoint', title: 'Reliable delivery', description: 'Clear expectations, professional editing, and defined turnaround times.'},
      ],
      showWork: true,
      showTrust: true,
      showTestimonials: true,
      workHeading: 'Selected work',
      workCopy: 'A focused look at BASI across events, teams, brands, and portraits.',
      closingHeading: 'Ready to build your presence?',
      closingCopy: 'Tell us what you are planning and we will help identify the right service.',
      contactHeading: 'Start the conversation.',
      contactCopy: 'Share the service, timing, and essential details for what you are planning.',
      seo: {
        _type: 'seo',
        title: 'Book BASI | Atlanta Event Photography, Headshots & Branding',
        description: 'Professional photography for events, teams, brands, and portraits in Metro Atlanta. Book BASI for event coverage, headshots, branding, and portrait sessions.',
      },
    },
  },
  ...[
    ['event-coverage', 'Event Coverage', 'Event Coverage', 'Professional coverage focused on the moments, people, and details that define your event.', 'events', undefined, '2-hour minimum', ['Professional edited gallery', '5–7 business day delivery', '50% deposit'], 'Request Event Coverage', true, 1],
    ['team-headshots', 'Team Headshots', 'Team Headshots', 'Consistent, professional headshots that help your team present itself with confidence.', 'business', undefined, '5-person minimum', ['1 professionally retouched image per person', '5–7 business day turnaround after selections; 7–10 business days for larger teams', '50% deposit'], 'Plan Team Headshots', true, 2],
    ['personal-branding', 'Personal Branding', 'Personal Branding', 'A focused image library built around your work, personality, and professional presence.', 'branding', '$600', '90 minutes', ['10 edited images'], 'Book Personal Branding', true, 3],
    ['studio-portraits', 'Studio Portraits', 'Studio Portraits', 'Intentional portraits created in a controlled studio setting.', 'portraits', '$250', '60 minutes', ['3 edited images'], 'Book Studio Portraits', false, 4],
    ['outdoor-portraits', 'Outdoor Portraits', 'Outdoor Portraits', 'Natural-location portraits designed around environment, personality, and presence.', 'portraits', '$325', '75 minutes', ['3 edited images'], 'Book Outdoor Portraits', false, 5],
  ].map(([slug, title, shortTitle, shortDescription, category, pricingLabel, duration, deliverables, bookingCtaLabel, featured, displayOrder]) => ({
    _id: `service.${slug}`,
    _type: 'service',
    values: {title, slug: {_type: 'slug', current: slug}, shortTitle, shortDescription, category, pricingLabel, duration, deliverables, bookingCtaLabel, featured, displayOrder, active: true},
  })),
  ...[
    ['event-coverage', 'Event Coverage', 'Capture the full experience.', '#events', 'primary', 1],
    ['team-headshots', 'Team Headshots', 'A consistent presence for your team.', '#headshots', 'secondary', 2],
    ['personal-branding', 'Personal Branding', 'Build a stronger visual presence.', '#branding', 'secondary', 3],
    ['portrait-sessions', 'Portrait Sessions', 'Studio and outdoor options.', '#portraits', 'secondary', 4],
    ['view-work', 'View Work', 'See a focused selection', '#work', 'quiet', 5],
    ['contact-basi', 'Contact BASI', 'Start a conversation', '#contact', 'quiet', 6],
    ['instagram', 'Instagram', '@book.basi', 'https://www.instagram.com/book.basi/', 'quiet', 7],
  ].map(([id, title, subtitle, url, variant, displayOrder]) => ({
    _id: `action.${id}`,
    _type: 'linkAction',
    values: {title, subtitle, url, variant, displayOrder, active: true},
  })),
] as Array<{_id: string; _type: string; values: Record<string, unknown>}>

const existing = await client.fetch<Array<{_id: string}>>(
  '*[_id in $ids]{_id}',
  {ids: documents.map((document) => document._id)},
)

console.log(`${dryRun ? 'Dry run' : 'Seed'}: ${documents.length} canonical documents; ${existing.length} already exist.`)

if (!dryRun) {
  for (const document of documents) {
    await client.createIfNotExists({_id: document._id, _type: document._type})
    await client.patch(document._id).set(document.values).commit()
  }
  console.log(`Updated approved content in ${PROJECT_ID}/${DATASET}. Media and unrelated fields were preserved.`)
}
