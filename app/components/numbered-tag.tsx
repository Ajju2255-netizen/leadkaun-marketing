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
 * Section-leading marker — renders as a glass chip:  [ 01 — THE PRODUCT ]
 */
export function NumberedTag({ number, label, tone = "default", className }: Props) {
  const accent = tone === "warm" ? "text-orange-500" : "text-sky-600"
  const dotBg  = tone === "warm" ? "bg-orange-400/40" : "bg-sky-400/40"
  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 rounded-full px-3.5 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] glass-1 gloss-edge",
        accent,
        className
      )}
    >
      <span className="tabular">{number}</span>
      <span className={cn("h-px w-5", dotBg)} />
      <span>{label}</span>
    </div>
  )
}
