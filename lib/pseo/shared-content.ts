/**
 * Shared pSEO enrichment content — Layer 1 (curated, honest, finite).
 *
 * These pools are appended to programmatic leaf/hub pages so every page carries
 * a real methodology explanation, a sources block, and a deeper FAQ set — WITHOUT
 * per-city hand-writing. Uniqueness across neighbours still comes from the
 * hash-seeded variation layer (see variation.ts): the industry + shared FAQ
 * subsets are picked per-combo, so no two siblings show the same 8 questions.
 *
 * HONESTY: every string here is scanned by scripts/content-gate.mjs (lib/ is in
 * the QUARANTINE scope). Flat per-account pricing, WhatsApp = manual 3-tap, fixed
 * transparent weights, no latency/setup-minute claims, no superlatives.
 */

import { pickN } from "./variation"
import { SHARED_FAQS, type Faq } from "./shared-content-data"

export * from "./shared-content-data"

/**
 * Build the ~8-FAQ set for a leaf: industry-specific + keyword-specific + a
 * hash-sampled slice of the shared pool. Seeded so neighbours differ, and the
 * industry/shared subsets rotate. Deduped by question text.
 */
export function buildLeafFaqs(
  industryFaqs: readonly Faq[],
  keywordFaqs: readonly Faq[] | undefined,
  seed: number,
): Faq[] {
  const ind = pickN(industryFaqs, Math.min(3, industryFaqs.length), seed)
  const kw = (keywordFaqs ?? []).slice(0, 2)
  const shared = pickN(SHARED_FAQS, 3, seed ^ 0x9e3779b9)
  const out: Faq[] = []
  const seen = new Set<string>()
  for (const f of [...ind, ...kw, ...shared]) {
    const key = f.q.trim().toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(f)
  }
  return out
}
