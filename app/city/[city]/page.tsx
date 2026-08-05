import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
import { CommercialLinks } from "@/app/components/pseo/commercial-links"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { DetailHero } from "@/app/components/detail-hero"
import { GlossLink } from "@/app/components/gloss-button"
import { NumberedTag } from "@/app/components/numbered-tag"
import { IndustryTile } from "@/app/components/industry-tile"
import { Faq } from "@/app/components/faq"
import { Reveal } from "@/app/components/reveal"
import { QuickAnswer } from "@/app/components/quick-answer"
import { ProofBand, SellSpine } from "@/app/components/sell/blocks"
import { MethodologyCard } from "@/app/components/pseo/methodology-card"
import { ReferencesBlock } from "@/app/components/pseo/references-block"

import { hubIndexable } from "@/lib/pseo/indexable"
import { stableHash, pickN } from "@/lib/pseo/variation"
import { SHARED_FAQS } from "@/lib/pseo/shared-content"
import { getCity, getRoles, industriesServedInCity, resolveCitySlug } from "@/lib/pseo/lookup"
import { tier0Cities } from "@/lib/pseo/tier0"
import { commercialLinks, relatedForCity } from "@/lib/pseo/related"
import { breadcrumbListSchema, placeSchema, faqPageSchema, jsonLdScript, canonical } from "@/lib/seo"
import { APP_URLS } from "@/lib/urls"

export const revalidate = 86400

/**
 * NOTE: city tier + population are deliberately NOT rendered anywhere on this
 * page. They remain in the city record purely to drive the indexation gate
 * (`hubIndexable`). Publishing them as prose/stat tiles made these pages rank
 * for encyclopedia queries ("<city> is which tier city", "lakh definition")
 * instead of lead-management queries — see the GSC audit. Keep them out of the
 * rendered output; the local fingerprint comes from notes/districts/localBiz.
 */

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
    description: `Leadkaun is the Sales Behaviour OS for ${cityRec.name} B2B teams. Grade leads A–F, build Priority Queues, surface missed ₹. Setup the same day.`,
    alternates: { canonical: `/city/${canonicalCity}` },
    // Quality gate: Tier-4 markets stay noindex until the city record is enriched.
    // A note must clear the content-gate quality bar (>=20 chars) to promote a hub.
    robots: { index: hubIndexable(cityRec.tier, cityRec.population, (cityRec.notes?.trim().length ?? 0) >= 20), follow: true },
  }
}

