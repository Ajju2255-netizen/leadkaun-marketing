import type { Metadata } from "next"
import Link from "next/link"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { PageHero } from "@/app/components/page-hero"
import { NumberedTag } from "@/app/components/numbered-tag"
import { FloatingCard } from "@/app/components/floating-card"
import { Reveal } from "@/app/components/reveal"
import { QuickAnswer } from "@/app/components/quick-answer"
import { Faq } from "@/app/components/faq"
import { ReviewStamp, AuthorLine } from "@/app/components/page-blocks"
import { createSectionNumbering } from "@/app/components/section-numbering"
import { breadcrumbListSchema, faqPageSchema, articleSchema, jsonLdScript } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Methodology — How Leadkaun Scores, Ranks and Verifies | Leadkaun",
  description:
    "The published mechanics behind every Leadkaun claim: the Fit, Intent and Quality inputs, the A–F threshold matrix, intent decay, freshness bands, and how we check marketing copy against the shipping product.",
  alternates: { canonical: "/methodology" },
}

/**
 * /methodology — the site's substitute for case studies.
 *
 * Real customer results are not available yet, and an empty /customers shell
 * would be a visible credibility hole that invites fabrication later. The honest
 * first-party asset we DO have is the engine's own mechanics: weights, thresholds,
 * decay rates and guards. Competitors structurally cannot copy this page, because
 * publishing it means committing to fixed, auditable weights.
 *
 * Every figure here is the value the product actually applies.
 */

const SCORES = [
  {
    tag: "Fit",
    range: "0–100",
    what: "How closely a lead matches the customer profile you configure.",
    inputs: "Industry, state, business type, decision-maker role and budget band — all set once per account in the onboarding wizard.",
    note: "This is the part you shape. You define who a good customer is; the arithmetic on top is fixed.",
  },
  {
    tag: "Intent",
    range: "0–100",
    what: "Live engagement, measured from signal events rather than assumed.",
    inputs: "Source strength plus events — a logged WhatsApp reply, an answered call, a pricing question, a negotiation. Each carries a published weight.",
    note: "Intent decays as a lead goes silent and is floored at the source baseline, so a lead never drops below where it started.",
  },
  {
    tag: "Quality",
    range: "0–100",
    what: "Whether the record can be trusted at all.",
    inputs: "Phone validity, email presence, company and enquiry completeness, source reliability, plus duplicate and junk detection on insert.",
    note: "Quality acts as a cap, not an average. Below 20 the lead is Grade F regardless of Fit and Intent.",
  },
]

const GUARDS = [
  { k: "Grade A (post-contact)", v: "Fit ≥ 65 · Intent ≥ 60 · Quality ≥ 60" },
  { k: "F guard", v: "Quality < 20 forces Grade F, always" },
  { k: "Intent decay", v: "−3 points/day after the engagement threshold (default 28 days)" },
  { k: "Decay floor", v: "Intent never falls below the lead's source baseline" },
  { k: "Weights", v: "Fixed and identical for every account — not customer-tunable" },
]

const FAQS = [
  {
    q: "Why publish the weights at all?",
    a: "Because a grade a rep cannot interrogate is a grade a rep ignores. Fixed, published weights mean two managers comparing notes are looking at the same scale, and a rep can always be shown exactly why a lead is Grade A. The cost is that you cannot tune the model per account — that is a deliberate trade, not a missing feature.",
  },
  {
    q: "Are the numbers on this page the ones the product uses?",
    a: "Yes. They are read from the shipping scoring model, not from a marketing summary of it. If the product changes, this page is wrong until it is updated, which is why it carries a review date.",
  },
  {
    q: "How do you stop marketing copy from over-claiming?",
    a: "A machine check. The repository holds a ledger of what each capability actually does, with the file paths that prove it, and the build fails if any page claims more than the ledger allows. It also fails if a capability's evidence path disappears, which forces a re-audit rather than letting a stale claim survive quietly.",
  },
  {
    q: "Do you publish customer results?",
    a: "Not yet. We do not have consented customer outcomes to publish, so we do not publish any — the figures elsewhere on this site that model recovered revenue are labelled as illustrative models, not results. When real case studies exist they will replace those labels.",
  },
]

