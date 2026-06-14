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
import { FloatingCard } from "@/app/components/floating-card"
import { Faq } from "@/app/components/faq"
import { Reveal } from "@/app/components/reveal"

import { getIndustry, getCity, getKeyword, resolveCitySlug } from "@/lib/pseo/lookup"
import { tier0CitiesForKeyword, tier0Industries, tier0Keywords } from "@/lib/pseo/tier0"
import { relatedForIndustryCityKeyword } from "@/lib/pseo/related"
import { breadcrumbListSchema, faqPageSchema, localBusinessSchema, placeSchema, offerSchema, jsonLdScript } from "@/lib/seo"
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
  return {
    title: `${kw.label} for ${ind.name} Teams in ${cityRec.name} | Leadkaun`,
    description: `${cityRec.name} ${ind.name.toLowerCase()} teams use Leadkaun's ${kw.label.toLowerCase()} to grade every lead A–F. Setup in 60 min. Priority Queue, ₹ at risk, Morning Brief.`,
    alternates: { canonical: `/${industry}/${canonicalCity}/${keyword}` },
  }
}

export default async function IndustryCityKeywordPage({ params }: Params) {
  const { industry, city, keyword } = await params
  const [ind, cityRec, kw] = await Promise.all([getIndustry(industry), getCity(city), getKeyword(keyword)])
  if (!ind || !cityRec || !kw) notFound()

  const related = await relatedForIndustryCityKeyword(industry, cityRec.slug, keyword)
  const faqStart = Math.abs(keyword.length) % Math.max(1, ind.faqs.length - 3)
  const faqs = ind.faqs.slice(faqStart, faqStart + 3)

  const schemas = [
    breadcrumbListSchema([
      { name: "Home", url: "/" },
      { name: ind.name, url: `/use-cases/${ind.slug}` },
      { name: cityRec.name, url: `/${industry}/${cityRec.slug}` },
      { name: kw.label },
    ]),
    localBusinessSchema({ name: `Leadkaun ${kw.label} for ${ind.name} in ${cityRec.name}`, city: cityRec.name, state: cityRec.state, industry: ind.name, url: `/${industry}/${cityRec.slug}/${keyword}`, description: `${kw.label} built for ${ind.name.toLowerCase()} sales teams in ${cityRec.name}.` }),
    placeSchema({ city: cityRec.name, state: cityRec.state, lat: cityRec.lat, lng: cityRec.lng }),
    offerSchema({ name: `Leadkaun Growth — ${kw.label} for ${ind.name} teams`, priceInr: 1999, url: "/pricing" }),
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
          h1={<>{kw.label} for {ind.name} Teams in <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(95deg, #0EA5E9 0%, #FB923C 100%)" }}>{cityRec.name}.</span></>}
          sub={`Leadkaun's ${kw.label.toLowerCase()} is built for how ${cityRec.name}-based ${ind.name.toLowerCase()} teams actually sell — Indian phone handling, WhatsApp as a first-class signal, lakhs/crores throughout.`}
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

        {/* BENEFITS */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mb-10 md:mb-14 max-w-3xl">
              <NumberedTag number="01" tone="warm" label={`What ${kw.label.toLowerCase()} does`} />
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
                        background: "linear-gradient(180deg, #38BDF8 0%, #0EA5E9 100%)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(14,165,233,0.30)",
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

        {/* CITY CONTEXT */}
        <SectionGround variant="sky" size="md">
          <Container>
            <Reveal delay={0.08}><FloatingCard tier="3" depth="3" gloss className="mx-auto max-w-3xl p-8">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-600">{ind.name} in {cityRec.name}</p>
              <p className="mt-4 text-[15px] leading-[1.65] text-ink-soft">
                In {cityRec.name}, {ind.name.toLowerCase()} teams typically work leads from <strong className="text-ink font-semibold">{ind.channels.slice(0, 3).join(", ")}</strong> — with deal sizes in the <strong className="text-ink font-semibold">{ind.ticketBand}</strong> range and sales cycles of <strong className="text-ink font-semibold">{ind.salesCycle}</strong>. Leadkaun&apos;s {kw.label.toLowerCase()} is calibrated for those realities, not a generic US B2B default.
              </p>
            </FloatingCard></Reveal>
          </Container>
        </SectionGround>

        {/* FEATURE BRIDGE */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mb-10 max-w-3xl">
              <NumberedTag number="02" tone="warm" label="Why Leadkaun's approach is different" />
              <h2 className="mt-5 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[36px]">
                The features that power it.
              </h2>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-5 md:grid-cols-3 md:gap-6">
              {ind.relatedFeatures.slice(0, 3).map((fSlug, i) => {
                const pretty = fSlug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
                return (
                  <Link key={fSlug} href={`/features/${fSlug}`} className="block group">
                    <FloatingCard tier="2" depth="2" gloss interactive aura={i === 1 ? "peach" : "sky"} className="p-6 h-full">
                      <p className={`font-mono text-[10px] font-semibold uppercase tracking-[0.16em] ${i === 1 ? "text-orange-500" : "text-sky-600"}`}>Feature</p>
                      <p className="mt-3 text-[16px] font-semibold text-ink group-hover:text-sky-600 transition-colors">{pretty}</p>
                      <p className="mt-1 text-[13px] text-ink-soft">See how it works →</p>
                    </FloatingCard>
                  </Link>
                )
              })}
            </Reveal>
          </Container>
        </SectionGround>

        {/* FAQ */}
        <SectionGround variant="sky" size="md">
          <Container>
            <Reveal className="mx-auto mb-10 max-w-3xl text-center">
              <div className="flex justify-center"><NumberedTag number="03" label="FAQ" /></div>
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
                <NumberedTag number="04" tone="warm" label="Related" />
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

        <CTABanner />
        <Footer />
      </main>
    </>
  )
}
