import { cn } from "@/lib/utils"
import { ComponentPropsWithoutRef } from "react"

type Props = ComponentPropsWithoutRef<"section"> & {
  /** soft grey section bg (alternation); subtle = light blue wash; brand = primary-coloured block */
  tone?: "default" | "soft" | "subtle" | "brand" | "ink"
  /** py-28 desktop (default), py-32 for marquee moments, py-24 for tight */
  size?: "sm" | "md" | "lg"
  /** add top border */
  divide?: boolean
}

export function Section({
  className,
  tone = "default",
  size = "md",
  divide = false,
  ...props
}: Props) {
  const toneCls =
    tone === "soft"    ? "bg-background-soft" :
    tone === "subtle"  ? "bg-primary-subtle" :
    tone === "brand"   ? "bg-primary text-primary-foreground" :
    tone === "ink"     ? "bg-foreground text-background" :
    "bg-background"

  const sizeCls =
    size === "sm" ? "py-16 md:py-20" :
    size === "lg" ? "py-24 md:py-32" :
    "py-20 md:py-28"

  return (
    <section
      className={cn(
        "relative",
        toneCls,
        sizeCls,
        divide && "border-t border-border",
        className
      )}
      {...props}
    />
  )
}
