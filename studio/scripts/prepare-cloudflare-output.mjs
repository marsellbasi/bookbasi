import {copyFile, mkdir} from 'node:fs/promises'
import {resolve} from 'node:path'

const studioRoot = resolve(import.meta.dirname, '..')
const sourceRoot = resolve(studioRoot, 'static')
const outputRoot = resolve(studioRoot, 'dist')
const deploymentFiles = ['_headers', 'robots.txt']

await mkdir(outputRoot, {recursive: true})
await Promise.all(
  deploymentFiles.map((filename) =>
    copyFile(resolve(sourceRoot, filename), resolve(outputRoot, filename)),
  ),
)

console.log(`Prepared Cloudflare Pages output: ${deploymentFiles.join(', ')}`)
