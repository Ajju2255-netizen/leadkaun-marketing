#!/usr/bin/env node
/**
 * gen-cities.mjs — merge + validate + dedupe city data into data/pseo/cities.json.
 *
 * Sources:
 *   1. The existing curated cities.json (hand-tuned aliases/notes — these WIN on conflict).
 *   2. Region files in /tmp/lk-cities/*.json (agent-generated: name/state/tier/population/lat/lng/industries/notes?).
 *
 * Derives slug/stateSlug/aliases/timezone, normalises industries, dedupes by canonical slug
 * (incl. known alias collapse), validates against the CitySchema bounds, sorts, writes JSON.
 *
 * Usage: node scripts/gen-cities.mjs            (writes data/pseo/cities.json)
 *        node scripts/gen-cities.mjs --dry      (report only, no write)
 */
import fs from "fs"
import path from "path"

const ROOT = process.cwd()
const OUT = path.join(ROOT, "data", "pseo", "cities.json")
const REGION_DIR = "/tmp/lk-cities"
const DRY = process.argv.includes("--dry")

const INDUSTRIES = new Set([
  "real-estate", "edtech", "bfsi", "manufacturing", "healthcare", "saas",
  "agencies", "retail", "logistics", "education", "fintech", "hospitality",
])
const DEFAULT_INDUSTRIES = ["real-estate", "bfsi", "healthcare", "retail", "education"]

// Known alias → canonical slug, so "Mysore" and "Mysuru" don't both ship.
const ALIAS_TO_CANONICAL = {
  bangalore: "bengaluru", bombay: "mumbai", calcutta: "kolkata", madras: "chennai",
  cochin: "kochi", trivandrum: "thiruvananthapuram", calicut: "kozhikode",
  mysore: "mysuru", baroda: "vadodara", pondicherry: "puducherry", gurgaon: "gurugram",
  allahabad: "prayagraj", banaras: "varanasi", benares: "varanasi", poona: "pune",
  vizag: "visakhapatnam", "vizag-city": "visakhapatnam", gauhati: "guwahati",
  cawnpore: "kanpur", trichy: "tiruchirappalli", trichinopoly: "tiruchirappalli",
  mangalore: "mangaluru", belgaum: "belagavi", hubli: "hubli-dharwad",
  "hubballi-dharwad": "hubli-dharwad", waltair: "visakhapatnam", simla: "shimla",
}

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/&/g, " and ")
    .normalize("NFKD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
function canonicalSlug(name) {
  const s = slugify(name)
  return ALIAS_TO_CANONICAL[s] ?? s
}

function loadJson(file) {
  try { return JSON.parse(fs.readFileSync(file, "utf8")) }
  catch (e) { console.warn(`  ! skip ${path.basename(file)}: ${e.message}`); return null }
}

// ---- 1. existing curated cities (authoritative) ----
const existing = loadJson(OUT) ?? []
const bySlug = new Map()
const claimed = new Set() // every slug + alias already taken
for (const c of existing) {
  bySlug.set(c.slug, c)
  claimed.add(c.slug)
  for (const a of c.aliases ?? []) claimed.add(slugify(a))
}
const existingCount = bySlug.size

// ---- 2. agent region files ----
const regionFiles = fs.existsSync(REGION_DIR)
  ? fs.readdirSync(REGION_DIR).filter((f) => f.endsWith(".json")).map((f) => path.join(REGION_DIR, f))
  : []

let added = 0
const dropped = []
const dupes = []

for (const file of regionFiles) {
  const arr = loadJson(file)
  if (!Array.isArray(arr)) continue
  for (const raw of arr) {
    const name = (raw.name ?? "").trim()
    const slug = canonicalSlug(name)
    if (!name || !slug) { dropped.push([name || "(blank)", "bad name/slug"]); continue }
    if (claimed.has(slug) || bySlug.has(slug)) { dupes.push(slug); continue }

    const industries = [...new Set((raw.industries ?? []).filter((i) => INDUSTRIES.has(i)))]
    const rec = {
      slug,
      name,
      aliases: [],
      state: (raw.state ?? "").trim(),
      stateSlug: slugify(raw.state ?? ""),
      tier: raw.tier,
      population: typeof raw.population === "number" ? Math.round(raw.population) : NaN,
      lat: raw.lat,
      lng: raw.lng,
      timezone: "Asia/Kolkata",
      industries: industries.length ? industries : DEFAULT_INDUSTRIES.slice(),
      ...(raw.notes && String(raw.notes).trim() ? { notes: String(raw.notes).trim().slice(0, 120) } : {}),
    }

    // ---- validate against CitySchema bounds ----
    const errs = []
    if (!/^[a-z0-9-]+$/.test(rec.slug)) errs.push("slug")
    if (rec.name.length < 2) errs.push("name")
    if (rec.state.length < 2) errs.push("state")
    if (!/^[a-z0-9-]+$/.test(rec.stateSlug)) errs.push("stateSlug")
    if (![1, 2, 3, 4].includes(rec.tier)) errs.push("tier")
    if (!Number.isInteger(rec.population) || rec.population <= 0) errs.push("population")
    if (typeof rec.lat !== "number" || rec.lat < 6 || rec.lat > 38) errs.push("lat")
    if (typeof rec.lng !== "number" || rec.lng < 68 || rec.lng > 98) errs.push("lng")
    if (!rec.industries.length) errs.push("industries")
    if (errs.length) { dropped.push([`${name} (${slug})`, errs.join(",")]); continue }

    bySlug.set(slug, rec)
    claimed.add(slug)
    added++
  }
}

// ---- sort: tier asc, then population desc ----
const all = [...bySlug.values()].sort((a, b) => a.tier - b.tier || b.population - a.population)

// ---- report ----
const byTier = {}, byState = {}
for (const c of all) { byTier[c.tier] = (byTier[c.tier] ?? 0) + 1; byState[c.state] = (byState[c.state] ?? 0) + 1 }
console.log(`\nEXISTING curated: ${existingCount}`)
console.log(`AGENT files:      ${regionFiles.length}  (${regionFiles.map((f) => path.basename(f)).join(", ")})`)
console.log(`ADDED new:        ${added}`)
console.log(`DUPLICATES skipped: ${dupes.length}`)
console.log(`DROPPED (invalid):  ${dropped.length}`)
if (dropped.length) console.log("  " + dropped.slice(0, 40).map(([n, e]) => `${n}: ${e}`).join("\n  "))
console.log(`\nTOTAL cities: ${all.length}`)
console.log(`By tier: ` + Object.entries(byTier).sort().map(([t, n]) => `T${t}=${n}`).join("  "))
console.log(`States: ${Object.keys(byState).length}`)

if (DRY) { console.log("\n(dry run — not written)"); process.exit(0) }
fs.writeFileSync(OUT, JSON.stringify(all, null, 2) + "\n")
console.log(`\n✓ wrote ${OUT}`)
