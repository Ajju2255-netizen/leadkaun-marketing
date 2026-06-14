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
  { path: "/compare", priority: "0.8", changefreq: "monthly" },
  { path: "/compare/leadkaun-vs-salesforce", priority: "0.8", changefreq: "monthly" },
  { path: "/compare/leadkaun-vs-hubspot", priority: "0.8", changefreq: "monthly" },
  { path: "/compare/leadkaun-vs-zoho-crm", priority: "0.8", changefreq: "monthly" },
  { path: "/compare/leadkaun-vs-leadsquared", priority: "0.8", changefreq: "monthly" },
  { path: "/compare/leadkaun-vs-freshsales", priority: "0.7", changefreq: "monthly" },
  { path: "/glossary", priority: "0.6", changefreq: "weekly" },
  { path: "/questions", priority: "0.6", changefreq: "weekly" },
  { path: "/how-to", priority: "0.6", changefreq: "weekly" },
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

const pseoCity = [
  ...citiesData.map((c) => ({ path: `/city/${c.slug}`, priority: "0.6", changefreq: "monthly" })),
  ...rolesData.flatMap((r) =>
    citiesData.map((c) => ({ path: `/for/${r.slug}/${c.slug}`, priority: "0.5", changefreq: "monthly" }))
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
  for (const ind of industriesData) {
    pseoDeepByBucket[bucket].push({ path: `/${ind.slug}/${city.slug}`, priority: "0.6", changefreq: "monthly" })
    for (const kw of keywordsData) {
      pseoDeepByBucket[bucket].push({ path: `/${ind.slug}/${city.slug}/${kw.slug}`, priority: "0.5", changefreq: "monthly" })
    }
  }
}

// Integrations + resources
const integrations = [
  { path: "/integrations", priority: "0.6", changefreq: "monthly" },
  { path: "/resources", priority: "0.6", changefreq: "monthly" },
  ...integrationsDataRaw.map((i) => ({ path: `/integrations/${i.slug}`, priority: "0.5", changefreq: "monthly" })),
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
