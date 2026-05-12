## Problem

The Enroll multi-step dialog uses `bg-card` which is too close to the site's dark background, making the modal feel flat and unrelieving against the page behind it.

## Plan

Update `src/components/EnrollDialog.tsx` `<DialogContent>` styling only (no logic changes):

1. **Elevated surface** — replace `bg-card` with a layered background:
   - Base: slightly lighter panel using `bg-[var(--card)]` mixed with a subtle gradient (`bg-gradient-to-b from-[var(--card)] to-[var(--background)]`) so it reads as a distinct surface.
   - Add an inner top-glow accent (radial cyan tint at ~8% opacity) for depth.

2. **Stronger separation from page**
   - Thicker glowing border: keep `border-glow-cyan` but add `ring-1 ring-[var(--cyber-cyan)]/20` and `shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_-10px_var(--cyber-cyan)]`.
   - Backdrop: rely on existing Dialog overlay but darken via `backdrop-blur-md` on content edge.

3. **Rounded + padding polish** — `rounded-xl`, keep current padding.

4. **Verify in both viewports** (mobile 697px and desktop) that contrast against Hero/BinaryRain background is clear.

No changes to form logic, steps, store, or submit flow. Pure CSS class update on one element.

### Technical detail

Single edit to the `<DialogContent>` className in `EnrollDialog.tsx` (around line ~160). All tokens already defined in `src/styles.css`.
