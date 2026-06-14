import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, ArrowUpRight } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
import InternalLinksGrid from "@/app/components/internal-links-grid"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { DetailHero } from "@/app/components/detail-hero"
import { NumberedTag } from "@/app/components/numbered-tag"
import { FloatingCard } from "@/app/components/floating-card"
import { Faq } from "@/app/components/faq"
import { Reveal } from "@/app/components/reveal"

import { getIntegrations } from "@/lib/pseo/lookup"
import { breadcrumbListSchema, productSchema, faqPageSchema, jsonLdScript } from "@/lib/seo"

export const revalidate = 86400

type IntegrationEntry = {
  slug: string; name: string; partnerUrl: string | null; category: string
  tagline: string; description: string
  setupSteps: { heading: string; body: string }[]; useCases: string[]
  faqs: { q: string; a: string }[]; relatedIntegrations?: string[]; relatedFeatures?: string[]
  status: "live" | "roadmap" | "partner-driven"
}

export async function generateStaticParams() {
  const list = (await getIntegrations()) as IntegrationEntry[]
  return list.map((i) => ({ slug: i.slug }))
}

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const list = (await getIntegrations()) as IntegrationEntry[]
  const entry = list.find((i) => i.slug === slug)
  if (!entry) return {}
  return {
    title: `Leadkaun + ${entry.name} Integration | Setup & Use Cases`,
    description: entry.tagline.slice(0, 155),
    alternates: { canonical: `/integrations/${entry.slug}` },
  }
}

function statusBadge(s: IntegrationEntry["status"]) {
  if (s === "live") return (
    <span className="inline-flex items-center rounded-full px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white" style={{ background: "linear-gradient(180deg, #6EE7B7 0%, #34D399 100%)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(16,185,129,0.30)" }}>Live</span>
  )
  if (s === "partner-driven") return (
    <span className="inline-flex items-center rounded-full px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white" style={{ background: "linear-gradient(180deg, #38BDF8 0%, #0EA5E9 100%)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(14,165,233,0.30)" }}>Partner-driven</span>
  )
  return <span className="inline-flex items-center rounded-full glass-1 gloss-edge px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">On roadmap</span>
}

function prettyFeature(slug: string) {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
}

