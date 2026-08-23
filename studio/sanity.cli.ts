import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'spjfohj1',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  deployment: {
    appId: 'cfx2trz97tam1i1fgp9dxnhr',
  },
  studioHost: process.env.SANITY_STUDIO_HOST || 'https://studio.bookbasi.com',
})
