import Link from "next/link"
import {
  BarChart3,
  ListOrdered,
  AlertTriangle,
  Mail,
  MessageSquare,
  Users,
  ArrowRight,
} from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
import InternalLinksGrid from "@/app/components/internal-links-grid"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { GradientBlob } from "@/app/components/gradient-blob"
import { GlossLink, GlossNavLink } from "@/app/components/gloss-button"
import { FloatingCard } from "@/app/components/floating-card"
import { Reveal } from "@/app/components/reveal"
import { NumberedTag } from "@/app/components/numbered-tag"
import { FeatureCard } from "@/app/components/feature-card"
import { MetricStrip } from "@/app/components/metric-strip"
import { CompareTable } from "@/app/components/compare-table"
import { LeadkaunMark } from "@/app/components/leadkaun-mark"
import { IndustryTile } from "@/app/components/industry-tile"
import { PricingTier } from "@/app/components/pricing-tier"
import { Faq } from "@/app/components/faq"
import { TestimonialCard } from "@/app/components/testimonial-card"
import { APP_URLS } from "@/lib/urls"

/* ═══════════════════════════════════════════════════════════════════════
   HOMEPAGE — Coastal Sunrise + Layered Glass (visionOS depth)
═══════════════════════════════════════════════════════════════════════ */

export default function HomePage() {
  return (
    <main className="min-h-screen bg-bg-pure">
      <Navbar />

      <Hero />
      <TrustBar />
      <Stats />
      <Problem />
      <HowItWorks />
      <Modules />
      <NotACRM />
      <Industries />
      <Testimonials />
      <Pricing />
      <FaqBlock />

      <CTABanner tag={{ number: "09", label: "Ready when you are" }} />

      <InternalLinksGrid />
      <Footer />
    </main>
  )
}

/* ───────────────────────────────────────────────────────────────────────
   HERO — layered mesh + floating glass plate + decorative chips
─────────────────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <SectionGround variant="mesh" size="xl" ambient={false} className="pt-36 md:pt-44">
      {/* Coastal mesh blobs — drifting */}
      <GradientBlob color="sky"   size="xl" position="-top-32 -left-40" intensity={0.7} />
      <GradientBlob color="cyan"  size="lg" position="top-20 -right-32" intensity={0.5} delay={4} />
      <GradientBlob color="peach" size="xl" position="-bottom-40 -right-20" intensity={0.65} delay={2} />

      <Container className="relative">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          {/* Brand chip */}
          <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 glass-1 gloss-edge">
            <LeadkaunMark size={14} />
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-600">
              India&apos;s Sales Behaviour OS
            </span>
          </div>

          <h1 className="mt-8 text-[44px] font-semibold leading-[1.04] tracking-[-0.04em] text-ink md:text-[80px]">
            The sales software that
            <br className="hidden md:block" />{" "}
            tells your team{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(95deg, #0EA5E9 0%, #06B6D4 45%, #FB923C 100%)",
              }}
            >
              exactly what to do next.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-[17px] leading-[1.55] text-ink-soft md:text-[20px] md:leading-[1.5]">
            Leadkaun grades every lead A–F, builds each rep&apos;s Priority Queue,
            and surfaces missed revenue in rupees — so your team closes more and wastes less.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <GlossLink
              variant="primary"
              size="lg"
              href={APP_URLS.register}
            >
              Start free trial
              <span className="font-mono opacity-80">→</span>
            </GlossLink>
            <GlossNavLink variant="glass" size="lg" href="/demo">
              Book a 15-min demo
            </GlossNavLink>
          </div>

          <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
            50+ Indian B2B teams · 60-min setup · No credit card
          </p>
        </div>

        {/* Decorative floating glass chips — visual depth only */}
        <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden>
          {/* Top-right: Grade A card */}
          <div className="absolute right-[6%] top-[8%] rotate-[6deg]">
            <div className="flex items-center gap-3 rounded-2xl px-4 py-3 glass-2 elevate-2 gloss-edge">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full font-mono text-[14px] font-bold text-white"
                style={{
                  background: "linear-gradient(180deg, #6EE7B7 0%, #10B981 100%)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), 0 4px 10px rgba(16,185,129,0.32)",
                }}
              >
                A
              </span>
              <div className="text-left">
                <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">Grade A</div>
                <div className="font-mono text-[14px] font-semibold text-ink tabular">₹4.2L · ready</div>
              </div>
            </div>
          </div>

          {/* Bottom-left: follow-up lift chip */}
          <div className="absolute left-[5%] bottom-[10%] -rotate-[5deg]">
            <div className="flex items-center gap-2 rounded-full px-4 py-2.5 glass-peach gloss-edge">
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full"
                style={{
                  background: "linear-gradient(180deg, #FDBA74 0%, #FB923C 100%)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)",
                }}
              >
                <ArrowRight className="h-3 w-3 text-white -rotate-45" strokeWidth={3} />
              </span>
              <span className="font-mono text-[12px] font-semibold text-orange-500 tabular">+3.4× follow-ups</span>
            </div>
          </div>

          {/* Mid-right: priority queue dot */}
          <div className="absolute right-[10%] bottom-[18%] rotate-[3deg]">
            <div className="rounded-2xl px-4 py-3 glass-sky gloss-edge">
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-sky-600">Queue</div>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="h-1.5 w-8 rounded-full bg-sky-500" />
                <span className="h-1.5 w-5 rounded-full bg-sky-300" />
                <span className="h-1.5 w-3 rounded-full bg-sky-200" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </SectionGround>
  )
}

