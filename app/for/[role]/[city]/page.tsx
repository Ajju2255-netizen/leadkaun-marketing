import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { leafIndexable } from "@/lib/pseo/indexable"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
import { CommercialLinks } from "@/app/components/pseo/commercial-links"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { DetailHero } from "@/app/components/detail-hero"
import { GlossLink } from "@/app/components/gloss-button"
import { NumberedTag } from "@/app/components/numbered-tag"
import { FloatingCard } from "@/app/components/floating-card"
import { Faq } from "@/app/components/faq"
import { Reveal } from "@/app/components/reveal"
import { QuickAnswer } from "@/app/components/quick-answer"
import { ProofBand, SellSpine } from "@/app/components/sell/blocks"
import { MethodologyCard } from "@/app/components/pseo/methodology-card"
import { ReferencesBlock } from "@/app/components/pseo/references-block"

import { stableHash, pickN } from "@/lib/pseo/variation"
import { SHARED_FAQS } from "@/lib/pseo/shared-content"
import { getCities, getCity, getRole, getIndustries, resolveCitySlug } from "@/lib/pseo/lookup"
import { tier0Cities, tier0Roles } from "@/lib/pseo/tier0"
import { commercialLinks, relatedForRoleCity } from "@/lib/pseo/related"
import { breadcrumbListSchema, placeSchema, faqPageSchema, jsonLdScript } from "@/lib/seo"
import { APP_URLS } from "@/lib/urls"

export const revalidate = 86400

export async function generateStaticParams() {
  const [roles, cities] = await Promise.all([tier0Roles(), tier0Cities()])
  return roles.flatMap((r) => cities.map((c) => ({ role: r.slug, city: c.slug })))
}

