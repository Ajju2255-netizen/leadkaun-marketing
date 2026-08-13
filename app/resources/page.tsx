import type { Metadata } from "next"
import Link from "next/link"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"

import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { ArticleHeader } from "@/app/components/reading"
import { LedgerCTA } from "@/app/components/ledger"

import { getResources } from "@/lib/pseo/lookup"

/* A toolkit shelf: grouped by what the thing physically is, with the format
   and whether it costs you an email address stated on every row. */

type ResourceEntry = {
  slug: string
  name: string
  type: "calculator" | "template" | "guide" | "checklist" | "framework" | "report"
  tagline: string
  audiencePersona: string
  gated?: boolean
}

export const metadata: Metadata = {
  title: "Leadkaun Resources Calculators, Templates, Guides for Indian Sales Teams",
  description:
    "Free calculators, Google Sheet templates, checklists, and frameworks for Indian B2B sales, lead scoring, Morning Brief, ICP definition, ₹ at risk, CRM migration.",
  alternates: { canonical: "/resources" },
}

const TYPE_ORDER = ["calculator", "template", "checklist", "framework", "guide", "report"]

const TYPE_BLURB: Record<string, string> = {
  calculator: "Put your own numbers in and get a figure out.",
  template:   "Copy it into your Drive and start filling it in.",
  checklist:  "Run it once, then run it every week.",
  framework:  "A way of thinking about the problem, on one page.",
  guide:      "Longer reads that go deeper than a blog post.",
  report:     "Our own data on how Indian B2B teams actually sell.",
}

function typeLabel(t: string) {
  return t.charAt(0).toUpperCase() + t.slice(1) + "s"
}
function prettyPersona(p: string) {
  return p.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
}

export default async function ResourcesHubPage() {
  const RESOURCES = (await getResources()) as ResourceEntry[]
  const byType = RESOURCES.reduce<Record<string, ResourceEntry[]>>((acc, r) => {
    if (!acc[r.type]) acc[r.type] = []
    acc[r.type].push(r)
    return acc
  }, {})
  const types = [
    ...TYPE_ORDER.filter((t) => byType[t]),
    ...Object.keys(byType).filter((t) => !TYPE_ORDER.includes(t)).sort(),
  ]
  const free = RESOURCES.filter((r) => !r.gated).length

  return (
    <main className="min-h-screen bg-bg-pure">
      <Navbar />

      <ArticleHeader
        kicker="Resources"
        title="Things you can use this week."
        dek="Calculators, sheet templates, checklists and frameworks for Indian B2B sales teams. Most work without Leadkaun at all — that's the point. Prove the behaviour first, buy the tool later if it's worth it."
        meta={[`${RESOURCES.length} assets`, `${free} with no email gate`, `${types.length} formats`]}
      />

      <SectionGround variant="cream" size="lg">
        <Container>
          {types.map((t, ti) => (
            <section key={t} className={ti > 0 ? "mt-16" : ""}>
              <div className="border-b pb-5" style={{ borderColor: "var(--paper-line-2)" }}>
                <div className="flex items-baseline justify-between gap-6">
                  <h2 className="text-[22px] font-semibold leading-tight tracking-[-0.02em] text-ink md:text-[26px]">
                    {typeLabel(t)}
                  </h2>
                  <span className="ledger-num text-[10px] uppercase tracking-[0.16em] text-ink-muted">
                    {byType[t].length}
                  </span>
                </div>
                {TYPE_BLURB[t] && <p className="mt-2 text-[14px] text-ink-muted">{TYPE_BLURB[t]}</p>}
              </div>

              <ul className="mt-2">
                {byType[t].map((r) => (
                  <li key={r.slug} style={{ borderBottom: "1px solid var(--paper-line)" }}>
                    <Link href={`/resources/${r.slug}`} className="group grid gap-x-8 gap-y-2 py-6 md:grid-cols-[minmax(0,1fr)_minmax(0,180px)]">
                      <div>
                        <h3 className="text-[18px] font-semibold leading-snug tracking-[-0.01em] text-ink transition-colors group-hover:text-sky-700 md:text-[19px]">
                          {r.name}
                        </h3>
                        <p className="mt-1.5 max-w-[70ch] text-[14px] leading-[1.6] text-ink-soft md:text-[15px]">{r.tagline}</p>
                      </div>
                      <div className="flex flex-wrap items-start gap-x-3 gap-y-1.5 md:justify-end">
                        <span className="ledger-num text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                          For {prettyPersona(r.audiencePersona)}
                        </span>
                        {!r.gated && (
                          <span
                            className="ledger-num rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em]"
                            style={{ color: "#047857", background: "rgba(16,185,129,0.12)" }}
                          >
                            No gate
                          </span>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </Container>
      </SectionGround>

      <LedgerCTA
        headline="Or let the software do it."
        sub="Every one of these is a manual version of something Leadkaun does automatically. Import a CSV and see the automated version on your own leads."
        secondary={{ label: "See pricing", href: "/pricing" }}
      />

      <Footer />
    </main>
  )
}
