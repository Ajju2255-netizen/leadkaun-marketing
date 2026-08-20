"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, ArrowRight } from "lucide-react"
import { FloatingCard } from "@/app/components/floating-card"
import { APP_URLS } from "@/lib/urls"

const inr = (n: number) => `₹${new Intl.NumberFormat("en-IN").format(n)}`

type Tier = {
  name: string
  monthly: number | null // null = Free
  annual: number | null
  freeUnit?: string
  description: string
  idealFor: string
  features: string[]
  ctaLabel: string
  highlighted?: boolean
  highlightBadge?: string
}

const TIERS: Tier[] = [
  {
    name: "Free",
    monthly: null,
    annual: null,
    freeUnit: "forever",
    description: "The fastest way to see Leadkaun grade your own leads. No card.",
    idealFor: "trying Leadkaun before you roll it out.",
    features: [
      "1 user · 100 active leads",
      "AI lead scoring + Lead Queue",
      "Pipeline · CSV import",
      "WhatsApp logging",
      "Mobile responsive",
    ],
    ctaLabel: "Start Free",
  },
  {
    name: "Starter",
    monthly: 2999,
    annual: 29990,
    description: "Small teams getting AI scoring and the Priority Queue live for the first time.",
    idealFor: "agencies, local businesses, and small sales teams.",
    features: [
      "Up to 10 users · 5,000 active leads",
      "Everything in Free, uncapped",
      "AI lead scoring + Smart Priority Queue",
      "Unlimited pipeline & CSV imports",
      "WhatsApp activity tracking",
      "Missed Opportunity Engine — ₹ at risk",
      "Follow-up engine + team dashboard",
      "Basic reports · Email support",
    ],
    ctaLabel: "Start Starter",
  },
  {
    name: "Growth",
    monthly: 7999,
    annual: 79990,
    description: "Built for growing teams that can't afford to let a hot lead go cold.",
    idealFor: "5–50 reps in D2C, education, real estate, healthcare, SaaS.",
    features: [
      "Up to 30 users · 25,000 active leads",
      "Everything in Starter, plus:",
      "Missed Opportunity Engine (₹ at risk)",
      "AI Learning Engine",
      "Rep scorecards + performance tracking",
      "Revenue dashboard + advanced analytics",
      "Smart lead assignment · multiple pipelines",
      "Lead source intelligence · custom fields",
      "Priority support",
    ],
    ctaLabel: "Upgrade to Growth",
    highlighted: true,
    highlightBadge: "★ Most popular",
  },
  {
    name: "Scale",
    monthly: 19999,
    annual: 199990,
    description: "For high-growth companies that need workspaces, API access and a CSM.",
    idealFor: "larger orgs standardising sales execution across teams.",
    features: [
      "Up to 75 users · unlimited leads",
      "Everything in Growth, plus:",
      "Multiple workspaces",
      "API access + webhooks",
      "Custom integrations",
      "Dedicated success manager + QBRs",
      "White-glove onboarding · custom reports",
      "Premium support + SLA · early access",
    ],
    ctaLabel: "Scale Faster",
  },
]

type Billing = "monthly" | "annual"

