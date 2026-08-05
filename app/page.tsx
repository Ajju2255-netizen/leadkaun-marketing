import Link from "next/link"
import {
  BarChart3,
  ListOrdered,
  AlertTriangle,
  Mail,
  MessageSquare,
  Users,
  ArrowRight,
  Building2,
  GraduationCap,
  ShieldCheck,
  Cloud,
  Factory,
  Briefcase,
  HeartPulse,
  Check,
} from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { GradientBlob } from "@/app/components/gradient-blob"
import { HeroSignupCard } from "@/app/components/hero-signup"
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
import { faqPageSchema, jsonLdScript } from "@/lib/seo"
import type { Metadata } from "next"

// The homepage was the only page inheriting root defaults — give it its own
// title/description/canonical/OG. `absolute` opts out of the "%s | Leadkaun"
// template so the head term leads.
export const metadata: Metadata = {
  title: { absolute: "Lead Management Software for Indian B2B Sales Teams | Leadkaun" },
  description:
    "Leadkaun is lead management software for Indian B2B teams — grade every lead A–F, build each rep's Priority Queue, and surface missed revenue in ₹. Lead scoring, lead tracking and sales CRM in one place. Runs alongside your CRM. Start free.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Leadkaun — Lead Management Software for Indian B2B Teams",
    description:
      "Grade every lead A–F, work a live Priority Queue, and recover missed revenue in ₹. Lead management and lead tracking software that tells reps who to call next. Start free.",
    url: "/",
    type: "website",
  },
}

/* ═══════════════════════════════════════════════════════════════════════
   HOMEPAGE — Coastal Sunrise + Layered Glass (visionOS depth)
═══════════════════════════════════════════════════════════════════════ */

export default function HomePage() {
  return (
    <main className="min-h-screen bg-bg-pure">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript([faqPageSchema(HOME_FAQ)]) }} />
      <Navbar />

      <Hero />
      <EditorialStatement />
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

