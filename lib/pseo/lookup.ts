import { z } from "zod"
import {
  CitySchema, IndustrySchema, KeywordSchema, RoleSchema, CompetitorSchema,
  type City, type Industry, type Keyword, type Role, type Competitor,
} from "./schemas"

/**
 * Dual-mode PSEO data layer.
 *
 *   • Runtime on Cloudflare Workers   → R2 bucket `leadkaun-pseo` (binding `PSEO_DATA`)
 *   • Build-time / local dev / Node   → filesystem fallback (`data/pseo/*.json`)
 *
 * No `unstable_cache` wrapping — that isolates request context and breaks
 * `getCloudflareContext()` access to bindings. Caching is handled by page-level
 * ISR (`export const revalidate = 86400` on every PSEO route): each long-tail
 * URL renders at most once per 24h per edge node, so R2 reads stay minimal.
 *
 * Per-request memo on `globalThis` deduplicates parallel `getCity()` /
 * `getIndustry()` / `getKeyword()` calls within a single render.
 *
 * See vault: 08 - Website/Architecture/Cloudflare-R2-ISR-Migration.md
 */

// ─────────────────────────────────────────────────────────────────────────
// Raw JSON loaders — one per data file. Dual-source (R2 → fs).
// ─────────────────────────────────────────────────────────────────────────

const memo = new Map<string, Promise<unknown>>()

// Workers runtime fingerprint — `navigator.userAgent === "Cloudflare-Workers"` only
// holds inside a Worker (true in `wrangler dev` miniflare too). In Node (next build,
// next dev, sitemap script) this is false, so we bypass the @opennextjs/cloudflare
// import entirely — its `getCloudflareContext` triggers workerd internals when
// invoked from OpenNext's build pipeline and is uncatchable.
function isCloudflareWorker(): boolean {
  return typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers"
}

async function loadJsonRaw(key: string): Promise<unknown> {
  const existing = memo.get(key)
  if (existing) return existing

  const promise = (async () => {
    if (isCloudflareWorker()) {
      const { getCloudflareContext } = await import("@opennextjs/cloudflare")
      const ctx = await getCloudflareContext({ async: true })
      const r2 = ctx?.env?.PSEO_DATA as R2Bucket | undefined
      if (!r2) throw new Error("[pseo] PSEO_DATA binding missing on the Worker")
      const obj = await r2.get(key)
      if (!obj) throw new Error(`[pseo] R2 key not found: ${key}`)
      return obj.json()
    }

    // Node fallback — `next build`, `next dev`, sitemap script.
    const [{ readFile }, { join }] = await Promise.all([
      import("node:fs/promises"),
      import("node:path"),
    ])
    const filePath = join(process.cwd(), "data/pseo", key)
    const buf = await readFile(filePath, "utf8")
    return JSON.parse(buf)
  })()

  memo.set(key, promise)
  // On failure, evict so subsequent calls retry instead of getting a stuck rejection.
  promise.catch(() => memo.delete(key))
  return promise
}

function makeLoader<T>(key: string, schema: z.ZodType<T>, label: string): () => Promise<T[]> {
  return async () => {
    const raw = await loadJsonRaw(key)
    const parsed = z.array(schema).safeParse(raw)
    if (!parsed.success) {
      throw new Error(`[pseo] Invalid ${label}: ${parsed.error.message}`)
    }
    return parsed.data
  }
}

const loadAnyJson = (key: string): (() => Promise<unknown[]>) =>
  async () => {
    const raw = await loadJsonRaw(key)
    if (!Array.isArray(raw)) throw new Error(`[pseo] ${key} is not an array`)
    return raw
  }

// Typed core (schema-validated)
export const getCities      = makeLoader<City>("cities.json",      CitySchema,      "cities")
export const getIndustries  = makeLoader<Industry>("industries.json", IndustrySchema, "industries")
export const getKeywords    = makeLoader<Keyword>("keywords.json",  KeywordSchema,    "keywords")
export const getRoles       = makeLoader<Role>("roles.json",        RoleSchema,       "roles")
export const getCompetitors = makeLoader<Competitor>("competitors.json", CompetitorSchema, "competitors")

// Untyped extras (each consumer narrows with its own type cast)
export const getGlossary     = loadAnyJson("glossary.json")
export const getQuestions    = loadAnyJson("questions.json")
export const getHowTo        = loadAnyJson("how-to.json")
export const getIntegrations = loadAnyJson("integrations.json")
export const getResources    = loadAnyJson("resources.json")

// ─────────────────────────────────────────────────────────────────────────
// Slug-based getters — async, mirror the previous sync API surface.
// ─────────────────────────────────────────────────────────────────────────

export async function getCity(slug: string): Promise<City | null> {
  const list = await getCities()
  return list.find((c) => c.slug === slug || c.aliases.includes(slug)) ?? null
}

export async function getIndustry(slug: string): Promise<Industry | null> {
  const list = await getIndustries()
  return list.find((i) => i.slug === slug) ?? null
}

export async function getKeyword(slug: string): Promise<Keyword | null> {
  const list = await getKeywords()
  return list.find((k) => k.slug === slug) ?? null
}

export async function getRole(slug: string): Promise<Role | null> {
  const list = await getRoles()
  return list.find((r) => r.slug === slug) ?? null
}

export async function getCompetitor(slug: string): Promise<Competitor | null> {
  const list = await getCompetitors()
  return list.find((c) => c.slug === slug) ?? null
}

// ─────────────────────────────────────────────────────────────────────────
// Slug + alias helpers (async)
// ─────────────────────────────────────────────────────────────────────────

export async function resolveCitySlug(input: string): Promise<string | null> {
  const match = await getCity(input)
  return match?.slug ?? null
}

export async function isCanonicalCitySlug(slug: string): Promise<boolean> {
  const list = await getCities()
  return list.some((c) => c.slug === slug)
}

export async function cityAliasRedirects(): Promise<{ from: string; to: string }[]> {
  const list = await getCities()
  const out: { from: string; to: string }[] = []
  for (const c of list) {
    for (const alias of c.aliases) {
      out.push({ from: alias, to: c.slug })
    }
  }
  return out
}

// ─────────────────────────────────────────────────────────────────────────
// Display helpers
// ─────────────────────────────────────────────────────────────────────────

export function cityWithState(city: City): string {
  return `${city.name}, ${city.state}`
}

export async function industriesServedInCity(citySlug: string): Promise<Industry[]> {
  const city = await getCity(citySlug)
  if (!city) return []
  const all = await getIndustries()
  return city.industries
    .map((s) => all.find((i) => i.slug === s) ?? null)
    .filter((i): i is Industry => i !== null)
}

export async function citiesServingIndustry(industrySlug: string): Promise<City[]> {
  const list = await getCities()
  return list.filter((c) => c.industries.includes(industrySlug))
}
