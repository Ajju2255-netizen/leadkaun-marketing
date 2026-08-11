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
import { QuickAnswer, KeyTakeaways } from "@/app/components/quick-answer"
import { ReferencesBlock } from "@/app/components/pseo/references-block"
import { CommercialLinks } from "@/app/components/pseo/commercial-links"
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
  // ── Phase 2.2 flagship buyer-journey fields (all optional; blocks render only
  //    when present, so other /best guides are unaffected until they adopt them). ──
  /** 4–6 scannable "decision in 10 seconds" bullets. */
  keyTakeaways?: string[]
  /** Category definition + who needs it; hands depth off to /learn. */
  whatItIs?: { heading: string; body: string[] }
  /** At-a-glance capability matrix. `cells` align to `matrixTools` order;
   *  each cell is "yes" | "no" | "partial" | free text. */
  matrixTools?: string[]
  featureMatrix?: { capability: string; note?: string; cells: string[] }[]
  /** On-page product walkthrough with real screenshots from /public/screenshots. */
  howItWorks?: { step: string; body: string; shot?: string; shotAlt?: string }[]
  /** India-specific commercial fit. */
  indiaSection?: { heading: string; intro: string; points: { title: string; body: string }[] }
  /** Brief handoffs to the vertical/commercial owners (don't try to rank for these). */
  useCaseHandoffs?: { label: string; href: string; blurb: string }[]
  /** On-page pricing/cost answer; /pricing stays source of truth. */
  pricingBlock?: { startingPrice: string; freePlan: string; onSignup: string; setup: string }
  /** Contextual cluster links out to /learn and /features (fixes the outbound gap). */
  relatedLearn?: { href: string; label: string }[]
  relatedFeatures?: { href: string; label: string }[]
}

