"use client"

import { createContext, useContext, type Dispatch, type ReactNode } from "react"
import { TrendingUp, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import type { DemoAction, DemoState, Grade } from "@/lib/demo-app"

/** Shared store for the demo, so views do not prop-drill. */
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
        size === "sm" ? "h-5 w-5 text-[10px]" : "h-6 w-6 text-[11px]",
        GRADE_STYLES[grade]
      )}
    >
      {grade}
    </span>
  )
}

const AVATAR_TINTS = [
  "linear-gradient(180deg, #7DD3FC 0%, #38BDF8 100%)",
  "linear-gradient(180deg, #86EFAC 0%, #4ADE80 100%)",
  "linear-gradient(180deg, #FDBA74 0%, #FB923C 100%)",
  "linear-gradient(180deg, #C4B5FD 0%, #A78BFA 100%)",
  "linear-gradient(180deg, #F9A8D4 0%, #F472B6 100%)",
  "linear-gradient(180deg, #FCD34D 0%, #FBBF24 100%)",
]

/** Circular avatar with a single initial, as the product's queue rows use. */
export function Avatar({ name, size = 40, single = true }: { name: string; size?: number; single?: boolean }) {
  const initials = single
    ? name[0].toUpperCase()
    : name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
  const tint = AVATAR_TINTS[name.charCodeAt(0) % AVATAR_TINTS.length]
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full font-bold text-white"
      style={{ width: size, height: size, fontSize: size * 0.4, background: tint, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4)" }}
    >
      {initials}
    </span>
  )
}

/** The page header used on every screen: soft icon tile, big title, subtitle. */
export function PageHeader({
  icon: Icon, title, sub, action, tint = "sky",
}: {
  icon: LucideIcon; title: string; sub?: string; action?: ReactNode; tint?: "sky" | "rose" | "violet"
}) {
  const tints = {
    sky: "bg-sky-100 text-sky-600",
    rose: "bg-rose-100 text-rose-500",
    violet: "bg-violet-100 text-violet-500",
  }
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex min-w-0 items-start gap-4">
        <span className={cn("grid h-[52px] w-[52px] shrink-0 place-items-center rounded-2xl", tints[tint])}>
          <Icon className="h-6 w-6" strokeWidth={2} />
        </span>
        <div className="min-w-0">
          <h2 className="text-[30px] font-bold leading-tight tracking-[-0.02em] text-slate-800">{title}</h2>
          {sub && <p className="mt-1 max-w-[560px] text-[13.5px] leading-relaxed text-slate-500">{sub}</p>}
        </div>
      </div>
      {action && <div className="flex flex-wrap items-center gap-2">{action}</div>}
    </header>
  )
}

/** KPI card with the product's icon tile, delta chip and optional sparkline. */
export function Kpi({
  icon: Icon, label, value, tintBg, tintFg, delta, caption, spark, dot,
}: {
  icon?: LucideIcon
  label: string
  value: string
  tintBg?: string
  tintFg?: string
  delta?: string
  caption?: string
  spark?: number[]
  /** A coloured bullet instead of an icon tile, as the pipeline cards use. */
  dot?: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-4">
      <div className="flex min-w-0 items-center gap-2.5">
        {dot ? (
          <span className={cn("h-2 w-2 shrink-0 rounded-full", dot)} />
        ) : Icon ? (
          <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-xl", tintBg)}>
            <Icon className={cn("h-4 w-4", tintFg)} strokeWidth={2} />
          </span>
        ) : null}
        <span className="text-[12.5px] font-medium leading-tight text-slate-600">{label}</span>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-[26px] font-bold leading-none tabular-nums text-slate-900">{value}</span>
        {delta && (
          <span className="inline-flex items-center gap-0.5 text-[11.5px] font-semibold text-emerald-600">
            <TrendingUp className="h-3 w-3" strokeWidth={2.5} />{delta}
          </span>
        )}
      </div>
      {caption && <p className="mt-1.5 text-[11.5px] text-slate-400">{caption}</p>}
      {spark && <Sparkline points={spark} />}
    </div>
  )
}

export function Sparkline({ points, tone = "sky" }: { points: number[]; tone?: "sky" | "emerald" | "orange" }) {
  const max = Math.max(...points, 1)
  const min = Math.min(...points)
  const span = max - min || 1
  const d = points
    .map((p, i) => `${(i / (points.length - 1)) * 100},${28 - ((p - min) / span) * 24}`)
    .join(" ")
  const stroke = { sky: "#38BDF8", emerald: "#34D399", orange: "#FB923C" }[tone]
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="mt-3 h-8 w-full" aria-hidden>
      <polyline points={d} fill="none" stroke={stroke} strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

export function Card({ title, meta, action, children, className }: { title?: string; meta?: ReactNode; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-2xl border border-slate-200/70 bg-white p-5", className)}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            {title && <h3 className="text-[15px] font-semibold text-slate-900">{title}</h3>}
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
    <th className={cn("whitespace-nowrap px-3 py-2.5 text-left font-mono text-[10.5px] font-semibold uppercase tracking-[0.08em] text-slate-400", className)}>
      {children}
    </th>
  )
}

export function Btn({
  children, onClick, tone = "ghost", size = "md", className, title,
}: {
  children: ReactNode
  onClick?: () => void
  tone?: "primary" | "ghost" | "soft" | "danger" | "pill"
  size?: "sm" | "md"
  className?: string
  title?: string
}) {
  const tones = {
    primary: "bg-sky-500 text-white hover:bg-sky-600 shadow-[0_1px_2px_rgba(15,23,42,0.12)]",
    ghost: "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
    soft: "bg-sky-50 text-sky-700 hover:bg-sky-100",
    danger: "border border-rose-200 bg-white text-rose-600 hover:bg-rose-50",
    pill: "border border-sky-200 bg-white text-sky-700 hover:bg-sky-50",
  }
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full font-semibold transition-all active:scale-[0.98]",
        size === "sm" ? "h-8 px-3 text-[12px]" : "h-9 px-4 text-[13px]",
        tones[tone],
        className
      )}
    >
      {children}
    </button>
  )
}

/** Score bar in the product's /40 /30 /30 style. */
export function ScoreCell({ value, of, tone }: { value: number; of: number; tone: "fit" | "intent" | "quality" }) {
  const bar = { fit: "bg-rose-400", intent: "bg-emerald-400", quality: "bg-sky-400" }[tone]
  return (
    <div className="min-w-[74px]">
      <p className="text-[12.5px] font-semibold tabular-nums text-slate-900">
        {value}<span className="ml-0.5 text-[10.5px] font-normal text-slate-400">/{of}</span>
      </p>
      <div className="mt-1 h-[3px] w-full overflow-hidden rounded-full bg-slate-100">
        <div className={cn("h-full rounded-full", bar)} style={{ width: `${(value / of) * 100}%` }} />
      </div>
    </div>
  )
}

/** The pill that carries a lead's source, as the queue rows show it. */
export function SourcePill({ source }: { source: string }) {
  return (
    <span className="inline-flex h-[22px] items-center gap-1 rounded-full bg-slate-100 px-2 text-[11px] font-medium text-slate-500">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
      {source}
    </span>
  )
}
