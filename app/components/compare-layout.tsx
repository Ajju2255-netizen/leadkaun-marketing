import Link from "next/link"
import { Check, X, Minus, ArrowRight, ExternalLink } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"

import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { HeroSignupCard } from "@/app/components/hero-signup"
import { NumberedTag } from "@/app/components/numbered-tag"
import { Reveal } from "@/app/components/reveal"
import { Faq } from "@/app/components/faq"
import { QuickAnswer } from "@/app/components/quick-answer"
import { faqPageSchema, breadcrumbListSchema, jsonLdScript } from "@/lib/seo"
import { APP_URLS } from "@/lib/urls"

/* ============================================================================
   THE REVIEW LEDGER — /compare treatment
   ----------------------------------------------------------------------------
   Comparison pages are the only place on the site where the reader arrives
   already sceptical: they are shopping, and they know we sell one of the two
   products. A marketing layout makes that worse. So /compare gets its own
   register — a published review, not a landing page:

     · a masthead that states the matchup, the verdict and the review date
     · a head-to-head spec sheet before any prose
     · hairline rules and tabular figures instead of stacked cards
     · a grouped matrix with a sticky header, so a 40-row table stays readable
     · total cost at 5 / 15 / 50 reps, because per-seat pricing only hurts later
     · a stated method, sources, and a section that says where we lose

   Everything is server-rendered; the sticky behaviour is CSS only.
   ========================================================================== */

type Cell = boolean | string | "neutral"

export type FeatureRow = { label: string; leadkaun: Cell; competitor: Cell }
export type FeatureGroup = { group: string; rows: FeatureRow[] }
type FaqItem = { q: string; a: string }

export type CompareProps = {
  competitor: string
  competitorShort?: string
  tldr: string
  positioning: string
  strengths: string[]
  weaknesses: string[]

  /** Feature matrix, grouped into categories. */
  features: FeatureGroup[]

  pricing: {
    leadkaun:    { tier: string; price: string; note?: string }
    competitor:  { tier: string; price: string; note?: string }
  }

  switching: { title: string; body: string }[]
  faqs: FaqItem[]

  /** Honest 2–3 paragraph prose on where each tool genuinely wins. */
  verdict?: { competitorWins: string; leadkaunWins: string; bottomLine: string }

  /* ---- Review-ledger fields ---------------------------------------------- */

  /** One-sentence verdict, shown under the masthead. Falls back to `tldr`. */
  verdictLine?: string

  /** Head-to-head spec sheet rows shown in the masthead. */
  glance?: {
    category: string
    pricingModel: string
    bestFor: string
    indiaFit: string
    setup: string
  }

  /** Decision criteria: pick the competitor / pick Leadkaun when… */
  chooseCompetitor?: string[]
  chooseLeadkaun?: string[]

  /**
   * Cost model for the total-cost table. Leadkaun's ladder is the same on
   * every page so it lives here, not in the 15 route files.
   */
  cost?: {
    perSeat?: number
    flat?: number
    currency?: "INR" | "USD"
    /** Cost the headline rate does not include, e.g. "admin ₹1–2 L/mo". */
    plus?: string
    /** No public pricing — render "On request" instead of a figure. */
    quoteOnly?: boolean
  }

  /** ISO date the pricing and capability claims were last checked. */
  reviewedOn?: string
  /** Where the competitor's claims were read from. */
  sources?: { label: string; url: string }[]

  /**
   * The two products do different jobs and are usually bought together
   * (Apollo, Clay). Suppresses the cheaper/dearer verdict in the cost table —
   * declaring a winner on price would contradict the page's own thesis.
   */
  complementary?: boolean

  /** Label overrides for complementary tools (Apollo, Clay) that aren't swaps. */
  switchingLabel?: string
  switchingHeading?: string
  faqHeading?: string
}

/* --- Constants -------------------------------------------------------------
   Leadkaun bills flat per account with a seat cap per tier, so the total-cost
   table is a lookup, not a multiplication. Source: /pricing. */
const LK_LADDER = [
  { upto: 10, name: "Starter", price: 2999 },
  { upto: 30, name: "Growth",  price: 7999 },
  { upto: 75, name: "Scale",   price: 19999 },
]
const TEAM_SIZES = [5, 15, 50]
const FX = 88 // ₹ per USD, stated rather than hidden

