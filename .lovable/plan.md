## Problem

The current logo file (`src/assets/binary-academy-logo.png`) is saved in RGB mode with no alpha channel — the "transparent" checkerboard you saw earlier was just the editor preview. On the actual site, the white pixels render as a solid white square behind the logo, which looks bad on the dark cyberpunk background.

## Fix

Programmatically convert the logo to true RGBA transparency:

1. Open `src/assets/binary-academy-logo.png` with Pillow.
2. Convert to RGBA.
3. Remove the white/near-white background by setting alpha=0 for any pixel where R, G, B are all above a threshold (≈235), with a soft falloff on near-white pixels to avoid jagged edges around the binary digits and the "B" glow.
4. Save back to the same path so all existing imports (Hero, Footer) pick it up automatically with no code changes.

No component code needs to change — only the image asset is rewritten.

## Technical details

- Use a vectorized numpy mask: `alpha = 0` where `min(R,G,B) > 235`, scaled linearly between 200–235 for soft anti-aliased edges.
- Preserve the green binary digits and cyan "B" untouched (they're well below the white threshold).
- Output stays PNG at the same path; no import changes in `Hero.tsx` or `Footer.tsx`.