import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, ArrowUpRight } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"

import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { Faq } from "@/app/components/faq"
import { LedgerCTA } from "@/app/components/ledger"
import { MEASURE } from "@/app/components/reading"
import { CategoryStrip, JournalEntry, formatDate } from "@/app/components/journal"

import { CATEGORIES, getCategory, getPostsByCategory, estimateReadingTime } from "@/lib/blog"
import { breadcrumbListSchema, faqPageSchema, canonical, jsonLdScript } from "@/lib/seo"
import { APP_URLS } from "@/lib/urls"

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }))
}

type Params = { params: Promise<{ category: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category } = await params
  const cat = getCategory(category)
  if (!cat) return {}
  return {
    title: cat.metaTitle ?? `${cat.title}, Leadkaun Blog`,
    description: cat.metaDescription ?? cat.description,
    alternates: { canonical: `/blog/categories/${cat.slug}` },
    openGraph: {
      title: cat.metaTitle ?? `${cat.title}, Leadkaun Blog`,
      description: cat.metaDescription ?? cat.description,
      url: canonical(`/blog/categories/${cat.slug}`),
      type: "website",
    },
  }
}

export default async function CategoryPage({ params }: Params) {
  const { category } = await params
  const cat = getCategory(category)
  if (!cat) notFound()

  const posts = getPostsByCategory(cat.slug)
  const featured = (cat.featuredSlug && posts.find((p) => p.slug === cat.featuredSlug)) || posts[0] || null
  const rest = posts.filter((p) => p.slug !== featured?.slug)
  const lastUpdated = posts.reduce<string | null>((acc, p) => {
    const d = p.updated ?? p.date
    return !acc || d > acc ? d : acc
  }, null)

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: cat.metaTitle ?? `${cat.title}, Leadkaun Blog`,
      description: cat.metaDescription ?? cat.description,
      url: canonical(`/blog/categories/${cat.slug}`),
    },
    breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "Blog", url: "/blog" }, { name: cat.title }]),
    ...(posts.length > 0
      ? [{
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: posts.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: canonical(`/blog/${p.slug}`),
            name: p.title,
          })),
        }]
      : []),
    ...(cat.faqs && cat.faqs.length > 0 ? [faqPageSchema(cat.faqs)] : []),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(schemas) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        {/* SECTION MASTHEAD — the category is a desk of the journal */}
        <SectionGround variant="pure" size="sm" ambient={false} className="pt-28 md:pt-32">
          <Container>
            <nav aria-label="Breadcrumb" className="ledger-num text-[11px] uppercase tracking-[0.16em] text-ink-muted">
              <Link href="/blog" className="hover:text-sky-700">Journal</Link>
              <span aria-hidden className="mx-2 text-ink-faint">/</span>
              <span>Pillar {cat.pillar}</span>
            </nav>

            <div className="mt-8 flex items-center gap-4">
              <span aria-hidden className="inline-block h-3 w-3 shrink-0 rounded-full" style={{ background: cat.color }} />
              <h1 className="display-lg text-[36px] text-ink md:text-[54px]">{cat.title}</h1>
            </div>

            <p className={`mt-6 text-[18px] leading-[1.6] text-ink-soft md:text-[20px] ${MEASURE}`}>{cat.description}</p>

            <p className="ledger-num mt-7 text-[11px] uppercase tracking-[0.14em] text-ink-muted">
              {posts.length} {posts.length === 1 ? "post" : "posts"}
              {lastUpdated && (
                <>
                  <span aria-hidden className="mx-2 text-ink-faint">·</span>
                  Updated {formatDate(lastUpdated)}
                </>
              )}
            </p>

            {cat.quickAnswer && (
              <div
                className={`mt-9 rounded-2xl bg-[color:var(--paper)] p-6 md:p-8 ${MEASURE}`}
                style={{ border: "1px solid var(--paper-line)", boxShadow: `inset 3px 0 0 ${cat.color}` }}
              >
                <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">Quick answer</p>
                <p className="mt-3 text-[16px] leading-[1.7] text-ink md:text-[17px]">{cat.quickAnswer}</p>
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <a
                href={APP_URLS.register}
                className="btn-gloss-primary inline-flex items-center gap-2 rounded-xl px-5 py-3 text-[14px] font-semibold"
                style={{ color: "#FFFFFF" }}
              >
                Start free <ArrowRight className="h-4 w-4" />
              </a>
              {cat.moneyLinks && cat.moneyLinks.length > 0 && (
                <a href="#compare" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-sky-700 hover:text-sky-600">
                  Compare alternatives <ArrowRight className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </Container>
        </SectionGround>

        {/* THE DESK */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <div className="flex flex-wrap items-baseline justify-between gap-6 border-b pb-5" style={{ borderColor: "var(--paper-line-2)" }}>
              <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">In this pillar</p>
              <CategoryStrip active={cat.slug} />
            </div>

            {featured && (
              <Link href={`/blog/${featured.slug}`} className="group block border-b py-9" style={{ borderColor: "var(--paper-line)" }}>
                <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Cornerstone</p>
                <h2 className="display-md mt-4 max-w-[22ch] text-[28px] text-ink transition-colors group-hover:text-sky-700 md:text-[38px]">
                  {featured.title}
                </h2>
                <p className="mt-4 max-w-[68ch] text-[16px] leading-[1.65] text-ink-soft md:text-[17px]">{featured.description}</p>
                <p className="ledger-num mt-4 text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                  {formatDate(featured.date)} · {featured.readingTime ?? estimateReadingTime(featured.body)}
                </p>
              </Link>
            )}

            {rest.length > 0 && (
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
            )}
          </Container>
        </SectionGround>

        {/* CONVERSION BRIDGE */}
        {cat.moneyLinks && cat.moneyLinks.length > 0 && (
          <SectionGround id="compare" variant="pure" size="md" className="scroll-mt-24">
            <Container>
              <div className="grid gap-12 lg:grid-cols-[minmax(0,168px)_minmax(0,1fr)] lg:gap-x-10">
                <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted lg:pt-1.5">
                  Shopping, not reading?
                </p>
                <ul className="border-t" style={{ borderColor: "var(--paper-line)" }}>
                  {cat.moneyLinks.map((m) => (
                    <li key={m.href} style={{ borderBottom: "1px solid var(--paper-line)" }}>
                      <Link href={m.href} className="group grid gap-x-8 gap-y-1 py-4 md:grid-cols-[minmax(0,300px)_minmax(0,1fr)_auto]">
                        <span className="text-[15px] font-semibold text-ink group-hover:text-sky-700">{m.label}</span>
                        {m.note && <span className="text-[14px] leading-[1.55] text-ink-soft">{m.note}</span>}
                        <ArrowUpRight className="hidden h-4 w-4 shrink-0 self-center text-ink-faint group-hover:text-sky-700 md:block" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Container>
          </SectionGround>
        )}

        {/* FAQ */}
        {cat.faqs && cat.faqs.length > 0 && (
          <SectionGround variant="cream" size="md">
            <Container>
              <div className="grid gap-12 lg:grid-cols-[minmax(0,168px)_minmax(0,1fr)] lg:gap-x-10">
                <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted lg:pt-1.5">
                  On {cat.title.toLowerCase()}
                </p>
                <Faq items={cat.faqs} className="!mx-0 !max-w-[68ch]" />
              </div>
            </Container>
          </SectionGround>
        )}

        <LedgerCTA
          headline={`${cat.title}, running by itself.`}
          sub="A–F lead scoring in real time, a Priority Queue your reps actually use, and ₹ at risk surfaced before deals rot. Setup the same day."
          secondary={{ label: "Back to the journal", href: "/blog" }}
        />

        <Footer />
      </main>
    </>
  )
}
