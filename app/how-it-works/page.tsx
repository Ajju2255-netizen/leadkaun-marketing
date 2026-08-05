import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
import { ProductBlock } from "@/app/components/sell/blocks"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { PageHero } from "@/app/components/page-hero"
import { NumberedTag } from "@/app/components/numbered-tag"
import { MetricStrip } from "@/app/components/metric-strip"
import { FloatingCard } from "@/app/components/floating-card"
import { Reveal } from "@/app/components/reveal"
import { Faq } from "@/app/components/faq"
import { faqPageSchema, breadcrumbListSchema, jsonLdScript } from "@/lib/seo"

export const metadata: Metadata = {
  title: "How Leadkaun Works — Lead Management From Enquiry to Deal",
  description:
    "See exactly how Leadkaun's scoring engine, priority queue, and missed opportunity engine work together to stop deals from dying. Built for Indian B2B sales teams.",
  alternates: { canonical: "/how-it-works" },
}

const STEPS = [
  { step: "01", title: "Lead arrives. Any source.",                   body: "Import via CSV upload, manual entry, or a generic webhook — Indian phone formats auto-normalised, duplicates caught on insert, junk flagged before it hits a rep. Native Google Sheets sync, an IndiaMART API and a Facebook Lead Ads webhook are on the roadmap; today those sources come in via CSV export.", detail: "Sources: CSV · Manual · WhatsApp 3-tap · Webhook  (Google Sheets · IndiaMART · FB Lead Ads on roadmap)" },
  { step: "02", title: "Scoring engine runs in real time.",         body: "Three scores computed in parallel: Fit (ICP match), Intent (source + signal events like WhatsApp reply or pricing-page visit), Quality (data completeness + junk detection). Combined into a single A–F grade with decay applied over time.", detail: "Grade A = Fit ≥ 65 · Intent ≥ 60 · Quality ≥ 60" },
  { step: "03", title: "Next-best-action is assigned.",               body: "Based on grade, source, and behavioural signals, the system assigns one of Call Now, WhatsApp, Re-engage, or Nurture. Rep sees it as a single instruction — not a screen of buttons to choose from.", detail: "Action changes dynamically as signals come in" },
  { step: "04", title: "Priority Queue updates live.",                body: "Rep opens the queue. Leads ranked by grade, overdue follow-ups, callback requests, and recency. No filtering, no guesswork. Log the outcome in three taps — call, WhatsApp, or result.", detail: "Queue refresh: every 30 seconds · Mobile-web parity" },
  { step: "05", title: "Missed-Opportunity Engine fires daily.",      body: "At 9 AM IST the system surfaces every lead that has gone stale — with its rupee value attached. Manager sees per-rep accountability. Rep sees a recovery path. Not blame. Clarity.", detail: "Not reports. Action." },
  { step: "06", title: "Morning Brief lands at 8:30 AM.",             body: "Every rep and manager gets a personalised daily brief — Grade A leads that need action today, ₹ at risk this week, and overdue follow-ups. The day starts with a plan, not a scroll through the inbox.", detail: "Delivered Mon – Sat · 8:30 AM IST · Email" },
]

