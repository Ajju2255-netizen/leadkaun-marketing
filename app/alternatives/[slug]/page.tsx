import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Check, AlertTriangle, ArrowRight } from "lucide-react"

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
import { getAlternatives, getAlternative } from "@/lib/pseo/lookup"
import { breadcrumbListSchema, faqPageSchema, jsonLdScript, canonical } from "@/lib/seo"
import { APP_URLS } from "@/lib/urls"

export const revalidate = 86400

type Alt = { rank: number; name: string; isLeadkaun?: boolean; tagline: string; bestFor: string; watchOut: string; url: string }
type AltGuide = {
  slug: string; name: string; metaTitle: string; metaDescription: string; h1: string; intro: string
  quickAnswer: { question: string; answer: string }; whyLookElsewhere: string[]
  alternatives: Alt[]; faqs: { q: string; a: string }[]; comparePage: string
  // Optional wedge paragraph: "you may not need to rip {name} out — run Leadkaun alongside it."
  runAlongside?: string
}

export async function generateStaticParams() {
  const list = (await getAlternatives()) as AltGuide[]
  return list.map((a) => ({ slug: a.slug }))
}

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const g = await getAlternative<AltGuide>(slug)
  if (!g) return {}
  return {
    title: g.metaTitle,
    description: g.metaDescription,
    alternates: { canonical: `/alternatives/${g.slug}` },
  }
}

export default async function AlternativesPage({ params }: Params) {
  const { slug } = await params
  const g = await getAlternative<AltGuide>(slug)
  if (!g) notFound()

  const itemList = {
    "@context": "https://schema.org", "@type": "ItemList", name: g.h1,
    numberOfItems: g.alternatives.length,
    itemListElement: g.alternatives.map((a) => ({
      "@type": "ListItem", position: a.rank, name: a.name,
      url: a.url.startsWith("/") ? canonical(a.url) : a.url,
    })),
  }
  const schemas = [
    breadcrumbListSchema([
      { name: "Home", url: "/" },
      { name: "Alternatives", url: "/alternatives" },
      { name: `${g.name} alternatives` },
    ]),
    itemList,
    faqPageSchema(g.faqs),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(schemas) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        <PageHero
          eyebrow={<>{g.name} alternatives</>}
          h1={g.h1}
          sub={g.intro}
          primary={{ kind: "primary", label: "Try Leadkaun free", href: APP_URLS.register, external: true }}
          secondary={{ kind: "glass", label: `Leadkaun vs ${g.name}`, href: `/compare/${g.comparePage}` }}
        />

        <SectionGround variant="pure" size="sm">
          <Container>
            <QuickAnswer question={g.quickAnswer.question} answer={g.quickAnswer.answer} />
          </Container>
        </SectionGround>

        {/* WHY LOOK ELSEWHERE */}
        <SectionGround variant="cream" size="md">
          <Container>
            <Reveal className="mx-auto max-w-3xl">
              <NumberedTag number="01" tone="warm" label={`Why teams look past ${g.name}`} />
              <ul className="mt-6 space-y-2.5">
                {g.whyLookElsewhere.map((w, i) => (
                  <li key={i} className="flex items-start gap-3 text-[15px] leading-[1.55] text-ink-soft">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" aria-hidden />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[13px] text-ink-muted">
                Prefer a direct, feature-by-feature view? See <Link href={`/compare/${g.comparePage}`} className="font-semibold text-sky-600 hover:text-sky-500">Leadkaun vs {g.name}</Link>.
              </p>
            </Reveal>
          </Container>
        </SectionGround>

        {/* ALTERNATIVES */}
        <SectionGround variant="sky" size="lg">
          <Container>
            <Reveal className="mb-10 md:mb-14">
              <NumberedTag number="02" label="The alternatives" />
              <h2 className="mt-5 max-w-3xl text-[30px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">
                {g.alternatives.length} honest alternatives to {g.name}.
              </h2>
            </Reveal>
            <div className="space-y-5">
              {g.alternatives.map((a) => (
                <Reveal key={a.rank} delay={0.04}>
                  <FloatingCard tier={a.isLeadkaun ? "2" : "3"} depth="3" gloss className={`p-7 md:p-8 ${a.isLeadkaun ? "aura-sky-hover" : ""}`}>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl font-mono text-[14px] font-bold text-white" style={{ background: a.isLeadkaun ? "linear-gradient(180deg,#38BDF8,#0EA5E9)" : "linear-gradient(180deg,#CBD5E1,#94A3B8)" }}>{a.rank}</span>
                      <h3 className="text-[21px] font-semibold tracking-[-0.01em] text-ink">
                        {a.url.startsWith("/") ? <Link href={a.url} className="hover:text-sky-600">{a.name}</Link> : a.name}
                      </h3>
                      {a.isLeadkaun && <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-[11px] font-semibold text-sky-700">Our pick</span>}
                      <span className="text-[14px] text-ink-soft">— {a.tagline}</span>
                    </div>
                    <p className="mt-4 text-[15px] leading-[1.6] text-ink-soft"><span className="font-semibold text-ink">Best for:</span> {a.bestFor}</p>
                    <p className="mt-2 flex items-start gap-2 text-[14px] leading-[1.55] text-ink-muted"><Check className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" aria-hidden /><span><span className="font-semibold">Watch-out:</span> {a.watchOut}</span></p>
                    {a.url.startsWith("/") && (
                      <Link href={a.url} className="mt-4 inline-flex items-center gap-1 text-[14px] font-semibold text-sky-600 hover:text-sky-500">
                        {a.isLeadkaun ? "See the comparison" : "Compare"} <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </FloatingCard>
                </Reveal>
              ))}
            </div>
          </Container>
        </SectionGround>

        {/* RUN ALONGSIDE — the hybrid wedge */}
        {g.runAlongside && (
          <SectionGround variant="pure" size="md">
            <Container>
              <Reveal className="mx-auto max-w-3xl">
                <NumberedTag number="03" label={`Or: keep ${g.name}, add Leadkaun`} />
                <p className="mt-6 text-[17px] leading-[1.7] text-ink-soft">{g.runAlongside}</p>
                <p className="mt-4 text-[13px] text-ink-muted">
                  See exactly how they overlap in <Link href={`/compare/${g.comparePage}`} className="font-semibold text-sky-600 hover:text-sky-500">Leadkaun vs {g.name}</Link>.
                </p>
              </Reveal>
            </Container>
          </SectionGround>
        )}

        {/* FAQ */}
        <SectionGround variant="cream" size="md">
          <Container>
            <Reveal className="mx-auto mb-10 max-w-3xl text-center">
              <div className="flex justify-center"><NumberedTag number="04" tone="warm" label="FAQ" /></div>
              <h2 className="mt-5 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[36px]">Common questions.</h2>
            </Reveal>
            <Reveal delay={0.08}><Faq items={g.faqs} /></Reveal>
          </Container>
        </SectionGround>

        

        <CTABanner />
        <Footer />
      </main>
    </>
  )
}
