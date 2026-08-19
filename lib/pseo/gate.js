/**
 * SINGLE SOURCE OF TRUTH for the pSEO indexation gate — constants + pure
 * predicates. Consumed by BOTH:
 *   • lib/pseo/indexable.ts  → the routes' `robots` meta (noindex decision)
 *   • scripts/generate-xml-sitemap.js → which URLs the sitemap advertises
 * so the two can never drift and advertise a `noindex` URL to search engines.
 *
 * CommonJS on purpose: the sitemap generator is a plain Node script (`require`),
 * and the TS routes import it through the thin wrapper in `indexable.ts`.
 *
 * See vault "Leadkaun Brain" → 06 Information Architecture / 11 Technical SEO.
 */

/** Leaves index only for real metros; hubs may index one tier deeper. */
const INDEX_MAX_TIER = 2;
const HUB_INDEX_MAX_TIER = 3;
/** A substantial city with real local data indexes regardless of tier. */
const HUB_MIN_POPULATION = 150000;

/* ── Phase C: demand gate ───────────────────────────────────────────────────
 * The tier/population/districts rules above are PROXIES for demand, chosen
 * before there was traffic data. With data they read as too generous: 13,092
 * URLs were indexable and 97.5% had never earned a single impression in 28
 * days, while the 9 /best/* guides — 29% of all site impressions — sat at
 * position 74. A near-zero-authority domain cannot spend its crawl and quality
 * budget on 13k near-duplicate pages and also rank its money pages.
 *
 * So demand is now a HARD filter layered on top: a cell must be a real metro,
 * or have actually earned an impression, or be hand-approved, or be in the
 * holdout. Everything else serves 200 with `noindex, follow` — nothing is
 * deleted, and link equity still flows to the hubs and money pages.
 *
 * Callers that pass no `path` keep the old behaviour, so anything not yet
 * migrated fails OPEN (stays indexable) rather than silently deindexing.
 */
/**
 * Staged rollout switch for the demand gate.
 *
 * The cut takes the sitemap from ~13,300 URLs to ~3,300 and noindexes roughly
 * ten thousand pages. Google acts on that over weeks and re-inflating it is
 * slow, so it ships DISABLED and deploys separately from the copy, CTA, title
 * and internal-link work — which is all trivially reversible and can be read
 * on its own. Flip to true, run `npm run demand:build && npm run
 * generate-xml-sitemap`, and deploy again to execute the cut.
 *
 * Everything below is live and tested either way; this only decides whether
 * demandOk() is consulted.
 */
const DEMAND_GATE_ENABLED = false;

let DEMAND_CELLS = null;
let DEMAND_APPROVED = null;
try {
  const d = require("../../data/pseo/demand-allowlist.json");
  DEMAND_CELLS = new Set(Object.keys(d.cells || {}));
  DEMAND_APPROVED = new Set(d.approved || []);
} catch {
  // Not built yet (fresh clone, or before the first `npm run demand:build`).
  // Fail open: the gate degrades to the Phase-1 proxy rules rather than
  // deindexing the entire geo surface because a generated file is missing.
  DEMAND_CELLS = null;
  DEMAND_APPROVED = null;
}

/**
 * Seeded 10% holdout, kept INDEXED as an experimental control.
 *
 * Cutting ~12k URLs at once is the largest single change to the index this
 * site has made, and it lands while two other experiments (role×city noindex,
 * the flagship rebuild) are still being read. Without a control, any movement
 * afterwards is unattributable — a rankings lift could be the cut, the
 * flagship, or the season. This keeps a deterministic tenth of the cells that
 * WOULD be cut, so the two populations can be compared directly.
 *
 * FNV-1a over the path: stable across builds, no stored list, no randomness
 * (Math.random would reshuffle the control on every deploy).
 */
const HOLDOUT_ENABLED = true;
const HOLDOUT_BUCKET = 7; // one of ten
function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h >>> 0;
}
function inHoldout(path) {
  return HOLDOUT_ENABLED && fnv1a(path) % 10 === HOLDOUT_BUCKET;
}

/**
 * Does this cell clear the demand gate? Tier ≤ INDEX_MAX_TIER always passes —
 * a brand-new metro page must be allowed to earn its first impression, and
 * gating those on traffic would be a trap with no exit.
 */
function demandOk(path, tier) {
  if (!DEMAND_GATE_ENABLED) return true;              // staged rollout: mechanism ships inert
  if (typeof path !== "string" || !path) return true; // un-migrated caller: fail open
  if (DEMAND_CELLS === null) return true;             // allowlist not built: fail open
  if (tier <= INDEX_MAX_TIER) return true;
  if (DEMAND_CELLS.has(path)) return true;
  if (DEMAND_APPROVED.has(path)) return true;
  return inHoldout(path);
}

/**
 * Keyword-leaf / role page is indexable iff its city is Tier ≤ INDEX_MAX_TIER,
 * OR the city carries rich verified local data (a `districts` string) that
 * genuinely differentiates the leaf from its siblings.
 */
function leafIndexable(tier, hasRichData, path) {
  if (!demandOk(path, tier)) return false;
  return tier <= INDEX_MAX_TIER || !!hasRichData;
}

/**
 * Industry×city hub or /city page is indexable iff:
 *   • Tier ≤ INDEX_MAX_TIER (major metro — always), OR
 *   • Tier ≤ HUB_INDEX_MAX_TIER AND carries real local data (a `notes` string), OR
 *   • carries real local data AND is substantial (population ≥ HUB_MIN_POPULATION).
 * Smaller/undocumented markets stay noindex until enriched.
 */
function hubIndexable(tier, population, hasData, path) {
  if (!demandOk(path, tier)) return false;
  if (tier <= INDEX_MAX_TIER) return true;
  if (tier <= HUB_INDEX_MAX_TIER && !!hasData) return true;
  if (!!hasData && population >= HUB_MIN_POPULATION) return true;
  return false;
}

/**
 * Role × city pages (`/for/[role]/[city]`) are consolidated into the `/city` hub
 * as of Phase 1 (2026-08). GSC (last 3 months) showed 6 of 4,200 indexable role
 * pages earned any impression and 0 clicks, at ~61% sibling overlap — they add
 * scaled-content risk and dilute crawl budget for ~nothing. Held `noindex,follow`
 * so link equity still flows to the hubs; the pages still render (200). Flip
 * ROLE_CITY_CONSOLIDATED back to false to re-open the family (it then reuses the
 * leaf gate). Kept a predicate (not a bare false) so the route/sitemap/tracker
 * stay a single source of truth.
 */
const ROLE_CITY_CONSOLIDATED = true;
function roleCityIndexable(tier, hasRichData) {
  if (ROLE_CITY_CONSOLIDATED) return false;
  return leafIndexable(tier, hasRichData);
}

module.exports = {
  INDEX_MAX_TIER,
  DEMAND_GATE_ENABLED,
  HOLDOUT_ENABLED,
  HOLDOUT_BUCKET,
  inHoldout,
  demandOk,
  HUB_INDEX_MAX_TIER,
  HUB_MIN_POPULATION,
  ROLE_CITY_CONSOLIDATED,
  leafIndexable,
  hubIndexable,
  roleCityIndexable,
};
