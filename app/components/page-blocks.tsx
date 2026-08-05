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

/**
 * Block 10 — review timestamp. Cheapest E-E-A-T signal on the site and it was at
 * zero coverage outside /blog. `reviewedBy` matters more than `updated`: a named
 * reviewer on a commercial page beats a byline on a blog post.
 */
export function ReviewStamp({
  updated,
  reviewedBy,
  cadence,
}: {
  updated: string
  reviewedBy?: string
  cadence?: string
}) {
  return (
    <SectionGround variant="pure" size="sm">
      <Container>
        <Reveal className="mx-auto max-w-3xl">
          <div className="border-t pt-5 text-[13px] leading-relaxed text-ink-muted" style={{ borderColor: "var(--hairline)" }}>
          <p>
            <span className="font-medium text-ink-soft">Last reviewed {updated}</span>
            {reviewedBy ? <> by {reviewedBy}</> : null}
            {cadence ? <> · reviewed {cadence}</> : null}
          </p>
          <p className="mt-1">
            Product facts on this page are checked against the shipping product. See{" "}
            <Link href="/methodology" className="text-sky-600 underline-offset-2 hover:underline">how we verify claims</Link>.
          </p>
          </div>
        </Reveal>
      </Container>
    </SectionGround>
  )
}

/**
 * Block 11 — author/reviewer entity, in its light form.
 *
 * NOT a Person byline. lib/authors.ts carried a `Person` with no avatar, no url
 * and no sameAs, which is an E-E-A-T liability rather than an asset — it is the
 * pattern helpful-content guidance targets. Until a real, verifiable person
 * exists this renders an editorial (Organization) attribution.
 */
export function AuthorLine({ team = "the Leadkaun product team" }: { team?: string }) {
  return (
    <p className="text-[13px] text-ink-muted">
      Written and maintained by {team}, from the shipping product and its published scoring model.
    </p>
  )
}
