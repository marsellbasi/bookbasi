import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemas'
import {structure} from './structure'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'spjfohj1'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

export default defineConfig({
  name: 'book-basi',
  title: 'Book BASI Studio',
  projectId,
  dataset,
  plugins: [structureTool({structure})],
  schema: {types: schemaTypes},
})
