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

const approvedServiceCards = [
  {_key: 'event-coverage', _type: 'serviceCard', internalName: 'Event Coverage', title: 'Event Coverage', description: 'Capture the people, energy, and moments that make your event worth remembering.', ctaLabel: 'Explore Event Coverage', ctaUrl: 'https://everythingbasi.com/events/', isActive: true},
  {_key: 'team-headshots', _type: 'serviceCard', internalName: 'Team Headshots', title: 'Team Headshots', description: 'Create a consistent, professional presence across your team.', ctaLabel: 'Explore Team Headshots', ctaUrl: 'https://everythingbasi.com/atlanta-business-headshots/', isActive: true},
  {_key: 'personal-branding', _type: 'serviceCard', internalName: 'Personal Branding', title: 'Personal Branding', description: 'Build a versatile visual foundation for your business, content, and ideas.', ctaLabel: 'Explore Personal Branding', ctaUrl: 'https://everythingbasi.com/book/branding/', isActive: true},
  {_key: 'portrait-sessions', _type: 'serviceCard', internalName: 'Portrait Sessions', title: 'Portrait Sessions', description: 'Create intentional portraits that feel polished, personal, and distinctly you.', ctaLabel: 'Explore Portrait Sessions', ctaUrl: 'https://everythingbasi.com/portraits/', isActive: true},
]

const documents = [
  {
    _id: 'siteSettings',
    _type: 'siteSettings',
    values: {
      siteTitle: 'Book BASI',
      siteDescription: 'Professional photography for events, teams, brands, and people in Metro Atlanta.',
      primaryCta: {_type: 'callToAction', label: 'Book BASI', destination: '#services'},
      bookingDestination,
      email: 'info@everythingbasi.com',
      instagramUrl: 'https://www.instagram.com/book.basi/',
      serviceArea: 'Metro Atlanta',
      footerText: 'The Foundation of Presence.',
      defaultSeoTitle: 'Book BASI | Atlanta Photography Services',
      defaultSeoDescription: 'Choose BASI photography services for event coverage, team headshots, personal branding, and portraits in Metro Atlanta.',
    },
  },
  {
    _id: 'homePage',
    _type: 'homePage',
    setIfMissing: {serviceCards: approvedServiceCards},
    values: {
      eyebrow: 'The Foundation of Presence',
      headline: 'Make your presence visible.',
      supportingCopy: 'Professional photography for events, teams, brands, and people.',
      primaryCta: {_type: 'callToAction', label: 'Book BASI', destination: '#services'},
      secondaryCta: {_type: 'callToAction', label: 'View Work', destination: 'https://everythingbasi.com/portfolio/'},
      chooserEyebrow: 'START HERE',
      chooserHeading: 'How do you need to show up?',
      chooserCopy: 'Every need looks different. Start with the service that fits the way you want to be seen.',
      servicesEyebrow: 'Services',
      servicesHeading: 'Photography built around how you show up.',
      introduction: 'Choose the service that fits your moment, team, brand, or individual presence.',
      presenceStatement: 'BASI means foundation. We create the visual foundation for how you show up.',
      trustHeading: 'Why BASI',
      trustCopy: 'A professional experience built around clear communication, consistent imagery, and reliable delivery.',
      trustPoints: [
        {_key: 'professional-process', _type: 'trustPoint', title: 'Professional process', description: 'Clear communication from inquiry through delivery.'},
        {_key: 'visual-consistency', _type: 'trustPoint', title: 'Consistent visual quality', description: 'Imagery designed to work together across your presence.'},
        {_key: 'real-world-use', _type: 'trustPoint', title: 'Built for real-world use', description: 'Photography created for websites, social, marketing, teams, press, and campaigns.'},
      ],
      showWork: true,
      showTrust: true,
      showTestimonials: true,
      workHeading: 'Selected work',
      workCopy: 'A focused look at BASI across events, teams, brands, and portraits.',
      closingHeading: 'Ready to build your presence?',
      closingCopy: 'Choose the service that fits what you need.',
      closingCta: {_type: 'callToAction', label: 'Choose Your Service', destination: '#services'},
      contactHeading: 'Start the conversation.',
      contactCopy: 'Share the service, timing, and essential details for what you are planning.',
      seo: {
        _type: 'seo',
        title: 'Book BASI | Atlanta Photography Services',
        description: 'Choose BASI photography services for event coverage, team headshots, personal branding, and portraits in Metro Atlanta.',
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
    ['view-work', 'View Work', 'Explore the BASI portfolio.', undefined, 'https://everythingbasi.com/portfolio/', 'quiet', 5],
    ['contact-basi', 'Contact BASI', 'Tell us what you are planning.', undefined, 'https://everythingbasi.com/contact/', 'quiet', 6],
    ['instagram', 'Instagram', '@book.basi', undefined, 'https://www.instagram.com/book.basi/', 'quiet', 7],
  ].map(([id, title, subtitle, ctaLabel, url, variant, displayOrder]) => ({
    _id: `action.${id}`,
    _type: 'linkAction',
    values: {title, subtitle, ctaLabel, url, variant, displayOrder, active: true},
  })),
] as Array<{_id: string; _type: string; values: Record<string, unknown>; setIfMissing?: Record<string, unknown>}>

const existing = await client.fetch<Array<{_id: string}>>(
  '*[_id in $ids]{_id}',
  {ids: documents.map((document) => document._id)},
)

console.log(`${dryRun ? 'Dry run' : 'Seed'}: ${documents.length} canonical documents; ${existing.length} already exist.`)

if (!dryRun) {
  for (const document of documents) {
    await client.createIfNotExists({_id: document._id, _type: document._type})
    let patch = client.patch(document._id).set(document.values)
    if (document.setIfMissing) patch = patch.setIfMissing(document.setIfMissing)
    await patch.commit()
  }
  console.log(`Updated approved content in ${PROJECT_ID}/${DATASET}. Media and unrelated fields were preserved.`)
}
