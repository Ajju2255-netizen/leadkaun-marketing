import { cn } from "@/lib/utils"

type Props = {
  children: React.ReactNode
  /** Animated sky pulse dot on the left */
  dot?: boolean
  /** "default" sky | "warm" peach */
  tone?: "default" | "warm"
  className?: string
}

/**
 * Glass pill shown above an H1 or as a section prefix.
 * e.g. "● India's Sales Behaviour OS"
 */
export function Eyebrow({ children, dot = true, tone = "default", className }: Props) {
  const accent = tone === "warm" ? "text-orange-500" : "text-sky-600"
  const dotBg  = tone === "warm" ? "bg-orange-400" : "bg-sky-500"
  const dotPulse = tone === "warm" ? "bg-orange-400/60" : "bg-sky-500/60"
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5",
        "glass-1 gloss-edge",
        "font-mono text-[11px] font-semibold uppercase tracking-[0.14em]",
        accent,
        className
      )}
    >
      {dot && (
        <span className="relative inline-flex h-1.5 w-1.5 items-center justify-center">
          <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", dotPulse)} />
          <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", dotBg)} />
        </span>
      )}
      <span>{children}</span>
    </div>
  )
}
