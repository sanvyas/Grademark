# GradeMark Scan

Consumer-facing barcode scan app for [GradeMark](https://grademark.app) — point your camera at
a packaged food or beverage product and instantly see its independent AAA→D rating, package
claim verification, nutrients, ingredients, allergens, and regulatory compliance.

This is an **additive** app: it reads from the same Supabase project as the existing GradeMark
public site / `/admin` / `/portal` platform (built on Lovable). It does not modify that
platform's schema, other than adding one new table (`rating_requests` — see below).

## Stack

- Vite + React + TypeScript
- Tailwind CSS + hand-rolled shadcn/ui-style primitives (`src/components/ui`)
- `@supabase/supabase-js`
- Barcode scanning: native [`BarcodeDetector`](https://developer.mozilla.org/en-US/docs/Web/API/BarcodeDetector)
  where supported, lazily falling back to `@zxing/browser` (mainly Safari) so the fallback
  library isn't shipped to browsers that don't need it
- `vite-plugin-pwa` for installability + an offline app shell
- No login/account system in v1 — recent scans and history live in `localStorage`

## Getting started

```bash
cp .env.example .env
# fill in VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY from the SAME Supabase project
# the Lovable-built GradeMark platform uses — do not point this at a new project.

npm install
npm run dev
```

`npm run build` typechecks and produces a production build; `npm run lint` runs ESLint.

### Database

The app expects the existing schema: `brands`, `categories`, `products` (`barcode`,
`image_url`), `nutrient_profiles`, `ingredients` + `product_ingredients`, `allergens` +
`product_allergens`, `regulatory_flags` (`license_valid` / `additive_limit_compliant` /
`prohibited_substance_check`), `ratings` (versioned, one row per rating with `rated_at`),
`package_claims` (`claim_text`, `claim_type`, `verification_status`, `evidence`).

**New table**: `supabase/migrations/20260825171344_create_rating_requests.sql` adds
`rating_requests` (`id`, `barcode`, `requested_at`, `status`) — written to whenever a scanned
barcode has no matching product, so it surfaces for the admin review queue. Apply it with the
Supabase CLI (`supabase db push`) or paste it into the SQL editor; it's guarded with
`if not exists` so it's safe to run even if a similar table already landed from the Lovable
side — check first either way.

`src/types/database.ts` documents the exact column-name assumptions this app was written
against (this session had no live Supabase connection to introspect); reconcile with
`npx supabase gen types typescript` once credentials are available.

## Not implemented / known gaps

- **Package claim bounding boxes**: `package_claims` has no coordinate data yet, so the
  Package Messaging Analysis screen (`src/screens/PackageMessaging.tsx`) uses a
  highlighted-text-below-image layout instead of in-image annotation. Search the codebase for
  `TODO: claim coordinates` for the exact spots to revisit once that data exists.
- Deploying to a `scan.grademark.app`-style subdomain and wiring real Supabase credentials are
  environment/ops steps outside this codebase.
