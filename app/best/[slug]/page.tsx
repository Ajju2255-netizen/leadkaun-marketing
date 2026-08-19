import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowUpRight } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"

import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { Faq } from "@/app/components/faq"
import { Reveal } from "@/app/components/reveal"
import { QuickAnswer } from "@/app/components/quick-answer"
import {
  JumpNav, Label, LedgerBlock, LedgerCTA, LedgerMasthead, MethodBlock,
  Minus2, No, RankedEntry, SectionHead, SPINE, Yes,
} from "@/app/components/ledger"
import { getBest, getBestGuide } from "@/lib/pseo/lookup"
import { REFERENCES } from "@/lib/pseo/shared-content"
import { breadcrumbListSchema, faqPageSchema, jsonLdScript, canonical, ogMeta } from "@/lib/seo"
import { APP_URLS } from "@/lib/urls"
import { HeroSignupCard } from "@/app/components/hero-signup"

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
  keyTakeaways?: string[]
  whatItIs?: { heading: string; body: string[] }
  matrixTools?: string[]
  featureMatrix?: { capability: string; note?: string; cells: string[] }[]
  howItWorks?: { step: string; body: string; shot?: string; shotAlt?: string }[]
  indiaSection?: { heading: string; intro: string; points: { title: string; body: string }[] }
  useCaseHandoffs?: { label: string; href: string; blurb: string }[]
  pricingBlock?: { startingPrice: string; freePlan: string; onSignup: string; setup: string }
  relatedLearn?: { href: string; label: string }[]
  relatedFeatures?: { href: string; label: string }[]
}

