import {
  getKeywords, getCity, getIndustry, getKeyword,
  citiesServingIndustry, industriesServedInCity, getCities,
} from "./lookup"
import { pick, stableHash } from "./variation"

/**
 * Related-content derivation for PSEO pages. Async — backed by the R2/fs
 * data layer in `./lookup`.
 *
 * Driving rule: every dynamic page shows 6–10 related URLs, split across:
 *   - same-type siblings (e.g. other industry-city pages in same industry)
 *   - cross-type siblings (same city, different industry)
 *   - parent hub pages (use-cases/{industry}, city/{city})
 *   - blog pillar match
 */

export type RelatedLink = { href: string; label: string; kind: string }

/* ────────────────────────────────────────────────────────────────────────────
 * COMMERCIAL LINK LAYER
 *
 * Before this existed, the pSEO mesh was closed: `relatedForCity` returned 11
 * links and all 11 were geo, so ~17k city pages passed authority only to each
 * other while `/best/*` — the pages that actually target the money keywords —
 * had one inbound internal link each (from the /best index). Every pSEO page
 * now also links out to a matched commercial guide, a pillar, a feature and
 * pricing, so the geo corpus feeds the commercial corpus instead of itself.
 *
 * Anchors are seeded per page (pillar + feature rotate) so 17k pages don't ship
 * one byte-identical link block — same rationale as the variation layer.
 * ──────────────────────────────────────────────────────────────────────────── */

/** Industry → the /best guide that matches its buyer intent. */
const GUIDE_BY_INDUSTRY: Record<string, { slug: string; label: string }> = {
  "real-estate":  { slug: "crm-for-real-estate-india",         label: "Best real estate CRM software in India" },
  edtech:         { slug: "crm-for-edtech-india",              label: "Best CRM for EdTech & admissions" },
  manufacturing:  { slug: "crm-for-manufacturing-india",       label: "Best CRM for manufacturing in India" },
  saas:           { slug: "crm-for-startups-india",            label: "Best CRM for startups in India" },
  bfsi:           { slug: "telecalling-crm-india",             label: "Best telecalling CRM software in India" },
  fintech:        { slug: "sales-crm-for-small-business-india", label: "Best sales CRM for small business" },
  healthcare:     { slug: "lead-management-software-india",    label: "Best lead management software in India" },
  retail:         { slug: "whatsapp-crm-india",                label: "Best WhatsApp CRM software in India" },
  hospitality:    { slug: "whatsapp-crm-india",                label: "Best WhatsApp CRM software in India" },
  agencies:       { slug: "lead-scoring-software",             label: "Best lead scoring software" },
  logistics:      { slug: "sales-automation-software",         label: "Best sales automation software" },
}

const DEFAULT_GUIDE = { slug: "lead-management-software-india", label: "Best lead management software in India" }

const PILLARS: ReadonlyArray<{ href: string; label: string }> = [
  { href: "/learn/lead-management",  label: "Lead management: the complete guide" },
  { href: "/learn/lead-scoring",     label: "How lead scoring works — the A–F method" },
  { href: "/learn/sales-follow-up",  label: "Sales follow-up & response time" },
  { href: "/learn/missed-revenue",   label: "Missed revenue & ₹ at risk, explained" },
  { href: "/learn/whatsapp-sales",   label: "WhatsApp sales: tracking that actually sticks" },
  { href: "/learn/sales-behaviour",  label: "Sales behaviour & accountability" },
]

const FEATURES: ReadonlyArray<{ href: string; label: string }> = [
  { href: "/features/lead-scoring",              label: "Lead scoring software — grade A–F in real time" },
  { href: "/features/priority-queue",            label: "Lead prioritisation — the Priority Queue" },
  { href: "/features/missed-opportunity-engine", label: "Lead tracking — the Missed Opportunity Engine" },
  { href: "/features/whatsapp-tracking",         label: "WhatsApp lead tracking" },
  { href: "/features/sales-rep-tracking",        label: "Sales rep tracking & accountability" },
  { href: "/features/morning-brief",             label: "The 8:30 AM Morning Brief" },
]

/**
 * The commercial links every pSEO page carries. `seedKey` is the page's own
 * slug path, so the pillar/feature choice is stable per URL but varies across
 * neighbours; `industrySlug` picks the matching buyer guide.
 */
export function commercialLinks(seedKey: string, industrySlug?: string): RelatedLink[] {
  const seed = stableHash(seedKey)
  const guide = (industrySlug && GUIDE_BY_INDUSTRY[industrySlug]) || DEFAULT_GUIDE
  const pillar = pick(PILLARS, seed)
  const feature = pick(FEATURES, seed >>> 3)
  // Ordered as a descending funnel — learn the concept, see the product surface,
  // compare the market, check the price, talk to someone. A flat pile of links
  // reads as navigation; this reads as a path.
  return [
    { href: pillar.href, label: pillar.label, kind: "commercial-pillar" },
    { href: feature.href, label: feature.label, kind: "commercial-feature" },
    { href: `/best/${guide.slug}`, label: guide.label, kind: "commercial-guide" },
    { href: "/pricing", label: "Leadkaun pricing in ₹ — flat per account", kind: "commercial-pricing" },
    { href: "/demo", label: "Book a walkthrough", kind: "commercial-demo" },
  ]
}

