import {createHash} from 'node:crypto'
import {createReadStream, existsSync, readFileSync, statSync} from 'node:fs'
import {resolve} from 'node:path'
import {getCliClient} from 'sanity/cli'

const PROJECT_ID = 'spjfohj1'
const DATASET = 'production'
const API_VERSION = '2026-08-01'
const HOME_PAGE_ID = 'homePage'
const dryRun = process.argv.includes('--dry-run')
const imageDirectory = resolve(process.cwd(), '..', 'images')

type WorkDefinition = {
  key: string
  filename: string
  alt: string
  category: 'events' | 'headshots' | 'branding' | 'portraits'
  displayOrder: number
  orientationHint: 'portrait' | 'landscape'
  hotspot: {x: number; y: number; width: number; height: number}
}

const work: WorkDefinition[] = [
  {
    key: 'event-speaker',
    filename: 'event2.jpg',
    alt: 'Man speaking into a microphone during an indoor event',
    category: 'events',
    displayOrder: 1,
    orientationHint: 'landscape',
    hotspot: {x: 0.66, y: 0.46, width: 0.42, height: 0.72},
  },
  {
    key: 'professional-headshot',
    filename: 'headshot.JPEG',
    alt: 'Professional headshot of a woman against a white studio background',
    category: 'headshots',
    displayOrder: 2,
    orientationHint: 'portrait',
    hotspot: {x: 0.5, y: 0.36, width: 0.76, height: 0.52},
  },
  {
    key: 'personal-branding-tablet',
    filename: 'branding.JPEG',
    alt: 'Personal branding portrait of a woman holding a tablet in an indoor setting',
    category: 'branding',
    displayOrder: 3,
    orientationHint: 'portrait',
    hotspot: {x: 0.64, y: 0.4, width: 0.66, height: 0.72},
  },
  {
    key: 'event-interview',
    filename: 'event1.jpg',
    alt: 'Woman speaking into a microphone while attendees record her at an indoor event',
    category: 'events',
    displayOrder: 4,
    orientationHint: 'landscape',
    hotspot: {x: 0.51, y: 0.45, width: 0.48, height: 0.64},
  },
  {
    key: 'studio-portrait-red',
    filename: 'portrait.JPEG',
    alt: 'Studio portrait of a woman in a red outfit against a gray background',
    category: 'portraits',
    displayOrder: 5,
    orientationHint: 'portrait',
    hotspot: {x: 0.5, y: 0.39, width: 0.66, height: 0.68},
  },
  {
    key: 'group-portrait-session',
    filename: 'overall.JPEG',
    alt: 'Three women posing together while another person photographs them',
    category: 'portraits',
    displayOrder: 6,
    orientationHint: 'landscape',
    hotspot: {x: 0.48, y: 0.5, width: 0.88, height: 0.72},
  },
]

const client = getCliClient({apiVersion: API_VERSION})
const config = client.config()

if (config.projectId !== PROJECT_ID || config.dataset !== DATASET) {
  throw new Error(`Refusing to publish to ${config.projectId}/${config.dataset}; expected ${PROJECT_ID}/${DATASET}.`)
}

const homePageCount = await client.fetch<number>('count(*[_type == "homePage"])')
const canonicalHomeExists = await client.fetch<boolean>('defined(*[_id == $id][0]._id)', {id: HOME_PAGE_ID})

if (!canonicalHomeExists) throw new Error(`Canonical Home Page document ${HOME_PAGE_ID} does not exist.`)
if (homePageCount !== 1) throw new Error(`Expected exactly one Home Page document; found ${homePageCount}.`)

for (const item of work) {
  const filePath = resolve(imageDirectory, item.filename)
  if (!existsSync(filePath)) throw new Error(`Missing approved source image: ${filePath}`)
}

const assets: Array<{_id: string; url: string; sha1hash: string; originalFilename?: string}> = []

for (const item of work) {
  const filePath = resolve(imageDirectory, item.filename)
  const bytes = readFileSync(filePath)
  const sha1hash = createHash('sha1').update(bytes).digest('hex')
  const existing = await client.fetch<{_id: string; url: string; sha1hash: string; originalFilename?: string} | null>(
    '*[_type == "sanity.imageAsset" && sha1hash == $sha1hash][0]{_id, url, sha1hash, originalFilename}',
    {sha1hash},
  )

  if (existing) {
    assets.push(existing)
    console.log(`Reuse ${item.filename}: ${existing._id}`)
    continue
  }

  if (dryRun) {
    console.log(`Would upload ${item.filename} (${statSync(filePath).size} bytes; sha1 ${sha1hash}).`)
    continue
  }

  const uploaded = await client.assets.upload('image', createReadStream(filePath), {
    filename: item.filename,
    contentType: 'image/jpeg',
  })
  assets.push({_id: uploaded._id, url: uploaded.url, sha1hash: uploaded.sha1hash, originalFilename: uploaded.originalFilename})
  console.log(`Uploaded ${item.filename}: ${uploaded._id}`)
}

if (dryRun) {
  const current = await client.fetch<Array<{_key: string; alt?: string; assetId?: string}> | null>(
    '*[_id == $id][0].selectedWork[]{_key, alt, "assetId": asset._ref}',
    {id: HOME_PAGE_ID},
  )
  console.log(`Dry run: ${assets.length} of ${work.length} assets already exist; Home Page currently has ${(current ?? []).length} selected-work entries.`)
} else {
  if (assets.length !== work.length) throw new Error(`Expected ${work.length} assets; resolved ${assets.length}.`)

  const selectedWork = work.map((item, index) => ({
    _key: `selected-${item.key}`,
    _type: 'imageWithAlt',
    asset: {_type: 'reference', _ref: assets[index]._id},
    alt: item.alt,
    category: item.category,
    displayOrder: item.displayOrder,
    orientationHint: item.orientationHint,
    crop: {_type: 'sanity.imageCrop', top: 0, right: 0, bottom: 0, left: 0},
    hotspot: {_type: 'sanity.imageHotspot', ...item.hotspot},
  }))

  await client.patch(HOME_PAGE_ID).set({selectedWork}).commit()
  console.log(`Published exactly ${selectedWork.length} selected-work images to ${PROJECT_ID}/${DATASET}.`)
}
