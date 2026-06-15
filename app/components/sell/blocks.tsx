import type { ReactNode } from "react"
import Link from "next/link"
import { BarChart3, ListOrdered, AlertTriangle, Mail, MessageSquare, Users, ArrowRight, Check } from "lucide-react"

import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { Reveal } from "@/app/components/reveal"
import { NumberedTag } from "@/app/components/numbered-tag"
import { FeatureCard } from "@/app/components/feature-card"
import { CompareTable } from "@/app/components/compare-table"
import ShowcaseVisualsLazy from "@/app/components/sell/showcase-visuals-lazy"
import { GlossLink } from "@/app/components/gloss-button"
import { APP_URLS } from "@/lib/urls"

/* Shared "sell the product" blocks — the landing-page spine, reusable on every
   page so each one shows and sells the product instead of just mentioning it. */

type Ground = "pure" | "cream" | "sky" | "mesh"

export const TRUST_STATS = [
  { value: "₹18L",     label: "avg recovered · 30 days" },
  { value: "3.4×",     label: "follow-up rate · week 1" },
  { value: "60 min",   label: "to first graded lead" },
  { value: "₹4.2 Cr",  label: "recovered / quarter" },
]

const MODULES = [
  { icon: BarChart3,     tag: "Scoring", accent: "mint"  as const, title: "Lead Scoring Engine",       description: "Grade A–F in under 500 ms. Fit + Intent + Quality, transparent weights, decay baked in.",        href: "/features/lead-scoring" },
  { icon: ListOrdered,   tag: "Queue",   accent: "sky"   as const, title: "Priority Queue",            description: "One ranked list per rep. Re-ranks live as signals arrive — so the rep just works top-down.",     href: "/features/priority-queue" },
  { icon: AlertTriangle, tag: "Revenue", accent: "peach" as const, title: "Missed Opportunity Engine", description: "Every stale lead gets a rupee value. Aggregate ₹ at risk surfaced daily to every manager.",     href: "/features/missed-opportunity-engine" },
  { icon: Mail,          tag: "Digest",  accent: "cyan"  as const, title: "Morning Brief",             description: "8:30 AM IST email. Top Grade A leads, overdue follow-ups, ₹ at risk today. Sets the day.",      href: "/features/morning-brief" },
  { icon: MessageSquare, tag: "Signal",  accent: "mint"  as const, title: "WhatsApp Tracking",         description: "70% of Indian B2B first-contact is on WhatsApp. 3-tap logging feeds the Intent Score.",         href: "/features/whatsapp-tracking" },
  { icon: Users,         tag: "Team",    accent: "sky"   as const, title: "Sales Rep Tracking",        description: "Per-rep ₹ recovered, Grade A response time, follow-up completion — without micromanagement.",   href: "/features/sales-rep-tracking" },
]

const COMPARE_ROWS = [
  { left: "Records the number of calls your reps made this week.",  right: "Surfaces ₹ at risk per rep, per week — money, not activity." },
  { left: "Lead scoring is a single black-box number.",             right: "Three transparent scores: Fit, Intent, Quality — auditable weights." },
  { left: "Grade A leads age out silently. Nobody notices.",        right: "Intent decay auto-drops stale leads. The queue stays honest." },
  { left: "Priority decided by rep gut feel or recency.",           right: "Priority Queue re-ranks live — rep works top-down, no triage." },
  { left: "WhatsApp is an integration (paid add-on).",              right: "WhatsApp is a first-class signal. 3-tap logging feeds scoring." },
  { left: "Monday reviews are activity debates.",                   right: "Monday reviews open with ₹ at risk per rep. Coaching is specific." },
]

/**
 * ProductShowcase — SHOWS the product (live Priority Queue panel + grade
 * distribution + ₹-at-risk meter). The single most important "feels like the
 * landing page" block. The visuals are client-rendered (ShowcaseVisualsLazy)
 * to keep the Worker SSR cost low; the heading/sub/CTA stay server-rendered.
 */
