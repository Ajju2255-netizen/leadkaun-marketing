import type { Metadata } from "next"
import Link from "next/link"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"

import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { ArticleHeader } from "@/app/components/reading"
import { LedgerCTA } from "@/app/components/ledger"

import { getQuestions } from "@/lib/pseo/lookup"
import { breadcrumbListSchema, jsonLdScript, canonical } from "@/lib/seo"

/* An answer desk: a sticky category rail with counts, and every question
   carrying its answer inline so the index is useful without a click. */

type QuestionEntry = {
  slug: string
  question: string
  answerShort: string
  category: string
}

export const metadata: Metadata = {
  title: "Sales Questions Answered for Indian B2B Teams | Leadkaun",
  description:
    "Practical answers to every common question about lead scoring, priority queues, ₹ at risk, Morning Brief, CRM alternatives, and Indian B2B sales workflows.",
  alternates: { canonical: "/questions" },
}

const CATEGORY_ORDER = [
  "scoring", "workflow", "metrics", "setup", "comparison", "migration",
  "pricing", "product-features", "lifecycle", "performance", "sales-tech",
]

function prettyCategory(slug: string) {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
}

export default async function QuestionsIndexPage() {
  const QUESTIONS = (await getQuestions()) as QuestionEntry[]
  const byCategory = QUESTIONS.reduce<Record<string, QuestionEntry[]>>((acc, q) => {
    if (!acc[q.category]) acc[q.category] = []
    acc[q.category].push(q)
    return acc
  }, {})
  const categories = [
    ...CATEGORY_ORDER.filter((c) => byCategory[c]),
    ...Object.keys(byCategory).filter((c) => !CATEGORY_ORDER.includes(c)).sort(),
  ]

  const schemas = [
    breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "Questions" }]),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Sales questions answered",
      numberOfItems: QUESTIONS.length,
      itemListElement: QUESTIONS.map((q, i) => ({
        "@type": "ListItem", position: i + 1, name: q.question, url: canonical(`/questions/${q.slug}`),
      })),
    },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(schemas) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        <ArticleHeader
          kicker="Questions"
          title="Straight answers, no throat-clearing."
          dek="The questions Indian B2B sales teams actually ask us, each one answered in a sentence first and explained properly after. If the honest answer is “you don't need us for that”, that's the answer you'll get."
          meta={[`${QUESTIONS.length} answered`, `${categories.length} topics`, "Free, no signup"]}
        />

        <SectionGround variant="pure" size="lg" className="!overflow-visible">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[minmax(0,200px)_minmax(0,1fr)] lg:gap-16">
              {/* Category rail */}
              <nav aria-label="Topics" className="lg:sticky lg:top-24 lg:self-start">
                <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">Topics</p>
                <ul className="mt-4 border-l pl-4" style={{ borderColor: "var(--paper-line)" }}>
                  {categories.map((c) => (
                    <li key={c}>
                      <a href={`#${c}`} className="group flex items-baseline justify-between gap-3 py-1.5 text-[13px] text-ink-soft transition-colors hover:text-sky-700">
                        <span>{prettyCategory(c)}</span>
                        <span className="ledger-num text-[10px] text-ink-faint group-hover:text-sky-700">{byCategory[c].length}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Answers */}
              <div>
                {categories.map((c, ci) => (
                  <section key={c} id={c} className={`scroll-mt-28 ${ci > 0 ? "mt-14" : ""}`}>
                    <h2 className="text-[22px] font-semibold leading-tight tracking-[-0.02em] text-ink md:text-[26px]">
                      {prettyCategory(c)}
                    </h2>
                    <ul className="mt-5 border-t" style={{ borderColor: "var(--paper-line-2)" }}>
                      {byCategory[c].map((q) => (
                        <li key={q.slug} style={{ borderBottom: "1px solid var(--paper-line)" }}>
                          <Link href={`/questions/${q.slug}`} className="group grid grid-cols-[24px_minmax(0,1fr)] gap-x-4 py-5">
                            <span aria-hidden className="ledger-num pt-1 text-[13px] font-semibold text-ink-faint group-hover:text-sky-700">Q.</span>
                            <div>
                              <p className="text-[16px] font-semibold leading-snug text-ink transition-colors group-hover:text-sky-700 md:text-[17px]">
                                {q.question}
                              </p>
                              <p className="mt-1.5 line-clamp-2 max-w-[68ch] text-[14px] leading-[1.6] text-ink-soft">
                                {q.answerShort}
                              </p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </div>
          </Container>
        </SectionGround>

        <LedgerCTA
          headline="Still have a question?"
          sub="The fastest answer is usually the product itself. Import a CSV and watch it grade your own leads — no card, no sales call."
          secondary={{ label: "Talk to us", href: "/contact" }}
        />

        <Footer />
      </main>
    </>
  )
}
