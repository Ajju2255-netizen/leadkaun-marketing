import type { Metadata } from "next"
import { Mail, Gauge, ListOrdered, AlertTriangle } from "lucide-react"

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
  title: "Morning Brief — The 8:30 AM email that sets the sales day",
  description:
    "Every weekday at 8:30 AM IST, each rep and manager gets an email with ₹ at risk today, top Grade A leads, and overdue follow-ups. The ritual that makes scoring a habit.",
  alternates: { canonical: "/features/morning-brief" },
}

const FAQ = [
  { q: "Why 8:30 AM IST?", a: "It hits before stand-up, before coffee, before anyone opens a dashboard. By the time the team gathers, everyone is looking at the same numbers — and by 11 AM, Grade A leads from overnight are contacted or on a recovery path." },
  { q: "What does a rep see vs what a manager sees?", a: "Rep brief: top 5 Grade A leads, ₹ at risk today, overdue follow-ups, one primary CTA. Manager brief: per-rep rollup of ₹ at risk, Grade A count, follow-up score, top stale leads. Same underlying data, different framing." },
  { q: "Does it send on Sundays or Saturdays?", a: "Monday through Saturday by default. Sunday is off. Per-user toggle for rep teams that work Sundays (real estate site visits, etc.)." },
  { q: "What if a rep is on leave?", a: "Toggle 'out of office' in settings. Brief pauses for them; their leads roll up to the assigned backup or the manager dashboard." },
  { q: "Can I customise what's in the brief?", a: "Reps see the same shape (brand-enforced consistency). Managers can pick which per-rep metrics appear — ₹ at risk, Grade A count, follow-up score, response-time average, etc." },
]

const RELATED = [
  { icon: Gauge,         title: "Lead Scoring",     description: "The Brief's Grade A list comes straight from the scoring engine. Every morning.", href: "/features/lead-scoring" },
  { icon: ListOrdered,   title: "Priority Queue",   description: "The rep's first 5 items are the top of their queue — now in their inbox.",          href: "/features/priority-queue" },
  { icon: AlertTriangle, title: "Missed Opportunity", description: "The ₹ at risk number in the Brief comes from the Missed Opportunity Engine.",     href: "/features/missed-opportunity-engine" },
]

