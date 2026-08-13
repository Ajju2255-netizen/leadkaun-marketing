import type { Metadata } from "next"
import Link from "next/link"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"

import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { ArticleHeader } from "@/app/components/reading"
import { LedgerCTA } from "@/app/components/ledger"

import { getGlossary } from "@/lib/pseo/lookup"
import { canonical, jsonLdScript } from "@/lib/seo"

/* A dictionary, not a card grid: an A–Z rail that sticks while you scan, and
   dense headword/definition rows you can read down in one pass. */

type GlossaryEntry = {
  slug: string
  term: string
  definitionShort: string
  category?: string
}

export const metadata: Metadata = {
  title: "Sales Glossary for Indian B2B Teams | Leadkaun",
  description:
    "Definitions for every term in Indian B2B sales, lead scoring, grade A, priority queue, ₹ at risk, Morning Brief, and more. Written for practitioners, not analysts.",
  alternates: { canonical: "/glossary" },
}

export default async function GlossaryIndexPage() {
  const GLOSSARY = (await getGlossary()) as GlossaryEntry[]
  const sorted = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term))
  const grouped = sorted.reduce<Record<string, GlossaryEntry[]>>((acc, e) => {
    const firstLetter = e.term[0].toUpperCase()
    const key = /[A-Z]/.test(firstLetter) ? firstLetter : "#"
    if (!acc[key]) acc[key] = []
    acc[key].push(e)
    return acc
  }, {})
  const letters = Object.keys(grouped).sort()
  const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "DefinedTermSet",
      name: "Leadkaun Sales Glossary",
      url: canonical("/glossary"),
      hasDefinedTerm: GLOSSARY.map((g) => ({
        "@type": "DefinedTerm",
        name: g.term,
        url: canonical(`/glossary/${g.slug}`),
      })),
    },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(schemas) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        <ArticleHeader
          kicker="Glossary"
          title="The words Indian sales teams actually use."
          dek="Definitions written for practitioners, not analysts. Every entry says what the term means, how it shows up in a real pipeline, and what to check on your own data."
          meta={[`${GLOSSARY.length} terms`, `${letters.length} letters`, "Free, no signup"]}
        />

        {/* A–Z rail — letters with no entries stay visible but inert, so the
            alphabet reads as a complete index rather than a ragged list. */}
        <nav
          aria-label="Jump to letter"
          className="sticky top-16 z-30 border-y"
          style={{ borderColor: "var(--paper-line)", background: "rgba(252,250,246,0.92)", backdropFilter: "saturate(180%) blur(8px)" }}
        >
          <Container className="!px-0 md:!px-8">
            <ul className="flex items-center gap-0.5 overflow-x-auto px-4 py-2.5 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {ALPHABET.map((l) => {
                const has = !!grouped[l]
                return (
                  <li key={l}>
                    {has ? (
                      <a
                        href={`#letter-${l}`}
                        className="ledger-num inline-flex h-7 w-7 items-center justify-center rounded-md text-[11px] font-semibold text-ink-soft transition-colors hover:bg-white hover:text-sky-700"
                      >
                        {l}
                      </a>
                    ) : (
                      <span className="ledger-num inline-flex h-7 w-7 items-center justify-center text-[11px] text-ink-faint" aria-hidden>
                        {l}
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          </Container>
        </nav>

        <SectionGround variant="pure" size="lg">
          <Container>
            {letters.map((letter) => (
              <section key={letter} id={`letter-${letter}`} className="scroll-mt-32 pt-12 first:pt-0">
                <div className="grid gap-x-10 md:grid-cols-[minmax(0,88px)_minmax(0,1fr)]">
                  <p className="display-md sticky top-32 self-start text-[40px] text-ink-faint md:text-[52px]">{letter}</p>
                  <dl className="border-t" style={{ borderColor: "var(--paper-line-2)" }}>
                    {grouped[letter].map((e) => (
                      <div key={e.slug} style={{ borderBottom: "1px solid var(--paper-line)" }}>
                        <Link href={`/glossary/${e.slug}`} className="group grid gap-x-10 gap-y-1 py-4 md:grid-cols-[minmax(0,240px)_minmax(0,1fr)]">
                          <dt className="text-[16px] font-semibold leading-snug text-ink transition-colors group-hover:text-sky-700">
                            {e.term}
                          </dt>
                          <dd className="text-[14px] leading-[1.6] text-ink-soft md:text-[15px]">{e.definitionShort}</dd>
                        </Link>
                      </div>
                    ))}
                  </dl>
                </div>
              </section>
            ))}
          </Container>
        </SectionGround>

        <LedgerCTA
          headline="Stop defining. Start scoring."
          sub="Leadkaun puts these concepts into practice: A–F grading, a Priority Queue per rep, and ₹ at risk surfaced daily. Setup the same day."
          secondary={{ label: "See the product", href: "/product" }}
        />

        <Footer />
      </main>
    </>
  )
}
