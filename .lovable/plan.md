# Admin Dashboard for Submissions

A protected `/admin` route where you (and approved teammates) can view every Gift Claim and Enrollment Lead captured by the site, with search, CSV export, and live counts.

## What you'll get

1. **Login page** (`/admin/login`) — email + password sign-in (Lovable Cloud auth).
2. **Admin dashboard** (`/admin`) — only visible to users with the `admin` role.
   - Top stat cards: total Gift Claims, total Enrollments, today's count, this-week count.
   - **Tab 1 — Gift Claims**: table of Name, WhatsApp, Submitted-at. Search + WhatsApp click-to-message.
   - **Tab 2 — Enrollments**: table of Name, School, SSC Roll, Mobile, Batch, Discount Code, Submitted-at. Search + click-to-call.
   - **Export CSV** button on each tab.
   - Auto-refresh every 30 seconds (and on tab focus).
3. **Logout** button in the header.

## Security model (important)

Right now the `gift_claims` and `leads` tables have RLS that **denies all reads** to the public — that's good. To let admins read them, we add:

- A `user_roles` table + `app_role` enum (`admin`, `user`) — roles stored separately from profiles to prevent privilege escalation.
- A `has_role(user_id, role)` SECURITY DEFINER function (avoids RLS recursion).
- New SELECT policies on `gift_claims` and `leads`: `USING (public.has_role(auth.uid(), 'admin'))`.
- Same SELECT policy added to the legacy `gifts` table so it's visible too.

No public-facing data exposure changes. The signup forms keep working exactly as today (anon insert still allowed).

## First admin bootstrap

After the migration runs, you'll:
1. Sign up at `/admin/login` with your email + a password (auto-confirm enabled so no email verification needed for this internal tool).
2. I'll give you a one-line SQL snippet to run (via the Cloud backend tool) to grant your user the `admin` role. After that, only users you explicitly promote can see submissions.

## Files I'll create / change

**New:**
- `supabase/migrations/<timestamp>_admin_roles.sql` — enum, `user_roles` table + RLS, `has_role()` function, admin-read policies on `gift_claims` / `leads` / `gifts`.
- `src/routes/admin.tsx` — pathless layout that gates everything under `/admin` on auth + admin role.
- `src/routes/admin/login.tsx` — email/password sign-in form.
- `src/routes/admin/index.tsx` — dashboard with stat cards + tabs.
- `src/components/admin/SubmissionsTable.tsx` — reusable sortable/searchable table with CSV export.
- `src/hooks/useAdminAuth.ts` — wraps `supabase.auth` + role check.

**Edited:**
- `src/routes/__root.tsx` — only if needed to ensure providers wrap admin routes (likely no change).

## Technical notes

- Auth: Lovable Cloud email/password, **auto-confirm ON** (internal tool, you control who signs up). No Google sign-in on the admin route to reduce attack surface.
- Role check uses `supabase.rpc('has_role', { _user_id, _role: 'admin' })` after sign-in; non-admin users are signed out and shown "Access denied".
- Data fetched client-side with the standard Supabase browser client — RLS does the enforcement, so no server functions needed.
- CSV export done client-side (no server roundtrip) using a small helper that escapes quotes/commas.
- Realtime: simple 30s polling + manual Refresh button (no need for websockets at this volume).

## Out of scope (ask if you want them)

- Editing/deleting submissions from the UI (currently SELECT-only — safer).
- Multi-admin invite UI (you'll promote users via one SQL line for now).
- Email/Slack notifications when a new submission arrives.
