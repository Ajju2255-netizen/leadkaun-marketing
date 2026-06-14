import { cn } from "@/lib/utils"
import { ComponentPropsWithoutRef, ElementType, ReactNode } from "react"

type Tier = "1" | "2" | "3" | "sky" | "peach"
type Depth = "1" | "2" | "3"
type Aura = "none" | "sky" | "peach"

type Props<T extends ElementType = "div"> = {
  as?: T
  tier?: Tier
  depth?: Depth
  /** Color of the hover-intensified shadow aura */
  aura?: Aura
  /** Animates lift on hover */
  interactive?: boolean
  /** Adds the gloss specular edge */
  gloss?: boolean
  radius?: "md" | "lg" | "xl" | "2xl" | "3xl"
  className?: string
  children: ReactNode
} & Omit<ComponentPropsWithoutRef<T>, "className" | "children">

const TIER_CLASS: Record<Tier, string> = {
  "1":     "glass-1",
  "2":     "glass-2",
  "3":     "glass-3",
  "sky":   "glass-sky",
  "peach": "glass-peach",
}

const DEPTH_CLASS: Record<Depth, string> = {
  "1": "elevate-1",
  "2": "elevate-2",
  "3": "elevate-3",
}

const AURA_CLASS: Record<Aura, string> = {
  none:  "",
  sky:   "aura-sky-hover",
  peach: "aura-peach-hover",
}

const RADIUS_CLASS = {
  md:   "rounded-md",
  lg:   "rounded-lg",
  xl:   "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
} as const

/**
 * A glass card with elevation, optional hover lift + aura.
 * Used for module tiles, problem cards, testimonial cards, industry chips, etc.
 */
export function FloatingCard<T extends ElementType = "div">({
  as,
  tier = "2",
  depth = "2",
  aura = "none",
  interactive = false,
  gloss = false,
  radius = "2xl",
  className,
  children,
  ...rest
}: Props<T>) {
  const Tag = (as || "div") as ElementType
  return (
    <Tag
      className={cn(
        TIER_CLASS[tier],
        DEPTH_CLASS[depth],
        AURA_CLASS[aura],
        RADIUS_CLASS[radius],
        gloss && "gloss-edge",
        interactive && "lift cursor-pointer",
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  )
}
