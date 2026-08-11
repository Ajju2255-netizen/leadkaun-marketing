import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Check, AlertTriangle, Trophy } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
import { MidCta } from "@/app/components/page-blocks"

import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { PageHero } from "@/app/components/page-hero"
import { NumberedTag } from "@/app/components/numbered-tag"
import { FloatingCard } from "@/app/components/floating-card"
import { GlossLink } from "@/app/components/gloss-button"
import { Faq } from "@/app/components/faq"
import { Reveal } from "@/app/components/reveal"
import { QuickAnswer } from "@/app/components/quick-answer"
import { getBest, getBestGuide } from "@/lib/pseo/lookup"
import { breadcrumbListSchema, faqPageSchema, jsonLdScript, canonical, ogMeta } from "@/lib/seo"
import { APP_URLS } from "@/lib/urls"

export const revalidate = 86400

type Pick = {
  rank: number; name: string; isLeadkaun?: boolean; tagline: string; bestFor: string
  pricingNote: string; whyPick: string; watchOut: string; url: string
}
type BestGuide = {
  slug: string; metaTitle: string; metaDescription: string; h1: string; intro: string
  quickAnswer: { question: string; answer: string }; updated: string; criteria: string[]
  picks: Pick[]; faqs: { q: string; a: string }[]; relatedCompares: string[]
  /** Opt-out: park a record at noindex while it is corrected. */
  indexable?: boolean
}

export async function generateStaticParams() {
  const list = (await getBest()) as BestGuide[]
  return list.map((b) => ({ slug: b.slug }))
}

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const g = await getBestGuide<BestGuide>(slug)
  if (!g) return {}
  const path = `/best/${g.slug}`
  return {
    title: g.metaTitle,
    description: g.metaDescription,
    alternates: { canonical: path },
    ...ogMeta({ title: g.metaTitle, description: g.metaDescription, path }),
    robots: { index: g.indexable !== false, follow: true },
  }
}

