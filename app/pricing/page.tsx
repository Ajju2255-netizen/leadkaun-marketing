import type { Metadata } from "next"
import Link from "next/link"
import { Check, Minus } from "lucide-react"
import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { PageHero } from "@/app/components/page-hero"
import { NumberedTag } from "@/app/components/numbered-tag"
import { PricingTier } from "@/app/components/pricing-tier"
import { FloatingCard } from "@/app/components/floating-card"
import { Faq } from "@/app/components/faq"
import { Reveal } from "@/app/components/reveal"
import { APP_URLS } from "@/lib/urls"

export const metadata: Metadata = {
  title: "Pricing in ₹ — No CRM Tax",
  description:
    "Leadkaun pricing in Indian Rupees. Per-rep pricing, no annual lock-in for starters, no USD bills. Plans for sales teams of all sizes.",
  alternates: { canonical: "/pricing" },
}

const PLANS = [
  {
    name: "Starter",
    description: "Small teams getting lead scoring and Priority Queue live for the first time.",
    price: "₹999",
    features: [
      "Up to 10 reps", "All 12 core modules", "Google Sheets + CSV ingestion",
      "Morning Brief email (8:30 AM IST)", "3-tap WhatsApp logging",
      "Basic analytics", "Email support",
    ],
    ctaLabel: "Start free trial",
    ctaHref: APP_URLS.register,
  },
  {
    name: "Growth",
    description: "Most Indian SMBs (10–30 reps). Full behaviour system with custom ICPs.",
    price: "₹1,999",
    features: [
      "Up to 30 reps", "Everything in Starter", "Missed Opportunity Engine (₹ at risk)",
      "Custom ICP weights per pipeline", "WhatsApp BSP integrations",
      "Advanced analytics + loss analysis", "Priority support",
    ],
    ctaLabel: "Start free trial",
    ctaHref: APP_URLS.register,
    highlighted: true,
  },
  {
    name: "Scale",
    description: "Scaling teams (30–50 reps) wanting admin, assignment rules, audit export.",
    price: "₹2,999",
    features: [
      "Up to 50 reps", "Everything in Growth", "Role-based permissions",
      "Assignment rules + unassigned queue", "Compliance audit export",
      "API access", "Dedicated onboarding", "SLA-based support",
    ],
    ctaLabel: "Contact sales",
    ctaHref: "/contact",
  },
]

const FEATURE_MATRIX: {
  category: string
  rows: { label: string; starter: boolean | string; growth: boolean | string; scale: boolean | string }[]
}[] = [
  {
    category: "Core behaviour layer",
    rows: [
      { label: "Lead scoring (Grade A–F)",  starter: true,  growth: true, scale: true },
      { label: "Priority Queue",            starter: true,  growth: true, scale: true },
      { label: "3-tap WhatsApp logging",    starter: true,  growth: true, scale: true },
      { label: "Morning Brief email",       starter: true,  growth: true, scale: true },
      { label: "Missed Opportunity Engine", starter: false, growth: true, scale: true },
      { label: "Custom ICP weights",        starter: false, growth: true, scale: true },
    ],
  },
  {
    category: "Team & admin",
    rows: [
      { label: "Seat cap",                 starter: "10",  growth: "30",   scale: "50" },
      { label: "Role-based permissions",   starter: false, growth: false,  scale: true },
      { label: "Assignment rules",         starter: false, growth: true,   scale: true },
      { label: "Compliance audit export",  starter: false, growth: false,  scale: true },
    ],
  },
  {
    category: "Integrations",
    rows: [
      { label: "Google Sheets sync",                 starter: true,  growth: true, scale: true },
      { label: "CSV import (10k/min)",               starter: true,  growth: true, scale: true },
      { label: "WhatsApp BSP (Gupshup/AiSensy)",     starter: false, growth: true, scale: true },
      { label: "Calendar + Calendly",                starter: false, growth: true, scale: true },
      { label: "API access",                         starter: false, growth: false, scale: true },
    ],
  },
  {
    category: "Support",
    rows: [
      { label: "Email support",        starter: true,  growth: true,  scale: true },
      { label: "Priority support",     starter: false, growth: true,  scale: true },
      { label: "Dedicated onboarding", starter: false, growth: false, scale: true },
      { label: "SLA",                  starter: false, growth: false, scale: "99.9%" },
    ],
  },
]

const FAQ = [
  { q: "Is there a free trial?", a: "Yes. 14 days, full Growth-tier feature access, no credit card required. Import your leads, grade them, work the queue. If it doesn't recover ₹ in 14 days, don't pay." },
  { q: "Do you charge in USD?", a: "No. All pricing is in Indian Rupees (INR). Invoices are GST-compliant." },
  { q: "Can I change plans later?", a: "Yes. Upgrade or downgrade at any time. Billing adjusts pro-rata." },
  { q: "What counts as a 'rep'?", a: "Any user with the Sales Rep role — someone who gets assigned leads and logs outcomes. Admins and managers are not counted toward the seat cap." },
  { q: "Is there an annual discount?", a: "Yes — 10% off on annual billing across all tiers. Contact sales for a formal quote." },
  { q: "Can we self-host or run on-prem?", a: "Not today. Leadkaun is a hosted SaaS on Supabase (Singapore region). Enterprise on-prem is on roadmap for Scale tier with sufficient demand." },
]

