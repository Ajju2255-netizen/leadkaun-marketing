"use client"

import { createContext, useContext, type Dispatch, type ReactNode } from "react"
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import type { DemoAction, DemoState, Grade } from "@/lib/demo-app"

/**
 * Shared widgets for the app demo, matched to the product at HEAD (d1e1f2c,
 * "Redesign product app UI to a flat, modern system").
 *
 * The house style there is: bordered white cards, flat tinted icon tiles, a
 * plain 24px page title with no icon tile, and 15px section headings. Anything
 * with a gradient tile, a 30px title or a glass surface is the pre-August
 * design and does not belong here.
 */

export const DemoCtx = createContext<{ state: DemoState; dispatch: Dispatch<DemoAction>; openLead: (id: string) => void } | null>(null)

export function useDemo() {
  const ctx = useContext(DemoCtx)
  if (!ctx) throw new Error("useDemo must be used inside the demo provider")
  return ctx
}

/** GradeBadge palette, copied from the product's shared component. */
const GRADE_STYLES: Record<Grade, string> = {
  A: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  B: "bg-sky-50 text-sky-700 ring-sky-200",
  C: "bg-orange-50 text-orange-600 ring-orange-200",
  D: "bg-orange-100 text-orange-700 ring-orange-300",
  E: "bg-red-50 text-red-700 ring-red-200",
  F: "bg-slate-100 text-slate-500 ring-slate-200",
}

export function GradeBadge({ grade, size = "md" }: { grade: Grade; size?: "sm" | "md" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-bold leading-none ring-1",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]",
        size === "sm" ? "h-6 w-6 text-[11px]" : "h-7 w-7 text-[12.5px]",
        GRADE_STYLES[grade]
      )}
    >
      {grade}
    </span>
  )
}

const AVATAR_TINTS = [
  "linear-gradient(180deg, #BAE6FD 0%, #7DD3FC 100%)",
  "linear-gradient(180deg, #BBF7D0 0%, #86EFAC 100%)",
  "linear-gradient(180deg, #FED7AA 0%, #FDBA74 100%)",
  "linear-gradient(180deg, #DDD6FE 0%, #C4B5FD 100%)",
]

export function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
  const tint = AVATAR_TINTS[name.charCodeAt(0) % AVATAR_TINTS.length]
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full font-bold text-slate-700"
      style={{ width: size, height: size, fontSize: size * 0.34, background: tint, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.85)" }}
    >
      {initials}
    </span>
  )
}

/** Delta chip, as the product renders it beside a KPI. */
export function DeltaChip({ delta, invert = false }: { delta?: number | null; invert?: boolean }) {
  if (delta == null) return null
  const good = invert ? delta <= 0 : delta >= 0
  const Icon = delta >= 0 ? TrendingUp : TrendingDown
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-[11.5px] font-semibold", good ? "text-emerald-600" : "text-rose-500")}>
      <Icon className="h-3 w-3" strokeWidth={2.5} />
      {Math.abs(delta)}%
    </span>
  )
}

/**
 * Page header. The product uses a plain 24px h1 with an optional 13px
 * subtitle and no icon tile.
 */
export function PageHead({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-[24px] font-semibold leading-tight tracking-[-0.02em] text-slate-900">{title}</h1>
        {sub && <p className="mt-1 max-w-[560px] text-[13px] leading-relaxed text-slate-500">{sub}</p>}
      </div>
      {action && <div className="flex flex-wrap items-center gap-2">{action}</div>}
    </header>
  )
}

/** Quick-stats card. `rounded-xl`, 8×8 tinted tile, 23px value. */
export function StatCard({
  icon: Icon, label, value, tintBg, tintFg, delta, caption,
}: {
  icon: LucideIcon; label: string; value: ReactNode; tintBg: string; tintFg: string; delta?: number | null; caption?: string
}) {
  return (
    <div className="rounded-xl border border-slate-200/70 bg-white p-3.5">
      <div className="flex min-w-0 items-center gap-2">
        <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-lg", tintBg)}>
          <Icon className={cn("h-4 w-4", tintFg)} strokeWidth={2} />
        </span>
        <span className="truncate text-[12px] font-medium text-slate-600">{label}</span>
      </div>
      <div className="mt-3 text-[23px] font-bold leading-none tabular-nums text-slate-900">{value}</div>
      <div className="mt-2 flex min-h-[16px] items-center gap-1.5">
        <DeltaChip delta={delta} />
        {caption && <span className="truncate text-[11.5px] text-slate-400">{caption}</span>}
      </div>
    </div>
  )
}

