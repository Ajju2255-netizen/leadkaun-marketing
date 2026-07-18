import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Briefcase, ShoppingBag, Truck, Landmark, Hotel, type LucideIcon } from "lucide-react"

import { UseCaseLayout } from "@/app/components/use-case-layout"
import { getIndustries, getIndustry, citiesServingIndustry } from "@/lib/pseo/lookup"

export const revalidate = 86400

// Industries with a bespoke hand-built hub (app/use-cases/<slug>/page.tsx). This
// dynamic route completes the mesh for every OTHER industry in industries.json,
// so no /[industry]/[city] page links to a /use-cases hub that 404s.
const HAND_BUILT = new Set([
  "real-estate", "edtech", "bfsi", "saas", "manufacturing", "agencies", "healthcare",
])

const ICONS: Record<string, LucideIcon> = {
  retail: ShoppingBag,
  logistics: Truck,
  fintech: Landmark,
  hospitality: Hotel,
}

type IndustryEntry = {
  slug: string; name: string; painH1: string; heroSub: string
  painPoints: { title: string; body: string }[]; howItHelps: string[]
  ticketBand: string; salesCycle: string; channels: string[]
  proofStat?: string; faqs: { q: string; a: string }[]
  relatedFeatures?: string[]
}

export async function generateStaticParams() {
  const list = (await getIndustries()) as unknown as IndustryEntry[]
  return list.filter((i) => !HAND_BUILT.has(i.slug)).map((i) => ({ industry: i.slug }))
}

type Params = { params: Promise<{ industry: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { industry } = await params
  if (HAND_BUILT.has(industry)) return {}
  const ind = (await getIndustry(industry)) as unknown as IndustryEntry | null
  if (!ind) return {}
  return {
    title: `${ind.name} Lead Management India — ${ind.painH1}`,
    description: ind.heroSub.slice(0, 155),
    alternates: { canonical: `/use-cases/${industry}` },
  }
}

function titleCase(slug: string): string {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
}

export default async function IndustryUseCasePage({ params }: Params) {
  const { industry } = await params
  // Hand-built slugs are served by their own static route; never render here.
  if (HAND_BUILT.has(industry)) notFound()
  const ind = (await getIndustry(industry)) as unknown as IndustryEntry | null
  if (!ind) notFound()

  const cities = (await citiesServingIndustry(industry)).slice(0, 8)
  const relatedCities = cities.map((c) => ({ city: c.name, href: `/${industry}/${c.slug}` }))

  const featureSlug = ind.relatedFeatures?.[0] ?? "lead-scoring"

  return (
    <UseCaseLayout
      industryLabel={ind.name}
      icon={ICONS[industry] ?? Briefcase}
      h1={ind.painH1}
      subhead={ind.heroSub}
      ticketBand={ind.ticketBand}
      salesCycle={ind.salesCycle}
      channels={ind.channels}
      pains={ind.painPoints.slice(0, 3)}
      helps={ind.howItHelps}
      insight={ind.proofStat}
      faqs={ind.faqs}
      relatedCities={relatedCities}
      relatedFeature={{ label: `How ${titleCase(featureSlug)} works →`, href: `/features/${featureSlug}` }}
    />
  )
}
