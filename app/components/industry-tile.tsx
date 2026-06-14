import Link from "next/link"
import { cn } from "@/lib/utils"
import { ArrowRight, type LucideIcon } from "lucide-react"

type Props = {
  href: string
  label: string
  /** brief context e.g. "₹5–50L GCV" */
  meta?: string
  icon?: LucideIcon
  /** render as a solid sky "see all" call-to-action tile instead of a vertical */
  cta?: boolean
  className?: string
}

export function IndustryTile({ href, label, meta, icon: Icon, cta = false, className }: Props) {
  if (cta) {
    return (
      <Link
        href={href}
        className={cn(
          "group relative flex items-center justify-between gap-4 overflow-hidden rounded-2xl px-5 py-5 lift gloss-edge",
          "text-white",
          className
        )}
        style={{
          background: "linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35), 0 8px 22px -10px rgba(14,165,233,0.6)",
        }}
      >
        <div className="min-w-0">
          <p className="text-[15px] font-semibold">{label}</p>
          {meta && (
            <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.08em] text-white/75">
              {meta}
            </p>
          )}
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
      </Link>
    )
  }

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex items-center gap-3.5 rounded-2xl px-5 py-5 lift",
        "glass-1 gloss-edge elevate-1",
        "hover:[background:linear-gradient(180deg,rgba(254,215,170,0.45)_0%,rgba(255,255,255,0.7)_100%)] hover:border-orange-400/45",
        "transition-[background,border-color,box-shadow] duration-200",
        className
      )}
    >
      {Icon && (
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors"
          style={{ background: "linear-gradient(180deg,#FFEDD5,#FED7AA)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)" }}
        >
          <Icon className="h-[19px] w-[19px] text-orange-500" strokeWidth={1.75} />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-semibold text-ink transition-colors group-hover:text-orange-500">
          {label}
        </p>
        {meta && (
          <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-muted">
            {meta}
          </p>
        )}
      </div>
      <ArrowRight
        className="h-4 w-4 shrink-0 text-ink-faint transition-all group-hover:translate-x-0.5 group-hover:text-orange-500"
        strokeWidth={1.75}
      />
    </Link>
  )
}
