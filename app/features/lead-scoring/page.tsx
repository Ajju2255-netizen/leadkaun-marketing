import Link from "next/link"
import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Gauge, Zap, Filter, ListOrdered, AlertTriangle, ArrowRight, Sparkles, Clock, IndianRupee, SlidersHorizontal, type LucideIcon } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"

import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { NumberedTag } from "@/app/components/numbered-tag"
import { FeatureCard } from "@/app/components/feature-card"
import { FloatingCard } from "@/app/components/floating-card"
import { Faq } from "@/app/components/faq"
import { Reveal } from "@/app/components/reveal"
import { GradeBadge, ScoreCell } from "@/app/components/demo/primitives"
import { AppReplica } from "@/app/components/app-replica"
import { GradeDistribution } from "@/app/components/viz/grade-distribution"
import type { Grade } from "@/lib/demo-app"
import { faqPageSchema, breadcrumbListSchema, jsonLdScript, ogMeta } from "@/lib/seo"
import { APP_URLS } from "@/lib/urls"

const title = "Lead scoring, how every lead is graded A–F"
const description =
  "See Leadkaun's real lead-scoring engine: every lead graded A–F from three transparent 0–100 scores, Fit, Intent and Quality, with intent decay and a fixed next action per grade."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/features/lead-scoring" },
  ...ogMeta({ title, description, path: "/features/lead-scoring" }),
}

/** Inline highlighted term chip for the Quick Answer. */
function Chip({ children, tone = "sky" }: { children: ReactNode; tone?: "sky" | "fit" | "intent" | "quality" | "warn" }) {
  const styles: Record<string, string> = {
    sky: "bg-sky-50 text-sky-700 ring-sky-200",
    fit: "bg-rose-50 text-rose-700 ring-rose-200",
    intent: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    quality: "bg-sky-50 text-sky-700 ring-sky-200",
    warn: "bg-orange-50 text-orange-700 ring-orange-200",
  }
  return <span className={`whitespace-nowrap rounded-md px-1.5 py-[1px] text-[13.5px] font-semibold ring-1 ${styles[tone]}`}>{children}</span>
}

/* ── Sample leads (illustrative demo data — same shape the product uses).
      Grades computed by the real matrix: Quality < 20 → F; A = Fit≥65 & Intent≥60
      & Quality≥60; B/C/D step down; else E. Actions are the fixed grade→action map. ── */
type SampleLead = { source: string; place: string; fit: number; intent: number; quality: number; grade: Grade; action: string; reason: string }
const SAMPLE_LEADS: SampleLead[] = [
  { source: "Textile exporter enquiry", place: "Surat", fit: 78, intent: 71, quality: 82, grade: "A", action: "Call now",
    reason: "Strong ICP match, replied on WhatsApp this morning, and the phone and email are clean. All three scores clear the Grade A bar." },
  { source: "D2C brand enquiry", place: "Jaipur", fit: 62, intent: 34, quality: 70, grade: "C", action: "Nurture",
    reason: "Good fit and usable data, but silent for a week so Intent has decayed. A nurture cadence, not a drop-everything call." },
  { source: "Web form, no company", place: "unknown", fit: 55, intent: 40, quality: 12, grade: "F", action: "Archive",
    reason: "Looks average on Fit and Intent, but the phone number is invalid. Quality under 20 caps it to F, whatever the other two say." },
]

