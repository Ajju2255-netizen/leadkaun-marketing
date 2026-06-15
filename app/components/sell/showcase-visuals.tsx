"use client"

import { GradeDistribution } from "@/app/components/viz/grade-distribution"
import { RupeeMeter } from "@/app/components/viz/rupee-meter"

/* The heavy, purely-decorative product visuals. Rendered client-side only
   (loaded via showcase-visuals-lazy with ssr:false) so the Cloudflare Worker
   doesn't pay the SSR cost on every cold PSEO render. No SEO value here — the
   ranking content is the page's localized text, which stays server-rendered. */

const GRADE_BG: Record<string, string> = {
  A: "linear-gradient(180deg,#6EE7B7,#10B981)",
  B: "linear-gradient(180deg,#38BDF8,#0EA5E9)",
  C: "linear-gradient(180deg,#FDBA74,#FB923C)",
}

const DEMO_QUEUE = [
  { grade: "A", name: "Priya Sharma", company: "Sunrise Realty",  value: "42L", ago: "now" },
  { grade: "A", name: "Rahul Mehta",  company: "Apex Capital",    value: "28L", ago: "4m ago" },
  { grade: "B", name: "Anjali Rao",   company: "BrightEdu",       value: "9L",  ago: "1h ago" },
  { grade: "C", name: "Imran Khan",   company: "Metro Logistics", value: "3L",  ago: "3h ago" },
]

function QueuePanel() {
  return (
    <div className="relative rounded-[28px] glass-3 gloss-edge elevate-3 p-5 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Priority Queue · Today</p>
          <h3 className="mt-1.5 text-[18px] font-semibold tracking-[-0.02em] text-ink">Who to call next</h3>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full glass-1 gloss-edge px-2.5 py-1">
          <span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint-400 opacity-75" /><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-mint-500" /></span>
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-soft">8 hot</span>
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl glass-peach gloss-edge px-4 py-3">
        <span className="text-[12.5px] font-medium text-ink-soft">₹ at risk today</span>
        <span className="font-mono text-[19px] font-semibold tabular text-orange-500">₹4.2L</span>
      </div>

      <div className="mt-3.5 space-y-2.5">
        {DEMO_QUEUE.map((l, i) => (
          <div key={l.name} className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/65 gloss-edge px-3.5 py-2.5">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-mono text-[13px] font-bold text-white"
              style={{ background: GRADE_BG[l.grade], boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 3px 8px rgba(15,23,42,0.16)" }}
            >
              {l.grade}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13.5px] font-semibold leading-tight text-ink">{l.name}</p>
              <p className="truncate font-mono text-[11px] text-ink-muted">{l.company} · ₹{l.value}</p>
            </div>
            {i === 0 ? (
              <span className="shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold text-white" style={{ background: "linear-gradient(180deg,#38BDF8,#0EA5E9)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.45), 0 3px 10px rgba(14,165,233,0.32)" }}>
                Call now
              </span>
            ) : (
              <span className="shrink-0 font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-faint">{l.ago}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ShowcaseVisuals() {
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[0.96fr_1.04fr] lg:gap-8">
      <QueuePanel />
      <div className="flex flex-col gap-6">
        <div className="rounded-3xl glass-2 elevate-2 gloss-edge p-6 md:p-7">
          <GradeDistribution />
        </div>
        <div className="rounded-3xl glass-2 elevate-2 gloss-edge p-6 md:p-7">
          <RupeeMeter />
        </div>
      </div>
    </div>
  )
}
