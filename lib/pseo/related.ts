import {
  getKeywords, getCity, getIndustry, getKeyword,
  citiesServingIndustry, industriesServedInCity, getCities,
} from "./lookup"

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

  // Same role, 3 other cities
  const allCities = await getCities()
  const otherCities = allCities.filter((c) => c.slug !== citySlug).slice(0, 3)
  for (const c of otherCities) {
    out.push({
      href: `/for/${roleSlug}/${c.slug}`,
      label: `${roleSlug} in ${c.name}`,
      kind: "sibling-city",
    })
  }

  // Use-case industries most relevant to role
  return out
}