/** "yes" → check, "no" → cross, "partial" → dash, anything else → the text itself. */
function MatrixCell({ v }: { v: string }) {
  const t = v.trim().toLowerCase()
  if (t === "yes") return <Yes />
  if (t === "no") return <No />
  if (t === "partial") return <Minus2 />
  return <span className="ledger-num text-[11px] font-semibold leading-tight text-ink-soft">{v}</span>
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

  /* Most guides carry only the base blocks, so section numbers and the jump nav
     are both derived from what this record actually has. */
  const hasMatrix = !!(g.featureMatrix?.length && g.matrixTools?.length)
  const hasHowItWorks = !!g.howItWorks?.length
  const hasIndia = !!g.indiaSection
  const hasHandoffs = !!g.useCaseHandoffs?.length
  const hasPricing = !!g.pricingBlock
  const links = [
    ...(g.relatedLearn ?? []).map((l) => ({ ...l, group: "Learn" })),
    ...(g.relatedFeatures ?? []).map((l) => ({ ...l, group: "Features" })),
    ...g.relatedCompares.map((c) => ({
      href: `/compare/${c}`,
      label: `Leadkaun vs ${c.replace("leadkaun-vs-", "").replace(/-/g, " ")}`,
      group: "Compare",
    })),
  ]

  let n = 0
  const num = () => String(++n).padStart(2, "0")
  const readNo = num()
  const matrixNo = hasMatrix ? num() : null
  const rankingNo = num()
  const howNo = hasHowItWorks ? num() : null
  const indiaNo = hasIndia ? num() : null
  const handoffNo = hasHandoffs ? num() : null
  const pricingNo = hasPricing ? num() : null
  const faqNo = num()

  const nav = [
    { id: "read", label: "The read" },
    ...(hasMatrix ? [{ id: "matrix", label: "At a glance" }] : []),
    { id: "ranking", label: "The ranking" },
    ...(hasHowItWorks ? [{ id: "how", label: "How it works" }] : []),
    ...(hasIndia ? [{ id: "india", label: "Built for India" }] : []),
    ...(hasPricing ? [{ id: "pricing", label: "Pricing" }] : []),
    { id: "faq", label: "FAQ" },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(schemas) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        <LedgerMasthead
          meta={["Buyer's guide", `Updated ${g.updated}`, "We build one of these"]}
          h1={g.h1}
          lead={g.intro}
          secondary={{ label: "See pricing", href: "/pricing" }}
          aside={<HeroSignupCard />}
        />

        <JumpNav items={nav} />

        {/* THE READ — overview, takeaways, the category, and the criteria */}
        <SectionGround id="read" variant="pure" size="lg" className="scroll-mt-[128px]">
          <Container>
            <SectionHead
              number={readNo}
              label="The read"
              title={g.whatItIs?.heading ?? "What you actually need to decide."}
            />

            <LedgerBlock label="Overview" first>
              <div className="[&>[data-quick-answer]]:!mx-0 [&>[data-quick-answer]]:!max-w-none">
                <QuickAnswer question={g.quickAnswer.question} answer={g.quickAnswer.answer} />
              </div>
            </LedgerBlock>

            {g.keyTakeaways && g.keyTakeaways.length > 0 && (
              <LedgerBlock label="In ten seconds" delay={0.05}>
                <ul className="grid gap-3 sm:grid-cols-2 sm:gap-x-12">
                  {g.keyTakeaways.map((t, i) => (
                    <li key={i} className="flex items-start gap-3 text-[14px] leading-[1.55] text-ink-soft md:text-[15px]">
                      <span className="ledger-num mt-0.5 shrink-0 text-[11px] text-sky-700">{String(i + 1).padStart(2, "0")}</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </LedgerBlock>
            )}

            {g.whatItIs && (
              <LedgerBlock label="The category" delay={0.06}>
                <div className="max-w-[62ch] space-y-4 text-[16px] leading-[1.7] text-ink-soft md:text-[17px]">
                  {g.whatItIs.body.map((para, i) => <p key={i}>{para}</p>)}
                </div>
                <Link href="/learn/lead-management" className="mt-6 inline-flex text-[14px] font-semibold text-sky-700 hover:text-sky-600">
                  Read the complete lead management guide →
                </Link>
              </LedgerBlock>
            )}

            <LedgerBlock label="How we judged" delay={0.08}>
              <ul className="grid gap-3 sm:grid-cols-2 sm:gap-x-12">
                {g.criteria.map((c, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[14px] leading-[1.55] text-ink-soft md:text-[15px]">
                    <span className="mt-0.5"><Yes /></span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </LedgerBlock>
          </Container>
        </SectionGround>

        {/* AT A GLANCE — capability matrix */}
        {hasMatrix && (
          <SectionGround id="matrix" variant="cream" size="lg" className="scroll-mt-[128px] !overflow-visible">
            <Container>
              <SectionHead
                number={matrixNo!}
                label="At a glance"
                title="The capabilities that decide it."
                sub="Read from vendor documentation at the review date. Where a capability is tier-gated, the cell says so instead of crediting the product as a whole."
              />
              <Reveal delay={0.06} className="-mx-6 overflow-x-auto px-6 md:mx-0 md:px-0">
                <table className="w-full min-w-[760px] border-collapse rounded-2xl bg-white text-left" style={{ border: "1px solid var(--paper-line)" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--paper-line-2)" }}>
                      <th className="px-6 py-3.5 align-bottom"><Label>Capability</Label></th>
                      {g.matrixTools!.map((t) => {
                        const ours = t.toLowerCase().includes("leadkaun")
                        return (
                          <th
                            key={t}
                            className="px-4 py-3.5 text-center align-bottom"
                            style={ours ? { background: "rgba(8,119,184,0.04)" } : undefined}
                          >
                            <Label tone={ours ? "sky" : "muted"}>{t}</Label>
                          </th>
                        )
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {g.featureMatrix!.map((row, i) => (
                      <tr key={i} className="align-middle" style={{ borderBottom: "1px solid var(--paper-line)" }}>
                        <td className="px-6 py-3.5">
                          <span className="block text-[14px] leading-[1.45] text-ink">{row.capability}</span>
                          {row.note && <span className="mt-0.5 block text-[12px] leading-snug text-ink-muted">{row.note}</span>}
                        </td>
                        {row.cells.map((c, j) => {
                          const ours = g.matrixTools![j]?.toLowerCase().includes("leadkaun")
                          return (
                            <td
                              key={j}
                              className="px-4 py-3.5 text-center"
                              style={ours ? { background: "rgba(8,119,184,0.04)" } : undefined}
                            >
                              <span className="inline-flex justify-center"><MatrixCell v={c} /></span>
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Reveal>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                <span className="inline-flex items-center gap-2"><Yes /><span className="text-[12px] text-ink-muted">Built in</span></span>
                <span className="inline-flex items-center gap-2"><No /><span className="text-[12px] text-ink-muted">Not available</span></span>
                <span className="inline-flex items-center gap-2"><Minus2 /><span className="text-[12px] text-ink-muted">Partial / tier-gated</span></span>
              </div>
            </Container>
          </SectionGround>
        )}

        {/* THE RANKING */}
        <SectionGround id="ranking" variant="pure" size="lg" className="scroll-mt-[128px]">
          <Container>
            <SectionHead
              number={rankingNo}
              label="The ranking"
              title={`${g.picks.length} tools, ranked and reasoned.`}
              sub="Every entry carries a watch-out, including ours. Where we do not belong in a category, we are not ranked in it."
            />
            <ol className="border-b" style={{ borderColor: "var(--paper-line)" }}>
              {g.picks.map((p) => (
                <RankedEntry
                  key={p.rank}
                  rank={p.rank}
                  name={p.name}
                  tagline={p.tagline}
                  ours={p.isLeadkaun}
                  rows={[
                    { label: "Best for", value: p.bestFor },
                    { label: "Pricing", value: p.pricingNote },
                    { label: "Why", value: p.whyPick },
                    { label: "Watch-out", value: p.watchOut },
                  ]}
                  href={p.url.startsWith("/") ? p.url : undefined}
                  hrefLabel={p.isLeadkaun ? "See the product" : "Compare with Leadkaun"}
                />
              ))}
            </ol>
          </Container>
        </SectionGround>

        {/* HOW LEADKAUN WORKS — real product evidence */}
        {hasHowItWorks && (
          <SectionGround id="how" variant="cream" size="lg" className="scroll-mt-[128px]">
            <Container>
              <SectionHead
                number={howNo!}
                label="How Leadkaun works"
                title="From a messy lead list to the next call."
              />
              <ol className="border-t" style={{ borderColor: "var(--paper-line-2)" }}>
                {g.howItWorks!.map((s, i) => (
                  <li key={i} className={`grid gap-y-5 py-8 md:py-10 ${SPINE}`} style={{ borderBottom: "1px solid var(--paper-line)" }}>
                    <span className="ledger-num text-[13px] font-semibold text-sky-700 tabular md:pt-1 md:text-[15px]">
                      Step {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="grid gap-6 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-10">
                      <div>
                        <h3 className="text-[18px] font-semibold leading-snug tracking-[-0.01em] text-ink md:text-[19px]">{s.step}</h3>
                        <p className="mt-3 max-w-[52ch] text-[14px] leading-[1.6] text-ink-soft md:text-[15px]">{s.body}</p>
                      </div>
                      {s.shot && (
                        <figure className="overflow-hidden rounded-xl bg-white" style={{ border: "1px solid var(--paper-line)" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={s.shot} alt={s.shotAlt ?? s.step} loading="lazy" className="w-full object-cover object-left-top" />
                        </figure>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[14px]">
                <Link href="/product" className="font-semibold text-sky-700 hover:text-sky-600">See the full product →</Link>
                <Link href="/features/lead-scoring" className="text-ink-soft hover:text-sky-700">Lead scoring →</Link>
                <Link href="/features/priority-queue" className="text-ink-soft hover:text-sky-700">Priority Queue →</Link>
                <Link href="/features/intake-intelligence" className="text-ink-soft hover:text-sky-700">Intake Intelligence →</Link>
              </div>
            </Container>
          </SectionGround>
        )}

        {/* BUILT FOR INDIA */}
        {hasIndia && (
          <SectionGround id="india" variant="pure" size="lg" className="scroll-mt-[128px]">
            <Container>
              <SectionHead number={indiaNo!} label="Built for India" title={g.indiaSection!.heading} sub={g.indiaSection!.intro} />
              <LedgerBlock label="What that means" first delay={0.06}>
                <dl className="grid gap-x-12 gap-y-6 sm:grid-cols-2">
                  {g.indiaSection!.points.map((pt) => (
                    <div key={pt.title}>
                      <dt className="text-[15px] font-semibold text-ink">{pt.title}</dt>
                      <dd className="mt-1.5 text-[14px] leading-[1.6] text-ink-soft">{pt.body}</dd>
                    </div>
                  ))}
                </dl>
              </LedgerBlock>
            </Container>
          </SectionGround>
        )}

        {/* BY INDUSTRY — hand off to the vertical owners */}
        {hasHandoffs && (
          <SectionGround variant="cream" size="md" className="scroll-mt-[128px]">
            <Container>
              <SectionHead
                number={handoffNo!}
                label="By industry"
                title="Selling into a specific vertical?"
                sub="Each industry has its own lead sources, sales cycle and buying committee. These guides go deeper than this page can."
              />
              <LedgerBlock label="Deeper guides" first delay={0.06}>
                <ul className="border-t" style={{ borderColor: "var(--paper-line)" }}>
                  {g.useCaseHandoffs!.map((u) => (
                    <li key={u.href} style={{ borderBottom: "1px solid var(--paper-line)" }}>
                      <Link href={u.href} className="group flex items-start justify-between gap-6 py-4 transition-colors">
                        <span>
                          <span className="block text-[15px] font-semibold text-ink group-hover:text-sky-700">{u.label}</span>
                          <span className="mt-1 block text-[13px] leading-snug text-ink-muted">{u.blurb}</span>
                        </span>
                        <span className="ledger-num mt-1 shrink-0 text-[13px] text-ink-muted group-hover:text-sky-700">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </LedgerBlock>
            </Container>
          </SectionGround>
        )}

        {/* PRICING */}
        {hasPricing && (
          <SectionGround id="pricing" variant="pure" size="lg" className="scroll-mt-[128px]">
            <Container>
              <SectionHead number={pricingNo!} label="Pricing" tone="warm" title="What Leadkaun costs, plainly." />
              <LedgerBlock label="The numbers" first delay={0.06}>
                <dl className="border-t" style={{ borderColor: "var(--paper-line)" }}>
                  {[
                    ["Starting price", g.pricingBlock!.startingPrice],
                    ["Free to start", g.pricingBlock!.freePlan],
                    ["When you sign up", g.pricingBlock!.onSignup],
                    ["Setup", g.pricingBlock!.setup],
                  ].map(([k, v]) => (
                    <div key={k} className="grid gap-x-10 gap-y-1 py-4 sm:grid-cols-[minmax(0,160px)_minmax(0,1fr)]" style={{ borderBottom: "1px solid var(--paper-line)" }}>
                      <dt><Label className="sm:pt-1">{k}</Label></dt>
                      <dd className="max-w-[62ch] text-[15px] leading-[1.55] text-ink">{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <a
                    href={APP_URLS.register}
                    className="btn-gloss-primary inline-flex items-center gap-2 rounded-xl px-5 py-3 text-[14px] font-semibold"
                    style={{ color: "#FFFFFF" }}
                  >
                    Start free →
                  </a>
                  <Link href="/pricing" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-sky-700 hover:text-sky-600">
                    Full pricing →
                  </Link>
                </div>
              </LedgerBlock>
            </Container>
          </SectionGround>
        )}

        {/* FAQ */}
        <SectionGround id="faq" variant="cream" size="lg" className="scroll-mt-[128px]">
          <Container>
            <SectionHead number={faqNo} label="FAQ" tone="warm" title="Common questions." />
            <LedgerBlock label="Questions" first delay={0.06}>
              <Faq items={g.faqs} className="!mx-0 !max-w-[68ch]" />
            </LedgerBlock>
          </Container>
        </SectionGround>

        {/* METHOD — a ranking without a published method is an opinion with numbers */}
        <MethodBlock
          label="How this ranking is made"
          reviewedOn={g.updated}
          sources={REFERENCES.filter((r) => r.kind === "external").map((r) => ({ label: r.label, url: r.href }))}
        >
          <p>
            We build one of the tools in this category, so treat this page accordingly. What we can offer instead of
            neutrality is a published method and a willingness to exclude ourselves.
          </p>
          <p>
            Rankings are built from the criteria listed above, applied in the same order to every tool. Pricing is read
            from each vendor&apos;s public pricing page at the review date, in the currency they actually charge, not
            converted to make a comparison flatter. Capability claims come from vendor documentation, and where a
            capability is tier-gated we say so rather than crediting the product as a whole.
          </p>
          <p>
            Where Leadkaun does not belong in a category, it is not ranked. Our{" "}
            <Link href="/best/lead-routing-software" className="text-sky-700 underline underline-offset-2 hover:text-sky-600"> {/* lk-gate-ignore:lead-assignment */}
              lead routing guide {/* lk-gate-ignore:lead-assignment */}
            </Link>{" "}
            ranks five competitors and excludes us entirely, because we do not do rules-based routing. Claims we make
            about our own product are checked against the shipping code, see{" "}
            <Link href="/methodology" className="text-sky-700 underline underline-offset-2 hover:text-sky-600">our methodology</Link>.
          </p>
          <p>No vendor pays for placement here, and none of these links is affiliate-compensated.</p>
        </MethodBlock>

        {/* KEEP GOING — one links register instead of three separate blocks */}
        {links.length > 0 && (
          <SectionGround variant="cream" size="md">
            <Container>
              <LedgerBlock label="Keep going" first>
                <ul className="grid gap-x-12 gap-y-px sm:grid-cols-2">
                  {links.map((l) => (
                    <li key={l.href} style={{ borderBottom: "1px solid var(--paper-line)" }}>
                      <Link href={l.href} className="group flex items-baseline justify-between gap-4 py-3">
                        <span className="text-[14px] text-ink group-hover:text-sky-700">
                          <span className="ledger-num mr-3 text-[9px] uppercase tracking-[0.16em] text-ink-muted">{l.group}</span>
                          {l.label}
                        </span>
                        <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-ink-faint group-hover:text-sky-700" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </LedgerBlock>
            </Container>
          </SectionGround>
        )}

        <LedgerCTA
          headline="See it grade your own leads."
          sub="Import a CSV and every lead comes back graded A–F with a ranked queue for each rep. Same-day setup, no card, no sales call."
          secondary={{ label: "See pricing", href: "/pricing" }}
        />

        <Footer />
      </main>
    </>
  )
}
