# Pricing Section — Cyberpunk Premium Overhaul

## Scope
Visual + responsive overhaul of `src/components/sections/Pricing.tsx` and supporting CSS in `src/styles.css`. Verify EnrollDialog batch options and Footer location. No pricing logic, mottos, or Preloader behavior changes.

## 1. Hybrid "Master" Card

- **Animated conic border**: Replace the static dual-gradient border with a rotating conic gradient (Cyan → Purple → Cyan) using a `::before` pseudo layer behind the card content. New keyframe `hybrid-conic-spin` (4s linear infinite). Inner glass panel sits on top so only the rim animates.
- **Desktop scaling**: bump from `md:scale-110` to `md:scale-[1.15]` and ensure z-index keeps it above siblings without clipping (parent grid gets `items-stretch` + extra vertical padding so the spinner doesn't crop).
- **Mobile dominance**: keep Hybrid as middle card in the stack. Add an always-on outer cyan/purple radial glow shadow (visible at all breakpoints), and a soft `pulse-glow-hybrid` keyframe at reduced intensity on mobile.
- **Floating Early Bird badge**: new pill anchored top-right (`absolute -top-3 -right-3 md:-top-4 md:-right-4`), text **"FIRST 10: ৳1,000 OFF"**, gradient red→orange background, pulsing animation. Hybrid card only.
- **3D tilt on hover** (desktop): lightweight CSS-only tilt using `transform: perspective(1000px) rotateX/rotateY` driven by group-hover (subtle 4–6deg). Disabled under `@media (hover: none)` for touch.
- **Glassmorphism**: deepen `backdrop-blur-2xl` + layered translucent gradient background.

## 2. Other Cards (Online Pro / Offline FLEX)

- Keep neon borders (Cyan / Amber).
- Replace static border with subtle animated edge sheen on hover.
- Standardize hover lift (`-translate-y-2`) and glow intensification.

## 3. Mobile Optimization

- Grid: `grid-cols-1 md:grid-cols-3` (already correct) — confirm Hybrid renders 2nd in the DOM order so it sits in the middle on mobile while still center on desktop.
- Enroll buttons: bump to `h-14` on mobile, `h-12` on desktop, full width, with a tap-state glow burst (`active:scale-[0.98]` + `active:shadow-[0_0_40px_...]`).
- Reduce internal padding on small screens to keep cards compact.

## 4. Pricing & Sub-labels (no math changes)

- Online Pro: `৳2,449` strikethrough + `৳1,449 for first 10 students` sub-label (already wired — verify wording).
- Offline Hybrid: `৳3,989` strikethrough + bold `৳2,989 for first 10 students` sub-label + add **"BEST VALUE"** ribbon (replacing/augmenting current "MOST POPULAR" — change copy to "BEST VALUE").
- Offline FLEX: display `৳1,000 / month` as the primary line, with `৳6,000 total` as muted secondary. No discount.

## 5. Site-wide Polish

- **Footer**: read `src/components/sections/Footer.tsx`; ensure `Mukterpara, Netrokona` is present. Add if missing.
- **EnrollDialog**: read `src/components/EnrollDialog.tsx`; verify batch dropdown contains exactly `Online Pro`, `Offline FLEX`, `Offline Hybrid`. Adjust if drift.
- **Preloader**: no changes — confirm still mounted in `src/routes/index.tsx`.

## Technical Notes

- New keyframes in `src/styles.css`:
  - `@keyframes hybrid-conic-spin` — `--angle` rotation 0→360deg via `@property --angle`.
  - `@keyframes early-bird-float` — translateY ±2px + opacity pulse.
  - `@keyframes tap-glow` — used via `active:` utilities (or inline class).
- Use existing tokens: `var(--cyber-cyan)`, `var(--cyber-amber)`, `oklch(0.6 0.22 280)` for purple. No hardcoded hex except the existing red/orange Early Bird gradient.
- All transforms wrapped in `motion-safe:` where heavy, to respect `prefers-reduced-motion`.

## Files Touched
- `src/components/sections/Pricing.tsx` (overhaul)
- `src/styles.css` (new keyframes)
- `src/components/sections/Footer.tsx` (only if location missing)
- `src/components/EnrollDialog.tsx` (only if batch options drift)

## Out of Scope
Pricing values, Early Bird logic, Preloader behavior, copy/mottos elsewhere on the site.
