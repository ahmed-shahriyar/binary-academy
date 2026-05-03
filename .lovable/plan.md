## Goal
Cleanly separate the two CTAs that are currently merged inside `EnrollDialog` ("Claim Free Gift & Enroll"):
- 🎁 **Gift Claim** — lightweight, body-of-page section. Just Name + WhatsApp.
- 🚀 **Enroll Now** — full enrollment form, sticky/persistent in header & mobile bar.

The two flows are connected: after claiming a gift, users get a success popup that nudges them into the full enrollment.

---

## 1. New `GiftClaim` section component
File: `src/components/sections/GiftClaim.tsx`

- Placed between `Mentor` and `Roadmap` in `src/routes/index.tsx`.
- "Cyber-Box" card, max-width ~620px, centered, glowing **green** border (`var(--cyber-green)`) — visually distinct from the cyan enroll buttons.
- Heading: "🎁 Claim Your Free Gifts" + subline listing what they get (Logic Gates PDF + Free Demo Class link), matching the leaflet promise.
- Form fields (zod-validated):
  - `full_name` — string, 2–100 chars
  - `whatsapp_number` — `/^[0-9+\-\s]{7,20}$/`
- Submit button: green gradient, label `🎁 Send My Gifts`.
- On submit: insert into `public.gift_claims` table (new), then open the success popup.

## 2. New DB table — `public.gift_claims`
Migration creating:
- `id uuid pk default gen_random_uuid()`
- `full_name text not null`
- `whatsapp_number text not null`
- `created_at timestamptz default now()`
- RLS enabled; policy: `insert` allowed to `anon` + `authenticated` (public lead capture, same pattern as existing `leads` table). No select policy → write-only from the client.

## 3. Success popup — `GiftSentDialog`
File: `src/components/GiftSentDialog.tsx`

- Controlled `Dialog` opened by `GiftClaim` after successful submit.
- Content:
  - Big check / gift icon, headline: **"Gifts Sent!"**
  - Body: "Check your WhatsApp for the **Logic Gates PDF** and your **Free Demo Class** link."
- Big high-contrast CTA button: **🚀 Join the SSC '26 Batch Now** (cyan→green gradient, pulsing) — on click, closes this popup and dispatches the existing `binary:open-enroll` window event so `EnrollDialog` opens with the full form.
- Secondary ghost link: "Maybe later".

## 4. Refactor `EnrollDialog` → enrollment-only
File: `src/components/EnrollDialog.tsx`

- Remove the "Free Gift" framing. Title becomes **"🚀 Enroll — SSC '26 Batch"**, description focused on enrollment.
- Submit button label: `Confirm Enrollment` (no more "Get Free Gift").
- Keep all existing fields (Name, SSC Roll/Year, Mobile, Batch, Discount Code) and existing `binary:open-enroll` / `binary:apply-discount` listeners — `GiftSentDialog` and `UrgencyPopup` both continue to use that event.
- (Note: per spec the enroll form should also include School/Payment, but the existing leads schema doesn't have those columns. I'll add a `school_name` text column to `public.leads` and a School field to the form. Payment selection is already represented by the Batch dropdown + the separate `Payment` section on the page — I'll leave payment instructions there rather than embedding payment in the dialog. Flag this in the final message so the user can request more if needed.)

## 5. Button placement / sticky behavior
- **Header / Hero (`Hero.tsx`)**: replace the existing "Claim Free Gift & Enroll" CTA with a 🚀 **Enroll Now** button (opens `EnrollDialog`). Add a secondary ghost button 🎁 **Claim Free Gifts** that smooth-scrolls to `#gift-claim`.
- **Mobile sticky (`StickyCTA.tsx`)**: keep as 🚀 **Enroll Now** only (single sticky action, no gift conflation).
- **Body**: the new `GiftClaim` section is the only place the gift form lives.
- All other existing 🚀 enroll triggers (Pricing, Roadmap banner, Urgency popup) continue to open `EnrollDialog` unchanged.

## 6. Visual language separation
- 🎁 Gift = green (`--cyber-green`) glow + "Cyber-Box" border.
- 🚀 Enroll = cyan→green gradient pulse (existing).
- Icons used consistently across Hero, sticky bar, popup CTA, and section headings.

---

## Files
**Create**
- `src/components/sections/GiftClaim.tsx`
- `src/components/GiftSentDialog.tsx`
- `supabase/migrations/<ts>_gift_claims_and_school.sql` (new `gift_claims` table + RLS + `leads.school_name` column)

**Edit**
- `src/routes/index.tsx` — mount `<GiftClaim />`
- `src/components/EnrollDialog.tsx` — re-theme as enroll-only, add School field
- `src/components/sections/Hero.tsx` — split into 🚀 Enroll + 🎁 Claim Gifts buttons
- `src/components/StickyCTA.tsx` — relabel to 🚀 Enroll Now (icon + copy)

No changes to `UrgencyPopup`, `Pricing`, `Roadmap`, `Payment`, `FAQ` — they keep working via the existing `binary:open-enroll` event.

## Open question
The spec mentions enrollment fields like "School, Payment". I'll add a **School** field to the enroll dialog and add `school_name` to `leads`. Payment will continue to live in the dedicated `Payment` section (bKash instructions) rather than as a step inside the dialog — let me know if you'd prefer payment integrated into the dialog as a final step instead.