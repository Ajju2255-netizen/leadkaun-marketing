import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Check, X } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { DetailHero } from "@/app/components/detail-hero"
import { NumberedTag } from "@/app/components/numbered-tag"
import { FloatingCard } from "@/app/components/floating-card"
import { Faq } from "@/app/components/faq"
import { Reveal } from "@/app/components/reveal"

import { getHowTo } from "@/lib/pseo/lookup"
import { breadcrumbListSchema, howToSchema, faqPageSchema, jsonLdScript } from "@/lib/seo"

export const revalidate = 604800

type Step = { heading: string; body: string; image?: string }
type HowToEntry = {
  slug: string; title: string; tldr: string; why: string
  prerequisites: string[]; steps: Step[]; commonMistakes?: string[]
  faqs: { q: string; a: string }[]; category: string
  relatedFeatures?: string[]; relatedBlog?: string | null; timeRequired?: string
}

export async function generateStaticParams() {
  const list = (await getHowTo()) as HowToEntry[]
  return list.map((h) => ({ slug: h.slug }))
}

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const list = (await getHowTo()) as HowToEntry[]
  const h = list.find((x) => x.slug === slug)
  if (!h) return {}
  return {
    title: `${h.title} | Leadkaun`,
    description: h.tldr.slice(0, 155),
    alternates: { canonical: `/how-to/${h.slug}` },
  }
}

