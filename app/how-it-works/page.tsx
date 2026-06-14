import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { PageHero } from "@/app/components/page-hero"
import { NumberedTag } from "@/app/components/numbered-tag"
import { MetricStrip } from "@/app/components/metric-strip"
import { FloatingCard } from "@/app/components/floating-card"
import { Reveal } from "@/app/components/reveal"

export const metadata: Metadata = {
  title: "How Leadkaun Works — From Lead In to Deal Closed",
  description:
    "See exactly how Leadkaun's scoring engine, priority queue, and missed opportunity engine work together to stop deals from dying. Built for Indian B2B sales teams.",
  alternates: { canonical: "/how-it-works" },
}

const STEPS = [
  { step: "01", title: "Lead arrives. Any source.",                   body: "Import from Google Sheets (auto-sync every 5 minutes), CSV upload, IndiaMART feed, FB Lead Ads webhook, or manual entry. Indian phone formats auto-normalised, duplicates caught on insert, junk flagged before it hits a rep.", detail: "Sources: Google Sheets · CSV · IndiaMART · FB Lead Ads · Manual · Webhook" },
  { step: "02", title: "Scoring engine runs in under 500ms.",         body: "Three scores computed in parallel: Fit (ICP match), Intent (source + signal events like WhatsApp reply or pricing-page visit), Quality (data completeness + junk detection). Combined into a single A–F grade with decay applied over time.", detail: "Grade A = Fit ≥ 65 · Intent ≥ 60 · Quality ≥ 60" },
  { step: "03", title: "Next-best-action is assigned.",               body: "Based on grade, source, and behavioural signals, the system assigns one of Call Now, WhatsApp, Re-engage, or Nurture. Rep sees it as a single instruction — not a screen of buttons to choose from.", detail: "Action changes dynamically as signals come in" },
  { step: "04", title: "Priority Queue updates live.",                body: "Rep opens the queue. Leads ranked by grade, overdue follow-ups, callback requests, and recency. No filtering, no guesswork. Log the outcome in three taps — call, WhatsApp, or result.", detail: "Queue refresh: every 30 seconds · Mobile-web parity" },
  { step: "05", title: "Missed-Opportunity Engine fires daily.",      body: "At 9 AM IST the system surfaces every lead that has gone stale — with its rupee value attached. Manager sees per-rep accountability. Rep sees a recovery path. Not blame. Clarity.", detail: "Not reports. Action." },
  { step: "06", title: "Morning Brief lands at 8:30 AM.",             body: "Every rep and manager gets a personalised daily brief — Grade A leads that need action today, ₹ at risk this week, and overdue follow-ups. The day starts with a plan, not a scroll through the inbox.", detail: "Delivered Mon – Sat · 8:30 AM IST · Email + WhatsApp" },
]

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-bg-pure">
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
              { value: "< 500ms", label: "Lead scored on arrival" },
              { value: "8:30 AM", label: "Morning Brief · IST" },
              { value: "60 min",  label: "Setup to first graded lead" },
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

      <CTABanner />
      <Footer />
    </main>
  )
}
