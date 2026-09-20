import {createHash} from 'node:crypto'
import {createReadStream, existsSync, readFileSync, statSync} from 'node:fs'
import {extname, resolve} from 'node:path'
import {getCliClient} from 'sanity/cli'

const PROJECT_ID = 'spjfohj1'
const DATASET = 'production'
const API_VERSION = '2026-08-01'
const HOME_PAGE_ID = 'homePage'
const dryRun = process.argv.includes('--dry-run')
const onlyIndex = process.argv.indexOf('--only')
const onlyRole = onlyIndex === -1 ? undefined : process.argv[onlyIndex + 1]
const imageDirectory = resolve(process.cwd(), '..', 'images', 'hero')
const extensions = ['.jpg', '.jpeg', '.png', '.webp']
const contentTypes: Record<string, string> = {'.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp'}

type HeroDefinition = {
  role: 'event' | 'headshot' | 'portrait'
  basename: string
  alt: string
  hotspot: {x: number; y: number; width: number; height: number}
  crop?: {top: number; right: number; bottom: number; left: number}
}

// Alt text must describe the approved file that is actually published. Keep it factual.
const hero: HeroDefinition[] = [
  {
    role: 'event',
    basename: 'hero-event2',
    alt: 'Speaker in a black suit addressing seated and standing guests with a handheld microphone at an evening gala with black-and-gold decor and city skyline windows',
    // 4:5 source matches the event slot exactly; the hotspot keeps the speaker if the slot ratio ever changes.
    hotspot: {x: 0.33, y: 0.42, width: 0.42, height: 0.72},
  },
  {
    role: 'headshot',
    basename: 'hero-headshot',
    alt: 'Professional headshot of a woman in a white blazer and pearl necklace, arms crossed and smiling against a light studio background',
    hotspot: {x: 0.46, y: 0.3, width: 0.62, height: 0.46},
  },
  {
    role: 'portrait',
    basename: 'hero-portrait2',
    alt: 'Studio portrait of a woman kneeling against a white backdrop, one hand raised into her hair, wearing a navy print bodysuit and layered gold necklaces',
    hotspot: {x: 0.42, y: 0.3, width: 0.5, height: 0.5},
    // Full-body source; the full-width square shows head to mid-thigh (the most of the kneeling pose a square slot can hold) with both hands inside.
    crop: {top: 0.01, right: 0, bottom: 0.32, left: 0},
  },
]

const client = getCliClient({apiVersion: API_VERSION})
const config = client.config()

if (config.projectId !== PROJECT_ID || config.dataset !== DATASET) {
  throw new Error(`Refusing to publish to ${config.projectId}/${config.dataset}; expected ${PROJECT_ID}/${DATASET}.`)
}

const canonicalHomeExists = await client.fetch<boolean>('defined(*[_id == $id][0]._id)', {id: HOME_PAGE_ID})
if (!canonicalHomeExists) throw new Error(`Canonical Home Page document ${HOME_PAGE_ID} does not exist.`)

const resolveFile = (basename: string) => {
  const candidates = extensions.flatMap((extension) => [extension, extension.toUpperCase()]).map((extension) => resolve(imageDirectory, `${basename}${extension}`))
  const match = candidates.find((path) => existsSync(path))
  if (!match) throw new Error(`Missing approved hero image: ${resolve(imageDirectory, basename)}.{${extensions.map((e) => e.slice(1)).join(',')}}`)
  return match
}

if (onlyRole && !hero.some((item) => item.role === onlyRole)) {
  throw new Error(`Unknown hero slot "${onlyRole}". Use --only event | headshot | portrait.`)
}

const selected = onlyRole ? hero.filter((item) => item.role === onlyRole) : hero

const files = selected.map((item) => {
  if (!item.alt.trim()) throw new Error(`Alt text is required for the ${item.role} hero image before publishing.`)
  return {...item, filePath: resolveFile(item.basename)}
})

const assets: Array<{_id: string; url: string; sha1hash: string}> = []

for (const item of files) {
  const bytes = readFileSync(item.filePath)
  const sha1hash = createHash('sha1').update(bytes).digest('hex')
  const existing = await client.fetch<{_id: string; url: string; sha1hash: string} | null>(
    '*[_type == "sanity.imageAsset" && sha1hash == $sha1hash][0]{_id, url, sha1hash}',
    {sha1hash},
  )

  if (existing) {
    assets.push(existing)
    console.log(`Reuse ${item.role}: ${existing._id}`)
    continue
  }

  if (dryRun) {
    console.log(`Would upload ${item.role} from ${item.filePath} (${statSync(item.filePath).size} bytes; sha1 ${sha1hash}).`)
    continue
  }

  const extension = extname(item.filePath).toLowerCase()
  const uploaded = await client.assets.upload('image', createReadStream(item.filePath), {
    filename: `${item.basename}${extension}`,
    contentType: contentTypes[extension],
  })
  assets.push({_id: uploaded._id, url: uploaded.url, sha1hash: uploaded.sha1hash})
  console.log(`Uploaded ${item.role}: ${uploaded._id}`)
}

if (dryRun) {
  const current = await client.fetch<Record<string, {alt?: string; assetId?: string}> | null>(
    '*[_id == $id][0].heroCollage{"event": event{alt, "assetId": asset._ref}, "headshot": headshot{alt, "assetId": asset._ref}, "portrait": portrait{alt, "assetId": asset._ref}}',
    {id: HOME_PAGE_ID},
  )
  console.log(`Dry run: ${assets.length} of ${selected.length} selected assets already exist. Would ${onlyRole ? `patch heroCollage.${onlyRole} only` : 'replace the whole heroCollage object'}. Current hero collage: ${JSON.stringify(current)}`)
} else {
  if (assets.length !== selected.length) throw new Error(`Expected ${selected.length} assets; resolved ${assets.length}.`)

  const slots = Object.fromEntries(
    files.map((item, index) => [
      item.role,
      {
        _type: 'imageWithAlt',
        asset: {_type: 'reference', _ref: assets[index]._id},
        alt: item.alt,
        crop: {_type: 'sanity.imageCrop', top: 0, right: 0, bottom: 0, left: 0, ...item.crop},
        hotspot: {_type: 'sanity.imageHotspot', ...item.hotspot},
      },
    ]),
  )

  if (onlyRole) {
    await client.patch(HOME_PAGE_ID).setIfMissing({heroCollage: {_type: 'heroCollage'}}).set({[`heroCollage.${onlyRole}`]: slots[onlyRole]}).commit()
    console.log(`Replaced the ${onlyRole} hero image in ${PROJECT_ID}/${DATASET}; other slots untouched.`)
  } else {
    await client.patch(HOME_PAGE_ID).set({heroCollage: {_type: 'heroCollage', ...slots}}).commit()
    console.log(`Published the three-image hero collage to ${PROJECT_ID}/${DATASET}.`)
  }
}
