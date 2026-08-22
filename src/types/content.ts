export interface CTA {
  label: string
  destination: string
}

export interface SiteSettings {
  siteTitle: string
  siteDescription: string
  primaryCta: CTA
  bookingDestination: string
  email: string
  phone?: string
  instagramUrl?: string
  serviceArea?: string
  footerText: string
  defaultSeoTitle: string
  defaultSeoDescription: string
  socialImageUrl?: string
}

export interface HomePage {
  eyebrow: string
  headline: string
  supportingCopy: string
  primaryCta: CTA
  secondaryCta: CTA
  heroImage?: WorkImage
  chooserEyebrow: string
  chooserHeading: string
  servicesEyebrow: string
  servicesHeading: string
  introduction: string
  presenceStatement: string
  trustHeading: string
  trustCopy: string
  trustPoints: TrustPoint[]
  showWork: boolean
  showTrust: boolean
  showTestimonials: boolean
  workHeading: string
  workCopy: string
  selectedWork: WorkImage[]
  closingHeading: string
  closingCopy: string
  closingCta: CTA
  contactHeading: string
  contactCopy: string
  seoTitle?: string
  seoDescription?: string
}

export interface TrustPoint {
  title: string
  description: string
}

export interface WorkImage {
  asset?: {_ref: string}
  url: string
  alt: string
  caption?: string
  category?: 'events' | 'headshots' | 'branding' | 'portraits'
  displayOrder?: number
  orientationHint?: 'portrait' | 'landscape' | 'square'
  crop?: {top: number; right: number; bottom: number; left: number}
  hotspot?: {x: number; y: number; height: number; width: number}
  width: number
  height: number
}

export interface Service {
  _id: string
  title: string
  slug: string
  shortTitle: string
  shortDescription: string
  longDescription?: string
  category: string
  pricingLabel?: string
  duration?: string
  deliverables?: string[]
  bookingCtaLabel?: string
  bookingUrl?: string
  featured: boolean
  displayOrder: number
  seoTitle?: string
  seoDescription?: string
  active: boolean
}

export interface LinkAction {
  _id: string
  title: string
  subtitle?: string
  url: string
  icon?: string
  variant: 'primary' | 'secondary' | 'quiet'
  displayOrder: number
}

export interface Testimonial {
  _id: string
  quote: string
  name: string
  context?: string
}
