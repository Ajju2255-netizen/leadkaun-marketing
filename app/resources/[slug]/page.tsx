import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, Check } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"

import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { GatedDownload } from "@/app/components/gated-download"
import { LedgerCTA } from "@/app/components/ledger"
import { MEASURE } from "@/app/components/reading"

import { getResources } from "@/lib/pseo/lookup"
import { breadcrumbListSchema, jsonLdScript, canonical } from "@/lib/seo"

export const revalidate = 86400

/* An asset page: the thing itself is the product, so the layout is a spec
   sheet plus a get-it panel — format, audience, contents manifest, and the
   download rail pinned alongside rather than buried at the bottom. */

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
    title: `${r.name}, Free ${r.type} | Leadkaun`,
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
    .filter((x): x is ResourceEntry => x !== undefined)
    .slice(0, 3)

  const insideList = r.inside.length > 0
    ? [{
        "@context": "https://schema.org", "@type": "ItemList",
        name: `What's inside ${r.name}`, numberOfItems: r.inside.length,
        itemListElement: r.inside.map((i, n) => ({ "@type": "ListItem", position: n + 1, name: i })),
      }]
    : []
  const schemas = [
    ...insideList,
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

        <SectionGround variant="pure" size="sm" ambient={false} className="pt-28 md:pt-32">
          <Container>
            <nav aria-label="Breadcrumb" className="ledger-num text-[11px] uppercase tracking-[0.16em] text-ink-muted">
              <Link href="/resources" className="hover:text-sky-700">Resources</Link>
              <span aria-hidden className="mx-2 text-ink-faint">/</span>
              <span>{typeLabel}</span>
            </nav>

            <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:gap-16">
              <div>
                <h1 className="display-lg text-[34px] text-ink md:text-[50px]">{r.name}</h1>
                <p className="mt-6 max-w-[60ch] text-[18px] leading-[1.6] text-ink-soft md:text-[20px]">{r.tagline}</p>

                {/* Asset spec */}
                <dl className="mt-9 grid grid-cols-2 gap-px overflow-hidden rounded-2xl sm:grid-cols-3" style={{ background: "var(--paper-line)" }}>
                  <div className="bg-white px-5 py-4">
                    <dt className="ledger-num text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Format</dt>
                    <dd className="mt-1.5 text-[15px] font-semibold text-ink">{typeLabel}</dd>
                  </div>
                  <div className="bg-white px-5 py-4">
                    <dt className="ledger-num text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Built for</dt>
                    <dd className="mt-1.5 text-[15px] font-semibold text-ink">{prettyPersona(r.audiencePersona)}</dd>
                  </div>
                  <div className="bg-white px-5 py-4">
                    <dt className="ledger-num text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Cost</dt>
                    <dd className="mt-1.5 text-[15px] font-semibold" style={{ color: r.gated ? "var(--ink)" : "#047857" }}>
                      {r.gated ? "Your email" : "Free, no gate"}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* GET IT */}
              {r.downloadUrl && (
                <aside
                  className="h-fit rounded-2xl bg-[color:var(--paper)] p-6 md:p-7 lg:sticky lg:top-24"
                  style={{ border: "1px solid var(--paper-line)" }}
                >
                  <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">
                    Get the {r.type}
                  </p>
                  <div className="mt-4">
                    {r.gated ? (
                      <GatedDownload downloadUrl={r.downloadUrl} type={r.type} source={r.slug} />
                    ) : (
                      <a
                        href={r.downloadUrl}
                        target={r.downloadUrl.startsWith("/downloads") ? "_blank" : undefined}
                        rel="noreferrer"
                        className="btn-gloss-primary inline-flex items-center gap-2 rounded-xl px-5 py-3 text-[14px] font-semibold"
                        style={{ color: "#FFFFFF" }}
                      >
                        Open the {r.type} <ArrowRight className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                  {r.inside.length > 0 && (
                    <p className="mt-4 text-[12px] leading-[1.5] text-ink-muted">
                      {r.inside.length} things inside. No account needed{r.gated ? ", just an email" : ""}.
                    </p>
                  )}
                </aside>
              )}
            </div>
          </Container>
        </SectionGround>

        {/* WHAT IT IS + CONTENTS MANIFEST */}
        <SectionGround variant="pure" size="md">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:gap-16">
              <div>
                <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
                  What this {r.type} is
                </p>
                <div className="mt-4 space-y-5 text-[17px] leading-[1.75] text-ink-soft md:text-[18px]">
                  {r.description.split("\n\n").map((para, i) => <p key={i}>{para}</p>)}
                </div>

                <p className="mt-10 ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
                  Why it matters
                </p>
                <p className="mt-4 text-[16px] leading-[1.7] text-ink-soft">{r.whyItMatters}</p>
              </div>

              {r.inside.length > 0 && (
                <div>
                  <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">Inside</p>
                  <ul className="mt-4 border-t" style={{ borderColor: "var(--paper-line)" }}>
                    {r.inside.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 py-3" style={{ borderBottom: "1px solid var(--paper-line)" }}>
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2.5} aria-hidden />
                        <span className="text-[14px] leading-[1.55] text-ink">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Container>
        </SectionGround>

        {/* HOW TO RUN IT */}
        {r.howToUse.length > 0 && (
          <SectionGround variant="cream" size="lg">
            <Container>
              <div className="mb-10">
                <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">How to run it</p>
                <h2 className="mt-4 text-[26px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[34px]">
                  {r.howToUse.length} steps, then it&apos;s yours.
                </h2>
              </div>
              <ol className={`border-t ${MEASURE}`} style={{ borderColor: "var(--paper-line-2)" }}>
                {r.howToUse.map((step, i) => (
                  <li
                    key={i}
                    className="grid grid-cols-[40px_minmax(0,1fr)] gap-x-5 py-5"
                    style={{ borderBottom: "1px solid var(--paper-line)" }}
                  >
                    <span className="ledger-num pt-0.5 text-[13px] font-semibold text-sky-700 tabular">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[15px] leading-[1.7] text-ink md:text-[16px]">{step}</p>
                  </li>
                ))}
              </ol>
            </Container>
          </SectionGround>
        )}

        {/* PAIR WITH */}
        {related.length > 0 && (
          <SectionGround variant="pure" size="md">
            <Container>
              <div className="grid gap-12 lg:grid-cols-[minmax(0,168px)_minmax(0,1fr)] lg:gap-x-10">
                <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted lg:pt-1.5">
                  Pair with
                </p>
                <ul className="border-t" style={{ borderColor: "var(--paper-line)" }}>
                  {related.map((r2) => (
                    <li key={r2.slug} style={{ borderBottom: "1px solid var(--paper-line)" }}>
                      <Link href={`/resources/${r2.slug}`} className="group grid gap-x-8 gap-y-1 py-4 md:grid-cols-[minmax(0,260px)_minmax(0,1fr)]">
                        <span>
                          <span className="ledger-num mr-3 text-[9px] uppercase tracking-[0.16em] text-ink-muted">{r2.type}</span>
                          <span className="text-[15px] font-semibold text-ink group-hover:text-sky-700">{r2.name}</span>
                        </span>
                        <span className="line-clamp-2 text-[14px] leading-[1.55] text-ink-soft">{r2.tagline}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Container>
          </SectionGround>
        )}

        <LedgerCTA
          headline="Skip the manual version."
          sub={`Everything this ${r.type} teaches, Leadkaun does automatically the same day: scoring, Priority Queue, Morning Brief, ₹ at risk. No spreadsheet to maintain.`}
          secondary={{ label: "More resources", href: "/resources" }}
        />

        <Footer />
      </main>
    </>
  )
}
