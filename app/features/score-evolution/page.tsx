import Link from "next/link"
import type { Metadata } from "next"
import type { ReactNode } from "react"
import { History, Gauge, ListOrdered, Upload, Lock, TrendingDown, Search, ArrowRight, Sparkles, type LucideIcon } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"

import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { NumberedTag } from "@/app/components/numbered-tag"
import { FeatureCard } from "@/app/components/feature-card"
import { FloatingCard } from "@/app/components/floating-card"
import { Faq } from "@/app/components/faq"
import { Reveal } from "@/app/components/reveal"
import { GradeBadge } from "@/app/components/demo/primitives"
import { AppReplica } from "@/app/components/app-replica"
import { Voices } from "@/app/components/voices"
import type { Grade } from "@/lib/demo-app"
import { faqPageSchema, breadcrumbListSchema, jsonLdScript, ogMeta } from "@/lib/seo"
import { APP_URLS } from "@/lib/urls"

const title = "Why Did This Lead's Grade Change?, Score Evolution"
const description =
  "An append-only timeline of every score change on a lead, with grade, confidence and all three sub-scores frozen at each event, so a drop traces to the thing that caused it."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/features/score-evolution" },
  ...ogMeta({ title, description, path: "/features/score-evolution" }),
}

/** Inline highlighted term chip for the Quick Answer. */
function Chip({ children, tone = "sky" }: { children: ReactNode; tone?: "sky" | "mint" | "warn" }) {
  const styles: Record<string, string> = {
    sky: "bg-sky-50 text-sky-700 ring-sky-200",
    mint: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    warn: "bg-orange-50 text-orange-700 ring-orange-200",
  }
  return <span className={`whitespace-nowrap rounded-md px-1.5 py-[1px] text-[13.5px] font-semibold ring-1 ${styles[tone]}`}>{children}</span>
}

const CARDS: { icon: LucideIcon; tag: string; title: string; description: string }[] = [
  { icon: History, tag: "Timeline", title: "Every change, in order",
    description: "Each score event is appended, never overwritten, so the record of how a lead moved survives the lead moving." },
  { icon: Lock, tag: "Frozen", title: "State as it was",
    description: "Grade, confidence and all three sub-scores are captured at the moment of the change, not recomputed later." },
  { icon: TrendingDown, tag: "Cause", title: "Why it dropped",
    description: "Intent decay after silence, a duplicate detected, or an ICP change that re-graded the book. Each looks different." },
  { icon: Search, tag: "Back-test", title: "Did the grades predict the outcome?",
    description: "Frozen history is the only way to check whether your scoring was right, rather than assuming it." },
]

// Illustrative score history for the hero (sample events, real mechanic).
const TIMELINE: { grade: Grade; when: string; reason: string; dir: "up" | "down" | "flat" }[] = [
  { grade: "C", when: "today", reason: "14 days silent, intent decayed", dir: "down" },
  { grade: "B", when: "9 days ago", reason: "One reply, then quiet", dir: "down" },
  { grade: "A", when: "22 days ago", reason: "New enquiry, strong ICP fit", dir: "flat" },
]

const PROOF: { Icon: LucideIcon; stat: string; label: string }[] = [
  { Icon: History, stat: "Append-only", label: "Every change kept, never overwritten" },
  { Icon: Lock, stat: "Frozen state", label: "Grade + sub-scores captured as they were" },
  { Icon: TrendingDown, stat: "Named cause", label: "Decay, dedup or ICP change, labelled" },
  { Icon: Search, stat: "Back-testable", label: "Check grades against real outcomes" },
]

