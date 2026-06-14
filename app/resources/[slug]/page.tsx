import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Check } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CTABanner from "@/app/components/cta-banner"
import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { DetailHero } from "@/app/components/detail-hero"
import { NumberedTag } from "@/app/components/numbered-tag"
import { FloatingCard } from "@/app/components/floating-card"
import { GlossLink } from "@/app/components/gloss-button"
import { Reveal } from "@/app/components/reveal"

import { getResources } from "@/lib/pseo/lookup"
import { breadcrumbListSchema, jsonLdScript, canonical } from "@/lib/seo"

export const revalidate = 86400

type ResourceEntry = {
  slug: string; name: string
  type: "calculator" | "template" | "guide" | "checklist" | "framework" | "report"
  tagline: string; description: string; inside: string[]; howToUse: string[]
  whyItMatters: string; downloadUrl?: string | null; embedCode?: string | null
  relatedResources?: string[]; relatedFeatures?: string[]; relatedBlog?: string | null
  gated: boolean; audiencePersona: string
}

export async function generateStaticParams() {
  const list = (await getResources()) as ResourceEntry[]
  return list.map((r) => ({ slug: r.slug }))
}

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const list = (await getResources()) as ResourceEntry[]
  const r = list.find((x) => x.slug === slug)
  if (!r) return {}
  return {
    title: `${r.name} — Free ${r.type} | Leadkaun`,
    description: r.tagline.slice(0, 155),
    alternates: { canonical: `/resources/${r.slug}` },
  }
}

function prettyPersona(p: string) {
  return p.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
}

