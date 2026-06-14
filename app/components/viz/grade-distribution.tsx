/**
 * GradeDistribution — bespoke A–F lead-grade visual (Coastal Sunrise).
 * A stacked, glossy distribution bar + legend. Server-safe (presentational).
 * Used to *show* "every lead graded A–F" instead of describing it.
 */
type Seg = { grade: string; count: number; color: string }

const DEFAULT: Seg[] = [
  { grade: "A", count: 14, color: "#10B981" }, // mint
  { grade: "B", count: 23, color: "#0EA5E9" }, // sky
  { grade: "C", count: 19, color: "#FB923C" }, // orange-400
  { grade: "D", count: 11, color: "#F97316" }, // orange-500
  { grade: "E", count: 6,  color: "#EF4444" }, // red
  { grade: "F", count: 4,  color: "#94A3B8" }, // ink-muted
]

export function GradeDistribution({ segments = DEFAULT }: { segments?: Seg[] }) {
  const total = segments.reduce((s, x) => s + x.count, 0)
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Lead grades</p>
        <p className="font-mono text-[11px] font-semibold tabular-nums text-ink-soft">{total} leads</p>
      </div>

      {/* stacked bar */}
      <div className="mt-3 flex h-3.5 w-full overflow-hidden rounded-full" style={{ boxShadow: "inset 0 1px 2px rgba(15,23,42,0.10)" }}>
        {segments.map((s) => (
          <div
            key={s.grade}
            style={{ width: `${(s.count / total) * 100}%`, background: `linear-gradient(180deg, ${s.color}, ${s.color}cc)` }}
            title={`${s.grade}: ${s.count}`}
          />
        ))}
      </div>

      {/* legend */}
      <div className="mt-4 grid grid-cols-3 gap-x-4 gap-y-2.5 sm:grid-cols-6">
        {segments.map((s) => (
          <div key={s.grade} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
            <span className="font-mono text-[11px] font-semibold text-ink">{s.grade}</span>
            <span className="font-mono text-[11px] tabular-nums text-ink-muted">{s.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
