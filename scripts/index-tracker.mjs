/**
 * Phase 1 — Index inventory + classification tracker.
 *
 *   npm run index-tracker            # full run (enumerate + gate + overlap + write)
 *   npm run index-tracker -- --no-overlap   # skip the (slower) overlap measurement
 *
 * Enumerates EVERY URL family the site can generate, applies the SAME
 * indexability gate the routes + sitemap use (lib/pseo/gate.js — the single
 * source of truth), and reports three distinct numbers per family:
 *   - total URL space   (every valid combo; renders on demand via ISR)
 *   - indexable         (gate-advertised; what enters the sitemap)
 *   - noindex           (served 200 as noindex,follow until enriched)
 * plus near-duplicate overlap, orphan money-page detection, and a provisional
 * KEEP+INDEX / KEEP+NOINDEX / CONSOLIDATE / REDIRECT / DELETE decision per family.
 *
 * Writes INDEX-TRACKER.md (gitignored — it carries deindex strategy; the repo is
 * public). Persistent human decisions live in data/index-decisions.json (optional,
 * gitignored); real traffic-gated decisions need a GSC export dropped in data/gsc/*.csv.
 *
 * Convention-matched to update-tracker.mjs / measure-overlap.ts: .mjs, ROOT via
 * fileURLToPath, direct readFileSync+JSON.parse, no R2/async, execSync-scrape for
 * cross-script numbers.
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { createRequire } from "node:module"
import { execSync } from "node:child_process"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const require = createRequire(import.meta.url)
const { leafIndexable, hubIndexable, INDEX_MAX_TIER, HUB_INDEX_MAX_TIER, HUB_MIN_POPULATION } =
  require("../lib/pseo/gate.js")

const SKIP_OVERLAP = process.argv.includes("--no-overlap")
const TODAY = new Date().toISOString().slice(0, 10)

/* ── data loading (local JSON is the build-time source of truth) ─────────────── */
const readJson = (rel) => JSON.parse(readFileSync(join(ROOT, rel), "utf8"))
const asArray = (j) => (Array.isArray(j) ? j : j.records ?? j.items ?? [])
const pseo = (f) => asArray(readJson(join("data", "pseo", f)))
const countDirs = (rel) => {
  const p = join(ROOT, rel)
  if (!existsSync(p)) return 0
  return readdirSync(p, { withFileTypes: true }).filter((d) => d.isDirectory()).length
}
const countFiles = (rel, re) => {
  const p = join(ROOT, rel)
  if (!existsSync(p)) return 0
  return readdirSync(p).filter((f) => re.test(f)).length
}

const cities = pseo("cities.json")
const industries = pseo("industries.json")
const keywords = pseo("keywords.json")
const roles = pseo("roles.json")

const nInd = industries.length
const nKw = keywords.length
const nRole = roles.length

/* ── gate: bind city fields exactly as the routes/sitemap do ─────────────────── */
const isLeafCity = (c) => leafIndexable(c.tier, !!c.districts)
const isHubCity = (c) => hubIndexable(c.tier, c.population, (c.notes?.trim().length ?? 0) >= 20)
const leafCities = cities.filter(isLeafCity)
const hubCities = cities.filter(isHubCity)

const tierCount = (t) => cities.filter((c) => c.tier === t).length
const withNotes = cities.filter((c) => (c.notes?.trim().length ?? 0) >= 20).length
const withDistricts = cities.filter((c) => !!c.districts).length

/* ── family inventory ────────────────────────────────────────────────────────
 * kind: "geo" (gated programmatic), "data" (JSON-driven), "static" (dir/fs)
 * gsc: does a real KEEP/DELETE call need GSC traffic data? (true → provisional only)
 * overlapRisk: known near-duplicate risk that Phase-1 must address
 * ──────────────────────────────────────────────────────────────────────────── */
const dataFamily = (label, route, file, indexPred) => {
  const recs = pseo(file)
  const index = indexPred ? recs.filter(indexPred).length : recs.length
  return { label, route, kind: "data", total: recs.length, index, gsc: false }
}

