import Link from "next/link"
import type { Metadata } from "next"
import type { ReactNode } from "react"
import { ListOrdered, Gauge, AlertTriangle, Mail, ArrowRight, Sparkles, Clock, IndianRupee, SlidersHorizontal, type LucideIcon } from "lucide-react"

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

const title = "The Priority Queue, one ranked list per rep"
const description =
  "Leadkaun's Priority Queue is one live-ranked list of who each rep should contact next. It re-ranks in real time as signals arrive, a new Grade A lead, a WhatsApp reply, or intent decay, so reps work top-down instead of triaging."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/features/priority-queue" },
  ...ogMeta({ title, description, path: "/features/priority-queue" }),
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

const RANK_WEIGHTS = [
  { label: "Grade (A / B / C / D / F)", pts: "4000 · 3000 · 2000 · 500 · −1" },
  { label: "Callback due today", pts: "+1500" },
  { label: "Follow-up overdue", pts: "+800" },
  { label: "Re-engagement after silence", pts: "+2000" },
  { label: "Intent +10 in 24 h", pts: "+1000" },
  { label: "Recency (0–500)", pts: "+0 to +500" },
  { label: "Fatigued (6+ touches, no signal)", pts: "−1 (bottom)" },
]

// Illustrative queue rows for the hero (sample data, real ranking logic).
const HERO_QUEUE: { rank: number; grade: Grade; name: string; org: string; tag: string; next?: boolean }[] = [
  { rank: 1, grade: "A", name: "Sunil Bafna", org: "Site visit, Baner", tag: "Re-engaged +2000", next: true },
  { rank: 2, grade: "A", name: "Priya Textiles", org: "WhatsApp reply", tag: "Intent +1000" },
  { rank: 3, grade: "B", name: "Rangoli Toolworks", org: "Callback due", tag: "+1500" },
  { rank: 4, grade: "C", name: "Nucleus Labs", org: "Follow-up overdue", tag: "+800" },
]

const PERF = [
  { v: "30s", l: "Queue refresh interval", h: "Polling via React Query, no realtime overhead per row" },
  { v: "< 2s", l: "Queue load for 5,000 leads", h: "Paginated 100/page, infinite scroll" },
  { v: "Real-time", l: "Re-rank latency on signal", h: "Deterministic TypeScript, no DB triggers" },
]

const PROOF: { Icon: LucideIcon; stat: string; label: string }[] = [
  { Icon: ListOrdered, stat: "One list", label: "Per rep, top-down, no triage" },
  { Icon: SlidersHorizontal, stat: "Published", label: "Fixed rank weights, not a black box" },
  { Icon: Clock, stat: "Same day", label: "First queue built on import" },
  { Icon: IndianRupee, stat: "Flat ₹", label: "Priced per account, not per seat" },
]

const FAQ = [
  { q: "How is the queue different from a to-do list?", a: "A to-do list is static, whatever the rep added yesterday. A Priority Queue is dynamic. It re-ranks every time a signal arrives. New Grade A enquiry at 11 AM? Top of queue by 11:01. A WhatsApp reply bumps a lead up. Intent decay drops stale leads. The queue always reflects now, not yesterday." },
  { q: "What if my rep wants to work their own order?", a: "They can pin one lead to the top of the day, but auto-ranking resumes at midnight. Most reps override twice in week one, then stop, working the queue in order consistently beats re-sorting it by gut-feel." },
  { q: "How fast does the queue update?", a: "React Query polls every 30 seconds by default, fast enough that a new Grade A arrival or WhatsApp reply shows in the queue before the rep finishes their current call." },
  { q: "What is a 'fatigued' lead?", a: "A lead that has been contacted 6+ times with no positive signal. The queue drops them to rank score -1 (bottom) automatically so the rep doesn't keep burning time. You can manually un-fatigue a lead if circumstances change." },
  { q: "Does the queue work on mobile?", a: "Yes. Mobile-first layout, 3-tap logging, works on patchy 3G. Field reps in manufacturing / real estate use Leadkaun exclusively from phones." },
]

