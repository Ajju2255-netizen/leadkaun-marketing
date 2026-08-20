import Link from "next/link"
import { ArrowRight, Users, Check } from "lucide-react"

import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { NumberedTag } from "@/app/components/numbered-tag"
import { FloatingCard } from "@/app/components/floating-card"
import { Reveal } from "@/app/components/reveal"
import { APP_URLS } from "@/lib/urls"

/* Shared pricing section for use-case pages. Flat per account — source of truth
   is /pricing (plans table). Filled anchor buttons set inline color because the
   unlayered `a { color: inherit }` in globals.css overrides text-white. */

const PLANS: { name: string; price: string; unit: string; meta: string; note: string; popular?: boolean }[] = [
  { name: "Free", price: "₹0", unit: "forever", meta: "1 user · 100 active leads", note: "Watch it grade your own leads. No card." },
  { name: "Starter", price: "₹2,999", unit: "/month", meta: "Up to 10 users · 5,000 leads", note: "Adds the Missed Opportunity Engine — the ₹ going cold, priced." },
  { name: "Growth", price: "₹7,999", unit: "/month", meta: "Up to 30 users · 25,000 leads", note: "Adds rep tracking, AI Learning and advanced analytics.", popular: true },
  { name: "Scale", price: "₹19,999", unit: "/month", meta: "Up to 75 users · unlimited leads", note: "Everything, at full team size." },
]

export function UseCasePricing({
  number = "12",
  headline,
  sub,
  enterpriseNote = "Unlimited users, workspaces and leads on dedicated infrastructure, with SSO, private cloud and a success manager.",
}: {
  number?: string
  headline: string
  sub: string
  enterpriseNote?: string
}) {
  return (
    <SectionGround variant="sky" size="lg">
      <Container>
        <Reveal className="mb-10 max-w-3xl">
          <NumberedTag number={number} label="Pricing" />
          <h2 className="mt-5 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[44px]">{headline}</h2>
          <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">{sub}</p>
        </Reveal>
        <Reveal delay={0.08} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((p) => (
            <FloatingCard key={p.name} tier={p.popular ? "3" : "2"} depth={p.popular ? "3" : "2"} gloss aura={p.popular ? "sky" : "none"} className={`relative flex flex-col p-6 ${p.popular ? "ring-2 ring-sky-300" : ""}`}>
              {p.popular && <span className="absolute -top-2.5 left-6 rounded-full bg-sky-600 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-white">★ Most popular</span>}
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-600">{p.name}</p>
              <p className="mt-3 flex items-baseline gap-1.5">
                <span className="font-mono text-[30px] font-semibold tracking-[-0.02em] tabular text-ink">{p.price}</span>
                <span className="text-[12.5px] text-ink-muted">{p.unit}</span>
              </p>
              <p className="mt-2 text-[12.5px] font-medium text-ink">{p.meta}</p>
              <p className="mt-2.5 flex-1 text-[12.5px] leading-[1.55] text-ink-soft">{p.note}</p>
              <a href={APP_URLS.register} className={`mt-5 inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-[13.5px] font-semibold transition-all ${p.popular ? "hover:-translate-y-0.5" : "border bg-white hover:border-sky-300"}`} style={p.popular ? { background: "#0877B8", color: "#FFFFFF", boxShadow: "0 8px 20px -10px rgba(15,23,42,0.35)" } : { borderColor: "var(--paper-line-2)", color: "var(--ink)" }}>
                {p.name === "Free" ? "Start free" : `Start ${p.name}`} <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </FloatingCard>
          ))}
        </Reveal>
        <Reveal delay={0.12} className="mt-5">
          <FloatingCard tier="2" depth="2" gloss className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3.5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ink/[0.05] text-ink-soft"><Users className="h-5 w-5" strokeWidth={2} /></span>
              <div>
                <p className="text-[15px] font-semibold text-ink">Enterprise, more than 75 users</p>
                <p className="mt-1 text-[13px] leading-[1.55] text-ink-soft">{enterpriseNote}</p>
              </div>
            </div>
            <Link href="/pricing" className="group inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border bg-white px-5 py-2.5 text-[13.5px] font-semibold transition-colors hover:border-sky-300" style={{ borderColor: "var(--paper-line-2)", color: "var(--ink)" }}>
              Talk to sales <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </FloatingCard>
        </Reveal>
        <Reveal delay={0.16} className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5">
            {["Free forever tier", "No credit card", "Flat per account", "~17% off annual"].map((t) => (
              <span key={t} className="inline-flex items-center gap-2 text-[13px] font-medium text-ink-soft">
                <span className="grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full" style={{ background: "linear-gradient(180deg,#6EE7B7,#34D399)" }}><Check className="h-3 w-3 text-white" strokeWidth={3} /></span>
                {t}
              </span>
            ))}
          </div>
          <Link href="/pricing" className="group inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13.5px] font-semibold transition-all hover:-translate-y-0.5" style={{ background: "#0877B8", color: "#FFFFFF", boxShadow: "0 8px 20px -10px rgba(15,23,42,0.35)" }}>
            See full pricing &amp; comparison <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </Container>
    </SectionGround>
  )
}
