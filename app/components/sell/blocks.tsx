import type { ReactNode } from "react"
import Link from "next/link"
import { BarChart3, ListOrdered, AlertTriangle, Mail, MessageSquare, Users, ArrowRight, Check } from "lucide-react"

import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { Reveal } from "@/app/components/reveal"
import { NumberedTag } from "@/app/components/numbered-tag"
import type { LucideIcon } from "lucide-react"
import { MODULES, ALONGSIDE_ROWS, type SpineModule } from "@/lib/pseo/spine-content"
import { FeatureCard } from "@/app/components/feature-card"
import { CompareTable } from "@/app/components/compare-table"
import ShowcaseVisualsLazy from "@/app/components/sell/showcase-visuals-lazy"
import { GlossLink } from "@/app/components/gloss-button"
import { APP_URLS } from "@/lib/urls"

/* Shared "sell the product" blocks — the landing-page spine, reusable on every
   page so each one shows and sells the product instead of just mentioning it. */

type Ground = "pure" | "cream" | "sky" | "mesh"

/**
 * Evidence ladder — replaces the old TRUST_STATS.
 *
 * The figures it used to carry are on Brain 00 §5's quarantine list:
 * unsourced outcome claims carried under an "illustrative model" label that was
 * doing a great deal of work for very little payoff, across 9+ pages.
 *
 * These are product-mechanism facts instead — every one is a threshold or
 * behaviour the engine actually applies, published at /methodology. Weaker on
 * paper than a big rupee number; far stronger as evidence, because they are
 * checkable. When consented customer results exist they replace these, and the
 * ladder is why that is a data change rather than a rewrite.
 */
export const TRUST_STATS = [
  { value: "A–F",      label: "every lead graded, in real time" },
  { value: "3 scores", label: "Fit, Intent and Quality, published weights" },
  { value: "same day", label: "to first graded lead" },
  { value: "flat ₹",   label: "priced per account, not per seat" },
]

const MODULE_ICONS: Record<string, LucideIcon> = {
  "lead-scoring": BarChart3, "priority-queue": ListOrdered, "missed-opportunity-engine": AlertTriangle,
  "morning-brief": Mail, "whatsapp-tracking": MessageSquare, "sales-rep-tracking": Users,
}
const MODULE_ACCENTS: Record<string, "mint" | "sky" | "peach" | "cyan"> = {
  "lead-scoring": "mint", "priority-queue": "sky", "missed-opportunity-engine": "peach",
  "morning-brief": "cyan", "whatsapp-tracking": "mint", "sales-rep-tracking": "sky",
}

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
              Start free
              <span className="font-mono opacity-80">→</span>
            </GlossLink>
            <Link href={APP_URLS.register} className="group inline-flex items-center gap-1.5 text-[14px] font-semibold text-sky-600 hover:text-sky-500">
              Get started free →
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
  sub = "Every lead graded A–F, a live Priority Queue per rep, and the ₹ at risk surfaced in real rupees. Set up the same day.",
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
  label = "Product mechanics, published in full at /methodology",
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

/** ModulesGrid — module sell (accent FeatureCards). Renders `modules` if given. */
export function ModulesGrid({
  eyebrow = "The Product",
  title = "The modules that reshape the day.",
  sub = "Every module works on day one, and every weight behind the grade is published.",
  ground = "cream",
  tone,
  number = "02",
  modules,
  moreHref = "/product",
}: {
  eyebrow?: string
  title?: ReactNode
  sub?: string
  ground?: Ground
  tone?: "warm"
  number?: string
  /** Subset to render. pSEO pages pass 3 chosen by lib/pseo/spine.ts so ~17k
   *  pages stop shipping the same six cards; hand-built pages pass nothing. */
  modules?: readonly SpineModule[]
  moreHref?: string
}) {
  const shown = modules ?? MODULES
  return (
    <SectionGround variant={ground} size="lg">
      <Container>
        <Reveal className="mb-12 md:mb-16">
          <NumberedTag number={number} label={eyebrow} tone={tone} />
          <h2 className="mt-5 max-w-3xl text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">{title}</h2>
          <p className="mt-4 max-w-2xl text-[17px] leading-[1.55] text-ink-soft md:text-[18px]">{sub}</p>
        </Reveal>

        <Reveal delay={0.08} className="grid gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {shown.map((m) => (
            <FeatureCard key={m.href} icon={MODULE_ICONS[m.key]} tag={m.tag} accent={MODULE_ACCENTS[m.key]} title={m.title} description={m.description} href={m.href} />
          ))}
        </Reveal>

        <div className="mt-10">
          <Link href={moreHref} className="group inline-flex items-center gap-1.5 text-[14px] font-semibold text-sky-600 hover:text-sky-500">
            See the full product
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </Container>
    </SectionGround>
  )
}

/** WhyNotCRM — the alongside-your-CRM comparison ledger. Named for history;
 *  the framing is "alongside", never "not a CRM" (Brain 02 hybrid wedge). */
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
          <NumberedTag number={number} label="Alongside your CRM" />
          <h2 className="mt-5 max-w-3xl text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">{title}</h2>
          <p className="mt-4 max-w-2xl text-[17px] leading-[1.55] text-ink-soft">{sub}</p>
        </Reveal>
        <Reveal delay={0.08}><CompareTable rows={ALONGSIDE_ROWS} /></Reveal>
      </Container>
    </SectionGround>
  )
}

/** PricingCTA — compact pricing nudge that converts. */
export function PricingCTA({
  lead = "From ₹2,999 per month.",
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
            Flat pricing per team, premium features unlock by tier. Free forever tier, no card. Setup the same day.
          </p>
          <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5">
            {["Free forever tier", "No credit card", "Cancel anytime"].map((t) => (
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
              Start free
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