export function ProductShowcase({
  eyebrow = "See it work",
  title,
  sub,
  ground = "sky",
  number,
  cta = false,
}: {
  eyebrow?: string
  title: ReactNode
  sub: string
  ground?: Ground
  /** when omitted, renders a label-only eyebrow chip (no clashing section number) */
  number?: string
  /** append an inline trial CTA row under the showcase */
  cta?: boolean
}) {
  return (
    <SectionGround variant={ground} size="lg">
      <Container>
        <Reveal className="mb-10 md:mb-14 max-w-3xl">
          {number ? (
            <NumberedTag number={number} label={eyebrow} />
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 glass-1 gloss-edge font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-600">
              {eyebrow}
            </span>
          )}
          <h2 className="mt-5 text-[30px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">{title}</h2>
          <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft md:text-[18px]">{sub}</p>
        </Reveal>

        <Reveal delay={0.08}>
          <ShowcaseVisualsLazy />
        </Reveal>

        {cta && (
          <Reveal delay={0.12} className="mt-9 flex flex-wrap items-center gap-3">
            <GlossLink variant="primary" size="md" href={APP_URLS.register}>
              Start free trial
              <span className="font-mono opacity-80">→</span>
            </GlossLink>
            <Link href="/demo" className="group inline-flex items-center gap-1.5 text-[14px] font-semibold text-sky-600 hover:text-sky-500">
              Book a 15-min demo →
            </Link>
          </Reveal>
        )}
      </Container>
    </SectionGround>
  )
}

/**
 * ProductBlock — the "tasteful" single product moment for content/informational
 * pages: the live product showcase + an inline trial CTA, with a label-only
 * eyebrow so it never clashes with a page's section numbering.
 */
export function ProductBlock({
  eyebrow = "See it in Leadkaun",
  title = <>This is the product behind the page.</>,
  sub = "Every lead graded A–F, a live Priority Queue per rep, and the ₹ at risk surfaced in real rupees — set up in about 60 minutes.",
  ground = "cream",
}: {
  eyebrow?: string
  title?: ReactNode
  sub?: string
  ground?: Ground
}) {
  return <ProductShowcase eyebrow={eyebrow} title={title} sub={sub} ground={ground} cta />
}

/** ProofBand — the outcome-stats credibility band. */
export function ProofBand({
  label = "50+ Indian B2B teams · 12 verticals · 8 cities",
  ground = "pure",
}: {
  label?: string
  ground?: Ground
}) {
  return (
    <SectionGround variant={ground} size="sm">
      <Container>
        <Reveal className="rounded-3xl glass-2 elevate-2 gloss-edge px-6 py-7 md:px-10">
          <p className="text-center font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">{label}</p>
          <dl className="mt-6 grid grid-cols-2 gap-y-5 md:grid-cols-4 md:gap-y-0">
            {TRUST_STATS.map((s, i) => (
              <div
                key={s.label}
                className={`flex flex-col items-center gap-1 px-4 ${i > 0 ? "md:border-l" : ""}`}
                style={i > 0 ? { borderColor: "var(--hairline)" } : undefined}
              >
                <dt className="font-mono text-[26px] font-semibold leading-none tracking-[-0.025em] text-ink tabular md:text-[30px]">{s.value}</dt>
                <dd className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-muted">{s.label}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </SectionGround>
  )
}

/** ModulesGrid — the 12-module sell (accent FeatureCards). */
export function ModulesGrid({
  eyebrow = "The Product",
  title = "Twelve live modules. One behaviour system.",
  sub = "Every module works on day one. Every setting is transparent. Every weight is yours to audit.",
  ground = "cream",
  tone,
  number = "02",
}: {
  eyebrow?: string
  title?: ReactNode
  sub?: string
  ground?: Ground
  tone?: "warm"
  number?: string
}) {
  return (
    <SectionGround variant={ground} size="lg">
      <Container>
        <Reveal className="mb-12 md:mb-16">
          <NumberedTag number={number} label={eyebrow} tone={tone} />
          <h2 className="mt-5 max-w-3xl text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">{title}</h2>
          <p className="mt-4 max-w-2xl text-[17px] leading-[1.55] text-ink-soft md:text-[18px]">{sub}</p>
        </Reveal>

        <Reveal delay={0.08} className="grid gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {MODULES.map((m) => (
            <FeatureCard key={m.href} icon={m.icon} tag={m.tag} accent={m.accent} title={m.title} description={m.description} href={m.href} />
          ))}
        </Reveal>

        <div className="mt-10">
          <Link href="/product" className="group inline-flex items-center gap-1.5 text-[14px] font-semibold text-sky-600 hover:text-sky-500">
            See all 12 modules
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </Container>
    </SectionGround>
  )
}

