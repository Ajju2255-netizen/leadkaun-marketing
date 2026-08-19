/**
 * Build the demand allowlist that gates the geo surface.
 *
 *   npm run demand:build
 *
 * Phase 1 gated the matrix on PROXIES for demand — city tier, a `districts`
 * string, population. That was the right first move without traffic data, but
 * it still left 13,092 URLs indexable of which 97.5% had never earned a single
 * impression in 28 days, at 67.9% mean sibling overlap. scripts/index-tracker.mjs
 * has said "de-duplicate or demand-gate the indexable 9,240" since Phase 1; this
 * is that gate, built from what Google actually did rather than what we guessed.
 *
 * A geo cell stays indexable iff ANY of:
 *   1. its city is Tier ≤ 2 (real metros — never gated on traffic, or a new
 *      city could never earn its first impression),
 *   2. it earned ≥1 GSC impression in the export window (proven demand),
 *   3. it is hand-approved in data/pseo/demand-approved.json,
 *   4. it falls in the seeded 10% holdout (see lib/pseo/gate.js).
 *
 * Everything else goes `noindex, follow` — still served 200, still passing link
 * equity to the hubs and money pages. Nothing is deleted.
 *
 * Reads every Pages.csv it can find (current + data/gsc/archive/) so the window
 * widens as exports accumulate rather than resetting each week.
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const GSC = join(ROOT, "data", "gsc")
const OUT = join(ROOT, "data", "pseo", "demand-allowlist.json")

/* ── CSV ─────────────────────────────────────────────────────────────────── */
function parseCsv(text) {
  const rows = []
  let row = [], field = "", q = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (q) {
      if (ch === '"') { if (text[i + 1] === '"') { field += '"'; i++ } else q = false } else field += ch
    } else if (ch === '"') q = true
    else if (ch === ",") { row.push(field); field = "" }
    else if (ch === "\n") { row.push(field); rows.push(row); row = []; field = "" }
    else if (ch !== "\r") field += ch
  }
  if (field || row.length) { row.push(field); rows.push(row) }
  const head = rows.shift()?.map((h) => h.trim()) ?? []
  return rows.filter((r) => r.length === head.length).map((r) => Object.fromEntries(head.map((h, i) => [h, r[i]])))
}

const readJson = (rel) => JSON.parse(readFileSync(join(ROOT, rel), "utf8"))
const asArray = (j) => (Array.isArray(j) ? j : j.records ?? j.items ?? [])

const cities = asArray(readJson("data/pseo/cities.json"))
const industries = asArray(readJson("data/pseo/industries.json"))
const keywords = asArray(readJson("data/pseo/keywords.json"))
const roles = asArray(readJson("data/pseo/roles.json"))

const citySlugs = new Set(cities.map((c) => c.slug))
const indSlugs = new Set(industries.map((i) => i.slug))
const kwSlugs = new Set(keywords.map((k) => k.slug))
const roleSlugs = new Set(roles.map((r) => r.slug))

/* ── collect every Pages.csv ─────────────────────────────────────────────── */
const files = []
if (existsSync(join(GSC, "Pages.csv"))) files.push(join(GSC, "Pages.csv"))
const archive = join(GSC, "archive")
if (existsSync(archive)) {
  for (const f of readdirSync(archive)) if (/^Pages.*\.csv$/i.test(f)) files.push(join(archive, f))
}
if (!files.length) {
  console.error(`No Pages.csv found under ${GSC}. Export from Search Console first.`)
  process.exit(1)
}

/** Is this path a gated geo cell, and is it well-formed? */
function classify(path) {
  const seg = path.replace(/^\/|\/$/g, "").split("/")
  if (seg.length === 2 && indSlugs.has(seg[0]) && citySlugs.has(seg[1])) return "hub"
  if (seg.length === 3 && indSlugs.has(seg[0]) && citySlugs.has(seg[1]) && kwSlugs.has(seg[2])) return "leaf"
  if (seg.length === 2 && seg[0] === "city" && citySlugs.has(seg[1])) return "cityhub"
  if (seg.length === 3 && seg[0] === "for" && roleSlugs.has(seg[1]) && citySlugs.has(seg[2])) return "role"
  return null
}

const demand = new Map() // path -> total impressions across all exports
let scannedRows = 0
for (const file of files) {
  for (const r of parseCsv(readFileSync(file, "utf8"))) {
    const key = Object.keys(r).find((k) => /page/i.test(k))
    if (!key) continue
    scannedRows++
    const path = String(r[key] ?? "").replace(/^https?:\/\/[^/]+/, "").split("?")[0]
    const impr = Number(String(r.Impressions ?? "").replace(/,/g, "")) || 0
    if (impr < 1) continue
    if (!classify(path)) continue
    demand.set(path, (demand.get(path) ?? 0) + impr)
  }
}

/* ── hand-approved cells (optional, survives regeneration) ───────────────── */
let approved = []
const approvedPath = join(ROOT, "data", "pseo", "demand-approved.json")
if (existsSync(approvedPath)) {
  try {
    const j = JSON.parse(readFileSync(approvedPath, "utf8"))
    approved = Array.isArray(j) ? j : j.paths ?? []
  } catch (e) {
    console.error(`demand-approved.json is invalid JSON: ${e.message}`)
    process.exit(1)
  }
}

const payload = {
  _readme:
    "GENERATED by scripts/build-demand-allowlist.mjs — do not hand-edit. Geo cells with proven GSC demand. " +
    "Hand-approved additions belong in data/pseo/demand-approved.json, which survives regeneration. " +
    "Consumed by lib/pseo/gate.js, which the routes AND the sitemap share.",
  generatedFrom: files.map((f) => f.slice(ROOT.length + 1)),
  cells: Object.fromEntries([...demand.entries()].sort((a, b) => b[1] - a[1])),
  approved,
}
writeFileSync(OUT, JSON.stringify(payload, null, 2) + "\n")

const byKind = {}
for (const p of demand.keys()) { const k = classify(p); byKind[k] = (byKind[k] ?? 0) + 1 }
console.log(`\n  Demand allowlist → ${OUT.slice(ROOT.length + 1)}`)
console.log(`  sources : ${files.map((f) => f.slice(GSC.length + 1)).join(", ")}`)
console.log(`  scanned : ${scannedRows} page rows`)
console.log(`  cells   : ${demand.size} geo URLs with ≥1 impression`)
for (const [k, v] of Object.entries(byKind)) console.log(`            ${k}: ${v}`)
console.log(`  approved: ${approved.length} hand-added\n`)