export default async function ResourcePage({ params }: Params) {
  const { slug } = await params
  const list = (await getResources()) as ResourceEntry[]
  const r = list.find((x) => x.slug === slug)
  if (!r) notFound()

  const related = (r.relatedResources ?? [])
    .map((s) => list.find((x) => x.slug === s))
    .filter((e): e is ResourceEntry => e !== undefined)
    .slice(0, 3)

  const schemas = [
    breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "Resources", url: "/resources" }, { name: r.name }]),
    {
      "@context": "https://schema.org", "@type": "CreativeWork",
      name: r.name, description: r.tagline, url: canonical(`/resources/${r.slug}`),
      author: { "@type": "Organization", name: "Leadkaun" }, publisher: { "@type": "Organization", name: "Leadkaun" },
      isAccessibleForFree: !r.gated, learningResourceType: r.type,
    },
  ]

  const typeLabel = r.type.charAt(0).toUpperCase() + r.type.slice(1)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(schemas) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        <DetailHero
          breadcrumb={[{ label: "Resources", href: "/resources" }, { label: typeLabel }]}
          eyebrow={typeLabel}
          badges={
            <>
              <span className="inline-flex items-center rounded-full glass-1 gloss-edge px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
                For {prettyPersona(r.audiencePersona)}
              </span>
              {!r.gated && (
                <span
                  className="inline-flex items-center rounded-full px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white"
                  style={{
                    background: "linear-gradient(180deg, #6EE7B7 0%, #34D399 100%)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(16,185,129,0.30)",
                  }}
                >Free · No gate</span>
              )}
            </>
          }
          h1={r.name}
          sub={r.tagline}
          cta={r.downloadUrl ? (
            <GlossLink variant="primary" size="md" href={r.downloadUrl} target="_blank" rel="noreferrer">
              Open the {r.type}
              <span className="font-mono opacity-80">→</span>
            </GlossLink>
          ) : undefined}
        />

        {/* OVERVIEW */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <Reveal className="mx-auto max-w-3xl">
              <NumberedTag number="01" tone="warm" label="Overview" />
              <h2 className="mt-5 text-[28px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[32px]">
                What this {r.type} is.
              </h2>
              <div className="prose prose-leadkaun mt-8 max-w-none">
                {r.description.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </Reveal>
          </Container>
        </SectionGround>

        {/* INSIDE */}
        {r.inside.length > 0 && (
          <SectionGround variant="sky" size="md">
            <Container>
              <Reveal className="mx-auto max-w-3xl">
                <NumberedTag number="02" label="What's inside" />
                <h2 className="mt-5 text-[26px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[30px]">
                  Everything you&apos;ll get.
                </h2>
                <FloatingCard tier="3" depth="3" gloss className="mt-8 overflow-hidden">
                  <ul className="divide-y" style={{ borderColor: "var(--hairline)" }}>
                    {r.inside.map((item, i) => (
                      <li key={i} className="flex items-start gap-4 px-7 py-4 md:px-8">
                        <span
                          className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                          style={{
                            background: "linear-gradient(180deg, #6EE7B7 0%, #34D399 100%)",
                            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), 0 1px 3px rgba(16,185,129,0.30)",
                          }}
                        >
                          <Check className="h-3 w-3 text-white" strokeWidth={3} />
                        </span>
                        <span className="text-[15px] leading-[1.6] text-ink">{item}</span>
                      </li>
                    ))}
                  </ul>
                </FloatingCard>
              </Reveal>
            </Container>
          </SectionGround>
        )}

        {/* HOW TO USE */}
        {r.howToUse.length > 0 && (
          <SectionGround variant="cream" size="md">
            <Container>
              <Reveal className="mx-auto max-w-3xl">
                <NumberedTag number="03" tone="warm" label="How to use it" />
                <h2 className="mt-5 text-[26px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[30px]">
                  Run it like this.
                </h2>
                <FloatingCard tier="3" depth="3" gloss className="mt-8 overflow-hidden">
                  <ol className="divide-y" style={{ borderColor: "var(--hairline)" }}>
                    {r.howToUse.map((step, i) => (
                      <li key={i} className="flex items-start gap-5 px-7 py-5 md:px-8">
                        <span
                          className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-xl font-mono text-[13px] font-bold text-white"
                          style={{
                            background: "linear-gradient(180deg, #38BDF8 0%, #0EA5E9 100%)",
                            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(14,165,233,0.30)",
                          }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <p className="text-[15px] leading-[1.65] text-ink">{step}</p>
                      </li>
                    ))}
                  </ol>
                </FloatingCard>
              </Reveal>
            </Container>
          </SectionGround>
        )}

        {/* WHY IT MATTERS */}
        <SectionGround variant="sky" size="md">
          <Container>
            <Reveal>
              <FloatingCard tier="3" depth="3" gloss className="mx-auto max-w-3xl p-8 md:p-10">
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-600">Why it matters</p>
                <p className="mt-4 text-[15px] leading-[1.65] text-ink-soft md:text-[16px]">{r.whyItMatters}</p>
              </FloatingCard>
            </Reveal>
          </Container>
        </SectionGround>

        {/* RELATED */}
        {related.length > 0 && (
          <SectionGround variant="cream" size="md">
            <Container>
              <Reveal className="mb-8">
                <NumberedTag number="04" tone="warm" label="Related resources" />
                <h2 className="mt-5 max-w-3xl text-[24px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink md:text-[28px]">
                  Pair with these.
                </h2>
              </Reveal>
              <Reveal delay={0.08} className="grid gap-4 md:grid-cols-3">
                {related.map((r2) => (
                  <Link key={r2.slug} href={`/resources/${r2.slug}`} className="group rounded-2xl p-5 glass-2 gloss-edge elevate-1 lift aura-sky-hover transition-all">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-600">{r2.type}</p>
                    <p className="mt-2 text-[15px] font-semibold text-ink group-hover:text-sky-600 transition-colors">{r2.name}</p>
                    <p className="mt-2 line-clamp-2 text-[13px] leading-[1.55] text-ink-soft">{r2.tagline}</p>
                  </Link>
                ))}
              </Reveal>
            </Container>
          </SectionGround>
        )}

        <CTABanner
          tag={{ number: "→", label: "Or let Leadkaun run it" }}
          headline="Skip the manual version."
          sub="Everything this resource teaches, Leadkaun automates in 60 minutes — scoring, Priority Queue, Morning Brief, ₹ at risk. No spreadsheet to maintain."
        />
        <Footer />
      </main>
    </>
  )
}
