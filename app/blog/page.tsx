import type { Metadata } from "next"
import Link from "next/link"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { ArticleHeader } from "@/app/components/reading"
import { LedgerCTA } from "@/app/components/ledger"
import { CategoryStrip, JournalEntry, categoryColor, categoryTitle, formatDate } from "@/app/components/journal"

import { getAllPosts, estimateReadingTime } from "@/lib/blog"

export const metadata: Metadata = {
  title: "Leadkaun Blog Sales Behaviour Insights for Indian B2B Teams",
  description:
    "Practical guides on lead scoring, priority queues, rupee-first analytics, WhatsApp sales, and building accountability in Indian B2B sales teams.",
  alternates: { canonical: "/blog" },
}

export default function BlogPage() {
  const posts = getAllPosts()
  const [featured, ...rest] = posts
  const years = Array.from(new Set(posts.map((p) => new Date(p.date).getFullYear()))).sort((a, b) => b - a)

  return (
    <main className="min-h-screen bg-bg-pure">
      <Navbar />

      <ArticleHeader
        kicker="The journal"
        title="Field notes from Indian B2B sales."
        dek="Practical writing on A–F lead scoring, rupee-first analytics, WhatsApp as a signal, and running accountability without micromanagement. Written for founders, sales heads and RevOps leads."
        meta={[`${posts.length} posts`, years.length > 1 ? `${years[years.length - 1]}–${years[0]}` : String(years[0])]}
      />

      {/* LEAD ARTICLE — the only entry that gets the full display treatment */}
      {featured && (
        <SectionGround variant="cream" size="lg">
          <Container>
            <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">Latest</p>
            <Link href={`/blog/${featured.slug}`} className="group mt-6 block border-t pt-8" style={{ borderColor: "var(--paper-line-2)" }}>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <time dateTime={featured.date} className="ledger-num text-[10px] uppercase tracking-[0.16em] text-ink-muted">
                  {formatDate(featured.date)}
                </time>
                {categoryTitle(featured.category) && (
                  <span className="inline-flex items-center gap-2">
                    <span aria-hidden className="inline-block h-2 w-2 rounded-full" style={{ background: categoryColor(featured.category) }} />
                    <span className="ledger-num text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                      {categoryTitle(featured.category)}
                    </span>
                  </span>
                )}
                <span className="ledger-num text-[10px] uppercase tracking-[0.16em] text-ink-faint">
                  {featured.readingTime ?? estimateReadingTime(featured.body)}
                </span>
              </div>

              <h2 className="display-md mt-5 max-w-[20ch] text-[32px] text-ink transition-colors group-hover:text-sky-700 md:text-[46px]">
                {featured.title}
              </h2>
              <p className="mt-5 max-w-[68ch] text-[17px] leading-[1.65] text-ink-soft md:text-[18px]">
                {featured.description}
              </p>
            </Link>
          </Container>
        </SectionGround>
      )}

      {/* THE ARCHIVE */}
      <SectionGround variant="pure" size="lg">
        <Container>
          <div className="flex flex-wrap items-baseline justify-between gap-6 border-b pb-5" style={{ borderColor: "var(--paper-line-2)" }}>
            <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">Archive</p>
            <CategoryStrip />
          </div>
          <ul>
            {rest.map((p) => (
              <JournalEntry
                key={p.slug}
                post={{
                  slug: p.slug, title: p.title, description: p.description, date: p.date,
                  category: p.category, readingTime: p.readingTime ?? estimateReadingTime(p.body),
                }}
              />
            ))}
          </ul>
        </Container>
      </SectionGround>

      <LedgerCTA
        headline="Reading about it is the slow way."
        sub="Import a CSV and watch Leadkaun grade your own leads A–F, build each rep a queue, and show the ₹ going cold. Same-day setup, no card."
        secondary={{ label: "See the product", href: "/product" }}
      />

      <Footer />
    </main>
  )
}
