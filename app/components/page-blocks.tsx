import Link from "next/link"

import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { Reveal } from "@/app/components/reveal"
import { GlossLink } from "@/app/components/gloss-button"
import { APP_URLS } from "@/lib/urls"

/**
 * The three blocks from Brain 09's 12-block skeleton that were missing SITEWIDE:
 * block 6 (mid CTA), block 10 (review timestamp) and block 11 (author entity).
 *
 * Kept together because they share one property — each is a small, honest signal
 * that costs one component and reaches every page type at once.
 */

/**
 * Block 6 — mid-page CTA. Deliberately quieter than CTABanner: a reader halfway
 * down a 1,500-word guide is still reading, so this is an offer, not a close.
 */
export function MidCta({
  lead,
  href = APP_URLS.register,
  label = "Start free",
  note = "Free tier, no card. Setup the same day.",
}: {
  lead: string
  href?: string
  label?: string
  note?: string
}) {
  return (
    <SectionGround variant="pure" size="sm">
      <Container>
        <Reveal className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl glass-1 gloss-edge p-6 sm:flex-row sm:items-center sm:justify-between md:p-7">
          <div className="min-w-0">
            <p className="text-[16px] font-medium leading-snug text-ink md:text-[17px]">{lead}</p>
            <p className="mt-1.5 text-[13px] text-ink-muted">{note}</p>
          </div>
          <GlossLink variant="primary" size="sm" href={href} className="shrink-0">
            {label}
            <span className="font-mono opacity-80">→</span>
          </GlossLink>
        </Reveal>
      </Container>
    </SectionGround>
  )
}

