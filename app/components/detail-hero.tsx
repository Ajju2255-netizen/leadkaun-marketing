import { ReactNode } from "react"
import Link from "next/link"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { PillarLink } from "@/app/components/pillar-link"

type Crumb = { label: string; href?: string }

type Props = {
  breadcrumb?: Crumb[]
  eyebrow?: ReactNode
  /** Extra small badges to render after eyebrow */
  badges?: ReactNode
  h1: ReactNode
  sub?: ReactNode
  /** Optional TL;DR block under the headline */
  tldr?: { label: string; body: ReactNode; tone?: "sky" | "peach" }
  /** Optional CTA row */
  cta?: ReactNode
  /** Optional "part of the {pillar} guide" rail — completes the topical mesh */
  pillar?: { slug: string; title: string } | null
}

/**
 * Detail-page header for the pSEO routes and the tools.
 *
 * Was a centred column on a gradient wash with the TL;DR in a glass card. Now
 * left-aligned on plain paper, with the TL;DR as a paper panel carrying a
 * coloured left rule — the same treatment the answer blocks use elsewhere.
 * Props are unchanged, so no route file needed editing.
 */
export function DetailHero({ breadcrumb, eyebrow, badges, h1, sub, tldr, cta, pillar }: Props) {
  const rule = tldr?.tone === "peach" ? "#EA580C" : "#0877B8"

  return (
    <SectionGround variant="pure" size="sm" ambient={false} className="pt-28 md:pt-32">
      <Container>
        <div className="max-w-[52rem]">
          {breadcrumb && breadcrumb.length > 0 && (
            <nav
              aria-label="Breadcrumb"
              className="ledger-num mb-8 text-[11px] uppercase tracking-[0.16em] text-ink-muted"
            >
              {breadcrumb.map((c, i) => (
                <span key={i}>
                  {c.href ? (
                    <Link href={c.href} className="transition-colors hover:text-sky-700">{c.label}</Link>
                  ) : (
                    <span>{c.label}</span>
                  )}
                  {i < breadcrumb.length - 1 && <span aria-hidden className="mx-2 text-ink-faint">/</span>}
                </span>
              ))}
            </nav>
          )}

          {(eyebrow || badges) && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {eyebrow && (
                <p className="ledger-num inline-flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-700">
                  {eyebrow}
                </p>
              )}
              {badges}
            </div>
          )}

          <h1 className="display-lg mt-6 text-[32px] text-ink md:text-[48px]">{h1}</h1>

          {sub && (
            <p className="mt-6 max-w-[68ch] text-[17px] leading-[1.6] text-ink-soft md:text-[19px]">{sub}</p>
          )}

          {tldr && (
            <div
              className="mt-9 max-w-[68ch] rounded-2xl bg-[color:var(--paper)] p-6 md:p-7"
              style={{ border: "1px solid var(--paper-line)", boxShadow: `inset 3px 0 0 ${rule}` }}
            >
              <p
                className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: rule }}
              >
                {tldr.label}
              </p>
              <p className="mt-3 text-[16px] leading-[1.65] text-ink md:text-[17px]">{tldr.body}</p>
            </div>
          )}

          {cta && <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">{cta}</div>}
          {pillar && <div className="mt-7">{<PillarLink pillar={pillar} />}</div>}
        </div>
      </Container>
    </SectionGround>
  )
}
