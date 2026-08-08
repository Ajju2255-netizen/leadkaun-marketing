import { cn } from "@/lib/utils"
import { ComponentPropsWithoutRef, ReactNode } from "react"
import { GradientBlob } from "./gradient-blob"

type Variant = "pure" | "cream" | "sky" | "mist" | "mesh"
type Size = "sm" | "md" | "lg" | "xl"

type Props = ComponentPropsWithoutRef<"section"> & {
  variant?: Variant
  size?: Size
  /** Add the default per-variant ambient blobs. Default: true. */
  ambient?: boolean
  /** Render extra background layers (e.g. custom blobs) before children */
  background?: ReactNode
  children: ReactNode
}

const VARIANT_CLASS: Record<Variant, string> = {
  pure:  "bg-ground-pure",
  cream: "bg-ground-cream",
  sky:   "bg-ground-sky",
  mist:  "bg-ground-mist",
  mesh:  "bg-mesh-coastal",
}

const SIZE_CLASS: Record<Size, string> = {
  sm: "py-16 md:py-20",
  md: "py-20 md:py-28",
  lg: "py-24 md:py-32",
  xl: "py-28 md:py-40",
}

/**
 * One <section> wrapper owning the background tone.
 *
 * The tonal rhythm used to be cool→warm→cool with a coloured blob bleeding into
 * each section. It is now a single warm scale — white → paper → paper-2 — so the
 * alternation still reads but nothing competes with the content. `ambient` is
 * kept as a no-op prop because ~50 route files pass it.
 */
export function SectionGround({
  variant = "pure",
  size = "md",
  ambient = true,
  background,
  className,
  children,
  ...rest
}: Props) {
  return (
    <section
      className={cn(
        "relative overflow-hidden",
        VARIANT_CLASS[variant],
        SIZE_CLASS[size],
        className
      )}
      {...rest}
    >
                  {ambient && variant === "mist" && (
        <GradientBlob
          color="sky"
          size="lg"
          position="-bottom-40 -left-40"
          intensity={0.35}
        />
      )}
      {background}
      <div className="relative z-[1]">{children}</div>
    </section>
  )
}
