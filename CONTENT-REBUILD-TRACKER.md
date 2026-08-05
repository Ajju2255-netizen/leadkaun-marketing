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
| **3 — Break duplication** | Fix `measure-overlap.ts`, re-baseline, remove SellSpine's 4 identical blocks from ~17k pages | ⬜ Next |
| **4 — Page-type rebuild** | Missing blocks 6/10/11 sitewide; auto-numbering; shared hero shell; per-type stacks | ⬜ |
| **5 — Moat content** | Surface the shipped-but-unmarketed capabilities in workflow language | ⬜ |
| **6 — E-E-A-T** | `/methodology`, the evidence ladder, review timestamps, author correction | ⬜ |

---

## Live metrics

<!-- BEGIN generated:metrics -->

_Measured 2026-08-05 by `npm run tracker`. Do not hand-edit this block._

| Metric | Value | Notes |
|---|---|---|
| Gate errors | **0** | `npm run gate` — must be 0 to ship |
| Gate warnings | 6 | advisory; comparative-copy reviews + city notes |
| Ledger capabilities | 17 | 11 shipped · 4 partial · 2 not-shipped/dark |
| Shipped but unmarketed | **5** | intake-intelligence, import-readiness, score-evolution, confidence, freshness |
| Page-type blueprints | 21 | each with a unique thesis, enforced |
| Indexable URLs | 17,525 | sum of sitemap shards |
| …of which city-scoped | 17,292 (98.7%) | the concentration Phase 3 is reducing |
| Pillars / guides / glossary | 9 / 13 / 32 | the non-geo corpus |

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

### 3 — Break duplication ⬜
**Fix the instrument first.** `scripts/measure-overlap.ts` does not currently measure
SellSpine, `MethodologyCard`, `ReferencesBlock` or `SHARED_FAQS` — i.e. it excludes
exactly what Phase 3 deletes, so the reported ~52% overlap understates reality and
would barely move. Extend `leafDoc()`, re-baseline, *then* operate.

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
