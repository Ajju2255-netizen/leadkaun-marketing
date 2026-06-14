import { cn } from "@/lib/utils"
import { CSSProperties } from "react"

type Color = "sky" | "cyan" | "peach" | "orange" | "mint"
type Size = "sm" | "md" | "lg" | "xl"

type Props = {
  color: Color
  size?: Size
  /** Tailwind-style position classes (e.g., "top-0 left-0 -translate-x-1/4 -translate-y-1/4") */
  position?: string
  /** 0..1 — multiplied into the blob's opacity */
  intensity?: number
  /** Animation delay in seconds — for staggered drift */
  delay?: number
  className?: string
}

const COLOR_CLASS: Record<Color, string> = {
  sky:    "blob-sky",
  cyan:   "blob-cyan",
  peach:  "blob-peach",
  orange: "blob-orange",
  mint:   "blob-mint",
}

const SIZE_CLASS: Record<Size, string> = {
  sm: "blob-sm",
  md: "blob-md",
  lg: "blob-lg",
  xl: "blob-xl",
}

/**
 * Animated radial gradient blob, blurred. Pure-CSS, GPU-friendly.
 * Use inside a `relative` parent. Pointer-events-none, aria-hidden.
 */
export function GradientBlob({
  color,
  size = "lg",
  position = "top-0 left-0",
  intensity = 1,
  delay = 0,
  className,
}: Props) {
  const style: CSSProperties = {
    opacity: intensity,
    animationDelay: `${delay}s`,
  }
  return (
    <div
      aria-hidden
      className={cn(
        "blob",
        SIZE_CLASS[size],
        COLOR_CLASS[color],
        position,
        className
      )}
      style={style}
    />
  )
}
