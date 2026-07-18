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
 * Industry×city hubs (`/[industry]/[city]`) and `/city/[city]` stay indexable —
 * they carry the local-context module, not a bare template permutation.
 */
export const INDEX_MAX_TIER = 2

/** A keyword-leaf / role page is indexable iff its city is Tier ≤ INDEX_MAX_TIER. */
export function leafIndexable(tier: number): boolean {
  return tier <= INDEX_MAX_TIER
}
