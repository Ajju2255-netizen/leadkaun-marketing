import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import { LedgerCTA } from "@/app/components/ledger"

import { CommercialLinks } from "@/app/components/pseo/commercial-links"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { DetailHero } from "@/app/components/detail-hero"
import { GlossLink } from "@/app/components/gloss-button"
import { createSectionNumbering } from "@/app/components/section-numbering"
import { NumberedTag } from "@/app/components/numbered-tag"
import { FloatingCard } from "@/app/components/floating-card"
import { TestimonialCard } from "@/app/components/testimonial-card"
import { Faq } from "@/app/components/faq"
import { Reveal } from "@/app/components/reveal"
import { ModulesGrid } from "@/app/components/sell/blocks"

import { hubIndexable } from "@/lib/pseo/indexable"
import { stableHash } from "@/lib/pseo/variation"
import { buildLeafFaqs } from "@/lib/pseo/shared-content"
import { MethodologyCard } from "@/app/components/pseo/methodology-card"
import { BuyingCommittee } from "@/app/components/pseo/buying-committee"
import { ReferencesBlock } from "@/app/components/pseo/references-block"
import { QuickAnswer } from "@/app/components/quick-answer"
import { getIndustry, getCity, getRoles, resolveCitySlug } from "@/lib/pseo/lookup"
import { tier0Cities, tier0Industries } from "@/lib/pseo/tier0"
import { selectModules } from "@/lib/pseo/spine"
import { commercialLinks, relatedForIndustryCity } from "@/lib/pseo/related"
import { breadcrumbListSchema, faqPageSchema, localBusinessSchema, placeSchema, jsonLdScript, ogMeta } from "@/lib/seo"
import { APP_URLS } from "@/lib/urls"

export const revalidate = 86400

export async function generateStaticParams() {
  const [industries, cities] = await Promise.all([tier0Industries(), tier0Cities()])
  return industries.flatMap((i) => cities.map((c) => ({ industry: i.slug, city: c.slug })))
}

