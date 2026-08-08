import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { NumberedTag } from "@/app/components/numbered-tag"
import { Reveal } from "@/app/components/reveal"

export type SelfCheck = { lead: string; checks: string[] }

/**
 * "Check it on your own data" — the per-record replacement for the product mock
 * on glossary and question leaves.
 *
 * Every one is authored per record, and every one is true whether or not the
 * reader ever buys anything: they are checks you run on your own pipeline. That
 * is deliberate — a definition page that ends in a product pitch earns nothing,
 * and these pages are the thinnest on the site.
 */
export function SelfCheckBlock({
  number,
  selfCheck,
  ground = "cream",
}: {
  number: string
  selfCheck: SelfCheck
  ground?: "pure" | "cream" | "sky" | "mist"
}) {
  return (
    <SectionGround variant={ground} size="md">
      <Container>
        <Reveal className="max-w-3xl">
          <NumberedTag number={number} label="Check it yourself" />
          <h2 className="mt-5 text-[26px] font-semibold leading-[1.14] tracking-[-0.03em] text-ink md:text-[32px]">
            How to tell where you actually stand.
          </h2>
          <p className="mt-4 text-[16.5px] leading-[1.6] text-ink-soft">{selfCheck.lead}</p>
        </Reveal>

        <Reveal delay={0.08} className="mt-8 max-w-3xl">
          <ol style={{ borderTop: "1px solid var(--paper-line)" }}>
            {selfCheck.checks.map((c, i) => (
              <li
                key={c}
                className="grid grid-cols-[2.25rem_1fr] items-baseline gap-2 py-4"
                style={{ borderBottom: "1px solid var(--paper-line)" }}
              >
                <span className="ledger-num text-[13px] text-ink-muted tabular">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[15.5px] leading-[1.6] text-ink">{c}</span>
              </li>
            ))}
          </ol>
        </Reveal>
      </Container>
    </SectionGround>
  )
}
