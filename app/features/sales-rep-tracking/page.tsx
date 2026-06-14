import type { Metadata } from "next"
import { Users, Gauge, AlertTriangle, Mail } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
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
  title: "Sales Rep Tracking — Behaviour over activity",
  description:
    "Per-rep ₹ recovered, Grade A response time, follow-up completion rate, Intent-signal generation. Rep performance without micromanagement.",
  alternates: { canonical: "/features/sales-rep-tracking" },
}

const METRICS = [
  { label: "Grade A response time",   desc: "Average hours from Grade A arrival to first meaningful contact", bench: "Target: < 6 h" },
  { label: "₹ recovered per week",    desc: "Weekly value recovered from the stale-lead pool",                 bench: "Target: ₹1–3 L" },
  { label: "Follow-up score (0–100)", desc: "On-time completions ÷ assigned × 100",                            bench: "Target: 85+" },
  { label: "Intent signals logged",   desc: "Calls + WA replies + meetings logged per week",                   bench: "Target: 35+" },
  { label: "Queue adoption %",        desc: "% of calls that came from top-20 of Priority Queue",              bench: "Target: 70%+" },
  { label: "Source mix",              desc: "Distribution of recovered ₹ across lead sources",                 bench: "Diagnostic only" },
]

const FAQ = [
  { q: "Isn't this just a rep surveillance tool?", a: "No. Every metric is outcome-focused, not activity-focused. We do not measure calls-per-day or minutes-on-phone. We measure ₹ recovered, Grade A response time, follow-up completion. Reps keep autonomy; managers get outcome visibility." },
  { q: "What if a rep's number is low?", a: "Diagnose before discipline. Low Grade A response time — push alerts set up wrong? Low ₹ recovered — bad source quality? Low follow-up score — cadence too tight for their industry? Most 'performance issues' are process issues in disguise." },
  { q: "Do reps see their own dashboards?", a: "Yes — their own metrics, framed as opportunity ('₹1.8L to recover today'). They don't see other reps' numbers; managers see the full rollup." },
  { q: "How often are metrics updated?", a: "Continuously. The dashboard polls at 60s intervals. Weekly rollups auto-generate every Monday at 8:30 AM IST in the manager Morning Brief." },
  { q: "Can I compare rep performance?", a: "Managers can view per-rep comparisons on any metric over any time window. Reps only see their own view — intentionally. Public shaming is a rep-churn multiplier; the tool discourages it." },
]

const RELATED = [
  { icon: Gauge,         title: "Lead Scoring",       description: "Rep metrics are only meaningful once leads are graded. Scoring powers the comparison.", href: "/features/lead-scoring" },
  { icon: AlertTriangle, title: "Missed Opportunity", description: "The ₹ recovered number per rep comes from the Missed Opportunity Engine.",              href: "/features/missed-opportunity-engine" },
  { icon: Mail,          title: "Morning Brief",      description: "Manager version of the Brief rolls up per-rep performance numbers every 8:30 AM IST.",   href: "/features/morning-brief" },
]

export default function SalesRepTrackingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(faqPageSchema(FAQ)) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        <PageHero
          eyebrow={<><Users className="h-3 w-3" strokeWidth={2} /> Sales Rep Tracking</>}
          h1={<>Behaviour. Not activity.<br /><span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(95deg, #0EA5E9 0%, #FB923C 100%)" }}>₹ recovered. Not calls made.</span></>}
          sub="Per-rep metrics that measure outcomes — ₹ recovered, Grade A response time, follow-up completion — so coaching becomes specific, not a volume debate."
          primary={{ kind: "primary", label: "Start free trial", href: APP_URLS.register, external: true }}
          secondary={{ kind: "text", label: "See ₹ at risk", href: "/features/missed-opportunity-engine" }}
        />

        {/* METRICS GRID */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mb-12 md:mb-16 max-w-3xl">
              <NumberedTag number="01" tone="warm" label="Six metrics" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                What the manager sees. Per rep.
              </h2>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
                All six update continuously. Weekly rollup lands in the manager&apos;s Monday Brief.
              </p>
            </Reveal>

            <Reveal delay={0.08} className="grid gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {METRICS.map((m, i) => (
                <FloatingCard key={m.label} tier="2" depth="2" gloss aura={i % 3 === 1 ? "peach" : "sky"} className="p-6">
                  <p className="text-[15px] font-semibold text-ink tracking-[-0.01em]">{m.label}</p>
                  <p className="mt-2 text-[14px] leading-[1.6] text-ink-soft">{m.desc}</p>
                  <p className={`mt-4 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] ${i % 3 === 1 ? "text-orange-500" : "text-sky-600"}`}>{m.bench}</p>
                </FloatingCard>
              ))}
            </Reveal>
          </Container>
        </SectionGround>

        {/* COACHING FRAME */}
        <SectionGround variant="sky" size="lg">
          <Container>
            <div className="mx-auto max-w-4xl">
              <NumberedTag number="02" label="Coaching frame" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Specific questions, not vague pressure.
              </h2>

              <Reveal delay={0.08} className="mt-10 grid gap-5 md:grid-cols-2 md:gap-6">
                <FloatingCard tier="2" depth="2" gloss className="p-7">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-orange-500">BEFORE</p>
                  <p className="mt-3 text-[16px] leading-[1.55] text-ink-soft italic">
                    &ldquo;Your numbers are low this week. You need to be more active.&rdquo;
                  </p>
                </FloatingCard>
                <FloatingCard tier="3" depth="3" gloss aura="sky" className="p-7"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.78), rgba(255,255,255,0.78)), linear-gradient(135deg, #38BDF8 0%, #FB923C 100%)",
                    backgroundOrigin: "border-box",
                    backgroundClip: "padding-box, border-box",
                    border: "1.5px solid transparent",
                  }}
                >
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-sky-600">AFTER</p>
                  <p className="mt-3 text-[16px] leading-[1.55] text-ink">
                    &ldquo;Your Grade A response time slipped from 3 to 9 hours this week. The queue is re-ranking correctly — are your push alerts firing on your phone? Let&apos;s check before tomorrow&apos;s Brief.&rdquo;
                  </p>
                </FloatingCard>
              </Reveal>
            </div>
          </Container>
        </SectionGround>

        {/* FAQ */}
        <SectionGround variant="cream" size="md">
          <Container>
            <Reveal className="mx-auto mb-10 max-w-3xl text-center">
              <div className="flex justify-center"><NumberedTag number="03" tone="warm" label="FAQ" /></div>
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">
                Rep tracking questions.
              </h2>
            </Reveal>
            <Reveal delay={0.08}><Faq items={FAQ} /></Reveal>
          </Container>
        </SectionGround>

        {/* RELATED */}
        <SectionGround variant="sky" size="md">
          <Container>
            <Reveal className="mb-10">
              <NumberedTag number="04" label="Works with" />
              <h2 className="mt-5 max-w-3xl text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[36px]">
                Rep metrics only work if the pipeline is graded correctly.
              </h2>
            </Reveal>
            <Reveal delay={0.08} className="grid gap-5 md:grid-cols-3 md:gap-6">
              {RELATED.map((r, i) => <FeatureCard key={r.href} {...r} variant={i % 2 === 1 ? "soft" : "default"} />)}
            </Reveal>
          </Container>
        </SectionGround>

        <CTABanner
          tag={{ number: "05", label: "Ready when you are" }}
          headline="See per-rep ₹ recovered by Monday."
          sub="Import your leads today. By Monday's Brief, every rep has a scorecard. Coaching becomes specific."
        />

        <Footer />
      </main>
    </>
  )
}