const FAQ = [
  { q: "A lead was Grade A yesterday and Grade C today. What happened?", a: "Open the timeline and it will name the event. The most common cause is intent decay: intent falls as a lead goes silent, so a fortnight without a reply moves the grade on its own. Other causes look different, a duplicate detection, or a change to your customer profile that re-graded the whole book at once." },
  { q: "Can a score be edited after the fact?", a: "No. The timeline is appended to, never rewritten. That is what makes it usable as evidence: if entries could be revised, comparing grades against outcomes later would prove nothing." },
  { q: "Is this an audit trail for compliance?", a: "We would not sell it as one. It is a scoring history built so reps and managers can see why a grade moved. Calling it a compliance audit trail would imply guarantees about retention and tamper-evidence that we have not made." },
  { q: "How does this connect to whether the scoring is any good?", a: "Directly. Because each event freezes the state as it was, you can go back over closed deals and ask whether the grades predicted the outcomes. Systematic disagreement, a run of won deals that scored B or C, usually means the customer profile no longer describes your customer." },
]

const RELATED = [
  { icon: Gauge, title: "Lead Scoring", description: "The engine whose every move this timeline records. See how the grade is built.", href: "/features/lead-scoring" },
  { icon: ListOrdered, title: "Priority Queue", description: "A grade change here re-ranks the lead in the queue, with the reason attached.", href: "/features/priority-queue" },
  { icon: Upload, title: "Intake Intelligence", description: "Same instinct, one step earlier: show the working so a number can be trusted.", href: "/features/intake-intelligence" },
]

