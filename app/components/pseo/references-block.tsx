import Link from "next/link"
import { ArrowUpRight, BookOpen } from "lucide-react"

import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { NumberedTag } from "@/app/components/numbered-tag"
import { FloatingCard } from "@/app/components/floating-card"
import { Reveal } from "@/app/components/reveal"
import { REFERENCES } from "@/lib/pseo/shared-content"

/**
 * Shared "sources & further reading" block for pSEO pages. Mixes internal links
 * (research report, pillar) with named public benchmarks — adds citations /
 * E-E-A-T signal and strengthens the internal-link mesh. Static + honest.
 */
export function ReferencesBlock({
  number = "05",
  ground = "cream",
}: {
  number?: string
  ground?: "pure" | "cream" | "sky"
}) {
  return (
    <SectionGround variant={ground} size="md">
      <Container>
        <Reveal className="mx-auto mb-8 max-w-3xl">
          <NumberedTag number={number} tone="warm" label="Sources & further reading" />
          <h2 className="mt-5 text-[24px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[30px]">
            What this is based on.
          </h2>
        </Reveal>
        <Reveal delay={0.08} className="mx-auto max-w-3xl">
          <FloatingCard tier="2" depth="2" gloss className="divide-y overflow-hidden" style={{ borderColor: "var(--hairline)" }}>
            {REFERENCES.map((r, i) =>
              r.kind === "internal" ? (
                <Link key={i} href={r.href} className="group flex items-start gap-4 px-6 py-5 transition-colors hover:bg-sky-50/40">
                  <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" aria-hidden />
                  <span className="min-w-0">
                    <span className="flex items-center gap-1 text-[15px] font-semibold text-ink group-hover:text-sky-600 transition-colors">
                      {r.label}
                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-ink-muted transition-colors group-hover:text-sky-500" />
                    </span>
                    <span className="mt-1 block text-[13.5px] leading-[1.55] text-ink-soft">{r.note}</span>
                  </span>
                </Link>
              ) : (
                <div key={i} className="flex items-start gap-4 px-6 py-5">
                  <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center font-mono text-[11px] text-ink-muted" aria-hidden>↗</span>
                  <span className="min-w-0">
                    <span className="block text-[15px] font-semibold text-ink">{r.label}</span>
                    <span className="mt-1 block text-[13.5px] leading-[1.55] text-ink-soft">{r.note}</span>
                  </span>
                </div>
              ),
            )}
          </FloatingCard>
        </Reveal>
      </Container>
    </SectionGround>
  )
}
