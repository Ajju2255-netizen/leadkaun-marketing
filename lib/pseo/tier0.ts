import { getCities, getIndustries, getKeywords, getRoles } from "./lookup"

/**
 * Tier-0 selection — the slice of PSEO pages we pre-render at `next build`.
 * Everything else runs ISR on Cloudflare Workers (first hit renders + caches in
 * R2 incremental-cache for 24h, served instantly thereafter).
 *
 * Sized so the build produces ≤ ~350 PSEO pages regardless of total catalogue
 * size — keeps build time bounded as we scale toward 100k URLs.
 *
 * See vault: 08 - Website/Architecture/Cloudflare-R2-ISR-Migration.md
 */

const TOP_CITIES        = 10   // every Tier-1 city (the lever the sales team cares about)
const TOP_CITIES_FOR_KW = 5    // tighter — keyword pages multiply 12 × N × 3
const TOP_KEYWORDS      = 3    // crm-software, lead-management, lead-scoring
const TOP_ROLES         = 3    // sales-manager, sales-head, sdr

export async function tier0Cities() {
  const cities = await getCities()
  return cities.filter((c) => c.tier === 1).slice(0, TOP_CITIES)
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
