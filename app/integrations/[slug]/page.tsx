import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowUpRight, Check, ExternalLink } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"

import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { Faq } from "@/app/components/faq"
import { LedgerCTA } from "@/app/components/ledger"
import { MEASURE } from "@/app/components/reading"

import { getIntegrations } from "@/lib/pseo/lookup"
import { breadcrumbListSchema, productSchema, faqPageSchema, jsonLdScript } from "@/lib/seo"

export const revalidate = 86400

/* A wiring page: the connection itself is the headline (Leadkaun ⇄ X), the
   status sits next to it, and if it is not built yet the page says so above
   the fold and tells you what to do today instead. */

type Status = "live" | "roadmap" | "partner-driven"
type IntegrationEntry = {
  slug: string; name: string; partnerUrl: string | null; category: string
  tagline: string; description: string
  setupSteps: { heading: string; body: string }[]; useCases: string[]
  faqs: { q: string; a: string }[]; relatedIntegrations?: string[]; relatedFeatures?: string[]
  status: Status
}

const STATUS: Record<Status, { label: string; fg: string; bg: string; note: string }> = {
  "live": {
    label: "Live", fg: "#047857", bg: "rgba(16,185,129,0.12)",
    note: "Shipping today. Set it up in the steps below.",
  },
  "partner-driven": {
    label: "Partner", fg: "#0369A1", bg: "rgba(8,119,184,0.10)",
    note: "Works through your own account with the partner, not a Leadkaun-built connector.",
  },
  "roadmap": {
    label: "On roadmap", fg: "#B45309", bg: "rgba(234,88,12,0.10)",
    note: "Not built yet. CSV import covers the same job today, and this page shows you how.",
  },
}

function StatusChip({ s, large = false }: { s: Status; large?: boolean }) {
  const t = STATUS[s]
  return (
    <span
      className={`ledger-num shrink-0 rounded-md font-bold uppercase tracking-[0.14em] ${large ? "px-2.5 py-1 text-[10px]" : "px-2 py-0.5 text-[9px]"}`}
      style={{ color: t.fg, background: t.bg }}
    >
      {t.label}
    </span>
  )
}

export async function generateStaticParams() {
  const list = (await getIntegrations()) as IntegrationEntry[]
  return list.map((i) => ({ slug: i.slug }))
}

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const list = (await getIntegrations()) as IntegrationEntry[]
  const entry = list.find((i) => i.slug === slug)
  if (!entry) return {}
  return {
    title: `Leadkaun + ${entry.name} Integration | Setup & Use Cases`,
    description: entry.tagline.slice(0, 155),
    alternates: { canonical: `/integrations/${entry.slug}` },
    // Only shipped integrations are indexable. Roadmap / partner-driven pages
    // describe planned functionality — keep them (badged "On roadmap") but don't
    // index, so we never rank for a capability we don't ship yet.
    robots: entry.status === "live" ? undefined : { index: false, follow: true },
  }
}

function pretty(slug: string) {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
}