function Toggle({ billing, set }: { billing: Billing; set: (b: Billing) => void }) {
  return (
    <div className="mx-auto mb-10 flex w-fit items-center gap-1 rounded-full p-1 glass-2 elevate-1">
      {(["monthly", "annual"] as const).map((b) => {
        const active = billing === b
        return (
          <button
            key={b}
            type="button"
            onClick={() => set(b)}
            className="relative inline-flex items-center gap-2 rounded-full px-5 py-2 text-[13px] font-medium transition-colors"
            style={active ? { background: "linear-gradient(180deg, #38BDF8 0%, #0EA5E9 100%)", color: "#FFFFFF", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.45), 0 4px 12px rgba(14,165,233,0.30)" } : { color: "var(--ink-soft)" }}
          >
            {b === "monthly" ? "Monthly" : "Annual"}
            {b === "annual" && (
              <span className={`rounded-full px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.08em] ${active ? "bg-white/25 text-white" : "bg-emerald-100 text-emerald-600"}`}>
                Save 17%
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

function MiniCheck() {
  return (
    <span className="mt-0.5 inline-flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-full" style={{ background: "linear-gradient(180deg, #6EE7B7 0%, #34D399 100%)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), 0 1px 3px rgba(16,185,129,0.30)" }}>
      <Check className="h-3 w-3 text-white" strokeWidth={3} />
    </span>
  )
}

function TierCard({ t, billing }: { t: Tier; billing: Billing }) {
  const isFree = t.monthly === null
  const price = isFree ? "₹0" : billing === "annual" ? inr(Math.round((t.annual as number) / 12)) : inr(t.monthly as number)
  const unit = isFree ? t.freeUnit : "/month"
  const annualNote = isFree
    ? "No credit card"
    : billing === "annual"
      ? `${inr(t.annual as number)} billed yearly · save 17%`
      : `or ${inr(t.annual as number)}/yr, save 17%`
  return (
    <FloatingCard
      tier={t.highlighted ? "3" : "2"}
      depth={t.highlighted ? "3" : "2"}
      gloss
      aura={t.highlighted ? "sky" : "none"}
      className={`relative flex h-full flex-col p-6 ${t.highlighted ? "ring-2 ring-sky-300" : ""}`}
    >
      {t.highlighted && (
        <span className="absolute -top-2.5 left-6 rounded-full bg-sky-600 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-white">
          {t.highlightBadge}
        </span>
      )}
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-600">{t.name}</p>
      <p className="mt-3 flex items-baseline gap-1.5">
        <span className="font-mono text-[34px] font-semibold tracking-[-0.02em] tabular text-ink">{price}</span>
        <span className="text-[13px] text-ink-muted">{unit}</span>
      </p>
      <p className="mt-1 font-mono text-[11px] text-ink-muted">{annualNote}</p>
      <p className="mt-3.5 text-[13px] leading-[1.55] text-ink-soft lg:min-h-[61px]">{t.description}</p>
      <a
        href={APP_URLS.register}
        className={`mt-5 inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-[14px] font-semibold transition-all ${t.highlighted ? "hover:-translate-y-0.5" : "border bg-white hover:border-sky-300"}`}
        style={t.highlighted ? { background: "#0877B8", color: "#FFFFFF", boxShadow: "0 8px 20px -10px rgba(15,23,42,0.35)" } : { borderColor: "var(--paper-line-2)", color: "var(--ink)" }}
      >
        {t.ctaLabel} <ArrowRight className="h-4 w-4" />
      </a>
      <p className="mt-5 font-mono text-[10px] font-semibold uppercase leading-[1.7] tracking-[0.14em] text-ink-muted lg:min-h-[51px]">Ideal for {t.idealFor}</p>
      <ul className="mt-4 flex-1 space-y-2.5 border-t pt-4 rule-paper">
        {t.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-[13px] leading-snug text-ink-soft">
            <MiniCheck />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </FloatingCard>
  )
}

export function PricingPlans() {
  const [billing, setBilling] = useState<Billing>("monthly")
  return (
    <div>
      <Toggle billing={billing} set={setBilling} />
      <div className="grid items-stretch gap-5 lg:grid-cols-4">
        {TIERS.map((t) => <TierCard key={t.name} t={t} billing={billing} />)}
      </div>

      {/* ENTERPRISE strip */}
      <div className="mt-6 flex flex-col items-start justify-between gap-6 rounded-3xl p-8 glass-2 elevate-2 gloss-edge md:flex-row md:items-center">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3">
            <h3 className="text-[18px] font-semibold text-ink">Enterprise</h3>
            <span className="rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted" style={{ border: "1px solid var(--hairline-strong)" }}>Custom pricing</span>
          </div>
          <p className="mt-1.5 text-[14px] leading-snug text-ink-soft">
            Unlimited everything, users, workspaces and leads, on dedicated infrastructure, with custom AI models, private cloud, SSO, a custom SLA and a dedicated CSM.
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            {["Unlimited users & workspaces", "Dedicated infrastructure", "Custom AI models · private cloud", "SSO · custom SLA", "Priority engineering support"].map((f) => (
              <li key={f} className="flex items-start gap-2 text-[13px] text-ink-soft"><MiniCheck /><span>{f}</span></li>
            ))}
          </ul>
        </div>
        <Link href="/contact" className="inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl border bg-white px-6 text-[14px] font-semibold transition-colors hover:border-sky-300" style={{ borderColor: "var(--paper-line-2)", color: "var(--ink)" }}>
          Talk to sales <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
