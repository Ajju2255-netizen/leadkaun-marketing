import Link from "next/link"

import { Container } from "@/app/components/container"
import { NumberedTag } from "@/app/components/numbered-tag"
import { Reveal } from "@/app/components/reveal"
import { SectionGround } from "@/app/components/section-ground"
import type { RelatedLink } from "@/lib/pseo/related"

/**
 * The commercial link block carried by every pSEO page.
 *
 * Rendered as full-width descriptive rows rather than the small "Related" pills
 * used for geo siblings — the anchor text is the point. These are the links
 * that move authority out of the city mesh and into /best, /learn, /features
 * and /pricing. See the COMMERCIAL LINK LAYER note in lib/pseo/related.ts.
 */
export function CommercialLinks({
  links,
  heading,
  number = "10",
}: {
  links: RelatedLink[]
  heading: string
  number?: string
}) {
  if (links.length === 0) return null
  return (
    <SectionGround variant="cream" size="md">
      <Container>
        <Reveal className="mb-8">
          <NumberedTag number={number} tone="warm" label="Lead management" />
          <h2 className="mt-5 max-w-3xl text-[24px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[28px]">
            {heading}
          </h2>
        </Reveal>
        <Reveal delay={0.08} className="grid gap-3 sm:grid-cols-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group flex items-center justify-between gap-5 rounded-2xl glass-2 gloss-edge p-5 transition-all lift aura-sky-hover"
            >
              <span className="text-[15px] font-medium leading-snug text-ink">{l.label}</span>
              <span className="font-mono text-[13px] text-ink-muted transition-colors group-hover:text-sky-600">→</span>
            </Link>
          ))}
        </Reveal>
      </Container>
    </SectionGround>
  )
}
