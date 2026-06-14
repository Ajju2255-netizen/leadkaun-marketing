import type { Metadata } from "next"
import { Gauge, Zap, Filter, ListOrdered, AlertTriangle } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
import { ProofBand, ProductBlock } from "@/app/components/sell/blocks"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { PageHero } from "@/app/components/page-hero"
import { NumberedTag } from "@/app/components/numbered-tag"
import { FeatureCard } from "@/app/components/feature-card"
import { FloatingCard } from "@/app/components/floating-card"
import { Faq } from "@/app/components/faq"
import { Reveal } from "@/app/components/reveal"
import { faqPageSchema, jsonLdScript } from "@/lib/seo"
import { APP_URLS } from "@/lib/urls"

export const metadata: Metadata = {
  title: "Lead Scoring Software India — Grade A–F in 500ms",
  description:
    "Leadkaun's scoring engine grades every lead A–F across Fit, Intent, and Quality in under 500ms. Transparent weights, intent decay, calibrated for Indian B2B.",
  alternates: { canonical: "/features/lead-scoring" },
}

const SCORES = [
  { name: "Fit Score",     description: "How well the lead matches your ICP. Static — changes only when new firmographic info arrives.", weights: [
    { label: "Industry match",        pts: "30 pts" }, { label: "Geography",            pts: "20 pts" },
    { label: "Business type",         pts: "20 pts" }, { label: "Role / decision-maker", pts: "15 pts" },
    { label: "Budget signal",         pts: "15 pts" },
  ]},
  { name: "Intent Score",  description: "How engaged the lead is right now. Spikes on signals, decays with silence.", weights: [
    { label: "Source baseline",       pts: "base" },   { label: "Call signal",          pts: "+15 pts" },
    { label: "WhatsApp reply",        pts: "+10 pts" },{ label: "Meeting booked",       pts: "+25 pts" },
    { label: "Silent ≥ 1 day",        pts: "−3 / day" },
  ]},
  { name: "Quality Score", description: "Is the data usable? Below 20 = auto-Grade F, excluded from the queue.", weights: [
    { label: "Valid phone",           pts: "30 pts" }, { label: "Valid email",          pts: "15 pts" },
    { label: "Company name",          pts: "15 pts" }, { label: "Inquiry clarity",      pts: "20 pts" },
    { label: "Source reliability",    pts: "10 pts" },
  ]},
]

const GRADES = [
  { grade: "A", color: "#10B981", cond: "Fit ≥ 65 · Intent ≥ 60 · Quality ≥ 60", action: "Call within 24 hours" },
  { grade: "B", color: "#0EA5E9", cond: "Fit ≥ 55 · Intent ≥ 40 · Quality ≥ 50", action: "Follow up within 48 hours" },
  { grade: "C", color: "#FB923C", cond: "Fit ≥ 40 · Intent ≥ 25 · Quality ≥ 35", action: "Weekly nurture cadence" },
  { grade: "D", color: "#F97316", cond: "Fit ≥ 20 · Intent ≥ 10 · Quality ≥ 20", action: "Low priority" },
  { grade: "F", color: "#94A3B8", cond: "Quality < 20 (junk / incomplete data)", action: "Auto-discarded" },
]

const FAQ = [
  { q: "What is lead scoring, in simple terms?", a: "Lead scoring ranks every lead by how likely they are to convert. Leadkaun scores across three independent dimensions — Fit (ICP match), Intent (engagement), Quality (data reliability) — and combines them into a Grade A–F. Your rep works Grade A first, always." },
  { q: "How is this different from my CRM's lead scoring?", a: "Most CRM scoring is a single points-based number — a black box. Leadkaun uses three transparent scores with weights you can audit. Intent decays automatically when leads go silent, so stale Grade A leads drop to B or C on their own — no manager intervention." },
  { q: "How fast is it?", a: "Under 500 ms per lead. When a new lead arrives or a signal is logged, the scoring engine runs immediately and propagates the grade change to every rep's Priority Queue in real time." },
  { q: "Can I customise the weights?", a: "Yes — on Growth and Scale tiers. Defaults are calibrated for Indian B2B SMBs across 12 industries. You can tune weights per pipeline (e.g. weight geography higher for real estate, weight role higher for SaaS)." },
  { q: "What about junk leads?", a: "Quality Score catches them. Phone normalisation (Indian carrier ranges), email MX validation, company name checks, and inquiry text patterns combine into a Quality score. Anything under 20 is marked Grade F and excluded from the queue automatically." },
]

