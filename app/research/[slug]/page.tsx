import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ExternalLink } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"

import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { QuickAnswer } from "@/app/components/quick-answer"
import { EmailCapture } from "@/app/components/email-capture"
import { LedgerCTA } from "@/app/components/ledger"
import { MEASURE, slugify } from "@/app/components/reading"
import { getResearch, getResearchReport } from "@/lib/pseo/lookup"
import { articleSchema, jsonLdScript, breadcrumbListSchema, canonical } from "@/lib/seo"
import { resolveAuthor } from "@/lib/authors"

export const revalidate = 86400

/* A research report, laid out like one: every figure carries a bracketed
   citation number that resolves to a numbered reference list at the foot of
   the page. If a claim has no number next to it, we didn't source it. */

type Stat = { claim: string; figure: string; source: string; url: string; year: string }
type Section = { heading: string; intro?: string; stats: Stat[] }
type Report = {
  slug: string; metaTitle: string; metaDescription: string; h1: string; dek: string
  updated: string; quickAnswer: { question: string; answer: string }; keyFindings: string[]
  sections: Section[]; methodology: string; leadkaunAngle: string
}

export async function generateStaticParams() {
  const list = (await getResearch()) as Report[]
  return list.map((r) => ({ slug: r.slug }))
}

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const r = await getResearchReport<Report>(slug)
  if (!r) return {}
  return {
    title: r.metaTitle,
    description: r.metaDescription,
    alternates: { canonical: `/research/${r.slug}` },
  }
}

