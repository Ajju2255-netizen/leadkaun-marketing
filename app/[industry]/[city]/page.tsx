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
import { TestimonialCard } from "@/app/components/testimonial-card"
import { Faq } from "@/app/components/faq"
import { Reveal } from "@/app/components/reveal"

import { getIndustry, getCity, resolveCitySlug } from "@/lib/pseo/lookup"
import { tier0Cities, tier0Industries } from "@/lib/pseo/tier0"
import { relatedForIndustryCity } from "@/lib/pseo/related"
import { breadcrumbListSchema, faqPageSchema, localBusinessSchema, placeSchema, jsonLdScript } from "@/lib/seo"
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
  return {
    title: `${ind.name} CRM & Lead Management in ${cityRec.name} — Leadkaun`,
    description: `${cityRec.name} ${ind.name.toLowerCase()} teams use Leadkaun to grade every lead A–F, build a Priority Queue, and surface missed ₹ at risk. Setup in 60 minutes.`,
    alternates: { canonical: `/${industry}/${canonicalCity}` },
  }
}

export default async function IndustryCityPage({ params }: Params) {
  const { industry, city } = await params
  const [ind, cityRec] = await Promise.all([getIndustry(industry), getCity(city)])
  if (!ind || !cityRec) notFound()

  const related = await relatedForIndustryCity(industry, cityRec.slug)
  const faqs = ind.faqs.slice(0, 4)

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
          h1={<>{ind.name} Lead Management in <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(95deg, #0EA5E9 0%, #FB923C 100%)" }}>{cityRec.name}.</span></>}
          sub={`${cityRec.name}-based ${ind.name.toLowerCase()} teams use Leadkaun to grade every lead A–F, build each rep's Priority Queue, and surface missed revenue in rupees. Setup in 60 minutes.`}
          cta={
            <>
              <GlossLink variant="primary" size="md" href={APP_URLS.register}>
                Start free trial
                <span className="font-mono opacity-80">→</span>
              </GlossLink>
              <Link href="/demo" className="group inline-flex items-center gap-1.5 text-[14px] font-semibold text-sky-600 hover:text-sky-500">
                Book a 15-min demo →
              </Link>
            </>
          }
        />

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
              <NumberedTag number="01" label={`Why ${cityRec.name} ${ind.name.toLowerCase()} teams lose deals`} />
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
                      background: i === 1 ? "linear-gradient(180deg, #FDBA74 0%, #FB923C 100%)" : "linear-gradient(180deg, #38BDF8 0%, #0EA5E9 100%)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 4px 12px rgba(14,165,233,0.30)",
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
              <NumberedTag number="02" tone="warm" label={`How Leadkaun helps ${ind.name.toLowerCase()} teams in ${cityRec.name}`} />
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
                        background: "linear-gradient(180deg, #38BDF8 0%, #0EA5E9 100%)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(14,165,233,0.30)",
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
                <span className="font-semibold text-ink">{cityRec.name}</span> is a Tier-{cityRec.tier} city in {cityRec.state} with an urban population of ~{(cityRec.population / 1000000).toFixed(1)}M. {cityRec.notes ? `${cityRec.notes}. ` : ""}{ind.name.toLowerCase()} teams here typically source leads from {ind.channels.slice(0, 3).join(", ")} — all of which flow into Leadkaun via Google Sheets sync, CSV upload, or manual entry in under 10 minutes.
              </p>
            </FloatingCard></Reveal>
          </Container>
        </SectionGround>

        {/* TESTIMONIAL */}
        {ind.proofQuote && (
          <SectionGround variant="cream" size="md">
            <Container>
              <Reveal className="mx-auto max-w-3xl">
                <TestimonialCard quote={ind.proofQuote.text} name={ind.proofQuote.name} role={ind.proofQuote.role} city={ind.proofQuote.city} />
              </Reveal>
            </Container>
          </SectionGround>
        )}

        {/* FAQ */}
        <SectionGround variant="sky" size="md">
          <Container>
            <Reveal className="mx-auto mb-10 max-w-3xl text-center">
              <div className="flex justify-center"><NumberedTag number="03" label="FAQ" /></div>
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
                <NumberedTag number="04" tone="warm" label="Related" />
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

        <CTABanner />
        <Footer />
      </main>
    </>
  )
}