export default async function IntegrationPage({ params }: Params) {
  const { slug } = await params
  const list = (await getIntegrations()) as IntegrationEntry[]
  const entry = list.find((i) => i.slug === slug)
  if (!entry) notFound()

  const related = (entry.relatedIntegrations ?? [])
    .map((s) => list.find((i) => i.slug === s))
    .filter((e): e is IntegrationEntry => e !== undefined)
    .slice(0, 4)

  const schemas = [
    breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "Integrations", url: "/integrations" }, { name: entry.name }]),
    productSchema({ name: `Leadkaun × ${entry.name}`, description: entry.tagline, url: `/integrations/${entry.slug}` }),
    faqPageSchema(entry.faqs),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(schemas) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        <DetailHero
          breadcrumb={[{ label: "Integrations", href: "/integrations" }, { label: entry.category.replace(/-/g, " ") }]}
          eyebrow="Integration"
          badges={statusBadge(entry.status)}
          h1={<>Leadkaun <span className="text-ink-muted">×</span> {entry.name}</>}
          sub={entry.tagline}
          cta={entry.partnerUrl ? (
            <a href={entry.partnerUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-sky-600 hover:underline underline-offset-4">
              Visit {entry.name} <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          ) : undefined}
        />

        {/* DESCRIPTION */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mx-auto max-w-3xl">
              <NumberedTag number="01" tone="warm" label="How it works" />
              <h2 className="mt-5 text-[28px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[32px]">
                What the integration does.
              </h2>
              <div className="prose prose-leadkaun mt-8 max-w-none">
                {entry.description.split("\n\n").map((para, i) => <p key={i}>{para}</p>)}
              </div>
            </Reveal>
          </Container>
        </SectionGround>

        {/* SETUP */}
        <SectionGround variant="sky" size="md">
          <Container>
            <Reveal className="mx-auto max-w-3xl">
              <NumberedTag number="02" label="Setup" />
              <h2 className="mt-5 text-[26px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[30px]">
                {entry.setupSteps.length} steps.
              </h2>

              <ol className="mt-8 space-y-5">
                {entry.setupSteps.map((step, i) => (
                  <FloatingCard key={i} as="li" tier="2" depth="2" gloss aura={i % 3 === 1 ? "peach" : "sky"} className="p-6">
                    <div className="flex items-start gap-5">
                      <span
                        className="shrink-0 inline-flex h-11 w-11 items-center justify-center rounded-2xl font-mono text-[14px] font-bold text-white"
                        style={{
                          background: i % 3 === 1 ? "linear-gradient(180deg, #FDBA74 0%, #FB923C 100%)" : "linear-gradient(180deg, #38BDF8 0%, #0EA5E9 100%)",
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 4px 10px rgba(14,165,233,0.30)",
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="text-[17px] font-semibold leading-[1.3] tracking-[-0.015em] text-ink">{step.heading}</h3>
                        <p className="mt-2 text-[14px] leading-[1.65] text-ink-soft">{step.body}</p>
                      </div>
                    </div>
                  </FloatingCard>
                ))}
              </ol>
            </Reveal>
          </Container>
        </SectionGround>

        {/* USE CASES */}
        <SectionGround variant="cream" size="md">
          <Container>
            <Reveal className="mx-auto max-w-3xl">
              <NumberedTag number="03" tone="warm" label="Use cases" />
              <h2 className="mt-5 text-[26px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[30px]">
                What teams actually do with it.
              </h2>
              <FloatingCard tier="3" depth="3" gloss className="mt-8 overflow-hidden">
                <ul className="divide-y" style={{ borderColor: "var(--hairline)" }}>
                  {entry.useCases.map((uc, i) => (
                    <li key={i} className="flex items-start gap-5 px-7 py-5 md:px-8">
                      <span
                        className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-xl font-mono text-[13px] font-bold text-white"
                        style={{
                          background: "linear-gradient(180deg, #38BDF8 0%, #0EA5E9 100%)",
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(14,165,233,0.30)",
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="text-[15px] leading-[1.65] text-ink">{uc}</p>
                    </li>
                  ))}
                </ul>
              </FloatingCard>
            </Reveal>
          </Container>
        </SectionGround>

        {/* RELATED FEATURES */}
        {entry.relatedFeatures && entry.relatedFeatures.length > 0 && (
          <SectionGround variant="sky" size="md">
            <Container>
              <Reveal className="mx-auto max-w-3xl">
                <NumberedTag number="04" label="In the product" />
                <h2 className="mt-5 text-[24px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink md:text-[28px]">
                  Which Leadkaun features it powers.
                </h2>
                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  {entry.relatedFeatures.map((f) => (
                    <Link key={f} href={`/features/${f}`} className="group flex items-center justify-between gap-4 rounded-2xl px-5 py-4 glass-2 gloss-edge elevate-1 lift aura-sky-hover transition-all">
                      <div className="min-w-0">
                        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-600">Feature</p>
                        <p className="mt-2 text-[15px] font-semibold text-ink group-hover:text-sky-600 transition-colors">{prettyFeature(f)}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-ink-muted transition-all group-hover:text-sky-500 group-hover:translate-x-0.5" strokeWidth={1.75} />
                    </Link>
                  ))}
                </div>
              </Reveal>
            </Container>
          </SectionGround>
        )}

        {/* FAQ */}
        {entry.faqs.length > 0 && (
          <SectionGround variant="cream" size="md">
            <Container>
              <Reveal className="mx-auto max-w-3xl">
                <NumberedTag number="05" tone="warm" label="FAQ" />
                <h2 className="mt-5 text-[28px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[32px]">
                  Common questions.
                </h2>
                <div className="mt-8"><Faq items={entry.faqs} /></div>
              </Reveal>
            </Container>
          </SectionGround>
        )}

        {/* RELATED */}
        {related.length > 0 && (
          <SectionGround variant="sky" size="md">
            <Container>
              <Reveal className="mb-8">
                <NumberedTag number="06" label="Other integrations" />
                <h2 className="mt-5 max-w-3xl text-[24px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink md:text-[28px]">
                  Related to {entry.name}.
                </h2>
              </Reveal>
              <Reveal delay={0.08} className="grid gap-4 md:grid-cols-2">
                {related.map((r) => (
                  <Link key={r.slug} href={`/integrations/${r.slug}`} className="group rounded-2xl p-5 glass-2 gloss-edge elevate-1 lift aura-sky-hover transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-[15px] font-semibold text-ink group-hover:text-sky-600 transition-colors">{r.name}</p>
                      {statusBadge(r.status)}
                    </div>
                    <p className="mt-2 line-clamp-2 text-[13px] leading-[1.55] text-ink-soft">{r.tagline}</p>
                  </Link>
                ))}
              </Reveal>
            </Container>
          </SectionGround>
        )}

        <CTABanner
          tag={{ number: "→", label: "Plug it in" }}
          headline={`Ship Leadkaun with ${entry.name}.`}
          sub="Setup takes 60 minutes. 14-day trial. No credit card. Connect your stack and watch behaviour show up by Friday."
        />
        <InternalLinksGrid />
        <Footer />
      </main>
    </>
  )
}
