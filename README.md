# Book BASI

Book BASI is BASI's mobile-first services and conversion website. BASI means foundation; the brand position is **The Foundation of Presence**.

This repository contains the V1.1 one-page foundation: a single conversion-focused commercial experience at `/`, reusable Astro components, a restrained responsive visual system, published-content reads from Sanity, a dedicated Sanity Studio configuration, SEO fundamentals, and Cloudflare Pages build readiness. Final copy, selected photography, production booking software, analytics, legal language, redirects, and launch work are intentionally deferred.

## Architecture

- **Frontend:** Astro 7 with strict TypeScript and static output
- **Content:** Sanity project `spjfohj1`, dataset `production`, queried through `@sanity/astro`
- **Studio:** dedicated configuration under `studio/`; it is not embedded in the public Astro bundle
- **Styling:** one project-level, mobile-first CSS foundation with semantic design tokens
- **Deployment target:** Cloudflare Pages using the generated `dist/` directory
- **Runtime:** no frontend framework hydration and no required client-side JavaScript
- **Commercial model:** one-page service discovery through `#events`, `#headshots`, `#branding`, `#portraits`, `#work`, and `#contact` anchors

Published Sanity content is fetched at build time. Restrained local fallback content allows a clean first build before the corresponding documents are published. Once documents exist, published CMS values replace the fallbacks. A Sanity build hook can be configured in a later launch phase so publishing content triggers a new static deployment.

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
```

`npm run studio:deploy` exists for a later, separately authorized Studio deployment. It is not part of the foundation task.

## Environment variables

| Variable | Exposure | Required | Purpose |
| --- | --- | --- | --- |
| `PUBLIC_SANITY_PROJECT_ID` | Public | Recommended | Sanity project ID; defaults to `spjfohj1` for build portability |
| `PUBLIC_SANITY_DATASET` | Public | Recommended | Published dataset; defaults to `production` |
| `SANITY_STUDIO_PROJECT_ID` | Studio build | Recommended | Studio project ID; defaults to `spjfohj1` |
| `SANITY_STUDIO_DATASET` | Studio build | Recommended | Studio dataset; defaults to `production` |
| `SANITY_API_READ_TOKEN` | Secret/server only | Only for a private dataset | Optional future authenticated read token; never prefix with `PUBLIC_` |

Do not commit `.env`, Sanity tokens, deployment tokens, or other secrets. The current frontend reads published content and does not use a write token.

## Sanity setup

The dedicated Studio is configured by:

- `studio/sanity.config.ts`
- `studio/sanity.cli.ts`
- `studio/structure.ts`
- `studio/schemas/`

The Studio is separate because the public site is a static, low-JavaScript experience. Embedding Studio at `/admin` would add React/Studio concerns to the Astro application and couple the editing surface to the public Cloudflare Pages deployment. A dedicated Studio can be developed locally and later deployed to Sanity's managed Studio hosting after review.

Before editors use the Studio, add only controlled origins that require authenticated requests in the Sanity project settings. Typical reviewed origins are the local Studio URL and the final deployed Studio URL.

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
5. Add a small, curated set of accessible images to **Home Page → Selected portfolio imagery** when approved work is ready.
6. Publish reviewed content.
7. Run `npm run build` to regenerate the static site. Configure a Sanity-to-Cloudflare build hook only during the launch phase.

Site Settings owns the booking destination used by the homepage hero, final CTA, header, and contact region. This keeps future booking-provider changes centralized.

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

## Future phases

Recommended follow-on work:

1. Final UX writing and approved service details
2. Photography selection, image crops, alt text, and visual refinement
3. Sanity content population and editorial QA
4. Booking-provider selection and centralized destination update
5. Reviewed legal policies and production SEO refinement
6. Sanity build hook, analytics decisions, redirect planning, deployment review, and launch

No production deployment or domain configuration is performed by this repository scaffold.
