import type {SiteAnnouncement} from '@/types/content'

export interface AnnouncementInput {
  enabled?: boolean | null
  label?: string | null
  message?: string | null
  supportingText?: string | null
  ctaLabel?: string | null
  ctaUrl?: string | null
  openInNewTab?: boolean | null
  theme?: string | null
}

const text = (value: unknown) => (typeof value === 'string' ? value.trim() : '')

const leadingEmoji = /^(\p{Extended_Pictographic}️?(?:‍\p{Extended_Pictographic}️?)*)\s*(.*)$/u

function isSafeUrl(url: string) {
  if (/^\/(?!\/)/.test(url) || url.startsWith('#')) return true
  try {
    return new URL(url).protocol === 'https:'
  } catch {
    return false
  }
}

/** Returns a renderable announcement, or undefined when it is disabled, absent, or malformed. */
export function resolveAnnouncement(input: AnnouncementInput | null | undefined): SiteAnnouncement | undefined {
  if (!input || typeof input !== 'object' || input.enabled !== true) return undefined

  const message = text(input.message)
  if (!message) return undefined

  const ctaLabel = text(input.ctaLabel)
  const ctaUrl = text(input.ctaUrl)
  // A leading emoji in the label renders as a separate decorative accent.
  const [, accent, label] = text(input.label).match(leadingEmoji) ?? [, '', text(input.label)]

  return {
    ...(accent ? {accent} : {}),
    label: label || undefined,
    message,
    supportingText: text(input.supportingText) || undefined,
    cta: ctaLabel && ctaUrl && isSafeUrl(ctaUrl) ? {label: ctaLabel, url: ctaUrl, openInNewTab: input.openInNewTab === true} : undefined,
    theme: input.theme === 'dark' ? 'dark' : 'gold',
  }
}