export default async function CityPage({ params }: Params) {
  const { city } = await params
  const cityRec = await getCity(city)
  if (!cityRec) notFound()

  const [served, related, roles] = await Promise.all([industriesServedInCity(cityRec.slug), relatedForCity(cityRec.slug), getRoles()])
  const commercial = commercialLinks(`city:${cityRec.slug}`)
  const faqs = pickN(SHARED_FAQS, 6, stableHash(`city:${cityRec.slug}`))

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
    faqPageSchema(faqs),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(schemas) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        <DetailHero
          breadcrumb={[{ label: "City" }, { label: cityRec.name }]}
          eyebrow={`${cityRec.state} · Lead Management Software`}
          h1={<>Sales CRM &amp; Lead Management in <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(95deg, #0EA5E9 0%, #FB923C 100%)" }}>{cityRec.name}.</span></>}
          sub={`Lead management and sales CRM software for ${cityRec.name} B2B teams${cityRec.notes ? ` — ${cityRec.notes.replace(/\.$/, "")}` : ""}. Grade every lead A–F, build a Priority Queue, surface missed ₹ — setup the same day.`}
          cta={
            <>
              <GlossLink variant="primary" size="md" href={APP_URLS.register}>
                Start free trial
                <span className="font-mono opacity-80">→</span>
              </GlossLink>
              <Link href={APP_URLS.register} className="group inline-flex items-center gap-1.5 text-[14px] font-semibold text-sky-600 hover:text-sky-500">
                Get started free →
              </Link>
            </>
          }
        />

        <ProofBand />

        {/* AI QUICK ANSWER (GEO / speakable) */}
        <SectionGround variant="pure" size="sm">
          <Container>
            <QuickAnswer
              question={`Is Leadkaun a good fit for B2B sales teams in ${cityRec.name}?`}
              answer={`Leadkaun is lead management software for ${cityRec.name} B2B teams. It grades every lead A–F on fit, intent and quality, builds each rep a Priority Queue, and surfaces the ₹ at risk from stale leads — running alongside your CRM, with same-day setup. It's calibrated for how ${cityRec.name} teams actually sell: Indian phone handling, WhatsApp as a first-class lead signal, and ₹ figures in Indian formatting throughout.`}
            />
          </Container>
        </SectionGround>

        {/* ── Local-context fingerprint — real data, so no two city hubs read alike ── */}
        <SectionGround variant="pure" size="lg">
          <Container>
            <Reveal className="mb-8 max-w-3xl">
              <NumberedTag number="01" label={`${cityRec.name} at a glance`} />
              <h2 className="mt-5 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[36px]">
                Built for how {cityRec.name} actually sells.
              </h2>
              <p className="mt-5 text-[16px] leading-[1.65] text-ink-soft md:text-[17px]">
                Sales teams in {cityRec.name}, {cityRec.state} run on enquiries from calls, WhatsApp and portals
                {cityRec.notes ? ` — ${cityRec.notes.replace(/\.$/, "")}` : ""}. Leadkaun is the lead management system
                for the {served.length} B2B {served.length === 1 ? "sector" : "sectors"} that sell here
                {served.length > 0 ? `, led by ${served.slice(0, 3).map((i) => i.name).join(", ")}` : ""}: score and grade
                every lead A–F in real time, build each rep&apos;s priority queue, and surface ₹ at risk before a hot
                lead cools.
              </p>
              {cityRec.districts && (
                <p className="mt-4 text-[15px] leading-[1.65] text-ink-soft md:text-[16px]">
                  Commercial activity in {cityRec.name} clusters around <strong className="text-ink font-semibold">{cityRec.districts}</strong>{cityRec.localBiz ? <>, with the local B2B economy built on {cityRec.localBiz}</> : null}. Leadkaun grades and queues enquiries from across those areas so the highest-intent ones surface first, wherever they land.
                </p>
              )}
            </Reveal>
            <Reveal delay={0.08} className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {[
                { k: "State", v: cityRec.state },
                { k: "B2B sectors served", v: String(served.length) },
                { k: "Lead grading", v: "A–F, live" },
                { k: "Setup time", v: "Same day" },
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

        {roles.length > 0 && (
          <SectionGround variant="pure" size="lg">
            <Container>
              <Reveal className="mb-8">
                <NumberedTag number="03" label="By role" />
                <h2 className="mt-5 max-w-3xl text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[34px]">
                  For sales roles in {cityRec.name}.
                </h2>
              </Reveal>
              <Reveal delay={0.08} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {roles.map((r) => (
                  <IndustryTile
                    key={r.slug}
                    href={`/for/${r.slug}/${cityRec.slug}`}
                    label={`For ${r.title}s`}
                    meta={`in ${cityRec.name}`}
                  />
                ))}
              </Reveal>
            </Container>
          </SectionGround>
        )}

        {/* METHODOLOGY — how the grade is computed */}
        <MethodologyCard number="04" ground="cream" />

        <SellSpine
          start={5}
          showcaseEyebrow="See it work"
          showcaseTitle={<>See Leadkaun work for {cityRec.name} sales teams.</>}
          showcaseSub={`Every lead graded A–F, a live Priority Queue per rep, and the ₹ at risk surfaced in real rupees — the screen ${cityRec.name} B2B teams open every morning.`}
        />

        {/* SOURCES / REFERENCES */}
        <ReferencesBlock number="09" ground="cream" />

        {/* FAQ */}
        <SectionGround variant="sky" size="md">
          <Container>
            <Reveal className="mx-auto mb-10 max-w-3xl text-center">
              <div className="flex justify-center"><NumberedTag number="10" label="FAQ" /></div>
              <h2 className="mt-5 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[36px]">
                Questions {cityRec.name} teams ask.
              </h2>
            </Reveal>
            <Reveal delay={0.08}><Faq items={faqs} /></Reveal>
          </Container>
        </SectionGround>

        {related.length > 0 && (
          <SectionGround variant="sky" size="md">
            <Container>
              <Reveal className="mb-8">
                <NumberedTag number="11" label="Related" />
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

        <CommercialLinks number="12" links={commercial} heading={`Lead management software for ${cityRec.name} sales teams.`} />

        <CTABanner />
        <Footer />
      </main>
    </>
  )
}
