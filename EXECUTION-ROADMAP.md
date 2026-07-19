# Leadkaun — Master Execution Roadmap & Tracker

**Vision:** Become the **largest Sales Behaviour knowledge base on the internet** — an industry authority, not just a CRM website — that generates thousands of buying visitors/day from Google + AI search, in India and beyond.

**The one guiding rule (front of every decision):**
> **Depth beats permutation.** Every new topic must become *the best resource on the internet* before we expand to the next. Fewer thin pages, stronger clusters, richer original data, tighter knowledge graph. This rule overrides any page-count target.

**Legend:** ✅ done · 🟡 in progress / partial · ⬜ todo · 🔒 blocked (needs real data or a secret from founder) · ♻️ recurring.
**Effort:** S (hours) · M (days) · L (weeks) · XL (months/ongoing).
**Last updated:** 2026-07-19.

---

## 0. CURRENT STATE SNAPSHOT (what actually exists today)

| Layer | Live today | Notes |
|---|---|---|
| Static/money pages | ~20 | home, pricing, product, how-it-works, demo(thin), contact, about(thin), legal |
| Feature pages | 6 | + QuickAnswer now on lead-scoring (pattern proven) |
| Industry hubs | 11 | 7 hand-built + 4 dynamic |
| Compare pages | 10 | zoho-crm, leadsquared, hubspot, salesforce, freshsales, pipedrive, zoho-bigin, kylas, telecrm, bitrix24 |
| Blog | 33 | Person-authored (Ananya Menon), FAQ + schema |
| Glossary / Questions / How-to | 29 / 26 / 12 | schema'd |
| Integrations | 17 (4 live) | roadmap ones noindexed |
| Resources | 12 | ⚠️ none downloadable |
| Tools/calculators | 1 | missed-revenue-calculator |
| **Programmatic (generated)** | **~68,900 URLs** | industry×city 6,875 · +keyword 55,000 · role×city 6,250 · city 625 |
| **Indexable (after this session's gating)** | **~5,700** | was ~12,400 — parent hubs now gated to 154 data-complete cities |
| Data entities | 10 collections | cities 625 · industries 11 · keywords 8 · roles 10 · competitors 5 · … |
| Schema types | 14 | no fabricated rating; missing Service/Video/Review/Speakable(partial)/Dataset |
| AI-search assets | llms.txt, ai-context.json, RSS | ahead of most SaaS |
| Quality gate | ✅ `npm run gate` | 0 errors; enforces honesty + fact-completeness |

**Session deltas already shipped:** parent-hub quality-gating (indexable −54%), fabricated testimonials removed, 5 compare pages, content quality gate, honest stat reframes, QuickAnswer/KeyTakeaways primitive.

---

## PHASE 1 — BUILD TRUST (Weeks 1–3) · *no new programmatic pages*

Goal: stop the trust/EEAT bleed. Highest leverage, lowest risk.

### 1A. EEAT / real identity 🔒 (needs founder-supplied real data)
- 🔒 M — Real founders + team (names, photos, roles, LinkedIn) on `/about`
- 🔒 M — Company story: mission, vision, timeline, advisors, investors, awards
- 🔒 M — Real customers / case studies (consented) — replace illustrative scenarios
- 🔒 M — Video testimonials
- ✅ S — Removed fabricated testimonials (industries.json proofQuotes → illustrative)
- ✅ S — Named author byline + Person schema (Ananya Menon) on blog
- 🔒 S — `sameAs` real profiles (LinkedIn, X, G2, Crunchbase) on Organization schema
- 🔒 S — Wikidata / Crunchbase entity entry (knowledge-graph resolution)

### 1B. Company / legal pages
- 🟡 S — `/about` (exists, thin — needs real people) · `/contact` (form exists, inbox 🔒)
- ⬜ S — `/careers` · `/partners` · `/customers` · `/press` · `/media` (press kit)
- ⬜ S — `/security` · `/status` · `/sla` · `/enterprise` · `/gdpr` · `/cookie-policy`
- ✅ — `/privacy` · `/terms`

### 1C. CRO (conversion) — *weakest area*
- 🔒 M — Real `/demo` form + Cal.com/Calendly booking (today: links to register) **CRITICAL**
- 🔒 S — Activate lead capture (`/api/lead` Resend/webhook secret) **CRITICAL** — *founder sets secret*
- ⬜ M — Live chat + WhatsApp click-to-chat widget
- ⬜ S — Newsletter capture + sticky CTA + exit-intent + comparison-page CTA
- 🔒 M — Lead magnets: make `/resources` downloadable (PDFs) → email gate
- ✅ S — Missed-revenue calculator (1st interactive tool)

### 1D. Analytics / instrumentation 🔒 (needs founder GA4/GSC access)
- 🔒 S — GA4 + event taxonomy (view_pricing, start_trial, calculator_complete, demo_request)
- 🔒 S — Search Console verify + submit gated sitemaps
- 🔒 S — Microsoft Clarity (heatmaps/session replay)
- ⬜ M — Server-side/edge events · UTM attribution · funnels

### 1E. Technical SEO
- ✅ S — **Parent-hub quality-gating** (industry×city + /city → Tier-1/2 + data-complete only). Indexable 12,400 → ~5,700.
- ✅ S — Sitemap mirrors the gate (only indexable URLs advertised)
- ⬜ M — Core Web Vitals field audit (hero/glass animation cost on mobile)
- ⬜ M — Image optimization pass (next/image + AVIF/WebP; pSEO image-light)
- ⬜ S — Explicit canonical on every dynamic family; breadcrumbs beyond pSEO
- ⬜ S — Automate the core sitemap shard (currently hand-maintained) + `lastmod`

**Exit criteria:** real people on site, funnel captures leads, GSC/GA4 live, zero ungated thin pages.

---

## PHASE 2 — BUILD AUTHORITY (Month 1) · *topics, not pages*

Goal: convert existing scattered content into **topic clusters**. Each topic = a mini-website (pillar → guide → blog → how-to → FAQ → calculator → glossary → template → comparison → video → case study → research).

### 2A. Pillar infrastructure
- ⬜ M — Build `pillars.json` entity + `/learn/[pillar]` (or `/sales/[pillar]`) route + pillar template
- ⬜ M — Pillar template wires: hub intro + QuickAnswer + KeyTakeaways + linked cluster grid + FAQ + schema
- ⬜ S — Extend `related.ts` with pillar↔cluster hard-links (supporting page → 1 canonical pillar)

### 2B. The 20 pillars (each = 20 supporting pages → 400-page foundation)
*Pieces for the first ~8 largely already exist as blog/glossary/how-to — this is wiring, not net-new writing.*
- 🟡 Lead Scoring · WhatsApp Sales · Follow-up & Response Time · Priority Queue · Missed Revenue (pieces exist, unwired)
- ⬜ Sales Behaviour (category-defining) · Lead Management · Sales Coaching · Sales Analytics · Revenue Intelligence
- ⬜ Lead Qualification · Sales Psychology · Pipeline · Sales Automation · Inside Sales · Field Sales
- ⬜ Sales KPI · CRM · Sales AI · Sales Operations · RevOps · Sales Productivity

### 2C. AI-answer content primitives (Phase-5 foundation, start now)
- ✅ S — `QuickAnswer` + `KeyTakeaways` components (Speakable schema) built
- 🟡 S — Wired to lead-scoring (verified); ⬜ roll across all feature/industry/compare/pillar templates
- ⬜ S — `DecisionMatrix` + `ProsCons` + `StatBlock` components

**Exit criteria:** 8 pillars fully wired, QuickAnswer on every money template, 400-page cluster foundation mapped.

---

## PHASE 3 — PROGRAMMATIC SCALE (Month 2) · *only after Phases 1–2*

Goal: scale the *right* axis — depth of entities, gated by quality.

### 3A. Grow entities (depth, not more cities)
- ⬜ M — Keywords 8 → 25–30 (lead-management, follow-up-automation, sales-pipeline, whatsapp-crm, telecalling-crm, field-sales, inside-sales, lead-distribution, sales-analytics, lead-nurturing…)
- ⬜ M — Industries 11 → 18 (insurance, automotive, travel, staffing, D2C, coaching, interior/construction)
- ⬜ M — Roles 10 → 25 · add Company-size, Pain-point, Sales-stage, Intent as entities
- 🔒 L — Fill 196 empty city records (or exclude from generation) — data work

### 3B. New programmatic combinations (each a distinct high-intent SERP)
- ⬜ M — `feature × industry` (/lead-scoring/real-estate) · `feature × city`
- ⬜ M — `integration × industry` · `alternative × industry` · `best-X × city`

### 3C. Gate discipline
- ✅ — `leafIndexable` (leaves) + `hubIndexable` (hubs) live
- ⬜ S — Wire a real `gateVerdict` field per record (fact-count + dedup + lint) → route reads into robots
- ⬜ S — Description + anchor-text variation via `variation.ts` (kill duplicate-meta + anchor homogenization)

**Exit criteria:** 25+ keywords, 18 industries, gate promotes only fact-complete pages, no duplicate meta at scale.

---

## PHASE 4 — GEO + INTERNATIONAL EXPANSION (Month 3) · *expand outside India*

Goal: hierarchical geo that's impossible to copy, and a spine that extends beyond India.

### 4A. India hierarchy
- ⬜ M — `/locations/india` (country pillar) → `/locations/india/[state]` (28 state pillars) → city
- ⬜ S — 301 `/city/[city]` → canonical `/locations/india/[state]/[city]` (keep alias)
- ⬜ L — Business-district pages for Tier-1 metros (BKC, Cyber City, Whitefield…) — data-gated
- ⬜ S — `AreaServed`/`GeoShape` richness on LocalBusiness

### 4B. International spine (the "expand outside India" track)
- ⬜ S — Add `country` field to city entity + `Country`/`State` collections (schema-first)
- ⬜ M — **Market 1: UAE** — seed Dubai, Abu Dhabi, Sharjah with honest local data; `/locations/uae/*`
- ⬜ M — Market 2: Southeast Asia (Singapore, KL, Jakarta) or Market 2 per founder priority
- ⬜ S — Currency/format abstraction (₹ → AED/$ per locale) in templates + schema Offer
- ⬜ M — `hreflang` + per-locale llms.txt once ≥2 locales live (NOT before — avoid premature i18n)
- 🔒 — Localized pricing + entity legitimacy per market (needs founder go/no-go per country)

**Exit criteria:** India state hierarchy live; UAE market seeded with real data; currency abstraction shipped.

---

## PHASE 5 — AI SEARCH DOMINANCE (ongoing) · *win the LLM/GEO surface*

Goal: every page contains the extractable structures LLMs cite.

- ✅ S — QuickAnswer primitive (Speakable) — *roll everywhere (Phase 2C)*
- ⬜ M — Every page: Quick Answer + Summary + Checklist + Statistics + Decision Matrix + Pros/Cons + Examples + FAQ + Tables + Sources + Definitions + Related
- ⬜ S — `Speakable` on questions/how-to/glossary · `SearchAction` (sitelinks searchbox)
- 🔒 M — **Publish citable original data** (Dataset schema) — the #1 AI-visibility gap (needs real numbers)
- ⬜ S — Entity consistency (`sameAs`, consistent "Leadkaun = Sales Behaviour OS")
- ♻️ S — Keep llms.txt / ai-context.json fact-synced on every pricing/feature change
- ♻️ S — AI-citation spot-checks (Perplexity/ChatGPT "best lead management software {industry} {city} india")

**Principle:** write **the best answer**, not 2,000 words. LLMs love tables, definitions, statistics, decision trees, comparisons.

---

## PHASE 6 — BUILD THE MEDIA COMPANY (Quarter 2+) · *where HubSpot wins*

Goal: Google/AI sees an **industry authority**, not software.

- 🔒 XL — **Leadkaun Research** (original data engine — see Data Moat below)
- ⬜ XL — **Leadkaun Academy** (`/academy`, Course schema, certification)
- ⬜ L — Leadkaun Reports · Benchmarks · Newsletter (list from Phase 1C magnets)
- ⬜ L — Leadkaun TV / Podcast / YouTube (video = huge unclaimed surface + VideoObject schema)
- ⬜ L — Leadkaun Community · Events / Webinars (Event schema)
- ⬜ L — Leadkaun Templates library (`/templates` — Template entity) · Marketplace

---

## 🏆 DATA MOAT TRACK (the most important strategic addition) 🔒

*One dataset → dozens of assets. This is the backlink + AI-citation engine. All 🔒 on founder-supplied real product data.*

| Report (♻️ recurring) | Produces |
|---|---|
| Monthly Sales Behaviour Index · Lead Response Benchmark · Conversion Rate by Industry · WhatsApp Sales Report · AI Adoption · Sales Salary · CRM Usage · Follow-up / Call / Lead-Quality / Revenue-Leakage / Pipeline Benchmarks | Research page (Dataset schema) + PDF + blog summary + press release + infographic + LinkedIn carousel + X thread + YouTube + webinar + email campaign |

- 🔒 L — Build the report template (`/research/[slug]` + Dataset schema + gated PDF)
- 🔒 ♻️ — Ship 1 report/month minimum from real anonymized product data

---

## 📊 CONTENT VOLUME TARGETS (output of the quality gate, not a target itself)

| Asset | Today | Year 1 | Year 2 |
|---|---:|---:|---:|
| Pillars | 0 wired | 20 | 20 |
| Blogs | 33 | 500 | 1,000 |
| Guides | 0 | 250 | — |
| FAQs (Q pages) | 26 | 300 | — |
| Glossary | 29 | 150 | — |
| Research reports | 0 | 50 | 100 |
| Benchmarks | 0 | 50 | — |
| Templates | 0 | 100 | 500 |
| Tools | 1 | 40 | 100 |
| Calculators | 1 | 30 | 100 |
| Comparisons | 10 | 100 | 500 |
| Alternatives | 0 | 50 | — |
| Videos | 0 | 30 | 200 |

**Programmatic entities eventual:** industries 25 · cities 700 · keywords 40 · roles 40 · problems 50 · solutions 30 · features 20 · company-size 10. *Indexable only via the quality gate — never index everything.*

---

## 🎯 KPI DASHBOARD

| Metric | 6 months | Year 1 | Years 2–3 |
|---|---:|---:|---:|
| Indexed pages | 5,000 | 30,000 | 100,000–150,000 |
| Keywords in Top 10 | 500 | 10,000 | — |
| Monthly organic visitors | — | 300,000 | 1–2M |
| Monthly AI referrals | — | 50,000 | 100,000+ |
| Referring domains | — | 500 | 2,000+ |
| Research assets | 20 | 50 | — |
| Pillars / tools / calculators | 15 / 10 / 20 | — | — |
| **Paying customers** | **100** | **1,000** | **5,000+** |

**Funnel:** Google / AI Search → Blog → Calculator → Template → Research Report → Email → Demo → Free Trial → Activation → Paid → Referral → Case Study.

---

## 🔒 BLOCKED ON FOUNDER (unblock these to accelerate everything)

1. **Lead-capture secret** (`RESEND_API_KEY` or `LEAD_WEBHOOK_URL`) — funnel is dead without it.
2. **Real EEAT data** — founders, team, photos, LinkedIn, real customers/case studies, `sameAs` profiles.
3. **Real product data** — for the entire Data Moat / research engine (the #1 AI-citation unlock).
4. **GA4 / GSC / Clarity access** — for instrumentation.
5. **International go/no-go** per market (UAE first?) + localized pricing.
6. **`REVALIDATE_TOKEN`** — reset to a value you control (rotated twice; not stored locally).

---

## ▶️ NEXT 3 SPRINTS (concrete, unblocked-first queue)

**Sprint 1 (this week) — finish trust + AI-answer rollout (all doable without founder data):**
1. ✅ Parent-hub gating · ✅ remove fake testimonials · ✅ QuickAnswer primitive
2. 🟡 Roll QuickAnswer + KeyTakeaways across all 6 features, 11 industries, 10 compares *(done: lead-scoring + all 4 /best guides; remaining: 5 features, industries, compares)*
3. ✅ **`/best/*` head-term layer** — hub + 4 honest ranked guides live (lead-management-software-india, whatsapp-crm-india, lead-scoring-software, crm-for-real-estate-india), ItemList+FAQ schema, wired to footer/sitemap/llms.txt. *(Fixed cf:upload-data to be directory-driven so best.json auto-syncs to R2.)*
4. ⬜ `/alternatives/{x}` layer for the 10 competitors + 5 new compares (Monday, Apollo, Clay, Close, Sell.Do)
5. ⬜ Company-page shells (`/security`, `/status`, `/customers`, `/careers`) — structure now, real content as it arrives
6. ⬜ Expand `/best/*` to 8–10 categories (crm-for-edtech-india, sales-crm-small-business, telecalling-crm, field-sales-app, best-crm-startups-india)

**Sprint 2 — authority wiring:**
6. ⬜ Pillar infra + wire the 8 pillars whose content already exists
7. ⬜ `feature × industry` programmatic family
8. ⬜ Description/anchor variation via `variation.ts`

**Sprint 3 — geo + international spine:**
9. ⬜ `/locations/india` + state hierarchy
10. ⬜ Country entity + UAE seed (expand outside India)
11. ⬜ Currency abstraction

---

*This tracker is the single source of truth for execution. Update statuses inline as items ship. The audit (`SEO-AI-ARCHITECTURE-AUDIT.md`) is the diagnostic companion; this is the plan.*
