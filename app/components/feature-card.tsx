import Link from "next/link"
import { LucideIcon, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

type Accent = "sky" | "mint" | "peach" | "cyan"

type Props = {
  icon: LucideIcon
  title: string
  description: string
  href?: string
  /** category label shown above the title, e.g. "SCORING" */
  tag?: string
  /** icon-pill / hover accent — breaks the monotony of a single-colour grid */
  accent?: Accent
  /** Alternates the glass tint depth — used to create a mosaic on grids */
  variant?: "default" | "soft"
  className?: string
}

const ACCENT: Record<Accent, { bg: string; icon: string; glow: string; hover: string; aura: string }> = {
  sky:   { bg: "linear-gradient(180deg,#BAE6FD,#7DD3FC)", icon: "#0284C7", glow: "rgba(14,165,233,0.22)", hover: "group-hover:text-sky-500",    aura: "rgba(56,189,248,0.16)" },
  mint:  { bg: "linear-gradient(180deg,#A7F3D0,#6EE7B7)", icon: "#059669", glow: "rgba(16,185,129,0.22)", hover: "group-hover:text-mint-500",   aura: "rgba(52,211,153,0.16)" },
  peach: { bg: "linear-gradient(180deg,#FED7AA,#FDBA74)", icon: "#EA580C", glow: "rgba(251,146,60,0.24)", hover: "group-hover:text-orange-500", aura: "rgba(251,146,60,0.16)" },
  cyan:  { bg: "linear-gradient(180deg,#A5F3FC,#67E8F9)", icon: "#0891B2", glow: "rgba(6,182,212,0.22)",  hover: "group-hover:text-cyan-500",   aura: "rgba(34,211,238,0.16)" },
}

/**
 * Glassy feature/module tile — floats on the cool-ground module grid.
 *  - accent-tinted icon pill with gloss (per-card colour breaks the grid monotony)
 *  - optional category tag for information scent
 *  - hover: lifts + accent aura blooms from the corner
 */
export function FeatureCard({
  icon: Icon,
  title,
  description,
  href,
  tag,
  accent = "sky",
  variant = "default",
  className,
}: Props) {
  const a = ACCENT[accent]
  const inner = (
    <>
      {/* accent aura — blooms on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: a.aura }}
      />
      <div className="relative flex items-start justify-between gap-4">
        <div
          className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          style={{ background: a.bg, boxShadow: `inset 0 1px 0 rgba(255,255,255,0.85), 0 4px 12px ${a.glow}` }}
        >
          <Icon className="h-[22px] w-[22px]" style={{ color: a.icon }} strokeWidth={1.75} />
        </div>
        {tag ? (
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
            {tag}
          </span>
        ) : href ? (
          <ArrowUpRight
            className={cn("h-4 w-4 text-ink-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5", a.hover)}
            strokeWidth={1.75}
          />
        ) : null}
      </div>
      <div className="relative mt-6">
        <div className="flex items-center gap-2">
          <h3 className="text-[17px] font-semibold leading-tight tracking-[-0.01em] text-ink">
            {title}
          </h3>
          {tag && href && (
            <ArrowUpRight
              className={cn("h-3.5 w-3.5 text-ink-faint transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5", a.hover)}
              strokeWidth={2}
            />
          )}
        </div>
        <p className="mt-2 text-[14px] leading-[1.6] text-ink-soft">
          {description}
        </p>
      </div>
    </>
  )

  const cls = cn(
    "group relative block overflow-hidden rounded-2xl p-6 lift",
    variant === "soft" ? "glass-1 elevate-1" : "glass-2 elevate-2",
    "gloss-edge",
    className
  )

  if (href) return <Link href={href} className={cls}>{inner}</Link>
  return <div className={cls}>{inner}</div>
}