export default async function HowToPage({ params }: Params) {
  const { slug } = await params
  const list = (await getHowTo()) as HowToEntry[]
  const h = list.find((x) => x.slug === slug)
  if (!h) notFound()

  const related = list.filter((x) => x.slug !== h.slug && x.category === h.category).slice(0, 3)

  const schemas = [
    breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "How to", url: "/how-to" }, { name: h.title }]),
    howToSchema({ name: h.title, description: h.tldr, totalTime: h.timeRequired, steps: h.steps.map((s) => ({ name: s.heading, text: s.body })) }),
    faqPageSchema(h.faqs),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(schemas) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        <DetailHero
          breadcrumb={[{ label: "How to", href: "/how-to" }, { label: h.category.replace(/-/g, " ") }]}
          eyebrow={`Playbook${h.timeRequired ? ` · ${h.timeRequired}` : ""}`}
          h1={h.title}
          tldr={{ label: "TL;DR", body: h.tldr, tone: "sky" }}
        />

        {/* WHY */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mx-auto max-w-3xl">
              <NumberedTag number="01" tone="warm" label="Why this matters" />
              <h2 className="mt-5 text-[28px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[32px]">
                The bet behind the playbook.
              </h2>
              <p className="mt-6 text-[16px] leading-[1.65] text-ink-soft md:text-[17px]">{h.why}</p>
            </Reveal>
          </Container>
        </SectionGround>

        {/* PREREQUISITES */}
        {h.prerequisites.length > 0 && (
          <SectionGround variant="sky" size="md">
            <Container>
              <Reveal className="mx-auto max-w-3xl">
                <NumberedTag number="02" label="What you need first" />
                <h2 className="mt-5 text-[26px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[30px]">
                  Gather these before you start.
                </h2>
                <FloatingCard tier="3" depth="3" gloss className="mt-8 overflow-hidden">
                  <ul className="divide-y" style={{ borderColor: "var(--hairline)" }}>
                    {h.prerequisites.map((p, i) => (
                      <li key={i} className="flex items-start gap-4 px-7 py-4 md:px-8">
                        <span
                          className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                          style={{
                            background: "linear-gradient(180deg, #6EE7B7 0%, #34D399 100%)",
                            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), 0 1px 3px rgba(16,185,129,0.30)",
                          }}
                        >
                          <Check className="h-3 w-3 text-white" strokeWidth={3} />
                        </span>
                        <span className="text-[15px] leading-[1.6] text-ink">{p}</span>
                      </li>
                    ))}
                  </ul>
                </FloatingCard>
              </Reveal>
            </Container>
          </SectionGround>
        )}

        {/* STEPS */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mx-auto max-w-3xl">
              <NumberedTag number="03" tone="warm" label="The steps" />
              <h2 className="mt-5 text-[28px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[32px]">
                Run it in order.
              </h2>

              <ol className="mt-10 space-y-5">
                {h.steps.map((s, i) => (
                  <FloatingCard key={i} as="li" tier="2" depth="2" gloss aura={i % 3 === 1 ? "peach" : "sky"} className="p-6 md:p-7">
                    <div className="flex items-start gap-5">
                      <span
                        className="shrink-0 inline-flex h-12 w-12 items-center justify-center rounded-2xl font-mono text-[15px] font-bold text-white"
                        style={{
                          background: i % 3 === 1 ? "linear-gradient(180deg, #FDBA74 0%, #FB923C 100%)" : "linear-gradient(180deg, #38BDF8 0%, #0EA5E9 100%)",
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 4px 12px rgba(14,165,233,0.30)",
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="text-[18px] font-semibold leading-[1.3] tracking-[-0.015em] text-ink md:text-[20px]">{s.heading}</h3>
                        <p className="mt-3 text-[15px] leading-[1.65] text-ink-soft md:text-[16px]">{s.body}</p>
                      </div>
                    </div>
                  </FloatingCard>
                ))}
              </ol>
            </Reveal>
          </Container>
        </SectionGround>

        {/* MISTAKES */}
        {h.commonMistakes && h.commonMistakes.length > 0 && (
          <SectionGround variant="sky" size="md">
            <Container>
              <Reveal className="mx-auto max-w-3xl">
                <NumberedTag number="04" label="Mistakes to avoid" />
                <h2 className="mt-5 text-[26px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[30px]">
                  Where teams usually slip.
                </h2>
                <FloatingCard tier="3" depth="3" gloss className="mt-8 overflow-hidden">
                  <ul className="divide-y" style={{ borderColor: "var(--hairline)" }}>
                    {h.commonMistakes.map((m, i) => (
                      <li key={i} className="flex items-start gap-4 px-7 py-4 md:px-8">
                        <span
                          className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                          style={{ background: "rgba(239,68,68,0.12)" }}
                        >
                          <X className="h-3 w-3 text-red-500" strokeWidth={3} />
                        </span>
                        <span className="text-[15px] leading-[1.6] text-ink">{m}</span>
                      </li>
                    ))}
                  </ul>
                </FloatingCard>
              </Reveal>
            </Container>
          </SectionGround>
        )}

        {/* FAQ */}
        {h.faqs.length > 0 && (
          <SectionGround variant="cream" size="md">
            <Container>
              <Reveal className="mx-auto max-w-3xl">
                <NumberedTag number="05" tone="warm" label="FAQ" />
                <h2 className="mt-5 text-[28px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[32px]">
                  Questions teams ask mid-rollout.
                </h2>
                <div className="mt-8"><Faq items={h.faqs} /></div>
              </Reveal>
            </Container>
          </SectionGround>
        )}

        {/* RELATED */}
        {related.length > 0 && (
          <SectionGround variant="sky" size="md">
            <Container>
              <Reveal className="mb-8">
                <NumberedTag number="06" label="Related guides" />
                <h2 className="mt-5 max-w-3xl text-[24px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink md:text-[28px]">
                  Keep rolling.
                </h2>
              </Reveal>
              <Reveal delay={0.08} className="grid gap-4 md:grid-cols-3">
                {related.map((r) => (
                  <Link key={r.slug} href={`/how-to/${r.slug}`} className="group rounded-2xl p-5 glass-2 gloss-edge elevate-1 lift aura-sky-hover transition-all">
                    <p className="text-[15px] font-semibold leading-[1.35] tracking-[-0.01em] text-ink group-hover:text-sky-600 transition-colors">{r.title}</p>
                    <p className="mt-2 line-clamp-2 text-[13px] leading-[1.55] text-ink-soft">{r.tldr}</p>
                  </Link>
                ))}
              </Reveal>
            </Container>
          </SectionGround>
        )}

        <CTABanner
          tag={{ number: "→", label: "From playbook to automation" }}
          headline="Want this running automatically?"
          sub="Leadkaun automates the workflow above in 60 minutes — no spreadsheet maintenance, no manual updates, no ops overhead."
        />
        <Footer />
      </main>
    </>
  )
}
