/**
 * Sitemap generator — emits an index + per-type shards.
 *
 * Output (in /public):
 *   sitemap.xml              — the <sitemapindex> that points at the shards below
 *   sitemap-core.xml         — homepage, features, use-cases, comparisons, hubs, legal
 *   sitemap-blog.xml         — /blog/*, /blog/categories/*, /blog
 *   sitemap-questions.xml    — /questions/*, /questions
 *   sitemap-glossary.xml     — /glossary/*, /glossary
 *   sitemap-howto.xml        — /how-to/*, /how-to
 *   sitemap-integrations.xml — /integrations/*, /resources/*
 *   sitemap-pseo-city.xml    — /city/*, /for/[role]/[city]
 *   sitemap-pseo-1.xml       — /[industry]/[city] + /[industry]/[city]/[keyword] where city starts A–D
 *   sitemap-pseo-2.xml       — …where city starts E–M
 *   sitemap-pseo-3.xml       — …where city starts N–Z
 *
 * Per-shard URL cap is 50,000 per sitemap.org spec. Current totals are all far below cap.
 *
 * Post-build hook runs this; writes sitemap-*.xml into /public.
 */

const fs = require("fs")
const path = require("path")

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://leadkaun.com").replace(/\/$/, "")
const PUBLIC_DIR = path.join(__dirname, "../public")
const TODAY = new Date().toISOString().split("T")[0]

// ────────────────────────────────────────────────────────────────────────
// Data
// ────────────────────────────────────────────────────────────────────────

function readJson(p) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, "..", p), "utf8"))
}

const citiesData = readJson("data/pseo/cities.json")
const industriesData = readJson("data/pseo/industries.json")
const keywordsData = readJson("data/pseo/keywords.json")
const rolesData = readJson("data/pseo/roles.json")
const glossaryData = readJson("data/pseo/glossary.json")
const pillarsData = readJson("data/pseo/pillars.json")
const bestData = readJson("data/pseo/best.json")
const questionsData = readJson("data/pseo/questions.json")
const howToData = readJson("data/pseo/how-to.json")
const integrationsDataRaw = fs.existsSync(path.join(__dirname, "../data/pseo/integrations.json"))
  ? readJson("data/pseo/integrations.json") : []
const resourcesDataRaw = fs.existsSync(path.join(__dirname, "../data/pseo/resources.json"))
  ? readJson("data/pseo/resources.json") : []

const BLOG_DIR = path.join(__dirname, "../content/blog")
const blogPosts = fs.existsSync(BLOG_DIR)
  ? fs.readdirSync(BLOG_DIR)
      .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
      .map((f) => f.replace(/\.(md|mdx)$/, ""))
  : []

const BLOG_CATEGORY_SLUGS = [
  "lead-management", "sales-behaviour", "rupee-first-analytics",
  "real-estate-sales", "edtech-sales", "bfsi-insurance",
  "crm-alternatives", "sales-team-management", "whatsapp-b2b-sales",
  "startup-smb-sales-ops",
]

// ────────────────────────────────────────────────────────────────────────
// URL bucket builders
// ────────────────────────────────────────────────────────────────────────

