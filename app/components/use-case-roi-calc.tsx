"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowRight } from "lucide-react"

/* ──────────────────────────────────────────────────────────────────────────
   Generic use-case ₹-at-risk mini-estimator (client island).

   Illustrative only. volume × (cold%) × conversion × deal value. It sizes the
   leak in rupees; it is NOT a promise of recovered revenue. Every industry page
   passes its own labels/defaults; the full tool at
   /tools/missed-revenue-calculator is the real one.
   ────────────────────────────────────────────────────────────────────────── */

export type RoiConfig = {
  volumeLabel: string
  volumeDefault: number
  volumeMin: number
  volumeMax: number
  volumeStep: number
  valueLabel: string
  valueDefault: number
  valueMin: number
  valueMax: number
  valueStep: number
  coldLabel: string
  coldDefault: number // percent
  /** Share of cold-but-serious leads that would have converted (fraction). */
  conv: number
  /** e.g. "enrolments", "bookings", "deals". */
  outcomeNoun: string
  /** e.g. "₹ admissions at risk", "₹ bookings at risk". */
  riskLabel: string
  /** e.g. "serious enquiries", "warm buyers". */
  coldNoun: string
}

/** ₹ formatter → lakhs / crores, Indian convention. */
function inr(n: number): string {
  if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(n % 1_00_00_000 === 0 ? 0 : 1)}Cr`
  if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(n % 1_00_000 === 0 ? 0 : 1)}L`
  if (n >= 1_000) return `₹${Math.round(n / 1_000)}k`
  return `₹${Math.round(n)}`
}

function Field({
  label, value, min, max, step, mode, onChange,
}: {
  label: string; value: number; min: number; max: number; step: number; mode: "num" | "inr" | "pct"; onChange: (v: number) => void
}) {
  const shown = mode === "inr" ? inr(value) : mode === "pct" ? `${value}%` : value.toLocaleString("en-IN")
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="text-[13px] font-medium text-ink-soft">{label}</label>
        <span className="font-mono text-[14px] font-semibold tabular-nums text-ink">{shown}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="mt-2.5 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-sky-100 accent-sky-600"
      />
    </div>
  )
}

export function UseCaseRoiCalc({ cfg }: { cfg: RoiConfig }) {
  const [volume, setVolume] = useState(cfg.volumeDefault)
  const [value, setValue] = useState(cfg.valueDefault)
  const [coldRate, setColdRate] = useState(cfg.coldDefault)

  const coldPerMonth = Math.round(volume * (coldRate / 100))
  const atRiskMonth = coldPerMonth * cfg.conv * value
  const atRiskYear = atRiskMonth * 12

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_0.9fr] md:gap-10">
      {/* Inputs */}
      <div className="space-y-6">
        <Field label={cfg.volumeLabel} value={volume} min={cfg.volumeMin} max={cfg.volumeMax} step={cfg.volumeStep} mode="num" onChange={setVolume} />
        <Field label={cfg.valueLabel} value={value} min={cfg.valueMin} max={cfg.valueMax} step={cfg.valueStep} mode="inr" onChange={setValue} />
        <Field label={cfg.coldLabel} value={coldRate} min={5} max={40} step={1} mode="pct" onChange={setColdRate} />
        <p className="text-[12px] leading-[1.6] text-ink-muted">
          Assumes ~{Math.round(cfg.conv * 100)}% of those cold-but-serious leads would have converted. Illustrative estimate to size the leak, not a promise of recovered revenue.
        </p>
      </div>

      {/* Output */}
      <div className="flex flex-col justify-center rounded-2xl border bg-white p-6 md:p-7" style={{ borderColor: "var(--paper-line)" }}>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-orange-500">{cfg.riskLabel}</p>
        <p className="mt-2 font-mono text-[40px] font-semibold leading-none tracking-[-0.03em] tabular-nums text-ink md:text-[46px]">{inr(atRiskYear)}<span className="ml-1.5 text-[15px] font-medium text-ink-muted">/yr</span></p>
        <p className="mt-2 text-[13px] text-ink-soft">{inr(atRiskMonth)}/month · about {coldPerMonth.toLocaleString("en-IN")} {cfg.coldNoun} going cold</p>
        <div className="mt-5 h-2.5 w-full overflow-hidden rounded-full bg-orange-100/70" style={{ boxShadow: "inset 0 1px 2px rgba(15,23,42,0.08)" }}>
          <div className="h-full rounded-full" style={{ width: `${Math.min(100, coldRate * 2.5)}%`, background: "linear-gradient(90deg,#FDBA74,#FB923C 60%,#F97316)", boxShadow: "0 0 12px rgba(251,146,60,0.5)" }} />
        </div>
        <Link href="/tools/missed-revenue-calculator" className="group mt-6 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-sky-600 hover:text-sky-500">
          Run the full calculator <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  )
}
