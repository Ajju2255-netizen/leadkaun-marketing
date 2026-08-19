/**
 * GSC performance report — the weekly read.
 *
 *   npm run gsc:report                 # full report
 *   npm run gsc:report -- --json       # machine-readable
 *
 * Drop a fresh Search Console "Performance on Search" export into data/gsc/
 * (Pages.csv + Queries.csv, optionally Chart.csv / Countries.csv / Devices.csv)
 * and run this. It answers the three questions the growth plan turns on:
 *
 *   1. Which URL FAMILY earns impressions, and at what position?
 *      (9 /best/* pages out-earn 422 geo pages — that ratio is the whole thesis.)
 *   2. What share of impressions is QUALIFIED vs junk intent?
 *      (Ranking #4 for "barabanki is which tier city" converts at 0% forever.)
 *   3. Where is the leverage — high impressions at bad position (authority
 *      problem) vs good position at zero clicks (CTR/intent problem)?
 *
 * Convention-matched to index-tracker.mjs / update-tracker.mjs: .mjs, ROOT via
 * fileURLToPath, direct readFileSync, no async, stdout only (writes nothing).
 */

import { readFileSync, existsSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const GSC = join(ROOT, "data", "gsc")
const AS_JSON = process.argv.includes("--json")

/* ── CSV (GSC quotes any field containing a comma or quote) ──────────────────── */
function parseCsv(text) {
  const rows = []
  let row = [], field = "", inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i++ } else inQuotes = false
      } else field += ch
    } else if (ch === '"') inQuotes = true
    else if (ch === ",") { row.push(field); field = "" }
    else if (ch === "\n") { row.push(field); rows.push(row); row = []; field = "" }
    else if (ch !== "\r") field += ch
  }
  if (field || row.length) { row.push(field); rows.push(row) }
  if (!rows.length) return []
  const head = rows.shift().map((h) => h.trim())
  return rows
    .filter((r) => r.length === head.length && r.some((c) => c !== ""))
    .map((r) => Object.fromEntries(head.map((h, i) => [h, r[i]])))
}

const load = (file) => {
  const p = join(GSC, file)
  return existsSync(p) ? parseCsv(readFileSync(p, "utf8")) : null
}

const num = (v) => Number(String(v ?? "").replace(/[%,]/g, "")) || 0
const pct = (n, d) => (d ? (100 * n) / d : 0)
const f1 = (n) => n.toFixed(1)

/* ── query clustering ────────────────────────────────────────────────────────
 * Order matters: junk patterns are tested first so a query like
 * "healthcare lead generation services in kolkata" lands in agency-services
 * (someone shopping for an AGENCY) rather than the healthcare vertical.
 * ──────────────────────────────────────────────────────────────────────────── */
const CLUSTERS = [
  // — junk: real rankings, wrong intent, structurally unconvertible —
  ["junk · geo-encyclopedia",  /which tier city|\blakhs?\b|\blacs\b|tier \d city/,                       false],
  ["junk · data-engineering",  /data freshness|data warehouse|freshness management|data readiness/,       false],
  ["junk · agency-services",   /\b(agency|agencies|services|company|consultant|specialist)\b.*\bin\b|lead generation (services|agency|company)|(smo|meta ads|digital marketing) course|reputation management|acquisition services/, false],
  ["junk · brand-confusion",   /lead kahuna|leadq\b|lead junkies|savoursoft|timefit|leadmachine/,         false],

  // — qualified: real buyers —
  ["portal & marketplace leads", /indiamart|justdial|99acres|tradeindia|sulekha|magicbricks|housing\.com|facebook lead|lead ads|portal enquir/, true],
  ["alternatives & comparison",  /alternativ|\bvs\b|versus|\bcost\b|pricing|leadsquared|zoho|hubspot|salesforce|pipedrive|freshsales|kylas|telecrm|bitrix|sell\.do|selldo/, true],
  ["wedge · lead quality",       /junk lead|lead quality|quality lead|lead qualif|fit score|lead scoring|lead score|lead prioriti/, true],
  ["commercial core · lead mgmt",/lead management|leads management|leadmanagement|lead software|lead generation management/, true],
  ["lead tracking",              /lead tracking|track sales|multi.?source lead|lead distribution/,        true],
  ["lead routing",               /lead routing|route leads|assignment rule/,                              true],
  ["crm · real estate",          /real estate|realestate|broker|property/,                                true],
  ["crm · whatsapp",             /whatsapp/,                                                              true],
  ["crm · startups",             /startup/,                                                               true],
  ["vertical · industry",        /fintech|bfsi|edtech|manufactur|healthcare|logistics|hospitality|admission|retail|patient/, true],
  ["crm · generic",              /\bcrm\b/,                                                               true],
  ["category & glossary",        /morning brief|evolution score|score evolution|\bicp\b|zero input|sales behaviour|assignment|unassigned/, true],
]

const classify = (q) => {
  const s = q.toLowerCase()
  for (const [label, re, qualified] of CLUSTERS) if (re.test(s)) return { label, qualified }
  return { label: "unclassified", qualified: true }
}

