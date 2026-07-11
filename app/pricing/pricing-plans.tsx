"use client"

import { useState } from "react"
import Link from "next/link"
import { Check } from "lucide-react"
import { PricingTier } from "@/app/components/pricing-tier"
import { APP_URLS } from "@/lib/urls"

const inr = (n: number) => `₹${new Intl.NumberFormat("en-IN").format(n)}`

type PaidTier = {
  name: string
  monthly: number
  annual: number
  description: string
  idealFor: string
  features: string[]
  ctaLabel: string
  highlighted?: boolean
  highlightBadge?: string
}

// Paid tiers. `monthly` is the sticker price; `annual` is billed once/year at
// ~17% off (two months free). Effective monthly on annual = round(annual/12).
const PAID: PaidTier[] = [
  {
    name: "Starter",
    monthly: 2999,
    annual: 29990,
    description: "Small teams getting AI scoring and the Priority Queue live for the first time.",
    idealFor: "agencies, local businesses, and small sales teams.",
    features: [
      "Up to 10 users · 5,000 leads/month",
      "Everything in Free, uncapped",
      "AI lead scoring + Smart Priority Queue",
      "Unlimited pipeline & CSV imports",
      "WhatsApp activity tracking",
      "Follow-up engine + team dashboard",
      "Basic reports · Email support",
    ],
    ctaLabel: "Start Starter",
  },
  {
    name: "Growth",
    monthly: 7999,
    annual: 79990,
    description: "Built for growing sales teams that can't afford to let a hot lead go cold.",
    idealFor: "5–50 reps in D2C, education, real estate, healthcare, SaaS.",
    features: [
      "Up to 30 users · 25,000 leads/month",
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
    description: "Built for high-growth companies that need workspaces, API access and a CSM.",
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
            className={`relative inline-flex items-center gap-2 rounded-full px-5 py-2 text-[13px] font-medium transition-colors ${
              active ? "text-white" : "text-ink-soft hover:text-ink"
            }`}
            style={
              active
                ? {
                    background: "linear-gradient(180deg, #38BDF8 0%, #0EA5E9 100%)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.45), 0 4px 12px rgba(14,165,233,0.30)",
                  }
                : undefined
            }
          >
            {b === "monthly" ? "Monthly" : "Annual"}
            {b === "annual" && (
              <span
                className={`rounded-full px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.08em] ${
                  active ? "bg-white/25 text-white" : "bg-mint-300/25 text-mint-500"
                }`}
              >
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
    <span
      className="mt-0.5 inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full"
      style={{
        background: "linear-gradient(180deg, #6EE7B7 0%, #34D399 100%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), 0 1px 3px rgba(16,185,129,0.30)",
      }}
    >
      <Check className="h-3 w-3 text-white" strokeWidth={3} />
    </span>
  )
}

export function PricingPlans() {
  const [billing, setBilling] = useState<Billing>("monthly")

  return (
    <div>
      <Toggle billing={billing} set={setBilling} />

      {/* Free + 3 paid tiers */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* FREE */}
        <PricingTier
          name="Free"
          price="₹0"
          priceUnit="for 14 days"
          description="The fastest way to see Leadkaun grade your own leads. No card."
          idealFor="trying Leadkaun before you roll it out."
          features={[
            "1 user · 100 leads",
            "AI lead scoring + Lead Queue",
            "Pipeline · CSV import",
            "WhatsApp logging",
            "Mobile responsive",
            "Email support",
          ]}
          ctaLabel="Start Free"
          ctaHref={APP_URLS.register}
        />

        {PAID.map((p) => {
          const effMonthly = Math.round(p.annual / 12)
          const price = billing === "annual" ? inr(effMonthly) : inr(p.monthly)
          const annualNote =
            billing === "annual"
              ? `${inr(p.annual)} billed yearly · save 17%`
              : `or ${inr(p.annual)}/yr — save 17%`
          return (
            <PricingTier
              key={p.name}
              name={p.name}
              price={price}
              priceUnit="/month"
              annualNote={annualNote}
              description={p.description}
              idealFor={p.idealFor}
              features={p.features}
              ctaLabel={p.ctaLabel}
              ctaHref={APP_URLS.register}
              highlighted={p.highlighted ?? false}
              highlightBadge={p.highlightBadge ?? "Most popular"}
            />
          )
        })}
      </div>

      {/* ENTERPRISE strip */}
      <div className="mt-6 flex flex-col items-start justify-between gap-6 rounded-3xl p-8 glass-2 elevate-2 gloss-edge md:flex-row md:items-center">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3">
            <h3 className="text-[18px] font-semibold text-ink">Enterprise</h3>
            <span
              className="rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted"
              style={{ border: "1px solid var(--hairline-strong)" }}
            >
              Custom pricing
            </span>
          </div>
          <p className="mt-1.5 text-[14px] leading-snug text-ink-soft">
            Unlimited everything — users, workspaces and leads — on dedicated infrastructure, with
            custom AI models, private cloud, SSO, a custom SLA and a dedicated CSM.
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            {[
              "Unlimited users & workspaces",
              "Dedicated infrastructure",
              "Custom AI models · private cloud",
              "SSO · custom SLA",
              "Priority engineering support",
            ].map((f) => (
              <li key={f} className="flex items-start gap-2 text-[13px] text-ink-soft">
                <MiniCheck />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
        <Link
          href="/contact"
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl px-6 text-[14px] font-medium btn-gloss-glass shimmer-on-hover relative"
        >
          <span className="relative z-[2]">Talk to Sales</span>
        </Link>
      </div>

      <p className="mt-6 text-center text-[13px] text-ink-muted">
        Prices in ₹, GST-compliant invoices. Upgrade, downgrade or cancel anytime — billing adjusts
        pro-rata.
      </p>
    </div>
  )
}
