import {sanityClient} from 'sanity:client'
import {fallbackActions, fallbackHome, fallbackServices, fallbackSettings} from '@/data/fallback'
import {actionsQuery, homeQuery, servicesQuery, settingsQuery, testimonialsQuery} from '@/lib/queries'
import {getVisibleServiceCards} from '@/lib/serviceCards'
import type {HomePage, LinkAction, Service, SiteSettings, Testimonial} from '@/types/content'

async function fetchOrFallback<T>(query: string, fallback: T): Promise<T> {
  try {
    const value = await sanityClient.fetch<T | null>(query)
    if (value == null || (Array.isArray(value) && value.length === 0)) return fallback
    return value
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Sanity request error'
    console.warn(`[content] Using local scaffold content: ${message}`)
    return fallback
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const value = await fetchOrFallback<Partial<SiteSettings>>(settingsQuery, {})
  const bookingDestination = normalizeDestination(value.bookingDestination || fallbackSettings.bookingDestination)
  return {
    ...fallbackSettings,
    ...value,
    instagramUrl: value.instagramUrl || fallbackSettings.instagramUrl,
    serviceArea: value.serviceArea || fallbackSettings.serviceArea,
    bookingDestination,
    primaryCta: {
      ...fallbackSettings.primaryCta,
      ...value.primaryCta,
      destination: normalizeDestination(value.primaryCta?.destination || fallbackSettings.primaryCta.destination),
    },
  }
}

export async function getHomePage(): Promise<HomePage> {
  const value = await fetchOrFallback<Partial<HomePage>>(homeQuery, {})
  return {
    ...fallbackHome,
    ...value,
    primaryCta: {...fallbackHome.primaryCta, ...value.primaryCta, destination: normalizeDestination(value.primaryCta?.destination || fallbackHome.primaryCta.destination)},
    secondaryCta: {...fallbackHome.secondaryCta, ...value.secondaryCta, destination: normalizeDestination(value.secondaryCta?.destination || fallbackHome.secondaryCta.destination)},
    closingCta: {...fallbackHome.closingCta, ...value.closingCta, destination: normalizeDestination(value.closingCta?.destination || fallbackHome.closingCta.destination)},
    heroImage: value.heroImage?.url && value.heroImage.alt ? value.heroImage : undefined,
    showWork: value.showWork ?? fallbackHome.showWork,
    showTrust: value.showTrust ?? fallbackHome.showTrust,
    showTestimonials: value.showTestimonials ?? fallbackHome.showTestimonials,
    trustPoints: value.trustPoints?.filter((point) => point?.title && point?.description).length
      ? value.trustPoints.filter((point) => point?.title && point?.description)
      : fallbackHome.trustPoints,
    workHeading: value.workHeading || fallbackHome.workHeading,
    workCopy: value.workCopy || fallbackHome.workCopy,
    serviceCards: Array.isArray(value.serviceCards)
      ? getVisibleServiceCards(value.serviceCards).map((card) => ({...card, ctaUrl: normalizeDestination(card.ctaUrl)}))
      : fallbackHome.serviceCards,
    selectedWork: (value.selectedWork || [])
      .filter((image) => image.url && image.width && image.height && image.alt)
      .sort((a, b) => (a.displayOrder ?? 100) - (b.displayOrder ?? 100))
      .slice(0, 6),
  }
}

export async function getServices(): Promise<Service[]> {
  const published = await fetchOrFallback<Service[]>(servicesQuery, [])
  if (published.length === 0) return fallbackServices

  const bySlug = new Map(fallbackServices.map((service) => [service.slug, service]))
  for (const service of published) {
    const fallback = bySlug.get(service.slug)
    bySlug.set(service.slug, {
      ...fallback,
      ...service,
      deliverables: service.deliverables?.length ? service.deliverables : fallback?.deliverables,
      bookingCtaLabel: service.bookingCtaLabel || fallback?.bookingCtaLabel,
    })
  }
  return [...bySlug.values()].filter((service) => service.active).sort((a, b) => a.displayOrder - b.displayOrder)
}

export async function getActions(): Promise<LinkAction[]> {
  const actions = await fetchOrFallback<LinkAction[]>(actionsQuery, fallbackActions)
  return actions
    .filter((action) => action.variant === 'quiet')
    .map((action) => ({...action, url: normalizeDestination(action.url)}))
}

export function getTestimonials() {
  return fetchOrFallback<Testimonial[]>(testimonialsQuery, [])
}

function normalizeDestination(destination: string) {
  if (/^\/contact(?:[/?#]|$)/.test(destination)) return '#contact'
  if (destination === '/services' || destination === '/services/') return '#services'
  if (/^\/services\/event-coverage/.test(destination)) return '#events'
  if (/^\/services\/team-headshots/.test(destination)) return '#headshots'
  if (/^\/services\/personal-branding/.test(destination)) return '#branding'
  if (/^\/services\/(?:studio|outdoor)-portraits/.test(destination) || destination.startsWith('/services#portraits')) return '#portraits'
  if (/^\/about(?:[/?#]|$)/.test(destination)) return '#why-basi'
  return destination
}