/* ── URL families ───────────────────────────────────────────────────────────── */
const VERTICALS = new Set([
  "real-estate", "edtech", "bfsi", "manufacturing", "healthcare", "saas",
  "agencies", "retail", "logistics", "fintech", "hospitality",
])

const family = (url) => {
  const path = url.replace(/^https?:\/\/[^/]+/, "")
  const seg = path.split("?")[0].replace(/^\/|\/$/g, "").split("/")[0]
  if (!seg) return "(homepage)"
  if (VERTICALS.has(seg)) return "geo · industry × city"
  if (seg === "city") return "geo · city hub"
  if (seg === "for") return "geo · role × city"
  return `/${seg}/*`
}

/* ── aggregation ────────────────────────────────────────────────────────────── */
function aggregate(rows, keyFn, labelKey) {
  const map = new Map()
  for (const r of rows) {
    const key = keyFn(r)
    if (!map.has(key)) map.set(key, { key, n: 0, clicks: 0, impr: 0, posWeighted: 0 })
    const a = map.get(key)
    const impr = num(r.Impressions)
    a.n++; a.clicks += num(r.Clicks); a.impr += impr
    a.posWeighted += num(r.Position) * impr
  }
  return [...map.values()]
    .map((a) => ({ ...a, ctr: pct(a.clicks, a.impr), pos: a.impr ? a.posWeighted / a.impr : 0 }))
    .sort((a, b) => b.impr - a.impr)
    .map((a) => ({ ...a, [labelKey]: a.key }))
}

function table(rows, headers, widths, rowFn) {
  const line = headers.map((h, i) => (i === 0 ? h.padEnd(widths[i]) : h.padStart(widths[i]))).join("")
  console.log(line)
  console.log("─".repeat(widths.reduce((a, b) => a + b, 0)))
  for (const r of rows) {
    console.log(rowFn(r).map((c, i) => (i === 0 ? String(c).padEnd(widths[i]) : String(c).padStart(widths[i]))).join(""))
  }
}

/* ── run ────────────────────────────────────────────────────────────────────── */
const pages = load("Pages.csv")
const queries = load("Queries.csv")
const chart = load("Chart.csv")
const filters = load("Filters.csv")

if (!pages && !queries) {
  console.error(`No GSC export found in ${GSC}.`)
  console.error("Export from Search Console → Performance → Search results → ⬇ Export → CSV,")
  console.error("then unzip Pages.csv and Queries.csv into data/gsc/.")
  process.exit(1)
}

const pageKey = pages && Object.keys(pages[0]).find((k) => /page/i.test(k))
const queryKey = queries && Object.keys(queries[0]).find((k) => /quer/i.test(k))

const totClicks = pages ? pages.reduce((s, r) => s + num(r.Clicks), 0) : 0
const totImpr = pages ? pages.reduce((s, r) => s + num(r.Impressions), 0) : 0
const wPos = pages ? pages.reduce((s, r) => s + num(r.Position) * num(r.Impressions), 0) / (totImpr || 1) : 0

const byFamily = pages ? aggregate(pages, (r) => family(r[pageKey]), "label") : []
const byCluster = queries ? aggregate(queries, (r) => classify(r[queryKey]).label, "label") : []

/* Junk share is measured on the QUERY rows we can classify. GSC anonymises a
 * chunk of the long tail, so this is a share-of-classified figure, not
 * share-of-everything — stated explicitly rather than quietly extrapolated. */
const qClicks = queries ? queries.reduce((s, r) => s + num(r.Clicks), 0) : 0
const qImpr = queries ? queries.reduce((s, r) => s + num(r.Impressions), 0) : 0
const junk = queries ? queries.filter((r) => !classify(r[queryKey]).qualified) : []
const junkImpr = junk.reduce((s, r) => s + num(r.Impressions), 0)
const junkClicks = junk.reduce((s, r) => s + num(r.Clicks), 0)

if (AS_JSON) {
  console.log(JSON.stringify({
    totals: { clicks: totClicks, impressions: totImpr, ctr: pct(totClicks, totImpr), position: wPos },
    families: byFamily, clusters: byCluster,
    junk: { impressions: junkImpr, clicks: junkClicks, shareOfClassified: pct(junkImpr, qImpr) },
  }, null, 2))
  process.exit(0)
}

const window = filters?.find((r) => /date/i.test(r.Filter))?.Value ?? "unknown window"
const days = chart?.length ?? 28

console.log(`\n╭─ GSC REPORT · ${window} · ${days} days ─────────────────────────────╮\n`)
console.log(`  Clicks ${totClicks}   Impressions ${totImpr}   CTR ${f1(pct(totClicks, totImpr))}%   Avg position ${f1(wPos)}`)
console.log(`  (position is impression-weighted, not GSC's flat mean)\n`)

