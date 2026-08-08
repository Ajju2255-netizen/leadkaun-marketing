import type { Metadata } from "next"
import Link from "next/link"
import { History, TrendingDown, Search, Lock } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
import { ProofBand } from "@/app/components/sell/blocks"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { PageHero } from "@/app/components/page-hero"
import { NumberedTag } from "@/app/components/numbered-tag"
import { FeatureCard } from "@/app/components/feature-card"
import { Faq } from "@/app/components/faq"
import { Reveal } from "@/app/components/reveal"
import { QuickAnswer } from "@/app/components/quick-answer"
import { MidCta } from "@/app/components/page-blocks"
import { createSectionNumbering } from "@/app/components/section-numbering"

import { faqPageSchema, breadcrumbListSchema, jsonLdScript } from "@/lib/seo"
import { APP_URLS } from "@/lib/urls"

export const metadata: Metadata = {
  title: "Why Did This Lead's Grade Change? — Score Evolution | Leadkaun",
  description:
    "An append-only timeline of every score change on a lead, with grade, confidence and all three sub-scores frozen at each event — so a drop traces to the thing that caused it.",
  alternates: { canonical: "/features/score-evolution" },
}

const CARDS = [
  { icon: History, tag: "Timeline", accent: "sky" as const, title: "Every change, in order",
    description: "Each score event is appended, never overwritten — so the record of how a lead moved survives the lead moving." },
  { icon: Lock, tag: "Frozen", accent: "mint" as const, title: "State as it was",
    description: "Grade, confidence and all three sub-scores are captured at the moment of the change, not recomputed later." },
  { icon: TrendingDown, tag: "Cause", accent: "peach" as const, title: "Why it dropped",
    description: "Intent decay after silence, a duplicate detected, or an ICP change that re-graded the book — each looks different." },
  { icon: Search, tag: "Audit", accent: "cyan" as const, title: "Did the grades predict the outcome?",
    description: "Frozen history is the only way to check whether your scoring was right, rather than assuming it." },
]

const FAQS = [
  { q: "A lead was Grade A yesterday and Grade C today. What happened?", a: "Open the timeline and it will name the event. The most common cause is intent decay: intent falls as a lead goes silent, so a fortnight without a reply moves the grade on its own. Other causes look different — a duplicate detection, or a change to your customer profile that re-graded the whole book at once." },
  { q: "Can a score be edited after the fact?", a: "No. The timeline is appended to, never rewritten. That is what makes it usable as evidence: if entries could be revised, comparing grades against outcomes later would prove nothing." },
  { q: "Is this an audit trail for compliance?", a: "We would not sell it as one. It is a scoring history built so reps and managers can see why a grade moved. Calling it a compliance audit trail would imply guarantees about retention and tamper-evidence that we have not made." },
  { q: "How does this connect to whether the scoring is any good?", a: "Directly. Because each event freezes the state as it was, you can go back over closed deals and ask whether the grades predicted the outcomes. Systematic disagreement — a run of won deals that scored B or C — usually means the customer profile no longer describes your customer." },
]

export default function ScoreEvolutionPage() {
  const n = createSectionNumbering()
  const schemas = [
    breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "Features", url: "/features" }, { name: "Score Evolution" }]),
    faqPageSchema(FAQS),
  ]
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(schemas) }} />
      <main className="min-h-screen bg-bg-pure">
        <Navbar />
        <PageHero
          eyebrow="Feature · Score Evolution"
          h1={<>A grade that changes should <span className="hero-accent">say why.</span></>}
          sub="Scores that move without explanation are scores nobody trusts. Every change is written to a timeline that freezes the state as it was."
          primary={{ kind: "primary", label: "Start free trial", href: APP_URLS.register, external: true }}
          secondary={{ kind: "glass", label: "See the model", href: "/methodology" }}
        />

        <SectionGround variant="pure" size="sm">
          <Container>
            <QuickAnswer
              question="How can I see why a lead's grade changed in Leadkaun?"
              answer="Every score change is written to an append-only timeline on the lead, freezing the grade, the confidence reading and all three sub-scores exactly as they were at that moment. A drop therefore traces back to the event that caused it — intent decaying after a period of silence, a duplicate being detected, or a change to your customer profile that re-graded the book. Entries are never overwritten, which is what makes the history usable for checking whether the grades predicted the outcomes."
            />
          </Container>
        </SectionGround>

        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mx-auto mb-10 max-w-3xl">
              <NumberedTag number={n.next()} tone="warm" label="The trust problem" />
              <h2 className="mt-5 text-[28px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[34px]">
                Reps stop trusting numbers that move on their own.
              </h2>
              <div className="mt-6 space-y-4 text-[16px] leading-[1.65] text-ink-soft">
                <p>
                  A rep opens a lead they were told was Grade A. It now reads C. Nothing on the screen explains the
                  gap, so they draw the obvious conclusion — the scoring is unreliable — and go back to working the
                  inbox by recency. That single unexplained change costs more than the grade was ever worth.
                </p>
                <p>
                  The fix is not a better model. It is showing the working. Once a rep can see that intent decayed
                  after eleven days of silence, the drop stops looking like a glitch and starts looking like the
                  system doing its job.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-5 md:grid-cols-2">
              {CARDS.map((c) => (
                <FeatureCard key={c.title} icon={c.icon} tag={c.tag} accent={c.accent} title={c.title} description={c.description} />
              ))}
            </Reveal>
          </Container>
        </SectionGround>

        <MidCta lead="See the timeline on your own leads." />

        <SectionGround variant="sky" size="lg">
          <Container>
            <Reveal className="mx-auto max-w-3xl">
              <NumberedTag number={n.next()} label="The harder question" />
              <h2 className="mt-5 text-[28px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[34px]">
                What if the scoring is wrong?
              </h2>
              <div className="mt-6 space-y-4 text-[16px] leading-[1.65] text-ink-soft">
                <p>
                  Buyers ask this and vendors mostly deflect. The honest answer is that any scoring model can be wrong,
                  and the only thing that separates a serious one is whether you can find out.
                </p>
                <p>
                  Frozen history is what makes that possible. Because each event captures the state as it was rather
                  than recomputing it later, you can go back over closed deals and compare the grades against what
                  actually happened. A run of won deals that graded B or C is not a scoring bug — it usually means the
                  customer profile no longer describes your customer, which is a twenty-minute fix.
                </p>
                <p>
                  The weights themselves are fixed and published, so there is nothing hidden to blame.{" "}
                  <Link href="/methodology" className="text-sky-600 underline-offset-2 hover:underline">See the full model</Link>.
                </p>
              </div>
            </Reveal>
          </Container>
        </SectionGround>

        <SectionGround variant="cream" size="md">
          <Container>
            <Reveal className="mx-auto mb-10 max-w-3xl text-center">
              <div className="flex justify-center"><NumberedTag number={n.next()} tone="warm" label="FAQ" /></div>
              <h2 className="mt-5 text-[26px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[30px]">Common questions.</h2>
            </Reveal>
            <Reveal delay={0.08}><Faq items={FAQS} /></Reveal>
          </Container>
        </SectionGround>

        <ProofBand />
        
        <CTABanner />
        <Footer />
      </main>
    </>
  )
}