const families = [
  // — programmatic geo (gated) —
  { label: "City hub", route: "/city/[city]", kind: "geo", total: cities.length, index: hubCities.length, gate: "hub", gsc: true },
  { label: "Industry × city", route: "/[industry]/[city]", kind: "geo", total: cities.length * nInd, index: hubCities.length * nInd, gate: "hub", gsc: true, overlapRisk: true },
  { label: "Industry × city × keyword", route: "/[industry]/[city]/[keyword]", kind: "geo", total: cities.length * nInd * nKw, index: leafCities.length * nInd * nKw, gate: "leaf", gsc: true, overlapRisk: true },
  { label: "Role × city", route: "/for/[role]/[city]", kind: "geo", total: nRole * cities.length, index: nRole * leafCities.length, gate: "leaf", gsc: true, overlapRisk: true },
  // — data-driven commercial/knowledge —
  dataFamily("Best guides", "/best/[slug]", "best.json", (g) => g.indexable !== false),
  dataFamily("Alternatives", "/alternatives/[slug]", "alternatives.json"),
  dataFamily("Learn pillars", "/learn/[slug]", "pillars.json", (p) => p.indexable !== false),
  dataFamily("Glossary", "/glossary/[term]", "glossary.json", (g) => g.indexable !== false),
  dataFamily("Questions", "/questions/[slug]", "questions.json"),
  dataFamily("How-to", "/how-to/[slug]", "how-to.json"),
  dataFamily("Integrations", "/integrations/[slug]", "integrations.json", (i) => i.status === "live"),
  dataFamily("Resources", "/resources/[slug]", "resources.json"),
  dataFamily("Research", "/research/[slug]", "research.json"),
  // — static / dir-based —
  { label: "Comparisons", route: "/compare/*", kind: "static", total: countDirs("app/compare"), index: countDirs("app/compare"), gsc: false },
  { label: "Feature pages", route: "/features/*", kind: "static", total: countDirs("app/features"), index: countDirs("app/features"), gsc: false },
  { label: "Blog posts", route: "/blog/[slug]", kind: "static", total: countFiles("content/blog", /\.mdx?$/), index: countFiles("content/blog", /\.mdx?$/), gsc: false },
]

/* ── orphan money-page detection (parse the reachable /best slugs) ───────────── */
const relatedSrc = readFileSync(join(ROOT, "lib/pseo/related.ts"), "utf8")
const reachableBest = new Set([...relatedSrc.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]))
const bestSlugs = pseo("best.json").map((b) => b.slug)
const orphanBest = bestSlugs.filter((s) => !reachableBest.has(s))