const inr = (n: number) => `₹${new Intl.NumberFormat("en-IN").format(Math.round(n))}`

function lkCost(reps: number) {
  return LK_LADDER.find((t) => reps <= t.upto) ?? LK_LADDER[LK_LADDER.length - 1]
}

/* --- Atoms ---------------------------------------------------------------- */

function Yes() {
  return (
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full" style={{ background: "#10B981" }}>
      <Check className="h-3 w-3 text-white" strokeWidth={3} />
    </span>
  )
}

function No() {
  return (
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full" style={{ background: "rgba(15,23,42,0.06)" }}>
      <X className="h-3 w-3 text-ink-muted" strokeWidth={2.5} />
    </span>
  )
}

function Indicator({ v }: { v: Cell }) {
  if (v === true) return <Yes />
  if (v === false) return <No />
  if (v === "neutral") return <Minus className="h-4 w-4 text-ink-muted" strokeWidth={2} />
  return <span className="ledger-num text-[11px] font-semibold leading-tight text-ink-soft md:text-[12px]">{v}</span>
}

/** Mono, wide-tracked, quiet — the label voice used throughout the review. */
function Label({ children, tone = "muted", className = "" }: { children: React.ReactNode; tone?: "muted" | "sky" | "warm" | "mint"; className?: string }) {
  const color =
    tone === "sky" ? "text-sky-700" : tone === "warm" ? "text-orange-500" : tone === "mint" ? "text-emerald-600" : "text-ink-muted"
  return (
    <p className={`ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] ${color} ${className}`}>{children}</p>
  )
}

/**
 * The alignment spine. Every prose block on the page is a label in a fixed
 * left gutter plus content in one column, so the overview, the positioning
 * copy and the two-up blocks all share a single left edge instead of each
 * inventing its own. Rules sit between blocks, never around them.
 */
function LedgerBlock({ label, children, delay = 0, first = false }: {
  label: string
  children: React.ReactNode
  delay?: number
  /** First block in a section — no top rule, tighter top margin. */
  first?: boolean
}) {
  return (
    <Reveal
      delay={delay}
      className={first ? "" : "mt-10 border-t pt-10 md:mt-12 md:pt-12"}
      style={first ? undefined : { borderColor: "var(--paper-line)" }}
    >
      <div className="grid gap-y-4 md:grid-cols-[minmax(0,168px)_minmax(0,1fr)] md:gap-x-10">
        <Label className="md:pt-1">{label}</Label>
        <div>{children}</div>
      </div>
    </Reveal>
  )
}

function SectionHead({ number, label, title, tone, sub }: { number: string; label: string; title: string; tone?: "default" | "warm"; sub?: string }) {
  return (
    <Reveal className="mb-10 max-w-3xl md:mb-14">
      <NumberedTag number={number} label={label} tone={tone} />
      <h2 className="mt-5 text-[30px] font-semibold leading-[1.08] tracking-[-0.03em] text-ink md:text-[42px]">{title}</h2>
      {sub && <p className="mt-4 text-[16px] leading-[1.65] text-ink-soft">{sub}</p>}
    </Reveal>
  )
}

/* --- Masthead ------------------------------------------------------------- */

