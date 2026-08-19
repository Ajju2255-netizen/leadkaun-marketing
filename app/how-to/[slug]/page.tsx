import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { AlertTriangle, ArrowUpRight } from "lucide-react"

import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"

import { Container } from "@/app/components/container"
import { SectionGround } from "@/app/components/section-ground"
import { Faq } from "@/app/components/faq"
import {
  InlineCta, LedgerCTA,
} from "@/app/components/ledger"
import { MEASURE } from "@/app/components/reading"

import { getHowTo } from "@/lib/pseo/lookup"
import { breadcrumbListSchema, howToSchema, faqPageSchema, jsonLdScript } from "@/lib/seo"

export const revalidate = 604800

/* A procedure card: the spec strip tells you the cost before you commit, the
   prerequisites are a pre-flight list, and the steps run as a timeline rather
   than a stack of cards. */

/**
 * The records are not uniform. Most use `heading` for a step, one uses
 * `title`; `relatedBlog` is variously null, a string or an array; and
 * `timeRequired` mixes ISO durations with plain text like "20 minutes".
 * The types below admit all of it and the helpers normalise — a build-time
 * prerender crash is the alternative.
 */
type Step = { heading?: string; title?: string; body: string; image?: string }
type HowToEntry = {
  slug: string; title: string; tldr: string; why: string
  prerequisites: string[]; steps: Step[]; commonMistakes?: string[]
  faqs: { q: string; a: string }[]; category: string
  relatedFeatures?: string[]; relatedBlog?: string | string[] | null; timeRequired?: string
}

const stepHeading = (s: Step) => s.heading ?? s.title ?? ""

/** Normalise `relatedBlog` to a list of slugs whatever shape it arrived in. */
function blogSlugs(v: HowToEntry["relatedBlog"]): string[] {
  if (!v) return []
  return (Array.isArray(v) ? v : [v]).filter((s): s is string => typeof s === "string" && s.length > 0)
}

export async function generateStaticParams() {
  const list = (await getHowTo()) as HowToEntry[]
  return list.map((h) => ({ slug: h.slug }))
}

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const list = (await getHowTo()) as HowToEntry[]
  const h = list.find((x) => x.slug === slug)
  if (!h) return {}
  return {
    title: h.title,
    description: h.tldr.slice(0, 155),
    alternates: { canonical: `/how-to/${h.slug}` },
  }
}

/**
 * "PT90M" → "90 min", "PT1H30M" → "1 hr 30 min", "P21D" → "21 days".
 * Anything already human-readable ("20 minutes") passes straight through.
 */
function humanDuration(iso?: string): string | null {
  if (typeof iso !== "string" || !iso.trim()) return null
  const s = iso.trim()
  const m = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/.exec(s)
  if (!m) return s // already prose
  const [, d, h, min, sec] = m
  const parts: string[] = []
  if (d) parts.push(`${d} ${d === "1" ? "day" : "days"}`)
  if (h) parts.push(`${h} hr`)
  if (min) parts.push(`${min} min`)
  if (sec) parts.push(`${sec} sec`)
  return parts.length ? parts.join(" ") : s
}

function pretty(slug: string) {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
}