const RELATED = [
  { icon: Gauge, title: "Lead Scoring Engine", description: "The queue only works if every lead is graded correctly first. See how scoring works.", href: "/features/lead-scoring" },
  { icon: AlertTriangle, title: "Missed Opportunity Engine", description: "Stale Grade A leads drop in the queue, and get surfaced with a ₹ value to recover.", href: "/features/missed-opportunity-engine" },
  { icon: Mail, title: "Morning Brief", description: "The queue's top leads for each rep, emailed at 8:30 AM IST every weekday.", href: "/features/morning-brief" },
]

export default function PriorityQueuePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript([breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "Features", url: "/features" }, { name: "Priority Queue" }]), faqPageSchema(FAQ)]) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        {/* HERO — split, live queue visual right */}
        <section className="relative overflow-hidden border-b rule-paper" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, var(--paper) 100%)" }}>
          <div aria-hidden className="pointer-events-none absolute -right-32 -top-24 h-[460px] w-[620px] rounded-full opacity-[0.30] blur-[130px]" style={{ background: "radial-gradient(circle, #BAE6FD 0%, transparent 70%)" }} />
          <Container className="relative pt-32 pb-16 md:pt-40 md:pb-24">
            <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
              <div className="rise" style={{ animationDelay: "40ms" }}>
                <p className="ledger-num inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-sky-600">
                  <ListOrdered className="h-3.5 w-3.5" strokeWidth={2} /> Priority Queue
                </p>
                <h1 className="display-xl mt-6 text-[40px] text-ink sm:text-[52px] lg:text-[58px]">
                  One ranked list.
                  <br />
                  <span className="relative inline-block text-sky-600">
                    One rep. No triage.
                    <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-sky-200" />
                  </span>
                </h1>
                <p className="mt-7 max-w-xl text-[17px] leading-[1.7] text-ink-soft md:text-[18px]">
                  The queue re-ranks itself every time a WhatsApp reply arrives, a call gets logged, or intent decays overnight. Your rep works top-down, the decision is already made.
                </p>
                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <a href={APP_URLS.register} className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-[15px] font-semibold transition-all hover:-translate-y-0.5" style={{ background: "#0877B8", color: "#FFFFFF", boxShadow: "0 8px 20px -10px rgba(15,23,42,0.35)" }}>
                    Start free trial <ArrowRight className="h-4 w-4" />
                  </a>
                  <Link href="/features/lead-scoring" className="inline-flex items-center gap-2 rounded-xl border bg-white px-6 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:border-sky-300" style={{ borderColor: "var(--paper-line-2)" }}>
                    See lead scoring <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Live mini-queue */}
              <div className="rise" style={{ animationDelay: "160ms" }}>
                <FloatingCard tier="2" depth="3" gloss aura="sky" className="mx-auto max-w-md p-5 md:p-6">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Priority Queue · today</p>
                    <span className="rounded-full bg-sky-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-sky-700 ring-1 ring-sky-100">who to call next</span>
                  </div>
                  <div className="mt-4 space-y-2">
                    {HERO_QUEUE.map((r) => (
                      <div key={r.rank} className={`flex items-center gap-3 rounded-xl p-2.5 ring-1 ${r.next ? "bg-sky-50/70 ring-sky-200" : "bg-white/60 ring-black/5"}`}>
                        <span className="w-4 text-center font-mono text-[12px] font-semibold text-ink-muted">{r.rank}</span>
                        <GradeBadge grade={r.grade} size="sm" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13.5px] font-semibold leading-tight text-ink">{r.name}</span>
                          <span className="block truncate text-[11.5px] text-ink-muted">{r.org}</span>
                        </span>
                        {r.next
                          ? <span className="whitespace-nowrap rounded-full bg-sky-600 px-2 py-0.5 font-mono text-[10px] font-semibold text-white">Next</span>
                          : <span className="whitespace-nowrap font-mono text-[10px] font-semibold text-sky-600">{r.tag}</span>}
                      </div>
                    ))}
                  </div>
                  <p className="mt-3.5 text-[12px] leading-snug text-ink-muted">Re-ranks the moment a signal lands, so the top of the list is always the next best call.</p>
                </FloatingCard>
              </div>
            </div>
          </Container>
        </section>

        {/* 01 — THE LIVE PRODUCT (AppReplica opened on the queue) */}
        <SectionGround variant="sky" size="lg">
          <Container>
            <Reveal className="mb-8 max-w-3xl">
              <NumberedTag number="01" label="The live product" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Open the queue and work it top-down.
              </h2>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
                This is the actual product. Log a call or a WhatsApp reply on any lead and watch the queue re-rank underneath you.
              </p>
            </Reveal>
          </Container>
          <Reveal delay={0.06} className="mx-auto w-full max-w-[1360px] px-4 md:px-8">
            <AppReplica initialView="queue" />
          </Reveal>
        </SectionGround>

        {/* QUICK ANSWER — accent card, chipped terms */}
        <SectionGround variant="pure" size="sm">
          <Container>
            <div className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl border bg-white p-6 pl-7 md:p-8 md:pl-10" style={{ borderColor: "var(--paper-line)" }} data-quick-answer>
              <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", speakable: { "@type": "SpeakableSpecification", cssSelector: [".quick-answer-q", ".quick-answer-a"] } }) }} />
              <span aria-hidden className="absolute inset-y-0 left-0 w-1.5" style={{ background: "linear-gradient(180deg,#38BDF8,#0EA5E9)" }} />
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-sky-500" aria-hidden />
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-600">Quick answer</p>
              </div>
              <p className="quick-answer-q mt-3 text-[16px] font-semibold text-ink md:text-[17px]">What is a sales Priority Queue and how does Leadkaun&apos;s work?</p>
              <p className="quick-answer-a mt-3 text-[16px] leading-[1.75] text-ink-soft">
                A <Chip>Priority Queue</Chip> is a single, live-ranked list of who each rep should contact next. Leadkaun <Chip tone="mint">re-ranks it in real time</Chip> as signals arrive — a new <Chip>Grade A</Chip> lead, a <Chip>WhatsApp reply</Chip>, or <Chip tone="warn">intent decay</Chip> — so the rep works top-down instead of guessing. No daily triage; the queue always reflects now, not yesterday.
              </p>
            </div>
          </Container>
        </SectionGround>

        {/* 02 — HOW THE QUEUE RANKS (rank-weights table) */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mb-12 max-w-3xl md:mb-16">
              <NumberedTag number="02" tone="warm" label="How the queue ranks" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                A transparent formula. Not a black box.
              </h2>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
                Every lead&apos;s rank score is grade + urgency + trend + recency. The weights below are fixed and identical for every account, published so a rep can always see why a lead ranks where it does.
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <FloatingCard tier="3" depth="3" gloss className="overflow-hidden">
                <div className="grid grid-cols-[1.4fr_1fr]" style={{ borderBottom: "1px solid var(--hairline-strong)" }}>
                  <div className="px-6 py-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Signal</div>
                  <div className="px-6 py-4 text-right font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Weight</div>
                </div>
                {RANK_WEIGHTS.map((w, i) => (
                  <div key={w.label} className="grid grid-cols-[1.4fr_1fr]" style={i < RANK_WEIGHTS.length - 1 ? { borderBottom: "1px solid var(--hairline)" } : undefined}>
                    <div className="px-6 py-4 text-[14px] text-ink">{w.label}</div>
                    <div className="px-6 py-4 text-right font-mono text-[13px] font-semibold tabular text-sky-600">{w.pts}</div>
                  </div>
                ))}
              </FloatingCard>
            </Reveal>
          </Container>
        </SectionGround>

        {/* 03 — RE-RANKS IN REAL TIME (before/after) */}
        <SectionGround variant="pure" size="lg">
          <Container>
            <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
              <div>
                <NumberedTag number="03" label="Live re-ranking" />
                <h2 className="mt-5 text-[30px] font-semibold leading-[1.12] tracking-[-0.03em] text-ink md:text-[38px]">
                  A reply lands. The list re-orders itself.
                </h2>
                <p className="mt-5 text-[16px] leading-[1.65] text-ink-soft">
                  A quiet Grade C sits at rank 4. The buyer replies on WhatsApp, Intent jumps, and by the time the rep finishes their current call the lead has moved to the top, with the reason attached. Nobody re-sorted anything.
                </p>
              </div>
              <Reveal delay={0.06}>
                <FloatingCard tier="3" depth="3" gloss className="p-6 md:p-7">
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                    <div>
                      <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Before</p>
                      {[["4", "C"], ["3", "B"], ["2", "A"], ["1", "A"]].map(([rk, g]) => (
                        <div key={rk} className={`mb-1.5 flex items-center gap-2 rounded-lg p-2 ring-1 ${rk === "4" ? "bg-orange-50/60 ring-orange-200" : "bg-white/60 ring-black/5"}`}>
                          <span className="w-3 text-center font-mono text-[11px] text-ink-muted">{rk}</span>
                          <GradeBadge grade={g as Grade} size="sm" />
                        </div>
                      ))}
                    </div>
                    <ArrowRight className="h-5 w-5 shrink-0 text-sky-500" />
                    <div>
                      <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">After WA reply</p>
                      {[["1", "A", true], ["2", "A", false], ["3", "B", false], ["4", "C", false]].map(([rk, g, hot]) => (
                        <div key={String(rk)} className={`mb-1.5 flex items-center gap-2 rounded-lg p-2 ring-1 ${hot ? "bg-emerald-50/70 ring-emerald-200" : "bg-white/60 ring-black/5"}`}>
                          <span className="w-3 text-center font-mono text-[11px] text-ink-muted">{rk}</span>
                          <GradeBadge grade={g as Grade} size="sm" />
                          {hot && <span className="ml-auto whitespace-nowrap font-mono text-[10px] font-semibold text-emerald-600">+1000 intent</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </FloatingCard>
              </Reveal>
            </div>
          </Container>
        </SectionGround>

        {/* 04 — PERFORMANCE */}
        <SectionGround variant="sky" size="lg">
          <Container>
            <Reveal className="mb-10 max-w-3xl">
              <NumberedTag number="04" label="Performance" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Built for 10,000+ leads without lag.
              </h2>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-5 md:grid-cols-3">
              {PERF.map((m, i) => (
                <FloatingCard key={m.l} tier="2" depth="2" gloss aura={i === 1 ? "peach" : "sky"} className="p-6">
                  <div className="font-mono text-[34px] font-semibold tracking-[-0.025em] tabular text-ink">{m.v}</div>
                  <p className="mt-2 text-[13px] font-semibold text-ink">{m.l}</p>
                  <p className="mt-1 text-[12px] text-ink-muted">{m.h}</p>
                </FloatingCard>
              ))}
            </Reveal>
          </Container>
        </SectionGround>

        {/* 05 — IN THEIR WORDS (reuses homepage <Voices/>; illustrative placeholders,
            not real customer statements, and deliberately not wired to Review schema) */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mb-12 max-w-2xl">
              <NumberedTag number="05" tone="warm" label="In their words" />
              <h2 className="display-md mt-5 text-[30px] text-ink md:text-[40px]">
                Nobody switches over a list. They switch over one lead they lost.
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
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">Queue questions.</h2>
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
                Priority is step two. Here&apos;s what it connects to.
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
                  See the queue{" "}
                  <span className="relative inline-block text-sky-600">
                    on your own leads.
                    <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-sky-200" />
                  </span>
                </h2>
                <p className="relative mx-auto mt-6 max-w-xl text-[16px] leading-[1.7] text-ink-soft">
                  Import your leads. Leadkaun grades and ranks them into one queue per rep. First queue built the same day.
                </p>
                <div className="relative mt-9 flex flex-wrap items-center justify-center gap-3">
                  <a href={APP_URLS.register} className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-[15px] font-semibold transition-all hover:-translate-y-0.5" style={{ background: "#0877B8", color: "#FFFFFF", boxShadow: "0 8px 20px -10px rgba(15,23,42,0.35)" }}>
                    Start free trial <ArrowRight className="h-4 w-4" />
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