function Masthead({ short, verdictLine, reviewedOn, glance }: {
  short: string
  verdictLine: string
  reviewedOn?: string
  glance?: CompareProps["glance"]
}) {
  const specs: { label: string; lk: string; comp: string }[] = glance
    ? [
        { label: "Category",      lk: "Sales Behaviour OS (works alongside a CRM)", comp: glance.category },
        { label: "Pricing model", lk: "Flat per account, INR",                      comp: glance.pricingModel },
        { label: "Best for",      lk: "Indian B2B SMB sales teams working inbound leads", comp: glance.bestFor },
        { label: "India fit",     lk: "Built for it — WhatsApp, ₹, IST, lakhs/crores",    comp: glance.indiaFit },
        { label: "Time to live",  lk: "Same day",                                    comp: glance.setup },
      ]
    : []

  return (
    <SectionGround variant="cream" size="sm" ambient={false} className="pt-28 md:pt-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)] lg:items-start lg:gap-16">
        <div>
        {/* Review slug line */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <Label tone="sky">Comparison</Label>
          <span aria-hidden className="ledger-num text-[10px] text-ink-faint">/</span>
          <Label>{reviewedOn ? `Reviewed ${reviewedOn}` : "Method published"}</Label>
          <span aria-hidden className="ledger-num text-[10px] text-ink-faint">/</span>
          <Label>We build one of these two</Label>
        </div>

        {/* Matchup */}
        <h1 className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[40px] leading-[1.02] tracking-[-0.03em] text-ink md:text-[64px]">
          <span>Leadkaun</span>
          <span aria-hidden className="ledger-num text-[13px] font-semibold uppercase tracking-[0.2em] text-ink-muted md:text-[15px]">vs</span>
          <span className="hero-accent">{short}</span>
        </h1>

        <p className="mt-6 max-w-3xl text-[17px] leading-[1.6] text-ink-soft md:text-[19px]">{verdictLine}</p>

        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
          <a
            href={APP_URLS.register}
            className="btn-gloss-primary inline-flex items-center gap-2 rounded-xl px-5 py-3 text-[14px] font-semibold"
            style={{ color: "#FFFFFF" }}
          >
            Start free <ArrowRight className="h-4 w-4" />
          </a>
          <Link href="/compare" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-sky-700 hover:text-sky-600">
            All {" "}comparisons <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        </div>
        <div className="lg:pt-2"><HeroSignupCard /></div>
        </div>

        {/* Head-to-head spec sheet — the review's opening move */}
        {specs.length > 0 && (
          <div className="mt-12 border-t md:mt-14" style={{ borderColor: "var(--paper-line-2)" }}>
            <div className="hidden grid-cols-[minmax(0,168px)_1fr_1fr] gap-x-10 py-3 md:grid" style={{ borderBottom: "1px solid var(--paper-line)" }}>
              <span />
              <Label tone="sky">Leadkaun</Label>
              <Label>{short}</Label>
            </div>
            {specs.map((r) => (
              <div
                key={r.label}
                className="grid grid-cols-1 gap-x-10 gap-y-2 py-4 md:grid-cols-[minmax(0,168px)_1fr_1fr]"
                style={{ borderBottom: "1px solid var(--paper-line)" }}
              >
                <Label className="md:pt-0.5">{r.label}</Label>
                <p className="text-[14px] leading-[1.5] text-ink">
                  <span className="ledger-num mr-2 text-[9px] uppercase tracking-[0.16em] text-sky-700 md:hidden">Leadkaun</span>
                  {r.lk}
                </p>
                <p className="text-[14px] leading-[1.5] text-ink-soft">
                  <span className="ledger-num mr-2 text-[9px] uppercase tracking-[0.16em] text-ink-muted md:hidden">{short}</span>
                  {r.comp}
                </p>
              </div>
            ))}
          </div>
        )}
      </Container>
    </SectionGround>
  )
}

/* --- Sticky jump nav ------------------------------------------------------ */

const NAV = [
  { id: "read",      label: "The read" },
  { id: "matrix",    label: "Feature matrix" },
  { id: "verdict",   label: "Verdict" },
  { id: "cost",      label: "Total cost" },
  { id: "switching", label: "Switching" },
  { id: "faq",       label: "FAQ" },
]

function JumpNav() {
  return (
    <nav
      aria-label="On this page"
      className="sticky top-16 z-30 border-y"
      style={{ borderColor: "var(--paper-line)", background: "rgba(252,250,246,0.92)", backdropFilter: "saturate(180%) blur(8px)" }}
    >
      <Container className="!px-0 md:!px-8">
        <ul className="flex items-center gap-1 overflow-x-auto px-4 py-2.5 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {NAV.map((n) => (
            <li key={n.id}>
              <a
                href={`#${n.id}`}
                className="ledger-num inline-block whitespace-nowrap rounded-lg px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted transition-colors hover:bg-white hover:text-sky-700"
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </nav>
  )
}

/* --- Feature matrix ------------------------------------------------------- */

function FeatureMatrix({ groups, short }: { groups: FeatureGroup[]; short: string }) {
  const cols = "grid-cols-[minmax(0,1fr)_84px_84px] md:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)_minmax(0,1fr)]"
  return (
    <div className="rounded-2xl bg-white" style={{ border: "1px solid var(--paper-line)" }}>
      {/* Column header — sticks under the navbar + jump nav while you scan */}
      <div
        className={`sticky top-[116px] z-20 grid ${cols} rounded-t-2xl bg-white`}
        style={{ borderBottom: "1px solid var(--paper-line-2)" }}
      >
        <div className="px-4 py-3.5 md:px-6">
          <Label>Capability</Label>
        </div>
        <div className="px-2 py-3.5 text-center md:px-6" style={{ background: "rgba(8,119,184,0.04)" }}>
          <Label tone="sky">Leadkaun</Label>
        </div>
        <div className="px-2 py-3.5 text-center md:px-6">
          <Label>{short}</Label>
        </div>
      </div>

      {groups.map((g) => (
        <div key={g.group}>
          <div className={`grid ${cols}`} style={{ borderBottom: "1px solid var(--paper-line)" }}>
            <div className="px-4 pb-2 pt-6 md:px-6">
              <Label tone="warm">{g.group}</Label>
            </div>
            <div style={{ background: "rgba(8,119,184,0.04)" }} />
            <div />
          </div>
          {g.rows.map((row) => (
            <div key={row.label} className={`grid ${cols} transition-colors hover:bg-[color:var(--paper)]`} style={{ borderBottom: "1px solid var(--paper-line)" }}>
              <div className="px-4 py-3.5 text-[13px] leading-[1.45] text-ink md:px-6 md:text-[14px]">{row.label}</div>
              <div className="flex items-center justify-center px-2 py-3.5 text-center md:px-6" style={{ background: "rgba(8,119,184,0.04)" }}>
                <Indicator v={row.leadkaun} />
              </div>
              <div className="flex items-center justify-center px-2 py-3.5 text-center md:px-6">
                <Indicator v={row.competitor} />
              </div>
            </div>
          ))}
        </div>
      ))}

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-4 md:px-6">
        <span className="inline-flex items-center gap-2"><Yes /><span className="text-[12px] text-ink-muted">Built in</span></span>
        <span className="inline-flex items-center gap-2"><No /><span className="text-[12px] text-ink-muted">Not available</span></span>
        <span className="inline-flex items-center gap-2"><Minus className="h-4 w-4 text-ink-muted" strokeWidth={2} /><span className="text-[12px] text-ink-muted">Partial / workaround</span></span>
      </div>
    </div>
  )
}

/* --- Total cost ----------------------------------------------------------- */

function CostTable({ short, cost, complementary }: { short: string; cost: NonNullable<CompareProps["cost"]>; complementary?: boolean }) {
  const usd = cost.currency === "USD"
  const compAt = (reps: number): string => {
    if (cost.quoteOnly) return "On request"
    if (cost.flat != null) return inr(usd ? cost.flat * FX : cost.flat)
    if (cost.perSeat != null) return inr((usd ? cost.perSeat * FX : cost.perSeat) * reps)
    return "—"
  }
  const compNum = (reps: number): number | null => {
    if (cost.quoteOnly) return null
    if (cost.flat != null) return usd ? cost.flat * FX : cost.flat
    if (cost.perSeat != null) return (usd ? cost.perSeat * FX : cost.perSeat) * reps
    return null
  }

  return (
    <div className="rounded-2xl bg-white" style={{ border: "1px solid var(--paper-line)" }}>
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.9fr)]" style={{ borderBottom: "1px solid var(--paper-line-2)" }}>
        <div className="px-4 py-3.5 md:px-6"><Label>Team size</Label></div>
        <div className="px-2 py-3.5 text-right md:px-6" style={{ background: "rgba(8,119,184,0.04)" }}><Label tone="sky">Leadkaun</Label></div>
        <div className="px-2 py-3.5 text-right md:px-6"><Label>{short}</Label></div>
        <div className="px-2 py-3.5 text-right md:px-6"><Label>{complementary ? "Comparable?" : "Leadkaun is"}</Label></div>
      </div>

      {TEAM_SIZES.map((reps) => {
        const lk = lkCost(reps)
        const c = compNum(reps)
        const diff = c == null ? null : c - lk.price
        return (
          <div key={reps} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.9fr)] items-center" style={{ borderBottom: "1px solid var(--paper-line)" }}>
            <div className="px-4 py-4 md:px-6">
              <p className="text-[14px] font-semibold text-ink">{reps} reps</p>
              <p className="ledger-num mt-0.5 text-[10px] uppercase tracking-[0.14em] text-ink-muted">{lk.name} tier</p>
            </div>
            <div className="px-2 py-4 text-right md:px-6" style={{ background: "rgba(8,119,184,0.04)" }}>
              <p className="ledger-num text-[15px] font-semibold text-ink tabular md:text-[17px]">{inr(lk.price)}</p>
              <p className="ledger-num text-[10px] text-ink-muted">/mo</p>
            </div>
            <div className="px-2 py-4 text-right md:px-6">
              <p className="ledger-num text-[15px] font-semibold text-ink-soft tabular md:text-[17px]">{compAt(reps)}</p>
              {!cost.quoteOnly && <p className="ledger-num text-[10px] text-ink-muted">/mo</p>}
            </div>
            <div className="px-2 py-4 text-right md:px-6">
              {complementary ? (
                <span className="ledger-num text-[12px] text-ink-muted">Different job</span>
              ) : diff == null ? (
                <span className="ledger-num text-[12px] text-ink-muted">n/a</span>
              ) : (
                <span
                  className="ledger-num text-[13px] font-semibold tabular md:text-[14px]"
                  style={{ color: diff > 0 ? "#0877B8" : "#B45309" }}
                >
                  {diff === 0 ? "level" : `${inr(Math.abs(diff))} ${diff > 0 ? "cheaper" : "dearer"}`}
                </span>
              )}
            </div>
          </div>
        )
      })}

      <div className="space-y-1.5 px-4 py-4 md:px-6">
        {complementary && (
          <p className="text-[12px] leading-[1.5] text-ink-muted">
            These two do different jobs and most teams run both, so there is no cheaper/dearer verdict to give. The columns are here for budgeting the pair, not for picking a winner.
          </p>
        )}
        <p className="text-[12px] leading-[1.5] text-ink-muted">
          Leadkaun bills flat per account, so the figure is a tier lookup, not a multiplication. Seat caps: Starter 10, Growth 30, Scale 75.
        </p>
        {usd && (
          <p className="text-[12px] leading-[1.5] text-ink-muted">
            {short} charges in USD; converted at ₹{FX} = $1 so both columns are in rupees. Your card rate and FX markup will differ.
          </p>
        )}
        {cost.plus && <p className="text-[12px] leading-[1.5] text-ink-muted">Excludes {cost.plus}, which most teams on {short} end up paying.</p>}
        {cost.quoteOnly && <p className="text-[12px] leading-[1.5] text-ink-muted">{short} publishes no pricing, so there is nothing honest to put in that column.</p>}
      </div>
    </div>
  )
}

