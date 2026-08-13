import { ReactNode } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { GlossLink } from "@/app/components/gloss-button"
import { APP_URLS } from "@/lib/urls"

type Action =
  | { kind: "primary";   label: string; href: string;  external?: boolean }
  | { kind: "warm";      label: string; href: string;  external?: boolean }
  | { kind: "glass";     label: string; href: string;  external?: boolean }
  | { kind: "text";      label: string; href: string }   // simple inline link with arrow

type Props = {
  /** Eyebrow text shown above headline */
  eyebrow?: ReactNode
  /** Kept for API compatibility — the eyebrow no longer renders a dot. */
  eyebrowDot?: boolean
  /** The H1 — string or ReactNode for partial accents */
  h1: ReactNode
  /** Sub-headline paragraph */
  sub?: ReactNode
  /** Primary action — defaults to "Start free trial" → APP_URLS.register */
  primary?: Action
  /** Secondary action */
  secondary?: Action
  /** Optional 4th-line meta text under CTAs */
  meta?: ReactNode
  /**
   * No-op. Heroes are left-aligned sitewide now; ~50 route files still pass
   * this, so it stays in the signature rather than forcing an edit to each.
   */
  center?: boolean
  /** Kept for API compatibility — the decorative blob was removed. */
  bare?: boolean
}

/**
 * Shared hero for non-homepage pages.
 *
 * Was a centred column on a gradient wash with a blurred blob behind it. Now
 * it matches the rest of the site: left-aligned on plain paper, a monospace
 * kicker, the display serif at scale, and one honest row of actions. Same
 * props, so no route file changed.
 */
export function PageHero({
  eyebrow,
  h1,
  sub,
  primary = { kind: "primary", label: "Start free trial", href: APP_URLS.register, external: true },
  secondary,
  meta,
}: Props) {
  return (
    <SectionGround variant="pure" size="sm" ambient={false} className="pt-28 md:pt-32">
      <Container>
        <div className="max-w-[52rem]">
          {eyebrow && (
            <p className="ledger-num flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-700">
              {eyebrow}
            </p>
          )}
          <h1 className="display-lg mt-6 text-[38px] text-ink md:text-[56px]">{h1}</h1>
          {sub && (
            <p className="mt-6 max-w-[68ch] text-[17px] leading-[1.6] text-ink-soft md:text-[19px]">{sub}</p>
          )}
          {(primary || secondary) && (
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              {primary && <ActionButton {...primary} />}
              {secondary && <ActionButton {...secondary} />}
            </div>
          )}
          {meta && (
            <div className="ledger-num mt-7 text-[11px] uppercase tracking-[0.14em] text-ink-muted">{meta}</div>
          )}
        </div>
      </Container>
    </SectionGround>
  )
}

function ActionButton(a: Action) {
  if (a.kind === "text" || a.kind === "glass") {
    return (
      <Link href={a.href} className="group inline-flex items-center gap-1.5 text-[14px] font-semibold text-sky-700 hover:text-sky-600">
        {a.label}
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </Link>
    )
  }
  if ("external" in a && a.external) {
    return (
      <GlossLink variant={a.kind} size="lg" href={a.href}>
        {a.label}
        {a.kind === "primary" && <span className="font-mono opacity-80">→</span>}
      </GlossLink>
    )
  }
  return (
    <GlossLink variant={a.kind} size="lg" href={a.href}>
      {a.label}
      {a.kind === "primary" && <span className="font-mono opacity-80">→</span>}
    </GlossLink>
  )
}
