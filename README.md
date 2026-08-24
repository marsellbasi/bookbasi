# Book BASI

Book BASI is BASI's mobile-first services and conversion website. BASI means foundation; the brand position is **The Foundation of Presence**.

This repository contains the production one-page destination hub: a fast mobile-first service chooser that routes visitors to the canonical EverythingBASI service experience, plus six curated Sanity-managed work images, concise trust content, and SEO fundamentals. The public site is live at `https://bookbasi.com`, Cloudflare provides pageview/performance analytics, and conversion-event analytics and final legal review remain owner decisions.

## Architecture

- **Frontend:** Astro 7 with strict TypeScript and static output
- **Content:** Sanity project `spjfohj1`, dataset `production`, queried through `@sanity/astro`
- **Studio:** dedicated configuration under `studio/`, deployed separately at `https://studio.bookbasi.com`; it is not embedded in the public Astro bundle
- **Styling:** one project-level, mobile-first CSS foundation with semantic design tokens
- **Deployment target:** Cloudflare Pages using the generated `dist/` directory
- **Runtime:** no frontend framework hydration and no required client-side JavaScript
- **Commercial model:** five homepage chapters using `#services`, `#work`, `#why-basi`, and `#contact`; service choices are ordinary CMS-managed links to EverythingBASI

Published Sanity content is fetched at build time. Restrained local fallback content allows a clean build when a corresponding document or the CMS is unavailable. Once documents exist, published CMS values replace the fallbacks. The reviewed Sanity production webhook triggers the public Cloudflare Pages deploy hook after qualifying published content changes.

## Prerequisites

- Node.js 22.12 or newer (Node 22 is recorded in `.nvmrc`)
- npm 10 or newer
- Access to the Book Basi Sanity project for Studio use

## Local development

```bash
npm install
copy .env.example .env
npm run dev
```

Astro serves the site at `http://localhost:4321` by default.

Useful commands:

```bash
npm run dev
npm run check
npm run build
npm run preview
npm run studio:dev
npm run studio:build
npm run studio:validate
npm run sanity:seed -- --dry-run
npm run sanity:publish-work -- --dry-run
```

The production Studio is self-hosted on a dedicated Cloudflare Pages project. `npm run studio:deploy` remains available for Sanity-managed hosting and is not used by the production deployment.

## Environment variables

| Variable | Exposure | Required | Purpose |
| --- | --- | --- | --- |
| `PUBLIC_SANITY_PROJECT_ID` | Public | Recommended | Sanity project ID; defaults to `spjfohj1` for build portability |
| `PUBLIC_SANITY_DATASET` | Public | Recommended | Published dataset; defaults to `production` |
| `SANITY_STUDIO_PROJECT_ID` | Studio build | Recommended | Studio project ID; defaults to `spjfohj1` |
| `SANITY_STUDIO_DATASET` | Studio build | Recommended | Studio dataset; defaults to `production` |
| `SANITY_STUDIO_HOST` | Studio CLI | Optional | External production Studio URL; defaults to `https://studio.bookbasi.com` |
| `SANITY_API_READ_TOKEN` | Secret/server only | Only for a private dataset | Optional future authenticated read token; never prefix with `PUBLIC_` |

Do not commit `.env`, Sanity tokens, deployment tokens, or other secrets. The current frontend reads published content and does not use a write token.

## Sanity setup

The dedicated Studio is configured by:

- `studio/sanity.config.ts`
- `studio/sanity.cli.ts`
- `studio/structure.ts`
- `studio/schemas/`

The Studio is separate because the public site is a static, low-JavaScript experience. Embedding Studio at `/admin` would add React/Studio concerns to the Astro application and couple the editing surface to the public Cloudflare Pages deployment. The production Studio is self-hosted as a separate Cloudflare Pages application at `https://studio.bookbasi.com`.

Sanity CORS should contain only the reviewed Studio origins: `http://localhost:3333` for local development and `https://studio.bookbasi.com` for production, both with credentials support where required. The public static frontend does not need browser CORS access.

### CMS access and deployment

- Production Studio: `https://studio.bookbasi.com`
- Local Studio: `npm run studio:dev`
- Sanity project/dataset: `spjfohj1` / `production`
- Studio Pages project: `bookbasi-studio`, production branch `main`
- Studio build: repository root, `npm run studio:build`, output `studio/dist`, Node 22; the build also extracts the registered Studio manifest into `studio/dist/static`

The Studio output intentionally has no top-level `404.html`; Cloudflare Pages therefore applies its native single-page-application fallback for direct Studio route refreshes.

Publishing follows: Studio publish → Sanity `production` → the existing production webhook → the public `bookbasi` Cloudflare Pages rebuild → `https://bookbasi.com`.