const SCORES = [
  { name: "Fit Score", tone: "fit" as const, description: "How well the lead matches the ICP you set. It only moves when new firmographic information arrives.", weights: [
    { label: "Industry match", pts: "30 pts" }, { label: "Geography", pts: "20 pts" },
    { label: "Business type", pts: "20 pts" }, { label: "Role / decision-maker", pts: "15 pts" },
    { label: "Budget signal", pts: "15 pts" },
  ]},
  { name: "Intent Score", tone: "intent" as const, description: "How engaged the lead is right now. It spikes on signals and decays with silence.", weights: [
    { label: "Source baseline", pts: "base" }, { label: "Call answered, interested", pts: "+20 pts" },
    { label: "WhatsApp reply", pts: "+10 pts" }, { label: "Meeting booked", pts: "+25 pts" },
    { label: "Silent ≥ 1 day", pts: "−3 / day" },
  ]},
  { name: "Quality Score", tone: "quality" as const, description: "Is the data usable? Below 20 forces Grade F and drops the lead out of the queue.", weights: [
    { label: "Valid phone", pts: "30 pts" }, { label: "Valid email", pts: "15 pts" },
    { label: "Company name", pts: "15 pts" }, { label: "Inquiry clarity", pts: "20 pts" },
    { label: "Source reliability", pts: "10 pts" },
  ]},
]

// The real grade matrix (lib/demo-app.ts → assignGrade + nextAction).
const GRADES: { grade: Grade; color: string; cond: string; action: string }[] = [
  { grade: "A", color: "#10B981", cond: "Fit ≥ 65 · Intent ≥ 60 · Quality ≥ 60", action: "Call now" },
  { grade: "B", color: "#0EA5E9", cond: "Fit ≥ 55 · Intent ≥ 40 · Quality ≥ 50", action: "Follow up today" },
  { grade: "C", color: "#FB923C", cond: "Fit ≥ 40 · Intent ≥ 30 · Quality ≥ 40", action: "Nurture" },
  { grade: "D", color: "#F97316", cond: "Fit ≥ 30 · Intent ≥ 15 · Quality ≥ 25", action: "Light touch" },
  { grade: "E", color: "#EF4444", cond: "Below D, with Quality ≥ 20", action: "Light touch" },
  { grade: "F", color: "#94A3B8", cond: "Quality < 20 (junk / incomplete data)", action: "Archive" },
]

const FAQ = [
  { q: "What is lead scoring, in simple terms?", a: "Lead scoring ranks every lead by how likely they are to convert. Leadkaun scores across three independent dimensions, Fit (ICP match), Intent (engagement) and Quality (data reliability), and combines them into a Grade A–F. Your rep works Grade A first, always." },
  { q: "How is this different from my CRM's lead scoring?", a: "Most CRM scoring is a single points-based number, effectively a black box. Leadkaun uses three transparent scores on a published threshold matrix. Intent decays automatically when leads go silent, so a stale Grade A drops to B or C on its own, no manager intervention." },
  { q: "Can I configure the scoring for my business?", a: "You configure your ICP, the industries, geographies, roles, budget bands and business types that define your best customers, once per account. That drives the Fit score. The weights themselves are fixed and published, identical for every account, so a rep can always see exactly why a lead is Grade A, with no per-account drift." },
  { q: "What is the action next to each grade?", a: "A fixed map, not an AI suggestion: A is Call now, B is Follow up today, C is Nurture, D and E are Light touch, and F is Archive. Because it is fixed, it is predictable, every rep sees the same action for the same grade." },
  { q: "What about junk leads?", a: "The Quality Score catches them. Indian phone normalisation, email validity, company-name and inquiry checks combine into a Quality score. Anything under 20 is marked Grade F and excluded from the queue automatically, so bad data can't masquerade as a good lead." },
  { q: "How fast is it?", a: "Per lead, as it happens. When a new lead arrives or a signal is logged, the grade is recomputed and reflected in the rep's Priority Queue." },
]

const RELATED = [
  { icon: ListOrdered, title: "Priority Queue", description: "Scoring's other half, the graded leads ranked into one list of who to call next.", href: "/features/priority-queue" },
  { icon: AlertTriangle, title: "Missed Opportunity Engine", description: "Stale Grade A leads get a rupee value, the ₹ at risk rolled up per rep and per source.", href: "/features/missed-opportunity-engine" },
  { icon: Filter, title: "Intake Intelligence", description: "The Quality Score upstream, check a lead list for junk, duplicates and bad numbers before you import it.", href: "/features/intake-intelligence" },
]

