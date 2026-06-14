import type { Metadata } from "next"
import { ListOrdered, Gauge, AlertTriangle, Mail } from "lucide-react"

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
  title: "Priority Queue — Stop letting Grade A leads go cold",
  description:
    "Leadkaun's Priority Queue ranks every lead by grade, urgency, and freshness — and re-ranks in real time as signals arrive. No manual sorting. No gut-feel triage.",
  alternates: { canonical: "/features/priority-queue" },
}

const RANK_WEIGHTS = [
  { label: "Grade (A / B / C / D / F)",         pts: "4000 · 3000 · 2000 · 500 · −1" },
  { label: "Callback due today",                pts: "+1500" },
  { label: "Follow-up overdue",                 pts: "+800" },
  { label: "Re-engagement after silence",       pts: "+2000" },
  { label: "Intent +10 in 24 h",                pts: "+1000" },
  { label: "Recency (0–500)",                   pts: "+0 to +500" },
  { label: "Fatigued (6+ touches, no signal)",  pts: "−1 (bottom)" },
]

const FAQ = [
  { q: "How is the queue different from a to-do list?", a: "A to-do list is static — whatever the rep added yesterday. A Priority Queue is dynamic — it re-ranks every time a signal arrives. New Grade A enquiry at 11 AM? Top of queue by 11:01. A WhatsApp reply bumps a lead up. Intent decay drops stale leads. The queue always reflects now, not yesterday." },
  { q: "What if my rep wants to work their own order?", a: "They can pin one lead to the top of the day, but auto-ranking resumes at midnight. Most reps override twice in week one, then stop — the data shows queue-order consistently out-closes gut-feel." },
  { q: "How fast does the queue update?", a: "React Query polls every 30 seconds by default — fast enough that a new Grade A arrival or WhatsApp reply shows in the queue before the rep finishes their current call." },
  { q: "What is a 'fatigued' lead?", a: "A lead that has been contacted 6+ times with no positive signal. The queue drops them to rank score -1 (bottom) automatically so the rep doesn't keep burning time. You can manually un-fatigue a lead if circumstances change." },
  { q: "Does the queue work on mobile?", a: "Yes. Mobile-first layout, 3-tap logging, works on patchy 3G. Field reps in manufacturing / real estate use Leadkaun exclusively from phones." },
]

const RELATED = [
  { icon: Gauge,         title: "Lead Scoring Engine",        description: "The queue only works if every lead is graded correctly first. See how scoring works.", href: "/features/lead-scoring" },
  { icon: AlertTriangle, title: "Missed Opportunity Engine",  description: "Stale Grade A leads drop in the queue — and get surfaced with a ₹ value to recover.",    href: "/features/missed-opportunity-engine" },
  { icon: Mail,          title: "Morning Brief",              description: "The queue's top 5 for each rep, emailed at 8:30 AM IST every weekday.",                 href: "/features/morning-brief" },
]

export default function PriorityQueuePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(faqPageSchema(FAQ)) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        <PageHero
          eyebrow={<><ListOrdered className="h-3 w-3" strokeWidth={2} /> Priority Queue</>}
          h1={<>One ranked list.<br /><span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(95deg, #0EA5E9 0%, #FB923C 100%)" }}>One rep. No triage.</span></>}
          sub="The queue re-ranks itself every time a WhatsApp reply arrives, a call gets logged, or intent decays overnight. Your rep works top-down — the decision is already made."
          primary={{ kind: "primary", label: "Start free trial", href: APP_URLS.register, external: true }}
          secondary={{ kind: "text", label: "See Lead Scoring", href: "/features/lead-scoring" }}
        />

        {/* RANK FORMULA */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mb-12 md:mb-16 max-w-3xl">
              <NumberedTag number="01" tone="warm" label="How the queue ranks" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                A transparent formula. Not a black box.
              </h2>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
                Every lead&apos;s rank score is a combination of grade + urgency + trend + recency. The weights below are Leadkaun&apos;s defaults — tuneable on Growth and Scale.
              </p>
            </Reveal>

            <Reveal delay={0.08}><FloatingCard tier="3" depth="3" gloss className="overflow-hidden">
              <div className="grid grid-cols-[1.4fr_1fr]" style={{ borderBottom: "1px solid var(--hairline-strong)" }}>
                <div className="px-6 py-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Signal</div>
                <div className="px-6 py-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted text-right">Weight</div>
              </div>
              {RANK_WEIGHTS.map((w, i) => (
                <div key={w.label} className="grid grid-cols-[1.4fr_1fr]" style={i < RANK_WEIGHTS.length - 1 ? { borderBottom: "1px solid var(--hairline)" } : undefined}>
                  <div className="px-6 py-4 text-[14px] text-ink">{w.label}</div>
                  <div className="px-6 py-4 text-right font-mono text-[13px] font-semibold text-sky-600 tabular">{w.pts}</div>
                </div>
              ))}
            </FloatingCard></Reveal>
          </Container>
        </SectionGround>

        {/* PERFORMANCE */}
        <SectionGround variant="sky" size="lg">
          <Container>
            <div className="mx-auto max-w-4xl">
              <NumberedTag number="02" label="Performance" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Built for 10,000+ leads without lag.
              </h2>
              <Reveal delay={0.08} className="mt-10 grid gap-5 md:grid-cols-3">
                {[
                  { v: "30s",   l: "Queue refresh interval",     h: "Polling via React Query — no realtime overhead per row" },
                  { v: "< 2s",  l: "Queue load for 5,000 leads", h: "Paginated 100/page, infinite scroll" },
                  { v: "500 ms", l: "Re-rank latency on signal",  h: "Deterministic TypeScript, no DB triggers" },
                ].map((m, i) => (
                  <FloatingCard key={m.l} tier="2" depth="2" gloss aura={i === 1 ? "peach" : "sky"} className="p-6">
                    <div className="font-mono text-[34px] font-semibold tracking-[-0.025em] text-ink tabular">{m.v}</div>
                    <p className="mt-2 text-[13px] font-semibold text-ink">{m.l}</p>
                    <p className="mt-1 text-[12px] text-ink-muted">{m.h}</p>
                  </FloatingCard>
                ))}
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
                Queue questions.
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
                Priority is step one. Here&apos;s what comes next.
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
          title={<>See the Priority Queue rank itself.</>}
          sub="Every lead graded A–F, re-ranked live as signals arrive, with the ₹ at risk surfaced in real rupees — so reps just work top-down."
        />

        <CTABanner
          tag={{ number: "05", label: "Ready when you are" }}
          headline="See the queue on your leads."
          sub="Import your leads. Leadkaun grades and ranks them. First queue built within the hour."
        />

        <Footer />
      </main>
    </>
  )
}
