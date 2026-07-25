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

/**
 * Keyword-leaf / role page is indexable iff its city is Tier ≤ INDEX_MAX_TIER,
 * OR the city carries rich verified local data (a `districts` string) that
 * genuinely differentiates the leaf from its siblings.
 */
function leafIndexable(tier, hasRichData) {
  return tier <= INDEX_MAX_TIER || !!hasRichData;
}

/**
 * Industry×city hub or /city page is indexable iff:
 *   • Tier ≤ INDEX_MAX_TIER (major metro — always), OR
 *   • Tier ≤ HUB_INDEX_MAX_TIER AND carries real local data (a `notes` string), OR
 *   • carries real local data AND is substantial (population ≥ HUB_MIN_POPULATION).
 * Smaller/undocumented markets stay noindex until enriched.
 */
function hubIndexable(tier, population, hasData) {
  if (tier <= INDEX_MAX_TIER) return true;
  if (tier <= HUB_INDEX_MAX_TIER && !!hasData) return true;
  if (!!hasData && population >= HUB_MIN_POPULATION) return true;
  return false;
}

module.exports = {
  INDEX_MAX_TIER,
  HUB_INDEX_MAX_TIER,
  HUB_MIN_POPULATION,
  leafIndexable,
  hubIndexable,
};
