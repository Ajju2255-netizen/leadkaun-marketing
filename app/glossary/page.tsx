import type { Metadata } from "next"
import Link from "next/link"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { PageHero } from "@/app/components/page-hero"
import { NumberedTag } from "@/app/components/numbered-tag"
import { Reveal } from "@/app/components/reveal"

import { getGlossary } from "@/lib/pseo/lookup"
import { canonical, jsonLdScript } from "@/lib/seo"

type GlossaryEntry = {
  slug: string
  term: string
  definitionShort: string
  category?: string
}

export const metadata: Metadata = {
  title: "Sales Glossary for Indian B2B Teams | Leadkaun",
  description:
    "Definitions for every term in Indian B2B sales — lead scoring, grade A, priority queue, ₹ at risk, Morning Brief, and more. Written for practitioners, not analysts.",
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

        <PageHero
          eyebrow={`A–Z · ${GLOSSARY.length} terms`}
          h1={<>The Indian B2B <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(95deg, #0EA5E9 0%, #FB923C 100%)" }}>sales glossary.</span></>}
          sub="Every word that matters in a modern Indian sales motion — lead scoring, grade A, priority queue, ₹ at risk, Morning Brief, intent decay. Written for practitioners, not analysts."
          center={false}
          primary={undefined}
          meta={
            <span className="inline-flex flex-wrap justify-start gap-1.5 normal-case tracking-normal">
              {letters.map((l) => (
                <a
                  key={l}
                  href={`#letter-${l}`}
                  className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg glass-1 gloss-edge px-2 font-mono text-[12px] font-semibold text-ink-soft transition-all hover:text-sky-600 lift"
                >
                  {l}
                </a>
              ))}
            </span>
          }
        />

        <SectionGround variant="cream" size="lg">
          <Container>
            {letters.map((letter, idx) => (
              <section key={letter} id={`letter-${letter}`} className={idx === 0 ? "" : "mt-14"}>
                <Reveal className="mb-6 flex items-baseline gap-4">
                  <NumberedTag number={letter} tone={idx % 2 === 1 ? "warm" : "default"} label={`${grouped[letter].length} ${grouped[letter].length === 1 ? "term" : "terms"}`} />
                </Reveal>
                <Reveal delay={0.08} className="grid gap-4 md:grid-cols-2">
                  {grouped[letter].map((e) => (
                    <Link
                      key={e.slug}
                      href={`/glossary/${e.slug}`}
                      className="group rounded-2xl p-5 glass-2 gloss-edge elevate-1 lift aura-sky-hover transition-all"
                    >
                      <p className="text-[16px] font-semibold text-ink group-hover:text-sky-600 transition-colors">
                        {e.term}
                      </p>
                      <p className="mt-1.5 line-clamp-2 text-[13px] leading-[1.55] text-ink-soft">
                        {e.definitionShort}
                      </p>
                    </Link>
                  ))}
                </Reveal>
              </section>
            ))}
          </Container>
        </SectionGround>

        <CTABanner />
        <Footer />
      </main>
    </>
  )
}
