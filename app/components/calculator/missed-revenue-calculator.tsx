"use client"

import { useState } from "react"
import { APP_URLS } from "@/lib/urls"

const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN")
const inrCompact = (n: number) => {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(n >= 1e8 ? 0 : 1)} Cr`
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(n >= 1e6 ? 0 : 1)} L`
  return inr(n)
}

type FieldProps = {
  label: string
  value: number
  onChange: (n: number) => void
  min: number
  max: number
  step: number
  prefix?: string
  suffix?: string
}

function Field({ label, value, onChange, min, max, step, prefix, suffix }: FieldProps) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="text-[13px] font-medium text-ink-soft">{label}</label>
        <span className="font-mono text-[15px] font-semibold text-ink tabular-nums">
          {prefix}
          {value.toLocaleString("en-IN")}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-sky-500"
        aria-label={label}
      />
    </div>
  )
}

/**
 * Missed-Revenue calculator. Fully transparent: the visitor sets their own
 * conversion numbers and the uplift they'd expect from contacting hot leads in
 * time — there's no fabricated multiplier baked in. Output = (improved − current)
 * conversion × leads × deal value.
 */
export function MissedRevenueCalculator() {
  const [leads, setLeads] = useState(300)
  const [dealValue, setDealValue] = useState(50000)
  const [conv, setConv] = useState(4)
  const [uplift, setUplift] = useState(3)

  const improvedConv = Math.min(100, conv + uplift)
  const currentRev = leads * (conv / 100) * dealValue
  const improvedRev = leads * (improvedConv / 100) * dealValue
  const recoveredMonthly = Math.max(0, improvedRev - currentRev)
  const recoveredAnnual = recoveredMonthly * 12
  const extraDeals = leads * (uplift / 100)

  return (
    <div className="grid gap-6 md:grid-cols-2 md:gap-8">
      {/* Inputs */}
      <div className="rounded-2xl glass-2 gloss-edge p-6 md:p-7">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-600">Your numbers</p>
        <div className="mt-5 space-y-6">
          <Field label="Inbound leads / month" value={leads} onChange={setLeads} min={20} max={5000} step={10} />
          <Field label="Average deal value" value={dealValue} onChange={setDealValue} min={5000} max={5000000} step={5000} prefix="₹" />
          <Field label="Current lead → win rate" value={conv} onChange={setConv} min={1} max={40} step={1} suffix="%" />
          <Field label="Uplift from faster follow-up" value={uplift} onChange={setUplift} min={0} max={20} step={1} suffix=" pts" />
        </div>
        <p className="mt-6 text-[12px] leading-[1.6] text-ink-muted">
          Set the extra conversion points you&apos;d expect from calling every hot lead inside its window, you control
          the assumption; nothing is baked in.
        </p>
      </div>

      {/* Result */}
      <div className="flex flex-col justify-between rounded-2xl glass-3 gloss-edge p-6 md:p-8" style={{ background: "linear-gradient(180deg, rgba(240,249,255,0.7), rgba(255,247,237,0.55))" }}>
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-orange-500">Left on the table</p>
          <p className="mt-3 font-mono text-[40px] font-semibold leading-none tracking-[-0.03em] text-ink md:text-[52px]">
            {inrCompact(recoveredMonthly)}
          </p>
          <p className="mt-2 text-[14px] text-ink-soft">recoverable revenue every month</p>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl glass-1 gloss-edge p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">Per year</p>
              <p className="mt-1 font-mono text-[20px] font-semibold text-ink tabular-nums">{inrCompact(recoveredAnnual)}</p>
            </div>
            <div className="rounded-xl glass-1 gloss-edge p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">Extra deals / mo</p>
              <p className="mt-1 font-mono text-[20px] font-semibold text-ink tabular-nums">{extraDeals.toFixed(1)}</p>
            </div>
          </div>

          <p className="mt-6 text-[12.5px] leading-[1.6] text-ink-muted">
            Formula: <span className="font-mono text-ink-soft">leads × (improved − current rate) × deal value</span>.
            At {conv}% you win {inrCompact(currentRev)}/mo; at {improvedConv}% you&apos;d win {inrCompact(improvedRev)}/mo.
          </p>
        </div>

        <a
          href={APP_URLS.register}
          className="mt-7 inline-flex items-center justify-center rounded-full px-6 py-3 text-[14px] font-semibold text-white transition-transform hover:scale-[1.02]"
          style={{ background: "linear-gradient(180deg, #38BDF8 0%, #0EA5E9 100%)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4), 0 8px 20px rgba(14,165,233,0.32)" }}
        >
          Stop the leak, start free
        </a>
      </div>
    </div>
  )
}
