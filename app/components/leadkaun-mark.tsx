import { useId } from "react"
import { cn } from "@/lib/utils"

type Props = {
  size?: number
  className?: string
  title?: string
  /** When true, the glyph renders in the brand colour on a transparent square (use on dark/solid blue backgrounds). */
  inverted?: boolean
  /** Adds a glossy sky gradient + inner top highlight to the rounded square. */
  gloss?: boolean
}

/**
 * Leadkaun brand mark — a rounded square with a monoline "A" glyph.
 * The "A" references the top grade in Leadkaun's A–F lead-grading system.
 */
export function LeadkaunMark({
  size = 20,
  className,
  title = "Leadkaun",
  inverted = false,
  gloss = false,
}: Props) {
  const reactId = useId()
  const id = `lk-mark-${reactId.replace(/[^a-zA-Z0-9-]/g, "")}`
  const fill = inverted ? "transparent" : (gloss ? `url(#${id}-grad)` : "var(--sky-500)")
  const strokeColor = inverted ? "var(--sky-500)" : "#FFFFFF"

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      role="img"
      aria-label={title}
      className={cn("shrink-0", className)}
    >
      <title>{title}</title>
      {gloss && !inverted && (
        <defs>
          <linearGradient id={`${id}-grad`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0EA5E9" />
          </linearGradient>
          <linearGradient id={`${id}-gloss`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="rgba(255,255,255,0.45)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
      )}
      <rect
        x="0"
        y="0"
        width="40"
        height="40"
        rx="8"
        ry="8"
        fill={fill}
        stroke={inverted ? "var(--sky-500)" : "none"}
        strokeWidth={inverted ? 2 : 0}
      />
      {gloss && !inverted && (
        <rect x="0" y="0" width="40" height="40" rx="8" ry="8" fill={`url(#${id}-gloss)`} />
      )}
      <path
        d="M12 31 L20 9 L28 31 M15.3 24 L24.7 24"
        stroke={strokeColor}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}
