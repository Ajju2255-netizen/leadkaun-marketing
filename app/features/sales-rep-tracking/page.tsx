import Link from "next/link"
import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Users, Gauge, ListOrdered, AlertTriangle, Mail, ArrowRight, Sparkles, IndianRupee, Clock, Target, Eye, type LucideIcon } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"

import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { NumberedTag } from "@/app/components/numbered-tag"
import { FeatureCard } from "@/app/components/feature-card"
import { FloatingCard } from "@/app/components/floating-card"
import { Faq } from "@/app/components/faq"
import { Reveal } from "@/app/components/reveal"
import { AppReplica } from "@/app/components/app-replica"
import { Voices } from "@/app/components/voices"
import { faqPageSchema, breadcrumbListSchema, jsonLdScript, ogMeta } from "@/lib/seo"
import { APP_URLS } from "@/lib/urls"

const title = "Sales Rep Tracking, behaviour over activity"
const description =
  "Per-rep ₹ recovered, Grade A response time, follow-up completion, queue adoption. Leadkaun measures whether reps acted on the leads scoring put in front of them, not calls-per-day. Rep visibility without micromanagement."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/features/sales-rep-tracking" },
  ...ogMeta({ title, description, path: "/features/sales-rep-tracking" }),
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

const METRICS = [
  { label: "Grade A response time", desc: "Average hours from Grade A arrival to first meaningful contact", bench: "Target: < 6 h" },
  { label: "₹ recovered per week", desc: "Weekly value recovered from the stale-lead pool", bench: "Target: ₹1–3 L" },
  { label: "Follow-up score (0–100)", desc: "On-time completions ÷ assigned × 100", bench: "Target: 85+" },
  { label: "Intent signals logged", desc: "Calls + WA replies + meetings logged per week", bench: "Target: 35+" },
  { label: "Queue adoption %", desc: "% of calls that came from top-20 of Priority Queue", bench: "Target: 70%+" },
  { label: "Source mix", desc: "Distribution of recovered ₹ across lead sources", bench: "Diagnostic only" },
]

// Illustrative rep card for the hero (sample figures, real metrics).
const HERO_METRICS = [
  { label: "₹ recovered · this week", value: "₹2.1L", tone: "text-emerald-600" },
  { label: "Grade A response time", value: "4.2 h", tone: "text-sky-600" },
  { label: "Follow-up score", value: "88", tone: "text-ink" },
  { label: "Queue adoption", value: "74%", tone: "text-ink" },
]

const PROOF: { Icon: LucideIcon; stat: string; label: string }[] = [
  { Icon: Target, stat: "Followed", label: "Measures action taken, not outcome claimed" },
  { Icon: Users, stat: "Per rep", label: "Outcome metrics, never activity counts" },
  { Icon: Eye, stat: "Own view", label: "Reps see their own numbers only" },
  { Icon: IndianRupee, stat: "Flat ₹", label: "Priced per account, not per seat" },
]

const FAQ = [
  { q: "Isn't this just a rep surveillance tool?", a: "No. Every metric is outcome-focused, not activity-focused. We do not measure calls-per-day or minutes-on-phone. We measure ₹ recovered, Grade A response time, follow-up completion. Reps keep autonomy; managers get outcome visibility." },
  { q: "What if a rep's number is low?", a: "Diagnose before discipline. Low Grade A response time, push alerts set up wrong? Low ₹ recovered, bad source quality? Low follow-up score, cadence too tight for their industry? Most 'performance issues' are process issues in disguise." },
  { q: "Do reps see their own dashboards?", a: "Yes, their own metrics, framed as opportunity ('₹1.8L to recover today'). They don't see other reps' numbers; managers see the full rollup." },
  { q: "How often are metrics updated?", a: "Continuously. The dashboard polls at 60s intervals. Weekly rollups auto-generate every Monday at 8:30 AM IST in the manager Morning Brief." },
  { q: "Can I compare rep performance?", a: "Managers can view per-rep comparisons on any metric over any time window. Reps only see their own view, intentionally. Public shaming is a rep-churn multiplier; the tool discourages it." },
]

const RELATED = [
  { icon: Gauge, title: "Lead Scoring", description: "Rep metrics are only meaningful once leads are graded. Scoring powers the comparison.", href: "/features/lead-scoring" },
  { icon: AlertTriangle, title: "Missed Opportunity", description: "The ₹ recovered number per rep comes from the Missed Opportunity Engine.", href: "/features/missed-opportunity-engine" },
  { icon: Mail, title: "Morning Brief", description: "Manager version of the Brief rolls up per-rep performance numbers every 8:30 AM IST.", href: "/features/morning-brief" },
]

