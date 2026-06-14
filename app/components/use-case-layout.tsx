import Link from "next/link"
import { LucideIcon, ArrowRight } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { GradientBlob } from "@/app/components/gradient-blob"
import { PageHero } from "@/app/components/page-hero"
import { NumberedTag } from "@/app/components/numbered-tag"
import { FloatingCard } from "@/app/components/floating-card"
import { Reveal } from "@/app/components/reveal"
import { TestimonialCard } from "@/app/components/testimonial-card"
import { Faq } from "@/app/components/faq"
import { ProductShowcase, ModulesGrid, PricingCTA } from "@/app/components/sell/blocks"
import { faqPageSchema, jsonLdScript } from "@/lib/seo"
import { APP_URLS } from "@/lib/urls"

type Pain = { title: string; body: string }
type Testimonial = { quote: string; name: string; role: string; city: string }
type FaqItem = { q: string; a: string }
type RelatedCity = { city: string; href: string }

type Props = {
  industryLabel: string
  icon?: LucideIcon
  h1: string
  subhead: string
  pains: Pain[]
  helps: string[]
  ticketBand: string
  salesCycle: string
  channels: string[]
  testimonial: Testimonial
  faqs: FaqItem[]
  relatedCities?: RelatedCity[]
  relatedFeature?: { label: string; href: string }
}

export function UseCaseLayout({
  industryLabel, icon: Icon, h1, subhead, pains, helps, ticketBand, salesCycle, channels,
  testimonial, faqs, relatedCities = [], relatedFeature,
}: Props) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(faqPageSchema(faqs)) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        <PageHero
          eyebrow={
            <>
              {Icon && <Icon className="h-3 w-3" strokeWidth={2} />}
              <span>Use Case · {industryLabel}</span>
            </>
          }
          h1={h1}
          sub={subhead}
          primary={{ kind: "primary", label: "Start free trial", href: APP_URLS.register, external: true }}
          secondary={{ kind: "text", label: "Book a demo", href: "/demo" }}
        />

        {/* CONTEXT — 3 stat tiles in glass */}
        <SectionGround variant="cream" size="sm">
          <Container>
            <Reveal className="grid gap-4 md:grid-cols-3">
              <FloatingCard tier="2" depth="2" gloss className="p-7" aura="sky">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-600">Typical deal size</p>
                <p className="mt-2 font-mono text-[24px] font-semibold tracking-[-0.02em] text-ink tabular">{ticketBand}</p>
              </FloatingCard>
              <FloatingCard tier="2" depth="2" gloss className="p-7" aura="sky">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-600">Sales cycle</p>
                <p className="mt-2 font-mono text-[24px] font-semibold tracking-[-0.02em] text-ink tabular">{salesCycle}</p>
              </FloatingCard>
              <FloatingCard tier="2" depth="2" gloss className="p-7" aura="peach">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-orange-500">Primary lead sources</p>
                <p className="mt-2 text-[14px] leading-[1.5] text-ink">{channels.join(" · ")}</p>
              </FloatingCard>
            </Reveal>
          </Container>
        </SectionGround>

        {/* PAINS */}
        <SectionGround variant="sky" size="lg">
          <Container>
            <Reveal className="mb-12 md:mb-16 max-w-3xl">
              <NumberedTag number="01" label={`Why ${industryLabel.toLowerCase()} teams lose deals`} />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Three patterns we see every week.
              </h2>
            </Reveal>

            <Reveal delay={0.08} className="grid gap-5 md:grid-cols-3 md:gap-6">
              {pains.map((p, i) => (
                <FloatingCard
                  key={i}
                  tier="2"
                  depth="2"
                  gloss
                  aura={i === 1 ? "peach" : "sky"}
                  className="p-7"
                >
                  <span
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl font-mono text-[16px] font-bold text-white"
                    style={{
                      background: i === 1
                        ? "linear-gradient(180deg, #FDBA74 0%, #FB923C 100%)"
                        : "linear-gradient(180deg, #38BDF8 0%, #0EA5E9 100%)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 4px 12px rgba(14,165,233,0.30)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-5 text-[18px] font-semibold text-ink tracking-[-0.01em] leading-[1.3]">{p.title}</h3>
                  <p className="mt-3 text-[14px] leading-[1.6] text-ink-soft">{p.body}</p>
                </FloatingCard>
              ))}
            </Reveal>
          </Container>
        </SectionGround>

        {/* HOW IT HELPS — glass-list */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mb-12 md:mb-16 max-w-3xl">
              <NumberedTag number="02" tone="warm" label={`How Leadkaun helps ${industryLabel.toLowerCase()} teams`} />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                What we configure on day one.
              </h2>
            </Reveal>

            <Reveal delay={0.08}><FloatingCard tier="3" depth="3" gloss className="overflow-hidden">
              <ol className="divide-y" style={{ borderColor: "var(--hairline)" }}>
                {helps.map((h, i) => (
                  <li key={i} className="flex items-start gap-6 px-7 py-6 md:px-8 md:py-7">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-mono text-[13px] font-bold text-white"
                      style={{
                        background: "linear-gradient(180deg, #38BDF8 0%, #0EA5E9 100%)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(14,165,233,0.25)",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[16px] md:text-[17px] leading-[1.55] text-ink">{h}</p>
                  </li>
                ))}
              </ol>
            </FloatingCard></Reveal>
          </Container>
        </SectionGround>

        {/* TESTIMONIAL */}
        <SectionGround variant="sky" size="md">
          <Container>
            <Reveal className="mx-auto max-w-3xl">
              <TestimonialCard {...testimonial} />
            </Reveal>
          </Container>
        </SectionGround>

        {/* PRODUCT — show + sell the product, same bar as the landing page */}
        <ProductShowcase
          number="03"
          ground="cream"
          title={<>See Leadkaun work for {industryLabel.toLowerCase()} teams.</>}
          sub={`Every lead graded A–F, a live Priority Queue per rep, and the ₹ at risk surfaced in real rupees — the screen your ${industryLabel.toLowerCase()} team opens every morning.`}
        />
        <ModulesGrid number="04" ground="sky" />
        <PricingCTA number="05" ground="cream" />

        {/* FAQ */}
        <SectionGround variant="sky" size="md">
          <Container>
            <Reveal className="mx-auto mb-10 max-w-3xl text-center">
              <div className="flex justify-center"><NumberedTag number="06" tone="warm" label="FAQ" /></div>
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">
                Questions we hear most.
              </h2>
            </Reveal>
            <Reveal delay={0.08}><Faq items={faqs} /></Reveal>
          </Container>
        </SectionGround>

        {/* RELATED CITIES */}
        {relatedCities.length > 0 && (
          <SectionGround variant="cream" size="md">
            <Container>
              <Reveal className="mb-8">
                <NumberedTag number="07" label={`${industryLabel} by city`} />
                <h2 className="mt-5 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[32px]">
                  Localised pages for top markets.
                </h2>
              </Reveal>
              <div className="flex flex-wrap gap-2.5">
                {relatedCities.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    className="inline-flex items-center rounded-full glass-1 gloss-edge px-4 py-2 text-[13px] font-medium text-ink-soft transition-all hover:text-sky-600 lift"
                  >
                    {c.city}
                  </Link>
                ))}
              </div>
              {relatedFeature && (
                <div className="mt-8">
                  <Link href={relatedFeature.href} className="group inline-flex items-center gap-1.5 text-[14px] font-semibold text-sky-600 hover:text-sky-500">
                    {relatedFeature.label}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              )}
            </Container>
          </SectionGround>
        )}

        <CTABanner />
        <Footer />
      </main>
    </>
  )
}
