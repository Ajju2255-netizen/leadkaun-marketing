import Link from "next/link"
import type { Metadata } from "next"
import type { ReactNode } from "react"
import { AlertTriangle, Gauge, ListOrdered, Mail, ArrowRight, Sparkles, IndianRupee, Clock, HeartHandshake, RotateCcw, type LucideIcon } from "lucide-react"

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

const title = "Missed Opportunity Engine, see the ₹ at risk"
const description =
  "Every overdue follow-up gets a rupee value. Leadkaun's Missed Opportunity Engine turns stale Grade A leads into a ₹-at-risk number, per rep, per week, the metric a Monday sales review should open with."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/features/missed-opportunity-engine" },
  ...ogMeta({ title, description, path: "/features/missed-opportunity-engine" }),
}

/** Inline highlighted term chip for the Quick Answer. */
function Chip({ children, tone = "warn" }: { children: ReactNode; tone?: "sky" | "mint" | "warn" }) {
  const styles: Record<string, string> = {
    sky: "bg-sky-50 text-sky-700 ring-sky-200",
    mint: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    warn: "bg-orange-50 text-orange-700 ring-orange-200",
  }
  return <span className={`whitespace-nowrap rounded-md px-1.5 py-[1px] text-[13.5px] font-semibold ring-1 ${styles[tone]}`}>{children}</span>
}

// Illustrative weekly rollup for the hero (sample figures, real mechanic).
const HERO_RISK = [
  { grade: "A" as Grade, leads: 3, value: "₹4.5L", tone: "bg-emerald-50/70 ring-emerald-200" },
  { grade: "B" as Grade, leads: 5, value: "₹2.6L", tone: "bg-sky-50/70 ring-sky-200" },
  { grade: "C" as Grade, leads: 8, value: "₹1.3L", tone: "bg-white/60 ring-black/5" },
]

const STALE_WINDOWS = [
  { grade: "A" as Grade, window: "24 hours", reason: "Hottest leads cool fastest" },
  { grade: "B" as Grade, window: "48 hours", reason: "Nurture window closes by week 2" },
  { grade: "C" as Grade, window: "7 days", reason: "Industry-dependent; fixed per grade" },
  { grade: "D" as Grade, window: "30 days", reason: "Long-tail; low-priority recovery" },
]

const PROOF: { Icon: LucideIcon; stat: string; label: string }[] = [
  { Icon: IndianRupee, stat: "Per week", label: "₹ at risk, per rep, every Monday" },
  { Icon: Clock, stat: "Per grade", label: "Stale windows fixed per grade, not guessed" },
  { Icon: HeartHandshake, stat: "Not blame", label: "Framed as recovery, never shaming" },
  { Icon: RotateCcw, stat: "Recoverable", label: "Every ₹ at risk maps to a queue action" },
]

const FAQ = [
  { q: "How is ₹ at risk calculated?", a: "Formula: avg deal value for that grade × grade-specific conversion rate × 1 lead. For a real-estate team with ₹45L avg GCV and 10% Grade A conversion, a single stale Grade A lead = ₹4.5L at risk. Aggregated across stale leads, this becomes your weekly ₹ at risk number. The rupee figures are illustrative estimates, not a promise of recovered revenue." },
  { q: "Where do the avg deal values come from?", a: "Default values are industry benchmarks. On Growth and Scale, you customise per pipeline using your actual last-90-day closed-won data." },
  { q: "Does it shame reps?", a: "Rep-facing copy is framed as opportunity, not blame. The rep's Morning Brief says '₹1.8L to recover today, top 3: Priya, Rajesh, Mohan', not 'you missed ₹1.8L'. Same number, different conversation. Managers see per-rep rollups separately." },
  { q: "What happens when we mark a lead as closed-lost?", a: "It leaves the at-risk bucket and gets logged for loss analysis, so over time you see which sources / industries / reps have higher loss rates, and you can coach / retarget accordingly." },
  { q: "How does it integrate with Morning Brief?", a: "The top of every Morning Brief email leads with 'Your ₹ at risk today' and lists the top Grade A leads to recover. It's the single metric that sets the rep's day." },
]