export default async function IntegrationPage({ params }: Params) {
  const { slug } = await params
  const list = (await getIntegrations()) as IntegrationEntry[]
  const entry = list.find((i) => i.slug === slug)
  if (!entry) notFound()

  const related = (entry.relatedIntegrations ?? [])
    .map((s) => list.find((i) => i.slug === s))
    .filter((i): i is IntegrationEntry => i !== undefined)
  const status = STATUS[entry.status]

  const schemas = [
    breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "Integrations", url: "/integrations" }, { name: entry.name }]),
    productSchema({
      name: `Leadkaun + ${entry.name}`,
      description: entry.tagline,
      url: `/integrations/${entry.slug}`,
    }),
    faqPageSchema(entry.faqs),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(schemas) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        {/* THE CONNECTION */}
        <SectionGround variant="pure" size="sm" ambient={false} className="pt-28 md:pt-32">
          <Container>
            <nav aria-label="Breadcrumb" className="ledger-num text-[11px] uppercase tracking-[0.16em] text-ink-muted">
              <Link href="/integrations" className="hover:text-sky-700">Integrations</Link>
              <span aria-hidden className="mx-2 text-ink-faint">/</span>
              <span>{pretty(entry.category)}</span>
            </nav>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <h1 className="flex flex-wrap items-baseline gap-x-4 text-[34px] leading-[1.05] tracking-[-0.03em] text-ink md:text-[52px]">
                <span>Leadkaun</span>
                <span aria-hidden className="ledger-num text-[20px] text-ink-faint md:text-[26px]">+</span>
                <span className="hero-accent">{entry.name}</span>
              </h1>
              <StatusChip s={entry.status} large />
            </div>

            <p className={`mt-6 text-[18px] leading-[1.6] text-ink-soft md:text-[20px] ${MEASURE}`}>{entry.tagline}</p>

            {/* Honest status banner */}
            <div
              className={`mt-8 rounded-xl px-5 py-4 ${MEASURE}`}
              style={{ background: "var(--paper)", border: "1px solid var(--paper-line)" }}
            >
              <p className="text-[14px] leading-[1.6] text-ink-soft">
                <span className="ledger-num mr-2 text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: status.fg }}>
                  {status.label}
                </span>
                {status.note}
              </p>
            </div>

            {entry.partnerUrl && (
              <a
                href={entry.partnerUrl}
                target="_blank"
                rel="noopener nofollow"
                className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-sky-700 hover:text-sky-600"
              >
                Visit {entry.name} <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </Container>
        </SectionGround>

        {/* WHAT IT DOES + WHAT YOU CAN DO */}
        <SectionGround variant="pure" size="md">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:gap-16">
              <div>
                <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">What it does</p>
                <p className="mt-4 text-[17px] leading-[1.75] text-ink-soft md:text-[18px]">{entry.description}</p>
              </div>

              {entry.useCases.length > 0 && (
                <aside
                  className="h-fit rounded-2xl bg-[color:var(--paper)] p-6 md:p-7"
                  style={{ border: "1px solid var(--paper-line)" }}
                >
                  <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">Typical uses</p>
                  <ul className="mt-4 space-y-3">
                    {entry.useCases.map((u, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[14px] leading-[1.55] text-ink-soft">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2.5} aria-hidden />
                        <span>{u}</span>
                      </li>
                    ))}
                  </ul>
                </aside>
              )}
            </div>
          </Container>
        </SectionGround>

        {/* WIRING IT UP */}
        {entry.setupSteps.length > 0 && (
          <SectionGround variant="cream" size="lg">
            <Container>
              <div className="mb-10">
                <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">Wiring it up</p>
                <h2 className="mt-4 text-[26px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[34px]">
                  {entry.setupSteps.length} steps, start to finish.
                </h2>
              </div>
              <ol className="border-t" style={{ borderColor: "var(--paper-line-2)" }}>
                {entry.setupSteps.map((s, i) => (
                  <li
                    key={i}
                    className="grid gap-x-8 gap-y-2 py-6 md:grid-cols-[minmax(0,56px)_minmax(0,300px)_minmax(0,1fr)]"
                    style={{ borderBottom: "1px solid var(--paper-line)" }}
                  >
                    <span className="ledger-num text-[13px] font-semibold text-sky-700 tabular md:pt-0.5 md:text-[15px]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-[17px] font-semibold leading-snug tracking-[-0.01em] text-ink md:text-[18px]">{s.heading}</h3>
                    <p className="col-start-1 text-[14px] leading-[1.6] text-ink-soft md:col-start-3 md:text-[15px]">{s.body}</p>
                  </li>
                ))}
              </ol>
            </Container>
          </SectionGround>
        )}

        {/* FAQ */}
        {entry.faqs.length > 0 && (
          <SectionGround variant="pure" size="md">
            <Container>
              <div className="grid gap-12 lg:grid-cols-[minmax(0,168px)_minmax(0,1fr)] lg:gap-x-10">
                <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted lg:pt-1.5">Questions</p>
                <Faq items={entry.faqs} className="!mx-0 !max-w-[68ch]" />
              </div>
            </Container>
          </SectionGround>
        )}

        {/* NEARBY CONNECTIONS */}
        {(related.length > 0 || entry.relatedFeatures?.length) && (
          <SectionGround variant="cream" size="md">
            <Container>
              <div className="grid gap-12 lg:grid-cols-[minmax(0,168px)_minmax(0,1fr)] lg:gap-x-10">
                <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted lg:pt-1.5">Nearby</p>
                <div className="space-y-10">
                  {related.length > 0 && (
                    <ul className="border-t" style={{ borderColor: "var(--paper-line)" }}>
                      {related.map((r) => (
                        <li key={r.slug} style={{ borderBottom: "1px solid var(--paper-line)" }}>
                          <Link href={`/integrations/${r.slug}`} className="group grid gap-x-8 gap-y-1 py-3.5 md:grid-cols-[minmax(0,220px)_minmax(0,1fr)]">
                            <span className="flex items-center gap-3">
                              <span className="text-[15px] font-semibold text-ink group-hover:text-sky-700">{r.name}</span>
                              <StatusChip s={r.status} />
                            </span>
                            <span className="line-clamp-1 text-[14px] text-ink-soft">{r.tagline}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  {entry.relatedFeatures && entry.relatedFeatures.length > 0 && (
                    <ul className="border-t" style={{ borderColor: "var(--paper-line)" }}>
                      {entry.relatedFeatures.map((f) => (
                        <li key={f} style={{ borderBottom: "1px solid var(--paper-line)" }}>
                          <Link href={`/features/${f}`} className="group flex items-baseline justify-between gap-4 py-3">
                            <span className="text-[15px] text-ink group-hover:text-sky-700">
                              <span className="ledger-num mr-3 text-[9px] uppercase tracking-[0.16em] text-ink-muted">Feature</span>
                              {pretty(f)}
                            </span>
                            <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-ink-faint group-hover:text-sky-700" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </Container>
          </SectionGround>
        )}

        <LedgerCTA
          headline={entry.status === "live" ? `Connect ${entry.name} today.` : "CSV works today, regardless."}
          sub={entry.status === "live"
            ? "Start free and wire it up in minutes. Every lead that arrives comes back graded A–F with a ranked queue per rep."
            : `Until the ${entry.name} connector ships, a CSV export does the same job. Import it and every lead comes back graded A–F.`}
          secondary={{ label: "All integrations", href: "/integrations" }}
        />

        <Footer />
      </main>
    </>
  )
}
