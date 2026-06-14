import type { Metadata } from "next"
import {
  BarChart3, ListOrdered, AlertTriangle, Mail, MessageSquare,
  Users, Settings, Database, Inbox, Workflow, FileText, UserCog,
} from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
import InternalLinksGrid from "@/app/components/internal-links-grid"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { PageHero } from "@/app/components/page-hero"
import { NumberedTag } from "@/app/components/numbered-tag"
import { FeatureCard } from "@/app/components/feature-card"
import { FloatingCard } from "@/app/components/floating-card"
import { MetricStrip } from "@/app/components/metric-strip"
import { Reveal } from "@/app/components/reveal"
import { APP_URLS } from "@/lib/urls"

export const metadata: Metadata = {
  title: "Product — India's First Sales Behaviour OS",
  description:
    "Leadkaun grades every lead A–F, surfaces a Priority Queue, tracks missed ₹, and sends managers a Morning Brief — all built for Indian B2B sales teams. 12 live modules.",
  alternates: { canonical: "/product" },
}

const CORE_MODULES = [
  { icon: BarChart3,     href: "/features/lead-scoring",              title: "Lead Scoring Engine",       description: "Grade A–F in under 500 ms. Fit + Intent + Quality, transparent weights, decay baked in." },
  { icon: ListOrdered,   href: "/features/priority-queue",            title: "Priority Queue",            description: "One ranked list per rep. Re-ranks live as signals arrive — rep works top-down." },
  { icon: AlertTriangle, href: "/features/missed-opportunity-engine", title: "Missed Opportunity Engine", description: "Every stale lead gets a rupee value. Aggregate ₹ at risk surfaced daily." },
  { icon: Mail,          href: "/features/morning-brief",             title: "Morning Brief",             description: "8:30 AM IST email. Top Grade A leads, overdue follow-ups, ₹ at risk today." },
  { icon: MessageSquare, href: "/features/whatsapp-tracking",         title: "WhatsApp Tracking",         description: "70% of Indian B2B first-contact is on WhatsApp. 3-tap logging feeds scoring." },
  { icon: Users,         href: "/features/sales-rep-tracking",        title: "Sales Rep Tracking",        description: "Per-rep ₹ recovered, Grade A response time, follow-up completion." },
]

const SUPPORTING_MODULES = [
  { icon: Settings, title: "Onboarding & ICP",        description: "6-step wizard. First graded lead in the queue within the first hour of signup." },
  { icon: Database, title: "Lead Ingestion",          description: "Google Sheets, CSV, manual entry. Indian phone normalisation + dedup built in." },
  { icon: Inbox,    title: "Built-in CRM",            description: "Pipeline, contact record, call log. Everything a CRM does, without the bloat." },
  { icon: FileText, title: "Lead Quality Analysis",   description: "Junk detection, source reliability scoring, phone + email validity." },
  { icon: Workflow, title: "Follow-up Engine",        description: "Grade-aware cadence. Per-rep Follow-up Score shows consistency at a glance." },
  { icon: UserCog,  title: "Team & Admin Management", description: "Roles, assignment rules, unassigned queue control, full audit export." },
]

const HOW_IT_WORKS = [
  { n: "01", title: "Import your leads.",            body: "Google Sheets live sync (5-min polling), CSV upload (10k rows / 60s), or manual entry. Indian phones normalised. Duplicates deduped." },
  { n: "02", title: "Leads grade in 500 ms.",        body: "Every new lead scored A–F across Fit, Intent, Quality. Weights are yours to audit. No black box." },
  { n: "03", title: "Reps work the Queue top-down.", body: "Re-ranks in real time as WhatsApp replies arrive and intent decays. Decision made. No triage." },
  { n: "04", title: "Managers see ₹ accountability.", body: "Morning Brief at 8:30 AM IST. Monday review opens with ₹ at risk per rep. Coaching becomes specific." },
]