function MintCheck() {
  return (
    <span
      className="inline-flex h-5 w-5 items-center justify-center rounded-full"
      style={{
        background: "linear-gradient(180deg, #6EE7B7 0%, #34D399 100%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), 0 1px 3px rgba(16,185,129,0.30)",
      }}
    >
      <Check className="h-3 w-3 text-white" strokeWidth={3} />
    </span>
  )
}

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-bg-pure">
      <Navbar />

      <PageHero
        eyebrow="Pricing"
        h1={
          <>
            Per rep. In rupees.<br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(95deg, #0EA5E9 0%, #FB923C 100%)" }}
            >
              No contact fees.
            </span>
          </>
        }
        sub="All 12 core modules on every tier. 14-day free trial, no credit card. Annual billing saves 10%."
        primary={{ kind: "primary", label: "Start free trial", href: APP_URLS.register, external: true }}
        secondary={{ kind: "text", label: "How it works", href: "/how-it-works" }}
      />

      {/* TIERS */}
      <SectionGround variant="cream" size="md">
        <Container>
          <Reveal className="grid gap-6 md:grid-cols-3">
            {PLANS.map((p) => (
              <PricingTier key={p.name} {...p} />
            ))}
          </Reveal>
        </Container>
      </SectionGround>

      {/* FEATURE MATRIX */}
      <SectionGround variant="sky" size="lg">
        <Container>
          <Reveal className="mb-12">
            <NumberedTag number="02" label="Full comparison" />
            <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">
              Everything in each plan.
            </h2>
          </Reveal>

          <Reveal delay={0.08}><FloatingCard tier="3" depth="3" gloss className="overflow-hidden">
            <div
              className="grid grid-cols-[1.4fr_1fr_1fr_1fr]"
              style={{ borderBottom: "1px solid var(--hairline-strong)" }}
            >
              <div className="px-6 py-5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                Feature
              </div>
              {["Starter", "Growth", "Scale"].map((p, i) => (
                <div
                  key={p}
                  className={`px-6 py-5 text-center text-[13px] font-bold uppercase tracking-[0.14em] ${
                    i === 1 ? "text-sky-600" : "text-ink"
                  }`}
                  style={i === 1 ? { background: "linear-gradient(180deg, rgba(186,230,253,0.30) 0%, transparent 100%)" } : undefined}
                >
                  {p}
                </div>
              ))}
            </div>

            {FEATURE_MATRIX.map((section) => (
              <div key={section.category}>
                <div
                  className="grid grid-cols-[1.4fr_1fr_1fr_1fr]"
                  style={{
                    borderBottom: "1px solid var(--hairline)",
                    background: "linear-gradient(180deg, rgba(186,230,253,0.18) 0%, rgba(186,230,253,0.04) 100%)",
                  }}
                >
                  <div className="col-span-4 px-6 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-600">
                    {section.category}
                  </div>
                </div>
                {section.rows.map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-[1.4fr_1fr_1fr_1fr] hover:bg-sky-50/40 transition-colors"
                    style={{ borderBottom: "1px solid var(--hairline)" }}
                  >
                    <div className="px-6 py-4 text-[14px] text-ink">
                      {row.label}
                    </div>
                    {[row.starter, row.growth, row.scale].map((v, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-center px-6 py-4"
                        style={i === 1 ? { background: "linear-gradient(90deg, rgba(186,230,253,0.18) 0%, rgba(186,230,253,0.04) 100%)" } : undefined}
                      >
                        {v === true ? <MintCheck /> : v === false ? (
                          <Minus className="h-4 w-4 text-ink-faint" strokeWidth={2} />
                        ) : (
                          <span className="font-mono text-[13px] font-semibold text-ink tabular">{v}</span>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </FloatingCard></Reveal>

          <p className="mt-6 text-center text-[13px] text-ink-muted">
            Need something custom or more than 50 reps?{" "}
            <Link href="/contact" className="text-sky-600 underline-offset-4 hover:underline">
              Talk to sales
            </Link>
            .
          </p>
        </Container>
      </SectionGround>

      {/* FAQ */}
      <SectionGround variant="cream" size="md">
        <Container>
          <Reveal className="mx-auto mb-10 max-w-3xl text-center">
            <div className="flex justify-center">
              <NumberedTag number="03" tone="warm" label="FAQ" />
            </div>
            <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[40px]">
              Common pricing questions.
            </h2>
          </Reveal>
          <Reveal delay={0.08}><Faq items={FAQ} /></Reveal>
        </Container>
      </SectionGround>

      <CTABanner
        tag={{ number: "04", label: "Ready when you are" }}
        headline="Try the Growth plan. Free for 14 days."
        sub="Full feature access. No credit card. Setup in 60 minutes."
      />

      <Footer />
    </main>
  )
}
