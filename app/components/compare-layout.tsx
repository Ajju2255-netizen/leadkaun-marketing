import { Check, X, Minus } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
import InternalLinksGrid from "@/app/components/internal-links-grid"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { PageHero } from "@/app/components/page-hero"
import { NumberedTag } from "@/app/components/numbered-tag"
import { FloatingCard } from "@/app/components/floating-card"
import { Reveal } from "@/app/components/reveal"
import { Faq } from "@/app/components/faq"
import { faqPageSchema, jsonLdScript } from "@/lib/seo"
import { APP_URLS } from "@/lib/urls"

type Cell = boolean | string | "neutral"
type FeatureRow = { label: string; leadkaun: Cell; competitor: Cell }
type FaqItem = { q: string; a: string }

export type CompareProps = {
  competitor: string
  competitorShort?: string
  tldr: string
  positioning: string
  strengths: string[]
  weaknesses: string[]
  features: FeatureRow[]
  pricing: {
    leadkaun:    { tier: string; price: string; note?: string }
    competitor:  { tier: string; price: string; note?: string }
  }
  switching: { title: string; body: string }[]
  faqs: FaqItem[]
}

function MintCheck() {
  return (
    <span
      className="inline-flex h-5 w-5 items-center justify-center rounded-full"
      style={{
        background: "linear-gradient(180deg, #6EE7B7 0%, #34D399 100%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), 0 1px 3px rgba(16,185,129,0.30)",
      }}
    >
      <Check className="h-3 w-3 text-white" strokeWidth={3} />
    </span>
  )
}

function MutedX() {
  return (
    <span
      className="inline-flex h-5 w-5 items-center justify-center rounded-full"
      style={{ background: "rgba(15,23,42,0.06)" }}
    >
      <X className="h-3 w-3 text-ink-muted" strokeWidth={2.5} />
    </span>
  )
}

function Indicator({ v }: { v: Cell }) {
  if (v === true)  return <MintCheck />
  if (v === false) return <MutedX />
  if (v === "neutral") return <Minus className="h-4 w-4 text-ink-muted" strokeWidth={2} />
  return <span className="font-mono text-[13px] font-semibold text-ink tabular">{v}</span>
}

