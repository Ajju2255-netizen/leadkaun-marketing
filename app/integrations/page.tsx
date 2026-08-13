import type { Metadata } from "next"
import Link from "next/link"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"

import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { ArticleHeader } from "@/app/components/reading"
import { LedgerCTA } from "@/app/components/ledger"

import { getIntegrations } from "@/lib/pseo/lookup"
import { breadcrumbListSchema, jsonLdScript, canonical } from "@/lib/seo"

/* A connection catalogue. Status is the first thing you see on every row —
   two thirds of this list is not shipped yet, and a directory that hides that
   is a directory that lies. */

type Status = "live" | "roadmap" | "partner-driven"
type IntegrationEntry = {
  slug: string
  name: string
  category: string
  tagline: string
  status: Status
}

export const metadata: Metadata = {
  title: "Leadkaun Integrations, Google Sheets, WhatsApp, Gmail & More",
  description:
    "Leadkaun integrates with Google Sheets, WhatsApp (manual + Gupshup/AiSensy), Gmail, Calendly, IndiaMART, Facebook Lead Ads, Razorpay, Zapier, and more.",
  alternates: { canonical: "/integrations" },
}

const CATEGORY_ORDER = ["data-source", "messaging", "email", "calendar", "payments", "other"]

const STATUS: Record<Status, { label: string; fg: string; bg: string }> = {
  "live":           { label: "Live",     fg: "#047857", bg: "rgba(16,185,129,0.12)" },
  "partner-driven": { label: "Partner",  fg: "#0369A1", bg: "rgba(8,119,184,0.10)" },
  "roadmap":        { label: "Roadmap",  fg: "#B45309", bg: "rgba(234,88,12,0.10)" },
}

export function StatusChip({ s }: { s: Status }) {
  const t = STATUS[s]
  return (
    <span
      className="ledger-num shrink-0 rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em]"
      style={{ color: t.fg, background: t.bg }}
    >
      {t.label}
    </span>
  )
}

function prettyCategory(slug: string) {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
}

export default async function IntegrationsIndexPage() {
  const ALL = (await getIntegrations()) as IntegrationEntry[]
  const byCategory = ALL.reduce<Record<string, IntegrationEntry[]>>((acc, i) => {
    if (!acc[i.category]) acc[i.category] = []
    acc[i.category].push(i)
    return acc
  }, {})
  const categories = [
    ...CATEGORY_ORDER.filter((c) => byCategory[c]),
    ...Object.keys(byCategory).filter((c) => !CATEGORY_ORDER.includes(c)).sort(),
  ]
  const counts = {
    live: ALL.filter((i) => i.status === "live").length,
    partner: ALL.filter((i) => i.status === "partner-driven").length,
    roadmap: ALL.filter((i) => i.status === "roadmap").length,
  }

  const schemas = [
    breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "Integrations" }]),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Leadkaun integrations",
      numberOfItems: ALL.length,
      itemListElement: ALL.map((i, n) => ({
        "@type": "ListItem", position: n + 1, name: i.name, url: canonical(`/integrations/${i.slug}`),
      })),
    },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(schemas) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        <ArticleHeader
          kicker="Integrations"
          title="What Leadkaun connects to."
          dek="Every connection, with its real status attached. Live means it ships today. Roadmap means it doesn't yet, and the page tells you what to do instead."
          meta={[`${counts.live} live`, `${counts.partner} partner-driven`, `${counts.roadmap} on roadmap`]}
        />

        <SectionGround variant="cream" size="lg">
          <Container>
            {/* Legend */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b pb-5" style={{ borderColor: "var(--paper-line-2)" }}>
              <span className="inline-flex items-center gap-2"><StatusChip s="live" /><span className="text-[12px] text-ink-muted">Ships today</span></span>
              <span className="inline-flex items-center gap-2"><StatusChip s="partner-driven" /><span className="text-[12px] text-ink-muted">Via a partner account</span></span>
              <span className="inline-flex items-center gap-2"><StatusChip s="roadmap" /><span className="text-[12px] text-ink-muted">Not built yet</span></span>
            </div>

            {categories.map((c, ci) => (
              <section key={c} className={ci > 0 ? "mt-14" : "mt-12"}>
                <h2 className="text-[20px] font-semibold leading-tight tracking-[-0.02em] text-ink md:text-[24px]">
                  {prettyCategory(c)}
                </h2>
                <ul className="mt-5 border-t" style={{ borderColor: "var(--paper-line-2)" }}>
                  {byCategory[c].map((i) => (
                    <li key={i.slug} style={{ borderBottom: "1px solid var(--paper-line)" }}>
                      <Link href={`/integrations/${i.slug}`} className="group grid gap-x-8 gap-y-1.5 py-5 md:grid-cols-[minmax(0,240px)_minmax(0,1fr)]">
                        <div className="flex items-center gap-3">
                          <span className="text-[16px] font-semibold leading-snug text-ink transition-colors group-hover:text-sky-700">
                            {i.name}
                          </span>
                          <StatusChip s={i.status} />
                        </div>
                        <p className="text-[14px] leading-[1.6] text-ink-soft md:text-[15px]">{i.tagline}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </Container>
        </SectionGround>

        <LedgerCTA
          headline="CSV works with everything, today."
          sub="Whatever you use, you can export a CSV and have every lead graded A–F within the hour. The connectors just save you the export."
          secondary={{ label: "See the product", href: "/product" }}
        />

        <Footer />
      </main>
    </>
  )
}
