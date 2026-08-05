import { z } from "zod"

/**
 * Page blueprints — purpose defined before copy.
 *
 * Same zod-validated data-layer pattern as lib/pseo/schemas.ts, deliberately: a
 * blueprint layer that lives outside the data layer becomes a document nobody
 * reads, which is how the gap this fixes opened in the first place.
 *
 * The load-bearing field is `capabilities`. Those are ids from
 * data/product-truth.json, and the content gate rejects a blueprint referencing
 * one that is not shipped — so a page cannot be DESIGNED around a feature the
 * product lacks. That is the check that would have prevented the routing pillar
 * from being written at all. lk-gate-ignore:lead-assignment
 */

/** The 12-block skeleton from Brain 09 §1. Order never changes; types may omit. */
export const BLOCKS = [
  "hero", "tldr", "context", "methodology", "body", "midCta",
  "faq", "related", "references", "stamp", "author", "cta",
] as const
export type Block = (typeof BLOCKS)[number]

/** Intent classes from Brain 08: Informational, Commercial, Transactional, Navigational. */
export const INTENT = ["I", "C", "T", "N", "I→C", "C→T"] as const

/** Evidence tiers, strongest first — see the ladder in Phase 6. */
export const EVIDENCE_TIERS = [
  "customer-result",     // a real, consented customer outcome  (blocked today)
  "named-source",        // a named primary source (IBEF, RBI, HBR…)
  "verified-fact",       // a checkable fact about our own product (pricing, tiers)
  "product-mechanism",   // published mechanics — weights, thresholds, decay
  "illustrative-model",  // explicitly labelled model, never a result
] as const

export const BlueprintSchema = z.object({
  id: z.string().min(2),
  route: z.string().startsWith("/"),
  userIntent: z.object({
    code: z.enum(INTENT),
    query: z.string().min(2),
    job: z.string().min(8),
  }),
  businessIntent: z.string().min(8),
  /** One sentence saying why THIS page deserves to exist. Must be unique sitewide. */
  thesis: z.string().min(40),
  entities: z.array(z.string().min(2)).min(1),
  uniqueInsight: z.string().min(20),
  /** Ids from data/product-truth.json. Gate rejects unshipped ones. */
  capabilities: z.array(z.string()),
  linksIn: z.array(z.string()),
  linksOut: z.object({ min: z.number().int().min(0), required: z.array(z.string()) }),
  evidence: z.object({ tier: z.enum(EVIDENCE_TIERS), sources: z.array(z.string()) }),
  schema: z.array(z.string().min(3)).min(1),
  /** Answer-first summary an LLM can lift whole. Rendered, not just stored. */
  llmSummary: z.string().min(80),
  cta: z.object({ primary: z.string(), secondary: z.string() }),
  /** Rendered-text minimum from Brain 09 §4. A floor, not a target. 0 = design-led. */
  wordFloor: z.number().int().min(0),
  blocks: z.array(z.enum(BLOCKS)).min(3),
})

export const BlueprintFileSchema = z.object({
  version: z.number(),
  blocks: z.array(z.enum(BLOCKS)),
  pageTypes: z.array(BlueprintSchema).min(1),
})

export type Blueprint = z.infer<typeof BlueprintSchema>