export default function MethodologyPage() {
  const n = createSectionNumbering()
  const schemas = [
    breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "Methodology" }]),
    articleSchema({
      headline: "How Leadkaun scores, ranks and verifies",
      description: "The published mechanics behind Leadkaun's lead grading, ranking and claim verification.",
      datePublished: "2026-08-06",
      url: "/methodology",
    }),
    faqPageSchema(FAQS),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(schemas) }} />
      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        <PageHero
          eyebrow="Methodology"
          h1={<>How Leadkaun scores, ranks and <span className="hero-accent">verifies.</span></>}
          sub="Every threshold on this page is the one the product applies. We publish the mechanism because a grade nobody can interrogate is a grade nobody trusts."
        />

        <SectionGround variant="pure" size="sm">
          <Container>
            <QuickAnswer
              question="How does Leadkaun decide a lead's grade?"
              answer="Leadkaun computes three independent 0–100 scores for every lead — Fit (how well it matches the customer profile you configured), Intent (live engagement from signal events, which decays as the lead goes quiet), and Quality (whether the record can be trusted). Those combine into an A–F grade on fixed thresholds: Grade A requires Fit of at least 65, Intent at least 60 and Quality at least 60. A Quality score below 20 forces Grade F regardless of the other two. The weights are identical for every account and are not customer-tunable."
            />
          </Container>
        </SectionGround>

        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mb-10 max-w-3xl">
              <NumberedTag number={n.next()} tone="warm" label="The three scores" />
              <h2 className="mt-5 text-[30px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[38px]">
                What each score actually measures.
              </h2>
              <p className="mt-4 text-[16px] leading-[1.6] text-ink-soft">
                They are kept separate on purpose. One blended number tells a rep a lead is a 62, which is not an
                instruction. Three tell them it is a strong-fit lead that has gone quiet — which is.
              </p>
            </Reveal>
            <div className="grid gap-5 md:grid-cols-3">
              {SCORES.map((s) => (
                <Reveal key={s.tag} delay={0.04}>
                  <FloatingCard tier="3" depth="3" gloss className="h-full p-7">
                    <div className="flex items-baseline justify-between">
                      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-600">{s.tag}</p>
                      <p className="font-mono text-[12px] text-ink-muted tabular">{s.range}</p>
                    </div>
                    <p className="mt-4 text-[15px] font-medium leading-[1.55] text-ink">{s.what}</p>
                    <p className="mt-3 text-[14px] leading-[1.6] text-ink-soft">{s.inputs}</p>
                    <p className="mt-3 text-[14px] leading-[1.6] text-ink-muted">{s.note}</p>
                  </FloatingCard>
                </Reveal>
              ))}
            </div>
          </Container>
        </SectionGround>

        <SectionGround variant="sky" size="lg">
          <Container>
            <Reveal className="mb-8 max-w-3xl">
              <NumberedTag number={n.next()} label="The thresholds" />
              <h2 className="mt-5 text-[30px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[38px]">
                The exact cut-offs.
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <FloatingCard tier="3" depth="3" gloss className="overflow-hidden">
                <ul className="divide-y" style={{ borderColor: "var(--hairline)" }}>
                  {GUARDS.map((g) => (
                    <li key={g.k} className="flex flex-col gap-1 px-7 py-5 sm:flex-row sm:items-baseline sm:justify-between">
                      <span className="text-[15px] font-medium text-ink">{g.k}</span>
                      <span className="font-mono text-[14px] text-ink-soft tabular">{g.v}</span>
                    </li>
                  ))}
                </ul>
              </FloatingCard>
            </Reveal>
          </Container>
        </SectionGround>

        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mx-auto max-w-3xl">
              <NumberedTag number={n.next()} tone="warm" label="How claims are checked" />
              <h2 className="mt-5 text-[30px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[38px]">
                Marketing copy is checked against the product, by machine.
              </h2>
              <div className="mt-6 space-y-4 text-[16px] leading-[1.65] text-ink-soft">
                <p>
                  Marketing sites drift from products. Ours did: for a period this site described rules-based lead
                  routing, round-robin distribution and an unassigned-lead queue. None of those exist. They were not {/* lk-gate-ignore:lead-assignment */}
                  invented maliciously — a page cited another page, which cited a third, and nothing ever checked the
                  chain against code.
                </p>
                <p>
                  So the repository now holds a ledger of every capability, what may honestly be said about it, and the
                  product file paths that prove it. The build fails if a page claims more than the ledger allows, and it
                  also fails if one of those evidence paths disappears — which forces a fresh audit instead of letting a
                  stale claim quietly survive.
                </p>
                <p>
                  The same check runs in reverse. It reports capabilities the product ships that the site never
                  mentions, because under-claiming is a cost too.
                </p>
                <p>
                  Where we do not fit, we say so. Our{" "}
                  <Link href="/best/lead-routing-software" className="text-sky-600 underline-offset-2 hover:underline"> {/* lk-gate-ignore:lead-assignment */}
                    guide to lead routing software {/* lk-gate-ignore:lead-assignment */}
                  </Link>{" "}
                  ranks other tools and excludes Leadkaun entirely.
                </p>
              </div>
            </Reveal>
          </Container>
        </SectionGround>

        <SectionGround variant="pure" size="lg">
          <Container>
            <Reveal className="mb-8 max-w-3xl">
              <NumberedTag number={n.next()} label="FAQ" />
              <h2 className="mt-5 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[34px]">
                Questions about the model.
              </h2>
            </Reveal>
            <Reveal delay={0.08}><Faq items={FAQS} /></Reveal>
          </Container>
        </SectionGround>

        <ReviewStamp updated="August 2026" reviewedBy="the Leadkaun product team" cadence="quarterly" />
        <SectionGround variant="pure" size="sm">
          <Container><Reveal className="mx-auto max-w-3xl"><AuthorLine /></Reveal></Container>
        </SectionGround>

        <CTABanner />
        <Footer />
      </main>
    </>
  )
}
