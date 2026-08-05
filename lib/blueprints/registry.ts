import blueprints from "@/data/blueprints.json"
import type { Blueprint } from "./schema"

/**
 * Route → blueprint resolution.
 *
 * Kept as an explicit ordered list rather than derived from the filesystem: the
 * mapping is a design decision (which spec governs this page), not a naming
 * coincidence, and the content gate asserts every rendered route resolves here.
 * Most specific pattern wins, so /use-cases/manufacturing resolves to `industry`
 * before the catch-all can claim it.
 */

const TYPES = (blueprints as unknown as { pageTypes: Blueprint[] }).pageTypes

/** Ordered most-specific-first. `*` matches one path segment. */
const ROUTES: Array<[string, string]> = [
  ["/", "homepage"],
  ["/product", "product"],
  ["/pricing", "pricing"],
  ["/how-it-works", "product"],
  ["/features/*", "feature"],
  ["/compare/*", "compare"],
  ["/alternatives/*", "alternatives"],
  ["/best/*", "best"],
  ["/learn/*", "learn"],
  ["/research/*", "research"],
  ["/blog/*", "blog"],
  ["/glossary/*", "glossary"],
  ["/questions/*", "questions"],
  ["/how-to/*", "howto"],
  ["/tools/*", "calculator"],
  ["/resources/*", "resources"],
  ["/integrations/*", "integration"],
  ["/use-cases/*", "industry"],
  ["/city/*", "city"],
  ["/for/*/*", "role-city"],
  ["/*/*/*", "industry-city-keyword"],
  ["/*/*", "industry-city"],
]

function matches(pattern: string, path: string): boolean {
  const p = pattern.split("/").filter(Boolean)
  const s = path.split("/").filter(Boolean)
  if (p.length !== s.length) return false
  return p.every((seg, i) => seg === "*" || seg === s[i])
}

const byId = new Map(TYPES.map((t) => [t.id, t]))

/** Resolve a rendered path to its governing blueprint, or null if unmapped. */
export function blueprintForPath(path: string): Blueprint | null {
  const clean = "/" + path.split("?")[0].split("#")[0].replace(/^\/+|\/+$/g, "")
  for (const [pattern, id] of ROUTES) {
    if (matches(pattern, clean === "/" ? "/" : clean)) return byId.get(id) ?? null
  }
  return null
}

export function blueprintById(id: string): Blueprint | null {
  return byId.get(id) ?? null
}

export function allBlueprints(): Blueprint[] {
  return TYPES
}

/** Pages whose own data supplies a quick answer override this; the rest fall back here. */
export function llmSummaryFor(path: string): string | null {
  return blueprintForPath(path)?.llmSummary ?? null
}
