import {createImageUrlBuilder} from '@sanity/image-url'
import type {WorkImage} from '@/types/content'

const builder = createImageUrlBuilder({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'spjfohj1',
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
})

export function sanityImageUrl(image: WorkImage, width: number, height: number, quality = 82) {
  if (image.asset?._ref) {
    return builder.image(image).width(width).height(height).fit('crop').auto('format').quality(quality).url()
  }

  const url = new URL(image.url)
  url.searchParams.set('auto', 'format')
  url.searchParams.set('fit', 'crop')
  url.searchParams.set('q', String(quality))
  url.searchParams.set('w', String(width))
  url.searchParams.set('h', String(height))
  return url.toString()
}

export function workImageRatio(image: WorkImage, index: number) {
  if (index === 0) return {width: 8, height: 5, name: 'featured'}
  if (image.orientationHint === 'portrait') return {width: 4, height: 5, name: 'portrait'}
  if (image.orientationHint === 'landscape') return {width: 3, height: 2, name: 'landscape'}
  if (image.orientationHint === 'square') return {width: 1, height: 1, name: 'square'}
  return image.width >= image.height
    ? {width: 3, height: 2, name: 'landscape'}
    : {width: 4, height: 5, name: 'portrait'}
}
