import { ReactNode } from "react"
import Link from "next/link"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { Eyebrow } from "@/app/components/eyebrow"
import { FloatingCard } from "@/app/components/floating-card"
import { PillarLink } from "@/app/components/pillar-link"

type Crumb = { label: string; href?: string }

type Props = {
  breadcrumb?: Crumb[]
  eyebrow?: ReactNode
  /** Extra small badges to render after eyebrow */
  badges?: ReactNode
  h1: ReactNode
  sub?: ReactNode
  /** Optional TL;DR style card under the headline */
  tldr?: { label: string; body: ReactNode; tone?: "sky" | "peach" }
  /** Optional CTA row */
  cta?: ReactNode
  /** Optional "part of the {pillar} guide" rail — completes the topical mesh */
  pillar?: { slug: string; title: string } | null
}

/**
 * Detail-page hero: glass mesh background + breadcrumb + eyebrow + headline + optional TL;DR card.
 * Used by blog/[slug], glossary/[term], questions/[slug], how-to/[slug], integrations/[slug],
 * resources/[slug], and the pSEO industry/city pages.
 */
export function DetailHero({ breadcrumb, eyebrow, badges, h1, sub, tldr, cta, pillar }: Props) {
  return (
    <SectionGround variant="pure" size="md" ambient={false} className="relative overflow-hidden pt-32 md:pt-40" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, var(--paper) 100%)" }}>


      <Container className="relative">
        <div className="mx-auto max-w-3xl">
          {breadcrumb && breadcrumb.length > 0 && (
            <nav
              aria-label="Breadcrumb"
              className="mb-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted"
            >
              {breadcrumb.map((c, i) => (
                <span key={i}>
                  {c.href ? (
                    <Link href={c.href} className="hover:text-sky-600 transition-colors">{c.label}</Link>
                  ) : (
                    <span>{c.label}</span>
                  )}
                  {i < breadcrumb.length - 1 && <span className="mx-2 text-ink-faint">/</span>}
                </span>
              ))}
            </nav>
          )}
          {(eyebrow || badges) && (
            <div className="flex flex-wrap items-center gap-3">
              {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
              {badges}
            </div>
          )}
          <h1 className="display-lg mt-6 text-[30px] text-ink md:text-[46px]">
            {h1}
          </h1>
          {sub && (
            <p className="mt-6 max-w-2xl text-[17px] leading-[1.6] text-ink-soft md:text-[19px]">
              {sub}
            </p>
          )}
          {tldr && (
            <FloatingCard
              tier={tldr.tone === "peach" ? "peach" : "sky"}
              depth="3"
              gloss
              className="mt-8 p-6 md:p-8"
            >
              <p className={`font-mono text-[10px] font-bold uppercase tracking-[0.16em] ${tldr.tone === "peach" ? "text-orange-500" : "text-sky-600"}`}>
                {tldr.label}
              </p>
              <p className="mt-3 text-[16px] leading-[1.65] text-ink md:text-[18px]">
                {tldr.body}
              </p>
            </FloatingCard>
          )}
          {cta && <div className="mt-8 flex flex-wrap items-center gap-3">{cta}</div>}
          {pillar && <div className="mt-7">{<PillarLink pillar={pillar} />}</div>}
        </div>
      </Container>
    </SectionGround>
  )
}
