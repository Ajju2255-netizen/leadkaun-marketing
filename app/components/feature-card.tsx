import Link from "next/link"
import { LucideIcon, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
  icon: LucideIcon
  title: string
  description: string
  href?: string
  /** Alternates the glass tint depth — used to create a mosaic on grids */
  variant?: "default" | "soft"
  className?: string
}

/**
 * Glassy feature/module tile — floats on the cool-ground module grid.
 *  - sky-tinted icon pill with gloss
 *  - hover: lifts + sky aura intensifies
 */
export function FeatureCard({
  icon: Icon,
  title,
  description,
  href,
  variant = "default",
  className,
}: Props) {
  const inner = (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
             style={{
               background: "linear-gradient(180deg, #BAE6FD 0%, #7DD3FC 100%)",
               boxShadow: "inset 0 1px 0 rgba(255,255,255,0.85), 0 4px 12px rgba(14,165,233,0.22)",
             }}>
          <Icon className="h-[22px] w-[22px] text-sky-600" strokeWidth={1.75} />
        </div>
        {href && (
          <ArrowUpRight
            className="h-4 w-4 text-ink-muted transition-all group-hover:text-sky-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            strokeWidth={1.75}
          />
        )}
      </div>
      <div className="mt-6">
        <h3 className="text-[17px] font-semibold leading-tight tracking-[-0.01em] text-ink">
          {title}
        </h3>
        <p className="mt-2 text-[14px] leading-[1.6] text-ink-soft">
          {description}
        </p>
      </div>
    </>
  )

  const cls = cn(
    "group relative block rounded-2xl p-6 lift aura-sky-hover",
    variant === "soft" ? "glass-1 elevate-1" : "glass-2 elevate-2",
    "gloss-edge",
    className
  )

  if (href) return <Link href={href} className={cls}>{inner}</Link>
  return <div className={cls}>{inner}</div>
}