function Hero() {
  return (
    <SectionGround variant="mesh" size="xl" ambient={false} className="pt-36 md:pt-44 pb-20 md:pb-28">
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

            <h1 className="mt-7 font-serif text-[42px] font-medium leading-[1.06] tracking-[-0.015em] text-ink md:text-[60px]">
              Lead management software that tells every rep{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(95deg, #0EA5E9 0%, #06B6D4 45%, #FB923C 100%)" }}
              >
                exactly who to call next.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-[17px] leading-[1.6] text-ink-soft md:text-[19px]">
              Leadkaun is the Sales Behaviour OS for Indian B2B teams — it grades every lead A–F,
              builds each rep&apos;s Priority Queue, and surfaces missed revenue in ₹. Sales CRM and
              lead tracking in one place.
            </p>

            <ul className="mt-7 space-y-2.5">
              {[
                "AI grades every lead A–F, automatically",
                "A Priority Queue your reps actually follow",
                "Missed ₹ surfaced before it's gone",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-[14.5px] text-ink-soft">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-sky-100">
                    <Check className="h-3 w-3 text-sky-600" strokeWidth={3} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>

            <p className="mt-7 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
              Grades every lead A–F · Priority Queue · No credit card
            </p>
          </div>

          {/* ── RIGHT: signup form (ads landing) ─────────────────────── */}
          <div className="relative lg:pl-2">
            <HeroSignupCard />
          </div>

        </div>

        {/* Activity strip — the system at work (editorial status cards) */}
        <div className="mt-12 overflow-hidden rounded-2xl glass-2 gloss-edge elevate-1 sm:flex">
          {[
            { icon: BarChart3,     label: "Lead graded A" },
            { icon: ListOrdered,   label: "Added to Priority Queue" },
            { icon: AlertTriangle, label: "₹ at risk flagged" },
          ].map(({ icon: Icon, label }, i) => (
            <div
              key={label}
              className={`flex flex-1 items-center gap-3 px-5 py-4 ${i > 0 ? "border-t sm:border-l sm:border-t-0" : ""}`}
              style={i > 0 ? { borderColor: "var(--hairline)" } : undefined}
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/70 gloss-edge">
                <Icon className="h-[17px] w-[17px] text-sky-600" strokeWidth={1.9} />
              </span>
              <span className="flex-1 text-[13.5px] font-medium text-ink">{label}</span>
              <span
                className="grid h-5 w-5 shrink-0 place-items-center rounded-full"
                style={{ background: "linear-gradient(180deg,#6EE7B7,#10B981)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)" }}
              >
                <Check className="h-3 w-3 text-white" strokeWidth={3} />
              </span>
            </div>
          ))}
        </div>

        {/* Proof band — folded into the hero block, on the mesh (no seam straddle) */}
        <div className="mt-16 rounded-3xl glass-2 elevate-2 gloss-edge px-6 py-7 md:mt-20 md:px-10">
          <p className="text-center font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
            Illustrative model — typical figures for an Indian B2B team, not customer results
          </p>
          <dl className="mt-6 grid grid-cols-2 gap-y-5 md:grid-cols-4 md:gap-y-0">
            {TRUST_STATS.map((s, i) => (
              <div
                key={s.label}
                className={`flex flex-col items-center gap-1 px-4 ${i > 0 ? "md:border-l" : ""}`}
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
    </SectionGround>
  )
}

/* ───────────────────────────────────────────────────────────────────────
   TRUST STATS — proof metrics rendered in the hero band
─────────────────────────────────────────────────────────────────────── */

const TRUST_STATS = [
  { value: "₹18L",     label: "modelled ₹ recovered · 30 days" },
  { value: "3.4×",     label: "follow-up rate lift · week 1" },
  { value: "same day", label: "to first graded lead" },
  { value: "A–F",      label: "every lead graded, in real time" },
]

/* ───────────────────────────────────────────────────────────────────────
   EDITORIAL STATEMENT — big serif thesis, folded between hero and problem
─────────────────────────────────────────────────────────────────────── */

function EditorialStatement() {
  return (
    <SectionGround variant="cream" size="lg">
      <Container>
        <Reveal className="mx-auto max-w-4xl text-center">
          <p className="font-serif text-[25px] font-medium leading-[1.4] tracking-[-0.01em] text-ink md:text-[36px] md:leading-[1.38]">
            Great sales teams aren&apos;t working harder — they&apos;re working the right lead first.{" "}
            <span className="text-ink-muted">
              Leadkaun grades every enquiry, builds each rep&apos;s queue, and surfaces the ₹ at risk — so your
              team spends its hours where the revenue actually is.
            </span>
          </p>
        </Reveal>
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
            <h2 className="mt-5 text-[32px] font-serif font-medium leading-[1.12] tracking-[-0.015em] text-ink md:text-[44px]">
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
    h: "Every lead scored A–F in real time.",
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
          <h2 className="mt-5 max-w-2xl text-[32px] font-serif font-medium leading-[1.12] tracking-[-0.015em] text-ink md:text-[44px]">
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
  { icon: BarChart3,     tag: "Scoring", accent: "mint"  as const, title: "Lead Scoring Engine",       description: "Grade A–F in real time. Fit + Intent + Quality, transparent weights, decay baked in.",        href: "/features/lead-scoring" },
  { icon: ListOrdered,   tag: "Queue",   accent: "sky"   as const, title: "Priority Queue",            description: "One ranked list per rep. Re-ranks live as signals arrive — so the rep just works top-down.",     href: "/features/priority-queue" },
  { icon: AlertTriangle, tag: "Revenue", accent: "peach" as const, title: "Missed Opportunity Engine", description: "Every stale lead gets a rupee value. Aggregate ₹ at risk surfaced daily to every manager.",     href: "/features/missed-opportunity-engine" },
  { icon: Mail,          tag: "Digest",  accent: "cyan"  as const, title: "Morning Brief",             description: "8:30 AM IST email. Top Grade A leads, overdue follow-ups, ₹ at risk today. Sets the day.",      href: "/features/morning-brief" },
  { icon: MessageSquare, tag: "Signal",  accent: "mint"  as const, title: "WhatsApp Tracking",         description: "Most Indian B2B first-contact happens on WhatsApp. 3-tap logging feeds the Intent Score.",         href: "/features/whatsapp-tracking" },
  { icon: Users,         tag: "Team",    accent: "sky"   as const, title: "Sales Rep Tracking",        description: "Per-rep ₹ recovered, Grade A response time, follow-up completion — without micromanagement.",   href: "/features/sales-rep-tracking" },
]

function Modules() {
  return (
    <SectionGround variant="sky" size="lg">
      <Container>
        <Reveal className="mb-12 md:mb-16">
          <NumberedTag number="03" label="The Product" />
          <h2 className="mt-5 max-w-3xl text-[32px] font-serif font-medium leading-[1.12] tracking-[-0.015em] text-ink md:text-[44px]">
            Twelve live modules. One behaviour system.
          </h2>
          <p className="mt-4 max-w-2xl text-[17px] leading-[1.55] text-ink-soft md:text-[18px]">
            Every module works on day one. Every setting is transparent. Every weight is yours to audit.
          </p>
        </Reveal>

        <Reveal delay={0.08} className="grid gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {MODULES.map((m) => (
            <FeatureCard
              key={m.href}
              icon={m.icon}
              tag={m.tag}
              accent={m.accent}
              title={m.title}
              description={m.description}
              href={m.href}
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
          <h2 className="mt-5 max-w-3xl text-[32px] font-serif font-medium leading-[1.12] tracking-[-0.015em] text-ink md:text-[44px]">
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
  { href: "/use-cases/real-estate",   label: "Real Estate",         meta: "₹5–50L GCV",        icon: Building2 },
  { href: "/use-cases/edtech",        label: "EdTech",              meta: "Admissions cycles", icon: GraduationCap },
  { href: "/use-cases/bfsi",          label: "BFSI & Insurance",    meta: "Audit-ready",       icon: ShieldCheck },
  { href: "/use-cases/saas",          label: "SaaS",                meta: "Trial to paid",     icon: Cloud },
  { href: "/use-cases/manufacturing", label: "Manufacturing",       meta: "90-day cycles",     icon: Factory },
  { href: "/use-cases/agencies",      label: "Agencies",            meta: "Multi-client",      icon: Briefcase },
  { href: "/use-cases/healthcare",    label: "Healthcare",          meta: "DND-compliant",     icon: HeartPulse },
  { href: "/use-cases",               label: "See all industries",  meta: "12 verticals →",    cta: true },
]

function Industries() {
  return (
    <SectionGround variant="sky" size="lg">
      <Container>
        <Reveal className="mb-12 md:mb-14">
          <NumberedTag number="05" label="By Industry" />
          <h2 className="mt-5 max-w-3xl text-[32px] font-serif font-medium leading-[1.12] tracking-[-0.015em] text-ink md:text-[44px]">
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
          <NumberedTag number="06" label="What it recovers" tone="warm" />
          <h2 className="mt-5 text-[32px] font-serif font-medium leading-[1.12] tracking-[-0.015em] text-ink md:text-[44px]">
            The money that slips — and what a queue-first system claws back.
          </h2>
          <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
            Illustrative scenarios (not customer quotes) — the ₹ at risk when follow-up lags in three common Indian B2B setups.
          </p>
        </Reveal>

        <Reveal delay={0.08} className="grid gap-5 md:grid-cols-3 md:gap-6">
          <TestimonialCard
            accent="mint"
            quote="Real estate — a 200-enquiry-a-month desk converting at 3–4%. Grade every enquiry A–F and call the A's inside the hour, and even a few points of lift compounds into lakhs: the ₹ Leadkaun surfaces as at-risk."
          />
          <TestimonialCard
            accent="sky"
            quote="Insurance / BFSI — a branch that spends days pulling records for an audit can cut it to one export when every call, WhatsApp and follow-up is logged and attributed to a rep, and attribution disputes largely disappear."
          />
          <TestimonialCard
            accent="peach"
            quote="EdTech admissions — when a counsellor's 30-minute morning triage becomes 2, with every Grade A parent surfaced at 9 AM in the Priority Queue, the recovered hours turn straight into more admissions closed."
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
          <h2 className="mt-5 text-[32px] font-serif font-medium leading-[1.12] tracking-[-0.015em] text-ink md:text-[44px]">
            Start free. Grow into more sales.
          </h2>
          <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
            AI scoring, Priority Queue and pipeline free for 14 days — no credit card. Then priced flat
            by team size and lead volume. Annual billing saves 17%.
          </p>
        </Reveal>

        <Reveal delay={0.08} className="grid gap-6 md:grid-cols-3">
          <PricingTier
            name="Starter"
            description="Small teams getting AI scoring + the queue live for the first time."
            price="₹2,999"
            annualNote="₹29,990 billed yearly · save 17%"
            features={[
              "Up to 10 users · 5,000 active leads",
              "AI scoring + Smart Priority Queue",
              "Unlimited pipeline & CSV imports",
              "Follow-up engine + team dashboard",
              "Email support",
            ]}
            ctaLabel="Start Starter"
            ctaHref={APP_URLS.register}
          />
          <PricingTier
            name="Growth"
            description="Growing teams that can't afford to let a hot lead go cold."
            price="₹7,999"
            annualNote="₹79,990 billed yearly · save 17%"
            features={[
              "Up to 30 users · 25,000 active leads",
              "Everything in Starter, plus:",
              "Missed Opportunity Engine (₹ at risk)",
              "AI Learning Engine + rep scorecards",
              "Revenue dashboard + advanced analytics",
              "Priority support",
            ]}
            ctaLabel="Upgrade to Growth"
            ctaHref={APP_URLS.register}
            highlighted
          />
          <PricingTier
            name="Scale"
            description="High-growth companies needing workspaces, API and a CSM."
            price="₹19,999"
            annualNote="₹1,99,990 billed yearly · save 17%"
            features={[
              "Up to 75 users · unlimited leads",
              "Everything in Growth, plus:",
              "Multiple workspaces",
              "API access + webhooks",
              "Dedicated success manager + QBRs",
              "Premium support + SLA",
            ]}
            ctaLabel="Scale Faster"
            ctaHref={APP_URLS.register}
          />
        </Reveal>

        <Reveal delay={0.12} className="mt-10 flex flex-col items-center gap-5 text-center">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5">
            {["14-day free trial", "No credit card", "Cancel anytime", "All 12 modules, every tier"].map((t) => (
              <li key={t} className="inline-flex items-center gap-2 text-[13.5px] font-medium text-ink-soft">
                <span
                  className="inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full"
                  style={{ background: "linear-gradient(180deg,#6EE7B7,#34D399)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), 0 1px 3px rgba(16,185,129,0.30)" }}
                >
                  <Check className="h-3 w-3 text-white" strokeWidth={3} />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <Link
            href="/pricing"
            className="group inline-flex items-center gap-1.5 text-[14px] font-semibold text-sky-600 hover:text-sky-500"
          >
            See full pricing &amp; comparison
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </Container>
    </SectionGround>
  )
}

/* ───────────────────────────────────────────────────────────────────────
   FAQ — glass accordion on warm cream
─────────────────────────────────────────────────────────────────────── */

const HOME_FAQ = [
  { q: "How is Leadkaun different from a CRM?",            a: "A CRM records what happened. Leadkaun reshapes what happens next — by grading every lead, building a Priority Queue that re-ranks in real time, and surfacing missed revenue in rupees. Most teams run Leadkaun alongside their CRM for 60–90 days, then consolidate." },
  { q: "How long does setup take?",                         a: "You can go live the same day — from signup to your first Grade A lead in the queue. The onboarding wizard uses pre-configured ICP defaults across a range of Indian B2B verticals, so you do not need to define your ICP from scratch." },
  { q: "Do I need to import all my historical leads?",      a: "No — and we recommend you do not. Import only the live leads (last 90 days of activity). Stale data pollutes the grade distribution. Most teams migrate 40–60% of their CRM data; the rest stays archived." },
  { q: "Does it handle WhatsApp?",                          a: "Yes — as a first-class signal, not an integration afterthought. Reps log every meaningful WhatsApp exchange in 3 taps (stage + intent + outcome), feeding the Intent Score directly. Works with any WhatsApp account — no Business API needed. BSP integrations (Gupshup, AiSensy, Interakt) for auto-logging are on the roadmap." },
  { q: "What happens if a rep leaves?",                     a: "One-click handover. Lead records, activity history, WhatsApp logs, follow-up schedules all transfer to the new rep. The pipeline does not leave with the person." },
  { q: "Is my data secure?",                                a: "Supabase Singapore region (lowest India latency). Row-Level Security enforced at the database level. Encryption in transit and at rest. Full audit trail per lead, exportable on demand. One-click CSV export of everything — your data is your data." },
]

function FaqBlock() {
  return (
    <SectionGround variant="cream" size="md">
      <Container>
        <Reveal className="mx-auto mb-10 max-w-3xl text-center">
          <div className="flex justify-center">
            <NumberedTag number="08" label="FAQ" tone="warm" />
          </div>
          <h2 className="mt-5 text-[32px] font-serif font-medium leading-[1.12] tracking-[-0.015em] text-ink md:text-[40px]">
            Common questions.
          </h2>
        </Reveal>

        <Reveal delay={0.08}><Faq items={HOME_FAQ} /></Reveal>
      </Container>
    </SectionGround>
  )
}