/* ───────────────────────────────────────────────────────────────────────
   TRUST BAR — slim glass strip floating across the seam
─────────────────────────────────────────────────────────────────────── */

const TRUST_STATS = [
  { value: "50+",      label: "Indian B2B teams" },
  { value: "12",       label: "verticals live" },
  { value: "8",        label: "cities shipping" },
  { value: "₹4.2 Cr",  label: "recovered / quarter" },
]

function TrustBar() {
  return (
    <div className="relative -mt-8 mb-2">
      <Container>
        <div className="rounded-3xl glass-2 elevate-2 gloss-edge px-6 py-7 md:px-10">
          <p className="text-center font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
            Running with Indian B2B sales teams
          </p>
          <dl className="mt-6 grid grid-cols-2 gap-y-5 md:grid-cols-4 md:gap-y-0">
            {TRUST_STATS.map((s, i) => (
              <div
                key={s.label}
                className={`flex flex-col items-center gap-1 px-4 ${
                  i > 0 ? "md:border-l" : ""
                }`}
                style={i > 0 ? { borderColor: "var(--hairline)" } : undefined}
              >
                <dt className="font-mono text-[26px] font-semibold leading-none tracking-[-0.025em] text-ink tabular md:text-[30px]">
                  {s.value}
                </dt>
                <dd className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-muted">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </div>
  )
}

/* ───────────────────────────────────────────────────────────────────────
   STATS — peach-tinted floating tiles on cream
─────────────────────────────────────────────────────────────────────── */

function Stats() {
  return (
    <SectionGround variant="cream" size="md">
      <Container>
        <Reveal><MetricStrip
          items={[
            { value: "₹18 L",  label: "Avg recovered",        hint: "in the first 30 days" },
            { value: "3.4×",   label: "Follow-up rate",       hint: "lift by end of week 1" },
            { value: "60 min", label: "To first graded lead", hint: "from signup" },
            { value: "50+",    label: "Indian B2B teams",     hint: "running Leadkaun today" },
          ]}
        /></Reveal>
      </Container>
    </SectionGround>
  )
}

/* ───────────────────────────────────────────────────────────────────────
   PROBLEM — split editorial, glass cards, severity-tinted micro-glows
─────────────────────────────────────────────────────────────────────── */

const PROBLEMS = [
  {
    h: "Leads go cold before anyone notices.",
    b: "Friday dashboard shows 200 leads this month. Monday, 40 are already ghosted. The CRM did not tell you. Nothing did.",
    aura: "sky" as const,
  },
  {
    h: "Your CRM measures activity, not behaviour.",
    b: "Reps hit their call target. Managers read the dashboard. Revenue stays flat. Activity theatre costs ₹50k–₹1.5L per rep, per quarter.",
    aura: "peach" as const,
  },
  {
    h: "Managers chase reps. Reps chase numbers.",
    b: "1:1s turn into defensive explanations. Nobody improves. The whole system drifts — until a top rep leaves and the pipeline leaves with them.",
    aura: "sky" as const,
  },
]

function Problem() {
  return (
    <SectionGround variant="sky" size="lg">
      <Container>
        <Reveal className="grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <NumberedTag number="01" label="The Problem" />
            <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
              Your CRM tells you what happened.<br />
              Leadkaun tells your team{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(95deg, #0EA5E9 0%, #FB923C 100%)" }}
              >
                what to do next.
              </span>
            </h2>
          </div>

          <div className="md:col-span-7">
            <div className="flex flex-col gap-4">
              {PROBLEMS.map((p) => (
                <FloatingCard
                  key={p.h}
                  tier="2"
                  depth="2"
                  aura={p.aura}
                  gloss
                  className="p-6 md:p-7"
                >
                  <h3 className="text-[18px] font-semibold text-ink md:text-[20px]">{p.h}</h3>
                  <p className="mt-2 text-[15px] leading-[1.65] text-ink-soft md:text-[16px]">{p.b}</p>
                </FloatingCard>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </SectionGround>
  )
}

/* ───────────────────────────────────────────────────────────────────────
   HOW IT WORKS — three deeply-elevated glass cards on cream
─────────────────────────────────────────────────────────────────────── */

const STEPS = [
  {
    n: "01",
    tag: "GRADE",
    h: "Every lead scored A–F in 500 ms.",
    b: "Three independent scores — Fit (ICP match), Intent (engagement), Quality (data reliability). Transparent weights. No black box.",
    meta: "Runs on every Google Sheet / CSV / form submission.",
  },
  {
    n: "02",
    tag: "PRIORITISE",
    h: "Queue re-ranks in real time.",
    b: "As WhatsApp replies arrive and intent decays overnight, each rep's queue updates itself. Reps work top-down. Decision made.",
    meta: "No 90-minute morning triage. Ever.",
  },
  {
    n: "03",
    tag: "RECOVER",
    h: "Missed Opportunity surfaces ₹ at risk.",
    b: "Every stale lead gets a rupee value. Monday review opens with ₹4.2L at risk, broken down per rep and per source.",
    meta: "Accountability in money, not activity counts.",
  },
]

function HowItWorks() {
  return (
    <SectionGround variant="cream" size="lg">
      <Container>
        <Reveal className="mb-12 md:mb-16">
          <NumberedTag number="02" label="How it works" tone="warm" />
          <h2 className="mt-5 max-w-2xl text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
            Three moves. That&apos;s it.
          </h2>
          <p className="mt-4 max-w-2xl text-[17px] leading-[1.55] text-ink-soft md:text-[18px]">
            From the moment a lead arrives to the moment it closes or gets recovered —
            Leadkaun does three things, continuously.
          </p>
        </Reveal>

        <Reveal delay={0.08} className="grid gap-5 md:grid-cols-3 md:gap-6">
          {STEPS.map((s) => (
            <FloatingCard
              key={s.n}
              tier="3"
              depth="3"
              gloss
              className="flex flex-col p-7 md:p-8"
            >
              <div className="flex items-center justify-between">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-2xl font-mono text-[18px] font-bold text-white"
                  style={{
                    background: "linear-gradient(180deg, #38BDF8 0%, #0EA5E9 100%)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 6px 16px rgba(14,165,233,0.32)",
                  }}
                >
                  {s.n}
                </span>
                <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-orange-500">
                  {s.tag}
                </span>
              </div>
              <h3 className="mt-7 text-[20px] font-semibold leading-[1.25] tracking-[-0.01em] text-ink">
                {s.h}
              </h3>
              <p className="mt-3 flex-1 text-[15px] leading-[1.6] text-ink-soft">{s.b}</p>
              <p
                className="mt-6 pt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted"
                style={{ borderTop: "1px solid var(--hairline)" }}
              >
                {s.meta}
              </p>
            </FloatingCard>
          ))}
        </Reveal>
      </Container>
    </SectionGround>
  )
}

/* ───────────────────────────────────────────────────────────────────────
   PRODUCT MODULES — glass mosaic on sky ground
─────────────────────────────────────────────────────────────────────── */

const MODULES = [
  { icon: BarChart3,    title: "Lead Scoring Engine",       description: "Grade A–F in under 500 ms. Fit + Intent + Quality, transparent weights, decay baked in.",        href: "/features/lead-scoring" },
  { icon: ListOrdered,  title: "Priority Queue",            description: "One ranked list per rep. Re-ranks live as signals arrive — so the rep just works top-down.",     href: "/features/priority-queue" },
  { icon: AlertTriangle, title: "Missed Opportunity Engine", description: "Every stale lead gets a rupee value. Aggregate ₹ at risk surfaced daily to every manager.",     href: "/features/missed-opportunity-engine" },
  { icon: Mail,          title: "Morning Brief",             description: "8:30 AM IST email. Top Grade A leads, overdue follow-ups, ₹ at risk today. Sets the day.",      href: "/features/morning-brief" },
  { icon: MessageSquare, title: "WhatsApp Tracking",         description: "70% of Indian B2B first-contact is on WhatsApp. 3-tap logging feeds the Intent Score.",         href: "/features/whatsapp-tracking" },
  { icon: Users,         title: "Sales Rep Tracking",        description: "Per-rep ₹ recovered, Grade A response time, follow-up completion — without micromanagement.",   href: "/features/sales-rep-tracking" },
]

function Modules() {
  return (
    <SectionGround variant="sky" size="lg">
      <Container>
        <Reveal className="mb-12 md:mb-16">
          <NumberedTag number="03" label="The Product" />
          <h2 className="mt-5 max-w-3xl text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
            Twelve live modules. One behaviour system.
          </h2>
          <p className="mt-4 max-w-2xl text-[17px] leading-[1.55] text-ink-soft md:text-[18px]">
            Every module works on day one. Every setting is transparent. Every weight is yours to audit.
          </p>
        </Reveal>

        <Reveal delay={0.08} className="grid gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {MODULES.map((m, i) => (
            <FeatureCard
              key={m.href}
              icon={m.icon}
              title={m.title}
              description={m.description}
              href={m.href}
              variant={i % 2 === 1 ? "soft" : "default"}
            />
          ))}
        </Reveal>

        <div className="mt-10 flex justify-start">
          <Link
            href="/product"
            className="group inline-flex items-center gap-1.5 text-[14px] font-semibold text-sky-600 hover:text-sky-500"
          >
            See all 12 modules
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </Container>
    </SectionGround>
  )
}

/* ───────────────────────────────────────────────────────────────────────
   NOT A CRM — glass slab compare table
─────────────────────────────────────────────────────────────────────── */

function NotACRM() {
  return (
    <SectionGround variant="cream" size="lg">
      <Container>
        <Reveal className="mb-12 md:mb-16">
          <NumberedTag number="04" label="This is not a CRM" tone="warm" />
          <h2 className="mt-5 max-w-3xl text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
            What Leadkaun does that your CRM doesn&apos;t.
          </h2>
          <p className="mt-4 max-w-2xl text-[17px] leading-[1.55] text-ink-soft">
            CRMs record what happened. Leadkaun reshapes what happens next.
          </p>
        </Reveal>

        <Reveal delay={0.08}><CompareTable
          rows={[
            { left: "Records the number of calls your reps made this week.",  right: "Surfaces ₹ at risk per rep, per week — money, not activity." },
            { left: "Lead scoring is a single black-box number.",             right: "Three transparent scores: Fit, Intent, Quality — auditable weights." },
            { left: "Grade A leads age out silently. Nobody notices.",        right: "Intent decay auto-drops stale leads. The queue stays honest." },
            { left: "Priority decided by rep gut feel or recency.",           right: "Priority Queue re-ranks live — rep works top-down, no triage." },
            { left: "WhatsApp is an integration (paid add-on).",              right: "WhatsApp is a first-class signal. 3-tap logging feeds scoring." },
            { left: "Monday reviews are activity debates.",                   right: "Monday reviews open with ₹ at risk per rep. Coaching is specific." },
          ]}
        /></Reveal>
      </Container>
    </SectionGround>
  )
}

/* ───────────────────────────────────────────────────────────────────────
   INDUSTRIES — glass chips on sky ground
─────────────────────────────────────────────────────────────────────── */

const INDUSTRIES = [
  { href: "/use-cases/real-estate",   label: "Real Estate",         meta: "₹5–50L GCV" },
  { href: "/use-cases/edtech",        label: "EdTech",              meta: "Admissions cycles" },
  { href: "/use-cases/bfsi",          label: "BFSI & Insurance",    meta: "Audit-ready" },
  { href: "/use-cases/saas",          label: "SaaS",                meta: "Trial to paid" },
  { href: "/use-cases/manufacturing", label: "Manufacturing",       meta: "90-day cycles" },
  { href: "/use-cases/agencies",      label: "Agencies",            meta: "Multi-client" },
  { href: "/use-cases/healthcare",    label: "Healthcare",          meta: "DND-compliant" },
  { href: "/use-cases",               label: "See all industries",  meta: "12 verticals" },
]

function Industries() {
  return (
    <SectionGround variant="sky" size="lg">
      <Container>
        <Reveal className="mb-12 md:mb-14">
          <NumberedTag number="05" label="By Industry" />
          <h2 className="mt-5 max-w-3xl text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
            Built for the Indian sales reality.
          </h2>
          <p className="mt-4 max-w-2xl text-[17px] leading-[1.55] text-ink-soft">
            ICP templates, cadence defaults, and copy tuned for 12 Indian B2B verticals. Ship on day one.
          </p>
        </Reveal>

        <Reveal delay={0.08} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {INDUSTRIES.map((i) => (
            <IndustryTile key={i.href} {...i} />
          ))}
        </Reveal>
      </Container>
    </SectionGround>
  )
}

/* ───────────────────────────────────────────────────────────────────────
   TESTIMONIALS — glass cards on warm cream
─────────────────────────────────────────────────────────────────────── */

function Testimonials() {
  return (
    <SectionGround variant="cream" size="lg">
      <Container>
        <Reveal className="mb-10">
          <NumberedTag number="06" label="What sales leaders say" tone="warm" />
        </Reveal>

        <Reveal delay={0.08} className="grid gap-5 md:grid-cols-3 md:gap-6">
          <TestimonialCard
            quote="We were getting 200+ enquiries a month and converting 3–4%. After Leadkaun, our reps called Grade A leads within the hour. Conversion hit 8% in six weeks. That's ₹38L in additional revenue."
            name="Priya S."
            role="Co-Founder, Real Estate Agency"
            city="Pune"
          />
          <TestimonialCard
            quote="Agent-attribution disputes dropped 80% in two months. Our audit review used to take three days pulling records — now it's three hours. One export from Leadkaun."
            name="Vikram N."
            role="Insurance Branch Manager"
            city="Mumbai"
          />
          <TestimonialCard
            quote="Counsellor morning triage went from 30 minutes to 2. We closed 12 more admissions in April because every counsellor knew which Grade A parent to call at 9 AM."
            name="Rajesh M."
            role="EdTech Sales Head"
            city="Bengaluru"
          />
        </Reveal>
      </Container>
    </SectionGround>
  )
}

/* ───────────────────────────────────────────────────────────────────────
   PRICING — three glass tiers, middle elevated with peach gradient ring
─────────────────────────────────────────────────────────────────────── */

function Pricing() {
  return (
    <SectionGround variant="sky" size="lg">
      <GradientBlob color="peach" size="lg" position="top-1/3 left-1/2 -translate-x-1/2" intensity={0.3} delay={3} />
      <Container className="relative">
        <Reveal className="mb-12 md:mb-16 max-w-3xl">
          <NumberedTag number="07" label="Pricing" />
          <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
            Per rep. In rupees. No contact fees.
          </h2>
          <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
            All 12 modules on every tier. 14-day free trial, no credit card. Annual billing saves 10%.
          </p>
        </Reveal>

        <Reveal delay={0.08} className="grid gap-6 md:grid-cols-3">
          <PricingTier
            name="Starter"
            description="Small teams getting scoring + queue live for the first time."
            price="₹999"
            features={[
              "Up to 10 reps",
              "All 12 core modules",
              "Google Sheets / CSV ingestion",
              "Morning Brief email",
              "Email support",
            ]}
            ctaLabel="Start free trial"
            ctaHref={APP_URLS.register}
          />
          <PricingTier
            name="Growth"
            description="Most Indian SMBs (10–30 reps). Custom ICP, all behaviour features."
            price="₹1,999"
            features={[
              "Up to 30 reps",
              "Everything in Starter",
              "Custom ICP weights per pipeline",
              "Missed Opportunity Engine (₹-at-risk)",
              "WhatsApp BSP integrations",
              "Priority support",
            ]}
            ctaLabel="Start free trial"
            ctaHref={APP_URLS.register}
            highlighted
          />
          <PricingTier
            name="Scale"
            description="Scaling teams (30–50 reps) wanting full admin + audit."
            price="₹2,999"
            features={[
              "Up to 50 reps",
              "Everything in Growth",
              "Role-based permissions",
              "Assignment rules + unassigned queue",
              "Compliance audit export",
              "Custom onboarding",
            ]}
            ctaLabel="Contact sales"
            ctaHref="/contact"
          />
        </Reveal>

        <div className="mt-10 flex justify-start">
          <Link
            href="/pricing"
            className="group inline-flex items-center gap-1.5 text-[14px] font-semibold text-sky-600 hover:text-sky-500"
          >
            See full pricing &amp; comparison
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </Container>
    </SectionGround>
  )
}

/* ───────────────────────────────────────────────────────────────────────
   FAQ — glass accordion on warm cream
─────────────────────────────────────────────────────────────────────── */

function FaqBlock() {
  return (
    <SectionGround variant="cream" size="md">
      <Container>
        <Reveal className="mx-auto mb-10 max-w-3xl text-center">
          <div className="flex justify-center">
            <NumberedTag number="08" label="FAQ" tone="warm" />
          </div>
          <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">
            Common questions.
          </h2>
        </Reveal>

        <Reveal delay={0.08}><Faq
          items={[
            { q: "How is Leadkaun different from a CRM?",            a: "A CRM records what happened. Leadkaun reshapes what happens next — by grading every lead, building a Priority Queue that re-ranks in real time, and surfacing missed revenue in rupees. Most teams run Leadkaun alongside their CRM for 60–90 days, then consolidate." },
            { q: "How long does setup take?",                         a: "60 minutes from signup to your first Grade A lead in the queue. The onboarding wizard uses pre-configured ICP templates for 12 Indian B2B verticals, so you do not need to define your ICP from scratch." },
            { q: "Do I need to import all my historical leads?",      a: "No — and we recommend you do not. Import only the live leads (last 90 days of activity). Stale data pollutes the grade distribution. Most teams migrate 40–60% of their CRM data; the rest stays archived." },
            { q: "Does it handle WhatsApp?",                          a: "Yes — as a first-class signal, not an integration afterthought. Reps log every meaningful WhatsApp exchange in 3 taps (stage + intent + outcome), feeding the Intent Score directly. Works with any WhatsApp account; BSP integrations are available for Gupshup, AiSensy, and Interakt." },
            { q: "What happens if a rep leaves?",                     a: "One-click handover. Lead records, activity history, WhatsApp logs, follow-up schedules all transfer to the new rep. The pipeline does not leave with the person." },
            { q: "Is my data secure?",                                a: "Supabase Singapore region (lowest India latency). Row-Level Security enforced at the database level. Encryption in transit and at rest. Full audit trail per lead, exportable on demand. One-click CSV export of everything — your data is your data." },
          ]}
        /></Reveal>
      </Container>
    </SectionGround>
  )
}