export default function MorningBriefPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(faqPageSchema(FAQ)) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        <PageHero
          eyebrow={<><Mail className="h-3 w-3" strokeWidth={2} /> Morning Brief</>}
          h1={<>8:30 AM IST.<br /><span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(95deg, #0EA5E9 0%, #FB923C 100%)" }}>Monday–Saturday. The day is set.</span></>}
          sub="The ritual that makes lead scoring a daily habit. Rep and manager get the same numbers, different framing — and by 11 AM, the queue is already being worked."
          primary={{ kind: "primary", label: "Start free trial", href: APP_URLS.register, external: true }}
          secondary={{ kind: "text", label: "See ₹ at risk", href: "/features/missed-opportunity-engine" }}
        />

        {/* SAMPLE BRIEF */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mb-12 md:mb-16 max-w-3xl">
              <NumberedTag number="01" tone="warm" label="What arrives in the inbox" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Rep version. Manager version. Same data, different frame.
              </h2>
            </Reveal>

            <Reveal delay={0.08} className="grid gap-6 md:grid-cols-2">
              {/* Rep brief */}
              <FloatingCard tier="3" depth="3" gloss className="overflow-hidden">
                <div
                  className="flex items-center justify-between px-6 py-4"
                  style={{
                    borderBottom: "1px solid var(--hairline)",
                    background: "linear-gradient(180deg, rgba(186,230,253,0.30) 0%, transparent 100%)",
                  }}
                >
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-sky-600">REP BRIEF — 8:30 AM IST</span>
                  <Mail className="h-4 w-4 text-sky-500" />
                </div>
                <div className="p-6 space-y-5">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.12em] text-ink-muted">Good morning, Priya.</p>
                    <p className="mt-2 text-[24px] font-semibold leading-tight tracking-[-0.02em] text-ink">You have <span className="text-orange-500">₹1.8L</span> to recover today.</p>
                  </div>
                  <div className="pt-4 space-y-3" style={{ borderTop: "1px solid var(--hairline)" }}>
                    <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Top 3 Grade A leads</p>
                    <ul className="space-y-2.5">
                      {["Suresh Kumar · BuildRight Properties", "Meera Nair · Edvance Learning", "Ankit Patel · FinTrust NBFC"].map((l) => (
                        <li key={l} className="flex items-center gap-3 text-[14px] text-ink">
                          <span
                            className="inline-flex h-7 w-7 items-center justify-center rounded-full font-mono text-[11px] font-bold text-white"
                            style={{ background: "linear-gradient(180deg, #6EE7B7 0%, #10B981 100%)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(16,185,129,0.30)" }}
                          >A</span>
                          <span>{l}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-4 text-[12px] text-ink-muted" style={{ borderTop: "1px solid var(--hairline)" }}>
                    2 follow-ups overdue from Friday. Start with Suresh — 22 min fresh reply.
                  </div>
                </div>
              </FloatingCard>

              {/* Manager brief */}
              <FloatingCard tier="3" depth="3" gloss className="overflow-hidden">
                <div
                  className="flex items-center justify-between px-6 py-4"
                  style={{
                    borderBottom: "1px solid var(--hairline)",
                    background: "linear-gradient(180deg, rgba(254,215,170,0.30) 0%, transparent 100%)",
                  }}
                >
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-orange-500">MANAGER BRIEF — 8:30 AM IST</span>
                  <Mail className="h-4 w-4 text-orange-400" />
                </div>
                <div className="p-6 space-y-5">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.12em] text-ink-muted">Team · Monday</p>
                    <p className="mt-2 text-[24px] font-semibold leading-tight tracking-[-0.02em] text-ink">Team ₹ at risk: <span className="text-orange-500">₹4.2L</span></p>
                  </div>
                  <div className="pt-4 space-y-2.5" style={{ borderTop: "1px solid var(--hairline)" }}>
                    <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Per rep</p>
                    {[
                      { name: "Priya",  amt: "₹1.8L", bar: 100 },
                      { name: "Rajesh", amt: "₹1.2L", bar: 67 },
                      { name: "Mohan",  amt: "₹1.2L", bar: 67 },
                    ].map((r) => (
                      <div key={r.name} className="flex items-center gap-3">
                        <span className="w-16 text-[13px] text-ink-soft">{r.name}</span>
                        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(15,23,42,0.06)" }}>
                          <div className="h-full rounded-full" style={{ width: `${r.bar}%`, background: "linear-gradient(90deg, #FDBA74 0%, #FB923C 100%)" }} />
                        </div>
                        <span className="font-mono text-[12px] font-semibold text-ink tabular w-14 text-right">{r.amt}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 text-[12px] text-ink-muted" style={{ borderTop: "1px solid var(--hairline)" }}>
                    Last week: ₹3.1L. Up ₹1.1L — likely two overdue real-estate enquiries from Priya&apos;s territory.
                  </div>
                </div>
              </FloatingCard>
            </Reveal>
          </Container>
        </SectionGround>

        {/* SCHEDULE */}
        <SectionGround variant="sky" size="lg">
          <Container>
            <div className="mx-auto max-w-4xl">
              <NumberedTag number="02" label="Schedule" />
              <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
                Every weekday, without fail.
              </h2>

              <Reveal delay={0.08} className="mt-10 grid gap-5 md:grid-cols-3">
                {[
                  { label: "Send time",  value: "8:25–8:35 AM IST",       hint: "Before stand-up" },
                  { label: "Frequency",  value: "Mon–Sat",                hint: "Sunday off by default" },
                  { label: "Delivery",   value: "Resend via Inngest cron", hint: "99.9% SLA, retries on failure" },
                ].map((m, i) => (
                  <FloatingCard key={m.label} tier="2" depth="2" gloss aura={i === 1 ? "peach" : "sky"} className="p-6">
                    <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">{m.label}</p>
                    <p className="mt-3 text-[22px] font-semibold text-ink tracking-[-0.01em]">{m.value}</p>
                    <p className="mt-1 text-[12px] text-ink-muted">{m.hint}</p>
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
                Morning Brief questions.
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
                The Brief is the front page. Here&apos;s the newsroom.
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
          title={<>See the system the Brief reports on.</>}
          sub="The Brief is the 8:30 AM summary of a live system — every lead graded A–F, a Priority Queue per rep, and the ₹ at risk in real rupees."
        />

        <CTABanner
          tag={{ number: "05", label: "Ready when you are" }}
          headline="First Brief tomorrow at 8:30 AM."
          sub="Sign up today. Import your leads. Your team gets its first Brief before stand-up."
        />

        <Footer />
      </main>
    </>
  )
}
