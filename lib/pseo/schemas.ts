import { z } from "zod"

/**
 * Zod schemas for every `data/pseo/*.json` file.
 * Validation runs at data-load time (see lookup.ts) so build fails fast on bad data.
 */

export const INDUSTRY_SLUGS = [
  "real-estate", "edtech", "bfsi", "manufacturing", "healthcare",
  "saas", "agencies", "retail", "logistics", "education",
  "fintech", "hospitality",
] as const
export type IndustrySlug = (typeof INDUSTRY_SLUGS)[number]

export const KEYWORD_SLUGS = [
  "crm-software", "lead-management", "lead-scoring", "lead-tracking",
  "sales-software", "sales-automation", "sales-crm", "lead-management-software",
] as const
export type KeywordSlug = (typeof KEYWORD_SLUGS)[number]

export const ROLE_SLUGS = [
  "sales-manager", "founder", "sales-rep", "sales-head",
  "business-development", "admissions-counselor", "broker",
  "relationship-manager", "account-manager", "branch-manager",
] as const
export type RoleSlug = (typeof ROLE_SLUGS)[number]

export const COMPETITOR_SLUGS = [
  "zoho-crm", "leadsquared", "hubspot", "salesforce", "freshsales",
] as const
export type CompetitorSlug = (typeof COMPETITOR_SLUGS)[number]

export const INTENTS = ["I", "C", "T", "N"] as const
export type Intent = (typeof INTENTS)[number]

const citySlugRe = /^[a-z0-9-]+$/

// Cities
export const CitySchema = z.object({
  slug: z.string().regex(citySlugRe),
  name: z.string().min(2),
  aliases: z.array(z.string()).default([]),
  state: z.string().min(2),
  stateSlug: z.string().regex(citySlugRe),
  tier: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  population: z.number().int().positive(),
  lat: z.number().min(6).max(38),
  lng: z.number().min(68).max(98),
  timezone: z.string().default("Asia/Kolkata"),
  industries: z.array(z.string()),
  notes: z.string().optional(),
})
export type City = z.infer<typeof CitySchema>

// Industries
export const PainPointSchema = z.object({
  title: z.string().min(3),
  body: z.string().min(10),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  icon: z.string(),
})

export const FaqSchema = z.object({
  q: z.string().min(5),
  a: z.string().min(10),
})

export const IndustrySchema = z.object({
  slug: z.enum(INDUSTRY_SLUGS),
  name: z.string().min(2),
  painH1: z.string().min(5),
  heroSub: z.string().min(10),
  painPoints: z.array(PainPointSchema).min(3).max(4),
  howItHelps: z.array(z.string()).min(3).max(6),
  buyerRoles: z.array(z.string()),
  ticketBand: z.string(),
  salesCycle: z.string(),
  channels: z.array(z.string()),
  proofQuote: z.object({
    text: z.string(),
    name: z.string(),
    role: z.string(),
    city: z.string(),
  }).optional(),
  proofStat: z.string().optional(),
  faqs: z.array(FaqSchema).min(3).max(6),
  keywords: z.array(z.string()),
  relatedFeatures: z.array(z.string()),
  relatedCompetitor: z.string(),
  blogPillar: z.number().int().min(1).max(10),
})
export type Industry = z.infer<typeof IndustrySchema>

// Keywords
export const KeywordSchema = z.object({
  slug: z.enum(KEYWORD_SLUGS),
  label: z.string(),
  intent: z.enum(INTENTS),
  queryPattern: z.string(),
  benefitH2: z.string(),
  benefitBullets: z.array(z.string()).min(3).max(5),
  featureLink: z.string(),
  glossaryLink: z.string().optional(),
})
export type Keyword = z.infer<typeof KeywordSchema>

// Roles
export const RoleSchema = z.object({
  slug: z.enum(ROLE_SLUGS),
  title: z.string(),
  seniority: z.enum(["junior", "mid", "senior"]),
  industryTags: z.array(z.string()),
  dailyStruggle: z.string(),
  leadkaunAngle: z.string(),
  featuresUsedMost: z.array(z.string()),
  personaSource: z.string(),
})
export type Role = z.infer<typeof RoleSchema>

// Competitors
export const CompetitorSchema = z.object({
  slug: z.enum(COMPETITOR_SLUGS),
  name: z.string(),
  comparisonUrl: z.string(),
  positioning: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  switchingNarrative: z.string(),
  logoHint: z.string().optional(),
})
export type Competitor = z.infer<typeof CompetitorSchema>
