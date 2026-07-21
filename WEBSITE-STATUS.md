# Leadkaun Marketing Website — Full Status & Contents (End-to-End)

**Site:** `https://leadkaun.com` · Next.js 16 (App Router) → Cloudflare Workers (OpenNext) · ISR + R2 incremental cache · R2-backed programmatic data layer (`PSEO_DATA` bucket).
**Last updated:** 2026-07-21.

---

## 0. Snapshot — the numbers that matter

| Metric | Value |
|---|---:|
| **Total pages the site can serve** | **~41,461** |
| **Indexable pages (in sitemap → Google)** | **20,102** |
| **Held back (`noindex`, thin duplicates until enriched)** | **~21,000** |
| Cities in dataset | 625 |
| Cities with **verified business-district data** (rich, promoted) | **302** |
| Cities with an economic note | 498 |
| Blog posts | 33 |
| Compare pages | 15 |
| Industry hubs | 11 |
| "Best software" guides | 6 |
| "Alternatives" pages | 10 |
| Research reports | 1 |
| Feature pages | 6 |

**The core principle governing the whole site:** a page is only allowed into the sitemap (`index`) when it carries genuinely unique, real data. Near-duplicate template pages stay `noindex,follow` until they earn indexing. This protects the domain from Google's scaled-content-abuse penalty. (Owner decision, locked: keep the gate, grow with real data.)

---

## 1. COMPLETE PAGE INVENTORY (every route + what's on it)

### 1.1 Core / money pages — ✅ live
| Route | Contents | Status |
|---|---|---|
| `/` | Homepage: hero, metric strip, 12-module overview, "illustrative scenarios" (no fake testimonials), CTA. Has metadata + OG. | ✅ |
| `/product` | 12-module product overview, how-it-works, WhyNotCRM, pricing CTA. | ✅ |
| `/pricing` | Flat per-account tiers (Free / ₹2,999 / ₹7,999 / ₹19,999 / Enterprise). | ✅ |
| `/how-it-works` | Four-step flow. | ✅ |
| `/demo` | **Real demo-request form** (name/company/email/phone/team-size/time) → `/api/lead` → sales@leadkaun.com. | ✅ (was a dead-end, fixed) |
| `/contact` | Contact form → `/api/lead`. | ✅ |
| `/about` | Company page. | 🟡 thin — needs real founders/team |
| `/security` | Honest security page: TLS, Razorpay PCI-DSS, role-based access, disclosure contact. No fabricated certs. | ✅ |
| `/privacy` `/terms` | Legal. | ✅ |

### 1.2 Feature pages — ✅ 6 live (all with QuickAnswer + Speakable schema)
`/features/lead-scoring` · `/features/priority-queue` · `/features/missed-opportunity-engine` · `/features/morning-brief` · `/features/whatsapp-tracking` · `/features/sales-rep-tracking`

### 1.3 Industry hubs (`/use-cases/*`) — ✅ 11 (all with QuickAnswer via UseCaseLayout)
Hand-built (7): `real-estate` · `edtech` · `bfsi` · `healthcare` · `manufacturing` · `agencies` · `saas`
Data-driven (4, via `/use-cases/[industry]`): `retail` · `logistics` · `fintech` · `hospitality`
Plus `/use-cases` hub.

### 1.4 Compare pages — ✅ 15 (all with QuickAnswer, matrix, honest pricing, FAQ schema)
`zoho-crm` · `leadsquared` · `hubspot` · `salesforce` · `freshsales` · `pipedrive` · `zoho-bigin` · `kylas` · `telecrm` · `bitrix24` · `monday` · `close` · `selldo` · **`apollo`** · **`clay`**
(Apollo & Clay framed honestly as *complementary, different-category* tools — "Better together", not "vs".) Plus `/compare` hub.

### 1.5 "Best software" guides (`/best/*`) — ✅ 6 (ItemList + FAQ + QuickAnswer schema)
`lead-management-software-india` · `whatsapp-crm-india` · `lead-scoring-software` · `crm-for-real-estate-india` · `sales-crm-for-small-business-india` · `telecalling-crm-india` · Plus `/best` hub.

### 1.6 Alternatives (`/alternatives/*`) — ✅ 10 + hub
One "X alternatives" page per competitor (distinct SERP intent from `/compare`), cross-linked to the head-to-head compare. QuickAnswer + ItemList + FAQ schema.

### 1.7 Research / data reports (`/research/*`) — ✅ 1 report + hub
`indian-b2b-sales-lead-benchmarks-2026` — **15 verified stats, each with a real outbound citation** (HBR, MIT/InsideSales, Salesforce, Meta/Kantar, IBEF, Drift, Forbes). Dataset + Article + QuickAnswer schema. The site's first real outbound links (E-E-A-T).