/* --- Closing CTA ----------------------------------------------------------
   The shared CTABanner is a centred glass card with a gradient warm button.
   That reads as a landing page, which is the one voice a review must not end
   in — so /compare closes on the same spine as the rest of the page: rules,
   left-aligned type, one primary action. The shared banner is untouched. */

function CompareCTA({ short }: { short: string }) {
  return (
    <SectionGround variant="cream" size="lg">
      <Container>
        <Reveal className="grid gap-y-8 border-y py-12 md:grid-cols-[minmax(0,168px)_minmax(0,1fr)] md:gap-x-10 md:py-14" style={{ borderColor: "var(--paper-line-2)" }}>
          <Label className="md:pt-2">Ready when you are</Label>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-x-16">
            <div>
              <h2 className="max-w-[20ch] text-[30px] font-semibold leading-[1.08] tracking-[-0.03em] text-ink md:text-[40px]">
                Run it alongside {short} for two weeks.
              </h2>
              <p className="mt-4 max-w-[52ch] text-[15px] leading-[1.6] text-ink-soft md:text-[16px]">
                Import a CSV, run both in parallel, and measure ₹ recovered. Decide at day 60 with numbers instead of a pitch.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-x-6 gap-y-3 lg:pb-1">
              <a
                href={APP_URLS.register}
                className="btn-gloss-primary inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-[15px] font-semibold"
                style={{ color: "#FFFFFF" }}
              >
                Start free <ArrowRight className="h-4 w-4" />
              </a>
              <Link href="/pricing" className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-sky-700 hover:text-sky-600">
                See pricing <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </Reveal>
        <p className="ledger-num mt-6 text-[10px] uppercase tracking-[0.16em] text-ink-muted md:ml-[208px]">
          Free forever · 1 user · 100 leads · No card
        </p>
      </Container>
    </SectionGround>
  )
}

