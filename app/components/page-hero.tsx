import { ReactNode } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { GradientBlob } from "@/app/components/gradient-blob"
import { Eyebrow } from "@/app/components/eyebrow"
import { GlossLink, GlossNavLink } from "@/app/components/gloss-button"
import { APP_URLS } from "@/lib/urls"

type Action =
  | { kind: "primary";   label: string; href: string;  external?: boolean }
  | { kind: "warm";      label: string; href: string;  external?: boolean }
  | { kind: "glass";     label: string; href: string;  external?: boolean }
  | { kind: "text";      label: string; href: string }   // simple inline link with arrow

type Props = {
  /** Eyebrow text shown above headline */
  eyebrow?: ReactNode
  /** Eyebrow style: dot (default) | none */
  eyebrowDot?: boolean
  /** The H1 — string or ReactNode for partial gradients */
  h1: ReactNode
  /** Sub-headline paragraph */
  sub?: ReactNode
  /** Primary action — defaults to "Start free trial" → APP_URLS.register */
  primary?: Action
  /** Secondary action */
  secondary?: Action
  /** Optional 4th-line meta text under CTAs */
  meta?: ReactNode
  /** Center align (default true). Set false for left-aligned editorial heroes */
  center?: boolean
  /** Skip default decorative blobs */
  bare?: boolean
}

/**
 * Shared hero for all non-homepage pages.
 * Coastal mesh ground + decorative blobs + glass eyebrow + gradient-friendly h1 + dual CTA.
 */
export function PageHero({
  eyebrow,
  eyebrowDot = true,
  h1,
  sub,
  primary = { kind: "primary", label: "Start free trial", href: APP_URLS.register, external: true },
  secondary,
  meta,
  center = true,
  bare = false,
}: Props) {
  return (
    <SectionGround variant="mesh" size="lg" ambient={false} className="pt-32 md:pt-40">
      {!bare && (
        <>
          <GradientBlob color="sky"   size="xl" position="-top-32 -left-40"     intensity={0.55} />
          <GradientBlob color="peach" size="lg" position="-bottom-20 -right-20" intensity={0.50} delay={3} />
        </>
      )}

      <Container className="relative">
        <div className={`mx-auto max-w-3xl ${center ? "text-center" : ""}`}>
          {eyebrow && (
            <div className={center ? "flex justify-center" : ""}>
              <Eyebrow dot={eyebrowDot}>{eyebrow}</Eyebrow>
            </div>
          )}
          <h1 className="mt-7 text-[40px] font-semibold leading-[1.05] tracking-[-0.04em] text-ink md:text-[64px]">
            {h1}
          </h1>
          {sub && (
            <p className={`mt-6 text-[17px] leading-[1.55] text-ink-soft md:text-[19px] ${center ? "max-w-2xl mx-auto" : "max-w-2xl"}`}>
              {sub}
            </p>
          )}
          {(primary || secondary) && (
            <div className={`mt-9 flex flex-wrap items-center gap-3 ${center ? "justify-center" : ""}`}>
              {primary && <ActionButton {...primary} />}
              {secondary && <ActionButton {...secondary} />}
            </div>
          )}
          {meta && (
            <p className="mt-7 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
              {meta}
            </p>
          )}
        </div>
      </Container>
    </SectionGround>
  )
}

function ActionButton(a: Action) {
  if (a.kind === "text") {
    return (
      <Link href={a.href} className="group inline-flex items-center gap-1.5 text-[15px] font-semibold text-sky-600 hover:text-sky-500">
        {a.label}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
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
    <GlossNavLink variant={a.kind} size="lg" href={a.href}>
      {a.label}
      {a.kind === "primary" && <span className="font-mono opacity-80">→</span>}
    </GlossNavLink>
  )
}