/** Dashboard/pipeline KPI card. `rounded-2xl`, 26px value, delta line. */
export function KpiCard({
  label, value, icon: Icon, tintBg, tintFg, delta, invertDelta, spark, suffix, caption,
}: {
  label: string; value: ReactNode; icon?: LucideIcon; tintBg?: string; tintFg?: string
  delta?: number | null; invertDelta?: boolean; spark?: number[]; suffix?: string; caption?: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-4">
      <div className="flex min-w-0 items-center gap-2">
        {Icon && (
          <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-lg", tintBg, tintFg)}>
            <Icon className="h-4 w-4" strokeWidth={2} />
          </span>
        )}
        <p className="text-[12px] font-medium leading-tight text-slate-600">{label}</p>
      </div>
      <div className="mt-3 text-[26px] font-bold leading-none tabular-nums text-slate-900">
        {value}{suffix}
      </div>
      <div className="mt-2 flex min-h-[16px] items-center gap-1.5">
        {delta == null ? (
          <span className="text-[11.5px] text-slate-400">{caption ?? "vs last month"}</span>
        ) : (
          <>
            <DeltaChip delta={delta} invert={invertDelta} />
            <span className="text-[11.5px] text-slate-400">{caption ?? "vs last month"}</span>
          </>
        )}
      </div>
      {spark && <Sparkline points={spark} />}
    </div>
  )
}

export function Sparkline({ points, tone = "sky" }: { points: number[]; tone?: "sky" | "emerald" | "orange" | "violet" }) {
  const max = Math.max(...points, 1)
  const min = Math.min(...points)
  const span = max - min || 1
  const d = points.map((p, i) => `${(i / (points.length - 1)) * 100},${26 - ((p - min) / span) * 22}`).join(" ")
  const stroke = { sky: "#38BDF8", emerald: "#34D399", orange: "#FB923C", violet: "#A78BFA" }[tone]
  return (
    <svg viewBox="0 0 100 28" preserveAspectRatio="none" className="mt-3 h-7 w-full" aria-hidden>
      <polyline points={d} fill="none" stroke={stroke} strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

/** White bordered panel, the product's default container. */
export function Card({ title, meta, action, children, className, pad = "p-5" }: {
  title?: string; meta?: ReactNode; action?: ReactNode; children: ReactNode; className?: string; pad?: string
}) {
  return (
    <section className={cn("rounded-2xl border border-slate-200/70 bg-white", pad, className)}>
      {(title || action) && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            {title && <h2 className="text-[15px] font-semibold text-slate-900">{title}</h2>}
            {meta}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  )
}

export function Th({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <th className={cn("whitespace-nowrap px-3 py-2.5 text-left text-[12px] font-semibold text-slate-600", className)}>
      {children}
    </th>
  )
}

export function Btn({
  children, onClick, tone = "ghost", size = "md", className, title,
}: {
  children: ReactNode; onClick?: () => void; tone?: "primary" | "ghost" | "soft" | "danger"
  size?: "sm" | "md"; className?: string; title?: string
}) {
  const tones = {
    primary: "bg-sky-600 text-white hover:bg-sky-700",
    ghost: "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
    soft: "bg-sky-50 text-sky-700 hover:bg-sky-100",
    danger: "border border-rose-200 bg-white text-rose-600 hover:bg-rose-50",
  }
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg font-semibold transition-all active:scale-[0.98]",
        size === "sm" ? "h-8 px-3 text-[12px]" : "h-9 px-3.5 text-[13px]",
        tones[tone],
        className
      )}
    >
      {children}
    </button>
  )
}

/**
 * The dashboard's pipeline funnel: one segmented bar showing how leads split
 * across stages, plus a two-column legend. Replaced per-stage rows in the
 * August redesign.
 */
export function FunnelBar({
  stages,
}: {
  stages: { name: string; count: number; pct: number; bar: string; swatch: string }[]
}) {
  const total = stages.reduce((s, x) => s + x.count, 0) || 1
  return (
    <>
      <div className="flex h-9 w-full gap-0.5 overflow-hidden rounded-lg">
        {stages.map((s) =>
          s.count <= 0 ? null : (
            <div
              key={s.name}
              className={cn("h-full transition-all duration-500", s.bar)}
              style={{ width: `${(s.count / total) * 100}%`, minWidth: 3 }}
              title={`${s.name}: ${s.count} (${s.pct}%)`}
            />
          )
        )}
      </div>
      <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2.5 @2xl:grid-cols-2">
        {stages.map((s) => (
          <div key={s.name} className="flex min-w-0 items-center gap-2">
            <span className={cn("h-2.5 w-2.5 shrink-0 rounded-[3px]", s.swatch)} />
            <span className="flex-1 truncate text-[12.5px] text-slate-600">{s.name}</span>
            <span className="shrink-0 text-[13px] font-semibold tabular-nums text-slate-900">{s.count}</span>
            <span className="w-9 shrink-0 text-right text-[11.5px] tabular-nums text-slate-400">{s.pct}%</span>
          </div>
        ))}
      </div>
    </>
  )
}

/** Score bar in the product's /40 /30 /30 style, used on All Leads. */
export function ScoreCell({ value, of, tone }: { value: number; of: number; tone: "fit" | "intent" | "quality" }) {
  const bar = { fit: "bg-rose-400", intent: "bg-emerald-400", quality: "bg-sky-400" }[tone]
  return (
    <div className="min-w-[70px]">
      <p className="text-[12.5px] font-semibold tabular-nums text-slate-900">
        {value}<span className="ml-0.5 text-[10.5px] font-normal text-slate-400">/{of}</span>
      </p>
      <div className="mt-1 h-[3px] w-full overflow-hidden rounded-full bg-slate-100">
        <div className={cn("h-full rounded-full", bar)} style={{ width: `${(value / of) * 100}%` }} />
      </div>
    </div>
  )
}