export function ComparePageLayout(p: CompareProps) {
  const short = p.competitorShort ?? p.competitor

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(faqPageSchema(p.faqs)) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        <PageHero
          eyebrow="Comparison"
          h1={
            <>
              Leadkaun{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(95deg, #0EA5E9 0%, #FB923C 100%)" }}
              >
                vs {short}
              </span>
            </>
          }
          sub={p.tldr}
          primary={{ kind: "primary", label: "Start free trial", href: APP_URLS.register, external: true }}
          secondary={{ kind: "text", label: "See all comparisons", href: "/compare" }}
        />

        {/* TL;DR + POSITIONING */}
        <SectionGround variant="cream" size="md">
          <Container>
            <Reveal className="grid gap-5 md:grid-cols-[1.5fr_1fr] md:gap-6">
              <FloatingCard tier="2" depth="2" gloss className="p-8 md:p-10">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Positioning</p>
                <p className="mt-4 text-[17px] leading-[1.6] text-ink-soft">{p.positioning}</p>

                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  <div>
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-mint-500">Where {short} is strong</p>
                    <ul className="mt-3 space-y-2.5">
                      {p.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-[14px] leading-[1.55] text-ink-soft">
                          <span className="mt-0.5"><MintCheck /></span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-orange-500">Where it falls short for Indian SMBs</p>
                    <ul className="mt-3 space-y-2.5">
                      {p.weaknesses.map((s, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-[14px] leading-[1.55] text-ink-soft">
                          <span className="mt-0.5"><MutedX /></span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </FloatingCard>

              <FloatingCard tier="3" depth="3" gloss className="p-8 md:p-10 aura-sky-hover">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-600">Leadkaun at a glance</p>
                <p className="mt-4 text-[17px] leading-[1.5] text-ink">
                  India&apos;s first Sales Behaviour OS. Grades every lead A–F, builds the Priority Queue, surfaces ₹ at risk — built specifically for Indian B2B SMBs.
                </p>
                <ul className="mt-5 space-y-2.5 text-[14px] leading-[1.55] text-ink-soft">
                  <li className="flex items-center gap-2.5"><MintCheck /> 60-minute setup</li>
                  <li className="flex items-center gap-2.5"><MintCheck /> 3-tap WhatsApp logging</li>
                  <li className="flex items-center gap-2.5"><MintCheck /> ₹-at-risk surfaced daily</li>
                  <li className="flex items-center gap-2.5"><MintCheck /> INR pricing</li>
                </ul>
              </FloatingCard>
            </Reveal>
          </Container>
        </SectionGround>

        {/* FEATURE MATRIX */}
        <SectionGround variant="sky" size="lg">
          <Container>
            <Reveal className="mb-12 md:mb-16 max-w-3xl">
              <NumberedTag number="01" label="Feature comparison" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Feature-by-feature.
              </h2>
            </Reveal>

            <Reveal delay={0.08}><FloatingCard tier="3" depth="3" gloss className="overflow-hidden">
              <div
                className="grid grid-cols-[1.6fr_1fr_1fr]"
                style={{ borderBottom: "1px solid var(--hairline-strong)" }}
              >
                <div className="px-6 py-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Feature</div>
                <div
                  className="px-6 py-4 text-center text-[12px] font-bold uppercase tracking-[0.14em] text-sky-600"
                  style={{
                    background: "linear-gradient(180deg, rgba(186,230,253,0.30) 0%, transparent 100%)",
                  }}
                >
                  Leadkaun
                </div>
                <div className="px-6 py-4 text-center text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-muted">{short}</div>
              </div>
              <div className="divide-y" style={{ borderColor: "var(--hairline)" }}>
                {p.features.map((row, i) => (
                  <div key={i} className="grid grid-cols-[1.6fr_1fr_1fr] hover:bg-sky-50/40 transition-colors">
                    <div className="px-6 py-4 text-[14px] text-ink">{row.label}</div>
                    <div
                      className="flex items-center justify-center px-6 py-4"
                      style={{
                        background: "linear-gradient(90deg, rgba(186,230,253,0.18) 0%, rgba(186,230,253,0.04) 100%)",
                      }}
                    >
                      <Indicator v={row.leadkaun} />
                    </div>
                    <div className="flex items-center justify-center px-6 py-4"><Indicator v={row.competitor} /></div>
                  </div>
                ))}
              </div>
            </FloatingCard></Reveal>
          </Container>
        </SectionGround>

        {/* PRICING */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mb-12 md:mb-16 max-w-3xl">
              <NumberedTag number="02" tone="warm" label="Pricing comparison" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Real numbers, not teaser rates.
              </h2>
            </Reveal>

            <Reveal delay={0.08} className="grid gap-5 md:grid-cols-2 md:gap-6">
              <FloatingCard tier="3" depth="3" gloss className="p-8 md:p-10 aura-sky-hover">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-600">Leadkaun {p.pricing.leadkaun.tier}</p>
                <p className="mt-4 font-mono text-[44px] font-semibold tracking-[-0.03em] text-ink tabular">{p.pricing.leadkaun.price}</p>
                {p.pricing.leadkaun.note && <p className="mt-2 text-[13px] text-ink-soft">{p.pricing.leadkaun.note}</p>}
              </FloatingCard>
              <FloatingCard tier="2" depth="2" gloss className="p-8 md:p-10">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">{short} {p.pricing.competitor.tier}</p>
                <p className="mt-4 font-mono text-[44px] font-semibold tracking-[-0.03em] text-ink tabular">{p.pricing.competitor.price}</p>
                {p.pricing.competitor.note && <p className="mt-2 text-[13px] text-ink-soft">{p.pricing.competitor.note}</p>}
              </FloatingCard>
            </Reveal>
          </Container>
        </SectionGround>

        {/* SWITCHING */}
        <SectionGround variant="sky" size="lg">
          <Container>
            <Reveal className="mb-12 md:mb-16 max-w-3xl">
              <NumberedTag number="03" label="Switching guide" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                How teams switch cleanly.
              </h2>
            </Reveal>

            <Reveal delay={0.08}><ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {p.switching.map((s, i) => (
                <FloatingCard key={i} as="li" tier="2" depth="2" gloss aura="sky" className="p-6 md:p-7">
                  <span
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl font-mono text-[14px] font-bold text-white"
                    style={{
                      background: "linear-gradient(180deg, #38BDF8 0%, #0EA5E9 100%)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 4px 10px rgba(14,165,233,0.30)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-5 text-[17px] font-semibold text-ink tracking-[-0.01em]">{s.title}</h3>
                  <p className="mt-2 text-[14px] leading-[1.55] text-ink-soft">{s.body}</p>
                </FloatingCard>
              ))}
            </ol></Reveal>
          </Container>
        </SectionGround>

        {/* FAQ */}
        <SectionGround variant="cream" size="md">
          <Container>
            <Reveal className="mx-auto mb-10 max-w-3xl text-center">
              <div className="flex justify-center"><NumberedTag number="04" tone="warm" label="FAQ" /></div>
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">
                Switching from {short}.
              </h2>
            </Reveal>
            <Reveal delay={0.08}><Faq items={p.faqs} /></Reveal>
          </Container>
        </SectionGround>

        <CTABanner
          tag={{ number: "05", label: "Ready when you are" }}
          headline={`Try Leadkaun alongside ${short} for 14 days.`}
          sub="Import a CSV. Run both in parallel. Measure ₹ recovered. Decide at day 60."
        />

        <InternalLinksGrid />
        <Footer />
      </main>
    </>
  )
}
