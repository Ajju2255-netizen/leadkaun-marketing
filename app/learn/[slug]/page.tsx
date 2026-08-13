import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, ArrowUpRight } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"

import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { Faq } from "@/app/components/faq"
import { QuickAnswer } from "@/app/components/quick-answer"
import { LedgerCTA } from "@/app/components/ledger"
import {
  ArticleHeader, MEASURE, ProseSection, ReadingLayout, Syllabus,
  TakeawayBox, readingTime, slugify,
} from "@/app/components/reading"
import { getPillars, getPillar } from "@/lib/pseo/lookup"
import { breadcrumbListSchema, faqPageSchema, articleSchema, jsonLdScript } from "@/lib/seo"
import { APP_URLS } from "@/lib/urls"

export const revalidate = 86400

type LinkItem = { label: string; href: string }
type Cluster = { heading: string; links: LinkItem[] }
type PillarSection = { heading: string; paragraphs: string[] }
type Pillar = {
  slug: string; title: string; metaTitle: string; metaDescription: string; h1: string; dek: string
  quickAnswer: { question: string; answer: string }; keyTakeaways: string[]
  body?: PillarSection[]
  clusters: Cluster[]; faqs: { q: string; a: string }[]; relatedPillars: string[]
  /** Opt-out: park a record at noindex while it is corrected. */
  indexable?: boolean
}

export async function generateStaticParams() {
  const list = (await getPillars()) as Pillar[]
  return list.map((p) => ({ slug: p.slug }))
}

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const p = await getPillar<Pillar>(slug)
  if (!p) return {}
  return {
    title: p.metaTitle,
    description: p.metaDescription,
    alternates: { canonical: `/learn/${p.slug}` },
    // Records may park themselves at noindex with `"indexable": false` while being
    // corrected. Kept in sync with scripts/generate-xml-sitemap.js so the sitemap
    // can never advertise a noindex URL.
    robots: { index: p.indexable !== false, follow: true },
  }
}

export default async function PillarPage({ params }: Params) {
  const { slug } = await params
  const p = await getPillar<Pillar>(slug)
  if (!p) notFound()
  const all = (await getPillars()) as Pillar[]
  const related = p.relatedPillars.map((s) => all.find((x) => x.slug === s)).filter(Boolean) as Pillar[]

  const body = p.body ?? []
  const sections = body.map((s) => ({ ...s, id: slugify(s.heading) }))
  const words = body.flatMap((s) => s.paragraphs).join(" ")
  const mins = words ? readingTime(words) : 0
  const topicCount = p.clusters.reduce((n, c) => n + c.links.length, 0)

  /* The rail lists the prose sections plus the two landmarks that follow it,
     so it stays useful all the way down the page. */
  const contents = [
    ...sections.map((s) => ({ id: s.id, label: s.heading })),
    ...(topicCount ? [{ id: "map", label: "The complete map" }] : []),
    ...(p.faqs.length ? [{ id: "faq", label: "Questions" }] : []),
  ]

  const schemas = [
    breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "Learn", url: "/learn" }, { name: p.title }]),
    faqPageSchema(p.faqs),
    ...(body.length > 0
      ? [articleSchema({ headline: p.h1, description: p.metaDescription, datePublished: "2026-07-25", url: `/learn/${p.slug}` })]
      : []),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(schemas) }} />
      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        <ArticleHeader
          kicker={<><Link href="/learn" className="hover:text-sky-600">Learn</Link> · {p.title}</>}
          title={p.h1}
          dek={p.dek}
          meta={[
            ...(mins ? [`${mins} min read`] : []),
            ...(topicCount ? [`${topicCount} topics mapped`] : []),
            "Updated Aug 2026",
          ]}
          actions={
            <>
              <a
                href={APP_URLS.register}
                className="btn-gloss-primary inline-flex items-center gap-2 rounded-xl px-5 py-3 text-[14px] font-semibold"
                style={{ color: "#FFFFFF" }}
              >
                Start free trial <ArrowRight className="h-4 w-4" />
              </a>
              <Link href="/product" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-sky-700 hover:text-sky-600">
                See the product <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </>
          }
        />

        <ReadingLayout contents={contents}>
          {p.keyTakeaways.length > 0 && <TakeawayBox items={p.keyTakeaways} />}

          <div className={`mt-10 [&>[data-quick-answer]]:!mx-0 ${MEASURE}`}>
            <QuickAnswer question={p.quickAnswer.question} answer={p.quickAnswer.answer} />
          </div>

          {sections.map((s) => (
            <ProseSection key={s.id} id={s.id} heading={s.heading}>
              {s.paragraphs.map((para, pi) => <p key={pi}>{para}</p>)}
            </ProseSection>
          ))}

          {/* THE COMPLETE MAP — the topical cluster this pillar owns */}
          {topicCount > 0 && (
            <section id="map" className="mt-16 scroll-mt-28 border-t pt-12" style={{ borderColor: "var(--paper-line-2)" }}>
              <h2 className="text-[26px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[32px]">
                Everything on {p.title.toLowerCase()}.
              </h2>
              <p className={`mt-4 text-[16px] leading-[1.7] text-ink-soft ${MEASURE}`}>
                {topicCount} pages across {p.clusters.length} groups. This guide is the trunk; these are the branches.
              </p>
              <div className="mt-8 grid gap-x-12 gap-y-10 sm:grid-cols-2">
                {p.clusters.map((c) => (
                  <div key={c.heading}>
                    <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">{c.heading}</p>
                    <ul className="mt-4 border-t" style={{ borderColor: "var(--paper-line)" }}>
                      {c.links.map((l) => (
                        <li key={l.href} style={{ borderBottom: "1px solid var(--paper-line)" }}>
                          <Link href={l.href} className="group flex items-start justify-between gap-4 py-2.5 text-[14px] leading-[1.5] text-ink-soft transition-colors hover:text-sky-700">
                            <span>{l.label}</span>
                            <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-faint group-hover:text-sky-700" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* FAQ */}
          {p.faqs.length > 0 && (
            <section id="faq" className="mt-16 scroll-mt-28 border-t pt-12" style={{ borderColor: "var(--paper-line-2)" }}>
              <h2 className="text-[26px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[32px]">
                Questions on {p.title.toLowerCase()}.
              </h2>
              <Faq items={p.faqs} className="!mx-0 mt-6 !max-w-none" />
            </section>
          )}
        </ReadingLayout>

        {/* KEEP READING */}
        {related.length > 0 && (
          <SectionGround variant="cream" size="lg">
            <Container>
              <div className="mb-8">
                <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">Keep reading</p>
                <h2 className="mt-4 text-[26px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[32px]">
                  Related guides.
                </h2>
              </div>
              <Syllabus items={related.map((r) => ({ href: `/learn/${r.slug}`, title: r.title, dek: r.dek }))} />
            </Container>
          </SectionGround>
        )}

        <LedgerCTA
          headline={`See ${p.title.toLowerCase()} running on your own leads.`}
          sub="Import a CSV and every lead comes back graded A–F with a ranked queue per rep. Same-day setup, no card."
          secondary={{ label: "See pricing", href: "/pricing" }}
        />

        <Footer />
      </main>
    </>
  )
}
