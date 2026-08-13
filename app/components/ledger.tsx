import Link from "next/link"
import { Check, X, Minus, ArrowRight } from "lucide-react"
import type { CSSProperties, ReactNode } from "react"

import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { NumberedTag } from "@/app/components/numbered-tag"
import { Reveal } from "@/app/components/reveal"
import { APP_URLS } from "@/lib/urls"

/* ============================================================================
   THE REVIEW LEDGER — shared primitives
   ----------------------------------------------------------------------------
   /compare, /alternatives and /best are the same kind of page: a shopper who
   already knows we sell one of the things being ranked. They get one register
   rather than three marketing layouts.

   The system is a single alignment spine — a fixed label gutter plus one
   content column — hairline rules between blocks, mono labels, tabular
   figures, and no cards. Every page in the family uses these pieces, so the
   left edge is identical from the masthead to the closing CTA.
   ========================================================================== */

/** Width of the label gutter, and the gap after it. Content starts at 208px. */
export const SPINE = "md:grid-cols-[minmax(0,168px)_minmax(0,1fr)] md:gap-x-10"
/** Matching indent for elements that sit outside a spine grid. */
export const SPINE_INDENT = "md:ml-[208px]"

/* --- Atoms ---------------------------------------------------------------- */

export function Yes() {
  return (
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full" style={{ background: "#10B981" }}>
      <Check className="h-3 w-3 text-white" strokeWidth={3} />
    </span>
  )
}

export function No() {
  return (
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full" style={{ background: "rgba(15,23,42,0.06)" }}>
      <X className="h-3 w-3 text-ink-muted" strokeWidth={2.5} />
    </span>
  )
}

/** Partial / tier-gated — same footprint as Yes/No so columns stay on one axis. */
export function Minus2() {
  return (
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full" style={{ background: "rgba(234,88,12,0.10)" }}>
      <Minus className="h-3 w-3 text-orange-500" strokeWidth={3} />
    </span>
  )
}

export type Cell = boolean | string | "neutral"

export function Indicator({ v }: { v: Cell }) {
  if (v === true) return <Yes />
  if (v === false) return <No />
  if (v === "neutral") return <Minus className="h-4 w-4 text-ink-muted" strokeWidth={2} />
  return <span className="ledger-num text-[11px] font-semibold leading-tight text-ink-soft md:text-[12px]">{v}</span>
}

/** Mono, wide-tracked, quiet — the label voice used throughout the register. */
export function Label({ children, tone = "muted", className = "" }: {
  children: ReactNode
  tone?: "muted" | "sky" | "warm" | "mint"
  className?: string
}) {
  const color =
    tone === "sky" ? "text-sky-700" : tone === "warm" ? "text-orange-500" : tone === "mint" ? "text-emerald-600" : "text-ink-muted"
  return <p className={`ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] ${color} ${className}`}>{children}</p>
}

/**
 * The alignment spine: a label in a fixed left gutter plus content in one
 * column, so every block on the page shares a single left edge instead of
 * inventing its own. Rules sit between blocks, never around them.
 */
export function LedgerBlock({ label, children, delay = 0, first = false, tone = "muted" }: {
  label: string
  children: ReactNode
  delay?: number
  /** First block in a section — no top rule, tighter top margin. */
  first?: boolean
  tone?: "muted" | "sky" | "warm" | "mint"
}) {
  return (
    <Reveal
      delay={delay}
      className={first ? "" : "mt-10 border-t pt-10 md:mt-12 md:pt-12"}
      style={first ? undefined : { borderColor: "var(--paper-line)" }}
    >
      <div className={`grid gap-y-4 ${SPINE}`}>
        <Label tone={tone} className="md:pt-1">{label}</Label>
        <div>{children}</div>
      </div>
    </Reveal>
  )
}

export function SectionHead({ number, label, title, tone, sub }: {
  number: string
  label: string
  title: string
  tone?: "default" | "warm"
  sub?: string
}) {
  return (
    <Reveal className="mb-10 max-w-3xl md:mb-14">
      <NumberedTag number={number} label={label} tone={tone} />
      <h2 className="mt-5 text-[30px] font-semibold leading-[1.08] tracking-[-0.03em] text-ink md:text-[42px]">{title}</h2>
      {sub && <p className="mt-4 text-[16px] leading-[1.65] text-ink-soft">{sub}</p>}
    </Reveal>
  )
}

/* --- Masthead ------------------------------------------------------------- */