/** Renders one capability-matrix cell: "yes" → check, "no" → dash, "partial", else free text. */
function MatrixCell({ v }: { v: string }) {
  const t = v.trim().toLowerCase()
  if (t === "yes") return <Check className="mx-auto h-4 w-4 text-sky-500" aria-label="Yes" />
  if (t === "no") return <span className="text-ink-muted" aria-label="No">—</span>
  if (t === "partial") return <span className="text-[12px] font-semibold text-orange-500">Partial</span>
  return <span className="text-[13px] leading-snug text-ink-soft">{v}</span>
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

        {/* KEY TAKEAWAYS */}
        {g.keyTakeaways && g.keyTakeaways.length > 0 && (
          <SectionGround variant="pure" size="sm">
            <Container>
              <Reveal><KeyTakeaways items={g.keyTakeaways} /></Reveal>
            </Container>
          </SectionGround>
        )}

        {/* WHAT LEAD MANAGEMENT SOFTWARE IS + WHO NEEDS IT */}
        {g.whatItIs && (
          <SectionGround variant="pure" size="md">
            <Container>
              <Reveal className="mx-auto max-w-3xl">
                <NumberedTag number="01" label="The category" />
                <h2 className="mt-5 text-[26px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[30px]">{g.whatItIs.heading}</h2>
                <div className="mt-5 space-y-4 text-[15px] leading-[1.65] text-ink-soft">
                  {g.whatItIs.body.map((p, i) => <p key={i}>{p}</p>)}
                </div>
                <Link href="/learn/lead-management" className="mt-6 inline-flex text-[14px] font-semibold text-sky-600 hover:text-sky-500">
                  Read the complete lead management guide →
                </Link>
              </Reveal>
            </Container>
          </SectionGround>
        )}

        {/* HOW WE EVALUATED */}
        <SectionGround variant="cream" size="md">
          <Container>
            <Reveal className="mx-auto max-w-3xl">
              <NumberedTag number="02" tone="warm" label="How we evaluated" />
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

        {/* AT-A-GLANCE COMPARISON MATRIX */}
        {g.featureMatrix && g.matrixTools && g.featureMatrix.length > 0 && (
          <SectionGround variant="pure" size="md">
            <Container>
              <Reveal className="mb-8">
                <NumberedTag number="03" label="At a glance" />
                <h2 className="mt-5 max-w-3xl text-[26px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[32px]">
                  The capabilities that decide it.
                </h2>
              </Reveal>
              <Reveal delay={0.06} className="-mx-4 overflow-x-auto px-4">
                <table className="w-full min-w-[720px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[var(--hairline)]">
                      <th className="py-3 pr-4 text-[13px] font-semibold text-ink">Capability</th>
                      {g.matrixTools.map((t) => (
                        <th key={t} className={`px-3 py-3 text-center text-[13px] font-semibold ${t.toLowerCase().includes("leadkaun") ? "text-sky-600" : "text-ink"}`}>{t}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {g.featureMatrix.map((row, i) => (
                      <tr key={i} className="border-b border-[var(--hairline)] align-top">
                        <td className="py-3 pr-4">
                          <span className="block text-[14px] font-medium text-ink">{row.capability}</span>
                          {row.note && <span className="mt-0.5 block text-[12px] leading-snug text-ink-muted">{row.note}</span>}
                        </td>
                        {row.cells.map((c, j) => (
                          <td key={j} className="px-3 py-3 text-center"><MatrixCell v={c} /></td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Reveal>
              <p className="mt-4 text-[12.5px] leading-snug text-ink-muted">
                Pricing read from each vendor&apos;s public page at the review date; capabilities from vendor docs. See the method below.
              </p>
            </Container>
          </SectionGround>
        )}

        {/* RANKED PICKS */}
        <SectionGround variant="sky" size="lg">
          <Container>
            <Reveal className="mb-10 md:mb-14">
              <NumberedTag number="04" label="The ranking" />
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

        {/* HOW LEADKAUN WORKS — real product evidence (public/screenshots/*) */}
        {g.howItWorks && g.howItWorks.length > 0 && (
          <SectionGround variant="pure" size="lg">
            <Container>
              <Reveal className="mb-10">
                <NumberedTag number="05" label="How Leadkaun works" />
                <h2 className="mt-5 max-w-3xl text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[36px]">
                  From a messy lead list to the next call, in one flow.
                </h2>
              </Reveal>
              <div className="space-y-6">
                {g.howItWorks.map((s, i) => (
                  <Reveal key={i} delay={0.04}>
                    <FloatingCard tier="2" depth="2" gloss className="overflow-hidden p-0">
                      <div className="grid gap-0 md:grid-cols-2">
                        <div className="p-7 md:p-8">
                          <span className="font-mono text-[12px] font-semibold text-sky-600">{String(i + 1).padStart(2, "0")}</span>
                          <h3 className="mt-2 text-[19px] font-semibold text-ink">{s.step}</h3>
                          <p className="mt-3 text-[15px] leading-[1.6] text-ink-soft">{s.body}</p>
                        </div>
                        {s.shot && (
                          <figure className="border-t border-[var(--hairline)] bg-black/[0.02] md:border-l md:border-t-0">
                            <img src={s.shot} alt={s.shotAlt ?? s.step} loading="lazy" className="h-full w-full object-cover object-left-top" />
                          </figure>
                        )}
                      </div>
                    </FloatingCard>
                  </Reveal>
                ))}
              </div>
              <Reveal delay={0.05} className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[14px]">
                <Link href="/product" className="font-semibold text-sky-600 hover:text-sky-500">See the full product →</Link>
                <Link href="/features/lead-scoring" className="text-ink-soft hover:text-sky-600">Lead scoring →</Link>
                <Link href="/features/priority-queue" className="text-ink-soft hover:text-sky-600">Priority Queue →</Link>
                <Link href="/features/intake-intelligence" className="text-ink-soft hover:text-sky-600">Intake Intelligence →</Link>
              </Reveal>
            </Container>
          </SectionGround>
        )}

        {/* INDIA-SPECIFIC */}
        {g.indiaSection && (
          <SectionGround variant="cream" size="md">
            <Container>
              <Reveal className="mb-8 max-w-3xl">
                <NumberedTag number="06" tone="warm" label="Built for India" />
                <h2 className="mt-5 text-[26px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[32px]">{g.indiaSection.heading}</h2>
                <p className="mt-4 text-[15px] leading-[1.65] text-ink-soft">{g.indiaSection.intro}</p>
              </Reveal>
              <div className="grid gap-4 md:grid-cols-2">
                {g.indiaSection.points.map((pt, i) => (
                  <Reveal key={i} delay={0.03}>
                    <FloatingCard tier="1" depth="1" gloss className="h-full p-6">
                      <h3 className="text-[15px] font-semibold text-ink">{pt.title}</h3>
                      <p className="mt-2 text-[14px] leading-[1.6] text-ink-soft">{pt.body}</p>
                    </FloatingCard>
                  </Reveal>
                ))}
              </div>
            </Container>
          </SectionGround>
        )}

        {/* USE-CASE HANDOFFS — link out to the vertical owners, don't try to rank here */}
        {g.useCaseHandoffs && g.useCaseHandoffs.length > 0 && (
          <SectionGround variant="pure" size="md">
            <Container>
              <Reveal className="mb-8 max-w-3xl">
                <NumberedTag number="07" label="By industry" />
                <h2 className="mt-5 text-[24px] font-semibold leading-[1.15] tracking-[-0.03em] text-ink md:text-[28px]">Selling into a specific vertical?</h2>
                <p className="mt-3 text-[15px] leading-[1.6] text-ink-soft">Each industry has its own lead sources, sales cycle and buying committee. These guides go deeper than this page can.</p>
              </Reveal>
              <Reveal delay={0.06} className="grid gap-3 sm:grid-cols-2">
                {g.useCaseHandoffs.map((u) => (
                  <Link key={u.href} href={u.href} className="group flex items-start justify-between gap-4 rounded-2xl glass-1 gloss-edge p-5 transition-all lift">
                    <span>
                      <span className="block text-[15px] font-semibold text-ink group-hover:text-sky-600">{u.label}</span>
                      <span className="mt-1 block text-[13px] leading-snug text-ink-muted">{u.blurb}</span>
                    </span>
                    <span className="mt-0.5 font-mono text-[13px] text-ink-muted group-hover:text-sky-600">→</span>
                  </Link>
                ))}
              </Reveal>
            </Container>
          </SectionGround>
        )}

        {/* RANKING METHODOLOGY, Brain 09 §3.7 requires a published method on a
            buyer guide. Without it a ranking is just an opinion with numbers. */}
        <SectionGround variant="pure" size="md">
          <Container>
            <Reveal className="mx-auto max-w-3xl">
              <NumberedTag number="08" label="How this ranking is made" />
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

        {/* PRICING / COMMERCIAL DECISION */}
        {g.pricingBlock && (
          <SectionGround variant="sky" size="md">
            <Container>
              <Reveal className="mx-auto max-w-3xl">
                <NumberedTag number="09" label="Pricing" />
                <h2 className="mt-5 text-[26px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[32px]">What Leadkaun costs, plainly.</h2>
                <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                  {[
                    ["Starting price", g.pricingBlock.startingPrice],
                    ["Free to start", g.pricingBlock.freePlan],
                    ["When you sign up", g.pricingBlock.onSignup],
                    ["Setup", g.pricingBlock.setup],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-2xl glass-1 gloss-edge p-5">
                      <dt className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">{k}</dt>
                      <dd className="mt-1.5 text-[15px] leading-[1.55] text-ink-soft">{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href={APP_URLS.register} className="inline-flex items-center rounded-full bg-sky-500 px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-sky-600">Start free</a>
                  <Link href="/pricing" className="inline-flex items-center rounded-full glass-1 gloss-edge px-5 py-2.5 text-[14px] font-semibold text-ink-soft transition-all hover:text-sky-600 lift">Full pricing →</Link>
                </div>
              </Reveal>
            </Container>
          </SectionGround>
        )}

        {/* FAQ */}
        <SectionGround variant="cream" size="md">
          <Container>
            <Reveal className="mx-auto mb-10 max-w-3xl text-center">
              <div className="flex justify-center"><NumberedTag number="10" tone="warm" label="FAQ" /></div>
              <h2 className="mt-5 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[36px]">Common questions.</h2>
            </Reveal>
            <Reveal delay={0.08}><Faq items={g.faqs} /></Reveal>
          </Container>
        </SectionGround>

        {/* SOURCES & REFERENCES */}
        {(g.relatedLearn || g.relatedFeatures) && <ReferencesBlock number="11" ground="pure" />}

        {/* CLUSTER LINKS into /learn + /features (fixes the outbound gap) */}
        {!!(g.relatedLearn?.length || g.relatedFeatures?.length) && (
          <CommercialLinks
            number="12"
            heading="Keep going."
            links={[
              ...(g.relatedLearn ?? []).map((l) => ({ ...l, kind: "learn" })),
              ...(g.relatedFeatures ?? []).map((l) => ({ ...l, kind: "feature" })),
            ]}
          />
        )}

        {/* RELATED COMPARES */}
        {g.relatedCompares.length > 0 && (
          <SectionGround variant="cream" size="md">
            <Container>
              <Reveal className="mb-8">
                <NumberedTag number="13" tone="warm" label="Go deeper" />
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