export default async function BestGuidePage({ params }: Params) {
  const { slug } = await params
  const g = await getBestGuide<BestGuide>(slug)
  if (!g) notFound()

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: g.h1,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: g.picks.length,
    itemListElement: g.picks.map((p) => ({
      "@type": "ListItem", position: p.rank, name: p.name,
      url: p.url.startsWith("/") ? canonical(p.url) : p.url,
    })),
  }
  const schemas = [
    breadcrumbListSchema([
      { name: "Home", url: "/" },
      { name: "Best Software", url: "/best" },
      { name: g.h1 },
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
          eyebrow={<><Trophy className="h-3 w-3" strokeWidth={2} /> Best Software · updated {g.updated}</>}
          h1={g.h1}
          sub={g.intro}
          primary={{ kind: "primary", label: "Try Leadkaun free", href: APP_URLS.register, external: true }}
          secondary={{ kind: "glass", label: "See pricing", href: "/pricing" }}
        />

        {/* AI QUICK ANSWER */}
        <SectionGround variant="pure" size="sm">
          <Container>
            <QuickAnswer question={g.quickAnswer.question} answer={g.quickAnswer.answer} />
          </Container>
        </SectionGround>

        {/* HOW WE EVALUATED */}
        <SectionGround variant="cream" size="md">
          <Container>
            <Reveal className="mx-auto max-w-3xl">
              <NumberedTag number="01" tone="warm" label="How we evaluated" />
              <ul className="mt-6 space-y-2.5">
                {g.criteria.map((c, i) => (
                  <li key={i} className="flex items-start gap-3 text-[15px] leading-[1.55] text-ink-soft">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" aria-hidden />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </Container>
        </SectionGround>

        {/* RANKED PICKS */}
        <SectionGround variant="sky" size="lg">
          <Container>
            <Reveal className="mb-10 md:mb-14">
              <NumberedTag number="02" label="The ranking" />
              <h2 className="mt-5 max-w-3xl text-[30px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">
                {g.picks.length} tools, ranked and reasoned.
              </h2>
            </Reveal>

            <div className="space-y-5">
              {g.picks.map((p) => (
                <Reveal key={p.rank} delay={0.04}>
                  <FloatingCard tier={p.isLeadkaun ? "2" : "3"} depth="3" gloss className={`p-7 md:p-8 ${p.isLeadkaun ? "aura-sky-hover" : ""}`}>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl font-mono text-[14px] font-bold text-white" style={{ background: p.isLeadkaun ? "linear-gradient(180deg,#38BDF8,#0EA5E9)" : "linear-gradient(180deg,#CBD5E1,#94A3B8)" }}>
                        {p.rank}
                      </span>
                      <h3 className="text-[21px] font-semibold tracking-[-0.01em] text-ink">
                        {p.url.startsWith("/") ? <Link href={p.url} className="hover:text-sky-600">{p.name}</Link> : p.name}
                      </h3>
                      {p.isLeadkaun && <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-[11px] font-semibold text-sky-700">Our pick</span>}
                      <span className="text-[14px] text-ink-soft">{p.tagline}</span>
                    </div>
                    <p className="mt-4 text-[15px] leading-[1.6] text-ink-soft"><span className="font-semibold text-ink">Best for:</span> {p.bestFor}</p>
                    <p className="mt-1.5 text-[15px] leading-[1.6] text-ink-soft"><span className="font-semibold text-ink">Pricing:</span> {p.pricingNote}</p>
                    <p className="mt-3 text-[15px] leading-[1.6] text-ink-soft">{p.whyPick}</p>
                    <p className="mt-3 flex items-start gap-2 text-[14px] leading-[1.55] text-ink-muted">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" aria-hidden />
                      <span><span className="font-semibold">Watch-out:</span> {p.watchOut}</span>
                    </p>
                    {p.url.startsWith("/") && (
                      <Link href={p.url} className="mt-4 inline-flex text-[14px] font-semibold text-sky-600 hover:text-sky-500">
                        {p.isLeadkaun ? "See the product →" : `Compare with Leadkaun →`}
                      </Link>
                    )}
                  </FloatingCard>
                </Reveal>
              ))}
            </div>
          </Container>
        </SectionGround>

        <MidCta lead="Want to see how Leadkaun grades your own leads?" />

        {/* RANKING METHODOLOGY, Brain 09 §3.7 requires a published method on a
            buyer guide. Without it a ranking is just an opinion with numbers. */}
        <SectionGround variant="pure" size="md">
          <Container>
            <Reveal className="mx-auto max-w-3xl">
              <NumberedTag number="03" label="How this ranking is made" />
              <h2 className="mt-5 text-[26px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[30px]">
                Our method, and our conflict of interest.
              </h2>
              <div className="mt-6 space-y-4 text-[15px] leading-[1.65] text-ink-soft">
                <p>
                  We build one of the tools in this category, so treat this page accordingly. What we can offer instead
                  of neutrality is a published method and a willingness to exclude ourselves.
                </p>
                <p>
                  Rankings are built from the criteria listed above, applied in the same order to every tool. Pricing is
                  read from each vendor&apos;s public pricing page at the review date on this page, in the currency they
                  actually charge, not converted to make a comparison flatter. Capability claims come from vendor
                  documentation, and where a capability is tier-gated we say so rather than crediting the product as a
                  whole.
                </p>
                <p>
                  Where Leadkaun does not belong in a category, it is not ranked. Our{" "}
                  <Link href="/best/lead-routing-software" className="text-sky-600 underline-offset-2 hover:underline"> {/* lk-gate-ignore:lead-assignment */}
                    lead routing guide {/* lk-gate-ignore:lead-assignment */}
                  </Link>{" "}
                  ranks five competitors and excludes us entirely, because we do not do rules-based routing. Claims we
                  make about our own product are checked against the shipping code, see{" "}
                  <Link href="/methodology" className="text-sky-600 underline-offset-2 hover:underline">our methodology</Link>.
                </p>
                <p>
                  No vendor pays for placement here, and none of these links is affiliate-compensated.
                </p>
              </div>
            </Reveal>
          </Container>
        </SectionGround>

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

        {/* RELATED COMPARES */}
        {g.relatedCompares.length > 0 && (
          <SectionGround variant="sky" size="md">
            <Container>
              <Reveal className="mb-8">
                <NumberedTag number="05" label="Go deeper" />
                <h2 className="mt-5 max-w-3xl text-[24px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[28px]">Head-to-head comparisons.</h2>
              </Reveal>
              <Reveal delay={0.08} className="flex flex-wrap gap-2.5">
                {g.relatedCompares.map((c) => (
                  <Link key={c} href={`/compare/${c}`} className="inline-flex items-center rounded-full glass-1 gloss-edge px-4 py-2 text-[13px] font-medium text-ink-soft transition-all hover:text-sky-600 lift">
                    Leadkaun vs {c.replace("leadkaun-vs-", "").replace(/-/g, " ")}
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