### 1.8 Content hubs — ✅ live
| Hub | Count | Notes |
|---|---:|---|
| `/blog` (+ `/blog/[slug]`, `/blog/categories/[category]`) | 33 | Person-authored (Ananya Menon persona), FAQ + Article schema |
| `/glossary` (+ `/glossary/[term]`) | 29 | DefinedTerm schema |
| `/questions` (+ `/questions/[slug]`) | 26 | QAPage schema |
| `/how-to` (+ `/how-to/[slug]`) | 12 | HowTo schema |
| `/integrations` (+ `/integrations/[slug]`) | 17 | Only 4 live-indexable; 13 roadmap noindexed |
| `/resources` (+ `/resources/[slug]`) | 12 | ⚠️ none downloadable yet |
| `/tools/missed-revenue-calculator` | 1 | ROI calculator, transparent formula |

### 1.9 Programmatic pSEO (dynamic, ISR, R2-backed)
| Route family | Generated | Indexable now |
|---|---:|---|
| `/[industry]/[city]` | 6,875 | ~2,900 (gated: Tier 1-2, or Tier-3+ with data) |
| `/[industry]/[city]/[keyword]` | 27,500 | ~11,000 (4 keywords × data-rich cities) |
| `/for/[role]/[city]` | 6,250 | data-rich cities |
| `/city/[city]` | 625 | 302 (cities with real data) |

### 1.10 Infrastructure routes
`/feed.xml` (RSS) · `/api/lead` (lead capture — **live**) · `/api/revalidate` (ISR flush) · `robots.txt` · 11 sitemap shards · `llms.txt` · `ai-context.json` · dynamic `opengraph-image`.

---

## 2. DATA LAYER (`data/pseo/*.json`, served from R2 at runtime)

| File | Records | Key content |
|---|---:|---|
| `cities.json` | 625 | slug, state, tier, population, lat/lng, **notes** (498), **districts+localBiz** (302) |
| `industries.json` | 11 | ticketBand, salesCycle, channels, painPoints, FAQs, illustrative proofQuote |
| `keywords.json` | **4** | Consolidated from 8 synonyms → lead-management, lead-scoring, sales-crm, sales-automation |
| `roles.json` | 10 | buyer personas |
| `competitors.json` | 5 | (legacy; compare pages hand-built) |
| `best.json` | 6 | "best software" guides |
| `alternatives.json` | 10 | competitor alternative pages |
| `research.json` | 1 | sourced benchmark report |
| `glossary.json` / `questions.json` / `how-to.json` / `integrations.json` / `resources.json` | 29/26/12/17/12 | content hubs |

---

## 3. THE PROGRAMMATIC ENGINE (how indexation works)

- **Quality gate** (`lib/pseo/indexable.ts`): `hubIndexable(tier, population, hasNotes)` for industry×city + city pages; `leafIndexable(tier, hasRichData)` for keyword + role leaves. A city with verified `districts` auto-promotes its ~54 keyword+role leaves to `index`.
- **Content gate** (`scripts/content-gate.mjs`, `npm run gate`): blocks AI-slop phrases, fabricated-precision stats, thin industries, near-duplicate bodies. Currently **0 errors**.
- **Variation** (`lib/pseo/variation.ts`): hash-seeded intro framing + FAQ subset so sibling pages differ (never spun).
- **Sitemap** (`scripts/generate-xml-sitemap.js`): mirrors the gate — only advertises indexable URLs. Regenerates on every deploy (`postbuild`).
- **Turn-the-crank growth:** research verified per-city data → apply to `cities.json` → its leaves auto-promote. Run 6 times this cycle (50 + 109 + 45 + 9 + 39 + 50 cities).

---

## 4. ✅ WHAT'S FINISHED

**Trust & honesty (Phase 1)**
- ✅ Removed fabricated review schema (aggregateRating 4.8/50).
- ✅ Removed 7 fabricated testimonials → honest illustrative scenarios.
- ✅ Reframed all uncited external-authority stats; kept "47-min window" only as first-party framing.
- ✅ Fixed 3 false "Google Sheets live sync" claims + stale per-rep pricing.
- ✅ Corrected Sell.Do ownership error (not Anarock).
- ✅ Content quality gate enforcing all of the above.
- ✅ Honest `/security` page.

**Indexation & SEO (Phases 2-3)**
- ✅ Parent-hub quality gating (was 12,400 ungated thin → gated).
- ✅ Keyword consolidation 8 → 4 distinct intents (killed cannibalization + 2 trust bugs), 301 redirects.
- ✅ **302 cities enriched with verified business-district data** → indexable **8,596 → 20,102** (2.3×), every page data-backed. Sibling overlap ~92% → 74-80%.
- ✅ Sitemap gate-aware, fresh lastmod, in robots.txt.