const core = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/product", priority: "0.9", changefreq: "monthly" },
  { path: "/how-it-works", priority: "0.9", changefreq: "monthly" },
  { path: "/pricing", priority: "0.9", changefreq: "monthly" },
  { path: "/demo", priority: "0.9", changefreq: "monthly" },
  { path: "/about", priority: "0.7", changefreq: "monthly" },
  { path: "/contact", priority: "0.7", changefreq: "monthly" },
  { path: "/resources", priority: "0.6", changefreq: "monthly" },
  { path: "/features", priority: "0.8", changefreq: "monthly" },
  { path: "/features/lead-scoring", priority: "0.9", changefreq: "monthly" },
  { path: "/features/priority-queue", priority: "0.8", changefreq: "monthly" },
  { path: "/features/missed-opportunity-engine", priority: "0.8", changefreq: "monthly" },
  { path: "/features/morning-brief", priority: "0.8", changefreq: "monthly" },
  { path: "/features/sales-rep-tracking", priority: "0.7", changefreq: "monthly" },
  { path: "/features/whatsapp-tracking", priority: "0.7", changefreq: "monthly" },
  { path: "/use-cases", priority: "0.8", changefreq: "monthly" },
  { path: "/use-cases/real-estate", priority: "0.8", changefreq: "monthly" },
  { path: "/use-cases/edtech", priority: "0.8", changefreq: "monthly" },
  { path: "/use-cases/bfsi", priority: "0.7", changefreq: "monthly" },
  { path: "/use-cases/agencies", priority: "0.7", changefreq: "monthly" },
  { path: "/use-cases/manufacturing", priority: "0.7", changefreq: "monthly" },
  { path: "/use-cases/healthcare", priority: "0.7", changefreq: "monthly" },
  { path: "/use-cases/saas", priority: "0.7", changefreq: "monthly" },
  { path: "/use-cases/retail", priority: "0.7", changefreq: "monthly" },
  { path: "/use-cases/logistics", priority: "0.7", changefreq: "monthly" },
  { path: "/use-cases/fintech", priority: "0.7", changefreq: "monthly" },
  { path: "/use-cases/hospitality", priority: "0.7", changefreq: "monthly" },
  { path: "/compare", priority: "0.8", changefreq: "monthly" },
  { path: "/compare/leadkaun-vs-salesforce", priority: "0.8", changefreq: "monthly" },
  { path: "/compare/leadkaun-vs-hubspot", priority: "0.8", changefreq: "monthly" },
  { path: "/compare/leadkaun-vs-zoho-crm", priority: "0.8", changefreq: "monthly" },
  { path: "/compare/leadkaun-vs-leadsquared", priority: "0.8", changefreq: "monthly" },
  { path: "/compare/leadkaun-vs-freshsales", priority: "0.7", changefreq: "monthly" },
  { path: "/compare/leadkaun-vs-pipedrive", priority: "0.7", changefreq: "monthly" },
  { path: "/compare/leadkaun-vs-zoho-bigin", priority: "0.7", changefreq: "monthly" },
  { path: "/compare/leadkaun-vs-kylas", priority: "0.7", changefreq: "monthly" },
  { path: "/compare/leadkaun-vs-telecrm", priority: "0.7", changefreq: "monthly" },
  { path: "/compare/leadkaun-vs-bitrix24", priority: "0.7", changefreq: "monthly" },
  { path: "/compare/leadkaun-vs-monday", priority: "0.7", changefreq: "monthly" },
  { path: "/compare/leadkaun-vs-close", priority: "0.7", changefreq: "monthly" },
  { path: "/compare/leadkaun-vs-selldo", priority: "0.7", changefreq: "monthly" },
  { path: "/compare/leadkaun-vs-apollo", priority: "0.7", changefreq: "monthly" },
  { path: "/compare/leadkaun-vs-clay", priority: "0.7", changefreq: "monthly" },
  { path: "/glossary", priority: "0.6", changefreq: "weekly" },
  { path: "/questions", priority: "0.6", changefreq: "weekly" },
  { path: "/how-to", priority: "0.6", changefreq: "weekly" },
  { path: "/tools/missed-revenue-calculator", priority: "0.7", changefreq: "monthly" },
  { path: "/tools/crm-cost-calculator", priority: "0.7", changefreq: "monthly" },
  { path: "/best", priority: "0.8", changefreq: "monthly" },
  // Derived from best.json — a hardcoded list here silently drops new guides.
  ...bestData.map((g) => ({ path: `/best/${g.slug}`, priority: "0.8", changefreq: "monthly" })),
  { path: "/alternatives", priority: "0.8", changefreq: "monthly" },
  ...["zoho-crm", "leadsquared", "hubspot", "salesforce", "freshsales", "pipedrive", "zoho-bigin", "kylas", "telecrm", "bitrix24", "monday", "close", "selldo"].map((s) => ({ path: `/alternatives/${s}`, priority: "0.7", changefreq: "monthly" })),
  { path: "/learn", priority: "0.8", changefreq: "monthly" },
  // Derived from pillars.json — same reason as /best above.
  ...pillarsData.map((pl) => ({ path: `/learn/${pl.slug}`, priority: "0.8", changefreq: "monthly" })),
  { path: "/research", priority: "0.8", changefreq: "monthly" },
  { path: "/research/indian-b2b-sales-lead-benchmarks-2026", priority: "0.8", changefreq: "monthly" },
  { path: "/security", priority: "0.5", changefreq: "yearly" },
  { path: "/privacy", priority: "0.3", changefreq: "yearly" },
  { path: "/terms", priority: "0.3", changefreq: "yearly" },
]

