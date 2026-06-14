import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowUpRight } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
import { ProductBlock } from "@/app/components/sell/blocks"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { DetailHero } from "@/app/components/detail-hero"
import { NumberedTag } from "@/app/components/numbered-tag"
import { FloatingCard } from "@/app/components/floating-card"
import { Reveal } from "@/app/components/reveal"

import { getQuestions } from "@/lib/pseo/lookup"
import { breadcrumbListSchema, qaPageSchema, jsonLdScript } from "@/lib/seo"

export const revalidate = 604800

type QuestionEntry = {
  slug: string; question: string; answerShort: string; answerLong: string
  category: string; relatedSlugs?: string[]; relatedFeatures?: string[]
}

export async function generateStaticParams() {
  const list = (await getQuestions()) as QuestionEntry[]
  return list.map((q) => ({ slug: q.slug }))
}

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const list = (await getQuestions()) as QuestionEntry[]
  const q = list.find((x) => x.slug === slug)
  if (!q) return {}
  return {
    title: `${q.question} — Leadkaun`,
    description: q.answerShort.slice(0, 155),
    alternates: { canonical: `/questions/${q.slug}` },
  }
}

function prettyFeature(slug: string) {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
}

export default async function QuestionPage({ params }: Params) {
  const { slug } = await params
  const list = (await getQuestions()) as QuestionEntry[]
  const q = list.find((x) => x.slug === slug)
  if (!q) notFound()

  const related = (q.relatedSlugs ?? [])
    .map((s) => list.find((x) => x.slug === s))
    .filter((e): e is QuestionEntry => e !== undefined)
    .slice(0, 3)

  const schemas = [
    breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "Questions", url: "/questions" }, { name: q.question }]),
    qaPageSchema({ question: q.question, answer: q.answerShort }),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(schemas) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        <DetailHero
          breadcrumb={[{ label: "Questions", href: "/questions" }, { label: q.category.replace(/-/g, " ") }]}
          eyebrow="Q&A"
          h1={q.question}
          tldr={{ label: "TL;DR", body: q.answerShort, tone: "sky" }}
        />

        {/* LONG ANSWER */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mx-auto max-w-3xl">
              <NumberedTag number="01" tone="warm" label="The full answer" />
              <h2 className="mt-5 text-[28px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[32px]">
                Here&apos;s the detail.
              </h2>
              <div className="prose prose-leadkaun mt-8 max-w-none">
                <p>{q.answerLong}</p>
              </div>
            </Reveal>
          </Container>
        </SectionGround>

        {/* PRODUCT BRIDGE */}
        {q.relatedFeatures && q.relatedFeatures.length > 0 && (
          <SectionGround variant="sky" size="md">
            <Container>
              <Reveal className="mx-auto max-w-3xl">
                <NumberedTag number="02" label="See it in the product" />
                <h2 className="mt-5 text-[26px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[30px]">
                  Where this lives in Leadkaun.
                </h2>
                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  {q.relatedFeatures.map((f) => (
                    <Link key={f} href={`/features/${f}`} className="group flex items-center justify-between gap-4 rounded-2xl px-5 py-4 glass-2 gloss-edge elevate-1 lift aura-sky-hover transition-all">
                      <div className="min-w-0">
                        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-600">Feature</p>
                        <p className="mt-2 text-[15px] font-semibold text-ink group-hover:text-sky-600 transition-colors">{prettyFeature(f)}</p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-ink-muted transition-all group-hover:text-sky-500 group-hover:translate-x-0.5" strokeWidth={1.75} />
                    </Link>
                  ))}
                </div>
              </Reveal>
            </Container>
          </SectionGround>
        )}

        {/* RELATED QUESTIONS */}
        {related.length > 0 && (
          <SectionGround variant="cream" size="md">
            <Container>
              <Reveal className="mb-8">
                <NumberedTag number="03" tone="warm" label="Related questions" />
                <h2 className="mt-5 max-w-3xl text-[24px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink md:text-[28px]">
                  Teams also ask.
                </h2>
              </Reveal>
              <Reveal delay={0.08} className="grid gap-4 md:grid-cols-3">
                {related.map((r, i) => (
                  <Link key={r.slug} href={`/questions/${r.slug}`} className="group block">
                    <FloatingCard tier="2" depth="2" gloss interactive aura={i % 2 === 1 ? "peach" : "sky"} className="p-5 h-full">
                      <p className="text-[15px] font-semibold leading-[1.35] tracking-[-0.01em] text-ink transition-colors">{r.question}</p>
                      <p className="mt-2 line-clamp-2 text-[13px] leading-[1.55] text-ink-soft">{r.answerShort}</p>
                    </FloatingCard>
                  </Link>
                ))}
              </Reveal>
            </Container>
          </SectionGround>
        )}

        <ProductBlock />

        <CTABanner />
        <Footer />
      </main>
    </>
  )
}