/**
 * The review header: a slug line stating what this is and when it was checked,
 * the headline, the verdict in one sentence, actions, then whatever spec sheet
 * or register the page wants to open with.
 */
export function LedgerMasthead({ meta, h1, lead, primaryLabel, secondary, children }: {
  /** Short mono facts, rendered slash-separated. */
  meta: string[]
  h1: ReactNode
  lead: ReactNode
  primaryLabel?: string
  secondary?: { label: string; href: string }
  children?: ReactNode
}) {
  return (
    <SectionGround variant="cream" size="sm" ambient={false} className="pt-28 md:pt-32">
      <Container>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {meta.map((m, i) => (
            <span key={m} className="flex items-center gap-3">
              {i > 0 && <span aria-hidden className="ledger-num text-[10px] text-ink-faint">/</span>}
              <Label tone={i === 0 ? "sky" : "muted"}>{m}</Label>
            </span>
          ))}
        </div>

        <h1 className="mt-6 max-w-[20ch] text-[40px] leading-[1.02] tracking-[-0.03em] text-ink md:text-[60px]">{h1}</h1>

        <div className="mt-6 max-w-3xl text-[17px] leading-[1.6] text-ink-soft md:text-[19px]">{lead}</div>

        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
          <a
            href={APP_URLS.register}
            className="btn-gloss-primary inline-flex items-center gap-2 rounded-xl px-5 py-3 text-[14px] font-semibold"
            style={{ color: "#FFFFFF" }}
          >
            {primaryLabel ?? "Start free trial"} <ArrowRight className="h-4 w-4" />
          </a>
          {secondary && (
            <Link href={secondary.href} className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-sky-700 hover:text-sky-600">
              {secondary.label} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {children}
      </Container>
    </SectionGround>
  )
}

/* --- Sticky jump nav ------------------------------------------------------ */

export function JumpNav({ items }: { items: { id: string; label: string }[] }) {
  return (
    <nav
      aria-label="On this page"
      className="sticky top-16 z-30 border-y"
      style={{ borderColor: "var(--paper-line)", background: "rgba(252,250,246,0.92)", backdropFilter: "saturate(180%) blur(8px)" }}
    >
      <Container className="!px-0 md:!px-8">
        <ul className="flex items-center gap-1 overflow-x-auto px-4 py-2.5 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((n) => (
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

/* --- Ranked register ------------------------------------------------------
   /alternatives and /best both rank a handful of tools. As cards they read as
   a pile of adverts; as a register with the rank in the gutter they read as a
   list somebody actually reasoned about. */

export type RankedRow = { label: string; value: string }

export function RankedEntry({ rank, name, tagline, ours, rows, href, hrefLabel, external }: {
  rank: number
  name: string
  tagline?: string
  ours?: boolean
  rows: RankedRow[]
  href?: string
  hrefLabel?: string
  external?: boolean
}) {
  const style: CSSProperties | undefined = ours ? { boxShadow: "inset 2px 0 0 #0877B8" } : undefined
  const title = href && !external
    ? <Link href={href} className="hover:text-sky-700">{name}</Link>
    : name

  return (
    <li className="border-t" style={{ borderColor: "var(--paper-line)" }}>
      <div className={`grid gap-y-4 py-8 md:py-10 ${SPINE}`}>
        <div className="flex items-center gap-3 md:block">
          <span className={`ledger-num text-[13px] font-semibold tabular md:text-[15px] ${ours ? "text-sky-700" : "text-ink-muted"}`}>
            {String(rank).padStart(2, "0")}
          </span>
          {ours && (
            <span className="ledger-num text-[9px] font-semibold uppercase tracking-[0.16em] text-sky-700 md:mt-2 md:block">
              Our pick
            </span>
          )}
        </div>

        <div className={ours ? "md:pl-5" : undefined} style={style}>
          <h3 className="text-[21px] font-semibold tracking-[-0.015em] text-ink md:text-[23px]">{title}</h3>
          {tagline && <p className="mt-1.5 max-w-[64ch] text-[15px] leading-[1.55] text-ink-soft">{tagline}</p>}

          <dl className="mt-5 grid gap-x-10 gap-y-3 sm:grid-cols-[minmax(0,120px)_minmax(0,1fr)]">
            {rows.map((r) => (
              <div key={r.label} className="contents">
                <dt><Label className="sm:pt-1">{r.label}</Label></dt>
                <dd className="max-w-[68ch] text-[14px] leading-[1.6] text-ink-soft md:text-[15px]">{r.value}</dd>
              </div>
            ))}
          </dl>

          {href && (
            <Link href={href} className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-sky-700 hover:text-sky-600">
              {hrefLabel ?? "Compare"} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>
    </li>
  )
}

/** Hub index register: one row per guide, hairline separated. */
export function IndexRegister({ items }: {
  items: { href: string; title: string; blurb: string; meta?: string }[]
}) {
  return (
    <ul className="border-t" style={{ borderColor: "var(--paper-line-2)" }}>
      {items.map((g) => (
        <li key={g.href} style={{ borderBottom: "1px solid var(--paper-line)" }}>
          <Link href={g.href} className={`group grid items-baseline gap-y-2 py-6 md:py-7 ${SPINE}`}>
            <Label className="md:pt-1.5">{g.meta ?? "Guide"}</Label>
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-[18px] font-semibold leading-snug tracking-[-0.01em] text-ink group-hover:text-sky-700 md:text-[20px]">
                  {g.title}
                </p>
                <p className="mt-1.5 line-clamp-2 max-w-[74ch] text-[14px] leading-[1.55] text-ink-soft md:text-[15px]">{g.blurb}</p>
              </div>
              <ArrowRight className="mt-1.5 h-4 w-4 shrink-0 text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:text-sky-700" />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}

/* --- Closing CTA ----------------------------------------------------------
   The shared CTABanner is a centred glass card with a gradient warm button,
   which reads as a landing page — the one voice a review must not end in. */

export function LedgerCTA({ headline, sub, note, primaryLabel, secondary }: {
  headline: string
  sub: string
  note?: string
  primaryLabel?: string
  secondary?: { label: string; href: string }
}) {
  return (
    <SectionGround variant="cream" size="lg">
      <Container>
        <Reveal className={`grid gap-y-8 border-y py-12 md:py-14 ${SPINE}`} style={{ borderColor: "var(--paper-line-2)" }}>
          <Label className="md:pt-2">Ready when you are</Label>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-x-16">
            <div>
              <h2 className="max-w-[20ch] text-[30px] font-semibold leading-[1.08] tracking-[-0.03em] text-ink md:text-[40px]">
                {headline}
              </h2>
              <p className="mt-4 max-w-[52ch] text-[15px] leading-[1.6] text-ink-soft md:text-[16px]">{sub}</p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-x-6 gap-y-3 lg:pb-1">
              <a
                href={APP_URLS.register}
                className="btn-gloss-primary inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-[15px] font-semibold"
                style={{ color: "#FFFFFF" }}
              >
                {primaryLabel ?? "Start free trial"} <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href={secondary?.href ?? "/pricing"}
                className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-sky-700 hover:text-sky-600"
              >
                {secondary?.label ?? "See pricing"} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </Reveal>
        <p className={`ledger-num mt-6 text-[10px] uppercase tracking-[0.16em] text-ink-muted ${SPINE_INDENT}`}>
          {note ?? "14-day trial · No credit card · Same-day setup"}
        </p>
      </Container>
    </SectionGround>
  )
}

/* --- Method block ---------------------------------------------------------
   A ranking without a published method is an opinion with numbers around it. */

export function MethodBlock({ label = "How this is made", reviewedOn, sources, children }: {
  label?: string
  reviewedOn?: string
  sources?: { label: string; url: string }[]
  children: ReactNode
}) {
  return (
    <SectionGround variant="pure" size="md">
      <Container>
        <Reveal className={`grid gap-10 border-t pt-10 ${SPINE}`} style={{ borderColor: "var(--paper-line-2)" }}>
          <div>
            <Label>{label}</Label>
            {reviewedOn && (
              <p className="ledger-num mt-4 text-[12px] uppercase tracking-[0.14em] text-ink-muted">Reviewed {reviewedOn}</p>
            )}
            {sources && sources.length > 0 && (
              <div className="mt-6">
                <Label>Sources</Label>
                <ul className="mt-3 space-y-2">
                  {sources.map((s) => (
                    <li key={s.url}>
                      <a href={s.url} target="_blank" rel="noopener nofollow" className="text-[13px] leading-[1.5] text-sky-700 hover:text-sky-600">
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="space-y-4 text-[15px] leading-[1.7] text-ink-soft">{children}</div>
        </Reveal>
      </Container>
    </SectionGround>
  )
}
