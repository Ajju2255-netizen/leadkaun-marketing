# Content Architecture Rebuild — Tracker

Six phases, gated. Run `npm run tracker` to refresh the metrics block; it measures
the repo rather than trusting this file.

**Why this exists.** A GSC audit showed the site was relevant but not authoritative.
Fixing that turned out to need three different things: removing signals that pulled
the wrong traffic, redirecting internal authority to the pages that convert, and —
the one nobody had — a machine link between marketing copy and what the product
actually ships. The third is what made the first two safe.

> Prior status docs in this repo (`EXECUTION-ROADMAP.md`, `WEBSITE-STATUS.md`) are
> stale and superseded by the vault manual "Leadkaun Brain v1.0" plus this tracker.
> The Brain remains the source of truth for *strategy*; `data/product-truth.json` is
> the source of truth for *what ships*. Where they disagree, the ledger wins — it
> cites code.

---

## Status

| Phase | What it does | Status |
|---|---|---|
| **0 — Product Truth Ledger** | `data/product-truth.json` + gate enforcement, so copy can't claim unshipped features | ✅ Done |
| **1 — Truth correction** | Clear every false claim; honest rewrite of the routing pages; close the index-gate gap | ✅ Done |
| **2 — Blueprint layer** | Purpose (thesis, intent, entities, evidence, links) defined per page type and enforced | ✅ Done |
| **3 — Break duplication** | Fix `measure-overlap.ts`, re-baseline, remove SellSpine's 4 identical blocks from ~17k pages | ✅ Done |
| **4 — Page-type rebuild** | Missing blocks 6/10/11 sitewide; auto-numbering; `/best` ranking methodology | ✅ Done |
| **5 — Moat content** | Surface the shipped-but-unmarketed capabilities in workflow language | ✅ Done |
| **6 — E-E-A-T** | `/methodology`, the evidence ladder, review timestamps, author correction | ✅ Done |

---

## Live metrics

<!-- BEGIN generated:metrics -->

_Measured 2026-08-06 by `npm run tracker`. Do not hand-edit this block._

| Metric | Value | Notes |
|---|---|---|
| Gate errors | **0** | `npm run gate` — must be 0 to ship |
| Gate warnings | 6 | advisory; comparative-copy reviews + city notes |
| Ledger capabilities | 17 | 11 shipped · 4 partial · 2 not-shipped/dark |
| Shipped but unmarketed | **0** | — |
| Page-type blueprints | 21 | each with a unique thesis, enforced |
| Indexable URLs | 17,533 | sum of sitemap shards |
| …of which city-scoped | 17,292 (98.6%) | the concentration Phase 3 is reducing |
| Pillars / guides / glossary | 11 / 13 / 37 | the non-geo corpus |

<!-- END generated:metrics -->

---

## Phase notes

### 0 — Product Truth Ledger ✅
The systemic fix, and the reason the rest is trustworthy. 17 capabilities, each with
the prose that *is* allowed, deny patterns, and product-repo evidence paths that are
asserted to exist — so if the product moves, the ledger fails and forces a re-audit.

Caught immediately: an entire pillar and buyer guide built on lead routing that does
not exist. Also **corrected the manual** — Brain `00 §4` bans Google Sheets sync as
"non-functional, model never migrated", but the migration landed one day before the
Brain was authored. It ships. Brain `00 §4` needs updating, not the site.

`npm run truth` reports the inverse risk: shipping more than we claim.

### 1 — Truth correction ✅
53 gate errors → 0. `/best/lead-routing-software` now ranks Zoho CRM first and
excludes Leadkaun entirely, saying why. `/learn/lead-routing` carries a section
titled "Where Leadkaun stops, plainly". `/glossary/unassigned-queue` described a UI
that does not exist and was deleted (308 → `assignment-rules`).

`/learn` and `/best` had **no** `robots` control at all, which is why the false pages
went live indexed; both now honour `"indexable": false`, kept in sync with the sitemap.

### 2 — Blueprint layer ✅
21 page types in `data/blueprints.json`, validated by `lib/blueprints/schema.ts`.
Each carries thesis, user + business intent, entities, unique insight, capabilities,
link contract, evidence tier, schema, LLM summary, CTA, word floor and block stack.

Enforced by the gate, not documented:
- `thesis` must be unique sitewide (Jaccard ≥ 0.5 fails) — the machine-readable
  version of "every page needs its own reason to exist"
- `wordFloor` must match Brain `09 §4`
- `schema[]` must be emittable by `lib/seo.ts`
- **`capabilities[]` must be shipped per the ledger** — so a page cannot be *designed*
  around a feature the product lacks. This is the check that would have stopped
  `/learn/lead-routing` being written at all.

Verified by injecting three deliberate violations; all three failed correctly.

`llmSummary` is rendered, not stored: `npm run generate-llms` writes a per-page-type
section into `public/llms.txt` (one entry per URL *family* — rendering a type-level
summary on every sibling page would manufacture the duplication Phase 3 removes).