export default function ProductPage() {
  return (
    <main className="min-h-screen bg-bg-pure">
      <Navbar />

      <PageHero
        eyebrow="Product · 12 live modules"
        h1={
          <>
            Not a CRM.<br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(95deg, #0EA5E9 0%, #06B6D4 50%, #FB923C 100%)" }}
            >
              A system that changes how your team sells.
            </span>
          </>
        }
        sub="CRMs record what happened. Leadkaun reshapes what happens next — twelve modules that grade, prioritise, alert, and recover revenue your team was losing silently."
        primary={{ kind: "primary", label: "Start free trial", href: APP_URLS.register, external: true }}
        secondary={{ kind: "glass", label: "Book a 15-min demo", href: "/demo" }}
      />

      {/* STATS */}
      <SectionGround variant="cream" size="md">
        <Container>
          <Reveal><MetricStrip
            items={[
              { value: "500 ms", label: "Per-lead grading",       hint: "Fit × Intent × Quality" },
              { value: "60 min", label: "Setup to first lead",    hint: "Google Sheets or CSV" },
              { value: "12",     label: "Core modules, day one",  hint: "All tiers include all 12" },
              { value: "₹18 L",  label: "Avg recovered, 30 days", hint: "across 50+ B2B teams" },
            ]}
          /></Reveal>
        </Container>
      </SectionGround>

      {/* HOW IT WORKS */}
      <SectionGround variant="sky" size="lg">
        <Container>
          <Reveal className="mb-12 md:mb-16">
            <NumberedTag number="01" label="How it works" />
            <h2 className="mt-5 max-w-3xl text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
              Four moves. Every lead. Every day.
            </h2>
          </Reveal>

          <Reveal delay={0.08} className="grid gap-5 md:grid-cols-2 md:gap-6">
            {HOW_IT_WORKS.map((s) => (
              <FloatingCard key={s.n} tier="3" depth="3" gloss className="p-8">
                <span
                  className="inline-flex h-12 w-12 items-center justify-center rounded-2xl font-mono text-[18px] font-bold text-white"
                  style={{
                    background: "linear-gradient(180deg, #38BDF8 0%, #0EA5E9 100%)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 6px 16px rgba(14,165,233,0.32)",
                  }}
                >
                  {s.n}
                </span>
                <h3 className="mt-6 text-[20px] font-semibold leading-[1.25] tracking-[-0.01em] text-ink">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-[1.6] text-ink-soft">{s.body}</p>
              </FloatingCard>
            ))}
          </Reveal>
        </Container>
      </SectionGround>

      {/* CORE MODULES */}
      <SectionGround variant="cream" size="lg">
        <Container>
          <Reveal className="mb-12 md:mb-16">
            <NumberedTag number="02" tone="warm" label="Behaviour core" />
            <h2 className="mt-5 max-w-3xl text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
              The six modules that reshape the day.
            </h2>
            <p className="mt-4 max-w-2xl text-[17px] leading-[1.55] text-ink-soft">
              These are the differentiators — the jobs a CRM was never designed for.
            </p>
          </Reveal>

          <Reveal delay={0.08} className="grid gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {CORE_MODULES.map((m, i) => (
              <FeatureCard key={m.href} {...m} variant={i % 2 === 1 ? "soft" : "default"} />
            ))}
          </Reveal>
        </Container>
      </SectionGround>

      {/* SUPPORTING MODULES */}
      <SectionGround variant="sky" size="lg">
        <Container>
          <Reveal className="mb-12 md:mb-16">
            <NumberedTag number="03" label="Supporting layer" />
            <h2 className="mt-5 max-w-3xl text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
              Plus everything a CRM would do.
            </h2>
            <p className="mt-4 max-w-2xl text-[17px] leading-[1.55] text-ink-soft">
              Ingestion, onboarding, data quality, follow-ups, team admin — the tablestakes, built once, working from day one.
            </p>
          </Reveal>

          <Reveal delay={0.08} className="grid gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {SUPPORTING_MODULES.map((m, i) => (
              <FeatureCard
                key={m.title}
                icon={m.icon}
                title={m.title}
                description={m.description}
                variant={i % 2 === 1 ? "soft" : "default"}
              />
            ))}
          </Reveal>
        </Container>
      </SectionGround>

      <CTABanner />
      <InternalLinksGrid />
      <Footer />
    </main>
  )
}