/* --- Page ----------------------------------------------------------------- */

export function ComparePageLayout(p: CompareProps) {
  const short = p.competitorShort ?? p.competitor
  const verdictLine = p.verdictLine ?? p.tldr

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript([
        breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "Compare", url: "/compare" }, { name: `Leadkaun vs ${p.competitor}` }]),
        faqPageSchema(p.faqs),
      ]) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        <Masthead
          short={short}
          verdictLine={verdictLine}
          reviewedOn={p.reviewedOn}
          glance={p.glance}
        />

        <JumpNav />

        {/* 01 — THE READ. Everything below hangs off one label gutter, so the
            overview, the prose and the two-up blocks share a single left edge. */}
        <SectionGround id="read" variant="pure" size="lg" className="scroll-mt-[128px]">
          <Container>
            <SectionHead number="01" label="The read" title={`What ${short} is, and where it stops.`} />

            {/* QuickAnswer centres itself by default, which orphans it inside a
                left-aligned section — pin it to the spine instead. */}
            <LedgerBlock label="Overview" first>
              <div className="[&>[data-quick-answer]]:!mx-0 [&>[data-quick-answer]]:!max-w-none">
                <QuickAnswer question={`Leadkaun vs ${p.competitor}: which is better?`} answer={p.tldr} />
              </div>
            </LedgerBlock>

            <LedgerBlock label="Positioning" delay={0.06}>
              <p className="max-w-[62ch] text-[16px] leading-[1.7] text-ink-soft md:text-[17px]">{p.positioning}</p>
            </LedgerBlock>

            <LedgerBlock label="The trade-off" delay={0.08}>
              <div className="grid gap-10 sm:grid-cols-2 sm:gap-12">
                <div>
                  <Label tone="mint">Where {short} is strong</Label>
                  <ul className="mt-4 space-y-3">
                    {p.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[14px] leading-[1.5] text-ink-soft md:text-[15px]">
                        <span className="mt-0.5"><Yes /></span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <Label tone="warm">Where it falls short here</Label>
                  <ul className="mt-4 space-y-3">
                    {p.weaknesses.map((s, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[14px] leading-[1.5] text-ink-soft md:text-[15px]">
                        <span className="mt-0.5"><No /></span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </LedgerBlock>

            {/* Decision criteria — the part a shopper actually needs */}
            {(p.chooseCompetitor?.length || p.chooseLeadkaun?.length) && (
              <LedgerBlock label="Decision" delay={0.1}>
                <div className="grid gap-10 sm:grid-cols-2 sm:gap-12">
                  <div className="sm:pl-5" style={{ boxShadow: "inset 2px 0 0 var(--paper-line-2)" }}>
                    <Label>Choose {short} if</Label>
                    <ul className="mt-4 space-y-3.5">
                      {(p.chooseCompetitor ?? []).map((s, i) => (
                        <li key={i} className="flex items-start gap-3 text-[15px] leading-[1.55] text-ink">
                          <span className="ledger-num mt-0.5 shrink-0 text-[11px] text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="sm:pl-5" style={{ boxShadow: "inset 2px 0 0 #0877B8" }}>
                    <Label tone="sky">Choose Leadkaun if</Label>
                    <ul className="mt-4 space-y-3.5">
                      {(p.chooseLeadkaun ?? []).map((s, i) => (
                        <li key={i} className="flex items-start gap-3 text-[15px] leading-[1.55] text-ink">
                          <span className="ledger-num mt-0.5 shrink-0 text-[11px] text-sky-700">{String(i + 1).padStart(2, "0")}</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </LedgerBlock>
            )}
          </Container>
        </SectionGround>

        {/* 02 — FEATURE MATRIX */}
        {/* !overflow-visible: SectionGround clips by default, which silently
            disables the matrix's sticky column header. */}
        <SectionGround id="matrix" variant="cream" size="lg" className="scroll-mt-[128px] !overflow-visible">
          <Container>
            <SectionHead
              number="02"
              label="Feature matrix"
              title="Capability by capability."
              sub={`Grouped by what the capability is for. Where something sits behind a higher ${short} tier, the cell says so instead of crediting the product as a whole.`}
            />
            <Reveal delay={0.06}>
              <FeatureMatrix groups={p.features} short={short} />
            </Reveal>
          </Container>
        </SectionGround>

        {/* 03 — HONEST VERDICT */}
        {p.verdict && (
          <SectionGround id="verdict" variant="pure" size="lg" className="scroll-mt-[128px]">
            <Container>
              <SectionHead number="03" label="The honest verdict" title="Where each one genuinely wins." />

              <LedgerBlock label="Both sides" first>
                <div className="grid gap-10 sm:grid-cols-2 sm:gap-12">
                  <div className="sm:pl-5" style={{ boxShadow: "inset 2px 0 0 var(--paper-line-2)" }}>
                    <Label>Where {short} wins</Label>
                    <p className="mt-4 text-[15px] leading-[1.7] text-ink-soft">{p.verdict.competitorWins}</p>
                  </div>
                  <div className="sm:pl-5" style={{ boxShadow: "inset 2px 0 0 #0877B8" }}>
                    <Label tone="sky">Where Leadkaun wins</Label>
                    <p className="mt-4 text-[15px] leading-[1.7] text-ink-soft">{p.verdict.leadkaunWins}</p>
                  </div>
                </div>
              </LedgerBlock>

              <LedgerBlock label="Bottom line" delay={0.08}>
                <p className="max-w-[46ch] text-[20px] leading-[1.5] tracking-[-0.015em] text-ink md:text-[24px]">
                  {p.verdict.bottomLine}
                </p>
              </LedgerBlock>
            </Container>
          </SectionGround>
        )}

        {/* 04 — TOTAL COST */}
        <SectionGround id="cost" variant="cream" size="lg" className="scroll-mt-[128px]">
          <Container>
            <SectionHead
              number="04"
              label="Total cost"
              tone="warm"
              title={p.complementary ? "What the pair costs as the team grows." : "What it costs as the team grows."}
              sub={p.complementary
                ? `${short} and Leadkaun are bought together, not instead of each other, so this is what each side costs at three team sizes — not a race.`
                : "Per-seat pricing is cheap at five reps and expensive at fifty. This is the same list price at three team sizes, with nothing converted to flatter us."}
            />

            <Reveal delay={0.06} className="grid gap-px overflow-hidden rounded-2xl md:grid-cols-2" style={{ background: "var(--paper-line)" }}>
              <div className="bg-white p-7 md:p-9" style={{ boxShadow: "inset 3px 0 0 #0877B8" }}>
                <Label tone="sky">Leadkaun {p.pricing.leadkaun.tier}</Label>
                <p className="ledger-num mt-4 text-[34px] font-semibold tracking-[-0.02em] text-ink tabular md:text-[40px]">{p.pricing.leadkaun.price}</p>
                {p.pricing.leadkaun.note && <p className="mt-2 text-[13px] leading-[1.5] text-ink-soft">{p.pricing.leadkaun.note}</p>}
              </div>
              <div className="bg-white p-7 md:p-9">
                <Label>{short} {p.pricing.competitor.tier}</Label>
                <p className="ledger-num mt-4 text-[34px] font-semibold tracking-[-0.02em] text-ink-soft tabular md:text-[40px]">{p.pricing.competitor.price}</p>
                {p.pricing.competitor.note && <p className="mt-2 text-[13px] leading-[1.5] text-ink-soft">{p.pricing.competitor.note}</p>}
              </div>
            </Reveal>

            {p.cost && (
              <Reveal delay={0.1} className="mt-6">
                <CostTable short={short} cost={p.cost} complementary={p.complementary} />
              </Reveal>
            )}

            <Reveal delay={0.12} className="mt-6">
              <Link href="/tools/crm-cost-calculator" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-sky-700 transition-colors hover:text-sky-600">
                Run your own numbers in the CRM cost calculator <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Reveal>
          </Container>
        </SectionGround>

        {/* 05 — SWITCHING */}
        <SectionGround id="switching" variant="pure" size="lg" className="scroll-mt-[128px]">
          <Container>
            <SectionHead
              number="05"
              label={p.switchingLabel ?? "Switching guide"}
              title={p.switchingHeading ?? "How teams switch cleanly."}
            />
            <Reveal delay={0.06}>
              <ol className="border-t" style={{ borderColor: "var(--paper-line-2)" }}>
                {p.switching.map((s, i) => (
                  <li
                    key={i}
                    className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-1 py-6 md:grid-cols-[minmax(0,168px)_minmax(0,300px)_1fr] md:gap-x-10 md:py-7"
                    style={{ borderBottom: "1px solid var(--paper-line)" }}
                  >
                    <span className="ledger-num text-[13px] font-semibold text-sky-700 tabular md:pt-0.5 md:text-[15px]">
                      Step {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-[17px] font-semibold leading-snug tracking-[-0.01em] text-ink md:text-[18px]">{s.title}</h3>
                    <p className="col-start-2 text-[14px] leading-[1.6] text-ink-soft md:col-start-3 md:text-[15px]">{s.body}</p>
                  </li>
                ))}
              </ol>
            </Reveal>
          </Container>
        </SectionGround>

        {/* 06 — FAQ */}
        <SectionGround id="faq" variant="cream" size="lg" className="scroll-mt-[128px]">
          <Container>
            <SectionHead number="06" label="FAQ" tone="warm" title={p.faqHeading ?? `Switching from ${short}.`} />
            <LedgerBlock label="Questions" first delay={0.06}>
              {/* Cap the measure — the content column is wider than comfortable
                  reading length for answer prose. */}
              <Faq items={p.faqs} className="!mx-0 !max-w-[68ch]" />
            </LedgerBlock>
          </Container>
        </SectionGround>

        {/* METHOD — a verdict without a published method is an opinion with a table around it */}
        <SectionGround variant="pure" size="md">
          <Container>
            <Reveal className="grid gap-10 border-t pt-10 md:grid-cols-[minmax(0,168px)_minmax(0,1fr)] md:gap-x-10" style={{ borderColor: "var(--paper-line-2)" }}>
              <div>
                <Label>How this comparison is made</Label>
                {p.reviewedOn && (
                  <p className="ledger-num mt-4 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
                    Reviewed {p.reviewedOn}
                  </p>
                )}
                {p.sources && p.sources.length > 0 && (
                  <div className="mt-6">
                    <Label>Sources</Label>
                    <ul className="mt-3 space-y-2">
                      {p.sources.map((s) => (
                        <li key={s.url}>
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noopener nofollow"
                            className="inline-flex items-start gap-1.5 text-[13px] leading-[1.5] text-sky-700 hover:text-sky-600"
                          >
                            {s.label}
                            <ExternalLink className="mt-0.5 h-3 w-3 shrink-0" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="space-y-4 text-[15px] leading-[1.7] text-ink-soft">
                <p>
                  We build one of the two products on this page, so read it accordingly. What we can offer instead of
                  neutrality is a stated method and a section that says where the other tool wins.
                </p>
                <p>
                  Capability claims come from each vendor&apos;s own documentation, and where a capability sits behind a
                  higher tier we say so rather than crediting the product as a whole. Pricing is read from the public
                  pricing page at the review date, in the currency each vendor actually charges; where we convert, the
                  rate is printed next to the table rather than buried. Claims about Leadkaun are checked against the
                  shipping code, see <Link href="/methodology" className="text-sky-700 underline underline-offset-2 hover:text-sky-600">our methodology</Link>.
                </p>
                <p>
                  Nobody pays for placement here, and none of these links is affiliate-compensated. Where we are the
                  wrong choice, the verdict section says so.
                </p>
              </div>
            </Reveal>
          </Container>
        </SectionGround>

        <CompareCTA short={short} />

        <Footer />
      </main>
    </>
  )
}
