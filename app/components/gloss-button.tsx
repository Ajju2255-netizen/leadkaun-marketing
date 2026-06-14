import { cn } from "@/lib/utils"
import Link from "next/link"
import { ComponentPropsWithoutRef, ReactNode } from "react"

type Variant = "primary" | "warm" | "glass"
type Size = "sm" | "md" | "lg"

type CommonProps = {
  variant?: Variant
  size?: Size
  /** Diagonal gloss sweep on hover */
  shimmer?: boolean
  children: ReactNode
  className?: string
}

const VARIANT_CLASS: Record<Variant, string> = {
  primary: "btn-gloss-primary",
  warm:    "btn-gloss-warm",
  glass:   "btn-gloss-glass",
}

const SIZE_CLASS: Record<Size, string> = {
  sm: "h-9  px-4  text-[13px] rounded-lg",
  md: "h-11 px-6  text-[14.5px] rounded-xl",
  lg: "h-14 px-8  text-[16px] rounded-xl",
}

const baseCls =
  "relative inline-flex items-center justify-center font-medium tracking-tight " +
  "whitespace-nowrap select-none cursor-pointer no-underline " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-500 focus-visible:outline-offset-2"

/* ────────── <a> ────────── */

type AnchorProps = CommonProps &
  Omit<ComponentPropsWithoutRef<"a">, keyof CommonProps>

export function GlossLink({
  variant = "primary",
  size = "md",
  shimmer = true,
  className,
  children,
  ...rest
}: AnchorProps) {
  return (
    <a
      className={cn(
        baseCls,
        SIZE_CLASS[size],
        VARIANT_CLASS[variant],
        shimmer && "shimmer-on-hover",
        className
      )}
      {...rest}
    >
      <span className="relative z-[2] inline-flex items-center gap-2">{children}</span>
    </a>
  )
}

/* ────────── next/link ────────── */

type NextLinkProps = CommonProps & {
  href: string
} & Omit<React.ComponentProps<typeof Link>, "href" | "className" | "children">

export function GlossNavLink({
  variant = "primary",
  size = "md",
  shimmer = true,
  className,
  children,
  href,
  ...rest
}: NextLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        baseCls,
        SIZE_CLASS[size],
        VARIANT_CLASS[variant],
        shimmer && "shimmer-on-hover",
        className
      )}
      {...rest}
    >
      <span className="relative z-[2] inline-flex items-center gap-2">{children}</span>
    </Link>
  )
}

/* ────────── <button> ────────── */

type ButtonProps = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof CommonProps>

export function GlossButton({
  variant = "primary",
  size = "md",
  shimmer = true,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        baseCls,
        SIZE_CLASS[size],
        VARIANT_CLASS[variant],
        shimmer && "shimmer-on-hover",
        className
      )}
      {...rest}
    >
      <span className="relative z-[2] inline-flex items-center gap-2">{children}</span>
    </button>
  )
}
