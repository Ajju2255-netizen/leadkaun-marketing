import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { leafIndexable } from "@/lib/pseo/indexable"
import { stableHash, keywordIntro } from "@/lib/pseo/variation"
import { buildLeafFaqs } from "@/lib/pseo/shared-content"

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
import { Faq } from "@/app/components/faq"
import { Reveal } from "@/app/components/reveal"
import { QuickAnswer } from "@/app/components/quick-answer"
import { ModulesGrid } from "@/app/components/sell/blocks"
import { MethodologyCard } from "@/app/components/pseo/methodology-card"
import { BuyingCommittee } from "@/app/components/pseo/buying-committee"
import { ReferencesBlock } from "@/app/components/pseo/references-block"

import { getIndustry, getCity, getKeyword, getRoles, resolveCitySlug } from "@/lib/pseo/lookup"
import { tier0CitiesForKeyword, tier0Industries, tier0Keywords } from "@/lib/pseo/tier0"
import { selectModules } from "@/lib/pseo/spine"
import { commercialLinks, relatedForIndustryCityKeyword } from "@/lib/pseo/related"
import { breadcrumbListSchema, faqPageSchema, localBusinessSchema, placeSchema, offerSchema, jsonLdScript, ogMeta } from "@/lib/seo"
import { APP_URLS } from "@/lib/urls"

export const revalidate = 86400

export async function generateStaticParams() {
  const [industries, cities, keywords] = await Promise.all([tier0Industries(), tier0CitiesForKeyword(), tier0Keywords()])
  return industries.flatMap((i) => cities.flatMap((c) => keywords.map((k) => ({ industry: i.slug, city: c.slug, keyword: k.slug }))))
}