export default async function ResearchReportPage({ params }: Params) {
  const { slug } = await params
  const r = await getResearchReport<Report>(slug)
  if (!r) notFound()
  const author = resolveAuthor("ananya")

  // Distinct sources, numbered by first appearance — the reference list order.
  const sources = Array.from(new Map(r.sections.flatMap((s) => s.stats).map((st) => [st.url, st])).values())
  const refNo = new Map(sources.map((s, i) => [s.url, i + 1]))

  const dataset = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: r.h1,
    description: r.metaDescription,
    url: canonical(`/research/${r.slug}`),
    creator: { "@type": "Organization", name: "Leadkaun" },
    citation: sources.map((s) => `${s.source} (${s.year}), ${s.url}`),
  }
  const schemas = [
    breadcrumbListSchema([
      { name: "Home", url: "/" },
      { name: "Research", url: "/research" },
      { name: r.h1 },
    ]),
    articleSchema({
      headline: r.h1,
      description: r.metaDescription,
      datePublished: `${r.updated}-01`,
      dateModified: `${r.updated}-01`,
      url: `/research/${r.slug}`,
      author: { name: author.name, type: author.type, jobTitle: author.role },
    }),
    dataset,
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(schemas) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        {/* TITLE PAGE */}
        <SectionGround variant="pure" size="sm" ambient={false} className="pt-28 md:pt-32">
          <Container>
            <nav aria-label="Breadcrumb" className="ledger-num text-[11px] uppercase tracking-[0.16em] text-ink-muted">
              <Link href="/research" className="hover:text-sky-700">Research</Link>
              <span aria-hidden className="mx-2 text-ink-faint">/</span>
              <span>Report</span>
            </nav>

            <h1 className="display-lg mt-8 max-w-[22ch] text-[36px] text-ink md:text-[56px]">{r.h1}</h1>
            <p className={`mt-6 text-[18px] leading-[1.65] text-ink-soft md:text-[20px] ${MEASURE}`}>{r.dek}</p>

            {/* Report colophon */}
            <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl md:grid-cols-4" style={{ background: "var(--paper-line)" }}>
              {[
                ["Published", r.updated],
                ["Sections", String(r.sections.length)],
                ["Sources cited", String(sources.length)],
                ["Author", author.name],
              ].map(([k, v]) => (
                <div key={k} className="bg-white px-5 py-4">
                  <dt className="ledger-num text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">{k}</dt>
                  <dd className="mt-1.5 text-[15px] font-semibold text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </SectionGround>

        {/* ABSTRACT */}
        <SectionGround variant="pure" size="md">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[minmax(0,168px)_minmax(0,1fr)] lg:gap-x-10">
              <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted lg:pt-1.5">Abstract</p>
              <div>
                <div className={`[&>[data-quick-answer]]:!mx-0 [&>[data-quick-answer]]:!max-w-none ${MEASURE}`}>
                  <QuickAnswer question={r.quickAnswer.question} answer={r.quickAnswer.answer} />
                </div>

                <p className="mt-10 ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">Key findings</p>
                <ol className={`mt-4 border-t ${MEASURE}`} style={{ borderColor: "var(--paper-line)" }}>
                  {r.keyFindings.map((k, i) => (
                    <li key={i} className="grid grid-cols-[32px_minmax(0,1fr)] gap-x-4 py-4" style={{ borderBottom: "1px solid var(--paper-line)" }}>
                      <span className="ledger-num pt-1 text-[12px] font-semibold text-sky-700 tabular">{String(i + 1).padStart(2, "0")}</span>
                      <p className="text-[16px] leading-[1.65] text-ink">{k}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </Container>
        </SectionGround>

        {/* FINDINGS — each stat is a figure, a claim and a citation */}
        {r.sections.map((sec, si) => (
          <SectionGround key={si} variant={si % 2 === 0 ? "cream" : "pure"} size="lg">
            <Container>
              <div className="grid gap-12 lg:grid-cols-[minmax(0,168px)_minmax(0,1fr)] lg:gap-x-10">
                <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted lg:pt-2">
                  Finding {String(si + 1).padStart(2, "0")}
                </p>
                <div>
                  <h2 id={slugify(sec.heading)} className="scroll-mt-28 text-[26px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[32px]">
                    {sec.heading}
                  </h2>
                  {sec.intro && (
                    <p className={`mt-4 text-[16px] leading-[1.75] text-ink-soft md:text-[17px] ${MEASURE}`}>{sec.intro}</p>
                  )}

                  <ul className="mt-8 border-t" style={{ borderColor: "var(--paper-line-2)" }}>
                    {sec.stats.map((st, i) => (
                      <li
                        key={i}
                        className="grid gap-x-8 gap-y-3 py-6 md:grid-cols-[minmax(0,190px)_minmax(0,1fr)]"
                        style={{ borderBottom: "1px solid var(--paper-line)" }}
                      >
                        <p className="ledger-num text-[26px] font-semibold leading-none tracking-[-0.02em] text-ink tabular md:text-[32px]">
                          {st.figure}
                        </p>
                        <div>
                          <p className="text-[15px] leading-[1.65] text-ink md:text-[16px]">
                            {st.claim}{" "}
                            <a
                              href={`#ref-${refNo.get(st.url)}`}
                              className="ledger-num align-super text-[10px] font-semibold text-sky-700 hover:text-sky-600"
                              aria-label={`Reference ${refNo.get(st.url)}`}
                            >
                              [{refNo.get(st.url)}]
                            </a>
                          </p>
                          <p className="ledger-num mt-2 text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                            {st.source} · {st.year}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Container>
          </SectionGround>
        ))}

        {/* WHAT IT MEANS */}
        <SectionGround variant="pure" size="md">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[minmax(0,168px)_minmax(0,1fr)] lg:gap-x-10">
              <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700 lg:pt-1.5">
                What this means
              </p>
              <p className={`text-[17px] leading-[1.75] text-ink-soft md:text-[18px] ${MEASURE}`}>{r.leadkaunAngle}</p>
            </div>
          </Container>
        </SectionGround>

        {/* METHODOLOGY + REFERENCES */}
        <SectionGround variant="cream" size="md">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[minmax(0,168px)_minmax(0,1fr)] lg:gap-x-10">
              <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted lg:pt-1.5">
                Method &amp; sources
              </p>
              <div>
                <p className={`text-[15px] leading-[1.7] text-ink-soft ${MEASURE}`}>{r.methodology}</p>

                <p className="mt-10 ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
                  References
                </p>
                <ol className="mt-4 border-t" style={{ borderColor: "var(--paper-line)" }}>
                  {sources.map((s, i) => (
                    <li
                      key={s.url}
                      id={`ref-${i + 1}`}
                      className="grid scroll-mt-28 grid-cols-[36px_minmax(0,1fr)] gap-x-4 py-3.5"
                      style={{ borderBottom: "1px solid var(--paper-line)" }}
                    >
                      <span className="ledger-num pt-0.5 text-[12px] font-semibold text-ink-faint tabular">[{i + 1}]</span>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener nofollow"
                        className="group inline-flex items-start gap-1.5 text-[14px] leading-[1.55] text-ink-soft hover:text-sky-700"
                      >
                        <span>{s.source} ({s.year})</span>
                        <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 text-ink-faint group-hover:text-sky-700" />
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </Container>
        </SectionGround>

        <SectionGround variant="pure" size="md">
          <Container>
            <div className={MEASURE}><EmailCapture /></div>
          </Container>
        </SectionGround>

        <LedgerCTA
          headline="The data says speed wins. Leadkaun makes it happen."
          sub="Graded leads, a ranked queue per rep, and ₹ at risk surfaced daily — the operational version of everything in this report."
          secondary={{ label: "More research", href: "/research" }}
        />

        <Footer />
      </main>
    </>
  )
}
