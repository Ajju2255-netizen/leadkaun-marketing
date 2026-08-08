# Bundled display font

**Fraunces** (variable) — SIL Open Font License 1.1.
Source: Google Fonts · https://fonts.google.com/specimen/Fraunces

Self-hosted deliberately. `next/font/google` fetches at build time and has caused
transient "Failed to fetch from Google Fonts" build failures on this project (see
the note at the top of `app/layout.tsx`), so every face this site uses is bundled:
Geist Sans/Mono come from the `geist` npm package, and Fraunces lives here.

Loaded via `next/font/local` in `app/layout.tsx` as `--font-display`.