type Params = { params: Promise<{ role: string; city: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { role, city } = await params
  const [r, cityRec, canonicalCityResolved] = await Promise.all([getRole(role), getCity(city), resolveCitySlug(city)])
  if (!r || !cityRec) return {}
  const canonicalCity = canonicalCityResolved ?? city
  return {
    title: `Sales Software for ${r.title}s in ${cityRec.name} | Leadkaun`,
    description: `${r.title}s in ${cityRec.name} use Leadkaun to grade leads A–F, build rep queues, and surface missed ₹. Setup the same day.`,
    alternates: { canonical: `/for/${role}/${canonicalCity}` },
    // Quality-first: role pages for smaller cities are noindexed until they clear
    // the content quality gate (Phase 3). Only Tier ≤ 2 are indexable today.
    robots: { index: leafIndexable(cityRec.tier, !!cityRec.districts), follow: true },
  }
}

export default async function RoleCityPage({ params }: Params) {
  const { role, city } = await params
  const [r, cityRec, allCities, industries] = await Promise.all([getRole(role), getCity(city), getCities(), getIndustries()])
  if (!r || !cityRec) notFound()

  // Role × city fit: which local B2B sectors this role most often sells into.
  const cityIndustries = industries.filter((i) => cityRec.industries.includes(i.slug))
  const roleFit = cityIndustries.filter((i) => r.industryTags.includes(i.slug))
  const fitIndustries = (roleFit.length ? roleFit : cityIndustries).slice(0, 3)
  const faqs = pickN(SHARED_FAQS, 5, stableHash(`role:${role}:${cityRec.slug}`))
  const commercial = commercialLinks(`role:${role}:${cityRec.slug}`, fitIndustries[0]?.slug)
  // Role pages previously linked ONLY other role pages — a closed loop. Pull in
  // the cross-type links (industry×city, city hub, feature) so they join the mesh.
  const crossLinks = (await relatedForRoleCity(role, cityRec.slug)).filter((l) => l.kind !== "sibling-city")

  const schemas = [
    breadcrumbListSchema([
      { name: "Home", url: "/" }, { name: "For", url: "/" },
      { name: r.title }, { name: cityRec.name },
    ]),
    placeSchema({ city: cityRec.name, state: cityRec.state, lat: cityRec.lat, lng: cityRec.lng }),
    faqPageSchema(faqs),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(schemas) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        <DetailHero
          breadcrumb={[{ label: "For" }, { label: `${r.title}s` }, { label: cityRec.name }]}
          eyebrow={`For ${r.title}s in ${cityRec.name}`}
          h1={<>Sales software built for the way <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(95deg, #0EA5E9 0%, #FB923C 100%)" }}>{r.title.toLowerCase()}s work.</span></>}
          sub={r.dailyStruggle}
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
              question={`Is Leadkaun useful for a ${r.title.toLowerCase()} in ${cityRec.name}?`}
              answer={`Yes. ${r.leadkaunAngle}`}
            />
          </Container>
        </SectionGround>

        {/* HOW IT CHANGES THE DAY */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mx-auto max-w-3xl">
              <NumberedTag number="01" tone="warm" label="How Leadkaun changes your day" />
              <h2 className="mt-5 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[36px]">
                From triage to action.
              </h2>
              <p className="mt-6 text-[17px] leading-[1.65] text-ink-soft">{r.leadkaunAngle}</p>
            </Reveal>
          </Container>
        </SectionGround>

        {/* ROLE × CITY FIT */}
        <SectionGround variant="sky" size="md">
          <Container>
            <Reveal delay={0.08}><FloatingCard tier="3" depth="3" gloss className="mx-auto max-w-3xl p-8">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-600">{r.title}s in {cityRec.name}</p>
              <p className="mt-4 text-[15px] leading-[1.65] text-ink-soft">
                In {cityRec.name}, {cityRec.state}, a {r.title.toLowerCase()} most often sells into <strong className="text-ink font-semibold">{fitIndustries.map((i) => i.name).join(", ")}</strong>. Leadkaun grades every enquiry from those sectors A–F on fit, intent and quality, so the queue is ranked before the {r.title.toLowerCase()} opens it.
              </p>
              {r.featuresUsedMost.length > 0 && (
                <p className="mt-3 text-[15px] leading-[1.65] text-ink-soft">
                  The modules a {r.title.toLowerCase()} leans on most: <strong className="text-ink font-semibold">{r.featuresUsedMost.join(", ")}</strong> — built for how {r.title.toLowerCase()}s in Indian B2B actually work, with WhatsApp as a first-class lead signal and ₹ figures in Indian formatting throughout.
                </p>
              )}
            </FloatingCard></Reveal>
          </Container>
        </SectionGround>

        {/* METHODOLOGY — how the grade is computed */}
        <MethodologyCard number="03" ground="cream" />

        <SellSpine
          start={4}
          showcaseEyebrow={`How a ${r.title.toLowerCase()} works the queue`}
          showcaseTitle={<>The screen a {r.title.toLowerCase()} opens every morning.</>}
          showcaseSub={`No dashboards to read. Leadkaun grades every lead A–F, ranks each rep's Priority Queue, and shows the ₹ at risk today — so a ${r.title.toLowerCase()} in ${cityRec.name} knows exactly who to call next.`}
        />

        {/* SOURCES / REFERENCES */}
        <ReferencesBlock number="08" ground="cream" />

        {/* FAQ */}
        <SectionGround variant="pure" size="md">
          <Container>
            <Reveal className="mx-auto mb-10 max-w-3xl text-center">
              <div className="flex justify-center"><NumberedTag number="09" label="FAQ" /></div>
              <h2 className="mt-5 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[36px]">
                Questions {r.title.toLowerCase()}s ask.
              </h2>
            </Reveal>
            <Reveal delay={0.08}><Faq items={faqs} /></Reveal>
          </Container>
        </SectionGround>

        {/* RELATED */}
        <SectionGround variant="sky" size="md">
          <Container>
            <Reveal className="mb-8">
              <NumberedTag number="10" tone="warm" label="Same role, other cities" />
              <h2 className="mt-5 max-w-3xl text-[24px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[28px]">
                {r.title}s elsewhere in India.
              </h2>
            </Reveal>
            <Reveal delay={0.08} className="flex flex-wrap gap-2.5">
              {allCities.filter((c) => c.slug !== cityRec.slug).filter((c) => c.tier <= cityRec.tier + 1).slice(0, 8).map((c) => (
                <Link key={c.slug} href={`/for/${role}/${c.slug}`} className="inline-flex items-center rounded-full glass-1 gloss-edge px-4 py-2 text-[13px] font-medium text-ink-soft transition-all hover:text-sky-600 lift">
                  {r.title}s in {c.name}
                </Link>
              ))}
              {crossLinks.map((l) => (
                <Link key={l.href} href={l.href} className="inline-flex items-center rounded-full glass-1 gloss-edge px-4 py-2 text-[13px] font-medium text-ink-soft transition-all hover:text-sky-600 lift">
                  {l.label}
                </Link>
              ))}
            </Reveal>
          </Container>
        </SectionGround>

        <CommercialLinks number="11" links={commercial} heading={`Lead management software for ${r.title.toLowerCase()}s.`} />

        <CTABanner />
        <Footer />
      </main>
    </>
  )
}
