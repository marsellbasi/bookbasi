import assert from 'node:assert/strict'
import {test} from 'node:test'
import {resolveAnnouncement} from './announcement.ts'

const campaign = {
  enabled: true,
  label: 'BASI SPOOKY SEASON',
  message: 'Halloween Studio Sessions from $99',
  supportingText: 'Sessions through Oct. 25',
  ctaLabel: 'View Special',
  ctaUrl: 'https://everythingbasi.com/promotions/halloween/',
  openInNewTab: false,
  theme: 'gold',
}

test('renders an enabled, complete announcement', () => {
  assert.deepEqual(resolveAnnouncement(campaign), {
    label: 'BASI SPOOKY SEASON',
    message: 'Halloween Studio Sessions from $99',
    supportingText: 'Sessions through Oct. 25',
    cta: {label: 'View Special', url: 'https://everythingbasi.com/promotions/halloween/', openInNewTab: false},
    theme: 'gold',
  })
})

test('renders nothing when disabled, absent, or missing its message', () => {
  assert.equal(resolveAnnouncement({...campaign, enabled: false}), undefined)
  assert.equal(resolveAnnouncement({...campaign, enabled: null}), undefined)
  assert.equal(resolveAnnouncement(null), undefined)
  assert.equal(resolveAnnouncement(undefined), undefined)
  assert.equal(resolveAnnouncement({...campaign, message: '   '}), undefined)
})

test('collapses optional supporting text and label', () => {
  const resolved = resolveAnnouncement({...campaign, supportingText: '', label: null})
  assert.equal(resolved?.supportingText, undefined)
  assert.equal(resolved?.label, undefined)
})

test('omits the link when the CTA is missing or unsafe', () => {
  assert.equal(resolveAnnouncement({...campaign, ctaUrl: ''})?.cta, undefined)
  assert.equal(resolveAnnouncement({...campaign, ctaLabel: ''})?.cta, undefined)
  assert.equal(resolveAnnouncement({...campaign, ctaUrl: 'javascript:alert(1)'})?.cta, undefined)
  assert.equal(resolveAnnouncement({...campaign, ctaUrl: 'http://example.com'})?.cta, undefined)
  assert.equal(resolveAnnouncement({...campaign, ctaUrl: '//example.com'})?.cta, undefined)
  assert.equal(resolveAnnouncement({...campaign, ctaUrl: '/privacy'})?.cta?.url, '/privacy')
})

test('constrains theme to gold or dark', () => {
  assert.equal(resolveAnnouncement({...campaign, theme: 'dark'})?.theme, 'dark')
  assert.equal(resolveAnnouncement({...campaign, theme: 'neon'})?.theme, 'gold')
})
