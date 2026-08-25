-- New table added by the consumer scan app (GradeMark Scan).
-- Not part of the existing content-managed schema — additive only, does not touch any
-- existing table. Check for this table's existence before running: if it's already present
-- (e.g. a pending Lovable-side change already added it), skip this migration rather than
-- creating a duplicate/conflicting definition.
--
-- Purpose: when a scanned barcode has no matching row in `products`, the app logs it here so
-- it surfaces in the admin review queue as a candidate to rate.

create table if not exists public.rating_requests (
  id uuid primary key default gen_random_uuid(),
  barcode text not null,
  requested_at timestamptz not null default now(),
  status text not null default 'pending' check (status in ('pending', 'in_review', 'rated', 'rejected'))
);

-- One open request per barcode: re-scanning an unrated barcode should not spam new rows.
-- (The app upserts on this constraint with ignoreDuplicates.)
create unique index if not exists rating_requests_barcode_key on public.rating_requests (barcode);

create index if not exists rating_requests_status_idx on public.rating_requests (status);

alter table public.rating_requests enable row level security;

-- Consumer app has no login (v1) and uses the anon key — allow anonymous inserts of new
-- requests, but not reads/updates/deletes, so the anon key can't be used to enumerate or
-- tamper with the review queue. Admin tooling should use the service role, which bypasses RLS.
create policy "Anyone can submit a rating request"
  on public.rating_requests
  for insert
  to anon
  with check (true);
