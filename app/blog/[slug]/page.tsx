import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowUpRight } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
import { ProductBlock } from "@/app/components/sell/blocks"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { DetailHero } from "@/app/components/detail-hero"
import { NumberedTag } from "@/app/components/numbered-tag"
import { FloatingCard } from "@/app/components/floating-card"
import { Faq } from "@/app/components/faq"
import { Reveal } from "@/app/components/reveal"

import { getAllPosts, getPostBySlug, getRelatedPosts, getCategory, estimateReadingTime } from "@/lib/blog"
import { articleSchema, breadcrumbListSchema, faqPageSchema, jsonLdScript } from "@/lib/seo"

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

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const category = getCategory(post.category)
  const related = getRelatedPosts(post, 3)
  const readingTime = post.readingTime ?? estimateReadingTime(post.body)

  const schemas = [
    articleSchema({
      headline: post.title, description: post.description,
      datePublished: post.date, dateModified: post.updated ?? post.date,
      author: post.author ?? "Leadkaun", url: `/blog/${post.slug}`,
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

        <DetailHero
          breadcrumb={[
            { label: "Blog", href: "/blog" },
            ...(category ? [{ label: category.title, href: `/blog/categories/${category.slug}` }] : []),
          ]}
          eyebrow={category?.title ?? "Article"}
          h1={post.title}
          sub={post.description}
          cta={
            <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
              {formatDate(post.date)} · {readingTime} · {post.author ?? "Leadkaun editorial"}
            </p>
          }
        />

        {/* BODY */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal>
              <article
                className="prose prose-leadkaun mx-auto max-w-3xl"
                dangerouslySetInnerHTML={{ __html: post.html }}
              />
            </Reveal>
          </Container>
        </SectionGround>

        {/* FAQ */}
        {post.faqs && post.faqs.length > 0 && (
          <SectionGround variant="sky" size="md">
            <Container>
              <Reveal className="mx-auto max-w-3xl">
                <NumberedTag number="FAQ" label={`On ${category?.title ?? "this topic"}`} />
                <h2 className="mt-5 text-[28px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[32px]">
                  Questions readers ask.
                </h2>
                <div className="mt-8"><Faq items={post.faqs} /></div>
              </Reveal>
            </Container>
          </SectionGround>
        )}

        {/* RELATED */}
        {related.length > 0 && (
          <SectionGround variant="cream" size="md">
            <Container>
              <Reveal className="mb-8">
                <NumberedTag number="•" tone="warm" label="Keep reading" />
                <h2 className="mt-5 max-w-3xl text-[24px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink md:text-[30px]">
                  Related essays.
                </h2>
              </Reveal>

              <Reveal delay={0.08} className="grid gap-5 md:grid-cols-3 md:gap-6">
                {related.map((r, i) => {
                  const cat = getCategory(r.category)
                  return (
                    <Link key={r.slug} href={`/blog/${r.slug}`} className="block group">
                      <FloatingCard tier="2" depth="2" gloss interactive aura={i % 2 === 1 ? "peach" : "sky"} className="flex h-full flex-col justify-between gap-6 p-6">
                        <div>
                          {cat && (
                            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-600">{cat.title}</p>
                          )}
                          <h3 className="mt-3 text-[16px] font-semibold leading-[1.3] tracking-[-0.01em] text-ink transition-colors">{r.title}</h3>
                          <p className="mt-2 line-clamp-3 text-[13px] leading-[1.55] text-ink-soft">{r.description}</p>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-sky-600">
                          Read <ArrowUpRight className="h-3.5 w-3.5" />
                        </span>
                      </FloatingCard>
                    </Link>
                  )
                })}
              </Reveal>
            </Container>
          </SectionGround>
        )}

        <ProductBlock />

        <CTABanner
          tag={{ number: "→", label: "From reading to shipping" }}
          headline="See how Leadkaun solves this."
          sub="A–F lead scoring in under 500ms, a Priority Queue your reps actually use, and ₹ at risk surfaced before deals rot. Setup in 60 minutes."
        />
        <Footer />
      </main>
    </>
  )
}
