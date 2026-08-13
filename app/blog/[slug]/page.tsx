import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"

import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { Faq } from "@/app/components/faq"
import { LedgerCTA } from "@/app/components/ledger"
import { MEASURE } from "@/app/components/reading"
import { JournalEntry, categoryColor, formatDate } from "@/app/components/journal"

import { getAllPosts, getPostBySlug, getRelatedPosts, getCategory, estimateReadingTime } from "@/lib/blog"
import { articleSchema, breadcrumbListSchema, faqPageSchema, jsonLdScript } from "@/lib/seo"
import { resolveAuthor } from "@/lib/authors"
import { AuthorCard } from "@/app/components/author-card"

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article", title: post.title, description: post.description,
      publishedTime: post.date, modifiedTime: post.updated ?? post.date,
      ...(post.cover ? { images: [{ url: post.cover, width: 1200, height: 630 }] } : {}),
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.description },
  }
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const category = getCategory(post.category)
  const related = getRelatedPosts(post, 3)
  const readingTime = post.readingTime ?? estimateReadingTime(post.body)
  const author = resolveAuthor(post.author)

  const schemas = [
    articleSchema({
      headline: post.title, description: post.description,
      datePublished: post.date, dateModified: post.updated ?? post.date,
      author: { name: author.name, type: author.type, url: author.url, jobTitle: author.role },
      url: `/blog/${post.slug}`,
      ...(post.cover ? { image: post.cover } : {}),
    }),
    breadcrumbListSchema([
      { name: "Home", url: "/" }, { name: "Blog", url: "/blog" },
      ...(category ? [{ name: category.title, url: `/blog/categories/${category.slug}` }] : []),
      { name: post.title },
    ]),
    ...(post.faqs && post.faqs.length > 0 ? [faqPageSchema(post.faqs)] : []),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(schemas) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        {/* MASTHEAD — a dateline, not a hero */}
        <SectionGround variant="pure" size="sm" ambient={false} className="pt-28 md:pt-32">
          <Container>
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <Link href="/blog" className="ledger-num text-[11px] uppercase tracking-[0.16em] text-ink-muted hover:text-sky-700">
                Journal
              </Link>
              {category && (
                <>
                  <span aria-hidden className="ledger-num text-[10px] text-ink-faint">/</span>
                  <Link
                    href={`/blog/categories/${category.slug}`}
                    className="inline-flex items-center gap-2 text-ink-muted hover:text-sky-700"
                  >
                    <span aria-hidden className="inline-block h-2 w-2 rounded-full" style={{ background: categoryColor(category.slug) }} />
                    <span className="ledger-num text-[11px] uppercase tracking-[0.16em]">{category.title}</span>
                  </Link>
                </>
              )}
            </nav>

            <h1 className={`display-lg mt-8 text-[34px] text-ink md:text-[52px] ${MEASURE}`}>{post.title}</h1>
            <p className={`mt-6 text-[18px] leading-[1.6] text-ink-soft md:text-[20px] ${MEASURE}`}>{post.description}</p>

            {/* Dateline */}
            <p className="ledger-num mt-8 border-t pt-5 text-[11px] uppercase tracking-[0.14em] text-ink-muted" style={{ borderColor: "var(--paper-line)" }}>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span aria-hidden className="mx-2 text-ink-faint">·</span>
              {readingTime}
              <span aria-hidden className="mx-2 text-ink-faint">·</span>
              {author.name}
              {post.updated && (
                <>
                  <span aria-hidden className="mx-2 text-ink-faint">·</span>
                  Updated {formatDate(post.updated)}
                </>
              )}
            </p>
          </Container>
        </SectionGround>

        {/* BODY */}
        <SectionGround variant="pure" size="md">
          <Container>
            <article
              className="prose prose-leadkaun max-w-[68ch]"
              dangerouslySetInnerHTML={{ __html: post.html }}
            />
          </Container>
        </SectionGround>

        {/* BYLINE */}
        <SectionGround variant="pure" size="sm">
          <Container>
            <div className={MEASURE}>
              <AuthorCard author={author} updated={post.updated ? formatDate(post.updated) : undefined} />
            </div>
          </Container>
        </SectionGround>

        {/* FAQ */}
        {post.faqs && post.faqs.length > 0 && (
          <SectionGround variant="cream" size="md">
            <Container>
              <div className="grid gap-12 lg:grid-cols-[minmax(0,168px)_minmax(0,1fr)] lg:gap-x-10">
                <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted lg:pt-1.5">
                  Readers ask
                </p>
                <Faq items={post.faqs} className="!mx-0 !max-w-[68ch]" />
              </div>
            </Container>
          </SectionGround>
        )}

        {/* KEEP READING */}
        {related.length > 0 && (
          <SectionGround variant="pure" size="md">
            <Container>
              <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">Keep reading</p>
              <ul className="mt-6 border-t" style={{ borderColor: "var(--paper-line-2)" }}>
                {related.map((r) => (
                  <JournalEntry
                    key={r.slug}
                    post={{
                      slug: r.slug, title: r.title, description: r.description, date: r.date,
                      category: r.category, readingTime: r.readingTime ?? estimateReadingTime(r.body),
                    }}
                  />
                ))}
              </ul>
            </Container>
          </SectionGround>
        )}

        <LedgerCTA
          headline="See how Leadkaun solves this."
          sub="A–F lead scoring in real time, a Priority Queue your reps actually use, and ₹ at risk surfaced before deals rot. Setup the same day."
          secondary={{ label: "More from the journal", href: "/blog" }}
        />

        <Footer />
      </main>
    </>
  )
}