const FAQ = [
  { q: "What does a rep actually see at 8:30 AM?", a: "An email brief, then the Priority Queue. The brief lists the handful of Grade A leads to act on today, any follow-ups that have gone overdue, and the ₹ at risk this week. Opening the queue, those same leads are already ranked at the top — the rep works down the list and logs each outcome in three taps. No filtering, no deciding who to call first." },
  { q: "What does a manager see on Monday morning?", a: "Per-rep accountability in rupees, not activity counts. The Missed-Opportunity view shows which Grade A leads went stale under each rep and the ₹ value attached, so a review opens with 'these three deals worth ₹9L aged out last week' instead of 'how many calls did you make'. Coaching becomes specific and factual." },
  { q: "Do I have to configure anything to get started?", a: "No heavy setup. A short onboarding wizard captures your ICP (industries, states, business types, budget bands), you import a CSV of leads, and every lead is graded A–F the same day. Indian phone formats are normalised and duplicates caught on import automatically." },
  { q: "How does the A–F grade get decided?", a: "Three transparent 0–100 scores — Fit (ICP match), Intent (source and signal events like a WhatsApp reply), and Quality (data completeness and junk detection) — combine into one grade. Grade A means Fit ≥ 65, Intent ≥ 60 and Quality ≥ 60. Intent decays as a lead goes silent, so grades stay honest over time. The weights are fixed and auditable, not a black-box AI score." },
  { q: "Does this replace my CRM?", a: "No — Leadkaun runs alongside your CRM. Your CRM stays the system of record for what happened; Leadkaun is the behaviour layer that decides what happens next — grading, prioritising, and surfacing the ₹ at risk. Most teams import a CSV and run both in parallel to measure the difference before changing anything." },
]

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-bg-pure">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript([breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "How it works" }]), faqPageSchema(FAQ)]) }} />
      <Navbar />

      <PageHero
        eyebrow="How it works · 6 steps"
        h1={
          <>
            From a lead landing to{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(95deg, #0EA5E9 0%, #FB923C 100%)" }}
            >
              ₹ recovered.
            </span>
          </>
        }
        sub="No configuration. No manager micromanagement. No rep excuses. Six steps, running on autopilot the moment a lead lands in the system."
        center={false}
        primary={undefined}
      />

      {/* NUMBERS */}
      <SectionGround variant="cream" size="md">
        <Container>
          <Reveal><MetricStrip
            items={[
              { value: "Real-time", label: "Lead scored on arrival" },
              { value: "8:30 AM", label: "Morning Brief · IST" },
              { value: "same day",  label: "Setup to first graded lead" },
              { value: "3 taps",  label: "Log an outcome" },
            ]}
          /></Reveal>
        </Container>
      </SectionGround>

      {/* STEPS */}
      <SectionGround variant="sky" size="lg">
        <Container>
          <Reveal className="mx-auto max-w-3xl">
            <NumberedTag number="FLOW" label="The sequence" />
            <h2 className="mt-5 text-[30px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">
              Six moves. End to end.
            </h2>
          </Reveal>

          <Reveal delay={0.08}><ol className="mx-auto mt-10 max-w-3xl space-y-4">
            {STEPS.map((s, i) => (
              <FloatingCard
                key={s.step}
                as="li"
                tier={i % 2 === 0 ? "3" : "2"}
                depth={i % 2 === 0 ? "3" : "2"}
                gloss
                aura={i % 3 === 1 ? "peach" : "sky"}
                className="p-6 md:p-8"
              >
                <div className="flex items-start gap-6">
                  <span
                    className="shrink-0 inline-flex h-14 w-14 items-center justify-center rounded-2xl font-mono text-[18px] font-bold text-white"
                    style={{
                      background: i % 3 === 1
                        ? "linear-gradient(180deg, #FDBA74 0%, #FB923C 100%)"
                        : "linear-gradient(180deg, #38BDF8 0%, #0EA5E9 100%)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 6px 16px rgba(14,165,233,0.32)",
                    }}
                  >
                    {s.step}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[20px] font-semibold tracking-[-0.015em] text-ink md:text-[24px]">{s.title}</h3>
                    <p className="mt-3 text-[15px] leading-[1.7] text-ink-soft md:text-[16px]">{s.body}</p>
                    <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.10em] text-ink-muted">{s.detail}</p>
                  </div>
                </div>
              </FloatingCard>
            ))}
          </ol></Reveal>
        </Container>
      </SectionGround>

      {/* DEEP-DIVE LINKS */}
      <SectionGround variant="cream" size="md">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <NumberedTag number="→" tone="warm" label="Deeper on each" />
              <h2 className="mt-5 text-[26px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[30px]">
                Want the specifics?
              </h2>
            </Reveal>
            <Reveal delay={0.08} className="mt-8 grid gap-3 md:grid-cols-2">
              {[
                { href: "/features/lead-scoring",              label: "Lead Scoring" },
                { href: "/features/priority-queue",            label: "Priority Queue" },
                { href: "/features/missed-opportunity-engine", label: "Missed Opportunity Engine" },
                { href: "/features/morning-brief",             label: "Morning Brief" },
                { href: "/features/whatsapp-tracking",         label: "WhatsApp Tracking" },
                { href: "/features/sales-rep-tracking",        label: "Sales Rep Tracking" },
              ].map((f) => (
                <Link
                  key={f.href}
                  href={f.href}
                  className="group flex items-center justify-between gap-4 rounded-2xl px-5 py-4 glass-1 gloss-edge lift aura-sky-hover"
                >
                  <p className="text-[15px] font-semibold text-ink group-hover:text-sky-600 transition-colors">
                    {f.label}
                  </p>
                  <ArrowUpRight
                    className="h-4 w-4 shrink-0 text-ink-muted transition-all group-hover:text-sky-500 group-hover:translate-x-0.5"
                    strokeWidth={1.75}
                  />
                </Link>
              ))}
            </Reveal>
          </div>
        </Container>
      </SectionGround>

      {/* FAQ */}
      <SectionGround variant="pure" size="md">
        <Container>
          <Reveal className="mx-auto mb-10 max-w-3xl text-center">
            <div className="flex justify-center"><NumberedTag number="?" tone="warm" label="FAQ" /></div>
            <h2 className="mt-5 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[36px]">A day inside the system.</h2>
          </Reveal>
          <Reveal delay={0.08}><Faq items={FAQ} /></Reveal>
        </Container>
      </SectionGround>

      <ProductBlock
        ground="sky"
        title={<>See the system behind the six steps.</>}
        sub="Every lead graded A–F, a live Priority Queue per rep, and the ₹ at risk surfaced in real rupees — the working screen your team opens every morning."
      />

      <CTABanner />
      <Footer />
    </main>
  )
}