### 3 — Break duplication ✅
The instrument was measuring the wrong corpus. `leafDoc()` excluded all four
SellSpine blocks, `MethodologyCard`, `ReferencesBlock`, the shared FAQ pool and
`kw.body` — exactly what this phase deletes. Fixed and re-baselined *before* any
surgery: the true baseline was **71.6% mean / 61.4% near-duplicate pairs**, not 52%.

`WhyNotCRM` and `PricingCTA` removed from pSEO entirely; `ModulesGrid` now renders
a 3-module subset chosen from each page's own data.

| | baseline | after |
|---|---|---|
| city-siblings, mean | 71.6% | 67.9% |
| city-siblings, ≥0.70 | **61.4%** | **33.7%** |
| industry-siblings, ≥0.70 | 37.7% | 1.6% |

**Missed target, stated plainly:** the plan wanted a ≥15pt *mean* drop. The mean fell
3.7pt; it was the near-duplicate share that collapsed. What remains is
`MethodologyCard`, `ReferencesBlock` and the shared FAQ pool — deliberately
identical, because they are the published methodology and the citations. Cutting
them would buy a metric and cost evidence.

### 4 — Page-type rebuild ✅
Blocks 6, 10 and 11 existed only on `/blog`. `ReviewStamp` and `AuthorLine` reach
16 page types; `MidCta` is on the long-form types (`/learn`, `/best`, `/how-to`).

`createSectionNumbering()` is applied to the five templates whose numbering had
drifted — verified contiguous in the rendered HTML: `/for/[role]/[city]` ran
01,03,04,05,08,09 and now runs 01–08; `/research/[slug]` computed `si+2` in a
variable-length loop while the next section hardcoded `07`, so any report without
exactly five sections collided or skipped. `/best` gained the ranking-methodology block
Brain 09 §3.7 requires and which was missing — it states the conflict of interest
outright. Unused components (`TrustStrip`, `KeyTakeaways`, `GlassPanel`) deleted so
they are not mistaken for patterns.

### 5 — Moat content ✅
Two pillars for the two ownable theses: `/learn/lead-data-trust` (Confidence,
Freshness, Readiness, Intake, Score Evolution — all *epistemic*, an axis no Indian
SMB CRM markets) and `/learn/sales-execution-measurement`, which says out loud that
we measure whether a recommendation was **followed**, not whether it **worked**.
Plus 5 glossary terms, and the two strongest capabilities got sections on the
feature pages that own them: Confidence-vs-Grade on `/features/lead-scoring`
("a thin lead is not a bad lead"), and recommendation adoption on
`/features/sales-rep-tracking` — which states its own limit, that we measure
whether a recommendation was *followed*, not whether it *worked*.

A gate rule now rejects capability headings opening on an adjective
(`AI…`, `Smart…`, `Powerful…`): open on what happens, not on a claim.

`npm run truth`: 5 unmarketed capabilities → **0**.

### 6 — E-E-A-T ✅
`/methodology` is the substitute for case studies we do not have: the engine's own
published mechanics, which competitors structurally cannot copy because publishing
them means committing to fixed weights. No `/customers` shell — an empty one is a
credibility hole that invites fabrication.

The quarantined stats (₹18L recovered, 3.4× lift, ₹4.2 Cr, "50+ Indian B2B teams")
are gone from the homepage, `/about`, `/product`, `ProofBand`, `roles.json`,
`resources.json` and a blog post — replaced by product-mechanism facts, with gate
rules so they cannot return. The `ananya` **Person** byline is demoted to
Organization: a Person with no avatar, no url and no `sameAs` is an E-E-A-T
liability, and it was shipping on 33 posts.

`/resources/[slug]` emitted `breadcrumbList` alone — the weakest schema on the
site — and now carries an `ItemList` of what is actually in each asset.

**Brain `00 §4` corrected in the vault.** It banned Google Sheets sync as
"non-functional, model never migrated"; the migration landed one day before the
doc was authored. The ban is replaced with the verified shipped-state plus a
pointer to `data/product-truth.json` as the machine-checked source of truth.

---

## Commands

| Command | What it tells you |
|---|---|
| `npm run gate` | Any copy claiming more than the product ships. Must be 0 to ship. |
| `npm run truth` | Shipped capabilities with no marketing coverage. |
| `npm run tracker` | Refreshes the metrics block above from real state. |
| `npm run measure:overlap` | Cross-page duplication (see Phase 3 caveat). |
| `npm run generate-xml-sitemap` | Rebuilds sitemap shards; honours `indexable: false`. |
| `npm run generate-llms` | Rebuilds the blueprint section of `llms.txt`. |

## Verification standard

Data changes require a dev-server restart before any check is meaningful —
`lib/pseo/lookup.ts` memoises JSON per process. Observe on `:3001`; don't infer.
Production reads pSEO data from the R2 `PSEO_DATA` binding, so `npm run cf:upload-data`
is required before a deploy reflects data changes.
