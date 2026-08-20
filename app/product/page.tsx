import type { Metadata } from "next"
import {
  BarChart3, ListOrdered, AlertTriangle, Mail, MessageSquare,
  Users, Settings, Database, Inbox, Workflow, FileText, UserCog,
} from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import { LedgerCTA } from "@/app/components/ledger"

import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { PageHero } from "@/app/components/page-hero"
import { NumberedTag } from "@/app/components/numbered-tag"
import { FeatureCard } from "@/app/components/feature-card"
import { FloatingCard } from "@/app/components/floating-card"
import { MetricStrip } from "@/app/components/metric-strip"
import { Reveal } from "@/app/components/reveal"
import { Faq } from "@/app/components/faq"
import { QuickAnswer } from "@/app/components/quick-answer"
import { ProductShowcase, WhyNotCRM, PricingCTA } from "@/app/components/sell/blocks"
import { APP_URLS } from "@/lib/urls"
import { faqPageSchema, breadcrumbListSchema, jsonLdScript } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Lead Management Software, Product Tour | Leadkaun",
  description:
    "Leadkaun grades every lead A–F, surfaces a Priority Queue, tracks missed ₹, and sends managers a Morning Brief, all built for Indian B2B sales teams. 12 live modules.",
  alternates: { canonical: "/product" },
}

const CORE_MODULES = [
  { icon: BarChart3,     href: "/features/lead-scoring",              title: "Lead Scoring Engine",       description: "Grade A–F in real time. Fit + Intent + Quality, transparent weights, decay baked in." },
  { icon: ListOrdered,   href: "/features/priority-queue",            title: "Priority Queue",            description: "One ranked list per rep. Re-ranks live as signals arrive, rep works top-down." },
  { icon: AlertTriangle, href: "/features/missed-opportunity-engine", title: "Missed Opportunity Engine", description: "Every stale lead gets a rupee value. Aggregate ₹ at risk surfaced daily." },
  { icon: Mail,          href: "/features/morning-brief",             title: "Morning Brief",             description: "8:30 AM IST email. Top Grade A leads, overdue follow-ups, ₹ at risk today." },
  { icon: MessageSquare, href: "/features/whatsapp-tracking",         title: "WhatsApp Tracking",         description: "Most Indian B2B first-contact happens on WhatsApp. 3-tap logging feeds scoring." },
  { icon: Users,         href: "/features/sales-rep-tracking",        title: "Sales Rep Tracking",        description: "Per-rep ₹ recovered, Grade A response time, follow-up completion." },
]

const SUPPORTING_MODULES = [
  { icon: Settings, title: "Onboarding & ICP",        description: "Two steps, both skippable. First graded lead in the queue the same day you sign up." },
  { icon: Database, title: "Lead Ingestion",          description: "CSV import, Google Sheets (with optional keep-in-sync) and manual entry. Indian phone normalisation + dedup built in." },
  { icon: Inbox,    title: "Pipeline & Lead Records", description: "Kanban pipeline, contact records, call log, the workspace your reps act in, alongside your CRM." },
  { icon: FileText, title: "Lead Quality Analysis",   description: "Junk detection, source reliability scoring, phone + email validity." },
  { icon: Workflow, title: "Follow-up Engine",        description: "Grade-aware cadence. Per-rep Follow-up Score shows consistency at a glance." },
  { icon: UserCog,  title: "Team & Admin Management", description: "Admin / Manager / Rep roles, per-workspace separation, full audit export." },
]

const HOW_IT_WORKS = [
  { n: "01", title: "Import your leads.",            body: "CSV upload, a Google Sheet you can keep in sync, or manual entry. Indian phones normalised, duplicates deduped, and the file profiled before anything lands." },
  { n: "02", title: "Leads grade in real time.",      body: "Every new lead scored A–F across Fit, Intent, Quality. Weights are yours to audit. No black box." },
  { n: "03", title: "Reps work the Queue top-down.", body: "Re-ranks in real time as WhatsApp replies arrive and intent decays. Decision made. No triage." },
  { n: "04", title: "Managers see ₹ accountability.", body: "Morning Brief at 8:30 AM IST. Monday review opens with ₹ at risk per rep. Coaching becomes specific." },
]

