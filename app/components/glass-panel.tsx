import { cn } from "@/lib/utils"
import { ComponentPropsWithoutRef, ElementType } from "react"

type GlassTier = "1" | "2" | "3" | "sky" | "peach"

type Props<T extends ElementType = "div"> = {
  as?: T
  tier?: GlassTier
  /** Adds the inner-top specular highlight */
  gloss?: boolean
  /** Rounded radius — defaults to 2xl */
  radius?: "md" | "lg" | "xl" | "2xl" | "3xl" | "full"
  className?: string
  children?: React.ReactNode
} & Omit<ComponentPropsWithoutRef<T>, "className" | "children">

const TIER_CLASS: Record<GlassTier, string> = {
  "1":     "glass-1",
  "2":     "glass-2",
  "3":     "glass-3",
  "sky":   "glass-sky",
  "peach": "glass-peach",
}

const RADIUS_CLASS = {
  md:   "rounded-md",
  lg:   "rounded-lg",
  xl:   "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
  full: "rounded-full",
} as const

export function GlassPanel<T extends ElementType = "div">({
  as,
  tier = "2",
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
        RADIUS_CLASS[radius],
        gloss && "gloss-edge",
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  )
}
