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
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { GradientBlob } from "@/app/components/gradient-blob"
import { GlossLink, GlossNavLink } from "@/app/components/gloss-button"
import { FloatingCard } from "@/app/components/floating-card"
import { Reveal } from "@/app/components/reveal"
import { GradeDistribution } from "@/app/components/viz/grade-distribution"
import { RupeeMeter } from "@/app/components/viz/rupee-meter"
import { NumberedTag } from "@/app/components/numbered-tag"
import { FeatureCard } from "@/app/components/feature-card"
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
      <Problem />
      <HowItWorks />
      <Modules />
      <NotACRM />
      <Industries />
      <Testimonials />
      <Pricing />
      <FaqBlock />

      <CTABanner tag={{ number: "09", label: "Ready when you are" }} />

      <Footer />
    </main>
  )
}

/* ───────────────────────────────────────────────────────────────────────
   HERO — asymmetric: copy + live Priority-Queue product preview
─────────────────────────────────────────────────────────────────────── */

const GRADE_BG: Record<string, string> = {
  A: "linear-gradient(180deg,#6EE7B7,#10B981)",
  B: "linear-gradient(180deg,#38BDF8,#0EA5E9)",
  C: "linear-gradient(180deg,#FDBA74,#FB923C)",
}

const HERO_QUEUE = [
  { grade: "A", name: "Priya Sharma", company: "Sunrise Realty",  value: "42L", ago: "now" },
  { grade: "A", name: "Rahul Mehta",  company: "Apex Capital",    value: "28L", ago: "4m ago" },
  { grade: "B", name: "Anjali Rao",   company: "BrightEdu",       value: "9L",  ago: "1h ago" },
  { grade: "C", name: "Imran Khan",   company: "Metro Logistics", value: "3L",  ago: "3h ago" },
]

