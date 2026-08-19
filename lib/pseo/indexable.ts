/**
 * Quality-first indexation gate for the pSEO corpus.
 *
 * The thin long-tail — keyword leaves (`/[industry]/[city]/[keyword]`) and role
 * pages (`/for/[role]/[city]`) — stays `noindex,follow` until it carries real,
 * unique local facts. Industry×city hubs (`/[industry]/[city]`) and `/city/[city]`
 * are richer (they carry the local-context module) so they index one tier deeper,
 * but are NOT ungated: data-poor long-tail markets stay `noindex,follow` until the
 * city record is enriched. This concentrates ranking equity on the cities that
 * carry real facts instead of diffusing it across ~34k near-template pages.
 *
 * The gate logic + thresholds live in ONE place — `./gate.js` — which the sitemap
 * generator (`scripts/generate-xml-sitemap.js`) also consumes, so robots meta and
 * advertised URLs can never drift apart.
 */
import gate from "./gate.js";

export const INDEX_MAX_TIER: number = gate.INDEX_MAX_TIER;
export const HUB_INDEX_MAX_TIER: number = gate.HUB_INDEX_MAX_TIER;
export const HUB_MIN_POPULATION: number = gate.HUB_MIN_POPULATION;

/** Keyword-leaf / role page indexable iff Tier ≤ INDEX_MAX_TIER or rich local data. */
export function leafIndexable(tier: number, hasRichData = false, path?: string): boolean {
  return gate.leafIndexable(tier, hasRichData, path);
}

/** Industry×city hub / /city page indexable — see `./gate.js` for the full rule. */
export function hubIndexable(tier: number, population: number, hasData: boolean, path?: string): boolean {
  return gate.hubIndexable(tier, population, hasData, path);
}

/** Role × city indexable — consolidated to `noindex,follow` in Phase 1; see `./gate.js`. */
export function roleCityIndexable(tier: number, hasRichData = false): boolean {
  return gate.roleCityIndexable(tier, hasRichData);
}