export default async function HowToPage({ params }: Params) {
  const { slug } = await params
  const list = (await getHowTo()) as HowToEntry[]
  const h = list.find((x) => x.slug === slug)
  if (!h) notFound()

  const time = humanDuration(h.timeRequired)
  const spec = [
    ...(time ? [{ k: "Time", v: time }] : []),
    { k: "Steps", v: String(h.steps.length) },
    { k: "You'll need", v: `${h.prerequisites.length} things` },
    { k: "Topic", v: pretty(h.category) },
  ]

  const schemas = [
    breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "How-to", url: "/how-to" }, { name: h.title }]),
    howToSchema({
      name: h.title,
      description: h.tldr,
      totalTime: h.timeRequired,
      steps: h.steps.map((s) => ({ name: stepHeading(s), text: s.body })),
    }),
    faqPageSchema(h.faqs),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(schemas) }} />

      <main className="min-h-screen bg-bg-pure">
        <Navbar />

        <SectionGround variant="pure" size="sm" ambient={false} className="pt-28 md:pt-32">
          <Container>
            <nav aria-label="Breadcrumb" className="ledger-num text-[11px] uppercase tracking-[0.16em] text-ink-muted">
              <Link href="/how-to" className="hover:text-sky-700">How-to</Link>
              <span aria-hidden className="mx-2 text-ink-faint">/</span>
              <span>{pretty(h.category)}</span>
            </nav>

            <h1 className={`display-lg mt-8 text-[36px] text-ink md:text-[54px] ${MEASURE}`}>{h.title}</h1>
            <p className={`mt-6 text-[18px] leading-[1.6] text-ink-soft md:text-[20px] ${MEASURE}`}>{h.tldr}</p>

            {/* SPEC STRIP — what this costs you, before you start */}
            <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl md:grid-cols-4" style={{ background: "var(--paper-line)" }}>
              {spec.map((s) => (
                <div key={s.k} className="bg-white px-5 py-4">
                  <dt className="ledger-num text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">{s.k}</dt>
                  <dd className="mt-1.5 text-[16px] font-semibold text-ink">{s.v}</dd>
                </div>
              ))}
            </dl>
            <InlineCta />
          </Container>
        </SectionGround>

        {/* WHY + PREREQUISITES */}
        <SectionGround variant="pure" size="md">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)] lg:gap-16">
              <div>
                <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">Why bother</p>
                <p className="mt-4 text-[17px] leading-[1.75] text-ink-soft md:text-[18px]">{h.why}</p>
              </div>

              <aside
                className="h-fit rounded-2xl bg-[color:var(--paper)] p-6 md:p-7"
                style={{ border: "1px solid var(--paper-line)" }}
              >
                <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">Before you start</p>
                <ul className="mt-4 space-y-3">
                  {h.prerequisites.map((p, i) => (
                    <li key={i} className="flex items-start gap-3 text-[14px] leading-[1.55] text-ink">
                      <span
                        aria-hidden
                        className="mt-0.5 inline-block h-4 w-4 shrink-0 rounded"
                        style={{ border: "1.5px solid var(--paper-line-2)" }}
                      />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </aside>
            </div>
          </Container>
        </SectionGround>

        {/* THE STEPS — a timeline, not a stack */}
        <SectionGround variant="cream" size="lg">
          <Container>
            <div className="mb-10 md:mb-12">
              <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">The procedure</p>
              <h2 className="mt-4 text-[26px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-[34px]">
                {h.steps.length} steps{time ? `, about ${time}` : ""}.
              </h2>
            </div>

            <ol className="relative">
              {h.steps.map((s, i) => (
                <li key={i} className="relative grid grid-cols-[44px_minmax(0,1fr)] gap-x-5 pb-10 last:pb-0 md:grid-cols-[56px_minmax(0,1fr)] md:gap-x-8">
                  {/* connector */}
                  {i < h.steps.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute left-[21px] top-11 h-[calc(100%-2.75rem)] w-px md:left-[27px]"
                      style={{ background: "var(--paper-line-2)" }}
                    />
                  )}
                  <span
                    className="ledger-num relative z-[1] flex h-11 w-11 items-center justify-center rounded-full bg-white text-[14px] font-semibold text-sky-700 tabular md:h-[54px] md:w-[54px] md:text-[16px]"
                    style={{ border: "1px solid var(--paper-line-2)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="pt-2">
                    <h3 className="text-[19px] font-semibold leading-snug tracking-[-0.01em] text-ink md:text-[21px]">{stepHeading(s)}</h3>
                    <p className={`mt-3 text-[15px] leading-[1.7] text-ink-soft md:text-[16px] ${MEASURE}`}>{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Container>
        </SectionGround>

        {/* COMMON MISTAKES */}
        {h.commonMistakes && h.commonMistakes.length > 0 && (
          <SectionGround variant="pure" size="md">
            <Container>
              <div className="grid gap-12 lg:grid-cols-[minmax(0,168px)_minmax(0,1fr)] lg:gap-x-10">
                <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-500 lg:pt-1.5">
                  Where it goes wrong
                </p>
                <ul className={`border-t ${MEASURE}`} style={{ borderColor: "var(--paper-line)" }}>
                  {h.commonMistakes.map((m, i) => (
                    <li key={i} className="flex items-start gap-3 py-4" style={{ borderBottom: "1px solid var(--paper-line)" }}>
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" aria-hidden />
                      <span className="text-[15px] leading-[1.6] text-ink-soft">{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Container>
          </SectionGround>
        )}

        {/* FAQ */}
        {h.faqs.length > 0 && (
          <SectionGround variant="cream" size="md">
            <Container>
              <div className="grid gap-12 lg:grid-cols-[minmax(0,168px)_minmax(0,1fr)] lg:gap-x-10">
                <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted lg:pt-1.5">
                  Questions
                </p>
                <Faq items={h.faqs} className="!mx-0 !max-w-[68ch]" />
              </div>
            </Container>
          </SectionGround>
        )}

        {/* NEXT */}
        {(h.relatedFeatures?.length || blogSlugs(h.relatedBlog).length > 0) && (
          <SectionGround variant="pure" size="md">
            <Container>
              <div className="grid gap-12 lg:grid-cols-[minmax(0,168px)_minmax(0,1fr)] lg:gap-x-10">
                <p className="ledger-num text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted lg:pt-1.5">Next</p>
                <ul className={`border-t ${MEASURE}`} style={{ borderColor: "var(--paper-line)" }}>
                  {(h.relatedFeatures ?? []).map((f) => (
                    <li key={f} style={{ borderBottom: "1px solid var(--paper-line)" }}>
                      <Link href={`/features/${f}`} className="group flex items-baseline justify-between gap-4 py-3">
                        <span className="text-[15px] text-ink group-hover:text-sky-700">
                          <span className="ledger-num mr-3 text-[9px] uppercase tracking-[0.16em] text-ink-muted">Feature</span>
                          {pretty(f)}
                        </span>
                        <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-ink-faint group-hover:text-sky-700" />
                      </Link>
                    </li>
                  ))}
                  {blogSlugs(h.relatedBlog).map((b) => (
                    <li key={b} style={{ borderBottom: "1px solid var(--paper-line)" }}>
                      <Link href={`/blog/${b}`} className="group flex items-baseline justify-between gap-4 py-3">
                        <span className="text-[15px] text-ink group-hover:text-sky-700">
                          <span className="ledger-num mr-3 text-[9px] uppercase tracking-[0.16em] text-ink-muted">Read</span>
                          {pretty(b)}
                        </span>
                        <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-ink-faint group-hover:text-sky-700" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Container>
          </SectionGround>
        )}

        <LedgerCTA
          headline={time ? `Or have it done in less than ${time}.` : "Or have it done today."}
          sub="Leadkaun ships this as a default: graded leads, a ranked queue per rep, and the morning brief. Import a CSV and it runs the same afternoon."
          secondary={{ label: "More playbooks", href: "/how-to" }}
        />

        <Footer />
      </main>
    </>
  )
}