export default function SalesRepTrackingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript([breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "Features", url: "/features" }, { name: "Sales Rep Tracking" }]), faqPageSchema(FAQ)]) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        {/* HERO — split, rep card right */}
        <section className="relative overflow-hidden border-b rule-paper" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, var(--paper) 100%)" }}>
          <div aria-hidden className="pointer-events-none absolute -right-32 -top-24 h-[460px] w-[620px] rounded-full opacity-[0.30] blur-[130px]" style={{ background: "radial-gradient(circle, #BAE6FD 0%, transparent 70%)" }} />
          <Container className="relative pt-32 pb-16 md:pt-40 md:pb-24">
            <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
              <div className="rise" style={{ animationDelay: "40ms" }}>
                <p className="ledger-num inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-sky-600">
                  <Users className="h-3.5 w-3.5" strokeWidth={2} /> Sales Rep Tracking
                </p>
                <h1 className="display-xl mt-6 text-[40px] text-ink sm:text-[52px] lg:text-[58px]">
                  Behaviour. Not activity.
                  <br />
                  <span className="relative inline-block text-sky-600">
                    ₹ recovered. Not calls made.
                    <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-sky-200" />
                  </span>
                </h1>
                <p className="mt-7 max-w-xl text-[17px] leading-[1.7] text-ink-soft md:text-[18px]">
                  Calls-per-day rewards noise. Leadkaun measures whether a rep acted on the leads scoring put in front of them, response time on Grade A, ₹ recovered, follow-ups kept. Visibility for managers, autonomy for reps.
                </p>
                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <a href={APP_URLS.register} className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-[15px] font-semibold transition-all hover:-translate-y-0.5" style={{ background: "#0877B8", color: "#FFFFFF", boxShadow: "0 8px 20px -10px rgba(15,23,42,0.35)" }}>
                    Start free <ArrowRight className="h-4 w-4" />
                  </a>
                  <Link href="/features/morning-brief" className="inline-flex items-center gap-2 rounded-xl border bg-white px-6 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:border-sky-300" style={{ borderColor: "var(--paper-line-2)" }}>
                    See the Morning Brief <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Rep card */}
              <div className="rise" style={{ animationDelay: "160ms" }}>
                <FloatingCard tier="2" depth="3" gloss aura="sky" className="mx-auto max-w-md p-5 md:p-6">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-ink/[0.055] font-mono text-[13px] font-semibold text-ink-soft">NV</span>
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold text-ink">Nikhil Verma</p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">Rep · this week</p>
                    </div>
                    <span className="ml-auto rounded-full bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-100">on track</span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2.5">
                    {HERO_METRICS.map((m) => (
                      <div key={m.label} className="rounded-xl bg-white/60 p-3 ring-1 ring-black/5">
                        <p className={`font-mono text-[22px] font-semibold tabular ${m.tone}`}>{m.value}</p>
                        <p className="mt-0.5 text-[11px] leading-tight text-ink-muted">{m.label}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3.5 text-[11px] leading-snug text-ink-muted">Illustrative. Every metric is an outcome, not a count of calls or minutes.</p>
                </FloatingCard>
              </div>
            </div>
          </Container>
        </section>

        {/* 01 — THE LIVE PRODUCT (AppReplica opened on Rep Tracking) */}
        <SectionGround variant="sky" size="lg">
          <Container>
            <Reveal className="mb-8 max-w-3xl">
              <NumberedTag number="01" label="The live product" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Open Rep Tracking and read the floor.
              </h2>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
                This is the actual manager view. Per-rep outcomes side by side, with the ability to drill into any single number over any window.
              </p>
            </Reveal>
          </Container>
          <Reveal delay={0.06} className="mx-auto w-full max-w-[1360px] px-4 md:px-8">
            <AppReplica initialView="rep" />
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
              <p className="quick-answer-q mt-3 text-[16px] font-semibold text-ink md:text-[17px]">How does Leadkaun track sales rep performance without micromanaging?</p>
              <p className="quick-answer-a mt-3 text-[16px] leading-[1.75] text-ink-soft">
                It scores <Chip tone="mint">outcomes, not activity</Chip>, ₹ recovered, Grade A response time, follow-up completion, queue adoption. Crucially, it measures whether a rep <Chip>acted on the leads</Chip> the scoring put at the top of their queue, that they were <Chip tone="warn">followed</Chip>, not whether each deal closed. Reps see only their own numbers; managers see the rollup.
              </p>
            </div>
          </Container>
        </SectionGround>

        {/* 02 — SIX NUMBERS */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mb-12 max-w-3xl md:mb-16">
              <NumberedTag number="02" tone="warm" label="The metrics" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Six numbers. Every one an outcome.
              </h2>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
                Not one of them counts calls or minutes. Each answers a question a sales manager actually has, and each comes with a target you can hold a conversation against.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-4 md:grid-cols-2">
              {METRICS.map((m) => (
                <FloatingCard key={m.label} tier="2" depth="2" gloss className="flex items-start justify-between gap-4 p-5 md:p-6">
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold text-ink">{m.label}</p>
                    <p className="mt-1.5 text-[13px] leading-[1.55] text-ink-soft">{m.desc}</p>
                  </div>
                  <span className="shrink-0 whitespace-nowrap rounded-lg bg-sky-50 px-2.5 py-1 font-mono text-[11px] font-semibold text-sky-700 ring-1 ring-sky-100">{m.bench}</span>
                </FloatingCard>
              ))}
            </Reveal>
          </Container>
        </SectionGround>

        {/* 03 — FOLLOWED, NOT WORKED (text left, visual right) */}
        <SectionGround variant="pure" size="lg">
          <Container>
            <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
              <div>
                <NumberedTag number="03" label="What we actually measure" />
                <h2 className="mt-5 text-[30px] font-semibold leading-[1.12] tracking-[-0.03em] text-ink md:text-[38px]">
                  Did the rep work the lead we put at the top?
                </h2>
                <p className="mt-5 text-[16px] leading-[1.65] text-ink-soft">
                  That is the honest question, and the one we answer. We track whether the rep <span className="font-semibold text-ink">acted on</span> the recommendation, called the Grade A, kept the follow-up, not whether the deal closed. Outcomes depend on price, timing and luck; following the queue is the part a rep controls, so that is what we hold them to.
                </p>
              </div>
              <Reveal delay={0.06}>
                <FloatingCard tier="3" depth="3" gloss className="p-6 md:p-7">
                  <div className="space-y-3">
                    <div className="rounded-xl bg-emerald-50/60 p-4 ring-1 ring-emerald-200">
                      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700">We measure</p>
                      <p className="mt-1.5 text-[14px] font-medium text-ink">Was the top-of-queue lead actually contacted, and on time?</p>
                    </div>
                    <div className="flex items-center justify-center"><span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">not</span></div>
                    <div className="rounded-xl bg-white/60 p-4 ring-1 ring-black/5">
                      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">We don&apos;t claim</p>
                      <p className="mt-1.5 text-[14px] font-medium text-ink-soft">Whether that recommendation was &ldquo;right&rdquo; or how the deal ended.</p>
                    </div>
                  </div>
                  <p className="mt-5 border-t pt-4 text-[12.5px] leading-snug text-ink-muted rule-paper">Following the queue is coachable. The outcome of a single deal isn&apos;t. We only report the part the rep owns.</p>
                </FloatingCard>
              </Reveal>
            </div>
          </Container>
        </SectionGround>

        {/* 04 — DIAGNOSE BEFORE DISCIPLINE */}
        <SectionGround variant="sky" size="lg">
          <Container>
            <Reveal className="mb-10 max-w-3xl">
              <NumberedTag number="04" label="Read it right" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                A low number is a question, not a verdict.
              </h2>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-5 md:grid-cols-3">
              {[
                { m: "Slow Grade A response", q: "Are push alerts even set up for that rep?" },
                { m: "Low ₹ recovered", q: "Is it the rep, or the source quality they were handed?" },
                { m: "Weak follow-up score", q: "Is the cadence too tight for their industry's cycle?" },
              ].map((c, i) => (
                <FloatingCard key={c.m} tier="2" depth="2" gloss aura={i === 1 ? "peach" : "sky"} className="p-6">
                  <p className="text-[15px] font-semibold text-ink">{c.m}</p>
                  <p className="mt-2.5 text-[13.5px] leading-[1.6] text-ink-soft">{c.q}</p>
                </FloatingCard>
              ))}
            </Reveal>
            <p className="mt-6 max-w-2xl text-[14px] leading-[1.6] text-ink-soft">Most &ldquo;performance issues&rdquo; are process issues in disguise. The tool is built to surface the difference, not to hand a manager a stick.</p>
          </Container>
        </SectionGround>

        {/* 05 — IN THEIR WORDS (illustrative placeholders, not real customer statements) */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mb-12 max-w-2xl">
              <NumberedTag number="05" tone="warm" label="In their words" />
              <h2 className="display-md mt-5 text-[30px] text-ink md:text-[40px]">
                Every manager can count calls. Almost none can see the leak.
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
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">Tracking questions.</h2>
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
                Tracking reads the floor. Here&apos;s what it reads from.
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
                  See your floor{" "}
                  <span className="relative inline-block text-sky-600">
                    by outcome, not effort.
                    <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-sky-200" />
                  </span>
                </h2>
                <p className="relative mx-auto mt-6 max-w-xl text-[16px] leading-[1.7] text-ink-soft">
                  Import your leads and assign your reps. Within a week you can see who&apos;s working the queue and where the real bottleneck is.
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
