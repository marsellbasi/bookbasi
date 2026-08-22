import sitemap from '@astrojs/sitemap'
import sanity from '@sanity/astro'
import {defineConfig} from 'astro/config'

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || 'spjfohj1'
const dataset = process.env.PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  site: 'https://bookbasi.com',
  output: 'static',
  integrations: [
    sanity({
      projectId,
      dataset,
      apiVersion: '2026-08-01',
      useCdn: false,
    }),
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
  build: {
    assets: 'assets',
  },
  vite: {
    build: {
      cssMinify: 'lightningcss',
    },
  },
})
