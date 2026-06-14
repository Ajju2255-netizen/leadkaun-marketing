import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { DetailHero } from "@/app/components/detail-hero"
import { NumberedTag } from "@/app/components/numbered-tag"
import { FloatingCard } from "@/app/components/floating-card"
import { GlossLink, GlossNavLink } from "@/app/components/gloss-button"

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
    title: cat.metaTitle ?? `${cat.title} — Leadkaun Blog`,
    description: cat.metaDescription ?? cat.description,
    alternates: { canonical: `/blog/categories/${cat.slug}` },
    openGraph: {
      title: cat.metaTitle ?? `${cat.title} — Leadkaun Blog`,
      description: cat.metaDescription ?? cat.description,
      url: canonical(`/blog/categories/${cat.slug}`),
      type: "website",
    },
  }
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
}

export default async function CategoryPage({ params }: Params) {
  const { category } = await params
  const cat = getCategory(category)
  if (!cat) notFound()

  const posts = getPostsByCategory(cat.slug)
  const featured = (cat.featuredSlug && posts.find((p) => p.slug === cat.featuredSlug)) || posts[0] || null
  const rest = posts.filter((p) => p.slug !== featured?.slug)
  const otherCategories = CATEGORIES.filter((c) => c.slug !== cat.slug)
  const lastUpdated = posts.reduce<string | null>((acc, p) => {
    const d = p.updated ?? p.date
    return !acc || d > acc ? d : acc
  }, null)

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: cat.metaTitle ?? `${cat.title} — Leadkaun Blog`,
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

        {/* ── Hero — editorial Field-guide header + Quick-Answer (AIO hook) + CTAs ── */}
        <DetailHero
          breadcrumb={[{ label: "Blog", href: "/blog" }, { label: cat.title }]}
          eyebrow={
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: cat.color }} aria-hidden />
              Pillar {cat.pillar}
              {lastUpdated && <span className="text-ink-faint">· Updated {formatDate(lastUpdated)}</span>}
            </span>
          }
          h1={cat.title}
          sub={cat.description}
          tldr={cat.quickAnswer ? { label: "Quick answer", body: cat.quickAnswer, tone: "sky" } : undefined}
          cta={
            <>
              <GlossLink variant="primary" size="lg" href={APP_URLS.register}>
                Start free trial <span className="font-mono opacity-80">→</span>
              </GlossLink>
              {cat.moneyLinks && cat.moneyLinks.length > 0 && (
                <GlossNavLink variant="glass" size="lg" href="#compare">
                  Compare alternatives
                </GlossNavLink>
              )}
            </>
          }
        />

        {/* ── Featured cornerstone + post grid ──────────────────────────────── */}
        <SectionGround variant="pure" size="lg">
          <Container>
            <div className="mb-10">
              <NumberedTag number="01" tone="warm" label={`Articles in ${cat.title}`} />
              <h2 className="mt-5 max-w-3xl text-[28px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[36px]">
                {posts.length === 0
                  ? "New essays ship twice a week."
                  : `${posts.length} ${posts.length === 1 ? "article" : "articles"}, written for Indian B2B teams.`}
              </h2>
            </div>

            {posts.length === 0 ? (
              <FloatingCard tier="3" depth="3" gloss className="mx-auto max-w-2xl p-8 text-center">
                <p className="text-[15px] leading-[1.65] text-ink-soft">
                  Articles in this pillar publish every Tuesday and Thursday.{" "}
                  <Link href="/blog" className="text-sky-600 underline-offset-4 hover:underline">Browse other pillars</Link>{" "}
                  while we draft the next one.
                </p>
              </FloatingCard>
            ) : (
              <div className="space-y-6">
                {/* Featured — asymmetric, larger */}
                {featured && (
                  <Link href={`/blog/${featured.slug}`} className="block">
                    <FloatingCard
                      tier="2"
                      depth="3"
                      gloss
                      interactive
                      aura="sky"
                      className="flex flex-col gap-5 p-7 md:p-9"
                    >
                      <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: cat.color }}>
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: cat.color }} aria-hidden />
                        Start here
                      </div>
                      <h3 className="max-w-3xl text-[24px] font-semibold leading-[1.2] tracking-[-0.02em] text-ink md:text-[30px]">
                        {featured.title}
                      </h3>
                      <p className="max-w-2xl text-[15px] leading-[1.65] text-ink-soft md:text-[16px]">
                        {featured.description}
                      </p>
                      <div className="flex items-center gap-3 font-mono text-[11px] font-semibold uppercase tracking-[0.10em] text-ink-muted">
                        <span>{formatDate(featured.date)}</span>
                        <span className="text-ink-faint">·</span>
                        <span>{featured.readingTime ?? estimateReadingTime(featured.body)}</span>
                      </div>
                    </FloatingCard>
                  </Link>
                )}

                {/* The rest — 2-up grid */}
                {rest.length > 0 && (
                  <div className="grid gap-5 md:grid-cols-2 md:gap-6">
                    {rest.map((p, i) => (
                      <Link key={p.slug} href={`/blog/${p.slug}`} className="block">
                        <FloatingCard tier="2" depth="2" gloss interactive aura={i % 2 === 1 ? "peach" : "sky"} className="flex h-full flex-col justify-between gap-6 p-6 md:p-7">
                          <div>
                            <h3 className="text-[18px] font-semibold leading-[1.3] tracking-[-0.015em] text-ink">{p.title}</h3>
                            <p className="mt-2 line-clamp-3 text-[14px] leading-[1.6] text-ink-soft">{p.description}</p>
                          </div>
                          <div className="flex items-center justify-between font-mono text-[11px] font-semibold uppercase tracking-[0.10em] text-ink-muted">
                            <span>{formatDate(p.date)}</span>
                            <span>{p.readingTime ?? estimateReadingTime(p.body)}</span>
                          </div>
                        </FloatingCard>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Container>
        </SectionGround>

        {/* ── Decision strip → /compare money pages (the conversion bridge) ──── */}
        {cat.moneyLinks && cat.moneyLinks.length > 0 && (
          <SectionGround variant="cream" size="lg" id="compare">
            <Container>
              <div className="mb-8 max-w-3xl">
                <NumberedTag number="02" tone="warm" label="Compare, by job-to-be-done" />
                <h2 className="mt-5 text-[24px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink md:text-[30px]">
                  Already on a CRM? See exactly where Leadkaun fits — and where it doesn&apos;t.
                </h2>
                <p className="mt-3 text-[15px] leading-[1.6] text-ink-soft">
                  Leadkaun is a Sales Behaviour OS, not a like-for-like CRM. These honest side-by-sides show when to switch, when to run it alongside, and when to stay put.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cat.moneyLinks.map((m) => (
                  <Link key={m.href} href={m.href} className="block">
                    <FloatingCard tier="3" depth="2" gloss interactive aura="peach" className="flex h-full flex-col gap-2 p-5 md:p-6">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-ink">{m.label}</h3>
                        <span className="font-mono text-[13px] text-sky-600" aria-hidden>→</span>
                      </div>
                      {m.note && <p className="text-[13px] leading-[1.55] text-ink-soft">{m.note}</p>}
                    </FloatingCard>
                  </Link>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <GlossLink variant="primary" size="md" href={APP_URLS.register}>
                  Start free trial <span className="font-mono opacity-80">→</span>
                </GlossLink>
                <GlossNavLink variant="warm" size="md" href="/demo">Book a 15-min demo</GlossNavLink>
                <GlossNavLink variant="glass" size="md" href="/pricing">See pricing</GlossNavLink>
              </div>
            </Container>
          </SectionGround>
        )}

        {/* ── Category FAQ (also FAQPage JSON-LD) ───────────────────────────── */}
        {cat.faqs && cat.faqs.length > 0 && (
          <SectionGround variant="sky" size="lg">
            <Container>
              <div className="mb-8 max-w-3xl">
                <NumberedTag number="03" label="Common questions" />
                <h2 className="mt-5 text-[24px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink md:text-[30px]">
                  {cat.title} — the questions buyers actually ask.
                </h2>
              </div>
              <div className="mx-auto max-w-3xl space-y-3">
                {cat.faqs.map((f, i) => (
                  <details key={i} className="group rounded-2xl glass-2 gloss-edge p-5 md:p-6">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold tracking-[-0.01em] text-ink md:text-[16px]">
                      {f.q}
                      <span className="font-mono text-[18px] leading-none text-sky-600 transition-transform group-open:rotate-45" aria-hidden>+</span>
                    </summary>
                    <p className="mt-3 text-[14px] leading-[1.65] text-ink-soft md:text-[15px]">{f.a}</p>
                  </details>
                ))}
              </div>
            </Container>
          </SectionGround>
        )}

        {/* ── Other pillars ─────────────────────────────────────────────────── */}
        {otherCategories.length > 0 && (
          <SectionGround variant="pure" size="md">
            <Container>
              <div className="mb-8">
                <NumberedTag number="04" label="Other pillars" />
                <h2 className="mt-5 max-w-3xl text-[24px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink md:text-[28px]">
                  Browse a different topic.
                </h2>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {otherCategories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/blog/categories/${c.slug}`}
                    className="inline-flex items-center gap-2 rounded-full glass-1 gloss-edge px-4 py-2 text-[13px] font-medium text-ink-soft transition-all hover:text-sky-600 lift"
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: c.color }} aria-hidden />
                    {c.title}
                  </Link>
                ))}
              </div>
            </Container>
          </SectionGround>
        )}

        <CTABanner />
        <Footer />
      </main>
    </>
  )
}
