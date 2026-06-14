import { cn } from "@/lib/utils"

type Metric = {
  value: string
  label: string
  hint?: string
}

type Props = {
  items: Metric[]
  className?: string
}

/**
 * Floating glass tiles — 4 across desktop, 2 across mobile.
 * Each tile has a peach inner glow and lifts on hover.
 */
export function MetricStrip({ items, className }: Props) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5",
        className
      )}
    >
      {items.map((m, i) => (
        <div
          key={i}
          className="relative flex flex-col gap-2 p-6 md:p-7 rounded-2xl glass-2 elevate-2 gloss-edge lift aura-peach-hover overflow-hidden"
        >
          {/* Peach micro-glow inside the tile */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(253,186,116,0.30) 0%, transparent 70%)" }}
          />
          <div
            className="relative font-mono text-[34px] font-semibold leading-none tracking-[-0.025em] tabular md:text-[38px]"
            style={{ color: "var(--ink)" }}
          >
            {m.value}
          </div>
          <div className="relative text-[13px] font-semibold text-ink">{m.label}</div>
          {m.hint && (
            <div className="relative text-[12px] text-ink-muted leading-snug">{m.hint}</div>
          )}
        </div>
      ))}
    </div>
  )
}
