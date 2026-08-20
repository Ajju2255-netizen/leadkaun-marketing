import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"

import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { Faq } from "@/app/components/faq"
import { QuickAnswer } from "@/app/components/quick-answer"
import {
  InlineCta, JumpNav, LedgerBlock, LedgerCTA, LedgerMasthead, MethodBlock, No, RankedEntry, SectionHead,
} from "@/app/components/ledger"
import { getAlternatives, getAlternative } from "@/lib/pseo/lookup"
import { breadcrumbListSchema, faqPageSchema, jsonLdScript, canonical } from "@/lib/seo"

export const revalidate = 86400

/** Date the competitor claims and pricing on these guides were last checked. */
const REVIEWED = "13 Aug 2026"

type Alt = { rank: number; name: string; isLeadkaun?: boolean; tagline: string; bestFor: string; watchOut: string; url: string }
type AltGuide = {
  slug: string; name: string; metaTitle: string; metaDescription: string; h1: string; intro: string
  quickAnswer: { question: string; answer: string }; whyLookElsewhere: string[]
  alternatives: Alt[]; faqs: { q: string; a: string }[]; comparePage: string
  relatedGuides?: { label: string; href: string }[]
  /** "You may not need to rip {name} out — run Leadkaun alongside it." */
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

  const nav = [
    { id: "read", label: "The read" },
    { id: "list", label: "The alternatives" },
    ...(g.runAlongside ? [{ id: "alongside", label: "Keep it, add us" }] : []),
    { id: "faq", label: "FAQ" },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(schemas) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        <LedgerMasthead
          meta={["Alternatives", `Reviewed ${REVIEWED}`, "We build one of these"]}
          h1={g.h1}
          lead={g.intro}
          secondary={{ label: `Leadkaun vs ${g.name}`, href: `/compare/${g.comparePage}` }}
        />

        <JumpNav items={nav} />

        {/* 01 — THE READ */}
        <SectionGround id="read" variant="pure" size="lg" className="scroll-mt-[128px]">
          <Container>
            <SectionHead number="01" label="The read" title={`Why teams leave ${g.name}.`} />

            <LedgerBlock label="Overview" first>
              <div className="[&>[data-quick-answer]]:!mx-0 [&>[data-quick-answer]]:!max-w-none">
                <QuickAnswer question={g.quickAnswer.question} answer={g.quickAnswer.answer} />
              </div>
            </LedgerBlock>

            <LedgerBlock label="The friction" delay={0.06}>
              <ul className="grid gap-3 sm:grid-cols-2 sm:gap-x-12">
                {g.whyLookElsewhere.map((w, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[14px] leading-[1.55] text-ink-soft md:text-[15px]">
                    <span className="mt-0.5"><No /></span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-[14px] text-ink-muted">
                Want it feature by feature instead?{" "}
                <Link href={`/compare/${g.comparePage}`} className="font-semibold text-sky-700 hover:text-sky-600">
                  Leadkaun vs {g.name}
                </Link>
                .
              </p>
            </LedgerBlock>
            <InlineCta />
          </Container>
        </SectionGround>

        {/* 02 — THE ALTERNATIVES */}
        <SectionGround id="list" variant="cream" size="lg" className="scroll-mt-[128px]">
          <Container>
            <SectionHead
              number="02"
              label="The alternatives"
              title={`${g.alternatives.length} honest alternatives to ${g.name}.`}
              sub="Ranked by fit for Indian B2B SMBs, with the catch stated for each — including ours."
            />
            <ol className="border-b" style={{ borderColor: "var(--paper-line)" }}>
              {g.alternatives.map((a) => (
                <RankedEntry
                  key={a.rank}
                  rank={a.rank}
                  name={a.name}
                  tagline={a.tagline}
                  ours={a.isLeadkaun}
                  rows={[
                    { label: "Best for", value: a.bestFor },
                    { label: "Watch-out", value: a.watchOut },
                  ]}
                  href={a.url.startsWith("/") ? a.url : undefined}
                  hrefLabel={a.isLeadkaun ? "See the comparison" : "Compare with Leadkaun"}
                />
              ))}
            </ol>
          </Container>
        </SectionGround>

        {/* 03 — THE HYBRID WEDGE: you may not need to rip it out */}
        {g.runAlongside && (
          <SectionGround id="alongside" variant="pure" size="lg" className="scroll-mt-[128px]">
            <Container>
              <SectionHead number="03" label="Or don't switch" title={`Keep ${g.name}. Add the layer it lacks.`} />
              <LedgerBlock label="Run alongside" first>
                <p className="max-w-[62ch] text-[16px] leading-[1.7] text-ink-soft md:text-[17px]">{g.runAlongside}</p>
                <p className="mt-6 text-[14px] text-ink-muted">
                  Exactly where they overlap:{" "}
                  <Link href={`/compare/${g.comparePage}`} className="font-semibold text-sky-700 hover:text-sky-600">
                    Leadkaun vs {g.name}
                  </Link>
                  .
                </p>
              </LedgerBlock>
            </Container>
          </SectionGround>
        )}

        {/* 04 — FAQ */}
        <SectionGround id="faq" variant="cream" size="lg" className="scroll-mt-[128px]">
          <Container>
            <SectionHead number={g.runAlongside ? "04" : "03"} label="FAQ" tone="warm" title="Common questions." />
            <LedgerBlock label="Questions" first delay={0.06}>
              <Faq items={g.faqs} className="!mx-0 !max-w-[68ch]" />
            </LedgerBlock>
          </Container>
        </SectionGround>

        <MethodBlock label="How this list is made" reviewedOn={REVIEWED}>
          <p>
            We build one of the tools on this list, so read it accordingly. What we can offer instead of neutrality is
            a stated method and a watch-out on every entry, including our own.
          </p>
          <p>
            Entries are ordered by fit for Indian B2B SMBs, not by popularity or by what pays. Capability claims come
            from each vendor&apos;s own documentation, and pricing is read from their public pricing page at the review
            date, in the currency they actually charge. Claims about Leadkaun are checked against the shipping code,
            see <Link href="/methodology" className="text-sky-700 underline underline-offset-2 hover:text-sky-600">our methodology</Link>.
          </p>
          <p>
            Nobody pays for placement here, and none of these links is affiliate-compensated. Where {g.name} is still
            the better answer, the entry for it says so.
          </p>
        </MethodBlock>

        {g.relatedGuides && g.relatedGuides.length > 0 && (
          <SectionGround variant="pure" size="md">
            <Container>
              <div className="grid gap-12 lg:grid-cols-[minmax(0,168px)_minmax(0,1fr)] lg:gap-x-10">
                <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted lg:pt-1.5">
                  Keep going
                </p>
                <div>
                  {g.relatedGuides.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="group flex items-baseline justify-between gap-4 border-b py-3.5 text-[15px] text-ink transition-colors hover:text-sky-600 md:text-[16px]"
                      style={{ borderColor: "var(--paper-line)" }}
                    >
                      <span>{l.label}</span>
                      <span aria-hidden className="font-mono text-[13px] text-ink-faint transition-colors group-hover:text-sky-600">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            </Container>
          </SectionGround>
        )}

        <LedgerCTA
          headline={`See how Leadkaun grades your ${g.name} leads.`}
          sub={`Export a CSV from ${g.name}, import it, and watch every lead come back graded A–F with a ranked queue. No card, no call.`}
          secondary={{ label: `Leadkaun vs ${g.name}`, href: `/compare/${g.comparePage}` }}
        />

        <Footer />
      </main>
    </>
  )
}
