import Link from "next/link"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"

type Props = {
  href: string
  label: string
  /** brief context e.g. "₹5–50L GCV" */
  meta?: string
  className?: string
}

export function IndustryTile({ href, label, meta, className }: Props) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex items-center justify-between gap-4 rounded-2xl px-5 py-5 lift",
        "glass-1 gloss-edge elevate-1",
        "hover:[background:linear-gradient(180deg,rgba(254,215,170,0.45)_0%,rgba(255,255,255,0.7)_100%)] hover:border-orange-400/45",
        "transition-[background,border-color,box-shadow] duration-200",
        className
      )}
    >
      <div className="min-w-0">
        <p className="text-[15px] font-semibold text-ink group-hover:text-orange-500 transition-colors">
          {label}
        </p>
        {meta && (
          <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-muted">
            {meta}
          </p>
        )}
      </div>
      <ArrowRight
        className="h-4 w-4 shrink-0 text-ink-muted transition-all group-hover:text-orange-500 group-hover:translate-x-0.5"
        strokeWidth={1.75}
      />
    </Link>
  )
}
