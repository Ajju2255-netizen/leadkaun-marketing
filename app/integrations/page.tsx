import type { Metadata } from "next"
import Link from "next/link"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
import { ProductBlock } from "@/app/components/sell/blocks"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { PageHero } from "@/app/components/page-hero"
import { NumberedTag } from "@/app/components/numbered-tag"
import { Reveal } from "@/app/components/reveal"

import { getIntegrations } from "@/lib/pseo/lookup"

type IntegrationEntry = {
  slug: string
  name: string
  category: string
  tagline: string
  status: "live" | "roadmap" | "partner-driven"
}

export const metadata: Metadata = {
  title: "Leadkaun Integrations — Google Sheets, WhatsApp, Gmail & More",
  description:
    "Leadkaun integrates with Google Sheets, WhatsApp (manual + Gupshup/AiSensy), Gmail, Calendly, IndiaMART, Facebook Lead Ads, Razorpay, Zapier, and more.",
  alternates: { canonical: "/integrations" },
}

const CATEGORY_ORDER = ["data-source", "messaging", "email", "calendar", "payments", "other"]

function statusBadge(s: IntegrationEntry["status"]) {
  if (s === "live") {
    return (
      <span
        className="shrink-0 rounded-full px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white"
        style={{
          background: "linear-gradient(180deg, #6EE7B7 0%, #34D399 100%)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(16,185,129,0.30)",
        }}
      >Live</span>
    )
  }
  if (s === "partner-driven") {
    return (
      <span
        className="shrink-0 rounded-full px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white"
        style={{
          background: "linear-gradient(180deg, #38BDF8 0%, #0EA5E9 100%)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(14,165,233,0.30)",
        }}
      >Partner</span>
    )
  }
  return (
    <span className="shrink-0 rounded-full glass-1 gloss-edge px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
      Roadmap
    </span>
  )
}

function prettyCategory(slug: string) {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
}

export default async function IntegrationsIndexPage() {
  const INTEGRATIONS = (await getIntegrations()) as IntegrationEntry[]
  const byCategory = INTEGRATIONS.reduce<Record<string, IntegrationEntry[]>>((acc, i) => {
    if (!acc[i.category]) acc[i.category] = []
    acc[i.category].push(i)
    return acc
  }, {})

  const sortedCats = Object.keys(byCategory).sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a)
    const bi = CATEGORY_ORDER.indexOf(b)
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
  })

  const liveCount = INTEGRATIONS.filter((i) => i.status === "live").length

  return (
    <main className="min-h-screen bg-bg-pure">
      <Navbar />

      <PageHero
        eyebrow={`${INTEGRATIONS.length} integrations · ${liveCount} live`}
        h1={<>Plug into the stack you <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(95deg, #0EA5E9 0%, #FB923C 100%)" }}>already run.</span></>}
        sub="Leadkaun connects with the tools Indian B2B sales teams already use — Google Sheets, WhatsApp (manual + BSP), Gmail, Calendly, IndiaMART, Razorpay, Zapier. No rip-and-replace, no broken pipelines."
        center={false}
        primary={undefined}
        meta={
          <span className="inline-flex flex-wrap justify-start gap-1.5 normal-case tracking-normal">
            {sortedCats.map((c) => (
              <a
                key={c}
                href={`#cat-${c}`}
                className="inline-flex h-8 items-center rounded-full glass-1 gloss-edge px-3 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft transition-all hover:text-sky-600 lift"
              >
                {prettyCategory(c)}
              </a>
            ))}
          </span>
        }
      />

      <SectionGround variant="cream" size="lg">
        <Container>
          {sortedCats.map((cat, idx) => (
            <section key={cat} id={`cat-${cat}`} className={idx === 0 ? "" : "mt-14"}>
              <Reveal className="mb-6">
                <NumberedTag
                  number={String(idx + 1).padStart(2, "0")}
                  tone={idx % 2 === 1 ? "warm" : "default"}
                  label={`${prettyCategory(cat)} · ${byCategory[cat].length} ${byCategory[cat].length === 1 ? "integration" : "integrations"}`}
                />
              </Reveal>
              <Reveal delay={0.08} className="grid gap-4 md:grid-cols-2 md:gap-5">
                {byCategory[cat].map((i) => (
                  <Link
                    key={i.slug}
                    href={`/integrations/${i.slug}`}
                    className="group rounded-2xl p-5 md:p-6 glass-2 gloss-edge elevate-1 lift aura-sky-hover transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-[16px] font-semibold text-ink group-hover:text-sky-600 transition-colors">
                        {i.name}
                      </p>
                      {statusBadge(i.status)}
                    </div>
                    <p className="mt-2 line-clamp-2 text-[13px] leading-[1.6] text-ink-soft">{i.tagline}</p>
                  </Link>
                ))}
              </Reveal>
            </section>
          ))}
        </Container>
      </SectionGround>

      <ProductBlock />

      <CTABanner />
      <Footer />
    </main>
  )
}
