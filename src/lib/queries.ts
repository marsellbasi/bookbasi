export const settingsQuery = `*[_type == "siteSettings"][0]{
  siteTitle,
  siteDescription,
  "primaryCta": primaryCta{label, destination},
  bookingDestination,
  email,
  phone,
  instagramUrl,
  serviceArea,
  footerText,
  defaultSeoTitle,
  defaultSeoDescription,
  "socialImageUrl": socialImage.asset->url
}`

export const homeQuery = `*[_type == "homePage"][0]{
  eyebrow,
  headline,
  supportingCopy,
  "primaryCta": primaryCta{label, destination},
  "secondaryCta": secondaryCta{label, destination},
  introduction,
  presenceStatement,
  trustHeading,
  trustCopy,
  "trustPoints": trustPoints[]{title, description},
  showWork,
  showTrust,
  showTestimonials,
  workHeading,
  workCopy,
  "selectedWork": selectedWork[]{
    alt,
    caption,
    "url": asset->url,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height
  },
  closingHeading,
  closingCopy,
  "seoTitle": seo.title,
  "seoDescription": seo.description
}`

export const servicesQuery = `*[_type == "service" && defined(slug.current)] | order(displayOrder asc){
  _id,
  title,
  "slug": slug.current,
  shortTitle,
  shortDescription,
  "longDescription": pt::text(longDescription),
  category,
  pricingLabel,
  duration,
  deliverables,
  bookingCtaLabel,
  bookingUrl,
  featured,
  displayOrder,
  seoTitle,
  seoDescription,
  active
}`

export const actionsQuery = `*[_type == "linkAction" && active == true] | order(displayOrder asc){
  _id,
  title,
  subtitle,
  url,
  icon,
  variant,
  displayOrder
}`

export const testimonialsQuery = `*[_type == "testimonial" && active == true] | order(displayOrder asc){
  _id,
  quote,
  name,
  context
}`
