import { cn } from "@/lib/utils"

type Props = {
  headline?: string
  /** 6–8 styled-text "logo" placeholders. Real logos swap in later. */
  logos?: string[]
  className?: string
}

const DEFAULT_LOGOS = [
  "BuildRight",
  "Edvance",
  "FinTrust",
  "SproutLearn",
  "CoreSales",
  "Altura",
  "Kalyan Co.",
  "Nexora",
]

/**
 * Trust bar — grey small-caps text "logos" until real ones exist.
 * Semrush-style confidence builder below hero.
 */
export function TrustStrip({
  headline = "Trusted by 50+ Indian B2B sales teams",
  logos = DEFAULT_LOGOS,
  className,
}: Props) {
  return (
    <div className={cn("flex flex-col items-center gap-8", className)}>
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-foreground-muted">
        {headline}
      </p>
      <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5 md:gap-x-14">
        {logos.map((l) => (
          <li
            key={l}
            className="font-semibold text-[15px] tracking-[-0.01em] text-foreground-faint grayscale hover:text-foreground-muted transition-colors"
          >
            {l}
          </li>
        ))}
      </ul>
    </div>
  )
}
