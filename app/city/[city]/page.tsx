import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { DetailHero } from "@/app/components/detail-hero"
import { GlossLink } from "@/app/components/gloss-button"
import { NumberedTag } from "@/app/components/numbered-tag"
import { IndustryTile } from "@/app/components/industry-tile"
import { Reveal } from "@/app/components/reveal"

import { getCity, industriesServedInCity, resolveCitySlug } from "@/lib/pseo/lookup"
import { tier0Cities } from "@/lib/pseo/tier0"
import { relatedForCity } from "@/lib/pseo/related"
import { breadcrumbListSchema, placeSchema, jsonLdScript, canonical } from "@/lib/seo"
import { APP_URLS } from "@/lib/urls"

export const revalidate = 86400

/** Indian-format population: 1,25,00,000 → "1.25 crore", 1,98,000 → "1.98 lakh". */
function formatPopulation(n: number): string {
  if (n >= 10000000) return `${(n / 10000000).toFixed(2).replace(/\.?0+$/, "")} crore`
  if (n >= 100000) return `${(n / 100000).toFixed(2).replace(/\.?0+$/, "")} lakh`
  return n.toLocaleString("en-IN")
}

const TIER_LABEL: Record<number, string> = {
  1: "metro",
  2: "major city",
  3: "emerging hub",
  4: "growing market",
}

export async function generateStaticParams() {
  const cities = await tier0Cities()
  return cities.map((c) => ({ city: c.slug }))
}

type Params = { params: Promise<{ city: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { city } = await params
  const [cityRec, canonicalCityResolved] = await Promise.all([getCity(city), resolveCitySlug(city)])
  if (!cityRec) return {}
  const canonicalCity = canonicalCityResolved ?? city
  return {
    title: `Sales CRM & Lead Management in ${cityRec.name} | Leadkaun`,
    description: `Leadkaun is the Sales Behaviour OS for ${cityRec.name} B2B teams. Grade leads A–F, build Priority Queues, surface missed ₹. Setup in 60 min.`,
    alternates: { canonical: `/city/${canonicalCity}` },
  }
}

export default async function CityPage({ params }: Params) {
  const { city } = await params
  const cityRec = await getCity(city)
  if (!cityRec) notFound()

  const [served, related] = await Promise.all([industriesServedInCity(cityRec.slug), relatedForCity(cityRec.slug)])

  const schemas = [
    breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "Cities", url: "/city" }, { name: cityRec.name }]),
    placeSchema({ city: cityRec.name, state: cityRec.state, lat: cityRec.lat, lng: cityRec.lng }),
    {
      "@context": "https://schema.org", "@type": "ItemList",
      name: `Industries served in ${cityRec.name}`,
      itemListElement: served.map((i, idx) => ({
        "@type": "ListItem", position: idx + 1,
        url: canonical(`/${i.slug}/${cityRec.slug}`),
        name: `${i.name} in ${cityRec.name}`,
      })),
    },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(schemas) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        <DetailHero
          breadcrumb={[{ label: "City" }, { label: cityRec.name }]}
          eyebrow={`${cityRec.state} · Tier ${cityRec.tier}`}
          h1={<>Sales CRM &amp; Lead Management in <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(95deg, #0EA5E9 0%, #FB923C 100%)" }}>{cityRec.name}.</span></>}
          sub={`Leadkaun is the Sales Behaviour OS for ${cityRec.name} B2B teams. Tier-${cityRec.tier} city in ${cityRec.state}${cityRec.notes ? `. ${cityRec.notes}` : ""}. Grade every lead A–F, build a Priority Queue, surface missed ₹ — setup in 60 minutes.`}
          cta={
            <>
              <GlossLink variant="primary" size="md" href={APP_URLS.register}>
                Start free trial
                <span className="font-mono opacity-80">→</span>
              </GlossLink>
              <Link href="/demo" className="group inline-flex items-center gap-1.5 text-[14px] font-semibold text-sky-600 hover:text-sky-500">
                Book a demo →
              </Link>
            </>
          }
        />

        {/* ── Local-context fingerprint — real data, so no two city hubs read alike ── */}
        <SectionGround variant="pure" size="lg">
          <Container>
            <Reveal className="mb-8 max-w-3xl">
              <NumberedTag number="01" label={`${cityRec.name} at a glance`} />
              <h2 className="mt-5 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[36px]">
                Built for how {cityRec.name} actually sells.
              </h2>
              <p className="mt-5 text-[16px] leading-[1.65] text-ink-soft md:text-[17px]">
                {cityRec.name} is a Tier-{cityRec.tier} {TIER_LABEL[cityRec.tier]} in {cityRec.state}, home to roughly{" "}
                {formatPopulation(cityRec.population)} people{cityRec.notes ? ` — ${cityRec.notes.replace(/\.$/, "")}` : ""}.
                Leadkaun works the {served.length} B2B {served.length === 1 ? "sector" : "sectors"} that sell here
                {served.length > 0 ? `, led by ${served.slice(0, 3).map((i) => i.name).join(", ")}` : ""}: grade every lead
                A–F in under 500ms, build each rep&apos;s priority queue, and surface ₹ at risk before a hot lead cools.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {[
                { k: "State", v: cityRec.state },
                { k: "City tier", v: `Tier ${cityRec.tier}` },
                { k: "Population", v: `~${formatPopulation(cityRec.population)}` },
                { k: "B2B sectors served", v: String(served.length) },
              ].map((s) => (
                <div key={s.k} className="rounded-2xl glass-2 gloss-edge p-5">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink-muted">{s.k}</p>
                  <p className="mt-2 text-[18px] font-semibold leading-tight tracking-[-0.01em] text-ink tabular-nums md:text-[20px]">{s.v}</p>
                </div>
              ))}
            </Reveal>
          </Container>
        </SectionGround>

        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mb-10">
              <NumberedTag number="02" tone="warm" label="Industries" />
              <h2 className="mt-5 max-w-3xl text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[36px]">
                Industries we serve in {cityRec.name}.
              </h2>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {served.map((i) => (
                <IndustryTile key={i.slug} href={`/${i.slug}/${cityRec.slug}`} label={`${i.name} in ${cityRec.name}`} meta={i.ticketBand} />
              ))}
            </Reveal>
          </Container>
        </SectionGround>

        {related.length > 0 && (
          <SectionGround variant="sky" size="md">
            <Container>
              <Reveal className="mb-8">
                <NumberedTag number="03" label="Related" />
                <h2 className="mt-5 max-w-3xl text-[24px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[28px]">
                  More pages for {cityRec.name}.
                </h2>
              </Reveal>
              <Reveal delay={0.08} className="flex flex-wrap gap-2.5">
                {related.map((r) => (
                  <Link key={r.href} href={r.href} className="inline-flex items-center rounded-full glass-1 gloss-edge px-4 py-2 text-[13px] font-medium text-ink-soft transition-all hover:text-sky-600 lift">
                    {r.label}
                  </Link>
                ))}
              </Reveal>
            </Container>
          </SectionGround>
        )}

        <CTABanner />
        <Footer />
      </main>
    </>
  )
}
