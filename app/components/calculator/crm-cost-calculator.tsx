"use client"

import { useState } from "react"
import { APP_URLS } from "@/lib/urls"

const inrCompact = (n: number) => {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(n >= 1e8 ? 0 : 1)} Cr`
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(n >= 1e6 ? 0 : 1)} L`
  return "₹" + Math.round(n).toLocaleString("en-IN")
}

// Leadkaun's verified flat tiers (per account / month) + seat caps.
// Source: prisma pricing migration — do NOT change without updating pricing.
function tierFor(reps: number): { name: string; price: number | null; cap: number } {
  if (reps <= 10) return { name: "Starter", price: 2999, cap: 10 }
  if (reps <= 30) return { name: "Growth", price: 7999, cap: 30 }
  if (reps <= 75) return { name: "Scale", price: 19999, cap: 75 }
  return { name: "Enterprise", price: null, cap: Infinity }
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
 * CRM cost calculator — per-seat vs flat. Fully transparent arithmetic: the
 * visitor sets their team size and their current per-user price; the output is
 * (per-user × reps) vs Leadkaun's verified flat tier. No feature claim, no
 * fabricated stat — it illustrates that per-seat cost scales with headcount and
 * flat pricing doesn't. Leadkaun runs ALONGSIDE a CRM (see the caveat copy).
 */
export function CrmCostCalculator() {
  const [reps, setReps] = useState(15)
  const [perUser, setPerUser] = useState(800)

  const tier = tierFor(reps)
  const competitorMonthly = perUser * reps
  const leadkaunMonthly = tier.price // null for Enterprise
  const premiumMonthly = leadkaunMonthly === null ? null : Math.max(0, competitorMonthly - leadkaunMonthly)
  const premiumAnnual = premiumMonthly === null ? null : premiumMonthly * 12
  const lkPerRep = leadkaunMonthly === null ? null : leadkaunMonthly / reps

  return (
    <div className="grid gap-6 md:grid-cols-2 md:gap-8">
      {/* Inputs */}
      <div className="rounded-2xl glass-2 gloss-edge p-6 md:p-7">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-600">Your numbers</p>
        <div className="mt-5 space-y-6">
          <Field label="Sales reps on the team" value={reps} onChange={setReps} min={2} max={100} step={1} />
          <Field label="Current price per user / month" value={perUser} onChange={setPerUser} min={200} max={5000} step={100} prefix="₹" />
        </div>
        <p className="mt-6 text-[12px] leading-[1.6] text-ink-muted">
          Enter what your current per-seat tool charges per user. Leadkaun is priced flat per account, so its cost
          doesn&apos;t move when you add reps — up to the seat cap of each tier.
        </p>
      </div>

      {/* Result */}
      <div className="flex flex-col justify-between rounded-2xl glass-3 gloss-edge p-6 md:p-8" style={{ background: "linear-gradient(180deg, rgba(240,249,255,0.7), rgba(255,247,237,0.55))" }}>
        <div>
          {leadkaunMonthly === null ? (
            <>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-orange-500">Beyond 75 reps</p>
              <p className="mt-3 text-[18px] font-semibold leading-[1.3] text-ink">
                At {reps} reps you&apos;re in Enterprise territory — Leadkaun is custom-priced (unlimited seats), so talk to
                sales for a flat quote. Per-seat tools would bill you {inrCompact(competitorMonthly)}/mo at {reps} × ₹{perUser.toLocaleString("en-IN")}.
              </p>
            </>
          ) : (
            <>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-orange-500">Per-seat premium / month</p>
              <p className="mt-3 font-mono text-[40px] font-semibold leading-none tracking-[-0.03em] text-ink md:text-[52px]">
                {inrCompact(premiumMonthly as number)}
              </p>
              <p className="mt-2 text-[14px] text-ink-soft">
                more than Leadkaun&apos;s flat {tier.name} price, at {reps} reps
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl glass-1 gloss-edge p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">Premium / year</p>
                  <p className="mt-1 font-mono text-[20px] font-semibold text-ink tabular-nums">{inrCompact(premiumAnnual as number)}</p>
                </div>
                <div className="rounded-xl glass-1 gloss-edge p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">Leadkaun / rep</p>
                  <p className="mt-1 font-mono text-[20px] font-semibold text-ink tabular-nums">{inrCompact(lkPerRep as number)}</p>
                </div>
              </div>

              <p className="mt-6 text-[12.5px] leading-[1.6] text-ink-muted">
                Per-seat: <span className="font-mono text-ink-soft">₹{perUser.toLocaleString("en-IN")} × {reps} = {inrCompact(competitorMonthly)}/mo</span>.
                Leadkaun {tier.name}: <span className="font-mono text-ink-soft">{inrCompact(leadkaunMonthly)}/mo flat</span>, up to {tier.cap} seats.
              </p>
            </>
          )}

          <p className="mt-5 text-[12px] leading-[1.6] text-ink-muted">
            List-price comparison only — features differ, and Leadkaun is designed to run <span className="font-semibold text-ink-soft">alongside</span> your
            CRM, not necessarily replace it. The point: per-seat cost grows with every rep you add; flat pricing doesn&apos;t.
          </p>
        </div>

        <a
          href={leadkaunMonthly === null ? "/contact" : "/pricing"}
          className="mt-7 inline-flex items-center justify-center rounded-full px-6 py-3 text-[14px] font-semibold text-white transition-transform hover:scale-[1.02]"
          style={{ background: "linear-gradient(180deg, #38BDF8 0%, #0EA5E9 100%)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4), 0 8px 20px rgba(14,165,233,0.32)" }}
        >
          {leadkaunMonthly === null ? "Talk to sales" : "See Leadkaun pricing"}
        </a>
      </div>
    </div>
  )
}