// Industry + City page related content
export async function relatedForIndustryCity(industrySlug: string, citySlug: string): Promise<RelatedLink[]> {
  const [industry, city] = await Promise.all([getIndustry(industrySlug), getCity(citySlug)])
  if (!industry || !city) return []

  const out: RelatedLink[] = []

  // 3 other cities in same industry (same tier preferred)
  const sameIndustryCities = (await citiesServingIndustry(industrySlug))
    .filter((c) => c.slug !== citySlug)
    .sort((a, b) => Math.abs(a.tier - city.tier) - Math.abs(b.tier - city.tier))
    .slice(0, 3)
  for (const c of sameIndustryCities) {
    out.push({
      href: `/${industrySlug}/${c.slug}`,
      label: `${industry.name} in ${c.name}`,
      kind: "sibling-city",
    })
  }

  // 2 other industries in same city
  const otherIndustries = (await industriesServedInCity(citySlug))
    .filter((i) => i.slug !== industrySlug)
    .slice(0, 2)
  for (const i of otherIndustries) {
    out.push({
      href: `/${i.slug}/${citySlug}`,
      label: `${i.name} in ${city.name}`,
      kind: "sibling-industry",
    })
  }

  // Use-case industry hub
  out.push({
    href: `/use-cases/${industrySlug}`,
    label: `${industry.name} use case`,
    kind: "hub-industry",
  })

  // City hub
  out.push({
    href: `/city/${citySlug}`,
    label: `Sales software in ${city.name}`,
    kind: "hub-city",
  })

  // 2 keyword variants
  const keywordSample = (await getKeywords()).slice(0, 2)
  for (const k of keywordSample) {
    out.push({
      href: `/${industrySlug}/${citySlug}/${k.slug}`,
      label: `${k.label} for ${industry.name} in ${city.name}`,
      kind: "sibling-keyword",
    })
  }

  // Relevant competitor comparison
  if (industry.relatedCompetitor) {
    out.push({
      href: `/compare/${industry.relatedCompetitor}`,
      label: `Leadkaun vs ${industry.relatedCompetitor.replace("leadkaun-vs-", "").replace("-", " ")}`,
      kind: "comparison",
    })
  }

  return out
}

// Industry + City + Keyword page related content
export async function relatedForIndustryCityKeyword(
  industrySlug: string,
  citySlug: string,
  keywordSlug: string,
): Promise<RelatedLink[]> {
  const [industry, city, keyword] = await Promise.all([
    getIndustry(industrySlug),
    getCity(citySlug),
    getKeyword(keywordSlug),
  ])
  if (!industry || !city || !keyword) return []

  const out: RelatedLink[] = []

  // Parent industry-city
  out.push({
    href: `/${industrySlug}/${citySlug}`,
    label: `${industry.name} in ${city.name}`,
    kind: "parent",
  })

  // 3 other cities with the same keyword for same industry
  const otherCities = (await citiesServingIndustry(industrySlug))
    .filter((c) => c.slug !== citySlug)
    .slice(0, 3)
  for (const c of otherCities) {
    out.push({
      href: `/${industrySlug}/${c.slug}/${keywordSlug}`,
      label: `${keyword.label} for ${industry.name} in ${c.name}`,
      kind: "sibling-city",
    })
  }

  // 2 other keywords in same industry-city
  const allKeywords = await getKeywords()
  const otherKeywords = allKeywords.filter((k) => k.slug !== keywordSlug).slice(0, 2)
  for (const k of otherKeywords) {
    out.push({
      href: `/${industrySlug}/${citySlug}/${k.slug}`,
      label: `${k.label} for ${industry.name} in ${city.name}`,
      kind: "sibling-keyword",
    })
  }

  // Feature link
  out.push({
    href: keyword.featureLink,
    label: `See how Leadkaun's ${keyword.label} works`,
    kind: "feature",
  })

  return out
}

// City-only page related content
export async function relatedForCity(citySlug: string): Promise<RelatedLink[]> {
  const city = await getCity(citySlug)
  if (!city) return []

  const out: RelatedLink[] = []

  // Every industry served in this city
  const served = (await industriesServedInCity(citySlug)).slice(0, 8)
  for (const i of served) {
    out.push({
      href: `/${i.slug}/${citySlug}`,
      label: `${i.name} in ${city.name}`,
      kind: "industry-in-city",
    })
  }

  // 3 other cities of same tier
  const allCities = await getCities()
  const sameTierCities = allCities
    .filter((c) => c.tier === city.tier && c.slug !== citySlug)
    .slice(0, 3)
  for (const c of sameTierCities) {
    out.push({
      href: `/city/${c.slug}`,
      label: `Sales software in ${c.name}`,
      kind: "sibling-city",
    })
  }

  return out
}

// Role + City page related content
export async function relatedForRoleCity(roleSlug: string, citySlug: string): Promise<RelatedLink[]> {
  const city = await getCity(citySlug)
  if (!city) return []

  const out: RelatedLink[] = []
  const roleLabel = roleSlug.replace(/-/g, " ")

  // Same role, 3 other cities
  const allCities = await getCities()
  const otherCities = allCities.filter((c) => c.slug !== citySlug).slice(0, 3)
  for (const c of otherCities) {
    out.push({
      href: `/for/${roleSlug}/${c.slug}`,
      label: `${roleLabel} in ${c.name}`,
      kind: "sibling-city",
    })
  }

  // Industries active in this city — pulls the role page into the industry×city
  // mesh (previously role pages only linked other role pages: near-orphaned).
  const industries = (await industriesServedInCity(citySlug)).slice(0, 3)
  for (const i of industries) {
    out.push({
      href: `/${i.slug}/${citySlug}`,
      label: `${i.name} in ${city.name}`,
      kind: "role-industry",
    })
  }

  // City hub + the feature reps care about most.
  out.push({ href: `/city/${citySlug}`, label: `Sales software in ${city.name}`, kind: "hub-city" })
  out.push({ href: `/features/sales-rep-tracking`, label: "Sales rep tracking & accountability", kind: "feature" })

  return out
}
