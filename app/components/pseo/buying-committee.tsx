import Link from "next/link"

import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { NumberedTag } from "@/app/components/numbered-tag"
import { Reveal } from "@/app/components/reveal"
import { buildCommittee, committeeOpening, subjectNoun } from "@/lib/pseo/committee"

/**
 * "Who signs off" — renders an industry's buying committee from the previously
 * unused `buyerRoles` field, linking each member to their own role page.
 *
 * Ruled register, no cards, to match the rest of the theme.
 */
export function BuyingCommittee({
  number,
  ground = "cream",
  subject,
  cityName,
  citySlug,
  buyerRoles,
  roles,
  seedKey,
  exclude,
}: {
  number: string
  ground?: "pure" | "cream" | "sky" | "mist"
  /** Industry name as stored, e.g. "BFSI". Lower-cased for prose unless it is an acronym. */
  subject: string
  cityName?: string
  /** When present, each member links to /for/[role]/[city]. */
  citySlug?: string
  buyerRoles: readonly string[]
  roles: readonly { slug: string; title: string; seniority: string }[]
  seedKey: string
  /** Role slug to drop — a role page must not list itself. */
  exclude?: string
}) {
  const noun = subjectNoun(subject)
  const members = buildCommittee(buyerRoles, roles, seedKey, 3, exclude)
  if (members.length === 0) return null

  return (
    <SectionGround variant={ground} size="md">
      <Container>
        <Reveal className="max-w-3xl">
          <NumberedTag number={number} tone="warm" label="Who signs off" />
          <h2 className="mt-5 text-[28px] font-semibold leading-[1.12] tracking-[-0.03em] text-ink md:text-[38px]">
            {cityName
              ? `Who decides, on a ${noun} lead in ${cityName}.`
              : `Who decides, on a ${noun} lead.`}
          </h2>
          <p className="mt-4 text-[16.5px] leading-[1.6] text-ink-soft">
            {committeeOpening(noun, cityName, seedKey)}
          </p>
        </Reveal>

        <Reveal delay={0.08} className="mt-10 max-w-3xl">
          <div style={{ borderTop: "1px solid var(--paper-line)" }}>
            {members.map((m) => (
              <div
                key={m.slug}
                className="grid gap-1.5 py-5 sm:grid-cols-[13rem_1fr] sm:gap-6"
                style={{ borderBottom: "1px solid var(--paper-line)" }}
              >
                <div>
                  {citySlug ? (
                    <Link
                      href={`/for/${m.slug}/${citySlug}`}
                      className="text-[15px] font-semibold text-ink underline-offset-4 hover:text-sky-700 hover:underline"
                    >
                      {m.title}
                    </Link>
                  ) : (
                    <p className="text-[15px] font-semibold text-ink">{m.title}</p>
                  )}
                  <p className="ledger-num mt-1 text-[10.5px] uppercase tracking-[0.18em] text-ink-muted">
                    {m.seniority}
                  </p>
                </div>
                <p className="text-[15px] leading-[1.6] text-ink-soft">{m.weighs}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.12} className="mt-6 max-w-3xl">
          <p className="text-[15px] leading-[1.6] text-ink-soft">
            This is why Fit is scored separately from Intent: how keen someone sounds and whether
            they are the person you can actually sell to are two different questions.{" "}
            <Link href="/methodology" className="font-medium text-sky-700 underline underline-offset-4">
              Both are published with their weights
            </Link>
            .
          </p>
        </Reveal>
      </Container>
    </SectionGround>
  )
}
