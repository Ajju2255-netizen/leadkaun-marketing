import type { Metadata } from "next"
import Link from "next/link"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
import { ProductBlock } from "@/app/components/sell/blocks"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { PageHero } from "@/app/components/page-hero"
import { NumberedTag } from "@/app/components/numbered-tag"
import { Reveal } from "@/app/components/reveal"

import { getQuestions } from "@/lib/pseo/lookup"

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

  const sortedCategories = Object.keys(byCategory).sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a)
    const bi = CATEGORY_ORDER.indexOf(b)
    if (ai === -1) return 1
    if (bi === -1) return -1
    return ai - bi
  })

  return (
    <main className="min-h-screen bg-bg-pure">
      <Navbar />

      <PageHero
        eyebrow={`${QUESTIONS.length} answers · ${sortedCategories.length} categories`}
        h1={<>Questions Indian sales teams <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(95deg, #0EA5E9 0%, #FB923C 100%)" }}>actually ask.</span></>}
        sub="Plain-English answers about lead scoring, priority queues, ₹ at risk, CRM alternatives, and how Leadkaun fits into a real sales motion. Each answer links to the product surface that solves it."
        center={false}
        primary={undefined}
        meta={
          <span className="inline-flex flex-wrap justify-start gap-1.5 normal-case tracking-normal">
            {sortedCategories.map((c) => (
              <a
                key={c}
                href={`#cat-${c}`}
                className="inline-flex h-8 items-center rounded-full glass-1 gloss-edge px-3 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft transition-all hover:text-sky-600 lift"
              >
                {prettyCategory(c)}
              </a>
            ))}
          </span>
        }
      />

      <SectionGround variant="cream" size="lg">
        <Container>
          {sortedCategories.map((cat, idx) => (
            <section key={cat} id={`cat-${cat}`} className={idx === 0 ? "" : "mt-14"}>
              <Reveal className="mb-6">
                <NumberedTag
                  number={String(idx + 1).padStart(2, "0")}
                  tone={idx % 2 === 1 ? "warm" : "default"}
                  label={`${prettyCategory(cat)} · ${byCategory[cat].length} ${byCategory[cat].length === 1 ? "answer" : "answers"}`}
                />
              </Reveal>
              <Reveal delay={0.08} className="space-y-4">
                {byCategory[cat].map((q) => (
                  <Link
                    key={q.slug}
                    href={`/questions/${q.slug}`}
                    className="group block rounded-2xl p-5 md:p-6 glass-2 gloss-edge elevate-1 lift aura-sky-hover transition-all"
                  >
                    <p className="text-[16px] font-semibold leading-[1.35] tracking-[-0.01em] text-ink group-hover:text-sky-600 transition-colors md:text-[17px]">
                      {q.question}
                    </p>
                    <p className="mt-2 line-clamp-2 text-[14px] leading-[1.6] text-ink-soft">
                      {q.answerShort}
                    </p>
                  </Link>
                ))}
              </Reveal>
            </section>
          ))}
        </Container>
      </SectionGround>

      <ProductBlock />

      <CTABanner />
      <Footer />
    </main>
  )
}
