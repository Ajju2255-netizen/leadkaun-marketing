/**
 * Deterministic, hash-seeded structural variation — Anti-AI-Content-System
 * Layer 2.
 *
 * Same input → same output on every render (ISR-cache-safe), but neighbouring
 * industry/city/keyword combos get different framing + a different FAQ subset, so
 * thousands of pages never read as one skeleton with the name swapped. Pools are
 * curated and finite (hand-written), so output is always coherent — never spun.
 *
 * IMPORTANT: framings carry no fabricated statistics — only honest, varied angles
 * on the same true value prop. Real numbers come from the data moat (Layer 1).
 */

/** FNV-1a — small, fast, stable across renders (no Math.random). */
export function stableHash(seed: string): number {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function pick<T>(pool: readonly T[], seed: number): T {
  return pool[seed % pool.length]
}

/** Deterministically pick `n` distinct items from `pool`, seeded (LCG shuffle). */
export function pickN<T>(pool: readonly T[], n: number, seed: number): T[] {
  if (n >= pool.length) return [...pool]
  const idx = pool.map((_, i) => i)
  let s = (seed || 1) >>> 0
  const rand = () => {
    s = (Math.imul(s, 1103515245) + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[idx[i], idx[j]] = [idx[j], idx[i]]
  }
  return idx.slice(0, n).map((i) => pool[i])
}

export type PseoVariantCtx = {
  industryName: string
  industryLower: string
  cityName: string
  keywordLabel: string
  keywordLower: string
}

// 6 honest opening framings. Different angle + sentence rhythm each; no invented
// numbers. Selected by hash so a combo always renders the same one.
export const INTRO_FRAMINGS: ReadonlyArray<(c: PseoVariantCtx) => string> = [
  (c) =>
    `${c.cityName} ${c.industryLower} teams rarely lose deals because leads are scarce. They lose them because the right lead gets called too late. ${c.keywordLabel} in Leadkaun fixes the order of work: grade every enquiry A–F on fit and intent, then work the queue top-down.`,
  (c) =>
    `Ask a ${c.industryLower} sales head in ${c.cityName} where revenue leaks, and it's rarely the top of the funnel it's the follow-up. Leadkaun's ${c.keywordLower} scores each lead so the priority queue effectively builds itself, and the ₹ at risk is visible before a deal goes cold.`,
  (c) =>
    `Most ${c.industryLower} desks in ${c.cityName} run on gut feel and the freshest enquiry. ${c.keywordLabel} replaces that with a transparent Grade A–F on every lead, so reps spend their hours on the enquiries most likely to close this week, not just the newest one.`,
  (c) =>
    `In ${c.cityName}, a ${c.industryLower} lead is warmest the moment it lands. Leadkaun's ${c.keywordLower} grades it instantly, drops it into the assigned rep's Priority Queue, and decays stale intent automatically, so nothing quietly ages out of view.`,
  (c) =>
    `Leadkaun brings ${c.keywordLower} to ${c.industryLower} teams in ${c.cityName} without the enterprise-CRM weight: every lead graded A–F in real time, a live queue that re-ranks as signals arrive, and missed revenue surfaced in rupees. Set up the same day.`,
  (c) =>
    `The ${c.industryLower} teams that win in ${c.cityName} aren't the ones with the most leads, they're the ones that call the right lead first. ${c.keywordLabel} makes "the right lead" explicit: a grade, a reason, and a queue position, on every enquiry.`,
]

export function keywordIntro(ctx: PseoVariantCtx, seed: number): string {
  return pick(INTRO_FRAMINGS, seed)(ctx)
}