type Params = { params: Promise<{ industry: string; city: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { industry, city } = await params
  const [ind, cityRec, canonicalCityResolved] = await Promise.all([
    getIndustry(industry), getCity(city), resolveCitySlug(city),
  ])
  if (!ind || !cityRec) return {}
  const canonicalCity = canonicalCityResolved ?? city
  const title = `${ind.name} CRM & Lead Management in ${cityRec.name}`
  const description = `${cityRec.name} ${ind.name.toLowerCase()} teams use Leadkaun to grade every lead A–F, build a Priority Queue, and surface missed ₹ at risk. Setup the same day.`
  const path = `/${industry}/${canonicalCity}`
  return {
    title,
    description,
    alternates: { canonical: path },
    ...ogMeta({ title, description, path }),
    // Quality gate: Tier-4 markets stay noindex until the city record is enriched.
    // A note must clear the content-gate quality bar (>=20 chars) to promote a hub.
    robots: { index: hubIndexable(cityRec.tier, cityRec.population, (cityRec.notes?.trim().length ?? 0) >= 20), follow: true },
  }
}

export default async function IndustryCityPage({ params }: Params) {
  const { industry, city } = await params
  const [ind, cityRec, allRoles] = await Promise.all([getIndustry(industry), getCity(city), getRoles()])
  if (!ind || !cityRec) notFound()

  const related = await relatedForIndustryCity(industry, cityRec.slug)
  const commercial = commercialLinks(`${industry}:${cityRec.slug}`, industry)
  const modules = selectModules({ seedKey: `${industry}:${cityRec.slug}`, relatedFeatures: ind.relatedFeatures, industrySlug: industry })
  const faqs = buildLeafFaqs(ind.faqs, undefined, stableHash(`${industry}:${cityRec.slug}`))

  const n = createSectionNumbering()
  const schemas = [
    breadcrumbListSchema([
      { name: "Home", url: "/" },
      { name: ind.name, url: `/use-cases/${ind.slug}` },
      { name: cityRec.name },
    ]),
    localBusinessSchema({ name: `Leadkaun for ${ind.name} teams in ${cityRec.name}`, city: cityRec.name, state: cityRec.state, industry: ind.name, url: `/${industry}/${cityRec.slug}` }),
    placeSchema({ city: cityRec.name, state: cityRec.state, lat: cityRec.lat, lng: cityRec.lng }),
    faqPageSchema(faqs),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(schemas) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        <DetailHero
          breadcrumb={[{ label: ind.name, href: `/use-cases/${ind.slug}` }, { label: cityRec.name }]}
          eyebrow={`${ind.name} · ${cityRec.name}`}
          h1={<>{ind.name} Lead Management in <span className="hero-accent">{cityRec.name}.</span></>}
          sub={`${cityRec.name}-based ${ind.name.toLowerCase()} teams use Leadkaun to grade every lead A–F, build each rep's Priority Queue, and surface missed revenue in rupees. Setup the same day.`}
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

        {/* AI QUICK ANSWER (GEO / voice) */}
        <SectionGround variant="pure" size="sm">
          <Container>
            <QuickAnswer
              question={`How does Leadkaun help ${ind.name.toLowerCase()} teams in ${cityRec.name} manage leads?`}
              answer={`Leadkaun grades every ${ind.name.toLowerCase()} lead in ${cityRec.name} A–F across fit, intent, and quality in real time, then builds each rep a live Priority Queue so the highest-intent enquiries get worked first. WhatsApp is a first-class 3-tap signal, and missed revenue surfaces in rupees. Setup happens the same day, at flat INR pricing.`}
            />
          </Container>
        </SectionGround>

        {/* CONTEXT BAR */}
        <SectionGround variant="cream" size="md">
          <Container>
            <Reveal className="grid gap-4 md:grid-cols-3">
              <FloatingCard tier="2" depth="2" gloss aura="sky" className="p-7">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-600">Typical deal size</p>
                <p className="mt-2 font-mono text-[24px] font-semibold tracking-[-0.02em] text-ink tabular">{ind.ticketBand}</p>
              </FloatingCard>
              <FloatingCard tier="2" depth="2" gloss aura="sky" className="p-7">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-600">Sales cycle</p>
                <p className="mt-2 font-mono text-[24px] font-semibold tracking-[-0.02em] text-ink tabular">{ind.salesCycle}</p>
              </FloatingCard>
              <FloatingCard tier="2" depth="2" gloss aura="peach" className="p-7">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-orange-500">Primary channels in {cityRec.name}</p>
                <p className="mt-2 text-[14px] leading-[1.5] text-ink">{ind.channels.slice(0, 3).join(" · ")}</p>
              </FloatingCard>
            </Reveal>
          </Container>
        </SectionGround>

        {/* PAIN POINTS */}
        <SectionGround variant="sky" size="lg">
          <Container>
            <Reveal className="mb-12 md:mb-16 max-w-3xl">
              <NumberedTag number={n.next()} label={`Why ${cityRec.name} ${ind.name.toLowerCase()} teams lose deals`} />
              <h2 className="mt-5 text-[30px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">
                The patterns we see every week.
              </h2>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-5 md:grid-cols-3 md:gap-6">
              {ind.painPoints.map((p, i) => (
                <FloatingCard key={i} tier="2" depth="2" gloss aura={i === 1 ? "peach" : "sky"} className="p-7">
                  <span
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl font-mono text-[15px] font-bold text-white"
                    style={{
                      background: i === 1 ? "#EA580C" : "#0877B8",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-5 text-[17px] font-semibold text-ink tracking-[-0.01em] leading-[1.3]">{p.title}</h3>
                  <p className="mt-3 text-[14px] leading-[1.6] text-ink-soft">{p.body}</p>
                </FloatingCard>
              ))}
            </Reveal>
          </Container>
        </SectionGround>

        {/* HOW LEADKAUN HELPS */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mb-12 md:mb-16 max-w-3xl">
              <NumberedTag number={n.next()} tone="warm" label={`How Leadkaun helps ${ind.name.toLowerCase()} teams in ${cityRec.name}`} />
              <h2 className="mt-5 text-[30px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">
                What we configure on day one.
              </h2>
            </Reveal>

            <Reveal delay={0.08}><FloatingCard tier="3" depth="3" gloss className="overflow-hidden">
              <ol className="divide-y" style={{ borderColor: "var(--hairline)" }}>
                {ind.howItHelps.map((h, i) => (
                  <li key={i} className="flex items-start gap-6 px-7 py-6 md:px-8 md:py-7">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-mono text-[14px] font-bold text-white"
                      style={{
                        background: "#0877B8",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[16px] leading-[1.55] text-ink">{h}</p>
                  </li>
                ))}
              </ol>
            </FloatingCard></Reveal>
          </Container>
        </SectionGround>

        {/* CITY CONTEXT */}
        <SectionGround variant="sky" size="md">
          <Container>
            <Reveal delay={0.08}><FloatingCard tier="3" depth="3" gloss className="mx-auto max-w-3xl p-8">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-600">{cityRec.name} context</p>
              <p className="mt-4 text-[15px] leading-[1.65] text-ink-soft">
                {/* City tier + population are intentionally not published here. They made these
                    pages rank for encyclopedia queries instead of lead-management ones. */}
                <span className="font-semibold text-ink">{ind.name}</span> teams in {cityRec.name}, {cityRec.state} typically source leads from {ind.channels.slice(0, 3).join(", ")}. {cityRec.notes ? `${cityRec.notes}. ` : ""}All of those channels flow into Leadkaun via CSV upload or manual entry in minutes (a Google Sheets connector is on the roadmap), where every enquiry is scored and graded A–F before it reaches a rep.
              </p>
              {cityRec.districts && (
                <p className="mt-3 text-[15px] leading-[1.65] text-ink-soft">
                  Commercial activity in {cityRec.name} clusters around <strong className="text-ink font-semibold">{cityRec.districts}</strong>{cityRec.localBiz ? <>, with the local economy built on {cityRec.localBiz}</> : null}, the areas a {ind.name.toLowerCase()} pipeline here most often draws from.
                </p>
              )}
            </FloatingCard></Reveal>
          </Container>
        </SectionGround>

        {/* ILLUSTRATIVE SCENARIO — anonymous and self-labelled "Illustrative scenario";
            never presented as a real customer testimonial. Real, consented case
            studies will replace this in Phase 4. */}
        {ind.proofQuote && (
          <SectionGround variant="cream" size="md">
            <Container>
              <Reveal className="mx-auto max-w-3xl">
                <p className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
                  What this looks like in practice
                </p>
                <TestimonialCard quote={ind.proofQuote.text} />
              </Reveal>
            </Container>
          </SectionGround>
        )}

        {/* METHODOLOGY, how the grade is computed */}
        <MethodologyCard number={n.next()} ground="pure" contextLabel={ind.name.toLowerCase()} industrySlug={industry} />

        <BuyingCommittee
          number={n.next()}
          ground="sky"
          subject={ind.name}
          cityName={cityRec.name}
          citySlug={cityRec.slug}
          buyerRoles={ind.buyerRoles}
          roles={allRoles}
          seedKey={`${industry}:${cityRec.slug}`}
        />

        <ModulesGrid
          number={n.next()}
          ground="cream"
          tone="warm"
          eyebrow="What a team here uses most"
          title={<>The modules {ind.name.toLowerCase()} teams in {cityRec.name} lean on.</>}
          sub={`Chosen for how ${ind.name.toLowerCase()} teams sell, not a full tour.`}
          modules={modules}
        />

        {/* SOURCES / REFERENCES */}
        <ReferencesBlock number={n.next()} ground="cream" />

        {/* FAQ */}
        <SectionGround variant="sky" size="md">
          <Container>
            <Reveal className="mx-auto mb-10 max-w-3xl text-center">
              <div className="flex justify-center"><NumberedTag number={n.next()} label="FAQ" /></div>
              <h2 className="mt-5 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[36px]">
                Questions for {ind.name.toLowerCase()} teams.
              </h2>
            </Reveal>
            <Reveal delay={0.08}><Faq items={faqs} /></Reveal>
          </Container>
        </SectionGround>

        {/* RELATED */}
        {related.length > 0 && (
          <SectionGround variant="cream" size="md">
            <Container>
              <Reveal className="mb-8">
                <NumberedTag number={n.next()} tone="warm" label="Related" />
                <h2 className="mt-5 max-w-3xl text-[24px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[28px]">
                  More {ind.name.toLowerCase()} locations &amp; pages.
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

        <CommercialLinks number={n.next()} links={commercial} heading={`Lead management software for ${ind.name.toLowerCase()} teams.`} />

        

        <LedgerCTA headline="Your reps open their queue tomorrow." sub="Setup the same day. 14-day free trial. No credit card required." />
        <Footer />
      </main>
    </>
  )
}