const RELATED = [
  { icon: Gauge, title: "Lead Scoring", description: "Stale leads only matter after they've been graded. Scoring drives the ₹ at risk number.", href: "/features/lead-scoring" },
  { icon: ListOrdered, title: "Priority Queue", description: "Recovery actions show up in the rep's queue, with the ₹ value attached.", href: "/features/priority-queue" },
  { icon: Mail, title: "Morning Brief", description: "Where the ₹ at risk number lands every weekday at 8:30 AM IST, rep and manager versions.", href: "/features/morning-brief" },
]

export default function MissedOpportunityPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript([breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "Features", url: "/features" }, { name: "Missed Opportunity Engine" }]), faqPageSchema(FAQ)]) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        {/* HERO — split, ₹ at risk visual right */}
        <section className="relative overflow-hidden border-b rule-paper" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, var(--paper) 100%)" }}>
          <div aria-hidden className="pointer-events-none absolute -right-32 -top-24 h-[460px] w-[620px] rounded-full opacity-[0.30] blur-[130px]" style={{ background: "radial-gradient(circle, #FED7AA 0%, transparent 70%)" }} />
          <Container className="relative pt-32 pb-16 md:pt-40 md:pb-24">
            <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
              <div className="rise" style={{ animationDelay: "40ms" }}>
                <p className="ledger-num inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-orange-600">
                  <AlertTriangle className="h-3.5 w-3.5" strokeWidth={2} /> Missed Opportunity Engine
                </p>
                <h1 className="display-xl mt-6 text-[40px] text-ink sm:text-[52px] lg:text-[58px]">
                  Every stale lead
                  <br />
                  <span className="relative inline-block text-orange-600">
                    gets a rupee value.
                    <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-orange-200" />
                  </span>
                </h1>
                <p className="mt-7 max-w-xl text-[17px] leading-[1.7] text-ink-soft md:text-[18px]">
                  &ldquo;Overdue follow-up&rdquo; is easy to ignore. &ldquo;₹4.5L at risk&rdquo; is not. The engine translates every stale Grade A into the one number a Monday review should open with, and hands the rep the leads to recover it.
                </p>
                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <a href={APP_URLS.register} className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-[15px] font-semibold transition-all hover:-translate-y-0.5" style={{ background: "#0877B8", color: "#FFFFFF", boxShadow: "0 8px 20px -10px rgba(15,23,42,0.35)" }}>
                    Start free <ArrowRight className="h-4 w-4" />
                  </a>
                  <Link href="/tools/missed-revenue-calculator" className="inline-flex items-center gap-2 rounded-xl border bg-white px-6 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:border-sky-300" style={{ borderColor: "var(--paper-line-2)" }}>
                    Try the ₹ calculator <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* ₹ at risk rollup */}
              <div className="rise" style={{ animationDelay: "160ms" }}>
                <FloatingCard tier="2" depth="3" gloss aura="peach" className="mx-auto max-w-md p-5 md:p-6">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Missed · this week</p>
                    <span className="rounded-full bg-orange-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-orange-700 ring-1 ring-orange-100">at risk</span>
                  </div>
                  <p className="mt-4 font-mono text-[40px] font-semibold tracking-[-0.03em] tabular text-ink">₹8.4L</p>
                  <p className="text-[12px] text-ink-muted">across 16 stale leads, recoverable if actioned this week</p>
                  <div className="mt-4 space-y-2">
                    {HERO_RISK.map((r) => (
                      <div key={r.grade} className={`flex items-center gap-3 rounded-xl p-2.5 ring-1 ${r.tone}`}>
                        <GradeBadge grade={r.grade} size="sm" />
                        <span className="min-w-0 flex-1 text-[12.5px] text-ink-soft">{r.leads} stale {r.leads === 1 ? "lead" : "leads"}</span>
                        <span className="whitespace-nowrap font-mono text-[13px] font-semibold text-ink">{r.value}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3.5 text-[11px] leading-snug text-ink-muted">Illustrative figures. Actual ₹ uses your grade-wise deal values and conversion rates.</p>
                </FloatingCard>
              </div>
            </div>
          </Container>
        </section>

        {/* 01 — THE LIVE PRODUCT (AppReplica opened on Missed Opps) */}
        <SectionGround variant="sky" size="lg">
          <Container>
            <Reveal className="mb-8 max-w-3xl">
              <NumberedTag number="01" label="The live product" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Open Missed Opps and see the ₹ walking out.
              </h2>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
                This is the actual product. Every lead past its stale window, with a ₹ value and the next recovery action attached.
              </p>
            </Reveal>
          </Container>
          <Reveal delay={0.06} className="mx-auto w-full max-w-[1360px] px-4 md:px-8">
            <AppReplica initialView="missed" />
          </Reveal>
        </SectionGround>

        {/* QUICK ANSWER — accent card, chipped terms */}
        <SectionGround variant="pure" size="sm">
          <Container>
            <div className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl border bg-white p-6 pl-7 md:p-8 md:pl-10" style={{ borderColor: "var(--paper-line)" }} data-quick-answer>
              <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", speakable: { "@type": "SpeakableSpecification", cssSelector: [".quick-answer-q", ".quick-answer-a"] } }) }} />
              <span aria-hidden className="absolute inset-y-0 left-0 w-1.5" style={{ background: "linear-gradient(180deg,#FDBA74,#F97316)" }} />
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-orange-500" aria-hidden />
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-orange-600">Quick answer</p>
              </div>
              <p className="quick-answer-q mt-3 text-[16px] font-semibold text-ink md:text-[17px]">What is a Missed Opportunity Engine and how does Leadkaun put a rupee value on stale leads?</p>
              <p className="quick-answer-a mt-3 text-[16px] leading-[1.75] text-ink-soft">
                It flags every lead that has passed its <Chip>stale window</Chip> for its grade, then attaches a <Chip>₹ at risk</Chip> figure, avg deal value × grade conversion rate, so &ldquo;overdue follow-up&rdquo; becomes a number a manager can act on. The rupee amounts are <Chip tone="sky">illustrative estimates</Chip>, and each one maps to a concrete <Chip tone="mint">recovery action</Chip> in the rep&apos;s queue, not a guilt trip.
              </p>
            </div>
          </Container>
        </SectionGround>

        {/* 02 — HOW ₹ AT RISK IS CALCULATED */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mb-12 max-w-3xl md:mb-16">
              <NumberedTag number="02" tone="warm" label="The formula" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                One line. Zero black box.
              </h2>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
                No model, no mystery. ₹ at risk is deal value times a grade-specific conversion rate, and you can see the working on every lead.
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <FloatingCard tier="3" depth="3" gloss className="p-6 md:p-9">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">₹ at risk, per stale lead</p>
                <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[15px] font-semibold text-ink md:text-[17px]">
                  <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-emerald-700 ring-1 ring-emerald-100">avg deal value</span>
                  <span className="text-ink-muted">×</span>
                  <span className="rounded-lg bg-sky-50 px-2.5 py-1 text-sky-700 ring-1 ring-sky-100">grade conversion rate</span>
                </p>
                <div className="mt-6 border-t pt-5 rule-paper">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Worked example, real estate</p>
                  <p className="mt-3 text-[15px] leading-[1.7] text-ink-soft">
                    <span className="font-mono font-semibold text-ink">₹45L</span> average GCV × <span className="font-mono font-semibold text-ink">10%</span> Grade A conversion = <span className="font-mono font-semibold text-orange-600">₹4.5L</span> at risk for a single stale Grade A lead. Sum across the stale pool and you have the weekly number.
                  </p>
                </div>
              </FloatingCard>
            </Reveal>
          </Container>
        </SectionGround>

        {/* 03 — STALE WINDOWS BY GRADE (text left, visual right) */}
        <SectionGround variant="pure" size="lg">
          <Container>
            <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
              <div>
                <NumberedTag number="03" label="Stale windows" />
                <h2 className="mt-5 text-[30px] font-semibold leading-[1.12] tracking-[-0.03em] text-ink md:text-[38px]">
                  A grade decides how long is too long.
                </h2>
                <p className="mt-5 text-[16px] leading-[1.65] text-ink-soft">
                  A Grade A left 25 hours is a problem. A Grade D at 25 hours is fine. Each grade has its own fixed stale window, so &ldquo;overdue&rdquo; means something different for a hot buyer than for a long-tail enquiry, and reps aren&apos;t chased for the wrong ones.
                </p>
              </div>
              <Reveal delay={0.06}>
                <FloatingCard tier="3" depth="3" gloss className="overflow-hidden">
                  <div className="grid grid-cols-[auto_1fr_auto] items-center px-5 py-3.5" style={{ borderBottom: "1px solid var(--hairline-strong)" }}>
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Grade</span>
                    <span className="pl-4 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Goes stale after</span>
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Why</span>
                  </div>
                  {STALE_WINDOWS.map((s, i) => (
                    <div key={s.grade} className="grid grid-cols-[auto_1fr_auto] items-center gap-x-2 px-5 py-4" style={i < STALE_WINDOWS.length - 1 ? { borderBottom: "1px solid var(--hairline)" } : undefined}>
                      <GradeBadge grade={s.grade} size="sm" />
                      <span className="pl-4 font-mono text-[14px] font-semibold text-ink">{s.window}</span>
                      <span className="max-w-[9rem] text-right text-[11.5px] leading-tight text-ink-muted">{s.reason}</span>
                    </div>
                  ))}
                </FloatingCard>
              </Reveal>
            </div>
          </Container>
        </SectionGround>

        {/* 04 — SAME NUMBER, TWO CONVERSATIONS */}
        <SectionGround variant="sky" size="lg">
          <Container>
            <Reveal className="mb-10 max-w-3xl">
              <NumberedTag number="04" label="Recovery, not blame" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Same number. Two very different conversations.
              </h2>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-5 md:grid-cols-2">
              <FloatingCard tier="2" depth="2" gloss aura="sky" className="p-6 md:p-7">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-600">What the rep sees</p>
                <p className="mt-3 text-[19px] font-semibold leading-snug text-ink">&ldquo;₹1.8L to recover today. Top 3: Priya, Rajesh, Mohan.&rdquo;</p>
                <p className="mt-3 text-[13.5px] leading-[1.6] text-ink-soft">Framed as opportunity, with the exact leads to call. A morning target, not an accusation.</p>
              </FloatingCard>
              <FloatingCard tier="2" depth="2" gloss aura="peach" className="p-6 md:p-7">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-orange-600">What the manager sees</p>
                <p className="mt-3 text-[19px] font-semibold leading-snug text-ink">Per-rep ₹ at risk, Grade A count, and where the biggest leaks are.</p>
                <p className="mt-3 text-[13.5px] leading-[1.6] text-ink-soft">A rollup that turns Monday review into &ldquo;here&apos;s this week&apos;s recovery plan,&rdquo; not a round of finger-pointing.</p>
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
                Nobody notices a slow leak. They notice the lead they lost.
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
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">Recovery questions.</h2>
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
                The ₹ number is the output. Here&apos;s what feeds it.
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
                <FloatingCard key={stat} tier="2" depth="2" gloss aura="peach" className="p-6 text-center">
                  <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600 ring-1 ring-orange-100"><Icon className="h-5 w-5" strokeWidth={2} /></span>
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
                <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-96 rounded-full opacity-30 blur-[110px]" style={{ background: "radial-gradient(circle,#FED7AA 0%,transparent 70%)" }} />
                <p className="ledger-num relative text-[11px] uppercase tracking-[0.22em] text-orange-600">08 · Ready when you are</p>
                <h2 className="display-lg relative mx-auto mt-5 max-w-2xl text-[30px] text-ink md:text-[44px]">
                  See the ₹{" "}
                  <span className="relative inline-block text-orange-600">
                    leaking from your pipeline.
                    <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-orange-200" />
                  </span>
                </h2>
                <p className="relative mx-auto mt-6 max-w-xl text-[16px] leading-[1.7] text-ink-soft">
                  Import your leads. Leadkaun grades them, flags the stale ones, and shows the ₹ at risk you can still recover this week.
                </p>
                <div className="relative mt-9 flex flex-wrap items-center justify-center gap-3">
                  <a href={APP_URLS.register} className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-[15px] font-semibold transition-all hover:-translate-y-0.5" style={{ background: "#0877B8", color: "#FFFFFF", boxShadow: "0 8px 20px -10px rgba(15,23,42,0.35)" }}>
                    Start free <ArrowRight className="h-4 w-4" />
                  </a>
                  <Link href="/tools/missed-revenue-calculator" className="inline-flex items-center gap-2 rounded-xl border bg-white px-6 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:border-sky-300" style={{ borderColor: "var(--paper-line-2)" }}>
                    Try the ₹ calculator
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
