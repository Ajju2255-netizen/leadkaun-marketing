import { cn } from "@/lib/utils"
import { Quote } from "lucide-react"

type Props = {
  quote: string
  name: string
  role: string
  city?: string
  className?: string
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function TestimonialCard({ quote, name, role, city, className }: Props) {
  return (
    <figure
      className={cn(
        "relative flex h-full flex-col rounded-2xl p-7 overflow-hidden",
        "glass-2 elevate-2 gloss-edge lift",
        className
      )}
    >
      {/* Translucent quote glyph flourish */}
      <Quote
        aria-hidden
        className="absolute -top-3 -right-3 h-32 w-32 text-peach-300 opacity-30 -rotate-12"
        strokeWidth={1}
        fill="currentColor"
      />

      <blockquote className="relative flex-1 text-[17px] leading-[1.6] text-ink">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <figcaption className="relative mt-6 flex items-center gap-3 pt-5"
                  style={{ borderTop: "1px solid var(--hairline)" }}>
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-mono text-[12px] font-semibold text-sky-600"
          style={{
            background: "linear-gradient(180deg, #BAE6FD 0%, #7DD3FC 100%)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.85), 0 2px 6px rgba(14,165,233,0.22)",
          }}
        >
          {initials(name)}
        </div>
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-ink leading-tight">{name}</p>
          <p className="mt-0.5 text-[12px] text-ink-muted leading-tight">
            {role}{city ? ` · ${city}` : ""}
          </p>
        </div>
      </figcaption>
    </figure>
  )
}
