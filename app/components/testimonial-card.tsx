import { cn } from "@/lib/utils"

type Accent = "sky" | "mint" | "peach"

type Props = {
  quote: string
  name: string
  role: string
  city?: string
  /** Headline outcome, e.g. "₹38L" — leads the card for results-driven proof. */
  stat?: string
  statLabel?: string
  accent?: Accent
  className?: string
}

const ACCENT: Record<Accent, { text: string; avatar: string; ring: string }> = {
  sky:   { text: "#0284C7", avatar: "linear-gradient(180deg,#BAE6FD,#7DD3FC)", ring: "rgba(14,165,233,0.22)" },
  mint:  { text: "#059669", avatar: "linear-gradient(180deg,#A7F3D0,#6EE7B7)", ring: "rgba(16,185,129,0.22)" },
  peach: { text: "#EA580C", avatar: "linear-gradient(180deg,#FED7AA,#FDBA74)", ring: "rgba(251,146,60,0.22)" },
}

function initials(name: string) {
  return name.split(/\s+/).map((p) => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase()
}

export function TestimonialCard({ quote, name, role, city, stat, statLabel, accent = "sky", className }: Props) {
  const a = ACCENT[accent]
  return (
    <figure
      className={cn(
        "relative flex h-full flex-col rounded-3xl border border-white/70 p-7 md:p-8",
        "glass-2 elevate-2 gloss-edge lift",
        className
      )}
    >
      {stat && (
        <div className="mb-5 flex items-baseline gap-2.5">
          <span className="font-mono text-[34px] font-semibold leading-none tracking-[-0.03em] tabular-nums" style={{ color: a.text }}>
            {stat}
          </span>
          {statLabel && <span className="text-[12.5px] font-medium leading-tight text-ink-soft">{statLabel}</span>}
        </div>
      )}

      <blockquote className="flex-1 text-[15.5px] leading-[1.6] text-ink-soft md:text-[16px]">
        &ldquo;{quote}&rdquo;
      </blockquote>

      <figcaption className="mt-6 flex items-center gap-3 pt-5" style={{ borderTop: "1px solid var(--hairline)" }}>
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-mono text-[12px] font-semibold"
          style={{ background: a.avatar, color: a.text, boxShadow: `inset 0 1px 0 rgba(255,255,255,0.85), 0 2px 6px ${a.ring}` }}
        >
          {initials(name)}
        </div>
        <div className="min-w-0">
          <p className="text-[14px] font-semibold leading-tight text-ink">{name}</p>
          <p className="mt-0.5 text-[12px] leading-tight text-ink-muted">
            {role}{city ? ` · ${city}` : ""}
          </p>
        </div>
      </figcaption>
    </figure>
  )
}
