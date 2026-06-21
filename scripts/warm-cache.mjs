#!/usr/bin/env node
/**
 * Cache-warming sweep for the PSEO long tail.
 *
 * WHY: ~60k heavy 3-segment keyword pages render on-demand. On the Free
 * account-plan CPU ceiling, a cold render exceeds the per-request CPU limit
 * (Cloudflare error 1102) 40-70% of the time on its FIRST hit. But the render
 * succeeds on a retry (warm isolate is JIT-fast and fits the budget), then the
 * page caches in R2 and serves warm 200 for ~1 year (stale-while-revalidate).
 *
 * So we pre-warm every URL ourselves — absorbing the 1102s here instead of
 * letting Googlebot / real visitors see them. Run after each deploy. Once the
 * account moves to full Paid (CPU gate lifts), this becomes optional.
 *
 * Usage:
 *   node scripts/warm-cache.mjs [--base=https://leadkaun.com] [--conc=8]
 *        [--retries=6] [--tiers=1,2,3,4] [--families=ic,ick,role,city]
 *        [--limit=N] [--dry]
 *
 * Priority order (value-first): tier 1+2 → 3 → 4, and within each, lighter
 * 2-seg families before the heavy keyword pages. Progress + a list of URLs that
 * never warmed (persistent 1102) are written to scripts/.warm-state/.
 */

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")
const DATA = path.join(ROOT, "data", "pseo")
const STATE_DIR = path.join(__dirname, ".warm-state")

// ---- args ----
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const m = a.match(/^--([^=]+)(?:=(.*))?$/)
    return m ? [m[1], m[2] ?? true] : [a, true]
  })
)
const BASE = (args.base || "https://leadkaun.com").replace(/\/$/, "")
const CONC = Number(args.conc || 8)
const RETRIES = Number(args.retries || 6)
const TIERS = String(args.tiers || "1,2,3,4").split(",").map(Number)
const FAMILIES = String(args.families || "ic,role,ick,city").split(",")
const LIMIT = args.limit ? Number(args.limit) : Infinity
const DRY = !!args.dry
const REQ_TIMEOUT_MS = 45000

const readJson = (f) => JSON.parse(fs.readFileSync(path.join(DATA, f), "utf8"))
const cities = readJson("cities.json")
const industries = readJson("industries.json").map((x) => x.slug)
const keywords = readJson("keywords.json").map((x) => x.slug)
const roles = readJson("roles.json").map((x) => x.slug)

// cities sorted by tier asc then population desc → value-first within a tier
const sortedCities = [...cities].sort(
  (a, b) => a.tier - b.tier || (b.population || 0) - (a.population || 0)
)

// ---- build URL list in priority order ----
function buildUrls() {
  const out = []
  const tierCities = (t) => sortedCities.filter((c) => c.tier === t)
  for (const t of TIERS) {
    const cs = tierCities(t)
    // lighter families first so high-value, low-cost pages warm before heavy ones
    if (FAMILIES.includes("city")) for (const c of cs) out.push(`/city/${c.slug}`)
    if (FAMILIES.includes("ic")) for (const c of cs) for (const i of industries) out.push(`/${i}/${c.slug}`)
    if (FAMILIES.includes("role")) for (const c of cs) for (const r of roles) out.push(`/for/${r}/${c.slug}`)
    if (FAMILIES.includes("ick")) for (const c of cs) for (const i of industries) for (const k of keywords) out.push(`/${i}/${c.slug}/${k}`)
  }
  // de-dup, cap
  const seen = new Set()
  const uniq = out.filter((u) => (seen.has(u) ? false : seen.add(u)))
  return uniq.slice(0, LIMIT)
}

async function fetchCode(url) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), REQ_TIMEOUT_MS)
  try {
    const res = await fetch(BASE + url, {
      method: "GET",
      redirect: "manual",
      signal: ctrl.signal,
      headers: { "user-agent": "leadkaun-cache-warmer/1.0" },
    })
    // drain body so the connection frees and the render fully completes
    await res.arrayBuffer().catch(() => {})
    return res.status
  } catch {
    return 0 // network drop / timeout
  } finally {
    clearTimeout(t)
  }
}

// warm one URL: retry on 503 (1102) and 0 (transient) until 200 or exhausted
async function warmOne(url) {
  let code = 0
  for (let attempt = 1; attempt <= RETRIES; attempt++) {
    code = await fetchCode(url)
    if (code === 200 || code === 404 || code === 301 || code === 308) return { url, code, attempt }
    // 503 (1102) / 0 → small backoff, lets the isolate warm
    await new Promise((r) => setTimeout(r, 400 * attempt))
  }
  return { url, code, attempt: RETRIES }
}

async function run() {
  const urls = buildUrls()
  fs.mkdirSync(STATE_DIR, { recursive: true })
  const startedTag = new Date().toISOString().replace(/[:.]/g, "-")
  const failPath = path.join(STATE_DIR, `unwarmed-${startedTag}.txt`)
  const progressPath = path.join(STATE_DIR, "progress.log")

  const total = urls.length
  let done = 0, ok = 0, fail = 0, healed = 0
  const log = (m) => {
    const line = `[${new Date().toISOString()}] ${m}`
    console.log(line)
    try { fs.appendFileSync(progressPath, line + "\n") } catch {}
  }

  log(`WARM START base=${BASE} urls=${total} conc=${CONC} retries=${RETRIES} tiers=${TIERS} families=${FAMILIES}${DRY ? " (DRY)" : ""}`)
  if (DRY) { log(`DRY RUN — first 10:\n${urls.slice(0, 10).join("\n")}`); return }

  let idx = 0
  async function worker() {
    while (idx < urls.length) {
      const u = urls[idx++]
      const r = await warmOne(u)
      done++
      if (r.code === 200 || r.code === 404 || r.code === 301 || r.code === 308) {
        ok++
        if (r.attempt > 1 && r.code === 200) healed++
      } else {
        fail++
        try { fs.appendFileSync(failPath, `${r.code}\t${u}\n`) } catch {}
      }
      if (done % 250 === 0 || done === total) {
        const pct = ((done / total) * 100).toFixed(1)
        log(`progress ${done}/${total} (${pct}%)  ok:${ok}  healed-on-retry:${healed}  unwarmed:${fail}`)
      }
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker))

  log(`WARM DONE  total:${total}  ok:${ok}  healed-on-retry:${healed}  unwarmed:${fail}`)
  if (fail) log(`unwarmed URLs (persistent 1102) → ${failPath}`)
}

run().catch((e) => { console.error("warm-cache failed:", e); process.exit(1) })
