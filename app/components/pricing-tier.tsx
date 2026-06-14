import Link from "next/link"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

type Props = {
  name: string
  price: string
  /** unit label, e.g. "/rep/month" */
  priceUnit?: string
  description: string
  features: string[]
  ctaLabel: string
  ctaHref: string
  ctaVariant?: "default" | "outline"
  highlighted?: boolean
  highlightBadge?: string
  className?: string
}

export function PricingTier({
  name,
  price,
  priceUnit = "/rep/month",
  description,
  features,
  ctaLabel,
  ctaHref,
  ctaVariant = "outline",
  highlighted = false,
  highlightBadge = "Most popular",
  className,
}: Props) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-3xl p-8 lift",
        highlighted
          ? "glass-3 elevate-3 gloss-edge"
          : "glass-2 elevate-2 gloss-edge aura-sky-hover",
        className
      )}
      style={
        highlighted
          ? {
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.78), rgba(255,255,255,0.78)), linear-gradient(135deg, #FB923C 0%, #38BDF8 100%)",
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
              border: "1.5px solid transparent",
            }
          : undefined
      }
    >
      {highlighted && (
        <span
          className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center px-4 py-1 rounded-full font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white"
          style={{
            background: "linear-gradient(180deg, #FDBA74 0%, #FB923C 100%)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 4px 12px rgba(251,146,60,0.32)",
          }}
        >
          {highlightBadge}
        </span>
      )}

      <div className="mb-6">
        <h3 className="text-[18px] font-semibold text-ink">{name}</h3>
        <p className="mt-1.5 text-[14px] text-ink-soft leading-snug">{description}</p>
      </div>

      <div className="mb-6 flex items-baseline gap-2">
        <span className="font-mono text-[44px] font-medium tracking-[-0.03em] text-ink tabular">
          {price}
        </span>
        <span className="text-[13px] text-ink-muted">{priceUnit}</span>
      </div>

      <ul className="mb-8 flex flex-1 flex-col gap-3">
        {features.map((f) => (
          <li
            key={f}
            className="flex items-start gap-2.5 text-[14px] leading-[1.55] text-ink-soft"
          >
            <span
              className="mt-0.5 inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full"
              style={{
                background: "linear-gradient(180deg, #6EE7B7 0%, #34D399 100%)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), 0 1px 3px rgba(16,185,129,0.30)",
              }}
            >
              <Check className="h-3 w-3 text-white" strokeWidth={3} />
            </span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <Link
        href={ctaHref}
        className={cn(
          "inline-flex h-11 items-center justify-center rounded-xl px-6 text-[14px] font-medium shimmer-on-hover relative",
          ctaVariant === "default" || highlighted
            ? "btn-gloss-primary"
            : "btn-gloss-glass"
        )}
      >
        <span className="relative z-[2]">{ctaLabel}</span>
      </Link>
    </div>
  )
}
