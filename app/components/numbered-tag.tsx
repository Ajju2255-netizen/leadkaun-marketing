import { cn } from "@/lib/utils"

type Props = {
  /** e.g. "01" */
  number: string
  /** e.g. "The Product" */
  label: string
  /** "default" = sky text, "warm" = orange text */
  tone?: "default" | "warm"
  className?: string
}

/**
 * Section-leading marker:  01 · THE PRODUCT
 *
 * Was a glass chip with a blur and a gloss sweep. Now a plain monospace line,
 * matching the ledger eyebrows the homepage uses — the marker should read as a
 * row number in a register, not as a floating UI pill. Same props, so ~50 route
 * files needed no changes.
 */
export function NumberedTag({ number, label, tone = "default", className }: Props) {
  const accent = tone === "warm" ? "text-orange-500" : "text-sky-700"
  return (
    <p
      className={cn(
        "ledger-num inline-flex items-baseline gap-2 text-[11px] font-semibold uppercase tracking-[0.2em]",
        accent,
        className
      )}
    >
      <span className="tabular">{number}</span>
      <span aria-hidden className="opacity-50">·</span>
      <span>{label}</span>
    </p>
  )
}