if (byFamily.length) {
  console.log("── BY URL FAMILY ──────────────────────────────────────────────────────\n")
  table(byFamily, ["FAMILY", "pages", "clicks", "impr", "%impr", "CTR", "pos", "clk/pg"],
    [26, 7, 8, 8, 8, 8, 7, 8],
    (r) => [r.key, r.n, r.clicks, r.impr, f1(pct(r.impr, totImpr)) + "%", f1(r.ctr) + "%", f1(r.pos), (r.clicks / r.n).toFixed(2)])

  const geo = byFamily.filter((r) => r.key.startsWith("geo ·"))
  const gp = geo.reduce((s, r) => s + r.n, 0), gc = geo.reduce((s, r) => s + r.clicks, 0), gi = geo.reduce((s, r) => s + r.impr, 0)
  if (gp) {
    console.log(`\n  geo total     ${gp} pages · ${gc} clicks · ${gi} impr · ${(gc / gp).toFixed(3)} clicks/page`)
    console.log(`  non-geo total ${pages.length - gp} pages · ${totClicks - gc} clicks · ${totImpr - gi} impr · ${((totClicks - gc) / (pages.length - gp)).toFixed(3)} clicks/page`)
  }
}

if (byCluster.length) {
  console.log("\n── BY QUERY CLUSTER ───────────────────────────────────────────────────\n")
  table(byCluster, ["CLUSTER", "queries", "clicks", "impr", "%impr", "CTR", "pos"],
    [30, 9, 8, 8, 8, 8, 7],
    (r) => [r.key, r.n, r.clicks, r.impr, f1(pct(r.impr, qImpr)) + "%", f1(r.ctr) + "%", f1(r.pos)])

  console.log(`\n  JUNK INTENT: ${junkImpr} impr (${f1(pct(junkImpr, qImpr))}% of classified) → ${junkClicks} clicks`)
  console.log(`  QUALIFIED  : ${qImpr - junkImpr} impr (${f1(pct(qImpr - junkImpr, qImpr))}%) → ${qClicks - junkClicks} clicks`)
  console.log(`  Note: covers the ${qImpr} impressions GSC names; the rest of the tail is anonymised.`)
}

if (pages) {
  console.log("\n── LEVERAGE ───────────────────────────────────────────────────────────\n")

  const authority = pages
    .filter((r) => num(r.Impressions) >= 20 && num(r.Position) > 30)
    .sort((a, b) => num(b.Impressions) - num(a.Impressions)).slice(0, 12)
  console.log("  AUTHORITY PROBLEM — real demand, buried (impr ≥20, pos >30):")
  if (!authority.length) console.log("    none")
  for (const r of authority) {
    console.log(`    ${String(num(r.Impressions)).padStart(5)} impr @ pos ${f1(num(r.Position)).padStart(5)}  ${r[pageKey].replace(/^https?:\/\/[^/]+/, "")}`)
  }

  const ctrProblem = pages
    .filter((r) => num(r.Position) <= 12 && num(r.Clicks) === 0 && num(r.Impressions) >= 4)
    .sort((a, b) => num(b.Impressions) - num(a.Impressions)).slice(0, 12)
  console.log("\n  CTR / INTENT PROBLEM — ranking well, nobody clicks (pos ≤12, 0 clicks):")
  if (!ctrProblem.length) console.log("    none")
  for (const r of ctrProblem) {
    console.log(`    ${String(num(r.Impressions)).padStart(5)} impr @ pos ${f1(num(r.Position)).padStart(5)}  ${r[pageKey].replace(/^https?:\/\/[^/]+/, "")}`)
  }
}

/* ── distance to the goal ───────────────────────────────────────────────────── */
const TARGET_SIGNUPS_PER_DAY = 30
const CLICK_TO_SIGNUP = 0.025 // blended, commercial-weighted portfolio
const HEALTHY_CTR = 0.05      // what a page-1 commercial portfolio earns
const perDayClicks = totClicks / days
const neededClicks = (TARGET_SIGNUPS_PER_DAY / CLICK_TO_SIGNUP) * 30 // per month
const nowCtr = pct(totClicks, totImpr) / 100

// Fixed grouping — the shell locale is en-IN, which renders 2353846 as
// "23,53,846" and reads inconsistently next to the un-grouped figures.
const grp = (n) => Math.round(n).toLocaleString("en-US")

console.log("\n── DISTANCE TO 30 SIGNUPS/DAY ─────────────────────────────────────────\n")
console.log(`  Today            ${f1(perDayClicks)} clicks/day  (${totClicks} in ${days}d)`)
console.log(`  Needed           ${grp(neededClicks / 30)} clicks/day  (~${grp(neededClicks)}/month at ${CLICK_TO_SIGNUP * 100}% click→signup)`)
console.log(`  Gap              ${grp(neededClicks / 30 / (perDayClicks || 1))}×`)
console.log("")
console.log(`  Impressions needed to source those clicks:`)
console.log(`    at today's ${f1(nowCtr * 100)}% CTR   ~${grp(neededClicks / (nowCtr || HEALTHY_CTR))}/month  ← today's CTR is depressed by junk intent`)
console.log(`    at a healthy ${HEALTHY_CTR * 100}% CTR  ~${grp(neededClicks / HEALTHY_CTR)}/month`)
console.log(`    today                    ${grp(totImpr)}/month`)
console.log("\n╰──────────────────────────────────────────────────────────────────────╯\n")
