
# Plan — Rebuild Roadmap as 7-Phase Interactive Accordion

## A few things to flag first

1. **Branding mismatch.** Your spec says the badge should read **"Udvash ICT Full Course · 2025/2026"**, but this site is **Binary Academy** (logo, footer, FAQ, SEO, WhatsApp message all say so). I'll default to **"Binary Academy ICT Full Course · 2025/2026"** to keep branding consistent. If you actually want "Udvash" (different brand), tell me and I'll switch — but you should also update the logo and the rest of the site.

2. **5 → 7 phase ripple.** The Hero CTA, Hero stats, sticky CTA, FAQ and SEO meta currently advertise a **"5-Phase Roadmap"**. After this change the course is a **7-phase journey**. I'll update those references to "7-Phase Roadmap" so the site stays consistent.

3. **SSC '26 vs HSC.** The current hero targets the **SSC '26 batch** for HSC ICT (i.e. students in class 10 now, going into HSC). Your new Phase content (54 lectures · 10 weeks · A+) reads like a **current HSC '26 candidate**'s crash schedule. I'll keep both audiences addressable by leaving Hero as-is but making the new roadmap header neutral. Flag if you want me to retarget the whole site to HSC '26 candidates instead.

4. **Demo CTA placement.** The "Join Free Demo Class" button currently lives at the bottom of the Roadmap section. I'll keep it directly below the new accordion (after Phase 06).

## What gets built

### New file: `src/components/sections/Roadmap.tsx` (full rewrite)

Replaces the existing 5-phase timeline with a controlled accordion + interactive progress bar.

**Header block** (centered):
- Pulsing-dot badge: "Binary Academy ICT Full Course · 2025/2026"
- H1: "Your Roadmap to **HSC ICT A+**" (last 3 words: cyan→violet gradient)
- Mono subtitle: "54 lectures · 6 chapters · 7 phases · engineered for A+"
- 4-stat strip (single bordered flex pill, vertical dividers): **54 Lectures · 6 Chapters · 10 Weeks · A+**

**7-segment progress bar** directly under header:
- Full width, 7 segments, 2px tall, gap 4px, each rounded
- Segment colored in its phase accent only when that phase is open; otherwise muted
- Click a segment → smooth-scroll to the card and open it

**Enrollment banner** (between header and Phase 00):
- Full-width rounded card, subtle cyan glowing border
- Left side: batch name "**SSC '26 / HSC '26 Batch**", timing "Starts Week 1 · 10-Week Sprint", seat counter ("32 / 50 seats taken — filling fast", with pulsing red dot)
- Middle: price (reuses `৳3,999` Offline tier from current Pricing for consistency) + included-features bullets (Live Classes · Recorded Backup · PDF Notes · Mock Tests)
- Right: accepted payment icons (bKash, Nagad, Rocket — using lucide/text labels) + bold cyan **"Enroll Now"** CTA that opens existing `EnrollDialog`
- All labels in `font-mono`

**7 Phase Accordion Cards** (vertical stack, gap 12px):
- Controlled state: `openPhase: number | null` (only one open at a time, matched to the progress bar)
- Card: `rounded-[14px]`, `1px` border that switches to phase color + colored glow when open
- Body uses `display: grid; grid-template-rows: 0fr → 1fr` transition (smooth height animation)
- Staggered fade-up on initial mount (CSS keyframe + `animation-delay: i * 80ms`)

**Card header** (clickable button, full row):
- Left: 46×46 rounded-square number badge (e.g. "00", "01"…). When open: solid phase-color background + glow `box-shadow`. When closed: subtle outline.
- Then mono phase tag (e.g. "PHASE 01 · CHAPTER 3") + bold phase title (e.g. "Digital Logic & Number Systems")
- Right: lecture count chip ("• 16 Lectures"), week pill in phase color ("Week 1–3"), chevron rotating 180° on open