function Hero() {
  return (
    <SectionGround variant="mesh" size="xl" ambient={false} className="pt-36 md:pt-44">
      {/* Coastal mesh blobs — drifting */}
      <GradientBlob color="sky"   size="xl" position="-top-32 -left-40" intensity={0.7} />
      <GradientBlob color="cyan"  size="lg" position="top-20 -right-32" intensity={0.5} delay={4} />
      <GradientBlob color="peach" size="xl" position="-bottom-40 -right-20" intensity={0.65} delay={2} />

      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1.04fr_0.96fr] lg:gap-14">

          {/* ── LEFT: copy ───────────────────────────────────────────── */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 glass-1 gloss-edge">
              <LeadkaunMark size={14} />
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-600">
                India&apos;s Sales Behaviour OS
              </span>
            </div>

            <h1 className="mt-7 text-[40px] font-semibold leading-[1.02] tracking-[-0.04em] text-ink md:text-[62px]">
              Tell every rep{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(95deg, #0EA5E9 0%, #06B6D4 45%, #FB923C 100%)" }}
              >
                exactly who to call next.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-[17px] leading-[1.6] text-ink-soft md:text-[19px]">
              Leadkaun grades every lead A–F, builds each rep&apos;s Priority Queue, and surfaces
              missed revenue in ₹ — so your team closes more and wastes less.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <GlossLink variant="primary" size="lg" href={APP_URLS.register}>
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

          {/* ── RIGHT: live product preview (Priority Queue) ─────────── */}
          <div className="relative">
            {/* floating accent chips for depth */}
            <div className="pointer-events-none absolute -left-4 -top-4 z-20 hidden -rotate-[5deg] md:block">
              <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-2 glass-peach gloss-edge elevate-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full" style={{ background: "linear-gradient(180deg,#FDBA74,#FB923C)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)" }}>
                  <ArrowRight className="h-3 w-3 -rotate-45 text-white" strokeWidth={3} />
                </span>
                <span className="font-mono text-[12px] font-semibold text-orange-500 tabular">+3.4× follow-ups</span>
              </div>
            </div>
            <div className="pointer-events-none absolute -right-4 bottom-6 z-20 hidden rotate-[4deg] md:block">
              <div className="rounded-2xl px-4 py-2.5 glass-sky gloss-edge elevate-2">
                <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-sky-600">Recovered · week 1</div>
                <div className="font-mono text-[18px] font-semibold tabular text-ink">₹18.4L</div>
              </div>
            </div>

            {/* main panel */}
            <div className="relative rounded-[28px] glass-3 gloss-edge elevate-3 p-5 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Priority Queue · Today</p>
                  <h3 className="mt-1.5 text-[18px] font-semibold tracking-[-0.02em] text-ink">Who to call next</h3>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full glass-1 gloss-edge px-2.5 py-1">
                  <span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint-400 opacity-75" /><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-mint-500" /></span>
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-soft">8 hot</span>
                </span>
              </div>

              {/* ₹ at risk strip */}
              <div className="mt-4 flex items-center justify-between rounded-2xl glass-peach gloss-edge px-4 py-3">
                <span className="text-[12.5px] font-medium text-ink-soft">₹ at risk today</span>
                <span className="font-mono text-[19px] font-semibold tabular text-orange-500">₹4.2L</span>
              </div>

              {/* lead rows */}
              <div className="mt-3.5 space-y-2.5">
                {HERO_QUEUE.map((l, i) => (
                  <div key={l.name} className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/65 gloss-edge px-3.5 py-2.5">
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-mono text-[13px] font-bold text-white"
                      style={{ background: GRADE_BG[l.grade], boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 3px 8px rgba(15,23,42,0.16)" }}
                    >
                      {l.grade}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13.5px] font-semibold leading-tight text-ink">{l.name}</p>
                      <p className="truncate font-mono text-[11px] text-ink-muted">{l.company} · ₹{l.value}</p>
                    </div>
                    {i === 0 ? (
                      <span className="shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold text-white" style={{ background: "linear-gradient(180deg,#38BDF8,#0EA5E9)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.45), 0 3px 10px rgba(14,165,233,0.32)" }}>
                        Call now
                      </span>
                    ) : (
                      <span className="shrink-0 font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-faint">{l.ago}</span>
                    )}
                  </div>
                ))}
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
  { value: "₹18L",     label: "avg recovered · 30 days" },
  { value: "3.4×",     label: "follow-up rate · week 1" },
  { value: "60 min",   label: "to first graded lead" },
  { value: "₹4.2 Cr",  label: "recovered / quarter" },
]

function TrustBar() {
  return (
    <div className="relative -mt-8 mb-2">
      <Container>
        <div className="rounded-3xl glass-2 elevate-2 gloss-edge px-6 py-7 md:px-10">
          <p className="text-center font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
            50+ Indian B2B teams · 12 verticals · 8 cities
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
    b: "Fit + Intent + Quality — transparent weights, no black box. Runs on every Sheet, CSV, and form.",
    meta: "Transparent scoring, auditable weights.",
  },
  {
    n: "02",
    tag: "PRIORITISE",
    h: "The queue re-ranks itself, live.",
    b: "As WhatsApp replies land and intent decays overnight, each rep's list re-orders. They just work top-down.",
    meta: "No 90-minute morning triage. Ever.",
  },
  {
    n: "03",
    tag: "RECOVER",
    h: "Missed revenue surfaced in ₹.",
    b: "Every stale lead gets a rupee value. Monday review opens with the exact ₹ at risk, per rep and source.",
    meta: "Accountability in money, not activity.",
  },
]

const MINI_QUEUE = [
  { grade: "A", name: "Priya S.", w: "92%" },
  { grade: "A", name: "Rahul M.", w: "78%" },
  { grade: "B", name: "Anjali R.", w: "54%" },
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
              <p className="mt-3 text-[15px] leading-[1.6] text-ink-soft">{s.b}</p>

              {/* live visual — the product, shown */}
              <div className="mt-6 rounded-2xl border border-white/70 bg-white/55 gloss-edge p-4 md:p-5">
                {s.n === "01" && <GradeDistribution />}
                {s.n === "02" && (
                  <div>
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Today&apos;s queue</p>
                    <div className="mt-3 space-y-2">
                      {MINI_QUEUE.map((q) => (
                        <div key={q.name} className="flex items-center gap-2.5">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg font-mono text-[11px] font-bold text-white" style={{ background: GRADE_BG[q.grade] }}>{q.grade}</span>
                          <span className="w-16 shrink-0 truncate text-[12px] font-medium text-ink">{q.name}</span>
                          <span className="h-2 flex-1 overflow-hidden rounded-full bg-sky-100">
                            <span className="block h-full rounded-full" style={{ width: q.w, background: "linear-gradient(90deg,#7DD3FC,#0EA5E9)" }} />
                          </span>
                          <span className="w-9 shrink-0 text-right font-mono text-[11px] tabular-nums text-ink-muted">{q.w}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {s.n === "03" && <RupeeMeter />}
              </div>

              <p
                className="mt-auto pt-5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted"
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
        <Reveal className="mb-12 md:mb-14 max-w-3xl">
          <NumberedTag number="06" label="Proof" tone="warm" />
          <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">
            Results, in their words.
          </h2>
          <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
            Real Indian B2B teams — real numbers, within weeks of switching.
          </p>
        </Reveal>

        <Reveal delay={0.08} className="grid gap-5 md:grid-cols-3 md:gap-6">
          <TestimonialCard
            stat="+₹38L"
            statLabel="added in 6 weeks"
            accent="mint"
            quote="200+ enquiries a month, converting 3–4%. After Leadkaun, reps called Grade A leads within the hour — conversion hit 8% in six weeks."
            name="Priya S."
            role="Co-Founder, Real Estate Agency"
            city="Pune"
          />
          <TestimonialCard
            stat="−80%"
            statLabel="attribution disputes"
            accent="sky"
            quote="Audit review used to take three days pulling records — now it's three hours, one export. Agent-attribution disputes dropped 80% in two months."
            name="Vikram N."
            role="Insurance Branch Manager"
            city="Mumbai"
          />
          <TestimonialCard
            stat="+12"
            statLabel="admissions in April"
            accent="peach"
            quote="Counsellor morning triage went from 30 minutes to 2. Every counsellor knew which Grade A parent to call at 9 AM — and we closed 12 more admissions."
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