For Studio deployment failures, inspect the `bookbasi-studio` Pages build logs. For authentication or API failures, verify the exact production Studio origin in Sanity CORS. For public content delays, inspect the Sanity webhook delivery history and the public `bookbasi` Pages deployment logs. Deploy-hook URLs and credentials must never be stored in the repository.

### Approved content seed

`npm run sanity:seed` updates the approved production copy using deterministic IDs for Site Settings, Home Page, five Service documents, and seven Link / Action documents. It requires an authenticated Sanity CLI session and refuses to run against any project or dataset except `spjfohj1/production`.

Run `npm run sanity:seed -- --dry-run` first to verify targeting. Repeated runs update the same documents, preserve editor-managed media and unrelated fields, and never create testimonials or portfolio images.

`npm run sanity:publish-work` uploads the six owner-approved files from the ignored local `images/` directory, reuses identical Sanity assets by SHA-1, and replaces only the canonical Home Page `selectedWork` array with deterministic entries. Run its dry-run first. The general content seed deliberately does not set `selectedWork` or `heroImage`, so future copy updates preserve published imagery.

### Content workflow

1. Run `npm run studio:dev` and authenticate with an account that can access project `spjfohj1`.
2. Create the singleton **Site Settings** and **Home Page** documents.
3. Create and publish services using the canonical slugs:
   - `event-coverage`
   - `team-headshots`
   - `personal-branding`
   - `studio-portraits`
   - `outdoor-portraits`
4. Add active Link / Action documents in display order.
5. Add four to six accessible images to **Home Page → Selected portfolio imagery** when approved work is ready. Every published image requires factual alt text and supports an authored crop, hotspot, category, display priority, and optional orientation hint.
6. Publish reviewed content.
7. Publish approved changes. The existing Sanity-to-Cloudflare webhook triggers a new public production build automatically.

Published Link / Action documents override the reviewed homepage routing fallbacks; in their absence, the production-safe fallback destinations keep every conversion path functional. The centralized booking fallback and Service-specific overrides remain available for future booking integration, but detailed pricing and policy content is intentionally not rendered on BookBASI.com; EverythingBASI is the canonical detailed service destination.

## Cloudflare Pages

Use Git integration with these settings:

| Setting | Value |
| --- | --- |
| Repository | `marsellbasi/bookbasi` |
| Production branch | `main` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | `22` (or any supported version `>=22.12`) |

Add the public Sanity variables from `.env.example` in Cloudflare Pages build settings. No Cloudflare Functions, bindings, DNS changes, or custom-domain changes are required by this static scaffold. `public/_headers` is copied to the deployment output for baseline security and immutable asset caching.

## Repository structure

```text
public/                 Static deployment files such as robots.txt and _headers
src/assets/brand/       Exact working copies of the supplied BASI logo assets
src/components/         Reusable interface components
src/data/               Restrained build-safe fallback content
src/layouts/            Shared document layout, metadata, header, and footer
src/lib/                GROQ queries and content/booking resolution
src/pages/              Astro routes
src/styles/             Central visual tokens and responsive styles
src/types/              Frontend content contracts
studio/                 Dedicated Sanity Studio config and schemas
images/                 Ignored local source photography for authenticated Sanity upload
```

The two original supplied PNG files remain unchanged at the repository root. Exact copies with stable, meaningful filenames are used from `src/assets/brand/` so Astro can process their dimensions and output.

## Routes

- `/`
- `/privacy`
- `/terms`
- `/404`
- `/robots.txt`
- `/sitemap-index.xml` (generated by `@astrojs/sitemap`)

The service, work, and contact experiences are homepage sections rather than standalone routes. The sitemap therefore contains only `/`, `/privacy`, and `/terms`.

## Production domains

- `https://bookbasi.com` is the canonical public site.
- `https://www.bookbasi.com` permanently redirects to the apex host.
- `https://bookbasi.pages.dev` permanently redirects to the apex host.
- `https://studio.bookbasi.com` is the separately deployed authenticated Sanity Studio.
- Published Sanity production changes trigger the reviewed public `bookbasi` Pages deploy hook.

The static frontend does not need browser CORS access to Sanity. Keep the CORS allowlist limited to the local Studio and the exact production Studio origin.

## Future phases

Recommended follow-on work:

1. Complete owner/legal review of the Privacy and Terms content
2. Decide whether conversion-event analytics should be added beyond Cloudflare pageview/performance analytics
3. Establish routine post-launch monitoring and search-console ownership

The public site and Studio remain operationally isolated Cloudflare Pages projects connected to the same repository and production Sanity dataset.
