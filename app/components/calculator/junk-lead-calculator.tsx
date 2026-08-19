"use client"

import { useState } from "react"

/**
 * What junk leads cost — the wedge's calculator.
 *
 * /glossary/junk-lead is the site's best organic position (~6) and had no
 * commercial step beneath it: a reader arrived, got a definition, and left.
 * This gives the term a consequence. The arithmetic is deliberately plain and
 * shown on the page — every input is the reader's own number, and there is no
 * hidden multiplier or benchmark asserted as fact.
 *
 * Runs entirely in the browser; nothing is sent anywhere.
 */
const inr = (n: number) => {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(n / 1e7 >= 10 ? 0 : 1)} Cr`
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(n / 1e5 >= 10 ? 0 : 1)} L`
  if (n >= 1e3) return `₹${Math.round(n / 1e3)}k`
  return `₹${Math.round(n)}`
}

function Slider({
  label, value, min, max, step, onChange, display,
}: {
  label: string; value: number; min: number; max: number; step: number
  onChange: (n: number) => void; display: string
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label className="text-[14px] text-ink-soft">{label}</label>
        <span className="font-mono text-[15px] font-semibold tabular-nums text-ink">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2.5 w-full accent-sky-500"
      />
    </div>
  )
}

export function JunkLeadCalculator() {
  const [leads, setLeads] = useState(400)
  const [junkPct, setJunkPct] = useState(45)
  const [minutes, setMinutes] = useState(9)
  const [reps, setReps] = useState(4)
  const [costPerRep, setCostPerRep] = useState(35000)

  const junkLeads = Math.round((leads * junkPct) / 100)
  const hoursLost = (junkLeads * minutes) / 60
  // Cost of a rep-hour from the team's own salary figure: monthly cost ÷ a
  // 22-day, 8-hour month. No industry benchmark is asserted.
  const repHourCost = costPerRep / (22 * 8)
  const monthlyCost = hoursLost * repHourCost
  const workingDays = 22
  const hoursPerRepPerDay = reps > 0 ? hoursLost / reps / workingDays : 0

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-10">
      {/* Inputs */}
      <div className="rounded-2xl border bg-white p-6 md:p-7" style={{ borderColor: "var(--paper-line)" }}>
        <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Your numbers</p>
        <div className="mt-6 space-y-6">
          <Slider label="Leads per month" value={leads} min={50} max={5000} step={50}
            onChange={setLeads} display={leads.toLocaleString("en-IN")} />
          <Slider label="Share that never had a chance" value={junkPct} min={5} max={90} step={5}
            onChange={setJunkPct} display={`${junkPct}%`} />
          <Slider label="Minutes a rep spends before giving up on one" value={minutes} min={2} max={45} step={1}
            onChange={setMinutes} display={`${minutes} min`} />
          <Slider label="Sales reps" value={reps} min={1} max={50} step={1}
            onChange={setReps} display={String(reps)} />
          <Slider label="Monthly cost per rep" value={costPerRep} min={15000} max={200000} step={5000}
            onChange={setCostPerRep} display={inr(costPerRep)} />
        </div>
        <p className="mt-6 text-[12px] leading-[1.6] text-ink-muted">
          Every figure here is yours. A rep-hour is costed from your own salary number over a 22-day,
          8-hour month. Nothing is sent anywhere — this runs in your browser.
        </p>
      </div>

      {/* Output */}
      <div className="flex flex-col justify-center rounded-2xl border bg-white p-6 md:p-7" style={{ borderColor: "var(--paper-line)" }}>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-orange-500">
          Spent on leads that were never going to buy
        </p>
        <p className="mt-2 font-mono text-[40px] font-semibold leading-none tracking-[-0.03em] tabular-nums text-ink md:text-[46px]">
          {inr(monthlyCost)}
          <span className="ml-1.5 text-[15px] font-medium text-ink-muted">/month</span>
        </p>
        <p className="mt-2 text-[13px] text-ink-soft">
          {inr(monthlyCost * 12)}/year · {junkLeads.toLocaleString("en-IN")} dead leads worked ·{" "}
          {Math.round(hoursLost)} rep-hours
        </p>

        <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl" style={{ background: "var(--paper-line)" }}>
          <div className="bg-white px-4 py-3">
            <dt className="ledger-num text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Per rep, per day</dt>
            <dd className="mt-1 font-mono text-[17px] font-semibold tabular-nums text-ink">
              {hoursPerRepPerDay.toFixed(1)} hrs
            </dd>
          </div>
          <div className="bg-white px-4 py-3">
            <dt className="ledger-num text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Of the month</dt>
            <dd className="mt-1 font-mono text-[17px] font-semibold tabular-nums text-ink">
              {Math.round((hoursPerRepPerDay / 8) * 100)}%
            </dd>
          </div>
        </dl>

        <p className="mt-5 text-[12px] leading-[1.6] text-ink-muted">
          Formula: <span className="font-mono">leads × junk share × minutes ÷ 60 × rep-hour cost</span>.
          This is the time cost only — it does not count the good leads that went cold while a rep
          worked through the dead ones.
        </p>
      </div>
    </div>
  )
}