const blog = [
  { path: "/blog", priority: "0.7", changefreq: "weekly" },
  ...BLOG_CATEGORY_SLUGS.map((c) => ({ path: `/blog/categories/${c}`, priority: "0.6", changefreq: "weekly" })),
  ...blogPosts.map((s) => ({ path: `/blog/${s}`, priority: "0.7", changefreq: "weekly" })),
]

const questions = questionsData.map((q) => ({ path: `/questions/${q.slug}`, priority: "0.5", changefreq: "weekly" }))
const glossary = glossaryData.map((g) => ({ path: `/glossary/${g.slug}`, priority: "0.5", changefreq: "weekly" }))
const howto = howToData.map((h) => ({ path: `/how-to/${h.slug}`, priority: "0.6", changefreq: "weekly" }))

// Indexation gate — SINGLE SOURCE OF TRUTH shared with the routes' robots meta
// via lib/pseo/gate.js, so the sitemap can never drift and advertise a noindexed
// URL. Leaves (keyword/role) index for Tier ≤ 2 or rich-district cities; hubs
// (city + industry×city) index for Tier ≤ 2, Tier 3 with local notes, or a
// substantial city (≥ 1.5 lakh) with local notes.
const { leafIndexable, hubIndexable } = require("../lib/pseo/gate")
const leafIndexableCity = (c) => leafIndexable(c.tier, !!c.districts)
const hubIndexableCity = (c) => hubIndexable(c.tier, c.population, (c.notes && c.notes.trim().length >= 20))
const indexableCities = citiesData.filter(leafIndexableCity)
const hubCities = citiesData.filter(hubIndexableCity)

const pseoCity = [
  ...hubCities.map((c) => ({ path: `/city/${c.slug}`, priority: "0.6", changefreq: "monthly" })),
  ...rolesData.flatMap((r) =>
    indexableCities.map((c) => ({ path: `/for/${r.slug}/${c.slug}`, priority: "0.5", changefreq: "monthly" }))
  ),
]

// Bucket industry-city + industry-city-keyword URLs by city first-letter.
function bucketByFirstLetter(cityObj) {
  const c = cityObj.slug[0].toLowerCase()
  if (c >= "a" && c <= "d") return 1
  if (c >= "e" && c <= "m") return 2
  return 3
}

const pseoDeepByBucket = { 1: [], 2: [], 3: [] }
for (const city of citiesData) {
  const bucket = bucketByFirstLetter(city)
  const cityIndexable = leafIndexableCity(city)
  const cityHubIndexable = hubIndexableCity(city)
  for (const ind of industriesData) {
    // Industry×city hubs index for Tier ≤ 2, or Tier 3+ with real local data;
    // keyword leaves for Tier ≤ 2, or cities with rich verified district data.
    if (cityHubIndexable) {
      pseoDeepByBucket[bucket].push({ path: `/${ind.slug}/${city.slug}`, priority: "0.6", changefreq: "monthly" })
    }
    if (cityIndexable) {
      for (const kw of keywordsData) {
        pseoDeepByBucket[bucket].push({ path: `/${ind.slug}/${city.slug}/${kw.slug}`, priority: "0.5", changefreq: "monthly" })
      }
    }
  }
}

// Integrations + resources
const integrations = [
  { path: "/integrations", priority: "0.6", changefreq: "monthly" },
  { path: "/resources", priority: "0.6", changefreq: "monthly" },
  // Only shipped integrations are indexable — roadmap/partner-driven are noindexed.
  ...integrationsDataRaw.filter((i) => i.status === "live").map((i) => ({ path: `/integrations/${i.slug}`, priority: "0.5", changefreq: "monthly" })),
  ...resourcesDataRaw.map((r) => ({ path: `/resources/${r.slug}`, priority: "0.5", changefreq: "monthly" })),
]

