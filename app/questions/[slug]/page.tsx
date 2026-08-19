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

import { getQuestions } from "@/lib/pseo/lookup"
import { breadcrumbListSchema, qaPageSchema, jsonLdScript } from "@/lib/seo"

export const revalidate = 604800

/* Answer-first: the short answer is the loudest thing on the page, sitting
   directly under the question, before any explanation or product pitch. */

type QuestionEntry = {
  slug: string; question: string; answerShort: string; answerLong: string
  category: string; relatedSlugs?: string[]; relatedFeatures?: string[]
  /** Authored per question — the next concrete step, runnable on your own data. */
  selfCheck?: SelfCheck
}

export async function generateStaticParams() {
  const list = (await getQuestions()) as QuestionEntry[]
  return list.map((q) => ({ slug: q.slug }))
}

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const list = (await getQuestions()) as QuestionEntry[]
  const q = list.find((x) => x.slug === slug)
  if (!q) return {}
  return {
    title: q.question,
    description: q.answerShort.slice(0, 155),
    alternates: { canonical: `/questions/${q.slug}` },
  }
}

function pretty(slug: string) {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
}

export default async function QuestionPage({ params }: Params) {
  const { slug } = await params
  const list = (await getQuestions()) as QuestionEntry[]
  const q = list.find((x) => x.slug === slug)
  if (!q) notFound()

  const related = (q.relatedSlugs ?? [])
    .map((s) => list.find((x) => x.slug === s))
    .filter((x): x is QuestionEntry => x !== undefined)
    .slice(0, 5)

  const schemas = [
    breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "Questions", url: "/questions" }, { name: q.question }]),
    qaPageSchema({ question: q.question, answer: q.answerShort }),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(schemas) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        {/* THE QUESTION, THEN THE ANSWER — in that order, nothing between */}
        <SectionGround variant="pure" size="sm" ambient={false} className="pt-28 md:pt-32">
          <Container>
            <nav aria-label="Breadcrumb" className="ledger-num text-[11px] uppercase tracking-[0.16em] text-ink-muted">
              <Link href="/questions" className="hover:text-sky-700">Questions</Link>
              <span aria-hidden className="mx-2 text-ink-faint">/</span>
              <span>{pretty(q.category)}</span>
            </nav>

            <h1 className={`display-lg mt-8 text-[34px] text-ink md:text-[50px] ${MEASURE}`}>{q.question}</h1>

            <div
              className={`mt-10 rounded-2xl bg-[color:var(--paper)] p-7 md:p-9 ${MEASURE}`}
              style={{ border: "1px solid var(--paper-line)", boxShadow: "inset 3px 0 0 #0877B8" }}
            >
              <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">Short answer</p>
              <p className="mt-4 text-[19px] leading-[1.55] text-ink md:text-[22px]">{q.answerShort}</p>
            </div>
            <InlineCta />
          </Container>
        </SectionGround>

        {/* THE LONG ANSWER */}
        <SectionGround variant="pure" size="md">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[minmax(0,168px)_minmax(0,1fr)] lg:gap-x-10">
              <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted lg:pt-1.5">
                The long answer
              </p>
              <p className={`text-[17px] leading-[1.75] text-ink-soft md:text-[18px] ${MEASURE}`}>{q.answerLong}</p>
            </div>
          </Container>
        </SectionGround>

        {q.selfCheck && <SelfCheckBlock number="→" selfCheck={q.selfCheck} ground="cream" />}

        {/* NEXT QUESTIONS + FEATURES */}
        {(related.length > 0 || q.relatedFeatures?.length) && (
          <SectionGround variant="pure" size="md">
            <Container>
              <div className="grid gap-12 lg:grid-cols-[minmax(0,168px)_minmax(0,1fr)] lg:gap-x-10">
                <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted lg:pt-1.5">
                  Next
                </p>
                <div className="space-y-10">
                  {related.length > 0 && (
                    <div>
                      <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
                        People also ask
                      </p>
                      <ul className="mt-3 border-t" style={{ borderColor: "var(--paper-line)" }}>
                        {related.map((r) => (
                          <li key={r.slug} style={{ borderBottom: "1px solid var(--paper-line)" }}>
                            <Link href={`/questions/${r.slug}`} className="group grid grid-cols-[24px_minmax(0,1fr)] gap-x-4 py-3.5">
                              <span aria-hidden className="ledger-num pt-0.5 text-[12px] font-semibold text-ink-faint group-hover:text-sky-700">Q.</span>
                              <span className="text-[15px] leading-snug text-ink group-hover:text-sky-700">{r.question}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {q.relatedFeatures && q.relatedFeatures.length > 0 && (
                    <div>
                      <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">
                        In the product
                      </p>
                      <ul className="mt-3 border-t" style={{ borderColor: "var(--paper-line)" }}>
                        {q.relatedFeatures.map((f) => (
                          <li key={f} style={{ borderBottom: "1px solid var(--paper-line)" }}>
                            <Link href={`/features/${f}`} className="group flex items-baseline justify-between gap-4 py-3">
                              <span className="text-[15px] text-ink group-hover:text-sky-700">{pretty(f)}</span>
                              <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-ink-faint group-hover:text-sky-700" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </Container>
          </SectionGround>
        )}

        <LedgerCTA
          headline="The fastest answer is your own data."
          sub="Import a CSV and every lead comes back graded A–F with a ranked queue per rep. Same-day setup, no card, no sales call."
          secondary={{ label: "More questions", href: "/questions" }}
        />

        <Footer />
      </main>
    </>
  )
}
