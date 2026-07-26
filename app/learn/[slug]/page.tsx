import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { BookOpen, ArrowUpRight, Check } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { PageHero } from "@/app/components/page-hero"
import { NumberedTag } from "@/app/components/numbered-tag"
import { FloatingCard } from "@/app/components/floating-card"
import { Faq } from "@/app/components/faq"
import { Reveal } from "@/app/components/reveal"
import { QuickAnswer } from "@/app/components/quick-answer"
import { getPillars, getPillar } from "@/lib/pseo/lookup"
import { breadcrumbListSchema, faqPageSchema, jsonLdScript } from "@/lib/seo"
import { APP_URLS } from "@/lib/urls"

export const revalidate = 86400

type LinkItem = { label: string; href: string }
type Cluster = { heading: string; links: LinkItem[] }
type PillarSection = { heading: string; paragraphs: string[] }
type Pillar = {
  slug: string; title: string; metaTitle: string; metaDescription: string; h1: string; dek: string
  quickAnswer: { question: string; answer: string }; keyTakeaways: string[]
  body?: PillarSection[]
  clusters: Cluster[]; faqs: { q: string; a: string }[]; relatedPillars: string[]
}

export async function generateStaticParams() {
  const list = (await getPillars()) as Pillar[]
  return list.map((p) => ({ slug: p.slug }))
}

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const p = await getPillar<Pillar>(slug)
  if (!p) return {}
  return { title: p.metaTitle, description: p.metaDescription, alternates: { canonical: `/learn/${p.slug}` } }
}

export default async function PillarPage({ params }: Params) {
  const { slug } = await params
  const p = await getPillar<Pillar>(slug)
  if (!p) notFound()
  const all = (await getPillars()) as Pillar[]
  const related = p.relatedPillars.map((s) => all.find((x) => x.slug === s)).filter(Boolean) as Pillar[]

  const schemas = [
    breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "Learn", url: "/learn" }, { name: p.title }]),
    faqPageSchema(p.faqs),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(schemas) }} />
      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        <PageHero
          eyebrow={<><BookOpen className="h-3 w-3" strokeWidth={2} /> Learn · {p.title}</>}
          h1={p.h1}
          sub={p.dek}
          primary={{ kind: "primary", label: "Start free trial", href: APP_URLS.register, external: true }}
          secondary={{ kind: "glass", label: "See the product", href: "/product" }}
        />

        <SectionGround variant="pure" size="sm">
          <Container><QuickAnswer question={p.quickAnswer.question} answer={p.quickAnswer.answer} /></Container>
        </SectionGround>

        {/* KEY TAKEAWAYS */}
        <SectionGround variant="cream" size="md">
          <Container>
            <Reveal className="mx-auto max-w-3xl">
              <NumberedTag number="01" tone="warm" label="Key takeaways" />
              <ul className="mt-6 space-y-3">
                {p.keyTakeaways.map((k, i) => (
                  <li key={i} className="flex items-start gap-3 text-[16px] leading-[1.55] text-ink">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-sky-500" aria-hidden /><span>{k}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </Container>
        </SectionGround>

        {/* ARTICLE BODY — the pillar prose */}
        {p.body && p.body.length > 0 && (
          <SectionGround variant="pure" size="lg">
            <Container>
              <div className="mx-auto max-w-3xl">
                {p.body.map((s, si) => (
                  <Reveal key={si} className={si > 0 ? "mt-10" : ""}>
                    <h2 className="text-[26px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[32px]">{s.heading}</h2>
                    {s.paragraphs.map((para, pi) => (
                      <p key={pi} className="mt-4 text-[16px] leading-[1.7] text-ink-soft md:text-[17px]">{para}</p>
                    ))}
                  </Reveal>
                ))}
              </div>
            </Container>
          </SectionGround>
        )}

        {/* CLUSTERS — the topical map */}
        <SectionGround variant="sky" size="lg">
          <Container>
            <Reveal className="mb-10 md:mb-14 max-w-3xl">
              <NumberedTag number="02" label="The complete map" />
              <h2 className="mt-5 text-[30px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">
                Everything on {p.title.toLowerCase()}, in one place.
              </h2>
            </Reveal>
            <div className="grid gap-5 md:grid-cols-2 md:gap-6">
              {p.clusters.map((c, ci) => (
                <Reveal key={ci} delay={0.04}>
                  <FloatingCard tier="3" depth="3" gloss className="h-full p-6 md:p-7">
                    <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-600">{c.heading}</p>
                    <ul className="mt-4 flex flex-col gap-2.5">
                      {c.links.map((l) => (
                        <li key={l.href}>
                          <Link href={l.href} className="group inline-flex items-start gap-1.5 text-[15px] leading-[1.5] text-ink-soft transition-colors hover:text-sky-600">
                            <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-ink-muted transition-colors group-hover:text-sky-500" />
                            <span>{l.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </FloatingCard>
                </Reveal>
              ))}
            </div>
          </Container>
        </SectionGround>

        {/* FAQ */}
        <SectionGround variant="cream" size="md">
          <Container>
            <Reveal className="mx-auto mb-10 max-w-3xl text-center">
              <div className="flex justify-center"><NumberedTag number="03" tone="warm" label="FAQ" /></div>
              <h2 className="mt-5 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[36px]">Questions on {p.title.toLowerCase()}.</h2>
            </Reveal>
            <Reveal delay={0.08}><Faq items={p.faqs} /></Reveal>
          </Container>
        </SectionGround>

        {/* RELATED PILLARS */}
        {related.length > 0 && (
          <SectionGround variant="sky" size="md">
            <Container>
              <Reveal className="mb-8"><NumberedTag number="04" label="Related topics" /></Reveal>
              <Reveal delay={0.08} className="flex flex-wrap gap-2.5">
                {related.map((r) => (
                  <Link key={r.slug} href={`/learn/${r.slug}`} className="inline-flex items-center rounded-full glass-1 gloss-edge px-4 py-2 text-[13px] font-medium text-ink-soft transition-all hover:text-sky-600 lift">
                    {r.title}
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