export default function LeadScoringPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript([breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "Features", url: "/features" }, { name: "Lead Scoring" }]), faqPageSchema(FAQ)]) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        {/* HERO — split, Leadkaun light theme (copy left, live grade card right) */}
        <section className="relative overflow-hidden border-b rule-paper" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, var(--paper) 100%)" }}>
          <div aria-hidden className="pointer-events-none absolute -right-32 -top-24 h-[460px] w-[620px] rounded-full opacity-[0.30] blur-[130px]" style={{ background: "radial-gradient(circle, #BAE6FD 0%, transparent 70%)" }} />
          <Container className="relative pt-32 pb-16 md:pt-40 md:pb-24">
            <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
              {/* LEFT — copy */}
              <div className="rise" style={{ animationDelay: "40ms" }}>
                <p className="ledger-num inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-sky-600">
                  <Gauge className="h-3.5 w-3.5" strokeWidth={2} /> Lead Scoring Engine
                </p>
                <h1 className="display-xl mt-6 text-[40px] text-ink sm:text-[52px] lg:text-[58px]">
                  How Leadkaun grades
                  <br />
                  every lead.{" "}
                  <span className="relative inline-block text-sky-600">
                    A–F, in real time.
                    <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-sky-200" />
                  </span>
                </h1>
                <p className="mt-7 max-w-xl text-[17px] leading-[1.7] text-ink-soft md:text-[18px]">
                  Not all leads are equal. Leadkaun scores every lead on three independent dimensions, Fit, Intent and Quality, and turns them into one grade with one action. Below is the real thing, not a diagram.
                </p>
                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <a href={APP_URLS.register} className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-[15px] font-semibold transition-all hover:-translate-y-0.5" style={{ background: "#0877B8", color: "#FFFFFF", boxShadow: "0 8px 20px -10px rgba(15,23,42,0.35)" }}>
                    Start free trial <ArrowRight className="h-4 w-4" />
                  </a>
                  <Link href="/best/lead-scoring-software" className="inline-flex items-center gap-2 rounded-xl border bg-white px-6 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:border-sky-300" style={{ borderColor: "var(--paper-line-2)" }}>
                    See the buyer&apos;s guide <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* RIGHT — live grade card (real GradeBadge + ScoreCell atoms) */}
              <div className="rise" style={{ animationDelay: "160ms" }}>
                <FloatingCard tier="2" depth="3" gloss aura="sky" className="mx-auto max-w-md p-6 md:p-7">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Sample lead</p>
                      <h3 className="mt-1 text-[16px] font-semibold leading-tight text-ink">Textile exporter enquiry</h3>
                      <p className="text-[12.5px] text-ink-muted">Surat · replied on WhatsApp</p>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <GradeBadge grade="A" />
                      <span className="whitespace-nowrap rounded-full bg-white/70 px-2 py-0.5 font-mono text-[10px] font-semibold text-ink-soft ring-1 ring-black/5">Call now</span>
                    </div>
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-3 rounded-2xl bg-white/60 p-4 ring-1 ring-black/5">
                    <div><p className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-muted">Fit</p><ScoreCell value={78} of={100} tone="fit" /></div>
                    <div><p className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-muted">Intent</p><ScoreCell value={71} of={100} tone="intent" /></div>
                    <div><p className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-muted">Quality</p><ScoreCell value={82} of={100} tone="quality" /></div>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t pt-3.5" style={{ borderColor: "var(--hairline)" }}>
                    <span className="text-[12.5px] text-ink-soft">Total score</span>
                    <span className="font-mono text-[13px] font-semibold tabular text-ink">81 / 100</span>
                  </div>
                  <p className="mt-3 text-[12px] leading-snug text-ink-muted">All three scores clear the Grade A threshold, so this one goes to the top of the queue.</p>
                </FloatingCard>
              </div>
            </div>
          </Container>
        </section>

        {/* 01 — THE REAL INTERACTIVE DEMO (same app as the homepage, opened onto a lead's page) */}
        <SectionGround variant="sky" size="lg">
          <Container>
            <Reveal className="mb-8 max-w-3xl">
              <NumberedTag number="01" label="The live product" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Open a lead and see the score for real.
              </h2>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
                This is the actual product, not a video. It opens on a lead&apos;s page with its live Fit, Intent and Quality breakdown. Log a call or a WhatsApp reply and watch the grade and the Priority Queue re-rank.
              </p>
            </Reveal>
          </Container>
          <Reveal delay={0.06} className="mx-auto w-full max-w-[1360px] px-4 md:px-8">
            <AppReplica initialView="lead" />
          </Reveal>
        </SectionGround>

        {/* AI QUICK ANSWER (GEO / voice) — accent card, key terms chipped.
            Keeps .quick-answer-q / .quick-answer-a + Speakable schema for extraction. */}
        <SectionGround variant="pure" size="sm">
          <Container>
            <div className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl border bg-white p-6 pl-7 md:p-8 md:pl-10" style={{ borderColor: "var(--paper-line)" }} data-quick-answer>
              <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", speakable: { "@type": "SpeakableSpecification", cssSelector: [".quick-answer-q", ".quick-answer-a"] } }) }} />
              <span aria-hidden className="absolute inset-y-0 left-0 w-1.5" style={{ background: "linear-gradient(180deg,#38BDF8,#0EA5E9)" }} />
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-sky-500" aria-hidden />
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-600">Quick answer</p>
              </div>
              <p className="quick-answer-q mt-3 text-[16px] font-semibold text-ink md:text-[17px]">How does Leadkaun&apos;s lead scoring work?</p>
              <p className="quick-answer-a mt-3 text-[16px] leading-[1.75] text-ink-soft">
                Leadkaun grades every lead <Chip>A–F</Chip> in real time from three independent 0–100 scores — <Chip tone="fit">Fit</Chip> (ICP match), <Chip tone="intent">Intent</Chip> (live engagement, which decays when a lead goes silent) and <Chip tone="quality">Quality</Chip> (data reliability). A published threshold matrix turns the three into one grade, <Chip tone="warn">Quality below 20 forces F</Chip>, and each grade maps to a fixed next action.
              </p>
            </div>
          </Container>
        </SectionGround>

        {/* 01 — ANATOMY OF A GRADE (real ScoreCell + GradeBadge atoms) */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mb-10 md:mb-14">
              <NumberedTag number="02" tone="warm" label="Anatomy of a grade" />
              <h2 className="mt-5 max-w-3xl text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Three scores in. One grade, one action out.
              </h2>
              <p className="mt-4 max-w-2xl text-[17px] leading-[1.55] text-ink-soft">
                The exact score bars a rep sees on a lead. Illustrative leads, real scoring logic.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-5 md:grid-cols-3 md:gap-6">
              {SAMPLE_LEADS.map((l) => (
                <FloatingCard key={l.source} tier="2" depth="2" gloss className="flex flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Sample lead</p>
                      <h3 className="mt-1 text-[15px] font-semibold leading-tight text-ink">{l.source}</h3>
                      <p className="text-[12.5px] text-ink-muted">{l.place}</p>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <GradeBadge grade={l.grade} />
                      <span className="whitespace-nowrap rounded-full bg-white/70 px-2 py-0.5 font-mono text-[10px] font-semibold text-ink-soft ring-1 ring-black/5">{l.action}</span>
                    </div>
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-3 rounded-2xl bg-white/60 p-4 ring-1 ring-black/5">
                    <div><p className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-muted">Fit</p><ScoreCell value={l.fit} of={100} tone="fit" /></div>
                    <div><p className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-muted">Intent</p><ScoreCell value={l.intent} of={100} tone="intent" /></div>
                    <div><p className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-muted">Quality</p><ScoreCell value={l.quality} of={100} tone="quality" /></div>
                  </div>
                  <p className="mt-4 text-[13.5px] leading-[1.55] text-ink-soft">{l.reason}</p>
                </FloatingCard>
              ))}
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 text-[13.5px] leading-snug text-ink-muted">
                The bar on each score fills toward 100. Quality below 20 forces Grade F, whatever Fit and Intent say.
              </p>
            </Reveal>
          </Container>
        </SectionGround>

        {/* 03 — THE THREE SCORES */}
        <SectionGround variant="pure" size="lg">
          <Container>
            <Reveal className="mb-12 md:mb-16">
              <NumberedTag number="03" label="Three independent scores" />
              <h2 className="mt-5 max-w-3xl text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Fit. Intent. Quality.
              </h2>
              <p className="mt-4 max-w-2xl text-[17px] leading-[1.55] text-ink-soft">
                Each score is 0–100, independent and auditable. Together they determine the grade.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-5 md:grid-cols-3 md:gap-6">
              {SCORES.map((s, i) => (
                <FloatingCard key={s.name} tier="2" depth="2" gloss aura={i === 1 ? "peach" : "sky"} className="p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Score</span>
                      <h3 className="mt-1 text-[20px] font-semibold tracking-[-0.01em] text-ink">{s.name}</h3>
                    </div>
                    <span className="rounded-full px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] glass-sky">0 – 100</span>
                  </div>
                  <p className="mt-3 text-[13.5px] leading-[1.55] text-ink-soft">{s.description}</p>
                  <ul className="mt-5 divide-y" style={{ borderColor: "var(--hairline)", borderTop: "1px solid var(--hairline)" }}>
                    {s.weights.map((w) => (
                      <li key={w.label} className="flex items-center justify-between py-2.5">
                        <span className="text-[13px] text-ink-soft">{w.label}</span>
                        <span className="font-mono text-[12px] font-semibold tabular text-ink">{w.pts}</span>
                      </li>
                    ))}
                  </ul>
                </FloatingCard>
              ))}
            </Reveal>
          </Container>
        </SectionGround>

        {/* 03 — THE GRADE MATRIX (real thresholds + fixed action map) */}
        <SectionGround variant="sky" size="lg">
          <Container>
            <Reveal className="mb-12 md:mb-16">
              <NumberedTag number="04" label="The Grade Matrix" />
              <h2 className="mt-5 max-w-3xl text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Every grade maps to a fixed action.
              </h2>
              <p className="mt-4 max-w-2xl text-[17px] leading-[1.55] text-ink-soft">
                The same matrix every rep sees. The action is a fixed map, not an AI suggestion, so it is predictable.
              </p>
            </Reveal>
            <Reveal delay={0.08}><FloatingCard tier="3" depth="3" gloss className="overflow-hidden">
              <div className="grid grid-cols-[80px_1fr_1fr]" style={{ borderBottom: "1px solid var(--hairline-strong)" }}>
                <div className="px-6 py-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Grade</div>
                <div className="px-6 py-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Condition</div>
                <div className="px-6 py-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Fixed action</div>
              </div>
              {GRADES.map((r, i) => (
                <div key={r.grade} className="grid grid-cols-[80px_1fr_1fr] items-center" style={i < GRADES.length - 1 ? { borderBottom: "1px solid var(--hairline)" } : undefined}>
                  <div className="px-6 py-5">
                    <span
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full font-mono text-[14px] font-bold text-white"
                      style={{ background: `linear-gradient(180deg, color-mix(in srgb, ${r.color} 70%, white) 0%, ${r.color} 100%)`, boxShadow: `inset 0 1px 0 rgba(255,255,255,0.5), 0 4px 10px ${r.color}55` }}
                    >{r.grade}</span>
                  </div>
                  <div className="px-6 py-5 font-mono text-[13px] tabular text-ink-soft">{r.cond}</div>
                  <div className="px-6 py-5 text-[14px] font-semibold text-ink">{r.action}</div>
                </div>
              ))}
            </FloatingCard></Reveal>
          </Container>
        </SectionGround>

        {/* 04 — INTENT DECAY */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <div className="mx-auto max-w-4xl">
              <NumberedTag number="05" tone="warm" label="The intent decay rule" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Silent leads drop automatically.
              </h2>
              <Reveal delay={0.08} className="mt-10 grid gap-8 md:grid-cols-2">
                <div>
                  <p className="text-[17px] leading-[1.6] text-ink-soft">
                    Without decay, a Grade A lead from two weeks ago stays Grade A forever, while newly-hot leads wait below it. That is how real teams lose deals.
                  </p>
                  <p className="mt-4 text-[17px] leading-[1.6] text-ink-soft">
                    With decay, silence has consequences. Intent drops <span className="font-mono font-semibold text-ink">−3 pts / day</span> after the engagement threshold, so last week&apos;s Grade A becomes a B by Wednesday. A re-engagement signal spikes it back up.
                  </p>
                </div>
                <FloatingCard tier="3" depth="3" gloss className="p-6 md:p-7">
                  <div className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-orange-500">
                    <Zap className="h-3.5 w-3.5" /> Worked example
                  </div>
                  {/* intent over time — decays, then a re-engagement signal spikes it */}
                  <div className="mt-4">
                    <svg viewBox="0 0 280 96" className="h-24 w-full" preserveAspectRatio="none" aria-hidden>
                      <defs>
                        <linearGradient id="decayFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10B981" stopOpacity="0.26" />
                          <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <line x1="0" y1="38.4" x2="280" y2="38.4" stroke="var(--hairline)" strokeDasharray="4 4" />
                      <polygon points="20,24.96 100,39.36 180,48 260,38.4 260,96 20,96" fill="url(#decayFill)" />
                      <polyline points="20,24.96 100,39.36 180,48 260,38.4" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      {[["20", "24.96"], ["100", "39.36"], ["180", "48"], ["260", "38.4"]].map(([cx, cy], i) => (
                        <circle key={i} cx={cx} cy={cy} r="3.5" fill="#fff" stroke="#10B981" strokeWidth="2" />
                      ))}
                    </svg>
                    <div className="mt-1 flex justify-between font-mono text-[10px] text-ink-muted"><span>Day 0</span><span className="text-orange-500">−3 / day</span><span>Day 9</span></div>
                  </div>
                  <div className="mt-4 space-y-2.5">
                    {[
                      { day: "Day 0 · initial contact", grade: "A" as Grade, intent: 74 },
                      { day: "Day 5 · silence", grade: "A" as Grade, intent: 59 },
                      { day: "Day 8 · still silent", grade: "B" as Grade, intent: 50 },
                      { day: "Day 9 · WhatsApp reply +10", grade: "A" as Grade, intent: 60 },
                    ].map((r) => (
                      <div key={r.day} className="flex items-center gap-3">
                        <GradeBadge grade={r.grade} size="sm" />
                        <span className="min-w-0 flex-1 truncate font-mono text-[12px] text-ink-soft">{r.day}</span>
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-400" style={{ width: `${r.intent}%` }} /></div>
                        <span className="w-6 text-right font-mono text-[12px] font-semibold tabular text-ink">{r.intent}</span>
                      </div>
                    ))}
                  </div>
                </FloatingCard>
              </Reveal>
            </div>
          </Container>
        </SectionGround>

        {/* 05 — GRADE DISTRIBUTION (viz) */}
        <SectionGround variant="pure" size="lg">
          <Container>
            <Reveal className="mb-10 grid items-center gap-10 md:grid-cols-2">
              <div>
                <NumberedTag number="06" label="Import to graded" />
                <h2 className="mt-5 text-[30px] font-semibold leading-[1.12] tracking-[-0.03em] text-ink md:text-[38px]">
                  A list comes back as a distribution, not a pile.
                </h2>
                <p className="mt-4 text-[16px] leading-[1.6] text-ink-soft">
                  Import a CSV and the whole account comes back graded. Instead of scrolling a flat list, you see how many A, B and C leads you actually have, and where the effort should go first.
                </p>
              </div>
              <FloatingCard tier="2" depth="2" gloss className="p-7">
                <GradeDistribution />
                <p className="mt-4 font-mono text-[10.5px] leading-snug text-ink-muted">Illustrative distribution.</p>
              </FloatingCard>
            </Reveal>
          </Container>
        </SectionGround>

        {/* 07 — CONFIDENCE & FRESHNESS */}
        <SectionGround variant="pure" size="lg">
          <Container>
            <Reveal className="mb-10 max-w-3xl">
              <NumberedTag number="07" label="Confidence & freshness" />
              <h2 className="mt-5 text-[28px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[34px]">
                A thin lead is not a bad lead.
              </h2>
              <p className="mt-5 text-[16px] leading-[1.65] text-ink-soft">
                A rep opens a lead with a first name and a mobile number and nothing else. Most systems score it low, which says the lead is weak. That is usually the wrong claim, the honest position is that there is not enough here to judge yet. So Leadkaun keeps two readings apart from the grade.
              </p>
            </Reveal>
            <div className="grid gap-5 md:grid-cols-2 md:gap-6">
              {/* Confidence */}
              <Reveal delay={0.04}>
                <FloatingCard tier="2" depth="2" gloss aura="sky" className="h-full p-7">
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-600">Confidence</p>
                  <h3 className="mt-2 text-[19px] font-semibold text-ink">How much we actually know</h3>
                  <p className="mt-2.5 text-[14.5px] leading-[1.6] text-ink-soft">
                    Separate from the grade. A weighted read across eight fields, with a prioritised list of what to ask for next, so a thin lead becomes a qualifying call instead of a shrug.
                  </p>
                  <div className="mt-5 rounded-2xl bg-white/60 p-4 ring-1 ring-black/5">
                    <div className="flex items-center justify-between text-[12px] text-ink-soft"><span>Confidence</span><span className="font-mono font-semibold tabular text-ink">38 / 100</span></div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-sky-400" style={{ width: "38%" }} /></div>
                    <p className="mt-3.5 flex flex-wrap items-center gap-1.5 text-[12px] text-ink-muted">Next, ask for: <Chip>company</Chip> <Chip>budget band</Chip></p>
                  </div>
                </FloatingCard>
              </Reveal>
              {/* Freshness */}
              <Reveal delay={0.08}>
                <FloatingCard tier="2" depth="2" gloss aura="peach" className="h-full p-7">
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-orange-500">Freshness</p>
                  <h3 className="mt-2 text-[19px] font-semibold text-ink">How current the signal is</h3>
                  <p className="mt-2.5 text-[14.5px] leading-[1.6] text-ink-soft">
                    A list collected months ago and imported this morning looks identical to a fresh enquiry until something says otherwise. Every lead carries an ageing band that keeps moving.
                  </p>
                  <div className="mt-5 rounded-2xl bg-white/60 p-4 ring-1 ring-black/5">
                    <p className="mb-2.5 text-[12px] text-ink-soft">Ageing band</p>
                    <div className="flex flex-wrap gap-1.5">
                      {[["Fresh", true], ["7 days", false], ["30 days", false], ["90 days", false], ["Stale", false]].map(([label, on]) => (
                        <span key={String(label)} className={`rounded-md px-2 py-0.5 text-[11.5px] font-semibold ring-1 ${on ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-slate-50 text-ink-muted ring-black/5"}`}>{label}</span>
                      ))}
                    </div>
                  </div>
                </FloatingCard>
              </Reveal>
            </div>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-3xl text-[14.5px] leading-[1.6] text-ink-soft">
                Both readings are visible on the lead and frozen into the score timeline whenever a grade changes. See the full guide to <Link href="/learn/lead-data-trust" className="font-semibold text-sky-600 underline-offset-2 hover:underline">lead data trust</Link>.
              </p>
            </Reveal>
          </Container>
        </SectionGround>

        {/* 08 — FAQ */}
        <SectionGround variant="sky" size="md">
          <Container>
            <Reveal className="mx-auto mb-10 max-w-3xl text-center">
              <div className="flex justify-center"><NumberedTag number="08" label="FAQ" /></div>
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">
                Questions about scoring.
              </h2>
            </Reveal>
            <Reveal delay={0.08}><Faq items={FAQ} /></Reveal>
          </Container>
        </SectionGround>

        {/* 09 — RELATED */}
        <SectionGround variant="cream" size="md">
          <Container>
            <Reveal className="mb-10">
              <NumberedTag number="09" tone="warm" label="Works with" />
              <h2 className="mt-5 max-w-3xl text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[36px]">
                Scoring is step one. Here&apos;s what it connects to.
              </h2>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-5 md:grid-cols-3 md:gap-6">
              {RELATED.map((r, i) => <FeatureCard key={r.href} {...r} variant={i % 2 === 1 ? "soft" : "default"} />)}
            </Reveal>
          </Container>
        </SectionGround>

        {/* PROOF — product-mechanics stat tiles (bespoke) */}
        <SectionGround variant="cream" size="md">
          <Container>
            <Reveal className="mb-7 text-center">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                Product mechanics, published in full at{" "}
                <Link href="/methodology" className="text-sky-600 hover:underline">/methodology</Link>
              </p>
            </Reveal>
            <Reveal delay={0.06} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {([
                { Icon: Gauge, stat: "A–F", label: "Every lead graded, in real time" },
                { Icon: SlidersHorizontal, stat: "3 scores", label: "Fit, Intent and Quality, published weights" },
                { Icon: Clock, stat: "Same day", label: "To your first graded lead" },
                { Icon: IndianRupee, stat: "Flat ₹", label: "Priced per account, not per seat" },
              ] as { Icon: LucideIcon; stat: string; label: string }[]).map(({ Icon, stat, label }) => (
                <FloatingCard key={stat} tier="2" depth="2" gloss aura="sky" className="p-6 text-center">
                  <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 ring-1 ring-sky-100"><Icon className="h-5 w-5" strokeWidth={2} /></span>
                  <p className="mt-4 text-[28px] font-semibold tracking-[-0.02em] text-ink md:text-[32px]">{stat}</p>
                  <p className="mt-1.5 text-[13px] leading-snug text-ink-soft">{label}</p>
                </FloatingCard>
              ))}
            </Reveal>
          </Container>
        </SectionGround>

        {/* CLOSING CTA (bespoke) */}
        <SectionGround variant="pure" size="lg">
          <Container>
            <Reveal className="mx-auto max-w-4xl">
              <div className="relative overflow-hidden rounded-3xl border p-10 text-center md:p-14" style={{ borderColor: "var(--paper-line)", background: "linear-gradient(180deg,#FFFFFF, var(--paper))" }}>
              <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-96 rounded-full opacity-30 blur-[110px]" style={{ background: "radial-gradient(circle,#BAE6FD 0%,transparent 70%)" }} />
              <p className="ledger-num relative text-[11px] uppercase tracking-[0.22em] text-sky-600">Ready when you are</p>
              <h2 className="display-lg relative mx-auto mt-5 max-w-2xl text-[30px] text-ink md:text-[44px]">
                See your leads graded{" "}
                <span className="relative inline-block text-sky-600">
                  the same day.
                  <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-sky-200" />
                </span>
              </h2>
              <p className="relative mx-auto mt-6 max-w-xl text-[16px] leading-[1.7] text-ink-soft">
                Import a CSV and Leadkaun grades every lead A–F within the hour. Free tier, no card, live the same day.
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
