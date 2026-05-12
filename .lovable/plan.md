## Goal

Merge the Gift Claim flow into the Enrollment flow so a single Name + Mobile entry becomes the start of an enrollment record, gets sent to the database immediately, and is upgraded (not duplicated) when the student finishes the rest.

## 1. Restructure Enrollment steps

Reorder `EnrollDialog` so it matches the Gift form:

- **Step 1** — Full Name + Mobile Number (was Name + SSC Roll)
- **Step 2** — SSC Roll/Year + School (was School + Mobile)
- **Step 3** — Batch + discount code (unchanged)

This makes Step 1 byte-identical to the Claim Gift form, so we can skip it when those fields already exist.

## 2. Unified "lead" state

Introduce a tiny shared store (`src/lib/leadStore.ts`) backed by `localStorage` under key `binary:lead`:

```ts
{ enrollmentId: string; full_name: string; mobile_number: string; createdAt: string }
```

Helpers: `getLead()`, `setLead(partial)`, `clearLead()`, plus a `binary:lead-updated` window event so open dialogs react.

## 3. GiftClaim → instant enrollment row

In `src/components/sections/GiftClaim.tsx`:

1. Keep inserting into `gift_claims` (so existing reports keep working).
2. **Also** insert into `enrollments` with:
   - `name`, `mobile` from form
   - `ssc_roll = ''`, `school = ''` (allowed once we relax the validator — see §6)
   - `status = 'Gift Claimed'`
   - `notes = 'Source: Gift Claim'`
3. Save the returned `enrollments.id` + name + mobile via `setLead(...)`.
4. Replace the success dialog copy with: **"Gift Unlocked! Redirecting you to complete your profile…"** and auto-fire `binary:open-enroll` after ~1.2s (keep "Maybe later" as an opt-out).

## 4. EnrollDialog auto-skip + upgrade

In `EnrollDialog`:

- On open, read `getLead()`. If `full_name` and `mobile_number` are present:
  - Pre-fill those fields.
  - Jump straight to **Step 2**.
  - Render a banner above Step 2: **"Welcome back, {Name}! Just a few more details to secure your SSC '26 spot."**
- On final submit:
  - If `lead.enrollmentId` exists → `UPDATE enrollments SET name, mobile, ssc_roll, school, batch, tier, course, notes, status='New' WHERE id = lead.enrollmentId`.
  - Otherwise → existing INSERT path.
  - After success, `clearLead()`.
- Keep the legacy `leads` insert as-is (admin still uses it for the older flow).

## 5. Admin dashboard label

In `src/routes/admin-binary.tsx`:

- Treat `status === 'Gift Claimed'` (or status='New' with empty `ssc_roll`/`school`) as a new pseudo-bucket **"Partial – Gift Only"**.
- Add it to the `STATUSES` filter chips, give it an amber row tint, and show a "Follow up" hint with a WhatsApp deep link.
- In the "🎁 GIFT CLAIMERS" / conversion tile logic, count Partial rows toward gift claims so numbers stay consistent.

## 6. Database changes (one migration)

The current `validate_enrollment` trigger requires `ssc_roll` length ≥ 1 and only allows statuses `New|In Touch|Confirmed|Paid`. To support partial rows we need to:

- Add `'Gift Claimed'` to allowed statuses.
- Allow empty `ssc_roll`/`school` **only when** `status = 'Gift Claimed'`.
- Add `mobile` uniqueness helper (non-unique index) to make the upgrade lookup fast — but **not** a UNIQUE constraint, since duplicates already exist in production.

No table-shape changes; existing columns are reused.

## 7. Telegram notification

The existing `notify_new_record` trigger fires on every insert into `enrollments`, so gift-claim partials will already ping `@doanaBinary_bot`. Update the webhook formatter (`src/routes/api/public/notify-telegram.ts`) so a `status === 'Gift Claimed'` enrollment sends a distinct **"🎁 Gift Claimed (partial)"** message instead of "🎓 New Enrollment". Final upgrade isn't a new INSERT, so we'll add an `AFTER UPDATE` trigger that fires only when `status` transitions away from `Gift Claimed`, posting a **"✅ Enrollment Completed"** message.

## Technical notes

- All `localStorage` access is guarded by `typeof window !== 'undefined'` for SSR safety.
- The lead record auto-expires after 7 days client-side to avoid stale prefills.
- Validation: `ssc_roll` and `school` only become required at Step 2 submit; the new Step 1 schema validates Name + Mobile only.
- No changes to `gift_claims` table or its RLS — it stays as the gift audit log.
- The admin "Partial – Gift Only" filter relies on status, so once a record is upgraded it leaves the bucket automatically.

## Files touched

- `src/lib/leadStore.ts` — new
- `src/components/sections/GiftClaim.tsx`
- `src/components/GiftSentDialog.tsx`
- `src/components/EnrollDialog.tsx`
- `src/routes/admin-binary.tsx`
- `src/routes/api/public/notify-telegram.ts`
- one new migration for the `validate_enrollment` rewrite + completion trigger