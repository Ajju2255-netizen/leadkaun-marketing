import { MODULES, type SpineModule } from "./spine-content"
import { pickN, stableHash } from "./variation"

/**
 * Per-page module selection for pSEO pages.
 *
 * Previously every geo page rendered the same six module cards under the heading
 * "Twelve live modules" — six cards, twelve claimed, and Brain 00 §3 says neither
 * count is canonical. Around 700 byte-identical words shipped on ~17k pages.
 *
 * Now each page shows three modules: any that the page's own data points at
 * (a keyword's featureLink, an industry's relatedFeatures), topped up by
 * industry affinity, then by a stable per-URL hash. Same real modules, genuinely
 * different subset per cell — and the ones shown are the ones that page is about.
 *
 * Reuses stableHash/pickN from variation.ts on purpose: one seeder for the whole
 * pSEO surface, so a given URL always renders the same thing (ISR-cache-safe).
 */

const SUBSET = 3

/** Map a /features/... href or feature slug onto a module key. */
function toKey(ref: string): string {
  return ref.replace(/^\/features\//, "").replace(/^\//, "").trim()
}

export function selectModules(opts: {
  seedKey: string
  /** e.g. keyword.featureLink — the feature this page is literally about. */
  featureLink?: string
  /** e.g. industry.relatedFeatures */
  relatedFeatures?: string[]
  industrySlug?: string
}): SpineModule[] {
  const { seedKey, featureLink, relatedFeatures = [], industrySlug } = opts
  const byKey = new Map(MODULES.map((m) => [m.key, m]))
  const out: SpineModule[] = []
  const take = (m?: SpineModule) => {
    if (m && !out.some((x) => x.key === m.key) && out.length < SUBSET) out.push(m)
  }

  // 1. What this page is actually about wins the first slot.
  if (featureLink) take(byKey.get(toKey(featureLink)))
  // 2. Then whatever the industry record explicitly associates.
  for (const r of relatedFeatures) take(byKey.get(toKey(r)))
  // 3. Then modules that land hardest for this sector, seeded so siblings differ.
  if (industrySlug && out.length < SUBSET) {
    const affine = MODULES.filter((m) => m.affinity.includes(industrySlug))
    for (const m of pickN(affine, affine.length, stableHash(seedKey))) take(m)
  }
  // 4. Top up deterministically.
  if (out.length < SUBSET) {
    for (const m of pickN(MODULES, MODULES.length, stableHash(seedKey + ":fill"))) take(m)
  }
  return out
}