**AI search / GEO (Phase 5)**
- ✅ QuickAnswer + Speakable schema on ~1,750+ pages (features, compares, best, alternatives, industry hubs, industry×city, security, research).
- ✅ `llms.txt` + `ai-context.json` fact-synced.
- ✅ Research report with real outbound citations + Dataset schema.

**Commercial surfaces**
- ✅ 15 compare pages · 10 alternatives · 6 "best" guides · 1 research report.
- ✅ `/security` page.

**Conversion (Phase 4)**
- ✅ **Lead capture ACTIVE** — `/api/lead` emails sales@leadkaun.com via Resend (sender `noreply@send.leadkaun.com`). Fixed two bugs: env read via `getCloudflareContext`, verified sender subdomain.
- ✅ `/demo` real form wired.
- ✅ Site-wide email capture (footer + research) + sticky CTA + missed-revenue calculator.

---

## 5. ⬜ WHAT'S NOT COMPLETED

### Ready but not yet applied
- 🟡 **Batch 6 city enrichment (29 verified cities)** — researched & verified (Khurja pottery, Mandya sugar, Kottayam rubber, Patan Patola silk, Khanna grain market, Tinsukia oil/tea, Bhuj, Valsad, Raebareli, Jagdalpur/NMDC, Vasco/Mormugao port…). Data in hand; **not yet written to `cities.json` / deployed**. Applying → ~302 → 331 cities, ~+1,500 indexable pages.

### Ongoing (turn-the-crank, lower value)
- ⬜ ~100 remaining candidate cities (pop <130k) — thinner verifiable data; ~9 flagged low-confidence this round were correctly excluded. Future careful batches.

### 🔒 Blocked on founder-supplied real data (cannot fabricate)
- 🔒 **Real EEAT**: founders/team names, photos, LinkedIn, `sameAs` profiles, real customer case studies, real testimonials → `/about`, `/customers`.
- 🔒 **First-party product data** for the research/data-moat reports (e.g. "across our teams, X") — the public benchmark report is done; first-party data would make it a true moat.
- 🔒 **GA4 / GSC / Clarity access** — instrumentation + **sitemap re-submission** (see §7).
- 🔒 **Lead delivery confirmation** — verify test leads actually land in sales@leadkaun.com inbox.

### Not started (future phases)
- ⬜ Pillar pages (topic clusters) — pieces exist, unwired.
- ⬜ `/templates`, `/academy`, `/docs`/API, `/changelog`, `/status`, `/customers`, `/careers`, `/partners`.
- ⬜ More `/best` categories, 5+ more compares (already have 15), migration guides.
- ⬜ Location hierarchy (`/locations/{country}/{state}/{city}`) + international (UAE) expansion.
- ⬜ More calculators/tools; downloadable/gated resources (lead magnets).
- ⬜ Grow keywords to new *distinct* intents (whatsapp-crm, telecalling-crm, field-sales).
- ⬜ VideoObject/Service/Review(real)/Course schema; Core Web Vitals field audit; image optimization.

---

## 6. STRATEGIC DOCS IN REPO
- `SEO-AI-ARCHITECTURE-AUDIT.md` — full enterprise audit + 12-dimension scorecard.
- `EXECUTION-ROADMAP.md` — 6-phase, 3-year execution tracker with live statuses.
- `WEBSITE-STATUS.md` — this file (end-to-end contents + finished/pending).

---

## 7. ⚠️ THE #1 ACTION ITEM (owner)
**Re-submit the sitemap in Google Search Console.** GSC still shows ~6k because it hasn't re-read the updated sitemap. Go to **Search Console → Sitemaps → re-add `sitemap.xml` → Submit.** This makes Google discover all **20,102** indexable URLs. Without it, the entire indexation effort stays invisible to Google.

---

## 8. DEPLOY / OPS QUICK REFERENCE
```
npm run gate            # content quality gate (must pass)
npm run cf:deploy       # build + deploy to Cloudflare Worker
npm run cf:upload-data  # sync data/pseo/*.json → R2 (directory-driven)
npm run generate-xml-sitemap   # regenerate sitemap (auto on postbuild)
```
- Lead capture secrets on the Worker: `RESEND_API_KEY`, `LEAD_NOTIFY_EMAIL=sales@leadkaun.com`, `LEAD_FROM_EMAIL=noreply@send.leadkaun.com`.
- `REVALIDATE_TOKEN` was rotated during this work — reset to a value you control if CI needs it.
- Dynamic pages read data from **R2 at runtime** — always `cf:upload-data` after changing `data/pseo/*.json`.
