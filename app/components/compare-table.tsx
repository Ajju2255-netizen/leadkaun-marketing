import { cn } from "@/lib/utils"
import { Check, X } from "lucide-react"

type Row = {
  /** what the competitor / CRM does */
  left: string
  /** what Leadkaun does */
  right: string
}

type Props = {
  /** header label for left column, e.g. "Your CRM does" */
  leftHeader?: string
  /** header label for right column, e.g. "Leadkaun does" */
  rightHeader?: string
  rows: Row[]
  className?: string
}

/**
 * Glass slab comparison ledger.
 * CRM column desaturated; Leadkaun column has subtle inner sky aura + mint checks.
 */
export function CompareTable({
  leftHeader = "Your CRM does",
  rightHeader = "Leadkaun does",
  rows,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-3xl glass-3 elevate-3 gloss-edge",
        className
      )}
    >
      {/* Header row — dual band */}
      <div className="grid grid-cols-2"
           style={{ borderBottom: "1px solid var(--hairline-strong)" }}>
        <div
          className="px-6 py-5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted md:px-8"
          style={{ borderRight: "1px solid var(--hairline-strong)" }}
        >
          {leftHeader}
        </div>
        <div
          className="relative flex items-center gap-2 px-6 py-5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-sky-700 md:px-8"
          style={{
            background: "linear-gradient(180deg, rgba(56,189,248,0.22) 0%, rgba(186,230,253,0.10) 100%)",
            boxShadow: "inset 0 2px 0 #0EA5E9",
          }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
          {rightHeader}
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y" style={{ borderColor: "var(--hairline)" }}>
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-2"
               style={{ borderColor: "var(--hairline)" }}>
            {/* Left — desaturated */}
            <div
              className="flex items-start gap-3 px-6 py-5 md:px-8"
              style={{ borderRight: "1px solid var(--hairline)" }}
            >
              <span
                className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                style={{ background: "rgba(15,23,42,0.06)" }}
              >
                <X className="h-3 w-3 text-ink-muted" strokeWidth={2.5} />
              </span>
              <span className="text-[14px] md:text-[15px] leading-[1.55] text-ink-soft line-through decoration-ink-faint/60 decoration-1">
                {r.left}
              </span>
            </div>
            {/* Right — Leadkaun */}
            <div
              className="relative flex items-start gap-3 px-6 py-5 md:px-8"
              style={{
                background:
                  "linear-gradient(90deg, rgba(56,189,248,0.14) 0%, rgba(186,230,253,0.05) 100%)",
                boxShadow: "inset 2px 0 0 rgba(14,165,233,0.35)",
              }}
            >
              <span
                className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                style={{
                  background: "linear-gradient(180deg, #6EE7B7 0%, #34D399 100%)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), 0 1px 3px rgba(16,185,129,0.30)",
                }}
              >
                <Check className="h-3 w-3 text-white" strokeWidth={3} />
              </span>
              <span className="text-[14px] md:text-[15px] leading-[1.55] font-medium text-ink">
                {r.right}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
