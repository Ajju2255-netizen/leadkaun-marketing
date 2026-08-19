import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowUpRight } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"

import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { SelfCheckBlock, type SelfCheck } from "@/app/components/pseo/self-check"
import {
  InlineCta, LedgerCTA,
} from "@/app/components/ledger"
import { MEASURE } from "@/app/components/reading"

import { getGlossary } from "@/lib/pseo/lookup"
import { breadcrumbListSchema, definedTermSchema, jsonLdScript, ogMeta } from "@/lib/seo"

export const revalidate = 604800

/* A dictionary entry, not a landing page: headword, part-of-speech style
   category, the definition in display type, then numbered senses. */

type GlossaryEntry = {
  indexable?: boolean
  slug: string; term: string; definitionShort: string; definitionLong: string
  examples?: string[]; relatedTerms?: string[]; relatedFeature?: string | null; category?: string
  /** Pillar + buyer-guide bridge, so a term is never a dead end in the graph. */
  relatedGuides?: { label: string; href: string }[]
  /** Authored per term — a diagnostic the reader can run on their own data. */
  selfCheck?: SelfCheck
}

export async function generateStaticParams() {
  const list = (await getGlossary()) as GlossaryEntry[]
  return list.map((g) => ({ term: g.slug }))
}

type Params = { params: Promise<{ term: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { term } = await params
  const list = (await getGlossary()) as GlossaryEntry[]
  const entry = list.find((g) => g.slug === term)
  if (!entry) return {}
  // No "| Leadkaun" here: app/layout.tsx sets `title.template: "%s | Leadkaun"`,
  // so spelling it out produced "… | Leadkaun | Leadkaun" on all 37 glossary
  // pages and pushed the title past Google's ~60-char truncation. Phase 0 fixed
  // this for the pSEO titles; glossary was missed.
  const path = `/glossary/${entry.slug}`
  const title = `${entry.term}, Meaning in Indian B2B Sales`
  const description = entry.definitionShort.slice(0, 155)
  return {
    title,
    description,
    alternates: { canonical: path },
    ...ogMeta({ title, description, path }),
    // Without this the route inherited the layout's `index: true` no matter what
    // the data said, so an `indexable: false` entry would drop out of the sitemap
    // while the page kept advertising itself as indexable — precisely the drift
    // lib/pseo/gate.js exists to prevent.
    robots: { index: entry.indexable !== false, follow: true },
  }
}

function prettyFeature(slug: string) {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
}

function prettyCategory(c?: string) {
  return c ? c.replace(/-/g, " ") : null
}

export default async function GlossaryTermPage({ params }: Params) {
  const { term } = await params
  const list = (await getGlossary()) as GlossaryEntry[]
  const entry = list.find((g) => g.slug === term)
  if (!entry) notFound()

  const related = (entry.relatedTerms ?? [])
    .map((t) => list.find((g) => g.slug === t))
    .filter((e): e is GlossaryEntry => e !== undefined)
    .slice(0, 6)
  const category = prettyCategory(entry.category)

  const schemas = [
    breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "Glossary", url: "/glossary" }, { name: entry.term }]),
    definedTermSchema({ term: entry.term, definition: entry.definitionShort }),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(schemas) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        {/* HEADWORD */}
        <SectionGround variant="pure" size="sm" ambient={false} className="pt-28 md:pt-32">
          <Container>
            <nav aria-label="Breadcrumb" className="ledger-num text-[11px] uppercase tracking-[0.16em] text-ink-muted">
              <Link href="/glossary" className="hover:text-sky-700">Glossary</Link>
              <span aria-hidden className="mx-2 text-ink-faint">/</span>
              <span>{entry.term}</span>
            </nav>

            <div className="mt-8 border-b pb-10" style={{ borderColor: "var(--paper-line-2)" }}>
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                <h1 className="display-lg text-[40px] text-ink md:text-[60px]">{entry.term}</h1>
                {category && (
                  <span className="text-[15px] italic text-ink-muted md:text-[17px]">{category}</span>
                )}
              </div>
              <p className={`mt-6 text-[19px] leading-[1.6] text-ink md:text-[22px] ${MEASURE}`}>
                {entry.definitionShort}
              </p>
              <InlineCta />
            </div>
          </Container>
        </SectionGround>

        {/* IN PRACTICE + SENSES */}
        <SectionGround variant="pure" size="md">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[minmax(0,168px)_minmax(0,1fr)] lg:gap-x-10">
              <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted lg:pt-1.5">
                In practice
              </p>
              <div>
                <p className={`text-[17px] leading-[1.75] text-ink-soft md:text-[18px] ${MEASURE}`}>
                  {entry.definitionLong}
                </p>

                {/* Numbered senses, the way a dictionary lists usages */}
                {entry.examples && entry.examples.length > 0 && (
                  <ol className={`mt-10 border-t ${MEASURE}`} style={{ borderColor: "var(--paper-line)" }}>
                    {entry.examples.map((ex, i) => (
                      <li
                        key={i}
                        className="grid grid-cols-[28px_minmax(0,1fr)] gap-x-4 py-5"
                        style={{ borderBottom: "1px solid var(--paper-line)" }}
                      >
                        <span className="ledger-num pt-0.5 text-[13px] font-semibold text-sky-700 tabular">{i + 1}.</span>
                        <p className="text-[15px] leading-[1.7] text-ink md:text-[16px]">{ex}</p>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </div>
          </Container>
        </SectionGround>

        {entry.selfCheck && <SelfCheckBlock number="→" selfCheck={entry.selfCheck} ground="cream" />}

        {/* SEE ALSO — feature, guides and neighbouring terms, one register */}
        {(entry.relatedFeature || entry.relatedGuides?.length || related.length > 0) && (
          <SectionGround variant="pure" size="md">
            <Container>
              <div className="grid gap-12 lg:grid-cols-[minmax(0,168px)_minmax(0,1fr)] lg:gap-x-10">
                <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted lg:pt-1.5">
                  See also
                </p>
                <div className="space-y-10">
                  {entry.relatedFeature && (
                    <div>
                      <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">
                        How Leadkaun uses this
                      </p>
                      <Link
                        href={`/features/${entry.relatedFeature}`}
                        className="group mt-3 flex items-baseline justify-between gap-4 border-b pb-3"
                        style={{ borderColor: "var(--paper-line)" }}
                      >
                        <span className="text-[18px] font-semibold tracking-[-0.01em] text-ink group-hover:text-sky-700 md:text-[20px]">
                          {prettyFeature(entry.relatedFeature)}
                        </span>
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-ink-faint group-hover:text-sky-700" />
                      </Link>
                    </div>
                  )}

                  {entry.relatedGuides && entry.relatedGuides.length > 0 && (
                    <div>
                      <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
                        Go deeper
                      </p>
                      <ul className="mt-3 border-t" style={{ borderColor: "var(--paper-line)" }}>
                        {entry.relatedGuides.map((g) => (
                          <li key={g.href} style={{ borderBottom: "1px solid var(--paper-line)" }}>
                            <Link href={g.href} className="group flex items-baseline justify-between gap-4 py-3">
                              <span className="text-[15px] leading-snug text-ink group-hover:text-sky-700">{g.label}</span>
                              <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-ink-faint group-hover:text-sky-700" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {related.length > 0 && (
                    <div>
                      <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
                        Neighbouring terms
                      </p>
                      <dl className="mt-3 border-t" style={{ borderColor: "var(--paper-line)" }}>
                        {related.map((r) => (
                          <div key={r.slug} style={{ borderBottom: "1px solid var(--paper-line)" }}>
                            <Link href={`/glossary/${r.slug}`} className="group grid gap-x-8 gap-y-1 py-3.5 md:grid-cols-[minmax(0,200px)_minmax(0,1fr)]">
                              <dt className="text-[15px] font-semibold text-ink group-hover:text-sky-700">{r.term}</dt>
                              <dd className="line-clamp-2 text-[14px] leading-[1.55] text-ink-soft">{r.definitionShort}</dd>
                            </Link>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}
                </div>
              </div>
            </Container>
          </SectionGround>
        )}

        <LedgerCTA
          headline="Stop defining. Start scoring."
          sub={`Leadkaun turns ${entry.term.toLowerCase()} from a definition into something your reps see every morning. Setup the same day, no card.`}
          secondary={{ label: "Back to the glossary", href: "/glossary" }}
        />

        <Footer />
      </main>
    </>
  )
}
