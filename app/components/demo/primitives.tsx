"use client"

import { createContext, useContext, type Dispatch, type ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

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
        "inline-flex items-center justify-center rounded-lg font-bold leading-none ring-1 transition-colors",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]",
        size === "sm" ? "h-6 w-6 text-[11px]" : "h-7 w-7 text-[13px]",
        GRADE_STYLES[grade]
      )}
    >
      {grade}
    </span>
  )
}

export const NEXT_TONE: Record<Grade, string> = {
  A: "bg-sky-50 text-sky-700",
  B: "bg-sky-50 text-sky-700",
  C: "bg-amber-50 text-amber-700",
  D: "bg-orange-50 text-orange-700",
  E: "bg-orange-50 text-orange-700",
  F: "bg-slate-100 text-slate-500",
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

export function StatCard({
  icon: Icon, label, value, tintBg, tintFg, caption,
}: {
  icon: LucideIcon; label: string; value: string; tintBg: string; tintFg: string; caption: string
}) {
  return (
    <div className="rounded-xl border border-slate-200/70 bg-white p-3.5">
      <div className="flex min-w-0 items-center gap-2">
        <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-lg", tintBg)}>
          <Icon className={cn("h-4 w-4", tintFg)} strokeWidth={2} />
        </span>
        <span className="text-[12px] font-medium leading-tight text-slate-600">{label}</span>
      </div>
      <div className="mt-3 text-[23px] font-bold leading-none tabular-nums text-slate-900">{value}</div>
      <div className="mt-2 min-h-[16px] text-[11.5px] text-slate-400">{caption}</div>
    </div>
  )
}

export function Th({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <th className={cn("whitespace-nowrap px-3 py-2.5 text-left text-[12px] font-semibold text-slate-600", className)}>
      {children}
    </th>
  )
}

export function Panel({ title, action, children, className }: { title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-2xl border border-slate-200/70 bg-white p-4 sm:p-5", className)}>
      <div className="mb-3.5 flex items-center justify-between gap-3">
        <h3 className="text-[15px] font-semibold text-slate-900">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  )
}

export function PageHead({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-[24px] font-semibold leading-tight tracking-[-0.02em] text-slate-900">{title}</h2>
        {sub && <p className="mt-1.5 text-[13px] text-slate-500">{sub}</p>}
      </div>
      {action}
    </header>
  )
}

export function Btn({
  children, onClick, tone = "ghost", size = "md", className, title,
}: {
  children: ReactNode
  onClick?: () => void
  tone?: "primary" | "ghost" | "soft" | "danger"
  size?: "sm" | "md"
  className?: string
  title?: string
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

/** Score bar, matching the product's Fit / Intent / Quality display. */
export function ScoreBar({ label, value, threshold }: { label: string; value: number; threshold: number }) {
  const clears = value >= threshold
  return (
    <div>
      <div className="flex items-baseline justify-between text-[12px]">
        <span className="font-medium text-slate-600">{label}</span>
        <span className="tabular-nums">
          <span className={cn("font-bold", clears ? "text-emerald-600" : "text-slate-500")}>{value}</span>
          <span className="text-slate-300">/100</span>
        </span>
      </div>
      <div className="relative mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={cn("h-full rounded-full transition-all duration-500", clears ? "bg-emerald-400" : "bg-sky-400")}
          style={{ width: `${value}%` }}
        />
        <span
          className="absolute top-0 h-full w-px bg-slate-400/70"
          style={{ left: `${threshold}%` }}
          title={`Grade A needs ${threshold}`}
        />
      </div>
    </div>
  )
}
