import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowUpRight } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { DetailHero } from "@/app/components/detail-hero"
import { NumberedTag } from "@/app/components/numbered-tag"
import { FloatingCard } from "@/app/components/floating-card"
import { Reveal } from "@/app/components/reveal"

import { getGlossary } from "@/lib/pseo/lookup"
import { breadcrumbListSchema, definedTermSchema, jsonLdScript } from "@/lib/seo"

export const revalidate = 604800

type GlossaryEntry = {
  slug: string; term: string; definitionShort: string; definitionLong: string
  examples?: string[]; relatedTerms?: string[]; relatedFeature?: string | null; category?: string
}

export async function generateStaticParams() {
  const list = (await getGlossary()) as GlossaryEntry[]
  return list.map((g) => ({ term: g.slug }))
}

type Params = { params: Promise<{ term: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { term } = await params
  const list = (await getGlossary()) as GlossaryEntry[]
  const entry = list.find((g) => g.slug === term)
  if (!entry) return {}
  return {
    title: `${entry.term} — Definition & Use in Indian B2B Sales | Leadkaun`,
    description: entry.definitionShort.slice(0, 155),
    alternates: { canonical: `/glossary/${entry.slug}` },
  }
}

function prettyFeature(slug: string) {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
}

export default async function GlossaryTermPage({ params }: Params) {
  const { term } = await params
  const list = (await getGlossary()) as GlossaryEntry[]
  const entry = list.find((g) => g.slug === term)
  if (!entry) notFound()

  const related = (entry.relatedTerms ?? [])
    .map((t) => list.find((g) => g.slug === t))
    .filter((e): e is GlossaryEntry => e !== undefined)
    .slice(0, 6)

  const schemas = [
    breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "Glossary", url: "/glossary" }, { name: entry.term }]),
    definedTermSchema({ term: entry.term, definition: entry.definitionShort }),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(schemas) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        <DetailHero
          breadcrumb={[{ label: "Glossary", href: "/glossary" }, { label: entry.term }]}
          eyebrow="Definition"
          h1={entry.term}
          tldr={{ label: "Short definition", body: entry.definitionShort, tone: "sky" }}
        />

        {/* LONG DEFINITION */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mx-auto max-w-3xl">
              <NumberedTag number="01" tone="warm" label="In practice" />
              <h2 className="mt-5 text-[28px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[32px]">
                How teams actually use it.
              </h2>
              <div className="prose prose-leadkaun mt-8 max-w-none">
                <p>{entry.definitionLong}</p>
              </div>
            </Reveal>
          </Container>
        </SectionGround>

        {/* EXAMPLES */}
        {entry.examples && entry.examples.length > 0 && (
          <SectionGround variant="sky" size="md">
            <Container>
              <Reveal className="mx-auto max-w-3xl">
                <NumberedTag number="02" label="Worked examples" />
                <h2 className="mt-5 text-[26px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[30px]">
                  Three ways it shows up.
                </h2>
                <FloatingCard tier="3" depth="3" gloss className="mt-8 overflow-hidden">
                  <ul className="divide-y" style={{ borderColor: "var(--hairline)" }}>
                    {entry.examples.map((ex, i) => (
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
                        <p className="text-[15px] leading-[1.65] text-ink">{ex}</p>
                      </li>
                    ))}
                  </ul>
                </FloatingCard>
              </Reveal>
            </Container>
          </SectionGround>
        )}

        {/* FEATURE BRIDGE */}
        {entry.relatedFeature && (
          <SectionGround variant="cream" size="md">
            <Container>
              <Reveal className="mx-auto max-w-3xl">
                <Link href={`/features/${entry.relatedFeature}`} className="block">
                  <FloatingCard tier="3" depth="3" gloss interactive aura="sky" className="flex items-start justify-between gap-6 p-8 md:p-10">
                    <div className="min-w-0">
                      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-600">
                        How Leadkaun uses this
                      </p>
                      <p className="mt-3 text-[20px] font-semibold tracking-[-0.015em] text-ink transition-colors md:text-[24px]">
                        {prettyFeature(entry.relatedFeature)}
                      </p>
                      <p className="mt-2 text-[14px] leading-[1.6] text-ink-soft">
                        See the product surface built around this concept.
                      </p>
                    </div>
                    <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-sky-500 transition-all group-hover:translate-x-0.5" strokeWidth={1.75} />
                  </FloatingCard>
                </Link>
              </Reveal>
            </Container>
          </SectionGround>
        )}

        {/* RELATED TERMS */}
        {related.length > 0 && (
          <SectionGround variant="sky" size="md">
            <Container>
              <Reveal className="mb-8">
                <NumberedTag number="03" label="Related terms" />
                <h2 className="mt-5 max-w-3xl text-[24px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink md:text-[28px]">
                  Neighbours in the glossary.
                </h2>
              </Reveal>
              <Reveal delay={0.08} className="grid gap-4 md:grid-cols-2">
                {related.map((r) => (
                  <Link key={r.slug} href={`/glossary/${r.slug}`} className="group rounded-2xl p-5 glass-2 gloss-edge elevate-1 lift aura-sky-hover transition-all">
                    <p className="text-[15px] font-semibold text-ink group-hover:text-sky-600 transition-colors">{r.term}</p>
                    <p className="mt-1.5 line-clamp-2 text-[13px] leading-[1.55] text-ink-soft">{r.definitionShort}</p>
                  </Link>
                ))}
              </Reveal>
            </Container>
          </SectionGround>
        )}

        <CTABanner
          tag={{ number: "→", label: "From definitions to doing" }}
          headline="Stop defining. Start scoring."
          sub="Leadkaun puts these concepts into practice — A–F grading, Priority Queue, Missed ₹. Setup in 60 minutes."
        />
        <Footer />
      </main>
    </>
  )
}