export default function ScoreEvolutionPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript([breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "Features", url: "/features" }, { name: "Score Evolution" }]), faqPageSchema(FAQ)]) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        {/* HERO — split, score timeline right */}
        <section className="relative overflow-hidden border-b rule-paper" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, var(--paper) 100%)" }}>
          <div aria-hidden className="pointer-events-none absolute -right-32 -top-24 h-[460px] w-[620px] rounded-full opacity-[0.30] blur-[130px]" style={{ background: "radial-gradient(circle, #BAE6FD 0%, transparent 70%)" }} />
          <Container className="relative pt-32 pb-16 md:pt-40 md:pb-24">
            <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
              <div className="rise" style={{ animationDelay: "40ms" }}>
                <p className="ledger-num inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-sky-600">
                  <History className="h-3.5 w-3.5" strokeWidth={2} /> Score Evolution
                </p>
                <h1 className="display-xl mt-6 text-[40px] text-ink sm:text-[52px] lg:text-[58px]">
                  A grade that changes
                  <br />
                  <span className="relative inline-block text-sky-600">
                    should say why.
                    <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-sky-200" />
                  </span>
                </h1>
                <p className="mt-7 max-w-xl text-[17px] leading-[1.7] text-ink-soft md:text-[18px]">
                  A number that moves on its own is a number reps stop trusting. Score Evolution keeps an append-only timeline of every change, grade, confidence and all three sub-scores frozen at each event, so a drop from A to C traces to the exact thing that caused it.
                </p>
                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <a href={APP_URLS.register} className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-[15px] font-semibold transition-all hover:-translate-y-0.5" style={{ background: "#0877B8", color: "#FFFFFF", boxShadow: "0 8px 20px -10px rgba(15,23,42,0.35)" }}>
                    Start free <ArrowRight className="h-4 w-4" />
                  </a>
                  <Link href="/features/lead-scoring" className="inline-flex items-center gap-2 rounded-xl border bg-white px-6 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:border-sky-300" style={{ borderColor: "var(--paper-line-2)" }}>
                    See lead scoring <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Score timeline */}
              <div className="rise" style={{ animationDelay: "160ms" }}>
                <FloatingCard tier="2" depth="3" gloss aura="sky" className="mx-auto max-w-md p-5 md:p-6">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Priya Sharma · score history</p>
                    <span className="rounded-full bg-sky-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-sky-700 ring-1 ring-sky-100">append-only</span>
                  </div>
                  <div className="mt-4 space-y-3">
                    {TIMELINE.map((e, i) => (
                      <div key={e.when} className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <GradeBadge grade={e.grade} size="sm" />
                          {i < TIMELINE.length - 1 && <span aria-hidden className="mt-1 h-6 w-px bg-ink/10" />}
                        </div>
                        <div className="min-w-0 flex-1 pt-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-semibold text-ink">Grade {e.grade}</span>
                            {e.dir === "down" && <TrendingDown className="h-3.5 w-3.5 text-rose-500" />}
                            <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted">{e.when}</span>
                          </div>
                          <p className="mt-0.5 text-[12px] leading-snug text-ink-soft">{e.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3.5 text-[11px] leading-snug text-ink-muted">Illustrative. Each event freezes the full score state as it was at that moment.</p>
                </FloatingCard>
              </div>
            </div>
          </Container>
        </section>

        {/* 01 — THE LIVE PRODUCT (AppReplica opened on a lead) */}
        <SectionGround variant="sky" size="lg">
          <Container>
            <Reveal className="mb-8 max-w-3xl">
              <NumberedTag number="01" label="The live product" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Open a lead and read its whole history.
              </h2>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
                This is the actual lead view. Log a call or a WhatsApp reply and watch a new event append to the timeline, with the grade and sub-scores it produced.
              </p>
            </Reveal>
          </Container>
          <Reveal delay={0.06} className="mx-auto w-full max-w-[1360px] px-4 md:px-8">
            <AppReplica initialView="lead" />
          </Reveal>
        </SectionGround>

        {/* QUICK ANSWER — accent card, chipped terms */}
        <SectionGround variant="pure" size="sm">
          <Container>
            <div className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl border bg-white p-6 pl-7 md:p-8 md:pl-10" style={{ borderColor: "var(--paper-line)" }} data-quick-answer>
              <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", speakable: { "@type": "SpeakableSpecification", cssSelector: [".quick-answer-q", ".quick-answer-a"] } }) }} />
              <span aria-hidden className="absolute inset-y-0 left-0 w-1.5" style={{ background: "#0877B8" }} />
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-sky-500" aria-hidden />
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-600">Quick answer</p>
              </div>
              <p className="quick-answer-q mt-3 text-[16px] font-semibold text-ink md:text-[17px]">What is Score Evolution and why did a lead&apos;s grade change?</p>
              <p className="quick-answer-a mt-3 text-[16px] leading-[1.75] text-ink-soft">
                Score Evolution is an <Chip>append-only timeline</Chip> of every score change on a lead. Each event <Chip tone="mint">freezes the grade, confidence and sub-scores</Chip> as they were, so a drop from A to C names its cause, usually <Chip tone="warn">intent decay</Chip> after silence, sometimes a duplicate or an ICP change. It is a scoring history, not a compliance audit trail, and we do not claim it as one.
              </p>
            </div>
          </Container>
        </SectionGround>

        {/* 02 — WHAT THE TIMELINE HOLDS */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mb-12 max-w-3xl md:mb-16">
              <NumberedTag number="02" tone="warm" label="What it holds" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Reps stop trusting numbers that move on their own.
              </h2>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
                The fix is not fewer changes; it is a reason attached to every one. Four things the timeline keeps.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-5 md:grid-cols-2">
              {CARDS.map(({ icon: Icon, tag, title: t, description }) => (
                <FloatingCard key={tag} tier="2" depth="2" gloss className="p-6 md:p-7">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-sky-50 text-sky-600 ring-1 ring-sky-100"><Icon className="h-[18px] w-[18px]" strokeWidth={2} /></span>
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">{tag}</span>
                  </div>
                  <p className="mt-4 text-[16px] font-semibold text-ink">{t}</p>
                  <p className="mt-2 text-[14px] leading-[1.6] text-ink-soft">{description}</p>
                </FloatingCard>
              ))}
            </Reveal>
          </Container>
        </SectionGround>

        {/* 03 — WHY IT DROPPED (text left, worked timeline right) */}
        <SectionGround variant="pure" size="lg">
          <Container>
            <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
              <div>
                <NumberedTag number="03" label="A worked example" />
                <h2 className="mt-5 text-[30px] font-semibold leading-[1.12] tracking-[-0.03em] text-ink md:text-[38px]">
                  Grade A yesterday, Grade C today.
                </h2>
                <p className="mt-5 text-[16px] leading-[1.65] text-ink-soft">
                  Nobody touched the lead, and that is exactly the problem, silence is a signal. Intent falls as a lead goes quiet, so a fortnight without a reply moves the grade on its own. The timeline names it, so a rep sees a cause instead of a mystery.
                </p>
              </div>
              <Reveal delay={0.06}>
                <FloatingCard tier="3" depth="3" gloss className="p-6 md:p-7">
                  {[
                    { g: "A" as Grade, sub: "Fit 82 · Intent 70 · Quality 60", when: "day 0", note: "New enquiry, strong ICP fit" },
                    { g: "B" as Grade, sub: "Fit 82 · Intent 48 · Quality 60", when: "day 9", note: "One reply, then quiet" },
                    { g: "C" as Grade, sub: "Fit 82 · Intent 22 · Quality 60", when: "day 22", note: "14 days silent, intent decayed" },
                  ].map((e, i, arr) => (
                    <div key={e.when} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <GradeBadge grade={e.g} size="sm" />
                        {i < arr.length - 1 && <span aria-hidden className="mt-1 h-8 w-px bg-ink/10" />}
                      </div>
                      <div className="min-w-0 flex-1 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[13.5px] font-semibold text-ink">Grade {e.g}</span>
                          <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted">{e.when}</span>
                        </div>
                        <p className="mt-0.5 font-mono text-[11px] text-ink-muted">{e.sub}</p>
                        <p className="mt-1 text-[12.5px] leading-snug text-ink-soft">{e.note}</p>
                      </div>
                    </div>
                  ))}
                  <p className="border-t pt-3.5 text-[12px] leading-snug text-ink-muted rule-paper">Fit and Quality held. Only Intent moved, and the timeline says so.</p>
                </FloatingCard>
              </Reveal>
            </div>
          </Container>
        </SectionGround>

        {/* 04 — WHAT WE WON'T CALL IT */}
        <SectionGround variant="sky" size="lg">
          <Container>
            <Reveal className="mb-10 max-w-3xl">
              <NumberedTag number="04" label="An honest boundary" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                A scoring history. Not a compliance audit trail.
              </h2>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-5 md:grid-cols-2">
              <FloatingCard tier="2" depth="2" gloss aura="sky" className="p-6 md:p-7">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-600">What it is</p>
                <p className="mt-3 text-[17px] font-semibold leading-snug text-ink">A record of why a grade moved, that reps and managers can read.</p>
                <p className="mt-3 text-[13.5px] leading-[1.6] text-ink-soft">Append-only, so it holds up as evidence when you back-test grades against closed deals.</p>
              </FloatingCard>
              <FloatingCard tier="2" depth="2" gloss aura="peach" className="p-6 md:p-7">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-orange-600">What we won&apos;t claim</p>
                <p className="mt-3 text-[17px] font-semibold leading-snug text-ink">Tamper-evidence or retention guarantees for a compliance regime.</p>
                <p className="mt-3 text-[13.5px] leading-[1.6] text-ink-soft">Calling it a compliance audit trail would imply promises we have not made. So we don&apos;t.</p>
              </FloatingCard>
            </Reveal>
          </Container>
        </SectionGround>

        {/* 05 — IN THEIR WORDS (illustrative placeholders, not real customer statements) */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mb-12 max-w-2xl">
              <NumberedTag number="05" tone="warm" label="In their words" />
              <h2 className="display-md mt-5 text-[30px] text-ink md:text-[40px]">
                A rep will not act on a grade they cannot explain.
              </h2>
            </Reveal>
            <Reveal delay={0.08}><Voices /></Reveal>
          </Container>
        </SectionGround>

        {/* 06 — FAQ */}
        <SectionGround variant="pure" size="md">
          <Container>
            <Reveal className="mx-auto mb-10 max-w-3xl text-center">
              <div className="flex justify-center"><NumberedTag number="06" label="FAQ" /></div>
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">History questions.</h2>
            </Reveal>
            <Reveal delay={0.08}><Faq items={FAQ} /></Reveal>
          </Container>
        </SectionGround>

        {/* 07 — WORKS WITH */}
        <SectionGround variant="cream" size="md">
          <Container>
            <Reveal className="mb-10">
              <NumberedTag number="07" tone="warm" label="Works with" />
              <h2 className="mt-5 max-w-3xl text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[36px]">
                The timeline records the score. Here&apos;s what it records.
              </h2>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-5 md:grid-cols-3 md:gap-6">
              {RELATED.map((r, i) => <FeatureCard key={r.href} {...r} variant={i % 2 === 1 ? "soft" : "default"} />)}
            </Reveal>
          </Container>
        </SectionGround>

        {/* PROOF — product-mechanics stat tiles */}
        <SectionGround variant="pure" size="md">
          <Container>
            <Reveal className="mb-7 text-center">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                Product mechanics, published in full at{" "}
                <Link href="/methodology" className="text-sky-600 hover:underline">/methodology</Link>
              </p>
            </Reveal>
            <Reveal delay={0.06} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {PROOF.map(({ Icon, stat, label }) => (
                <FloatingCard key={stat} tier="2" depth="2" gloss aura="sky" className="p-6 text-center">
                  <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 ring-1 ring-sky-100"><Icon className="h-5 w-5" strokeWidth={2} /></span>
                  <p className="mt-4 text-[26px] font-semibold tracking-[-0.02em] text-ink md:text-[30px]">{stat}</p>
                  <p className="mt-1.5 text-[13px] leading-snug text-ink-soft">{label}</p>
                </FloatingCard>
              ))}
            </Reveal>
          </Container>
        </SectionGround>

        {/* CLOSING CTA */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mx-auto max-w-4xl">
              <div className="relative overflow-hidden rounded-3xl border p-10 text-center md:p-14" style={{ borderColor: "var(--paper-line)", background: "linear-gradient(180deg,#FFFFFF, var(--paper))" }}>
                <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-96 rounded-full opacity-30 blur-[110px]" style={{ background: "radial-gradient(circle,#BAE6FD 0%,transparent 70%)" }} />
                <p className="ledger-num relative text-[11px] uppercase tracking-[0.22em] text-sky-600">08 · Ready when you are</p>
                <h2 className="display-lg relative mx-auto mt-5 max-w-2xl text-[30px] text-ink md:text-[44px]">
                  Give every grade{" "}
                  <span className="relative inline-block text-sky-600">
                    a reason reps can read.
                    <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-sky-200" />
                  </span>
                </h2>
                <p className="relative mx-auto mt-6 max-w-xl text-[16px] leading-[1.7] text-ink-soft">
                  Import your leads. From the first score onward, every change is recorded, so nobody has to guess why a grade moved.
                </p>
                <div className="relative mt-9 flex flex-wrap items-center justify-center gap-3">
                  <a href={APP_URLS.register} className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-[15px] font-semibold transition-all hover:-translate-y-0.5" style={{ background: "#0877B8", color: "#FFFFFF", boxShadow: "0 8px 20px -10px rgba(15,23,42,0.35)" }}>
                    Start free <ArrowRight className="h-4 w-4" />
                  </a>
                  <Link href="/pricing" className="inline-flex items-center gap-2 rounded-xl border bg-white px-6 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:border-sky-300" style={{ borderColor: "var(--paper-line-2)" }}>
                    See pricing
                  </Link>
                </div>
                <p className="ledger-num relative mt-8 text-[11.5px] uppercase tracking-[0.16em] text-ink-muted">Free ₹0 · no card · same-day setup</p>
              </div>
            </Reveal>
          </Container>
        </SectionGround>

        <Footer />
      </main>
    </>
  )
}
