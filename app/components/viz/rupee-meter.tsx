/**
 * RupeeMeter — bespoke "₹ at risk" gauge (Coastal Sunrise).
 * Big ₹ figure + a peach→orange progress track. Server-safe (presentational).
 */
export function RupeeMeter({
  amount = "₹4.2L",
  pct = 68,
  caption = "at risk this week",
  recoverable = "₹3.1L recoverable",
}: {
  amount?: string
  pct?: number
  caption?: string
  recoverable?: string
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-orange-500">₹ at risk</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">{caption}</p>
      </div>
      <p className="mt-2 font-mono text-[40px] font-semibold leading-none tracking-[-0.03em] tabular-nums text-ink md:text-[46px]">
        {amount}
      </p>
      {/* track */}
      <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-orange-100/70" style={{ boxShadow: "inset 0 1px 2px rgba(15,23,42,0.08)" }}>
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: "linear-gradient(90deg, #FDBA74 0%, #FB923C 60%, #F97316 100%)", boxShadow: "0 0 12px rgba(251,146,60,0.5)" }}
        />
      </div>
      <p className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-ink-soft">
        <span className="h-1.5 w-1.5 rounded-full bg-mint-500" />
        {recoverable}
      </p>
    </div>
  )
}