type Params = { params: Promise<{ industry: string; city: string; keyword: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { industry, city, keyword } = await params
  const [ind, cityRec, kw, canonicalCityResolved] = await Promise.all([
    getIndustry(industry), getCity(city), getKeyword(keyword), resolveCitySlug(city),
  ])
  if (!ind || !cityRec || !kw) return {}
  const canonicalCity = canonicalCityResolved ?? city
  const title = `${kw.label} for ${ind.name} Teams in ${cityRec.name}`
  const description = `${cityRec.name} ${ind.name.toLowerCase()} teams use Leadkaun's ${kw.label.toLowerCase()} to grade every lead A–F. Setup the same day. Priority Queue, ₹ at risk, Morning Brief.`
  const path = `/${industry}/${canonicalCity}/${keyword}`
  return {
    title,
    description,
    alternates: { canonical: path },
    ...ogMeta({ title, description, path }),
    // Quality-first: keyword leaves are noindexed for smaller cities until they
    // clear the content quality gate (Phase 3). Only Tier ≤ 2 are indexable today.
    robots: { index: leafIndexable(cityRec.tier, !!cityRec.districts), follow: true },
  }
}

export default async function IndustryCityKeywordPage({ params }: Params) {
  const { industry, city, keyword } = await params
  const [ind, cityRec, kw, allRoles] = await Promise.all([getIndustry(industry), getCity(city), getKeyword(keyword), getRoles()])
  if (!ind || !cityRec || !kw) notFound()

  const related = await relatedForIndustryCityKeyword(industry, cityRec.slug, keyword)
  const commercial = commercialLinks(`${industry}:${cityRec.slug}:${keyword}`, industry)
  const modules = selectModules({ seedKey: `${industry}:${cityRec.slug}:${keyword}`, featureLink: kw.featureLink, relatedFeatures: ind.relatedFeatures, industrySlug: industry })
  // Deterministic hash-seeded variation (Anti-AI Layer 2): same combo → same
  // render (ISR-safe), but neighbours differ in intro framing + FAQ subset.
  const seed = stableHash(`${industry}:${cityRec.slug}:${keyword}`)
  const faqs = buildLeafFaqs(ind.faqs, kw.faqs, seed)
  const intro = keywordIntro(
    { industryName: ind.name, industryLower: ind.name.toLowerCase(), cityName: cityRec.name, keywordLabel: kw.label, keywordLower: kw.label.toLowerCase() },
    seed,
  )

  const n = createSectionNumbering()
  const schemas = [
    breadcrumbListSchema([
      { name: "Home", url: "/" },
      { name: ind.name, url: `/use-cases/${ind.slug}` },
      { name: cityRec.name, url: `/${industry}/${cityRec.slug}` },
      { name: kw.label },
    ]),
    localBusinessSchema({ name: `Leadkaun ${kw.label} for ${ind.name} in ${cityRec.name}`, city: cityRec.name, state: cityRec.state, industry: ind.name, url: `/${industry}/${cityRec.slug}/${keyword}`, description: `${kw.label} built for ${ind.name.toLowerCase()} sales teams in ${cityRec.name}.` }),
    placeSchema({ city: cityRec.name, state: cityRec.state, lat: cityRec.lat, lng: cityRec.lng }),
    offerSchema({ name: `Leadkaun Growth, ${kw.label} for ${ind.name} teams`, priceInr: 7999, url: "/pricing" }),
    faqPageSchema(faqs),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(schemas) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        <DetailHero
          breadcrumb={[
            { label: ind.name, href: `/use-cases/${ind.slug}` },
            { label: cityRec.name, href: `/${industry}/${cityRec.slug}` },
            { label: kw.label },
          ]}
          eyebrow={kw.label}
          h1={<>{kw.label} for {ind.name} Teams in <span className="hero-accent">{cityRec.name}.</span></>}
          sub={`Leadkaun's ${kw.label.toLowerCase()} is built for how ${cityRec.name}-based ${ind.name.toLowerCase()} teams actually sell, Indian phone handling, WhatsApp as a first-class lead signal, ₹ figures in Indian formatting throughout.`}
          tldr={{ label: "In short", body: intro, tone: "sky" }}
          cta={
            <>
              <GlossLink variant="primary" size="md" href={APP_URLS.register}>
                Start free trial
                <span className="font-mono opacity-80">→</span>
              </GlossLink>
              <Link href="/pricing" className="group inline-flex items-center gap-1.5 text-[14px] font-semibold text-sky-600 hover:text-sky-500">
                See pricing →
              </Link>
            </>
          }
        />

        {/* AI QUICK ANSWER (GEO / speakable) */}
        <SectionGround variant="pure" size="sm">
          <Container>
            <QuickAnswer
              question={`What is Leadkaun's ${kw.label.toLowerCase()} for ${ind.name.toLowerCase()} teams in ${cityRec.name}?`}
              answer={intro}
            />
          </Container>
        </SectionGround>

        {/* BENEFITS */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mb-10 md:mb-14 max-w-3xl">
              <NumberedTag number={n.next()} tone="warm" label={`What ${kw.label.toLowerCase()} does`} />
              <h2 className="mt-5 text-[30px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">
                What it does for {ind.name.toLowerCase()} teams.
              </h2>
            </Reveal>

            <Reveal delay={0.08}><FloatingCard tier="3" depth="3" gloss className="overflow-hidden">
              <ul className="divide-y" style={{ borderColor: "var(--hairline)" }}>
                {kw.benefitBullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-6 px-7 py-6 md:px-8 md:py-7">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-mono text-[14px] font-bold text-white"
                      style={{
                        background: "#0877B8",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[16px] leading-[1.55] text-ink">{b}</p>
                  </li>
                ))}
              </ul>
            </FloatingCard></Reveal>
          </Container>
        </SectionGround>

        {/* KEYWORD-ANGLE BODY */}
        {kw.body && kw.body.length > 0 && (
          <SectionGround variant="pure" size="lg">
            <Container>
              <div className="mx-auto max-w-3xl">
                <Reveal>
                  <NumberedTag number={n.next()} label={`On ${kw.label.toLowerCase()}`} />
                  <h2 className="mt-5 text-[28px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[34px]">
                    What {kw.label.toLowerCase()} actually solves.
                  </h2>
                </Reveal>
                {kw.body.map((para, i) => (
                  <Reveal key={i} delay={0.04}>
                    <p className="mt-5 text-[16px] leading-[1.7] text-ink-soft md:text-[17px]">{para}</p>
                  </Reveal>
                ))}
              </div>
            </Container>
          </SectionGround>
        )}

        {/* CITY CONTEXT */}
        <SectionGround variant="sky" size="md">
          <Container>
            <Reveal delay={0.08}><FloatingCard tier="3" depth="3" gloss className="mx-auto max-w-3xl p-8">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-600">{ind.name} in {cityRec.name}</p>
              <p className="mt-4 text-[15px] leading-[1.65] text-ink-soft">
                In {cityRec.name}, {ind.name.toLowerCase()} teams typically work leads from <strong className="text-ink font-semibold">{ind.channels.slice(0, 3).join(", ")}</strong>, with deal sizes in the <strong className="text-ink font-semibold">{ind.ticketBand}</strong> range and sales cycles of <strong className="text-ink font-semibold">{ind.salesCycle}</strong>. Leadkaun&apos;s {kw.label.toLowerCase()} is calibrated for those realities, not a generic US B2B default.
              </p>
              <p className="mt-3 text-[15px] leading-[1.65] text-ink-soft">
                In {cityRec.name}, {cityRec.state}, B2B demand concentrates in {cityRec.industries.slice(0, 3).join(", ").replace(/-/g, " ")}. Leadkaun grades and queues every enquiry here on fit, intent and quality, so a {cityRec.name} rep works the highest-probability leads first.
              </p>
              {cityRec.notes && (
                <p className="mt-3 text-[15px] leading-[1.65] text-ink-soft">
                  {cityRec.notes.replace(/\.$/, "")}, context Leadkaun&apos;s grading accounts for when it ranks a {cityRec.name} {ind.name.toLowerCase()} pipeline.
                </p>
              )}
              {cityRec.districts && (
                <p className="mt-3 text-[15px] leading-[1.65] text-ink-soft">
                  Commercial activity clusters around <strong className="text-ink font-semibold">{cityRec.districts}</strong>{cityRec.localBiz ? <>, with the local economy built on {cityRec.localBiz}</> : null}, the areas a {cityRec.name} {ind.name.toLowerCase()} pipeline most often draws from. Leadkaun grades and queues those enquiries so the highest-intent ones surface first, wherever they land.
                </p>
              )}
            </FloatingCard></Reveal>
          </Container>
        </SectionGround>

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
          seedKey={`${industry}:${cityRec.slug}:${kw.slug}`}
        />

        <ModulesGrid
          number={n.next()}
          ground="cream"
          tone="warm"
          eyebrow={`What ${kw.label.toLowerCase()} touches`}
          title={<>The modules behind {kw.label.toLowerCase()}.</>}
          sub={`The parts of Leadkaun a ${ind.name.toLowerCase()} team in ${cityRec.name} actually works with here.`}
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
                Questions teams ask.
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
                  More {ind.name.toLowerCase()} × {kw.label.toLowerCase()} pages.
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
