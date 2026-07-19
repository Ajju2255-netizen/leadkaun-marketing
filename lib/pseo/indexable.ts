/**
 * Single source of truth for the "quality-first" indexation gate.
 *
 * The thin long-tail — keyword leaf pages (`/[industry]/[city]/[keyword]`) and
 * role pages (`/for/[role]/[city]`) for smaller cities — is `noindex,follow`
 * until it carries real, unique local facts (the quality gate, Phase 3). Only
 * Tier-1/2 city leaves are indexable today. The sitemap generator
 * (`scripts/generate-xml-sitemap.js`) mirrors this threshold so it never
 * advertises a noindexed URL to search engines.
 *
 * Industry×city hubs (`/[industry]/[city]`) and `/city/[city]` are richer than a
 * bare keyword permutation (they carry the local-context module), so they get a
 * more generous gate than the leaves — but they are NOT ungated: Tier-4 markets
 * (the long tail with little unique local data) stay `noindex,follow` until the
 * city record is enriched. This concentrates ranking equity on the ~160 cities
 * that carry real facts instead of diffusing it across 7,500 near-template pages.
 */
export const INDEX_MAX_TIER = 2

/** Hub pages (industry×city, /city) may index a bit deeper than leaves. */
export const HUB_INDEX_MAX_TIER = 3

/** A keyword-leaf / role page is indexable iff its city is Tier ≤ INDEX_MAX_TIER. */
export function leafIndexable(tier: number): boolean {
  return tier <= INDEX_MAX_TIER
}

/**
 * An industry×city hub or /city page is indexable iff:
 *   • the city is Tier 1–2 (always), OR
 *   • the city is Tier 3 AND carries real local data (a `notes` string).
 * Tier-4 markets stay noindex until enriched — the quality gate, applied to the
 * two largest families the audit flagged as ungated.
 */
export function hubIndexable(tier: number, hasData: boolean): boolean {
  if (tier <= INDEX_MAX_TIER) return true
  if (tier <= HUB_INDEX_MAX_TIER && hasData) return true
  return false
}