/* ── optional: GSC export ingest (data/gsc/*.csv) ───────────────────────────── */
function parseCsvLine(line) {
  const out = []
  let cur = "", q = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (q) { if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++ } else if (ch === '"') q = false; else cur += ch }
    else if (ch === '"') q = true
    else if (ch === ",") { out.push(cur); cur = "" }
    else cur += ch
  }
  out.push(cur)
  return out
}
function loadGsc() {
  const dir = join(ROOT, "data", "gsc")
  if (!existsSync(dir)) return null
  const files = readdirSync(dir).filter((f) => /\.csv$/i.test(f))
  if (!files.length) return null
  const rows = []
  for (const f of files) {
    const lines = readFileSync(join(dir, f), "utf8").split(/\r?\n/).filter(Boolean)
    if (lines.length < 2) continue
    const head = parseCsvLine(lines[0]).map((h) => h.trim().toLowerCase())
    const iUrl = head.findIndex((h) => /page|url|address|landing/.test(h))
    const iClk = head.findIndex((h) => /click/.test(h))
    const iImp = head.findIndex((h) => /impression/.test(h))
    if (iUrl < 0) continue
    for (const ln of lines.slice(1)) {
      const c = parseCsvLine(ln)
      let path = (c[iUrl] || "").trim()
      try { if (/^https?:\/\//.test(path)) path = new URL(path).pathname } catch {}
      if (!path.startsWith("/")) continue
      rows.push({ path, clicks: +(c[iClk] || 0) || 0, impressions: +(c[iImp] || 0) || 0 })
    }
  }
  return rows.length ? rows : null
}

// classify a path to a family label (for GSC aggregation)
const citySlugs = new Set(cities.map((c) => c.slug))
const indSlugs = new Set(industries.map((i) => i.slug))
const kwSlugs = new Set(keywords.map((k) => k.slug))
const roleSlugs = new Set(roles.map((r) => r.slug))
function familyOfPath(p) {
  const s = p.replace(/^\/|\/$/g, "").split("/")
  if (s[0] === "city" && citySlugs.has(s[1])) return "City hub"
  if (s[0] === "for" && roleSlugs.has(s[1]) && citySlugs.has(s[2])) return "Role × city"
  if (indSlugs.has(s[0]) && citySlugs.has(s[1]) && s[2] && kwSlugs.has(s[2])) return "Industry × city × keyword"
  if (indSlugs.has(s[0]) && citySlugs.has(s[1]) && !s[2]) return "Industry × city"
  const map = { best: "Best guides", alternatives: "Alternatives", learn: "Learn pillars", glossary: "Glossary", questions: "Questions", "how-to": "How-to", integrations: "Integrations", resources: "Resources", research: "Research", compare: "Comparisons", features: "Feature pages", blog: "Blog posts" }
  return map[s[0]] ?? null
}
const gscRows = loadGsc()
const gscByFamily = {}
if (gscRows) for (const r of gscRows) {
  const fam = familyOfPath(r.path)
  if (!fam) continue
  const g = (gscByFamily[fam] ??= { clicks: 0, impressions: 0, urls: 0 })
  g.clicks += r.clicks; g.impressions += r.impressions; g.urls++
}

/* ── optional: overlap headline (scrape measure:overlap) ────────────────────── */
let overlap = null
if (!SKIP_OVERLAP) {
  try {
    const out = execSync("node --experimental-strip-types scripts/measure-overlap.ts", { cwd: ROOT, encoding: "utf8", timeout: 180000, stdio: ["ignore", "pipe", "ignore"] })
    const line = out.split("\n").find((l) => /Live leaves/.test(l) && !/↳/.test(l))
    if (line) {
      const pcts = [...line.matchAll(/([\d.]+)%/g)].map((m) => +m[1])
      const pairs = (line.match(/(\d+)\s*$/) || [])[1]
      if (pcts.length >= 4) overlap = { mean: pcts[0], median: pcts[1], p90: pcts[2], dupPct: pcts[3], pairs: pairs ? +pairs : null }
    }
  } catch { /* Node < 22.6 or measure failed — leave null */ }
}

/* ── sitemap advertised total (validation cross-check) ──────────────────────── */
function sitemapAdvertised() {
  const dir = join(ROOT, "public")
  if (!existsSync(dir)) return null
  let n = 0
  for (const f of readdirSync(dir)) {
    if (!/^sitemap-.*\.xml$/.test(f)) continue
    n += (readFileSync(join(dir, f), "utf8").match(/<loc>/g) || []).length
  }
  return n
}
const advertised = sitemapAdvertised()

/* ── decisions: overrides (persist across runs) + provisional rules ─────────── */
const overridesPath = join(ROOT, "data", "index-decisions.json")
const overrides = existsSync(overridesPath) ? (readJson("data/index-decisions.json").families ?? {}) : {}
function provisionalDecision(fam) {
  if (overrides[fam.label]?.decision) return { decision: overrides[fam.label].decision, note: overrides[fam.label].note ?? "manual override" }
  if (fam.kind === "data" || fam.kind === "static")
    return { decision: "KEEP+INDEX", note: "curated; unique per record" }
  // geo
  if (fam.overlapRisk)
    return { decision: "REVIEW→CONSOLIDATE", note: "high sibling overlap; indexable set needs de-duplication / demand-gating" }
  return { decision: "KEEP+INDEX", note: "gated hub; enrich thin cities to lift the noindex tail" }
}

/* ── build tables ───────────────────────────────────────────────────────────── */
const sum = (k, kind) => families.filter((f) => !kind || f.kind === kind).reduce((a, f) => a + f[k], 0)
const totalSpace = sum("total")
const totalIndex = sum("index")
const geoIndex = sum("index", "geo")
const fmt = (n) => n.toLocaleString("en-US")
const pct = (a, b) => (b ? ((a / b) * 100).toFixed(1) : "0.0") + "%"

const rows = families.map((f) => {
  const noindex = f.total - f.index
  const d = provisionalDecision(f)
  const g = gscByFamily[f.label]
  const gsc = g ? `${fmt(g.clicks)} clk / ${fmt(g.impressions)} imp` : f.gsc ? "— (import GSC)" : "n/a"
  return { ...f, noindex, decision: d.decision, note: d.note, gsc, gscData: g }
})

function table(list) {
  const head = "| Family | Route | Total | Indexable | Noindex % | GSC pages | GSC clk/impr | Decision | Notes |\n|---|---|--:|--:|--:|--:|--:|---|---|"
  const body = list.map((r) => {
    const gp = r.gscData ? fmt(r.gscData.urls) : r.gsc === "n/a" ? "n/a" : "0"
    const gi = r.gscData ? `${fmt(r.gscData.clicks)}/${fmt(r.gscData.impressions)}` : r.gsc === "n/a" ? "n/a" : "0/0"
    return `| ${r.label} | \`${r.route}\` | ${fmt(r.total)} | ${fmt(r.index)} | ${pct(r.noindex, r.total)} | ${gp} | ${gi} | ${r.decision} | ${r.note} |`
  }).join("\n")
  return head + "\n" + body
}

// GSC coverage headline: how much of the indexable corpus earns any impression
const gscPagesMatched = Object.values(gscByFamily).reduce((a, g) => a + g.urls, 0)
const gscTotalPages = gscRows ? new Set(gscRows.map((r) => r.path)).size : 0
const gscClicks = gscRows ? gscRows.reduce((a, r) => a + r.clicks, 0) : 0
const gscImpr = gscRows ? gscRows.reduce((a, r) => a + r.impressions, 0) : 0

/* ── write INDEX-TRACKER.md ─────────────────────────────────────────────────── */
const md = `# Index Tracker — Phase 1 URL inventory & classification

<!-- BEGIN generated:index -->

_Generated ${TODAY} by \`npm run index-tracker\`. Do not hand-edit this block — edit \`data/index-decisions.json\` (family overrides) and drop a GSC export in \`data/gsc/*.csv\`, then re-run._

## Summary

| Metric | Value |
|---|---|
| **Total URL space** (every valid combo, ISR on demand) | **${fmt(totalSpace)}** |
| **Indexable** (gate-advertised → sitemap) | **${fmt(totalIndex)}** |
| **Noindex** (served 200, \`noindex,follow\`) | **${fmt(totalSpace - totalIndex)}** (${pct(totalSpace - totalIndex, totalSpace)}) |
| Geo share of indexable | ${pct(geoIndex, totalIndex)} |
| Sitemap \`<loc>\` count (cross-check vs indexable) | ${advertised == null ? "n/a" : fmt(advertised)} |
| Near-dup overlap — city-siblings, live leaves (mean · ≥0.70) | ${overlap ? `${overlap.mean}% · ${overlap.dupPct}%` : "run `npm run measure:overlap`"} |
| Orphan money pages (/best not in the geo mesh) | ${orphanBest.length === 0 ? "0 ✅" : orphanBest.join(", ")} |
| GSC export loaded | ${gscRows ? `yes — ${fmt(gscClicks)} clicks / ${fmt(gscImpr)} impressions across ${fmt(gscTotalPages)} pages (last 3mo)` : "no — drop a CSV in `data/gsc/`"} |
${gscRows ? `| **Indexable URLs with ≥1 impression** | **${fmt(gscPagesMatched)} of ${fmt(totalIndex)} (${pct(gscPagesMatched, totalIndex)})** → ${fmt(totalIndex - gscPagesMatched)} earn nothing yet |` : ""}

Gate constants (\`lib/pseo/gate.js\`): \`INDEX_MAX_TIER=${INDEX_MAX_TIER}\`, \`HUB_INDEX_MAX_TIER=${HUB_INDEX_MAX_TIER}\`, \`HUB_MIN_POPULATION=${fmt(HUB_MIN_POPULATION)}\`.
Cities: ${fmt(cities.length)} total — tier1 ${tierCount(1)}, tier2 ${tierCount(2)}, tier3 ${tierCount(3)}, tier4 ${tierCount(4)}. Leaf-indexable ${fmt(leafCities.length)} (has districts: ${fmt(withDistricts)}), hub-indexable ${fmt(hubCities.length)} (notes ≥ 20: ${fmt(withNotes)}).

## Programmatic geo families (gated)

${table(rows.filter((r) => r.kind === "geo"))}

## Curated families (data + static)

${table(rows.filter((r) => r.kind !== "geo"))}

## Decisions & legend

- **KEEP+INDEX** — deserves to rank; keep advertising it.
- **KEEP+NOINDEX** — served for users/crawl-follow but held out of the index (the gate's noindex tail).
- **CONSOLIDATE** — merge near-duplicates into a stronger canonical hub.
- **REDIRECT** — 301 into the canonical owner.
- **DELETE** — remove; no user/query justifies it.
- **REVIEW→CONSOLIDATE** — provisional: overlap flags this family; a per-URL KEEP/DELETE split needs GSC demand data.

**Traffic-gated rows (\`— (import GSC)\`)**: a real KEEP/DELETE call per URL needs Search Console impressions/clicks. Export GSC → Pages (or the URL-inspection bulk export) to \`data/gsc/*.csv\` and re-run; the tracker will join by path and fold clicks/impressions into each family (and you can then classify per-URL in \`data/index-decisions.json\`).

**Biggest levers (from the numbers above):**
1. **Role × city** (${fmt(rows.find((r) => r.label === "Role × city").total)} URLs, ${pct(rows.find((r) => r.label === "Role × city").noindex, rows.find((r) => r.label === "Role × city").total)} already noindex) — measured ~61% sibling-identical; strongest CONSOLIDATE/DELETE candidate pending demand data.
2. **Industry × city × keyword** (${fmt(rows.find((r) => r.label.includes("keyword")).total)} URLs) — the deepest leaf; de-duplicate or demand-gate the indexable ${fmt(rows.find((r) => r.label.includes("keyword")).index)}.
3. **Thin-city tail** — ${fmt(cities.length - withNotes)} cities lack a ≥20-char note (kept noindex); enriching notes/districts is what *promotes* pages rather than culling them.

<!-- END generated:index -->
`

writeFileSync(join(ROOT, "INDEX-TRACKER.md"), md)

/* ── console summary (─-ruled, like measure-overlap / truth) ────────────────── */
const rule = "─".repeat(74)
console.log(rule)
console.log("Index tracker — URL inventory & classification")
console.log(rule)
console.log(`  total URL space : ${fmt(totalSpace).padStart(9)}`)
console.log(`  indexable       : ${fmt(totalIndex).padStart(9)}   (sitemap <loc>: ${advertised == null ? "n/a" : fmt(advertised)})`)
console.log(`  noindex         : ${fmt(totalSpace - totalIndex).padStart(9)}   (${pct(totalSpace - totalIndex, totalSpace)})`)
console.log(`  geo % of index  : ${pct(geoIndex, totalIndex).padStart(9)}`)
console.log(`  overlap (live)  : ${overlap ? `${overlap.mean}% mean · ${overlap.dupPct}% ≥0.70` : "skipped/failed"}`)
console.log(`  orphan /best    : ${orphanBest.length === 0 ? "0 ✅" : orphanBest.join(", ")}`)
console.log(`  GSC rows        : ${gscRows ? fmt(gscRows.length) : "none (drop CSV in data/gsc/)"}`)
console.log(rule)
console.log(`Wrote INDEX-TRACKER.md — ${families.length} families, ${TODAY}.`)
if (advertised != null && Math.abs(advertised - totalIndex) > totalIndex * 0.05)
  console.log(`⚠️  sitemap <loc> (${fmt(advertised)}) diverges >5% from computed indexable (${fmt(totalIndex)}) — regenerate the sitemap or check the gate.`)
