# Book BASI Sanity Service Card Management

## Overview

The primary cards in the homepage **START HERE** section are managed by the canonical Sanity `homePage` singleton. They are embedded objects in the `serviceCards` array, so Sanity's native array drag handles control their exact frontend order. No numeric sort field is used.

The approved card markup and CSS remain unchanged. The frontend maps each service-card object into the existing `ActionLink` presentation contract.

## Sanity location

1. Open Book BASI Studio.
2. Open **Home Page**.
3. Select the **Start Here / Services** group.
4. Edit **Service cards**.
5. Publish **Home Page** after reviewing changes.

The object schema is `serviceCard` in `studio/schemas/objects/serviceCard.ts`. The ordered array is defined on `homePage` in `studio/schemas/documents/homePage.ts`.

## Card fields

| Field | Required | Behavior |
| --- | --- | --- |
| `internalName` | Yes | Editor-only label used to recognize the card in Studio. |
| `title` | Yes | Visible card heading. An advisory warning appears above 80 characters. |
| `description` | Yes | Visible supporting copy. An advisory warning appears above 220 characters. |
| `ctaLabel` | Yes | Complete visible CTA text; the frontend does not hardcode “Explore”. An advisory warning appears above 100 characters. |
| `ctaUrl` | Yes | Accepts an absolute HTTP(S) URL or a root-relative path beginning with `/`. |
| `isActive` | Yes | Defaults to `true`. Only cards whose value is exactly `true` render. |

The array preview displays the title, CTA label, destination, and a prominent **Hidden** status when `isActive` is false. No custom Studio component or plugin is required.

## Ordering, adding, hiding, and removing

- Reorder: drag array items by their native Sanity drag handles, then publish Home Page. The array order is the frontend order.
- Add: select **Add item**, choose **Service Card**, complete all required fields, leave visibility on, place it in the desired array position, and publish.
- Hide temporarily: turn off **Visible on Book BASI** and publish. The data and array position remain intact. The frontend removes the card without leaving a grid gap.
- Show again: turn visibility on and publish.
- Remove permanently: remove the item from the array and publish. Prefer hiding when the card may be needed again.

Publishing does not require a repository change. The established production flow is Sanity `production` publish → existing Sanity webhook → public Cloudflare Pages rebuild → `bookbasi.com`. The Studio itself is deployed separately to the `bookbasi-studio` Cloudflare Pages project from the repository's `main` branch.

## Frontend query and rendering

`src/lib/queries.ts` projects `homePage.serviceCards[]` without a GROQ `order()` operation. It requests `_key`, all editable content, the destination, and `isActive` in stored array order.

`src/lib/content.ts` resolves the Home Page content. `src/lib/serviceCards.ts` filters with `isActive === true` and does not sort. `src/pages/index.astro` passes the resulting array into `src/components/ActionList.astro`, which maps every remaining item to the existing `ActionLink.astro` markup. There is no four-card slice or fixed card-count assumption.

Quiet utility actions (**View Work**, **Contact BASI**, and **Instagram**) remain `linkAction` documents and are queried separately. The old primary `linkAction` records are retained as legacy data for safe rollback but are no longer queried or rendered as service cards.

The existing responsive CSS remains the source of truth:

- below 640px: one-column grid;
- 640px and above: two-column grid;
- odd counts flow naturally, with no placeholder cards;
- grid stretching preserves equal height within each row.

## Fallback behavior

The repository already uses reviewed local content when a Sanity document or query is unavailable during a static build. The service cards follow that same policy:

- Sanity is the production source of truth.
- If `serviceCards` is unavailable or `null` because the CMS request/document field is unavailable, the reviewed four-card fallback is used so the section does not silently disappear.
- A published empty array is honored and renders zero cards.
- A published array whose cards are all inactive is honored and renders zero cards.
- The fallback is not merged with, appended to, or sorted against published cards.

The fallback data lives in `src/data/fallback.ts` and exists only for the established build-failure path. It is not an independently editable content source.

## Initial migration and future seeding

`studio/scripts/migrate-home-service-cards.ts` is the narrow, idempotent migration for the canonical `spjfohj1/production` Home Page. It refuses other projects/datasets and refuses to overwrite a populated array unless `--force` is explicitly supplied.

Commands:

```bash
npm run sanity:migrate-service-cards -- --dry-run
npm run sanity:migrate-service-cards
```

The general `sanity:seed` script uses `setIfMissing` for `serviceCards`. This creates the approved array for a fresh Home Page but preserves later editor changes, additions, visibility choices, and drag-and-drop ordering.

## Approved initial data

1. Event Coverage → `https://everythingbasi.com/events/`
2. Team Headshots → `https://everythingbasi.com/atlanta-business-headshots/`
3. Personal Branding → `https://everythingbasi.com/book/branding/`
4. Portrait Sessions → `https://everythingbasi.com/portraits/`

All four were migrated with `isActive: true`. Copy, labels, URLs, and order were verified against both the previous repository implementation and the published production `linkAction` documents before migration.

## QA performed

- Production migration dry run and post-migration read-only GROQ verification.
- Explicit temporary frontend order: Team Headshots, Event Coverage, Portrait Sessions, Personal Branding. The rendered DOM matched exactly; the approved order was then restored.
- Temporary hidden Team Headshots state: three cards rendered in preserved order, the grid collapsed naturally, and no overflow or empty placeholder appeared.
- Temporary 3-, 4-, and 5-card states: correct count and natural one-/two-column flow with no card or section overflow.
- Required widths: 375, 390, 430, 768, 1280, and 1536 pixels.
- At all required widths: no horizontal/card content overflow; CTA labels and arrow treatment remained intact; the approved gold border color remained unchanged; card heights remained equal for the approved four-card state.
- Mobile remained one column; 768px and wider remained two columns.
- Final repository validation: see the task handoff for the recorded command results.