const RELATED = [
  { icon: ListOrdered,   title: "Priority Queue",            description: "Works hand-in-hand with scoring — rank the graded leads and serve them top-down.", href: "/features/priority-queue" },
  { icon: AlertTriangle, title: "Missed Opportunity Engine", description: "Stale Grade A leads get a rupee value. ₹ at risk rolled up per rep and per source.", href: "/features/missed-opportunity-engine" },
  { icon: Filter,        title: "Lead Quality Analysis",     description: "The Quality Score, deeper — per-source reliability, junk detection, deduplication.", href: "/features/whatsapp-tracking" },
]

export default function LeadScoringPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(faqPageSchema(FAQ)) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        <PageHero
          eyebrow={<><Gauge className="h-3 w-3" strokeWidth={2} /> Lead Scoring Engine</>}
          h1={<>Grade A–F. In 500 ms.<br /><span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(95deg, #0EA5E9 0%, #FB923C 100%)" }}>Three scores. One answer.</span></>}
          sub="Not all leads are equal. Leadkaun scores every lead on three independent dimensions — Fit, Intent, Quality — in under 500 milliseconds. Your rep always knows who to call first."
          primary={{ kind: "primary", label: "Start free trial", href: APP_URLS.register, external: true }}
          secondary={{ kind: "text", label: "See Priority Queue", href: "/features/priority-queue" }}
        />

        {/* THREE SCORES */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mb-12 md:mb-16">
              <NumberedTag number="01" tone="warm" label="Three independent scores" />
              <h2 className="mt-5 max-w-3xl text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Fit. Intent. Quality.
              </h2>
              <p className="mt-4 max-w-2xl text-[17px] leading-[1.55] text-ink-soft">
                Each score is 0–100. Independent. Auditable. Together they determine the grade.
              </p>
            </Reveal>

            <Reveal delay={0.08} className="grid gap-5 md:grid-cols-3 md:gap-6">
              {SCORES.map((s, i) => (
                <FloatingCard key={s.name} tier="2" depth="2" gloss aura={i === 1 ? "peach" : "sky"} className="p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Score</span>
                      <h3 className="mt-1 text-[20px] font-semibold text-ink tracking-[-0.01em]">{s.name}</h3>
                    </div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] rounded-full px-2.5 py-1 glass-sky">0 – 100</span>
                  </div>
                  <ul className="mt-6 divide-y" style={{ borderColor: "var(--hairline)", borderTop: "1px solid var(--hairline)" }}>
                    {s.weights.map((w) => (
                      <li key={w.label} className="flex items-center justify-between py-2.5">
                        <span className="text-[13px] text-ink-soft">{w.label}</span>
                        <span className="font-mono text-[12px] font-semibold text-ink tabular">{w.pts}</span>
                      </li>
                    ))}
                  </ul>
                </FloatingCard>
              ))}
            </Reveal>
          </Container>
        </SectionGround>

        {/* GRADE MATRIX */}
        <SectionGround variant="sky" size="lg">
          <Container>
            <Reveal className="mb-12 md:mb-16">
              <NumberedTag number="02" label="The Grade Matrix" />
              <h2 className="mt-5 max-w-3xl text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Every grade maps to a specific action.
              </h2>
              <p className="mt-4 max-w-2xl text-[17px] leading-[1.55] text-ink-soft">
                The matrix below is the same one every rep sees. No hidden AI. No surprises.
              </p>
            </Reveal>

            <Reveal delay={0.08}><FloatingCard tier="3" depth="3" gloss className="overflow-hidden">
              <div className="grid grid-cols-[80px_1fr_1fr]" style={{ borderBottom: "1px solid var(--hairline-strong)" }}>
                <div className="px-6 py-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Grade</div>
                <div className="px-6 py-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Condition</div>
                <div className="px-6 py-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Rep action</div>
              </div>
              {GRADES.map((r, i) => (
                <div key={r.grade} className="grid grid-cols-[80px_1fr_1fr] items-center" style={i < GRADES.length - 1 ? { borderBottom: "1px solid var(--hairline)" } : undefined}>
                  <div className="px-6 py-5">
                    <span
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full font-mono text-[14px] font-bold text-white"
                      style={{
                        background: `linear-gradient(180deg, color-mix(in srgb, ${r.color} 70%, white) 0%, ${r.color} 100%)`,
                        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.5), 0 4px 10px ${r.color}55`,
                      }}
                    >
                      {r.grade}
                    </span>
                  </div>
                  <div className="px-6 py-5 font-mono text-[13px] text-ink-soft tabular">{r.cond}</div>
                  <div className="px-6 py-5 text-[14px] font-semibold text-ink">{r.action}</div>
                </div>
              ))}
            </FloatingCard></Reveal>
          </Container>
        </SectionGround>

        {/* INTENT DECAY CALLOUT */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <div className="mx-auto max-w-4xl">
              <NumberedTag number="03" tone="warm" label="The intent decay rule" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Silent leads drop automatically.
              </h2>
              <Reveal delay={0.08} className="mt-10 grid gap-8 md:grid-cols-2">
                <div>
                  <p className="text-[17px] leading-[1.6] text-ink-soft">
                    Without decay, a Grade A lead from two weeks ago stays Grade A forever, while newly-hot leads wait below. That&apos;s how real teams lose deals.
                  </p>
                  <p className="mt-4 text-[17px] leading-[1.6] text-ink-soft">
                    With decay, silence has consequences. Intent drops <span className="font-mono text-ink font-semibold">−3 pts / day</span> after the engagement threshold. The Grade A from last week becomes a B by Wednesday. Re-engagement spikes it back up.
                  </p>
                </div>
                <FloatingCard tier="3" depth="3" gloss className="p-7">
                  <div className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-orange-500">
                    <Zap className="h-3.5 w-3.5" /> Example
                  </div>
                  <div className="mt-4 space-y-3 font-mono text-[13px] tabular">
                    <div className="flex items-baseline justify-between pb-2.5" style={{ borderBottom: "1px solid var(--hairline)" }}>
                      <span className="text-ink-soft">Day 0 · initial contact</span>
                      <span className="font-bold text-mint-500">Grade A · Intent 74</span>
                    </div>
                    <div className="flex items-baseline justify-between pb-2.5" style={{ borderBottom: "1px solid var(--hairline)" }}>
                      <span className="text-ink-soft">Day 5 · silence</span>
                      <span className="text-ink">Grade A · Intent 59</span>
                    </div>
                    <div className="flex items-baseline justify-between pb-2.5" style={{ borderBottom: "1px solid var(--hairline)" }}>
                      <span className="text-ink-soft">Day 8 · still silent</span>
                      <span className="text-orange-500">Grade B · Intent 50</span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-ink-soft">Day 9 · WA reply +10</span>
                      <span className="font-bold text-mint-500">Grade A · Intent 60</span>
                    </div>
                  </div>
                </FloatingCard>
              </Reveal>
            </div>
          </Container>
        </SectionGround>

        {/* FAQ */}
        <SectionGround variant="sky" size="md">
          <Container>
            <Reveal className="mx-auto mb-10 max-w-3xl text-center">
              <div className="flex justify-center"><NumberedTag number="04" label="FAQ" /></div>
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">
                Questions about scoring.
              </h2>
            </Reveal>
            <Reveal delay={0.08}><Faq items={FAQ} /></Reveal>
          </Container>
        </SectionGround>

        {/* RELATED */}
        <SectionGround variant="cream" size="md">
          <Container>
            <Reveal className="mb-10">
              <NumberedTag number="05" tone="warm" label="Works with" />
              <h2 className="mt-5 max-w-3xl text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[36px]">
                Scoring is step one. Here&apos;s what it connects to.
              </h2>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-5 md:grid-cols-3 md:gap-6">
              {RELATED.map((r, i) => <FeatureCard key={r.href} {...r} variant={i % 2 === 1 ? "soft" : "default"} />)}
            </Reveal>
          </Container>
        </SectionGround>

        <ProofBand />
        <ProductBlock
          eyebrow="See it in Leadkaun"
          title={<>See your leads graded A–F, live.</>}
          sub="Scoring feeds a Priority Queue that ranks by grade and surfaces the ₹ at risk in real rupees — the working screen your reps open every morning."
        />

        <CTABanner
          tag={{ number: "06", label: "Ready when you are" }}
          headline="See your leads graded in 60 minutes."
          sub="Import a CSV. Leadkaun grades every lead A–F by the end of the hour. Free for 14 days."
        />

        <Footer />
      </main>
    </>
  )
}
