import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { NumberedTag } from "@/app/components/numbered-tag"
import { FloatingCard } from "@/app/components/floating-card"
import { Reveal } from "@/app/components/reveal"
import { SCORING_DIMENSIONS, GRADE_A_THRESHOLD } from "@/lib/pseo/shared-content"

/**
 * Shared "how the A–F grade is computed" methodology section for pSEO pages.
 * Static, honest, grounded in PLATFORM.md — adds real explanatory depth and a
 * ₹-at-risk note without any per-city content.
 */
export function MethodologyCard({
  number = "03",
  ground = "pure",
  contextLabel,
}: {
  number?: string
  ground?: "pure" | "cream" | "sky"
  contextLabel?: string
}) {
  return (
    <SectionGround variant={ground} size="lg">
      <Container>
        <Reveal className="mb-10 md:mb-14 max-w-3xl">
          <NumberedTag number={number} label="How the grade works" />
          <h2 className="mt-5 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[38px]">
            How every {contextLabel ? `${contextLabel} ` : ""}lead is graded A–F.
          </h2>
          <p className="mt-4 max-w-2xl text-[16px] leading-[1.55] text-ink-soft">
            No black box. Each grade is three transparent 0–100 scores combined against fixed, auditable thresholds — and stale leads surface as ₹ at risk before they go cold.
          </p>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-3 md:gap-6">
          {SCORING_DIMENSIONS.map((s) => (
            <Reveal key={s.tag} delay={0.04}>
              <FloatingCard tier="3" depth="3" gloss className="h-full p-7 md:p-8">
                <div className="flex items-baseline justify-between">
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-600">{s.tag}</p>
                  <p className="font-mono text-[12px] text-ink-muted tabular">{s.range}</p>
                </div>
                <p className="mt-4 text-[15px] leading-[1.6] text-ink-soft">{s.body}</p>
              </FloatingCard>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mx-auto mt-6 max-w-3xl">
          <FloatingCard tier="1" depth="1" gloss className="p-7 md:p-8">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-orange-500">The threshold</p>
            <p className="mt-3 text-[16px] leading-[1.6] text-ink">{GRADE_A_THRESHOLD}</p>
          </FloatingCard>
        </Reveal>
      </Container>
    </SectionGround>
  )
}
