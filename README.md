# Leadkaun Marketing Site

The public website for **Leadkaun** — India's Sales Behaviour Operating System for B2B SMBs — served at [leadkaun.com](https://leadkaun.com).

Built on Next.js 16 (App Router) with ISR on Cloudflare Pages. Dark-first design with Tailwind CSS v4. Product is live; this repo is the marketing surface only.

## Run locally

```bash
npm install
npm run dev      # localhost:3001
npm run build    # builds + runs post-build sitemap generator
npm run lint
```

## Key URLs

- Marketing: `leadkaun.com` (this repo)
- App: `app.leadkaun.com` (separate repo)
- Dev marketing: `localhost:3001`
- Dev app: `localhost:3000`

## Environment

Set in `wrangler.toml` (production) and `.env.local` (dev):
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_APP_LOGIN_URL`
- `NEXT_PUBLIC_APP_REGISTER_URL`
- `NEXT_PUBLIC_APP_URL`

## Architecture

- **Framework:** Next.js 16 App Router, React 19, TypeScript
- **Styling:** Tailwind CSS v4 + custom design tokens (`app/globals.css`)
- **Fonts:** Plus Jakarta Sans (headings), Inter (body), Geist Mono (numbers/grades)
- **Deploy:** Cloudflare Pages via `@cloudflare/next-on-pages` (ISR-enabled)
- **Sitemap:** Post-build generator at `scripts/generate-xml-sitemap.js`

## Folder map

```
app/                              Next.js App Router
├── (routes)/                     38 hand-coded routes (core, features, use-cases, comparisons)
├── components/                   Shared UI (navbar, footer, hero-widget, cta-banner, etc.)
└── layout.tsx                    Root metadata + fonts

data/pseo/                        JSON data files driving PSEO routes (seeded in W4)
content/blog/                     MDX blog posts (pipeline ships in W3)
lib/                              Helpers (urls, seo, pseo, blog)
public/                           Static assets (screenshots, og, llms.txt)
scripts/                          Build-time scripts (sitemap generator, Indexing API submit)
```

## Content source

All marketing copy derives from the Obsidian vault at `~/Documents/My projects - CONF/Ajsal's vault 01/`:

- `07 - Brand Brain/` — product, audience, brand, visual, industries, competitors, SEO foundations. **Single source of truth for every word on this site.**
- `08 - Website/` — architecture, SEO strategy, page templates, content plans, data specs.
- `00 - Dashboard/*Tracker.md` — live status for website, PSEO, blog, and SEO/AIO.

Any copy change here should trace to a brain file. If a fact isn't in the brain, add it there first.

## Deploy

Push to main → Cloudflare Pages auto-deploys. Staging previews on feature branches. Full sitemap regenerates post-build. Production URLs revalidate per template (6h / 24h / 7d) via ISR.

## Roadmap

Tracked phase-by-phase in `00 - Dashboard/Website Progress Tracker.md`. Current milestones: SEO/AIO primitives (W2), blog engine + 10 seed posts (W3), PSEO data layer (W4), 9 dynamic route templates (W5), sitemap split + Indexing API (W6), scale to 100k pages (W7), production launch + monitoring (W8).

## Product

Leadkaun grades every lead A–F in under 500ms, builds per-rep Priority Queues, and surfaces missed revenue in rupees — so Indian B2B sales teams stop losing deals to stale leads. 50+ teams run on it today. 60-minute setup. Pricing in ₹999–₹2,999 per rep per month.