// ────────────────────────────────────────────────────────────────────────
// Emitters
// ────────────────────────────────────────────────────────────────────────

function urlsetXml(entries) {
  const body = entries
    .map(
      (r) => `  <url>
    <loc>${BASE_URL}${r.path}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
    )
    .join("\n")
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`
}

function sitemapIndexXml(shardNames) {
  const body = shardNames
    .map(
      (name) => `  <sitemap>
    <loc>${BASE_URL}/${name}</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>`
    )
    .join("\n")
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</sitemapindex>
`
}

function writeShard(filename, entries) {
  if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true })
  fs.writeFileSync(path.join(PUBLIC_DIR, filename), urlsetXml(entries))
  return entries.length
}

// ────────────────────────────────────────────────────────────────────────
// Main
// ────────────────────────────────────────────────────────────────────────

const shardSpecs = [
  ["sitemap-core.xml", core],
  ["sitemap-blog.xml", blog],
  ["sitemap-questions.xml", questions],
  ["sitemap-glossary.xml", glossary],
  ["sitemap-howto.xml", howto],
  ["sitemap-integrations.xml", integrations],
  ["sitemap-pseo-city.xml", pseoCity],
  ["sitemap-pseo-1.xml", pseoDeepByBucket[1]],
  ["sitemap-pseo-2.xml", pseoDeepByBucket[2]],
  ["sitemap-pseo-3.xml", pseoDeepByBucket[3]],
]

let total = 0
const emittedShards = []
for (const [filename, entries] of shardSpecs) {
  const count = writeShard(filename, entries)
  total += count
  emittedShards.push({ filename, count })
}

// Emit the sitemap index. Include every shard that has ≥ 1 URL.
// Keep integrations placeholder in the index even if empty, so downstream
// tooling has stable shape once integrations/resources data arrives.
fs.writeFileSync(
  path.join(PUBLIC_DIR, "sitemap.xml"),
  sitemapIndexXml(shardSpecs.map(([f]) => f))
)

console.log(`✓ sitemap.xml (index) + ${emittedShards.length} shards generated — ${total} total URLs`)
for (const { filename, count } of emittedShards) {
  console.log(`   ${filename.padEnd(32)} ${String(count).padStart(6)} URLs`)
}

// Gate the-matrix measurement — the "junk vs Live" split (P1 acceptance criterion).
// Total permutations vs what actually clears the gate and gets advertised.
const nCity = citiesData.length
const nInd = industriesData.length
const nKw = keywordsData.length
const nRole = rolesData.length
const hubTotal = nCity * nInd, hubLive = hubCities.length * nInd
const leafTotal = nCity * nInd * nKw, leafLive = indexableCities.length * nInd * nKw
const cityLive = hubCities.length, roleTotal = nCity * nRole, roleLive = indexableCities.length * nRole
const pct = (a, b) => (b ? ((a / b) * 100).toFixed(1) : "0.0")
console.log(`\n  Gate (Live : total permutations — the anti-junk split):`)
console.log(`   industry×city hubs   ${String(hubLive).padStart(6)} / ${hubTotal}  (${pct(hubLive, hubTotal)}%  — ${hubCities.length}/${nCity} cities)`)
console.log(`   industry×city×kw     ${String(leafLive).padStart(6)} / ${leafTotal}  (${pct(leafLive, leafTotal)}%  — ${indexableCities.length}/${nCity} cities)`)
console.log(`   /city/[city]         ${String(cityLive).padStart(6)} / ${nCity}  (${pct(cityLive, nCity)}%)`)
console.log(`   /for/[role]/[city]   ${String(roleLive).padStart(6)} / ${roleTotal}  (${pct(roleLive, roleTotal)}%)`)
const grandTotal = hubTotal + leafTotal + nCity + roleTotal
const grandLive = hubLive + leafLive + cityLive + roleLive
console.log(`   ── pSEO total        ${String(grandLive).padStart(6)} / ${grandTotal}  (${pct(grandLive, grandTotal)}% Live; ${grandTotal - grandLive} gated noindex)`)