const FAQ = [
  { q: "Is Leadkaun a CRM?", a: "No it's a Sales Behaviour OS that runs alongside your CRM. Your CRM records what happened; Leadkaun grades every lead A–F, ranks each rep's queue, and surfaces the ₹ at risk so reps know what to do next." },
  { q: "How does the lead scoring work?", a: "Every lead gets three transparent 0–100 scores, Fit (ICP match), Intent (engagement, which decays as leads go silent) and Quality (data reliability), combined into an A–F grade. Weights are auditable, not a black-box AI score." },
  { q: "Does it work with WhatsApp?", a: "Yes. WhatsApp is a first-class signal. Reps log each exchange in 3 taps (stage, intent, outcome) from any regular WhatsApp account, no Business API needed, and it feeds the Intent Score." },
  { q: "How do leads get into Leadkaun?", a: "CSV import, Google Sheets and manual entry today, plus a generic webhook. IndiaMART and Facebook connectors are on the roadmap. Every lead is graded A–F the moment it lands." },
  { q: "How much does Leadkaun cost?", a: "Flat per account, not per seat: Free ₹0, Starter ₹2,999, Growth ₹7,999, Scale ₹19,999 per month, plus custom Enterprise. Adding reps doesn't raise the bill within a tier." },
]

export default function ProductPage() {
  return (
    <main className="min-h-screen bg-bg-pure">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript([breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "Product" }]), faqPageSchema(FAQ)]) }} />
      <Navbar />

      <PageHero
        eyebrow="Product · 12 live modules"
        h1={
          <>
            The layer your CRM is missing,<br />
            <span
              className="hero-accent"
            >
              a system that changes how your team sells.
            </span>
          </>
        }
        sub="CRMs record what happened. Leadkaun reshapes what happens next, twelve modules that grade, prioritise, alert, and recover revenue your team was losing silently."
        primary={{ kind: "primary", label: "Start free", href: APP_URLS.register, external: true }}
        secondary={{ kind: "glass", label: "Explore 24 example leads", href: "/demo" }}
      />

      <SectionGround variant="pure" size="sm">
        <Container>
          <QuickAnswer
            question="What is Leadkaun?"
            answer="Leadkaun is a Sales Behaviour OS for Indian SMB sales teams. It grades every lead A–F on Fit, Intent and Quality, builds each rep a Priority Queue of who to call next, and surfaces the ₹ at risk from stale leads, running alongside your CRM, not replacing it."
          />
        </Container>
      </SectionGround>

      {/* STATS */}
      <SectionGround variant="cream" size="md">
        <Container>
          <Reveal><MetricStrip
            items={[
              { value: "A–F",      label: "Per-lead grading",       hint: "Fit × Intent × Quality" },
              { value: "same day", label: "Setup to first lead",    hint: "CSV import" },
              { value: "12",       label: "Core modules",           hint: "Premium features unlock by tier" },
              { value: "3 scores", label: "Fit, Intent, Quality", hint: "weights published" },
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
                    background: "#0877B8",
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
              These are the differentiators. The jobs a CRM was never designed for.
            </p>
          </Reveal>

          <Reveal delay={0.08} className="grid gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {CORE_MODULES.map((m, i) => (
              <FeatureCard key={m.href} {...m} variant={i % 2 === 1 ? "soft" : "default"} />
            ))}
          </Reveal>
        </Container>
      </SectionGround>

      {/* METHODOLOGY, how the A–F grade is actually computed */}
      <SectionGround variant="pure" size="lg">
        <Container>
          <Reveal className="mb-10 md:mb-14 max-w-3xl">
            <NumberedTag number="03" label="How the grade works" />
            <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
              How the A–F grade is actually computed.
            </h2>
            <p className="mt-4 max-w-2xl text-[17px] leading-[1.55] text-ink-soft">
              No black box. Every grade is three transparent 0–100 scores combined against fixed, auditable thresholds. A rep can always see exactly why a lead is Grade A.
            </p>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-3 md:gap-6">
            {[
              { tag: "Fit", range: "0–100", body: "How closely the lead matches the ICP you set at onboarding, industry, state, business type, decision-maker role and budget band. This is the one part you shape: you configure who a good customer is, not the maths behind it." },
              { tag: "Intent", range: "0–100", body: "Engagement and signal events, source strength, WhatsApp replies, pricing-page visits, callbacks. Intent decays as a lead goes silent, so a hot lead that stops responding cools automatically instead of sitting falsely high." },
              { tag: "Quality", range: "0–100", body: "Data reliability, completeness, phone and email validity, junk and duplicate detection. If Quality falls below 20 the lead is capped at Grade F, so bad data can never masquerade as a good lead." },
            ].map((s) => (
              <Reveal key={s.tag} delay={0.04}><FloatingCard tier="3" depth="3" gloss className="h-full p-7 md:p-8">
                <div className="flex items-baseline justify-between">
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-600">{s.tag}</p>
                  <p className="font-mono text-[12px] text-ink-muted tabular">{s.range}</p>
                </div>
                <p className="mt-4 text-[15px] leading-[1.6] text-ink-soft">{s.body}</p>
              </FloatingCard></Reveal>
            ))}
          </div>

          <Reveal delay={0.1} className="mx-auto mt-6 max-w-3xl">
            <FloatingCard tier="1" depth="1" gloss className="p-7 md:p-8">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-orange-500">The threshold</p>
              <p className="mt-3 text-[16px] leading-[1.6] text-ink">
                A lead is <span className="font-semibold">Grade A</span> when Fit ≥ 65, Intent ≥ 60 and Quality ≥ 60, the rest step down through B–F on the same fixed cut-offs. Because the weights are identical for every account, the grade stays explainable and comparable: no per-customer tuning, no hidden model.
              </p>
            </FloatingCard>
          </Reveal>
        </Container>
      </SectionGround>

      {/* SUPPORTING MODULES */}
      <SectionGround variant="sky" size="lg">
        <Container>
          <Reveal className="mb-12 md:mb-16">
            <NumberedTag number="04" label="Supporting layer" />
            <h2 className="mt-5 max-w-3xl text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
              Plus everything a CRM would do.
            </h2>
            <p className="mt-4 max-w-2xl text-[17px] leading-[1.55] text-ink-soft">
              Ingestion, onboarding, data quality, follow-ups, team admin, the tablestakes, built once, working from day one.
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

      {/* PRODUCT, show the live system, then differentiate + price */}
      <ProductShowcase
        number="05"
        ground="cream"
        title={<>See the whole system in one screen.</>}
        sub="Every lead graded A–F, a live Priority Queue per rep, and ₹ at risk surfaced in real rupees, the working surface your team opens every morning."
      />
      {/* FAQ */}
      <SectionGround variant="cream" size="md">
        <Container>
          <Reveal className="mx-auto mb-10 max-w-3xl text-center">
            <div className="flex justify-center"><NumberedTag number="06" tone="warm" label="FAQ" /></div>
            <h2 className="mt-5 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[36px]">Questions about Leadkaun.</h2>
          </Reveal>
          <Reveal delay={0.08}><Faq items={FAQ} /></Reveal>
        </Container>
      </SectionGround>

      <WhyNotCRM number="07" ground="sky" />
      <PricingCTA number="08" ground="cream" />

      

      <LedgerCTA headline="Your reps open their queue tomorrow." sub="Setup the same day. Free forever on 1 user and 100 active leads. No card." />
      <Footer />
    </main>
  )
}