**Card body** (2-col on `md+`, 1-col on mobile):
- **Left col — lecture list:** each row = small phase-colored code badge (`ICT-01`, `PRE-01`, `EXAM-01`, `AI-01`) + lecture description. "DO NOT SKIP" appears as an inline red pill on ICT-14 and ICT-15.
- **Right col — Goal box:** subtle bg, rounded border, "Phase Goal" mono label, goal copy, then a wrapped chip row (each chip = phase-tinted), then a left-bordered tip box (border-left 3px in phase color, mono tip label like "Note", "Warning Zone", "Winning Move", "Pro Tip", "Elite Tip", "Gift")
- **Phase 02 extra:** cross-link callout above the goal box ("Logic gates in Phase 01 taught you AND/OR/NOT — now apply that thinking directly in if-else and switch.")
- **Phase 04 extra:** keyword callout ("This phase is won by vocabulary, not calculation. Build a flashcard deck.")
- **Phase 05 special layout:** body splits into two halves with a thin divider and labels "DBMS Content" and "Exam Simulation Mode". Left half lists ICT-47…54, right half lists EXAM-01…04.
- **Phase 06 header:** also shows a glowing pink **"FREE BONUS"** pill
- **Phase 03 header:** also shows an emerald **"Recovery Week"** pill

All 7 phases use the exact lecture lists, goals, chips, and tips you provided.

### Color tokens

Phase colors used inline (not added to global theme to avoid tailwind-config churn):
- Phase 00 / 01: `#00d4ff` (cyan)
- Phase 02: `#a78bfa` (violet)
- Phase 03: `#34d399` (emerald)
- Phase 04: `#f87171` (red)
- Phase 05: `#fbbf24` (amber)
- Phase 06: `#f472b6` (pink)

The H1 gradient uses cyan → violet (`#00d4ff` → `#a78bfa`) per spec.

### Edits to `src/styles.css`

Add a few small keyframes/utilities:
- `@keyframes phase-fade-up` + `.animate-phase-in` (used with inline `animation-delay`)
- `@keyframes seat-pulse` for the red "filling fast" dot (reuse if similar exists)
- No removals; only additions.

### Site-wide consistency edits

- **`src/components/sections/Hero.tsx`** — change "View 5-Phase Roadmap →" → "View 7-Phase Roadmap →", change stat tile "5 Phases" → "7 Phases".
- **`src/components/StickyCTA.tsx`** — if it mentions "5-Phase", update to "7-Phase". (Will verify on edit.)
- **`src/components/sections/FAQ.tsx`** — same scan/replace if "5-phase" appears.
- **`src/routes/index.tsx`** — update the `og:description` and `description` meta from "5-Phase Roadmap" to "7-Phase Roadmap".

### What stays untouched

- Hero, Mentor, Features, Pricing, Testimonials, Payment, Footer sections (visuals, content)
- EnrollDialog, UrgencyPopup, WhatsAppFloat, DemoClassDialog
- Supabase schema (no DB changes — this is a pure UI rebuild)
- Global cyber-tech aesthetic, fonts, existing animations

## File summary

- **Rewrite:** `src/components/sections/Roadmap.tsx`
- **Edit:** `src/styles.css` (additive only), `src/components/sections/Hero.tsx`, `src/routes/index.tsx`, `src/components/StickyCTA.tsx` and `src/components/sections/FAQ.tsx` (only if they mention "5-phase")
- **No new dependencies, no new routes, no DB migration.**

## Suggested extras (only if you want them — say yes/no)

- **Sticky mini progress bar**: when the Roadmap section is in view, pin the 7-segment bar to the top of the viewport so users can navigate phases while scrolling through cards.
- **"Open all / Collapse all" toggle** above the accordion, useful for users who want to scan or print the syllabus.
- **`localStorage` "phase complete" checkboxes** — let students tick off lectures they've finished; pure client-side, gives the page repeat-visit value.
- **Auto-open Phase 00 on first load** so the page never appears as a wall of closed cards.

Tell me which extras (if any) to include and confirm the **"Binary Academy" vs "Udvash"** branding question, then I'll build it.
