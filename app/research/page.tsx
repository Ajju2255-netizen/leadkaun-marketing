import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { ArticleHeader, MEASURE, slugify } from "@/app/components/reading"
import { LedgerCTA } from "@/app/components/ledger"
import { getResearch } from "@/lib/pseo/lookup"

export const revalidate = 86400

export const metadata: Metadata = {
  title: "Leadkaun Research. Sourced Sales & Lead-Management Data Reports",
  description:
    "Original, fully-sourced benchmark reports on B2B sales, lead response time, follow-up, and WhatsApp adoption in India. Every figure cited to its research.",
  alternates: { canonical: "/research" },
}

type Stat = { claim: string; figure: string; source: string; url: string; year: string }
type Report = {
  slug: string; h1: string; dek: string; updated: string
  sections?: { heading: string; stats: Stat[] }[]
  keyFindings?: string[]
}

/**
 * Source names carry their study title and sample size ("MIT (Dr. James
 * Oldroyd) & InsideSales.com, Lead Response Management Study (15,000+ leads)").
 * The figure tiles only have room for the institution — the full attribution
 * lives on the report itself.
 */
function shortSource(s: string): string {
  return s.split(",")[0].replace(/\s*\([^)]*\)/g, "").trim()
}

export default async function ResearchHub() {
  const reports = (await getResearch()) as Report[]
  const [lead, ...archive] = reports

  const stats = (lead?.sections ?? []).flatMap((s) => s.stats)
  const sources = new Set(stats.map((s) => s.url))
  const headline = stats.slice(0, 4)

  return (
    <main className="min-h-screen bg-bg-pure">
      <Navbar />

      <ArticleHeader
        kicker="Research"
        title="Sales data, honestly sourced."
        dek="We publish benchmark reports on how B2B sales actually works. Every figure carries a numbered citation to its original study, and where a widely-quoted stat can't be traced back to real research, we say so instead of repeating it."
        meta={[
          `${reports.length} ${reports.length === 1 ? "report" : "reports"}`,
          `${sources.size} sources cited`,
          "Free, no signup",
        ]}
      />

      {/* THE CURRENT REPORT — the library has one thing in it, so the page is
          that thing, not a one-row list with an empty shelf under it. */}
      {lead && (
        <SectionGround variant="cream" size="lg">
          <Container>
            <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
              Current report
            </p>

            <div className="mt-6 grid gap-12 border-t pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)] lg:gap-16" style={{ borderColor: "var(--paper-line-2)" }}>
              <div>
                <Link href={`/research/${lead.slug}`} className="group block">
                  <h2 className="display-md max-w-[20ch] text-[30px] text-ink transition-colors group-hover:text-sky-700 md:text-[44px]">
                    {lead.h1}
                  </h2>
                </Link>
                <p className={`mt-6 text-[17px] leading-[1.7] text-ink-soft md:text-[18px] ${MEASURE}`}>{lead.dek}</p>

                {/* Headline figures — the findings, not just the title */}
                {headline.length > 0 && (
                  <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl sm:grid-cols-4" style={{ background: "var(--paper-line)" }}>
                    {headline.map((f) => (
                      <div key={f.url + f.figure} className="bg-white px-5 py-5">
                        <dt className="ledger-num text-[22px] font-semibold leading-none tracking-[-0.02em] text-ink tabular md:text-[26px]">
                          {f.figure}
                        </dt>
                        <dd className="ledger-num mt-2 text-[9px] uppercase leading-[1.5] tracking-[0.14em] text-ink-muted">
                          {shortSource(f.source)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}

                <Link
                  href={`/research/${lead.slug}`}
                  className="btn-gloss-primary mt-9 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-[14px] font-semibold"
                  style={{ color: "#FFFFFF" }}
                >
                  Read the report <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Contents — jump straight into a finding */}
              {lead.sections && lead.sections.length > 0 && (
                <aside className="lg:pt-2">
                  <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
                    What&apos;s inside
                  </p>
                  <ol className="mt-4 border-t" style={{ borderColor: "var(--paper-line)" }}>
                    {lead.sections.map((s, i) => (
                      <li key={s.heading} style={{ borderBottom: "1px solid var(--paper-line)" }}>
                        <Link
                          href={`/research/${lead.slug}#${slugify(s.heading)}`}
                          className="group grid grid-cols-[28px_minmax(0,1fr)] gap-x-3 py-3"
                        >
                          <span className="ledger-num pt-0.5 text-[10px] text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
                          <span className="text-[14px] leading-[1.45] text-ink-soft group-hover:text-sky-700">{s.heading}</span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                  <p className="ledger-num mt-4 text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                    Updated {lead.updated} · {sources.size} sources
                  </p>
                </aside>
              )}
            </div>
          </Container>
        </SectionGround>
      )}

      {/* ARCHIVE — only renders once there is more than one report */}
      {archive.length > 0 && (
        <SectionGround variant="pure" size="lg">
          <Container>
            <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">Archive</p>
            <ol className="mt-6 border-t" style={{ borderColor: "var(--paper-line-2)" }}>
              {archive.map((r, i) => (
                <li key={r.slug} style={{ borderBottom: "1px solid var(--paper-line)" }}>
                  <Link href={`/research/${r.slug}`} className="group grid gap-x-10 gap-y-3 py-7 md:grid-cols-[minmax(0,84px)_minmax(0,1fr)]">
                    <span className="ledger-num text-[13px] font-semibold text-ink-faint tabular md:pt-1.5">
                      {String(i + 2).padStart(2, "0")}
                    </span>
                    <div>
                      <span className="ledger-num text-[10px] uppercase tracking-[0.16em] text-ink-muted">Updated {r.updated}</span>
                      <h3 className="mt-2 text-[20px] font-semibold leading-snug tracking-[-0.015em] text-ink group-hover:text-sky-700 md:text-[23px]">
                        {r.h1}
                      </h3>
                      <p className={`mt-2 text-[15px] leading-[1.6] text-ink-soft ${MEASURE}`}>{r.dek}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          </Container>
        </SectionGround>
      )}

      {/* HOW WE SOURCE — the standard that makes the number worth reading */}
      <SectionGround variant="pure" size="lg">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,168px)_minmax(0,1fr)] lg:gap-x-10">
            <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted lg:pt-1.5">
              How we source
            </p>
            <div className={`space-y-5 text-[16px] leading-[1.75] text-ink-soft md:text-[17px] ${MEASURE}`}>
              <p>
                Sales content runs on statistics nobody has checked. The same four numbers get quoted for a decade,
                each time one citation further from a study anyone has read, and half of them trace back to a vendor
                blog post with no method attached.
              </p>
              <p>
                So every figure we publish carries a bracketed number that resolves to a named study, its publishing
                organisation and its year, at the foot of the report. Where two studies are routinely conflated, we
                separate them and say what each actually measured. Where a widely-circulated stat cannot be traced to
                rigorous research, we flag it or leave it out rather than repeat it.
              </p>
              <p>
                We build sales software, so we have an obvious interest in findings about follow-up discipline. That is
                exactly why the sources are listed: you should be able to check us. The same standard applies to our{" "}
                <Link href="/methodology" className="text-sky-700 underline underline-offset-2 hover:text-sky-600">
                  product claims
                </Link>
                .
              </p>
            </div>
          </div>
        </Container>
      </SectionGround>

      <LedgerCTA
        headline="Data is the argument. The queue is the answer."
        sub="Leadkaun operationalises what this research keeps finding: reach the right lead first, and keep reaching them. Import a CSV and see it on your own pipeline."
        secondary={{ label: "See the product", href: "/product" }}
      />

      <Footer />
    </main>
  )
}
