import { getCities, getIndustries, getKeywords, getRoles } from "./lookup"

/**
 * Tier-0 selection — the slice of PSEO pages we pre-render at `next build`.
 * Everything else runs ISR on Cloudflare Workers (first hit renders + caches in
 * R2 incremental-cache for 24h, served instantly thereafter).
 *
 * Pre-rendered pages are written to the R2 incremental cache at deploy time, so
 * they serve as warm static responses with NO cold SSR — immune to the
 * per-request CPU limit. We therefore bake the whole high-value HEAD into the
 * build: all Tier-1 + Tier-2 cities (49 — every metro + major city, where real
 * search traffic lands) × 12 industries, plus a wide keyword + role slice. This
 * yields ~1,900 pre-rendered PSEO pages. The long tail (Tier-3/4 cities, ~72k
 * URLs) stays on-demand ISR — low traffic, and renders fine once the Workers
 * Paid CPU ceiling is in force.
 *
 * Trade-off: a larger build + R2 cache-population step. Bounded well under the
 * scale where build time becomes a problem.
 *
 * See vault: 08 - Website/Architecture/Cloudflare-R2-ISR-Migration.md
 */

const CITY_TIER_MAX     = 2    // pre-render Tier-1 + Tier-2 cities (49): metros + major cities
const TOP_CITIES_FOR_KW = 15   // keyword pages multiply 12 industries × N cities × keywords — keep tighter
const TOP_KEYWORDS      = 5    // crm-software, lead-management, lead-scoring, lead-tracking, sales-crm
const TOP_ROLES         = 5    // sales-manager, sales-head, sdr, + next two

export async function tier0Cities() {
  const cities = await getCities()
  return cities.filter((c) => c.tier <= CITY_TIER_MAX)
}

export async function tier0CitiesForKeyword() {
  return (await tier0Cities()).slice(0, TOP_CITIES_FOR_KW)
}

export async function tier0Industries() {
  // All industries are Tier-0 — only 12 of them, every one is a conversion target.
  return getIndustries()
}

export async function tier0Keywords() {
  const keywords = await getKeywords()
  return keywords.slice(0, TOP_KEYWORDS)
}

export async function tier0Roles() {
  const roles = await getRoles()
  return roles.slice(0, TOP_ROLES)
}
