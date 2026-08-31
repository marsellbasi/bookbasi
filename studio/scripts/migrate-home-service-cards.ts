import {getCliClient} from 'sanity/cli'

const PROJECT_ID = 'spjfohj1'
const DATASET = 'production'
const API_VERSION = '2026-08-01'
const dryRun = process.argv.includes('--dry-run')
const force = process.argv.includes('--force')

const client = getCliClient({apiVersion: API_VERSION})
const config = client.config()

if (config.projectId !== PROJECT_ID || config.dataset !== DATASET) {
  throw new Error(`Refusing to migrate ${config.projectId}/${config.dataset}; expected ${PROJECT_ID}/${DATASET}.`)
}

const serviceCards = [
  {
    _key: 'event-coverage',
    _type: 'serviceCard',
    internalName: 'Event Coverage',
    title: 'Event Coverage',
    description: 'Capture the people, energy, and moments that make your event worth remembering.',
    ctaLabel: 'Explore Event Coverage',
    ctaUrl: 'https://everythingbasi.com/events/',
    isActive: true,
  },
  {
    _key: 'team-headshots',
    _type: 'serviceCard',
    internalName: 'Team Headshots',
    title: 'Team Headshots',
    description: 'Create a consistent, professional presence across your team.',
    ctaLabel: 'Explore Team Headshots',
    ctaUrl: 'https://everythingbasi.com/atlanta-business-headshots/',
    isActive: true,
  },
  {
    _key: 'personal-branding',
    _type: 'serviceCard',
    internalName: 'Personal Branding',
    title: 'Personal Branding',
    description: 'Build a versatile visual foundation for your business, content, and ideas.',
    ctaLabel: 'Explore Personal Branding',
    ctaUrl: 'https://everythingbasi.com/book/branding/',
    isActive: true,
  },
  {
    _key: 'portrait-sessions',
    _type: 'serviceCard',
    internalName: 'Portrait Sessions',
    title: 'Portrait Sessions',
    description: 'Create intentional portraits that feel polished, personal, and distinctly you.',
    ctaLabel: 'Explore Portrait Sessions',
    ctaUrl: 'https://everythingbasi.com/portraits/',
    isActive: true,
  },
]

type ServiceCard = (typeof serviceCards)[number]

const comparableCard = (card: Partial<ServiceCard>) => ({
  _key: card._key,
  _type: card._type,
  internalName: card.internalName,
  title: card.title,
  description: card.description,
  ctaLabel: card.ctaLabel,
  ctaUrl: card.ctaUrl,
  isActive: card.isActive,
})

const homePage = await client.fetch<{serviceCards?: Array<Partial<ServiceCard>> | null} | null>(
  '*[_id == "homePage" && _type == "homePage"][0]{serviceCards}',
)

if (!homePage) throw new Error('The canonical homePage document does not exist.')

if (homePage.serviceCards != null && !force) {
  if (JSON.stringify(homePage.serviceCards.map(comparableCard)) === JSON.stringify(serviceCards.map(comparableCard))) {
    console.log('Home Page service cards already match the approved migration data. No changes needed.')
    process.exit(0)
  }

  throw new Error('Home Page already has service cards. Refusing to overwrite editor-managed data without --force.')
}

console.log(`${dryRun ? 'Dry run' : 'Migration'}: set ${serviceCards.length} ordered service cards on homePage.`)

if (!dryRun) {
  await client.patch('homePage').set({serviceCards}).commit()
  console.log(`Migrated approved service cards in ${PROJECT_ID}/${DATASET}.`)
}
