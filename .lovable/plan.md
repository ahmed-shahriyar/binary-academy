## Plan

1. Replace the current site logo asset with the clean uploaded logo source, not the preview/screenshot version with checkerboard artifacts.
2. Programmatically remove any remaining near-black/gray checkerboard or speckle pixels around the logo while preserving the green/cyan logo details.
3. Save the cleaned result back to `src/assets/binary-academy-logo.png` so the existing Hero and Footer imports keep working.
4. Verify the final PNG has a real alpha channel and transparent corner/background pixels before finishing.

## Notes

- The black dots/checkerboard visible in the uploaded preview are transparency-artifact pixels, not a site styling issue.
- I will avoid changing layout, text, links, database, or other branding elements.