/** WhyNotCRM — the "this is not a CRM" comparison ledger. */
export function WhyNotCRM({
  title = <>What Leadkaun does that your CRM doesn&apos;t.</>,
  sub = "CRMs record what happened. Leadkaun reshapes what happens next.",
  ground = "sky",
  number = "03",
}: {
  title?: ReactNode
  sub?: string
  ground?: Ground
  number?: string
}) {
  return (
    <SectionGround variant={ground} size="lg">
      <Container>
        <Reveal className="mb-12 md:mb-16">
          <NumberedTag number={number} label="This is not a CRM" />
          <h2 className="mt-5 max-w-3xl text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">{title}</h2>
          <p className="mt-4 max-w-2xl text-[17px] leading-[1.55] text-ink-soft">{sub}</p>
        </Reveal>
        <Reveal delay={0.08}><CompareTable rows={COMPARE_ROWS} /></Reveal>
      </Container>
    </SectionGround>
  )
}

/** PricingCTA — compact pricing nudge that converts. */
export function PricingCTA({
  lead = "From ₹999 per rep / month.",
  ground = "cream",
  number = "04",
}: {
  lead?: string
  ground?: Ground
  number?: string
}) {
  return (
    <SectionGround variant={ground} size="lg">
      <Container>
        <Reveal className="mx-auto max-w-3xl rounded-3xl glass-3 elevate-3 gloss-edge p-8 text-center md:p-12">
          <NumberedTag number={number} label="Pricing" tone="warm" />
          <h2 className="mt-5 text-[30px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">{lead}</h2>
          <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
            All 12 modules on every tier. 14-day free trial, no credit card. Setup in 60 minutes.
          </p>
          <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5">
            {["14-day free trial", "No credit card", "Cancel anytime"].map((t) => (
              <li key={t} className="inline-flex items-center gap-2 text-[13.5px] font-medium text-ink-soft">
                <span className="inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full" style={{ background: "linear-gradient(180deg,#6EE7B7,#34D399)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), 0 1px 3px rgba(16,185,129,0.30)" }}>
                  <Check className="h-3 w-3 text-white" strokeWidth={3} />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <GlossLink variant="primary" size="lg" href={APP_URLS.register}>
              Start free trial
              <span className="font-mono opacity-80">→</span>
            </GlossLink>
            <Link href="/pricing" className="group inline-flex items-center gap-1.5 text-[14px] font-semibold text-sky-600 hover:text-sky-500">
              See full pricing →
            </Link>
          </div>
        </Reveal>
      </Container>
    </SectionGround>
  )
}

/**
 * SellSpine — the full landing-page selling sequence (show the product → sell
 * the modules → differentiate vs CRM → pricing CTA), numbered continuously from
 * `start`. Drop it into any page after the localised intro content.
 */
export function SellSpine({
  start = 2,
  showcaseEyebrow = "See it work",
  showcaseTitle,
  showcaseSub,
  modulesTitle,
  modulesSub,
  whyNotTitle,
  whyNotSub,
  pricingLead,
  grounds = ["sky", "cream", "sky", "cream"],
}: {
  start?: number
  showcaseEyebrow?: string
  showcaseTitle: ReactNode
  showcaseSub: string
  modulesTitle?: ReactNode
  modulesSub?: string
  whyNotTitle?: ReactNode
  whyNotSub?: string
  pricingLead?: string
  grounds?: [Ground, Ground, Ground, Ground]
}) {
  const n = (i: number) => String(start + i).padStart(2, "0")
  return (
    <>
      <ProductShowcase number={n(0)} eyebrow={showcaseEyebrow} title={showcaseTitle} sub={showcaseSub} ground={grounds[0]} />
      <ModulesGrid number={n(1)} ground={grounds[1]} title={modulesTitle} sub={modulesSub} />
      <WhyNotCRM number={n(2)} ground={grounds[2]} title={whyNotTitle} sub={whyNotSub} />
      <PricingCTA number={n(3)} ground={grounds[3]} lead={pricingLead} />
    </>
  )
}
